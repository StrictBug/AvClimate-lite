#!/usr/bin/env python3
"""Regenerate fog/low-cloud lite figure shards after rate-normalization fixes."""

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
DAY_MODES = ["all", "rain", "non_rain"]
FOG_FIGURES = {
    "fog_low_cloud": ("overview", "monthly"),
    "monthly_fog": ("fog_low_cloud", "monthly"),
    "fog_share": ("fog_low_cloud", "hourly"),
}
MODE_KEYS = {
    "monthly": "fogMonthlyMode",
    "hourly": "fogHourlyMode",
}
YEAR_START = 2000
YEAR_END = 2025

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


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Regenerate fog/lite figure shards.")
    parser.add_argument("--icao", action="append", default=[], help="Only this ICAO (repeatable)")
    parser.add_argument(
        "--output-dir",
        default=os.path.join(REPO_ROOT, "webapp", "frontend", "data-lite"),
        help="Lite data root",
    )
    return parser.parse_args()


def stacked_bar_y_max(fig: Any) -> float:
    """Max stacked column height (fog and low-cloud use separate x offsets)."""
    stacks: dict[float, float] = {}
    for trace in fig.data:
        if getattr(trace, "type", None) != "bar":
            continue
        if not getattr(trace, "name", None):
            continue
        for x_val, y_val in zip(trace.x, trace.y):
            x_key = float(x_val)
            stacks[x_key] = stacks.get(x_key, 0.0) + float(y_val or 0.0)
    return max(stacks.values()) if stacks else 0.0


def apply_frequency_y_axis(fig: Any, fig_id: str, y_ceilings: dict[str, float]) -> None:
    if fig_id == "fog_share":
        axis_max = backend._ceil_headroom(stacked_bar_y_max(fig))
        if axis_max > 0:
            fig.update_yaxes(range=[0, axis_max], autorange=False)
        return
    if fig_id in y_ceilings:
        fig.update_yaxes(range=[0, float(y_ceilings[fig_id])], autorange=False)


def write_json_gz_atomic(path: str, payload: object) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(prefix="lite_fog_", suffix=".json.gz", dir=os.path.dirname(path))
    try:
        with os.fdopen(fd, "wb") as raw:
            with gzip.GzipFile(fileobj=raw, mode="wb", compresslevel=6, mtime=0) as gz:
                gz.write(json.dumps(payload, separators=(",", ":"), ensure_ascii=True).encode("utf-8"))
        os.replace(tmp_path, path)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def build_overview_fog_figure(icao: str, season: str, day_mode: str) -> dict[str, Any] | None:
    fig = backend.build_overview_fog_figure_from_precomputed(
        icao,
        fog_mode=day_mode,
        title=f"Fog/Low Cloud Frequency ({day_mode.replace('_', ' ').title()} Days)",
        month_numbers=month_numbers_for_season(season),
        season=season,
        year_start=YEAR_START,
        year_end=YEAR_END,
        enso="all",
        iod="all",
        sam="all",
        mjo="all",
    )
    if fig is None:
        return None
    backend.apply_common_layout(fig)
    backend.apply_frequency_panel_layout(fig)
    y_ceilings = backend.load_precomputed_y_ceilings_for_airport(icao)
    apply_frequency_y_axis(fig, "fog_low_cloud", y_ceilings)
    return backend.fig_payload("fog_low_cloud", fig)


def build_section_fog_figures(icao: str, season: str, day_mode: str) -> dict[str, dict[str, Any]]:
    figures = backend.build_fog_low_cloud_figures_from_precomputed(
        icao,
        requested_figure_ids={"monthly_fog", "fog_share"},
        month_numbers=month_numbers_for_season(season),
        season=season,
        year_start=YEAR_START,
        year_end=YEAR_END,
        enso="all",
        iod="all",
        sam="all",
        mjo="all",
        fog_monthly_mode=day_mode,
        fog_hourly_mode=day_mode,
        fog_wind_mode=day_mode,
        fog_dewpoint_mode=day_mode,
    )
    payloads: dict[str, dict[str, Any]] = {}
    y_ceilings = backend.load_precomputed_y_ceilings_for_airport(icao)
    for fig_id in ("monthly_fog", "fog_share"):
        fig = figures.get(fig_id)
        if fig is None:
            continue
        backend.apply_common_layout(fig)
        backend.apply_frequency_panel_layout(fig)
        apply_frequency_y_axis(fig, fig_id, y_ceilings)
        payloads[fig_id] = backend.fig_payload(fig_id, fig)
    return payloads


def regenerate_airport(icao: str, output_dir: str) -> int:
    written = 0
    for season in SEASONS:
        for day_mode in DAY_MODES:
            overview_payload = build_overview_fog_figure(icao, season, day_mode)
            if overview_payload:
                path = os.path.join(
                    output_dir,
                    icao,
                    "figures",
                    "fog_low_cloud",
                    f"{season}_{day_mode}.json.gz",
                )
                write_json_gz_atomic(path, overview_payload)
                written += 1

            section_payloads = build_section_fog_figures(icao, season, day_mode)
            for fig_id, payload in section_payloads.items():
                path = os.path.join(
                    output_dir,
                    icao,
                    "figures",
                    fig_id,
                    f"{season}_{day_mode}.json.gz",
                )
                write_json_gz_atomic(path, payload)
                written += 1
    return written


def main() -> int:
    args = parse_args()
    airports = tuple(sorted(set(args.icao))) if args.icao else backend.available_airports()
    if not airports:
        print("No airports found.")
        return 1

    total_written = 0
    for idx, icao in enumerate(airports, start=1):
        count = regenerate_airport(icao, args.output_dir)
        total_written += count
        print(f"[{idx}/{len(airports)}] {icao}: wrote {count} fog figure shards")
    print(f"Wrote {total_written} shards under {args.output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
