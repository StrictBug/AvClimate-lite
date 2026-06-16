#!/usr/bin/env python3
"""Precompute per-airport METAR/SPECI date ranges and hourly coverage for the lite frontend."""

from __future__ import annotations

import glob
import json
import os
import sys
from datetime import date, datetime, timezone
from pathlib import Path

import polars as pl

ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT_DIR / "data" / "by_icao"
MANIFEST_PATH = ROOT_DIR / "webapp" / "frontend" / "data-lite" / "manifest.json"
OUTPUT_PATH = ROOT_DIR / "webapp" / "frontend" / "data-lite" / "airport-coverage.json"


def load_manifest_airports() -> list[str]:
    if not MANIFEST_PATH.exists():
        return []
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    airports = manifest.get("airports") or manifest.get("icaos") or []
    return [str(icao).strip().upper() for icao in airports if str(icao).strip()]


def coverage_for_icao(icao: str) -> dict[str, str | float] | None:
    partition_dir = DATA_DIR / f"TARGET_ICAO={icao}"
    if not partition_dir.is_dir():
        return None

    files = sorted(glob.glob(str(partition_dir / "*.parquet")))
    if not files:
        return None

    bounds = (
        pl.scan_parquet(files)
        .select(pl.col("TM_FULL").cast(pl.Datetime).dt.truncate("1h").alias("hour_bucket"))
        .select(
            pl.col("hour_bucket").min().alias("min_hour"),
            pl.col("hour_bucket").max().alias("max_hour"),
            pl.col("hour_bucket").n_unique().alias("hours_with_data"),
        )
        .collect()
    )
    if bounds.is_empty():
        return None

    min_hour = bounds["min_hour"][0]
    max_hour = bounds["max_hour"][0]
    hours_with_data = bounds["hours_with_data"][0]
    if min_hour is None or max_hour is None or hours_with_data is None:
        return None

    metar_start = pd_timestamp_to_date(min_hour)
    metar_end = pd_timestamp_to_date(max_hour)
    if metar_start is None or metar_end is None:
        return None

    expected_days = (metar_end - metar_start).days + 1
    expected_hours = expected_days * 24
    if expected_hours <= 0:
        return None

    return {
        "metarStart": metar_start.isoformat(),
        "metarEnd": metar_end.isoformat(),
        "metarCoveragePct": round(100.0 * int(hours_with_data) / expected_hours, 1),
    }


def pd_timestamp_to_date(value: object) -> date | None:
    if value is None:
        return None
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, datetime):
        return value.date()
    if hasattr(value, "date"):
        return value.date()
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).date()
        except ValueError:
            return None
    return None


def discover_icao_dirs() -> list[str]:
    if not DATA_DIR.is_dir():
        return []
    return sorted(
        entry.name.split("=", 1)[1]
        for entry in DATA_DIR.iterdir()
        if entry.is_dir() and entry.name.startswith("TARGET_ICAO=")
    )


def main() -> int:
    manifest_airports = load_manifest_airports()
    icao_list = manifest_airports or discover_icao_dirs()
    if not icao_list:
        print("No airports found in manifest or data/by_icao", file=sys.stderr)
        return 1

    airports: dict[str, dict[str, str | float]] = {}
    missing: list[str] = []

    for icao in icao_list:
        coverage = coverage_for_icao(icao)
        if coverage is None:
            missing.append(icao)
            continue
        airports[icao] = coverage

    if missing:
        print("Missing coverage for airports:", ", ".join(missing), file=sys.stderr)
        return 1

    payload = {
        "version": 3,
        "generatedAt": datetime.now(timezone.utc).date().isoformat(),
        "airports": airports,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")

    print(f"Wrote {OUTPUT_PATH} ({len(airports)} airports)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
