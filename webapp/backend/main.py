import base64
import ctypes
import gc
import glob
import gzip
import json
import logging
import math
import os
import re
import time
import hashlib
from functools import lru_cache
from io import BytesIO
from typing import Any

import pandas as pd
import numpy as np
import polars as pl
import plotly.express as px
import plotly.graph_objects as go
from timezonefinder import TimezoneFinder
from plotly.utils import PlotlyJSONEncoder
from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from PIL import Image

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

_TILE_CANDIDATES = [
    os.path.join(ROOT_DIR, "tiles"),
    os.path.join(ROOT_DIR, "map tiles"),
]
TILE_DIR = next((p for p in _TILE_CANDIDATES if os.path.isdir(p)), _TILE_CANDIDATES[0])
ZOOM_LEVEL = 9
TOPO_MAP_PANEL = {
    "margin": {"l": 36, "r": 36, "t": 48, "b": 22},
    "plotDomain": {"x": [0.08, 0.92], "y": [0.06, 0.94]},
    "backgroundScale": 1.1,
    "backgroundOpacity": 0.7,
}
TOPO_MAP_FIGURE_IDS = frozenset({
    "wind_rose",
    "precip_split",
    "lightning_heatmap",
    "cloud_distribution",
    "radial_scatter_dust",
})
COORD_FILE = os.path.join(ROOT_DIR, "aerodrome_lat_long.csv")
DATA_FILE = os.path.join(ROOT_DIR, "TAF3.parquet")
SPLIT_DATA_DIR = os.path.join(ROOT_DIR, "data", "by_icao")
CLIMATE_FILE = os.path.join(ROOT_DIR, "climatedrivers.csv")
LIGHTNING_SPLIT_DIR = os.path.join(ROOT_DIR, "data", "lightning_by_icao")
Y_CEILINGS_FILE = os.path.join(ROOT_DIR, "statistics", "y_ceilings_by_icao.json")
OVERVIEW_FOG_MONTHLY_FILE = os.path.join(ROOT_DIR, "statistics", "overview_fog_monthly_by_icao.json")
OVERVIEW_RAIN_THUNDER_MONTHLY_FILE = os.path.join(ROOT_DIR, "statistics", "overview_rain_thunder_monthly_by_icao.json")
OVERVIEW_WIND_ROSE_FILE = os.path.join(ROOT_DIR, "statistics", "overview_wind_rose_by_icao.json")
OVERVIEW_TEMP_DEWPOINT_FILE = os.path.join(ROOT_DIR, "statistics", "overview_temp_dewpoint_by_icao.json")
PRECOMPUTED_DIR = os.path.join(ROOT_DIR, "statistics", "precomputed")
Y_CEILINGS_DIR = os.path.join(PRECOMPUTED_DIR, "y_ceilings")
OVERVIEW_FOG_MONTHLY_DIR = os.path.join(PRECOMPUTED_DIR, "overview_fog_monthly")
OVERVIEW_RAIN_THUNDER_MONTHLY_DIR = os.path.join(PRECOMPUTED_DIR, "overview_rain_thunder_monthly")
OVERVIEW_WIND_ROSE_DIR = os.path.join(PRECOMPUTED_DIR, "overview_wind_rose")
OVERVIEW_TEMP_DEWPOINT_DIR = os.path.join(PRECOMPUTED_DIR, "overview_temp_dewpoint")
PRECIPITATION_PRECOMPUTED_DIR = os.path.join(PRECOMPUTED_DIR, "precipitation")
WIND_GALE_MONTHLY_DIR = os.path.join(PRECOMPUTED_DIR, "wind_gale_monthly")
FOG_LOW_CLOUD_PRECOMPUTED_DIR = os.path.join(PRECOMPUTED_DIR, "fog_low_cloud")
SMOKE_DUST_PRECOMPUTED_DIR = os.path.join(PRECOMPUTED_DIR, "smoke_dust")
LIGHTNING_RADIUS_KM = 8.0
LIGHTNING_WINDOW_MINUTES = 10
LIGHTNING_COVERAGE_START_UTC = pd.Timestamp("2008-02-25T00:00:00Z")
LIGHTNING_STATS_MIN_YEAR = 2009  # Only full-year lightning data from 2009 onwards
PRECIP_CLOUD_VIS_CEIL_STEP = 250
PRECIP_CLOUD_VIS_CEIL_MAX = 2500
PRECIP_CLOUD_VIS_VSBY_STEP = 0.5
PRECIP_CLOUD_VIS_VSBY_MAX = 10.0
PRECIP_CLOUD_VIS_VSBY_STEP_BY_ICAO: dict[str, float] = {
    "YMML": 1.0,
}
PRECIP_CLOUD_VIS_EXCLUDED_CEILING_FT = 480
LIGHTNING_HEATMAP_RADIUS_KM = 30.0
LIGHTNING_HEATMAP_EXTENT_KM = LIGHTNING_HEATMAP_RADIUS_KM * 2.0
LIGHTNING_HEATMAP_GRID = 48
LIGHTNING_HEATMAP_RING_RADII_KM = (8.0, 16.0)
LIGHTNING_HEATMAP_COLOR_PERCENTILE = 95.0
FOG_CLOUD_DISTRIBUTION_MAX_SPEED_BIN = 120
FOG_CLOUD_DISTRIBUTION_MAX_HOVER_POINTS = 4000

# ADAM may merge multiple BoM sites under one TARGET_ICAO. Restrict to airport observations.
AERODROME_STN_FILTERS: dict[str, frozenset[str]] = {
    "YESP": frozenset({"9542"}),  # Esperance Aero (BoM 009542); excludes town AWS 9789 / NTC 109504
}

MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
MONTH_TO_NUM = {m: i + 1 for i, m in enumerate(MONTH_NAMES)}
SEASON_TO_MONTHS = {
    "all": tuple(range(1, 13)),
    "summer": (12, 1, 2),
    "autumn": (3, 4, 5),
    "winter": (6, 7, 8),
    "spring": (9, 10, 11),
    "tropical_wet": (10, 11, 12, 1, 2, 3, 4),
    "tropical_dry": (5, 6, 7, 8, 9),
}

DRIVER_COLUMNS = ["enso", "iod", "sam", "mjo"]
GALE_WEATHER_CATEGORIES = ["No wx", "SHRA", "TS"]
THUNDERSTORM_LEGEND_LABEL = "Thunderstorm"
TS_LEGEND_LABEL = "Thunderstorm"

BASE_CHART_COLUMNS = {"year", "month", "hour", "TM_FULL"}
METRIC_COLUMNS = {"WND_SPD", "MAX_WND_GUST_10", "AIR_TEMP"}
SECTION_REQUIRED_COLUMNS: dict[str, set[str]] = {
    "overview": {
        "WND_DIR", "WND_SPD", "PRCP_FM_09", "PRCP_10",
        "PRST_WX_DSC_1", "PRST_WX_PHENOM_1", "PRST_WX_DSC_2", "PRST_WX_PHENOM_2",
        "AIR_TEMP", "DWPT", "VSBY", "AWS_VSBY",
        "CEIL_CLD_AMT_1", "CEIL_CLD_AMT_2", "CEIL_CLD_HT_1", "CEIL_CLD_HT_2",
    },
    "wind": {
        "WND_DIR", "WND_SPD", "MAX_WND_GUST_10", "PRCP_10",
        "PRST_WX_DSC_1", "PRST_WX_PHENOM_1", "PRST_WX_DSC_2", "PRST_WX_PHENOM_2",
    },
    "precipitation": {
        "WND_DIR", "WND_SPD", "VSBY", "AWS_VSBY", "PRCP_10", "PRCP_FM_09",
        "PRST_WX_DSC_1", "PRST_WX_PHENOM_1", "PRST_WX_DSC_2", "PRST_WX_PHENOM_2",
    },
    "fog_low_cloud": {
        "AIR_TEMP", "DWPT", "VSBY", "AWS_VSBY", "PRCP_10", "PRCP_FM_09",
        "WND_DIR", "WND_SPD",
        "PRST_WX_DSC_1", "PRST_WX_PHENOM_1", "PRST_WX_DSC_2", "PRST_WX_PHENOM_2",
        "CEIL_CLD_AMT_1", "CEIL_CLD_AMT_2", "CEIL_CLD_HT_1", "CEIL_CLD_HT_2",
    },
    "smoke_dust": {
        "PRST_WX_PHENOM_1", "PRST_WX_PHENOM_2", "WND_SPD", "DWPT", "WND_DIR",
    },
}

SECTION_CEILING_KEYS: dict[str, tuple[str, ...]] = {
    "overview": (
        "rain_thunder",
        "temp_dewpoint_y1_min",
        "temp_dewpoint_y1_max",
        "temp_dewpoint_y2",
        "fog_low_cloud",
    ),
    "wind": (
        "gale_weather_split",
    ),
    "precipitation": (
        "monthly_precip",
        "hourly_precip",
        "hourly_precip_y2",
    ),
    "fog_low_cloud": (
        "monthly_fog",
        "fog_share",
        "fog_cloud_joint_min",
        "fog_cloud_joint_max",
    ),
    "smoke_dust": (
        "monthly_smoke",
        "hourly_smoke",
        "scatter_wind_dewpt",
    ),
}

FIGURE_CEILING_KEYS: dict[str, tuple[str, ...]] = {
    "rain_thunder": ("rain_thunder",),
    "temp_dewpoint": ("temp_dewpoint_y1_min", "temp_dewpoint_y1_max", "temp_dewpoint_y2"),
    "fog_low_cloud": ("fog_low_cloud",),
    "gale_weather_split": ("gale_weather_split",),
    "monthly_precip": ("monthly_precip",),
    "hourly_precip": ("hourly_precip", "hourly_precip_y2"),
    "monthly_fog": ("monthly_fog",),
    "fog_share": ("fog_share",),
    "fog_cloud_joint": ("fog_cloud_joint_min", "fog_cloud_joint_max"),
    "monthly_smoke": ("monthly_smoke",),
    "hourly_smoke": ("hourly_smoke",),
    "scatter_wind_dewpt": ("scatter_wind_dewpt",),
}

CEILING_COLUMNS_BY_GROUP: dict[str, tuple[str, ...]] = {
    "rain": (
        "year", "month", "hour", "TM_FULL", "PRCP_FM_09",
        "PRST_WX_DSC_1", "PRST_WX_PHENOM_1", "PRST_WX_DSC_2", "PRST_WX_PHENOM_2",
    ),
    "gale": (
        "year", "month", "TM_FULL", "WND_SPD", "MAX_WND_GUST_10",
        "PRST_WX_DSC_1", "PRST_WX_PHENOM_1", "PRST_WX_DSC_2", "PRST_WX_PHENOM_2", "PRCP_10",
    ),
    "temp": (
        "TM_FULL", "AIR_TEMP", "DWPT", "PRCP_FM_09",
    ),
    "fog": (
        "year", "month", "hour", "TM_FULL", "AIR_TEMP", "DWPT", "VSBY", "AWS_VSBY",
        "PRCP_10", "PRCP_FM_09", "PRST_WX_PHENOM_1", "PRST_WX_PHENOM_2",
        "PRST_WX_DSC_1", "PRST_WX_DSC_2", "CEIL_CLD_AMT_1", "CEIL_CLD_AMT_2",
        "CEIL_CLD_HT_1", "CEIL_CLD_HT_2",
    ),
    "smoke": (
        "year", "month", "hour", "WND_SPD", "PRST_WX_PHENOM_1", "PRST_WX_PHENOM_2",
    ),
}


def columns_for_section(section: str) -> tuple[str, ...]:
    cols = set(BASE_CHART_COLUMNS)
    cols.update(METRIC_COLUMNS)
    cols.update(SECTION_REQUIRED_COLUMNS.get(section, SECTION_REQUIRED_COLUMNS["overview"]))
    return tuple(sorted(cols))


def ceiling_keys_for_section(section: str) -> tuple[str, ...]:
    return SECTION_CEILING_KEYS.get(section, SECTION_CEILING_KEYS["overview"])


def ceiling_keys_for_figures(section: str, figure_ids: set[str]) -> tuple[str, ...]:
    if not figure_ids:
        return ceiling_keys_for_section(section)

    keys: set[str] = set()
    for fig_id in figure_ids:
        keys.update(FIGURE_CEILING_KEYS.get(fig_id, ()))
    if not keys:
        return tuple()
    return tuple(sorted(keys))


def columns_for_ceiling_keys(keys: set[str]) -> tuple[str, ...]:
    cols: set[str] = set()
    if keys & {"rain_thunder", "monthly_precip", "hourly_precip", "hourly_precip_y2"}:
        cols.update(CEILING_COLUMNS_BY_GROUP["rain"])
    if "gale_weather_split" in keys:
        cols.update(CEILING_COLUMNS_BY_GROUP["gale"])
    if keys & {"temp_dewpoint_y1_min", "temp_dewpoint_y1_max", "temp_dewpoint_y2"}:
        cols.update(CEILING_COLUMNS_BY_GROUP["temp"])
    if keys & {"fog_low_cloud", "monthly_fog", "fog_share", "fog_cloud_joint_min", "fog_cloud_joint_max"}:
        cols.update(CEILING_COLUMNS_BY_GROUP["fog"])
    if keys & {"monthly_smoke", "hourly_smoke", "scatter_wind_dewpt"}:
        cols.update(CEILING_COLUMNS_BY_GROUP["smoke"])
    return tuple(sorted(cols))

LOG = logging.getLogger("uvicorn.error")


def current_rss_mb() -> float | None:
    try:
        with open("/proc/self/status", encoding="utf-8") as handle:
            for line in handle:
                if line.startswith("VmRSS:"):
                    return int(line.split()[1]) / 1024.0
    except Exception:
        return None
    return None


def log_memory_phase(phase: str, **fields: Any) -> None:
    rss = current_rss_mb()
    parts = [f"phase={phase}"]
    if rss is not None:
        parts.append(f"rss_mb={rss:.1f}")
    for key, value in fields.items():
        parts.append(f"{key}={value}")
    LOG.info("[mem] " + " ".join(parts))


def trim_process_memory() -> None:
    try:
        gc.collect()
    except Exception:
        pass

    try:
        libc = ctypes.CDLL("libc.so.6")
        trim = getattr(libc, "malloc_trim", None)
        if trim is not None:
            trim(0)
    except Exception:
        pass


def configured_memory_guard_mb() -> float:
    raw = os.getenv("CHARTS_MEMORY_GUARD_MB", "0").strip()
    if not raw:
        return 0.0
    try:
        value = float(raw)
    except ValueError:
        return 0.0
    return value if value > 0 else 0.0


@lru_cache(maxsize=1)
def get_coords_df() -> pd.DataFrame:
    return pd.read_csv(COORD_FILE, encoding="utf-8-sig").set_index("ICAO")


class LazyCoords:
    @property
    def index(self) -> pd.Index:
        return get_coords_df().index

    @property
    def loc(self) -> Any:
        return get_coords_df().loc


COORDS_DF = LazyCoords()


@lru_cache(maxsize=1)
def get_tz_finder() -> TimezoneFinder:
    # Defer timezone dataset load until first timezone-dependent chart path.
    return TimezoneFinder(in_memory=True)


def precomputed_airport_file(directory: str, icao: str) -> str:
    return os.path.join(directory, f"{icao}.json")


def read_json_file(path: str) -> Any | None:
    resolved_path = path
    if not os.path.exists(resolved_path):
        gz_path = f"{path}.gz"
        if os.path.exists(gz_path):
            resolved_path = gz_path
        else:
            return None
    try:
        if resolved_path.endswith(".gz"):
            with gzip.open(resolved_path, "rt", encoding="utf-8") as handle:
                return json.load(handle)
        with open(resolved_path, encoding="utf-8") as handle:
            return json.load(handle)
    except Exception:
        return None


@lru_cache(maxsize=1)
def load_precomputed_y_ceilings_legacy() -> dict[str, dict[str, float]]:
    raw = read_json_file(Y_CEILINGS_FILE)
    if not isinstance(raw, dict):
        return {}

    data: dict[str, dict[str, float]] = {}
    for icao, values in raw.items():
        if not isinstance(icao, str) or not isinstance(values, dict):
            continue
        parsed: dict[str, float] = {}
        for key, value in values.items():
            if not isinstance(key, str):
                continue
            try:
                parsed[key] = float(value)
            except (TypeError, ValueError):
                continue
        if parsed:
            data[icao] = parsed
    return data


@lru_cache(maxsize=128)
def load_precomputed_y_ceilings_for_airport(icao: str) -> dict[str, float]:
    raw = read_json_file(precomputed_airport_file(Y_CEILINGS_DIR, icao))
    if isinstance(raw, dict):
        parsed: dict[str, float] = {}
        for key, value in raw.items():
            if not isinstance(key, str):
                continue
            try:
                parsed[key] = float(value)
            except (TypeError, ValueError):
                continue
        if parsed:
            return parsed
    return load_precomputed_y_ceilings_legacy().get(icao, {})


def precomputed_ceilings_for_airport(icao: str, needed: set[str]) -> tuple[dict[str, float], set[str]]:
    airport_values = load_precomputed_y_ceilings_for_airport(icao)
    if not airport_values:
        return {}, set(needed)

    resolved: dict[str, float] = {}
    missing = set(needed)
    for key in tuple(missing):
        if key in airport_values:
            resolved[key] = float(airport_values[key])
            missing.discard(key)
    return resolved, missing


def _parse_fog_mode_map(mode_map: Any) -> dict[str, list[dict[str, Any]]]:
    if not isinstance(mode_map, dict):
        return {}
    parsed_modes: dict[str, list[dict[str, Any]]] = {}
    for mode, rows in mode_map.items():
        if not isinstance(mode, str) or not isinstance(rows, list):
            continue
        parsed_rows: list[dict[str, Any]] = []
        for row in rows:
            if not isinstance(row, dict):
                continue
            try:
                parsed_row = {
                    "bom_year": int(row.get("bom_year")),
                    "bom_month": int(row.get("bom_month")),
                    "enso_norm": str(row.get("enso_norm", "all")).strip().lower(),
                    "iod_norm": str(row.get("iod_norm", "all")).strip().lower(),
                    "sam_norm": str(row.get("sam_norm", "all")).strip().lower(),
                    "mjo_norm": str(row.get("mjo_norm", "all")).strip().lower(),
                    "Freezing fog": float(row.get("Freezing fog", 0.0)),
                    "Fog": float(row.get("Fog", 0.0)),
                    "below 2000ft": float(row.get("below 2000ft", 0.0)),
                    "below 1500ft": float(row.get("below 1500ft", 0.0)),
                    "below 1000ft": float(row.get("below 1000ft", 0.0)),
                    "below 500ft": float(row.get("below 500ft", 0.0)),
                }
                if "total_days" in row:
                    parsed_row["total_days"] = float(row.get("total_days", 0.0) or 0.0)
                if "mode" in row:
                    parsed_row["mode"] = str(row.get("mode", "")).strip().lower()
                parsed_rows.append(parsed_row)
            except (TypeError, ValueError):
                continue
        if parsed_rows:
            parsed_modes[mode] = parsed_rows
    return parsed_modes


@lru_cache(maxsize=1)
def load_precomputed_overview_fog_monthly_legacy() -> dict[str, dict[str, list[dict[str, Any]]]]:
    raw = read_json_file(OVERVIEW_FOG_MONTHLY_FILE)
    if not isinstance(raw, dict):
        return {}
    data: dict[str, dict[str, list[dict[str, Any]]]] = {}
    for icao, mode_map in raw.items():
        if not isinstance(icao, str):
            continue
        parsed = _parse_fog_mode_map(mode_map)
        if parsed:
            data[icao] = parsed
    return data


@lru_cache(maxsize=128)
def load_precomputed_overview_fog_monthly_for_airport(icao: str) -> dict[str, list[dict[str, Any]]]:
    raw = read_json_file(precomputed_airport_file(OVERVIEW_FOG_MONTHLY_DIR, icao))
    parsed = _parse_fog_mode_map(raw)
    if parsed:
        return parsed
    return load_precomputed_overview_fog_monthly_legacy().get(icao, {})


def _parse_rain_rows(rows: Any) -> list[dict[str, Any]]:
    if not isinstance(rows, list):
        return []
    parsed_rows: list[dict[str, Any]] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        try:
            parsed_rows.append({
                "bom_year": int(row.get("bom_year")),
                "bom_month": int(row.get("bom_month")),
                "enso_norm": str(row.get("enso_norm", "")).strip().lower(),
                "iod_norm": str(row.get("iod_norm", "")).strip().lower(),
                "sam_norm": str(row.get("sam_norm", "")).strip().lower(),
                "mjo_norm": str(row.get("mjo_norm", "")).strip().lower(),
                "Rain": float(row.get("Rain", 0.0)),
                "Thunderstorm": float(row.get("Thunderstorm", 0.0)),
            })
        except (TypeError, ValueError):
            continue
    return parsed_rows


@lru_cache(maxsize=1)
def load_precomputed_overview_rain_thunder_monthly_legacy() -> dict[str, list[dict[str, Any]]]:
    raw = read_json_file(OVERVIEW_RAIN_THUNDER_MONTHLY_FILE)
    if not isinstance(raw, dict):
        return {}

    data: dict[str, list[dict[str, Any]]] = {}
    for icao, rows in raw.items():
        if not isinstance(icao, str):
            continue
        parsed = _parse_rain_rows(rows)
        if parsed:
            data[icao] = parsed
    return data


@lru_cache(maxsize=128)
def load_precomputed_overview_rain_thunder_monthly_for_airport(icao: str) -> list[dict[str, Any]]:
    raw = read_json_file(precomputed_airport_file(OVERVIEW_RAIN_THUNDER_MONTHLY_DIR, icao))
    parsed = _parse_rain_rows(raw)
    if parsed:
        return parsed
    return load_precomputed_overview_rain_thunder_monthly_legacy().get(icao, [])


def _parse_wind_rows(rows: Any) -> list[dict[str, Any]]:
    if not isinstance(rows, list):
        return []
    parsed_rows: list[dict[str, Any]] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        try:
            speed_range = str(row.get("Speed Range", "")).strip()
            dir_bin_raw = row.get("dir_bin")
            if dir_bin_raw is None:
                dir_bin: float | None = None
            else:
                dir_bin = float(dir_bin_raw)
            parsed_rows.append({
                "bom_year": int(row.get("bom_year")),
                "bom_month": int(row.get("bom_month")),
                "enso_norm": str(row.get("enso_norm", "all")).strip().lower(),
                "iod_norm": str(row.get("iod_norm", "all")).strip().lower(),
                "sam_norm": str(row.get("sam_norm", "all")).strip().lower(),
                "mjo_norm": str(row.get("mjo_norm", "all")).strip().lower(),
                "dir_bin": dir_bin,
                "Speed Range": speed_range,
                "Count": float(row.get("Count", 0.0)),
            })
        except (TypeError, ValueError):
            continue
    return parsed_rows


@lru_cache(maxsize=1)
def load_precomputed_overview_wind_rose_legacy() -> dict[str, list[dict[str, Any]]]:
    raw = read_json_file(OVERVIEW_WIND_ROSE_FILE)
    if not isinstance(raw, dict):
        return {}

    data: dict[str, list[dict[str, Any]]] = {}
    for icao, rows in raw.items():
        if not isinstance(icao, str):
            continue
        parsed = _parse_wind_rows(rows)
        if parsed:
            data[icao] = parsed
    return data


@lru_cache(maxsize=128)
def load_precomputed_overview_wind_rose_for_airport(icao: str) -> list[dict[str, Any]]:
    raw = read_json_file(precomputed_airport_file(OVERVIEW_WIND_ROSE_DIR, icao))
    parsed = _parse_wind_rows(raw)
    if parsed:
        return parsed
    return load_precomputed_overview_wind_rose_legacy().get(icao, [])


def _parse_wind_gale_rows(rows: Any) -> list[dict[str, Any]]:
    if not isinstance(rows, list):
        return []

    parsed_rows: list[dict[str, Any]] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        try:
            parsed_rows.append({
                "year": int(row.get("year")),
                "month": int(row.get("month")),
                "enso_norm": str(row.get("enso_norm", "all")).strip().lower(),
                "iod_norm": str(row.get("iod_norm", "all")).strip().lower(),
                "sam_norm": str(row.get("sam_norm", "all")).strip().lower(),
                "mjo_norm": str(row.get("mjo_norm", "all")).strip().lower(),
                "Category": str(row.get("Category", "")).strip(),
                "Count": float(row.get("Count", 0.0)),
            })
        except (TypeError, ValueError):
            continue
    return parsed_rows


@lru_cache(maxsize=128)
def load_precomputed_wind_gale_monthly_for_airport(icao: str) -> list[dict[str, Any]]:
    raw = read_json_file(precomputed_airport_file(WIND_GALE_MONTHLY_DIR, icao))
    return _parse_wind_gale_rows(raw)


def _parse_temp_rows(rows: Any) -> list[dict[str, Any]]:
    if not isinstance(rows, list):
        return []
    parsed_rows: list[dict[str, Any]] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        try:
            parsed_rows.append({
                "bom_year": int(row.get("bom_year")),
                "bom_month": int(row.get("bom_month")),
                "enso_norm": str(row.get("enso_norm", "all")).strip().lower(),
                "iod_norm": str(row.get("iod_norm", "all")).strip().lower(),
                "sam_norm": str(row.get("sam_norm", "all")).strip().lower(),
                "mjo_norm": str(row.get("mjo_norm", "all")).strip().lower(),
                "Avg Daily Max T": float(row.get("Avg Daily Max T", 0.0)),
                "Avg Daily Min T": float(row.get("Avg Daily Min T", 0.0)),
                "Avg Daily Max Td": float(row.get("Avg Daily Max Td", 0.0)),
                "Avg Daily Min Td": float(row.get("Avg Daily Min Td", 0.0)),
                "monthly_precip_mm": float(row.get("monthly_precip_mm", 0.0)),
            })
        except (TypeError, ValueError):
            continue
    return parsed_rows


@lru_cache(maxsize=1)
def load_precomputed_overview_temp_dewpoint_legacy() -> dict[str, list[dict[str, Any]]]:
    raw = read_json_file(OVERVIEW_TEMP_DEWPOINT_FILE)
    if not isinstance(raw, dict):
        return {}

    data: dict[str, list[dict[str, Any]]] = {}
    for icao, rows in raw.items():
        if not isinstance(icao, str):
            continue
        parsed = _parse_temp_rows(rows)
        if parsed:
            data[icao] = parsed
    return data


@lru_cache(maxsize=128)
def load_precomputed_overview_temp_dewpoint_for_airport(icao: str) -> list[dict[str, Any]]:
    raw = read_json_file(precomputed_airport_file(OVERVIEW_TEMP_DEWPOINT_DIR, icao))
    parsed = _parse_temp_rows(raw)
    if parsed:
        return parsed
    return load_precomputed_overview_temp_dewpoint_legacy().get(icao, [])


def _parse_precip_monthly_rows(rows: Any) -> list[dict[str, Any]]:
    if not isinstance(rows, list):
        return []
    parsed: list[dict[str, Any]] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        try:
            parsed.append({
                "bom_year": int(row.get("bom_year")),
                "bom_month": int(row.get("bom_month")),
                "enso_norm": str(row.get("enso_norm", "all")).strip().lower(),
                "iod_norm": str(row.get("iod_norm", "all")).strip().lower(),
                "sam_norm": str(row.get("sam_norm", "all")).strip().lower(),
                "mjo_norm": str(row.get("mjo_norm", "all")).strip().lower(),
                "Rain": float(row.get("Rain", 0.0)),
                "Thunderstorm": float(row.get("Thunderstorm", 0.0)),
            })
        except (TypeError, ValueError):
            continue
    return parsed


def _parse_precip_split_rows(rows: Any) -> list[dict[str, Any]]:
    if not isinstance(rows, list):
        return []
    parsed: list[dict[str, Any]] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        try:
            parsed.append({
                "year": int(row.get("year")),
                "month": int(row.get("month")),
                "enso_norm": str(row.get("enso_norm", "all")).strip().lower(),
                "iod_norm": str(row.get("iod_norm", "all")).strip().lower(),
                "sam_norm": str(row.get("sam_norm", "all")).strip().lower(),
                "mjo_norm": str(row.get("mjo_norm", "all")).strip().lower(),
                "dir_bin_10": int(row.get("dir_bin_10")),
                "denom": float(row.get("denom", 0.0)),
                "lt3": float(row.get("lt3", 0.0)),
                "lt5": float(row.get("lt5", 0.0)),
                "lt7": float(row.get("lt7", 0.0)),
                "lt9": float(row.get("lt9", 0.0)),
            })
        except (TypeError, ValueError):
            continue
    return parsed


def _parse_precip_hourly_rows(rows: Any) -> list[dict[str, Any]]:
    if not isinstance(rows, list):
        return []
    parsed: list[dict[str, Any]] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        try:
            parsed.append({
                "year": int(row.get("year")),
                "month": int(row.get("month")),
                "hour": int(row.get("hour")),
                "enso_norm": str(row.get("enso_norm", "all")).strip().lower(),
                "iod_norm": str(row.get("iod_norm", "all")).strip().lower(),
                "sam_norm": str(row.get("sam_norm", "all")).strip().lower(),
                "mjo_norm": str(row.get("mjo_norm", "all")).strip().lower(),
                "Type": str(row.get("Type")),
                "Count": float(row.get("Count", 0.0)),
            })
        except (TypeError, ValueError):
            continue
    return parsed


def _parse_precip_cloud_vis_rows(rows: Any) -> list[dict[str, Any]]:
    if not isinstance(rows, list):
        return []
    parsed: list[dict[str, Any]] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        try:
            parsed.append({
                "year": int(row.get("year")),
                "month": int(row.get("month")),
                "enso_norm": str(row.get("enso_norm", "all")).strip().lower(),
                "iod_norm": str(row.get("iod_norm", "all")).strip().lower(),
                "sam_norm": str(row.get("sam_norm", "all")).strip().lower(),
                "mjo_norm": str(row.get("mjo_norm", "all")).strip().lower(),
                "ceil_bin": int(row.get("ceil_bin")),
                "vsby_bin": float(row.get("vsby_bin")),
                "count": float(row.get("count", 0.0)),
            })
        except (TypeError, ValueError):
            continue
    return parsed


def _parse_lightning_grid_rows(rows: Any) -> list[dict[str, Any]]:
    if not isinstance(rows, list):
        return []
    parsed: list[dict[str, Any]] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        try:
            parsed.append({
                "year": int(row.get("year")),
                "month": int(row.get("month")),
                "enso_norm": str(row.get("enso_norm", "all")).strip().lower(),
                "iod_norm": str(row.get("iod_norm", "all")).strip().lower(),
                "sam_norm": str(row.get("sam_norm", "all")).strip().lower(),
                "mjo_norm": str(row.get("mjo_norm", "all")).strip().lower(),
                "grid_i": int(row.get("grid_i")),
                "grid_j": int(row.get("grid_j")),
                "count": float(row.get("count", 0.0)),
            })
        except (TypeError, ValueError):
            continue
    return parsed


@lru_cache(maxsize=128)
def load_precomputed_precipitation_for_airport(icao: str) -> dict[str, list[dict[str, Any]]]:
    raw = read_json_file(precomputed_airport_file(PRECIPITATION_PRECOMPUTED_DIR, icao))
    if not isinstance(raw, dict):
        return {}
    monthly = _parse_precip_monthly_rows(raw.get("monthly", []))
    split = _parse_precip_split_rows(raw.get("split", []))
    hourly = _parse_precip_hourly_rows(raw.get("hourly", []))
    lightning_grid = _parse_lightning_grid_rows(raw.get("lightning_grid", []))
    data: dict[str, list[dict[str, Any]]] = {}
    if monthly:
        data["monthly"] = monthly
    if split:
        data["split"] = split
    if hourly:
        data["hourly"] = hourly
    if lightning_grid:
        data["lightning_grid"] = lightning_grid
    return data


def _parse_fog_precomputed_payload(raw: Any) -> dict[str, list[dict[str, Any]]]:
    if not isinstance(raw, dict):
        return {}
    payload: dict[str, list[dict[str, Any]]] = {}
    for key in ("monthly", "hourly", "dewpoint", "wind"):
        rows = raw.get(key, [])
        payload[key] = rows if isinstance(rows, list) else []
    return payload


FOG_LOW_CLOUD_FAMILY_MAP = {
    "monthly_fog": "monthly",
    "fog_share": "hourly",
    "fog_cloud_joint": "dewpoint",
    "cloud_distribution": "wind",
}

FOG_MODE_TO_SUFFIX = {
    "all": "all",
    "rain": "rain",
    "non_rain": "non_rain",
}


def load_precomputed_fog_low_cloud_for_airport(
    icao: str,
    family: str,
    *,
    mode: str | None = None,
    all_state_only: bool = False,
) -> list[dict[str, Any]]:
    family_key = FOG_LOW_CLOUD_FAMILY_MAP.get(family)
    if family_key is None:
        return []

    # Prefer mode/state-specific shards when present to reduce request-time memory.
    if mode:
        mode_suffix = FOG_MODE_TO_SUFFIX.get(str(mode).strip().lower())
        if mode_suffix:
            if all_state_only:
                all_state_mode_path = os.path.join(
                    FOG_LOW_CLOUD_PRECOMPUTED_DIR,
                    icao,
                    f"{family_key}_{mode_suffix}_allstate.json.gz",
                )
                raw_all_state_mode = read_json_file(all_state_mode_path)
                if isinstance(raw_all_state_mode, list):
                    return raw_all_state_mode

            mode_path = os.path.join(FOG_LOW_CLOUD_PRECOMPUTED_DIR, icao, f"{family_key}_{mode_suffix}.json.gz")
            raw_mode = read_json_file(mode_path)
            if isinstance(raw_mode, list):
                return raw_mode

    if all_state_only:
        all_state_path = os.path.join(FOG_LOW_CLOUD_PRECOMPUTED_DIR, icao, f"{family_key}_allstate.json.gz")
        raw_all_state = read_json_file(all_state_path)
        if isinstance(raw_all_state, list):
            return raw_all_state

    split_path = os.path.join(FOG_LOW_CLOUD_PRECOMPUTED_DIR, icao, f"{family_key}.json.gz")
    raw = read_json_file(split_path)
    if isinstance(raw, list):
        return raw

    legacy_raw = read_json_file(precomputed_airport_file(FOG_LOW_CLOUD_PRECOMPUTED_DIR, icao))
    legacy_payload = _parse_fog_precomputed_payload(legacy_raw)
    return legacy_payload.get(family_key, [])


def _parse_smoke_precomputed_payload(raw: Any) -> dict[str, list[dict[str, Any]]]:
    if not isinstance(raw, dict):
        return {}
    payload: dict[str, list[dict[str, Any]]] = {}
    for key in ("monthly", "hourly", "scatter", "radial"):
        rows = raw.get(key, [])
        payload[key] = rows if isinstance(rows, list) else []
    return payload


def load_precomputed_smoke_dust_for_airport(icao: str) -> dict[str, list[dict[str, Any]]]:
    raw = read_json_file(precomputed_airport_file(SMOKE_DUST_PRECOMPUTED_DIR, icao))
    return _parse_smoke_precomputed_payload(raw)


def split_dataset_available() -> bool:
    if not os.path.isdir(SPLIT_DATA_DIR):
        return False
    return any(name.startswith("TARGET_ICAO=") for name in os.listdir(SPLIT_DATA_DIR))


def partition_lookup_icao(icao: str) -> str:
    return str(icao or "").strip().upper()


def split_partition_glob(icao: str) -> str:
    return os.path.join(SPLIT_DATA_DIR, f"TARGET_ICAO={partition_lookup_icao(icao)}", "*.parquet")


def apply_aerodrome_stn_filter(icao: str, df: pl.DataFrame) -> pl.DataFrame:
    allowed = AERODROME_STN_FILTERS.get(str(icao or "").strip().upper())
    if not allowed or df.is_empty() or "STN_NUM" not in df.columns:
        return df
    return df.filter(pl.col("STN_NUM").is_in(sorted(allowed)))


@lru_cache(maxsize=1)
def available_airports() -> tuple[str, ...]:
    if split_dataset_available():
        airports = sorted(
            name.split("=", 1)[1]
            for name in os.listdir(SPLIT_DATA_DIR)
            if name.startswith("TARGET_ICAO=") and os.path.isdir(os.path.join(SPLIT_DATA_DIR, name))
        )
        return tuple(airports)

    if os.path.exists(DATA_FILE):
        airports = (
            pl.scan_parquet(DATA_FILE)
            .select(pl.col("TARGET_ICAO").unique())
            .collect()
            .to_series()
            .drop_nulls()
            .to_list()
        )
        return tuple(sorted(str(a) for a in airports))

    return tuple()


@lru_cache(maxsize=1)
def load_airport_df(icao: str, columns: tuple[str, ...] | None = None) -> pl.DataFrame:
    requested = set(columns) if columns else set()
    if requested:
        # Keep precipitation aliases available when one of them is requested.
        requested.update({"PRCP_FM_09", "PRCP_10"})
    if AERODROME_STN_FILTERS.get(str(icao or "").strip().upper()):
        requested.add("STN_NUM")

    if split_dataset_available():
        partition_glob = split_partition_glob(icao)
        if not glob.glob(partition_glob):
            return pl.DataFrame()
        if requested:
            scan = pl.scan_parquet(partition_glob)
            existing = set(scan.collect_schema().names())
            selected = [c for c in requested if c in existing]
            if not selected:
                return pl.DataFrame()
            df = scan.select(selected).collect()
        else:
            df = pl.read_parquet(partition_glob)
    elif os.path.exists(DATA_FILE):
        scan = pl.scan_parquet(DATA_FILE).filter(pl.col("TARGET_ICAO") == icao)
        if requested:
            existing = set(scan.collect_schema().names())
            selected = [c for c in requested if c in existing]
            if not selected:
                return pl.DataFrame()
            df = scan.select(selected).collect()
        else:
            df = scan.collect()
    else:
        return pl.DataFrame()

    if "PRCP_FM_09" not in df.columns and "PRCP_10" in df.columns:
        df = df.with_columns(pl.col("PRCP_10").alias("PRCP_FM_09"))
    if "PRCP_10" not in df.columns and "PRCP_FM_09" in df.columns:
        df = df.with_columns(pl.col("PRCP_FM_09").alias("PRCP_10"))
    if "PRCP_FM_09" not in df.columns:
        df = df.with_columns(pl.lit(None, dtype=pl.Float64).alias("PRCP_FM_09"))
    if "PRCP_10" not in df.columns:
        df = df.with_columns(pl.lit(None, dtype=pl.Float64).alias("PRCP_10"))

    optional_columns = [
        "TARGET_ICAO",
        "STN_NUM",
        "AWS_VSBY",
        "RE_WX_DSC_1",
        "RE_WX_PHENOM_1",
        "RE_WX_DSC_2",
        "RE_WX_PHENOM_2",
        "RE_WX_DSC_3",
        "RE_WX_PHENOM_3",
    ]
    if requested:
        optional_columns = [c for c in optional_columns if c in requested]
    for column in optional_columns:
        if column not in df.columns:
            df = df.with_columns(pl.lit(None).alias(column))

    return apply_aerodrome_stn_filter(icao, df)


