#!/usr/bin/env python3
"""Build national + regional lightning grids for the GAF zoom heatmap.

Aggregates the Weatherzone binned lightning CSV into per-season climatology
grids, then writes:

  {season}.summary.json.gz          — national summary only
  {season}.hours.json.gz            — national 24-hour grids
  {season}/{gafOrPair}.summary.json.gz
  {season}/{gafOrPair}.hours.json.gz

Regional packs are bbox-cropped from the national cube using areas.json so
Regional zoom never downloads the full Australia domain.

Use --from-monolith to split existing {season}.json.gz files without
re-aggregating the CSV.
"""
from __future__ import annotations

import argparse
import gzip
import json
import math
import os
from typing import Any

import numpy as np

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

CELL_DEG = 0.1
# Bin *centers* must match the CSV exactly. The Weatherzone 0.1° file uses
# latitudes on *.x (e.g. -45.3, -45.2, … -6.8) and longitudes on *.x from 94.5.
LAT_MIN, LAT_MAX = -45.3, -6.8
LON_MIN, LON_MAX = 94.5, 173.5
NLAT = int(round((LAT_MAX - LAT_MIN) / CELL_DEG)) + 1
NLON = int(round((LON_MAX - LON_MIN) / CELL_DEG)) + 1

# Must match webapp.backend.main.SEASON_TO_MONTHS
SEASON_TO_MONTHS: dict[str, tuple[int, ...]] = {
    "all": tuple(range(1, 13)),
    "summer": (12, 1, 2),
    "autumn": (3, 4, 5),
    "winter": (6, 7, 8),
    "spring": (9, 10, 11),
    "tropical_wet": (10, 11, 12, 1, 2, 3, 4),
    "tropical_dry": (5, 6, 7, 8, 9),
}

PACK_VERSION = 2


def grid_to_lists(grid: np.ndarray) -> list[list[int]]:
    return grid.astype(int).tolist()


def write_gz_json(path: str, payload: object) -> None:
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    raw = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    with gzip.open(path, "wb", compresslevel=9) as handle:
        handle.write(raw)


def load_gz_json(path: str) -> Any:
    with gzip.open(path, "rb") as handle:
        return json.loads(handle.read().decode("utf-8"))


def aggregate_csv(csv_path: str) -> np.ndarray:
    """Return an int64 cube of shape (12 months, 24 hours, NLAT, NLON)."""
    import polars as pl

    lf = pl.scan_csv(
        csv_path,
        schema_overrides={
            "BINNED_LAT": pl.Float64,
            "BINNED_LON": pl.Float64,
            "BINNED_HOUR": pl.Utf8,
            "STROKE_COUNT": pl.Float64,
        },
    )
    grouped = (
        lf.select(
            ((pl.col("BINNED_LAT") - LAT_MIN) / CELL_DEG).round(0).cast(pl.Int32).alias("li"),
            ((pl.col("BINNED_LON") - LON_MIN) / CELL_DEG).round(0).cast(pl.Int32).alias("lj"),
            pl.col("BINNED_HOUR").str.slice(5, 2).cast(pl.Int8).alias("month"),
            pl.col("BINNED_HOUR").str.slice(11, 2).cast(pl.Int8).alias("hour"),
            pl.col("STROKE_COUNT").alias("count"),
        )
        .filter(
            (pl.col("li") >= 0)
            & (pl.col("li") < NLAT)
            & (pl.col("lj") >= 0)
            & (pl.col("lj") < NLON)
            & pl.col("month").is_between(1, 12)
            & pl.col("hour").is_between(0, 23)
        )
        .group_by(["month", "hour", "li", "lj"])
        .agg(pl.col("count").sum())
        .collect(engine="streaming")
    )

    cube = np.zeros((12, 24, NLAT, NLON), dtype=np.int64)
    month = grouped["month"].to_numpy().astype(np.int64) - 1
    hour = grouped["hour"].to_numpy().astype(np.int64)
    li = grouped["li"].to_numpy().astype(np.int64)
    lj = grouped["lj"].to_numpy().astype(np.int64)
    count = np.rint(grouped["count"].to_numpy()).astype(np.int64)
    np.add.at(cube, (month, hour, li, lj), count)
    return cube


def crop_indices(
    lat_min: float,
    lon_min: float,
    cell: float,
    nlat: int,
    nlon: int,
    bbox: list[float],
) -> tuple[int, int, int, int]:
    b_lat_min, b_lat_max, b_lon_min, b_lon_max = bbox
    i0 = max(0, int(math.floor((b_lat_min - lat_min) / cell)))
    i1 = min(nlat - 1, int(math.ceil((b_lat_max - lat_min) / cell)))
    j0 = max(0, int(math.floor((b_lon_min - lon_min) / cell)))
    j1 = min(nlon - 1, int(math.ceil((b_lon_max - lon_min) / cell)))
    return i0, i1, j0, j1


