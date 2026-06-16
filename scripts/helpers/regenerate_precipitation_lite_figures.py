#!/usr/bin/env python3
"""Regenerate precipitation section lite shards with all four figures."""

from __future__ import annotations

import argparse
import gzip
import json
import os
import sys
import tempfile
from typing import Any

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from webapp.backend import main as backend

SEASONS = ["all", "summer", "autumn", "winter", "spring", "tropical_wet", "tropical_dry"]
YEAR_START = 2000
YEAR_END = 2025
FIGURE_ORDER = ["monthly_precip", "precip_split", "hourly_precip", "lightning_heatmap"]

SEASON_MONTH_RANGE: dict[str, tuple[int, int, bool]] = {
    "all": (1, 12, False),
    "summer": (2, 12, True),
    "autumn": (3, 5, False),
    "winter": (6, 8, False),
    "spring": (9, 11, False),
    "tropical_wet": (4, 10, True),
    "tropical_dry": (5, 9, False),
}


def month_numbers_for_season(season: str) -> list[int]:
    month_start, month_end, invert = SEASON_MONTH_RANGE.get(season, (1, 12, False))
    return backend.selected_month_numbers(month_start, month_end, invert)


def write_json_gz_atomic(path: str, payload: object) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(prefix="lite_precip_", suffix=".json.gz", dir=os.path.dirname(path))
    try:
        with os.fdopen(fd, "wb") as raw:
            with gzip.GzipFile(fileobj=raw, mode="wb", compresslevel=6, mtime=0) as gz:
                gz.write(json.dumps(payload, separators=(",", ":"), ensure_ascii=True).encode("utf-8"))
        os.replace(tmp_path, path)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def strip_lite_topo_images(fig: Any) -> None:
    """Lite shards inject topo.png client-side; omit embedded base64 backgrounds."""
    layout = getattr(fig, "layout", None)
    if layout is None:
        return
    images = layout.images
    if images:
        fig.update_layout(images=[])


def prepare_lite_topo_figure(fig: Any, figure_id: str) -> None:
    if figure_id in backend.TOPO_MAP_FIGURE_IDS:
        strip_lite_topo_images(fig)
        backend.apply_topo_map_panel_layout(
            fig,
            figure_id,
            cartesian=figure_id == "lightning_heatmap",
        )


def build_precipitation_section_payload(icao: str, season: str) -> dict[str, Any] | None:
    month_numbers = month_numbers_for_season(season)
    built = backend.build_precipitation_figures_from_precomputed(
        icao,
        month_numbers=month_numbers,
        season=season,
        year_start=YEAR_START,
        year_end=YEAR_END,
        enso="all",
        iod="all",
        sam="all",
        mjo="all",
    )
    if not built:
        return None

    figures: list[dict[str, Any]] = []
    for figure_id in FIGURE_ORDER:
        fig = built.get(figure_id)
        if fig is None:
            fig = backend.build_placeholder_figure(
                {
                    "monthly_precip": "Monthly Rain/Thunderstorm Days",
                    "precip_split": "Conditional P(VSBY < threshold | Precipitation) by Direction",
                    "hourly_precip": "Hourly Rain Observations",
                    "lightning_heatmap": "Lightning Strike Frequency Near Aerodrome",
                }[figure_id],
            )
        backend.apply_common_layout(fig)
        if figure_id == "monthly_precip":
            backend.apply_grouped_bar_stable_layout(fig)
        elif figure_id == "hourly_precip":
            backend.apply_grouped_bar_stable_layout(fig)
            backend.apply_hourly_precip_dual_axis_layout(fig)
        if figure_id in {"precip_split", "lightning_heatmap"}:
            prepare_lite_topo_figure(fig, figure_id)
        figures.append(backend.fig_payload(figure_id, fig))

    return {
        "section": "precipitation",
        "figures": figures,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Regenerate precipitation lite section shards.")
    parser.add_argument("--icao", action="append", default=[], help="Only this ICAO (repeatable)")
    parser.add_argument(
        "--output-dir",
        default=os.path.join(REPO_ROOT, "webapp", "frontend", "data-lite"),
        help="Lite data root",
    )
    parser.add_argument("--season", action="append", default=[], help="Only this season (repeatable)")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    seasons = args.season or SEASONS
    icaos = args.icao or [
        entry.strip().upper()
        for entry in os.listdir(args.output_dir)
        if os.path.isdir(os.path.join(args.output_dir, entry)) and len(entry) == 4
    ]

    written = 0
    for icao in icaos:
        for season in seasons:
            payload = build_precipitation_section_payload(icao, season)
            if payload is None:
                print(f"skip {icao}/{season}: no precomputed precipitation payload")
                continue
            path = os.path.join(args.output_dir, icao, "precipitation", f"{season}.json.gz")
            write_json_gz_atomic(path, payload)
            written += 1
            print(f"wrote {path}")

    print(f"Done. Wrote {written} shard(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