def lightning_dataset_available() -> bool:
    if not os.path.isdir(LIGHTNING_SPLIT_DIR):
        return False
    return any(name.startswith("TARGET_ICAO=") for name in os.listdir(LIGHTNING_SPLIT_DIR))


def lightning_partition_glob(icao: str) -> str:
    return os.path.join(LIGHTNING_SPLIT_DIR, f"TARGET_ICAO={icao}", "*.parquet")


@lru_cache(maxsize=1)
def load_lightning_df(icao: str) -> pl.DataFrame:
    schema = {
        "TARGET_ICAO": pl.Utf8,
        "LTGN_TM": pl.Datetime(time_zone="UTC"),
        "LAT": pl.Float64,
        "LONG": pl.Float64,
    }

    if not lightning_dataset_available():
        return pl.DataFrame(schema=schema)

    partition_glob = lightning_partition_glob(icao)
    if not glob.glob(partition_glob):
        return pl.DataFrame(schema=schema)

    return pl.read_parquet(partition_glob)


def airport_lat_lon(icao: str) -> tuple[float, float] | None:
    if icao not in COORDS_DF.index:
        return None
    return float(COORDS_DF.loc[icao, "LAT"]), float(COORDS_DF.loc[icao, "LONG"])


def airport_display_label(icao: str) -> str:
    """Return dropdown label; critical locations may include AWS station code in NAME."""
    code = str(icao or "").strip().upper()
    if not code or code not in COORDS_DF.index:
        return code
    name = str(COORDS_DF.loc[code, "NAME"]).strip()
    if name.startswith(f"{code} ("):
        return name
    return code


@lru_cache(maxsize=1)
def airport_display_labels() -> dict[str, str]:
    labels: dict[str, str] = {}
    for icao in get_coords_df().index:
        label = airport_display_label(str(icao))
        if label != str(icao):
            labels[str(icao)] = label
    return labels


def haversine_distance_km(lat1: float, lon1: float, lat2: np.ndarray, lon2: np.ndarray) -> np.ndarray:
    r_earth_km = 6371.0
    lat1_rad = np.deg2rad(lat1)
    lon1_rad = np.deg2rad(lon1)
    lat2_rad = np.deg2rad(lat2)
    lon2_rad = np.deg2rad(lon2)

    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    a = np.sin(dlat / 2.0) ** 2 + np.cos(lat1_rad) * np.cos(lat2_rad) * np.sin(dlon / 2.0) ** 2
    return 2.0 * r_earth_km * np.arcsin(np.sqrt(a))


def lightning_heatmap_radius_km(icao: str = "") -> float:
    _ = icao
    return LIGHTNING_HEATMAP_RADIUS_KM


def strike_offsets_km_from_airport(
    strikes: pd.DataFrame,
    airport_lat: float,
    airport_lon: float,
) -> pd.DataFrame:
    lat_scale = 111.0
    lon_scale = 111.0 * max(0.1, math.cos(math.radians(airport_lat)))
    work = strikes.copy()
    work["x_km"] = (pd.to_numeric(work["LONG"], errors="coerce") - airport_lon) * lon_scale
    work["y_km"] = (pd.to_numeric(work["LAT"], errors="coerce") - airport_lat) * lat_scale
    return work


def filter_strikes_within_radius_km(
    strikes: pd.DataFrame,
    airport_lat: float,
    airport_lon: float,
    radius_km: float,
) -> pd.DataFrame:
    if strikes.empty:
        return strikes
    distances = haversine_distance_km(
        airport_lat,
        airport_lon,
        pd.to_numeric(strikes["LAT"], errors="coerce").to_numpy(),
        pd.to_numeric(strikes["LONG"], errors="coerce").to_numpy(),
    )
    return strikes.loc[distances <= radius_km].copy()


def assign_lightning_strike_grid_indices(
    strikes: pd.DataFrame,
    *,
    extent_km: float,
    grid: int = LIGHTNING_HEATMAP_GRID,
) -> pd.DataFrame:
    half_extent = extent_km / 2.0
    cell_size = extent_km / grid
    work = strikes.copy()
    work["grid_i"] = np.floor((work["x_km"] + half_extent) / cell_size).astype(int)
    work["grid_j"] = np.floor((work["y_km"] + half_extent) / cell_size).astype(int)
    work["grid_i"] = work["grid_i"].clip(0, grid - 1)
    work["grid_j"] = work["grid_j"].clip(0, grid - 1)
    return work


def cell_intersects_lightning_disk(
    x_center_km: float,
    y_center_km: float,
    half_cell_km: float,
    radius_km: float,
) -> bool:
    dx = max(abs(x_center_km) - half_cell_km, 0.0)
    dy = max(abs(y_center_km) - half_cell_km, 0.0)
    return math.hypot(dx, dy) <= radius_km


def lightning_proximity_mask(
    obs_df: pd.DataFrame,
    icao: str,
    time_field: str = "TM_FULL",
    radius_km: float = LIGHTNING_RADIUS_KM,
    window_minutes: int = LIGHTNING_WINDOW_MINUTES,
) -> pd.Series:
    matched = pd.Series(False, index=obs_df.index)
    if obs_df.empty or time_field not in obs_df.columns:
        return matched

    coords = airport_lat_lon(icao)
    if coords is None:
        return matched
    airport_lat, airport_lon = coords

    obs_time = pd.to_datetime(obs_df[time_field], utc=True, errors="coerce")
    valid_obs = obs_time.notna()
    if not valid_obs.any():
        return matched

    lightning_df = load_lightning_df(icao)
    if lightning_df.is_empty():
        return matched

    strikes = lightning_df.select(["LTGN_TM", "LAT", "LONG"]).drop_nulls().to_pandas()
    if strikes.empty:
        return matched

    strikes["LTGN_TM"] = pd.to_datetime(strikes["LTGN_TM"], utc=True, errors="coerce")
    strikes = strikes.dropna(subset=["LTGN_TM", "LAT", "LONG"])
    if strikes.empty:
        return matched

    lat_pad = radius_km / 111.0
    lon_scale = max(0.1, math.cos(math.radians(airport_lat)))
    lon_pad = radius_km / (111.0 * lon_scale)
    strikes = strikes[
        strikes["LAT"].between(airport_lat - lat_pad, airport_lat + lat_pad)
        & strikes["LONG"].between(airport_lon - lon_pad, airport_lon + lon_pad)
    ]
    if strikes.empty:
        return matched

    distances = haversine_distance_km(
        airport_lat,
        airport_lon,
        strikes["LAT"].to_numpy(dtype=float),
        strikes["LONG"].to_numpy(dtype=float),
    )
    nearby = strikes.loc[distances <= radius_km]
    if nearby.empty:
        return matched

    strike_ns = np.sort(nearby["LTGN_TM"].astype("int64").to_numpy())
    if strike_ns.size == 0:
        return matched

    obs_ns = obs_time.loc[valid_obs].astype("int64").to_numpy()
    window_ns = int(window_minutes * 60 * 1_000_000_000)
    left = np.searchsorted(strike_ns, obs_ns - window_ns, side="left")
    right = np.searchsorted(strike_ns, obs_ns + window_ns, side="right")
    matched.loc[obs_time.loc[valid_obs].index] = (right > left)
    return matched


def lightning_day_within_radius_mask(
    obs_df: pd.DataFrame,
    icao: str,
    day_field: str = "bom_day",
    radius_km: float = LIGHTNING_RADIUS_KM,
) -> pd.Series:
    """
    Flag observation rows whose BoM day has at least one lightning strike within
    radius_km of the airport reference point.
    """
    matched = pd.Series(False, index=obs_df.index)
    if obs_df.empty or day_field not in obs_df.columns:
        return matched

    coords = airport_lat_lon(icao)
    if coords is None:
        return matched
    airport_lat, airport_lon = coords

    lightning_df = load_lightning_df(icao)
    if lightning_df.is_empty():
        return matched

    strikes = lightning_df.select(["LTGN_TM", "LAT", "LONG"]).drop_nulls().to_pandas()
    if strikes.empty:
        return matched

    strikes["LTGN_TM"] = pd.to_datetime(strikes["LTGN_TM"], utc=True, errors="coerce")
    strikes = strikes.dropna(subset=["LTGN_TM", "LAT", "LONG"])
    if strikes.empty:
        return matched

    lat_pad = radius_km / 111.0
    lon_scale = max(0.1, math.cos(math.radians(airport_lat)))
    lon_pad = radius_km / (111.0 * lon_scale)
    strikes = strikes[
        strikes["LAT"].between(airport_lat - lat_pad, airport_lat + lat_pad)
        & strikes["LONG"].between(airport_lon - lon_pad, airport_lon + lon_pad)
    ]
    if strikes.empty:
        return matched

    distances = haversine_distance_km(
        airport_lat,
        airport_lon,
        strikes["LAT"].to_numpy(dtype=float),
        strikes["LONG"].to_numpy(dtype=float),
    )
    nearby = strikes.loc[distances <= radius_km]
    if nearby.empty:
        return matched

    tz_name = airport_timezone(icao)
    nearby_local = nearby["LTGN_TM"].dt.tz_convert(tz_name)
    strike_days = set((nearby_local - pd.Timedelta(hours=9)).dt.date.tolist())
    if not strike_days:
        return matched

    matched = obs_df[day_field].isin(strike_days)
    return matched.fillna(False)


def filter_lightning_coverage_window(df: pd.DataFrame, time_field: str = "TM_FULL") -> pd.DataFrame:
    if df.empty or time_field not in df.columns:
        return df
    ts = pd.to_datetime(df[time_field], utc=True, errors="coerce")
    mask = ts.notna() & (ts >= LIGHTNING_COVERAGE_START_UTC)
    return df.loc[mask].copy()


def normalize_driver_value(value: str) -> str:
    cleaned = re.sub(r"[^a-z0-9]+", " ", str(value).strip().lower()).strip()
    return re.sub(r"\s+", " ", cleaned)


def normalize_driver_selection(value: str) -> str:
    normalized = normalize_driver_value(value)
    if normalized == "all":
        return "all"

    # Backward-compatible aliases if old select values are still in use.
    aliases = {
        "el nino": "el nino",
        "la nina": "la nina",
        "neutral": "neutral",
        "positive": "positive iod",
        "negative": "negative sam",
        "positive sam": "positive sam",
        "negative sam": "negative sam",
        "positive iod": "positive iod",
        "negative iod": "negative iod",
        "phase 1": "1",
        "phase 2": "2",
        "phase 3": "3",
        "phase 4": "4",
        "phase 5": "5",
        "phase 6": "6",
        "phase 7": "7",
        "phase 8": "8",
        "inactive": "inactive",
    }
    return aliases.get(normalized, normalized)


def load_climate_driver_df() -> pl.DataFrame:
    if not os.path.exists(CLIMATE_FILE):
        return pl.DataFrame(
            schema={
                "year": pl.Int32,
                "month": pl.Int32,
                "day": pl.Int32,
                "enso": pl.Utf8,
                "iod": pl.Utf8,
                "sam": pl.Utf8,
                "mjo": pl.Utf8,
                "enso_norm": pl.Utf8,
                "iod_norm": pl.Utf8,
                "sam_norm": pl.Utf8,
                "mjo_norm": pl.Utf8,
            }
        )

    raw = pl.read_csv(CLIMATE_FILE, ignore_errors=True)
    required_columns = {"Year", "Month", "Day", "ENSO", "IOD", "SAM", "MJO"}
    if not required_columns.issubset(set(raw.columns)):
        return pl.DataFrame(
            schema={
                "year": pl.Int32,
                "month": pl.Int32,
                "day": pl.Int32,
                "enso": pl.Utf8,
                "iod": pl.Utf8,
                "sam": pl.Utf8,
                "mjo": pl.Utf8,
                "enso_norm": pl.Utf8,
                "iod_norm": pl.Utf8,
                "sam_norm": pl.Utf8,
                "mjo_norm": pl.Utf8,
            }
        )

    df = (
        raw.rename(
            {
                "Year": "year",
                "Month": "month",
                "Day": "day",
                "ENSO": "enso",
                "IOD": "iod",
                "SAM": "sam",
                "MJO": "mjo",
            }
        )
        .with_columns([
            pl.col("year").cast(pl.Int32, strict=False),
            pl.col("month").cast(pl.Int32, strict=False),
            pl.col("day").cast(pl.Int32, strict=False),
            pl.col("enso").cast(pl.Utf8, strict=False),
            pl.col("iod").cast(pl.Utf8, strict=False),
            pl.col("sam").cast(pl.Utf8, strict=False),
            pl.col("mjo").cast(pl.Utf8, strict=False),
        ])
        .drop_nulls(["year", "month", "day"])
        .filter(
            pl.col("month").is_between(1, 12)
            & pl.col("day").is_between(1, 31)
        )
    )

    normalized_exprs = []
    for col_name in DRIVER_COLUMNS:
        normalized_exprs.append(
            pl.col(col_name)
            .fill_null("")
            .str.to_lowercase()
            .str.replace_all(r"[^a-z0-9]+", " ")
            .str.strip_chars()
            .str.replace_all(r"\s+", " ")
            .alias(f"{col_name}_norm")
        )

    return df.with_columns(normalized_exprs)


@lru_cache(maxsize=1)
def get_climate_df() -> pl.DataFrame:
    return load_climate_driver_df()

PLOT_HEIGHT = 300
DEFAULT_LEGEND_ENTRY_WIDTH = 220
WIDE_LEGEND_ENTRY_WIDTH = 300
LEGEND_MARGIN_PADDING = 56
LEGEND_SYMBOL_WIDTH = 40
FOG_LOW_CLOUD_LEGEND_ORDER = [
    "Fog",
    "Freezing fog",
    "2000ft - 1500ft cloud",
    "1500ft - 1000ft cloud",
    "1000ft - 500ft cloud",
    "< 500ft cloud",
]
FOG_STACK_LABELS = ("Freezing fog", "Fog")
FOG_STACK_COLORS = {
    "Freezing fog": "#b8e4f5",
    "Fog": "#d4af37",
}
FOG_LOW_CLOUD_THRESHOLD_LABELS = {
    "below 2000ft": "2000ft - 1500ft cloud",
    "below 1500ft": "1500ft - 1000ft cloud",
    "below 1000ft": "1000ft - 500ft cloud",
    "below 500ft": "< 500ft cloud",
}
NO_DATA_MESSAGE = "No data available"

app = FastAPI(title="Aviation climatology API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def data_lite_cache_control(request, call_next):
    """Versioned data-lite URLs (?v=) are immutable; cache aggressively on repeat visits."""
    response = await call_next(request)
    path = request.url.path or ""
    if path.startswith("/data-lite/"):
        response.headers.setdefault(
            "Cache-Control",
            "public, max-age=31536000, immutable",
        )
    return response


app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")
app.mount(
    "/data-lite",
    StaticFiles(directory=os.path.join(FRONTEND_DIR, "data-lite")),
    name="data-lite",
)


WIND_SPEED_KT_FACTOR = 1.943844
WIND_ROSE_SPEED_RANGE_ORDER = [
    "1-3 kt",
    "4-6 kt",
    "6-10 kt",
    "10-15 kt",
    "15-20 kt",
    ">20 kt",
]


def _blend_hex_colors(color_a: str, color_b: str, weight_b: float = 0.5) -> str:
    def parse_hex(color: str) -> tuple[int, int, int]:
        value = color.strip().lstrip("#")
        if len(value) == 3:
            value = "".join(ch * 2 for ch in value)
        return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))

    red_a, green_a, blue_a = parse_hex(color_a)
    red_b, green_b, blue_b = parse_hex(color_b)
    weight = max(0.0, min(1.0, weight_b))
    red = round(red_a * (1.0 - weight) + red_b * weight)
    green = round(green_a * (1.0 - weight) + green_b * weight)
    blue = round(blue_a * (1.0 - weight) + blue_b * weight)
    return f"#{red:02x}{green:02x}{blue:02x}"


_WIND_ROSE_TURBO_RAMP = px.colors.sequential.Turbo[: len(WIND_ROSE_SPEED_RANGE_ORDER) + 1]
_CALM_DARK = _WIND_ROSE_TURBO_RAMP[0]
_ONE_TO_THREE = _WIND_ROSE_TURBO_RAMP[1]
_FOUR_TO_SIX = _WIND_ROSE_TURBO_RAMP[2]
WIND_ROSE_SPEED_COLOR_MAP = {
    "1-3 kt": _blend_hex_colors(_CALM_DARK, _FOUR_TO_SIX, 0.5),
    "4-6 kt": _FOUR_TO_SIX,
    "6-10 kt": _WIND_ROSE_TURBO_RAMP[3],
    "10-15 kt": _WIND_ROSE_TURBO_RAMP[4],
    "15-20 kt": _WIND_ROSE_TURBO_RAMP[5],
    ">20 kt": _WIND_ROSE_TURBO_RAMP[6],
}
WIND_ROSE_CALM_SPEED_RANGE = "Calm"
CALM_DIR_BIN_SENTINEL = -1
WIND_ROSE_CALM_FILL = _ONE_TO_THREE
WIND_ROSE_CALM_LINE = _ONE_TO_THREE
WIND_ROSE_BIN_FILL_OPACITY = 0.15


def _wind_rose_rgba_fill(color: str, alpha: float = WIND_ROSE_BIN_FILL_OPACITY) -> str | None:
    if not isinstance(color, str):
        return None

    color_str = color.strip()
    if color_str.startswith("#") and len(color_str) in (4, 7):
        if len(color_str) == 4:
            red = int(color_str[1] * 2, 16)
            green = int(color_str[2] * 2, 16)
            blue = int(color_str[3] * 2, 16)
        else:
            red = int(color_str[1:3], 16)
            green = int(color_str[3:5], 16)
            blue = int(color_str[5:7], 16)
        return f"rgba({red},{green},{blue},{alpha})"

    rgb_match = re.match(r"rgba?\(([^)]+)\)", color_str)
    if rgb_match:
        parts = [part.strip() for part in rgb_match.group(1).split(",")]
        if len(parts) >= 3:
            return f"rgba({parts[0]},{parts[1]},{parts[2]},{alpha})"

    return None


def wind_speed_knots(speed_mps: float | None) -> float | None:
    if speed_mps is None:
        return None
    try:
        speed = float(speed_mps)
    except (TypeError, ValueError):
        return None
    if not math.isfinite(speed):
        return None
    return speed * WIND_SPEED_KT_FACTOR


def is_calm_wind(speed_mps: float | None) -> bool:
    if speed_mps is None:
        return False
    try:
        speed = float(speed_mps)
    except (TypeError, ValueError):
        return False
    if not math.isfinite(speed):
        return False
    return speed <= 0.0


def has_directional_wind(speed_mps: float | None, direction_deg: float | None) -> bool:
    if is_calm_wind(speed_mps):
        return False
    if direction_deg is None:
        return False
    try:
        direction = float(direction_deg)
    except (TypeError, ValueError):
        return False
    return math.isfinite(direction)


def directional_wind_mask(wnd_spd: pd.Series, wnd_dir: pd.Series) -> pd.Series:
    spd = pd.to_numeric(wnd_spd, errors="coerce")
    direc = pd.to_numeric(wnd_dir, errors="coerce")
    return spd.notna() & (spd > 0.0) & direc.notna()


def calm_wind_mask(wnd_spd: pd.Series) -> pd.Series:
    spd = pd.to_numeric(wnd_spd, errors="coerce")
    return spd.notna() & (spd <= 0.0)


def distribute_calm_to_polar_hist2d(hist2d: np.ndarray, calm_count: float) -> None:
    """Spread calm observations uniformly around the origin across all directions."""
    if calm_count <= 0 or hist2d.size == 0:
        return
    hist2d[0, :] += calm_count / hist2d.shape[1]