def crop_ndarray(grid: np.ndarray, i0: int, i1: int, j0: int, j1: int) -> np.ndarray:
    return grid[i0 : i1 + 1, j0 : j1 + 1].copy()


def crop_payload(
    summary: np.ndarray,
    hours: list[np.ndarray],
    *,
    season: str,
    lat_min: float,
    lon_min: float,
    cell: float,
    bbox: list[float],
    pack_id: str | None,
) -> tuple[dict[str, Any], dict[str, Any]]:
    nlat, nlon = summary.shape
    i0, i1, j0, j1 = crop_indices(lat_min, lon_min, cell, nlat, nlon, bbox)
    cropped_summary = crop_ndarray(summary, i0, i1, j0, j1)
    cropped_hours = [crop_ndarray(hour, i0, i1, j0, j1) for hour in hours]
    new_lat_min = lat_min + i0 * cell
    new_lon_min = lon_min + j0 * cell
    meta = {
        "version": PACK_VERSION,
        "season": season,
        "cell": cell,
        "latMin": new_lat_min,
        "lonMin": new_lon_min,
        "nlat": int(cropped_summary.shape[0]),
        "nlon": int(cropped_summary.shape[1]),
        "pack": pack_id or "region",
    }
    summary_payload = {**meta, "summary": grid_to_lists(cropped_summary)}
    hours_payload = {**meta, "hours": [grid_to_lists(hour) for hour in cropped_hours]}
    return summary_payload, hours_payload


