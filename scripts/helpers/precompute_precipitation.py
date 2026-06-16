#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile
import time

import pandas as pd

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from webapp.backend import main as backend

PRECIP_COLUMNS = (
    "year",
    "month",
    "hour",
    "TM_FULL",
    "WND_DIR",
    "VSBY",
    "AWS_VSBY",
    "PRCP_10",
    "PRCP_FM_09",
    "PRST_WX_DSC_1",
    "PRST_WX_PHENOM_1",
    "PRST_WX_DSC_2",
    "PRST_WX_PHENOM_2",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Precompute precipitation section monthly and split figures by airport and climate state.")
    parser.add_argument(
        "--icao",
        action="append",
        default=[],
        help="Only precompute this ICAO (repeat flag for multiple airports). Default: all available airports.",
    )
    parser.add_argument(
        "--output-dir",
        default=backend.PRECIPITATION_PRECOMPUTED_DIR,
        help="Output directory for per-airport JSON artifacts (default: statistics/precomputed/precipitation)",
    )
    return parser.parse_args()


def write_json_atomic(path: str, payload: object) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(prefix="precipitation_", suffix=".json", dir=os.path.dirname(path))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(payload, handle, indent=2, sort_keys=True)
        os.replace(tmp_path, path)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def _prepare_climate_df() -> pd.DataFrame:
    climate_df = backend.get_climate_df().to_pandas()
    if climate_df.empty:
        return pd.DataFrame(columns=["year", "month", "day", "enso_norm", "iod_norm", "sam_norm", "mjo_norm"])

    climate = climate_df[["year", "month", "day", "enso_norm", "iod_norm", "sam_norm", "mjo_norm"]].copy()
    climate["year"] = pd.to_numeric(climate["year"], errors="coerce")
    climate["month"] = pd.to_numeric(climate["month"], errors="coerce")
    climate["day"] = pd.to_numeric(climate["day"], errors="coerce")
    climate = climate.dropna(subset=["year", "month", "day"])
    if climate.empty:
        return pd.DataFrame(columns=["year", "month", "day", "enso_norm", "iod_norm", "sam_norm", "mjo_norm"])

    climate[["year", "month", "day"]] = climate[["year", "month", "day"]].astype(int)
    for col in ("enso_norm", "iod_norm", "sam_norm", "mjo_norm"):
        climate[col] = climate[col].fillna("").astype(str).str.strip().str.lower()
    return climate


def _monthly_rows_for_state(df_state: pd.DataFrame, icao: str, state: dict[str, str]) -> list[dict[str, object]]:
    _, daily_flags = backend.compute_daily_weather_flags(df_state, icao)
    if daily_flags.empty:
        return []

    monthly_counts = (
        daily_flags.groupby(["bom_year", "bom_month"], as_index=False)
        .agg(
            Rain=("Rain", "sum"),
            Thunderstorm=("Thunderstorm", "sum"),
        )
        .sort_values(["bom_year", "bom_month"])
    )

    rows: list[dict[str, object]] = []
    for row in monthly_counts.to_dict(orient="records"):
        rows.append(
            {
                "bom_year": int(row["bom_year"]),
                "bom_month": int(row["bom_month"]),
                "enso_norm": state["enso_norm"],
                "iod_norm": state["iod_norm"],
                "sam_norm": state["sam_norm"],
                "mjo_norm": state["mjo_norm"],
                "Rain": float(row["Rain"]),
                "Thunderstorm": float(row["Thunderstorm"]),
            }
        )
    return rows


def _hourly_count_rows_from_obs_counts(
    rain_counts: pd.DataFrame,
    strike_hourly: pd.DataFrame,
    state: dict[str, str],
) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    if not rain_counts.empty:
        for row in rain_counts.to_dict(orient="records"):
            rows.append(
                {
                    "year": int(row["year"]),
                    "month": int(row["month"]),
                    "hour": int(row["hour"]),
                    "enso_norm": state["enso_norm"],
                    "iod_norm": state["iod_norm"],
                    "sam_norm": state["sam_norm"],
                    "mjo_norm": state["mjo_norm"],
                    "Type": "Rain",
                    "Count": float(row["Count"]),
                }
            )

    if not strike_hourly.empty:
        thunder_counts = backend.hourly_thunder_hour_counts(strike_hourly)
        for row in thunder_counts.to_dict(orient="records"):
            rows.append(
                {
                    "year": int(row["bom_year"]),
                    "month": int(row["bom_month"]),
                    "hour": int(row["hour"]),
                    "enso_norm": state["enso_norm"],
                    "iod_norm": state["iod_norm"],
                    "sam_norm": state["sam_norm"],
                    "mjo_norm": state["mjo_norm"],
                    "Type": backend.HOURLY_THUNDER_HOUR_TYPE,
                    "Count": float(row["Count"]),
                }
            )
    return rows


def _hourly_rows_for_state(
    precip_df: pd.DataFrame,
    strike_hourly: pd.DataFrame,
    icao: str,
    state: dict[str, str],
) -> list[dict[str, object]]:
    rain_counts = backend.hourly_precip_rain_observation_counts(precip_df)
    return _hourly_count_rows_from_obs_counts(rain_counts, strike_hourly, state)


def _filter_strike_hourly_for_state(strike_hourly: pd.DataFrame, state_df: pd.DataFrame) -> pd.DataFrame:
    if strike_hourly.empty or state_df.empty:
        return pd.DataFrame(columns=strike_hourly.columns)
    keys = state_df[["year", "month", "day"]].drop_duplicates()
    return strike_hourly.merge(keys, on=["year", "month", "day"], how="inner")


def _split_precip_mask(df: pd.DataFrame) -> pd.Series:
    return backend.precip_split_observation_mask(df)


def _lightning_grid_rows_for_state(strikes: pd.DataFrame, state: dict[str, str]) -> list[dict[str, object]]:
    if strikes.empty:
        return []

    grouped = (
        strikes.groupby(["year", "month", "grid_i", "grid_j"], as_index=False)
        .size()
        .rename(columns={"size": "count"})
    )
    rows: list[dict[str, object]] = []
    for row in grouped.to_dict(orient="records"):
        rows.append(
            {
                "year": int(row["year"]),
                "month": int(row["month"]),
                "enso_norm": state["enso_norm"],
                "iod_norm": state["iod_norm"],
                "sam_norm": state["sam_norm"],
                "mjo_norm": state["mjo_norm"],
                "grid_i": int(row["grid_i"]),
                "grid_j": int(row["grid_j"]),
                "count": float(row["count"]),
            }
        )
    return rows


def build_lightning_grid_rows(icao: str, climate: pd.DataFrame) -> list[dict[str, object]]:
    coords = backend.airport_lat_lon(icao)
    if coords is None:
        return []

    airport_lat, airport_lon = coords
    lightning_df = backend.load_lightning_df(icao)
    if lightning_df.is_empty():
        return []

    strikes = lightning_df.select(["LTGN_TM", "LAT", "LONG"]).drop_nulls().to_pandas()
    if strikes.empty:
        return []

    strikes["LTGN_TM"] = pd.to_datetime(strikes["LTGN_TM"], utc=True, errors="coerce")
    strikes = strikes.dropna(subset=["LTGN_TM", "LAT", "LONG"]).copy()
    if strikes.empty:
        return []

    strikes["year"] = strikes["LTGN_TM"].dt.year.astype(int)
    strikes["month"] = strikes["LTGN_TM"].dt.month.astype(int)
    strikes["day"] = strikes["LTGN_TM"].dt.day.astype(int)
    strikes = strikes[strikes["year"] >= backend.LIGHTNING_STATS_MIN_YEAR].copy()
    if strikes.empty:
        return []

    extent_km = backend.lightning_heatmap_extent_km(icao)
    radius_km = backend.lightning_heatmap_radius_km(icao)
    strikes = backend.strike_offsets_km_from_airport(strikes, airport_lat, airport_lon)
    strikes = backend.filter_strikes_within_radius_km(strikes, airport_lat, airport_lon, radius_km)
    if strikes.empty:
        return []

    strikes = backend.assign_lightning_strike_grid_indices(strikes, extent_km=extent_km)

    rows: list[dict[str, object]] = []
    all_state = {
        "enso_norm": "all",
        "iod_norm": "all",
        "sam_norm": "all",
        "mjo_norm": "all",
    }
    rows.extend(_lightning_grid_rows_for_state(strikes, all_state))

    if climate.empty:
        return rows

    merged = strikes.merge(climate, on=["year", "month", "day"], how="inner")
    if merged.empty:
        return rows

    for state_vals, state_df in merged.groupby(["enso_norm", "iod_norm", "sam_norm", "mjo_norm"], as_index=False):
        state = {
            "enso_norm": str(state_vals[0]),
            "iod_norm": str(state_vals[1]),
            "sam_norm": str(state_vals[2]),
            "mjo_norm": str(state_vals[3]),
        }
        rows.extend(_lightning_grid_rows_for_state(state_df, state))
    return rows


def build_airport_payload(icao: str, climate: pd.DataFrame) -> dict[str, list[dict[str, object]]]:
    airport_df = backend.load_airport_df(icao, PRECIP_COLUMNS)
    strike_hourly = backend.lightning_hourly_strike_counts(icao)

    if airport_df.is_empty():
        lightning_rows = build_lightning_grid_rows(icao, climate)
        if lightning_rows:
            return {"monthly": [], "split": [], "hourly": [], "lightning_grid": lightning_rows}
        return {}

    precip_df = airport_df.select(list(PRECIP_COLUMNS)).to_pandas()
    if precip_df.empty:
        lightning_rows = build_lightning_grid_rows(icao, climate)
        if lightning_rows:
            return {"monthly": [], "split": [], "hourly": [], "lightning_grid": lightning_rows}
        return {}

    precip_df["year"] = pd.to_numeric(precip_df["year"], errors="coerce")
    precip_df["month"] = pd.to_numeric(precip_df["month"], errors="coerce")
    precip_df["TM_FULL"] = pd.to_datetime(precip_df["TM_FULL"], utc=True, errors="coerce")
    precip_df = precip_df.dropna(subset=["year", "month", "TM_FULL"])
    if precip_df.empty:
        lightning_rows = build_lightning_grid_rows(icao, climate)
        if lightning_rows:
            return {"monthly": [], "split": [], "hourly": [], "lightning_grid": lightning_rows}
        return {}

    precip_df[["year", "month"]] = precip_df[["year", "month"]].astype(int)
    precip_df["day"] = precip_df["TM_FULL"].dt.day.astype(int)

    monthly_rows: list[dict[str, object]] = []
    hourly_rows: list[dict[str, object]] = []
    all_state = {
        "enso_norm": "all",
        "iod_norm": "all",
        "sam_norm": "all",
        "mjo_norm": "all",
    }
    monthly_rows.extend(_monthly_rows_for_state(precip_df, icao, all_state))
    hourly_rows.extend(_hourly_rows_for_state(precip_df, strike_hourly, icao, all_state))

    split_rows: list[dict[str, object]] = []
    vis_df = precip_df.copy()
    vis_df["chart_vsby"] = vis_df[["VSBY", "AWS_VSBY"]].apply(pd.to_numeric, errors="coerce").min(axis=1)
    vis_df = vis_df.dropna(subset=["WND_DIR", "chart_vsby"]).copy()
    if not vis_df.empty:
        precip_obs = vis_df[_split_precip_mask(vis_df)].copy()
        if not precip_obs.empty:
            precip_obs["dir_bin_10"] = (((precip_obs["WND_DIR"] + 5) % 360) // 10 * 10).astype(int)

            all_split = (
                precip_obs.groupby(["year", "month", "dir_bin_10"], as_index=False)
                .agg(
                    denom=("chart_vsby", "size"),
                    lt3=("chart_vsby", lambda s: float((s < 3.0).sum())),
                    lt5=("chart_vsby", lambda s: float((s < 5.0).sum())),
                    lt7=("chart_vsby", lambda s: float((s < 7.0).sum())),
                    lt9=("chart_vsby", lambda s: float((s < 9.0).sum())),
                )
            )
            for row in all_split.to_dict(orient="records"):
                split_rows.append(
                    {
                        "year": int(row["year"]),
                        "month": int(row["month"]),
                        "enso_norm": "all",
                        "iod_norm": "all",
                        "sam_norm": "all",
                        "mjo_norm": "all",
                        "dir_bin_10": int(row["dir_bin_10"]),
                        "denom": float(row["denom"]),
                        "lt3": float(row["lt3"]),
                        "lt5": float(row["lt5"]),
                        "lt7": float(row["lt7"]),
                        "lt9": float(row["lt9"]),
                    }
                )

            if not climate.empty:
                merged = precip_df.merge(climate, on=["year", "month", "day"], how="inner")
                merged_split = precip_obs.merge(climate, on=["year", "month", "day"], how="inner")
                if not merged.empty:
                    for state_vals, state_df in merged.groupby(["enso_norm", "iod_norm", "sam_norm", "mjo_norm"], as_index=False):
                        state = {
                            "enso_norm": str(state_vals[0]),
                            "iod_norm": str(state_vals[1]),
                            "sam_norm": str(state_vals[2]),
                            "mjo_norm": str(state_vals[3]),
                        }
                        monthly_rows.extend(_monthly_rows_for_state(state_df, icao, state))
                        state_strikes = _filter_strike_hourly_for_state(strike_hourly, state_df)
                        hourly_rows.extend(_hourly_rows_for_state(state_df, state_strikes, icao, state))

                if not merged_split.empty:
                    grouped = (
                        merged_split.groupby(
                            ["year", "month", "enso_norm", "iod_norm", "sam_norm", "mjo_norm", "dir_bin_10"],
                            as_index=False,
                        )
                        .agg(
                            denom=("chart_vsby", "size"),
                            lt3=("chart_vsby", lambda s: float((s < 3.0).sum())),
                            lt5=("chart_vsby", lambda s: float((s < 5.0).sum())),
                            lt7=("chart_vsby", lambda s: float((s < 7.0).sum())),
                            lt9=("chart_vsby", lambda s: float((s < 9.0).sum())),
                        )
                    )
                    for row in grouped.to_dict(orient="records"):
                        split_rows.append(
                            {
                                "year": int(row["year"]),
                                "month": int(row["month"]),
                                "enso_norm": str(row["enso_norm"]),
                                "iod_norm": str(row["iod_norm"]),
                                "sam_norm": str(row["sam_norm"]),
                                "mjo_norm": str(row["mjo_norm"]),
                                "dir_bin_10": int(row["dir_bin_10"]),
                                "denom": float(row["denom"]),
                                "lt3": float(row["lt3"]),
                                "lt5": float(row["lt5"]),
                                "lt7": float(row["lt7"]),
                                "lt9": float(row["lt9"]),
                            }
                        )

    lightning_rows = build_lightning_grid_rows(icao, climate)

    payload = {
        "monthly": monthly_rows,
        "split": split_rows,
        "hourly": hourly_rows,
        "lightning_grid": lightning_rows,
    }
    if not any(payload.values()):
        return {}
    return payload


def main() -> int:
    args = parse_args()
    if args.icao:
        airports = tuple(sorted(set(args.icao)))
    else:
        airports = backend.available_airports()

    total = len(airports)
    if total == 0:
        print("No airports found; no artifact created.")
        return 1

    climate = _prepare_climate_df()
    started = time.perf_counter()
    output_dir = args.output_dir
    os.makedirs(output_dir, exist_ok=True)
    written = 0

    for idx, icao in enumerate(airports, start=1):
        t0 = time.perf_counter()
        payload = build_airport_payload(icao, climate)
        if payload:
            write_json_atomic(os.path.join(output_dir, f"{icao}.json"), payload)
            written += 1
        elapsed_ms = int((time.perf_counter() - t0) * 1000)
        print(
            f"[{idx}/{total}] {icao}: monthly_rows={len(payload.get('monthly', []))} "
            f"split_rows={len(payload.get('split', []))} "
            f"hourly_rows={len(payload.get('hourly', []))} "
            f"lightning_rows={len(payload.get('lightning_grid', []))} elapsed_ms={elapsed_ms}"
        )

    total_elapsed = int((time.perf_counter() - started) * 1000)
    print(f"Wrote {written} airports to {output_dir} in {total_elapsed} ms")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
