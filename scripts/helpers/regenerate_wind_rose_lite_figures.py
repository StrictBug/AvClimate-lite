#!/usr/bin/env python3
"""Regenerate wind-rose lite shards after speed-bin, colour, or calm-circle changes."""

from __future__ import annotations

import argparse
import gzip
import json
import os
import sys
from typing import Any

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from scripts.helpers.build_critical_locations_lite import (  # noqa: E402
    SEASONS,
    build_wind_rose_hourly,
    charts_payload,
    clear_backend_caches,
    strip_topo_from_figure_payload,
    write_json_gz_atomic,
)
from webapp.backend import main as backend  # noqa: E402

SECTIONS = ("overview", "wind")
MANIFEST_PATH = os.path.join(REPO_ROOT, "webapp", "frontend", "data-lite", "manifest.json")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Regenerate wind-rose lite shards.")
    parser.add_argument("--icao", action="append", default=[], help="Only this ICAO (repeatable)")
    parser.add_argument(
        "--output-dir",
        default=os.path.join(REPO_ROOT, "webapp", "frontend", "data-lite"),
        help="Lite data root",
    )
    parser.add_argument(
        "--skip-hourly",
        action="store_true",
        help="Only patch overview/wind section shards (skip wind_rose_hourly.json.gz)",
    )
    return parser.parse_args()


def manifest_airports() -> tuple[str, ...]:
    if not os.path.exists(MANIFEST_PATH):
        return backend.available_airports()
    with open(MANIFEST_PATH, encoding="utf-8") as handle:
        payload = json.load(handle)
    airports = payload.get("airports") or []
    return tuple(sorted({str(code).strip().upper() for code in airports if str(code).strip()}))


def load_section_payload(path: str) -> dict[str, Any] | None:
    if not os.path.exists(path):
        return None
    with gzip.open(path, "rt", encoding="utf-8") as handle:
        return json.load(handle)


def patch_section_wind_rose(
    *,
    icao: str,
    section: str,
    season: str,
    output_dir: str,
) -> bool:
    path = os.path.join(output_dir, icao, section, f"{season}.json.gz")
    payload = load_section_payload(path)
    if not payload or not isinstance(payload.get("figures"), list):
        return False

    wind_rose_payload = charts_payload(
        section=section,
        icao=icao,
        season=season,
        figure_ids="wind_rose",
    )
    if not wind_rose_payload or not wind_rose_payload.get("figures"):
        return False

    new_entry = wind_rose_payload["figures"][0]
    if new_entry.get("id") != "wind_rose":
        return False

    strip_topo_from_figure_payload(new_entry)
    figures = payload["figures"]
    wind_rose_index = next(
        (index for index, entry in enumerate(figures) if entry.get("id") == "wind_rose"),
        None,
    )
    if wind_rose_index is None:
        return False

    figures[wind_rose_index] = new_entry
    write_json_gz_atomic(path, payload)
    return True


def regenerate_airport(icao: str, output_dir: str, *, skip_hourly: bool) -> tuple[int, int]:
    section_written = 0
    for section in SECTIONS:
        for season in SEASONS:
            if patch_section_wind_rose(icao=icao, section=section, season=season, output_dir=output_dir):
                section_written += 1

    hourly_keys = 0
    if not skip_hourly:
        hourly_keys = build_wind_rose_hourly(icao)
    return section_written, hourly_keys


def main() -> int:
    args = parse_args()
    airports = tuple(sorted(set(args.icao))) if args.icao else manifest_airports()
    if not airports:
        print("No airports found.")
        return 1

    clear_backend_caches()
    total_sections = 0
    total_hourly = 0

    for idx, icao in enumerate(airports, start=1):
        section_written, hourly_keys = regenerate_airport(
            icao,
            args.output_dir,
            skip_hourly=args.skip_hourly,
        )
        total_sections += section_written
        total_hourly += hourly_keys
        hourly_note = f", hourly_keys={hourly_keys}" if not args.skip_hourly else ""
        print(f"[{idx}/{len(airports)}] {icao}: section_shards={section_written}{hourly_note}")

    print(
        f"Patched {total_sections} section shards"
        + (f" and {total_hourly} hourly bundle keys under {args.output_dir}" if not args.skip_hourly else f" under {args.output_dir}")
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
