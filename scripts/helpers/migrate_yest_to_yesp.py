#!/usr/bin/env python3
"""Migrate Esperance from mislabelled YEST to YESP (airport-only, BoM 9542)."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import polars as pl

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from scripts.helpers.build_critical_locations_lite import (  # noqa: E402
    build_mode_figure_shards,
    build_section_shards,
    build_wind_rose_hourly,
    clear_backend_caches,
    run_lightning_hourly,
    run_regenerators,
    update_airport_coverage,
)
from webapp.backend import main as backend  # noqa: E402

METAR_SRC = REPO_ROOT / "data" / "by_icao" / "TARGET_ICAO=YEST"
METAR_DST = REPO_ROOT / "data" / "by_icao" / "TARGET_ICAO=YESP"
LIGHTNING_SRC = REPO_ROOT / "data" / "lightning_by_icao" / "TARGET_ICAO=YEST"
LIGHTNING_DST = REPO_ROOT / "data" / "lightning_by_icao" / "TARGET_ICAO=YESP"
LITE_DIR = REPO_ROOT / "webapp" / "frontend" / "data-lite"
MANIFEST_PATH = LITE_DIR / "manifest.json"
PRECOMPUTED = REPO_ROOT / "statistics" / "precomputed"
ICAO = "YESP"
LEGACY_ICAO = "YEST"
AIRPORT_STN = "9542"

PRECOMPUTE_SCRIPTS = (
    "precompute_overview_wind_rose.py",
    "precompute_overview_temp_dewpoint_monthly.py",
    "precompute_overview_rain_thunder_monthly.py",
    "precompute_overview_fog_monthly.py",
    "precompute_wind_gale_monthly.py",
    "precompute_precipitation.py",
    "precompute_fog_low_cloud.py",
    "precompute_smoke_dust.py",
    "precompute_y_ceilings.py",
)


def run_precompute(script_name: str) -> None:
    script_path = REPO_ROOT / "scripts" / "helpers" / script_name
    args = [sys.executable, str(script_path), "--icao", ICAO]
    print(f"Running {script_name} for {ICAO}...")
    subprocess.run(args, check=True, cwd=REPO_ROOT)


def migrate_metar_partition() -> int:
    if not METAR_SRC.is_dir():
        if METAR_DST.is_dir():
            print(f"METAR partition already at {METAR_DST}")
            return 0
        raise FileNotFoundError(f"Missing source METAR partition: {METAR_SRC}")

    frames = [pl.read_parquet(path) for path in sorted(METAR_SRC.glob("*.parquet"))]
    if not frames:
        raise RuntimeError(f"No parquet files in {METAR_SRC}")

    df = pl.concat(frames, how="diagonal_relaxed")
    before = len(df)
    df = df.filter(pl.col("STN_NUM") == AIRPORT_STN)
    if "TARGET_ICAO" in df.columns:
        df = df.with_columns(pl.lit(ICAO).alias("TARGET_ICAO"))

    METAR_DST.mkdir(parents=True, exist_ok=True)
    out_path = METAR_DST / "part-0.parquet"
    df.write_parquet(out_path, compression="snappy")
    shutil.rmtree(METAR_SRC)
    print(f"METAR: kept {len(df):,}/{before:,} rows -> {out_path}")
    return len(df)


def migrate_lightning_partition() -> None:
    if LIGHTNING_DST.is_dir():
        print(f"Lightning partition already at {LIGHTNING_DST}")
        if LIGHTNING_SRC.is_dir():
            shutil.rmtree(LIGHTNING_SRC)
        return

    if not LIGHTNING_SRC.is_dir():
        print(f"No lightning partition at {LIGHTNING_SRC}; skipping")
        return

    shutil.move(str(LIGHTNING_SRC), str(LIGHTNING_DST))
    print(f"Lightning: renamed {LIGHTNING_SRC.name} -> {LIGHTNING_DST.name}")


def remove_legacy_precomputed() -> None:
    patterns = (
        PRECOMPUTED / "overview_fog_monthly" / f"{LEGACY_ICAO}.json",
        PRECOMPUTED / "overview_wind_rose" / f"{LEGACY_ICAO}.json",
        PRECOMPUTED / "overview_temp_dewpoint" / f"{LEGACY_ICAO}.json",
        PRECOMPUTED / "overview_rain_thunder_monthly" / f"{LEGACY_ICAO}.json",
        PRECOMPUTED / "wind_gale_monthly" / f"{LEGACY_ICAO}.json",
        PRECOMPUTED / "precipitation" / f"{LEGACY_ICAO}.json",
        PRECOMPUTED / "y_ceilings" / f"{LEGACY_ICAO}.json",
        PRECOMPUTED / "smoke_dust" / f"{LEGACY_ICAO}.json.gz",
        PRECOMPUTED / "fog_low_cloud" / LEGACY_ICAO,
    )
    for path in patterns:
        if path.is_dir():
            shutil.rmtree(path)
            print(f"Removed {path}")
        elif path.is_file():
            path.unlink()
            print(f"Removed {path}")


def remove_legacy_lite() -> None:
    legacy = LITE_DIR / LEGACY_ICAO
    legacy_topo = legacy / "topo.png"
    target_topo = LITE_DIR / ICAO / "topo.png"
    if legacy_topo.is_file() and not target_topo.is_file():
        target_topo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(legacy_topo, target_topo)
        print(f"Copied topo.png {LEGACY_ICAO} -> {ICAO}")

    if legacy.is_dir():
        shutil.rmtree(legacy)
        print(f"Removed lite directory {legacy}")


def ensure_lite_topo() -> None:
    target_topo = LITE_DIR / ICAO / "topo.png"
    if target_topo.is_file():
        return

    import subprocess

    subprocess.run(
        [sys.executable, str(REPO_ROOT / "scripts" / "helpers" / "generate_airport_topo.py"), "--icao", ICAO],
        check=True,
        cwd=REPO_ROOT,
    )


def update_manifest() -> None:
    if not MANIFEST_PATH.is_file():
        print(f"Manifest not found at {MANIFEST_PATH}; skipping")
        return

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    airports = manifest.get("airports") or manifest.get("icaos") or []
    airports = [str(code).strip().upper() for code in airports if str(code).strip()]
    airports = [code for code in airports if code != LEGACY_ICAO]
    if ICAO not in airports:
        airports.append(ICAO)
    airports.sort()
    manifest["airports"] = airports
    manifest.pop("icaos", None)

    default = manifest.get("default") or {}
    if default.get("airport") == LEGACY_ICAO:
        default["airport"] = ICAO
        manifest["default"] = default

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Updated manifest: {LEGACY_ICAO} -> {ICAO}")


def rebuild_precomputed_and_lite() -> None:
    remove_legacy_precomputed()
    clear_backend_caches()

    for script_name in PRECOMPUTE_SCRIPTS:
        run_precompute(script_name)
    run_precompute("split_fog_wind_by_mode.py")
    clear_backend_caches()

    remove_legacy_lite()
    ensure_lite_topo()
    print(f"Building lite shards for {ICAO}...")
    build_section_shards(ICAO)
    build_mode_figure_shards(ICAO)
    hourly_keys = build_wind_rose_hourly(ICAO)
    print(f"  wind_rose_hourly keys={hourly_keys}")
    run_regenerators((ICAO,))
    run_lightning_hourly((ICAO,))
    update_airport_coverage()


def main() -> int:
    migrate_metar_partition()
    migrate_lightning_partition()
    update_manifest()
    rebuild_precomputed_and_lite()
    print(f"Migration complete: {LEGACY_ICAO} -> {ICAO} (BoM station {AIRPORT_STN} only)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