def load_areas(areas_path: str) -> dict[str, Any]:
    with open(areas_path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def regional_targets(areas: dict[str, Any]) -> list[tuple[str, list[float]]]:
    targets: list[tuple[str, list[float]]] = []
    for code, area in (areas.get("areas") or {}).items():
        bbox = area.get("bbox")
        if isinstance(bbox, list) and len(bbox) == 4:
            targets.append((str(code), [float(v) for v in bbox]))
    for pair_id, pair in (areas.get("pairs") or {}).items():
        bbox = pair.get("bbox")
        if isinstance(bbox, list) and len(bbox) == 4:
            targets.append((str(pair_id), [float(v) for v in bbox]))
    return targets


def write_season_packs(
    output_dir: str,
    season: str,
    summary: np.ndarray,
    hours: list[np.ndarray],
    *,
    lat_min: float,
    lon_min: float,
    cell: float,
    targets: list[tuple[str, list[float]]],
    remove_monolith: bool = True,
) -> None:
    national_meta = {
        "version": PACK_VERSION,
        "season": season,
        "cell": cell,
        "latMin": lat_min,
        "lonMin": lon_min,
        "nlat": int(summary.shape[0]),
        "nlon": int(summary.shape[1]),
        "pack": "region",
    }
    national_summary = {**national_meta, "summary": grid_to_lists(summary)}
    national_hours = {**national_meta, "hours": [grid_to_lists(hour) for hour in hours]}

    summary_path = os.path.join(output_dir, f"{season}.summary.json.gz")
    hours_path = os.path.join(output_dir, f"{season}.hours.json.gz")
    write_gz_json(summary_path, national_summary)
    write_gz_json(hours_path, national_hours)
    print(
        f"  {season}/region: summary={os.path.getsize(summary_path)/1024:,.0f} KB "
        f"hours={os.path.getsize(hours_path)/1024:,.0f} KB "
        f"grid={summary.shape[0]}x{summary.shape[1]}"
    )

    season_dir = os.path.join(output_dir, season)
    os.makedirs(season_dir, exist_ok=True)
    for pack_id, bbox in targets:
        pack_summary, pack_hours = crop_payload(
            summary,
            hours,
            season=season,
            lat_min=lat_min,
            lon_min=lon_min,
            cell=cell,
            bbox=bbox,
            pack_id=pack_id,
        )
        s_path = os.path.join(season_dir, f"{pack_id}.summary.json.gz")
        h_path = os.path.join(season_dir, f"{pack_id}.hours.json.gz")
        write_gz_json(s_path, pack_summary)
        write_gz_json(h_path, pack_hours)
        print(
            f"  {season}/{pack_id}: summary={os.path.getsize(s_path)/1024:,.0f} KB "
            f"hours={os.path.getsize(h_path)/1024:,.0f} KB "
            f"grid={pack_summary['nlat']}x{pack_summary['nlon']}"
        )

    if remove_monolith:
        monolith = os.path.join(output_dir, f"{season}.json.gz")
        if os.path.isfile(monolith):
            os.remove(monolith)
            print(f"  removed monolith {monolith}")


def arrays_from_monolith(payload: dict[str, Any]) -> tuple[np.ndarray, list[np.ndarray], float, float, float]:
    summary = np.asarray(payload["summary"], dtype=np.int64)
    hours = [np.asarray(payload["hours"][h], dtype=np.int64) for h in range(24)]
    lat_min = float(payload.get("latMin", LAT_MIN))
    lon_min = float(payload.get("lonMin", LON_MIN))
    cell = float(payload.get("cell", CELL_DEG))
    return summary, hours, lat_min, lon_min, cell


def run_from_monolith(output_dir: str, areas_path: str) -> None:
    areas = load_areas(areas_path)
    targets = regional_targets(areas)
    print(f"Splitting monoliths in {output_dir} ({len(targets)} regional packs)...")
    for season in SEASON_TO_MONTHS:
        monolith = os.path.join(output_dir, f"{season}.json.gz")
        if not os.path.isfile(monolith):
            # Already split? Try reading national summary+hours if present.
            summary_path = os.path.join(output_dir, f"{season}.summary.json.gz")
            hours_path = os.path.join(output_dir, f"{season}.hours.json.gz")
            if not (os.path.isfile(summary_path) and os.path.isfile(hours_path)):
                print(f"  skip {season}: no monolith or split packs")
                continue
            summary_payload = load_gz_json(summary_path)
            hours_payload = load_gz_json(hours_path)
            summary = np.asarray(summary_payload["summary"], dtype=np.int64)
            hours = [np.asarray(hours_payload["hours"][h], dtype=np.int64) for h in range(24)]
            lat_min = float(summary_payload.get("latMin", LAT_MIN))
            lon_min = float(summary_payload.get("lonMin", LON_MIN))
            cell = float(summary_payload.get("cell", CELL_DEG))
            write_season_packs(
                output_dir,
                season,
                summary,
                hours,
                lat_min=lat_min,
                lon_min=lon_min,
                cell=cell,
                targets=targets,
                remove_monolith=False,
            )
            continue
        print(f"Loading {monolith} ...")
        payload = load_gz_json(monolith)
        summary, hours, lat_min, lon_min, cell = arrays_from_monolith(payload)
        write_season_packs(
            output_dir,
            season,
            summary,
            hours,
            lat_min=lat_min,
            lon_min=lon_min,
            cell=cell,
            targets=targets,
            remove_monolith=True,
        )


def run_from_csv(csv_path: str, output_dir: str, areas_path: str) -> None:
    print(f"Aggregating {csv_path} ...")
    print(f"Grid: cell={CELL_DEG}° nlat={NLAT} nlon={NLON}")
    cube = aggregate_csv(csv_path)
    total = int(cube.sum())
    print(f"Total strokes binned: {total:,}")

    areas = load_areas(areas_path)
    targets = regional_targets(areas)
    for season, months in SEASON_TO_MONTHS.items():
        idx = [m - 1 for m in months]
        by_hour = cube[idx].sum(axis=0)  # (24, NLAT, NLON)
        summary = by_hour.sum(axis=0)
        hours = [by_hour[h] for h in range(24)]
        write_season_packs(
            output_dir,
            season,
            summary,
            hours,
            lat_min=LAT_MIN,
            lon_min=LON_MIN,
            cell=CELL_DEG,
            targets=targets,
            remove_monolith=True,
        )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build lightning_gaf season grid bundles.")
    parser.add_argument(
        "--csv",
        default=os.path.join(REPO_ROOT, "full_ltgn_0.1deg_binned.csv"),
        help="Path to the binned Weatherzone lightning CSV.",
    )
    parser.add_argument(
        "--output-dir",
        default=os.path.join(REPO_ROOT, "webapp", "frontend", "data-lite", "lightning_gaf"),
        help="Output directory for season json.gz bundles.",
    )
    parser.add_argument(
        "--areas",
        default=os.path.join(
            REPO_ROOT, "webapp", "frontend", "data-lite", "lightning_gaf", "areas.json"
        ),
        help="Path to areas.json used for regional bbox crops.",
    )
    parser.add_argument(
        "--from-monolith",
        action="store_true",
        help="Split existing {season}.json.gz packs instead of aggregating the CSV.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.from_monolith:
        run_from_monolith(args.output_dir, args.areas)
    else:
        run_from_csv(args.csv, args.output_dir, args.areas)


if __name__ == "__main__":
    main()
