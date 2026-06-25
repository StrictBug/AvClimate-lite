#!/usr/bin/env python3
"""Build lite hourly lightning heatmap grid bundles (season × UTC hour)."""
from __future__ import annotations

import argparse
import gzip
import json
import os
import sys

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

import pandas as pd

from webapp.backend import main as backend


def build_lightning_hourly_grid_map(icao: str) -> dict[str, list[list[int]]]:
    coords = backend.airport_lat_lon(icao)
    if coords is None:
        return {}

    airport_lat, airport_lon = coords
    lightning_df = backend.load_lightning_df(icao)
    if lightning_df.is_empty():
        return {}

    strikes = lightning_df.select(["LTGN_TM", "LAT", "LONG"]).drop_nulls().to_pandas()
    if strikes.empty:
        return {}

    strikes["LTGN_TM"] = pd.to_datetime(strikes["LTGN_TM"], utc=True, errors="coerce")
    strikes = strikes.dropna(subset=["LTGN_TM", "LAT", "LONG"]).copy()
    strikes = strikes[strikes["LTGN_TM"].dt.year >= backend.LIGHTNING_STATS_MIN_YEAR].copy()
    if strikes.empty:
        return {}

    strikes["hour"] = strikes["LTGN_TM"].dt.hour.astype(int)
    strikes["month"] = strikes["LTGN_TM"].dt.month.astype(int)

    extent_km = backend.lightning_heatmap_extent_km(icao)
    radius_km = backend.lightning_heatmap_radius_km(icao)
    grid = backend.LIGHTNING_HEATMAP_GRID
    strikes = backend.strike_offsets_km_from_airport(strikes, airport_lat, airport_lon)
    strikes = backend.filter_strikes_within_radius_km(strikes, airport_lat, airport_lon, radius_km)
    if strikes.empty:
        return {}

    strikes = backend.assign_lightning_strike_grid_indices(strikes, extent_km=extent_km)

    payload: dict[str, list[list[int]]] = {}
    for season, months in backend.SEASON_TO_MONTHS.items():
        season_months = set(months)
        for hour in range(24):
            subset = strikes[(strikes["hour"] == hour) & (strikes["month"].isin(season_months))]
            z = [[0] * grid for _ in range(grid)]
            if not subset.empty:
                grouped = subset.groupby(["grid_i", "grid_j"]).size()
                for (grid_i, grid_j), count in grouped.items():
                    i = int(grid_i)
                    j = int(grid_j)
                    if 0 <= i < grid and 0 <= j < grid:
                        z[j][i] = int(count)
            payload[f"{season}_{hour}"] = z
    return payload


def write_gz_json(path: str, payload: object) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    raw = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    with gzip.open(path, "wb") as handle:
        handle.write(raw)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build lightning_heatmap_hourly.json.gz lite bundles.")
    parser.add_argument("--icao", action="append", default=[], help="ICAO code (repeatable).")
    parser.add_argument(
        "--output-root",
        default=os.path.join(REPO_ROOT, "webapp", "frontend", "data-lite"),
        help="Lite data root directory.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    icaos = [str(code).strip().upper() for code in args.icao if str(code).strip()]
    if not icaos:
        icaos = backend.available_airports()
    if not icaos:
        raise SystemExit("No airports found.")

    for idx, icao in enumerate(icaos, start=1):
        grids = build_lightning_hourly_grid_map(icao)
        out_path = os.path.join(args.output_root, icao, "lightning_heatmap_hourly.json.gz")
        envelope = {
            "version": 1,
            "icao": icao,
            "grid": backend.LIGHTNING_HEATMAP_GRID,
            "grids": grids,
        }
        write_gz_json(out_path, envelope)
        nonempty = sum(1 for grid in grids.values() if any(any(row) for row in grid))
        print(f"[{idx}/{len(icaos)}] {icao}: wrote {out_path} ({len(grids)} keys, {nonempty} non-empty)")


if __name__ == "__main__":
    main()