def add_calm_sentinel_to_polar_hist2d(hist2d: np.ndarray, dir_bin: int, speed_bin: int, count: float) -> None:
    if count <= 0 or hist2d.size == 0:
        return
    if dir_bin == CALM_DIR_BIN_SENTINEL:
        distribute_calm_to_polar_hist2d(hist2d, count)
        return
    s_idx = min(max(0, speed_bin), hist2d.shape[0] - 1)
    d_idx = ((dir_bin // 10) % 36)
    hist2d[s_idx, d_idx] += count


def categorize_speed(speed_mps: float) -> str:
    # ADAM wind speeds are stored in m/s; wind rose bands are in knots.
    speed = speed_mps * WIND_SPEED_KT_FACTOR
    if speed <= 3:
        return "1-3 kt"
    if speed <= 6:
        return "4-6 kt"
    if speed <= 10:
        return "6-10 kt"
    if speed <= 15:
        return "10-15 kt"
    if speed <= 20:
        return "15-20 kt"
    return ">20 kt"


def prepare_wind_rose_counts(wind_df: pd.DataFrame) -> tuple[pd.DataFrame, float, float]:
    """Return directional bin counts, calm count, and total wind obs count."""
    if wind_df.empty or "WND_DIR" not in wind_df.columns or "WND_SPD" not in wind_df.columns:
        return pd.DataFrame(columns=["dir_bin", "Speed Range", "Count"]), 0.0, 0.0

    work = wind_df.copy()
    work["WND_DIR"] = pd.to_numeric(work["WND_DIR"], errors="coerce")
    work["WND_SPD"] = pd.to_numeric(work["WND_SPD"], errors="coerce")
    work = work.dropna(subset=["WND_DIR", "WND_SPD"])
    if work.empty:
        return pd.DataFrame(columns=["dir_bin", "Speed Range", "Count"]), 0.0, 0.0

    calm_count = float((work["WND_SPD"] <= 0.0).sum())
    directional = work[work["WND_SPD"] > 0.0].copy()
    total_count = calm_count + float(len(directional))
    if directional.empty:
        return pd.DataFrame(columns=["dir_bin", "Speed Range", "Count"]), calm_count, total_count

    directional["dir_bin"] = ((directional["WND_DIR"] + 11.25) % 360 // 22.5 * 22.5).astype(float)
    directional["Speed Range"] = directional["WND_SPD"].apply(categorize_speed)
    grouped = (
        directional.groupby(["dir_bin", "Speed Range"], as_index=False)
        .size()
        .rename(columns={"size": "Count"})
    )
    return grouped, calm_count, total_count


def apply_wind_rose_calm_circle(fig: go.Figure, calm_count: float, total_count: float) -> None:
    if total_count <= 0 or calm_count <= 0:
        return
    calm_pct = calm_count / total_count * 100.0
    if calm_pct <= 0:
        return

    theta = np.linspace(0.0, 360.0, 73, endpoint=True)
    radius = np.full_like(theta, calm_pct, dtype=float)
    fig.add_trace(
        go.Scatterpolar(
            theta=theta,
            r=radius,
            mode="lines",
            name="Calm",
            legendgroup="Calm",
            fill="toself",
            fillcolor=_wind_rose_rgba_fill(WIND_ROSE_CALM_FILL) or WIND_ROSE_CALM_FILL,
            line=dict(color=WIND_ROSE_CALM_LINE, width=2.0),
            meta={"calmPct": calm_pct},
            hoverinfo="skip",
            showlegend=True,
            legendrank=0,
        )
    )


def build_wind_rose_figure(
    rose_counts: pd.DataFrame,
    *,
    icao: str,
    calm_count: float = 0.0,
    total_count: float = 0.0,
    apply_common: bool = False,
) -> go.Figure | None:
    if rose_counts.empty and calm_count <= 0:
        return None

    rose_data = rose_counts.copy()
    if not rose_data.empty:
        directional_total = float(rose_data["Count"].sum())
        rose_data["Frequency"] = (
            rose_data["Count"] / directional_total * 100.0 if directional_total > 0 else 0.0
        )
    else:
        rose_data["Frequency"] = []

    if rose_data.empty:
        rose_data = pd.DataFrame(columns=["dir_bin", "Speed Range", "Frequency"])

    fig_rose = px.bar_polar(
        rose_data,
        r="Frequency",
        theta="dir_bin",
        color="Speed Range",
        color_discrete_map=WIND_ROSE_SPEED_COLOR_MAP,
        title="Wind Rose",
        category_orders={"Speed Range": WIND_ROSE_SPEED_RANGE_ORDER},
    )
    fig_rose.update_traces(
        hovertemplate="Direction: %{theta}<br>Speed: %{fullData.name}<br>Frequency: %{r:.2f}%<extra></extra>"
    )
    for trace in fig_rose.data:
        if getattr(trace, "type", None) != "barpolar":
            continue
        speed_label = str(getattr(trace, "name", "") or "")
        if speed_label in WIND_ROSE_SPEED_RANGE_ORDER:
            trace.legendrank = WIND_ROSE_SPEED_RANGE_ORDER.index(speed_label) + 1

    bg_img_base64 = None
    try:
        airport_lat = COORDS_DF.loc[icao, "LAT"]
        airport_lon = COORDS_DF.loc[icao, "LONG"]
        bg_img_base64 = get_centered_background(float(airport_lat), float(airport_lon), zoom=ZOOM_LEVEL)
    except Exception:
        pass

    fig_rose.update_layout(
        legend=dict(bgcolor="rgba(255,255,255,0.88)", bordercolor="#c7d4ef", borderwidth=1),
        polar=dict(bgcolor="rgba(0,0,0,0)", angularaxis=dict(direction="clockwise", period=360)),
    )
    apply_wind_rose_style(fig_rose)
    if total_count <= 0:
        total_count = calm_count + float(rose_counts["Count"].sum()) if not rose_counts.empty else calm_count
    apply_wind_rose_calm_circle(fig_rose, calm_count, total_count)
    if apply_common:
        apply_common_layout(fig_rose)
    apply_topo_map_panel_layout(fig_rose, "wind_rose")
    if bg_img_base64:
        apply_polar_background(fig_rose, bg_img_base64)
    return fig_rose


def contains_any_token(row_values: list[Any], tokens: list[str]) -> bool:
    joined = " ".join(str(v) for v in row_values).upper()
    return any(token in joined for token in tokens)


def token_mask_from_fields(df: pd.DataFrame, fields: list[str], tokens: list[str]) -> pd.Series:
    available_fields = [field for field in fields if field in df.columns]
    if not available_fields:
        return pd.Series(False, index=df.index)

    pattern = "|".join(re.escape(t) for t in tokens)
    merged = df[available_fields[0]].fillna("").astype(str).str.upper()
    for field in available_fields[1:]:
        merged = merged + " " + df[field].fillna("").astype(str).str.upper()
    return merged.str.contains(pattern, regex=True, na=False)


def token_mask_from_columns(df: pd.DataFrame, tokens: list[str]) -> pd.Series:
    return token_mask_from_fields(df, ["PRST_WX_PHENOM_1", "PRST_WX_PHENOM_2"], tokens)


def compute_daily_weather_flags(df: pd.DataFrame, icao: str) -> tuple[pd.DataFrame, pd.DataFrame]:
    if df.empty:
        empty = df.copy()
        return empty, pd.DataFrame(columns=["bom_day", "bom_year", "bom_month", "Rain", "Thunderstorm"])

    work = df.copy()
    work["TM_FULL"] = pd.to_datetime(work["TM_FULL"], utc=True, errors="coerce")
    work = work.dropna(subset=["TM_FULL"])
    if work.empty:
        return work, pd.DataFrame(columns=["bom_day", "bom_year", "bom_month", "Rain", "Thunderstorm"])

    tz_name = airport_timezone(icao)
    local_ts = work["TM_FULL"].dt.tz_convert(tz_name)
    work["bom_day"] = (local_ts - pd.Timedelta(hours=9)).dt.date
    work["bom_month"] = pd.to_datetime(work["bom_day"]).dt.month
    work["bom_year"] = pd.to_datetime(work["bom_day"]).dt.year

    rain_fields = ["PRST_WX_DSC_1", "PRST_WX_PHENOM_1", "PRST_WX_DSC_2", "PRST_WX_PHENOM_2"]
    work["is_rain_token_obs"] = token_mask_from_fields(work, rain_fields, ["RA", "DZ", "SH", "TS"])
    if "PRCP_FM_09" in work.columns:
        work["is_rain_amount_obs"] = pd.to_numeric(work["PRCP_FM_09"], errors="coerce").fillna(0.0) > 0.2
    else:
        work["is_rain_amount_obs"] = False
    work["is_rain_day_obs"] = work["is_rain_token_obs"] | work["is_rain_amount_obs"]
    # Thunderstorm day = at least one strike within 8 km of ICAO on that BoM day.
    work["is_ts_day_obs"] = lightning_day_within_radius_mask(work, icao, day_field="bom_day")

    daily_flags = (
        work.groupby(["bom_day", "bom_year", "bom_month"], as_index=False)
        .agg(
            Rain=("is_rain_day_obs", "any"),
            Thunderstorm=("is_ts_day_obs", "any"),
        )
    )
    return work, daily_flags


HOURLY_THUNDER_HOUR_TYPE = "ThunderHour"
HOURLY_THUNDER_HOUR_LABEL = "Thunderstorm"
# Backward-compatible aliases used by existing precompute rows until regenerated.
HOURLY_STRIKE_MAGNITUDE_TYPE = HOURLY_THUNDER_HOUR_TYPE
HOURLY_STRIKE_MAGNITUDE_LABEL = HOURLY_THUNDER_HOUR_LABEL


def hourly_thunder_hour_counts(strike_hourly: pd.DataFrame) -> pd.DataFrame:
    """Unique BoM days per year/month/UTC hour with at least one strike within 8 km."""
    columns = ["bom_year", "bom_month", "hour", "Count"]
    if strike_hourly.empty:
        return pd.DataFrame(columns=columns)
    return (
        strike_hourly.groupby(["bom_year", "bom_month", "hour"], as_index=False)
        .agg(Count=("bom_day", "nunique"))
    )


def lightning_hourly_strike_counts(icao: str) -> pd.DataFrame:
    """Strike counts per BoM day and UTC hour within 8 km of the aerodrome."""
    columns = [
        "bom_day",
        "bom_year",
        "bom_month",
        "hour",
        "year",
        "month",
        "day",
        "strike_count",
        "Thunderstorm",
    ]
    empty = pd.DataFrame(columns=columns)
    coords = airport_lat_lon(icao)
    if coords is None:
        return empty

    airport_lat, airport_lon = coords
    lightning_df = load_lightning_df(icao)
    if lightning_df.is_empty():
        return empty

    strikes = lightning_df.select(["LTGN_TM", "LAT", "LONG"]).drop_nulls().to_pandas()
    if strikes.empty:
        return empty

    strikes["LTGN_TM"] = pd.to_datetime(strikes["LTGN_TM"], utc=True, errors="coerce")
    strikes = strikes.dropna(subset=["LTGN_TM", "LAT", "LONG"])
    if strikes.empty:
        return empty

    lat_pad = LIGHTNING_RADIUS_KM / 111.0
    lon_scale = max(0.1, math.cos(math.radians(airport_lat)))
    lon_pad = LIGHTNING_RADIUS_KM / (111.0 * lon_scale)
    strikes = strikes[
        strikes["LAT"].between(airport_lat - lat_pad, airport_lat + lat_pad)
        & strikes["LONG"].between(airport_lon - lon_pad, airport_lon + lon_pad)
    ]
    if strikes.empty:
        return empty

    distances = haversine_distance_km(
        airport_lat,
        airport_lon,
        strikes["LAT"].to_numpy(dtype=float),
        strikes["LONG"].to_numpy(dtype=float),
    )
    nearby = strikes.loc[distances <= LIGHTNING_RADIUS_KM].copy()
    if nearby.empty:
        return empty

    nearby = nearby[nearby["LTGN_TM"].dt.year >= LIGHTNING_STATS_MIN_YEAR].copy()
    if nearby.empty:
        return empty

    tz_name = airport_timezone(icao)
    local_ts = nearby["LTGN_TM"].dt.tz_convert(tz_name)
    nearby["bom_day"] = (local_ts - pd.Timedelta(hours=9)).dt.date
    nearby["bom_year"] = pd.to_datetime(nearby["bom_day"]).dt.year
    nearby["bom_month"] = pd.to_datetime(nearby["bom_day"]).dt.month
    nearby["hour"] = nearby["LTGN_TM"].dt.hour.astype(int)
    nearby["year"] = nearby["LTGN_TM"].dt.year.astype(int)
    nearby["month"] = nearby["LTGN_TM"].dt.month.astype(int)
    nearby["day"] = nearby["LTGN_TM"].dt.day.astype(int)

    hourly = (
        nearby.groupby(["bom_day", "bom_year", "bom_month", "hour", "year", "month", "day"], as_index=False)
        .size()
        .rename(columns={"size": "strike_count"})
    )
    hourly["Thunderstorm"] = hourly["strike_count"] > 0
    return hourly[columns]


def lightning_hourly_thunder_day_flags(icao: str) -> pd.DataFrame:
    """One row per BoM day and UTC hour with at least one strike within 8 km."""
    hourly = lightning_hourly_strike_counts(icao)
    if hourly.empty:
        return pd.DataFrame(columns=["bom_day", "bom_year", "bom_month", "hour", "year", "month", "day", "Thunderstorm"])
    flags = hourly[hourly["Thunderstorm"]].copy()
    flags["Thunderstorm"] = True
    return flags[["bom_day", "bom_year", "bom_month", "hour", "year", "month", "day", "Thunderstorm"]]


def compute_hourly_rain_thunder_day_flags(
    precip_df: pd.DataFrame,
    icao: str,
    *,
    thunder_hourly: pd.DataFrame | None = None,
) -> pd.DataFrame:
    """Rain/thunder day flags per BoM day and UTC hour (same rules as daily precipitation)."""
    columns = ["bom_day", "bom_year", "bom_month", "hour", "Rain", "Thunderstorm"]
    empty = pd.DataFrame(columns=columns)
    if precip_df.empty and (thunder_hourly is None or thunder_hourly.empty):
        return empty

    rain_hourly = empty.copy()
    if not precip_df.empty:
        work = precip_df.copy()
        work["TM_FULL"] = pd.to_datetime(work["TM_FULL"], utc=True, errors="coerce")
        work = work.dropna(subset=["TM_FULL"])
        if not work.empty:
            tz_name = airport_timezone(icao)
            local_ts = work["TM_FULL"].dt.tz_convert(tz_name)
            work["bom_day"] = (local_ts - pd.Timedelta(hours=9)).dt.date
            work["bom_year"] = pd.to_datetime(work["bom_day"]).dt.year
            work["bom_month"] = pd.to_datetime(work["bom_day"]).dt.month
            if "hour" in work.columns:
                work["hour"] = pd.to_numeric(work["hour"], errors="coerce")
            else:
                work["hour"] = work["TM_FULL"].dt.hour
            work = work.dropna(subset=["hour"])
            work["hour"] = work["hour"].astype(int)

            rain_fields = ["PRST_WX_DSC_1", "PRST_WX_PHENOM_1", "PRST_WX_DSC_2", "PRST_WX_PHENOM_2"]
            work["is_rain_obs"] = token_mask_from_fields(work, rain_fields, ["RA", "DZ", "SH", "TS"])
            if "PRCP_FM_09" in work.columns:
                work["is_rain_amount_obs"] = pd.to_numeric(work["PRCP_FM_09"], errors="coerce").fillna(0.0) > 0.2
            else:
                work["is_rain_amount_obs"] = False
            work["is_rain_obs"] = work["is_rain_obs"] | work["is_rain_amount_obs"]

            rain_hourly = work.groupby(["bom_day", "bom_year", "bom_month", "hour"], as_index=False).agg(
                Rain=("is_rain_obs", "any"),
            )

    if thunder_hourly is None:
        thunder_hourly = lightning_hourly_thunder_day_flags(icao)
    thunder_part = pd.DataFrame(columns=["bom_day", "bom_year", "bom_month", "hour", "Thunderstorm"])
    if thunder_hourly is not None and not thunder_hourly.empty:
        thunder_part = thunder_hourly[["bom_day", "bom_year", "bom_month", "hour", "Thunderstorm"]].copy()

    if rain_hourly.empty and thunder_part.empty:
        return empty

    merged = rain_hourly.merge(
        thunder_part,
        on=["bom_day", "bom_year", "bom_month", "hour"],
        how="outer",
    )
    merged["Rain"] = merged.get("Rain", False)
    merged["Rain"] = merged["Rain"].fillna(False).astype(bool)
    merged["Thunderstorm"] = merged.get("Thunderstorm", False)
    merged["Thunderstorm"] = merged["Thunderstorm"].fillna(False).astype(bool)
    return merged[columns]


def hourly_precip_rain_observation_mask(df: pd.DataFrame) -> pd.Series:
    """Precipitating observation: rain/drizzle/shower/thunder present weather or PRCP_10 > 0.2 mm."""
    if df.empty:
        return pd.Series(dtype=bool)

    rain_fields = ["PRST_WX_DSC_1", "PRST_WX_PHENOM_1", "PRST_WX_DSC_2", "PRST_WX_PHENOM_2"]
    is_rain_token = token_mask_from_fields(df, rain_fields, ["RA", "DZ", "SH", "TS"])

    if "PRCP_10" not in df.columns:
        is_rain_amount = pd.Series(False, index=df.index)
    else:
        is_rain_amount = pd.to_numeric(df["PRCP_10"], errors="coerce").fillna(0.0) > 0.2

    return is_rain_token | is_rain_amount


def hourly_precip_rain_observation_counts(precip_df: pd.DataFrame) -> pd.DataFrame:
    """Count precipitating observations by calendar year, month, and UTC hour."""
    columns = ["year", "month", "hour", "Count"]
    if precip_df.empty:
        return pd.DataFrame(columns=columns)

    work = precip_df.copy()
    work["TM_FULL"] = pd.to_datetime(work["TM_FULL"], utc=True, errors="coerce")
    work = work.dropna(subset=["TM_FULL"])
    if work.empty:
        return pd.DataFrame(columns=columns)

    work["hour"] = work["TM_FULL"].dt.hour.astype(int)
    work["year"] = work["TM_FULL"].dt.year.astype(int)
    work["month"] = work["TM_FULL"].dt.month.astype(int)
    rain_obs = work[hourly_precip_rain_observation_mask(work)].copy()
    if rain_obs.empty:
        return pd.DataFrame(columns=columns)

    return (
        rain_obs.groupby(["year", "month", "hour"], as_index=False)
        .size()
        .rename(columns={"size": "Count"})
    )


def aggregate_hourly_rain_thunder_chart(hourly_df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Average rain observation counts (primary) and thunder hours (secondary) by UTC hour across years."""
    empty_bars = pd.DataFrame(columns=["hour", "Type", "Count"])
    empty_mag = pd.DataFrame(columns=["hour", "Count"])
    if hourly_df.empty:
        return empty_bars, empty_mag

    rain_df = hourly_df[hourly_df["Type"] == "Rain"].copy()
    mag_df = hourly_df[
        hourly_df["Type"].isin({HOURLY_THUNDER_HOUR_TYPE, "StrikeMagnitude"})
        & (hourly_df["year"] >= LIGHTNING_STATS_MIN_YEAR)
    ].copy()

    if rain_df.empty:
        bar_agg = empty_bars
    else:
        bar_agg = (
            rain_df.groupby(["year", "hour", "Type"], as_index=False)["Count"]
            .sum()
            .groupby(["hour", "Type"], as_index=False)["Count"]
            .mean()
        )

    if mag_df.empty:
        mag_agg = empty_mag
    else:
        mag_agg = (
            mag_df.groupby(["year", "hour"], as_index=False)["Count"]
            .sum()
            .groupby("hour", as_index=False)["Count"]
            .mean()
        )

    return bar_agg, mag_agg


def build_hourly_rain_thunder_figure(
    hourly_agg: pd.DataFrame,
    magnitude_agg: pd.DataFrame | None = None,
) -> go.Figure | None:
    if hourly_agg.empty and (magnitude_agg is None or magnitude_agg.empty):
        return None

    hour_numbers = list(range(24))
    hour_hover_labels = [f"{hour:02d}Z" for hour in hour_numbers]
    pair_offset = 0.22
    bar_width = 0.38
    rain_x = [hour - pair_offset for hour in hour_numbers]
    mag_x = [hour + pair_offset for hour in hour_numbers]

    rain_by_hour = (
        hourly_agg[hourly_agg["Type"] == "Rain"]
        .set_index("hour")["Count"]
        .reindex(hour_numbers, fill_value=0.0)
        .astype(float)
    )
    mag_by_hour = pd.Series(0.0, index=hour_numbers, dtype=float)
    if magnitude_agg is not None and not magnitude_agg.empty:
        mag_by_hour = (
            magnitude_agg.set_index("hour")["Count"]
            .reindex(hour_numbers, fill_value=0.0)
            .astype(float)
        )

    y1_max = _ceil_headroom(float(rain_by_hour.max())) if rain_by_hour.max() > 0 else 1.0
    y2_max = _ceil_headroom(float(mag_by_hour.max())) if mag_by_hour.max() > 0 else 1.0

    fig = go.Figure()
    if not hourly_agg.empty:
        fig.add_bar(
            x=rain_x,
            y=rain_by_hour.tolist(),
            name="Rain",
            marker_color="#2159d1",
            width=bar_width,
            customdata=hour_hover_labels,
            hovertemplate="Hour: %{customdata}<br>Rain: %{y:.2f}<extra></extra>",
        )

    if magnitude_agg is not None and not magnitude_agg.empty:
        fig.add_bar(
            x=mag_x,
            y=mag_by_hour.tolist(),
            name=HOURLY_THUNDER_HOUR_LABEL,
            yaxis="y2",
            marker_color="#c62828",
            opacity=0.85,
            width=bar_width,
            customdata=hour_hover_labels,
            hovertemplate="Hour: %{customdata}<br>Thunderstorm: %{y:.1f} hours<extra></extra>",
        )

    fig.update_layout(
        title="Hourly Rain Observations",
        legend_title_text="Category",
        yaxis=dict(
            title="Avg rain hours (per year)",
            range=[0, y1_max],
            autorange=False,
            rangemode="tozero",
        ),
        yaxis2=dict(
            title="Avg thunder hours (per year)",
            overlaying="y",
            side="right",
            range=[0, y2_max],
            autorange=False,
            rangemode="tozero",
            showgrid=False,
        ),
    )
    fig.update_xaxes(
        title_text="",
        tickmode="array",
        tickvals=[0, 5, 10, 15, 20],
        ticktext=["00Z", "05Z", "10Z", "15Z", "20Z"],
        showgrid=False,
        range=[-0.8, 23.8],
    )
    return fig


def apply_hourly_precip_dual_axis_layout(fig: Any) -> None:
    """Restore paired-bar dual-axis ranges after grouped-bar layout helpers."""
    if fig is None:
        return

    y1_max = 1.0
    y2_max = 1.0
    for trace in fig.data:
        if getattr(trace, "type", None) != "bar":
            continue
        y_values = [float(v) for v in (trace.y or []) if v is not None and pd.notna(v)]
        if not y_values:
            continue
        trace_max = max(y_values)
        if getattr(trace, "yaxis", None) == "y2":
            y2_max = max(y2_max, _ceil_headroom(trace_max))
        else:
            y1_max = max(y1_max, _ceil_headroom(trace_max))

    fig.update_layout(
        yaxis={
            **(fig.layout.yaxis.to_plotly_json() if fig.layout.yaxis else {}),
            "range": [0, y1_max],
            "autorange": False,
            "rangemode": "tozero",
        },
        yaxis2={
            **(fig.layout.yaxis2.to_plotly_json() if fig.layout.yaxis2 else {}),
            "overlaying": "y",
            "side": "right",
            "range": [0, y2_max],
            "autorange": False,
            "rangemode": "tozero",
            "showgrid": False,
        },
    )
    if fig.layout.yaxis2 is not None:
        fig.layout.yaxis2.domain = None
    fig.update_xaxes(range=[-0.8, 23.8], showgrid=False)


def fog_observation_mask(df: pd.DataFrame) -> pd.Series:
    explicit_fog = token_mask_from_fields(df, ["PRST_WX_PHENOM_1", "PRST_WX_PHENOM_2"], ["FG"])

    air_temp = pd.to_numeric(df.get("AIR_TEMP"), errors="coerce")
    dewpoint = pd.to_numeric(df.get("DWPT"), errors="coerce")
    prcp_10 = pd.to_numeric(df.get("PRCP_10"), errors="coerce")
    vsby = pd.to_numeric(df.get("VSBY"), errors="coerce")
    aws_vsby = pd.to_numeric(df.get("AWS_VSBY"), errors="coerce")

    tight_temp_spread = (air_temp - dewpoint) < 2.0
    light_precip = prcp_10 < 0.2
    low_visibility = vsby.lt(1.0) | aws_vsby.lt(1.0)

    inferred_fog = tight_temp_spread & light_precip & low_visibility
    return explicit_fog | inferred_fog.fillna(False)


def fog_low_cloud_mask(df: pd.DataFrame) -> pd.Series:
    fog = fog_observation_mask(df)
    cld1 = df["CEIL_CLD_AMT_1"].fillna("").astype(str).str.startswith(("BKN", "OVC"))
    cld2 = df["CEIL_CLD_AMT_2"].fillna("").astype(str).str.startswith(("BKN", "OVC"))
    return fog | cld1 | cld2


def lowest_low_cloud_ceiling(df: pd.DataFrame) -> pd.Series:
    cld1 = df["CEIL_CLD_AMT_1"].fillna("").astype(str).str.upper().str.startswith(("BKN", "OVC"))
    cld2 = df["CEIL_CLD_AMT_2"].fillna("").astype(str).str.upper().str.startswith(("BKN", "OVC"))
    h1 = pd.to_numeric(df.get("CEIL_CLD_HT_1"), errors="coerce").where(cld1)
    h2 = pd.to_numeric(df.get("CEIL_CLD_HT_2"), errors="coerce").where(cld2)
    return pd.concat([h1, h2], axis=1).min(axis=1, skipna=True)


def extract_low_cloud_heights(df: pd.DataFrame, bucket_col: str) -> pd.DataFrame:
    low_cloud_df = df.copy()
    low_cloud_df["is_low_cloud"] = token_mask_from_fields(low_cloud_df, ["CEIL_CLD_AMT_1", "CEIL_CLD_AMT_2"], ["BKN", "OVC"])
    low_cloud_df = low_cloud_df[low_cloud_df["is_low_cloud"]].copy()
    if low_cloud_df.empty:
        return pd.DataFrame(columns=[bucket_col, "height", "Threshold"])

    height_frames = [
        low_cloud_df[[bucket_col, "CEIL_CLD_HT_1"]].rename(columns={"CEIL_CLD_HT_1": "height"}),
        low_cloud_df[[bucket_col, "CEIL_CLD_HT_2"]].rename(columns={"CEIL_CLD_HT_2": "height"}),
    ]
    height_df = pd.concat(height_frames, ignore_index=True)
    height_df["height"] = pd.to_numeric(height_df["height"], errors="coerce")
    height_df = height_df.dropna(subset=["height"])
    if height_df.empty:
        return pd.DataFrame(columns=[bucket_col, "height", "Threshold"])

    height_df["Threshold"] = "below 2000ft"
    height_df.loc[height_df["height"] < 1500, "Threshold"] = "below 1500ft"
    height_df.loc[height_df["height"] < 1000, "Threshold"] = "below 1000ft"
    height_df.loc[height_df["height"] < 500, "Threshold"] = "below 500ft"
    return height_df


def monthly_flag_frequency(
    df: pd.DataFrame,
    tokens: list[str],
    target_col: str,
    fields: list[str] | None = None,
) -> pd.DataFrame:
    if df.empty:
        return pd.DataFrame(columns=["year", "month", target_col, "date"])
    source_fields = fields or ["PRST_WX_PHENOM_1", "PRST_WX_PHENOM_2"]
    df[target_col] = token_mask_from_fields(df, source_fields, tokens).astype(int)
    monthly = df.groupby(["year", "month"])[target_col].sum().reset_index()
    monthly["date"] = pd.to_datetime(dict(year=monthly["year"], month=monthly["month"], day=1))
    return monthly


def selected_month_numbers(month_start: int, month_end: int, invert: bool = False) -> list[int]:
    selected: set[int] = set()
    for month in range(1, 13):
        if invert:
            # Keep boundary months when inverted to mirror build_range_mask behavior.
            keep = (month <= month_start) or (month >= month_end)
        elif month_start <= month_end:
            keep = month_start <= month <= month_end
        else:
            keep = month >= month_start or month <= month_end
        if keep:
            selected.add(month)

    if not selected:
        return []

    anchor = month_end if invert else month_start
    ordered: list[int] = []
    for offset in range(12):
        month = ((anchor - 1 + offset) % 12) + 1
        if month in selected:
            ordered.append(month)
    return ordered


def month_labels_for_numbers(month_numbers: list[int]) -> list[str]:
    return [MONTH_NAMES[m - 1] for m in month_numbers]


def paired_monthly_frequency(df: pd.DataFrame, categories: dict[str, list[str]]) -> pd.DataFrame:
    if df.empty:
        return pd.DataFrame(columns=["month", "Type", "Count", "Month"])

    monthly_frames: list[pd.DataFrame] = []
    for label, spec in categories.items():
        tokens = spec["tokens"]
        fields = spec["fields"]
        monthly = monthly_flag_frequency(df.copy(), tokens, label, fields=fields)
        if monthly.empty:
            continue
        monthly = monthly.groupby("month")[label].mean().reset_index()
        monthly["Type"] = label
        monthly.rename(columns={label: "Count"}, inplace=True)
        monthly_frames.append(monthly)

    if not monthly_frames:
        return pd.DataFrame(columns=["month", "Type", "Count", "Month"])

    paired = pd.concat(monthly_frames, ignore_index=True)
    paired["Month"] = paired["month"].apply(lambda m: MONTH_NAMES[m - 1])
    paired["Month"] = pd.Categorical(paired["Month"], categories=MONTH_NAMES, ordered=True)
    paired = paired.sort_values(["Month", "Type"])
    return paired


def average_monthly_gale_weather_counts(
    df: pd.DataFrame,
    icao: str,
    month_numbers: list[int],
) -> pd.DataFrame:
    """
    Return average monthly gale counts split by weather category.
    Missing month/category/year combinations are zero-filled before averaging so
    stacked category means reconcile with total monthly means.
    """
    full_index = pd.MultiIndex.from_product(
        [month_numbers, GALE_WEATHER_CATEGORIES],
        names=["month", "Category"],
    )
    empty = pd.DataFrame(index=full_index).reset_index()
    empty["Count"] = 0.0

    if df.empty:
        return empty

    years = (
        pd.to_numeric(df.get("year"), errors="coerce")
        .dropna()
        .astype(int)
        .unique()
        .tolist()
    )
    if not years:
        return empty

    # Gale definition: WND_SPD > 34 knots OR MAX_WND_GUST_10 > 41 knots.
    # ADAM stores speeds in m/s, so convert thresholds to 17.49 / 21.09 m/s.
    gale_mask = (df["WND_SPD"].fillna(-9999) > 17.49) | (df["MAX_WND_GUST_10"].fillna(-9999) > 21.09)
    gale_obs = df[gale_mask].copy()

    if not gale_obs.empty:
        dsc = (gale_obs["PRST_WX_DSC_1"].fillna("").astype(str) + " " + gale_obs["PRST_WX_DSC_2"].fillna("").astype(str)).str.upper()
        phenom = (gale_obs["PRST_WX_PHENOM_1"].fillna("").astype(str) + " " + gale_obs["PRST_WX_PHENOM_2"].fillna("").astype(str)).str.upper()
        prcp_10 = pd.to_numeric(gale_obs["PRCP_10"], errors="coerce").fillna(0.0)

        is_ts = lightning_proximity_mask(gale_obs, icao, time_field="TM_FULL")
        is_shra = (dsc.str.contains("SH", regex=False) & phenom.str.contains("RA", regex=False)) | (prcp_10 > 0.2)

        gale_obs["Category"] = "No wx"
        gale_obs.loc[is_shra, "Category"] = "SHRA"
        gale_obs.loc[is_ts, "Category"] = "TS"

        monthly_counts = gale_obs.groupby(["year", "month", "Category"]).size().reset_index(name="Gales")
    else:
        monthly_counts = pd.DataFrame(columns=["year", "month", "Category", "Gales"])

    # Non-TS categories use all selected years as the denominator.
    non_ts_cats = ["No wx", "SHRA"]
    full_year_month_non_ts = pd.MultiIndex.from_product(
        [sorted(years), month_numbers, non_ts_cats],
        names=["year", "month", "Category"],
    )
    non_ts_counts = (
        monthly_counts[monthly_counts["Category"].isin(non_ts_cats)]
        .set_index(["year", "month", "Category"])
        .reindex(full_year_month_non_ts, fill_value=0)
        .reset_index()
    )

    # TS uses only years >= LIGHTNING_STATS_MIN_YEAR as the denominator.
    ts_years = sorted([y for y in years if y >= LIGHTNING_STATS_MIN_YEAR])
    if ts_years:
        full_year_month_ts = pd.MultiIndex.from_product(
            [ts_years, month_numbers, ["TS"]],
            names=["year", "month", "Category"],
        )
        ts_counts = (
            monthly_counts[monthly_counts["Category"] == "TS"]
            .set_index(["year", "month", "Category"])
            .reindex(full_year_month_ts, fill_value=0)
            .reset_index()
        )
        combined_counts = pd.concat([non_ts_counts, ts_counts], ignore_index=True)
    else:
        combined_counts = non_ts_counts

    monthly_avg = (
        combined_counts.groupby(["month", "Category"], as_index=False)["Gales"]
        .mean()
        .rename(columns={"Gales": "Count"})
    )

    monthly_avg = empty.drop(columns=["Count"]).merge(monthly_avg, on=["month", "Category"], how="left")
    monthly_avg["Count"] = monthly_avg["Count"].fillna(0.0)
    return monthly_avg


def build_fog_low_cloud_frequency_from_combined(
    combined: pd.DataFrame,
    title: str,
    month_numbers: list[int],
) -> go.Figure:
    month_labels = month_labels_for_numbers(month_numbers)
    month_positions = list(range(1, len(month_numbers) + 1))

    threshold_order = ["below 500ft", "below 1000ft", "below 1500ft", "below 2000ft"]
    combined_sorted = combined.copy()
    combined_sorted["Threshold"] = combined_sorted["Threshold"].fillna("N/A")

    threshold_colors = {
        "below 500ft": "#8b0000",
        "below 1000ft": "#c62828",
        "below 1500ft": "#e57373",
        "below 2000ft": "#ef9a9a",
    }

    low_cloud_stack = (
        combined_sorted[combined_sorted["Type"] == "Low cloud"]
        .pivot_table(index="Month", columns="Threshold", values="Count", aggfunc="sum")
        .reindex(month_labels)
        .fillna(0.0)
    )
    fog_series = _fog_stack_series(
        combined_sorted,
        index_col="Month",
        index_labels=month_labels,
    )

    total_low_cloud = float(low_cloud_stack.to_numpy().sum()) if not low_cloud_stack.empty else 0.0
    total_fog = sum(sum(values) for values in fog_series.values())
    if (total_low_cloud + total_fog) <= 0.0:
        return build_placeholder_figure(title)

    low_cloud_x = [month - 0.22 for month in month_positions]
    fog_x = [month + 0.22 for month in month_positions]
    bar_width = 0.38

    fig = go.Figure()
    fig.add_bar(
        x=low_cloud_x,
        y=[0.0] * len(month_labels),
        showlegend=False,
        hoverinfo="skip",
        marker_color="rgba(0,0,0,0)",
        width=bar_width,
    )
    fig.add_bar(
        x=fog_x,
        y=[0.0] * len(month_labels),
        showlegend=False,
        hoverinfo="skip",
        marker_color="rgba(0,0,0,0)",
        width=bar_width,
    )

    for threshold in threshold_order:
        y_values = low_cloud_stack[threshold].astype(float).tolist() if threshold in low_cloud_stack.columns else [0.0] * len(month_labels)
        display_label = FOG_LOW_CLOUD_THRESHOLD_LABELS[threshold]
        fig.add_bar(
            x=low_cloud_x,
            y=y_values,
            name=display_label,
            marker_color=threshold_colors[threshold],
            customdata=month_labels,
            width=bar_width,
            hovertemplate=(
                "Month: %{customdata}<br>"
                f"{display_label}: %{{y:.2f}}%<extra></extra>"
            ),
        )

    _add_fog_stack_bars(
        fig,
        x_values=fog_x,
        index_labels=month_labels,
        fog_series=fog_series,
        hover_prefix="Month",
        bar_width=bar_width,
    )

    fig.update_layout(
        title=title,
        barmode="stack",
        legend_title_text="Category",
    )
    fig.update_xaxes(
        title_text="",
        tickmode="array",
        tickvals=month_positions,
        ticktext=month_labels,
        showgrid=False,
        range=[0.2, len(month_positions) + 0.8],
    )
    fig.update_yaxes(title_text="Share of Days (%)")
    apply_side_legend(
        fig,
        width_px=WIDE_LEGEND_ENTRY_WIDTH,
        font_size=10,
        top_margin=36,
        title_text="Category",
        bgcolor="rgba(255,255,255,0.92)",
    )
    return fig


def build_fog_low_cloud_frequency_figure(
    fog_df: pd.DataFrame,
    title: str,
    icao: str,
    month_numbers: list[int],
) -> go.Figure:
    combined = average_monthly_fog_low_cloud_days(fog_df, icao)
    return build_fog_low_cloud_frequency_from_combined(combined, title, month_numbers)


def filter_precomputed_rows_by_state(
    frame: pd.DataFrame,
    *,
    enso: str,
    iod: str,
    sam: str,
    mjo: str,
) -> pd.DataFrame:
    if frame.empty:
        return frame

    selected = {
        "enso_norm": normalize_driver_selection(enso),
        "iod_norm": normalize_driver_selection(iod),
        "sam_norm": normalize_driver_selection(sam),
        "mjo_norm": normalize_driver_selection(mjo),
    }

    if all(value == "all" for value in selected.values()):
        all_rows = frame[
            (frame["enso_norm"] == "all")
            & (frame["iod_norm"] == "all")
            & (frame["sam_norm"] == "all")
            & (frame["mjo_norm"] == "all")
        ]
        if not all_rows.empty:
            return all_rows
        return frame

    filtered = frame
    for col_name, value in selected.items():
        if value != "all":
            filtered = filtered[filtered[col_name] == value]
    return filtered


def filter_precomputed_rows_by_time(
    frame: pd.DataFrame,
    *,
    year_col: str,
    month_col: str,
    year_start: int,
    year_end: int,
    month_numbers: list[int],
    season: str,
) -> pd.DataFrame:
    if frame.empty:
        return frame

    season_months = set(SEASON_TO_MONTHS.get(season, SEASON_TO_MONTHS["all"]))
    selected_months = [m for m in month_numbers if m in season_months]
    if not selected_months:
        return frame.head(0)

    return frame[
        (frame[year_col] >= year_start)
        & (frame[year_col] <= year_end)
        & (frame[month_col].isin(selected_months))
    ].copy()


def build_overview_fog_figure_from_precomputed(
    icao: str,
    *,
    fog_mode: str,
    title: str,
    month_numbers: list[int],
    season: str,
    year_start: int,
    year_end: int,
    enso: str,
    iod: str,
    sam: str,
    mjo: str,
) -> go.Figure | None:
    mode_rows = load_precomputed_overview_fog_monthly_for_airport(icao).get(fog_mode, [])
    if not mode_rows:
        return None

    monthly_counts = pd.DataFrame(mode_rows)
    if monthly_counts.empty:
        return None

    season_months = set(SEASON_TO_MONTHS.get(season, SEASON_TO_MONTHS["all"]))
    selected_months = [m for m in month_numbers if m in season_months]
    if not selected_months:
        return None

    monthly_counts = monthly_counts[
        (monthly_counts["bom_year"] >= year_start)
        & (monthly_counts["bom_year"] <= year_end)
        & (monthly_counts["bom_month"].isin(selected_months))
    ].copy()
    if monthly_counts.empty:
        return None

    selected = {
        "enso_norm": normalize_driver_selection(enso),
        "iod_norm": normalize_driver_selection(iod),
        "sam_norm": normalize_driver_selection(sam),
        "mjo_norm": normalize_driver_selection(mjo),
    }
    if all(value == "all" for value in selected.values()):
        all_rows = monthly_counts[
            (monthly_counts["enso_norm"] == "all")
            & (monthly_counts["iod_norm"] == "all")
            & (monthly_counts["sam_norm"] == "all")
            & (monthly_counts["mjo_norm"] == "all")
        ]
        if not all_rows.empty:
            monthly_counts = all_rows
    else:
        for col_name, value in selected.items():
            if value != "all":
                monthly_counts = monthly_counts[monthly_counts[col_name] == value]
    monthly_avg = monthly_fog_rates_from_precomputed_rows(
        mode_rows,
        None,
        year_start,
        year_end,
        set(selected_months),
        selected_state=selected,
        require_all_only=all(value == "all" for value in selected.values()),
    )
    if monthly_avg.empty:
        return None

    combined = combined_fog_frequency_from_monthly_avg(monthly_avg)
    if combined.empty:
        return None

    return build_fog_low_cloud_frequency_from_combined(combined, title, selected_months)


def build_overview_rain_thunder_figure_from_precomputed(
    icao: str,
    *,
    month_numbers: list[int],
    season: str,
    year_start: int,
    year_end: int,
    enso: str,
    iod: str,
    sam: str,
    mjo: str,
) -> go.Figure | None:
    rows = load_precomputed_overview_rain_thunder_monthly_for_airport(icao)
    if not rows:
        return None

    monthly_counts = pd.DataFrame(rows)
    if monthly_counts.empty:
        return None

    season_months = set(SEASON_TO_MONTHS.get(season, SEASON_TO_MONTHS["all"]))
    selected_months = [m for m in month_numbers if m in season_months]
    if not selected_months:
        return None

    monthly_counts = monthly_counts[
        (monthly_counts["bom_year"] >= year_start)
        & (monthly_counts["bom_year"] <= year_end)
        & (monthly_counts["bom_month"].isin(selected_months))
    ].copy()
    if monthly_counts.empty:
        return None

    selected = {
        "enso_norm": normalize_driver_selection(enso),
        "iod_norm": normalize_driver_selection(iod),
        "sam_norm": normalize_driver_selection(sam),
        "mjo_norm": normalize_driver_selection(mjo),
    }
    if all(value == "all" for value in selected.values()):
        # Prefer explicit all-days aggregates so overview matches precipitation-tab values.
        all_rows = monthly_counts[
            (monthly_counts["enso_norm"] == "all")
            & (monthly_counts["iod_norm"] == "all")
            & (monthly_counts["sam_norm"] == "all")
            & (monthly_counts["mjo_norm"] == "all")
        ]
        if not all_rows.empty:
            monthly_counts = all_rows
    else:
        for col_name, value in selected.items():
            if value != "all":
                monthly_counts = monthly_counts[monthly_counts[col_name] == value]
    if monthly_counts.empty:
        return None

    # Match live precipitation-tab behavior: compute monthly totals per year first,
    # then average those year-level totals by month.
    monthly_counts = (
        monthly_counts.groupby(["bom_year", "bom_month"], as_index=False)[["Rain", "Thunderstorm"]]
        .sum()
    )
    if monthly_counts.empty:
        return None

    rain_avg_m = (
        monthly_counts.groupby("bom_month", as_index=False)["Rain"]
        .mean()
        .rename(columns={"bom_month": "month"})
    )
    ts_avg_m = (
        monthly_counts[monthly_counts["bom_year"] >= LIGHTNING_STATS_MIN_YEAR]
        .groupby("bom_month", as_index=False)["Thunderstorm"]
        .mean()
        .rename(columns={"bom_month": "month"})
    )

    monthly_avg = rain_avg_m.merge(ts_avg_m, on="month", how="left")
    monthly_avg["Thunderstorm"] = monthly_avg["Thunderstorm"].fillna(0.0)
    if monthly_avg.empty:
        return None

    month_name_order = month_labels_for_numbers(month_numbers)
    monthly_avg = monthly_avg[monthly_avg["month"].isin(month_numbers)].copy()
    monthly_avg["Month"] = monthly_avg["month"].apply(lambda m: MONTH_NAMES[m - 1])
    monthly_avg["Month"] = pd.Categorical(monthly_avg["Month"], categories=month_name_order, ordered=True)
    monthly_avg = monthly_avg.sort_values("Month")

    rain_avg = monthly_avg.melt(
        id_vars=["month", "Month"],
        value_vars=["Rain", "Thunderstorm"],
        var_name="Type",
        value_name="Count",
    )
    rain_avg["Type"] = rain_avg["Type"].replace({"Thunderstorm": THUNDERSTORM_LEGEND_LABEL})

    fig_rain = px.bar(
        rain_avg,
        x="Month",
        y="Count",
        color="Type",
        barmode="group",
        color_discrete_map={"Rain": "#2159d1", THUNDERSTORM_LEGEND_LABEL: "#c62828"},
        labels={"Count": "Avg Days/Month", "Type": "Category"},
        title="Rain/Thunderstorm Days",
        category_orders={"Month": month_name_order, "Type": ["Rain", THUNDERSTORM_LEGEND_LABEL]},
    )
    fig_rain.update_xaxes(title_text="")
    return fig_rain


def build_overview_wind_rose_figure_from_precomputed(
    icao: str,
    *,
    month_numbers: list[int],
    season: str,
    year_start: int,
    year_end: int,
    enso: str,
    iod: str,
    sam: str,
    mjo: str,
) -> go.Figure | None:
    rows = load_precomputed_overview_wind_rose_for_airport(icao)
    if not rows:
        return None

    rose_data = pd.DataFrame(rows)
    if rose_data.empty:
        return None

    season_months = set(SEASON_TO_MONTHS.get(season, SEASON_TO_MONTHS["all"]))
    selected_months = [m for m in month_numbers if m in season_months]
    if not selected_months:
        return None

    rose_data = rose_data[
        (rose_data["bom_year"] >= year_start)
        & (rose_data["bom_year"] <= year_end)
        & (rose_data["bom_month"].isin(selected_months))
    ].copy()
    if rose_data.empty:
        return None

    selected = {
        "enso_norm": normalize_driver_selection(enso),
        "iod_norm": normalize_driver_selection(iod),
        "sam_norm": normalize_driver_selection(sam),
        "mjo_norm": normalize_driver_selection(mjo),
    }
    if all(value == "all" for value in selected.values()):
        all_rows = rose_data[
            (rose_data["enso_norm"] == "all")
            & (rose_data["iod_norm"] == "all")
            & (rose_data["sam_norm"] == "all")
            & (rose_data["mjo_norm"] == "all")
        ]
        if not all_rows.empty:
            rose_data = all_rows
    else:
        for col_name, value in selected.items():
            if value != "all":
                rose_data = rose_data[rose_data[col_name] == value]
    if rose_data.empty:
        return None

    calm_mask = rose_data["Speed Range"] == WIND_ROSE_CALM_SPEED_RANGE
    calm_count = float(rose_data.loc[calm_mask, "Count"].sum()) if calm_mask.any() else 0.0
    rose_data = rose_data[~calm_mask].copy()
    if rose_data.empty and calm_count <= 0:
        return None

    rose_counts = (
        rose_data.groupby(["dir_bin", "Speed Range"], as_index=False)["Count"]
        .sum()
    )
    total_count = calm_count + float(rose_counts["Count"].sum()) if not rose_counts.empty else calm_count
    return build_wind_rose_figure(
        rose_counts,
        icao=icao,
        calm_count=calm_count,
        total_count=total_count,
    )


def build_wind_gale_weather_figure_from_precomputed(
    icao: str,
    *,
    month_numbers: list[int],
    season: str,
    year_start: int,
    year_end: int,
    enso: str,
    iod: str,
    sam: str,
    mjo: str,
) -> go.Figure | None:
    rows = load_precomputed_wind_gale_monthly_for_airport(icao)
    if not rows:
        return None

    gale_data = pd.DataFrame(rows)
    if gale_data.empty:
        return None

    season_months = set(SEASON_TO_MONTHS.get(season, SEASON_TO_MONTHS["all"]))
    selected_months = [m for m in month_numbers if m in season_months]
    if not selected_months:
        return None

    gale_data = gale_data[
        (gale_data["year"] >= year_start)
        & (gale_data["year"] <= year_end)
        & (gale_data["month"].isin(selected_months))
    ].copy()
    if gale_data.empty:
        return None

    selected = {
        "enso_norm": normalize_driver_selection(enso),
        "iod_norm": normalize_driver_selection(iod),
        "sam_norm": normalize_driver_selection(sam),
        "mjo_norm": normalize_driver_selection(mjo),
    }
    if all(value == "all" for value in selected.values()):
        all_rows = gale_data[
            (gale_data["enso_norm"] == "all")
            & (gale_data["iod_norm"] == "all")
            & (gale_data["sam_norm"] == "all")
            & (gale_data["mjo_norm"] == "all")
        ]
        if not all_rows.empty:
            gale_data = all_rows
    else:
        for col_name, value in selected.items():
            if value != "all":
                gale_data = gale_data[gale_data[col_name] == value]
    if gale_data.empty:
        return None

    monthly_avg = (
        gale_data.groupby(["month", "Category"], as_index=False)["Count"]
        .mean()
    )
    if monthly_avg.empty:
        return None

    month_name_order = month_labels_for_numbers(month_numbers)
    monthly_avg = monthly_avg[monthly_avg["month"].isin(month_numbers)].copy()
    monthly_avg["Month"] = monthly_avg["month"].apply(lambda m: MONTH_NAMES[m - 1])
    monthly_avg["Month"] = pd.Categorical(monthly_avg["Month"], categories=month_name_order, ordered=True)
    monthly_avg = monthly_avg.sort_values(["Month", "Category"])

    monthly_avg["Count"] = monthly_avg["Count"].apply(float)
    monthly_avg["Month"] = monthly_avg["Month"].astype(str)
    monthly_avg["Category"] = monthly_avg["Category"].replace({"TS": TS_LEGEND_LABEL})

    fig_gales = px.bar(
        monthly_avg,
        x="Month",
        y="Count",
        color="Category",
        barmode="stack",
        labels={"Count": "Avg Gale Obs/Month"},
        title="Monthly Gale Frequency by Weather Type",
        category_orders={"Month": month_name_order, "Category": ["No wx", "SHRA", TS_LEGEND_LABEL]},
        color_discrete_map={"No wx": "#7a7a7a", "SHRA": "#3b82c4", TS_LEGEND_LABEL: "#c62828"},
    )
    fig_gales.update_xaxes(title_text="")
    return fig_gales


def build_overview_temp_dewpoint_figure_from_precomputed(
    icao: str,
    *,
    month_numbers: list[int],
    season: str,
    year_start: int,
    year_end: int,
    enso: str,
    iod: str,
    sam: str,
    mjo: str,
) -> go.Figure | None:
    rows = load_precomputed_overview_temp_dewpoint_for_airport(icao)
    if not rows:
        return None

    temp_data = pd.DataFrame(rows)
    if temp_data.empty:
        return None

    season_months = set(SEASON_TO_MONTHS.get(season, SEASON_TO_MONTHS["all"]))
    selected_months = [m for m in month_numbers if m in season_months]
    if not selected_months:
        return None

    temp_data = temp_data[
        (temp_data["bom_year"] >= year_start)
        & (temp_data["bom_year"] <= year_end)
        & (temp_data["bom_month"].isin(selected_months))
    ].copy()
    if temp_data.empty:
        return None

    selected = {
        "enso_norm": normalize_driver_selection(enso),
        "iod_norm": normalize_driver_selection(iod),
        "sam_norm": normalize_driver_selection(sam),
        "mjo_norm": normalize_driver_selection(mjo),
    }
    if all(value == "all" for value in selected.values()):
        all_rows = temp_data[
            (temp_data["enso_norm"] == "all")
            & (temp_data["iod_norm"] == "all")
            & (temp_data["sam_norm"] == "all")
            & (temp_data["mjo_norm"] == "all")
        ]
        if not all_rows.empty:
            temp_data = all_rows
    else:
        for col_name, value in selected.items():
            if value != "all":
                temp_data = temp_data[temp_data[col_name] == value]
    if temp_data.empty:
        return None

    temp_avg = (
        temp_data.groupby("bom_month", as_index=False)[
            ["Avg Daily Max T", "Avg Daily Min T", "Avg Daily Max Td", "Avg Daily Min Td"]
        ]
        .mean()
        .rename(columns={"bom_month": "month"})
    )
    if temp_avg.empty:
        return None

    monthly_precip_avg = (
        temp_data.groupby("bom_month", as_index=False)["monthly_precip_mm"]
        .mean()
        .rename(columns={"bom_month": "month", "monthly_precip_mm": "Avg Monthly Precip"})
    )

    month_name_order = month_labels_for_numbers(month_numbers)
    temp_avg = temp_avg[temp_avg["month"].isin(month_numbers)].copy()
    temp_avg["Month"] = temp_avg["month"].apply(lambda m: MONTH_NAMES[m - 1])
    temp_avg["Month"] = pd.Categorical(temp_avg["Month"], categories=month_name_order, ordered=True)
    temp_avg = temp_avg.sort_values("Month")

    fig_temp = go.Figure()
    if not monthly_precip_avg.empty:
        monthly_precip_avg = monthly_precip_avg[monthly_precip_avg["month"].isin(month_numbers)].copy()
        monthly_precip_avg["Month"] = monthly_precip_avg["month"].apply(lambda m: MONTH_NAMES[m - 1])
        precip_by_month = (
            monthly_precip_avg.set_index("Month")["Avg Monthly Precip"]
            .reindex(month_name_order)
            .fillna(0.0)
        )
        fig_temp.add_bar(
            x=month_name_order,
            y=precip_by_month.astype(float).tolist(),
            name="Avg Monthly Precip",
            yaxis="y2",
            marker_color="#1565c0",
            marker_line_color="#0d47a1",
            marker_line_width=1,
            opacity=0.6,
            zorder=0,
            hovertemplate="Month: %{x}<br>Avg Monthly Precip: %{y:.1f} mm<extra></extra>",
        )

    temp_trace_styles = {
        "Avg Daily Max T": {"color": "#d32f2f", "visible": True},
        "Avg Daily Min T": {"color": "#ef9a9a", "visible": True},
        "Avg Daily Max Td": {"color": "#0b3d91", "visible": "legendonly"},
        "Avg Daily Min Td": {"color": "#90caf9", "visible": "legendonly"},
    }
    for trace_name, style in temp_trace_styles.items():
        fig_temp.add_trace(go.Scatter(
            x=temp_avg["Month"],
            y=temp_avg[trace_name],
            mode="lines+markers",
            name=trace_name,
            line=dict(color=style["color"], width=2.5),
            marker=dict(color=style["color"], size=7),
            visible=style["visible"],
            zorder=2,
            hovertemplate=f"Month: %{{x}}<br>{trace_name}: %{{y:.1f}} °C<extra></extra>",
        ))

    fig_temp.update_xaxes(title_text="")
    fig_temp.update_yaxes(title_text="Temperature / Dewpoint (°C)")
    fig_temp.update_layout(
        title="Temperature, Dewpoint & Precipitation",
        yaxis2=dict(
            title="Avg Monthly Precipitation (mm)",
            overlaying="y",
            side="right",
            rangemode="tozero",
            showgrid=False,
        ),
        bargap=0.22,
    )
    return fig_temp


def precip_observation_mask(df: pd.DataFrame) -> pd.Series:
    """Observation is precipitating when 10-minute rainfall exceeds 0.2 mm."""
    if "PRCP_10" not in df.columns:
        return pd.Series(False, index=df.index)
    return pd.to_numeric(df["PRCP_10"], errors="coerce").fillna(0.0) > 0.2


def precip_wx_or_rain_observation_mask(df: pd.DataFrame) -> pd.Series:
    """Precipitating when rain/shower/thunder present weather or 10-min rain > 0.2 mm."""
    precip_tokens = ["RA", "SH", "TS"]
    precip_fields = ["PRST_WX_DSC_1", "PRST_WX_PHENOM_1", "PRST_WX_DSC_2", "PRST_WX_PHENOM_2"]
    is_precip = token_mask_from_fields(df, precip_fields, precip_tokens)
    if "PRCP_10" in df.columns:
        is_precip = is_precip | (pd.to_numeric(df["PRCP_10"], errors="coerce").fillna(0.0) > 0.2)
    return is_precip


def valid_precip_cloud_vis_ceiling_mask(ceiling: pd.Series) -> pd.Series:
    numeric = pd.to_numeric(ceiling, errors="coerce")
    return numeric.ne(PRECIP_CLOUD_VIS_EXCLUDED_CEILING_FT)


def precip_cloud_vis_observation_mask(df: pd.DataFrame) -> pd.Series:
    """Observation included when 10-minute precipitation exceeds 0.2 mm."""
    return precip_observation_mask(df)


def precip_split_observation_mask(df: pd.DataFrame) -> pd.Series:
    """Precipitation for directional visibility split: rain/shower/thunder wx or 10-min rain > 0.2 mm."""
    return precip_wx_or_rain_observation_mask(df)


def precip_cloud_vis_vsby_step(icao: str) -> float:
    return PRECIP_CLOUD_VIS_VSBY_STEP_BY_ICAO.get(str(icao or "").strip().upper(), PRECIP_CLOUD_VIS_VSBY_STEP)


def precip_cloud_vis_vsby_bins(icao: str) -> list[float]:
    step = precip_cloud_vis_vsby_step(icao)
    if step == 1.0:
        return [float(i) for i in range(10)]
    return [
        round(i * step, 1)
        for i in range(int(PRECIP_CLOUD_VIS_VSBY_MAX / step) + 1)
    ]


def precip_cloud_vis_vsby_bin_labels(icao: str) -> list[str]:
    step = precip_cloud_vis_vsby_step(icao)
    if step == 1.0:
        return [f"{i} to <{i + 1} km" for i in range(10)]
    return [f"{value:.1f} km" for value in precip_cloud_vis_vsby_bins(icao)]


def precip_cloud_vis_vsby_bin_key(value: float, icao: str) -> float:
    step = precip_cloud_vis_vsby_step(icao)
    if step == 1.0:
        return float(int(np.floor(float(value))))
    return round(float(value), 1)


def assign_precip_cloud_vis_vsby_bin(vsby: pd.Series, icao: str) -> pd.Series:
    numeric = pd.to_numeric(vsby, errors="coerce")
    step = precip_cloud_vis_vsby_step(icao)
    if step == 1.0:
        # Half-open km bins: [0, 1), [1, 2), … [9, 10). Exclude v < 0 and v >= 10.
        binned = np.floor(numeric)
        return binned.where((numeric >= 0) & (numeric < PRECIP_CLOUD_VIS_VSBY_MAX))
    return (np.floor(numeric / step) * step).clip(0, PRECIP_CLOUD_VIS_VSBY_MAX)


def build_precip_split_polar_figure(split_df: pd.DataFrame, icao: str, *, embed_topo_background: bool = True) -> go.Figure:
    agg = (
        split_df.groupby("dir_bin_10", as_index=False)[["denom", "lt3", "lt5", "lt7", "lt9"]]
        .sum()
    )
    dir_bins_10 = list(range(0, 360, 10))
    agg = agg.set_index("dir_bin_10")
    denom = agg["denom"].to_dict()

    def probs_for(col: str) -> list[float]:
        numer = agg[col].to_dict()
        return [
            (float(numer.get(d, 0.0)) / float(denom.get(d, 0.0)) * 100.0) if float(denom.get(d, 0.0)) > 0 else 0.0
            for d in dir_bins_10
        ]

    labels = ["<3 km", "<5 km", "<7 km", "<9 km"]
    line_colors = ["#30123b", "#4145ab", "#4675ed", "#39a2fc"]
    fill_colors = [
        "rgba(48,18,59,0.15)",
        "rgba(65,69,171,0.15)",
        "rgba(70,117,237,0.15)",
        "rgba(57,162,252,0.15)",
    ]
    prob_arrays = [probs_for("lt3"), probs_for("lt5"), probs_for("lt7"), probs_for("lt9")]

    fig_split = go.Figure()
    for i, (label, lc, fc, probs) in enumerate(zip(labels, line_colors, fill_colors, prob_arrays)):
        r_vals = probs + [probs[0]]
        theta_vals = [float(d) for d in dir_bins_10] + [0.0]
        fig_split.add_trace(go.Scatterpolar(
            r=r_vals,
            theta=theta_vals,
            mode="lines",
            fill="toself" if i == 0 else "tonext",
            fillcolor=fc,
            line=dict(color=lc, width=2),
            name=label,
            legendrank=len(labels) - i,
            hoveron="points+fills",
            hovertemplate=(
                f"<b>{label}</b><br>"
                "Direction: %{theta}<br>"
                "P(VSBY &lt; threshold | precip): %{r:.1f}%"
                "<extra></extra>"
            ),
        ))

    bg_img_base64 = None
    try:
        airport_lat = COORDS_DF.loc[icao, "LAT"]
        airport_lon = COORDS_DF.loc[icao, "LONG"]
        bg_img_base64 = get_centered_background(float(airport_lat), float(airport_lon), zoom=ZOOM_LEVEL)
    except Exception:
        pass

    fig_split.update_layout(
        title="Conditional P(VSBY < threshold | Precipitation) by Direction",
        polar=dict(
            bgcolor="rgba(0,0,0,0)",
            angularaxis=dict(direction="clockwise", rotation=90),
            radialaxis=dict(ticksuffix="%"),
        ),
    )
    apply_topo_map_panel_layout(fig_split, "precip_split")
    if embed_topo_background and bg_img_base64:
        apply_polar_background(fig_split, bg_img_base64)
    return fig_split


def precip_cloud_vis_ceil_bin_labels() -> list[str]:
    return [
        f"{low} to <{low + PRECIP_CLOUD_VIS_CEIL_STEP} ft"
        for low in range(0, PRECIP_CLOUD_VIS_CEIL_MAX, PRECIP_CLOUD_VIS_CEIL_STEP)
    ]


def precip_cloud_vis_ceil_axis_labels() -> list[str]:
    return [
        f"<{low + PRECIP_CLOUD_VIS_CEIL_STEP} ft"
        for low in range(0, PRECIP_CLOUD_VIS_CEIL_MAX, PRECIP_CLOUD_VIS_CEIL_STEP)
    ]


def assign_precip_cloud_vis_ceil_bin(ceiling: pd.Series) -> pd.Series:
    numeric = pd.to_numeric(ceiling, errors="coerce")
    binned = np.floor(numeric / PRECIP_CLOUD_VIS_CEIL_STEP) * PRECIP_CLOUD_VIS_CEIL_STEP
    return binned.where((numeric >= 0) & (numeric < PRECIP_CLOUD_VIS_CEIL_MAX))


def precip_cloud_vis_colorscale() -> list[list[str | float]]:
    return [
        [0.0, "rgba(0,0,0,0)"],
        [0.08, "rgba(49,130,189,0.35)"],
        [0.25, "rgba(49,130,189,0.65)"],
        [0.5, "rgba(252,141,89,0.8)"],
        [1.0, "rgba(215,48,39,0.95)"],
    ]


def lightning_heatmap_colorscale() -> list[list[str | float]]:
    """Transparent at floor; pale peach through deep red at peak (full 0–1 span)."""
    return [
        [0.0, "rgba(0,0,0,0)"],
        [0.15, "rgba(255,210,170,0.28)"],
        [0.35, "rgba(255,130,60,0.52)"],
        [0.55, "rgba(240,60,0,0.72)"],
        [0.75, "rgba(220,20,0,0.86)"],
        [1.0, "rgba(170,0,0,0.95)"],
    ]


def _lightning_heatmap_z_grid(z: list[list[float]]) -> tuple[list[list[float | None]], float, float]:
    positives = [float(v) for row in z for v in row if v > 0]
    z_display: list[list[float | None]] = [[None if v == 0 else float(v) for v in row] for row in z]
    if not positives:
        return z_display, 0.0, 1.0

    z_min = float(min(positives))
    z_peak = float(max(positives))
    z_max = float(np.percentile(positives, LIGHTNING_HEATMAP_COLOR_PERCENTILE))
    z_max = max(z_min + 1.0, min(z_max, z_peak))
    if z_max >= z_peak * 0.98:
        z_max = z_peak
    return z_display, z_min, z_max


def _lightning_heatmap_ring_shapes() -> list[dict]:
    shapes: list[dict] = []
    for radius in LIGHTNING_HEATMAP_RING_RADII_KM:
        shapes.append(
            dict(
                type="circle",
                xref="x",
                yref="y",
                x0=-radius,
                y0=-radius,
                x1=radius,
                y1=radius,
                line=dict(color="rgba(255,255,255,0.95)", width=1.5),
                fillcolor="rgba(0,0,0,0)",
            )
        )
    return shapes


def build_precip_cloud_vis_heatmap(cloud_vis_df: pd.DataFrame, icao: str = "") -> go.Figure | None:
    if cloud_vis_df.empty:
        return None

    agg = cloud_vis_df.groupby(["ceil_bin", "vsby_bin"], as_index=False)["count"].sum()
    total = float(agg["count"].sum())
    if total <= 0:
        return None

    ceil_bins = list(range(0, PRECIP_CLOUD_VIS_CEIL_MAX, PRECIP_CLOUD_VIS_CEIL_STEP))
    ceil_labels = precip_cloud_vis_ceil_bin_labels()
    ceil_axis_labels = precip_cloud_vis_ceil_axis_labels()
    vsby_bins = precip_cloud_vis_vsby_bins(icao)
    vsby_labels = precip_cloud_vis_vsby_bin_labels(icao)
    ceil_index = {value: idx for idx, value in enumerate(ceil_bins)}
    vsby_index = {precip_cloud_vis_vsby_bin_key(value, icao): idx for idx, value in enumerate(vsby_bins)}
    z = [[0.0] * len(vsby_bins) for _ in range(len(ceil_bins))]

    for row in agg.itertuples(index=False):
        ci = ceil_index.get(int(row.ceil_bin))
        vi = vsby_index.get(precip_cloud_vis_vsby_bin_key(float(row.vsby_bin), icao))
        if ci is None or vi is None:
            continue
        z[ci][vi] = float(row.count) / total * 100.0

    x_centers = [bin_value + (precip_cloud_vis_vsby_step(icao) / 2.0) for bin_value in vsby_bins]
    y_centers = [bin_value + (PRECIP_CLOUD_VIS_CEIL_STEP / 2.0) for bin_value in ceil_bins]
    hover_labels = [
        [f"Visibility: {vsby_labels[vi]}<br>Ceiling: {ceil_labels[ci]}" for vi in range(len(vsby_bins))]
        for ci in range(len(ceil_bins))
    ]

    fig = go.Figure(
        data=go.Heatmap(
            x=x_centers,
            y=y_centers,
            z=z,
            customdata=hover_labels,
            colorscale=precip_cloud_vis_colorscale(),
            zmin=0,
            colorbar=dict(title="% of obs"),
            hovertemplate="%{customdata}<br>Frequency: %{z:.2f}%<extra></extra>",
        ),
    )
    fig.update_layout(
        title="Cloud Ceiling vs Visibility During Precipitation",
        xaxis=dict(
            title="Visibility (km)",
            tickmode="array",
            tickvals=x_centers,
            ticktext=vsby_labels,
        ),
        yaxis=dict(
            title="Lowest BKN/OVC ceiling (ft AGL)",
            tickmode="array",
            tickvals=y_centers,
            ticktext=ceil_axis_labels,
        ),
    )
    return fig


def build_lightning_heatmap_figure(lightning_df: pd.DataFrame, icao: str) -> go.Figure | None:
    if lightning_df.empty:
        return None

    agg = lightning_df.groupby(["grid_i", "grid_j"], as_index=False)["count"].sum()
    if agg.empty or float(agg["count"].sum()) <= 0:
        return None

    extent_km = lightning_heatmap_extent_km(icao)
    half_extent = extent_km / 2.0
    cell_size = extent_km / LIGHTNING_HEATMAP_GRID
    x_centers = [(-half_extent + (i + 0.5) * cell_size) for i in range(LIGHTNING_HEATMAP_GRID)]
    y_centers = [(-half_extent + (j + 0.5) * cell_size) for j in range(LIGHTNING_HEATMAP_GRID)]
    z = [[0.0] * LIGHTNING_HEATMAP_GRID for _ in range(LIGHTNING_HEATMAP_GRID)]

    for row in agg.itertuples(index=False):
        i = int(row.grid_i)
        j = int(row.grid_j)
        if 0 <= i < LIGHTNING_HEATMAP_GRID and 0 <= j < LIGHTNING_HEATMAP_GRID:
            z[j][i] = float(row.count)

    radius_km = lightning_heatmap_radius_km(icao)
    half_cell = cell_size / 2.0
    for j, yc in enumerate(y_centers):
        for i, xc in enumerate(x_centers):
            if not cell_intersects_lightning_disk(xc, yc, half_cell, radius_km):
                z[j][i] = 0.0

    shapes = _lightning_heatmap_ring_shapes()

    coords = airport_lat_lon(icao)
    topo_crop_km = topo_crop_extent_km(float(coords[0])) if coords else extent_km
    topo_display_km = topo_display_extent_km(icao)
    half_topo = topo_display_km / 2.0
    z_display, z_min, z_max = _lightning_heatmap_z_grid(z)

    fig = go.Figure(
        data=go.Heatmap(
            x=x_centers,
            y=y_centers,
            z=z_display,
            zmin=z_min,
            zmax=z_max,
            zauto=False,
            hoverongaps=False,
            colorscale=lightning_heatmap_colorscale(),
            opacity=0.5,
            colorbar=dict(title="Strike count"),
            hovertemplate="E: %{x:.1f} km<br>N: %{y:.1f} km<br>Count: %{z}<extra></extra>",
        ),
    )
    fig.update_layout(
        title="Lightning Strike Frequency",
        xaxis=dict(
            title="",
            scaleanchor="y",
            scaleratio=1,
            range=[-half_topo, half_topo],
            showgrid=False,
            zeroline=False,
            showline=False,
            ticks="",
            showticklabels=False,
            tickmode="array",
            tickvals=[0.0],
            ticktext=[""],
        ),
        yaxis=dict(
            title="",
            range=[-half_topo, half_topo],
            showgrid=False,
            zeroline=False,
            showline=False,
            ticks="",
            showticklabels=False,
            tickmode="array",
            tickvals=[0.0],
            ticktext=[""],
        ),
        shapes=shapes,
        meta={
            "topoExtentKm": topo_display_km,
            "topoCropExtentKm": topo_crop_km,
            "lightningRadiusKm": lightning_heatmap_radius_km(icao),
            "lightningExtentKm": extent_km,
            "lightningZmin": z_min,
            "lightningZmax": z_max,
        },
    )
    apply_topo_map_panel_layout(fig, "lightning_heatmap", cartesian=True)
    return fig


def build_live_lightning_grid_frame(
    icao: str,
    *,
    month_numbers: list[int],
    season: str,
    year_start: int,
    year_end: int,
) -> pd.DataFrame:
    coords = airport_lat_lon(icao)
    if coords is None:
        return pd.DataFrame(columns=["grid_i", "grid_j", "count"])

    airport_lat, airport_lon = coords
    lightning_df = load_lightning_df(icao)
    if lightning_df.is_empty():
        return pd.DataFrame(columns=["grid_i", "grid_j", "count"])

    strikes = lightning_df.select(["LTGN_TM", "LAT", "LONG"]).drop_nulls().to_pandas()
    if strikes.empty:
        return pd.DataFrame(columns=["grid_i", "grid_j", "count"])

    strikes["LTGN_TM"] = pd.to_datetime(strikes["LTGN_TM"], utc=True, errors="coerce")
    strikes = strikes.dropna(subset=["LTGN_TM", "LAT", "LONG"]).copy()
    if strikes.empty:
        return pd.DataFrame(columns=["grid_i", "grid_j", "count"])

    strikes["year"] = strikes["LTGN_TM"].dt.year.astype(int)
    strikes["month"] = strikes["LTGN_TM"].dt.month.astype(int)
    strikes = strikes[strikes["year"] >= LIGHTNING_STATS_MIN_YEAR].copy()
    strikes = filter_precomputed_rows_by_time(
        strikes,
        year_col="year",
        month_col="month",
        year_start=max(year_start, LIGHTNING_STATS_MIN_YEAR),
        year_end=year_end,
        month_numbers=month_numbers,
        season=season,
    )
    if strikes.empty:
        return pd.DataFrame(columns=["grid_i", "grid_j", "count"])

    lat_scale = 111.0
    lon_scale = 111.0 * max(0.1, math.cos(math.radians(airport_lat)))
    strikes["x_km"] = (pd.to_numeric(strikes["LONG"], errors="coerce") - airport_lon) * lon_scale
    strikes["y_km"] = (pd.to_numeric(strikes["LAT"], errors="coerce") - airport_lat) * lat_scale

    half_extent = lightning_heatmap_extent_km(icao) / 2.0
    cell_size = lightning_heatmap_extent_km(icao) / LIGHTNING_HEATMAP_GRID
    radius_km = lightning_heatmap_radius_km(icao)
    strikes = strike_offsets_km_from_airport(strikes, airport_lat, airport_lon)
    strikes = filter_strikes_within_radius_km(strikes, airport_lat, airport_lon, radius_km)
    if strikes.empty:
        return pd.DataFrame(columns=["grid_i", "grid_j", "count"])

    strikes = assign_lightning_strike_grid_indices(strikes, extent_km=lightning_heatmap_extent_km(icao))
    return (
        strikes.groupby(["grid_i", "grid_j"], as_index=False)
        .size()
        .rename(columns={"size": "count"})
    )


def build_precipitation_figures_from_precomputed(
    icao: str,
    *,
    month_numbers: list[int],
    season: str,
    year_start: int,
    year_end: int,
    enso: str,
    iod: str,
    sam: str,
    mjo: str,
) -> dict[str, go.Figure]:
    payload = load_precomputed_precipitation_for_airport(icao)
    if not payload:
        return {}

    season_months = set(SEASON_TO_MONTHS.get(season, SEASON_TO_MONTHS["all"]))
    selected_months = [m for m in month_numbers if m in season_months]
    if not selected_months:
        return {}

    figures: dict[str, go.Figure] = {}
    monthly_rows = payload.get("monthly", [])
    if monthly_rows:
        monthly_df = pd.DataFrame(monthly_rows)
        monthly_df = monthly_df[
            (monthly_df["bom_year"] >= year_start)
            & (monthly_df["bom_year"] <= year_end)
            & (monthly_df["bom_month"].isin(selected_months))
        ].copy()
        monthly_df = filter_precomputed_rows_by_state(
            monthly_df,
            enso=enso,
            iod=iod,
            sam=sam,
            mjo=mjo,
        )
        if not monthly_df.empty:
            monthly_df = (
                monthly_df.groupby(["bom_year", "bom_month"], as_index=False)[["Rain", "Thunderstorm"]]
                .sum()
            )
            rain_avg_m = (
                monthly_df.groupby("bom_month", as_index=False)["Rain"]
                .mean()
                .rename(columns={"bom_month": "month"})
            )
            ts_avg_m = (
                monthly_df[monthly_df["bom_year"] >= LIGHTNING_STATS_MIN_YEAR]
                .groupby("bom_month", as_index=False)["Thunderstorm"]
                .mean()
                .rename(columns={"bom_month": "month"})
            )
            monthly_avg = rain_avg_m.merge(ts_avg_m, on="month", how="left")
            monthly_avg["Thunderstorm"] = monthly_avg["Thunderstorm"].fillna(0.0)
            monthly_avg = monthly_avg[monthly_avg["month"].isin(month_numbers)].copy()
            if not monthly_avg.empty:
                month_name_order = month_labels_for_numbers(month_numbers)
                monthly_avg["Month"] = monthly_avg["month"].apply(lambda m: MONTH_NAMES[m - 1])
                monthly_avg["Month"] = pd.Categorical(monthly_avg["Month"], categories=month_name_order, ordered=True)
                monthly_avg = monthly_avg.sort_values("Month")
                monthly_precip = monthly_avg.melt(
                    id_vars=["month", "Month"],
                    value_vars=["Rain", "Thunderstorm"],
                    var_name="Type",
                    value_name="Count",
                )
                monthly_precip["Type"] = monthly_precip["Type"].replace({"Thunderstorm": THUNDERSTORM_LEGEND_LABEL})
                fig_precip = px.bar(
                    monthly_precip,
                    x="Month",
                    y="Count",
                    color="Type",
                    barmode="group",
                    color_discrete_map={"Rain": "#2159d1", THUNDERSTORM_LEGEND_LABEL: "#c62828"},
                    labels={"Count": "Avg Days/Month", "Type": "Category"},
                    title="Monthly Rain/Thunderstorm Days",
                    category_orders={"Month": month_name_order, "Type": ["Rain", THUNDERSTORM_LEGEND_LABEL]},
                )
                fig_precip.update_xaxes(title_text="")
                figures["monthly_precip"] = fig_precip

    split_rows = payload.get("split", [])
    if split_rows:
        split_df = pd.DataFrame(split_rows)
        split_df = filter_precomputed_rows_by_time(
            split_df,
            year_col="year",
            month_col="month",
            year_start=year_start,
            year_end=year_end,
            month_numbers=month_numbers,
            season=season,
        )
        split_df = filter_precomputed_rows_by_state(
            split_df,
            enso=enso,
            iod=iod,
            sam=sam,
            mjo=mjo,
        )
        if not split_df.empty:
            figures["precip_split"] = build_precip_split_polar_figure(split_df, icao, embed_topo_background=False)

    hourly_rows = payload.get("hourly", [])
    if hourly_rows:
        hourly_df = pd.DataFrame(hourly_rows)
        hourly_df = filter_precomputed_rows_by_time(
            hourly_df,
            year_col="year",
            month_col="month",
            year_start=year_start,
            year_end=year_end,
            month_numbers=month_numbers,
            season=season,
        )
        hourly_df = filter_precomputed_rows_by_state(
            hourly_df,
            enso=enso,
            iod=iod,
            sam=sam,
            mjo=mjo,
        )
        hourly_agg, magnitude_agg = aggregate_hourly_rain_thunder_chart(hourly_df)
        fig_hourly = build_hourly_rain_thunder_figure(hourly_agg, magnitude_agg)
        if fig_hourly is not None:
            figures["hourly_precip"] = fig_hourly

    lightning_rows = payload.get("lightning_grid", [])
    if lightning_rows:
        lightning_df = pd.DataFrame(lightning_rows)
        lightning_df = filter_precomputed_rows_by_time(
            lightning_df,
            year_col="year",
            month_col="month",
            year_start=max(year_start, LIGHTNING_STATS_MIN_YEAR),
            year_end=year_end,
            month_numbers=month_numbers,
            season=season,
        )
        lightning_df = filter_precomputed_rows_by_state(
            lightning_df,
            enso=enso,
            iod=iod,
            sam=sam,
            mjo=mjo,
        )
        fig_lightning = build_lightning_heatmap_figure(lightning_df, icao)
        if fig_lightning is not None:
            figures["lightning_heatmap"] = fig_lightning

    return figures


def build_fog_low_cloud_figures_from_precomputed(
    icao: str,
    *,
    requested_figure_ids: set[str] | None,
    month_numbers: list[int],
    season: str,
    year_start: int,
    year_end: int,
    enso: str,
    iod: str,
    sam: str,
    mjo: str,
    fog_monthly_mode: str,
    fog_hourly_mode: str,
    fog_wind_mode: str,
    fog_dewpoint_mode: str,
) -> dict[str, go.Figure]:
    figures: dict[str, go.Figure] = {}
    requested = requested_figure_ids or {"monthly_fog", "fog_share", "cloud_distribution", "fog_cloud_joint"}
    month_name_order = month_labels_for_numbers(month_numbers)
    selected_state = {
        "enso_norm": normalize_driver_selection(enso),
        "iod_norm": normalize_driver_selection(iod),
        "sam_norm": normalize_driver_selection(sam),
        "mjo_norm": normalize_driver_selection(mjo),
    }
    all_state_selected = all(value == "all" for value in selected_state.values())

    # monthly fog/low cloud frequency
    monthly_rows = (
        load_precomputed_fog_low_cloud_for_airport(
            icao,
            "monthly_fog",
            mode=fog_monthly_mode,
            all_state_only=all_state_selected,
        )
        if "monthly_fog" in requested
        else []
    )
    if monthly_rows:
        season_months = set(SEASON_TO_MONTHS.get(season, SEASON_TO_MONTHS["all"]))
        selected_months = {m for m in month_numbers if m in season_months}
        monthly_avg = monthly_fog_rates_from_precomputed_rows(
            monthly_rows,
            fog_monthly_mode,
            year_start,
            year_end,
            selected_months,
            selected_state=selected_state,
            require_all_only=all_state_selected,
        )
        if not monthly_avg.empty:
            combined = combined_fog_frequency_from_monthly_avg(monthly_avg)
            ordered_selected_months = [m for m in month_numbers if m in season_months]
            fig = build_fog_low_cloud_frequency_from_combined(
                combined,
                "Fog/Low Cloud Frequency",
                ordered_selected_months,
            )
            figures["monthly_fog"] = fig

    # hourly fog/low cloud frequency
    hourly_rows = (
        load_precomputed_fog_low_cloud_for_airport(
            icao,
            "fog_share",
            mode=fog_hourly_mode,
            all_state_only=all_state_selected,
        )
        if "fog_share" in requested
        else []
    )
    if hourly_rows:
        season_months = set(SEASON_TO_MONTHS.get(season, SEASON_TO_MONTHS["all"]))
        selected_months = {m for m in month_numbers if m in season_months}
        hourly_rates = hourly_fog_rates_from_precomputed_rows(
            hourly_rows,
            fog_hourly_mode,
            year_start,
            year_end,
            selected_months,
            selected_state=selected_state,
            require_all_only=all_state_selected,
        )
        if hourly_rates:
            freezing_fog_by_hour_values, fog_by_hour_values, threshold_value_lists = hourly_rates

            threshold_order = ["below 500ft", "below 1000ft", "below 1500ft", "below 2000ft"]
            hour_numbers = list(range(24))
            hour_labels = [str(hour) for hour in hour_numbers]
            hour_hover_labels = [f"{hour:02d}Z" for hour in range(24)]

            fig = go.Figure()
            low_cloud_x = [hour - 0.22 for hour in hour_numbers]
            fog_x = [hour + 0.22 for hour in hour_numbers]
            bar_width = 0.38
            fig.add_bar(x=low_cloud_x, y=[0.0] * len(hour_labels), showlegend=False, hoverinfo="skip", marker_color="rgba(0,0,0,0)", width=bar_width)
            fig.add_bar(x=fog_x, y=[0.0] * len(hour_labels), showlegend=False, hoverinfo="skip", marker_color="rgba(0,0,0,0)", width=bar_width)

            threshold_colors = {
                "below 500ft": "#8b0000",
                "below 1000ft": "#c62828",
                "below 1500ft": "#e57373",
                "below 2000ft": "#ef9a9a",
            }
            threshold_series_lookup = {
                "below 2000ft": threshold_value_lists[0],
                "below 1500ft": threshold_value_lists[1],
                "below 1000ft": threshold_value_lists[2],
                "below 500ft": threshold_value_lists[3],
            }
            for threshold in threshold_order:
                display_label = FOG_LOW_CLOUD_THRESHOLD_LABELS[threshold]
                fig.add_bar(
                    x=low_cloud_x,
                    y=threshold_series_lookup[threshold],
                    name=display_label,
                    marker_color=threshold_colors[threshold],
                    customdata=hour_hover_labels,
                    width=bar_width,
                    hovertemplate=(
                        "Hour: %{customdata}<br>"
                        f"{display_label}: %{{y:.2f}}%<extra></extra>"
                    ),
                )

            _add_fog_stack_bars(
                fig,
                x_values=fog_x,
                index_labels=hour_hover_labels,
                fog_series={
                    "Freezing fog": freezing_fog_by_hour_values,
                    "Fog": fog_by_hour_values,
                },
                hover_prefix="Hour",
                bar_width=bar_width,
            )
            fig.update_layout(title="Fog/Low Cloud Frequency by Hour", barmode="stack", legend_title_text="Category")
            fig.update_xaxes(title_text="", tickmode="array", tickvals=[0, 5, 10, 15, 20], ticktext=["00Z", "05Z", "10Z", "15Z", "20Z"], showgrid=False, range=[-0.8, 23.8])
            fig.update_yaxes(title_text="Share of Days (%)")
            figures["fog_share"] = fig

    # dewpoint lines
    dewpoint_df = (
        pd.DataFrame(
            load_precomputed_fog_low_cloud_for_airport(
                icao,
                "fog_cloud_joint",
                mode=fog_dewpoint_mode,
                all_state_only=all_state_selected,
            )
        )
        if "fog_cloud_joint" in requested
        else pd.DataFrame()
    )
    if not dewpoint_df.empty:
        dewpoint_df = dewpoint_df[dewpoint_df["mode"] == fog_dewpoint_mode]
        dewpoint_df = filter_precomputed_rows_by_time(
            dewpoint_df,
            year_col="bom_year",
            month_col="bom_month",
            year_start=year_start,
            year_end=year_end,
            month_numbers=month_numbers,
            season=season,
        )
        dewpoint_df = filter_precomputed_rows_by_state(
            dewpoint_df,
            enso=enso,
            iod=iod,
            sam=sam,
            mjo=mjo,
        )
        if not dewpoint_df.empty:
            agg = (
                dewpoint_df.groupby(["bom_month", "Category"], as_index=False)[["dwpt_sum", "dwpt_count"]]
                .sum()
            )
            agg = agg[agg["dwpt_count"] > 0]
            if not agg.empty:
                agg["AvgDWPT"] = agg["dwpt_sum"] / agg["dwpt_count"]
                category_colors = {
                    "Fog": "#d4af37",
                    "2000ft - 1500ft cloud": "#ef9a9a",
                    "1500ft - 1000ft cloud": "#e57373",
                    "1000ft - 500ft cloud": "#c62828",
                    "< 500ft cloud": "#8b0000",
                }
                fig = go.Figure()
                for label, color in category_colors.items():
                    masked = agg[agg["Category"] == label].copy()
                    if masked.empty:
                        continue
                    monthly_avg = masked.set_index("bom_month")["AvgDWPT"].reindex(month_numbers).reset_index()
                    monthly_avg["Month"] = monthly_avg["bom_month"].apply(lambda m: MONTH_NAMES[m - 1])
                    fig.add_trace(go.Scatter(
                        x=monthly_avg["Month"],
                        y=monthly_avg["AvgDWPT"],
                        mode="lines+markers",
                        name=label,
                        line=dict(color=color, width=2.5),
                        marker=dict(size=7, color=color),
                        connectgaps=False,
                        hovertemplate="Month: %{x}<br>Avg Dewpoint: %{y:.1f} °C<extra>" + label + "</extra>",
                    ))
                if len(fig.data) > 0:
                    fig.update_layout(title="Avg Dewpoint by Month", legend_title_text="Category")
                    fig.update_xaxes(title_text="", categoryorder="array", categoryarray=month_name_order)
                    fig.update_yaxes(title_text="Avg Dewpoint (°C)")
                    figures["fog_cloud_joint"] = fig

    # wind distribution plot — keep this path memory-bounded on Render free tier.
    wind_rows: list[dict[str, Any]] = []
    if "cloud_distribution" in requested:
        _guard_mb = configured_memory_guard_mb()
        _rss_mb = current_rss_mb()
        _near_guard = (
            _guard_mb > 0
            and _rss_mb is not None
            and _rss_mb >= max(0.0, _guard_mb - 50.0)
        )
        if _near_guard:
            log_memory_phase(
                "charts.fog_cloud_distribution_skipped",
                section="fog_low_cloud",
                icao=icao,
                guard_mb=f"{_guard_mb:.1f}",
                rss_mb=f"{_rss_mb:.1f}",
            )
        else:
            wind_rows = load_precomputed_fog_low_cloud_for_airport(
                icao,
                "cloud_distribution",
                mode=fog_wind_mode,
                all_state_only=all_state_selected,
            )
    if wind_rows:
        season_months = set(SEASON_TO_MONTHS.get(season, SEASON_TO_MONTHS["all"]))
        selected_months = {m for m in month_numbers if m in season_months}
        selected_state = {
            "enso_norm": normalize_driver_selection(enso),
            "iod_norm": normalize_driver_selection(iod),
            "sam_norm": normalize_driver_selection(sam),
            "mjo_norm": normalize_driver_selection(mjo),
        }

        counts_any: dict[tuple[str, int, int], float] = {}
        counts_all_only: dict[tuple[str, int, int], float] = {}
        require_all_only = all(value == "all" for value in selected_state.values())

        for row in wind_rows:
            try:
                if str(row.get("mode", "")) != fog_wind_mode:
                    continue

                row_year = int(row.get("bom_year", -1))
                row_month = int(row.get("bom_month", -1))
                if row_year < year_start or row_year > year_end:
                    continue
                if row_month not in selected_months:
                    continue

                enso_value = str(row.get("enso_norm", "")).strip().lower()
                iod_value = str(row.get("iod_norm", "")).strip().lower()
                sam_value = str(row.get("sam_norm", "")).strip().lower()
                mjo_value = str(row.get("mjo_norm", "")).strip().lower()

                is_all_row = (
                    enso_value == "all"
                    and iod_value == "all"
                    and sam_value == "all"
                    and mjo_value == "all"
                )

                if not require_all_only:
                    if selected_state["enso_norm"] != "all" and enso_value != selected_state["enso_norm"]:
                        continue
                    if selected_state["iod_norm"] != "all" and iod_value != selected_state["iod_norm"]:
                        continue
                    if selected_state["sam_norm"] != "all" and sam_value != selected_state["sam_norm"]:
                        continue
                    if selected_state["mjo_norm"] != "all" and mjo_value != selected_state["mjo_norm"]:
                        continue

                label = str(row.get("Category", "")).strip()
                speed_bin = int(row.get("speed_bin", 0))
                dir_bin = int(row.get("dir_bin_10", 0))
                count = float(row.get("Count", 0.0) or 0.0)
                if count <= 0.0:
                    continue

                key = (label, speed_bin, dir_bin)
                counts_any[key] = counts_any.get(key, 0.0) + count
                if is_all_row:
                    counts_all_only[key] = counts_all_only.get(key, 0.0) + count
            except (TypeError, ValueError):
                continue

        # Match dataframe-state filtering semantics: if all drivers selected, prefer rows
        # where every driver is "all" when those rows exist.
        grouped_counts = counts_any
        if require_all_only and counts_all_only:
            grouped_counts = counts_all_only

        # Free parsed JSON rows before heavy numpy/plotly allocations.
        del wind_rows

        if grouped_counts:
            direction_step = 10.0
            speed_step = 1.0
            dir_edges = np.arange(0.0, 360.0 + direction_step, direction_step)
            dir_centers = dir_edges[:-1] + (direction_step / 2.0)
            max_speed_bin_raw = int(max(10, max(speed for (_, speed, _) in grouped_counts.keys())))
            max_speed_bin = min(max_speed_bin_raw, FOG_CLOUD_DISTRIBUTION_MAX_SPEED_BIN)
            max_speed = max(10.0, float(math.ceil((max_speed_bin * 1.1) / 5.0) * 5.0))
            speed_edges = np.arange(0.0, max_speed + speed_step, speed_step)
            cutoff_pct = 0.1
            category_colors = {
                "Fog": "#d4af37",
                "2000ft - 1500ft cloud": "#ef9a9a",
                "1500ft - 1000ft cloud": "#e57373",
                "1000ft - 500ft cloud": "#c62828",
                "< 500ft cloud": "#8b0000",
            }

            def hex_to_rgba(hex_color: str, alpha: float) -> str:
                color = hex_color.lstrip("#")
                if len(color) != 6:
                    return f"rgba(0,0,0,{alpha})"
                red = int(color[0:2], 16)
                green = int(color[2:4], 16)
                blue = int(color[4:6], 16)
                return f"rgba({red},{green},{blue},{alpha})"

            def smooth_frequency_field(field: np.ndarray, passes: int = 3) -> np.ndarray:
                out = field.astype(float).copy()
                for _ in range(passes):
                    out = (np.roll(out, 1, axis=1) + 2.0 * out + np.roll(out, -1, axis=1)) / 4.0
                    padded = np.pad(out, ((1, 1), (0, 0)), mode="edge")
                    out = (padded[:-2] + 2.0 * padded[1:-1] + padded[2:]) / 4.0
                return out

            def boundary_from_level(field: np.ndarray, level: float) -> np.ndarray:
                boundary = np.full(len(dir_centers), np.nan)
                for col_idx in range(len(dir_centers)):
                    column = field[:, col_idx]
                    hit_idx = np.where(column >= level)[0]
                    if len(hit_idx) > 0:
                        boundary[col_idx] = float(speed_edges[int(hit_idx.max()) + 1])
                boundary = np.nan_to_num(boundary, nan=0.0)
                boundary = (np.roll(boundary, 1) + 2.0 * boundary + np.roll(boundary, -1)) / 4.0
                return boundary

            fig = go.Figure()
            traces_added = 0
            max_plotted_speed = 0.0
            layer_fields: dict[str, np.ndarray] = {}
            layer_order = ["2000ft - 1500ft cloud", "1500ft - 1000ft cloud", "1000ft - 500ft cloud", "< 500ft cloud", "Fog"]
            for label in layer_order:
                hist2d = np.zeros((len(speed_edges) - 1, len(dir_edges) - 1), dtype=float)
                label_total = 0.0
                for (row_label, sbin, dbin), count in grouped_counts.items():
                    if row_label != label:
                        continue
                    if sbin > FOG_CLOUD_DISTRIBUTION_MAX_SPEED_BIN:
                        sbin = FOG_CLOUD_DISTRIBUTION_MAX_SPEED_BIN
                    add_calm_sentinel_to_polar_hist2d(hist2d, dbin, sbin, float(count))
                    label_total += float(count)

                total_obs = label_total
                if total_obs <= 0:
                    continue

                rel_field = (hist2d / total_obs) * 100.0
                rel_field = smooth_frequency_field(rel_field, passes=3)
                layer_fields[label] = rel_field
                peak_rel = float(np.nanmax(rel_field)) if rel_field.size else 0.0
                if peak_rel < cutoff_pct:
                    continue

                low = cutoff_pct
                high = max(low, peak_rel * 0.92)
                levels = [round(float(low), 3)] if high <= low else sorted({round(float(v), 3) for v in np.geomspace(low, high, num=6)})
                first_for_label = True
                for level_idx, level in enumerate(levels):
                    boundary = boundary_from_level(rel_field, level)
                    boundary_max = float(np.max(boundary))
                    if boundary_max <= 0.0:
                        continue
                    max_plotted_speed = max(max_plotted_speed, boundary_max)
                    theta_vals = list(dir_centers) + [float(dir_centers[0])]
                    r_vals = list(boundary) + [float(boundary[0])]
                    alpha = min(0.10 + level_idx * 0.07, 0.42)
                    fig.add_trace(go.Scatterpolar(
                        theta=theta_vals,
                        r=r_vals,
                        mode="lines",
                        name=label,
                        legendgroup=label,
                        showlegend=first_for_label,
                        line=dict(color=hex_to_rgba(category_colors[label], min(alpha + 0.28, 0.95)), width=1.1),
                        fill="toself",
                        fillcolor=hex_to_rgba(category_colors[label], alpha),
                        hoverinfo="skip",
                    ))
                    first_for_label = False
                if not first_for_label:
                    traces_added += 1

            if traces_added > 0:
                speed_centers = speed_edges[:-1] + (speed_step / 2.0)
                mesh_stride = max(1, int(math.ceil((len(speed_centers) * len(dir_centers)) / FOG_CLOUD_DISTRIBUTION_MAX_HOVER_POINTS)))
                sampled_speed_idx = np.arange(0, len(speed_centers), mesh_stride, dtype=int)
                sampled_speed_centers = speed_centers[sampled_speed_idx]
                theta_mesh = np.tile(dir_centers, len(sampled_speed_centers))
                r_mesh = np.repeat(sampled_speed_centers, len(dir_centers))
                custom_rows: list[list[float]] = []
                hover_order = ["Fog", "2000ft - 1500ft cloud", "1500ft - 1000ft cloud", "1000ft - 500ft cloud", "< 500ft cloud"]
                hover_fields = {
                    code: layer_fields.get(code, np.zeros((len(speed_centers), len(dir_centers)), dtype=float))
                    for code in hover_order
                }
                for speed_idx in sampled_speed_idx:
                    for dir_idx in range(len(dir_centers)):
                        custom_rows.append([
                            float(hover_fields["Fog"][speed_idx, dir_idx]),
                            float(hover_fields["2000ft - 1500ft cloud"][speed_idx, dir_idx]),
                            float(hover_fields["1500ft - 1000ft cloud"][speed_idx, dir_idx]),
                            float(hover_fields["1000ft - 500ft cloud"][speed_idx, dir_idx]),
                            float(hover_fields["< 500ft cloud"][speed_idx, dir_idx]),
                        ])
                fig.add_trace(go.Scatterpolar(
                    theta=theta_mesh,
                    r=r_mesh,
                    mode="markers",
                    name="",
                    showlegend=False,
                    marker=dict(size=14, color="rgba(0,0,0,0.001)"),
                    customdata=custom_rows,
                    hovertemplate=(
                        "Direction: %{theta:.0f}°<br>"
                        "Wind Speed: %{r:.1f} kt<br>"
                        "Fog: %{customdata[0]:.3f}%<br>"
                        "2000ft - 1500ft cloud: %{customdata[1]:.3f}%<br>"
                        "1500ft - 1000ft cloud: %{customdata[2]:.3f}%<br>"
                        "1000ft - 500ft cloud: %{customdata[3]:.3f}%<br>"
                        "< 500ft cloud: %{customdata[4]:.3f}%<extra></extra>"
                    ),
                ))

                display_max_speed = max(10.0, float(math.ceil((max_plotted_speed * 1.1) / 5.0) * 5.0))
                bg_img_base64 = None
                try:
                    airport_lat = COORDS_DF.loc[icao, "LAT"]
                    airport_lon = COORDS_DF.loc[icao, "LONG"]
                    bg_img_base64 = get_centered_background(float(airport_lat), float(airport_lon), zoom=ZOOM_LEVEL)
                except Exception:
                    pass
                fig.update_layout(
                    title="Wind Direction/Strength",
                    polar=dict(
                        bgcolor="rgba(0,0,0,0)",
                        angularaxis=dict(direction="clockwise", period=360),
                        radialaxis=dict(angle=90, tickangle=90, ticksuffix=" kt", range=[0, display_max_speed]),
                    ),
                    legend=dict(title_text="Category", groupclick="togglegroup"),
                    margin=dict(l=36, r=36, t=52, b=22),
                )
                apply_topo_map_panel_layout(fig, "cloud_distribution")
                if bg_img_base64:
                    apply_polar_background(fig, bg_img_base64)
                figures["cloud_distribution"] = fig

    return figures


def build_smoke_dust_figures_from_precomputed(
    icao: str,
    *,
    month_numbers: list[int],
    season: str,
    year_start: int,
    year_end: int,
    enso: str,
    iod: str,
    sam: str,
    mjo: str,
) -> dict[str, go.Figure]:
    payload = load_precomputed_smoke_dust_for_airport(icao)
    if not payload:
        return {}

    figures: dict[str, go.Figure] = {}
    month_name_order = month_labels_for_numbers(month_numbers)
    smoke_tokens = ["FU", "DU", "SA", "VA"]
    phenom_colors = {
        "FU": "#7a7a7a",
        "DU": "#EF553B",
        "SA": "#00CC96",
        "VA": "#AB63FA",
    }

    monthly_df = pd.DataFrame(payload.get("monthly", []))
    if not monthly_df.empty:
        monthly_df = filter_precomputed_rows_by_time(
            monthly_df,
            year_col="year",
            month_col="month",
            year_start=year_start,
            year_end=year_end,
            month_numbers=month_numbers,
            season=season,
        )
        monthly_df = filter_precomputed_rows_by_state(monthly_df, enso=enso, iod=iod, sam=sam, mjo=mjo)
        if not monthly_df.empty:
            monthly_smoke = monthly_df.groupby(["month", "Phenomenon"], as_index=False)["Count"].mean()
            monthly_smoke["Month"] = monthly_smoke["month"].apply(lambda m: MONTH_NAMES[m - 1])
            monthly_smoke["Month"] = pd.Categorical(monthly_smoke["Month"], categories=month_name_order, ordered=True)
            monthly_smoke = monthly_smoke.sort_values(["Month", "Phenomenon"])
            fig = px.bar(
                monthly_smoke,
                x="Month",
                y="Count",
                color="Phenomenon",
                barmode="group",
                labels={"Count": "Avg Obs/Month", "Phenomenon": "Type"},
                title="Monthly Smoke/Dust Frequency by Phenomenon",
                color_discrete_map=phenom_colors,
                category_orders={"Month": month_name_order, "Phenomenon": smoke_tokens},
            )
            fig.update_xaxes(title_text="")
            figures["monthly_smoke"] = fig

    hourly_df = pd.DataFrame(payload.get("hourly", []))
    if not hourly_df.empty:
        hourly_df = filter_precomputed_rows_by_time(
            hourly_df,
            year_col="year",
            month_col="month",
            year_start=year_start,
            year_end=year_end,
            month_numbers=month_numbers,
            season=season,
        )
        hourly_df = filter_precomputed_rows_by_state(hourly_df, enso=enso, iod=iod, sam=sam, mjo=mjo)
        if not hourly_df.empty:
            hourly = (
                hourly_df.groupby(["year", "hour", "Phenomenon"], as_index=False)["Count"]
                .sum()
                .groupby(["hour", "Phenomenon"], as_index=False)["Count"]
                .mean()
            )
            fig = px.bar(
                hourly,
                x="hour",
                y="Count",
                color="Phenomenon",
                barmode="group",
                labels={"Count": "Avg Obs/Hour (per year)", "Phenomenon": "Type"},
                title="Hourly Smoke/Dust Frequency by Phenomenon",
                color_discrete_map=phenom_colors,
                category_orders={"Phenomenon": smoke_tokens},
            )
            fig.update_xaxes(title_text="", tickmode="array", tickvals=[0, 5, 10, 15, 20], ticktext=["00Z", "05Z", "10Z", "15Z", "20Z"])
            figures["hourly_smoke"] = fig

    scatter_df = pd.DataFrame(payload.get("scatter", []))
    if not scatter_df.empty:
        scatter_df = filter_precomputed_rows_by_time(
            scatter_df,
            year_col="year",
            month_col="month",
            year_start=year_start,
            year_end=year_end,
            month_numbers=month_numbers,
            season=season,
        )
        scatter_df = filter_precomputed_rows_by_state(scatter_df, enso=enso, iod=iod, sam=sam, mjo=mjo)
        if not scatter_df.empty:
            fig = go.Figure()
            for code in smoke_tokens:
                sub = scatter_df[scatter_df["Phenomenon"] == code]
                if sub.empty:
                    continue
                fig.add_trace(go.Scatter(
                    x=sub["DWPT"],
                    y=sub["WND_SPD"],
                    mode="markers",
                    name=code,
                    legendgroup=code,
                    marker=dict(color=phenom_colors[code], size=7, opacity=0.65),
                    hovertemplate="Type: %{text}<br>Dew Point: %{x:.1f} °C<br>Wind Speed: %{y:.1f} kt<extra></extra>",
                    text=[code] * len(sub),
                ))
                fit_df = sub[["DWPT", "WND_SPD"]].dropna()
                if len(fit_df) >= 2 and fit_df["DWPT"].nunique() > 1:
                    x_mean = float(fit_df["DWPT"].mean())
                    y_mean = float(fit_df["WND_SPD"].mean())
                    var_x = float(((fit_df["DWPT"] - x_mean) ** 2).sum())
                    if var_x > 0:
                        cov_xy = float(((fit_df["DWPT"] - x_mean) * (fit_df["WND_SPD"] - y_mean)).sum())
                        slope = cov_xy / var_x
                        intercept = y_mean - slope * x_mean
                        x_min = float(fit_df["DWPT"].min())
                        x_max = float(fit_df["DWPT"].max())
                        y_min = slope * x_min + intercept
                        y_max = slope * x_max + intercept
                        fig.add_trace(go.Scatter(
                            x=[x_min, x_max],
                            y=[y_min, y_max],
                            mode="lines",
                            name=f"{code} fit",
                            legendgroup=code,
                            showlegend=False,
                            line=dict(color=phenom_colors[code], width=2),
                            hovertemplate=f"{code} fit<br>Dew Point: %{{x:.1f}} °C<br>Wind Speed: %{{y:.1f}} kt<extra></extra>",
                        ))
            if len(fig.data) > 0:
                fig.update_layout(
                    title="Wind Speed vs Dew Point (Dust/Smoke)",
                    xaxis_title="Dew Point (°C)",
                    yaxis_title="Wind Speed (kt)",
                    legend=dict(title_text="Phenomenon", groupclick="togglegroup"),
                )
                figures["scatter_wind_dewpt"] = fig

    radial_df = pd.DataFrame(payload.get("radial", []))
    if not radial_df.empty:
        radial_df = filter_precomputed_rows_by_time(
            radial_df,
            year_col="year",
            month_col="month",
            year_start=year_start,
            year_end=year_end,
            month_numbers=month_numbers,
            season=season,
        )
        radial_df = filter_precomputed_rows_by_state(radial_df, enso=enso, iod=iod, sam=sam, mjo=mjo)
        if not radial_df.empty:
            scatter_polar = go.Figure()
            direction_step = 10.0
            max_speed = 40.0
            speed_step = 1.0
            dir_edges = np.arange(0.0, 360.0 + direction_step, direction_step)
            dir_centers = dir_edges[:-1] + (direction_step / 2.0)
            speed_edges = np.arange(0.0, max_speed + speed_step, speed_step)
            cutoff_pct = 0.06

            def hex_to_rgba(hex_color: str, alpha: float) -> str:
                color = hex_color.lstrip("#")
                if len(color) != 6:
                    return f"rgba(0,0,0,{alpha})"
                r = int(color[0:2], 16)
                g = int(color[2:4], 16)
                b = int(color[4:6], 16)
                return f"rgba({r},{g},{b},{alpha})"

            def smooth_frequency_field(field: np.ndarray, passes: int = 3) -> np.ndarray:
                out = field.astype(float).copy()
                for _ in range(passes):
                    out = (np.roll(out, 1, axis=1) + 2.0 * out + np.roll(out, -1, axis=1)) / 4.0
                    padded = np.pad(out, ((1, 1), (0, 0)), mode="edge")
                    out = (padded[:-2] + 2.0 * padded[1:-1] + padded[2:]) / 4.0
                return out

            def boundary_from_level(field: np.ndarray, level: float) -> np.ndarray:
                boundary = np.full(len(dir_centers), np.nan)
                for col_idx in range(len(dir_centers)):
                    column = field[:, col_idx]
                    hit_idx = np.where(column >= level)[0]
                    if len(hit_idx) > 0:
                        boundary[col_idx] = float(speed_edges[int(hit_idx.max()) + 1])
                boundary = np.nan_to_num(boundary, nan=0.0)
                boundary = (np.roll(boundary, 1) + 2.0 * boundary + np.roll(boundary, -1)) / 4.0
                return boundary

            traces_added = 0
            max_plotted_speed = 0.0
            legend_order = {code: idx for idx, code in enumerate(smoke_tokens)}
            layer_fields: dict[str, np.ndarray] = {}
            plotted_codes: list[str] = []
            layer_order = ["DU", "FU", "SA", "VA"]
            for code in layer_order:
                sub = radial_df[radial_df["Phenomenon"] == code]
                if sub.empty:
                    continue

                hist2d = np.zeros((len(speed_edges) - 1, len(dir_edges) - 1), dtype=float)
                grouped = sub.groupby(["speed_bin", "dir_bin_10"], as_index=False)["Count"].sum()
                for _, row in grouped.iterrows():
                    add_calm_sentinel_to_polar_hist2d(
                        hist2d,
                        int(row["dir_bin_10"]),
                        int(row["speed_bin"]),
                        float(row["Count"]),
                    )

                total_obs = float(hist2d.sum())
                if total_obs <= 0:
                    continue
                rel_field = (hist2d / total_obs) * 100.0
                rel_field = smooth_frequency_field(rel_field, passes=3)
                layer_fields[code] = rel_field
                peak_rel = float(np.nanmax(rel_field)) if rel_field.size else 0.0
                if peak_rel < cutoff_pct:
                    continue

                low = max(cutoff_pct, peak_rel * 0.08)
                high = max(low, peak_rel * 0.92)
                levels = sorted({round(float(level), 3) for level in np.geomspace(low, high, num=6)})

                first_for_code = True
                for level_idx, level in enumerate(levels):
                    boundary = boundary_from_level(rel_field, level)
                    boundary_max = float(np.max(boundary))
                    if boundary_max <= 0.0:
                        continue
                    max_plotted_speed = max(max_plotted_speed, boundary_max)
                    theta_vals = list(dir_centers) + [float(dir_centers[0])]
                    r_vals = list(boundary) + [float(boundary[0])]
                    alpha = min(0.10 + level_idx * 0.07, 0.42)
                    scatter_polar.add_trace(go.Scatterpolar(
                        theta=theta_vals,
                        r=r_vals,
                        mode="lines",
                        name=code,
                        legendgroup=code,
                        showlegend=first_for_code,
                        legendrank=legend_order.get(code, 999),
                        meta={"legendColor": phenom_colors[code]},
                        line=dict(color=hex_to_rgba(phenom_colors[code], min(alpha + 0.28, 0.95)), width=1.1),
                        fill="toself",
                        fillcolor=hex_to_rgba(phenom_colors[code], alpha),
                        hoverinfo="skip",
                    ))
                    first_for_code = False

                if not first_for_code:
                    traces_added += 1
                    plotted_codes.append(code)

            if traces_added > 0:
                speed_centers = speed_edges[:-1] + (speed_step / 2.0)
                theta_mesh = np.tile(dir_centers, len(speed_centers))
                r_mesh = np.repeat(speed_centers, len(dir_centers))
                hover_order = plotted_codes
                hover_fields = {
                    code: layer_fields.get(code, np.zeros((len(speed_centers), len(dir_centers)), dtype=float))
                    for code in hover_order
                }
                custom_rows: list[list[float]] = []
                for speed_idx in range(len(speed_centers)):
                    for dir_idx in range(len(dir_centers)):
                        custom_rows.append([float(hover_fields[code][speed_idx, dir_idx]) for code in hover_order])

                hover_lines = ["Direction: %{theta:.0f}°", "Wind Speed: %{r:.1f} kt"]
                hover_lines.extend([f"{code}: %{{customdata[{idx}]:.3f}}%" for idx, code in enumerate(hover_order)])
                hover_template = "<br>".join(hover_lines) + "<extra></extra>"

                scatter_polar.add_trace(go.Scatterpolar(
                    theta=theta_mesh,
                    r=r_mesh,
                    mode="markers",
                    name="",
                    showlegend=False,
                    marker=dict(size=14, color="rgba(0,0,0,0.001)"),
                    customdata=custom_rows,
                    hovertemplate=hover_template,
                ))

                display_max_speed = max(10.0, float(math.ceil((max_plotted_speed * 1.1) / 5.0) * 5.0))
                bg_img_base64 = None
                try:
                    airport_lat = COORDS_DF.loc[icao, "LAT"]
                    airport_lon = COORDS_DF.loc[icao, "LONG"]
                    bg_img_base64 = get_centered_background(float(airport_lat), float(airport_lon), zoom=ZOOM_LEVEL)
                except Exception:
                    pass
                scatter_polar.update_layout(
                    title="Wind Direction/Strength Relative Frequency (Smoothed)",
                    polar=dict(
                        bgcolor="rgba(0,0,0,0)",
                        angularaxis=dict(direction="clockwise", period=360),
                        radialaxis=dict(angle=90, tickangle=90, ticksuffix=" kt", range=[0, display_max_speed]),
                    ),
                    legend=dict(title_text="Phenomenon", groupclick="togglegroup"),
                    margin=dict(l=36, r=36, t=52, b=22),
                )
                apply_topo_map_panel_layout(scatter_polar, "radial_scatter_dust")
                if bg_img_base64:
                    apply_polar_background(scatter_polar, bg_img_base64)
                figures["radial_scatter_dust"] = scatter_polar

    return figures


def build_placeholder_figure(title: str, _subtitle: str = NO_DATA_MESSAGE) -> go.Figure:
    fig = go.Figure()
    fig.add_annotation(
        x=0.5,
        y=0.5,
        xref="paper",
        yref="paper",
        text=NO_DATA_MESSAGE,
        showarrow=False,
        font=dict(size=14, color="#435a84"),
    )
    fig.update_xaxes(visible=False)
    fig.update_yaxes(visible=False)
    fig.update_layout(
        title=dict(text=title, font=dict(size=14)),
        plot_bgcolor="white",
        paper_bgcolor="white",
    )
    return fig


def split_fog_day_type_datasets(fog_df: pd.DataFrame, icao: str) -> dict[str, tuple[pd.DataFrame, str]]:
    if fog_df.empty:
        empty = fog_df.copy()
        return {
            "all": (empty, "All Days"),
            "rain": (empty, "Rain Days"),
            "non_rain": (empty, "Non-rain Days"),
        }

    work, daily_flags = compute_daily_weather_flags(fog_df, icao)

    if work.empty:
        return {
            "all": (work, "All Days"),
            "rain": (work, "Rain Days"),
            "non_rain": (work, "Non-rain Days"),
        }

    rain_by_day = daily_flags[["bom_day", "Rain"]].rename(columns={"Rain": "is_rain_day"})
    work = work.merge(rain_by_day, on="bom_day", how="left")
    work["is_rain_day"] = work["is_rain_day"].fillna(False)

    return {
        "all": (work, "All Days"),
        "rain": (work[work["is_rain_day"]].copy(), "Rain Days"),
        "non_rain": (work[~work["is_rain_day"]].copy(), "Non-rain Days"),
    }


def compute_fog_low_cloud_day_flags(
    fog_df: pd.DataFrame,
    icao: str,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    flag_metric_columns = [
        "Freezing fog",
        "Fog",
        "below 2000ft",
        "below 1500ft",
        "below 1000ft",
        "below 500ft",
    ]
    if fog_df.empty:
        empty_work = fog_df.copy()
        empty_daily = pd.DataFrame(
            columns=[
                "bom_day",
                "bom_year",
                "bom_month",
                *flag_metric_columns,
            ]
        )
        empty_hourly = pd.DataFrame(
            columns=[
                "bom_day",
                "bom_year",
                "bom_month",
                "hour",
                *flag_metric_columns,
            ]
        )
        return empty_work, empty_daily, empty_hourly

    work = fog_df.copy()
    work["TM_FULL"] = pd.to_datetime(work["TM_FULL"], utc=True, errors="coerce")
    work = work.dropna(subset=["TM_FULL"])
    if work.empty:
        return compute_fog_low_cloud_day_flags(pd.DataFrame(), icao)

    tz_name = airport_timezone(icao)
    local_ts = work["TM_FULL"].dt.tz_convert(tz_name)
    work["bom_day"] = (local_ts - pd.Timedelta(hours=9)).dt.date
    work["bom_year"] = pd.to_datetime(work["bom_day"]).dt.year
    work["bom_month"] = pd.to_datetime(work["bom_day"]).dt.month
    if "hour" not in work.columns:
        work["hour"] = work["TM_FULL"].dt.hour

    work["is_fog"] = fog_observation_mask(work)
    air_temp = pd.to_numeric(work.get("AIR_TEMP"), errors="coerce")
    work["is_freezing_fog"] = work["is_fog"] & air_temp.le(0.0)
    work["is_fog_only"] = work["is_fog"] & ~work["is_freezing_fog"]
    work["lowest_low_cloud_ceiling"] = lowest_low_cloud_ceiling(work)

    daily_flags = work.groupby(["bom_day", "bom_year", "bom_month"], as_index=False).agg(
        has_fog=("is_fog", "any"),
        has_freezing_fog=("is_freezing_fog", "any"),
        lowest_low_cloud_ceiling=("lowest_low_cloud_ceiling", "min"),
    )
    hourly_flags = work.groupby(["bom_day", "bom_year", "bom_month", "hour"], as_index=False).agg(
        has_fog=("is_fog", "any"),
        has_freezing_fog=("is_freezing_fog", "any"),
        lowest_low_cloud_ceiling=("lowest_low_cloud_ceiling", "min"),
    )

    for flags_df in (daily_flags, hourly_flags):
        flags_df["Freezing fog"] = flags_df["has_freezing_fog"]
        flags_df["Fog"] = flags_df["has_fog"] & ~flags_df["has_freezing_fog"]
        lowest_ceiling = pd.to_numeric(flags_df["lowest_low_cloud_ceiling"], errors="coerce")
        flags_df["below 2000ft"] = lowest_ceiling.lt(2000) & lowest_ceiling.ge(1500)
        flags_df["below 1500ft"] = lowest_ceiling.lt(1500) & lowest_ceiling.ge(1000)
        flags_df["below 1000ft"] = lowest_ceiling.lt(1000) & lowest_ceiling.ge(500)
        flags_df["below 500ft"] = lowest_ceiling.lt(500)
        flags_df.drop(columns=["has_fog", "has_freezing_fog"], inplace=True)

    return work, daily_flags, hourly_flags


FOG_LOW_CLOUD_METRIC_COLUMNS = ("Freezing fog", "Fog", "below 2000ft", "below 1500ft", "below 1000ft", "below 500ft")
LOW_CLOUD_METRIC_COLUMNS = ("below 2000ft", "below 1500ft", "below 1000ft", "below 500ft")


def _fog_metric_values_from_precomputed_row(row: dict[str, Any]) -> dict[str, float]:
    values = {
        col: float(row.get(col, 0.0) or 0.0)
        for col in FOG_LOW_CLOUD_METRIC_COLUMNS
    }
    if "Freezing fog" not in row:
        legacy_fog = float(row.get("Fog", 0.0) or 0.0)
        values["Freezing fog"] = 0.0
        values["Fog"] = legacy_fog
    return values


def _fog_stack_rows_from_avg_frame(avg_frame: pd.DataFrame, index_col: str) -> pd.DataFrame:
    frames: list[pd.DataFrame] = []
    for fog_label in FOG_STACK_LABELS:
        if fog_label not in avg_frame.columns:
            continue
        part = avg_frame[[index_col, fog_label]].rename(columns={fog_label: "Count"})
        part["Type"] = fog_label
        part["Threshold"] = None
        frames.append(part)
    if not frames:
        return pd.DataFrame(columns=[index_col, "Count", "Type", "Threshold"])
    return pd.concat(frames, ignore_index=True)


def _fog_stack_series(
    combined: pd.DataFrame,
    *,
    index_col: str,
    index_labels: list[str],
) -> dict[str, list[float]]:
    series: dict[str, list[float]] = {}
    for fog_label in FOG_STACK_LABELS:
        values = (
            combined[combined["Type"] == fog_label]
            .groupby(index_col)["Count"]
            .sum()
            .reindex(index_labels)
            .fillna(0.0)
            .astype(float)
            .tolist()
        )
        series[fog_label] = values
    return series


def _fog_stack_has_values(values: list[float]) -> bool:
    return any(float(value or 0.0) > 0.0 for value in values)


def _add_fog_stack_bars(
    fig: go.Figure,
    *,
    x_values: list[float],
    index_labels: list[str],
    fog_series: dict[str, list[float]],
    hover_prefix: str,
    bar_width: float,
) -> None:
    for fog_label in FOG_STACK_LABELS:
        y_values = fog_series.get(fog_label, [0.0] * len(index_labels))
        has_values = _fog_stack_has_values(y_values)
        fig.add_bar(
            x=x_values,
            y=y_values,
            name=fog_label,
            marker_color=FOG_STACK_COLORS[fog_label],
            customdata=index_labels,
            width=bar_width,
            showlegend=has_values,
            hoverinfo="skip" if not has_values else "all",
            hovertemplate=(
                f"{hover_prefix}: %{{customdata}}<br>"
                f"{fog_label}: %{{y:.2f}}%<extra></extra>"
            ) if has_values else None,
        )


def fog_metric_counts_to_rates(frame: pd.DataFrame, denominator_col: str) -> pd.DataFrame:
    work = frame.copy()
    denom = pd.to_numeric(work.get(denominator_col, 0.0), errors="coerce").fillna(0.0)
    for col in FOG_LOW_CLOUD_METRIC_COLUMNS:
        if col not in work.columns:
            continue
        values = pd.to_numeric(work[col], errors="coerce").fillna(0.0)
        work[col] = np.where(denom > 0, (values / denom) * 100.0, 0.0)
    return work


def _precomputed_row_matches_climate_state(
    row: dict[str, Any],
    *,
    selected_state: dict[str, str],
    require_all_only: bool,
) -> bool:
    enso_value = str(row.get("enso_norm", "")).strip().lower()
    iod_value = str(row.get("iod_norm", "")).strip().lower()
    sam_value = str(row.get("sam_norm", "")).strip().lower()
    mjo_value = str(row.get("mjo_norm", "")).strip().lower()
    if require_all_only:
        return enso_value == iod_value == sam_value == mjo_value == "all"
    if selected_state.get("enso_norm", "all") != "all" and enso_value != selected_state["enso_norm"]:
        return False
    if selected_state.get("iod_norm", "all") != "all" and iod_value != selected_state["iod_norm"]:
        return False
    if selected_state.get("sam_norm", "all") != "all" and sam_value != selected_state["sam_norm"]:
        return False
    if selected_state.get("mjo_norm", "all") != "all" and mjo_value != selected_state["mjo_norm"]:
        return False
    return True


def _fog_row_denominator_days(row: dict[str, Any], *, year: int, month: int) -> float:
    total_days = float(row.get("total_days", 0.0) or 0.0)
    if total_days > 0:
        return total_days
    import calendar

    return float(calendar.monthrange(year, month)[1])


def monthly_fog_rates_from_precomputed_rows(
    rows: list[dict[str, Any]],
    mode: str | None,
    year_start: int,
    year_end: int,
    selected_months: set[int],
    selected_state: dict[str, str] | None = None,
    require_all_only: bool = False,
) -> pd.DataFrame:
    if not rows:
        return pd.DataFrame()

    selected_state = selected_state or {
        "enso_norm": "all",
        "iod_norm": "all",
        "sam_norm": "all",
        "mjo_norm": "all",
    }
    if not require_all_only:
        require_all_only = all(value == "all" for value in selected_state.values())

    metric_count = len(FOG_LOW_CLOUD_METRIC_COLUMNS)
    agg: dict[tuple[int, int], list[float]] = {}

    for row in rows:
        if not isinstance(row, dict):
            continue
        try:
            if mode is not None and str(row.get("mode", "")) != mode:
                continue

            row_year = int(row.get("bom_year", -1))
            row_month = int(row.get("bom_month", -1))
            if row_year < year_start or row_year > year_end:
                continue
            if row_month not in selected_months:
                continue
            if not _precomputed_row_matches_climate_state(
                row,
                selected_state=selected_state,
                require_all_only=require_all_only,
            ):
                continue

            key = (row_year, row_month)
            bucket = agg.get(key)
            if bucket is None:
                bucket = [0.0] * (metric_count + 1)
                agg[key] = bucket

            for idx, col in enumerate(FOG_LOW_CLOUD_METRIC_COLUMNS):
                bucket[idx] += _fog_metric_values_from_precomputed_row(row)[col]
            bucket[-1] += _fog_row_denominator_days(row, year=row_year, month=row_month)
        except (TypeError, ValueError):
            continue

    if not agg:
        return pd.DataFrame()

    rate_rows: list[dict[str, Any]] = []
    for (_, month), bucket in agg.items():
        denom = bucket[-1]
        rates = [
            (bucket[idx] / denom * 100.0) if denom > 0 else 0.0
            for idx in range(metric_count)
        ]
        rate_row: dict[str, Any] = {"month": month}
        for idx, col in enumerate(FOG_LOW_CLOUD_METRIC_COLUMNS):
            rate_row[col] = rates[idx]
        rate_rows.append(rate_row)

    monthly_avg = (
        pd.DataFrame(rate_rows)
        .groupby("month", as_index=False)[list(FOG_LOW_CLOUD_METRIC_COLUMNS)]
        .mean()
    )
    monthly_avg["Month"] = monthly_avg["month"].apply(lambda m: MONTH_NAMES[m - 1])
    return monthly_avg


def hourly_fog_rates_from_precomputed_rows(
    rows: list[dict[str, Any]],
    mode: str | None,
    year_start: int,
    year_end: int,
    selected_months: set[int],
    selected_state: dict[str, str] | None = None,
    require_all_only: bool = False,
) -> tuple[list[float], list[list[float]]] | None:
    if not rows:
        return None

    selected_state = selected_state or {
        "enso_norm": "all",
        "iod_norm": "all",
        "sam_norm": "all",
        "mjo_norm": "all",
    }
    if not require_all_only:
        require_all_only = all(value == "all" for value in selected_state.values())

    metric_count = len(FOG_LOW_CLOUD_METRIC_COLUMNS)
    agg: dict[tuple[int, int], list[float]] = {}

    for row in rows:
        if not isinstance(row, dict):
            continue
        try:
            if mode is not None and str(row.get("mode", "")) != mode:
                continue

            row_year = int(row.get("bom_year", -1))
            row_month = int(row.get("bom_month", -1))
            row_hour = int(row.get("hour", -1))
            if row_year < year_start or row_year > year_end:
                continue
            if row_month not in selected_months:
                continue
            if row_hour < 0 or row_hour > 23:
                continue
            if not _precomputed_row_matches_climate_state(
                row,
                selected_state=selected_state,
                require_all_only=require_all_only,
            ):
                continue

            key = (row_year, row_hour)
            bucket = agg.get(key)
            if bucket is None:
                bucket = [0.0] * (metric_count + 1)
                agg[key] = bucket

            for idx, col in enumerate(FOG_LOW_CLOUD_METRIC_COLUMNS):
                bucket[idx] += _fog_metric_values_from_precomputed_row(row)[col]
            bucket[-1] += float(row.get("total_day_hours", 0.0) or 0.0)
        except (TypeError, ValueError):
            continue

    if not agg:
        return None

    has_denominator = any(bucket[-1] > 0 for bucket in agg.values())
    year_hour_rates: list[tuple[int, list[float]]] = []
    for (_, hour), bucket in agg.items():
        if has_denominator:
            denom = bucket[-1]
            rates = [
                (bucket[idx] / denom * 100.0) if denom > 0 else 0.0
                for idx in range(metric_count)
            ]
        else:
            rates = bucket[:-1]
        year_hour_rates.append((hour, rates))

    per_hour_sum = [[0.0] * metric_count for _ in range(24)]
    per_hour_count = [0] * 24
    for hour, rates in year_hour_rates:
        if hour < 0 or hour > 23:
            continue
        for idx in range(metric_count):
            per_hour_sum[hour][idx] += rates[idx]
        per_hour_count[hour] += 1

    freezing_fog_by_hour_values = [
        (per_hour_sum[hour][0] / per_hour_count[hour]) if per_hour_count[hour] > 0 else 0.0
        for hour in range(24)
    ]
    fog_by_hour_values = [
        (per_hour_sum[hour][1] / per_hour_count[hour]) if per_hour_count[hour] > 0 else 0.0
        for hour in range(24)
    ]
    threshold_value_lists = [
        [
            (per_hour_sum[hour][series_idx] / per_hour_count[hour]) if per_hour_count[hour] > 0 else 0.0
            for hour in range(24)
        ]
        for series_idx in range(2, metric_count)
    ]
    return freezing_fog_by_hour_values, fog_by_hour_values, threshold_value_lists


def combined_fog_frequency_from_monthly_avg(monthly_avg: pd.DataFrame) -> pd.DataFrame:
    if monthly_avg.empty:
        return pd.DataFrame(columns=["Month", "Count", "Type", "Threshold"])

    fog_monthly = _fog_stack_rows_from_avg_frame(monthly_avg, "Month")

    low_cloud_monthly = monthly_avg.melt(
        id_vars=["month", "Month"],
        value_vars=list(LOW_CLOUD_METRIC_COLUMNS),
        var_name="Threshold",
        value_name="Count",
    )
    low_cloud_monthly["Type"] = "Low cloud"

    return pd.concat(
        [
            fog_monthly[["Month", "Count", "Type", "Threshold"]],
            low_cloud_monthly[["Month", "Count", "Type", "Threshold"]],
        ],
        ignore_index=True,
    )


def average_monthly_fog_low_cloud_days(fog_df: pd.DataFrame, icao: str) -> pd.DataFrame:
    _, daily_flags, _ = compute_fog_low_cloud_day_flags(fog_df, icao)
    if daily_flags.empty:
        return pd.DataFrame(columns=["Month", "Count", "Type", "Threshold"])

    monthly_counts = (
        daily_flags.groupby(["bom_year", "bom_month"], as_index=False)
        .agg(
            **{
                "Freezing fog": ("Freezing fog", "sum"),
                "Fog": ("Fog", "sum"),
                "total_days": ("bom_day", "nunique"),
                "below 2000ft": ("below 2000ft", "sum"),
                "below 1500ft": ("below 1500ft", "sum"),
                "below 1000ft": ("below 1000ft", "sum"),
                "below 500ft": ("below 500ft", "sum"),
            },
        )
    )

    # Convert day counts into rates so rain/non-rain/all are comparable.
    monthly_counts["total_days"] = pd.to_numeric(monthly_counts["total_days"], errors="coerce").fillna(0.0)
    for col in list(FOG_LOW_CLOUD_METRIC_COLUMNS):
        monthly_counts[col] = np.where(
            monthly_counts["total_days"] > 0,
            (pd.to_numeric(monthly_counts[col], errors="coerce").fillna(0.0) / monthly_counts["total_days"]) * 100.0,
            0.0,
        )

    monthly_avg = (
        monthly_counts.groupby("bom_month", as_index=False)[list(FOG_LOW_CLOUD_METRIC_COLUMNS)]
        .mean()
        .rename(columns={"bom_month": "month"})
    )
    monthly_avg["Month"] = monthly_avg["month"].apply(lambda m: MONTH_NAMES[m - 1])

    fog_monthly = _fog_stack_rows_from_avg_frame(monthly_avg, "Month")

    low_cloud_monthly = monthly_avg.melt(
        id_vars=["month", "Month"],
        value_vars=list(LOW_CLOUD_METRIC_COLUMNS),
        var_name="Threshold",
        value_name="Count",
    )
    low_cloud_monthly["Type"] = "Low cloud"

    return pd.concat(
        [
            fog_monthly[["Month", "Count", "Type", "Threshold"]],
            low_cloud_monthly[["Month", "Count", "Type", "Threshold"]],
        ],
        ignore_index=True,
    )


def average_hourly_fog_low_cloud_days(fog_df: pd.DataFrame, icao: str) -> pd.DataFrame:
    _, _, hourly_flags = compute_fog_low_cloud_day_flags(fog_df, icao)
    if hourly_flags.empty:
        return pd.DataFrame(columns=["Hour", "Count", "Type", "Threshold"])

    hourly_counts = (
        hourly_flags.groupby(["bom_year", "hour"], as_index=False)
        .agg(
            **{
                "Freezing fog": ("Freezing fog", "sum"),
                "Fog": ("Fog", "sum"),
                "total_day_hours": ("bom_day", "nunique"),
                "below 2000ft": ("below 2000ft", "sum"),
                "below 1500ft": ("below 1500ft", "sum"),
                "below 1000ft": ("below 1000ft", "sum"),
                "below 500ft": ("below 500ft", "sum"),
            },
        )
    )

    # Convert per-hour day counts into rates so selections are duration-normalized.
    hourly_counts["total_day_hours"] = pd.to_numeric(hourly_counts["total_day_hours"], errors="coerce").fillna(0.0)
    for col in list(FOG_LOW_CLOUD_METRIC_COLUMNS):
        hourly_counts[col] = np.where(
            hourly_counts["total_day_hours"] > 0,
            (pd.to_numeric(hourly_counts[col], errors="coerce").fillna(0.0) / hourly_counts["total_day_hours"]) * 100.0,
            0.0,
        )

    hourly_avg = hourly_counts.groupby("hour", as_index=False)[list(FOG_LOW_CLOUD_METRIC_COLUMNS)].mean()
    hourly_avg["Hour"] = hourly_avg["hour"].astype(int).astype(str)

    fog_hourly = _fog_stack_rows_from_avg_frame(hourly_avg, "Hour")

    low_cloud_hourly = hourly_avg.melt(
        id_vars=["hour", "Hour"],
        value_vars=list(LOW_CLOUD_METRIC_COLUMNS),
        var_name="Threshold",
        value_name="Count",
    )
    low_cloud_hourly["Type"] = "Low cloud"

    return pd.concat(
        [
            fog_hourly[["Hour", "Count", "Type", "Threshold"]],
            low_cloud_hourly[["Hour", "Count", "Type", "Threshold"]],
        ],
        ignore_index=True,
    )


def monthly_fog_low_cloud_dewpoint_by_category(fog_df: pd.DataFrame) -> pd.DataFrame:
    if fog_df.empty:
        return pd.DataFrame(columns=["month", "Category", "AvgDWPT"])

    dewpoint_df = fog_df.copy()
    dewpoint_df["DWPT"] = pd.to_numeric(dewpoint_df["DWPT"], errors="coerce")
    dewpoint_df = dewpoint_df.dropna(subset=["DWPT"])
    if dewpoint_df.empty:
        return pd.DataFrame(columns=["month", "Category", "AvgDWPT"])

    dewpoint_df["is_fog"] = fog_observation_mask(dewpoint_df)
    lowest_ceiling = lowest_low_cloud_ceiling(dewpoint_df)

    category_masks = [
        ("Fog", dewpoint_df["is_fog"]),
        ("2000ft - 1500ft cloud", lowest_ceiling.lt(2000) & lowest_ceiling.ge(1500)),
        ("1500ft - 1000ft cloud", lowest_ceiling.lt(1500) & lowest_ceiling.ge(1000)),
        ("1000ft - 500ft cloud", lowest_ceiling.lt(1000) & lowest_ceiling.ge(500)),
        ("< 500ft cloud", lowest_ceiling.lt(500)),
    ]

    frames: list[pd.DataFrame] = []
    for label, mask in category_masks:
        masked = dewpoint_df[mask].copy()
        if masked.empty:
            continue

        monthly_avg = masked.groupby("month", as_index=False)["DWPT"].mean()
        monthly_avg = monthly_avg.rename(columns={"DWPT": "AvgDWPT"})
        monthly_avg["Category"] = label
        frames.append(monthly_avg)

    if not frames:
        return pd.DataFrame(columns=["month", "Category", "AvgDWPT"])

    return pd.concat(frames, ignore_index=True)


@lru_cache(maxsize=512)
def airport_timezone(icao: str) -> str:
    if icao in COORDS_DF.index:
        lat = float(COORDS_DF.loc[icao, "LAT"])
        lon = float(COORDS_DF.loc[icao, "LONG"])
        tz_name = get_tz_finder().timezone_at(lat=lat, lng=lon)
        if tz_name:
            return tz_name
    return "UTC"


def monthly_avg_daily_extremes(temp_df: pd.DataFrame, icao: str) -> pd.DataFrame:
    if temp_df.empty:
        return pd.DataFrame()

    work = temp_df.copy()
    work["TM_FULL"] = pd.to_datetime(work["TM_FULL"], utc=True, errors="coerce")
    work = work.dropna(subset=["TM_FULL"])
    if work.empty:
        return pd.DataFrame()

    tz_name = airport_timezone(icao)
    local_ts = work["TM_FULL"].dt.tz_convert(tz_name)

    # BOM max/min are tied to a local 9am clock-time observation window.
    work["bom_day"] = (local_ts - pd.Timedelta(hours=9)).dt.date

    daily = (
        work.groupby("bom_day", as_index=False)
        .agg(
            daily_max_t=("AIR_TEMP", "max"),
            daily_min_t=("AIR_TEMP", "min"),
            daily_max_td=("DWPT", "max"),
            daily_min_td=("DWPT", "min"),
        )
    )
    if daily.empty:
        return pd.DataFrame()

    daily["month"] = pd.to_datetime(daily["bom_day"]).dt.month
    monthly = (
        daily.groupby("month", as_index=False)
        .agg(
            avg_daily_max_t=("daily_max_t", "mean"),
            avg_daily_min_t=("daily_min_t", "mean"),
            avg_daily_max_td=("daily_max_td", "mean"),
            avg_daily_min_td=("daily_min_td", "mean"),
        )
    )

    monthly["Month"] = monthly["month"].apply(lambda m: MONTH_NAMES[m - 1])
    monthly["Month"] = pd.Categorical(monthly["Month"], categories=MONTH_NAMES, ordered=True)
    monthly = monthly.sort_values("Month")
    monthly = monthly.rename(
        columns={
            "avg_daily_max_t": "Avg Daily Max T",
            "avg_daily_min_t": "Avg Daily Min T",
            "avg_daily_max_td": "Avg Daily Max Td",
            "avg_daily_min_td": "Avg Daily Min Td",
        }
    )
    return monthly


def monthly_avg_precipitation_mm(precip_df: pd.DataFrame, icao: str) -> pd.DataFrame:
    if precip_df.empty or "PRCP_FM_09" not in precip_df.columns:
        return pd.DataFrame()

    work = precip_df.copy()
    work["TM_FULL"] = pd.to_datetime(work["TM_FULL"], utc=True, errors="coerce")
    work["PRCP_FM_09"] = pd.to_numeric(work["PRCP_FM_09"], errors="coerce")
    work = work.dropna(subset=["TM_FULL"])
    if work.empty:
        return pd.DataFrame()

    tz_name = airport_timezone(icao)
    local_ts = work["TM_FULL"].dt.tz_convert(tz_name)

    # BOM precipitation totals align to the local 9am observation day.
    work["bom_day"] = (local_ts - pd.Timedelta(hours=9)).dt.date
    work["bom_year"] = pd.to_datetime(work["bom_day"]).dt.year
    work["bom_month"] = pd.to_datetime(work["bom_day"]).dt.month

    daily = (
        work.groupby(["bom_day", "bom_year", "bom_month"], as_index=False)
        .agg(daily_precip_mm=("PRCP_FM_09", "max"))
        .dropna(subset=["daily_precip_mm"])
    )
    if daily.empty:
        return pd.DataFrame()

    monthly = (
        daily.groupby(["bom_year", "bom_month"], as_index=False)
        .agg(monthly_precip_mm=("daily_precip_mm", "sum"))
    )
    if monthly.empty:
        return pd.DataFrame()

    monthly = (
        monthly.groupby("bom_month", as_index=False)["monthly_precip_mm"]
        .mean()
        .rename(columns={"bom_month": "month", "monthly_precip_mm": "Avg Monthly Precip"})
    )
    monthly["Month"] = monthly["month"].apply(lambda m: MONTH_NAMES[m - 1])
    monthly["Month"] = pd.Categorical(monthly["Month"], categories=MONTH_NAMES, ordered=True)
    monthly = monthly.sort_values("Month")
    return monthly


def build_range_mask(col_name: str, selected_range: tuple[int, int], invert: bool = False) -> pl.Expr:
    start, end = selected_range
    if invert:
        return (pl.col(col_name) <= start) | (pl.col(col_name) >= end)
    return pl.col(col_name).is_between(start, end)


def build_season_mask(season: str) -> pl.Expr:
    months = SEASON_TO_MONTHS.get(season, SEASON_TO_MONTHS["all"])
    return pl.col("month").is_in(months)


def apply_climate_driver_filters(
    df: pl.DataFrame,
    *,
    enso: str,
    iod: str,
    sam: str,
    mjo: str,
) -> pl.DataFrame:
    climate_df = get_climate_df()
    selected = {
        "enso": normalize_driver_selection(enso),
        "iod": normalize_driver_selection(iod),
        "sam": normalize_driver_selection(sam),
        "mjo": normalize_driver_selection(mjo),
    }
    selected = {k: v for k, v in selected.items() if v != "all"}

    if not selected:
        return df

    if climate_df.is_empty():
        return df.head(0)

    joined = (
        df.with_columns(pl.col("TM_FULL").dt.day().cast(pl.Int32).alias("day"))
        .join(climate_df, on=["year", "month", "day"], how="inner")
    )

    for driver, value in selected.items():
        joined = joined.filter(pl.col(f"{driver}_norm") == value)

    return joined.drop(["day"]) if "day" in joined.columns else joined


def topo_crop_extent_km(lat: float, zoom: int = ZOOM_LEVEL, crop_size: int = 512) -> float:
    lat_rad = math.radians(lat)
    meters_per_pixel = math.cos(lat_rad) * 2 * math.pi * 6378137 / (256 * (2**zoom))
    return crop_size * meters_per_pixel / 1000.0


def topo_display_extent_km(icao: str) -> float:
    """Square km span of the airport topo crop; matches radial plot background coverage."""
    coords = airport_lat_lon(icao)
    if coords is None:
        return topo_crop_extent_km(-37.8)
    return topo_crop_extent_km(float(coords[0]))


def lightning_heatmap_extent_km(icao: str = "") -> float:
    """Fixed 60 km square heatmap span (30 km strike radius) centred on the aerodrome."""
    _ = icao
    return LIGHTNING_HEATMAP_EXTENT_KM


@lru_cache(maxsize=8)
def get_centered_background(lat: float, lon: float, zoom: int = 9, crop_size: int = 512) -> str:
    n = 2.0 ** zoom

    x_frac = (lon + 180.0) / 360.0 * n
    lat_rad = math.radians(lat)
    y_frac = (1.0 - math.log(math.tan(lat_rad) + (1 / math.cos(lat_rad))) / math.pi) / 2.0 * n

    xtile_center = int(x_frac)
    ytile_center = int(y_frac)

    x_offset = int((x_frac - xtile_center) * 256)
    y_offset = int((y_frac - ytile_center) * 256)

    canvas = Image.new("RGB", (768, 768), (230, 230, 230))
    loaded_center = False

    for i, dx in enumerate([-1, 0, 1]):
        for j, dy in enumerate([-1, 0, 1]):
            x_clamped = xtile_center + dx
            y_clamped = ytile_center + dy
            tile_path = os.path.join(TILE_DIR, str(x_clamped), f"{y_clamped}.jpg")

            if os.path.exists(tile_path):
                try:
                    tile = Image.open(tile_path)
                    canvas.paste(tile, (i * 256, j * 256))
                    if i == 1 and j == 1:
                        loaded_center = True
                except Exception:
                    tile = Image.new("RGB", (256, 256), (220, 220, 220))
                    canvas.paste(tile, (i * 256, j * 256))
            else:
                tile = Image.new("RGB", (256, 256), (220, 220, 220))
                canvas.paste(tile, (i * 256, j * 256))

    if not loaded_center:
        raise RuntimeError(f"Center tile missing near X={xtile_center}, Y={ytile_center} in {TILE_DIR}")

    left = (256 + x_offset) - (crop_size // 2)
    top = (256 + y_offset) - (crop_size // 2)
    right = left + crop_size
    bottom = top + crop_size

    cropped_canvas = canvas.crop((left, top, right, bottom))

    buffer = BytesIO()
    cropped_canvas.save(buffer, format="PNG")
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.getvalue()).decode()

    return f"data:image/png;base64,{img_base64}"


def apply_topo_map_panel_layout(fig: go.Figure, figure_id: str = "", *, cartesian: bool = False) -> None:
    """Apply shared map frame geometry for airport topo background charts."""
    if figure_id and figure_id not in TOPO_MAP_FIGURE_IDS and not cartesian:
        return

    margin = TOPO_MAP_PANEL["margin"]
    plot_domain = TOPO_MAP_PANEL["plotDomain"]
    use_cartesian = cartesian or figure_id == "lightning_heatmap"

    if use_cartesian:
        xaxis = fig.layout.xaxis.to_plotly_json() if fig.layout.xaxis else {}
        yaxis = fig.layout.yaxis.to_plotly_json() if fig.layout.yaxis else {}
        fig.update_layout(
            margin=dict(**margin),
            xaxis={
                **xaxis,
                "domain": list(plot_domain["x"]),
                "scaleanchor": "y",
                "scaleratio": 1,
                "automargin": False,
            },
            yaxis={
                **yaxis,
                "domain": list(plot_domain["y"]),
                "automargin": False,
            },
        )
        for trace in fig.data:
            if getattr(trace, "type", None) == "heatmap" and getattr(trace, "colorbar", None) is not None:
                trace.colorbar.update(
                    x=1.02,
                    xanchor="left",
                    len=0.75,
                    y=0.5,
                    yanchor="middle",
                )
        return

    polar = fig.layout.polar.to_plotly_json() if fig.layout.polar else {}
    fig.update_layout(
        margin=dict(**margin),
        polar={
            **polar,
            "domain": {"x": list(plot_domain["x"]), "y": list(plot_domain["y"])},
        },
    )


def apply_polar_background(
    fig: go.Figure,
    img_base64: str,
    *,
    opacity: float | None = None,
    scale: float | None = None,
) -> None:
    opacity = TOPO_MAP_PANEL["backgroundOpacity"] if opacity is None else opacity
    scale = TOPO_MAP_PANEL["backgroundScale"] if scale is None else scale
    polar_layout = fig.layout.polar.to_plotly_json() if fig.layout.polar else {}
    domain = polar_layout.get("domain", {})
    domain_x = domain.get("x", [0.0, 1.0])
    domain_y = domain.get("y", [0.0, 1.0])

    x0, x1 = float(domain_x[0]), float(domain_x[1])
    y0, y1 = float(domain_y[0]), float(domain_y[1])
    center_x = (x0 + x1) / 2.0
    center_y = (y0 + y1) / 2.0
    size_x = (x1 - x0) * scale
    size_y = (y1 - y0) * scale

    fig.update_layout(
        images=[
            dict(
                source=img_base64,
                xref="paper",
                yref="paper",
                x=center_x,
                y=center_y,
                sizex=size_x,
                sizey=size_y,
                xanchor="center",
                yanchor="middle",
                sizing="contain",
                layer="below",
                opacity=opacity,
            )
        ]
    )


def apply_side_legend(
    fig: go.Figure,
    *,
    width_px: int,
    font_size: int,
    top_margin: int,
    title_text: str | None = None,
    groupclick: str | None = None,
    bgcolor: str = "rgba(255,255,255,0.88)",
    bordercolor: str = "#c7d4ef",
    borderwidth: int = 1,
    left_margin: int = 36,
    bottom_margin: int = 22,
) -> None:
    current_legend = fig.layout.legend.to_plotly_json() if fig.layout.legend else {}
    current_margin = fig.layout.margin.to_plotly_json() if fig.layout.margin else {}

    legend_config: dict[str, Any] = {
        **current_legend,
        "x": 1.0,
        "xanchor": "left",
        "y": 0.5,
        "yanchor": "middle",
        "font": {"size": font_size},
        "bgcolor": bgcolor,
        "bordercolor": bordercolor,
        "borderwidth": borderwidth,
        "entrywidthmode": "pixels",
        "entrywidth": width_px,
        "itemwidth": LEGEND_SYMBOL_WIDTH,
    }
    if title_text is not None:
        legend_config["title_text"] = title_text
    if groupclick is not None:
        legend_config["groupclick"] = groupclick

    margin_config = {
        **current_margin,
        "l": left_margin,
        "r": max(int(current_margin.get("r", 0) or 0), width_px + LEGEND_MARGIN_PADDING),
        "t": top_margin,
        "b": bottom_margin,
    }

    fig.update_layout(legend=legend_config, margin=margin_config)

    for trace in fig.data:
        if hasattr(trace, "_valid_props") and "legendwidth" in trace._valid_props:
            trace.legendwidth = width_px


def apply_common_layout(fig: Any, height: int = PLOT_HEIGHT) -> None:
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#333333", family="Source Sans 3, Open Sans, Arial, sans-serif"),
        title=dict(x=0.01, xanchor="left", y=0.98, yanchor="top", font=dict(size=14)),
        margin=dict(l=36, r=DEFAULT_LEGEND_ENTRY_WIDTH + LEGEND_MARGIN_PADDING, t=36, b=22),
        height=height,
    )
    apply_side_legend(fig, width_px=DEFAULT_LEGEND_ENTRY_WIDTH, font_size=11, top_margin=36)


GROUPED_BAR_FREQUENCY_FIGURE_IDS = frozenset({
    "rain_thunder",
    "monthly_precip",
    "monthly_smoke",
    "hourly_smoke",
})


def apply_frequency_panel_layout(fig: Any, *, extra_height: int = 34, bottom_margin: int = 36) -> None:
    current_margin = fig.layout.margin.to_plotly_json() if fig.layout.margin else {}
    current_height = getattr(fig.layout, "height", None)

    update_kwargs: dict[str, Any] = {
        "margin": {
            **current_margin,
            "b": bottom_margin,
        }
    }

    if current_height is not None:
        update_kwargs["height"] = int(current_height) + extra_height

    fig.update_layout(**update_kwargs)
    fig.update_xaxes(title=None, automargin=False, ticklabelstandoff=2)
    fig.update_yaxes(automargin=False)


def apply_grouped_bar_stable_layout(fig: Any, *, extra_height: int = 34) -> None:
    """Grouped-bar frequency panels: fixed frame geometry, no baked y-axis range."""
    apply_frequency_panel_layout(fig, extra_height=extra_height, bottom_margin=36)
    xaxis = fig.layout.xaxis.to_plotly_json() if fig.layout.xaxis else {}
    yaxis = fig.layout.yaxis.to_plotly_json() if fig.layout.yaxis else {}
    fig.update_layout(
        xaxis={
            **xaxis,
            "domain": [0, 1],
            "anchor": "y",
            "automargin": False,
        },
        yaxis={
            **yaxis,
            "domain": [0, 1],
            "anchor": "x",
            "automargin": False,
            "autorange": False,
            "range": None,
        },
    )


def apply_wind_rose_style(fig: Any) -> None:
    for trace in fig.data:
        if getattr(trace, "type", None) != "barpolar":
            continue
        base_color = getattr(trace.marker, "color", None)
        if base_color is not None:
            fill_color = _wind_rose_rgba_fill(base_color)
            if fill_color is not None:
                trace.marker.color = fill_color
            trace.marker.line.color = base_color
        trace.marker.line.width = 2.0
        trace.opacity = 1


def fig_payload(fig_id: str, fig: Any) -> dict[str, Any]:
    fig_dict = json.loads(json.dumps(fig.to_plotly_json(), cls=PlotlyJSONEncoder, separators=(",", ":")))
    return {"id": fig_id, "figure": fig_dict}


def _ceil_headroom(value: float, pct: float = 0.08) -> float:
    """Round a maximum value up with a small headroom margin."""
    if value <= 0:
        return 1.0
    headroom = value * (1.0 + pct)
    magnitude = 10 ** max(0, math.floor(math.log10(headroom)) - 1)
    return math.ceil(headroom / magnitude) * magnitude


def _floor_with_padding(value: float, span: float, pct: float = 0.08) -> float:
    padded = value - (span * pct)
    if padded == 0:
        return 0.0
    magnitude = 10 ** (math.floor(math.log10(abs(padded))) - 1)
    return math.floor(padded / magnitude) * magnitude


@lru_cache(maxsize=8)
def compute_airport_y_ceilings(
    icao: str,
    needed_keys: tuple[str, ...] | None = None,
    use_precomputed: bool = True,
) -> dict[str, float]:
    """
    Compute y-axis ceilings from the full, unfiltered airport dataset so that
    non-polar charts maintain a stable scale regardless of active filters.
    Returns a dict keyed by chart figure id.
    """
    needed = set(needed_keys or ())
    if not needed:
        needed = {
            "rain_thunder", "monthly_precip", "gale_weather_split",
            "temp_dewpoint_y1_min", "temp_dewpoint_y1_max", "temp_dewpoint_y2",
            "fog_low_cloud", "monthly_fog", "fog_cloud_joint_min", "fog_cloud_joint_max",
            "fog_share", "monthly_smoke", "hourly_smoke", "scatter_wind_dewpt",
        }

    ceilings: dict[str, float] = {}
    if use_precomputed:
        precomputed, missing = precomputed_ceilings_for_airport(icao, needed)
        ceilings.update(precomputed)
        if not missing:
            return ceilings
        needed = missing

    full_df = load_airport_df(icao, columns_for_ceiling_keys(needed))
    if full_df.is_empty():
        return ceilings

    # ---------- rain_thunder / monthly_precip --------------------------------
    if needed & {"rain_thunder", "monthly_precip"}:
        try:
            rain_pd = full_df.select([
                "year", "month", "TM_FULL", "PRCP_FM_09",
                "PRST_WX_DSC_1", "PRST_WX_PHENOM_1",
                "PRST_WX_DSC_2", "PRST_WX_PHENOM_2",
            ]).to_pandas()
            rain_pd = filter_lightning_coverage_window(rain_pd, time_field="TM_FULL")
            if not rain_pd.empty:
                _, daily_flags = compute_daily_weather_flags(rain_pd, icao)
                if not daily_flags.empty:
                    mc = (
                        daily_flags.groupby(["bom_year", "bom_month"], as_index=False)
                        .agg(Rain=("Rain", "sum"), Thunderstorm=("Thunderstorm", "sum"))
                    )
                    avg = mc.groupby("bom_month")[["Rain", "Thunderstorm"]].mean()
                    max_val = float(avg.max().max()) if not avg.empty else 0.0
                    ceiling = _ceil_headroom(max_val)
                    if "rain_thunder" in needed:
                        ceilings["rain_thunder"] = ceiling
                    if "monthly_precip" in needed:
                        ceilings["monthly_precip"] = ceiling
        except Exception:
            pass

    # ---------- hourly_precip ------------------------------------------------
    if needed & {"hourly_precip", "hourly_precip_y2"}:
        try:
            rain_pd = full_df.select([
                "year", "month", "hour", "TM_FULL", "PRCP_10",
            ]).to_pandas()
            rain_pd = filter_lightning_coverage_window(rain_pd, time_field="TM_FULL")
            if not rain_pd.empty:
                rain_counts = hourly_precip_rain_observation_counts(rain_pd)
                strike_hourly = lightning_hourly_strike_counts(icao)
                hourly_rows: list[dict[str, float | int | str]] = []
                for row in rain_counts.to_dict(orient="records"):
                    hourly_rows.append({
                        "year": int(row["year"]),
                        "month": int(row["month"]),
                        "hour": int(row["hour"]),
                        "Type": "Rain",
                        "Count": float(row["Count"]),
                    })
                if not strike_hourly.empty:
                    thunder_counts = hourly_thunder_hour_counts(strike_hourly)
                    for row in thunder_counts.to_dict(orient="records"):
                        hourly_rows.append({
                            "year": int(row["bom_year"]),
                            "month": int(row["bom_month"]),
                            "hour": int(row["hour"]),
                            "Type": HOURLY_THUNDER_HOUR_TYPE,
                            "Count": float(row["Count"]),
                        })
                if hourly_rows:
                    hourly_df = pd.DataFrame(hourly_rows)
                    bar_agg, mag_agg = aggregate_hourly_rain_thunder_chart(hourly_df)
                    if "hourly_precip" in needed and not bar_agg.empty:
                        ceilings["hourly_precip"] = _ceil_headroom(float(bar_agg["Count"].max()))
                    if "hourly_precip_y2" in needed and not mag_agg.empty:
                        ceilings["hourly_precip_y2"] = _ceil_headroom(float(mag_agg["Count"].max()))
        except Exception:
            pass

    # ---------- gale_weather_split -------------------------------------------
    if "gale_weather_split" in needed:
        try:
            gale_pd = full_df.select([
                "year", "month", "TM_FULL", "WND_SPD", "MAX_WND_GUST_10",
                "PRST_WX_DSC_1", "PRST_WX_PHENOM_1",
                "PRST_WX_DSC_2", "PRST_WX_PHENOM_2",
                "PRCP_10",
            ]).to_pandas()
            gale_pd = filter_lightning_coverage_window(gale_pd, time_field="TM_FULL")
            monthly_avg = average_monthly_gale_weather_counts(gale_pd, icao, list(range(1, 13)))
            if not monthly_avg.empty:
                monthly_totals = monthly_avg.groupby("month", as_index=False)["Count"].sum()
                max_stack = float(monthly_totals["Count"].max()) if not monthly_totals.empty else 0.0
                ceilings["gale_weather_split"] = _ceil_headroom(max_stack)
        except Exception:
            pass

    # ---------- temp_dewpoint ------------------------------------------------
    if needed & {"temp_dewpoint_y1_min", "temp_dewpoint_y1_max", "temp_dewpoint_y2"}:
        try:
            temp_pd = full_df.select(["TM_FULL", "AIR_TEMP", "DWPT", "PRCP_FM_09"]).to_pandas()
            if not temp_pd.empty:
                t_avg = monthly_avg_daily_extremes(temp_pd, icao)
                if not t_avg.empty:
                    t_max = float(t_avg[["Avg Daily Max T", "Avg Daily Min T", "Avg Daily Max Td", "Avg Daily Min Td"]].max().max())
                    t_min = float(t_avg[["Avg Daily Max T", "Avg Daily Min T", "Avg Daily Max Td", "Avg Daily Min Td"]].min().min())
                    t_span = max(1.0, t_max - t_min)
                    if "temp_dewpoint_y1_max" in needed:
                        ceilings["temp_dewpoint_y1_max"] = _ceil_headroom(t_max)
                    if "temp_dewpoint_y1_min" in needed:
                        ceilings["temp_dewpoint_y1_min"] = _floor_with_padding(t_min, t_span)
                if "temp_dewpoint_y2" in needed:
                    prec_avg = monthly_avg_precipitation_mm(temp_pd, icao)
                    if not prec_avg.empty:
                        ceilings["temp_dewpoint_y2"] = _ceil_headroom(float(prec_avg["Avg Monthly Precip"].max()))
        except Exception:
            pass

    # ---------- fog / low cloud stacked bars (monthly & overview) ------------
    if needed & {"fog_low_cloud", "monthly_fog", "fog_cloud_joint_min", "fog_cloud_joint_max"}:
        try:
            fog_cols = [
                "year", "month", "TM_FULL", "AIR_TEMP", "DWPT", "VSBY", "AWS_VSBY",
                "PRCP_10", "PRCP_FM_09", "PRST_WX_PHENOM_1", "PRST_WX_PHENOM_2",
                "PRST_WX_DSC_1", "PRST_WX_DSC_2",
                "CEIL_CLD_AMT_1", "CEIL_CLD_AMT_2", "CEIL_CLD_HT_1", "CEIL_CLD_HT_2",
            ]
            fog_pd = full_df.select(fog_cols).to_pandas()
            if not fog_pd.empty:
                combined = average_monthly_fog_low_cloud_days(fog_pd, icao)
                if not combined.empty:
                    # For monthly stacked bars: max of fog + all cloud thresholds stacked
                    monthly_totals = (
                        combined.groupby("Month")["Count"].sum()
                    )
                    fog_ceiling = _ceil_headroom(float(monthly_totals.max()))
                    if "fog_low_cloud" in needed:
                        ceilings["fog_low_cloud"] = fog_ceiling
                    if "monthly_fog" in needed:
                        ceilings["monthly_fog"] = fog_ceiling

                if needed & {"fog_cloud_joint_min", "fog_cloud_joint_max"}:
                    dew_series = monthly_fog_low_cloud_dewpoint_by_category(fog_pd)
                    if not dew_series.empty:
                        dew_min = float(dew_series["AvgDWPT"].min())
                        dew_max = float(dew_series["AvgDWPT"].max())
                        dew_span = max(1.0, dew_max - dew_min)
                        if "fog_cloud_joint_min" in needed:
                            ceilings["fog_cloud_joint_min"] = _floor_with_padding(dew_min, dew_span)
                        if "fog_cloud_joint_max" in needed:
                            ceilings["fog_cloud_joint_max"] = _ceil_headroom(dew_max)
        except Exception:
            pass

    # ---------- fog_share (hourly stacked bars) ------------------------------
    if "fog_share" in needed:
        try:
            fig_hourly = build_fog_low_cloud_figures_from_precomputed(
                icao,
                requested_figure_ids={"fog_share"},
                month_numbers=list(range(1, 13)),
                season="all",
                year_start=2000,
                year_end=2025,
                enso="all",
                iod="all",
                sam="all",
                mjo="all",
                fog_monthly_mode="all",
                fog_hourly_mode="all",
                fog_wind_mode="all",
                fog_dewpoint_mode="all",
            ).get("fog_share")
            if fig_hourly is not None:
                stacks: dict[float, float] = {}
                for trace in fig_hourly.data:
                    if getattr(trace, "type", None) != "bar" or not getattr(trace, "name", None):
                        continue
                    for x_val, y_val in zip(trace.x, trace.y):
                        x_key = float(x_val)
                        stacks[x_key] = stacks.get(x_key, 0.0) + float(y_val or 0.0)
                if stacks:
                    ceilings["fog_share"] = _ceil_headroom(max(stacks.values()))
        except Exception:
            pass

    # ---------- monthly_smoke ------------------------------------------------
    if needed & {"monthly_smoke", "scatter_wind_dewpt"}:
        try:
            smoke_pd = full_df.select([
                "year", "month", "WND_SPD", "PRST_WX_PHENOM_1", "PRST_WX_PHENOM_2",
            ]).to_pandas()
            if not smoke_pd.empty:
                smoke_tokens = ["FU", "DU", "SA", "VA"]
                mask = token_mask_from_fields(smoke_pd, ["PRST_WX_PHENOM_1", "PRST_WX_PHENOM_2"], smoke_tokens)
                dust_pd = smoke_pd[mask]
                if not dust_pd.empty:
                    def get_phenom(row: pd.Series) -> str:
                        p1 = str(row.get("PRST_WX_PHENOM_1", "")).upper()
                        p2 = str(row.get("PRST_WX_PHENOM_2", "")).upper()
                        for code in smoke_tokens:
                            if code in p1 or code in p2:
                                return code
                        return "Other"

                    dust_pd = dust_pd.copy()
                    dust_pd["Phenomenon"] = dust_pd.apply(get_phenom, axis=1)
                    monthly_avg = (
                        dust_pd.groupby(["year", "month", "Phenomenon"], as_index=False)
                        .size()
                        .rename(columns={"size": "Count"})
                        .groupby(["month", "Phenomenon"], as_index=False)["Count"]
                        .mean()
                    )
                    avg_max = float(monthly_avg["Count"].max()) if not monthly_avg.empty else 0.0
                else:
                    avg_max = 0.0
                if "monthly_smoke" in needed:
                    ceilings["monthly_smoke"] = _ceil_headroom(avg_max)

                if "scatter_wind_dewpt" in needed:
                    spd_vals = pd.to_numeric(dust_pd.get("WND_SPD"), errors="coerce").dropna()
                    if not spd_vals.empty:
                        ceilings["scatter_wind_dewpt"] = _ceil_headroom(float(spd_vals.max()))
        except Exception:
            pass

    # ---------- hourly_smoke -------------------------------------------------
    if "hourly_smoke" in needed:
        try:
            smoke_h_pd = full_df.select([
                "year", "month", "hour", "PRST_WX_PHENOM_1", "PRST_WX_PHENOM_2",
            ]).to_pandas()
            if not smoke_h_pd.empty:
                smoke_tokens = ["FU", "DU", "SA", "VA"]
                mask = token_mask_from_fields(smoke_h_pd, ["PRST_WX_PHENOM_1", "PRST_WX_PHENOM_2"], smoke_tokens)
                dust_h_pd = smoke_h_pd[mask]
                if not dust_h_pd.empty:
                    def get_phenom(row: pd.Series) -> str:
                        p1 = str(row.get("PRST_WX_PHENOM_1", "")).upper()
                        p2 = str(row.get("PRST_WX_PHENOM_2", "")).upper()
                        for code in smoke_tokens:
                            if code in p1 or code in p2:
                                return code
                        return "Other"

                    dust_h_pd = dust_h_pd.copy()
                    dust_h_pd["Phenomenon"] = dust_h_pd.apply(get_phenom, axis=1)
                    mc_h = dust_h_pd.groupby(["hour", "Phenomenon"], as_index=False).size().rename(columns={"size": "Count"})
                    h_max = float(mc_h["Count"].max()) if not mc_h.empty else 0.0
                else:
                    h_max = 0.0
                ceilings["hourly_smoke"] = _ceil_headroom(h_max)
        except Exception:
            pass

    return ceilings


def frontend_asset_version() -> str:
    """Bust browser caches whenever the frontend sources change."""
    stamp = 0
    for name in ("app.js", "styles.css", "index.html"):
        path = os.path.join(FRONTEND_DIR, name)
        try:
            stamp = max(stamp, int(os.path.getmtime(path)))
        except OSError:
            pass
    return str(stamp or int(time.time()))


@app.get("/")
def root() -> HTMLResponse:
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    with open(index_path, "r", encoding="utf-8") as handle:
        html = handle.read()
    version = frontend_asset_version()
    html = html.replace("__ASSET_VERSION__", version)
    return HTMLResponse(
        content=html,
        headers={"Cache-Control": "no-store"},
    )


@app.get("/styles.css")
def frontend_styles() -> FileResponse:
    return FileResponse(
        os.path.join(FRONTEND_DIR, "styles.css"),
        media_type="text/css",
        headers={"Cache-Control": "no-cache"},
    )


@app.get("/app.js")
def frontend_javascript() -> FileResponse:
    return FileResponse(
        os.path.join(FRONTEND_DIR, "app.js"),
        media_type="application/javascript",
        headers={"Cache-Control": "no-cache"},
    )


@app.get("/favicon.svg")
def favicon() -> FileResponse:
    return FileResponse(os.path.join(ROOT_DIR, "favicon.svg"))


@lru_cache(maxsize=1)
def options_payload_cached() -> dict[str, Any]:
    airports = list(available_airports())
    return {
        "airports": airports,
        "airportLabels": airport_display_labels(),
        "defaultAirport": "YMML" if "YMML" in airports else (airports[0] if airports else None),
        "months": MONTH_NAMES,
        "default": {
            "yearStart": 2000,
            "yearEnd": 2025,
            "monthStart": "Jan",
            "monthEnd": "Dec",
            "hourStart": 0,
            "hourEnd": 23,
            "invertMonth": False,
            "invertHour": False,
            "section": "overview",
        },
    }


@lru_cache(maxsize=1)
def options_payload_etag() -> str:
    payload_bytes = json.dumps(options_payload_cached(), sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f'"{hashlib.sha256(payload_bytes).hexdigest()}"'


@app.get("/api/options")
def options(request: Request):
    etag = options_payload_etag()
    headers = {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=300",
        "ETag": etag,
    }

    if_none_match = request.headers.get("if-none-match", "")
    if etag in if_none_match:
        return Response(status_code=304, headers=headers)

    return JSONResponse(content=options_payload_cached(), headers=headers)


@app.get("/api/charts")
def charts(
    section: str = Query("overview"),
    icao: str = Query(...),
    season: str = Query("all"),
    enso: str = Query("all"),
    iod: str = Query("all"),
    sam: str = Query("all"),
    mjo: str = Query("all"),
    fogMonthlyMode: str = Query("all"),
    fogHourlyMode: str = Query("all"),
    fogWindMode: str = Query("all"),
    fogDewpointMode: str = Query("all"),
    yearStart: int = Query(2000),
    yearEnd: int = Query(2025),
    monthStart: str = Query("Jan"),
    monthEnd: str = Query("Dec"),
    hourStart: int = Query(0),
    hourEnd: int = Query(23),
    invertMonth: bool = Query(False),
    invertHour: bool = Query(False),
    figureIds: str | None = Query(None),
    includeMetrics: bool = Query(True),
) -> dict[str, Any]:
    started = time.perf_counter()
    log_memory_phase("charts.start", section=section, icao=icao)

    if monthStart not in MONTH_TO_NUM or monthEnd not in MONTH_TO_NUM:
        log_memory_phase("charts.invalid_month", section=section, icao=icao)
        return {"error": "Invalid month range."}
    if season not in SEASON_TO_MONTHS:
        log_memory_phase("charts.invalid_season", section=section, icao=icao)
        return {"error": "Invalid season."}

    month_range = (MONTH_TO_NUM[monthStart], MONTH_TO_NUM[monthEnd])
    month_number_order = selected_month_numbers(month_range[0], month_range[1], invertMonth)
    month_name_order = month_labels_for_numbers(month_number_order)
    requested_figure_ids = {
        fid.strip() for fid in (figureIds or "").split(",") if fid.strip()
    }

    def wants_figure(fig_id: str) -> bool:
        return not requested_figure_ids or fig_id in requested_figure_ids

    can_use_precomputed_overview_batch = (
        section == "overview"
        and hourStart == 0
        and hourEnd == 23
        and (not invertHour)
    )
    if can_use_precomputed_overview_batch:
        overview_precomputed_ids = ["wind_rose", "rain_thunder", "temp_dewpoint", "fog_low_cloud"]
        requested_overview_ids = [fid for fid in overview_precomputed_ids if wants_figure(fid)]
        if requested_overview_ids:
            y_ceilings = load_precomputed_y_ceilings_for_airport(icao)
            precomputed_figures: list[dict[str, Any]] = []
            precomputed_ok = True

            mode_label_map = {
                "all": "All Days",
                "rain": "Rain Days",
                "non_rain": "Non-rain Days",
            }
            selected_monthly_label = mode_label_map.get(fogMonthlyMode, "All Days")

            for fig_id in requested_overview_ids:
                fig_obj: go.Figure | None = None
                if fig_id == "wind_rose":
                    fig_obj = build_overview_wind_rose_figure_from_precomputed(
                        icao,
                        month_numbers=month_number_order,
                        season=season,
                        year_start=yearStart,
                        year_end=yearEnd,
                        enso=enso,
                        iod=iod,
                        sam=sam,
                        mjo=mjo,
                    )
                    if fig_obj is not None:
                        apply_common_layout(fig_obj)
                elif fig_id == "rain_thunder":
                    fig_obj = build_overview_rain_thunder_figure_from_precomputed(
                        icao,
                        month_numbers=month_number_order,
                        season=season,
                        year_start=yearStart,
                        year_end=yearEnd,
                        enso=enso,
                        iod=iod,
                        sam=sam,
                        mjo=mjo,
                    )
                    if fig_obj is not None:
                        apply_common_layout(fig_obj)
                        apply_grouped_bar_stable_layout(fig_obj)
                elif fig_id == "temp_dewpoint":
                    fig_obj = build_overview_temp_dewpoint_figure_from_precomputed(
                        icao,
                        month_numbers=month_number_order,
                        season=season,
                        year_start=yearStart,
                        year_end=yearEnd,
                        enso=enso,
                        iod=iod,
                        sam=sam,
                        mjo=mjo,
                    )
                    if fig_obj is not None:
                        apply_common_layout(fig_obj)
                        apply_frequency_panel_layout(fig_obj)
                        y1_min = y_ceilings.get("temp_dewpoint_y1_min")
                        y1_max = y_ceilings.get("temp_dewpoint_y1_max")
                        y2_max = y_ceilings.get("temp_dewpoint_y2")
                        if y1_min is not None and y1_max is not None:
                            fig_obj.update_yaxes(range=[float(y1_min), float(y1_max)], autorange=False)
                        if y2_max is not None and fig_obj.layout.yaxis2 is not None:
                            fig_obj.update_layout(yaxis2={**fig_obj.layout.yaxis2.to_plotly_json(), "range": [0, float(y2_max)], "autorange": False})
                elif fig_id == "fog_low_cloud":
                    fig_obj = build_overview_fog_figure_from_precomputed(
                        icao,
                        fog_mode=fogMonthlyMode,
                        title=f"Fog/Low Cloud Frequency ({selected_monthly_label})",
                        month_numbers=month_number_order,
                        season=season,
                        year_start=yearStart,
                        year_end=yearEnd,
                        enso=enso,
                        iod=iod,
                        sam=sam,
                        mjo=mjo,
                    )
                    if fig_obj is not None:
                        apply_common_layout(fig_obj)
                        apply_frequency_panel_layout(fig_obj)
                        if "fog_low_cloud" in y_ceilings:
                            fig_obj.update_yaxes(range=[0, float(y_ceilings["fog_low_cloud"])], autorange=False)

                if fig_obj is None:
                    precomputed_ok = False
                    break
                precomputed_figures.append(fig_payload(fig_id, fig_obj))

            if precomputed_ok and len(precomputed_figures) == len(requested_overview_ids):
                elapsed_ms = int((time.perf_counter() - started) * 1000)
                log_memory_phase(
                    "charts.overview_precomputed_batch",
                    section=section,
                    icao=icao,
                    figures=len(precomputed_figures),
                    elapsed_ms=elapsed_ms,
                )
                trim_process_memory()
                return {
                    "section": section,
                    "figures": precomputed_figures,
                }

    can_use_precomputed_overview_rain_thunder = (
        section == "overview"
        and requested_figure_ids == {"rain_thunder"}
        and hourStart == 0
        and hourEnd == 23
        and (not invertHour)
    )
    if can_use_precomputed_overview_rain_thunder:
        fig_rain = build_overview_rain_thunder_figure_from_precomputed(
            icao,
            month_numbers=month_number_order,
            season=season,
            year_start=yearStart,
            year_end=yearEnd,
            enso=enso,
            iod=iod,
            sam=sam,
            mjo=mjo,
        )
        if fig_rain is not None:
            y_ceilings = load_precomputed_y_ceilings_for_airport(icao)
            apply_common_layout(fig_rain)
            apply_grouped_bar_stable_layout(fig_rain)
            elapsed_ms = int((time.perf_counter() - started) * 1000)
            log_memory_phase("charts.rain_thunder_precomputed", section=section, icao=icao, elapsed_ms=elapsed_ms)
            return {
                "section": section,
                "figures": [fig_payload("rain_thunder", fig_rain)],
            }

    can_use_precomputed_overview_fog = (
        section == "overview"
        and requested_figure_ids == {"fog_low_cloud"}
        and hourStart == 0
        and hourEnd == 23
        and (not invertHour)
    )
    if can_use_precomputed_overview_fog:
        mode_label_map = {
            "all": "All Days",
            "rain": "Rain Days",
            "non_rain": "Non-rain Days",
        }
        selected_monthly_label = mode_label_map.get(fogMonthlyMode, "All Days")
        fig_fog = build_overview_fog_figure_from_precomputed(
            icao,
            fog_mode=fogMonthlyMode,
            title=f"Fog/Low Cloud Frequency ({selected_monthly_label})",
            month_numbers=month_number_order,
            season=season,
            year_start=yearStart,
            year_end=yearEnd,
            enso=enso,
            iod=iod,
            sam=sam,
            mjo=mjo,
        )
        if fig_fog is not None:
            y_ceilings = load_precomputed_y_ceilings_for_airport(icao)
            apply_common_layout(fig_fog)
            apply_frequency_panel_layout(fig_fog)
            if "fog_low_cloud" in y_ceilings:
                fig_fog.update_yaxes(range=[0, float(y_ceilings["fog_low_cloud"])], autorange=False)
            elapsed_ms = int((time.perf_counter() - started) * 1000)
            log_memory_phase("charts.fog_low_cloud_precomputed", section=section, icao=icao, elapsed_ms=elapsed_ms)
            return {
                "section": section,
                "figures": [fig_payload("fog_low_cloud", fig_fog)],
            }

    can_use_precomputed_overview_temp = (
        section == "overview"
        and requested_figure_ids == {"temp_dewpoint"}
        and hourStart == 0
        and hourEnd == 23
        and (not invertHour)
    )
    if can_use_precomputed_overview_temp:
        fig_temp = build_overview_temp_dewpoint_figure_from_precomputed(
            icao,
            month_numbers=month_number_order,
            season=season,
            year_start=yearStart,
            year_end=yearEnd,
            enso=enso,
            iod=iod,
            sam=sam,
            mjo=mjo,
        )
        if fig_temp is not None:
            apply_common_layout(fig_temp)
            elapsed_ms = int((time.perf_counter() - started) * 1000)
            log_memory_phase("charts.temp_dewpoint_precomputed", section=section, icao=icao, elapsed_ms=elapsed_ms)
            return {
                "section": section,
                "figures": [fig_payload("temp_dewpoint", fig_temp)],
            }

    can_use_precomputed_overview_wind_rose = (
        section == "overview"
        and requested_figure_ids == {"wind_rose"}
        and hourStart == 0
        and hourEnd == 23
        and (not invertHour)
    )
    if can_use_precomputed_overview_wind_rose:
        fig_rose = build_overview_wind_rose_figure_from_precomputed(
            icao,
            month_numbers=month_number_order,
            season=season,
            year_start=yearStart,
            year_end=yearEnd,
            enso=enso,
            iod=iod,
            sam=sam,
            mjo=mjo,
        )
        if fig_rose is not None:
            apply_common_layout(fig_rose)
            elapsed_ms = int((time.perf_counter() - started) * 1000)
            log_memory_phase("charts.wind_rose_precomputed", section=section, icao=icao, elapsed_ms=elapsed_ms)
            return {
                "section": section,
                "figures": [fig_payload("wind_rose", fig_rose)],
            }

    can_use_precomputed_precipitation = (
        section == "precipitation"
        and hourStart == 0
        and hourEnd == 23
        and (not invertHour)
    )
    if can_use_precomputed_precipitation:
        precip_figure_ids = {"monthly_precip", "precip_split", "hourly_precip", "lightning_heatmap"}
        requested_precip_ids = {
            fid for fid in requested_figure_ids if fid in precip_figure_ids
        }
        if not requested_figure_ids:
            requested_precip_ids = set(precip_figure_ids)
        if requested_precip_ids:
            y_ceilings = load_precomputed_y_ceilings_for_airport(icao)
            built = build_precipitation_figures_from_precomputed(
                icao,
                month_numbers=month_number_order,
                season=season,
                year_start=yearStart,
                year_end=yearEnd,
                enso=enso,
                iod=iod,
                sam=sam,
                mjo=mjo,
            )
            if built and requested_precip_ids.issubset(built.keys()):
                figures: list[dict[str, Any]] = []
                figure_order = ["monthly_precip", "precip_split", "hourly_precip", "lightning_heatmap"]
                for fig_id in figure_order:
                    if fig_id not in requested_precip_ids:
                        continue
                    fig = built[fig_id]
                    apply_common_layout(fig)
                    if fig_id in {"monthly_precip", "hourly_precip"}:
                        apply_grouped_bar_stable_layout(fig)
                        if fig_id == "hourly_precip":
                            apply_hourly_precip_dual_axis_layout(fig)
                            if "hourly_precip" in y_ceilings:
                                fig.update_yaxes(range=[0, float(y_ceilings["hourly_precip"])], autorange=False)
                            if "hourly_precip_y2" in y_ceilings and fig.layout.yaxis2 is not None:
                                fig.update_layout(
                                    yaxis2={
                                        **fig.layout.yaxis2.to_plotly_json(),
                                        "range": [0, float(y_ceilings["hourly_precip_y2"])],
                                        "autorange": False,
                                    }
                                )
                    elif fig_id == "precip_split":
                        apply_topo_map_panel_layout(fig, "precip_split")
                    figures.append(fig_payload(fig_id, fig))

                elapsed_ms = int((time.perf_counter() - started) * 1000)
                log_memory_phase(
                    "charts.precipitation_precomputed",
                    section=section,
                    icao=icao,
                    figures=len(figures),
                    elapsed_ms=elapsed_ms,
                )
                trim_process_memory()
                return {
                    "section": section,
                    "figures": figures,
                }

    can_use_precomputed_wind = (
        section == "wind"
        and hourStart == 0
        and hourEnd == 23
        and (not invertHour)
    )
    if can_use_precomputed_wind:
        requested_wind_ids = {
            fid for fid in requested_figure_ids if fid in {"wind_rose", "gale_weather_split"}
        }
        if not requested_figure_ids:
            requested_wind_ids = {"wind_rose", "gale_weather_split"}

        if requested_wind_ids:
            figures: list[dict[str, Any]] = []
            y_ceilings = load_precomputed_y_ceilings_for_airport(icao)

            if "wind_rose" in requested_wind_ids:
                fig_rose = build_overview_wind_rose_figure_from_precomputed(
                    icao,
                    month_numbers=month_number_order,
                    season=season,
                    year_start=yearStart,
                    year_end=yearEnd,
                    enso=enso,
                    iod=iod,
                    sam=sam,
                    mjo=mjo,
                )
                if fig_rose is not None:
                    apply_common_layout(fig_rose)
                    apply_topo_map_panel_layout(fig_rose, "wind_rose")
                    figures.append(fig_payload("wind_rose", fig_rose))

            if "gale_weather_split" in requested_wind_ids:
                fig_gales = build_wind_gale_weather_figure_from_precomputed(
                    icao,
                    month_numbers=month_number_order,
                    season=season,
                    year_start=yearStart,
                    year_end=yearEnd,
                    enso=enso,
                    iod=iod,
                    sam=sam,
                    mjo=mjo,
                )
                if fig_gales is not None:
                    apply_common_layout(fig_gales, height=380)
                    apply_frequency_panel_layout(fig_gales)
                    if "gale_weather_split" in y_ceilings:
                        fig_gales.update_yaxes(range=[0, float(y_ceilings["gale_weather_split"])], autorange=False)
                    figures.append(fig_payload("gale_weather_split", fig_gales))

            if figures:
                elapsed_ms = int((time.perf_counter() - started) * 1000)
                log_memory_phase(
                    "charts.wind_precomputed",
                    section=section,
                    icao=icao,
                    figures=len(figures),
                    elapsed_ms=elapsed_ms,
                )
                trim_process_memory()
                return {
                    "section": section,
                    "figures": figures,
                }

    can_use_precomputed_fog_low_cloud = (
        section == "fog_low_cloud"
        and hourStart == 0
        and hourEnd == 23
        and (not invertHour)
    )
    if can_use_precomputed_fog_low_cloud:
        requested_fog_ids = {
            fid for fid in requested_figure_ids if fid in {"monthly_fog", "fog_share", "cloud_distribution", "fog_cloud_joint"}
        }
        if not requested_figure_ids:
            requested_fog_ids = {"monthly_fog", "fog_share", "cloud_distribution", "fog_cloud_joint"}

        # monthly_fog and fog_share are now rate-based and require live mode-day denominators.
        requested_fog_precomputed_ids = {
            fid for fid in requested_fog_ids if fid in {"cloud_distribution", "fog_cloud_joint"}
        }

        if requested_fog_precomputed_ids:
            mode_label_map = {
                "all": "All Days",
                "rain": "Rain Days",
                "non_rain": "Non-rain Days",
            }
            selected_monthly_label = mode_label_map.get(fogMonthlyMode, "All Days")
            selected_hourly_label = mode_label_map.get(fogHourlyMode, "All Days")
            selected_wind_label = mode_label_map.get(fogWindMode, "All Days")
            selected_dewpoint_label = mode_label_map.get(fogDewpointMode, "All Days")

            built = build_fog_low_cloud_figures_from_precomputed(
                icao,
                requested_figure_ids=requested_fog_precomputed_ids,
                month_numbers=month_number_order,
                season=season,
                year_start=yearStart,
                year_end=yearEnd,
                enso=enso,
                iod=iod,
                sam=sam,
                mjo=mjo,
                fog_monthly_mode=fogMonthlyMode,
                fog_hourly_mode=fogHourlyMode,
                fog_wind_mode=fogWindMode,
                fog_dewpoint_mode=fogDewpointMode,
            )

            # If any requested fog figure is missing from precomputed shards,
            # fall through to the live compute path instead of returning placeholders.
            if not all(fid in built for fid in requested_fog_precomputed_ids):
                built = {}

            if built:
                y_ceilings = load_precomputed_y_ceilings_for_airport(icao)
                figures: list[dict[str, Any]] = []

                if "monthly_fog" in requested_fog_precomputed_ids:
                    fig = built.get("monthly_fog")
                    if fig is None:
                        fig = build_placeholder_figure(f"Fog/Low Cloud Frequency ({selected_monthly_label})")
                    apply_common_layout(fig)
                    apply_side_legend(fig, width_px=WIDE_LEGEND_ENTRY_WIDTH, font_size=10, top_margin=36, title_text="Category", bgcolor="rgba(255,255,255,0.92)")
                    apply_frequency_panel_layout(fig)
                    figures.append(fig_payload("monthly_fog", fig))

                if "fog_share" in requested_fog_precomputed_ids:
                    fig = built.get("fog_share")
                    if fig is None:
                        fig = build_placeholder_figure(f"Fog/Low Cloud Frequency by Hour ({selected_hourly_label})")
                    apply_common_layout(fig)
                    apply_side_legend(fig, width_px=WIDE_LEGEND_ENTRY_WIDTH, font_size=10, top_margin=36, title_text="Category", bgcolor="rgba(255,255,255,0.92)")
                    apply_frequency_panel_layout(fig)
                    figures.append(fig_payload("fog_share", fig))

                if "cloud_distribution" in requested_fog_precomputed_ids:
                    fig = built.get("cloud_distribution")
                    if fig is None:
                        fig = build_placeholder_figure(f"Wind Direction/Strength ({selected_wind_label})")
                    apply_common_layout(fig)
                    apply_side_legend(fig, width_px=WIDE_LEGEND_ENTRY_WIDTH, font_size=10, top_margin=52, title_text="Category", groupclick="togglegroup", bgcolor="rgba(255,255,255,0.92)")
                    figures.append(fig_payload("cloud_distribution", fig))

                if "fog_cloud_joint" in requested_fog_precomputed_ids:
                    fig = built.get("fog_cloud_joint")
                    if fig is None:
                        fig = build_placeholder_figure(f"Avg Dewpoint by Month ({selected_dewpoint_label})")
                    apply_common_layout(fig)
                    apply_side_legend(fig, width_px=WIDE_LEGEND_ENTRY_WIDTH, font_size=10, top_margin=36, title_text="Category", bgcolor="rgba(255,255,255,0.92)")
                    apply_frequency_panel_layout(fig)
                    if "fog_cloud_joint_min" in y_ceilings and "fog_cloud_joint_max" in y_ceilings:
                        fig.update_yaxes(range=[float(y_ceilings["fog_cloud_joint_min"]), float(y_ceilings["fog_cloud_joint_max"])], autorange=False)
                    figures.append(fig_payload("fog_cloud_joint", fig))

                if figures:
                    elapsed_ms = int((time.perf_counter() - started) * 1000)
                    log_memory_phase(
                        "charts.fog_low_cloud_precomputed",
                        section=section,
                        icao=icao,
                        figures=len(figures),
                        elapsed_ms=elapsed_ms,
                    )
                    trim_process_memory()
                    return {
                        "section": section,
                        "figures": figures,
                    }

    can_use_precomputed_smoke_dust = (
        section == "smoke_dust"
        and hourStart == 0
        and hourEnd == 23
        and (not invertHour)
    )
    if can_use_precomputed_smoke_dust:
        requested_smoke_ids = {
            fid for fid in requested_figure_ids if fid in {"monthly_smoke", "hourly_smoke", "radial_scatter_dust", "scatter_wind_dewpt"}
        }
        if not requested_figure_ids:
            requested_smoke_ids = {"monthly_smoke", "hourly_smoke", "radial_scatter_dust", "scatter_wind_dewpt"}

        if requested_smoke_ids:
            built = build_smoke_dust_figures_from_precomputed(
                icao,
                month_numbers=month_number_order,
                season=season,
                year_start=yearStart,
                year_end=yearEnd,
                enso=enso,
                iod=iod,
                sam=sam,
                mjo=mjo,
            )

            if built:
                y_ceilings = load_precomputed_y_ceilings_for_airport(icao)
                figures: list[dict[str, Any]] = []

                if "monthly_smoke" in requested_smoke_ids:
                    fig = built.get("monthly_smoke")
                    if fig is None:
                        fig = build_placeholder_figure("Monthly Smoke/Dust Frequency by Phenomenon")
                    apply_common_layout(fig)
                    apply_grouped_bar_stable_layout(fig)
                    fig.update_layout(margin=dict(l=36, r=DEFAULT_LEGEND_ENTRY_WIDTH + LEGEND_MARGIN_PADDING, t=36, b=36))
                    figures.append(fig_payload("monthly_smoke", fig))

                if "hourly_smoke" in requested_smoke_ids:
                    fig = built.get("hourly_smoke")
                    if fig is None:
                        fig = build_placeholder_figure("Hourly Smoke/Dust Frequency by Phenomenon")
                    apply_common_layout(fig)
                    apply_grouped_bar_stable_layout(fig)
                    figures.append(fig_payload("hourly_smoke", fig))

                if "radial_scatter_dust" in requested_smoke_ids:
                    fig = built.get("radial_scatter_dust")
                    if fig is None:
                        fig = build_placeholder_figure("Wind Direction/Strength Relative Frequency (Smoothed)")
                    apply_common_layout(fig)
                    figures.append(fig_payload("radial_scatter_dust", fig))

                if "scatter_wind_dewpt" in requested_smoke_ids:
                    fig = built.get("scatter_wind_dewpt")
                    if fig is None:
                        fig = build_placeholder_figure("Wind Speed vs Dew Point (Dust/Smoke)")
                    apply_common_layout(fig)
                    if "scatter_wind_dewpt" in y_ceilings:
                        fig.update_yaxes(range=[0, float(y_ceilings["scatter_wind_dewpt"])], autorange=False)
                    figures.append(fig_payload("scatter_wind_dewpt", fig))

                if figures:
                    elapsed_ms = int((time.perf_counter() - started) * 1000)
                    log_memory_phase(
                        "charts.smoke_dust_precomputed",
                        section=section,
                        icao=icao,
                        figures=len(figures),
                        elapsed_ms=elapsed_ms,
                    )
                    trim_process_memory()
                    return {
                        "section": section,
                        "figures": figures,
                    }

    airport_df = load_airport_df(icao, columns_for_section(section))
    log_memory_phase("charts.airport_loaded", section=section, icao=icao, rows=airport_df.height, cols=len(airport_df.columns))

    if airport_df.is_empty():
        log_memory_phase("charts.empty_airport", section=section, icao=icao)
        return {"section": section, "figures": [], "warning": f"No data found for {icao}."}

    ceiling_keys = ceiling_keys_for_figures(section, requested_figure_ids)
    y_ceilings = compute_airport_y_ceilings(icao, ceiling_keys) if ceiling_keys else {}
    log_memory_phase("charts.ceilings_ready", section=section, icao=icao, ceilings=len(y_ceilings))

    filtered_df = airport_df.filter(
        (build_range_mask("year", (yearStart, yearEnd)))
        & (build_range_mask("month", month_range, invertMonth))
        & (build_season_mask(season))
        & (build_range_mask("hour", (hourStart, hourEnd), invertHour))
    )
    log_memory_phase("charts.base_filter", section=section, icao=icao, rows=filtered_df.height)

    filtered_df = apply_climate_driver_filters(
        filtered_df,
        enso=enso,
        iod=iod,
        sam=sam,
        mjo=mjo,
    )
    log_memory_phase("charts.driver_filter", section=section, icao=icao, rows=filtered_df.height)

    if filtered_df.is_empty():
        log_memory_phase("charts.empty_filtered", section=section, icao=icao)
        return {"section": section, "figures": [], "warning": f"No data found for {icao} with these filters."}

    figures: list[dict[str, Any]] = []
    warnings: list[str] = []
    memory_guard_mb = configured_memory_guard_mb()
    memory_guard_tripped = False

    def guard_before(stage: str) -> bool:
        nonlocal memory_guard_tripped
        if memory_guard_tripped or memory_guard_mb <= 0:
            return memory_guard_tripped

        rss = current_rss_mb()
        if rss is None or rss < memory_guard_mb:
            return False

        memory_guard_tripped = True
        warnings.append(
            f"Memory guard reached ({rss:.1f} MB >= {memory_guard_mb:.1f} MB) while building {stage}; returned partial charts."
        )
        log_memory_phase(
            "charts.memory_guard_trip",
            section=section,
            icao=icao,
            stage=stage,
            guard_mb=f"{memory_guard_mb:.1f}",
            rss_mb=f"{rss:.1f}",
        )
        return True

    if section == "overview":
        if wants_figure("wind_rose"):
            if guard_before("overview.wind_rose"):
                pass
            else:
                wr_df = filtered_df.select(["WND_DIR", "WND_SPD"]).drop_nulls().to_pandas()
                rose_counts, calm_count, total_count = prepare_wind_rose_counts(wr_df)
                fig_rose = build_wind_rose_figure(
                    rose_counts,
                    icao=icao,
                    calm_count=calm_count,
                    total_count=total_count,
                    apply_common=True,
                )
                if fig_rose is not None:
                    figures.append(fig_payload("wind_rose", fig_rose))

        if wants_figure("rain_thunder"):
            if guard_before("overview.rain_thunder"):
                pass
            else:
                rain_df = filtered_df.select([
                    "year",
                    "month",
                    "TM_FULL",
                    "PRCP_FM_09",
                    "PRST_WX_DSC_1",
                    "PRST_WX_PHENOM_1",
                    "PRST_WX_DSC_2",
                    "PRST_WX_PHENOM_2",
                ]).to_pandas()
                if not rain_df.empty:
                    rain_days, daily_flags = compute_daily_weather_flags(rain_df, icao)
                    if not rain_days.empty:
                        monthly_counts = (
                            daily_flags.groupby(["bom_year", "bom_month"], as_index=False)
                            .agg(
                                Rain=("Rain", "sum"),
                                Thunderstorm=("Thunderstorm", "sum"),
                            )
                        )
                        # Rain: average over all selected years.
                        rain_avg_m = (
                            monthly_counts.groupby("bom_month", as_index=False)["Rain"]
                            .mean()
                            .rename(columns={"bom_month": "month"})
                        )
                        # Thunderstorm: average only over years >= LIGHTNING_STATS_MIN_YEAR.
                        ts_avg_m = (
                            monthly_counts[monthly_counts["bom_year"] >= LIGHTNING_STATS_MIN_YEAR]
                            .groupby("bom_month", as_index=False)["Thunderstorm"]
                            .mean()
                            .rename(columns={"bom_month": "month"})
                        )
                        monthly_avg = rain_avg_m.merge(ts_avg_m, on="month", how="left")
                        monthly_avg["Thunderstorm"] = monthly_avg["Thunderstorm"].fillna(0.0)
                        monthly_avg = monthly_avg[monthly_avg["month"].isin(month_number_order)].copy()
                        monthly_avg["Month"] = monthly_avg["month"].apply(lambda m: MONTH_NAMES[m - 1])
                        monthly_avg["Month"] = pd.Categorical(monthly_avg["Month"], categories=month_name_order, ordered=True)
                        monthly_avg = monthly_avg.sort_values("Month")
                        rain_avg = monthly_avg.melt(
                            id_vars=["month", "Month"],
                            value_vars=["Rain", "Thunderstorm"],
                            var_name="Type",
                            value_name="Count",
                        )
                        rain_avg["Type"] = rain_avg["Type"].replace({"Thunderstorm": THUNDERSTORM_LEGEND_LABEL})
                        fig_rain = px.bar(
                            rain_avg,
                            x="Month",
                            y="Count",
                            color="Type",
                            barmode="group",
                            color_discrete_map={"Rain": "#2159d1", THUNDERSTORM_LEGEND_LABEL: "#c62828"},
                            labels={"Count": "Avg Days/Month", "Type": "Category"},
                            title="Rain/Thunderstorm Days",
                            category_orders={"Month": month_name_order, "Type": ["Rain", THUNDERSTORM_LEGEND_LABEL]},
                        )
                        fig_rain.update_xaxes(title_text="")
                        apply_common_layout(fig_rain)
                        apply_grouped_bar_stable_layout(fig_rain)
                        figures.append(fig_payload("rain_thunder", fig_rain))

        if wants_figure("temp_dewpoint"):
            if guard_before("overview.temp_dewpoint"):
                pass
            else:
                temp_df = filtered_df.select(["TM_FULL", "AIR_TEMP", "DWPT", "PRCP_FM_09"]).to_pandas()
                if not temp_df.empty:
                    temp_avg = monthly_avg_daily_extremes(temp_df, icao)
                    monthly_precip_avg = monthly_avg_precipitation_mm(temp_df, icao)
                else:
                    temp_avg = pd.DataFrame()
                    monthly_precip_avg = pd.DataFrame()

                if not temp_avg.empty:
                    temp_avg = temp_avg[temp_avg["month"].isin(month_number_order)].copy()
                    temp_avg["Month"] = temp_avg["month"].apply(lambda m: MONTH_NAMES[m - 1])
                    temp_avg["Month"] = pd.Categorical(temp_avg["Month"], categories=month_name_order, ordered=True)
                    temp_avg = temp_avg.sort_values("Month")
                    fig_temp = go.Figure()
                    if not monthly_precip_avg.empty:
                        monthly_precip_avg = monthly_precip_avg[monthly_precip_avg["month"].isin(month_number_order)].copy()
                        monthly_precip_avg["Month"] = monthly_precip_avg["month"].apply(lambda m: MONTH_NAMES[m - 1])
                        precip_by_month = (
                            monthly_precip_avg.set_index("Month")["Avg Monthly Precip"]
                            .reindex(month_name_order)
                            .fillna(0.0)
                        )
                        fig_temp.add_bar(
                            x=month_name_order,
                            y=precip_by_month.astype(float).tolist(),
                            name="Avg Monthly Precip",
                            yaxis="y2",
                            marker_color="#1565c0",
                            marker_line_color="#0d47a1",
                            marker_line_width=1,
                            opacity=0.6,
                            zorder=0,
                            hovertemplate="Month: %{x}<br>Avg Monthly Precip: %{y:.1f} mm<extra></extra>",
                        )

                    temp_trace_styles = {
                        "Avg Daily Max T": {"color": "#d32f2f", "visible": True},
                        "Avg Daily Min T": {"color": "#ef9a9a", "visible": True},
                        "Avg Daily Max Td": {"color": "#0b3d91", "visible": "legendonly"},
                        "Avg Daily Min Td": {"color": "#90caf9", "visible": "legendonly"},
                    }
                    for trace_name, style in temp_trace_styles.items():
                        fig_temp.add_trace(go.Scatter(
                            x=temp_avg["Month"],
                            y=temp_avg[trace_name],
                            mode="lines+markers",
                            name=trace_name,
                            line=dict(color=style["color"], width=2.5),
                            marker=dict(color=style["color"], size=7),
                            visible=style["visible"],
                            zorder=2,
                            hovertemplate=f"Month: %{{x}}<br>{trace_name}: %{{y:.1f}} °C<extra></extra>",
                        ))

                    fig_temp.update_xaxes(title_text="")
                    fig_temp.update_yaxes(title_text="Temperature / Dewpoint (°C)")
                    fig_temp.update_layout(
                        title="Temperature, Dewpoint & Precipitation",
                        yaxis2=dict(
                            title="Avg Monthly Precipitation (mm)",
                            overlaying="y",
                            side="right",
                            rangemode="tozero",
                            showgrid=False,
                        ),
                        bargap=0.22,
                    )
                    apply_common_layout(fig_temp)
                    apply_frequency_panel_layout(fig_temp)
                    y1_min = y_ceilings.get("temp_dewpoint_y1_min")
                    y1_max = y_ceilings.get("temp_dewpoint_y1_max")
                    y2_max = y_ceilings.get("temp_dewpoint_y2")
                    if y1_min is not None and y1_max is not None:
                        fig_temp.update_yaxes(range=[y1_min, y1_max], autorange=False)
                    if y2_max is not None:
                        fig_temp.update_layout(yaxis2={**fig_temp.layout.yaxis2.to_plotly_json(), "range": [0, y2_max], "autorange": False})
                    figures.append(fig_payload("temp_dewpoint", fig_temp))

        if wants_figure("fog_low_cloud"):
            fig_fog = None
            if guard_before("overview.fog_low_cloud"):
                pass
            else:
                mode_label_map = {
                    "all": "All Days",
                    "rain": "Rain Days",
                    "non_rain": "Non-rain Days",
                }
                selected_monthly_label = mode_label_map.get(fogMonthlyMode, "All Days")
                can_use_precomputed_overview_fog = (
                    hourStart == 0
                    and hourEnd == 23
                    and (not invertHour)
                )

                if can_use_precomputed_overview_fog:
                    fig_fog = build_overview_fog_figure_from_precomputed(
                        icao,
                        fog_mode=fogMonthlyMode,
                        title=f"Fog/Low Cloud Frequency ({selected_monthly_label})",
                        month_numbers=month_number_order,
                        season=season,
                        year_start=yearStart,
                        year_end=yearEnd,
                        enso=enso,
                        iod=iod,
                        sam=sam,
                        mjo=mjo,
                    )

                if fig_fog is None:
                    fog_df = filtered_df.select([
                        "year",
                        "month",
                        "TM_FULL",
                        "AIR_TEMP",
                        "DWPT",
                        "VSBY",
                        "AWS_VSBY",
                        "PRCP_10",
                        "PRCP_FM_09",
                        "PRST_WX_PHENOM_1",
                        "PRST_WX_PHENOM_2",
                        "PRST_WX_DSC_1",
                        "PRST_WX_DSC_2",
                        "CEIL_CLD_AMT_1",
                        "CEIL_CLD_AMT_2",
                        "CEIL_CLD_HT_1",
                        "CEIL_CLD_HT_2",
                    ]).to_pandas()
                    if not fog_df.empty:
                        fog_mode_map = split_fog_day_type_datasets(fog_df, icao)
                        selected_monthly_df, selected_monthly_label = fog_mode_map.get(fogMonthlyMode, fog_mode_map["all"])
                        if not selected_monthly_df.empty:
                            fig_fog = build_fog_low_cloud_frequency_figure(
                                selected_monthly_df,
                                f"Fog/Low Cloud Frequency ({selected_monthly_label})",
                                icao,
                                month_number_order,
                            )
                    else:
                        fig_fog = build_placeholder_figure(
                            f"Fog/Low Cloud Frequency ({selected_monthly_label})",
                            "No records for selected day filter",
                        )

            if fig_fog is not None:
                apply_common_layout(fig_fog)
                apply_frequency_panel_layout(fig_fog)
                if "fog_low_cloud" in y_ceilings:
                    fig_fog.update_yaxes(range=[0, y_ceilings["fog_low_cloud"]], autorange=False)
                figures.append(fig_payload("fog_low_cloud", fig_fog))

    elif section == "wind":
        if wants_figure("wind_rose"):
            wr_df = filtered_df.select(["WND_DIR", "WND_SPD"]).drop_nulls().to_pandas()
            rose_counts, calm_count, total_count = prepare_wind_rose_counts(wr_df)
            fig_rose = build_wind_rose_figure(
                rose_counts,
                icao=icao,
                calm_count=calm_count,
                total_count=total_count,
                apply_common=True,
            )
            if fig_rose is not None:
                figures.append(fig_payload("wind_rose", fig_rose))

        if wants_figure("gale_weather_split"):
            gale_df = filtered_df.select([
                "year",
                "month",
                "TM_FULL",
                "WND_SPD",
                "MAX_WND_GUST_10",
                "PRCP_10",
                "PRST_WX_DSC_1",
                "PRST_WX_PHENOM_1",
                "PRST_WX_DSC_2",
                "PRST_WX_PHENOM_2",
            ]).to_pandas()

            monthly_avg = average_monthly_gale_weather_counts(gale_df, icao, month_number_order)

            monthly_avg["Month"] = monthly_avg["month"].apply(lambda m: MONTH_NAMES[m - 1])
            monthly_avg["Month"] = pd.Categorical(monthly_avg["Month"], categories=month_name_order, ordered=True)
            monthly_avg = monthly_avg.sort_values(["Month", "Category"])

            # Convert to native Python types to avoid Plotly binary encoding
            monthly_avg["Count"] = monthly_avg["Count"].apply(float)
            monthly_avg["Month"] = monthly_avg["Month"].astype(str)
            monthly_avg["Category"] = monthly_avg["Category"].replace({"TS": TS_LEGEND_LABEL})

            fig_gales = px.bar(
                monthly_avg,
                x="Month",
                y="Count",
                color="Category",
                barmode="stack",
                labels={"Count": "Avg Gale Obs/Month"},
                title="Monthly Gale Frequency by Weather Type",
                category_orders={"Month": month_name_order, "Category": ["No wx", "SHRA", TS_LEGEND_LABEL]},
                color_discrete_map={"No wx": "#7a7a7a", "SHRA": "#3b82c4", TS_LEGEND_LABEL: "#c62828"},
            )
            fig_gales.update_xaxes(title_text="")
            apply_common_layout(fig_gales, height=380)
            apply_frequency_panel_layout(fig_gales)
            if "gale_weather_split" in y_ceilings:
                fig_gales.update_yaxes(range=[0, y_ceilings["gale_weather_split"]], autorange=False)
            figures.append(fig_payload("gale_weather_split", fig_gales))

    elif section == "precipitation":
        monthly_precip_added = False
        precip_split_added = False
        hourly_precip_added = False
        lightning_heatmap_added = False
        precip_df = filtered_df.select([
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
        ]).to_pandas()
        if not precip_df.empty:
            precip_days, daily_flags = compute_daily_weather_flags(precip_df, icao)

            if not precip_days.empty:
                monthly_counts = (
                    daily_flags.groupby(["bom_year", "bom_month"], as_index=False)
                    .agg(
                        Rain=("Rain", "sum"),
                        Thunderstorm=("Thunderstorm", "sum"),
                    )
                )

                rain_avg_m = (
                    monthly_counts.groupby("bom_month", as_index=False)["Rain"]
                    .mean()
                    .rename(columns={"bom_month": "month"})
                )
                ts_avg_m = (
                    monthly_counts[monthly_counts["bom_year"] >= LIGHTNING_STATS_MIN_YEAR]
                    .groupby("bom_month", as_index=False)["Thunderstorm"]
                    .mean()
                    .rename(columns={"bom_month": "month"})
                )
                monthly_avg = rain_avg_m.merge(ts_avg_m, on="month", how="left")
                monthly_avg["Thunderstorm"] = monthly_avg["Thunderstorm"].fillna(0.0)
                monthly_avg = monthly_avg[monthly_avg["month"].isin(month_number_order)].copy()
                monthly_avg["Month"] = monthly_avg["month"].apply(lambda m: MONTH_NAMES[m - 1])
                monthly_avg["Month"] = pd.Categorical(monthly_avg["Month"], categories=month_name_order, ordered=True)
                monthly_avg = monthly_avg.sort_values("Month")
                monthly_precip = monthly_avg.melt(
                    id_vars=["month", "Month"],
                    value_vars=["Rain", "Thunderstorm"],
                    var_name="Type",
                    value_name="Count",
                )
                monthly_precip["Type"] = monthly_precip["Type"].replace({"Thunderstorm": THUNDERSTORM_LEGEND_LABEL})

                fig_precip = px.bar(
                    monthly_precip,
                    x="Month",
                    y="Count",
                    color="Type",
                    barmode="group",
                    color_discrete_map={"Rain": "#2159d1", THUNDERSTORM_LEGEND_LABEL: "#c62828"},
                    labels={"Count": "Avg Days/Month", "Type": "Category"},
                    title="Monthly Rain/Thunderstorm Days",
                    category_orders={"Month": month_name_order, "Type": ["Rain", THUNDERSTORM_LEGEND_LABEL]},
                )
                fig_precip.update_xaxes(title_text="")
                apply_common_layout(fig_precip)
                apply_grouped_bar_stable_layout(fig_precip)
                figures.append(fig_payload("monthly_precip", fig_precip))
                monthly_precip_added = True

        if not precip_df.empty:
            vis_df = precip_df.copy()
            vis_df["chart_vsby"] = vis_df[["VSBY", "AWS_VSBY"]].apply(pd.to_numeric, errors="coerce").min(axis=1)
            vis_df = vis_df.dropna(subset=["WND_DIR", "chart_vsby"]).copy()
            precip_obs = vis_df[precip_split_observation_mask(vis_df)].copy()
            precip_obs = precip_obs[directional_wind_mask(precip_obs["WND_SPD"], precip_obs["WND_DIR"])].copy()

            if not precip_obs.empty:
                precip_obs["dir_bin_10"] = (((precip_obs["WND_DIR"] + 5) % 360) // 10 * 10).astype(int)
                split_agg = (
                    precip_obs.groupby("dir_bin_10", as_index=False)
                    .agg(
                        denom=("chart_vsby", "size"),
                        lt3=("chart_vsby", lambda s: float((s < 3.0).sum())),
                        lt5=("chart_vsby", lambda s: float((s < 5.0).sum())),
                        lt7=("chart_vsby", lambda s: float((s < 7.0).sum())),
                        lt9=("chart_vsby", lambda s: float((s < 9.0).sum())),
                    )
                )
                fig_split = build_precip_split_polar_figure(split_agg, icao)
                apply_common_layout(fig_split)
                apply_topo_map_panel_layout(fig_split, "precip_split")
                figures.append(fig_payload("precip_split", fig_split))
                precip_split_added = True

            strike_hourly = lightning_hourly_strike_counts(icao)
            rain_counts = hourly_precip_rain_observation_counts(precip_df)
            hourly_rows: list[dict[str, float | int | str]] = []
            for row in rain_counts.to_dict(orient="records"):
                hourly_rows.append({
                    "year": int(row["year"]),
                    "month": int(row["month"]),
                    "hour": int(row["hour"]),
                    "Type": "Rain",
                    "Count": float(row["Count"]),
                })
            if not strike_hourly.empty:
                thunder_counts = hourly_thunder_hour_counts(strike_hourly)
                for row in thunder_counts.to_dict(orient="records"):
                    hourly_rows.append({
                        "year": int(row["bom_year"]),
                        "month": int(row["bom_month"]),
                        "hour": int(row["hour"]),
                        "Type": HOURLY_THUNDER_HOUR_TYPE,
                        "Count": float(row["Count"]),
                    })
            if hourly_rows:
                hourly_df = pd.DataFrame(hourly_rows)
                hourly_agg, magnitude_agg = aggregate_hourly_rain_thunder_chart(hourly_df)
                fig_hourly = build_hourly_rain_thunder_figure(hourly_agg, magnitude_agg)
                if fig_hourly is not None:
                    apply_common_layout(fig_hourly)
                    apply_grouped_bar_stable_layout(fig_hourly)
                    apply_hourly_precip_dual_axis_layout(fig_hourly)
                    if "hourly_precip" in y_ceilings:
                        fig_hourly.update_yaxes(range=[0, y_ceilings["hourly_precip"]], autorange=False)
                    if "hourly_precip_y2" in y_ceilings:
                        fig_hourly.update_layout(
                            yaxis2={
                                **fig_hourly.layout.yaxis2.to_plotly_json(),
                                "range": [0, y_ceilings["hourly_precip_y2"]],
                                "autorange": False,
                            }
                        )
                    figures.append(fig_payload("hourly_precip", fig_hourly))
                    hourly_precip_added = True

        lightning_grid = build_live_lightning_grid_frame(
            icao,
            month_numbers=month_number_order,
            season=season,
            year_start=yearStart,
            year_end=yearEnd,
        )
        fig_lightning = build_lightning_heatmap_figure(lightning_grid, icao)
        if fig_lightning is not None:
            apply_common_layout(fig_lightning)
            figures.append(fig_payload("lightning_heatmap", fig_lightning))
            lightning_heatmap_added = True

        if not monthly_precip_added:
            fig = build_placeholder_figure("Monthly Rain/Thunderstorm Days")
            apply_common_layout(fig)
            figures.append(fig_payload("monthly_precip", fig))

        if not precip_split_added:
            fig = build_placeholder_figure("Conditional P(VSBY < threshold | Precipitation) by Direction")
            apply_common_layout(fig)
            figures.append(fig_payload("precip_split", fig))

        if not hourly_precip_added:
            fig = build_placeholder_figure("Hourly Rain Observations")
            apply_common_layout(fig)
            figures.append(fig_payload("hourly_precip", fig))

        if not lightning_heatmap_added:
            fig = build_placeholder_figure("Lightning Strike Frequency")
            apply_common_layout(fig)
            figures.append(fig_payload("lightning_heatmap", fig))

    elif section == "fog_low_cloud":
        fog_df = filtered_df.select([
            "year",
            "month",
            "hour",
            "TM_FULL",
            "AIR_TEMP",
            "DWPT",
            "VSBY",
            "AWS_VSBY",
            "PRCP_10",
            "WND_DIR",
            "WND_SPD",
            "PRCP_FM_09",
            "PRST_WX_PHENOM_1",
            "PRST_WX_PHENOM_2",
            "PRST_WX_DSC_1",
            "PRST_WX_DSC_2",
            "CEIL_CLD_AMT_1",
            "CEIL_CLD_AMT_2",
            "CEIL_CLD_HT_1",
            "CEIL_CLD_HT_2",
        ]).to_pandas()

        fog_figures: list[dict[str, Any]] = []

        def add_placeholder(fig_id: str, title: str, _subtitle: str) -> None:
            fig = build_placeholder_figure(title)
            apply_common_layout(fig)
            fog_figures.append(fig_payload(fig_id, fig))

        def apply_fog_side_legend(fig: go.Figure, *, groupclick: str | None = None, top_margin: int = 36) -> None:
            apply_side_legend(
                fig,
                width_px=WIDE_LEGEND_ENTRY_WIDTH,
                font_size=10,
                top_margin=top_margin,
                title_text="Category",
                groupclick=groupclick,
                bgcolor="rgba(255,255,255,0.92)",
            )

        def build_fog_low_cloud_frequency_chart(dataset: pd.DataFrame, title: str) -> go.Figure | None:
            if dataset.empty:
                return None
            return build_fog_low_cloud_frequency_figure(dataset, title, icao, month_number_order)

        def build_fog_low_cloud_dewpoint_chart(dataset: pd.DataFrame, title: str) -> go.Figure | None:
            if dataset.empty:
                return None

            series_df = monthly_fog_low_cloud_dewpoint_by_category(dataset)
            if series_df.empty:
                return None

            category_colors = {
                "Fog": "#d4af37",
                "2000ft - 1500ft cloud": "#ef9a9a",
                "1500ft - 1000ft cloud": "#e57373",
                "1000ft - 500ft cloud": "#c62828",
                "< 500ft cloud": "#8b0000",
            }

            fig = go.Figure()
            traces_added = 0

            for label, color in category_colors.items():
                masked = series_df[series_df["Category"] == label].copy()
                if masked.empty:
                    continue

                monthly_avg = (
                    masked.set_index("month")["AvgDWPT"]
                    .reindex(month_number_order)
                    .reset_index()
                )
                monthly_avg["Month"] = monthly_avg["month"].apply(lambda m: MONTH_NAMES[m - 1])

                fig.add_trace(go.Scatter(
                    x=monthly_avg["Month"],
                    y=monthly_avg["AvgDWPT"],
                    mode="lines+markers",
                    name=label,
                    line=dict(color=color, width=2.5),
                    marker=dict(size=7, color=color),
                    connectgaps=False,
                    hovertemplate="Month: %{x}<br>Avg Dewpoint: %{y:.1f} °C<extra>" + label + "</extra>",
                ))
                traces_added += 1

            if traces_added == 0:
                return None

            fig.update_layout(
                title=title,
                legend_title_text="Category",
            )
            fig.update_xaxes(title_text="", categoryorder="array", categoryarray=month_name_order)
            fig.update_yaxes(title_text="Avg Dewpoint (°C)")
            apply_side_legend(
                fig,
                width_px=WIDE_LEGEND_ENTRY_WIDTH,
                font_size=10,
                top_margin=36,
                title_text="Category",
                bgcolor="rgba(255,255,255,0.92)",
            )
            return fig

        def build_fog_low_cloud_hourly_chart(dataset: pd.DataFrame, title: str) -> go.Figure | None:
            if dataset.empty:
                return None

            hour_numbers = list(range(24))
            hour_labels = [str(hour) for hour in hour_numbers]
            hour_hover_labels = [f"{hour:02d}Z" for hour in range(24)]
            combined = average_hourly_fog_low_cloud_days(dataset, icao)

            threshold_order = ["below 500ft", "below 1000ft", "below 1500ft", "below 2000ft"]
            combined_sorted = combined.copy()
            combined_sorted["Threshold"] = combined_sorted["Threshold"].fillna("N/A")

            threshold_colors = {
                "below 500ft": "#8b0000",
                "below 1000ft": "#c62828",
                "below 1500ft": "#e57373",
                "below 2000ft": "#ef9a9a",
            }

            low_cloud_stack = (
                combined_sorted[combined_sorted["Type"] == "Low cloud"]
                .pivot_table(index="Hour", columns="Threshold", values="Count", aggfunc="sum")
                .reindex(hour_labels)
                .fillna(0.0)
            )
            fog_series = _fog_stack_series(
                combined_sorted,
                index_col="Hour",
                index_labels=hour_labels,
            )

            total_low_cloud = float(low_cloud_stack.to_numpy().sum()) if not low_cloud_stack.empty else 0.0
            total_fog = sum(sum(values) for values in fog_series.values())
            if (total_low_cloud + total_fog) <= 0.0:
                return None

            low_cloud_x = [hour - 0.22 for hour in hour_numbers]
            fog_x = [hour + 0.22 for hour in hour_numbers]
            bar_width = 0.38

            fig = go.Figure()
            fig.add_bar(
                x=low_cloud_x,
                y=[0.0] * len(hour_labels),
                showlegend=False,
                hoverinfo="skip",
                marker_color="rgba(0,0,0,0)",
                width=bar_width,
            )
            fig.add_bar(
                x=fog_x,
                y=[0.0] * len(hour_labels),
                showlegend=False,
                hoverinfo="skip",
                marker_color="rgba(0,0,0,0)",
                width=bar_width,
            )

            for threshold in threshold_order:
                y_values = low_cloud_stack[threshold].astype(float).tolist() if threshold in low_cloud_stack.columns else [0.0] * len(hour_labels)
                display_label = FOG_LOW_CLOUD_THRESHOLD_LABELS[threshold]
                fig.add_bar(
                    x=low_cloud_x,
                    y=y_values,
                    name=display_label,
                    marker_color=threshold_colors[threshold],
                    customdata=hour_hover_labels,
                    width=bar_width,
                    hovertemplate=(
                        "Hour: %{customdata}<br>"
                        f"{display_label}: %{{y:.2f}}%<extra></extra>"
                    ),
                )

            _add_fog_stack_bars(
                fig,
                x_values=fog_x,
                index_labels=hour_hover_labels,
                fog_series=fog_series,
                hover_prefix="Hour",
                bar_width=bar_width,
            )

            fig.update_layout(
                title=title,
                barmode="stack",
                legend_title_text="Category",
            )
            fig.update_xaxes(
                title_text="",
                tickmode="array",
                tickvals=[0, 5, 10, 15, 20],
                ticktext=["00Z", "05Z", "10Z", "15Z", "20Z"],
                showgrid=False,
                range=[-0.8, 23.8],
            )
            fig.update_yaxes(title_text="Share of Days (%)")
            apply_side_legend(
                fig,
                width_px=WIDE_LEGEND_ENTRY_WIDTH,
                font_size=10,
                top_margin=36,
                title_text="Category",
                bgcolor="rgba(255,255,255,0.92)",
            )
            return fig

        def build_fog_low_cloud_wind_plot(dataset: pd.DataFrame, title: str) -> go.Figure | None:
            if dataset.empty:
                return None

            plot_df = dataset.copy()
            plot_df["is_fog"] = fog_observation_mask(plot_df)

            lowest_ceiling = lowest_low_cloud_ceiling(plot_df)
            plot_df["is_low_cloud_2000_1500"] = lowest_ceiling.lt(2000) & lowest_ceiling.ge(1500)
            plot_df["is_low_cloud_1500_1000"] = lowest_ceiling.lt(1500) & lowest_ceiling.ge(1000)
            plot_df["is_low_cloud_1000_500"] = lowest_ceiling.lt(1000) & lowest_ceiling.ge(500)
            plot_df["is_low_cloud_below_500"] = lowest_ceiling.lt(500)

            plot_df = plot_df[
                plot_df["is_fog"]
                | plot_df["is_low_cloud_2000_1500"]
                | plot_df["is_low_cloud_1500_1000"]
                | plot_df["is_low_cloud_1000_500"]
                | plot_df["is_low_cloud_below_500"]
            ].copy()
            plot_df = plot_df.dropna(subset=["WND_DIR", "WND_SPD"])
            if plot_df.empty:
                return None

            direction_step = 10.0
            speed_step = 1.0
            speed_values = pd.to_numeric(plot_df[directional_wind_mask(plot_df["WND_SPD"], plot_df["WND_DIR"])]["WND_SPD"], errors="coerce").dropna()
            if speed_values.empty and calm_wind_mask(plot_df["WND_SPD"]).sum() == 0:
                return None
            observed_max_speed = float(speed_values.max()) if not speed_values.empty else 0.0
            # Add a little headroom and round up to the next 5 kt so contours fill the panel.
            max_speed = max(10.0, float(math.ceil((observed_max_speed * 1.1) / 5.0) * 5.0))
            dir_edges = np.arange(0.0, 360.0 + direction_step, direction_step)
            dir_centers = dir_edges[:-1] + (direction_step / 2.0)
            speed_edges = np.arange(0.0, max_speed + speed_step, speed_step)
            cutoff_pct = 0.1
            category_colors = {
                "Fog": "#d4af37",
                "2000ft - 1500ft cloud": "#ef9a9a",
                "1500ft - 1000ft cloud": "#e57373",
                "1000ft - 500ft cloud": "#c62828",
                "< 500ft cloud": "#8b0000",
            }
            category_masks = {
                "Fog": plot_df["is_fog"],
                "2000ft - 1500ft cloud": plot_df["is_low_cloud_2000_1500"],
                "1500ft - 1000ft cloud": plot_df["is_low_cloud_1500_1000"],
                "1000ft - 500ft cloud": plot_df["is_low_cloud_1000_500"],
                "< 500ft cloud": plot_df["is_low_cloud_below_500"],
            }

            def hex_to_rgba(hex_color: str, alpha: float) -> str:
                color = hex_color.lstrip("#")
                if len(color) != 6:
                    return f"rgba(0,0,0,{alpha})"
                red = int(color[0:2], 16)
                green = int(color[2:4], 16)
                blue = int(color[4:6], 16)
                return f"rgba({red},{green},{blue},{alpha})"

            def smooth_frequency_field(field: np.ndarray, passes: int = 3) -> np.ndarray:
                out = field.astype(float).copy()
                for _ in range(passes):
                    out = (np.roll(out, 1, axis=1) + 2.0 * out + np.roll(out, -1, axis=1)) / 4.0
                    padded = np.pad(out, ((1, 1), (0, 0)), mode="edge")
                    out = (padded[:-2] + 2.0 * padded[1:-1] + padded[2:]) / 4.0
                return out

            def boundary_from_level(field: np.ndarray, level: float) -> np.ndarray:
                boundary = np.full(len(dir_centers), np.nan)
                for col_idx in range(len(dir_centers)):
                    column = field[:, col_idx]
                    hit_idx = np.where(column >= level)[0]
                    if len(hit_idx) > 0:
                        boundary[col_idx] = float(speed_edges[int(hit_idx.max()) + 1])
                boundary = np.nan_to_num(boundary, nan=0.0)
                boundary = (np.roll(boundary, 1) + 2.0 * boundary + np.roll(boundary, -1)) / 4.0
                return boundary

            fig = go.Figure()
            traces_added = 0
            max_plotted_speed = 0.0
            layer_order = [
                "2000ft - 1500ft cloud",
                "1500ft - 1000ft cloud",
                "1000ft - 500ft cloud",
                "< 500ft cloud",
                "Fog",
            ]
            layer_fields: dict[str, np.ndarray] = {}
            for label in layer_order:
                sub = plot_df[category_masks[label]].copy()

                if sub.empty:
                    continue

                dir_vals = np.mod(pd.to_numeric(sub["WND_DIR"], errors="coerce"), 360.0).to_numpy()
                spd_vals = pd.to_numeric(sub["WND_SPD"], errors="coerce").to_numpy()
                valid = np.isfinite(dir_vals) & np.isfinite(spd_vals) & (spd_vals > 0.0)
                dir_vals = dir_vals[valid]
                spd_vals = np.clip(spd_vals[valid], 0.0, max_speed)
                calm_count = float(calm_wind_mask(sub["WND_SPD"]).sum())

                if len(dir_vals) == 0 and calm_count <= 0:
                    continue

                if len(dir_vals) > 0:
                    hist2d, _, _ = np.histogram2d(spd_vals, dir_vals, bins=[speed_edges, dir_edges])
                else:
                    hist2d = np.zeros((len(speed_edges) - 1, len(dir_edges) - 1), dtype=float)
                distribute_calm_to_polar_hist2d(hist2d, calm_count)

                total_obs = float(hist2d.sum())
                if total_obs <= 0:
                    continue

                rel_field = (hist2d / total_obs) * 100.0
                rel_field = smooth_frequency_field(rel_field, passes=3)
                layer_fields[label] = rel_field
                peak_rel = float(np.nanmax(rel_field)) if rel_field.size else 0.0
                if peak_rel < cutoff_pct:
                    continue

                low = cutoff_pct
                high = max(low, peak_rel * 0.92)
                if high <= low:
                    levels = [round(float(low), 3)]
                else:
                    levels = np.geomspace(low, high, num=6)
                    levels = sorted({round(float(level), 3) for level in levels})

                first_for_label = True
                for level_idx, level in enumerate(levels):
                    boundary = boundary_from_level(rel_field, level)
                    boundary_max = float(np.max(boundary))
                    if boundary_max <= 0.0:
                        continue
                    max_plotted_speed = max(max_plotted_speed, boundary_max)

                    theta_vals = list(dir_centers) + [float(dir_centers[0])]
                    r_vals = list(boundary) + [float(boundary[0])]
                    alpha = min(0.10 + level_idx * 0.07, 0.42)

                    fig.add_trace(go.Scatterpolar(
                        theta=theta_vals,
                        r=r_vals,
                        mode="lines",
                        name=label,
                        legendgroup=label,
                        showlegend=first_for_label,
                        line=dict(color=hex_to_rgba(category_colors[label], min(alpha + 0.28, 0.95)), width=1.1),
                        fill="toself",
                        fillcolor=hex_to_rgba(category_colors[label], alpha),
                        hoverinfo="skip",
                    ))
                    first_for_label = False

                if not first_for_label:
                    traces_added += 1

            if traces_added == 0:
                return None

            # Add a transparent hover mesh so one hover card shows all layer values
            # at the hovered direction/speed location.
            speed_centers = speed_edges[:-1] + (speed_step / 2.0)
            theta_mesh = np.tile(dir_centers, len(speed_centers))
            r_mesh = np.repeat(speed_centers, len(dir_centers))

            layer_hover_order = [
                "Fog",
                "2000ft - 1500ft cloud",
                "1500ft - 1000ft cloud",
                "1000ft - 500ft cloud",
                "< 500ft cloud",
            ]
            hover_fields = {
                label: layer_fields.get(label, np.zeros((len(speed_centers), len(dir_centers)), dtype=float))
                for label in layer_hover_order
            }

            custom_rows: list[list[float]] = []
            for speed_idx in range(len(speed_centers)):
                for dir_idx in range(len(dir_centers)):
                    custom_rows.append([
                        float(hover_fields["Fog"][speed_idx, dir_idx]),
                        float(hover_fields["2000ft - 1500ft cloud"][speed_idx, dir_idx]),
                        float(hover_fields["1500ft - 1000ft cloud"][speed_idx, dir_idx]),
                        float(hover_fields["1000ft - 500ft cloud"][speed_idx, dir_idx]),
                        float(hover_fields["< 500ft cloud"][speed_idx, dir_idx]),
                    ])

            fig.add_trace(go.Scatterpolar(
                theta=theta_mesh,
                r=r_mesh,
                mode="markers",
                name="",
                showlegend=False,
                marker=dict(size=14, color="rgba(0,0,0,0.001)"),
                meta={"hoverGrid": "fog_layer_values"},
                customdata=custom_rows,
                hovertemplate=(
                    "Direction: %{theta:.0f}°<br>"
                    "Wind Speed: %{r:.1f} kt<br>"
                    "Fog: %{customdata[0]:.3f}%<br>"
                    "2000ft - 1500ft cloud: %{customdata[1]:.3f}%<br>"
                    "1500ft - 1000ft cloud: %{customdata[2]:.3f}%<br>"
                    "1000ft - 500ft cloud: %{customdata[3]:.3f}%<br>"
                    "< 500ft cloud: %{customdata[4]:.3f}%"
                    "<extra></extra>"
                ),
            ))

            display_max_speed = max(10.0, float(math.ceil((max_plotted_speed * 1.1) / 5.0) * 5.0))

            bg_img_base64 = None
            try:
                airport_lat = COORDS_DF.loc[icao, "LAT"]
                airport_lon = COORDS_DF.loc[icao, "LONG"]
                bg_img_base64 = get_centered_background(float(airport_lat), float(airport_lon), zoom=ZOOM_LEVEL)
            except Exception:
                pass

            fig.update_layout(
                title=title,
                polar=dict(
                    bgcolor="rgba(0,0,0,0)",
                    angularaxis=dict(direction="clockwise", period=360),
                    radialaxis=dict(angle=90, tickangle=90, ticksuffix=" kt", range=[0, display_max_speed]),
                ),
                legend=dict(title_text="Category", groupclick="togglegroup"),
                margin=dict(l=36, r=36, t=52, b=22),
            )
            apply_topo_map_panel_layout(fig, "cloud_distribution")
            if bg_img_base64:
                apply_polar_background(fig, bg_img_base64)
            return fig

        if not fog_df.empty:
            fog_mode_map = split_fog_day_type_datasets(fog_df, icao)
            fog_df = fog_mode_map["all"][0]

            if fog_df.empty:
                add_placeholder("monthly_fog", "Fog/Low Cloud Frequency (Non-rain Days)", "No records for selected filters")
                add_placeholder("fog_share", "Fog/Low Cloud Frequency (Rain Days)", "No records for selected filters")
                add_placeholder("cloud_distribution", "Low Cloud Amount Distribution", "No records for selected filters")
                add_placeholder("fog_cloud_joint", "Fog + Low Cloud Co-occurrence", "No records for selected filters")
            else:
                selected_monthly_df, selected_monthly_label = fog_mode_map.get(fogMonthlyMode, fog_mode_map["all"])
                selected_hourly_df, selected_hourly_label = fog_mode_map.get(fogHourlyMode, fog_mode_map["all"])
                selected_wind_df, selected_wind_label = fog_mode_map.get(fogWindMode, fog_mode_map["all"])
                selected_dewpoint_df, selected_dewpoint_label = fog_mode_map.get(fogDewpointMode, fog_mode_map["all"])

                fig_selected_frequency = None
                if not selected_monthly_df.empty:
                    fig_selected_frequency = build_fog_low_cloud_frequency_figure(
                        selected_monthly_df,
                        f"Fog/Low Cloud Frequency ({selected_monthly_label})",
                        icao,
                        month_number_order,
                    )
                if fig_selected_frequency is not None and wants_figure("monthly_fog"):
                    apply_common_layout(fig_selected_frequency)
                    apply_fog_side_legend(fig_selected_frequency)
                    apply_frequency_panel_layout(fig_selected_frequency)
                    fog_figures.append(fig_payload("monthly_fog", fig_selected_frequency))
                elif wants_figure("monthly_fog"):
                    add_placeholder("monthly_fog", f"Fog/Low Cloud Frequency ({selected_monthly_label})", "No records for selected day filter")

                fig_selected_hourly = build_fog_low_cloud_hourly_chart(
                    selected_hourly_df,
                    f"Fog/Low Cloud Frequency by Hour ({selected_hourly_label})",
                )
                if fig_selected_hourly is not None and wants_figure("fog_share"):
                    apply_common_layout(fig_selected_hourly)
                    apply_fog_side_legend(fig_selected_hourly)
                    apply_frequency_panel_layout(fig_selected_hourly)
                    fog_figures.append(fig_payload("fog_share", fig_selected_hourly))
                elif wants_figure("fog_share"):
                    add_placeholder("fog_share", f"Fog/Low Cloud Frequency by Hour ({selected_hourly_label})", "No hourly fog/low cloud data available for selected day filter")

                fig_selected_wind = build_fog_low_cloud_wind_plot(
                    selected_wind_df,
                    f"Wind Direction/Strength ({selected_wind_label})",
                )
                if fig_selected_wind is not None and wants_figure("cloud_distribution"):
                    apply_common_layout(fig_selected_wind)
                    apply_fog_side_legend(fig_selected_wind, groupclick="togglegroup", top_margin=52)
                    fog_figures.append(fig_payload("cloud_distribution", fig_selected_wind))
                elif wants_figure("cloud_distribution"):
                    add_placeholder("cloud_distribution", f"Wind Direction/Strength ({selected_wind_label})", "No directional data available for selected day filter")

                fig_selected_dewpoint = build_fog_low_cloud_dewpoint_chart(
                    selected_dewpoint_df,
                    f"Avg Dewpoint by Month ({selected_dewpoint_label})",
                )
                if fig_selected_dewpoint is not None and wants_figure("fog_cloud_joint"):
                    apply_common_layout(fig_selected_dewpoint)
                    apply_fog_side_legend(fig_selected_dewpoint)
                    apply_frequency_panel_layout(fig_selected_dewpoint)
                    if "fog_cloud_joint_min" in y_ceilings and "fog_cloud_joint_max" in y_ceilings:
                        fig_selected_dewpoint.update_yaxes(
                            range=[y_ceilings["fog_cloud_joint_min"], y_ceilings["fog_cloud_joint_max"]],
                            autorange=False,
                        )
                    fog_figures.append(fig_payload("fog_cloud_joint", fig_selected_dewpoint))
                elif wants_figure("fog_cloud_joint"):
                    add_placeholder("fog_cloud_joint", f"Avg Dewpoint by Month ({selected_dewpoint_label})", "No dewpoint data available for selected day filter")
        else:
            if wants_figure("monthly_fog"):
                add_placeholder("monthly_fog", "Fog/Low Cloud Frequency (All Days)", "No records for selected filters")
            if wants_figure("fog_share"):
                add_placeholder("fog_share", "Fog/Low Cloud Frequency by Hour (All Days)", "No hourly fog/low cloud data available for selected filters")
            if wants_figure("cloud_distribution"):
                add_placeholder("cloud_distribution", "Wind Direction/Strength (All Days)", "No records for selected filters")
            if wants_figure("fog_cloud_joint"):
                add_placeholder("fog_cloud_joint", "Avg Dewpoint by Month (All Days)", "No dewpoint data available for selected filters")

        figures.extend(fog_figures[:4])


    elif section == "smoke_dust":
        # Select all relevant columns for all plots
        smoke_df = filtered_df.select([
            "year", "month", "hour", "PRST_WX_PHENOM_1", "PRST_WX_PHENOM_2",
            "WND_SPD", "DWPT", "WND_DIR"
        ]).to_pandas()
        smoke_tokens = ["FU", "DU", "SA", "VA"]
        phenom_colors = {
            "FU": "#7a7a7a",
            "DU": "#EF553B",
            "SA": "#00CC96",
            "VA": "#AB63FA",
        }

        # Filter to only dust/smoke/volcanic observations
        mask = token_mask_from_fields(smoke_df, ["PRST_WX_PHENOM_1", "PRST_WX_PHENOM_2"], smoke_tokens)
        dust_df = smoke_df[mask].copy()

        # Assign a single phenomenon code per observation for consistent coloring.
        def get_phenom(row: pd.Series) -> str:
            p1 = str(row.get("PRST_WX_PHENOM_1", "")).upper()
            p2 = str(row.get("PRST_WX_PHENOM_2", "")).upper()
            for code in smoke_tokens:
                if code in p1 or code in p2:
                    return code
            return "Other"

        if not dust_df.empty:
            dust_df["Phenomenon"] = dust_df.apply(get_phenom, axis=1)

        # Top left: Monthly paired frequency by phenomenon (averaged by month)
        if not dust_df.empty:
            monthly_smoke = (
                dust_df.groupby(["year", "month", "Phenomenon"], as_index=False)
                .size()
                .rename(columns={"size": "Count"})
            )
            monthly_smoke = (
                monthly_smoke.groupby(["month", "Phenomenon"], as_index=False)["Count"]
                .mean()
            )
            monthly_smoke = monthly_smoke[monthly_smoke["month"].isin(month_number_order)].copy()
            monthly_smoke["Month"] = monthly_smoke["month"].apply(lambda m: MONTH_NAMES[m - 1])
            monthly_smoke["Month"] = pd.Categorical(monthly_smoke["Month"], categories=month_name_order, ordered=True)
            monthly_smoke = monthly_smoke.sort_values(["Month", "Phenomenon"])

            fig_smoke = px.bar(
                monthly_smoke,
                x="Month",
                y="Count",
                color="Phenomenon",
                barmode="group",
                labels={"Count": "Avg Obs/Month", "Phenomenon": "Type"},
                title="Monthly Smoke/Dust Frequency by Phenomenon",
                color_discrete_map=phenom_colors,
                category_orders={"Month": month_name_order, "Phenomenon": smoke_tokens},
            )
            fig_smoke.update_xaxes(title_text="")
            apply_common_layout(fig_smoke)
            apply_grouped_bar_stable_layout(fig_smoke)
            fig_smoke.update_layout(
                margin=dict(l=36, r=DEFAULT_LEGEND_ENTRY_WIDTH + LEGEND_MARGIN_PADDING, t=36, b=36),
            )
            figures.append(fig_payload("monthly_smoke", fig_smoke))
        else:
            # Placeholder if no data
            fig = build_placeholder_figure("Monthly Smoke/Dust Frequency by Phenomenon")
            apply_common_layout(fig)
            figures.append(fig_payload("monthly_smoke", fig))

        # Top right: Hourly paired frequency by phenomenon
        if not dust_df.empty and "hour" in dust_df.columns:
            hourly = (
                dust_df.groupby(["year", "hour", "Phenomenon"], as_index=False)
                .size()
                .rename(columns={"size": "Count"})
                .groupby(["hour", "Phenomenon"], as_index=False)["Count"]
                .mean()
            )
            fig_hour = px.bar(
                hourly,
                x="hour",
                y="Count",
                color="Phenomenon",
                barmode="group",
                labels={"Count": "Avg Obs/Hour (per year)", "Phenomenon": "Type"},
                title="Hourly Smoke/Dust Frequency by Phenomenon",
                color_discrete_map=phenom_colors,
                category_orders={"Phenomenon": smoke_tokens},
            )
            fig_hour.update_xaxes(
                title_text="",
                tickmode="array",
                tickvals=[0, 5, 10, 15, 20],
                ticktext=["00Z", "05Z", "10Z", "15Z", "20Z"],
            )
            apply_common_layout(fig_hour)
            apply_grouped_bar_stable_layout(fig_hour)
            figures.append(fig_payload("hourly_smoke", fig_hour))
        else:
            fig = build_placeholder_figure("Hourly Smoke/Dust Frequency by Phenomenon")
            apply_common_layout(fig)
            figures.append(fig_payload("hourly_smoke", fig))

        scatter_payload: dict[str, Any]
        radial_payload: dict[str, Any]

        # Bottom right: Wind speed vs dew point scatter plot
        if not dust_df.empty and "WND_SPD" in dust_df.columns and "DWPT" in dust_df.columns:
            scatter_df = dust_df.dropna(subset=["WND_SPD", "DWPT"]).copy()
            fig_scatter = go.Figure()

            for code in smoke_tokens:
                sub = scatter_df[scatter_df["Phenomenon"] == code]
                if sub.empty:
                    continue

                fig_scatter.add_trace(go.Scatter(
                    x=sub["DWPT"],
                    y=sub["WND_SPD"],
                    mode="markers",
                    name=code,
                    legendgroup=code,
                    marker=dict(color=phenom_colors[code], size=7, opacity=0.65),
                    hovertemplate="Type: %{text}<br>Dew Point: %{x:.1f} °C<br>Wind Speed: %{y:.1f} kt<extra></extra>",
                    text=[code] * len(sub),
                ))

                # Add least-squares fit line per phenomenon when possible.
                x_vals = pd.to_numeric(sub["DWPT"], errors="coerce")
                y_vals = pd.to_numeric(sub["WND_SPD"], errors="coerce")
                fit_df = pd.DataFrame({"x": x_vals, "y": y_vals}).dropna()
                if len(fit_df) >= 2 and fit_df["x"].nunique() > 1:
                    x_mean = float(fit_df["x"].mean())
                    y_mean = float(fit_df["y"].mean())
                    var_x = float(((fit_df["x"] - x_mean) ** 2).sum())
                    if var_x > 0:
                        cov_xy = float(((fit_df["x"] - x_mean) * (fit_df["y"] - y_mean)).sum())
                        slope = cov_xy / var_x
                        intercept = y_mean - slope * x_mean
                        x_min = float(fit_df["x"].min())
                        x_max = float(fit_df["x"].max())
                        y_min = slope * x_min + intercept
                        y_max = slope * x_max + intercept

                        # 1 SD confidence-style shading around the fitted line.
                        y_std = float(fit_df["y"].std(ddof=1)) if len(fit_df) > 1 else 0.0
                        if math.isfinite(y_std) and y_std > 0:
                            ci_fill = phenom_colors[code]
                            if ci_fill.startswith("#") and len(ci_fill) == 7:
                                r = int(ci_fill[1:3], 16)
                                g = int(ci_fill[3:5], 16)
                                b = int(ci_fill[5:7], 16)
                                ci_fill = f"rgba({r},{g},{b},0.16)"
                            fig_scatter.add_trace(go.Scatter(
                                x=[x_min, x_max, x_max, x_min],
                                y=[y_min - y_std, y_max - y_std, y_max + y_std, y_min + y_std],
                                mode="lines",
                                name=f"{code} ±1SD",
                                legendgroup=code,
                                showlegend=False,
                                visible="legendonly",
                                line=dict(width=0, color="rgba(0,0,0,0)"),
                                fill="toself",
                                fillcolor=ci_fill,
                                hoverinfo="skip",
                                meta={"ciBand": True},
                            ))

                        fig_scatter.add_trace(go.Scatter(
                            x=[x_min, x_max],
                            y=[y_min, y_max],
                            mode="lines",
                            name=f"{code} fit",
                            legendgroup=code,
                            showlegend=False,
                            line=dict(color=phenom_colors[code], width=2),
                            hovertemplate=(
                                f"{code} fit<br>"
                                "Dew Point: %{x:.1f} °C<br>"
                                "Wind Speed: %{y:.1f} kt<extra></extra>"
                            ),
                        ))

            fig_scatter.update_layout(
                title="Wind Speed vs Dew Point (Dust/Smoke)",
                xaxis_title="Dew Point (°C)",
                yaxis_title="Wind Speed (kt)",
                legend=dict(title_text="Phenomenon", groupclick="togglegroup"),
            )
            apply_common_layout(fig_scatter)
            if "scatter_wind_dewpt" in y_ceilings:
                fig_scatter.update_yaxes(range=[0, y_ceilings["scatter_wind_dewpt"]], autorange=False)
            scatter_payload = fig_payload("scatter_wind_dewpt", fig_scatter)
        else:
            fig = build_placeholder_figure("Wind Speed vs Dew Point (Dust/Smoke)")
            apply_common_layout(fig)
            scatter_payload = fig_payload("scatter_wind_dewpt", fig)


        # Bottom left: Smoothed polar frequency glow plot (all phenomena at once).
        if not dust_df.empty and "WND_DIR" in dust_df.columns and "WND_SPD" in dust_df.columns:
            scatter_polar = go.Figure()

            direction_step = 10.0
            max_speed = 40.0
            speed_step = 1.0
            dir_edges = np.arange(0.0, 360.0 + direction_step, direction_step)
            dir_centers = dir_edges[:-1] + (direction_step / 2.0)
            speed_edges = np.arange(0.0, max_speed + speed_step, speed_step)

            # Keep low-frequency areas transparent so map background remains visible.
            cutoff_pct = 0.06

            def hex_to_rgba(hex_color: str, alpha: float) -> str:
                color = hex_color.lstrip("#")
                if len(color) != 6:
                    return f"rgba(0,0,0,{alpha})"
                r = int(color[0:2], 16)
                g = int(color[2:4], 16)
                b = int(color[4:6], 16)
                return f"rgba({r},{g},{b},{alpha})"

            def smooth_frequency_field(field: np.ndarray, passes: int = 3) -> np.ndarray:
                out = field.astype(float).copy()
                for _ in range(passes):
                    # Circular smoothing in direction.
                    out = (np.roll(out, 1, axis=1) + 2.0 * out + np.roll(out, -1, axis=1)) / 4.0
                    # Radial smoothing in speed.
                    padded = np.pad(out, ((1, 1), (0, 0)), mode="edge")
                    out = (padded[:-2] + 2.0 * padded[1:-1] + padded[2:]) / 4.0
                return out

            def boundary_from_level(field: np.ndarray, level: float) -> np.ndarray:
                boundary = np.full(len(dir_centers), np.nan)
                for col_idx in range(len(dir_centers)):
                    column = field[:, col_idx]
                    hit_idx = np.where(column >= level)[0]
                    if len(hit_idx) > 0:
                        boundary[col_idx] = float(speed_edges[int(hit_idx.max()) + 1])

                # Fill sparse gaps with zero radius to preserve transparency and avoid artifacts.
                boundary = np.nan_to_num(boundary, nan=0.0)
                boundary = (np.roll(boundary, 1) + 2.0 * boundary + np.roll(boundary, -1)) / 4.0
                return boundary

            traces_added = 0
            max_plotted_speed = 0.0
            legend_order = {code: idx for idx, code in enumerate(smoke_tokens)}
            layer_fields: dict[str, np.ndarray] = {}
            plotted_codes: list[str] = []
            # Draw order controls visual layering. Later traces sit on top.
            layer_order = ["DU", "FU", "SA", "VA"]
            for code in layer_order:
                sub = dust_df[(dust_df["Phenomenon"] == code) & dust_df["WND_DIR"].notna() & dust_df["WND_SPD"].notna()].copy()
                if sub.empty:
                    continue

                dir_vals = np.mod(pd.to_numeric(sub["WND_DIR"], errors="coerce"), 360.0).to_numpy()
                spd_vals = pd.to_numeric(sub["WND_SPD"], errors="coerce").to_numpy()
                valid = np.isfinite(dir_vals) & np.isfinite(spd_vals) & (spd_vals > 0.0)
                dir_vals = dir_vals[valid]
                spd_vals = np.clip(spd_vals[valid], 0.0, max_speed)
                calm_count = float(calm_wind_mask(sub["WND_SPD"]).sum())

                if len(dir_vals) == 0 and calm_count <= 0:
                    continue

                if len(dir_vals) > 0:
                    hist2d, _, _ = np.histogram2d(spd_vals, dir_vals, bins=[speed_edges, dir_edges])
                else:
                    hist2d = np.zeros((len(speed_edges) - 1, len(dir_edges) - 1), dtype=float)
                distribute_calm_to_polar_hist2d(hist2d, calm_count)

                total_obs = float(hist2d.sum())
                if total_obs <= 0:
                    continue

                rel_field = (hist2d / total_obs) * 100.0
                rel_field = smooth_frequency_field(rel_field, passes=3)
                layer_fields[code] = rel_field

                peak_rel = float(np.nanmax(rel_field)) if rel_field.size else 0.0
                if peak_rel < cutoff_pct:
                    continue

                low = max(cutoff_pct, peak_rel * 0.08)
                high = max(low, peak_rel * 0.92)
                levels = np.geomspace(low, high, num=6)
                levels = sorted({round(float(level), 3) for level in levels})

                first_for_code = True
                for level_idx, level in enumerate(levels):
                    boundary = boundary_from_level(rel_field, level)
                    boundary_max = float(np.max(boundary))
                    if boundary_max <= 0.0:
                        continue
                    max_plotted_speed = max(max_plotted_speed, boundary_max)

                    theta_vals = list(dir_centers) + [float(dir_centers[0])]
                    r_vals = list(boundary) + [float(boundary[0])]
                    alpha = min(0.10 + level_idx * 0.07, 0.42)

                    scatter_polar.add_trace(go.Scatterpolar(
                        theta=theta_vals,
                        r=r_vals,
                        mode="lines",
                        name=code,
                        legendgroup=code,
                        showlegend=first_for_code,
                        legendrank=legend_order.get(code, 999),
                        meta={"legendColor": phenom_colors[code]},
                        line=dict(color=hex_to_rgba(phenom_colors[code], min(alpha + 0.28, 0.95)), width=1.1),
                        fill="toself",
                        fillcolor=hex_to_rgba(phenom_colors[code], alpha),
                        hoverinfo="skip",
                    ))
                    first_for_code = False

                if not first_for_code:
                    traces_added += 1
                    plotted_codes.append(code)

            if traces_added > 0:
                speed_centers = speed_edges[:-1] + (speed_step / 2.0)
                theta_mesh = np.tile(dir_centers, len(speed_centers))
                r_mesh = np.repeat(speed_centers, len(dir_centers))

                hover_order = plotted_codes
                hover_fields = {
                    code: layer_fields.get(code, np.zeros((len(speed_centers), len(dir_centers)), dtype=float))
                    for code in hover_order
                }

                custom_rows: list[list[float]] = []
                for speed_idx in range(len(speed_centers)):
                    for dir_idx in range(len(dir_centers)):
                        custom_rows.append([
                            float(hover_fields[code][speed_idx, dir_idx])
                            for code in hover_order
                        ])

                hover_lines = [
                    "Direction: %{theta:.0f}°",
                    "Wind Speed: %{r:.1f} kt",
                ]
                hover_lines.extend([
                    f"{code}: %{{customdata[{idx}]:.3f}}%"
                    for idx, code in enumerate(hover_order)
                ])
                hover_template = "<br>".join(hover_lines) + "<extra></extra>"

                scatter_polar.add_trace(go.Scatterpolar(
                    theta=theta_mesh,
                    r=r_mesh,
                    mode="markers",
                    name="",
                    showlegend=False,
                    marker=dict(size=14, color="rgba(0,0,0,0.001)"),
                    customdata=custom_rows,
                    hovertemplate=hover_template,
                ))

                display_max_speed = max(10.0, float(math.ceil((max_plotted_speed * 1.1) / 5.0) * 5.0))

                # Apply the same airport-centered topography background used by wind rose charts.
                bg_img_base64 = None
                try:
                    airport_lat = COORDS_DF.loc[icao, "LAT"]
                    airport_lon = COORDS_DF.loc[icao, "LONG"]
                    bg_img_base64 = get_centered_background(float(airport_lat), float(airport_lon), zoom=ZOOM_LEVEL)
                except Exception:
                    pass

                scatter_polar.update_layout(
                    title="Wind Direction/Strength Relative Frequency (Smoothed)",
                    polar=dict(
                        bgcolor="rgba(0,0,0,0)",
                        angularaxis=dict(direction="clockwise", period=360),
                        radialaxis=dict(angle=90, tickangle=90, ticksuffix=" kt", range=[0, display_max_speed]),
                    ),
                    legend=dict(title_text="Phenomenon", groupclick="togglegroup"),
                    margin=dict(l=36, r=36, t=52, b=22),
                )
                apply_common_layout(scatter_polar)
                apply_topo_map_panel_layout(scatter_polar, "radial_scatter_dust")
                if bg_img_base64:
                    apply_polar_background(scatter_polar, bg_img_base64)
                radial_payload = fig_payload("radial_scatter_dust", scatter_polar)
            else:
                fig = build_placeholder_figure("Wind Direction/Strength Relative Frequency (Smoothed)")
                apply_common_layout(fig)
                radial_payload = fig_payload("radial_scatter_dust", fig)
        else:
            fig = build_placeholder_figure("Wind Direction/Strength Relative Frequency (Smoothed)")
            apply_common_layout(fig)
            radial_payload = fig_payload("radial_scatter_dust", fig)

        figures.append(radial_payload)
        figures.append(scatter_payload)

    metrics = {
        "observations": int(len(filtered_df)),
        "meanSpeed": float(filtered_df["WND_SPD"].mean()) if len(filtered_df) else 0.0,
        "maxGust": float(filtered_df["MAX_WND_GUST_10"].max()) if len(filtered_df) else 0.0,
        "avgTemp": float(filtered_df["AIR_TEMP"].mean()) if len(filtered_df) else 0.0,
    } if includeMetrics else {}

    elapsed_ms = int((time.perf_counter() - started) * 1000)
    log_memory_phase("charts.response", section=section, icao=icao, figures=len(figures), elapsed_ms=elapsed_ms)
    response: dict[str, Any] = {"section": section, "figures": figures, "metrics": metrics}
    if warnings:
        response["warning"] = " ".join(warnings)
    return response
