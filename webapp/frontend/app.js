const sections = [
  { key: "overview", label: "Overview" },
  { key: "wind", label: "Wind" },
  { key: "precipitation", label: "Precipitation" },
  { key: "fog_low_cloud", label: "Fog/Low cloud" },
  { key: "smoke_dust", label: "Smoke/Dust" },
];

const infoDataSection = {
  title: "Data sources",
};

const infoMetarSourceFallback =
  "METAR/SPECI data acquired from the ADAM database: January 1, 2000 to December 31, 2024.";

const infoLightningSourceBullets = [
  "GPATS lightning data acquired from the ADAM database: January 1, 2009 to December 31, 2013.",
  "WZ lightning data acquired from the ADAM database: January 1, 2014 to December 31, 2024.",
];

const infoClimateDriverSection = {
  title: "Climate drivers",
  bullets: [
    {
      text: "ENSO is characterized using the NINO3.4 sea-surface temperature anomaly index with coupled atmospheric monitoring indicators. Data acquired from ",
      linkText: "Bureau of Meteorology ENSO and IOD monitoring",
      href: "https://www.bom.gov.au/climate/enso/?ninoIndex=nino3.4&index=rnino34&period=weekly#tabs=Overview&overview-section=Monitoring-graphs",
    },
    {
      text: "IOD is characterized using the Dipole Mode Index (DMI), based on the east-west Indian Ocean sea-surface temperature anomaly contrast. Data acquired from ",
      linkText: "Bureau of Meteorology ENSO and IOD monitoring",
      href: "https://www.bom.gov.au/climate/enso/?ninoIndex=nino3.4&index=rnino34&period=weekly#tabs=Overview&overview-section=Monitoring-graphs",
    },
    {
      text: "SAM is characterized using the Marshall SAM index, an observation-based standardized pressure-gradient index between mid and high southern latitudes. Data acquired from ",
      linkText: "BAS observation-based SAM index",
      href: "http://www.nerc-bas.ac.uk/icd/gjma/sam.html",
    },
    {
      text: "MJO is characterized using Real-time Multivariate MJO indices (RMM1 and RMM2) within an amplitude-phase framework. Data acquired from ",
      linkText: "Bureau of Meteorology MJO monitoring",
      href: "https://www.bom.gov.au/climate/mjo/#tabs=Monitoring",
    },
  ],
};

const infoSectionOverview = {
  overview: {
    title: "Overview",
    figureOrder: ["wind_rose", "rain_thunder", "temp_dewpoint", "fog_low_cloud"],
  },
  wind: {
    title: "Wind",
    figureOrder: ["wind_rose", "gale_weather_split"],
  },
  precipitation: {
    title: "Precipitation",
    figureOrder: ["monthly_precip", "precip_split", "hourly_precip", "lightning_heatmap"],
  },
  fog_low_cloud: {
    title: "Fog/Low cloud",
    figureOrder: ["monthly_fog", "fog_share", "cloud_distribution", "fog_cloud_joint"],
  },
  smoke_dust: {
    title: "Smoke/Dust",
    figureOrder: ["monthly_smoke", "hourly_smoke", "radial_scatter_dust", "scatter_wind_dewpt"],
  },
};

const infoFogRule =
  "Fog included in present weather code OR visibility < 1000 m and T−Td < 2 °C and 10 minute precipitation < 0.2 mm";

const infoLowCloudBins =
  "Broken or overcast coverage within respective height bins";

const infoRainDayRule =
  "Rain/drizzle/shower/thunder present-weather, or daily precipitation > 0.2 mm";


const infoHourlyPrecipRainRule =
  "Rain/drizzle/shower/thunder present weather, or 10-minute precipitation > 0.2 mm";

const infoPrecipSplitRule =
  "10-minute precipitation > 0.2 mm, or rain/shower/thunder present weather";

const infoThunderDayRuleNear = "≥1 lightning strike within 8 km of aerodrome";
const infoThunderDayRuleOuter =
  "≥1 lightning strike between 8 and 16 km";
const infoThunderDayRule = infoThunderDayRuleNear;

const infoSmokeDustRule = "Smoke, dust, sand, or volcanic-ash present-weather";

const infoFigureDetails = {
  wind_rose: {
    title: "Wind Rose",
    description: "Relative frequency of wind by compass direction and wind-speed band.",
    classification: [
      { term: "Direction", detail: "16 sectors (22.5° bins)" },
      { term: "Speed", detail: "0–1, 1–5, 5–10, 10–15, 15–22, 22+ kt" },
      { term: "Count", detail: "One per observation; % of filtered sample per sector" },
    ],
  },
  rain_thunder: {
    title: "Rain/Thunder by Month",
    description: "Average monthly rain days and thunderstorm days by distance band.",
    classification: [
      { term: "Rain day", detail: infoRainDayRule },
      { term: "TS (<8km)", detail: infoThunderDayRuleNear },
      { term: "TS (8-16km)", detail: infoThunderDayRuleOuter },
    ],
  },
  temp_dewpoint: {
    title: "Temperature & Dewpoint",
    description: "Monthly maximum and minimum air temperature and dewpoint and average monthly precipitation.",
    classification: [
      { term: "Source", detail: "METAR/SPECI air temperature and dewpoint" },
      { term: "Aggregation", detail: "Monthly means from filtered observations" },
      { term: "Secondary axis", detail: "Monthly precipitation (where shown)" },
    ],
  },
  fog_low_cloud: {
    title: "Fog/Low Cloud Frequency",
    description: "Monthly frequency of fog and low-cloud.",
    classification: [
      { term: "Fog", detail: infoFogRule },
      { term: "Low cloud", detail: infoLowCloudBins },
    ],
  },
  gale_weather_split: {
    title: "Gale Weather",
    description: "Monthly gale frequency split by associated weather type.",
    classification: [
      { term: "Gale", detail: "10-minute mean wind > 34 kt or gusts > 41 kt" },
      { term: "With thunder", detail: "Lightning within 8 km ±10 min of observation" },
      { term: "With shower/rain", detail: "Shower and/or rain code or 10-min precip > 0.2 mm" },
    ],
  },
  monthly_precip: {
    title: "Monthly Precipitation",
    description: "Average monthly rain days and thunderstorm days by distance band.",
    classification: [
      { term: "Rain day", detail: infoRainDayRule },
      { term: "TS (<8km)", detail: infoThunderDayRuleNear },
      { term: "TS (8-16km)", detail: infoThunderDayRuleOuter },
    ],
  },
  precip_split: {
    title: "Directional Precipitation",
    description: "Conditional probability of visibility reductions in precipitation given surface wind direction.",
    classification: [
      {
        term: "Grouping",
        detail: infoPrecipSplitRule,
      },
    ],
  },
  hourly_precip: {
    title: "Hourly Rain Observations",
    description: "Precipitating observation counts by UTC hour on the primary axis.",
    classification: [
      { term: "Precipitation", detail: infoHourlyPrecipRainRule },
      { term: "TS (<8km)", detail: "Unique UTC hours per BoM year with ≥1 strike within 8 km, averaged by UTC hour" },
      { term: "TS (8-16km)", detail: "Unique UTC hours with ≥1 strike in 8–16 km, averaged by UTC hour" },
    ],
  },
  lightning_heatmap: {
    title: "Lightning Strike Frequency",
    description: "Lightning heatmap with local (30km), regional, and national zoom levels.",
    classification: [
      { term: "Local", detail: "1.25 km gridded lightning frequency" },
      { term: "Regional / National", detail: "0.1° (~10 km) gridded lightning frequency" },
    ],
  },
  monthly_fog: {
    title: "Monthly Fog/Low Cloud Frequency",
    description: "Monthly frequency of fog and low-cloud.",
    classification: [
      { term: "Fog", detail: infoFogRule },
      { term: "Low cloud", detail: infoLowCloudBins },
    ],
  },
  fog_share: {
    title: "Hourly Fog/Low Cloud Frequency",
    description: "Hourly frequency of fog and low-cloud.",
    classification: [
      { term: "Fog", detail: infoFogRule },
      { term: "Low cloud", detail: infoLowCloudBins },
    ],
  },
  cloud_distribution: {
    title: "Wind vs Cloud Distribution",
    description: "Relative frequency of fog and low cloud with respect to 10m wind.",
    classification: [
      { term: "Fog", detail: infoFogRule },
      { term: "Low cloud", detail: infoLowCloudBins },
      {
        term: "Contour value",
        detail: "Relative frequency of phenomena with respect to observed 10 m wind.",
      },
    ],
  },
  fog_cloud_joint: {
    title: "Fog/Cloud Dewpoint",
    description: "Monthly average dewpoint at time of observation.",
    classification: [
      {
        term: "Fog",
        detail: `Dewpoint at time of fog observation — ${infoFogRule}`,
      },
      {
        term: "Low cloud",
        detail: `Dewpoint at time of low cloud observation — ${infoLowCloudBins}`,
      },
    ],
  },
  monthly_smoke: {
    title: "Monthly Smoke/Dust Frequency",
    description: "Monthly frequency of smoke, dust, sand, and volcanic-ash observations.",
    classification: [
      { term: "Events", detail: infoSmokeDustRule },
      { term: "Aggregation", detail: "Monthly count from filtered observations" },
    ],
  },
  hourly_smoke: {
    title: "Hourly Smoke/Dust Frequency",
    description: "Hourly frequency of smoke and dust phenomena.",
    classification: [
      { term: "Events", detail: infoSmokeDustRule },
      { term: "Aggregation", detail: "By hour of day (UTC)" },
    ],
  },
  scatter_wind_dewpt: {
    title: "Wind Speed vs Dewpoint Spread",
    description: "Scatter of wind speed against dewpoint for smoke and dust events.",
    classification: [
      { term: "Events", detail: "Smoke, dust, sand, or volcanic ash present weather" },
      { term: "Plotted values", detail: "Wind speed and dew point at time of observation" },
    ],
  },
  radial_scatter_dust: {
    title: "Wind vs Phenomena Distribution",
    description: "Relative frequency of phenomena with respect to 10m wind.",
    classification: [
      { term: "Events", detail: "Smoke, dust, sand, or volcanic ash present weather" },
      {
        term: "Contour value",
        detail: "Relative frequency of phenomena with respect to observed 10 m wind",
      },
    ],
  },
};

const API_BASE = (window.AVCLIMATE_API_BASE || "").replace(/\/+$/, "");

function apiUrl(path) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

// Bump whenever data-lite artefacts (including topo.png) are regenerated.
// /data-lite is served with long-lived immutable Cache-Control, so URL versioning
// is required for clients to pick up replacement tiles and shards.
const LITE_DATA_VERSION = "0.1deg-2008-2024-v5-ts-bands";

function withLiteDataVersion(url) {
  if (!url || /^[a-z]+:/i.test(url)) {
    return url;
  }
  return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(LITE_DATA_VERSION)}`;
}

const state = {
  requestedSection: "overview",
  displayedSection: "overview",
  maximizedChartIndex: null,
  mobileChartId: null,
  compareEnabled: false,
  compareIcao: "",
  syncAxes: true,
  showErrorBars: false,
  fogModes: {
    monthly: "all",
    hourly: "all",
    wind: "all",
    dewpoint: "all",
  },
  options: null,
  latestFigures: [],
  // Full chart titles keyed by figureId. Plotly.react shares layout with
  // latestFigures, so compare dual-panel title relayouts poison item.figure —
  // restore must read from here, not from the mutated layout object.
  figureDisplayTitles: {},
  comparePrimaryLayoutSnapshot: null,
  axisLocks: {},
  stackedAxisLabelLocks: {},
  liteMode: false,
  manifest: null,
  airportCoverage: null,
  wrMode: "summary", // 'summary' or 'hourly'
  lhMode: "summary", // 'summary' or 'hourly' (lightning heatmap)
  lhZoom: "local", // 'local' | 'gaf' | 'region'
  windRoseLayoutRef: {},
  windRoseSummaryFigure: {},
  windRoseHourlyScaleRef: null,
  windRoseHourlyScaleKey: null,
  windRoseCompareHourlyScaleRef: null,
  windRoseCompareHourlyScaleKey: null,
  lightningHeatmapScaleRef: null,
  lightningHeatmapHourlyScaleRef: null,
  lightningHeatmapHourlyScaleKey: null,
  lightningHeatmapCompareHourlyScaleRef: null,
  lightningHeatmapCompareHourlyScaleKey: null,
  // Native Summary Z scales (pre-sync). Unsync must restore these — never the
  // live trace zmin/zmax, which are already the synced union.
  lightningHeatmapPrimarySummaryScaleRef: null,
  lightningHeatmapPrimarySummaryScaleKey: null,
  lightningHeatmapCompareSummaryScaleRef: null,
  lightningHeatmapCompareSummaryScaleKey: null,
  // Native color scales keyed by aerodrome, season, summary/hourly, and zoom.
  // Sync unions these. It must not reuse a scale from another zoom.
  lightningNativeScales: new Map(),
  lightningHeatmapSummaryLayoutRef: null,
  lightningHeatmapLayoutRef: null,
  lightningHeatmapPinnedTraceRef: null,
  chartLegendVisibility: {},
};

const compareCache = new Map();
let compareRenderToken = 0;
let windRoseCompareLayoutLock = 0;
// Defer .is-compare-mode until the compare figure is ready so the primary
// panel does not half-width during network load (wind-rose pattern for all).
let compareDeferShellReveal = false;
let compareSettleLock = 0;
let compareSettleGeneration = 0;

const liteCache = new Map();
const airportTopoCache = new Map();

async function checkLiteMode() {
  try {
    const res = await fetch(withLiteDataVersion("data-lite/manifest.json"));
    if (res.ok) {
      state.manifest = await res.json();
      state.liteMode = true;
      document.body.classList.add("lite-mode");
      console.log("Lite mode artifacts detected");
      return true;
    }
  } catch (error) {
    console.warn("Lite manifest not available:", error);
  }
  state.liteMode = false;
  document.body.classList.remove("lite-mode");
  return false;
}

async function loadAirportCoverage() {
  try {
    const res = await fetch(withLiteDataVersion("data-lite/airport-coverage.json"));
    if (!res.ok) {
      return null;
    }
    const payload = await res.json();
    const airports = payload?.airports;
    if (!airports || typeof airports !== "object") {
      return null;
    }
    state.airportCoverage = airports;
    return airports;
  } catch (error) {
    console.warn("Airport coverage metadata not available:", error);
    return null;
  }
}

function formatCoverageDate(isoDate) {
  const value = String(isoDate || "").trim();
  if (!value) {
    return "";
  }
  const parts = value.split("-").map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return value;
  }
  const [year, month, day] = parts;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatCoveragePercent(pct) {
  const value = Number(pct);
  if (!Number.isFinite(value)) {
    return "";
  }
  if (Math.abs(value - Math.round(value)) < 0.05) {
    return `${Math.round(value)}%`;
  }
  return `${value.toFixed(1)}%`;
}

function metarSourceBullet(icao) {
  const code = String(icao || "").trim().toUpperCase();
  const coverage = state.airportCoverage?.[code];
  const startDate = formatCoverageDate(coverage?.metarStart);
  const endDate = formatCoverageDate(coverage?.metarEnd);
  if (!startDate || !endDate) {
    return infoMetarSourceFallback;
  }
  const pctLabel = formatCoveragePercent(coverage?.metarCoveragePct);
  if (!pctLabel) {
    return `METAR/SPECI acquired from the ADAM database: ${startDate} to ${endDate}.`;
  }
  return `METAR/SPECI acquired from the ADAM database: ${startDate} to ${endDate} (${pctLabel} hourly coverage).`;
}

function buildInfoDataBullets(icao) {
  return [metarSourceBullet(icao), ...infoLightningSourceBullets];
}

function formatLiteDataError(icao, section, season) {
  const code = String(icao || "").trim().toUpperCase() || "unknown";
  const seasonLabel = String(season || "all");
  const sectionLabel = String(section || "overview");
  return `No precomputed charts for ${code} (${sectionLabel}, season "${seasonLabel}"). `
    + "If this airport was recently added, re-run the lite precompute.";
}

function liteManifestAirports() {
  const manifest = state.manifest;
  if (!manifest) {
    return [];
  }
  return manifest.airports || manifest.icaos || [];
}

function liteJsonGzUrl(url) {
  if (url.endsWith(".json.gz")) {
    return url;
  }
  if (url.endsWith(".json")) {
    return `${url.slice(0, -5)}.json.gz`;
  }
  return `${url}.json.gz`;
}

async function parseLiteJsonResponse(res) {
  const buffer = await res.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const isGzip = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
  if (isGzip && typeof DecompressionStream !== "undefined") {
    const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream("gzip"));
    const text = await new Response(stream).text();
    return JSON.parse(text);
  }
  const text = new TextDecoder().decode(buffer);
  return JSON.parse(text);
}

async function fetchJsonCached(url, { preferGzip = true } = {}) {
  if (liteCache.has(url)) return liteCache.get(url);

  const gzipUrl = liteJsonGzUrl(url);
  let res;
  if (preferGzip && url !== gzipUrl) {
    res = await fetch(withLiteDataVersion(gzipUrl));
    if (!res.ok) {
      res = await fetch(withLiteDataVersion(url));
    }
  } else {
    res = await fetch(withLiteDataVersion(url));
  }
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);

  const data = await parseLiteJsonResponse(res);
  liteCache.set(url, data);
  if (url !== gzipUrl) {
    liteCache.set(gzipUrl, data);
  }
  return data;
}

function liteSectionKey(season) {
  return String(season || "all");
}

function legacyLiteSectionKey(season) {
  return `${liteSectionKey(season)}_all_all_all`;
}

function lookupLiteSectionPayload(dataMap, season) {
  if (!dataMap || typeof dataMap !== "object") {
    return null;
  }
  const key = liteSectionKey(season);
  if (dataMap[key]) {
    return dataMap[key];
  }
  const legacyKey = legacyLiteSectionKey(season);
  if (dataMap[legacyKey]) {
    return dataMap[legacyKey];
  }
  return null;
}

function liteWindRoseHourlyKey(season, hour) {
  return `${liteSectionKey(season)}_${hour}`;
}

function legacyLiteWindRoseHourlyKey(season, hour) {
  return `${legacyLiteSectionKey(season)}_${hour}`;
}

function lookupLiteWindRoseHourlyPayload(dataMap, season, hour) {
  if (!dataMap || typeof dataMap !== "object") {
    return null;
  }
  const key = liteWindRoseHourlyKey(season, hour);
  if (dataMap[key]) {
    return dataMap[key];
  }
  const legacyKey = legacyLiteWindRoseHourlyKey(season, hour);
  if (dataMap[legacyKey]) {
    return dataMap[legacyKey];
  }
  return null;
}

function liteLightningHourlyUrl(icao) {
  return `data-lite/${icao}/lightning_heatmap_hourly.json.gz`;
}

function lookupLiteLightningHourlyGrid(dataMap, season, hour) {
  if (!dataMap || typeof dataMap !== "object") {
    return null;
  }
  const grids = dataMap.grids && typeof dataMap.grids === "object" ? dataMap.grids : dataMap;
  const key = liteWindRoseHourlyKey(season, hour);
  if (Array.isArray(grids[key])) {
    return grids[key];
  }
  const legacyKey = legacyLiteWindRoseHourlyKey(season, hour);
  if (Array.isArray(grids[legacyKey])) {
    return grids[legacyKey];
  }
  return null;
}

function supportsLightningHeatmapHourly(icao = els.icao?.value) {
  return Boolean(String(icao || "").trim());
}

const LITE_DAY_MODES = ["all", "rain", "non_rain"];

const LITE_MODE_FIGURE_SPECS = [
  { figureId: "fog_low_cloud", sections: ["overview"], modeKey: "monthly" },
  { figureId: "monthly_fog", sections: ["fog_low_cloud"], modeKey: "monthly" },
  { figureId: "fog_share", sections: ["fog_low_cloud"], modeKey: "hourly" },
  { figureId: "cloud_distribution", sections: ["fog_low_cloud"], modeKey: "wind" },
  { figureId: "fog_cloud_joint", sections: ["fog_low_cloud"], modeKey: "dewpoint" },
];

function liteModeFigureSpecsForSection(section) {
  return LITE_MODE_FIGURE_SPECS.filter((spec) => spec.sections.includes(section));
}

function liteModeFigureSpecsForModeKey(modeKey, section = state.displayedSection) {
  return LITE_MODE_FIGURE_SPECS.filter(
    (spec) => spec.modeKey === modeKey && spec.sections.includes(section),
  );
}

function liteSectionShardUrl(icao, section, season) {
  return `data-lite/${icao}/${section}/${liteSectionKey(season)}.json.gz`;
}

function liteLegacySectionUrl(icao, section) {
  return `data-lite/${icao}/${section}.json`;
}

function liteFigureShardUrl(icao, figureId, season, mode) {
  return `data-lite/${icao}/figures/${figureId}/${liteSectionKey(season)}_${mode}.json.gz`;
}

async function fetchLiteJsonOptional(url) {
  try {
    return await fetchJsonCached(url);
  } catch (error) {
    return null;
  }
}

async function fetchLiteSectionPayload(icao, section, season) {
  const sharded = await fetchLiteJsonOptional(liteSectionShardUrl(icao, section, season));
  if (sharded?.figures) {
    return sharded;
  }

  const legacyMap = await fetchLiteJsonOptional(liteLegacySectionUrl(icao, section));
  const legacyPayload = lookupLiteSectionPayload(legacyMap, season);
  if (legacyPayload?.figures) {
    return JSON.parse(JSON.stringify(legacyPayload));
  }

  return null;
}

async function fetchLiteFigureShard(icao, figureId, season, mode) {
  const sharded = await fetchLiteJsonOptional(liteFigureShardUrl(icao, figureId, season, mode));
  if (sharded?.id && sharded?.figure) {
    return sharded;
  }

  const legacyMap = await fetchLiteJsonOptional(liteLegacySectionUrl(
    figureId === "fog_low_cloud" ? "overview" : "fog_low_cloud",
  ));
  const legacyPayload = lookupLiteSectionPayload(legacyMap, season);
  const legacyFigure = legacyPayload?.figures?.find((item) => item.id === figureId);
  if (legacyFigure && mode === "all") {
    return JSON.parse(JSON.stringify(legacyFigure));
  }

  return null;
}

async function assembleLiteFigures(icao, section, season, onProgress) {
  const figureOrder = infoSectionOverview[section]?.figureOrder || [];
  const modeSpecs = liteModeFigureSpecsForSection(section);
  const totalSteps = 1 + modeSpecs.length;
  let completed = 0;
  const tick = (statusMessage) => {
    completed += 1;
    if (onProgress) {
      onProgress(completed, totalSteps, statusMessage);
    }
  };

  const basePayload = await fetchLiteSectionPayload(icao, section, season);
  tick("Fetching section data...");

  const modeFigures = await Promise.all(
    modeSpecs.map(async (spec) => {
      const mode = state.fogModes[spec.modeKey] || "all";
      const shard = await fetchLiteFigureShard(icao, spec.figureId, season, mode);
      tick(`Fetching ${figureDisplayLabel(spec.figureId)}...`);
      return shard;
    }),
  );

  const figuresById = new Map();
  (basePayload?.figures || []).forEach((item) => {
    if (item?.id) {
      figuresById.set(item.id, item);
    }
  });
  modeFigures.forEach((item) => {
    if (item?.id) {
      figuresById.set(item.id, item);
    }
  });

  const figures = figureOrder
    .map((figureId) => figuresById.get(figureId))
    .filter(Boolean);

  return {
    figures,
    metrics: basePayload?.metrics || {},
    warning: basePayload?.warning,
  };
}

async function refreshLiteModeFigures(modeKey) {
  if (!state.liteMode) {
    fetchCharts();
    return;
  }

  const section = state.displayedSection;
  const specs = liteModeFigureSpecsForModeKey(modeKey, section);
  if (!specs.length || !state.latestFigures.length) {
    fetchCharts();
    return;
  }

  const icao = els.icao.value;
  const season = els.season.value;
  const mode = state.fogModes[modeKey] || "all";
  invalidateCompareCache();

  return runViewTransition({
    message: "Updating chart...",
    load: async ({ reportFetchProgress }) => {
      const totalSteps = specs.length;
      let completed = 0;
      const shards = await Promise.all(
        specs.map(async (spec) => {
          const shard = await fetchLiteFigureShard(icao, spec.figureId, season, mode);
          completed += 1;
          reportFetchProgress(completed, totalSteps, `Updating ${figureDisplayLabel(spec.figureId)}...`);
          return shard;
        }),
      );

      shards.forEach((shard) => {
        if (!shard?.id) {
          return;
        }
        const idx = state.latestFigures.findIndex((item) => item.id === shard.id);
        if (idx >= 0) {
          state.latestFigures[idx] = JSON.parse(JSON.stringify(shard));
        }
      });

      return {
        section,
        figures: state.latestFigures,
        metrics: {},
      };
    },
  });
}

const fogLegendOrder = new Map([
  ["2000ft - 1500ft cloud", 0],
  ["1500ft - 1000ft cloud", 1],
  ["1000ft - 500ft cloud", 2],
  ["< 500ft cloud", 3],
  ["Fog", 4],
  ["Freezing fog", 5],
]);

const smokeLegendOrder = new Map([
  ["FU", 0],
  ["DU", 1],
  ["SA", 2],
  ["VA", 3],
]);

const windRoseLegendOrder = new Map([
  ["Calm", 0],
  ["1-3 kt", 1],
  ["4-6 kt", 2],
  ["6-10 kt", 3],
  ["10-15 kt", 4],
  ["15-20 kt", 5],
  [">20 kt", 6],
]);

const fogPanels = [
  { key: "monthly", toolbarId: "chart-toolbar-1" },
  { key: "hourly", toolbarId: "chart-toolbar-2" },
  { key: "wind", toolbarId: "chart-toolbar-3" },
  { key: "dewpoint", toolbarId: "chart-toolbar-4" },
];

const defaultLegendTraceVisibilityByFigure = {
  temp_dewpoint: {
    "Avg Daily Max Td": "legendonly",
    "Avg Daily Min Td": "legendonly",
  },
  wind_rose: {
    Calm: "legendonly",
  },
};

const THUNDER_LEGEND_LABEL = "TS (<8km)";
const THUNDER_OUTER_LEGEND_LABEL = "TS (8-16km)";
const LEGACY_THUNDER_LEGEND_LABELS = new Set([
  "Thunderstorm",
  "Thunderstorm (>2008)",
  "TS (>2008)",
  "Lightning magnitude",
  "Thunderstorms",
]);
const thunderLegendFigureIds = new Set([
  "rain_thunder",
  "monthly_precip",
  "hourly_precip",
  "gale_weather_split",
]);

function normalizeThunderLegendLabels(figure, figureId = "") {
  if (!figure || !thunderLegendFigureIds.has(figureId)) {
    return;
  }
  (figure.data || []).forEach((trace) => {
    const name = String(trace?.name || "").trim();
    if (name === THUNDER_OUTER_LEGEND_LABEL) {
      return;
    }
    if (LEGACY_THUNDER_LEGEND_LABELS.has(name) || name === THUNDER_LEGEND_LABEL) {
      // Gale weather still uses a generic thunderstorm category label.
      trace.name = figureId === "gale_weather_split" ? "Thunderstorm" : THUNDER_LEGEND_LABEL;
    }
  });
}

function getStoredThunderLegendVisibility(stored) {
  if (!stored) {
    return undefined;
  }
  const keys = [...LEGACY_THUNDER_LEGEND_LABELS, THUNDER_LEGEND_LABEL, THUNDER_OUTER_LEGEND_LABEL];
  for (const key of keys) {
    if (Object.hasOwn(stored, key)) {
      return stored[key];
    }
  }
  return undefined;
}

const frequencyFigureIds = new Set([
  "rain_thunder",
  "temp_dewpoint",
  "fog_low_cloud",
  "gale_weather_split",
  "monthly_precip",
  "monthly_fog",
  "fog_share",
  "fog_cloud_joint",
  "monthly_smoke",
  "hourly_smoke",
  "hourly_precip",
]);

const monthlyFrequencyFigureIds = new Set([
  "rain_thunder",
  "temp_dewpoint",
  "fog_low_cloud",
  "gale_weather_split",
  "monthly_precip",
  "monthly_fog",
  "fog_cloud_joint",
  "monthly_smoke",
]);

const hourlyFrequencyFigureIds = new Set([
  "fog_share",
  "hourly_smoke",
  "hourly_precip",
]);

const strictValueHoverFigureIds = new Set([
  "rain_thunder",
  "monthly_precip",
  "temp_dewpoint",
  "fog_low_cloud",
  "gale_weather_split",
  "monthly_fog",
  "fog_share",
  "monthly_smoke",
  "hourly_smoke",
  "hourly_precip",
  "fog_cloud_joint",
]);

const strictGroupedBarOverlayFigureIds = new Set([
  "rain_thunder",
  "monthly_precip",
  "monthly_smoke",
  "hourly_smoke",
  "hourly_precip",
]);

// Paired bars with manual x offsets on overlaid dual y-axes (not px.bar grouped bars).
const dualAxisPairedBarOverlayFigureIds = new Set([
  "hourly_precip",
]);

const strictStackedBarOverlayFigureIds = new Set([
  "fog_low_cloud",
  "gale_weather_split",
  "monthly_fog",
  "fog_share",
  // Paired-offset rain column + stacked exclusive TS bands (near/outer).
  "rain_thunder",
  "monthly_precip",
  "hourly_precip",
]);

// Charts with terrain backgrounds tied to fixed axis ranges (not responsive y scaling).
const fixedTopoAxisFigureIds = new Set([
  "lightning_heatmap",
]);

function hostSupportsErrorBarRefresh(host) {
  if (!host?.data?.length || host.layout?.polar) {
    return false;
  }
  return !fixedTopoAxisFigureIds.has(host.dataset?.figureId || "");
}

function hostHasFixedTopoAxisRange(host) {
  return Boolean(host?.layout?.polar) || fixedTopoAxisFigureIds.has(host?.dataset?.figureId || "");
}

// Keep synthetic error-bar traces above bars/lines (e.g. precip columns on temp_dewpoint).
const ERROR_BAR_OVERLAY_ZORDER = 10;

function finalizeErrorBarOverlays(overlays) {
  overlays.forEach((overlay) => {
    overlay.zorder = ERROR_BAR_OVERLAY_ZORDER;
  });
  return overlays;
}

function syncBackgroundBarTraceStacking(host) {
  if (!host) {
    return Promise.resolve();
  }

  const traces = host.data || [];
  const demoteBars = state.showErrorBars && traces.some(isStrictValueErrorOverlayTrace);
  const indices = [];
  const zorders = [];

  traces.forEach((trace, index) => {
    if (trace?.type !== "bar" || isErrorBarOverlayTrace(trace) || String(trace.type || "").includes("polar")) {
      return;
    }
    indices.push(index);
    zorders.push(demoteBars ? -1 : 0);
  });

  if (!indices.length) {
    return Promise.resolve();
  }

  return Plotly.restyle(host, { zorder: zorders }, indices);
}

function finishStrictValueErrorBarOverlays(host) {
  const figureId = host?.dataset?.figureId || "";
  const syncVisibility = strictGroupedBarOverlayFigureIds.has(figureId)
    ? syncGroupedBarOverlayState(host)
    : syncErrorBarOverlayVisibility(host);
  return syncVisibility.then(() => syncBackgroundBarTraceStacking(host));
}

const overviewFogToolbarId = "chart-toolbar-4";
const overviewWindToolbarId = "chart-toolbar-1";
const windSectionWindToolbarId = "chart-toolbar-1";
const precipitationLightningToolbarId = "chart-toolbar-4";
const LIGHTNING_PLAY_INTERVAL_MS = 300;

const els = {
  categoryRow: document.getElementById("category-row"),
  categoryButtons: document.getElementById("category-buttons"),
  mobileControlStrip: document.getElementById("mobile-control-strip"),
  mobileSectionSelect: document.getElementById("mobile-section-select"),
  mobileChartSelect: document.getElementById("mobile-chart-select"),
  page: document.querySelector(".page"),
  controls: document.getElementById("controls"),
  icao: document.getElementById("icao"),
  season: document.getElementById("season"),
  errorBarsToggle: document.getElementById("error-bars-toggle"),
  status: document.getElementById("status"),
  loadingOverlay: document.getElementById("loading-overlay"),
  loadingBarFill: document.getElementById("loading-bar-fill"),
  loadingStatus: document.getElementById("loading-status"),
  infoBtn: document.getElementById("info-btn"),
  infoOverlay: document.getElementById("info-overlay"),
  infoCloseBtn: document.getElementById("info-close-btn"),
  infoBody: document.getElementById("info-body"),
  metrics: document.getElementById("metrics"),
  chartToolbars: fogPanels.reduce((acc, panel) => {
    acc[panel.key] = document.getElementById(panel.toolbarId);
    return acc;
  }, {}),
  overviewFogModeToolbar: document.getElementById(overviewFogToolbarId),
  overviewWindModeToolbar: document.getElementById(overviewWindToolbarId),
  windSectionWindModeToolbar: document.getElementById(windSectionWindToolbarId),
  charts: [
    document.getElementById("chart-1"),
    document.getElementById("chart-2"),
    document.getElementById("chart-3"),
    document.getElementById("chart-4"),
  ],
  wrModeSummary: null,
  wrModeHourly: null,
  wrHourScroller: null,
  wrHourScrollerContainer: null,
  wrHourValue: null,
  wrHourPlayBtn: null,
  wrToolbarTemplate: document.getElementById("wr-toolbar-template"),
  lhModeSummary: null,
  lhModeHourly: null,
  lhHourScroller: null,
  lhHourScrollerContainer: null,
  lhHourValue: null,
  lhHourPlayBtn: null,
  lhToolbarTemplate: document.getElementById("lh-toolbar-template"),
  precipitationLightningToolbar: document.getElementById(precipitationLightningToolbarId),
};

function ensureChartShell(host) {
  const card = host.closest(".chart-card");
  let topChrome = card.querySelector(".chart-card-top-chrome");
  const cardToolbar = card.querySelector(".chart-card-toolbar");
  let shell = card.querySelector(".chart-shell");
  let legend = card.querySelector(".chart-legend");
  let maximizeButton = card.querySelector(".chart-maximize-btn");
  let panels = card.querySelector(".chart-compare-panels");
  let primaryPanel = card.querySelector(".chart-compare-panel.is-primary");
  let comparePanel = card.querySelector(".chart-compare-panel.is-compare");
  let compareHost = card.querySelector(".chart.compare-host");
  let compareToolbar = card.querySelector(".chart-compare-toolbar");
  let primaryLabel = card.querySelector(".chart-compare-panel.is-primary .chart-compare-label");
  let compareLabel = card.querySelector(".chart-compare-panel.is-compare .chart-compare-label");
  let compareStatus = card.querySelector(".chart-compare-status");

  // Mode toolbar must be a direct child of .chart-card so absolute `top` is
  // relative to the card. A height:0 chrome wrapper broke that in Safari.
  if (cardToolbar && cardToolbar.parentElement !== card) {
    card.insertBefore(cardToolbar, card.querySelector(".chart-shell") || card.firstChild);
  }
  if (topChrome && topChrome.parentElement) {
    topChrome.remove();
  }

  if (!shell) {
    shell = document.createElement("div");
    shell.className = "chart-shell";
    host.replaceWith(shell);
    shell.appendChild(host);

    legend = document.createElement("div");
    legend.className = "chart-legend hidden";
    shell.appendChild(legend);
  }

  if (!panels) {
    panels = document.createElement("div");
    panels.className = "chart-compare-panels";
    primaryPanel = document.createElement("div");
    primaryPanel.className = "chart-compare-panel is-primary";
    primaryLabel = document.createElement("div");
    primaryLabel.className = "chart-compare-label hidden";
    primaryLabel.setAttribute("aria-hidden", "true");
    primaryPanel.appendChild(primaryLabel);
    host.parentElement?.insertBefore(panels, host);
    panels.appendChild(primaryPanel);
    primaryPanel.appendChild(host);

    comparePanel = document.createElement("div");
    comparePanel.className = "chart-compare-panel is-compare hidden";
    compareLabel = document.createElement("div");
    compareLabel.className = "chart-compare-label hidden";
    compareLabel.setAttribute("aria-hidden", "true");
    compareHost = document.createElement("div");
    compareHost.className = "chart compare-host";
    compareHost.id = `${host.id}-compare`;
    compareStatus = document.createElement("div");
    compareStatus.className = "chart-compare-status hidden";
    comparePanel.appendChild(compareLabel);
    comparePanel.appendChild(compareHost);
    comparePanel.appendChild(compareStatus);
    panels.appendChild(comparePanel);
  }

  if (!compareToolbar) {
    compareToolbar = document.createElement("div");
    compareToolbar.className = "chart-compare-toolbar hidden";

    const compareToggle = document.createElement("button");
    compareToggle.type = "button";
    compareToggle.className = "chart-compare-toggle";
    compareToggle.setAttribute("aria-pressed", "false");
    compareToggle.textContent = "Compare";
    compareToggle.title = "Compare with another aerodrome";

    const compareSelect = document.createElement("select");
    compareSelect.className = "chart-compare-icao";
    compareSelect.setAttribute("aria-label", "Comparison aerodrome");
    compareSelect.disabled = true;

    const syncToggle = document.createElement("button");
    syncToggle.type = "button";
    syncToggle.className = "chart-sync-axes-toggle";
    syncToggle.setAttribute("aria-pressed", state.syncAxes ? "true" : "false");
    syncToggle.textContent = "Sync axes";
    syncToggle.title = "Match vertical / colour scales between panels";
    syncToggle.classList.toggle("is-active", state.syncAxes);
    syncToggle.classList.add("hidden");

    compareToggle.addEventListener("click", () => {
      state.compareEnabled = !state.compareEnabled;
      if (!state.compareEnabled) {
        clearComparePanelContents();
      }
      applyMaximizedChartState();
      applyChartShellHeights(state.displayedSection);
      refreshCompareMode();
    });

    compareSelect.addEventListener("change", () => {
      const next = String(compareSelect.value || "").trim().toUpperCase();
      const primary = String(els.icao?.value || "").trim().toUpperCase();
      state.compareIcao = next && next !== primary ? next : "";
      refreshCompareMode();
    });

    syncToggle.addEventListener("click", () => {
      state.syncAxes = !state.syncAxes;
      syncToggle.classList.toggle("is-active", state.syncAxes);
      syncToggle.setAttribute("aria-pressed", state.syncAxes ? "true" : "false");
      // Axis sync must only change ranges / colour scales — never re-measure
      // panel widths (that shifts bar columns horizontally).
      applySyncedAxesToComparePair();
    });

    compareToolbar.appendChild(compareToggle);
    compareToolbar.appendChild(compareSelect);
    compareToolbar.appendChild(syncToggle);
  }

  // Anchor beside Maximize (bottom-left of the plot shell).
  if (shell && compareToolbar.parentElement !== shell) {
    shell.appendChild(compareToolbar);
  }

  if (!maximizeButton) {
    maximizeButton = document.createElement("button");
    maximizeButton.type = "button";
    maximizeButton.className = "chart-maximize-btn hidden";
    maximizeButton.setAttribute("aria-pressed", "false");
    maximizeButton.title = "Expand chart";
    maximizeButton.textContent = "Maximize";
    maximizeButton.addEventListener("click", () => {
      const chartIndex = Number(maximizeButton.dataset.chartIndex);
      const nextMaximized = state.maximizedChartIndex === chartIndex ? null : chartIndex;
      if (nextMaximized === null) {
        clearCompareModeState({ keepSyncPreference: true });
      }
      if (!state.latestFigures.length) {
        state.maximizedChartIndex = nextMaximized;
        applyMaximizedChartState();
        applyChartShellHeights(state.displayedSection);
        return;
      }
      runViewTransition({
        message: nextMaximized === null ? "Restoring chart grid..." : "Expanding chart...",
        prepare: () => {
          // Apply maximize intent before GAF figure rebuild so airport overlays
          // (national fleet vs selected-only) match the target layout.
          state.maximizedChartIndex = nextMaximized;
          if (state.lhMode === "hourly" || isLightningGafZoom()) {
            resetLightningHourlyLayoutState();
          }
          invalidateCanonicalGeometryForVisibleCharts();
        },
        load: async () => {
          let figures = state.latestFigures;
          const lightningIndex = figures.findIndex((item) => item.id === "lightning_heatmap");
          if (
            isLightningGafZoom()
            && state.displayedSection === "precipitation"
            && lightningIndex >= 0
          ) {
            const payload = { figures: JSON.parse(JSON.stringify(figures)) };
            await applyGafLightningHeatmapOverride(
              payload,
              els.icao.value,
              els.season.value,
            );
            figures = payload.figures;
          }
          return {
            section: state.displayedSection,
            figures,
            metrics: {},
            maximizedChartIndex: nextMaximized,
          };
        },
      });
    });
  }

  // Keep Maximize anchored to the plot area, not the below-chart toggle strip.
  if (shell && maximizeButton.parentElement !== shell) {
    shell.appendChild(maximizeButton);
  }

  return {
    card,
    shell,
    legend,
    maximizeButton,
    panels,
    primaryPanel,
    comparePanel,
    compareHost,
    compareToolbar,
    primaryLabel,
    compareLabel,
    compareStatus,
  };
}

const chartUi = els.charts.map((host) => ensureChartShell(host));

let infoModalReturnFocusEl = null;

function isInfoModalOpen() {
  return Boolean(els.infoOverlay && !els.infoOverlay.classList.contains("hidden"));
}

function appendInfoSection(host, title, bullets) {
  const section = document.createElement("section");
  section.className = "info-section";

  const heading = document.createElement("h3");
  heading.textContent = title;
  section.appendChild(heading);

  if (Array.isArray(bullets) && bullets.length) {
    const list = renderInfoBulletList(bullets);
    section.appendChild(list);
  }
  host.appendChild(section);
}

function renderInfoBulletList(items) {
  const list = document.createElement("ul");
  list.className = "info-list";

  items.forEach((item) => {
    const li = document.createElement("li");
    if (typeof item === "string") {
      li.textContent = item;
      list.appendChild(li);
      return;
    }

    if (item && typeof item === "object") {
      if (typeof item.href === "string" && item.href.length) {
        const lead = typeof item.text === "string" ? item.text : "";
        if (lead) {
          li.appendChild(document.createTextNode(lead));
        }
        const link = document.createElement("a");
        link.href = item.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = String(item.linkText || item.href);
        li.appendChild(link);
        li.appendChild(document.createTextNode("."));
      } else {
        li.textContent = String(item.text || "");
      }
      if (Array.isArray(item.subBullets) && item.subBullets.length) {
        const subList = renderInfoBulletList(item.subBullets);
        li.appendChild(subList);
      }
      list.appendChild(li);
    }
  });

  return list;
}

function appendInfoSubsection(host, title, bullets) {
  const section = document.createElement("section");
  section.className = "info-subsection";

  const heading = document.createElement("h4");
  heading.textContent = title;
  section.appendChild(heading);

  if (Array.isArray(bullets) && bullets.length) {
    const list = renderInfoBulletList(bullets);
    section.appendChild(list);
  }
  host.appendChild(section);
}

function appendInfoClassificationDetail(host, detail) {
  const details = Array.isArray(detail) ? detail : [detail];
  if (details.length === 1) {
    host.textContent = details[0];
    return;
  }

  const list = document.createElement("ul");
  list.className = "info-class-sublist";
  details.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
  host.appendChild(list);
}

function renderInfoClassificationCell(classification) {
  const cell = document.createElement("td");
  cell.className = "info-class-cell";

  if (typeof classification === "string") {
    cell.textContent = classification;
    return cell;
  }

  const list = document.createElement("div");
  list.className = "info-class-list";
  classification.forEach(({ term, detail }) => {
    const item = document.createElement("div");
    item.className = "info-class-item";

    const termEl = document.createElement("span");
    termEl.className = "info-class-term";
    termEl.textContent = term;
    item.appendChild(termEl);

    const detailEl = document.createElement("div");
    detailEl.className = "info-class-detail";
    appendInfoClassificationDetail(detailEl, detail);
    item.appendChild(detailEl);

    list.appendChild(item);
  });
  cell.appendChild(list);
  return cell;
}

function renderInfoGraphDetailsTable(figureIds) {
  const table = document.createElement("table");
  table.className = "info-graph-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["", "Description", "Classification method"].forEach((label) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = label;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  figureIds.forEach((figureId) => {
    const detail = infoFigureDetails[figureId];
    if (!detail) {
      return;
    }
    const row = document.createElement("tr");

    const titleCell = document.createElement("td");
    titleCell.textContent = detail.title;
    row.appendChild(titleCell);

    const descCell = document.createElement("td");
    descCell.dataset.label = "Description";
    descCell.textContent = detail.description;
    row.appendChild(descCell);

    const classCell = renderInfoClassificationCell(detail.classification);
    classCell.dataset.label = "Classification method";
    row.appendChild(classCell);
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  return table;
}

function activeInfoSectionKey() {
  return state.requestedSection || state.displayedSection || "overview";
}

function activeFigureIdsForInfo(sectionKey) {
  const knownOrder = infoSectionOverview[sectionKey]?.figureOrder || [];
  const latestIds = state.latestFigures
    .map((entry) => (entry && typeof entry.id === "string" ? entry.id : ""))
    .filter((id) => id && Object.hasOwn(infoFigureDetails, id));

  if (latestIds.length) {
    const ordered = knownOrder.filter((id) => latestIds.includes(id));
    const extras = latestIds.filter((id) => !ordered.includes(id));
    return [...ordered, ...extras];
  }

  return knownOrder.filter((id) => Object.hasOwn(infoFigureDetails, id));
}

function renderInfoModalContent() {
  if (!els.infoBody) {
    return;
  }

  els.infoBody.innerHTML = "";

  const panels = document.createElement("div");
  panels.className = "info-panels";

  const dataPanel = document.createElement("section");
  dataPanel.className = "info-panel info-panel-data";
  appendInfoSection(dataPanel, infoDataSection.title, buildInfoDataBullets(els.icao?.value || ""));
  if (!state.liteMode) {
    appendInfoSubsection(dataPanel, infoClimateDriverSection.title, infoClimateDriverSection.bullets);
  }

  const graphPanel = document.createElement("section");
  graphPanel.className = "info-panel info-panel-graphs";

  const sectionKey = activeInfoSectionKey();
  const figureIds = activeFigureIdsForInfo(sectionKey);
  if (figureIds.length) {
    graphPanel.appendChild(renderInfoGraphDetailsTable(figureIds));
  }

  panels.appendChild(graphPanel);
  panels.appendChild(dataPanel);
  els.infoBody.appendChild(panels);
}

function openInfoModal() {
  if (!els.infoOverlay) {
    return;
  }
  renderInfoModalContent();
  infoModalReturnFocusEl = document.activeElement;
  els.infoOverlay.classList.remove("hidden");
  els.infoOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  if (els.infoCloseBtn) {
    els.infoCloseBtn.focus();
  }
}

function closeInfoModal() {
  if (!els.infoOverlay) {
    return;
  }
  els.infoOverlay.classList.add("hidden");
  els.infoOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (infoModalReturnFocusEl && typeof infoModalReturnFocusEl.focus === "function") {
    infoModalReturnFocusEl.focus();
  }
}

let loadingProgress = 0;
let loadingFallbackTimer = null;
let lastProgressAt = 0;
let transitionToken = 0;
let activeTransitionToken = 0;
let viewTransitionInFlight = false;
let pendingTransitionAbort = null;
let pendingFetch = null;

const LOADING_PHASE = {
  START: 15,
  FETCH_END: 70,
  RENDER_END: 95,
};

function isViewTransitionActive() {
  return viewTransitionInFlight;
}

/** Nested fetches must not dismiss the overlay owned by runViewTransition. */
function announceNestedLoading(message) {
  if (isViewTransitionActive()) {
    setLoadingState(Math.max(loadingProgress, LOADING_PHASE.START), message);
    return false;
  }
  showLoading(message);
  return true;
}

function releaseNestedLoading(owned) {
  if (owned) {
    hideLoading();
  }
}

function setStatus(message = "") {
  els.status.textContent = message;
}

function isBenignChartRenderError(error) {
  const message = String(error?.message || error || "");
  if (!message) {
    return false;
  }
  return /_inputDomain|plotly|no valid inputs|not compatible with plot/i.test(message);
}

function logChartRenderWarning(figureId, error) {
  const label = figureId || "chart";
  if (isBenignChartRenderError(error)) {
    console.warn(`Skipped post-render adjustments for ${label} due to sparse or missing data.`);
    return;
  }
  console.warn(`Chart render issue for ${label}:`, error);
}

function figureDisplayLabel(figureId) {
  const id = String(figureId || "").trim();
  if (!id) {
    return "chart";
  }
  const title = infoFigureDetails[id]?.title;
  if (title) {
    return title;
  }
  return id
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function setLoadingState(progress, message) {
  loadingProgress = Math.max(0, Math.min(100, progress));
  els.loadingBarFill.style.width = `${loadingProgress}%`;
  if (message) {
    els.loadingStatus.textContent = message;
  }
  lastProgressAt = Date.now();
}

function mapFetchProgress(completed, total) {
  if (!total) {
    return LOADING_PHASE.START;
  }
  const ratio = completed / total;
  return LOADING_PHASE.START + ratio * (LOADING_PHASE.FETCH_END - LOADING_PHASE.START);
}

function mapRenderProgress(completed, total) {
  if (!total) {
    return LOADING_PHASE.FETCH_END;
  }
  const ratio = completed / total;
  return LOADING_PHASE.FETCH_END + ratio * (LOADING_PHASE.RENDER_END - LOADING_PHASE.FETCH_END);
}

function stopLoadingFallbackTimer() {
  if (loadingFallbackTimer) {
    clearInterval(loadingFallbackTimer);
    loadingFallbackTimer = null;
  }
}

function startLoadingFallbackTimer() {
  stopLoadingFallbackTimer();
  lastProgressAt = Date.now();
  loadingFallbackTimer = setInterval(() => {
    if (Date.now() - lastProgressAt > 2000 && loadingProgress < 90) {
      setLoadingState(Math.min(90, loadingProgress + 2));
    }
  }, 500);
}

function showLoading(message = "Preparing charts...") {
  stopLoadingFallbackTimer();
  setLoadingState(5, message);
  els.loadingOverlay.classList.remove("hidden");
  els.loadingOverlay.classList.remove("is-rendering");
  const chartGrid = document.getElementById("chart-grid");
  if (chartGrid) {
    chartGrid.classList.add("is-loading");
  }
  startLoadingFallbackTimer();
}

function hideLoading() {
  stopLoadingFallbackTimer();
  setLoadingState(100, "Ready");
  setTimeout(() => {
    els.loadingOverlay.classList.add("hidden");
    els.loadingOverlay.classList.remove("is-rendering");
    const chartGrid = document.getElementById("chart-grid");
    if (chartGrid) {
      chartGrid.classList.remove("is-loading");
    }
    setLoadingState(0, "Preparing charts...");
  }, 120);
}

function isActiveTransition(token) {
  return token === activeTransitionToken;
}

function beginViewTransition(message) {
  transitionToken += 1;
  const token = transitionToken;
  activeTransitionToken = token;
  viewTransitionInFlight = true;

  if (pendingTransitionAbort) {
    pendingTransitionAbort.abort();
  }
  pendingTransitionAbort = new AbortController();
  pendingFetch = pendingTransitionAbort;

  showLoading(message);
  setLoadingState(5, message);

  const chartGrid = document.getElementById("chart-grid");
  if (chartGrid) {
    // Keep previous charts painted (greyed by the translucent overlay) — never blank.
    chartGrid.classList.remove("is-pending-reveal");
    chartGrid.classList.add("is-transitioning");
  }
  if (els.metrics) {
    els.metrics.classList.remove("is-pending-reveal");
  }
  els.loadingOverlay.classList.remove("is-rendering");

  return { token, signal: pendingTransitionAbort.signal };
}

function enterRenderPhase() {
  // Status-only: do not hide the chart grid. Old charts stay greyed under the veil
  // until commit/swap paints the new set, which avoids the white blink.
  els.loadingOverlay.classList.add("is-rendering");
  setLoadingState(LOADING_PHASE.FETCH_END, "Rendering charts...");
}

function finishViewTransition(token) {
  if (!isActiveTransition(token)) {
    return false;
  }

  stopLoadingFallbackTimer();
  viewTransitionInFlight = false;

  // Content is already painted (old greyed, then swapped to new under the veil).
  // Clear transition flags and dismiss the bubble — never await fade while hidden.
  const chartGrid = document.getElementById("chart-grid");
  if (chartGrid) {
    chartGrid.classList.remove("is-transitioning", "is-pending-reveal");
  }
  if (els.metrics) {
    els.metrics.classList.remove("is-pending-reveal");
  }
  els.loadingOverlay.classList.remove("is-rendering");

  if (pendingTransitionAbort && pendingFetch === pendingTransitionAbort) {
    pendingFetch = null;
  }
  pendingTransitionAbort = null;

  revealLightningFigureHosts(true);
  hideLoading();
  hasShownInitialLoading = true;
  return true;
}

function cancelViewTransition(token) {
  if (!isActiveTransition(token)) {
    return;
  }

  stopLoadingFallbackTimer();
  viewTransitionInFlight = false;

  const chartGrid = document.getElementById("chart-grid");
  if (chartGrid) {
    chartGrid.classList.remove("is-transitioning", "is-pending-reveal");
  }
  if (els.metrics) {
    els.metrics.classList.remove("is-pending-reveal");
  }
  els.loadingOverlay.classList.remove("is-rendering");

  if (pendingTransitionAbort && pendingFetch === pendingTransitionAbort) {
    pendingFetch = null;
  }
  pendingTransitionAbort = null;

  revealLightningFigureHosts(true);
  hideLoading();
}

async function commitViewUpdate(payload, token) {
  const {
    section,
    figures,
    metrics = {},
    shouldResetMaximize = false,
    maximizedChartIndex,
  } = payload;

  if (!isActiveTransition(token)) {
    return false;
  }

  if (shouldResetMaximize) {
    state.maximizedChartIndex = null;
  }
  if (maximizedChartIndex !== undefined) {
    state.maximizedChartIndex = maximizedChartIndex;
  }

  state.displayedSection = section;
  applySectionLayout(section);

  const reportRender = (completed, total) => {
    if (!isActiveTransition(token)) {
      return;
    }
    setLoadingState(
      mapRenderProgress(completed, total),
      total ? `Rendering charts (${completed}/${total})...` : "Rendering charts...",
    );
  };

  await renderChartsToDom(figures, section, reportRender);

  if (!isActiveTransition(token)) {
    return false;
  }

  setLoadingState(96, "Finalizing...");
  renderMetrics(metrics, section);
  setLoadingState(99, "Ready");
  return true;
}

async function runViewTransition({
  message = "Loading charts...",
  prepare,
  load,
  shouldResetMaximize = false,
}) {
  const { token, signal } = beginViewTransition(message);

  try {
    if (prepare) {
      prepare({ signal, token });
    }

    const loadResult = await load({
      signal,
      token,
      reportFetchProgress: (completed, total, statusMessage) => {
        if (!isActiveTransition(token)) {
          return;
        }
        setLoadingState(
          mapFetchProgress(completed, total),
          statusMessage || (total ? `Fetching charts (${completed}/${total})...` : "Fetching charts..."),
        );
      },
    });

    if (!isActiveTransition(token) || signal.aborted) {
      return;
    }

    enterRenderPhase();

    const committed = await commitViewUpdate({
      section: loadResult.section ?? state.requestedSection,
      figures: loadResult.figures ?? [],
      metrics: loadResult.metrics ?? {},
      shouldResetMaximize: loadResult.shouldResetMaximize ?? shouldResetMaximize,
      maximizedChartIndex: loadResult.maximizedChartIndex,
    }, token);

    if (!committed || !isActiveTransition(token)) {
      return;
    }

    // Hold the overlay until Plotly has painted (esp. GAF seal) so the grid
    // never flashes empty after the loading bubble disappears.
    if (isLightningGafZoom() && (loadResult.section ?? state.requestedSection) === "precipitation") {
      setLoadingState(LOADING_PHASE.RENDER_END, "Rendering lightning map...");
    }
    await awaitLayoutSettle();
    await awaitLayoutSettle();
    if (!isActiveTransition(token)) {
      return;
    }

    await finishViewTransition(token);

    if (loadResult.statusMessage !== undefined) {
      setStatus(loadResult.statusMessage);
    } else if (loadResult.warning) {
      setStatus(loadResult.warning);
    } else {
      setStatus("");
    }
  } catch (err) {
    if (signal.aborted || err?.name === "AbortError" || !isActiveTransition(token)) {
      return;
    }
    console.error(err);
    if (!isBenignChartRenderError(err)) {
      if (window.location.hostname.endsWith("github.io") && !API_BASE && !state.liteMode) {
        setStatus("Failed to load charts. Set AVCLIMATE_API_BASE in config.js to your deployed backend URL.");
      } else {
        setStatus(`Error: ${err.message}`);
      }
    } else {
      setStatus("");
    }
    cancelViewTransition(token);
  }
}

function resetMaximizedChartState() {
  state.maximizedChartIndex = null;
  clearCompareModeState({ keepSyncPreference: true });
  applyMaximizedChartState();
}

function clearCompareModeState({ keepSyncPreference = true } = {}) {
  state.compareEnabled = false;
  state.compareIcao = "";
  // Restore chart titles while the compare snapshot still has the original.
  restoreCompareIcaoTitlesOnFigures();
  state.comparePrimaryLayoutSnapshot = null;
  state.lightningHeatmapCompareHourlyScaleRef = null;
  state.lightningHeatmapCompareHourlyScaleKey = null;
  state.lightningHeatmapCompareSummaryScaleRef = null;
  state.lightningHeatmapCompareSummaryScaleKey = null;
  lightningPlayback.sliderScrubbing = false;
  if (!keepSyncPreference) {
    state.syncAxes = true;
  }
  compareCache.clear();
  clearComparePanelContents();
  // Compare pins equal panel pixel widths on the primary host; leaving those
  // inline styles after Restore blows out the 4-panel grid (one card overflows).
  clearAllChartHostSizePinsSync();
}

function clearAllChartHostSizePinsSync() {
  els.charts.forEach((host) => clearHostWidthPinSync(host));
  chartUi.forEach((ui) => {
    clearHostWidthPinSync(ui?.compareHost);
  });
}

async function clearAllChartHostSizePins() {
  clearAllChartHostSizePinsSync();
  await Promise.all(
    els.charts.map((host) => clearHostWidthPin(host).catch(() => undefined)),
  );
}

function clearComparePanelContents() {
  compareDeferShellReveal = false;
  compareSettleGeneration += 1;
  if (comparePairSizeTimer) {
    clearTimeout(comparePairSizeTimer);
    comparePairSizeTimer = null;
  }
  if (comparePairRetryTimer) {
    clearTimeout(comparePairRetryTimer);
    comparePairRetryTimer = null;
  }
  windRosePlayback.compareFrameContext = null;
  chartUi.forEach((ui) => {
    if (!ui) {
      return;
    }
    ui.shell?.classList.remove("is-compare-mode", "is-compare-national-lightning");
    ui.primaryPanel?.classList.remove("is-gaf-compare-fit");
    ui.comparePanel?.classList.remove("is-gaf-compare-fit");
    ui.comparePanel?.classList.add("hidden");
    ui.primaryLabel?.classList.add("hidden");
    ui.compareLabel?.classList.add("hidden");
    if (ui.compareStatus) {
      ui.compareStatus.textContent = "";
      ui.compareStatus.classList.add("hidden");
    }
    if (ui.compareHost) {
      // Canvas overlays are host children outside Plotly's SVG — purge alone
      // leaves them behind and they show up as orphaned masks after restore.
      ui.compareHost.querySelectorAll("canvas.national-lightning-canvas").forEach((node) => {
        node.remove();
      });
      try {
        Plotly.purge(ui.compareHost);
      } catch (error) {
        // ignore purge failures
      }
      ui.compareHost.dataset.figureId = "";
      ui.compareHost.style.height = "";
      ui.compareHost.style.width = "";
      ui.compareHost.style.maxWidth = "";
      ui.compareHost.style.visibility = "";
    }
  });
}

function normalizedCompareIcao() {
  const primary = String(els.icao?.value || "").trim().toUpperCase();
  const compare = String(state.compareIcao || "").trim().toUpperCase();
  if (!compare || !primary || compare === primary) {
    return "";
  }
  return compare;
}

function isCompareDualPanelActive() {
  return Boolean(
    Number.isInteger(state.maximizedChartIndex)
    && state.compareEnabled
    && normalizedCompareIcao()
    && !isNationalLightningCompareMode()
    && !isRegionalLightningSameGafCompare(),
  );
}

function isRegionalLightningSameGafCompare() {
  if (!state.compareEnabled || state.lhZoom !== "gaf") {
    return false;
  }
  if (!Number.isInteger(state.maximizedChartIndex)) {
    return false;
  }
  const item = state.latestFigures[state.maximizedChartIndex];
  if (item?.id !== "lightning_heatmap") {
    return false;
  }
  const primary = String(els.icao?.value || "").trim().toUpperCase();
  const compare = normalizedCompareIcao();
  if (!primary || !compare) {
    return false;
  }
  const primaryView = lightningGafViewSpec(primary);
  const compareView = lightningGafViewSpec(compare);
  const primaryPack = lightningGafPackId(primaryView);
  const comparePack = lightningGafPackId(compareView);
  return Boolean(primaryPack && primaryPack === comparePack);
}

function isNationalLightningCompareMode() {
  if (!state.compareEnabled || !normalizedCompareIcao()) {
    return false;
  }
  if (!Number.isInteger(state.maximizedChartIndex)) {
    return false;
  }
  const item = state.latestFigures[state.maximizedChartIndex];
  return item?.id === "lightning_heatmap" && state.lhZoom === "region";
}

function maximizedCompareUi() {
  if (!Number.isInteger(state.maximizedChartIndex)) {
    return null;
  }
  return chartUi[state.maximizedChartIndex] || null;
}

function populateCompareIcaoSelect(select) {
  if (!select) {
    return;
  }
  const primary = String(els.icao?.value || "").trim().toUpperCase();
  const previous = String(state.compareIcao || select.value || "").trim().toUpperCase();
  const source = els.icao;
  select.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select aerodrome…";
  select.appendChild(placeholder);
  if (!source) {
    return;
  }
  Array.from(source.options || []).forEach((option) => {
    const value = String(option.value || "").trim().toUpperCase();
    if (!value || value === primary) {
      return;
    }
    const next = document.createElement("option");
    next.value = value;
    next.textContent = option.textContent || value;
    select.appendChild(next);
  });
  if (previous && previous !== primary && Array.from(select.options).some((opt) => opt.value === previous)) {
    select.value = previous;
    state.compareIcao = previous;
  } else if (state.compareIcao === primary) {
    state.compareIcao = "";
    select.value = "";
  }
}

function syncCompareToolbarUi(ui, { isMaximized = false } = {}) {
  if (!ui?.compareToolbar) {
    return;
  }
  const showToolbar = isMaximized && !isMobileViewport();
  ui.compareToolbar.classList.toggle("hidden", !showToolbar);
  if (!showToolbar) {
    return;
  }

  const compareToggle = ui.compareToolbar.querySelector(".chart-compare-toggle");
  const compareSelect = ui.compareToolbar.querySelector(".chart-compare-icao");
  const syncToggle = ui.compareToolbar.querySelector(".chart-sync-axes-toggle");
  const compareOn = Boolean(state.compareEnabled);
  const figureId = els.charts[state.maximizedChartIndex]?.dataset?.figureId
    || state.latestFigures[state.maximizedChartIndex]?.id
    || "";
  const nationalLightning = figureId === "lightning_heatmap" && state.lhZoom === "region";
  const nationalSingle = isNationalLightningCompareMode();
  const singleMapLightning = nationalSingle || isRegionalLightningSameGafCompare();

  if (compareToggle) {
    compareToggle.classList.toggle("is-active", compareOn);
    compareToggle.setAttribute("aria-pressed", compareOn ? "true" : "false");
  }
  if (compareSelect) {
    populateCompareIcaoSelect(compareSelect);
    compareSelect.disabled = !compareOn;
    compareSelect.classList.toggle("hidden", !compareOn);
  }
  if (syncToggle) {
    const showSync = compareOn && !singleMapLightning;
    syncToggle.classList.toggle("hidden", !showSync);
    syncToggle.classList.toggle("is-active", state.syncAxes);
    syncToggle.setAttribute("aria-pressed", state.syncAxes ? "true" : "false");
  }

  // While compareDeferShellReveal is set, keep the primary full-width until
  // refreshCompareMode / openWindRoseCompare paints the second panel.
  const dual = isCompareDualPanelActive() && !compareDeferShellReveal;
  ui.shell?.classList.toggle("is-compare-mode", dual);
  ui.shell?.classList.toggle("is-compare-national-lightning", singleMapLightning);
  ui.comparePanel?.classList.toggle("hidden", !dual);
  // ICAO is shown via Plotly panel titles in dual mode — keep overlay labels off.
  ui.primaryLabel?.classList.add("hidden");
  ui.compareLabel?.classList.add("hidden");
}

function applyMaximizedChartState() {
  const hasMaximizedChart = Number.isInteger(state.maximizedChartIndex);
  const visibleCardCount = state.latestFigures.length ? Math.min(state.latestFigures.length, els.charts.length) : els.charts.length;
  const chartGrid = document.getElementById("chart-grid");
  if (chartGrid) {
    chartGrid.classList.toggle("has-maximized-chart", hasMaximizedChart);
    chartGrid.style.setProperty("--expanded-chart-rows", visibleCardCount > 2 ? "2" : "1");
  }

  if (!hasMaximizedChart && state.compareEnabled) {
    clearCompareModeState({ keepSyncPreference: true });
  }

  chartUi.forEach((ui, index) => {
    const { card, maximizeButton } = ui;
    const isVisible = !card.classList.contains("hidden");
    const isMaximized = hasMaximizedChart && state.maximizedChartIndex === index && isVisible;
    const shouldHideForMaximized = hasMaximizedChart && state.maximizedChartIndex !== index && isVisible;
    card.classList.toggle("is-maximized", isMaximized);
    card.classList.toggle("is-hidden-for-maximized", shouldHideForMaximized);
    maximizeButton.dataset.chartIndex = String(index);
    maximizeButton.classList.toggle("hidden", !isVisible);
    maximizeButton.classList.toggle("is-active", isMaximized);
    maximizeButton.setAttribute("aria-pressed", isMaximized ? "true" : "false");
    maximizeButton.title = isMaximized ? "Restore chart grid" : "Expand chart";
    maximizeButton.textContent = isMaximized ? "Restore" : "Maximize";
    syncCompareToolbarUi(ui, { isMaximized });
  });
  // Shell/toolbar insets depend on maximized + wind-rose + compare; re-apply now
  // so the mode toggle does not sit flush while charts are still settling.
  applyChartShellHeights(state.displayedSection);
}

function setCompareStatus(ui, message = "") {
  if (!ui?.compareStatus) {
    return;
  }
  if (!message) {
    ui.compareStatus.textContent = "";
    ui.compareStatus.classList.add("hidden");
    return;
  }
  ui.compareStatus.textContent = message;
  ui.compareStatus.classList.remove("hidden");
}

function compareCacheKey(icao, figureId, section, season) {
  const hourToken = (figureId === "lightning_heatmap" || figureId === "wind_rose")
    && ((figureId === "lightning_heatmap" && state.lhMode === "hourly")
      || (figureId === "wind_rose" && state.wrMode === "hourly"))
    ? String(els.lhHourScroller?.value ?? els.wrHourScroller?.value ?? "12")
    : "summary";
  return [
    String(icao || "").trim().toUpperCase(),
    figureId,
    section,
    season,
    state.lhMode,
    state.lhZoom,
    state.fogModes.monthly,
    state.fogModes.hourly,
    state.fogModes.wind,
    state.fogModes.dewpoint,
    state.wrMode,
    hourToken,
  ].join("::");
}

function invalidateCompareCache() {
  compareCache.clear();
}

async function loadCompareFigureItem(icao, figureId, section, season) {
  const key = compareCacheKey(icao, figureId, section, season);
  if (compareCache.has(key)) {
    return JSON.parse(JSON.stringify(compareCache.get(key)));
  }

  const scaleSnapshot = {
    lightningHeatmapScaleRef: state.lightningHeatmapScaleRef
      ? { ...state.lightningHeatmapScaleRef }
      : null,
    lightningHeatmapHourlyScaleRef: state.lightningHeatmapHourlyScaleRef
      ? { ...state.lightningHeatmapHourlyScaleRef }
      : null,
    lightningHeatmapHourlyScaleKey: state.lightningHeatmapHourlyScaleKey,
  };

  let item = null;
  try {
    if (state.liteMode) {
      const data = { figures: [], metrics: {} };
      const assembled = await assembleLiteFigures(icao, section, season);
      data.figures = assembled?.figures || [];
      if (shouldUseHourlyWindRose(section) && figureId === "wind_rose") {
        await applyHourlyWindRoseOverride(data, icao, season);
      }
      if (figureId === "lightning_heatmap") {
        if (isLightningGafZoom() && section === "precipitation") {
          await applyGafLightningHeatmapOverride(data, icao, season, { compare: true });
        } else if (shouldUseHourlyLightningHeatmap(section)) {
          await applyHourlyLightningHeatmapOverride(data, icao, season);
        }
      }
      item = data.figures.find((entry) => entry?.id === figureId) || null;
    } else {
      const params = getParams();
      params.set("icao", icao);
      params.set("section", section);
      params.set("figureIds", figureId);
      params.set("includeMetrics", "false");
      if (figureId === "wind_rose") {
        applyWindRoseHourParams(params, [figureId]);
      }
      const response = await fetch(apiUrl(`/api/charts?${params.toString()}`));
      const payload = await response.json();
      if (payload?.error) {
        throw new Error(payload.error);
      }
      item = (payload?.figures || []).find((entry) => entry?.id === figureId) || null;
      if (item && figureId === "lightning_heatmap" && isLightningGafZoom() && section === "precipitation") {
        const wrap = { figures: [item] };
        await applyGafLightningHeatmapOverride(wrap, icao, season, { compare: true });
        item = wrap.figures[0] || item;
      }
    }
  } finally {
    state.lightningHeatmapScaleRef = scaleSnapshot.lightningHeatmapScaleRef;
    state.lightningHeatmapHourlyScaleRef = scaleSnapshot.lightningHeatmapHourlyScaleRef;
    state.lightningHeatmapHourlyScaleKey = scaleSnapshot.lightningHeatmapHourlyScaleKey;
  }

  if (item) {
    compareCache.set(key, JSON.parse(JSON.stringify(item)));
    return JSON.parse(JSON.stringify(item));
  }
  return null;
}

function figureSupportsCompareAxisSync(figureId = "") {
  if (!figureId || figureId === "scatter_wind_dewpt") {
    return false;
  }
  if (figureId === "wind_rose" || figureId === "lightning_heatmap") {
    return true;
  }
  // Polar topo roses (visibility / fog-wind / dust) sync on radial axis.
  if (isPolarTopoFigureId(figureId)) {
    return true;
  }
  return usesResponsiveYAxis(figureId)
    || frequencyFigureIds.has(figureId)
    || figureId === "hourly_precip"
    || figureId === "temp_dewpoint"
    || figureId === "fog_cloud_joint";
}

function computeSyncedYRangeFromFigures(primaryFigure, compareFigure, axisName = "y") {
  const primary = computeAxisBounds(primaryFigure, axisName);
  const compare = computeAxisBounds(compareFigure, axisName);
  if (!primary && !compare) {
    return null;
  }
  if (!primary) {
    return compare;
  }
  if (!compare) {
    return primary;
  }
  return {
    min: Math.min(primary.min, compare.min),
    max: Math.max(primary.max, compare.max),
  };
}

function applySyncedYRangesToFigure(figure, figureId, synced) {
  if (!figure || !synced) {
    return;
  }
  figure.layout = figure.layout || {};
  if (synced.y) {
    figure.layout.yaxis = {
      ...(figure.layout.yaxis || {}),
      range: [synced.y.min, synced.y.max],
      autorange: false,
      rangemode: synced.y.min >= 0 ? "tozero" : (figure.layout.yaxis?.rangemode || undefined),
    };
  }
  if (synced.y2 && (figureId === "hourly_precip" || layoutUsesOverlayingY2(figure.layout))) {
    figure.layout.yaxis2 = {
      ...(figure.layout.yaxis2 || {}),
      range: [synced.y2.min, synced.y2.max],
      autorange: false,
      rangemode: "tozero",
    };
  }
}

function extractHeatmapZScale(figure) {
  const traces = (figure?.data || []).filter((entry) => String(entry?.type || "").toLowerCase() === "heatmap");
  if (!traces.length) {
    return null;
  }
  // Prefer a visible data trace; chrome traces also carry the active scale.
  let best = null;
  traces.forEach((trace) => {
    const zmin = Number(trace.zmin);
    const zmax = Number(trace.zmax);
    if (!Number.isFinite(zmax) || zmax <= 0) {
      const fromZ = lightningGafColorRange(trace.z);
      if (fromZ && (!best || fromZ.zmax > best.zmax)) {
        best = fromZ;
      }
      return;
    }
    const scale = {
      zmin: Number.isFinite(zmin) ? zmin : 0,
      zmax,
    };
    if (!best || scale.zmax > best.zmax) {
      best = scale;
    }
  });
  return best;
}

function unionLightningZScales(...scales) {
  const valid = scales.filter((scale) => scale && Number.isFinite(Number(scale.zmax)) && Number(scale.zmax) > 0);
  if (!valid.length) {
    return null;
  }
  const zmin = Math.min(...valid.map((scale) => Number(scale.zmin) || 0));
  const zmax = Math.max(...valid.map((scale) => Number(scale.zmax) || 1));
  return { zmin, zmax: Math.max(zmax, zmin + 1) };
}

function cloneLightningZScale(scale) {
  if (!scale || !Number.isFinite(Number(scale.zmax)) || Number(scale.zmax) <= 0) {
    return null;
  }
  const zmin = Number(scale.zmin) || 0;
  return { zmin, zmax: Math.max(zmin + 1, Number(scale.zmax) || 1) };
}

function lightningNativeScaleKey(icao, season = "all", { mode = null } = {}) {
  const code = String(icao || "").trim().toUpperCase();
  const seasonKey = String(season || "all");
  const modeKey = mode || (shouldUseHourlyLightningHeatmap() ? "hourly" : "summary");
  const zoom = state.lhZoom || "local";
  let pack = "local";
  if (zoom === "gaf" || zoom === "region") {
    pack = gafLightningHourlyCropCacheKey(code, seasonKey) || zoom;
  }
  return `${code}::${seasonKey}::${modeKey}::${zoom}::${pack}`;
}

function rememberLightningNativeScale(icao, season, scale, { mode = null } = {}) {
  const cloned = cloneLightningZScale(scale);
  if (!cloned || !state.lightningNativeScales) {
    return null;
  }
  state.lightningNativeScales.set(lightningNativeScaleKey(icao, season, { mode }), cloned);
  return cloned;
}

function lookupLightningNativeScale(icao, season = seasonForCompare()) {
  if (!state.lightningNativeScales) {
    return null;
  }
  const code = String(icao || "").trim().toUpperCase();
  if (!code) {
    return null;
  }
  return state.lightningNativeScales.get(lightningNativeScaleKey(code, season)) || null;
}

function publishPrimaryHourlyScalePointer(icao, scale) {
  const primary = String(els.icao?.value || "").trim().toUpperCase();
  const code = String(icao || "").trim().toUpperCase();
  const cloned = cloneLightningZScale(scale);
  if (!cloned || !code || code !== primary) {
    return;
  }
  state.lightningHeatmapHourlyScaleRef = cloned;
  state.lightningHeatmapHourlyScaleKey = lightningNativeScaleKey(code, els.season?.value || "all", { mode: "hourly" });
}

function isPolarRoseDataTrace(trace) {
  const type = String(trace?.type || "").toLowerCase();
  if (type === "barpolar") {
    return true;
  }
  if (type !== "scatterpolar") {
    return false;
  }
  // Topo map hit/pixel overlays are unnamed marker traces whose r spans the
  // full map radius (often 60–80 kt). They must not drive rose axis scaling.
  const mode = String(trace?.mode || "").toLowerCase();
  if (mode.includes("markers") && !String(trace?.name || "").trim()) {
    return false;
  }
  const fill = String(trace?.fill || "").toLowerCase();
  if (fill === "toself" || fill === "tonext" || fill === "tonextx" || fill === "tonexty") {
    return true;
  }
  // Named line/scatter rose layers (e.g. precip visibility) still count.
  return Boolean(String(trace?.name || "").trim());
}

function polarFigureRadialMax(figure, { stackedBars = false } = {}) {
  if (stackedBars) {
    return windRoseRadialMax(figure);
  }
  // Nested scatterpolar layers (visibility / fog roses): use the largest data r.
  let max = 0;
  (figure?.data || []).forEach((trace) => {
    if (!isPolarRoseDataTrace(trace)) {
      return;
    }
    numericArray(trace?.r).forEach((value) => {
      if (Number.isFinite(value)) {
        max = Math.max(max, value);
      }
    });
  });
  return max;
}

function resolveSyncedPolarRadialRange(primaryFigure, compareFigure, figureId = "") {
  const stacked = figureId === "wind_rose";
  const primaryMax = polarFigureRadialMax(primaryFigure, { stackedBars: stacked });
  const compareMax = polarFigureRadialMax(compareFigure, { stackedBars: stacked });
  const top = Math.max(primaryMax || 0, compareMax || 0);
  if (!(top > 0)) {
    return null;
  }
  return windRoseRadialRange(top);
}

function computeSyncedAxisBundle(primaryFigure, compareFigure, figureId) {
  if (!figureSupportsCompareAxisSync(figureId) || !state.syncAxes) {
    return null;
  }
  if (figureId === "wind_rose") {
    const radial = resolveSyncedWindRoseRadialRange()
      || resolveSyncedPolarRadialRange(primaryFigure, compareFigure, figureId);
    return radial ? { radial } : null;
  }
  if (isPolarTopoFigureId(figureId)) {
    const radial = resolveSyncedPolarRadialRange(primaryFigure, compareFigure, figureId);
    return radial ? { radial } : null;
  }
  if (figureId === "lightning_heatmap") {
    const synced = resolveCompareLightningSyncedScale(primaryFigure, compareFigure);
    return synced ? { z: synced } : null;
  }

  if (figureId === "hourly_precip" && (
    layoutUsesOverlayingY2(primaryFigure?.layout) || layoutUsesOverlayingY2(compareFigure?.layout)
  )) {
    return {
      y: {
        min: 0,
        max: Math.max(
          computeDualOverlayAxisMax(primaryFigure, "y"),
          computeDualOverlayAxisMax(compareFigure, "y"),
        ),
      },
      y2: {
        min: 0,
        max: Math.max(
          computeDualOverlayAxisMax(primaryFigure, "y2"),
          computeDualOverlayAxisMax(compareFigure, "y2"),
        ),
      },
    };
  }

  const y = computeSyncedYRangeFromFigures(primaryFigure, compareFigure, "y");
  const y2 = computeSyncedYRangeFromFigures(primaryFigure, compareFigure, "y2");
  if (!y && !y2) {
    return null;
  }
  return { y, y2 };
}

function resolveCompareLightningSyncedScale() {
  const season = seasonForCompare();
  const primary = lookupLightningNativeScale(els.icao?.value, season);
  const compare = lookupLightningNativeScale(state.compareIcao, season);
  return unionLightningZScales(primary, compare);
}

function rememberLightningSummaryScale(icao, season, scale, { compare = false } = {}) {
  const cloned = rememberLightningNativeScale(icao, season, scale, { mode: "summary" });
  if (!cloned) {
    return;
  }
  const key = lightningNativeScaleKey(icao, season, { mode: "summary" });
  if (compare) {
    state.lightningHeatmapCompareSummaryScaleRef = cloned;
    state.lightningHeatmapCompareSummaryScaleKey = key;
    return;
  }
  state.lightningHeatmapPrimarySummaryScaleRef = cloned;
  state.lightningHeatmapPrimarySummaryScaleKey = key;
}

function resolveNativeLightningPanelScale({ compare = false } = {}) {
  const icao = compare ? state.compareIcao : els.icao?.value;
  return lookupLightningNativeScale(icao, seasonForCompare());
}

async function ensureCompareLightningHourlyScale(icao, season) {
  const code = String(icao || "").trim().toUpperCase();
  const seasonKey = String(season || "all");
  const cached = lookupLightningNativeScale(code, seasonKey);
  if (cached) {
    state.lightningHeatmapCompareHourlyScaleRef = cached;
    state.lightningHeatmapCompareHourlyScaleKey = lightningNativeScaleKey(code, seasonKey, { mode: "hourly" });
    return cached;
  }

  if (isLightningGafZoom()) {
    try {
      await ensureLightningGafAreasLoaded();
      await ensureLightningGafSeasonLoaded(seasonKey, { includeHours: true, icao: code });
    } catch (error) {
      return null;
    }
    const gafScale = ensureLightningGafHourlyScale(code, seasonKey);
    if (gafScale) {
      state.lightningHeatmapCompareHourlyScaleRef = gafScale;
      state.lightningHeatmapCompareHourlyScaleKey = lightningNativeScaleKey(code, seasonKey, { mode: "hourly" });
    }
    return gafScale;
  }

  const primaryIcao = String(els.icao?.value || "").trim().toUpperCase();
  const primaryMap = lightningPlayback.liteHourlyMap;
  const primaryMapIcao = String(lightningPlayback.liteHourlyIcao || "").toUpperCase();

  try {
    await ensureLightningHourlyFramesLoaded(code);
  } catch (error) {
    return lookupLightningNativeScale(code, seasonKey);
  }

  const scale = ensureLightningHourlyScale(code, seasonKey);

  // Restore primary hourly pack so the main overlay scrub stays on the primary ICAO.
  if (primaryIcao && primaryMapIcao === primaryIcao && primaryMap) {
    lightningPlayback.liteHourlyMap = primaryMap;
    lightningPlayback.liteHourlyIcao = primaryIcao;
  } else if (primaryIcao && primaryIcao !== code) {
    try {
      await ensureLightningHourlyFramesLoaded(primaryIcao);
    } catch (error) {
      // keep compare pack if primary reload fails
    }
  }

  if (scale) {
    state.lightningHeatmapCompareHourlyScaleRef = scale;
    state.lightningHeatmapCompareHourlyScaleKey = lightningNativeScaleKey(code, seasonKey, { mode: "hourly" });
  }
  return scale || null;
}

async function applyLightningZScaleToHost(host, scale, { updateOverlay = false } = {}) {
  if (!host || !scale) {
    return;
  }
  await restyleLightningHeatmapScale(host, scale).catch(() => undefined);
  if (!shouldUseHourlyLightningHeatmap()) {
    return;
  }

  const zmin = Number(scale.zmin) || 0;
  const zmax = Math.max(zmin + 1, Number(scale.zmax) || 1);

  // Regional/national hourly strikes live on a canvas. Swap the colour LUT pack
  // in place — do not restyle the boundary/airport overlay as if it were a heatmap
  // (that path can drop the compare host size pin).
  const canvasRecord = host._lightningHourCanvas;
  if (canvasRecord?.active && canvasRecord.el) {
    const icao = resolveLightningPanelIcao(host);
    const season = els.season?.value || "all";
    const hour = Number.isFinite(Number(canvasRecord.hour))
      ? Number(canvasRecord.hour)
      : Number(els.lhHourScroller?.value ?? 12);
    if (icao) {
      const pack = ensureNationalLightningHourCanvases(icao, season, zmin, zmax);
      if (pack) {
        canvasRecord.pack = pack;
        positionNationalLightningCanvas(host, canvasRecord.el, pack);
        blitNationalLightningHour(hour, host);
      }
    }
    return;
  }

  if (!updateOverlay) {
    return;
  }
  const overlay = getLightningHourOverlayForHost(host) || getLightningOverlayHost();
  if (!overlay?.data?.length) {
    return;
  }
  if (String(overlay.data[0]?.type || "").toLowerCase() !== "heatmap") {
    return;
  }
  await Plotly.restyle(overlay, {
    zmin: [zmin],
    zmax: [zmax],
    zauto: [false],
    colorscale: [LIGHTNING_HEATMAP_COLORSCALE],
  }, [0]).catch(() => undefined);
}

function applyHeatmapZScale(figure, scale) {
  if (!figure || !scale) {
    return;
  }
  (figure.data || []).forEach((trace) => {
    if (String(trace?.type || "").toLowerCase() !== "heatmap") {
      return;
    }
    trace.zmin = scale.zmin;
    trace.zmax = scale.zmax;
    trace.zauto = false;
  });
}

function applySyncedBundleToFigures(primaryFigure, compareFigure, figureId, synced) {
  if (!synced) {
    return;
  }
  if (synced.z) {
    applyHeatmapZScale(primaryFigure, synced.z);
    applyHeatmapZScale(compareFigure, synced.z);
    return;
  }
  if (synced.radial) {
    applyWindRoseRadialLayout(primaryFigure, synced.radial);
    applyWindRoseRadialLayout(compareFigure, synced.radial);
    return;
  }
  applySyncedYRangesToFigure(primaryFigure, figureId, synced);
  applySyncedYRangesToFigure(compareFigure, figureId, synced);
}

async function applySyncedAxesToComparePair() {
  const ui = maximizedCompareUi();
  if (!ui || !isCompareDualPanelActive()) {
    return;
  }
  const primaryHost = els.charts[state.maximizedChartIndex];
  const compareHost = ui.compareHost;
  const figureId = primaryHost?.dataset?.figureId || "";
  if (!figureSupportsCompareAxisSync(figureId)) {
    return;
  }

  const primaryFigure = { data: primaryHost?.data, layout: primaryHost?.layout };
  const compareFigure = { data: compareHost?.data, layout: compareHost?.layout };
  if (!primaryFigure.data?.length || !compareFigure.data?.length) {
    return;
  }

  if (figureId === "wind_rose") {
    await applyWindRoseCompareRadialSync(primaryHost, compareHost);
    return;
  }

  if (figureId === "lightning_heatmap") {
    if (!state.syncAxes) {
      const primaryScale = resolveNativeLightningPanelScale({ compare: false });
      const compareScale = resolveNativeLightningPanelScale({ compare: true });
      if (primaryScale) {
        await applyLightningZScaleToHost(primaryHost, primaryScale, { updateOverlay: true });
      }
      if (compareScale) {
        await applyLightningZScaleToHost(compareHost, compareScale, { updateOverlay: true });
      }
    } else {
      const synced = resolveCompareLightningSyncedScale(primaryFigure, compareFigure);
      if (!synced) {
        return;
      }
      await Promise.all([
        applyLightningZScaleToHost(primaryHost, synced, { updateOverlay: true }),
        applyLightningZScaleToHost(compareHost, synced, { updateOverlay: true }),
      ]);
    }
    // Do not size from inside sync — settle owner (runCompareSettle) owns
    // pair sizing so Z restyles cannot fight ResizeObserver / deferred passes.
    return;
  }

  if (!state.syncAxes) {
    if (isPolarTopoFigureId(figureId)) {
      // Restore each panel's own radial scale from its data.
      const primaryRange = windRoseRadialRange(polarFigureRadialMax(primaryFigure));
      const compareRange = windRoseRadialRange(polarFigureRadialMax(compareFigure));
      await Promise.all([
        relayoutWindRoseRadialRange(primaryHost, primaryRange),
        relayoutWindRoseRadialRange(compareHost, compareRange),
      ]);
      return;
    }
    // Restore each panel's own Y range only — never re-apply domains, margins,
    // or host pixel size (those shift the bar columns horizontally).
    await Promise.all([
      relayoutComparePanelAxisRangesOnly(primaryHost).catch(() => undefined),
      relayoutComparePanelAxisRangesOnly(compareHost).catch(() => undefined),
    ]);
    return;
  }

  const synced = computeSyncedAxisBundle(primaryFigure, compareFigure, figureId);
  if (!synced) {
    return;
  }
  if (synced.radial) {
    await Promise.all([
      relayoutWindRoseRadialRange(primaryHost, synced.radial),
      relayoutWindRoseRadialRange(compareHost, synced.radial),
    ]);
    return;
  }
  const relayout = {};
  if (synced.y) {
    relayout["yaxis.range"] = [synced.y.min, synced.y.max];
    relayout["yaxis.autorange"] = false;
  }
  if (synced.y2) {
    relayout["yaxis2.range"] = [synced.y2.min, synced.y2.max];
    relayout["yaxis2.autorange"] = false;
  }
  if (!Object.keys(relayout).length) {
    return;
  }
  await Promise.all([
    Plotly.relayout(primaryHost, relayout),
    Plotly.relayout(compareHost, relayout),
  ]).catch(() => undefined);
}

async function relayoutComparePanelAxisRangesOnly(host) {
  if (!host) {
    return;
  }
  if (host.dataset?.figureId === "hourly_precip" && layoutUsesOverlayingY2(host.layout)) {
    const relayout = pinGroupedBarYRangeBaseline(buildResponsiveRangeRelayout(host));
    if (!Object.keys(relayout).length) {
      return;
    }
    await Plotly.relayout(host, relayout);
    await syncDualAxisPairedBarOverlayPositions(host);
    return;
  }
  const relayout = pinGroupedBarYRangeBaseline(buildResponsiveRangeRelayout(host));
  if (!Object.keys(relayout).length) {
    return;
  }
  await Plotly.relayout(host, {
    ...relayout,
    "xaxis.automargin": false,
    "yaxis.automargin": false,
  });
}

const COMPARE_PANEL_MARGIN = {
  t: 36,
  r: 20,
  b: 36,
  l: 52,
  // Lite figures ship margin.r≈276 + legend.x=1/entrywidth for an in-plot
  // legend. With autoexpand left on, Safari re-grows that reservation even
  // after showlegend:false — pin autoexpand off in compare dual-panel mode.
  autoexpand: false,
};

// Lightning keeps an in-plot colorbar; dual-panel needs room for it (generic
// compare r=20 clips the bar to a red sliver).
const COMPARE_LIGHTNING_PANEL_MARGIN = {
  t: 36,
  r: 72,
  b: 28,
  l: 28,
  autoexpand: false,
};

function comparePanelMarginForFigure(figureId = "") {
  if (figureId === "lightning_heatmap") {
    return { ...COMPARE_LIGHTNING_PANEL_MARGIN };
  }
  return { ...COMPARE_PANEL_MARGIN };
}

function figureTitleForComparePanel(icao = "") {
  const code = String(icao || "").trim().toUpperCase();
  return {
    text: code,
    font: { size: 13 },
    x: 0.5,
    xanchor: "center",
    y: 0.98,
    yanchor: "top",
  };
}

function cloneLayoutTitle(title) {
  if (title == null || title === "") {
    return null;
  }
  if (typeof title === "object") {
    return JSON.parse(JSON.stringify(title));
  }
  return { text: String(title) };
}

function isCompareIcaoOnlyTitle(title) {
  const text = typeof title === "object" && title
    ? String(title.text || "").trim()
    : String(title || "").trim();
  return /^[A-Z0-9]{3,4}$/.test(text);
}

function rememberFigureDisplayTitle(figureId, title) {
  if (!figureId || title == null || title === "") {
    return;
  }
  const titleText = typeof title === "object" && title
    ? String(title.text || "").trim()
    : String(title || "").trim();
  if (!titleText) {
    return;
  }
  if (isCompareIcaoOnlyTitle(title)) {
    return;
  }
  const cloned = cloneLayoutTitle(title);
  if (cloned) {
    state.figureDisplayTitles[figureId] = cloned;
  }
}

function restoreCompareIcaoTitle(figure, figureId) {
  if (!figure?.layout || !isCompareIcaoOnlyTitle(figure.layout.title)) {
    return false;
  }
  if (isCompareDualPanelActive() && state.maximizedChartIndex != null) {
    return false;
  }
  const restored = resolvePrimaryFigureTitle(figureId, null);
  if (!restored) {
    return false;
  }
  figure.layout.title = restored;
  return true;
}

function restoreCompareIcaoTitlesOnFigures() {
  (state.latestFigures || []).forEach((item) => {
    restoreCompareIcaoTitle(item?.figure, item?.id || "");
  });
}

function resolvePrimaryFigureTitle(figureId = "", fallbackTitle = null) {
  const remembered = state.figureDisplayTitles[figureId];
  if (remembered && !isCompareIcaoOnlyTitle(remembered)) {
    return cloneLayoutTitle(remembered);
  }
  const snap = state.comparePrimaryLayoutSnapshot;
  if (snap?.figureId === figureId && snap.title && !isCompareIcaoOnlyTitle(snap.title)) {
    return cloneLayoutTitle(snap.title);
  }
  if (fallbackTitle && !isCompareIcaoOnlyTitle(fallbackTitle)) {
    return cloneLayoutTitle(fallbackTitle);
  }
  return null;
}

function captureComparePrimaryLayoutSnapshot(host) {
  if (!host || !Number.isInteger(state.maximizedChartIndex)) {
    return;
  }
  const item = state.latestFigures[state.maximizedChartIndex];
  const figureId = host.dataset?.figureId || item?.id || "";
  const layout = host.layout || item?.figure?.layout || {};
  const remembered = resolvePrimaryFigureTitle(figureId, layout.title);
  // Always snapshot the single-panel maximized chrome — never the dual-panel
  // compare margins (r≈20 / l≈52) or a poisoned lite legend reservation.
  const margin = {
    t: 36,
    r: maximizedSinglePanelMarginR(figureId),
    b: Number(item?.figure?.layout?.margin?.b) || Number(layout.margin?.b) || 36,
    l: 36,
    autoexpand: false,
  };
  state.comparePrimaryLayoutSnapshot = {
    figureId,
    title: remembered,
    margin,
    lockMargin: { ...margin },
  };
}

function applyCompareDualPanelFigureChrome(figure, icao = "", figureId = "") {
  if (!figure) {
    return;
  }
  figure.layout = figure.layout || {};
  // ICAO as centered title; strip the large right margin that lite figures keep
  // for an in-plot legend (external legend already sits beside the panels).
  figure.layout.title = figureTitleForComparePanel(icao);
  figure.layout.showlegend = false;
  // Drop in-plot legend geometry so Plotly cannot reserve space for it.
  delete figure.layout.legend;
  figure.layout.margin = comparePanelMarginForFigure(figureId);
  if (figureId === "lightning_heatmap") {
    applyCompareLightningColorbarChrome(figure);
  }
}

function applyCompareLightningColorbarChrome(figure) {
  if (!figure?.data) {
    return;
  }
  const colorbar = lightningHeatmapCompareColorbar();
  figure.data.forEach((trace) => {
    if (String(trace?.type || "").toLowerCase() !== "heatmap") {
      return;
    }
    if (trace.showscale === false) {
      return;
    }
    trace.colorbar = {
      ...(trace.colorbar || {}),
      ...colorbar,
    };
    trace.showscale = true;
  });
}

function lightningHeatmapCompareColorbar() {
  // Compact vertical bar that fits COMPARE_LIGHTNING_PANEL_MARGIN.r.
  return {
    orientation: "v",
    title: { text: "" },
    x: 1.01,
    xanchor: "left",
    len: 0.72,
    lenmode: "fraction",
    y: 0.5,
    yanchor: "middle",
    thickness: 12,
    thicknessmode: "pixels",
    xpad: 4,
    ypad: 0,
    outlinewidth: 1,
    outlinecolor: "rgb(68, 68, 68)",
  };
}

async function applyCompareLightningColorbarToHost(host) {
  if (!host?.data?.length) {
    return;
  }
  const colorbar = lightningHeatmapCompareColorbar();
  const indices = lightningHeatmapTraceIndices(host);
  if (!indices.length) {
    return;
  }
  const chromeIndex = indices.length >= 2 ? indices[indices.length - 1] : indices[0];
  const patch = {
    showscale: [true],
    "colorbar.orientation": [colorbar.orientation],
    "colorbar.title": [colorbar.title],
    "colorbar.x": [colorbar.x],
    "colorbar.xanchor": [colorbar.xanchor],
    "colorbar.y": [colorbar.y],
    "colorbar.yanchor": [colorbar.yanchor],
    "colorbar.len": [colorbar.len],
    "colorbar.lenmode": [colorbar.lenmode],
    "colorbar.thickness": [colorbar.thickness],
    "colorbar.thicknessmode": [colorbar.thicknessmode],
    "colorbar.xpad": [colorbar.xpad],
    "colorbar.ypad": [colorbar.ypad],
    "colorbar.outlinewidth": [colorbar.outlinewidth],
    "colorbar.outlinecolor": [colorbar.outlinecolor],
  };
  // Data traces in two-trace mode keep showscale false; only chrome shows the bar.
  if (indices.length >= 2) {
    await Plotly.restyle(host, { showscale: [false] }, [indices[0]]).catch(() => undefined);
  }
  await Plotly.restyle(host, patch, [chromeIndex]).catch(() => undefined);
}

async function repinCompareLightningPanelChromeAfterSeal(sealedHost) {
  if (!isCompareDualPanelActive()) {
    return;
  }
  const ui = maximizedCompareUi();
  const primaryHost = els.charts[state.maximizedChartIndex];
  const compareHost = ui?.compareHost;
  if (!primaryHost || !compareHost) {
    return;
  }
  const primaryIcao = String(els.icao?.value || "").trim().toUpperCase();
  const compareIcao = normalizedCompareIcao();
  const hosts = [
    { host: primaryHost, icao: primaryIcao },
    { host: compareHost, icao: compareIcao },
  ];
  await Promise.all(hosts.map(async ({ host, icao }) => {
    if (!host?.data?.length || !icao) {
      return;
    }
    await Plotly.relayout(host, {
      title: figureTitleForComparePanel(icao),
      ...comparePanelMarginRelayout("lightning_heatmap"),
    }).catch(() => undefined);
    await applyCompareLightningColorbarToHost(host);
  }));
  // Keep sealed host last so its domain/margin win if both were touched.
  if (sealedHost && (sealedHost === primaryHost || sealedHost === compareHost)) {
    await applyCompareLightningColorbarToHost(sealedHost);
  }
}

function comparePanelMarginRelayout(figureId = "") {
  return {
    // Prefer a full margin object — dotted keys alone are flaky on Safari when
    // autoexpand would otherwise re-inflate r from a stale legend reservation.
    margin: comparePanelMarginForFigure(figureId),
    showlegend: false,
  };
}

function setGraphResponsive(host, enabled) {
  if (host?._context) {
    host._context.responsive = Boolean(enabled);
  }
}

function windRoseCompareGeometryRelayout(host, { width, height, title, radialRange } = {}) {
  const topo = buildTopoMapPanelRelayout(host);
  const patch = {
    showlegend: false,
    margin: comparePanelMarginForFigure("wind_rose"),
    autosize: false,
  };
  if (title) {
    patch.title = title;
  }
  if (width > 40) {
    patch.width = width;
  }
  if (height > 40) {
    patch.height = height;
  }
  if (windRoseRangesDiffer(host?.layout?.polar?.radialaxis?.range, radialRange)) {
    patch["polar.radialaxis.range"] = [...radialRange];
    patch["polar.radialaxis.autorange"] = false;
    if (host?.layout?.polar) {
      host.layout.polar.radialaxis = {
        ...(host.layout.polar.radialaxis || {}),
        autorange: false,
        range: [...radialRange],
      };
    }
  }
  if (topo["polar.domain.x"]) {
    patch["polar.domain.x"] = topo["polar.domain.x"];
  }
  if (topo["polar.domain.y"]) {
    patch["polar.domain.y"] = topo["polar.domain.y"];
  }
  appendAlignedPolarImagePatch(host, patch);
  // Plotly rejects a relayout that contains both `margin` and `margin.l`.
  Object.keys(patch).forEach((key) => {
    if (key.startsWith("margin.")) {
      delete patch[key];
    }
  });
  return patch;
}

function hostIsCompareDualPanelHost(host) {
  if (!host || !isCompareDualPanelActive()) {
    return false;
  }
  const primaryHost = els.charts[state.maximizedChartIndex];
  const compareHost = maximizedCompareUi()?.compareHost;
  return host === primaryHost || host === compareHost;
}

async function restorePrimaryFigureTitleAfterCompare(host) {
  if (!host || !Number.isInteger(state.maximizedChartIndex)) {
    return;
  }
  const figureId = host.dataset?.figureId
    || state.latestFigures[state.maximizedChartIndex]?.id
    || "";
  const title = resolvePrimaryFigureTitle(
    figureId,
    state.latestFigures[state.maximizedChartIndex]?.figure?.layout?.title,
  );
  if (!title) {
    return;
  }
  await Plotly.relayout(host, { title }).catch(() => undefined);
}

function maximizedSinglePanelMarginR(figureId = "") {
  if (figureId === "hourly_precip") {
    return HOURLY_PRECIP_PANEL.margin.r;
  }
  return 32;
}

function pinFrequencyGeometryLockMargin(host, margin) {
  if (!host || !hostUsesFrequencyAxisLabelLock(host) || !margin) {
    return;
  }
  const key = stackedAxisLockKey(host);
  const lock = state.stackedAxisLabelLocks[key] || {};
  lock.margin = {
    ...(lock.margin || {}),
    t: Number(margin.t) || 36,
    r: Number(margin.r) || 32,
    b: Number(margin.b) || 36,
    l: Number(margin.l) || 36,
  };
  state.stackedAxisLabelLocks[key] = lock;
}

async function restoreWindRoseAfterCompareExit(host) {
  if (!host) {
    return;
  }
  const section = state.displayedSection;
  const item = state.latestFigures[state.maximizedChartIndex];
  const snap = state.comparePrimaryLayoutSnapshot?.figureId === "wind_rose"
    ? state.comparePrimaryLayoutSnapshot
    : null;
  const title = resolvePrimaryFigureTitle(
    "wind_rose",
    snap?.title || item?.figure?.layout?.title,
  );

  // Keep Plotly from autosizing into the full-width slot before the basemap
  // moves with it. That intermediate frame is the compare-off flicker.
  setGraphResponsive(host, false);
  applyChartShellHeights(section);
  const height = Math.round(
    Number.parseFloat(host.style.height) || host.clientHeight || 0,
  );
  const width = Math.round(
    host.parentElement?.clientWidth || host.clientWidth || 0,
  );
  if (width > 40) {
    host.style.width = `${width}px`;
    host.style.maxWidth = "100%";
  }
  if (height > 40) {
    host.style.height = `${height}px`;
  }

  const spec = getTopoMapPanelSpec("wind_rose");
  const patch = {
    showlegend: false,
    autosize: false,
    margin: { ...spec.margin },
    "polar.domain.x": spec.plotDomain.x.slice(),
    "polar.domain.y": spec.plotDomain.y.slice(),
  };
  if (width > 40) {
    patch.width = width;
  }
  if (height > 40) {
    patch.height = height;
  }
  // Maximized single rose uses the card-corner HTML title.
  if (isMaximizedSingleWindRose()) {
    patch.title = { text: "" };
  } else if (title) {
    patch.title = title;
  }
  appendAlignedPolarImagePatch(host, patch);
  Object.keys(patch).forEach((key) => {
    if (key.startsWith("margin.")) {
      delete patch[key];
    }
  });
  await Plotly.relayout(host, patch);

  host.style.width = "";
  host.style.maxWidth = "";
  host.dataset.windRoseSeenW = String(Math.round(host.offsetWidth || 0));
  host.dataset.windRoseSeenH = String(Math.round(host.offsetHeight || 0));
  setGraphResponsive(host, true);
  state.comparePrimaryLayoutSnapshot = null;
}

async function restorePrimaryHostAfterCompareExit(host) {
  if (!host) {
    return;
  }
  const figureId = host.dataset?.figureId
    || state.latestFigures[state.maximizedChartIndex]?.id
    || "";
  const section = state.displayedSection;

  // Cancel any deferred compare size / settle passes that would re-pin half widths.
  compareSettleGeneration += 1;
  compareDeferShellReveal = false;
  if (comparePairSizeTimer) {
    clearTimeout(comparePairSizeTimer);
    comparePairSizeTimer = null;
  }
  if (comparePairRetryTimer) {
    clearTimeout(comparePairRetryTimer);
    comparePairRetryTimer = null;
  }

  if (figureId === "wind_rose") {
    await restoreWindRoseAfterCompareExit(host);
    return;
  }

  const item = state.latestFigures[state.maximizedChartIndex];
  const snap = state.comparePrimaryLayoutSnapshot?.figureId === figureId
    ? state.comparePrimaryLayoutSnapshot
    : null;
  const title = resolvePrimaryFigureTitle(figureId, snap?.title || item?.figure?.layout?.title);

  // Match the single-panel maximized margins used by renderChartsToDom
  // (external legend → compact r), not the lite in-plot legend reservation.
  const margin = {
    t: 36,
    r: maximizedSinglePanelMarginR(figureId),
    b: Number(snap?.margin?.b) || Number(item?.figure?.layout?.margin?.b) || 36,
    l: 36,
    autoexpand: false,
  };
  // Keep lock in sync so scheduleHostResize / stableFrequencyAxisRelayout cannot
  // re-inflate margin.r from a compare-seeded 276px legend reservation.
  pinFrequencyGeometryLockMargin(host, snap?.lockMargin || margin);
  if (item?.figure?.layout) {
    item.figure.layout.margin = {
      ...(item.figure.layout.margin || {}),
      ...margin,
    };
    item.figure.layout.showlegend = false;
    if (title) {
      item.figure.layout.title = cloneLayoutTitle(title);
    }
    if (item.figure.layout.legend) {
      delete item.figure.layout.legend;
    }
  }
  if (host.layout?.legend) {
    delete host.layout.legend;
  }

  // One-shot full-width restore: pin geometry from the panel before enabling
  // responsive, so we do not autosize→resize→relayout flicker.
  setGraphResponsive(host, false);
  clearHostWidthPinSync(host);
  applyChartShellHeights(section);
  await awaitLayoutSettle();

  const panel = host.closest(".chart-compare-panel.is-primary")
    || host.closest(".chart-compare-panels")
    || host.closest(".chart-shell")
    || host.parentElement;
  const width = Math.round(panel?.clientWidth || host.clientWidth || 0);
  const height = Math.round(
    Number.parseFloat(host.style.height)
    || host.clientHeight
    || 0,
  );
  if (height > 40) {
    host.style.height = `${height}px`;
  }
  if (width > 40) {
    host.style.width = `${width}px`;
    host.style.maxWidth = "100%";
  }
  if (host.layout) {
    if (width > 40) {
      host.layout.width = width;
    } else {
      delete host.layout.width;
    }
    if (height > 40) {
      host.layout.height = height;
    }
    host.layout.autosize = false;
    host.layout.margin = { ...(host.layout.margin || {}), ...margin };
    if (title) {
      host.layout.title = cloneLayoutTitle(title);
    }
  }

  const restoreRelayout = {
    autosize: false,
    showlegend: false,
    margin: { ...margin },
  };
  if (width > 40) {
    restoreRelayout.width = width;
  } else {
    restoreRelayout.width = null;
    restoreRelayout.autosize = true;
  }
  if (height > 40) {
    restoreRelayout.height = height;
  }
  if (title) {
    restoreRelayout.title = title;
  }
  await Plotly.relayout(host, restoreRelayout).catch(() => undefined);
  pinFrequencyGeometryLockMargin(host, snap?.lockMargin || margin);
  invalidateCanonicalGeometry(host);

  if (figureId === "lightning_heatmap" && isLightningGafZoom()) {
    // Compare panel already torn down — seal only this host (no dual conceal).
    await rebuildAndSealGafLightningHost(host).catch(() => undefined);
    state.comparePrimaryLayoutSnapshot = null;
    return;
  }
  if (figureId === "hourly_precip") {
    setGraphResponsive(host, true);
    clearHostWidthPinSync(host);
    await finalizeHourlyPrecipMaximizedLayout(host, height > 40 ? height : null).catch(() => undefined);
    state.comparePrimaryLayoutSnapshot = null;
    return;
  }

  // Hand off to responsive fill without a second competing relayout cascade.
  setGraphResponsive(host, true);
  clearHostWidthPinSync(host);
  await Plotly.relayout(host, {
    autosize: true,
    width: null,
    height: height > 40 ? height : undefined,
    margin: { ...margin },
    showlegend: false,
    ...(title ? { title } : {}),
  }).catch(() => undefined);
  clearHostWidthPinSync(host);
  pinFrequencyGeometryLockMargin(host, snap?.lockMargin || margin);
  await scheduleHostResize(host, { mode: "resize" }).catch(() => undefined);
  clearHostWidthPinSync(host);
  pinFrequencyGeometryLockMargin(host, snap?.lockMargin || margin);
  state.comparePrimaryLayoutSnapshot = null;
}

async function prepareCompareFigureForRender(item, icao, section, chartHeight, panelSize = null) {
  const cloned = cloneFigurePayloadForRender(item);
  const figure = cloned.figure;
  figure.layout = figure.layout || {};
  figure.layout.legend = figure.layout.legend || {};
  figure.layout.showlegend = false;
  figure.layout.height = chartHeight;
  // Dual-panel first paint must use the final slot size — autosize:true then
  // a later false causes a stretch-then-shrink hitch on polar/Cartesian charts.
  const slotW = Math.round(Number(panelSize?.width) || 0);
  const slotH = Math.round(Number(panelSize?.height) || chartHeight || 0);
  if (slotW > 40) {
    figure.layout.width = slotW;
    figure.layout.height = slotH > 40 ? slotH : chartHeight;
    figure.layout.autosize = false;
  } else {
    figure.layout.autosize = false;
    delete figure.layout.width;
  }
  if (figure.layout.margin && typeof figure.layout.margin === "object") {
    figure.layout.margin = { ...figure.layout.margin, autoexpand: false };
  }

  if (item.id === "lightning_heatmap") {
    if (!isGafLightningFigure(figure)) {
      // Prefer a stable all-hours scale for the compare ICAO (and the shared
      // sync union). fixedScale:null would auto-fit the current hour only and
      // desync overlapping geography from the primary panel.
      let fixedScale = null;
      if (shouldUseHourlyLightningHeatmap(section)) {
        fixedScale = await ensureCompareLightningHourlyScale(icao, seasonForCompare());
      }
      const scale = applyLightningHeatmapStyle(figure, {
        icao,
        season: seasonForCompare(),
        fixedScale,
      });
      if (!shouldUseHourlyLightningHeatmap(section) && scale) {
        rememberLightningSummaryScale(icao, seasonForCompare(), scale, { compare: true });
      }
    } else if (!shouldUseHourlyLightningHeatmap(section)) {
      const meta = figure.layout?.meta || {};
      rememberLightningSummaryScale(icao, seasonForCompare(), {
        zmin: Number(meta.lightningZmin) || 0,
        zmax: Number(meta.lightningZmax) || 1,
      }, { compare: true });
    }
  } else if (item.id === "hourly_precip") {
    enforceHourlyPrecipDualAxisLayout(figure, chartHeight);
  } else if (item.id === "scatter_wind_dewpt") {
    ensureScatterWindDewptCiBands(figure);
    enforceScatterWindDewptLayout(figure, chartHeight);
  } else if (item.id === "wind_rose") {
    normalizeWindRoseCalmTrace(figure);
    const season = seasonForCompare();
    const primaryIcao = String(els.icao?.value || "").trim().toUpperCase();
    const primaryRange = ensureWindRoseHourlyScale(primaryIcao, season, section);
    // Prefer a cached compare all-hours lock; if not ready yet, fall back to
    // synced/primary so the first paint never auto-fits a single hour.
    const compareRange = state.windRoseCompareHourlyScaleRef;
    const lockedRange = resolveComparePanelWindRoseRadialRange(primaryRange, compareRange)
      || primaryRange;
    if (lockedRange) {
      applyWindRoseRadialLayout(figure, lockedRange);
    }
  }

  // Compact compare chrome MUST run before prepareFrequencyFigureGeometry —
  // that helper seeds stackedAxisLabelLocks by figureId (shared with primary).
  // Seeding from the raw lite margin.r≈276 poisons the primary lock and then
  // scheduleHostResize re-applies it after Compare is turned off.
  applyCompareDualPanelFigureChrome(figure, icao, item.id || "");
  // Never seed the shared frequency lock from the compare clone.
  prepareFrequencyFigureGeometry(figure, item.id || "", { seedLock: false });
  applyChartLegendVisibilityToFigure(figure, item.id);
  if (isTopoMapFigure(item.id)) {
    applyTopoMapPanelLayout(figure, item.id, { chartHeight });
    // Dual-panel lightning needs colorbar room — don't let topo defaults win.
    if (item.id === "lightning_heatmap") {
      figure.layout.margin = {
        ...(figure.layout.margin || {}),
        ...COMPARE_LIGHTNING_PANEL_MARGIN,
      };
      applyCompareLightningColorbarChrome(figure);
    }
    await prepareChartTerrainBackground(figure, icao, item.id);
  }
  return cloned;
}

function seasonForCompare() {
  return els.season?.value || "all";
}

function getPairedCompareHost(primaryHost) {
  if (!primaryHost || !isCompareDualPanelActive()) {
    return null;
  }
  const index = els.charts.indexOf(primaryHost);
  if (index < 0 || state.maximizedChartIndex !== index) {
    return null;
  }
  return chartUi[index]?.compareHost || null;
}

function measureComparePairSlotSize(ui, primaryHost) {
  const panels = ui?.panels;
  const gap = 10; // keep in sync with .chart-shell.is-compare-mode .chart-compare-panels gap
  void panels?.offsetWidth;
  const totalWidth = Math.round(panels?.clientWidth || 0);
  const height = Math.round(
    Number.parseFloat(primaryHost?.style?.height)
    || primaryHost?.clientHeight
    || ui?.primaryPanel?.clientHeight
    || 0,
  );
  if (totalWidth < 80 || height < 40) {
    return null;
  }
  // Equal slots from the panels row — avoid per-panel clientWidth, which can
  // disagree while Plotly still has a stale inline width pin on one host.
  const width = Math.floor((totalWidth - gap) / 2);
  return { width, height, totalWidth };
}

function clearHostWidthPinSync(host) {
  if (!host) {
    return;
  }
  host.style.width = "";
  host.style.maxWidth = "";
  if (host.layout) {
    host.layout.autosize = true;
    delete host.layout.width;
  }
}

async function applyCompareHostPixelSize(host, width, height) {
  if (!host || !(width > 40) || !(height > 40)) {
    return;
  }
  const figureId = host.dataset?.figureId || "";
  if (figureId === "wind_rose") {
    const currentW = Math.round(Number(host.layout?.width) || 0);
    const currentH = Math.round(Number(host.layout?.height) || 0);
    if (Math.abs(currentW - width) <= 1 && Math.abs(currentH - height) <= 1) {
      return;
    }
    host.style.width = `${width}px`;
    host.style.height = `${height}px`;
    host.style.maxWidth = "100%";
    if (host.layout) {
      host.layout.width = width;
      host.layout.height = height;
      host.layout.autosize = false;
      host.layout.margin = { ...comparePanelMarginForFigure(figureId) };
    }
    const patch = {
      width,
      height,
      autosize: false,
      ...comparePanelMarginRelayout(figureId),
    };
    appendAlignedPolarImagePatch(host, patch);
    await Plotly.relayout(host, patch).catch(() => undefined);
    return;
  }
  if (figureId === "lightning_heatmap" && isGafLightningFigure({ layout: host.layout })) {
    const bbox = host.layout?.meta?.gafBbox;
    const fitted = fitGafLightningCompareHostSize(
      width,
      height,
      bbox,
      COMPARE_LIGHTNING_PANEL_MARGIN,
    );
    await applyGafLightningHostBoxLayout(host, fitted.width, fitted.height, { comparePanel: true });
    const panel = host.closest(".chart-compare-panel");
    panel?.classList.add("is-gaf-compare-fit");
    return;
  }
  const panel = host.closest(".chart-compare-panel");
  panel?.classList.remove("is-gaf-compare-fit");
  const panelMargin = comparePanelMarginForFigure(figureId);
  if (host.layout) {
    host.layout.width = width;
    host.layout.height = height;
    host.layout.autosize = false;
    host.layout.margin = { ...panelMargin };
    host.layout.showlegend = false;
    if (host.layout.legend) {
      delete host.layout.legend;
    }
  }
  // Keep DOM pin and Plotly layout in lockstep (CSS 100% fights a mismatched pin).
  host.style.width = `${width}px`;
  host.style.height = `${height}px`;
  host.style.maxWidth = "100%";
  const patch = {
    width,
    height,
    autosize: false,
    ...comparePanelMarginRelayout(figureId),
  };
  // Polar topo (visibility rose, cloud distribution, dust rose) was aligned to
  // the full-width card. Re-fit the domain and square basemap to this slot,
  // or the primary plot stays small inside the compare panel.
  if (isPolarTopoFigureId(figureId) && host.layout?.polar) {
    const domain = getTopoMapPanelSpec().plotDomain;
    patch["polar.domain.x"] = domain.x.slice();
    patch["polar.domain.y"] = domain.y.slice();
    host.layout.polar.domain = {
      x: patch["polar.domain.x"],
      y: patch["polar.domain.y"],
    };
    appendAlignedPolarImagePatch(host, patch);
  }
  await Plotly.relayout(host, patch).catch(() => undefined);
}

let comparePairSizeTimer = null;
let comparePairRetryTimer = null;

function isCompareSettleBlocked() {
  return compareSettleLock > 0
    || windRoseCompareLayoutLock > 0
    || compareDeferShellReveal
    || lightningPlayback.sliderScrubbing
    || lightningPlayback.frameUpdating;
}

function scheduleComparePairSizePass(delayMs = 0) {
  // Hour scrub must stay z-only — a mid-drag size pass reseals panels and flickers.
  // During settle / wind-rose lock / deferred shell reveal, RO must not start a
  // competing size engine (it used to cancel the intended post-layout pass).
  if (isCompareSettleBlocked()) {
    return;
  }
  if (comparePairSizeTimer) {
    clearTimeout(comparePairSizeTimer);
    comparePairSizeTimer = null;
  }
  comparePairSizeTimer = setTimeout(() => {
    comparePairSizeTimer = null;
    if (isCompareSettleBlocked()) {
      return;
    }
    if (isCompareDualPanelActive()) {
      sizeComparePairFromPanels();
    }
  }, delayMs);
}

async function sizeComparePairFromPanels() {
  if (!isCompareDualPanelActive() || compareDeferShellReveal) {
    return null;
  }
  if (windRoseCompareLayoutLock > 0) {
    const lockedHost = els.charts[state.maximizedChartIndex];
    if (lockedHost?.dataset?.figureId === "wind_rose") {
      return null;
    }
  }
  const ui = maximizedCompareUi();
  const primaryHost = els.charts[state.maximizedChartIndex];
  const compareHost = ui?.compareHost;
  if (!primaryHost || !compareHost) {
    return null;
  }

  await awaitLayoutSettle();
  const slot = measureComparePairSlotSize(ui, primaryHost);
  if (!slot) {
    return null;
  }

  await Promise.all([
    applyCompareHostPixelSize(primaryHost, slot.width, slot.height),
    applyCompareHostPixelSize(compareHost, slot.width, slot.height),
  ]);
  // Local hourly strikes and rings live on a overlay pinned to the previous
  // full-width plot. Rebuild it once the primary has the compare slot size.
  await syncPrimaryLocalLightningHourlyOverlay(primaryHost);
  // Regional/national hourly uses a canvas (+ boundary overlay) sized to the
  // pre-compare host. Re-pin both panels after the slot resize or strikes and
  // GAF boundaries float/stretch across the dual maps.
  if (
    primaryHost.dataset?.figureId === "lightning_heatmap"
    && shouldUseHourlyLightningHeatmap()
    && (isLightningGafZoom() || isGafLightningFigure({ layout: primaryHost.layout }))
  ) {
    await awaitLayoutSettle();
    await Promise.all([
      syncGafLightningHourlyScrubLayers(primaryHost),
      syncGafLightningHourlyScrubLayers(compareHost),
    ]);
  }
  return slot;
}

/**
 * Single settle owner for dual-panel compare: size once, sync ranges/Z without
 * re-sizing, then one post-layout retry if the flex slot drifted.
 */
async function runCompareSettle({ sync = true, retryMs = 120 } = {}) {
  if (!isCompareDualPanelActive() || compareDeferShellReveal) {
    return null;
  }
  if (windRoseCompareLayoutLock > 0) {
    const lockedHost = els.charts[state.maximizedChartIndex];
    if (lockedHost?.dataset?.figureId === "wind_rose") {
      return null;
    }
  }
  const gen = ++compareSettleGeneration;
  compareSettleLock += 1;
  try {
    const slot = await sizeComparePairFromPanels();
    if (gen !== compareSettleGeneration || !isCompareDualPanelActive()) {
      return null;
    }
    if (sync) {
      await applySyncedAxesToComparePair();
      if (gen !== compareSettleGeneration) {
        return null;
      }
    }
    await awaitLayoutSettle();
    if (gen !== compareSettleGeneration || !isCompareDualPanelActive()) {
      return slot;
    }
    const ui = maximizedCompareUi();
    const primaryHost = els.charts[state.maximizedChartIndex];
    const next = measureComparePairSlotSize(ui, primaryHost);
    if (
      slot
      && next
      && (Math.abs(slot.width - next.width) > 2 || Math.abs(slot.height - next.height) > 2)
    ) {
      await sizeComparePairFromPanels();
      return next;
    }
    if (retryMs > 0) {
      if (comparePairRetryTimer) {
        clearTimeout(comparePairRetryTimer);
      }
      comparePairRetryTimer = setTimeout(() => {
        comparePairRetryTimer = null;
        if (gen !== compareSettleGeneration || isCompareSettleBlocked()) {
          return;
        }
        if (!isCompareDualPanelActive()) {
          return;
        }
        const uiLater = maximizedCompareUi();
        const hostLater = els.charts[state.maximizedChartIndex];
        const late = measureComparePairSlotSize(uiLater, hostLater);
        if (
          slot
          && late
          && (Math.abs(slot.width - late.width) > 2 || Math.abs(slot.height - late.height) > 2)
        ) {
          sizeComparePairFromPanels();
        }
      }, retryMs);
    }
    return slot;
  } finally {
    compareSettleLock = Math.max(0, compareSettleLock - 1);
  }
}

async function forceHostFillContainer(host) {
  if (!host) {
    return;
  }
  if (isCompareDualPanelActive()) {
    const primaryHost = els.charts[state.maximizedChartIndex];
    const compareHost = maximizedCompareUi()?.compareHost;
    if (host === primaryHost || host === compareHost) {
      await sizeComparePairFromPanels();
      return;
    }
  }
  // Single-panel fill: never route through applyCompareHostPixelSize — that
  // pins compare margins and half-widths which then stick after Compare off.
  clearHostWidthPinSync(host);
  try {
    await Plotly.relayout(host, { autosize: true, width: null });
  } catch (error) {
    // ignore
  }
  clearHostWidthPinSync(host);
  await awaitLayoutSettle();
  await Plotly.Plots.resize(host).catch(() => undefined);
  clearHostWidthPinSync(host);
}

async function relayoutComparePairToFill() {
  if (!isCompareDualPanelActive()) {
    return;
  }
  await runCompareSettle({ sync: Boolean(state.syncAxes) });
}

async function clearHostWidthPin(host) {
  if (!host) {
    return;
  }
  clearHostWidthPinSync(host);
  try {
    await Plotly.relayout(host, { autosize: true, width: null });
  } catch (error) {
    // ignore
  }
  clearHostWidthPinSync(host);
  await Plotly.Plots.resize(host).catch(() => undefined);
  clearHostWidthPinSync(host);
}

function compareTraceIndicesForLegendItem(compareHost, primaryHost, affectedPrimaryIndices) {
  const names = new Set(
    affectedPrimaryIndices
      .map((index) => String(primaryHost?.data?.[index]?.name || "").trim())
      .filter(Boolean),
  );
  const indices = [];
  (compareHost?.data || []).forEach((trace, index) => {
    const name = String(trace?.name || "").trim();
    if (name && names.has(name)) {
      indices.push(index);
    }
  });
  return indices;
}

async function applyCompareLegendToggle(primaryHost, compareHost, figureId, affectedIndices, nextVisibility) {
  if (!primaryHost || !compareHost) {
    return;
  }
  const compareIndices = compareTraceIndicesForLegendItem(compareHost, primaryHost, affectedIndices);
  const projectedBounds = hostUsesCanonicalGroupedBarGeometry(primaryHost)
    ? computeGroupedBarBoundsAfterLegendToggle(primaryHost, affectedIndices, nextVisibility)
    : null;
  const layoutPatch = projectedBounds
    ? buildGroupedBarLegendToggleLayoutPatch(primaryHost, projectedBounds)
    : null;

  const primaryUpdate = layoutPatch
    ? Plotly.update(primaryHost, { visible: nextVisibility }, layoutPatch, affectedIndices)
    : Plotly.restyle(primaryHost, { visible: affectedIndices.map(() => nextVisibility) }, affectedIndices);

  const compareUpdate = compareIndices.length
    ? (layoutPatch
      ? Plotly.update(compareHost, { visible: nextVisibility }, layoutPatch, compareIndices)
      : Plotly.restyle(compareHost, { visible: compareIndices.map(() => nextVisibility) }, compareIndices))
    : Promise.resolve();

  await Promise.all([primaryUpdate, compareUpdate]);

  // Keep error-bar overlays in sync without a geometry recalibration (avoids flicker).
  if (state.showErrorBars) {
    await Promise.all([
      rebuildStackErrorBarOverlays(primaryHost),
      rebuildStackErrorBarOverlays(compareHost),
      rebuildStrictValueErrorBarOverlays(primaryHost),
      rebuildStrictValueErrorBarOverlays(compareHost),
    ]);
    await Promise.all([
      finishStrictValueErrorBarOverlays(primaryHost),
      finishStrictValueErrorBarOverlays(compareHost),
    ]);
  }

  if (figureId === "cloud_distribution") {
    await Promise.all([
      syncFogWindHoverTemplate(primaryHost),
      syncFogWindHoverTemplate(compareHost),
    ]);
  }

  if (figureId === "wind_rose") {
    // Mask and trace order only. A resize here is what jumps the compare rose
    // after Calm is turned on.
    await Promise.all([
      ensureWindRoseCalmLayerOrder(primaryHost),
      ensureWindRoseCalmLayerOrder(compareHost),
    ]);
    deferWindRoseCalmDomHover(primaryHost);
    deferWindRoseCalmDomHover(compareHost);
  }

  if (state.syncAxes && layoutPatch) {
    const rangeRelayout = {};
    if (layoutPatch["yaxis.range"]) {
      rangeRelayout["yaxis.range"] = layoutPatch["yaxis.range"];
      rangeRelayout["yaxis.autorange"] = false;
    }
    if (layoutPatch["yaxis2.range"]) {
      rangeRelayout["yaxis2.range"] = layoutPatch["yaxis2.range"];
      rangeRelayout["yaxis2.autorange"] = false;
    }
    if (Object.keys(rangeRelayout).length) {
      await Promise.all([
        Plotly.relayout(primaryHost, rangeRelayout).catch(() => undefined),
        Plotly.relayout(compareHost, rangeRelayout).catch(() => undefined),
      ]);
    }
  }
}

async function mirrorLegendVisibilityToCompareHost(primaryHost, compareHost, figureId = "") {
  if (!primaryHost?.data?.length || !compareHost?.data?.length) {
    return;
  }
  const visibilityByName = {};
  primaryHost.data.forEach((trace) => {
    const name = String(trace?.name || "").trim();
    // Internal traces (PCA markers, rings, chrome) are not legend items. Hourly
    // GAF hides airports on the primary base because they live on the overlay;
    // mirroring that hide would blank PCA markers on the compare panel.
    if (!name || name.startsWith("__")) {
      return;
    }
    visibilityByName[name] = trace.visible ?? true;
  });

  const indices = [];
  const values = [];
  compareHost.data.forEach((trace, index) => {
    const name = String(trace?.name || "").trim();
    if (!name || !Object.hasOwn(visibilityByName, name)) {
      return;
    }
    indices.push(index);
    values.push(visibilityByName[name]);
  });
  if (!indices.length) {
    return;
  }

  await Plotly.restyle(compareHost, { visible: values }, indices);
  if (state.showErrorBars) {
    await rebuildStackErrorBarOverlays(compareHost);
    await rebuildStrictValueErrorBarOverlays(compareHost);
    await finishStrictValueErrorBarOverlays(compareHost);
  }
}

async function renderCompareFigureOnHost(ui, item, icao, section, panelSize = null) {
  const host = ui.compareHost;
  if (!host || !item?.figure) {
    return;
  }
  const chartHeight = panelSize?.height
    || Number.parseFloat(els.charts[state.maximizedChartIndex]?.style.height)
    || getChartHeight(section);
  const chartWidth = panelSize?.width || 0;
  host.style.height = `${chartHeight}px`;
  if (item.id === "wind_rose" && chartWidth > 40) {
    host.style.width = `${chartWidth}px`;
    host.style.maxWidth = "100%";
  } else {
    host.style.width = "";
    host.style.maxWidth = "";
  }
  host.dataset.figureId = item.id;

  if (item.id === "wind_rose") {
    // Build the all-hours lock for the compare ICAO before first paint so the
    // panel never auto-fits a single hour, and Sync can share both scales.
    await ensureCompareWindRoseHourlyScale(icao, seasonForCompare(), section);
    if (state.liteMode) {
      const primaryIcao = String(els.icao?.value || "").trim().toUpperCase();
      if (
        primaryIcao
        && (
          !windRosePlayback.liteHourlyMap
          || String(windRosePlayback.liteHourlyIcao || "").toUpperCase() !== primaryIcao
        )
      ) {
        try {
          windRosePlayback.liteHourlyMap = await fetchJsonCached(liteWindRoseHourlyUrl(primaryIcao));
          windRosePlayback.liteHourlyIcao = primaryIcao;
        } catch (error) {
          // keep going
        }
      }
      ensureWindRoseHourlyScale(primaryIcao, seasonForCompare(), section);
    }
  }

  const prepared = await prepareCompareFigureForRender(item, icao, section, chartHeight, panelSize);
  const figure = prepared.figure;
  if (chartWidth > 40) {
    figure.layout.width = chartWidth;
    figure.layout.height = chartHeight;
    figure.layout.autosize = false;
  }
  // Compact compare margins before first paint (avoids post-react margin hitch).
  figure.layout.margin = {
    ...(figure.layout.margin || {}),
    ...comparePanelMarginForFigure(item.id),
    autoexpand: false,
  };
  const primaryHost = els.charts[state.maximizedChartIndex];
  const primaryFigure = {
    data: primaryHost?.data ? JSON.parse(JSON.stringify(primaryHost.data)) : [],
    layout: primaryHost?.layout ? JSON.parse(JSON.stringify(primaryHost.layout)) : {},
  };

  if (state.syncAxes && figureSupportsCompareAxisSync(item.id)) {
    if (item.id === "lightning_heatmap") {
      // Ensure compare all-hours scale is ready before unioning.
      if (shouldUseHourlyLightningHeatmap(section)) {
        await ensureCompareLightningHourlyScale(icao, seasonForCompare());
      }
      const synced = resolveCompareLightningSyncedScale(primaryFigure, figure);
      if (synced) {
        applyHeatmapZScale(figure, synced);
        // Bake into primary layout/data before paint; avoid a visible Z jump
        // after the compare panel appears (settle may still re-assert).
        if (primaryHost?.data?.length) {
          await applyLightningZScaleToHost(primaryHost, synced, { updateOverlay: true });
        }
      }
    } else {
      const synced = computeSyncedAxisBundle(primaryFigure, figure, item.id);
      applySyncedBundleToFigures(primaryFigure, figure, item.id, synced);
      // Bake synced radial/Y into the primary figure object so the first dual
      // paint matches; avoid a post-paint petal/axis jump when possible.
      if (synced?.radial && primaryHost?.layout?.polar) {
        if (!primaryHost.layout.polar.radialaxis) {
          primaryHost.layout.polar.radialaxis = {};
        }
        primaryHost.layout.polar.radialaxis.range = synced.radial.slice();
        figure.layout.polar = figure.layout.polar || {};
        figure.layout.polar.radialaxis = {
          ...(figure.layout.polar.radialaxis || {}),
          range: synced.radial.slice(),
        };
        await relayoutWindRoseRadialRange(primaryHost, synced.radial);
      } else if (synced && (synced.y || synced.y2) && primaryHost) {
        const relayout = {};
        if (synced.y) {
          relayout["yaxis.range"] = [synced.y.min, synced.y.max];
          relayout["yaxis.autorange"] = false;
        }
        if (synced.y2) {
          relayout["yaxis2.range"] = [synced.y2.min, synced.y2.max];
          relayout["yaxis2.autorange"] = false;
        }
        if (Object.keys(relayout).length) {
          await Plotly.relayout(primaryHost, relayout).catch(() => undefined);
        }
      }
    }
  }

  if (item.id === "wind_rose") {
    // Final compare margins and image alignment before the first paint, so a
    // follow-up relayout cannot slide the basemap. Same polar domain as the
    // single maximized rose (production geometry).
    figure.layout.margin = { ...comparePanelMarginForFigure("wind_rose") };
    if (figure.layout.polar) {
      const panel = getTopoMapPanelSpec();
      figure.layout.polar.domain = {
        x: panel.plotDomain.x.slice(),
        y: panel.plotDomain.y.slice(),
      };
    }
    alignPolarBackgroundImages(figure);
    pinWindRoseLayoutSize(host, figure.layout);
  }

  if (chartWidth > 40) {
    host.style.width = `${chartWidth}px`;
    host.style.maxWidth = "100%";
    host.style.height = `${chartHeight}px`;
  }
  await Plotly.react(host, figure.data || [], figure.layout || {}, {
    displayModeBar: false,
    // Dual-panel hosts must never autosize after first paint — responsive
    // react drops topo for a frame and shifts the compare panel.
    responsive: false,
  });

  if (item.id === "lightning_heatmap") {
    if (isGafLightningFigure(figure)) {
      // Rings/airports are baked at build time; re-ensure against the compare ICAO
      // so a later primary-keyed reconcile cannot leave the right panel empty.
      await ensureLightningRingTracesOnHost(host);
      await ensureGafAirportTracesOnHost(host, icao);
      if (shouldUseHourlyLightningHeatmap(section)) {
        const hour = Number(els.lhHourScroller?.value ?? 12);
        const cropped = lookupGafLightningHourlyCrop(hour, icao, seasonForCompare());
        if (cropped && gafHourlyCropUsesCanvas(cropped)) {
          await enterGafLightningScrubOverlay(host, hour, { icao });
        }
      }
    } else {
      await clearLightningRingShapesOnHost(host);
      await ensureLightningRingTracesOnHost(host);
    }
  }
  if (isTopoMapFigure(item.id) && !isGafLightningFigure(figure) && item.id !== "wind_rose") {
    await relayoutTopoMapPanel(host);
  }
  if (item.id === "wind_rose") {
    await ensureWindRoseCalmLayerOrder(host);
    deferWindRoseCalmDomHover(host);
    windRosePlayback.compareFrameContext = shouldUseHourlyWindRose(section)
      ? windRoseCompareFramePinContext(host)
      : null;
    // Final pin after paint — Sync axes is on by default for wind roses.
    await applyWindRoseCompareRadialSync(primaryHost, host);
  }
}

async function updateCompareLightningHourFrame(hour) {
  if (!isCompareDualPanelActive()) {
    return false;
  }
  const ui = maximizedCompareUi();
  const compareHost = ui?.compareHost;
  if (!compareHost || compareHost.dataset?.figureId !== "lightning_heatmap") {
    return false;
  }
  const compareIcao = normalizedCompareIcao();
  const season = seasonForCompare();
  if (!compareIcao) {
    return false;
  }

  if (isLightningGafZoom() || isGafLightningFigure({ layout: compareHost.layout })) {
    try {
      await ensureLightningGafSeasonLoaded(season, {
        includeHours: true,
        icao: compareIcao,
        silent: true,
      });
    } catch (error) {
      return false;
    }
    const cropped = lookupGafLightningHourlyCrop(hour, compareIcao, season);
    if (!cropped?.z) {
      return false;
    }
    if (gafHourlyCropUsesCanvas(cropped)) {
      if (!compareHost._lightningHourCanvas?.active) {
        await enterGafLightningScrubOverlay(compareHost, hour, { icao: compareIcao });
      } else {
        await restyleGafLightningHour(compareHost, hour);
      }
      return true;
    }
    const heatIndex = (compareHost.data || []).findIndex(
      (entry) => String(entry?.type || "").toLowerCase() === "heatmap",
    );
    if (heatIndex < 0) {
      return false;
    }
    await Plotly.restyle(compareHost, { z: [cropped.z] }, [heatIndex]);
    // Hourly Z locks are fixed for the season — do not re-sync mid-scrub (layout noise).
    if (state.syncAxes && !lightningPlayback.sliderScrubbing) {
      await applySyncedAxesToComparePair();
    }
    return true;
  }

  try {
    await ensureLightningHourlyFramesLoaded(compareIcao);
  } catch (error) {
    return false;
  }
  // Local hourly packs are per-ICAO; ensureLightningHourlyFramesLoaded stores the
  // last-loaded pack on lightningPlayback.liteHourlyMap. Load compare, read grid,
  // then reload primary so scrubbing the main overlay stays correct.
  const compareMap = lightningPlayback.liteHourlyMap;
  const zGrid = lookupLiteLightningHourlyGrid(compareMap, season, hour);
  const primaryIcao = String(els.icao?.value || "").trim().toUpperCase();
  if (String(lightningPlayback.liteHourlyIcao || "").toUpperCase() !== primaryIcao) {
    try {
      await ensureLightningHourlyFramesLoaded(primaryIcao);
    } catch (error) {
      // keep going with whatever map we have
    }
  }
  if (!zGrid) {
    return false;
  }
  const meta = compareHost.layout?.meta || {};
  const z = Array.isArray(zGrid?.[0]) ? zGrid : buildLightningHeatmapZFromGrid(zGrid, meta);
  const heatIndex = (compareHost.data || []).findIndex(
    (entry) => String(entry?.type || "").toLowerCase() === "heatmap",
  );
  if (heatIndex < 0) {
    return false;
  }
  await Plotly.restyle(compareHost, { z: [z] }, [heatIndex]);
  if (state.syncAxes && !lightningPlayback.sliderScrubbing) {
    await applySyncedAxesToComparePair();
  }
  return true;
}

async function refreshNationalLightningCompareOverlays() {
  const host = els.charts[state.maximizedChartIndex];
  if (!host || host.dataset?.figureId !== "lightning_heatmap" || !isLightningGafZoom()) {
    return;
  }
  // Rebuild so airport markers and rings follow the compare ICAO.
  // Same-GAF regional compare stays on this one map; national does too.
  await rebuildAndSealGafLightningHost(host);
}

async function openWindRoseCompare({ ui, primaryHost, compareIcao, section, season, token }) {
  // Load while the primary rose is still full width. Revealing the second
  // panel first lets Plotly autosize the basemap, then a second relayout
  // slides it back.
  const item = await loadCompareFigureItem(compareIcao, "wind_rose", section, season);
  if (token !== compareRenderToken) {
    return;
  }
  if (!item?.figure) {
    compareDeferShellReveal = false;
    setCompareStatus(ui, `No data for ${compareIcao}`);
    ui.shell?.classList.add("is-compare-mode");
    ui.comparePanel?.classList.remove("hidden");
    try {
      Plotly.purge(ui.compareHost);
    } catch (error) {
      // ignore
    }
    return;
  }

  const primaryIcao = String(els.icao?.value || "").trim().toUpperCase();
  if (state.liteMode && primaryIcao) {
    if (
      !windRosePlayback.liteHourlyMap
      || String(windRosePlayback.liteHourlyIcao || "").toUpperCase() !== primaryIcao
    ) {
      try {
        windRosePlayback.liteHourlyMap = await fetchJsonCached(liteWindRoseHourlyUrl(primaryIcao));
        windRosePlayback.liteHourlyIcao = primaryIcao;
      } catch (error) {
        // keep the scale already on screen
      }
    }
  }
  if (token !== compareRenderToken) {
    return;
  }
  const primaryRange = ensureWindRoseHourlyScale(primaryIcao, season, section);
  const compareRange = await ensureCompareWindRoseHourlyScale(compareIcao, season, section);
  const lockedRange = state.syncAxes
    ? resolveSyncedWindRoseRadialRange(primaryRange, compareRange)
    : null;

  setGraphResponsive(primaryHost, false);
  const pinnedWidth = Math.round(primaryHost?.offsetWidth || primaryHost?.clientWidth || 0);
  const pinnedHeight = Math.round(
    Number.parseFloat(primaryHost?.style?.height) || primaryHost?.offsetHeight || 0,
  );
  if (pinnedWidth > 40) {
    primaryHost.style.width = `${pinnedWidth}px`;
  }
  if (pinnedHeight > 40) {
    primaryHost.style.height = `${pinnedHeight}px`;
  }

  setCompareStatus(ui, "");
  // Reveal dual shell only after data is ready (atomic with first pin).
  compareDeferShellReveal = false;
  ui.shell?.classList.add("is-compare-mode");
  ui.comparePanel?.classList.remove("hidden");
  applyChartShellHeights(section);
  const slot = measureComparePairSlotSize(ui, primaryHost);
  captureComparePrimaryLayoutSnapshot(primaryHost);
  invalidateCanonicalGeometry(primaryHost);

  const width = slot?.width || 0;
  const height = slot?.height || pinnedHeight;
  if (width > 40) {
    primaryHost.style.width = `${width}px`;
    primaryHost.style.maxWidth = "100%";
  }
  if (height > 40) {
    primaryHost.style.height = `${height}px`;
  }
  const patch = windRoseCompareGeometryRelayout(primaryHost, {
    width,
    height,
    title: figureTitleForComparePanel(primaryIcao),
    radialRange: lockedRange,
  });
  await Plotly.relayout(primaryHost, patch);
  if (token !== compareRenderToken) {
    return;
  }
  await renderCompareFigureOnHost(ui, item, compareIcao, section, slot);
  await mirrorLegendVisibilityToCompareHost(primaryHost, ui.compareHost, "wind_rose");
}

async function refreshCompareMode() {
  const token = ++compareRenderToken;
  const ui = maximizedCompareUi();

  // First open: keep primary full-width until the compare figure is ready.
  // ICAO swaps that are already dual stay dual (no layout collapse).
  const alreadyDual = Boolean(ui?.shell?.classList.contains("is-compare-mode"));
  if (
    state.compareEnabled
    && normalizedCompareIcao()
    && !alreadyDual
    && !isNationalLightningCompareMode()
    && !isRegionalLightningSameGafCompare()
  ) {
    compareDeferShellReveal = true;
  }

  applyMaximizedChartState();

  if (!ui || !Number.isInteger(state.maximizedChartIndex)) {
    compareDeferShellReveal = false;
    return;
  }

  const primaryHost = els.charts[state.maximizedChartIndex];
  const figureId = primaryHost?.dataset?.figureId
    || state.latestFigures[state.maximizedChartIndex]?.id
    || "";
  const section = state.displayedSection;
  const season = seasonForCompare();
  const compareIcao = normalizedCompareIcao();

  if (!state.compareEnabled) {
    compareDeferShellReveal = false;
    const needsRestore = ui.shell?.classList.contains("is-compare-mode")
      || Boolean(state.comparePrimaryLayoutSnapshot);
    clearComparePanelContents();
    applyMaximizedChartState();
    // Turning Compare off before a second aerodrome was shown must not redraw
    // the primary rose. Restore is only for leaving an actual dual panel.
    if (needsRestore) {
      await restorePrimaryHostAfterCompareExit(primaryHost);
    } else if (figureId === "lightning_heatmap" && state.lhZoom === "gaf") {
      await refreshNationalLightningCompareOverlays();
    }
    return;
  }

  if (!compareIcao) {
    compareDeferShellReveal = false;
    const needsRestore = ui.shell?.classList.contains("is-compare-mode")
      || Boolean(state.comparePrimaryLayoutSnapshot);
    setCompareStatus(ui, "Select a comparison aerodrome");
    ui.shell?.classList.remove("is-compare-mode");
    ui.comparePanel?.classList.add("hidden");
    // Leaving dual-panel (cleared ICAO) must restore full primary width.
    // Opening Compare with no aerodrome yet is not that case.
    if (needsRestore) {
      await restorePrimaryHostAfterCompareExit(primaryHost);
    }
    if (!needsRestore && figureId === "lightning_heatmap" && (state.lhZoom === "region" || state.lhZoom === "gaf")) {
      await refreshNationalLightningCompareOverlays();
    }
    return;
  }

  if (figureId === "lightning_heatmap" && state.lhZoom === "gaf") {
    await ensureLightningGafAreasLoaded().catch(() => undefined);
    if (token !== compareRenderToken) {
      return;
    }
    // Pack ids are unknown until areas load, so the first toolbar pass can
    // still treat a same-GAF pair as a dual panel.
    applyMaximizedChartState();
  }

  if (isNationalLightningCompareMode() || isRegionalLightningSameGafCompare()) {
    compareDeferShellReveal = false;
    setCompareStatus(ui, "");
    ui.shell?.classList.remove("is-compare-mode");
    ui.comparePanel?.classList.add("hidden");
    await restorePrimaryFigureTitleAfterCompare(primaryHost);
    state.comparePrimaryLayoutSnapshot = null;
    await refreshNationalLightningCompareOverlays();
    return;
  }

  // Compare already showing a wind rose: swap the other aerodrome's map and
  // petals without clearing widths. Clearing pins is what slides the basemap.
  // Hold the lock across that swap and the first paint so a resize observer
  // cannot run a second size pass in between.
  const holdWindRoseLayout = figureId === "wind_rose";
  if (holdWindRoseLayout) {
    windRoseCompareLayoutLock += 1;
  }
  try {
  if (
    figureId === "wind_rose"
    && windRoseHostCanSwapBasemap(ui.compareHost)
    && ui.shell?.classList.contains("is-compare-mode")
  ) {
    compareDeferShellReveal = false;
    if (windRoseCompareTitleIcao(ui.compareHost) === compareIcao) {
      if (state.syncAxes) {
        await applyWindRoseCompareRadialSync(primaryHost, ui.compareHost);
      }
      return;
    }
    const swapped = await swapCompareWindRoseToIcao(compareIcao, section);
    if (swapped) {
      return;
    }
  }

  if (figureId === "wind_rose") {
    await openWindRoseCompare({
      ui,
      primaryHost,
      compareIcao,
      section,
      season,
      token,
    });
    return;
  }

  // Load while primary stays full-width (compareDeferShellReveal), then reveal
  // dual shell in the same turn as the first equal-slot paint.
  setCompareStatus(ui, "Loading comparison…");
  applyChartShellHeights(section);

  try {
    const item = await loadCompareFigureItem(compareIcao, figureId, section, season);
    if (token !== compareRenderToken) {
      return;
    }
    if (!item?.figure) {
      compareDeferShellReveal = false;
      setCompareStatus(ui, `No data for ${compareIcao}`);
      try {
        Plotly.purge(ui.compareHost);
      } catch (error) {
        // ignore
      }
      return;
    }
    setCompareStatus(ui, "");
    const primaryIcao = String(els.icao?.value || "").trim().toUpperCase();

    // Snapshot before dual shell / margin writes poison the restore source.
    captureComparePrimaryLayoutSnapshot(primaryHost);
    invalidateCanonicalGeometry(primaryHost);

    // Atomic reveal: dual shell + sync CSS/layout pins in the same turn so the
    // first painted frame is already half-width (no layout.width vs offsetWidth flash).
    compareDeferShellReveal = false;
    ui.shell?.classList.add("is-compare-mode");
    ui.comparePanel?.classList.remove("hidden");
    applyChartShellHeights(section);
    void ui.panels?.offsetWidth;
    const slot = measureComparePairSlotSize(ui, primaryHost);
    if (slot) {
      primaryHost.style.width = `${slot.width}px`;
      primaryHost.style.height = `${slot.height}px`;
      primaryHost.style.maxWidth = "100%";
      if (primaryHost.layout) {
        primaryHost.layout.width = slot.width;
        primaryHost.layout.height = slot.height;
        primaryHost.layout.autosize = false;
      }
      if (ui.compareHost) {
        ui.compareHost.style.width = `${slot.width}px`;
        ui.compareHost.style.height = `${slot.height}px`;
        ui.compareHost.style.maxWidth = "100%";
      }
    }
    await awaitLayoutSettle();

    if (
      figureId === "lightning_heatmap"
      && state.lhZoom === "gaf"
      && regionalLightningPrimaryOverlayIsStale(primaryHost)
    ) {
      await replaceRegionalLightningAirportAndRingTraces(primaryHost);
      if (token !== compareRenderToken) {
        return;
      }
    }

    const primaryRelayout = {
      title: figureTitleForComparePanel(primaryIcao),
      ...comparePanelMarginRelayout(figureId),
    };
    if (slot) {
      primaryRelayout.width = slot.width;
      primaryRelayout.height = slot.height;
      primaryRelayout.autosize = false;
    }
    await Plotly.relayout(primaryHost, primaryRelayout).catch(() => undefined);
    if (
      figureId === "lightning_heatmap"
      && shouldUseHourlyLightningHeatmap(section)
      && !isLightningGafZoom()
      && !isGafLightningFigure({ layout: primaryHost.layout })
    ) {
      await syncPrimaryLocalLightningHourlyOverlay(primaryHost);
    }
    if (figureId === "lightning_heatmap" && shouldUseHourlyLightningHeatmap(section)) {
      await ensureCompareLightningHourlyScale(compareIcao, season);
    }
    await renderCompareFigureOnHost(ui, item, compareIcao, section, slot);
    await mirrorLegendVisibilityToCompareHost(primaryHost, ui.compareHost, figureId);
    if (figureId === "lightning_heatmap") {
      await applyCompareLightningColorbarToHost(primaryHost);
      await applyCompareLightningColorbarToHost(ui.compareHost);
    }
    // One settle owner: size → sync (no size-from-sync) → one post-layout retry.
    await runCompareSettle({ sync: Boolean(state.syncAxes), retryMs: 120 });
  } catch (error) {
    if (token !== compareRenderToken) {
      return;
    }
    compareDeferShellReveal = false;
    console.warn("Compare chart failed:", error);
    setCompareStatus(ui, error?.message || "Comparison failed");
  }
  } finally {
    if (holdWindRoseLayout) {
      windRoseCompareLayoutLock -= 1;
    }
  }
}

function renderCategories() {
  const buttonRow = els.categoryButtons || (() => {
    const row = document.createElement("div");
    row.className = "category-buttons";
    row.id = "category-buttons";
    els.categoryRow.prepend(row);
    els.categoryButtons = row;
    return row;
  })();
  buttonRow.innerHTML = "";
  sections.forEach((section) => {
    const btn = document.createElement("button");
    btn.className = `category-btn ${section.key === state.requestedSection ? "active" : ""}`;
    btn.textContent = section.label;
    btn.addEventListener("click", () => {
      if (state.requestedSection === section.key) {
        return;
      }
      requestSectionChange(section.key);
    });
    buttonRow.appendChild(btn);
  });
  syncMobileSectionSelect();
}

const MOBILE_VIEWPORT_MQ = "(max-width: 768px)";

function isMobileViewport() {
  return Boolean(window.matchMedia?.(MOBILE_VIEWPORT_MQ)?.matches);
}

function sectionFigureOrder(section = state.displayedSection || state.requestedSection) {
  return infoSectionOverview[section]?.figureOrder || [];
}

function requestSectionChange(sectionKey) {
  if (!sectionKey || state.requestedSection === sectionKey) {
    return;
  }
  state.requestedSection = sectionKey;
  state.mobileChartId = sectionFigureOrder(sectionKey)[0] || null;
  if (isMobileViewport() && Number.isInteger(state.maximizedChartIndex)) {
    state.maximizedChartIndex = null;
  }
  clearCompareModeState({ keepSyncPreference: true });
  renderCategories();
  syncMobileChartSelect(sectionKey);
  clearChartAxisLocks();
  fetchCharts();
}

function syncMobileSectionSelect() {
  const select = els.mobileSectionSelect;
  if (!select) {
    return;
  }
  if (!select.options.length) {
    sections.forEach((section) => {
      const option = document.createElement("option");
      option.value = section.key;
      option.textContent = section.label;
      select.appendChild(option);
    });
  }
  select.value = state.requestedSection;
}

function syncMobileChartSelect(section = state.displayedSection || state.requestedSection) {
  const select = els.mobileChartSelect;
  if (!select) {
    return;
  }
  const order = sectionFigureOrder(section);
  const renderedIds = (state.latestFigures || []).map((item) => item.id).filter(Boolean);
  let next = state.mobileChartId;
  if (!order.includes(next)) {
    next = order[0] || null;
  }
  if (renderedIds.length && next && !renderedIds.includes(next)) {
    next = renderedIds.find((id) => order.includes(id)) || renderedIds[0] || null;
  }
  state.mobileChartId = next;
  select.innerHTML = "";
  order.forEach((figureId) => {
    const option = document.createElement("option");
    option.value = figureId;
    option.textContent = figureDisplayLabel(figureId);
    select.appendChild(option);
  });
  if (next) {
    select.value = next;
  }
}

function applyMobileChartVisibility() {
  const mobile = isMobileViewport();
  const chartGrid = document.getElementById("chart-grid");
  if (chartGrid) {
    chartGrid.classList.toggle("has-mobile-single-chart", mobile);
  }

  chartUi.forEach(({ card }, index) => {
    if (!mobile) {
      card.classList.remove("is-hidden-for-mobile-chart", "is-mobile-chart-active");
      return;
    }
    const host = els.charts[index];
    const figureId = host?.dataset?.figureId || state.latestFigures[index]?.id || "";
    const slotUnused = index >= (state.latestFigures?.length || 0) || card.classList.contains("hidden");
    const active = !slotUnused && figureId && figureId === state.mobileChartId;
    card.classList.toggle("is-hidden-for-mobile-chart", !active);
    card.classList.toggle("is-mobile-chart-active", active);
  });
  syncControlsPlacementForViewport();
  syncLegendPlacementForViewport();
}

// On desktop, controls live in main before status. On mobile, park them in the
// header strip below the section/chart dropdowns.
function syncControlsPlacementForViewport() {
  const controls = els.controls;
  const page = els.page;
  const strip = els.mobileControlStrip;
  const status = els.status;
  if (!controls || !page) {
    return;
  }
  if (isMobileViewport()) {
    if (strip && controls.parentElement !== strip) {
      strip.appendChild(controls);
    }
    return;
  }
  if (controls.parentElement !== page) {
    if (status && status.parentElement === page) {
      page.insertBefore(controls, status);
    } else {
      page.insertBefore(controls, page.firstChild);
    }
  }
}

// On mobile, park the legend between the plot and chart toggles so it can be
// centered in that band. On desktop, keep it beside the plot inside the shell.
function syncLegendPlacementForViewport() {
  const mobile = isMobileViewport();
  chartUi.forEach(({ card, shell, legend }) => {
    if (!card || !shell || !legend) {
      return;
    }
    if (mobile) {
      if (legend.parentElement !== card || legend.previousElementSibling !== shell) {
        shell.after(legend);
      }
      return;
    }
    if (legend.parentElement !== shell) {
      // Keep maximize (if present) after the legend inside the shell.
      const maximize = shell.querySelector(".chart-maximize-btn");
      if (maximize) {
        shell.insertBefore(legend, maximize);
      } else {
        shell.appendChild(legend);
      }
    }
  });
}

function resizeVisibleMobileChart() {
  if (!isMobileViewport() || !state.mobileChartId) {
    return;
  }
  const index = state.latestFigures.findIndex((item) => item.id === state.mobileChartId);
  if (index < 0) {
    return;
  }
  const host = els.charts[index];
  if (!host) {
    return;
  }
  applyChartShellHeights(state.displayedSection);
  return fitMobileChartAroundLegend(host).then(() => {
    if (isWindRoseChartHost(host)) {
      scheduleWindRoseResize(host);
      return;
    }
    if (host.dataset?.figureId === "lightning_heatmap"
      && (isLightningGafZoom() || isGafLightningFigure({ layout: host.layout }))) {
      scheduleGafLightningSeal(host);
      return;
    }
    if (host.dataset?.figureId === "lightning_heatmap"
      && shouldUseHourlyLightningHeatmap()
      && !isLightningGafZoom()
      && !isGafLightningFigure({ layout: host.layout })) {
      return scheduleHostResize(host, { recalibrateFrame: true })
        .then(() => relayoutTopoMapPanel(host))
        .then(() => awaitLayoutSettle())
        .then(() => enterLightningHourlyOverlayCurrent(host));
    }
    scheduleHostResize(host, { recalibrateFrame: true });
  });
}

function attachMobileChromeListeners() {
  if (attachMobileChromeListeners.initialized) {
    return;
  }
  attachMobileChromeListeners.initialized = true;

  if (els.mobileSectionSelect) {
    els.mobileSectionSelect.addEventListener("change", () => {
      requestSectionChange(els.mobileSectionSelect.value);
    });
  }
  if (els.mobileChartSelect) {
    els.mobileChartSelect.addEventListener("change", () => {
      state.mobileChartId = els.mobileChartSelect.value || null;
      applyMobileChartVisibility();
      resizeVisibleMobileChart();
    });
  }

  if (typeof window.matchMedia === "function") {
    const media = window.matchMedia(MOBILE_VIEWPORT_MQ);
    const onChange = () => {
      syncControlsPlacementForViewport();
      syncLegendPlacementForViewport();
      if (!isMobileViewport()) {
        // Leaving mobile: clear single-chart hide classes and restore grid sizing.
        applyMobileChartVisibility();
        applyMaximizedChartState();
        applyChartShellHeights(state.displayedSection);
        return;
      }
      // Entering mobile: drop desktop maximize so one chart fills cleanly.
      if (Number.isInteger(state.maximizedChartIndex)) {
        state.maximizedChartIndex = null;
        applyMaximizedChartState();
      }
      syncMobileChartSelect();
      applyMobileChartVisibility();
      applyChartShellHeights(state.displayedSection);
      resizeVisibleMobileChart();
    };
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
    } else if (typeof media.addListener === "function") {
      media.addListener(onChange);
    }
  }
}

function renderDayTypeToggle(toolbar, modeKey) {
  if (!toolbar) {
    return;
  }

  toolbar.innerHTML = "";
  toolbar.classList.remove("hidden");

  const group = document.createElement("div");
  group.className = "segmented-toggle";

  [
    { value: "all", label: "All days" },
    { value: "rain", label: "Rain days" },
    { value: "non_rain", label: "Non-rain days" },
  ].forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `segmented-toggle-btn ${state.fogModes[modeKey] === option.value ? "active" : ""}`;
    button.textContent = option.label;
    button.addEventListener("click", () => {
      if (state.fogModes[modeKey] === option.value) {
        return;
      }
      state.fogModes[modeKey] = option.value;
      if (state.liteMode) {
        refreshLiteModeFigures(modeKey);
      } else {
        fetchCharts();
      }
    });
    group.appendChild(button);
  });

  toolbar.appendChild(group);
}

function updateChartToolbars(section = state.displayedSection) {
  Object.values(els.chartToolbars).forEach((toolbar) => {
    toolbar.innerHTML = "";
    toolbar.classList.add("hidden");
  });

  if (!state.latestFigures.length) {
    updateLightningZoomToggle();
    return;
  }

  if (section === "fog_low_cloud") {
    fogPanels.forEach((panel) => {
      renderDayTypeToggle(els.chartToolbars[panel.key], panel.key);
    });
    // Still tear down precipitation-only controls (e.g. Local/Regional/National).
    renderLightningHeatmapToolbar(section);
    pinVisibleChartModeToolbars(section);
    return;
  }

  if (section === "overview") {
    renderDayTypeToggle(els.overviewFogModeToolbar, "monthly");
  }

  renderWindRoseToolbar(section);
  renderLightningHeatmapToolbar(section);
  pinVisibleChartModeToolbars(section);
}

function pinVisibleChartModeToolbars(_section = state.displayedSection) {
  chartUi.forEach((ui, index) => {
    const toolbar = ui?.card?.querySelector(".chart-card-toolbar:not(.hidden)");
    if (!toolbar) {
      return;
    }
    const isMaximized = state.maximizedChartIndex === index;
    syncMaximizedShellAndToolbarInsets(ui.card, {
      isMaximized,
      pinModeToolbar: true,
    });
  });
}

function formatWindRoseHourLabel(hourValue) {
  return `${String(hourValue ?? "0").padStart(2, "0")}Z`;
}

const WIND_ROSE_PLAY_INTERVAL_MS = 300;

const windRosePlayback = {
  timer: null,
  playing: false,
  suppressSliderFetch: false,
  renderInFlight: false,
  liteHourlyMap: null,
  liteHourlyIcao: null,
  apiCacheKey: null,
  apiHourlyFigures: null,
  // Context of the wind-rose figure currently drawn on the host. When it
  // matches the live host (same icao/season/section/size), hourly scrubbing
  // updates only the petal data and never rebuilds the layout, so the rings,
  // grid and terrain background stay perfectly still (no flicker/movement).
  frameContext: null,
  compareFrameContext: null,
};

function updateWindRosePlayButton() {
  if (!els.wrHourPlayBtn) {
    return;
  }
  els.wrHourPlayBtn.classList.toggle("is-playing", windRosePlayback.playing);
  els.wrHourPlayBtn.setAttribute(
    "aria-label",
    windRosePlayback.playing ? "Pause hourly wind rose animation" : "Play hourly wind rose animation",
  );
  els.wrHourPlayBtn.title = windRosePlayback.playing ? "Pause hourly animation" : "Play hourly animation";
}

function stopWindRosePlayback() {
  if (windRosePlayback.timer) {
    clearInterval(windRosePlayback.timer);
    windRosePlayback.timer = null;
  }
  windRosePlayback.playing = false;
  windRosePlayback.renderInFlight = false;
  updateWindRosePlayButton();
}

function setWindRoseHourDisplay(hourValue) {
  const hour = String(hourValue ?? "0");
  windRosePlayback.suppressSliderFetch = true;
  if (els.wrHourScroller) {
    els.wrHourScroller.value = hour;
  }
  if (els.wrHourValue) {
    els.wrHourValue.textContent = formatWindRoseHourLabel(hour);
  }
  windRosePlayback.suppressSliderFetch = false;
}

function getWindRoseChartHost() {
  const windRoseIndex = state.latestFigures.findIndex((item) => item.id === "wind_rose");
  if (windRoseIndex < 0) {
    return null;
  }
  return els.charts[windRoseIndex] || null;
}

function windRosePlaybackCacheKey() {
  const params = getParams();
  params.delete("hourStart");
  params.delete("hourEnd");
  return params.toString();
}

function liteWindRoseHourlyUrl(icao) {
  return `data-lite/${icao}/wind_rose_hourly.json.gz`;
}

function liteWindRoseHourlyIsCached(icao) {
  const url = liteWindRoseHourlyUrl(icao);
  return liteCache.has(url) || liteCache.has(liteJsonGzUrl(url));
}

async function ensureWindRoseHourlyFramesLoaded() {
  const section = state.displayedSection;
  if (!shouldUseHourlyWindRose(section)) {
    throw new Error("Hourly wind rose mode is not active");
  }

  if (state.liteMode) {
    const icao = String(els.icao.value || "").trim().toUpperCase();
    const url = liteWindRoseHourlyUrl(icao);
    const needsNetwork = !liteWindRoseHourlyIsCached(icao);
    if (needsNetwork) {
      showLoading("Preparing animation...");
    }
    try {
      windRosePlayback.liteHourlyMap = await fetchJsonCached(url);
      windRosePlayback.liteHourlyIcao = icao;
    } finally {
      if (needsNetwork) {
        hideLoading();
      }
    }
    return;
  }

  const cacheKey = windRosePlaybackCacheKey();
  if (windRosePlayback.apiCacheKey === cacheKey && windRosePlayback.apiHourlyFigures?.size) {
    return;
  }

  showLoading("Preparing animation...");
  try {
    const figures = new Map();
    const requests = Array.from({ length: 24 }, async (_, hour) => {
      const params = getParams();
      params.set("figureIds", "wind_rose");
      params.set("hourStart", String(hour));
      params.set("hourEnd", String(hour));
      params.set("invertHour", "false");
      params.set("includeMetrics", "false");
      const response = await fetch(apiUrl(`/api/charts?${params.toString()}`));
      if (!response.ok) {
        throw new Error(`Failed to load hour ${hour} wind rose`);
      }
      const data = await response.json();
      const windRoseFigure = data?.figures?.find((item) => item.id === "wind_rose");
      if (windRoseFigure) {
        figures.set(hour, JSON.parse(JSON.stringify(windRoseFigure)));
      }
    });
    await Promise.all(requests);
    windRosePlayback.apiCacheKey = cacheKey;
    windRosePlayback.apiHourlyFigures = figures;

    if (!state.windRoseLayoutRef[section]) {
      await fetchWindRoseDailySnapshot(section);
    }
  } finally {
    hideLoading();
  }
}

function resolveWindRoseHourFigure(hour, icao, season, hourlyMap = null) {
  if (state.liteMode) {
    const map = hourlyMap || windRosePlayback.liteHourlyMap;
    const hResult = lookupLiteWindRoseHourlyPayload(map, season, hour);
    return hResult?.figures?.find((figure) => figure.id === "wind_rose") || null;
  }
  return windRosePlayback.apiHourlyFigures?.get(Number(hour)) || null;
}

// Compute a single radial-axis range that fits every hour (0-23) plus the
// summary rose, so the polar grid never rescales while scrubbing/toggling.
function computeWindRoseHourlyScaleFromMap(hourlyMap, section, season) {
  let globalMax = 0;
  for (let hour = 0; hour < 24; hour += 1) {
    const sourceFigure = resolveWindRoseHourFigure(String(hour), "", season, hourlyMap);
    if (sourceFigure?.figure) {
      globalMax = Math.max(globalMax, windRoseRadialMax(sourceFigure.figure));
    }
  }
  const summaryMax = Number(state.windRoseLayoutRef[section]?.radialMax);
  if (Number.isFinite(summaryMax)) {
    globalMax = Math.max(globalMax, summaryMax);
  }
  if (!(globalMax > 0)) {
    return null;
  }
  return windRoseRadialRange(globalMax);
}

function computeWindRoseHourlyScale(section, season) {
  return computeWindRoseHourlyScaleFromMap(windRosePlayback.liteHourlyMap, section, season);
}

function ensureWindRoseHourlyScale(icao, season, section) {
  const key = [
    String(icao || "").trim().toUpperCase(),
    String(season || "all"),
    String(section || ""),
  ].join("::");
  if (state.windRoseHourlyScaleKey !== key || !state.windRoseHourlyScaleRef) {
    const range = computeWindRoseHourlyScale(section, season);
    if (range) {
      state.windRoseHourlyScaleRef = [...range];
      state.windRoseHourlyScaleKey = key;
    }
  }
  return state.windRoseHourlyScaleRef;
}

async function ensureCompareWindRoseHourlyScale(compareIcao, season, section) {
  const icao = String(compareIcao || "").trim().toUpperCase();
  if (!icao) {
    return null;
  }
  const key = [icao, String(season || "all"), String(section || "")].join("::");
  if (state.windRoseCompareHourlyScaleKey === key && state.windRoseCompareHourlyScaleRef) {
    return state.windRoseCompareHourlyScaleRef;
  }

  let range = null;
  if (state.liteMode) {
    try {
      const map = await fetchJsonCached(liteWindRoseHourlyUrl(icao));
      range = computeWindRoseHourlyScaleFromMap(map, section, season);
    } catch (error) {
      console.warn("Failed to build compare wind rose hourly scale:", error);
    }
  }
  if (!range) {
    // API / fallback: lock to whatever is currently drawn so scrubbing cannot
    // auto-expand, even if we cannot scan all 24 hours yet.
    const ui = maximizedCompareUi();
    const host = ui?.compareHost;
    const liveMax = windRoseRadialMax({ data: host?.data });
    if (liveMax > 0) {
      range = windRoseRadialRange(liveMax);
    }
  }
  if (range) {
    state.windRoseCompareHourlyScaleRef = [...range];
    state.windRoseCompareHourlyScaleKey = key;
  }
  return state.windRoseCompareHourlyScaleRef;
}

function mergeWindRoseRadialRanges(rangeA, rangeB) {
  const topA = Array.isArray(rangeA) ? Number(rangeA[1]) : 0;
  const topB = Array.isArray(rangeB) ? Number(rangeB[1]) : 0;
  const top = Math.max(topA, topB);
  if (!(top > 0)) {
    return rangeA || rangeB || null;
  }
  return [0, top];
}

function resolveSyncedWindRoseRadialRange(
  primaryRange = state.windRoseHourlyScaleRef,
  compareRange = state.windRoseCompareHourlyScaleRef,
) {
  if (state.syncAxes) {
    return mergeWindRoseRadialRanges(primaryRange, compareRange)
      || (primaryRange ? [...primaryRange] : null)
      || (compareRange ? [...compareRange] : null);
  }
  return null;
}

function resolveComparePanelWindRoseRadialRange(primaryRange, compareRange) {
  if (state.syncAxes) {
    return resolveSyncedWindRoseRadialRange(primaryRange, compareRange);
  }
  return compareRange ? [...compareRange] : (primaryRange ? [...primaryRange] : null);
}

async function relayoutWindRoseRadialRange(host, radialRange) {
  if (!host || !Array.isArray(radialRange) || radialRange.length !== 2) {
    return;
  }
  if (!windRoseRangesDiffer(host.layout?.polar?.radialaxis?.range, radialRange)) {
    return;
  }
  if (host.layout?.polar) {
    host.layout.polar.radialaxis = {
      ...(host.layout.polar.radialaxis || {}),
      autorange: false,
      range: [...radialRange],
    };
  }
  await Plotly.relayout(host, {
    "polar.radialaxis.range": [...radialRange],
    "polar.radialaxis.autorange": false,
  }).catch(() => undefined);
}

async function applyWindRoseCompareRadialSync(primaryHost, compareHost) {
  const section = state.displayedSection;
  const season = seasonForCompare();
  const primaryIcao = String(els.icao?.value || "").trim().toUpperCase();
  const compareIcao = normalizedCompareIcao();

  if (state.liteMode && primaryIcao) {
    if (
      !windRosePlayback.liteHourlyMap
      || String(windRosePlayback.liteHourlyIcao || "").toUpperCase() !== primaryIcao
    ) {
      try {
        windRosePlayback.liteHourlyMap = await fetchJsonCached(liteWindRoseHourlyUrl(primaryIcao));
        windRosePlayback.liteHourlyIcao = primaryIcao;
      } catch (error) {
        // keep going with whatever scale we already have
      }
    }
  }

  const primaryRange = ensureWindRoseHourlyScale(primaryIcao, season, section);
  const compareRange = await ensureCompareWindRoseHourlyScale(compareIcao, season, section);

  if (state.syncAxes) {
    const shared = resolveSyncedWindRoseRadialRange(primaryRange, compareRange);
    await Promise.all([
      relayoutWindRoseRadialRange(primaryHost, shared),
      relayoutWindRoseRadialRange(compareHost, shared),
    ]);
    return;
  }

  await Promise.all([
    relayoutWindRoseRadialRange(primaryHost, primaryRange),
    relayoutWindRoseRadialRange(compareHost, compareRange || primaryRange),
  ]);
}

function resetWindRoseHourlyScale() {
  state.windRoseHourlyScaleRef = null;
  state.windRoseHourlyScaleKey = null;
  state.windRoseCompareHourlyScaleRef = null;
  state.windRoseCompareHourlyScaleKey = null;
  windRosePlayback.frameContext = null;
  windRosePlayback.compareFrameContext = null;
}

function windRoseFramePinContext(host) {
  const index = state.latestFigures.findIndex((item) => item.id === "wind_rose");
  const isMaximized = Number.isInteger(state.maximizedChartIndex) && state.maximizedChartIndex === index;
  return {
    icao: String(els.icao?.value || "").trim().toUpperCase(),
    season: String(els.season?.value || "all"),
    section: String(state.displayedSection || ""),
    width: Math.round(host?.offsetWidth || host?.clientWidth || 0),
    height: Math.round(host?.offsetHeight || host?.clientHeight || 0),
    maximized: isMaximized,
  };
}

function windRoseFrameMatchesContext(host) {
  const ctx = windRosePlayback.frameContext;
  if (!ctx || !host?.data?.length) {
    return false;
  }
  const live = windRoseFramePinContext(host);
  return ctx.icao === live.icao
    && ctx.season === live.season
    && ctx.section === live.section
    && ctx.width === live.width
    && ctx.height === live.height
    && ctx.maximized === live.maximized;
}

function windRoseCompareFramePinContext(host) {
  return {
    icao: normalizedCompareIcao(),
    season: seasonForCompare(),
    section: String(state.displayedSection || ""),
    width: Math.round(host?.offsetWidth || host?.clientWidth || 0),
    height: Math.round(host?.offsetHeight || host?.clientHeight || 0),
  };
}

function windRoseCompareFrameMatchesContext(host) {
  const ctx = windRosePlayback.compareFrameContext;
  if (!ctx || !host?.data?.length) {
    return false;
  }
  const live = windRoseCompareFramePinContext(host);
  return ctx.icao === live.icao
    && ctx.season === live.season
    && ctx.section === live.section
    && ctx.width === live.width
    && ctx.height === live.height;
}

async function fetchCompareWindRoseHourFigure(hour, compareIcao, season) {
  if (state.liteMode) {
    const map = await fetchJsonCached(liteWindRoseHourlyUrl(compareIcao));
    return resolveWindRoseHourFigure(hour, compareIcao, season, map);
  }

  const params = getParams();
  params.set("icao", compareIcao);
  params.set("figureIds", "wind_rose");
  params.set("hourStart", String(hour));
  params.set("hourEnd", String(hour));
  params.set("invertHour", "false");
  params.set("includeMetrics", "false");
  const response = await fetch(apiUrl(`/api/charts?${params.toString()}`));
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return (data?.figures || []).find((item) => item.id === "wind_rose") || null;
}

const compareWindRoseSummaryCache = new Map();

function pinWindRoseLayoutSize(host, layout) {
  if (!layout) {
    return layout;
  }
  const width = Math.round(host?.offsetWidth || host?.clientWidth || 0);
  const height = Math.round(
    Number.parseFloat(host?.style?.height) || host?.offsetHeight || Number(layout.height) || 0,
  );
  if (width > 40) {
    layout.width = width;
  }
  if (height > 40) {
    layout.height = height;
  }
  layout.autosize = false;
  return layout;
}

function windRoseRangesDiffer(current, next) {
  if (!Array.isArray(next) || next.length < 2) {
    return false;
  }
  if (!Array.isArray(current) || current.length < 2) {
    return true;
  }
  return Math.abs(Number(current[0]) - Number(next[0])) > 0.01
    || Math.abs(Number(current[1]) - Number(next[1])) > 0.01;
}

async function restyleWindRosePetals(host, srcData, { includeVisible = false } = {}) {
  if (!host?.data?.length || !Array.isArray(srcData) || !srcData.length || !host.layout?.polar) {
    return false;
  }
  const byName = new Map();
  srcData.forEach((trace) => {
    const name = String(trace?.name || "").trim();
    if (name) {
      byName.set(name, trace);
    }
  });
  const indices = [];
  const rArrays = [];
  const thetaArrays = [];
  const visible = [];
  host.data.forEach((trace, index) => {
    const name = String(trace?.name || "").trim();
    const src = byName.get(name);
    if (!src) {
      return;
    }
    indices.push(index);
    rArrays.push(src.r);
    thetaArrays.push(src.theta);
    visible.push(src.visible ?? true);
  });
  if (!indices.length || indices.length !== host.data.length) {
    return false;
  }
  const patch = { r: rArrays, theta: thetaArrays };
  if (includeVisible) {
    patch.visible = visible;
  }
  await Plotly.restyle(host, patch, indices);
  return true;
}

async function loadCompareWindRoseSummaryItem(icao, section, season) {
  const code = String(icao || "").trim().toUpperCase();
  if (!code) {
    return null;
  }
  const key = `${code}::${section}::${season}`;
  if (compareWindRoseSummaryCache.has(key)) {
    return JSON.parse(JSON.stringify(compareWindRoseSummaryCache.get(key)));
  }

  let item = null;
  if (state.liteMode) {
    const payload = await fetchLiteSectionPayload(code, section, season);
    item = (payload?.figures || []).find((entry) => entry.id === "wind_rose") || null;
  } else {
    const params = getParams();
    params.set("icao", code);
    params.set("section", section);
    params.set("season", season);
    params.set("figureIds", "wind_rose");
    params.set("hourStart", "0");
    params.set("hourEnd", "23");
    params.set("invertHour", "false");
    params.set("includeMetrics", "false");
    const response = await fetch(apiUrl(`/api/charts?${params.toString()}`));
    if (response.ok) {
      const data = await response.json();
      item = (data?.figures || []).find((entry) => entry.id === "wind_rose") || null;
    }
  }

  if (!item?.figure) {
    return null;
  }
  const stored = JSON.parse(JSON.stringify(item));
  compareWindRoseSummaryCache.set(key, stored);
  return JSON.parse(JSON.stringify(stored));
}

function prepareWindRoseFigureForInPlaceSwap(figure) {
  resetDefaultLegendTraceVisibility(figure, "wind_rose");
  applyStrictValueHoverTemplatesToFigure(figure, "wind_rose");
  applyChartLegendVisibilityToFigure(figure, "wind_rose");
  normalizeWindRoseCalmTrace(figure);
  return figure;
}

async function swapCompareWindRoseToSummary(section) {
  const compareHost = maximizedCompareUi()?.compareHost;
  if (!compareHost || compareHost.dataset?.figureId !== "wind_rose" || !compareHost.layout?.polar) {
    return false;
  }
  const compareIcao = normalizedCompareIcao();
  if (!compareIcao) {
    return false;
  }
  const item = await loadCompareWindRoseSummaryItem(compareIcao, section, seasonForCompare());
  if (!item?.figure) {
    return false;
  }
  const figure = prepareWindRoseFigureForInPlaceSwap(JSON.parse(JSON.stringify(item.figure)));
  const swapped = await restyleWindRosePetals(compareHost, figure.data || [], { includeVisible: true });
  if (!swapped) {
    return false;
  }
  if (!state.syncAxes) {
    await relayoutWindRoseRadialRange(
      compareHost,
      windRoseRadialRange(windRoseRadialMax(figure)),
    );
  }
  await ensureWindRoseCalmLayerOrder(compareHost);
  deferWindRoseCalmDomHover(compareHost);
  windRosePlayback.compareFrameContext = windRoseCompareFramePinContext(compareHost);
  return true;
}

function windRoseHostCanSwapBasemap(host) {
  return Boolean(
    host?.layout?.polar
    && host.data?.length
    && Array.isArray(host.layout.images)
    && host.layout.images.some((image) => image?.source),
  );
}

function windRoseCompareTitleIcao(host) {
  const title = host?.layout?.title;
  const text = typeof title === "string" ? title : title?.text;
  return String(text || "").trim().toUpperCase();
}

async function swapWindRoseImageSource(host, source) {
  const images = host?.layout?.images;
  if (!Array.isArray(images) || !source) {
    return;
  }
  const patch = {};
  images.forEach((image, index) => {
    if (!image?.source || image.source === source) {
      return;
    }
    image.source = source;
    patch[`images[${index}].source`] = source;
  });
  if (!Object.keys(patch).length) {
    return;
  }
  await Plotly.relayout(host, patch).catch(() => undefined);
}

async function swapPaintedWindRoseInPlace(host, figure, icao) {
  if (!windRoseHostCanSwapBasemap(host) || !figure) {
    return false;
  }
  const swapped = await restyleWindRosePetals(host, figure.data || [], { includeVisible: true });
  if (!swapped) {
    return false;
  }
  const source = (figure.layout?.images || []).find((image) => image?.source)?.source;
  if (source) {
    await swapWindRoseImageSource(host, source);
  }
  const nextRange = figure.layout?.polar?.radialaxis?.range;
  if (windRoseRangesDiffer(host.layout?.polar?.radialaxis?.range, nextRange)) {
    await relayoutWindRoseRadialRange(host, nextRange);
  }
  const nextTitle = (
    isCompareDualPanelActive()
    && host === els.charts[state.maximizedChartIndex]
  )
    ? figureTitleForComparePanel(icao)
    : figure.layout?.title;
  const currentTitle = host.layout?.title;
  const currentTitleText = typeof currentTitle === "string" ? currentTitle : currentTitle?.text;
  const nextTitleText = typeof nextTitle === "string" ? nextTitle : nextTitle?.text;
  if (nextTitle && String(currentTitleText || "") !== String(nextTitleText || "")) {
    await Plotly.relayout(host, { title: nextTitle }).catch(() => undefined);
  }
  markWindRoseSwapped(host);
  return true;
}

async function swapCompareWindRoseToIcao(compareIcao, section) {
  const compareHost = maximizedCompareUi()?.compareHost;
  if (!windRoseHostCanSwapBasemap(compareHost)) {
    return false;
  }
  const season = seasonForCompare();
  let item = null;
  if (shouldUseHourlyWindRose(section)) {
    const hour = els.wrHourScroller?.value ?? "0";
    item = await fetchCompareWindRoseHourFigure(hour, compareIcao, season);
  } else {
    item = await loadCompareWindRoseSummaryItem(compareIcao, section, season);
  }
  if (!item?.figure) {
    return false;
  }
  const figure = prepareWindRoseFigureForInPlaceSwap(JSON.parse(JSON.stringify(item.figure)));
  await preparePolarTerrainBackground(figure, compareIcao);
  const swapped = await restyleWindRosePetals(compareHost, figure.data || [], { includeVisible: true });
  if (!swapped) {
    return false;
  }
  const source = (figure.layout?.images || []).find((image) => image?.source)?.source;
  if (source) {
    await swapWindRoseImageSource(compareHost, source);
  }
  await Plotly.relayout(compareHost, {
    title: figureTitleForComparePanel(compareIcao),
  }).catch(() => undefined);
  const primaryIcao = String(els.icao?.value || "").trim().toUpperCase();
  const primaryRange = ensureWindRoseHourlyScale(primaryIcao, season, section);
  const compareRange = await ensureCompareWindRoseHourlyScale(compareIcao, season, section);
  const lockedRange = resolveComparePanelWindRoseRadialRange(primaryRange, compareRange);
  await relayoutWindRoseRadialRange(compareHost, lockedRange);
  if (state.syncAxes) {
    await relayoutWindRoseRadialRange(els.charts[state.maximizedChartIndex], lockedRange);
  }
  syncWindRoseCalmMaskOnly(compareHost);
  deferWindRoseCalmDomHover(compareHost);
  windRosePlayback.compareFrameContext = shouldUseHourlyWindRose(section)
    ? windRoseCompareFramePinContext(compareHost)
    : null;
  return true;
}

async function updateCompareWindRoseHourFrame(hour, section = state.displayedSection) {
  if (!isCompareDualPanelActive() || !shouldUseHourlyWindRose(section)) {
    return false;
  }
  const ui = maximizedCompareUi();
  const compareHost = ui?.compareHost;
  if (!compareHost || compareHost.dataset?.figureId !== "wind_rose") {
    return false;
  }
  const compareIcao = normalizedCompareIcao();
  const season = seasonForCompare();
  if (!compareIcao) {
    return false;
  }

  let sourceFigure = null;
  try {
    sourceFigure = await fetchCompareWindRoseHourFigure(hour, compareIcao, season);
  } catch (error) {
    console.warn("Failed to load compare wind rose hour:", error);
    return false;
  }
  if (!sourceFigure?.figure) {
    return false;
  }

  const primaryIcao = String(els.icao?.value || "").trim().toUpperCase();
  const primaryRange = ensureWindRoseHourlyScale(primaryIcao, season, section);
  const compareRange = await ensureCompareWindRoseHourlyScale(compareIcao, season, section);
  const lockedRange = resolveComparePanelWindRoseRadialRange(primaryRange, compareRange);

  const hourlyWrFig = JSON.parse(JSON.stringify(sourceFigure));
  prepareWindRoseFigureForInPlaceSwap(hourlyWrFig.figure);
  const srcData = hourlyWrFig.figure.data || [];

  // Hour changes stay on the current polar geometry. A responsive react here
  // is what flashes the compare rose out of position and back.
  if (await restyleWindRosePetals(compareHost, srcData)) {
    if (windRoseRangesDiffer(compareHost.layout?.polar?.radialaxis?.range, lockedRange)) {
      await relayoutWindRoseRadialRange(compareHost, lockedRange);
    }
    if (state.syncAxes) {
      const primaryHost = els.charts[state.maximizedChartIndex];
      if (windRoseRangesDiffer(primaryHost?.layout?.polar?.radialaxis?.range, lockedRange)) {
        await relayoutWindRoseRadialRange(primaryHost, lockedRange);
      }
    }
    syncWindRoseCalmMaskOnly(compareHost);
    deferWindRoseCalmDomHover(compareHost);
    windRosePlayback.compareFrameContext = windRoseCompareFramePinContext(compareHost);
    return true;
  }

  const chartHeight = Number.parseFloat(compareHost.style.height) || getChartHeight(section);
  const liveLayout = compareHost.layout && compareHost.layout.polar
    ? JSON.parse(JSON.stringify(compareHost.layout))
    : null;
  let renderLayout;
  if (liveLayout) {
    renderLayout = liveLayout;
    renderLayout.height = chartHeight;
    renderLayout.showlegend = false;
    renderLayout.polar = renderLayout.polar || {};
    renderLayout.polar.radialaxis = {
      ...(renderLayout.polar.radialaxis || {}),
      autorange: false,
      ...(lockedRange ? { range: [...lockedRange] } : {}),
    };
  } else {
    applyWindRoseLayout(hourlyWrFig.figure, section, {
      height: chartHeight,
      ...(lockedRange ? { radialRange: [...lockedRange] } : {}),
    });
    await preparePolarTerrainBackground(hourlyWrFig.figure, compareIcao);
    renderLayout = hourlyWrFig.figure.layout || {};
  }
  applyCompareDualPanelFigureChrome({ layout: renderLayout }, compareIcao, "wind_rose");
  pinWindRoseLayoutSize(compareHost, renderLayout);

  await Plotly.react(compareHost, srcData, renderLayout, {
    displayModeBar: false,
    responsive: false,
  });
  await relayoutWindRoseRadialRange(compareHost, lockedRange);
  if (state.syncAxes) {
    await relayoutWindRoseRadialRange(els.charts[state.maximizedChartIndex], lockedRange);
  }
  await ensureWindRoseCalmLayerOrder(compareHost);
  deferWindRoseCalmDomHover(compareHost);
  windRosePlayback.compareFrameContext = windRoseCompareFramePinContext(compareHost);
  return true;
}

async function renderWindRoseHourFrame(hour, section = state.displayedSection) {
  if (!shouldUseHourlyWindRose(section)) {
    return;
  }

  const host = getWindRoseChartHost();
  if (!host) {
    return;
  }

  const icao = String(els.icao.value || "").trim().toUpperCase();
  const season = els.season.value;
  if (state.liteMode) {
    if (
      !windRosePlayback.liteHourlyMap
      || String(windRosePlayback.liteHourlyIcao || "").toUpperCase() !== icao
    ) {
    windRosePlayback.liteHourlyMap = await fetchJsonCached(liteWindRoseHourlyUrl(icao));
      windRosePlayback.liteHourlyIcao = icao;
    }
  }
  const sourceFigure = resolveWindRoseHourFigure(hour, icao, season);
  if (!sourceFigure?.figure) {
    return;
  }

  const hourlyWrFig = JSON.parse(JSON.stringify(sourceFigure));
  prepareWindRoseFigureForInPlaceSwap(hourlyWrFig.figure);
  const chartHeight = Number.parseFloat(host.style.height) || getChartHeight(section);

  // One stable radial range across all 24 hours + summary, so the polar grid
  // and petals never rescale while scrubbing or toggling modes.
  const hourlyRange = ensureWindRoseHourlyScale(icao, season, section);
  const baseSnapshot = state.windRoseLayoutRef[section]
    ? { ...state.windRoseLayoutRef[section] }
    : null;
  const layoutSnapshot = {
    ...(baseSnapshot || {}),
    height: chartHeight,
    ...(hourlyRange ? { radialRange: [...hourlyRange] } : {}),
  };

  applyWindRoseLayout(hourlyWrFig.figure, section, layoutSnapshot);
  hourlyWrFig.figure.layout = hourlyWrFig.figure.layout || {};
  hourlyWrFig.figure.layout.height = chartHeight;
  delete hourlyWrFig.figure.layout.width;
  hourlyWrFig.figure.layout.showlegend = false;

  await preparePolarTerrainBackground(hourlyWrFig.figure, icao);

  const windRoseIndex = state.latestFigures.findIndex((item) => item.id === "wind_rose");

  // Fast path: the static layer (polar axes, grid, terrain, scale) is already
  // drawn, so only swap the petal data. A pin mismatch must not fall through
  // to Plotly.react — that resize is the mode-toggle flicker.
  const srcData = hourlyWrFig.figure.data || [];
  if (await restyleWindRosePetals(host, srcData)) {
    if (windRoseRangesDiffer(host.layout?.polar?.radialaxis?.range, hourlyRange)) {
      await relayoutWindRoseRadialRange(host, hourlyRange);
    }
    syncWindRoseCalmMaskOnly(host);
    deferWindRoseCalmDomHover(host);
    if (windRoseIndex >= 0) {
      state.latestFigures[windRoseIndex] = hourlyWrFig;
    }
    windRosePlayback.frameContext = windRoseFramePinContext(host);
    await updateCompareWindRoseHourFrame(hour, section).catch(() => undefined);
    return;
  }

  // Rebuild path (first entry / resize / maximize). Reuse the geometry already
  // on screen (polar domain, margins, width/height, terrain image) and only
  // override the radial range, so the plot never resizes -> no blink. The
  // follow-up resize is therefore unnecessary and is skipped when we reuse it.
  const liveLayout = host.layout && host.layout.polar ? JSON.parse(JSON.stringify(host.layout)) : null;
  let renderLayout;
  if (liveLayout) {
    renderLayout = liveLayout;
    renderLayout.polar = renderLayout.polar || {};
    const range = hourlyRange ? [...hourlyRange] : renderLayout.polar.radialaxis?.range;
    renderLayout.polar.radialaxis = {
      ...(renderLayout.polar.radialaxis || {}),
      autorange: false,
      ...(range ? { range: [...range] } : {}),
    };
    renderLayout.height = chartHeight;
    renderLayout.showlegend = false;
  } else {
    renderLayout = hourlyWrFig.figure.layout || {};
  }
  pinWindRoseLayoutSize(host, renderLayout);

  await Plotly.react(host, srcData, renderLayout, {
    displayModeBar: false,
    responsive: false,
  });

  if (windRoseIndex >= 0) {
    state.latestFigures[windRoseIndex] = hourlyWrFig;
    const { legend } = chartUi[windRoseIndex];
    renderExternalLegend(host, legend, hourlyWrFig.figure, section, "wind_rose");
  }

  if (!liveLayout) {
    await scheduleWindRoseResize(host);
  }
  await ensureWindRoseCalmLayerOrder(host);
  deferWindRoseCalmDomHover(host);
  windRosePlayback.frameContext = windRoseFramePinContext(host);
  await updateCompareWindRoseHourFrame(hour, section).catch(() => undefined);
}

// Switch the rose to hourly mode by re-rendering only the rose host (no grid
// re-fetch/redraw), then let scrubbing run on the data-only fast path.
async function enterWindRoseHourlyInPlace(section = state.displayedSection) {
  const host = getWindRoseChartHost();
  if (!host) {
    fetchCharts();
    return;
  }
  applyChartShellHeights(section);
  try {
    await ensureWindRoseHourlyFramesLoaded();
  } catch (error) {
    console.warn("Failed to enter hourly wind rose:", error);
    fetchCharts();
    return;
  }
  resetWindRoseHourlyScale();
  windRosePlayback.frameContext = null;
  const hour = els.wrHourScroller?.value ?? "0";
  await renderWindRoseHourFrame(hour, section);
}

// Restore the cached summary rose into the existing host without a full redraw.
async function exitWindRoseHourlyInPlace(section = state.displayedSection) {
  const host = getWindRoseChartHost();
  const cached = state.windRoseSummaryFigure?.[section];
  if (!host || !cached?.figure) {
    fetchCharts();
    return;
  }

  const cachedHasCalm = (cached.figure.data || []).some((trace) => isWindRoseCalmTrace(trace));
  if (!cachedHasCalm) {
    fetchCharts();
    return;
  }

  const icao = els.icao.value;
  applyChartShellHeights(section);
  const summaryItem = JSON.parse(JSON.stringify(cached));
  prepareWindRoseFigureForInPlaceSwap(summaryItem.figure);
  const chartHeight = Number.parseFloat(host.style.height) || getChartHeight(section);

  // Reuse the on-screen geometry so the rose does not resize while restoring.
  // With compare open and Sync on, keep the locked radial range so the grid
  // does not jump to the summary fit and back.
  const summaryRange = windRoseRadialRange(windRoseRadialMax(summaryItem.figure));
  const compareHost = isCompareDualPanelActive()
    ? maximizedCompareUi()?.compareHost
    : null;
  const compareWindRose = compareHost?.dataset?.figureId === "wind_rose" && compareHost.layout?.polar;
  const liveLayout = host.layout && host.layout.polar ? JSON.parse(JSON.stringify(host.layout)) : null;

  if (compareWindRose && liveLayout) {
    const swapped = await restyleWindRosePetals(host, summaryItem.figure.data || [], { includeVisible: true });
    if (swapped) {
      if (!state.syncAxes) {
        await relayoutWindRoseRadialRange(host, summaryRange);
      }
      const windRoseIndex = state.latestFigures.findIndex((item) => item.id === "wind_rose");
      if (windRoseIndex >= 0) {
        state.latestFigures[windRoseIndex] = summaryItem;
        state.windRoseLayoutRef[section] = extractWindRoseLayoutSnapshot(summaryItem.figure, section, chartHeight);
        const { legend } = chartUi[windRoseIndex];
        renderExternalLegend(host, legend, summaryItem.figure, section, "wind_rose");
      }
      windRosePlayback.frameContext = windRoseFramePinContext(host);
      await ensureWindRoseCalmLayerOrder(host);
      deferWindRoseCalmDomHover(host);
      const compareOk = await swapCompareWindRoseToSummary(section);
      if (!compareOk) {
        windRosePlayback.compareFrameContext = null;
        invalidateCompareCache();
        await refreshCompareMode().catch(() => undefined);
      }
      return;
    }
  }

  let renderLayout;
  if (liveLayout) {
    renderLayout = liveLayout;
    renderLayout.polar = renderLayout.polar || {};
    renderLayout.polar.radialaxis = {
      ...(renderLayout.polar.radialaxis || {}),
      autorange: false,
      range: [...summaryRange],
    };
    renderLayout.height = chartHeight;
    renderLayout.showlegend = false;
  } else {
    applyWindRoseLayout(summaryItem.figure, section, { height: chartHeight, radialRange: summaryRange });
    summaryItem.figure.layout = summaryItem.figure.layout || {};
    summaryItem.figure.layout.height = chartHeight;
    delete summaryItem.figure.layout.width;
    summaryItem.figure.layout.showlegend = false;
    await preparePolarTerrainBackground(summaryItem.figure, icao);
    renderLayout = summaryItem.figure.layout || {};
  }

  if (compareWindRose) {
    pinWindRoseLayoutSize(host, renderLayout);
  }
  await Plotly.react(host, summaryItem.figure.data || [], renderLayout, {
    displayModeBar: false,
    responsive: !compareWindRose,
  });

  const windRoseIndex = state.latestFigures.findIndex((item) => item.id === "wind_rose");
  if (windRoseIndex >= 0) {
    state.latestFigures[windRoseIndex] = summaryItem;
    state.windRoseLayoutRef[section] = extractWindRoseLayoutSnapshot(summaryItem.figure, section, chartHeight);
    const { legend } = chartUi[windRoseIndex];
    renderExternalLegend(host, legend, summaryItem.figure, section, "wind_rose");
  }
  windRosePlayback.frameContext = null;
  deferWindRoseCalmDomHover(host);
  if (!liveLayout) {
    await scheduleWindRoseResize(host);
  }
  await ensureWindRoseCalmLayerOrder(host);
  if (compareWindRose) {
    const compareOk = await swapCompareWindRoseToSummary(section);
    if (!compareOk) {
      windRosePlayback.compareFrameContext = null;
      invalidateCompareCache();
      await refreshCompareMode().catch(() => undefined);
    }
  }
}

async function advanceWindRosePlaybackFrame() {
  if (!windRosePlayback.playing || windRosePlayback.renderInFlight) {
    return;
  }

  const currentHour = Number(els.wrHourScroller?.value ?? 0);
  const nextHour = (currentHour + 1) % 24;
  setWindRoseHourDisplay(nextHour);

  windRosePlayback.renderInFlight = true;
  try {
    await renderWindRoseHourFrame(nextHour);
  } catch (error) {
    console.warn("Failed to advance wind rose playback:", error);
    stopWindRosePlayback();
  } finally {
    windRosePlayback.renderInFlight = false;
  }
}

async function startWindRosePlayback() {
  if (!shouldUseHourlyWindRose()) {
    return;
  }

  try {
    await ensureWindRoseHourlyFramesLoaded();
  } catch (error) {
    console.warn("Failed to prepare wind rose playback:", error);
    return;
  }

  // Recompute the stable scale now that every hour's frame is loaded, so the
  // fixed radial range fits all hours (e.g. the API path where only the summary
  // max was known until frames were fetched).
  resetWindRoseHourlyScale();

  windRosePlayback.playing = true;
  updateWindRosePlayButton();
  windRosePlayback.timer = setInterval(() => {
    advanceWindRosePlaybackFrame();
  }, WIND_ROSE_PLAY_INTERVAL_MS);
}

async function toggleWindRosePlayback() {
  if (windRosePlayback.playing) {
    stopWindRosePlayback();
    return;
  }
  await startWindRosePlayback();
}

function resetWindRoseModeOnSectionChange(nextSection) {
  if (state.displayedSection === nextSection) {
    return;
  }
  stopWindRosePlayback();
  state.wrMode = "summary";
  resetWindRoseHourlyScale();
  resetLightningHeatmapModeOnSectionChange(nextSection);
  clearChartLegendVisibility();
}

function clearWindModeToggleInlineLocks() {
  // Drop sizing locks from earlier equalize experiments so buttons match prod CSS.
  [els.wrModeSummary, els.wrModeHourly].forEach((el) => {
    if (!el) {
      return;
    }
    el.removeAttribute("style");
  });
  const group = els.wrModeSummary?.parentElement;
  if (group?.classList?.contains("segmented-toggle")) {
    group.style.removeProperty("width");
    group.style.removeProperty("display");
    group.style.removeProperty("overflow");
  }
}

function renderWindRoseToolbar(section = state.displayedSection) {
  const isOverview = section === "overview";
  const isWind = section === "wind";
  const showWR = isOverview || isWind;

  const toolbarEl = isOverview ? els.overviewWindModeToolbar : (isWind ? els.windSectionWindModeToolbar : null);

  if (!showWR || !toolbarEl) {
    // If we're not showing WR, make sure the container is preserved (not destroyed by innerHTML = "")
    if (els.wrToolbarContainer && els.wrToolbarContainer.parentElement) {
       els.wrToolbarContainer.parentElement.removeChild(els.wrToolbarContainer);
    }
    return;
  }

  if (!els.wrModeSummary && els.wrToolbarTemplate) {
    els.wrToolbarContainer = els.wrToolbarTemplate;
    els.wrToolbarContainer.classList.remove("hidden");
    
    els.wrModeSummary = els.wrToolbarContainer.querySelector("#wr-mode-summary");
    els.wrModeHourly = els.wrToolbarContainer.querySelector("#wr-mode-hourly");
    els.wrHourScroller = els.wrToolbarContainer.querySelector("#wr-hour-scroller");
    els.wrHourScrollerContainer = els.wrToolbarContainer.querySelector("#wr-hour-scroller-container");
    els.wrHourValue = els.wrToolbarContainer.querySelector("#wr-hour-value");
    els.wrHourPlayBtn = els.wrToolbarContainer.querySelector("#wr-hour-play");

    attachWindRoseListeners();
  }

  if (els.wrToolbarContainer) {
    toolbarEl.innerHTML = "";
    toolbarEl.appendChild(els.wrToolbarContainer);
    toolbarEl.classList.remove("hidden");
    toolbarEl.classList.toggle("is-wind-toolbar", isWind);
    const isHourly = state.wrMode === "hourly";
    toolbarEl.classList.toggle("is-hourly-mode", showWR && isHourly);

    if (els.wrModeSummary) {
      els.wrModeSummary.classList.toggle("active", !isHourly);
    }
    if (els.wrModeHourly) {
      els.wrModeHourly.classList.toggle("active", isHourly);
    }
    clearWindModeToggleInlineLocks();

    if (isWind) {
      els.wrHourScrollerContainer.classList.remove("hidden");
      els.wrHourScrollerContainer.setAttribute("aria-hidden", isHourly ? "false" : "true");
      els.wrHourScrollerContainer.classList.toggle("is-hidden-state", !isHourly);
    } else if (isHourly) {
      els.wrHourScrollerContainer.classList.remove("hidden");
    } else {
      els.wrHourScrollerContainer.classList.add("hidden");
    }

    if (isHourly && els.wrHourScroller && els.wrHourValue) {
      els.wrHourValue.textContent = formatWindRoseHourLabel(els.wrHourScroller.value);
    }
    if (!isHourly) {
      stopWindRosePlayback();
    }
    updateWindRosePlayButton();

    // Toolbar may attach after shell sizing; re-pin so it never enters flex flow.
    // Do not yank the toolbar out of the slot first — that races Safari and can
    // leave the toggle flush if a later sync is skipped.
    if (toolbarEl) {
      const card = toolbarEl.closest(".chart-card")
        || chartUi.find((ui) => ui.card?.contains?.(toolbarEl))?.card
        || document.querySelector(".chart-card.is-maximized")
        || document.querySelector(".chart-card");
      const cardIndex = chartUi.findIndex((ui) => ui.card === card);
      const isMaximized = Boolean(
        card?.classList?.contains("is-maximized")
        || (
          Number.isInteger(state.maximizedChartIndex)
          && state.maximizedChartIndex === cardIndex
        )
      );
      syncMaximizedShellAndToolbarInsets(card, {
        isMaximized,
        pinModeToolbar: true,
      });
    }
  }
}

function attachWindRoseListeners() {
  if (els.wrModeSummary) {
    els.wrModeSummary.addEventListener("click", () => {
      if (state.wrMode === "summary") {
        return;
      }
      stopWindRosePlayback();
      state.wrMode = "summary";
      // Re-render the toolbar so slider visibility (incl. the wind panel's
      // is-hidden-state class) tracks the new mode.
      renderWindRoseToolbar(state.displayedSection);
      if (state.displayedSection === "wind" || state.displayedSection === "overview") {
        if (state.liteMode) {
          exitWindRoseHourlyInPlace();
        } else {
          fetchCharts();
        }
      }
    });
  }

  if (els.wrModeHourly) {
    els.wrModeHourly.addEventListener("click", () => {
      if (state.wrMode === "hourly") {
        return;
      }
      stopWindRosePlayback();
      state.wrMode = "hourly";
      renderWindRoseToolbar(state.displayedSection);
      if (state.displayedSection === "wind" || state.displayedSection === "overview") {
        if (state.liteMode) {
          enterWindRoseHourlyInPlace();
        } else {
          fetchCharts();
        }
      }
    });
  }

  if (els.wrHourPlayBtn) {
    els.wrHourPlayBtn.addEventListener("click", () => {
      toggleWindRosePlayback();
    });
  }

  if (els.wrHourScroller) {
    els.wrHourScroller.addEventListener("pointerdown", () => {
      if (windRosePlayback.playing) {
        stopWindRosePlayback();
      }
    });
    els.wrHourScroller.addEventListener("input", () => {
      if (windRosePlayback.playing) {
        stopWindRosePlayback();
      }
      els.wrHourValue.textContent = formatWindRoseHourLabel(els.wrHourScroller.value);
      if (windRosePlayback.suppressSliderFetch) {
        return;
      }
      if (windRoseToolbarSections().has(state.displayedSection)) {
        if (state.liteMode && shouldUseHourlyWindRose()) {
          renderWindRoseHourFrame(els.wrHourScroller.value);
          return;
        }
        scheduleFetchCharts(DRIVER_FETCH_DEBOUNCE_MS);
      }
    });
    els.wrHourScroller.addEventListener("change", () => {
      if (windRosePlayback.suppressSliderFetch || windRosePlayback.playing) {
        return;
      }
      if (!windRoseToolbarSections().has(state.displayedSection)) {
        return;
      }
      if (state.liteMode && shouldUseHourlyWindRose()) {
        renderWindRoseHourFrame(els.wrHourScroller.value);
        return;
      }
      fetchCharts();
    });
  }
}

function getLightningHeatmapChartUi() {
  const index = state.latestFigures.findIndex((item) => item.id === "lightning_heatmap");
  if (index < 0) {
    return null;
  }
  return chartUi[index] || null;
}

function syncLightningHourlyColorbarVisibility() {
  const ui = getLightningHeatmapChartUi();
  if (!ui?.shell) {
    return;
  }
  ui.shell.classList.remove("has-lightning-hourly-colorbar");
  const colorbar = ui.shell.querySelector(".lightning-hourly-colorbar");
  if (colorbar) {
    colorbar.classList.add("hidden");
  }
}

function captureLightningHeatmapLayoutSnapshot(host, baseLayout = null) {
  const source = baseLayout || host?.layout;
  if (!source) {
    return null;
  }
  const snapshot = JSON.parse(JSON.stringify(source));
  snapshot.autosize = false;
  // Never rehydrate Local ring circle shapes from a layout pin.
  snapshot.shapes = filterNonLightningRingShapes(snapshot.shapes);
  const width = Math.round(host.offsetWidth || host.clientWidth || 0);
  const height = Math.round(host.offsetHeight || host.clientHeight || 0);
  if (width > 0) {
    snapshot.width = width;
  }
  if (height > 0) {
    snapshot.height = height;
  }
  snapshot.xaxis = {
    ...(snapshot.xaxis || {}),
    fixedrange: true,
    automargin: false,
  };
  snapshot.yaxis = {
    ...(snapshot.yaxis || {}),
    fixedrange: true,
    automargin: false,
  };
  return snapshot;
}

function captureLightningHeatmapSummaryLayoutRef(host) {
  if (!host?.layout) {
    return;
  }
  const snapshot = JSON.parse(JSON.stringify(host.layout));
  snapshot.shapes = filterNonLightningRingShapes(snapshot.shapes);
  const width = Math.round(host.offsetWidth || host.clientWidth || 0);
  const height = Math.round(host.offsetHeight || host.clientHeight || 0);
  if (width > 0) {
    snapshot.width = width;
  }
  if (height > 0) {
    snapshot.height = height;
  }
  snapshot.autosize = false;
  state.lightningHeatmapSummaryLayoutRef = snapshot;
  const traceIndex = lightningHeatmapTraceIndex(host);
  if (traceIndex >= 0) {
    state.lightningHeatmapPinnedTraceRef = JSON.parse(JSON.stringify(host.data[traceIndex]));
  }
}

function lightningHeatmapTraceIndex(hostOrFigure) {
  const data = hostOrFigure?.data || hostOrFigure?.figure?.data || [];
  return data.findIndex((entry) => String(entry?.type || "").toLowerCase() === "heatmap");
}

function lightningHeatmapTraceIndices(hostOrFigure) {
  const data = hostOrFigure?.data || hostOrFigure?.figure?.data || [];
  const indices = [];
  data.forEach((entry, index) => {
    if (String(entry?.type || "").toLowerCase() === "heatmap") {
      indices.push(index);
    }
  });
  return indices;
}

// The maximized hourly map jittered because the single heatmap trace owned both
// the colorbar (an auto-margin pusher) and the scaleanchor constraint, so every
// z-restyle re-measured the colorbar and re-solved the square aspect, nudging the
// plot rectangle (and the data-anchored topo image) by a few pixels. We split the
// heatmap into a static "chrome" trace that owns the colorbar and a visible "data"
// trace (showscale:false) that is the only one scrubbed, so z updates never touch
// the colorbar/margins and the layout is pixel-stable.
function buildLightningChromeHeatmapTrace(dataTrace) {
  // A heatmap with all-null z renders no colorbar, so the chrome trace carries a
  // tiny, static, valid z (spanning zmin..zmax). Its cells sit far outside the fixed
  // axis range and are clipped away, so nothing is drawn on the map — but the colorbar
  // renders and, because this trace is never restyled, stays pixel-stable.
  const zmin = Number(dataTrace?.zmin) || 0;
  const zmax = Math.max(zmin + 1, Number(dataTrace?.zmax) || 1);
  const offRange = 1e6;
  return {
    type: "heatmap",
    x: [offRange, offRange + 1],
    y: [offRange, offRange + 1],
    z: [[zmin, zmax], [zmin, zmax]],
    zmin,
    zmax,
    zauto: false,
    colorscale: dataTrace?.colorscale || LIGHTNING_HEATMAP_COLORSCALE,
    showscale: true,
    hoverinfo: "skip",
    showlegend: false,
    colorbar: dataTrace?.colorbar ? JSON.parse(JSON.stringify(dataTrace.colorbar)) : undefined,
    name: "__lightning_chrome",
  };
}

function ensureLightningHourlyTwoTraceFigure(figure) {
  if (!figure?.data) {
    return figure;
  }
  const indices = lightningHeatmapTraceIndices(figure);
  if (!indices.length || indices.length >= 2) {
    return figure;
  }
  const dataTrace = figure.data[indices[0]];
  const chrome = buildLightningChromeHeatmapTrace(dataTrace);
  // The data trace renders the cells; the chrome trace (appended last) renders only
  // the colorbar. Keep the data trace first so existing "first heatmap" lookups keep
  // targeting it for z scrubbing and layout pinning.
  dataTrace.showscale = false;
  figure.data.push(chrome);
  return figure;
}

// In hourly mode the base chart shows the topo, rings, axes, and colorbar but NOT
// the data cells (those live in the overlay). Blank the data trace z so the base is
// fully static while keeping its x/y/zmin/zmax/colorscale available for the overlay.
function suppressLightningBaseCells(figure) {
  const idx = lightningHeatmapTraceIndex(figure);
  if (idx < 0) {
    return;
  }
  const trace = figure.data[idx];
  if (Array.isArray(trace?.z)) {
    trace.z = trace.z.map((row) => (Array.isArray(row) ? row.map(() => null) : null));
  }
}

// ---------------------------------------------------------------------------
// Lightning hourly overlay (base + overlay architecture)
//
// The maximized hourly scrub jittered because Plotly.restyle on the single map
// div re-ran the layout solver every hour step (colorbar auto-margin oscillation
// + scaleanchor re-solve), nudging the data-anchored topo image by ~1px. Here the
// static "base" div (topo, rings, axes, colorbar) is rendered once and never
// restyled, while a transparent "overlay" div holds only the heatmap cells. The
// overlay has no colorbar and no scaleanchor, and its margins/ranges are copied
// from the base's resolved layout, so a z-only restyle cannot move anything.
// ---------------------------------------------------------------------------
function getLightningOverlayHost() {
  const ui = getLightningHeatmapChartUi();
  if (!ui?.shell) {
    return null;
  }
  return [...ui.shell.querySelectorAll(".lightning-hour-overlay")]
    .find((el) => el.dataset.compareOverlay !== "1") || null;
}

function getLightningHourOverlayForHost(baseHost) {
  if (!baseHost) {
    return null;
  }
  const hostLocal = baseHost.querySelector(":scope > .lightning-hour-overlay");
  if (hostLocal) {
    return hostLocal;
  }
  if (baseHost === getLightningHeatmapChartHost()) {
    return getLightningOverlayHost();
  }
  return null;
}

function positionLightningOverlay(baseHost, overlay) {
  if (!baseHost || !overlay) {
    return;
  }
  // Host-local overlays (compare panel, or primary while dual-panel) fill the host.
  if (overlay.parentElement === baseHost) {
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    return;
  }
  overlay.style.left = `${baseHost.offsetLeft}px`;
  overlay.style.top = `${baseHost.offsetTop}px`;
  overlay.style.width = `${Math.round(baseHost.offsetWidth || baseHost.clientWidth || 0)}px`;
  overlay.style.height = `${Math.round(baseHost.offsetHeight || baseHost.clientHeight || 0)}px`;
}

function ensureLightningOverlayHost(baseHost) {
  const ui = getLightningHeatmapChartUi();
  if (!ui?.shell || !baseHost) {
    return null;
  }
  const primary = getLightningHeatmapChartHost();
  // Dual-panel compare: keep the overlay inside each Plotly host so panel
  // resizes cannot leave a full-shell overlay stretched across both maps.
  const hostLocal = Boolean(
    primary
    && (baseHost !== primary || isCompareDualPanelActive()),
  );
  if (hostLocal) {
    let overlay = baseHost.querySelector(":scope > .lightning-hour-overlay");
    if (!overlay) {
      // Migrate a leftover shell overlay onto the primary host when compare opens.
      if (baseHost === primary) {
        const shellOverlay = getLightningOverlayHost();
        if (shellOverlay && shellOverlay.parentElement !== baseHost) {
          overlay = shellOverlay;
          baseHost.appendChild(overlay);
        }
      }
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "lightning-hour-overlay";
        baseHost.appendChild(overlay);
      }
    }
    if (baseHost !== primary) {
      overlay.dataset.compareOverlay = "1";
    } else {
      delete overlay.dataset.compareOverlay;
    }
    positionLightningOverlay(baseHost, overlay);
    return overlay;
  }
  let overlay = [...ui.shell.querySelectorAll(".lightning-hour-overlay")]
    .find((el) => el.dataset.compareOverlay !== "1") || null;
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "lightning-hour-overlay";
    ui.shell.appendChild(overlay);
  }
  positionLightningOverlay(baseHost, overlay);
  return overlay;
}

async function syncGafLightningHourlyScrubLayers(host) {
  if (!host || host.dataset?.figureId !== "lightning_heatmap") {
    return;
  }
  if (!shouldUseHourlyLightningHeatmap()) {
    return;
  }
  if (!(isLightningGafZoom() || isGafLightningFigure({ layout: host.layout }))) {
    return;
  }

  const record = host._lightningHourCanvas;
  if (record?.active && record.el && record.pack) {
    const hour = Number.isFinite(Number(record.hour))
      ? Number(record.hour)
      : Number(els.lhHourScroller?.value ?? 12);
    positionNationalLightningCanvas(host, record.el, record.pack);
    blitNationalLightningHour(hour, host);
  }

  // Dual-panel: migrate any shell-scoped overlay onto this host, then rebuild
  // its Plotly layout from the sealed (half-width) base geometry. Always refresh
  // rings/airports from the base — reusing overlay.data keeps a prior same-GAF
  // __gaf_airports_compare marker after the compare site changes region.
  const overlay = isCompareDualPanelActive()
    ? ensureLightningOverlayHost(host)
    : getLightningHourOverlayForHost(host);
  if (!overlay?.classList.contains("is-visible") || !overlay.data?.length) {
    return;
  }
  await refreshGafLightningOverlayChrome(host);
}

function buildLightningOverlayLayoutFromBase(baseHost, { uirevision = null } = {}) {
  const full = baseHost?._fullLayout || {};
  const size = full._size || {};
  const layoutMargin = baseHost?.layout?.margin || {};
  const width = Math.round(baseHost.offsetWidth || baseHost.clientWidth || 0);
  const height = Math.round(baseHost.offsetHeight || baseHost.clientHeight || 0);
  const xFull = full.xaxis || {};
  const yFull = full.yaxis || {};
  const margin = {
    l: Math.round(Number.isFinite(size.l) ? size.l : (layoutMargin.l || 0)),
    r: Math.round(Number.isFinite(size.r) ? size.r : (layoutMargin.r || 0)),
    t: Math.round(Number.isFinite(size.t) ? size.t : (layoutMargin.t || 0)),
    b: Math.round(Number.isFinite(size.b) ? size.b : (layoutMargin.b || 0)),
  };
  const axisCommon = {
    autorange: false,
    fixedrange: true,
    visible: false,
    showgrid: false,
    zeroline: false,
    showticklabels: false,
    ticks: "",
    automargin: false,
  };
  // Copy the *resolved* domain and range from the sealed base. The base uses
  // scaleanchor + constrain:"domain" (letterboxing) which shrinks the resolved
  // domain; copying that domain/range without scaleanchor reproduces the identical
  // plotting rectangle while avoiding any scale re-solve on the overlay.
  const xaxis = { ...axisCommon };
  if (Array.isArray(xFull.range)) xaxis.range = xFull.range.slice();
  if (Array.isArray(xFull.domain)) xaxis.domain = xFull.domain.slice();
  const yaxis = { ...axisCommon };
  if (Array.isArray(yFull.range)) yaxis.range = yFull.range.slice();
  if (Array.isArray(yFull.domain)) yaxis.domain = yFull.domain.slice();
  const layout = {
    width,
    height,
    autosize: false,
    margin,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    showlegend: false,
    hovermode: "closest",
    xaxis,
    yaxis,
  };
  if (uirevision) {
    layout.uirevision = uirevision;
  }
  return layout;
}

function buildLightningOverlayLayout(baseHost) {
  return buildLightningOverlayLayoutFromBase(baseHost);
}

// GAF/regional hourly uses a sealed single Plotly host (no overlay div). After the
// container CSS settles, pin width/height/margins/domains so z-only restyles cannot
// re-solve scaleanchor or nudge the basemap image.
//
// IMPORTANT: Plotly layout.width (autosize:false) writes an inline host style.width,
// so host.offsetWidth echoes the pin — not the flex CSS box. Always derive the
// target from the shell (minus legend), and clear stale pins before resealing.
function measureGafLightningSealTarget(host) {
  const shell = host.closest?.(".chart-shell") || host.parentElement;
  // In dual-panel compare the host lives in a half-width panel — measuring the
  // full shell seals at ~2× width and then letterboxes badly when pinned to a slot.
  const comparePanel = host.closest?.(".chart-compare-panel");
  const measureRoot = (isCompareDualPanelActive() && comparePanel) ? comparePanel : shell;
  const legend = shell?.querySelector?.(".chart-legend");
  const legendVisible = Boolean(
    legend
    && !legend.classList.contains("hidden")
    && !shell?.classList?.contains("no-legend")
    && !(isCompareDualPanelActive() && comparePanel),
  );
  const legendWidth = legendVisible
    ? Math.round((legend.offsetWidth || 0) + 10) // include flex gap
    : 0;
  const rootWidth = Math.round(measureRoot?.clientWidth || host.parentElement?.clientWidth || 0);
  const targetWidth = Math.max(0, rootWidth - legendWidth);
  const styleHeight = Number.parseFloat(host.style.height) || 0;
  const targetHeight = Math.round(
    styleHeight
    || comparePanel?.clientHeight
    || shell?.clientHeight
    || getChartHeight(state.displayedSection)
    || 0,
  );
  const hostWidth = Math.round(host.offsetWidth || host.clientWidth || 0);
  const hostHeight = Math.round(host.offsetHeight || host.clientHeight || 0);
  const pinnedWidth = Math.round(Number(host.layout?.width) || 0);
  const pinnedHeight = Math.round(Number(host.layout?.height) || 0);
  return {
    targetWidth,
    targetHeight,
    hostWidth,
    hostHeight,
    pinnedWidth,
    pinnedHeight,
  };
}

let lightningConcealDepth = 0;
/** Hosts explicitly concealed by the current seal/rebuild stack (WeakSet). */
const lightningConcealedHosts = new Set();

function lightningFigureHosts() {
  const hosts = [];
  const primary = getLightningHeatmapChartHost();
  if (primary) {
    hosts.push(primary);
  }
  const compareHost = maximizedCompareUi()?.compareHost;
  if (compareHost && compareHost !== primary && compareHost.dataset?.figureId === "lightning_heatmap") {
    hosts.push(compareHost);
  }
  return hosts;
}

/** Conceal every lightning host (legacy callers / force blank). Prefer concealLightningFigureHost. */
function concealLightningFigureHosts() {
  lightningConcealDepth += 1;
  lightningFigureHosts().forEach((host) => {
    lightningConcealedHosts.add(host);
    host.style.visibility = "hidden";
  });
}

/** Conceal only the host being sealed so a dual-panel partner does not blink. */
function concealLightningFigureHost(host) {
  lightningConcealDepth += 1;
  if (!host) {
    return;
  }
  lightningConcealedHosts.add(host);
  host.style.visibility = "hidden";
}

function revealLightningFigureHosts(force = false) {
  if (force) {
    lightningConcealDepth = 0;
  } else {
    lightningConcealDepth = Math.max(0, lightningConcealDepth - 1);
  }
  if (lightningConcealDepth > 0) {
    return;
  }
  if (!force && isViewTransitionActive()) {
    return;
  }
  lightningConcealedHosts.forEach((host) => {
    if (host?.style) {
      host.style.visibility = "";
    }
  });
  lightningConcealedHosts.clear();
  // Also clear any host that was hidden by a legacy path.
  lightningFigureHosts().forEach((host) => {
    if (host.style.visibility === "hidden") {
      host.style.visibility = "";
    }
  });
}

function unpinGafLightningCssSize(host) {
  if (!host) {
    return;
  }
  host.style.width = "";
  host.style.maxWidth = "";
}

async function clearGafLightningFixedSize(host) {
  if (!host) {
    return;
  }
  try {
    await Plotly.relayout(host, { width: null, height: null, autosize: true });
  } catch (error) {
    // ignore — host may be mid-teardown
  }
  // Plotly may leave an inline width that keeps the chart shrunk inside the shell.
  host.style.width = "";
  try {
    await Plotly.Plots.resize(host);
  } catch (error) {
    // ignore
  }
}

// Compute an aspect-correct subplot domain for a lon/lat bbox so the map fills
// the axis box exactly (no scaleanchor letterboxing). Scatter overlays then
// clip to the basemap instead of painting into empty gutters.
function computeGafLightningMapDomains(bbox, plotWidth, plotHeight, options = {}) {
  const panel = getTopoMapPanelSpec();
  const comparePanel = Boolean(options.comparePanel);
  // Dual-panel slots are narrow; use nearly the full subplot so the fitted map
  // is not further inset by the single-panel topo domain gutters.
  const baseX = comparePanel ? [0.01, 0.99] : panel.plotDomain.x.slice();
  const baseY = comparePanel ? [0.01, 0.99] : panel.plotDomain.y.slice();
  const [latMin, latMax, lonMin, lonMax] = bbox || [];
  const dataW = Number(lonMax) - Number(lonMin);
  const dataH = Number(latMax) - Number(latMin);
  let panelW = Math.max(1, Number(plotWidth) || 1);
  let panelH = Math.max(1, Number(plotHeight) || 1);
  const margin = options.margin;
  if (margin) {
    panelW = Math.max(1, panelW - (Number(margin.l) || 0) - (Number(margin.r) || 0));
    panelH = Math.max(1, panelH - (Number(margin.t) || 0) - (Number(margin.b) || 0));
  }
  const availX0 = baseX[0];
  const availX1 = baseX[1];
  const availY0 = baseY[0];
  const availY1 = baseY[1];
  const availW = Math.max(1e-6, availX1 - availX0);
  const availH = Math.max(1e-6, availY1 - availY0);

  if (!(dataW > 0 && dataH > 0)) {
    return { x: baseX.slice(), y: baseY.slice() };
  }

  // Desired domain width/height ratio so pixels match scaleratio:1 lon/lat degrees.
  const targetDomRatio = (dataW / dataH) * (panelH / panelW);
  let domW = availW;
  let domH = availH;
  if (domW / domH > targetDomRatio) {
    domW = domH * targetDomRatio;
  } else {
    domH = domW / targetDomRatio;
  }
  const x0 = (availX0 + availX1 - domW) / 2;
  const y0 = (availY0 + availY1 - domH) / 2;
  return {
    x: [x0, x0 + domW],
    y: [y0, y0 + domH],
  };
}

function fitGafLightningCompareHostSize(slotWidth, slotHeight, bbox, margin = COMPARE_LIGHTNING_PANEL_MARGIN) {
  const [latMin, latMax, lonMin, lonMax] = bbox || [];
  const dataW = Number(lonMax) - Number(lonMin);
  const dataH = Number(latMax) - Number(latMin);
  const padL = Number(margin?.l) || 0;
  const padR = Number(margin?.r) || 0;
  const padT = Number(margin?.t) || 0;
  const padB = Number(margin?.b) || 0;
  const availW = Math.max(40, Number(slotWidth) - padL - padR);
  const availH = Math.max(40, Number(slotHeight) - padT - padB);
  if (!(dataW > 0 && dataH > 0)) {
    return {
      width: Math.round(slotWidth),
      height: Math.round(slotHeight),
    };
  }
  // Largest pixel rectangle inside the slot that keeps lon/lat degree aspect.
  const dataAspect = dataW / dataH;
  let mapW = availW;
  let mapH = mapW / dataAspect;
  if (mapH > availH) {
    mapH = availH;
    mapW = mapH * dataAspect;
  }
  return {
    width: Math.round(mapW + padL + padR),
    height: Math.round(mapH + padT + padB),
  };
}

function gafLightningHostMargin(host = null) {
  if (hostIsCompareDualPanelHost(host) || (host && isCompareDualPanelActive())) {
    return { ...COMPARE_LIGHTNING_PANEL_MARGIN };
  }
  const panel = getTopoMapPanelSpec();
  return {
    l: panel.margin.l,
    r: getLightningHeatmapMarginR(),
    t: panel.margin.t,
    b: getLightningHeatmapMarginB(panel.margin.b),
    autoexpand: false,
  };
}

async function applyGafLightningHostBoxLayout(host, width, height, { comparePanel = false } = {}) {
  if (!host || !(width > 40) || !(height > 40)) {
    return false;
  }
  const meta = host.layout?.meta || {};
  const bbox = Array.isArray(meta.gafBbox) && meta.gafBbox.length === 4 ? meta.gafBbox : null;
  const margin = comparePanel ? { ...COMPARE_LIGHTNING_PANEL_MARGIN } : gafLightningHostMargin(host);
  const mapDomains = bbox
    ? computeGafLightningMapDomains(bbox, width, height, { comparePanel, margin })
    : { x: [0.01, 0.99], y: [0.01, 0.99] };

  if (host.layout) {
    host.layout.width = width;
    host.layout.height = height;
    host.layout.autosize = false;
    host.layout.margin = { ...margin };
    if (host.layout.xaxis) {
      host.layout.xaxis.domain = mapDomains.x.slice();
      delete host.layout.xaxis.scaleanchor;
      delete host.layout.xaxis.scaleratio;
      delete host.layout.xaxis.constrain;
    }
    if (host.layout.yaxis) {
      host.layout.yaxis.domain = mapDomains.y.slice();
    }
  }
  host.style.width = `${width}px`;
  host.style.height = `${height}px`;
  host.style.maxWidth = "100%";

  const patch = {
    width,
    height,
    autosize: false,
    margin: { ...margin },
    showlegend: false,
    "xaxis.domain": mapDomains.x,
    "yaxis.domain": mapDomains.y,
    "xaxis.scaleanchor": null,
    "xaxis.scaleratio": null,
    "xaxis.constrain": null,
    "xaxis.automargin": false,
    "yaxis.automargin": false,
    "xaxis.fixedrange": true,
    "yaxis.fixedrange": true,
  };
  if (bbox) {
    const [latMin, latMax, lonMin, lonMax] = bbox;
    patch["xaxis.range"] = [lonMin, lonMax];
    patch["yaxis.range"] = [latMin, latMax];
    patch["xaxis.autorange"] = false;
    patch["yaxis.autorange"] = false;
    if (Array.isArray(host.layout?.images) && host.layout.images.length) {
      patch["images[0].x"] = lonMin;
      patch["images[0].y"] = latMax;
      patch["images[0].sizex"] = lonMax - lonMin;
      patch["images[0].sizey"] = latMax - latMin;
      patch["images[0].xref"] = "x";
      patch["images[0].yref"] = "y";
      patch["images[0].sizing"] = "stretch";
      patch["images[0].layer"] = "below";
    }
  }
  await Plotly.relayout(host, patch).catch(() => undefined);
  return true;
}

function pointInGafBbox(lon, lat, bbox) {
  if (!Array.isArray(bbox) || bbox.length !== 4) {
    return true;
  }
  const [latMin, latMax, lonMin, lonMax] = bbox;
  return lon >= lonMin && lon <= lonMax && lat >= latMin && lat <= latMax;
}

// Liang-Barsky clip of a lon/lat segment to [latMin,latMax] x [lonMin,lonMax].
function clipLonLatSegmentToBbox(x0, y0, x1, y1, bbox) {
  const [latMin, latMax, lonMin, lonMax] = bbox;
  let t0 = 0;
  let t1 = 1;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const clips = [
    [-dx, x0 - lonMin],
    [dx, lonMax - x0],
    [-dy, y0 - latMin],
    [dy, latMax - y0],
  ];
  for (let i = 0; i < clips.length; i += 1) {
    const [p, q] = clips[i];
    if (p === 0) {
      if (q < 0) {
        return null;
      }
      continue;
    }
    const r = q / p;
    if (p < 0) {
      if (r > t1) {
        return null;
      }
      if (r > t0) {
        t0 = r;
      }
    } else {
      if (r < t0) {
        return null;
      }
      if (r < t1) {
        t1 = r;
      }
    }
  }
  return {
    x0: x0 + t0 * dx,
    y0: y0 + t0 * dy,
    x1: x0 + t1 * dx,
    y1: y0 + t1 * dy,
  };
}

function appendRingClippedToBbox(xs, ys, ring, bbox) {
  if (!Array.isArray(ring) || ring.length < 2) {
    return;
  }
  const closed = ring.slice();
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (!first || !last || Number(first[0]) !== Number(last[0]) || Number(first[1]) !== Number(last[1])) {
    closed.push(first);
  }
  let open = false;
  for (let i = 0; i < closed.length - 1; i += 1) {
    const a = closed[i];
    const b = closed[i + 1];
    const clipped = clipLonLatSegmentToBbox(
      Number(a[0]),
      Number(a[1]),
      Number(b[0]),
      Number(b[1]),
      bbox,
    );
    if (!clipped) {
      if (open) {
        xs.push(null);
        ys.push(null);
        open = false;
      }
      continue;
    }
    if (!open) {
      xs.push(clipped.x0);
      ys.push(clipped.y0);
      open = true;
    } else {
      // Continuing a polyline: avoid duplicating the shared vertex.
      const lastX = xs[xs.length - 1];
      const lastY = ys[ys.length - 1];
      if (lastX !== clipped.x0 || lastY !== clipped.y0) {
        xs.push(null, clipped.x0);
        ys.push(null, clipped.y0);
      }
    }
    xs.push(clipped.x1);
    ys.push(clipped.y1);
  }
  if (open) {
    xs.push(null);
    ys.push(null);
  }
}

// scaleanchor + constrain:"domain" letterboxes the heatmap/basemap inside the
// subplot, but scatter overlays still paint into those gutters. Prefer an
// aspect-correct domain with no scaleanchor; fall back to measuring the
// constrained axis pixel box (_offset/_length) when needed.
async function pinGafLightningResolvedDomain(host, bbox = null) {
  const full = host?._fullLayout || {};
  const size = full._size || {};
  const width = Math.round(host?.layout?.width || host?.offsetWidth || 0);
  const height = Math.round(host?.layout?.height || host?.offsetHeight || 0);
  const viewBbox = Array.isArray(bbox) && bbox.length === 4
    ? bbox
    : (Array.isArray(host?.layout?.meta?.gafBbox) ? host.layout.meta.gafBbox : null);

  let domainX = null;
  let domainY = null;
  if (viewBbox && width > 0 && height > 0) {
    const comparePanel = hostIsCompareDualPanelHost(host);
    const margin = comparePanel ? COMPARE_LIGHTNING_PANEL_MARGIN : null;
    const computed = computeGafLightningMapDomains(viewBbox, width, height, {
      comparePanel,
      margin,
    });
    domainX = computed.x;
    domainY = computed.y;
  } else {
    const xFull = full.xaxis || {};
    const yFull = full.yaxis || {};
    const w = Number(size.w);
    const h = Number(size.h);
    const l = Number(size.l);
    const t = Number(size.t);
    if (
      w > 0 && h > 0
      && Number.isFinite(xFull._offset) && Number.isFinite(xFull._length)
      && Number.isFinite(yFull._offset) && Number.isFinite(yFull._length)
    ) {
      // Convert constrained axis pixel rect into domain fractions of the margin box.
      domainX = [
        (xFull._offset - l) / w,
        (xFull._offset + xFull._length - l) / w,
      ];
      domainY = [
        1 - ((yFull._offset + yFull._length - t) / h),
        1 - ((yFull._offset - t) / h),
      ];
    }
  }

  if (!domainX || !domainY || !(domainX[1] > domainX[0]) || !(domainY[1] > domainY[0])) {
    return false;
  }

  try {
    await Plotly.relayout(host, {
      "xaxis.domain": domainX,
      "yaxis.domain": domainY,
      "xaxis.scaleanchor": null,
      "xaxis.scaleratio": null,
      "xaxis.constrain": null,
    });
  } catch (error) {
    return false;
  }
  return true;
}

async function measureSettledGafLightningSealBox(host, { generation = null, attempts = 4 } = {}) {
  const gen = generation == null ? lightningPlayback.layoutGeneration : generation;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (gen !== lightningPlayback.layoutGeneration) {
      return null;
    }
    const measured = measureGafLightningSealTarget(host);
    if (measured.targetWidth > 0 && measured.targetHeight > 0) {
      const staleWidth = (
        (measured.pinnedWidth > 0 && measured.pinnedWidth < measured.targetWidth * 0.92)
        || (measured.hostWidth > 0 && measured.hostWidth < measured.targetWidth * 0.92)
      );
      const staleHeight = (
        (measured.pinnedHeight > 0 && measured.pinnedHeight < measured.targetHeight * 0.92)
        || (measured.hostHeight > 0 && measured.hostHeight < measured.targetHeight * 0.92)
      );
      if (staleWidth || staleHeight) {
        // Drop the CSS pin only. Relayouting autosize here stretches the
        // previous map across the card before the new geometry is ready.
        unpinGafLightningCssSize(host);
        await awaitLayoutSettle();
        continue;
      }
      return { width: measured.targetWidth, height: measured.targetHeight };
    }
    await awaitLayoutSettle();
  }
  if (gen !== lightningPlayback.layoutGeneration) {
    return null;
  }
  // Last resort: drop the CSS pin and use the shell-derived target if known.
  unpinGafLightningCssSize(host);
  await awaitLayoutSettle();
  const fallback = measureGafLightningSealTarget(host);
  if (fallback.targetWidth > 0 && fallback.targetHeight > 0) {
    return { width: fallback.targetWidth, height: fallback.targetHeight };
  }
  return null;
}

async function sealGafLightningHost(host, { generation = null } = {}) {
  const gen = generation == null ? lightningPlayback.layoutGeneration : generation;
  if (!host || !isGafLightningFigure({ layout: host.layout })) {
    return false;
  }
  if (gen !== lightningPlayback.layoutGeneration) {
    return false;
  }

  // Only blank the host being sealed — dual compare partner stays visible.
  concealLightningFigureHost(host);
  try {
  teardownLightningOverlay();
  await awaitLayoutSettle();
  if (gen !== lightningPlayback.layoutGeneration) {
    return false;
  }

  const settled = await measureSettledGafLightningSealBox(host, { generation: gen, attempts: 4 });
  if (!settled || gen !== lightningPlayback.layoutGeneration) {
    return false;
  }
  const { width, height } = settled;

  // Prefer an aspect-correct domain with no scaleanchor letterboxing so GAF
  // boundary / ICAO scatter overlays cannot paint into empty gutters.
  const panel = getTopoMapPanelSpec();
  const domainX = panel.plotDomain.x.slice();
  const domainY = panel.plotDomain.y.slice();
  const meta = host.layout?.meta || {};
  const bbox = Array.isArray(meta.gafBbox) && meta.gafBbox.length === 4 ? meta.gafBbox : null;
  const comparePanel = hostIsCompareDualPanelHost(host);
  const margin = comparePanel
    ? { ...COMPARE_LIGHTNING_PANEL_MARGIN }
    : {
      l: panel.margin.l,
      r: getLightningHeatmapMarginR(),
      t: panel.margin.t,
      b: getLightningHeatmapMarginB(panel.margin.b),
      autoexpand: false,
    };
  const mapDomains = bbox
    ? computeGafLightningMapDomains(bbox, width, height, { comparePanel, margin })
    : { x: domainX, y: domainY };
  const patch = {
    width,
    height,
    autosize: false,
    margin: { ...margin },
    "xaxis.domain": mapDomains.x,
    "yaxis.domain": mapDomains.y,
    "xaxis.autorange": false,
    "yaxis.autorange": false,
    "xaxis.scaleanchor": null,
    "xaxis.scaleratio": null,
    "xaxis.constrain": null,
    "xaxis.fixedrange": true,
    "yaxis.fixedrange": true,
    "xaxis.automargin": false,
    "yaxis.automargin": false,
  };
  if (bbox) {
    const [latMin, latMax, lonMin, lonMax] = bbox;
    patch["xaxis.range"] = [lonMin, lonMax];
    patch["yaxis.range"] = [latMin, latMax];
    if (Array.isArray(host.layout?.images) && host.layout.images.length) {
      patch["images[0].x"] = lonMin;
      patch["images[0].y"] = latMax;
      patch["images[0].sizex"] = lonMax - lonMin;
      patch["images[0].sizey"] = latMax - latMin;
      patch["images[0].xref"] = "x";
      patch["images[0].yref"] = "y";
      patch["images[0].sizing"] = "stretch";
      patch["images[0].layer"] = "below";
    }
  } else {
    const full = host._fullLayout || {};
    if (Array.isArray(full.xaxis?.range)) {
      patch["xaxis.range"] = full.xaxis.range.slice();
    }
    if (Array.isArray(full.yaxis?.range)) {
      patch["yaxis.range"] = full.yaxis.range.slice();
    }
  }

  await Plotly.relayout(host, patch);
  await awaitLayoutSettle();
  if (gen !== lightningPlayback.layoutGeneration) {
    return false;
  }

  // Keep domains aspect-correct (no letterbox) after the main seal patch.
  await pinGafLightningResolvedDomain(host, bbox);
  await awaitLayoutSettle();
  if (gen !== lightningPlayback.layoutGeneration) {
    return false;
  }

  const ctx = getLightningHourlyPinContext(host);
  lightningPlayback.layoutPinned = shouldUseHourlyLightningHeatmap();
  lightningPlayback.pinnedWidth = ctx.width;
  lightningPlayback.pinnedHeight = ctx.height;
  lightningPlayback.pinnedMaximized = ctx.maximized;

  // In hourly mode, hand strike cells to a transparent overlay built from the sealed
  // base geometry. Scrubbing then restyles only the overlay, so the sealed base
  // (colorbar, scaleanchor, basemap) never re-solves and cannot jitter.
  if (shouldUseHourlyLightningHeatmap()) {
    const hour = els.lhHourScroller?.value ?? "12";
    const entered = await enterGafLightningScrubOverlay(host, hour, { generation: gen });
    if (gen !== lightningPlayback.layoutGeneration) {
      return false;
    }
    if (!entered) {
      return false;
    }
  } else {
    await ensureLightningRingTracesOnHost(host);
  }

  // Re-pin scrub canvas/overlay while still concealed so reveal is aligned.
  if (
    shouldUseHourlyLightningHeatmap()
    && (isLightningGafZoom() || isGafLightningFigure({ layout: host.layout }))
  ) {
    await syncGafLightningHourlyScrubLayers(host).catch(() => undefined);
  }
  // Intentional seals (maximize/zoom/season) can wipe ICAO titles and colorbar
  // chrome when compare dual-panel is active — re-pin both panels.
  if (isCompareDualPanelActive() && host.dataset?.figureId === "lightning_heatmap") {
    await repinCompareLightningPanelChromeAfterSeal(host);
  }
  return true;
  } finally {
    revealLightningFigureHosts();
  }
}

async function rebuildAndSealGafLightningHost(host, section = state.displayedSection) {
  const gen = bumpLightningLayoutGeneration();
  // Only conceal the host being rebuilt (compare partner must not blink).
  concealLightningFigureHost(host);
  teardownLightningOverlay();
  // Drop sticky pins from a previous maximize/grid size before measuring anew.
  lightningPlayback.layoutPinned = false;
  lightningPlayback.pinnedWidth = null;
  lightningPlayback.pinnedHeight = null;
  lightningPlayback.pinnedMaximized = null;
  try {
  if (!host) {
    return false;
  }

  applyMaximizedChartState();
  applyChartShellHeights(section);
  unpinGafLightningCssSize(host);
  await awaitLayoutSettle();
  await awaitLayoutSettle();
  if (gen !== lightningPlayback.layoutGeneration) {
    return false;
  }

  const icao = els.icao?.value || "";
  const season = els.season?.value || "all";
  const lightningIndex = state.latestFigures.findIndex((item) => item.id === "lightning_heatmap");

  await ensureLightningGafAreasLoaded();
  await ensureLightningGafSeasonLoaded(season, {
    includeHours: state.lhMode === "hourly",
    icao,
  });
  if (gen !== lightningPlayback.layoutGeneration) {
    return false;
  }

  const hour = state.lhMode === "hourly" ? Number(els.lhHourScroller?.value ?? 12) : null;
  const figure = buildGafLightningFigure({ icao, season, hour });
  if (!figure) {
    return false;
  }
  if (state.lhMode === "hourly") {
    ensureLightningHourlyTwoTraceFigure(figure);
  }

  const settled = await measureSettledGafLightningSealBox(host, { generation: gen, attempts: 4 });
  if (!settled || gen !== lightningPlayback.layoutGeneration) {
    return false;
  }
  const { width, height } = settled;
  figure.layout = figure.layout || {};
  figure.layout.width = width;
  figure.layout.height = height;
  figure.layout.autosize = false;
  applyTopoMapPanelLayout(figure, "lightning_heatmap", {
    chartHeight: height || undefined,
    plotWidth: width || undefined,
  });
  // applyTopoMapPanelLayout deletes width — restore the shell-sized pin.
  figure.layout.width = width;
  figure.layout.height = height;
  figure.layout.autosize = false;
  // Re-assert aspect domains after width restore (layout helper may have used defaults).
  if (Array.isArray(figure.layout.meta?.gafBbox)) {
    const comparePanel = isCompareDualPanelActive();
    const margin = comparePanel ? COMPARE_LIGHTNING_PANEL_MARGIN : null;
    const mapDomains = computeGafLightningMapDomains(figure.layout.meta.gafBbox, width, height, {
      comparePanel,
      margin,
    });
    figure.layout.xaxis = {
      ...(figure.layout.xaxis || {}),
      domain: mapDomains.x,
      scaleanchor: undefined,
      scaleratio: undefined,
      constrain: undefined,
    };
    figure.layout.yaxis = {
      ...(figure.layout.yaxis || {}),
      domain: mapDomains.y,
    };
    delete figure.layout.xaxis.scaleanchor;
    delete figure.layout.xaxis.scaleratio;
    delete figure.layout.xaxis.constrain;
    if (comparePanel) {
      figure.layout.margin = {
        ...(figure.layout.margin || {}),
        ...COMPARE_LIGHTNING_PANEL_MARGIN,
      };
    }
  }

  state.lightningHeatmapScaleRef = {
    zmin: Number(figure.layout.meta.lightningZmin) || 0,
    zmax: Number(figure.layout.meta.lightningZmax) || 1,
  };
  if (lightningIndex >= 0) {
    state.latestFigures[lightningIndex] = {
      id: "lightning_heatmap",
      figure: JSON.parse(JSON.stringify(figure)),
    };
  }
  host.dataset.figureId = "lightning_heatmap";

  await Plotly.react(host, figure.data || [], figure.layout || {}, {
    displayModeBar: false,
    responsive: false,
  });
  if (gen !== lightningPlayback.layoutGeneration) {
    return false;
  }
  return sealGafLightningHost(host, { generation: gen });
  } finally {
    revealLightningFigureHosts();
  }
}

function scheduleGafLightningSeal(host) {
  if (!host) {
    return;
  }
  const measured = measureGafLightningSealTarget(host);
  const pinnedW = Math.round(Number(host.layout?.width) || 0);
  const pinnedH = Math.round(Number(host.layout?.height) || 0);
  if (
    measured.targetWidth > 40
    && measured.targetHeight > 40
    && Math.abs(pinnedW - measured.targetWidth) <= 2
    && Math.abs(pinnedH - measured.targetHeight) <= 2
  ) {
    return;
  }
  if (lightningPlayback.gafSealRaf != null) {
    cancelAnimationFrame(lightningPlayback.gafSealRaf);
  }
  lightningPlayback.gafSealRaf = requestAnimationFrame(() => {
    lightningPlayback.gafSealRaf = null;
    sealGafLightningHost(host);
  });
}

// GAF hourly scrub runs entirely on a transparent overlay that sits on top of the
// sealed base host. The base (basemap image, boundaries, airports, chrome colorbar,
// scaleanchor letterboxing) is rendered once and never restyled while scrubbing, so
// a z-only restyle on the overlay cannot re-solve layout or nudge the map/legend.
// The overlay's geometry is copied from the base's resolved `_fullLayout` *after*
// seal, so the two planes align pixel-for-pixel.
function buildGafLightningOverlayLayout(baseHost) {
  return buildLightningOverlayLayoutFromBase(baseHost, { uirevision: "gaf-lightning-overlay" });
}

function buildGafLightningOverlayDataTrace(baseHost, cropped) {
  const dataIndex = lightningHeatmapTraceIndex(baseHost);
  const base = (dataIndex >= 0 && baseHost.data?.[dataIndex]) ? baseHost.data[dataIndex] : {};
  const meta = baseHost?.layout?.meta || {};
  const zmin = Number.isFinite(Number(base.zmin)) ? Number(base.zmin) : (Number(meta.lightningZmin) || 0);
  const zmax = Number.isFinite(Number(base.zmax)) ? Number(base.zmax) : (Number(meta.lightningZmax) || 1);
  return {
    type: "heatmap",
    x: cropped.lons,
    y: cropped.lats,
    z: cropped.z,
    zmin,
    zmax,
    zauto: false,
    colorscale: base.colorscale || LIGHTNING_HEATMAP_COLORSCALE,
    opacity: Number.isFinite(Number(base.opacity)) ? Number(base.opacity) : LIGHTNING_HEATMAP_OPACITY,
    showscale: false,
    hoverongaps: false,
    hovertemplate: "Lon: %{x:.2f}°<br>Lat: %{y:.2f}°<br>Count: %{z}<extra></extra>",
    name: "__gaf_lightning_overlay",
  };
}

// Blank the base data-heatmap cells so strikes live only in the overlay. Done once
// at seal time (never during scrub); with the base fully pinned this restyle cannot
// move the plot area or colorbar.
async function blankGafLightningBaseCells(baseHost) {
  const heatIdx = lightningHeatmapTraceIndex(baseHost);
  if (heatIdx < 0) {
    return;
  }
  const z = baseHost.data?.[heatIdx]?.z;
  if (!Array.isArray(z)) {
    return;
  }
  const nullZ = z.map((row) => (Array.isArray(row) ? row.map(() => null) : null));
  await Plotly.restyle(baseHost, { z: [nullZ] }, [heatIdx]);
}

function gafHourlyCropCellCount(cropped) {
  const rows = cropped?.z?.length || 0;
  const cols = Array.isArray(cropped?.z?.[0]) ? cropped.z[0].length : (cropped?.lons?.length || 0);
  return rows * cols;
}

function gafHourlyCropUsesCanvas(cropped) {
  const cells = gafHourlyCropCellCount(cropped);
  if (cells <= 0) {
    return false;
  }
  // Regional grids are smaller than the national map but still too large to
  // restyle as SVG on every hour. Both zooms blit a pre-painted canvas.
  if (state.lhZoom === "gaf" || state.lhZoom === "region") {
    return true;
  }
  return cells >= NATIONAL_LIGHTNING_CANVAS_CELL_THRESHOLD;
}

function parseCssColor(color) {
  const match = String(color || "").match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i);
  if (!match) {
    return { r: 0, g: 0, b: 0, a: 0 };
  }
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] == null ? 1 : Number(match[4]),
  };
}

function lightningStrikeColorLut(colorscale, opacity, steps = 256) {
  const stops = (colorscale || []).map(([t, color]) => ({ t: Number(t), ...parseCssColor(color) }));
  const lut = new Uint8ClampedArray(steps * 4);
  if (!stops.length) {
    return lut;
  }
  for (let i = 0; i < steps; i += 1) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    let left = stops[0];
    let right = stops[stops.length - 1];
    for (let s = 0; s < stops.length - 1; s += 1) {
      if (t >= stops[s].t && t <= stops[s + 1].t) {
        left = stops[s];
        right = stops[s + 1];
        break;
      }
    }
    const span = right.t - left.t || 1;
    const u = Math.min(1, Math.max(0, (t - left.t) / span));
    const offset = i * 4;
    lut[offset] = left.r + (right.r - left.r) * u;
    lut[offset + 1] = left.g + (right.g - left.g) * u;
    lut[offset + 2] = left.b + (right.b - left.b) * u;
    lut[offset + 3] = (left.a + (right.a - left.a) * u) * opacity * 255;
  }
  return lut;
}

function paintLightningHourCanvas(cropped, lut, zmin, zmax) {
  const rows = cropped.z.length;
  const cols = cropped.z[0].length;
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const context = canvas.getContext("2d");
  const image = context.createImageData(cols, rows);
  const pixels = image.data;
  const span = Math.max(Number(zmax) - Number(zmin), 1e-9);
  const last = (lut.length / 4) - 1;
  for (let row = 0; row < rows; row += 1) {
    // Image row 0 is north; grid row 0 is the southern edge.
    const src = cropped.z[rows - 1 - row];
    const rowOffset = row * cols * 4;
    for (let col = 0; col < cols; col += 1) {
      const value = Number(src?.[col]);
      if (!Number.isFinite(value) || value <= 0) {
        continue;
      }
      let t = (value - zmin) / span;
      if (t < 0) t = 0;
      else if (t > 1) t = 1;
      const lutOffset = Math.round(t * last) * 4;
      const offset = rowOffset + col * 4;
      pixels[offset] = lut[lutOffset];
      pixels[offset + 1] = lut[lutOffset + 1];
      pixels[offset + 2] = lut[lutOffset + 2];
      pixels[offset + 3] = lut[lutOffset + 3];
    }
  }
  context.putImageData(image, 0, 0);
  return canvas;
}

function nationalLightningCanvasCacheKey(icao, season, zmin, zmax) {
  return `${gafLightningHourlyCropCacheKey(icao, season)}::${zmin}::${zmax}`;
}

function ensureNationalLightningHourCanvases(icao, season, zmin, zmax) {
  const key = nationalLightningCanvasCacheKey(icao, season, zmin, zmax);
  if (!lightningPlayback.gafHourCanvasPacks) {
    lightningPlayback.gafHourCanvasPacks = new Map();
  }
  const cached = lightningPlayback.gafHourCanvasPacks.get(key);
  if (cached) {
    return cached;
  }
  const cache = ensureGafLightningHourlyCropCache(icao, season);
  const sample = cache?.grids?.[0];
  if (!sample || !gafHourlyCropUsesCanvas(sample)) {
    return null;
  }
  const lut = lightningStrikeColorLut(LIGHTNING_HEATMAP_COLORSCALE, LIGHTNING_HEATMAP_OPACITY);
  const frames = cache.grids.map((grid) => paintLightningHourCanvas(grid, lut, zmin, zmax));
  const dx = sample.lons.length > 1 ? sample.lons[1] - sample.lons[0] : 0.1;
  const dy = sample.lats.length > 1 ? sample.lats[1] - sample.lats[0] : 0.1;
  const pack = {
    key,
    frames,
    grids: cache.grids,
    lons: sample.lons,
    lats: sample.lats,
    dx,
    dy,
    zmin,
    zmax,
  };
  lightningPlayback.gafHourCanvasPacks.set(key, pack);
  lightningPlayback.nationalHourCanvases = pack;
  return pack;
}

function lightningAxisPixelBox(baseHost) {
  const full = baseHost?._fullLayout || {};
  const size = full._size || {};
  const layoutMargin = baseHost?.layout?.margin || {};
  const width = baseHost.offsetWidth || baseHost.clientWidth || 0;
  const height = baseHost.offsetHeight || baseHost.clientHeight || 0;
  const marginL = Number.isFinite(size.l) ? size.l : (Number(layoutMargin.l) || 0);
  const marginR = Number.isFinite(size.r) ? size.r : (Number(layoutMargin.r) || 0);
  const marginT = Number.isFinite(size.t) ? size.t : (Number(layoutMargin.t) || 0);
  const marginB = Number.isFinite(size.b) ? size.b : (Number(layoutMargin.b) || 0);
  const innerW = Number(size.w) > 0 ? Number(size.w) : Math.max(1, width - marginL - marginR);
  const innerH = Number(size.h) > 0 ? Number(size.h) : Math.max(1, height - marginT - marginB);
  const x = full.xaxis || {};
  const y = full.yaxis || {};
  const xDom = Array.isArray(x.domain) ? x.domain : [0, 1];
  const yDom = Array.isArray(y.domain) ? y.domain : [0, 1];
  const xRange = Array.isArray(x.range) ? x.range : [0, 1];
  const yRange = Array.isArray(y.range) ? y.range : [0, 1];
  return {
    plotLeft: marginL + xDom[0] * innerW,
    plotTop: marginT + (1 - yDom[1]) * innerH,
    plotWidth: Math.max(1, (xDom[1] - xDom[0]) * innerW),
    plotHeight: Math.max(1, (yDom[1] - yDom[0]) * innerH),
    xRange,
    yRange,
  };
}

function lightningPackGeoExtent(pack) {
  return {
    x0: pack.lons[0] - pack.dx / 2,
    x1: pack.lons[pack.lons.length - 1] + pack.dx / 2,
    y0: pack.lats[0] - pack.dy / 2,
    y1: pack.lats[pack.lats.length - 1] + pack.dy / 2,
  };
}

function clipLightningExtentToAxis(extent, axis) {
  const xMin = Math.min(axis.xRange[0], axis.xRange[1]);
  const xMax = Math.max(axis.xRange[0], axis.xRange[1]);
  const yMin = Math.min(axis.yRange[0], axis.yRange[1]);
  const yMax = Math.max(axis.yRange[0], axis.yRange[1]);
  const x0 = Math.max(extent.x0, xMin);
  const x1 = Math.min(extent.x1, xMax);
  const y0 = Math.max(extent.y0, yMin);
  const y1 = Math.min(extent.y1, yMax);
  if (!(x1 > x0) || !(y1 > y0)) {
    return null;
  }
  return { x0, x1, y0, y1 };
}

function positionNationalLightningCanvas(baseHost, canvas, pack) {
  if (!baseHost || !canvas || !pack?.lons?.length || !pack?.lats?.length) {
    return;
  }
  const axis = lightningAxisPixelBox(baseHost);
  const xSpan = axis.xRange[1] - axis.xRange[0] || 1;
  const ySpan = axis.yRange[1] - axis.yRange[0] || 1;
  const packExt = lightningPackGeoExtent(pack);
  // Regional crops include a one-cell halo around the GAF bbox. Clip to the
  // axis/basemap so the hourly mask does not stick out past the topo image.
  const clip = clipLightningExtentToAxis(packExt, axis) || packExt;
  const left = axis.plotLeft + ((clip.x0 - axis.xRange[0]) / xSpan) * axis.plotWidth;
  const right = axis.plotLeft + ((clip.x1 - axis.xRange[0]) / xSpan) * axis.plotWidth;
  const top = axis.plotTop + (1 - ((clip.y1 - axis.yRange[0]) / ySpan)) * axis.plotHeight;
  const bottom = axis.plotTop + (1 - ((clip.y0 - axis.yRange[0]) / ySpan)) * axis.plotHeight;
  const cssWidth = Math.max(1, Math.round(right - left));
  const cssHeight = Math.max(1, Math.round(bottom - top));
  canvas.style.left = `${left}px`;
  canvas.style.top = `${top}px`;
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  if (canvas.width !== cssWidth || canvas.height !== cssHeight) {
    canvas.width = cssWidth;
    canvas.height = cssHeight;
  }
  canvas._lightningGeo = { packExt, clip };
}

function blitNationalLightningHour(hour, host = null) {
  const base = host || getLightningHeatmapChartHost();
  const record = base?._lightningHourCanvas;
  const canvas = record?.el;
  const pack = record?.pack;
  if (!canvas || !pack?.frames?.length) {
    return;
  }
  const idx = Math.max(0, Math.min(pack.frames.length - 1, Number(hour) || 0));
  const frame = pack.frames[idx];
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, canvas.width, canvas.height);
  const geo = canvas._lightningGeo;
  const packExt = geo?.packExt;
  const clip = geo?.clip;
  if (frame && packExt && clip) {
    const packW = packExt.x1 - packExt.x0 || 1;
    const packH = packExt.y1 - packExt.y0 || 1;
    const sx = ((clip.x0 - packExt.x0) / packW) * frame.width;
    const sy = ((packExt.y1 - clip.y1) / packH) * frame.height;
    const sw = Math.max(0.5, ((clip.x1 - clip.x0) / packW) * frame.width);
    const sh = Math.max(0.5, ((clip.y1 - clip.y0) / packH) * frame.height);
    context.drawImage(frame, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  } else if (frame) {
    context.drawImage(frame, 0, 0, canvas.width, canvas.height);
  }
  record.hour = idx;
  if (!host || base === getLightningHeatmapChartHost()) {
    lightningPlayback.nationalCanvasHour = idx;
  }
}

function detachNationalLightningHover(host) {
  if (!host) {
    return;
  }
  if (host._nationalLightningHover) {
    host.removeEventListener("pointermove", host._nationalLightningHover);
    delete host._nationalLightningHover;
  }
  if (host._nationalLightningHoverLeave) {
    host.removeEventListener("pointerleave", host._nationalLightningHoverLeave);
    delete host._nationalLightningHoverLeave;
  }
  if (host._nationalLightningTip) {
    host._nationalLightningTip.remove();
    delete host._nationalLightningTip;
  }
}

function attachNationalLightningHover(baseHost, canvas, pack) {
  const root = baseHost?.querySelector?.(":scope > .lightning-hour-overlay")
    || baseHost?.closest?.(".chart-shell")
    || baseHost;
  detachNationalLightningHover(root);
  detachNationalLightningHover(baseHost);
  const tip = document.createElement("div");
  tip.className = "national-lightning-hover";
  document.body.appendChild(tip);
  const onLeave = () => {
    tip.style.display = "none";
  };
  const onMove = (event) => {
    if (!canvas.isConnected) {
      tip.style.display = "none";
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    if (px < 0 || py < 0 || px > rect.width || py > rect.height) {
      tip.style.display = "none";
      return;
    }
    const under = document.elementFromPoint(event.clientX, event.clientY);
    if (under && under.closest(".scatterlayer")) {
      tip.style.display = "none";
      return;
    }
    const cols = pack.lons.length;
    const rows = pack.lats.length;
    const col = Math.min(cols - 1, Math.max(0, Math.floor((px / rect.width) * cols)));
    const rowFromTop = Math.min(rows - 1, Math.max(0, Math.floor((py / rect.height) * rows)));
    const row = rows - 1 - rowFromTop;
    const hour = Math.max(0, Math.min(pack.grids.length - 1, Number(els.lhHourScroller?.value) || 0));
    const value = Number(pack.grids[hour]?.z?.[row]?.[col]);
    if (!Number.isFinite(value) || value <= 0) {
      tip.style.display = "none";
      return;
    }
    const count = Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
    tip.textContent = `Lon: ${pack.lons[col].toFixed(2)}°\nLat: ${pack.lats[row].toFixed(2)}°\nCount: ${count}`;
    tip.style.display = "block";
    tip.style.left = `${event.clientX + 14}px`;
    tip.style.top = `${event.clientY + 14}px`;
  };
  root._nationalLightningHover = onMove;
  root._nationalLightningHoverLeave = onLeave;
  root._nationalLightningTip = tip;
  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerleave", onLeave);
  if (baseHost?._lightningHourCanvas) {
    baseHost._lightningHourCanvas.hoverRoot = root;
  }
}

function teardownNationalLightningCanvas(host) {
  const chartHost = host || getLightningHeatmapChartHost();
  const record = chartHost?._lightningHourCanvas;
  if (record?.hoverRoot) {
    detachNationalLightningHover(record.hoverRoot);
  }
  if (record?.el) {
    record.el.remove();
  }
  if (chartHost) {
    delete chartHost._lightningHourCanvas;
  }
  const localOverlay = chartHost?.querySelector?.(":scope > .lightning-hour-overlay[data-compare-overlay='1']");
  if (localOverlay) {
    try {
      Plotly.purge(localOverlay);
    } catch (error) {
      // ignore teardown failures
    }
    localOverlay.remove();
  }
  if (!host || chartHost === getLightningHeatmapChartHost()) {
    lightningPlayback.nationalCanvasActive = false;
    lightningPlayback.nationalCanvasHour = null;
    lightningPlayback.nationalCanvasEl = null;
    detachNationalLightningHover(chartHost?.closest?.(".chart-shell") || chartHost);
  }
}

function mountNationalLightningCanvas(baseHost, pack, hour) {
  teardownNationalLightningCanvas(baseHost);
  const canvas = document.createElement("canvas");
  canvas.className = "national-lightning-canvas";
  baseHost.appendChild(canvas);
  baseHost._lightningHourCanvas = { el: canvas, pack, active: true, hour: null, hoverRoot: null };
  if (baseHost === getLightningHeatmapChartHost()) {
    lightningPlayback.nationalCanvasEl = canvas;
    lightningPlayback.nationalCanvasActive = true;
    lightningPlayback.nationalHourCanvases = pack;
  }
  positionNationalLightningCanvas(baseHost, canvas, pack);
  blitNationalLightningHour(hour, baseHost);
  attachNationalLightningHover(baseHost, canvas, pack);
}

async function enterGafLightningScrubOverlay(baseHost, hour, { generation = null, icao = null } = {}) {
  const gen = generation == null ? lightningPlayback.layoutGeneration : generation;
  if (!baseHost || !shouldUseHourlyLightningHeatmap()) {
    return false;
  }
  const panelIcao = String(icao || resolveLightningPanelIcao(baseHost) || els.icao?.value || "").trim().toUpperCase();
  const season = els.season?.value || "all";
  const cropped = lookupGafLightningHourlyCrop(hour, panelIcao, season);
  if (!cropped) {
    return false;
  }

  await blankGafLightningBaseCells(baseHost);
  await awaitLayoutSettle();
  if (gen !== lightningPlayback.layoutGeneration) {
    return false;
  }

  if (gafHourlyCropUsesCanvas(cropped)) {
    const heatIdx = lightningHeatmapTraceIndex(baseHost);
    const baseTrace = heatIdx >= 0 ? baseHost.data?.[heatIdx] : null;
    const meta = baseHost.layout?.meta || {};
    const zmin = Number.isFinite(Number(baseTrace?.zmin))
      ? Number(baseTrace.zmin)
      : (Number(meta.lightningZmin) || 0);
    const zmax = Number.isFinite(Number(baseTrace?.zmax))
      ? Number(baseTrace.zmax)
      : (Number(meta.lightningZmax) || 1);
    const pack = ensureNationalLightningHourCanvases(panelIcao, season, zmin, zmax);
    if (!pack || gen !== lightningPlayback.layoutGeneration) {
      return false;
    }
    mountNationalLightningCanvas(baseHost, pack, hour);
    // Boundaries, rings, and aerodromes stay above the strike canvas. The
    // overlay has no heatmap, so hour changes do not redraw it.
    const overlay = ensureLightningOverlayHost(baseHost);
    if (overlay) {
      const layout = buildGafLightningOverlayLayout(baseHost);
      const boundaries = (baseHost.data || [])
        .filter((trace) => trace?.name === "__gaf_boundaries")
        .map((trace) => ({ ...JSON.parse(JSON.stringify(trace)), visible: true }));
      const boundaryIndices = [];
      (baseHost.data || []).forEach((trace, index) => {
        if (trace?.name === "__gaf_boundaries") {
          boundaryIndices.push(index);
        }
      });
      if (boundaryIndices.length) {
        await Plotly.restyle(baseHost, { visible: false }, boundaryIndices);
      }
      await deleteLightningRingTracesOnHost(baseHost);
      const rings = lightningRingTracesForCurrentView(baseHost);
      const airports = copyGafAirportTracesFromHost(baseHost).map((trace) => ({
        ...trace,
        visible: true,
      }));
      await hideGafAirportTracesOnHost(baseHost);
      overlay.classList.add("is-visible");
      await Plotly.react(overlay, [...boundaries, ...rings, ...airports], layout, {
        displayModeBar: false,
        responsive: false,
      });
    }
    if (gen !== lightningPlayback.layoutGeneration) {
      return false;
    }
    const canvasCtx = getLightningHourlyPinContext(baseHost);
    lightningPlayback.overlayActive = true;
    lightningPlayback.pinnedWidth = canvasCtx.width;
    lightningPlayback.pinnedHeight = canvasCtx.height;
    lightningPlayback.pinnedMaximized = canvasCtx.maximized;
    return true;
  }

  const overlay = ensureLightningOverlayHost(baseHost);
  if (!overlay) {
    return false;
  }
  const layout = buildGafLightningOverlayLayout(baseHost);
  const trace = buildGafLightningOverlayDataTrace(baseHost, cropped);
  // Rings + airport labels live on the overlay (it paints above the sealed base).
  // Copy airports before hiding the base copies, otherwise the overlay inherits
  // visible:false and labels disappear.
  await deleteLightningRingTracesOnHost(baseHost);
  const rings = lightningRingTracesForCurrentView(baseHost);
  const airports = copyGafAirportTracesFromHost(baseHost).map((trace) => ({
    ...trace,
    visible: true,
  }));
  await hideGafAirportTracesOnHost(baseHost);
  overlay.classList.add("is-visible");
  await Plotly.react(overlay, [trace, ...rings, ...airports], layout, {
    displayModeBar: false,
    responsive: false,
  });
  if (gen !== lightningPlayback.layoutGeneration) {
    return false;
  }
  const ctx = getLightningHourlyPinContext(baseHost);
  lightningPlayback.overlayActive = true;
  lightningPlayback.pinnedWidth = ctx.width;
  lightningPlayback.pinnedHeight = ctx.height;
  lightningPlayback.pinnedMaximized = ctx.maximized;
  return true;
}

async function restyleGafLightningHour(host, hour) {
  const record = host?._lightningHourCanvas;
  if (record?.active && record.el && record.pack) {
    positionNationalLightningCanvas(host, record.el, record.pack);
    blitNationalLightningHour(hour, host);
    return;
  }
  const overlay = getLightningOverlayHost();
  if (!overlay || !overlay.data?.length) {
    return;
  }
  const icao = els.icao?.value || "";
  const season = els.season?.value || "all";
  const cropped = lookupGafLightningHourlyCrop(hour, icao, season);
  if (!cropped) {
    return;
  }
  lightningPlayback.frameUpdating = true;
  try {
    await Plotly.restyle(overlay, { z: [cropped.z] }, [0]);
  } finally {
    lightningPlayback.frameUpdating = false;
  }
}

const LIGHTNING_OVERLAY_HOVERTEMPLATE = "E: %{x:.1f} km<br>N: %{y:.1f} km<br>Count: %{z}<extra></extra>";

function buildLightningOverlayDataTrace(baseHost, z) {
  const dataIndex = lightningHeatmapTraceIndex(baseHost);
  const base = (dataIndex >= 0 && baseHost.data?.[dataIndex]) ? baseHost.data[dataIndex] : {};
  return {
    type: "heatmap",
    x: Array.isArray(base.x) ? base.x.slice() : undefined,
    y: Array.isArray(base.y) ? base.y.slice() : undefined,
    z,
    zmin: base.zmin,
    zmax: base.zmax,
    zauto: false,
    colorscale: base.colorscale || LIGHTNING_HEATMAP_COLORSCALE,
    opacity: Number.isFinite(Number(base.opacity)) ? Number(base.opacity) : LIGHTNING_HEATMAP_OPACITY,
    showscale: false,
    hoverongaps: false,
    hovertemplate: typeof base.hovertemplate === "string" ? base.hovertemplate : LIGHTNING_OVERLAY_HOVERTEMPLATE,
    name: "__lightning_overlay",
  };
}

function lightningOverlayZFromGrid(baseHost, zGrid) {
  const meta = baseHost?.layout?.meta || {};
  return Array.isArray(zGrid?.[0]) ? zGrid : buildLightningHeatmapZFromGrid(zGrid, meta);
}

async function enterLightningHourlyOverlay(baseHost, zGrid) {
  if (!baseHost || !shouldUseHourlyLightningHeatmap()) {
    return;
  }
  const overlay = ensureLightningOverlayHost(baseHost);
  if (!overlay) {
    return;
  }
  const z = lightningOverlayZFromGrid(baseHost, zGrid);
  const trace = buildLightningOverlayDataTrace(baseHost, z);
  // Rings must live on the overlay (above the sealed base). Clear base ring
  // traces AND lite/backend circle shapes so the transparent overlay does not
  // stack a second pair underneath (reads as a black outline).
  await clearLightningRingShapesOnHost(baseHost);
  await deleteLightningRingTracesOnHost(baseHost);
  const rings = buildAerodromeLightningRingTraces();
  await awaitLayoutSettle();
  const layout = buildLightningOverlayLayout(baseHost);
  overlay.classList.add("is-visible");
  await Plotly.react(overlay, [trace, ...rings], layout, { displayModeBar: false, responsive: false });
  positionLightningOverlay(baseHost, overlay);
  const ctx = getLightningHourlyPinContext(baseHost);
  if (!ctx.width || !ctx.height) {
    return;
  }
  lightningPlayback.overlayActive = true;
  lightningPlayback.pinnedWidth = ctx.width;
  lightningPlayback.pinnedHeight = ctx.height;
  lightningPlayback.pinnedMaximized = ctx.maximized;
}

async function syncPrimaryLocalLightningHourlyOverlay(host) {
  if (!host || host.dataset?.figureId !== "lightning_heatmap") {
    return;
  }
  if (!shouldUseHourlyLightningHeatmap() || isLightningGafZoom() || isGafLightningFigure({ layout: host.layout })) {
    return;
  }
  if (!lightningOverlayMatchesContext(host)) {
    await enterLightningHourlyOverlayCurrent(host);
    return;
  }
  positionLightningOverlay(host, getLightningOverlayHost());
}

async function enterLightningHourlyOverlayCurrent(baseHost) {
  if (!baseHost || !shouldUseHourlyLightningHeatmap()) {
    return;
  }
  const icao = els.icao.value;
  const season = els.season.value;
  const hour = els.lhHourScroller?.value ?? "12";
  try {
    await ensureLightningHourlyFramesLoaded(icao);
  } catch (error) {
    return;
  }
  const zGrid = lookupLiteLightningHourlyGrid(lightningPlayback.liteHourlyMap, season, hour);
  await awaitLayoutSettle();
  await enterLightningHourlyOverlay(baseHost, zGrid);
}

function lightningOverlayMatchesContext(baseHost) {
  if (!lightningPlayback.overlayActive) {
    return false;
  }
  const overlay = getLightningOverlayHost();
  if (!overlay || !overlay.data?.length) {
    return false;
  }
  const ctx = getLightningHourlyPinContext(baseHost);
  return lightningPlayback.pinnedWidth === ctx.width
    && lightningPlayback.pinnedHeight === ctx.height
    && lightningPlayback.pinnedMaximized === ctx.maximized;
}

function renderLightningOverlayFrame(zGrid) {
  const overlay = getLightningOverlayHost();
  if (!overlay || !overlay.data?.length) {
    return Promise.resolve();
  }
  const baseHost = getLightningHeatmapChartHost();
  const z = lightningOverlayZFromGrid(baseHost, zGrid);
  lightningPlayback.frameUpdating = true;
  return Plotly.restyle(overlay, { z: [z] }, [0]).finally(() => {
    lightningPlayback.frameUpdating = false;
  });
}

function teardownLightningHourOverlayElement(overlay) {
  if (!overlay) {
    return;
  }
  try {
    Plotly.purge(overlay);
  } catch (error) {
    // ignore teardown failures
  }
  overlay.classList.remove("is-visible");
  if (overlay.parentElement) {
    overlay.parentElement.removeChild(overlay);
  }
}

function teardownLightningOverlay() {
  lightningPlayback.overlayActive = false;
  const primaryHost = getLightningHeatmapChartHost();
  teardownNationalLightningCanvas(primaryHost);
  const compareHost = maximizedCompareUi()?.compareHost;
  if (compareHost && compareHost !== primaryHost) {
    teardownNationalLightningCanvas(compareHost);
    teardownLightningHourOverlayElement(
      compareHost.querySelector(":scope > .lightning-hour-overlay"),
    );
  }
  teardownLightningHourOverlayElement(getLightningOverlayHost());
  teardownLightningHourOverlayElement(
    primaryHost?.querySelector?.(":scope > .lightning-hour-overlay"),
  );
}

async function sealLightningHourlyPlot(host) {
  if (!host?.data?.length || !state.lightningHeatmapLayoutRef) {
    return;
  }
  const data = JSON.parse(JSON.stringify(host.data));
  const layout = state.lightningHeatmapLayoutRef;
  await Plotly.react(host, data, layout, {
    displayModeBar: false,
    responsive: false,
  });
}

function getLightningHourlyPinContext(host) {
  const index = state.latestFigures.findIndex((item) => item.id === "lightning_heatmap");
  const isMaximized = Number.isInteger(state.maximizedChartIndex) && state.maximizedChartIndex === index;
  return {
    width: Math.round(host?.offsetWidth || host?.clientWidth || 0),
    height: Math.round(host?.offsetHeight || host?.clientHeight || 0),
    maximized: isMaximized,
  };
}

function lightningHourlyPinMatchesContext(host) {
  if (!lightningPlayback.layoutPinned || !state.lightningHeatmapLayoutRef) {
    return false;
  }
  const ctx = getLightningHourlyPinContext(host);
  return lightningPlayback.pinnedWidth === ctx.width
    && lightningPlayback.pinnedHeight === ctx.height
    && lightningPlayback.pinnedMaximized === ctx.maximized;
}

async function finalizeLightningHourlyLayoutPin(host) {
  if (!host || !shouldUseHourlyLightningHeatmap()) {
    return;
  }

  await awaitLayoutSettle();
  const layoutPatch = buildLightningHeatmapLayoutPinPatch(host);
  await Plotly.relayout(host, layoutPatch);
  await awaitLayoutSettle();

  state.lightningHeatmapLayoutRef = captureLightningHeatmapLayoutSnapshot(host);
  const traceIndex = lightningHeatmapTraceIndex(host);
  if (traceIndex >= 0) {
    state.lightningHeatmapPinnedTraceRef = JSON.parse(JSON.stringify(host.data[traceIndex]));
  }

  await sealLightningHourlyPlot(host);
  await awaitLayoutSettle();
  state.lightningHeatmapLayoutRef = captureLightningHeatmapLayoutSnapshot(host);
  if (traceIndex >= 0) {
    state.lightningHeatmapPinnedTraceRef = JSON.parse(JSON.stringify(host.data[traceIndex]));
  }

  const ctx = getLightningHourlyPinContext(host);
  lightningPlayback.pinnedWidth = ctx.width;
  lightningPlayback.pinnedHeight = ctx.height;
  lightningPlayback.pinnedMaximized = ctx.maximized;
  lightningPlayback.layoutPinned = true;
}

function resetLightningHourlyLayoutState() {
  teardownLightningOverlay();
  bumpLightningLayoutGeneration();
  lightningPlayback.gafHourlyCropCaches.clear();
  lightningPlayback.gafHourlyCropCache = null;
  lightningPlayback.layoutPinned = false;
  lightningPlayback.pinnedWidth = null;
  lightningPlayback.pinnedHeight = null;
  lightningPlayback.pinnedMaximized = null;
  state.lightningHeatmapLayoutRef = null;
  state.lightningHeatmapPinnedTraceRef = null;
  // The native scale cache is keyed by zoom, so this only drops the active
  // pointer. Scrubbing never calls this and keeps the cached scale.
  state.lightningHeatmapHourlyScaleRef = null;
  state.lightningHeatmapHourlyScaleKey = null;
  syncLightningHourlyColorbarVisibility();
}

const lightningPlayback = {
  timer: null,
  playing: false,
  suppressSliderFetch: false,
  sliderScrubbing: false,
  scrubAppliedHour: null,
  renderInFlight: false,
  liteHourlyMap: null,
  liteHourlyIcao: null,
  gafAreas: null,
  // Pack cubes keyed by lightningGafPackKey(season, view). Dual-panel compare
  // can keep primary + compare GAF packs resident at once.
  gafSeasonPacks: new Map(),
  // Convenience pointer at the last pack touched (usually primary). Prefer
  // resolveLightningGafSeasonPack / ensureLightningGafSeasonLoaded(icao=…).
  gafSeasonMap: null,
  gafSeasonKey: null,
  gafHoursLoaded: false,
  // Hourly crops keyed by gafLightningHourlyCropCacheKey(icao, season).
  gafHourlyCropCaches: new Map(),
  gafHourlyCropCache: null,
  gafIdlePrefetchHandle: null,
  layoutPinned: false,
  layoutGeneration: 0,
  frameUpdating: false,
  pendingHour: null,
  pinnedWidth: null,
  pinnedHeight: null,
  pinnedMaximized: null,
  overlayActive: false,
  gafSealRaf: null,
  nationalCanvasActive: false,
  nationalCanvasEl: null,
  nationalHourCanvases: null,
  gafHourCanvasPacks: new Map(),
};

function bumpLightningLayoutGeneration() {
  lightningPlayback.layoutGeneration += 1;
  return lightningPlayback.layoutGeneration;
}

function isLightningGafZoom() {
  return state.lhZoom === "gaf" || state.lhZoom === "region";
}

const LIGHTNING_ZOOM_OPTIONS = [
  { key: "local", label: "Local", title: "Local 30 km lightning near the aerodrome" },
  { key: "gaf", label: "Regional", title: "Regional GAF-area (or offshore pair) lightning" },
  { key: "region", label: "National", title: "National Australia lightning domain" },
];

function isGafLightningFigure(figure) {
  return String(figure?.layout?.meta?.lightningView || "") === "gaf";
}

function liteLightningGafAreasUrl() {
  return "data-lite/lightning_gaf/areas.json";
}

function lightningGafPackId(view = lightningGafViewSpec()) {
  if (!view || view.kind === "region") {
    return null;
  }
  return view.pair || view.gaf || null;
}

function lightningGafPackKey(season, view = lightningGafViewSpec()) {
  const seasonKey = liteSectionKey(season);
  const packId = lightningGafPackId(view);
  if (!packId) {
    return `${seasonKey}::region`;
  }
  return `${seasonKey}::${view.kind}::${packId}`;
}

function liteLightningGafSummaryUrl(season, view = lightningGafViewSpec()) {
  const seasonKey = liteSectionKey(season);
  const packId = lightningGafPackId(view);
  if (!packId) {
    return `data-lite/lightning_gaf/${seasonKey}.summary.json.gz`;
  }
  return `data-lite/lightning_gaf/${seasonKey}/${packId}.summary.json.gz`;
}

function liteLightningGafHoursUrl(season, view = lightningGafViewSpec()) {
  const seasonKey = liteSectionKey(season);
  const packId = lightningGafPackId(view);
  if (!packId) {
    return `data-lite/lightning_gaf/${seasonKey}.hours.json.gz`;
  }
  return `data-lite/lightning_gaf/${seasonKey}/${packId}.hours.json.gz`;
}

function liteLightningGafImageUrl(imageName) {
  return withLiteDataVersion(`data-lite/lightning_gaf/${imageName}`);
}

async function ensureLightningGafAreasLoaded() {
  if (lightningPlayback.gafAreas) {
    return lightningPlayback.gafAreas;
  }
  // Plain JSON only — skip the .gz probe to avoid a guaranteed 404.
  lightningPlayback.gafAreas = await fetchJsonCached(liteLightningGafAreasUrl(), { preferGzip: false });
  return lightningPlayback.gafAreas;
}

function cancelGafHourlyIdlePrefetch() {
  const handle = lightningPlayback.gafIdlePrefetchHandle;
  if (handle == null) {
    return;
  }
  if (typeof cancelIdleCallback === "function") {
    cancelIdleCallback(handle);
  } else {
    clearTimeout(handle);
  }
  lightningPlayback.gafIdlePrefetchHandle = null;
}

function scheduleGafHourlyIdlePrefetch(season = els.season?.value || "all") {
  if (!isLightningGafZoom() || state.lhMode === "hourly") {
    return;
  }
  cancelGafHourlyIdlePrefetch();
  const run = () => {
    lightningPlayback.gafIdlePrefetchHandle = null;
    if (!isLightningGafZoom() || state.lhMode === "hourly") {
      return;
    }
    ensureLightningGafSeasonLoaded(season, { includeHours: true, silent: true })
      .then(() => {
        ensureGafLightningHourlyCropCache(els.icao?.value, season);
        ensureLightningGafHourlyScale(els.icao?.value, season);
      })
      .catch(() => {});
  };
  if (typeof requestIdleCallback === "function") {
    lightningPlayback.gafIdlePrefetchHandle = requestIdleCallback(run, { timeout: 2500 });
  } else {
    lightningPlayback.gafIdlePrefetchHandle = setTimeout(run, 400);
  }
}

function clearLightningGafSeasonPackState() {
  lightningPlayback.gafSeasonPacks.clear();
  lightningPlayback.gafHourlyCropCaches.clear();
  lightningPlayback.gafSeasonMap = null;
  lightningPlayback.gafSeasonKey = null;
  lightningPlayback.gafHoursLoaded = false;
  lightningPlayback.gafHourlyCropCache = null;
}

function syncLightningGafSeasonSingleton(packKey, entry) {
  if (!entry) {
    lightningPlayback.gafSeasonMap = null;
    lightningPlayback.gafSeasonKey = null;
    lightningPlayback.gafHoursLoaded = false;
    return;
  }
  lightningPlayback.gafSeasonMap = entry.data;
  lightningPlayback.gafSeasonKey = packKey;
  lightningPlayback.gafHoursLoaded = Boolean(entry.hoursLoaded);
}

function resolveLightningGafSeasonPack(season = els.season?.value || "all", icao = els.icao?.value) {
  const view = lightningGafViewSpec(icao);
  if (!view) {
    return null;
  }
  const packKey = lightningGafPackKey(season, view);
  const entry = lightningPlayback.gafSeasonPacks.get(packKey);
  return entry?.data || null;
}

async function ensureLightningGafSeasonLoaded(
  season = els.season?.value || "all",
  { includeHours = false, silent = false, icao = els.icao?.value } = {},
) {
  await ensureLightningGafAreasLoaded();
  const view = lightningGafViewSpec(icao);
  if (!view) {
    return null;
  }
  const packKey = lightningGafPackKey(season, view);
  const needHours = includeHours || state.lhMode === "hourly";
  let entry = lightningPlayback.gafSeasonPacks.get(packKey) || null;
  const havePack = Boolean(entry?.data);
  if (havePack && (!needHours || entry.hoursLoaded)) {
    syncLightningGafSeasonSingleton(packKey, entry);
    return entry.data;
  }

  const beginPackLoad = (message) => {
    if (silent) {
      return false;
    }
    return announceNestedLoading(message);
  };

  if (havePack && needHours && !entry.hoursLoaded) {
    const hoursUrl = liteLightningGafHoursUrl(season, view);
    const needsFetch = !liteCache.has(hoursUrl);
    const ownedLoading = needsFetch ? beginPackLoad("Loading hourly lightning...") : false;
    try {
      const hoursPayload = await fetchJsonCached(hoursUrl);
      entry.data.hours = hoursPayload.hours;
      entry.hoursLoaded = true;
      lightningPlayback.gafSeasonPacks.set(packKey, entry);
      lightningPlayback.gafHourlyCropCaches.delete(gafLightningHourlyCropCacheKey(icao, season));
    } finally {
      releaseNestedLoading(ownedLoading);
    }
    syncLightningGafSeasonSingleton(packKey, entry);
    return entry.data;
  }

  const summaryUrl = liteLightningGafSummaryUrl(season, view);
  const needsSummaryFetch = !liteCache.has(summaryUrl);
  const ownedSummaryLoading = needsSummaryFetch
    ? beginPackLoad("Preparing regional lightning...")
    : false;
  try {
    const summaryPayload = await fetchJsonCached(summaryUrl);
    entry = {
      data: summaryPayload,
      hoursLoaded: Array.isArray(summaryPayload.hours) && summaryPayload.hours.length >= 24,
    };
    lightningPlayback.gafSeasonPacks.set(packKey, entry);
    // Pack swap invalidates crops for this key only — keep the other panel's cache.
    const cropKey = gafLightningHourlyCropCacheKey(icao, season);
    if (cropKey) {
      lightningPlayback.gafHourlyCropCaches.delete(cropKey);
    }
  } finally {
    releaseNestedLoading(ownedSummaryLoading);
  }

  if (needHours && entry && !entry.hoursLoaded) {
    const hoursUrl = liteLightningGafHoursUrl(season, view);
    const needsHoursFetch = !liteCache.has(hoursUrl);
    const ownedHoursLoading = needsHoursFetch
      ? beginPackLoad("Loading hourly lightning...")
      : false;
    try {
      const hoursPayload = await fetchJsonCached(hoursUrl);
      entry.data.hours = hoursPayload.hours;
      entry.hoursLoaded = true;
      lightningPlayback.gafSeasonPacks.set(packKey, entry);
    } finally {
      releaseNestedLoading(ownedHoursLoading);
    }
  }

  syncLightningGafSeasonSingleton(packKey, entry);
  return entry?.data || null;
}

function lightningGafAirportInfo(icao = els.icao?.value) {
  const code = String(icao || "").trim().toUpperCase();
  const areas = lightningPlayback.gafAreas;
  return areas?.airports?.[code] || null;
}

function lightningGafViewSpec(icao = els.icao?.value) {
  const areas = lightningPlayback.gafAreas;
  if (!areas) {
    return null;
  }
  const airport = lightningGafAirportInfo(icao);
  if (state.lhZoom === "region") {
    return {
      kind: "region",
      title: "Lightning Strike Frequency",
      bbox: areas.region.bbox,
      image: areas.region.image,
      rings: null,
      airport,
    };
  }

  const pairId = airport?.pair;
  const pair = pairId ? areas.pairs?.[pairId] : null;
  if (pair) {
    return {
      kind: "pair",
      title: "Lightning Strike Frequency",
      bbox: pair.bbox,
      image: pair.image,
      rings: null,
      airport,
      pair: pairId,
    };
  }

  const gafCode = airport?.gaf;
  const area = gafCode ? areas.areas?.[gafCode] : null;
  if (!area) {
    return null;
  }
  return {
    kind: "gaf",
    title: "Lightning Strike Frequency",
    bbox: area.bbox,
    image: area.image,
    rings: area.rings || null,
    airport,
    gaf: gafCode,
  };
}

function pointInLonLatRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersects = ((yi > lat) !== (yj > lat))
      && (lon < (((xj - xi) * (lat - yi)) / ((yj - yi) || 1e-12)) + xi);
    if (intersects) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInLonLatRings(lon, lat, rings) {
  if (!Array.isArray(rings) || !rings.length) {
    return true;
  }
  return rings.some((ring) => pointInLonLatRing(lon, lat, ring));
}

function cropLightningGafGrid(fullGrid, seasonMeta, bbox, rings = null) {
  const cell = Number(seasonMeta.cell) || 0.1;
  const latMin = Number(seasonMeta.latMin);
  const lonMin = Number(seasonMeta.lonMin);
  const nlat = Number(seasonMeta.nlat) || fullGrid.length;
  const nlon = Number(seasonMeta.nlon) || (fullGrid[0]?.length || 0);
  const [bLatMin, bLatMax, bLonMin, bLonMax] = bbox;

  const i0 = Math.max(0, Math.floor((bLatMin - latMin) / cell));
  const i1 = Math.min(nlat - 1, Math.ceil((bLatMax - latMin) / cell));
  const j0 = Math.max(0, Math.floor((bLonMin - lonMin) / cell));
  const j1 = Math.min(nlon - 1, Math.ceil((bLonMax - lonMin) / cell));

  const lats = [];
  const lons = [];
  for (let i = i0; i <= i1; i += 1) {
    lats.push(latMin + i * cell);
  }
  for (let j = j0; j <= j1; j += 1) {
    lons.push(lonMin + j * cell);
  }

  const z = [];
  for (let ii = 0; ii < lats.length; ii += 1) {
    const i = i0 + ii;
    const row = [];
    const srcRow = fullGrid[i] || [];
    for (let jj = 0; jj < lons.length; jj += 1) {
      const j = j0 + jj;
      const value = Number(srcRow[j]);
      if (!Number.isFinite(value) || value <= 0 || !pointInLonLatRings(lons[jj], lats[ii], rings)) {
        row.push(null);
      } else {
        row.push(value);
      }
    }
    z.push(row);
  }
  return { lats, lons, z };
}

function gafLightningHourlyCropCacheKey(icao, season) {
  const view = lightningGafViewSpec(icao);
  if (!view) {
    return null;
  }
  return lightningGafPackKey(season, view);
}

function ensureGafLightningHourlyCropCache(icao, season) {
  const key = gafLightningHourlyCropCacheKey(icao, season);
  if (!key) {
    return null;
  }
  const cached = lightningPlayback.gafHourlyCropCaches.get(key);
  if (cached) {
    lightningPlayback.gafHourlyCropCache = cached;
    return cached;
  }
  const seasonMeta = resolveLightningGafSeasonPack(season, icao);
  const view = lightningGafViewSpec(icao);
  if (!seasonMeta || !view || !Array.isArray(seasonMeta.hours) || seasonMeta.hours.length < 24) {
    return null;
  }
  const grids = [];
  for (let hour = 0; hour < 24; hour += 1) {
    grids.push(cropLightningGafGrid(seasonMeta.hours[hour] || [], seasonMeta, view.bbox, null));
  }
  const next = { key, grids };
  lightningPlayback.gafHourlyCropCaches.set(key, next);
  lightningPlayback.gafHourlyCropCache = next;
  return next;
}

function lookupGafLightningHourlyCrop(hour, icao, season) {
  const cache = ensureGafLightningHourlyCropCache(icao, season);
  if (!cache?.grids?.length) {
    return null;
  }
  const idx = Number(hour);
  if (Number.isInteger(idx) && idx >= 0 && idx < cache.grids.length) {
    return cache.grids[idx];
  }
  return cache.grids[0];
}

function lightningGafColorRange(z) {
  const positives = [];
  (z || []).forEach((row) => {
    (Array.isArray(row) ? row : [row]).forEach((value) => {
      const numeric = Number(value);
      if (Number.isFinite(numeric) && numeric > 0) {
        positives.push(numeric);
      }
    });
  });
  if (!positives.length) {
    return { zmin: 0, zmax: 1 };
  }
  positives.sort((a, b) => a - b);
  const zmin = positives[0];
  const idx = Math.min(positives.length - 1, Math.floor((positives.length - 1) * (LIGHTNING_HEATMAP_COLOR_PERCENTILE / 100)));
  let zmax = positives[idx];
  const peak = positives[positives.length - 1];
  if (zmax >= peak * 0.98) {
    zmax = peak;
  }
  return { zmin, zmax: Math.max(zmax, zmin + 1) };
}

function computeLightningGafHourlyScaleFromGrids(grids) {
  if (!Array.isArray(grids) || !grids.length) {
    return null;
  }
  const positives = [];
  grids.forEach((grid) => {
    (grid?.z || []).forEach((row) => {
      (Array.isArray(row) ? row : []).forEach((value) => {
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) {
          positives.push(numeric);
        }
      });
    });
  });
  if (!positives.length) {
    return { zmin: 0, zmax: 1 };
  }
  positives.sort((a, b) => a - b);
  const zmin = positives[0];
  const idx = Math.min(positives.length - 1, Math.floor((positives.length - 1) * (LIGHTNING_HEATMAP_COLOR_PERCENTILE / 100)));
  let zmax = positives[idx] * LIGHTNING_HOURLY_SCALE_HEADROOM;
  const peak = positives[positives.length - 1];
  zmax = Math.min(Math.max(zmax, zmin + 1), peak);
  return { zmin, zmax };
}

function ensureLightningGafHourlyScale(icao, season) {
  const code = String(icao || els.icao?.value || "").trim().toUpperCase();
  const seasonKey = String(season || "all");
  const cached = lookupLightningNativeScale(code, seasonKey);
  if (cached) {
    publishPrimaryHourlyScalePointer(code, cached);
    return cached;
  }
  const cache = ensureGafLightningHourlyCropCache(code, seasonKey);
  const scale = computeLightningGafHourlyScaleFromGrids(cache?.grids);
  const stored = rememberLightningNativeScale(code, seasonKey, scale, { mode: "hourly" });
  if (stored) {
    publishPrimaryHourlyScalePointer(code, stored);
  }
  return stored;
}

function lightningGafBoundaryTraces(areasPayload = lightningPlayback.gafAreas, bbox = null) {
  const areas = areasPayload?.areas;
  if (!areas || typeof areas !== "object") {
    return [];
  }
  const xs = [];
  const ys = [];
  const clipBbox = Array.isArray(bbox) && bbox.length === 4 ? bbox : null;
  Object.values(areas).forEach((area) => {
    (area?.rings || []).forEach((ring) => {
      if (!Array.isArray(ring) || ring.length < 3) {
        return;
      }
      if (clipBbox) {
        appendRingClippedToBbox(xs, ys, ring, clipBbox);
        return;
      }
      ring.forEach((pt) => {
        xs.push(Number(pt[0]));
        ys.push(Number(pt[1]));
      });
      // Close the ring, then break before the next polygon.
      xs.push(Number(ring[0][0]), null);
      ys.push(Number(ring[0][1]), null);
    });
  });
  if (!xs.length) {
    return [];
  }
  return [{
    type: "scatter",
    mode: "lines",
    x: xs,
    y: ys,
    line: { color: "rgba(20, 20, 20, 0.85)", width: 1.25 },
    hoverinfo: "skip",
    cliponaxis: true,
    showlegend: false,
    name: "__gaf_boundaries",
  }];
}

function buildGafAirportScatterTrace({ lons, lats, texts, sizes, color, name }) {
  return {
    type: "scatter",
    mode: "markers+text",
    x: lons,
    y: lats,
    text: texts,
    textposition: "top left",
    textfont: {
      size: 8,
      color,
      family: "Source Sans 3, Open Sans, Arial, sans-serif",
    },
    marker: {
      size: sizes,
      color,
      symbol: "circle",
      line: { width: 0 },
    },
    hovertemplate: "%{text}<br>Lon: %{x:.3f}°<br>Lat: %{y:.3f}°<extra></extra>",
    cliponaxis: true,
    showlegend: false,
    name,
  };
}

const LIGHTNING_RING_TRACE_NAME = "__lightning_ring";

function buildLightningRingCircle(cx, cy, rx, ry, segments = 96) {
  const xs = [];
  const ys = [];
  for (let i = 0; i <= segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    xs.push(cx + rx * Math.cos(angle));
    ys.push(cy + ry * Math.sin(angle));
  }
  return { xs, ys };
}

function lightningRingTrace(xs, ys) {
  return {
    type: "scatter",
    mode: "lines",
    x: xs,
    y: ys,
    line: { color: "rgba(255,255,255,0.95)", width: 1.5 },
    hoverinfo: "skip",
    showlegend: false,
    cliponaxis: true,
    name: LIGHTNING_RING_TRACE_NAME,
  };
}

function buildAerodromeLightningRingTraces(radii = LIGHTNING_HEATMAP_RING_RADII_KM) {
  return radii.map((radius) => {
    const { xs, ys } = buildLightningRingCircle(0, 0, radius, radius);
    return lightningRingTrace(xs, ys);
  });
}

// Range rings on the GAF view are drawn in lon/lat, so a constant ground radius
// becomes an ellipse: longitude degrees shrink with the cosine of the latitude.
function buildGafLightningRingTracesForAirport(airport) {
  const lat = Number(airport?.lat);
  const lon = Number(airport?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return [];
  }
  const kmPerLat = 111.32;
  const kmPerLon = Math.max(kmPerLat * Math.cos((lat * Math.PI) / 180), 1e-6);
  return LIGHTNING_HEATMAP_RING_RADII_KM.map((radiusKm) => {
    const { xs, ys } = buildLightningRingCircle(
      lon,
      lat,
      radiusKm / kmPerLon,
      radiusKm / kmPerLat,
    );
    return lightningRingTrace(xs, ys);
  });
}

function buildGafLightningRingTraces(view, { includeCompare = false } = {}) {
  if (!view) {
    return [];
  }
  // National rings are off by default; enable when Compare highlights a second aerodrome.
  if (view.kind === "region" && !(includeCompare && isNationalLightningCompareMode())) {
    return [];
  }
  const sameGafCompare = view.kind !== "region" && includeCompare && isRegionalLightningSameGafCompare();
  if ((view.kind === "region" && includeCompare && isNationalLightningCompareMode()) || sameGafCompare) {
    const primaryAirport = view.airport || lightningGafAirportInfo(els.icao?.value);
    const compareAirport = lightningGafAirportInfo(normalizedCompareIcao());
    return [
      ...buildGafLightningRingTracesForAirport(primaryAirport),
      ...buildGafLightningRingTracesForAirport(compareAirport),
    ];
  }
  return buildGafLightningRingTracesForAirport(view.airport);
}

function stripLightningRingArtifacts(figure) {
  if (!figure) {
    return;
  }
  figure.data = (figure.data || []).filter((trace) => trace?.name !== LIGHTNING_RING_TRACE_NAME);
  figure.layout = figure.layout || {};
  figure.layout.shapes = filterNonLightningRingShapes(figure.layout.shapes);
}

function isLightningRingCircleShape(shape) {
  return shape?.type === "circle" && shape?.xref === "x" && shape?.yref === "y";
}

function filterNonLightningRingShapes(shapes) {
  return (shapes || []).filter((shape) => !isLightningRingCircleShape(shape));
}

function isLightningHourOverlayHost(host) {
  return Boolean(host?.classList?.contains("lightning-hour-overlay"));
}

function lightningBaseHostHasActiveRingOverlay(host) {
  if (!host || isLightningHourOverlayHost(host) || !lightningPlayback.overlayActive) {
    return false;
  }
  const overlay = getLightningHourOverlayForHost(host) || getLightningOverlayHost();
  return Boolean(
    overlay
    && overlay !== host
    && overlay.classList?.contains("is-visible")
    && lightningRingTraceIndices(overlay).length > 0,
  );
}

// Live-host counterpart to stripLightningRingArtifacts: drop backend/lite circle
// shapes so Local rings are scatter traces only (avoids stacked white strokes
// that read as a dark outline / concentric bullseye).
async function clearLightningRingShapesOnHost(host) {
  if (!host?.layout) {
    return;
  }
  const next = filterNonLightningRingShapes(host.layout.shapes);
  host.layout.shapes = next;
  // Always push through Plotly. The previous early-return when host.layout
  // looked empty left stale _fullLayout / SVG circles that stacked with
  // __lightning_ring scatter traces into a black/white bullseye.
  await Plotly.relayout(host, { shapes: next });
}

function lightningRingTraceIndices(hostOrFigure) {
  const data = hostOrFigure?.data || hostOrFigure?.figure?.data || [];
  const indices = [];
  data.forEach((entry, index) => {
    if (entry?.name === LIGHTNING_RING_TRACE_NAME) {
      indices.push(index);
    }
  });
  return indices;
}

async function deleteLightningRingTracesOnHost(host) {
  const indices = lightningRingTraceIndices(host);
  if (!indices.length) {
    return;
  }
  await Plotly.deleteTraces(host, indices);
}

function copyGafAirportTracesFromHost(baseHost) {
  return (baseHost?.data || [])
    .filter((trace) => String(trace?.name || "").startsWith("__gaf_airports"))
    .map((trace) => JSON.parse(JSON.stringify(trace)));
}

async function hideGafAirportTracesOnHost(host) {
  const indices = [];
  (host?.data || []).forEach((trace, index) => {
    if (String(trace?.name || "").startsWith("__gaf_airports")) {
      indices.push(index);
    }
  });
  if (!indices.length) {
    return;
  }
  await Plotly.restyle(host, { visible: false }, indices);
}

function applyLightningHeatmapRingOverlays(figure) {
  stripLightningRingArtifacts(figure);
  figure.data = figure.data || [];
  figure.data.push(...buildAerodromeLightningRingTraces());
  figure.layout = figure.layout || {};
  figure.layout.annotations = (figure.layout.annotations || []).filter(
    (entry) => !(entry?.xref === "x" && entry?.yref === "y"
      && LIGHTNING_HEATMAP_RING_RADII_KM.includes(Number(entry?.y))),
  );
}

function resolveLightningPanelIcao(host = null) {
  const metaIcao = String(host?.layout?.meta?.gafIcao || "").trim().toUpperCase();
  if (metaIcao) {
    return metaIcao;
  }
  if (host && isCompareDualPanelActive()) {
    const compareHost = maximizedCompareUi()?.compareHost;
    if (host === compareHost) {
      return normalizedCompareIcao() || String(els.icao?.value || "").trim().toUpperCase();
    }
  }
  return String(els.icao?.value || "").trim().toUpperCase();
}

function lightningRingTracesForCurrentView(baseHost = null) {
  if (isLightningGafZoom() || isGafLightningFigure({ layout: baseHost?.layout })) {
    const icao = resolveLightningPanelIcao(baseHost);
    const view = lightningGafViewSpec(icao);
    return buildGafLightningRingTraces(view, {
      includeCompare: Boolean(
        (view?.kind === "region" && isNationalLightningCompareMode())
        || (view?.kind !== "region" && isRegionalLightningSameGafCompare()),
      ),
    });
  }
  return buildAerodromeLightningRingTraces();
}

// Two traces so both markers and labels get reliable colors (Plotly does not
// reliably support per-point textfont.color on a single scatter). Selected is
// drawn last so it sits on top if labels overlap.
function lightningGafAirportOverlay(bbox, selectedIcao = "", {
  selectedOnly = false,
  compareIcao = "",
} = {}) {
  const airports = lightningPlayback.gafAreas?.airports;
  if (!airports || typeof airports !== "object" || !Array.isArray(bbox) || bbox.length !== 4) {
    return [];
  }
  const [latMin, latMax, lonMin, lonMax] = bbox;
  const selected = String(selectedIcao || "").trim().toUpperCase();
  const compare = String(compareIcao || "").trim().toUpperCase();
  const highlight = new Set([selected, compare].filter(Boolean));
  const others = { lons: [], lats: [], texts: [], sizes: [] };
  const selectedPts = { lons: [], lats: [], texts: [], sizes: [] };
  const comparePts = { lons: [], lats: [], texts: [], sizes: [] };
  Object.entries(airports).forEach(([icao, info]) => {
    const lat = Number(info?.lat);
    const lon = Number(info?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return;
    }
    if (lat < latMin || lat > latMax || lon < lonMin || lon > lonMax) {
      return;
    }
    const code = String(icao || "").trim().toUpperCase();
    // National grid view: only the selected aerodrome. Maximized national still
    // shows the full fleet (selectedOnly is false in that case). Compare national
    // also keeps the comparison aerodrome when selected-only.
    if (selectedOnly && !highlight.has(code)) {
      return;
    }
    let bucket = others;
    let size = 4;
    if (code === selected) {
      bucket = selectedPts;
      size = 5.5;
    } else if (code === compare) {
      bucket = comparePts;
      size = 5.5;
    }
    bucket.lons.push(lon);
    bucket.lats.push(lat);
    bucket.texts.push(code);
    bucket.sizes.push(size);
  });
  const traces = [];
  if (others.lons.length) {
    traces.push(buildGafAirportScatterTrace({
      ...others,
      color: "#888888",
      name: "__gaf_airports_others",
    }));
  }
  if (comparePts.lons.length) {
    traces.push(buildGafAirportScatterTrace({
      ...comparePts,
      color: "#111111",
      name: "__gaf_airports_compare",
    }));
  }
  if (selectedPts.lons.length) {
    traces.push(buildGafAirportScatterTrace({
      ...selectedPts,
      color: "#111111",
      name: "__gaf_airports_selected",
    }));
  }
  return traces;
}

function isLightningHeatmapMaximized() {
  const lightningIndex = state.latestFigures.findIndex((item) => item.id === "lightning_heatmap");
  return Number.isInteger(state.maximizedChartIndex)
    && lightningIndex >= 0
    && state.maximizedChartIndex === lightningIndex;
}

function buildGafLightningFigure({ icao, season, hour = null } = {}) {
  const seasonMeta = resolveLightningGafSeasonPack(season, icao)
    || lightningPlayback.gafSeasonMap;
  const view = lightningGafViewSpec(icao);
  if (!seasonMeta || !view) {
    return null;
  }

  const panelIcao = String(icao || els.icao?.value || "").trim().toUpperCase();
  const hourly = hour != null && Array.isArray(seasonMeta.hours);
  const cropped = hourly
    ? (lookupGafLightningHourlyCrop(hour, panelIcao, season)
      || cropLightningGafGrid(seasonMeta.hours[Number(hour)] || seasonMeta.hours[0] || [], seasonMeta, view.bbox, null))
    : cropLightningGafGrid(seasonMeta.summary, seasonMeta, view.bbox, null);
  const scale = hourly
    ? (ensureLightningGafHourlyScale(panelIcao, season) || lightningGafColorRange(cropped.z))
    : lightningGafColorRange(cropped.z);
  const [latMin, latMax, lonMin, lonMax] = view.bbox;
  const midLon = (lonMin + lonMax) / 2;
  const midLat = (latMin + latMax) / 2;

  const data = [{
    type: "heatmap",
    x: cropped.lons,
    y: cropped.lats,
    z: cropped.z,
    zmin: scale.zmin,
    zmax: scale.zmax,
    zauto: false,
    hoverongaps: false,
    colorscale: LIGHTNING_HEATMAP_COLORSCALE,
    opacity: LIGHTNING_HEATMAP_OPACITY,
    colorbar: lightningHeatmapColorbar(),
    hovertemplate: "Lon: %{x:.2f}°<br>Lat: %{y:.2f}°<br>Count: %{z}<extra></extra>",
  }];
  if (hourly && gafHourlyCropUsesCanvas(cropped)) {
    // Strikes for this grid are drawn on a canvas. Keep a dummy heatmap so
    // Plotly does not build a rect for every regional or national cell.
    data[0].x = [midLon];
    data[0].y = [midLat];
    data[0].z = [[null]];
    data[0].hoverinfo = "skip";
  }

  data.push(...lightningGafBoundaryTraces(lightningPlayback.gafAreas, view.bbox));
  const nationalCompare = view.kind === "region"
    && state.compareEnabled
    && Boolean(normalizedCompareIcao())
    && isLightningHeatmapMaximized();
  const sameGafCompare = view.kind !== "region" && isRegionalLightningSameGafCompare();
  const showCompareOnMap = nationalCompare || sameGafCompare;
  data.push(...buildGafLightningRingTraces(view, { includeCompare: showCompareOnMap }));
  data.push(...lightningGafAirportOverlay(view.bbox, panelIcao, {
    // National: selected-only in the grid; full fleet when that chart is maximized.
    selectedOnly: view.kind === "region" && !isLightningHeatmapMaximized(),
    compareIcao: showCompareOnMap ? normalizedCompareIcao() : "",
  }));

  const mapDomains = computeGafLightningMapDomains(
    view.bbox,
    // Reasonable first-paint defaults; seal replaces these with shell-measured size.
    360,
    360,
  );
  const panel = getTopoMapPanelSpec();
  const titleLayout = isMobileViewport()
    ? { text: "" }
    : {
        text: view.title,
        font: { size: 14 },
        x: 0.01,
        xanchor: "left",
        y: 0.98,
        yanchor: "top",
      };

  return {
    data,
    layout: {
      title: titleLayout,
      font: { color: "#333333", family: "Source Sans 3, Open Sans, Arial, sans-serif" },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      margin: {
        ...panel.margin,
        r: getLightningHeatmapMarginR(),
        b: getLightningHeatmapMarginB(panel.margin.b),
      },
      xaxis: {
        title: { text: "" },
        range: [lonMin, lonMax],
        domain: mapDomains.x,
        autorange: false,
        fixedrange: true,
        showgrid: false,
        zeroline: false,
        showline: false,
        mirror: false,
        ticks: "",
        tickmode: "array",
        tickvals: [midLon],
        ticktext: [""],
      },
      yaxis: {
        title: { text: "" },
        range: [latMin, latMax],
        domain: mapDomains.y,
        autorange: false,
        fixedrange: true,
        showgrid: false,
        zeroline: false,
        showline: false,
        mirror: false,
        ticks: "",
        tickmode: "array",
        tickvals: [midLat],
        ticktext: [""],
      },
      shapes: [],
      images: [{
        source: liteLightningGafImageUrl(view.image),
        xref: "x",
        yref: "y",
        x: lonMin,
        y: latMax,
        sizex: lonMax - lonMin,
        sizey: latMax - latMin,
        sizing: "stretch",
        layer: "below",
        opacity: CARTESIAN_TOPO_OPACITY,
      }],
      meta: {
        lightningView: "gaf",
        lightningGafKind: view.kind,
        lightningZmin: scale.zmin,
        lightningZmax: scale.zmax,
        gafBbox: view.bbox,
        gaf: view.gaf || null,
        pair: view.pair || null,
        gafIcao: panelIcao,
      },
      uirevision: [
        "lightning-gaf",
        view.kind,
        view.pair || view.gaf || "region",
        panelIcao,
        season,
        hourly ? "hourly" : "summary",
      ].join("::"),
    },
  };
}

async function applyGafLightningHeatmapOverride(data, icao, season, { compare = false } = {}) {
  if (!data?.figures?.length) {
    return data;
  }
  const index = data.figures.findIndex((item) => item.id === "lightning_heatmap");
  if (index < 0) {
    return data;
  }

  const code = String(icao || "").trim().toUpperCase();
  await ensureLightningGafAreasLoaded();
  await ensureLightningGafSeasonLoaded(season, {
    includeHours: state.lhMode === "hourly",
    icao: code,
  });
  const hour = state.lhMode === "hourly" ? Number(els.lhHourScroller?.value ?? 12) : null;
  const figure = buildGafLightningFigure({ icao: code, season, hour });
  if (!figure) {
    return data;
  }
  if (state.lhMode === "hourly") {
    ensureLightningHourlyTwoTraceFigure(figure);
  }
  data.figures[index] = { id: "lightning_heatmap", figure };
  const gafScale = {
    zmin: Number(figure.layout.meta.lightningZmin) || 0,
    zmax: Number(figure.layout.meta.lightningZmax) || 1,
  };
  if (!compare) {
    state.lightningHeatmapScaleRef = { ...gafScale };
  }
  if (state.lhMode === "summary") {
    rememberLightningSummaryScale(code, season, gafScale, { compare });
    if (!compare) {
    scheduleGafHourlyIdlePrefetch(season);
    }
  } else {
    const stored = rememberLightningNativeScale(code, season, gafScale, { mode: "hourly" });
    if (stored && compare) {
      state.lightningHeatmapCompareHourlyScaleRef = stored;
      state.lightningHeatmapCompareHourlyScaleKey = lightningNativeScaleKey(code, season, { mode: "hourly" });
    } else if (stored) {
      publishPrimaryHourlyScalePointer(code, stored);
    }
  }
  return data;
}

function updateLightningZoomToggle() {
  // Chart cards are reused across tabs. Always hide every zoom toggle first so a
  // precipitation toggle cannot linger on Overview/Wind/etc. after section change.
  document.querySelectorAll(".chart-zoom-toggle").forEach((el) => {
    el.classList.add("hidden");
  });

  const show = state.displayedSection === "precipitation"
    && state.latestFigures.some((item) => item.id === "lightning_heatmap");
  if (!show) {
    return;
  }

  const ui = getLightningHeatmapChartUi();
  if (!ui?.card) {
    return;
  }

  let toggle = ui.card.querySelector(".chart-zoom-toggle");
  if (!toggle) {
    toggle = document.createElement("div");
    toggle.className = "chart-zoom-toggle segmented-toggle";
    toggle.setAttribute("role", "group");
    toggle.setAttribute("aria-label", "Lightning map zoom");
    LIGHTNING_ZOOM_OPTIONS.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "segmented-toggle-btn";
      button.dataset.zoom = option.key;
      button.textContent = option.label;
      button.title = option.title;
      button.addEventListener("click", () => {
        setLightningZoom(option.key);
      });
      toggle.appendChild(button);
    });
  }
  // Desktop: mount on the plot shell so Local/Regional/National shares the same
  // absolute containing block as Maximize (card padding was shifting Maximize up).
  // Mobile: keep on the card so the below-plot flex strip layout still works.
  if (isMobileViewport() || !ui.shell) {
    ui.card.appendChild(toggle);
  } else {
    ui.shell.appendChild(toggle);
  }
  toggle.classList.remove("hidden");
  const activeZoom = LIGHTNING_ZOOM_OPTIONS.some((option) => option.key === state.lhZoom)
    ? state.lhZoom
    : "local";
  toggle.querySelectorAll(".segmented-toggle-btn").forEach((button) => {
    const isActive = button.dataset.zoom === activeZoom;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

async function setLightningZoom(nextZoom) {
  const resolved = LIGHTNING_ZOOM_OPTIONS.some((option) => option.key === nextZoom)
    ? nextZoom
    : "local";
  if (state.lhZoom === resolved) {
    return;
  }
  stopLightningPlayback();
  cancelGafHourlyIdlePrefetch();
  state.lhZoom = resolved;
  // Pack key changes between Regional and National — drop in-memory cube (liteCache kept).
  clearLightningGafSeasonPackState();
  resetLightningHourlyLayoutState();
  state.lightningHeatmapScaleRef = null;
  updateLightningZoomToggle();
  if (state.displayedSection !== "precipitation") {
    return;
  }
  if (state.latestFigures.some((item) => item.id === "lightning_heatmap")) {
    await refreshLightningZoomView();
    return;
  }
  await fetchCharts();
}

/**
 * Zoom-only path: keep the other precip charts mounted and only rebuild lightning
 * under the global loading overlay (no full-grid remount). The previous map stays
 * visible and greyed under the translucent veil until the new map is swapped in.
 */
async function refreshLightningZoomView() {
  const message = isLightningGafZoom()
    ? "Preparing regional lightning..."
    : "Preparing lightning heatmap...";
  const { token, signal } = beginViewTransition(message);

  try {
    const host = getLightningHeatmapChartHost();
    if (!host) {
      cancelViewTransition(token);
      await fetchCharts();
      return;
    }

    const icao = els.icao?.value || "";
    const season = els.season?.value || "all";
    const section = "precipitation";

    if (isLightningGafZoom()) {
      setLoadingState(mapFetchProgress(0, 1), "Preparing regional lightning...");
      await ensureLightningGafAreasLoaded();
      await ensureLightningGafSeasonLoaded(season, {
        includeHours: state.lhMode === "hourly",
      });
      if (!isActiveTransition(token) || signal.aborted) {
        return;
      }
      setLoadingState(LOADING_PHASE.FETCH_END, "Rendering lightning map...");
      const ok = await rebuildAndSealGafLightningHost(host, section);
      if (!ok) {
        throw new Error("Failed to render regional lightning map");
      }
      if (state.lhMode === "summary") {
        scheduleGafHourlyIdlePrefetch(season);
      }
    } else {
      setLoadingState(mapFetchProgress(0, 1), "Preparing lightning heatmap...");
      const assembled = await assembleLiteFigures(icao, section, season, (completed, total, statusMessage) => {
        if (!isActiveTransition(token)) {
          return;
        }
        setLoadingState(
          mapFetchProgress(completed, total),
          statusMessage || "Fetching lightning heatmap...",
        );
      });
      const data = { figures: assembled?.figures || [] };
      if (shouldUseHourlyLightningHeatmap(section)) {
        setLoadingState(mapFetchProgress(1, 1), "Preparing lightning heatmap...");
        await applyHourlyLightningHeatmapOverride(data, icao, season);
      }
      if (!isActiveTransition(token) || signal.aborted) {
        return;
      }
      const lightningItem = data.figures.find((item) => item.id === "lightning_heatmap");
      if (!lightningItem?.figure) {
        throw new Error("Lightning heatmap is not available for this aerodrome");
      }
      setLoadingState(LOADING_PHASE.FETCH_END, "Rendering lightning map...");
      await replaceLocalLightningHeatmapHost(host, lightningItem, icao, season, section);
    }

    await awaitLayoutSettle();
    await awaitLayoutSettle();
    if (!isActiveTransition(token)) {
      return;
    }
    updateLightningZoomToggle();
    renderLightningHeatmapToolbar(section);
    if (state.compareEnabled && Number.isInteger(state.maximizedChartIndex)) {
      invalidateCompareCache();
      await refreshCompareMode();
    }
    await finishViewTransition(token);
  } catch (err) {
    if (signal.aborted || err?.name === "AbortError" || !isActiveTransition(token)) {
      return;
    }
    console.error(err);
    setStatus(`Error: ${err.message}`);
    cancelViewTransition(token);
  }
}

async function replaceLocalLightningHeatmapHost(host, lightningItem, icao, season, section) {
  concealLightningFigureHost(host);
  try {
  teardownLightningOverlay();
  const figure = JSON.parse(JSON.stringify(lightningItem.figure));
  const lightningIndex = state.latestFigures.findIndex((item) => item.id === "lightning_heatmap");
  if (lightningIndex >= 0) {
    state.latestFigures[lightningIndex] = {
      id: "lightning_heatmap",
      figure: JSON.parse(JSON.stringify(figure)),
    };
  }
  host.dataset.figureId = "lightning_heatmap";

  applyMaximizedChartState();
  applyChartShellHeights(section);
  await awaitLayoutSettle();

  const targetChartHeight = Number.parseFloat(host.style.height) || getChartHeight(section);
  const isMaximized = Number.isInteger(state.maximizedChartIndex)
    && state.maximizedChartIndex === lightningIndex;
  applyTopoMapPanelLayout(figure, "lightning_heatmap", { chartHeight: targetChartHeight });
  await prepareChartTerrainBackground(figure, icao, "lightning_heatmap");

  figure.layout = figure.layout || {};
  figure.layout.legend = figure.layout.legend || {};
  figure.layout.showlegend = false;
  const hourlyScale = shouldUseHourlyLightningHeatmap(section)
    ? ensureLightningHourlyScale(icao, season)
    : null;
  const scale = applyLightningHeatmapStyle(figure, {
    icao,
    season,
    fixedScale: hourlyScale,
  });
  if (state.lhMode === "summary" && supportsLightningHeatmapHourly(icao) && scale) {
    state.lightningHeatmapScaleRef = { ...scale };
  }
  figure.layout.height = targetChartHeight;
  if (isMaximized) {
    figure.layout.autosize = true;
    delete figure.layout.width;
  } else {
    delete figure.layout.width;
  }
  applyChartLegendVisibilityToFigure(figure, "lightning_heatmap");
  blankPlotlyTitleForHtmlCardBadge(figure, "lightning_heatmap");

  const lockHourly = shouldUseHourlyLightningHeatmap(section);
  await Plotly.react(host, figure.data || [], figure.layout || {}, {
    displayModeBar: false,
    responsive: !lockHourly,
  });
  await clearLightningRingShapesOnHost(host);
  if (lockHourly && !isMaximized) {
    // Hourly Local: rings belong on the overlay only.
    await deleteLightningRingTracesOnHost(host);
  } else {
  await ensureLightningRingTracesOnHost(host);
  }
  await relayoutTopoMapPanel(host);
  await scheduleHostResize(host, { recalibrateFrame: true });

  if (lockHourly) {
    if (isMaximized) {
      await refreshMaximizedChartLayout(host);
    } else {
      await enterLightningHourlyOverlayCurrent(host);
    }
  }

  const legend = chartUi[lightningIndex]?.legend;
  if (legend) {
    renderExternalLegend(host, legend, figure, section, "lightning_heatmap");
  }
  return true;
  } finally {
    revealLightningFigureHosts();
  }
}

function shouldSkipLightningHourlyTopoRelayout(host) {
  return host?.dataset?.figureId === "lightning_heatmap"
    && shouldUseHourlyLightningHeatmap()
    && (lightningPlayback.layoutPinned || lightningPlayback.frameUpdating);
}

function lightningHeatmapToolbarSections() {
  return new Set(["precipitation"]);
}

function shouldUseHourlyLightningHeatmap(section = state.displayedSection) {
  return lightningHeatmapToolbarSections().has(section)
    && state.lhMode === "hourly"
    && supportsLightningHeatmapHourly();
}

function getLightningHeatmapChartHost() {
  const index = state.latestFigures.findIndex((item) => item.id === "lightning_heatmap");
  if (index < 0) {
    return null;
  }
  return els.charts[index] || null;
}

function updateLightningPlayButton() {
  if (!els.lhHourPlayBtn) {
    return;
  }
  els.lhHourPlayBtn.classList.toggle("is-playing", lightningPlayback.playing);
  els.lhHourPlayBtn.setAttribute(
    "aria-label",
    lightningPlayback.playing ? "Pause hourly lightning heatmap animation" : "Play hourly lightning heatmap animation",
  );
  els.lhHourPlayBtn.title = lightningPlayback.playing ? "Pause hourly animation" : "Play hourly animation";
}

function stopLightningPlayback() {
  if (lightningPlayback.timer) {
    clearInterval(lightningPlayback.timer);
    lightningPlayback.timer = null;
  }
  lightningPlayback.playing = false;
  lightningPlayback.renderInFlight = false;
  updateLightningPlayButton();
}

function setLightningHourDisplay(hourValue) {
  const hour = String(hourValue ?? "0");
  lightningPlayback.suppressSliderFetch = true;
  if (els.lhHourScroller) {
    els.lhHourScroller.value = hour;
  }
  if (els.lhHourValue) {
    els.lhHourValue.textContent = formatWindRoseHourLabel(hour);
  }
  lightningPlayback.suppressSliderFetch = false;
}

async function ensureLightningHourlyFramesLoaded(icao = els.icao.value) {
  if (isLightningGafZoom()) {
    await ensureLightningGafAreasLoaded();
    await ensureLightningGafSeasonLoaded(els.season?.value || "all", {
      includeHours: true,
      icao,
    });
    return;
  }

  const code = String(icao || "").trim().toUpperCase();
  if (!supportsLightningHeatmapHourly(code)) {
    throw new Error("Hourly lightning heatmap is not available for this aerodrome");
  }
  if (lightningPlayback.liteHourlyMap && lightningPlayback.liteHourlyIcao === code) {
    return;
  }

  const url = liteLightningHourlyUrl(code);
  const needsFetch = !liteCache.has(url);
  const ownedLoading = needsFetch
    ? announceNestedLoading("Preparing lightning animation...")
    : false;
  try {
    lightningPlayback.liteHourlyMap = await fetchJsonCached(url);
    lightningPlayback.liteHourlyIcao = code;
  } finally {
    releaseNestedLoading(ownedLoading);
  }
}

function applyHourlyGridToLightningFigure(figure, zGrid) {
  const trace = (figure?.data || []).find((entry) => String(entry?.type || "").toLowerCase() === "heatmap");
  if (!trace) {
    return;
  }

  const meta = figure?.layout?.meta || {};
  const geom = lightningHeatmapGeometry(meta);
  trace.z = buildLightningHeatmapZFromGrid(zGrid, meta);
  trace.x = [...geom.centers];
  trace.y = [...geom.centers];
}

function buildLightningHeatmapZFromGrid(zGrid, meta = {}) {
  const geom = lightningHeatmapGeometry(meta);
  return geom.centers.map((yc, rowIndex) => geom.centers.map((xc, colIndex) => {
    if (!cellIntersectsLightningDisk(xc, yc, geom.halfCell, geom.radiusKm)) {
      return null;
    }
    const row = Array.isArray(zGrid?.[rowIndex]) ? zGrid[rowIndex] : [];
    const numeric = Number(row[colIndex]);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
  }));
}

function lightningHeatmapRestylePatch(z, scale = {}, { comparePanel = false } = {}) {
  const scaleMin = Number(scale.zmin) || 0;
  const scaleMax = Math.max(scaleMin + 1, Number(scale.zmax) || 1);
  const colorbar = comparePanel ? lightningHeatmapCompareColorbar() : lightningHeatmapColorbar();
  const patch = {
    zmin: [scaleMin],
    zmax: [scaleMax],
    zauto: [false],
    showscale: [true],
    colorscale: [LIGHTNING_HEATMAP_COLORSCALE],
    "colorbar.orientation": [colorbar.orientation || "v"],
    "colorbar.title": [colorbar.title],
    "colorbar.x": [colorbar.x],
    "colorbar.xanchor": [colorbar.xanchor],
    "colorbar.y": [colorbar.y],
    "colorbar.yanchor": [colorbar.yanchor],
    "colorbar.len": [colorbar.len],
    "colorbar.lenmode": [colorbar.lenmode],
    "colorbar.thickness": [colorbar.thickness],
    "colorbar.xpad": [colorbar.xpad],
    "colorbar.ypad": [colorbar.ypad],
    "colorbar.outlinewidth": [colorbar.outlinewidth],
    "colorbar.outlinecolor": [colorbar.outlinecolor],
    "colorbar.tickmode": ["auto"],
  };
  if (colorbar.thicknessmode) {
    patch["colorbar.thicknessmode"] = [colorbar.thicknessmode];
  }
  if (z != null) {
    patch.z = [z];
  }
  return patch;
}

function restyleLightningHeatmapHour(host, zGridOrMatrix, scale = {}, { zOnly = false } = {}) {
  const indices = lightningHeatmapTraceIndices(host);
  if (!indices.length) {
    return Promise.resolve();
  }
  const dataIndex = indices[0];
  const meta = host?.layout?.meta || {};
  const z = Array.isArray(zGridOrMatrix?.[0])
    ? zGridOrMatrix
    : buildLightningHeatmapZFromGrid(zGridOrMatrix, meta);
  // In two-trace mode the colorbar lives on the static chrome trace, so the visible
  // data trace only ever needs a z update — never the colorbar/layout-affecting patch.
  if ((zOnly && lightningPlayback.layoutPinned) || indices.length >= 2) {
    lightningPlayback.frameUpdating = true;
    return Plotly.restyle(host, { z: [z] }, [dataIndex]).finally(() => {
      lightningPlayback.frameUpdating = false;
    });
  }
  const patch = lightningHeatmapRestylePatch(z, scale);
  return Plotly.restyle(host, patch, [dataIndex]);
}

function buildLightningHeatmapLayoutPinPatch(host) {
  const patch = buildTopoMapPanelRelayout(host);
  const layout = host?.layout || {};
  const meta = layout.meta || {};
  const cropExtentKm = Number(meta.topoCropExtentKm) || topoCropExtentKmFromLat(meta.airportLat);
  const width = Math.round(host?.offsetWidth || host?.clientWidth || 0);
  const height = Math.round(host?.offsetHeight || host?.clientHeight || 0);
  const marginR = Number(layout?.margin?.r);

  patch.uirevision = layout.uirevision;
  patch.autosize = false;
  if (width > 0) {
    patch.width = width;
  }
  if (height > 0) {
    patch.height = height;
  }
  if (Number.isFinite(marginR) && marginR > 0) {
    patch["margin.r"] = marginR;
  }
  patch["xaxis.scaleanchor"] = "y";
  patch["xaxis.scaleratio"] = 1;
  patch["xaxis.automargin"] = false;
  patch["yaxis.automargin"] = false;
  patch["xaxis.fixedrange"] = true;
  patch["yaxis.fixedrange"] = true;

  (layout.images || []).forEach((image, index) => {
    if (image?.xref === "x" && image?.yref === "y") {
      patch[`images[${index}].x`] = 0;
      patch[`images[${index}].y`] = 0;
      patch[`images[${index}].sizex`] = cropExtentKm;
      patch[`images[${index}].sizey`] = cropExtentKm;
      patch[`images[${index}].xanchor`] = "center";
      patch[`images[${index}].yanchor`] = "middle";
      patch[`images[${index}].sizing`] = "stretch";
      patch[`images[${index}].layer`] = "below";
    }
  });

  return patch;
}

function finalizeLightningHeatmapPostRender(host, scale, {
  icao = "",
  captureSummary = false,
  pinHourly = false,
  deferRingsToOverlay = false,
} = {}) {
  return restyleLightningHeatmapScale(host, scale)
    .then(() => relayoutTopoMapPanel(host))
    .then(async () => {
      await awaitLayoutSettle();
      if (deferRingsToOverlay) {
        // Rings move to the hourly overlay next — keep the base ring-free so
        // we never briefly stack base+overlay strokes.
        await clearLightningRingShapesOnHost(host);
        await deleteLightningRingTracesOnHost(host);
      } else {
      await ensureLightningRingTracesOnHost(host);
      }
      if (captureSummary) {
        captureLightningHeatmapSummaryLayoutRef(host);
      }
      if (pinHourly) {
        await finalizeLightningHourlyLayoutPin(host);
      }
    });
}

function hostHasGafCompareAirportTrace(host) {
  return (host?.data || []).some((trace) => trace?.name === "__gaf_airports_compare");
}

function regionalLightningPrimaryOverlayIsStale(host) {
  if (!host || isRegionalLightningSameGafCompare()) {
    return false;
  }
  // Hourly GAF paints airports on the hour overlay (base copies are hidden).
  // Same-GAF → dual-region must treat a leftover overlay compare marker as stale.
  const overlay = getLightningHourOverlayForHost(host);
  if (hostHasGafCompareAirportTrace(host) || hostHasGafCompareAirportTrace(overlay)) {
    return true;
  }
  if (!host.data?.length) {
    return false;
  }
  const view = lightningGafViewSpec(resolveLightningPanelIcao(host));
  const expected = buildGafLightningRingTraces(view, { includeCompare: false }).length;
  return lightningRingTraceIndices(host).length !== expected;
}

/**
 * Rebuild rings + airport labels on the hourly overlay from the sealed base.
 * Used when leaving same-GAF single-map compare so a prior __gaf_airports_compare
 * cannot linger on the overlay after the base was cleaned.
 */
async function refreshGafLightningOverlayChrome(host) {
  if (!host || !shouldUseHourlyLightningHeatmap()) {
    return;
  }
  const overlay = getLightningHourOverlayForHost(host);
  if (!overlay?.classList.contains("is-visible")) {
    return;
  }
  const keep = (overlay.data || []).filter((trace) => {
    const name = String(trace?.name || "");
    return name !== LIGHTNING_RING_TRACE_NAME && !name.startsWith("__gaf_airports");
  });
  const rings = lightningRingTracesForCurrentView(host);
  const airports = copyGafAirportTracesFromHost(host).map((trace) => ({
    ...trace,
    visible: true,
  }));
  await hideGafAirportTracesOnHost(host);
  await deleteLightningRingTracesOnHost(host);
  positionLightningOverlay(host, overlay);
  const layout = buildGafLightningOverlayLayout(host);
  try {
    await Plotly.react(overlay, [...keep, ...rings, ...airports], layout, {
      displayModeBar: false,
      responsive: false,
    });
  } catch (error) {
    // ignore mid-teardown races
  }
}

async function replaceRegionalLightningAirportAndRingTraces(host) {
  if (!host?.data) {
    return;
  }
  const drop = [];
  (host.data || []).forEach((trace, index) => {
    const name = String(trace?.name || "");
    if (name.startsWith("__gaf_airports") || name === LIGHTNING_RING_TRACE_NAME) {
      drop.push(index);
    }
  });
  if (drop.length) {
    await Plotly.deleteTraces(host, drop);
  }
  const code = resolveLightningPanelIcao(host);
  const view = lightningGafViewSpec(code);
  const bbox = Array.isArray(host.layout?.meta?.gafBbox) ? host.layout.meta.gafBbox : view?.bbox;
  if (!view || !bbox) {
    // Still drop a stale compare marker from the hourly overlay if present.
    await refreshGafLightningOverlayChrome(host);
    return;
  }
  const rings = buildGafLightningRingTraces(view, { includeCompare: false });
  const airports = lightningGafAirportOverlay(bbox, code, {
    selectedOnly: false,
    compareIcao: "",
  });
  const traces = [...rings, ...airports];
  if (traces.length) {
    await Plotly.addTraces(host, traces);
  }
  // Base is clean; push the same chrome onto the hour overlay (hourly mode).
  await refreshGafLightningOverlayChrome(host);
}

async function ensureGafAirportTracesOnHost(host, icao = "") {
  if (!host?.data || !isGafLightningFigure({ layout: host.layout })) {
    return;
  }
  const hasAirports = (host.data || []).some(
    (trace) => String(trace?.name || "").startsWith("__gaf_airports"),
  );
  if (hasAirports) {
    return;
  }
  const code = String(icao || resolveLightningPanelIcao(host) || "").trim().toUpperCase();
  const view = lightningGafViewSpec(code);
  const bbox = Array.isArray(host.layout?.meta?.gafBbox)
    ? host.layout.meta.gafBbox
    : view?.bbox;
  if (!bbox) {
    return;
  }
  const kind = String(host.layout?.meta?.lightningGafKind || "");
  const showCompareOnMap = (kind === "region" && isNationalLightningCompareMode())
    || (kind !== "region" && isRegionalLightningSameGafCompare());
  const traces = lightningGafAirportOverlay(bbox, code, {
    selectedOnly: false,
    compareIcao: showCompareOnMap ? normalizedCompareIcao() : "",
  });
  if (!traces.length) {
    return;
  }
  await Plotly.addTraces(host, traces);
}

async function ensureLightningRingTracesOnHost(host) {
  if (!host?.data) {
    return;
  }
  // Always clear lite/backend circle shapes so Local rings are traces-only.
  await clearLightningRingShapesOnHost(host);

  // Hourly overlay owns the rings while visible — never re-add them on the
  // sealed base (base+overlay white strokes stack into a black bullseye).
  if (lightningBaseHostHasActiveRingOverlay(host)) {
    await deleteLightningRingTracesOnHost(host);
    return;
  }

  const expected = lightningRingTracesForCurrentView(host);
  if (!expected.length) {
    await deleteLightningRingTracesOnHost(host);
    return;
  }

  const existing = (host.data || []).filter((trace) => trace?.name === LIGHTNING_RING_TRACE_NAME);
  const styleOk = existing.length === expected.length
    && existing.every((trace) => {
      const color = String(trace?.line?.color || "");
      return color.startsWith("rgba(255,255,255") || color === "#ffffff" || color === "white";
    });
  if (styleOk) {
    return;
  }

  await deleteLightningRingTracesOnHost(host);
  // Keep GAF airport markers/labels above the rings.
  const insertAt = (host.data || []).findIndex((trace) => {
    const name = String(trace?.name || "");
    return name === "__gaf_boundaries" || name.startsWith("__gaf_airports");
  });
  if (insertAt >= 0) {
    await Plotly.addTraces(host, expected, insertAt);
  } else {
    await Plotly.addTraces(host, expected);
  }
}

async function pinLightningHeatmapHourlyLayout(host) {
  return finalizeLightningHourlyLayoutPin(host);
}

function captureLightningHeatmapSummaryScale(figure, { icao = "", season = "all" } = {}) {
  const clone = JSON.parse(JSON.stringify(figure || {}));
  const scale = applyLightningHeatmapStyle(clone, { icao, season });
  if (scale) {
    state.lightningHeatmapScaleRef = { ...scale };
    rememberLightningSummaryScale(icao, season, scale, { compare: false });
  }
  return state.lightningHeatmapScaleRef;
}

// Hourly bins hold far fewer strikes than the summary (which aggregates all hours),
// so reusing the summary range washes the hourly cells out. Compute a dedicated
// range from the union of all 24 hourly grids for the season. This is fixed across
// hours, so the colorbar is set once when the base/overlay are built and never
// restyled while scrubbing — preserving the zero-flicker behaviour.
function computeLightningHourlyScale(season) {
  const dataMap = lightningPlayback.liteHourlyMap;
  if (!dataMap) {
    return null;
  }
  const positives = [];
  for (let hour = 0; hour < 24; hour += 1) {
    const zGrid = lookupLiteLightningHourlyGrid(dataMap, season, String(hour));
    (zGrid || []).forEach((row) => {
      (Array.isArray(row) ? row : [row]).forEach((value) => {
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) {
          positives.push(numeric);
        }
      });
    });
  }
  if (!positives.length) {
    return null;
  }
  const range = lightningHeatmapColorRange([positives]);
  if (!range) {
    return null;
  }
  const zmin = Number(range.zmin) || 0;
  const stretchedMax = (Number(range.zmax) || 1) * LIGHTNING_HOURLY_SCALE_HEADROOM;
  return { zmin, zmax: Math.max(zmin + 1, stretchedMax) };
}

function ensureLightningHourlyScale(icao, season) {
  const code = String(icao || "").trim().toUpperCase();
  const seasonKey = String(season || "all");
  if (isLightningGafZoom()) {
    return ensureLightningGafHourlyScale(code, seasonKey);
  }
  const cached = lookupLightningNativeScale(code, seasonKey);
  if (cached) {
    publishPrimaryHourlyScalePointer(code, cached);
    return cached;
  }
  const mapIcao = String(lightningPlayback.liteHourlyIcao || "").toUpperCase();
  if (mapIcao && mapIcao !== code) {
    return null;
  }
  const scale = computeLightningHourlyScale(seasonKey);
  const stored = rememberLightningNativeScale(code, seasonKey, scale, { mode: "hourly" });
  if (stored) {
    publishPrimaryHourlyScalePointer(code, stored);
  }
  return stored;
}

async function applyHourlyLightningHeatmapOverride(data, icao, season) {
  if (!shouldUseHourlyLightningHeatmap() || !data?.figures?.length) {
    return data;
  }

  const hour = els.lhHourScroller?.value ?? "12";
  await ensureLightningHourlyFramesLoaded(icao);
  const zGrid = lookupLiteLightningHourlyGrid(lightningPlayback.liteHourlyMap, season, hour);

  const index = data.figures.findIndex((item) => item.id === "lightning_heatmap");
  if (index < 0) {
    return data;
  }

  const summaryFig = data.figures[index];
  if (!state.lightningHeatmapScaleRef && summaryFig?.figure) {
    captureLightningHeatmapSummaryScale(summaryFig.figure, { icao, season });
  }

  const hourlyFig = JSON.parse(JSON.stringify(summaryFig));
  applyHourlyGridToLightningFigure(hourlyFig.figure, zGrid);
  applyLightningHeatmapStyle(hourlyFig.figure, {
    icao,
    season,
    fixedScale: ensureLightningHourlyScale(icao, season),
  });
  ensureLightningHourlyTwoTraceFigure(hourlyFig.figure);
  // The base chart shows only the colorbar/frame; the data cells live in the overlay.
  suppressLightningBaseCells(hourlyFig.figure);
  data.figures[index] = hourlyFig;
  return data;
}

async function renderLightningHeatmapHourFrame(hour, section = state.displayedSection) {
  if (!shouldUseHourlyLightningHeatmap(section)) {
    return;
  }

  if (lightningPlayback.renderInFlight) {
    lightningPlayback.pendingHour = hour;
    return;
  }

  lightningPlayback.renderInFlight = true;
  let lastHour = hour;
  try {
    let targetHour = hour;
    do {
      lightningPlayback.pendingHour = null;
      lastHour = targetHour;
      await renderLightningHeatmapHourFrameCore(targetHour, section);
      targetHour = lightningPlayback.pendingHour;
    } while (targetHour != null);
  } finally {
    lightningPlayback.renderInFlight = false;
  }

  if (state.compareEnabled && isCompareDualPanelActive()) {
    const figureId = els.charts[state.maximizedChartIndex]?.dataset?.figureId;
    if (figureId === "lightning_heatmap") {
      // Hour changes are z-only on both panels. Never refreshCompareMode here —
      // a full dual-panel rebuild reseals GAF maps and flickers during scrub.
      await updateCompareLightningHourFrame(lastHour);
    }
  }
}

async function renderLightningHeatmapHourFrameCore(hour, section = state.displayedSection) {
  const host = getLightningHeatmapChartHost();
  if (!host) {
    return;
  }

  const scale = state.lightningHeatmapScaleRef;
  if (!scale || !Number.isFinite(Number(scale.zmax)) || Number(scale.zmax) <= 0) {
    return;
  }

  const icao = els.icao.value;
  const season = els.season.value;
  await ensureLightningHourlyFramesLoaded(icao);

  if (isLightningGafZoom() || isGafLightningFigure({ layout: host.layout })) {
    const ctx = getLightningHourlyPinContext(host);
    const overlay = getLightningOverlayHost();
    const canvasLive = lightningPlayback.nationalCanvasActive && Boolean(lightningPlayback.nationalCanvasEl);
    const overlayHasData = Boolean(overlay && overlay.data?.length) || canvasLive;
    const sameMaximized = lightningPlayback.pinnedMaximized === ctx.maximized;
    // Ignore sub-pixel/1px offset noise so a stray relayout does not trigger a full
    // mid-scrub rebuild. Only a real maximize/restore or resize should re-seal.
    const sizeStable = Math.abs((lightningPlayback.pinnedWidth || 0) - ctx.width) <= 2
      && Math.abs((lightningPlayback.pinnedHeight || 0) - ctx.height) <= 2;
    if (lightningPlayback.overlayActive && overlayHasData && sameMaximized && sizeStable) {
      await restyleGafLightningHour(host, hour);
      return;
    }
    // Playback and slider scrub are z-only. Never rebuildAndSeal mid-drag — that
    // reseals domains/margins and is what the regional compare flicker looked like.
    if (
      lightningPlayback.playing
      || lightningPlayback.frameUpdating
      || lightningPlayback.sliderScrubbing
    ) {
      if (overlayHasData) {
        await restyleGafLightningHour(host, hour);
      }
      return;
    }
    await rebuildAndSealGafLightningHost(host, section);
    return;
  }

  const zGrid = lookupLiteLightningHourlyGrid(lightningPlayback.liteHourlyMap, season, hour);

  // Scrub only the transparent overlay; the base map (with the colorbar) is never
  // touched, so nothing in the static layer can move. Rebuild the overlay only when
  // the chart was resized/maximized since it was last built.
  if (!lightningOverlayMatchesContext(host)) {
    await enterLightningHourlyOverlay(host, zGrid);
    return;
  }
  await renderLightningOverlayFrame(zGrid);
}

async function advanceLightningPlaybackFrame() {
  if (!lightningPlayback.playing || lightningPlayback.renderInFlight) {
    return;
  }

  const currentHour = Number(els.lhHourScroller?.value ?? 0);
  const nextHour = (currentHour + 1) % 24;
  setLightningHourDisplay(nextHour);

  try {
    await renderLightningHeatmapHourFrame(nextHour);
  } catch (error) {
    console.warn("Failed to advance lightning heatmap playback:", error);
    stopLightningPlayback();
  }
}

async function startLightningPlayback() {
  if (!shouldUseHourlyLightningHeatmap()) {
    return;
  }

  try {
    await ensureLightningHourlyFramesLoaded();
  } catch (error) {
    console.warn("Failed to prepare lightning heatmap playback:", error);
    return;
  }

  lightningPlayback.playing = true;
  updateLightningPlayButton();
  lightningPlayback.timer = setInterval(() => {
    advanceLightningPlaybackFrame();
  }, LIGHTNING_PLAY_INTERVAL_MS);
}

async function toggleLightningPlayback() {
  if (lightningPlayback.playing) {
    stopLightningPlayback();
    return;
  }
  await startLightningPlayback();
}

function resetLightningHeatmapModeOnSectionChange(nextSection) {
  stopLightningPlayback();
  if (nextSection !== "precipitation") {
    state.lhMode = "summary";
    state.lhZoom = "local";
    state.lightningHeatmapScaleRef = null;
    lightningPlayback.liteHourlyMap = null;
    lightningPlayback.liteHourlyIcao = null;
    clearLightningGafSeasonPackState();
    cancelGafHourlyIdlePrefetch();
    resetLightningHourlyLayoutState();
  }
}

function renderLightningHeatmapToolbar(section = state.displayedSection) {
  const toolbarEl = section === "precipitation" ? els.precipitationLightningToolbar : null;
  const showToolbar = section === "precipitation" && supportsLightningHeatmapHourly();

  if (!showToolbar || !toolbarEl) {
    if (els.lhToolbarContainer && els.lhToolbarContainer.parentElement) {
      els.lhToolbarContainer.parentElement.removeChild(els.lhToolbarContainer);
    }
    updateLightningZoomToggle();
    return;
  }

  if (!els.lhModeSummary && els.lhToolbarTemplate) {
    els.lhToolbarContainer = els.lhToolbarTemplate;
    els.lhToolbarContainer.classList.remove("hidden");
    els.lhModeSummary = els.lhToolbarContainer.querySelector("#lh-mode-summary");
    els.lhModeHourly = els.lhToolbarContainer.querySelector("#lh-mode-hourly");
    els.lhHourScroller = els.lhToolbarContainer.querySelector("#lh-hour-scroller");
    els.lhHourScrollerContainer = els.lhToolbarContainer.querySelector("#lh-hour-scroller-container");
    els.lhHourValue = els.lhToolbarContainer.querySelector("#lh-hour-value");
    els.lhHourPlayBtn = els.lhToolbarContainer.querySelector("#lh-hour-play");
    attachLightningHeatmapListeners();
  }

  if (!els.lhToolbarContainer) {
    return;
  }

  toolbarEl.innerHTML = "";
  toolbarEl.appendChild(els.lhToolbarContainer);
  toolbarEl.classList.remove("hidden");

  const isHourly = state.lhMode === "hourly";
  toolbarEl.classList.toggle("is-lightning-toolbar", true);
  toolbarEl.classList.toggle("is-hourly-mode", isHourly);

  if (els.lhModeSummary) {
    els.lhModeSummary.classList.toggle("active", !isHourly);
  }
  if (els.lhModeHourly) {
    els.lhModeHourly.classList.toggle("active", isHourly);
  }
  if (els.lhHourScrollerContainer) {
    els.lhHourScrollerContainer.classList.toggle("hidden", !isHourly);
    els.lhHourScrollerContainer.setAttribute("aria-hidden", isHourly ? "false" : "true");
    els.lhHourScrollerContainer.classList.toggle("is-hidden-state", !isHourly);
  }
  if (isHourly && els.lhHourScroller && els.lhHourValue) {
    els.lhHourValue.textContent = formatWindRoseHourLabel(els.lhHourScroller.value);
  }
  if (!isHourly) {
    stopLightningPlayback();
  }
  updateLightningPlayButton();
  syncLightningHourlyColorbarVisibility(section);
  updateLightningZoomToggle();
}

function attachLightningHeatmapListeners() {
  if (attachLightningHeatmapListeners.initialized) {
    return;
  }
  attachLightningHeatmapListeners.initialized = true;

  if (els.lhModeSummary) {
    els.lhModeSummary.addEventListener("click", () => {
      stopLightningPlayback();
      state.lhMode = "summary";
      state.lightningHeatmapScaleRef = null;
      resetLightningHourlyLayoutState();
      els.lhModeSummary.classList.add("active");
      els.lhModeHourly.classList.remove("active");
      els.lhHourScrollerContainer.classList.add("hidden");
      if (state.displayedSection === "precipitation") {
        fetchCharts();
      }
    });
  }

  if (els.lhModeHourly) {
    els.lhModeHourly.addEventListener("click", () => {
      stopLightningPlayback();
      state.lhMode = "hourly";
      resetLightningHourlyLayoutState();
      els.lhModeHourly.classList.add("active");
      els.lhModeSummary.classList.remove("active");
      els.lhHourScrollerContainer.classList.remove("hidden");
      if (state.displayedSection === "precipitation") {
        fetchCharts();
      }
    });
  }

  if (els.lhHourPlayBtn) {
    els.lhHourPlayBtn.addEventListener("click", () => {
      toggleLightningPlayback();
    });
  }

  if (els.lhHourScroller) {
    const endLightningSliderScrub = () => {
      lightningPlayback.sliderScrubbing = false;
    };
    els.lhHourScroller.addEventListener("pointerdown", () => {
      lightningPlayback.sliderScrubbing = true;
      lightningPlayback.scrubAppliedHour = null;
      if (lightningPlayback.playing) {
        stopLightningPlayback();
      }
    });
    els.lhHourScroller.addEventListener("pointerup", endLightningSliderScrub);
    els.lhHourScroller.addEventListener("pointercancel", endLightningSliderScrub);
    els.lhHourScroller.addEventListener("input", () => {
      lightningPlayback.sliderScrubbing = true;
      if (lightningPlayback.playing) {
        stopLightningPlayback();
      }
      els.lhHourValue.textContent = formatWindRoseHourLabel(els.lhHourScroller.value);
      if (lightningPlayback.suppressSliderFetch) {
        return;
      }
      if (lightningHeatmapToolbarSections().has(state.displayedSection) && shouldUseHourlyLightningHeatmap()) {
        lightningPlayback.scrubAppliedHour = String(els.lhHourScroller.value);
        renderLightningHeatmapHourFrame(els.lhHourScroller.value);
      }
    });
    els.lhHourScroller.addEventListener("change", () => {
      const applied = lightningPlayback.scrubAppliedHour;
      lightningPlayback.scrubAppliedHour = null;
      endLightningSliderScrub();
      if (lightningPlayback.suppressSliderFetch || lightningPlayback.playing) {
        return;
      }
      if (!lightningHeatmapToolbarSections().has(state.displayedSection)) {
        return;
      }
      // input already applied this hour while scrubbing — a second pass with
      // scrubbing cleared can fall into rebuildAndSeal and jump the map.
      if (applied != null && String(applied) === String(els.lhHourScroller.value)) {
        return;
      }
      if (shouldUseHourlyLightningHeatmap()) {
        renderLightningHeatmapHourFrame(els.lhHourScroller.value);
      }
    });
  }
}

function applySectionLayout(section = state.displayedSection) {
  const chartGrid = document.getElementById("chart-grid");
  if (!chartGrid) {
    return;
  }
  chartGrid.classList.toggle("smoke-dust-layout", section === "smoke_dust");
}

function airportDisplayLabel(icao) {
  const code = String(icao || "").trim().toUpperCase();
  const labels = state.options?.airportLabels || state.manifest?.airportLabels || {};
  return labels[code] || code;
}

function fillSelect(select, options, selectedValue) {
  select.innerHTML = "";
  options.forEach((value) => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = airportDisplayLabel(value);
    if (value === selectedValue) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

function monthNameFromNumber(value) {
  const months = state.options?.months || [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const idx = Math.max(1, Math.min(12, Number(value))) - 1;
  return months[idx];
}

function seasonMonthConfig(season) {
  const configs = {
    all: { monthStart: 1, monthEnd: 12, invertMonth: false },
    summer: { monthStart: 2, monthEnd: 12, invertMonth: true },
    autumn: { monthStart: 3, monthEnd: 5, invertMonth: false },
    winter: { monthStart: 6, monthEnd: 8, invertMonth: false },
    spring: { monthStart: 9, monthEnd: 11, invertMonth: false },
    tropical_wet: { monthStart: 4, monthEnd: 10, invertMonth: true },
    tropical_dry: { monthStart: 5, monthEnd: 9, invertMonth: false },
  };

  return configs[season] || configs.all;
}

function refreshSeasonSelection() {
  stopWindRosePlayback();
  stopLightningPlayback();
  windRosePlayback.apiHourlyFigures = null;
  windRosePlayback.apiCacheKey = null;
  resetWindRoseHourlyScale();
  state.lightningHeatmapScaleRef = null;
  state.lightningHeatmapSummaryLayoutRef = null;
  clearLightningGafSeasonPackState();
  cancelGafHourlyIdlePrefetch();
  resetLightningHourlyLayoutState();
  invalidateCompareCache();
  clearChartAxisLocks();
  fetchCharts();
}

function clearChartAxisLocks() {
  state.axisLocks = {};
  state.stackedAxisLabelLocks = {};
}

async function fetchOptions() {
  if (state.options) {
    return state.options;
  }

  if (fetchOptions.inFlightPromise) {
    await fetchOptions.inFlightPromise;
    return state.options;
  }

  fetchOptions.inFlightPromise = (async () => {
  const res = await fetch(apiUrl("/api/options"));
  const data = await res.json();
  state.options = data;

  fillSelect(els.icao, data.airports, data.defaultAirport);

  state.requestedSection = data.default.section;
  state.displayedSection = data.default.section;
  })();

  try {
    await fetchOptions.inFlightPromise;
  } finally {
    fetchOptions.inFlightPromise = null;
  }

  return state.options;
}

function getParams() {
  // Climate-driver / free-range filters were removed from the lite UI. Use
  // season-derived month bounds and full year/hour coverage for any remaining
  // live-API requests.
  const monthConfig = seasonMonthConfig(els.season.value);
  const yearStart = state.options?.default?.yearStart ?? 2000;
  const yearEnd = state.options?.default?.yearEnd ?? 2025;
  const params = new URLSearchParams({
    section: state.requestedSection,
    season: els.season.value,
    enso: "all",
    iod: "all",
    sam: "all",
    mjo: "all",
    fogMonthlyMode: state.fogModes.monthly,
    fogHourlyMode: state.fogModes.hourly,
    fogWindMode: state.fogModes.wind,
    fogDewpointMode: state.fogModes.dewpoint,
    icao: els.icao.value,
    yearStart: String(yearStart),
    yearEnd: String(yearEnd),
    monthStart: monthNameFromNumber(monthConfig.monthStart),
    monthEnd: monthNameFromNumber(monthConfig.monthEnd),
    hourStart: "0",
    hourEnd: "23",
    invertMonth: String(monthConfig.invertMonth),
    invertHour: "false",
  });
  return params;
}

function getSectionFigureBatches(section) {
  if (section === "overview") {
    return [["wind_rose"], ["rain_thunder"], ["temp_dewpoint"], ["fog_low_cloud"]];
  }
  if (section === "wind") {
    return [["wind_rose"], ["gale_weather_split"]];
  }
  if (section === "fog_low_cloud") {
    return [["monthly_fog"], ["fog_share"], ["cloud_distribution"], ["fog_cloud_joint"]];
  }
  if (section === "precipitation") {
    return [["monthly_precip"], ["precip_split"], ["hourly_precip"], ["lightning_heatmap"]];
  }
  return [[]];
}

function validateRanges() {
  return true;
}

function renderMetrics(metrics, section = state.displayedSection) {
  if (!metrics || section === "overview" || section === "wind" || section === "precipitation" || section === "fog_low_cloud" || section === "smoke_dust") {
    els.metrics.innerHTML = "";
    return;
  }

  const cards = [
    { label: "Observations", value: metrics.observations.toLocaleString() },
    { label: "Mean Speed", value: `${metrics.meanSpeed.toFixed(1)} kt` },
    { label: "Max Gust", value: `${metrics.maxGust.toFixed(1)} kt` },
    { label: "Avg Temp", value: `${metrics.avgTemp.toFixed(1)} °C` },
  ];

  els.metrics.innerHTML = cards
    .map((card) => `<article class="metric"><div class="label">${card.label}</div><div class="value">${card.value}</div></article>`)
    .join("");
}

function clearChart(index) {
  const host = els.charts[index];
  if (host?.dataset?.figureId === "wind_rose") {
    teardownWindRoseCalmDomHover(host);
  }
  const { card, shell, legend, maximizeButton, compareHost } = chartUi[index];
  Plotly.purge(host);
  if (compareHost) {
    try {
      Plotly.purge(compareHost);
    } catch (error) {
      // ignore
    }
    compareHost.dataset.figureId = "";
    compareHost.style.height = "";
  }
  legend.innerHTML = "";
  legend.classList.add("hidden");
  shell.classList.add("no-legend");
  shell.classList.remove(
    "is-wind-rose-shell",
    "is-scatter-wind-dewpt-shell",
    "is-compare-mode",
    "is-compare-national-lightning",
  );
  card.classList.add("hidden");
  card.classList.remove("is-maximized", "is-hidden-for-maximized", "is-hidden-for-mobile-chart", "is-mobile-chart-active");
  maximizeButton.classList.add("hidden");
}

function normalizeLegendColor(value) {
  if (Array.isArray(value)) {
    const firstColor = value.find((item) => typeof item === "string" && item.trim()) || value[0];
    return normalizeLegendColor(firstColor);
  }
  if (typeof value === "string" && value.trim()) {
    return value;
  }
  return null;
}

function toOpaqueColor(color) {
  if (typeof color !== "string") return color;
  // Convert rgba(r,g,b,a) → rgba(r,g,b,1) so legend swatches are always fully opaque.
  return color.replace(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,[^)]+\)/gi, "rgba($1,$2,$3,1)");
}

function getTraceLegendColor(trace) {
  const candidates = [
    trace?.meta?.legendColor,
    trace?.marker?.line?.color,
    trace?.marker?.color,
    trace?.line?.color,
    trace?.fillcolor,
  ];

  for (const candidate of candidates) {
    const color = normalizeLegendColor(candidate);
    if (color) {
      return toOpaqueColor(color);
    }
  }

  return "#5f6f8d";
}

function parseColorToRgb(color) {
  if (typeof color !== "string") {
    return null;
  }
  const trimmed = color.trim();
  if (!trimmed.length) {
    return null;
  }

  const hex = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let value = hex[1];
    if (value.length === 3) {
      value = value.split("").map((c) => c + c).join("");
    }
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16),
    };
  }

  const rgb = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgb) {
    return {
      r: Math.max(0, Math.min(255, Number(rgb[1]))),
      g: Math.max(0, Math.min(255, Number(rgb[2]))),
      b: Math.max(0, Math.min(255, Number(rgb[3]))),
    };
  }

  return null;
}

function relativeLuminance({ r, g, b }) {
  const toLinear = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return (0.2126 * toLinear(r)) + (0.7152 * toLinear(g)) + (0.0722 * toLinear(b));
}

function contrastAwareErrorBarColor(trace, alpha = 0.96) {
  const rgb = parseColorToRgb(getTraceLegendColor(trace));
  if (!rgb) {
    return `rgba(17,24,39,${alpha})`;
  }
  const lum = relativeLuminance(rgb);
  // Dark bars/lines -> white error bars, light bars/lines -> near-black error bars.
  if (lum < 0.42) {
    return `rgba(255,255,255,${alpha})`;
  }
  return `rgba(17,24,39,${alpha})`;
}

function customErrorBarColor(trace, figureId = "", alpha = 0.96) {
  const id = String(figureId || "").trim();
  const name = String(trace?.name || "").trim().toLowerCase();

  if (id === "fog_low_cloud" || id === "monthly_fog" || id === "fog_share") {
    if (name === "fog") {
      // Keep Fog as dark blue for contrast with light series.
      return `rgba(33,89,209,${alpha})`;
    }
    // Low-cloud categories are always white for fog frequency charts.
    return `rgba(255,255,255,${alpha})`;
  }

  if (id === "fog_cloud_joint") {
    // Dewpoint panel: force white error bars for all categories.
    return `rgba(255,255,255,${alpha})`;
  }

  return contrastAwareErrorBarColor(trace, alpha);
}

function isTraceVisible(trace) {
  return trace?.visible !== false && trace?.visible !== "legendonly";
}

function projectedTraceVisible(trace, traceIndex, affectedIndices, nextVisibility) {
  if (!affectedIndices.includes(traceIndex)) {
    return isTraceVisible(trace);
  }
  return nextVisibility !== "legendonly" && nextVisibility !== false;
}

function getLegendItems(figure, section = state.displayedSection, figureId = "") {
  const data = figure?.data || [];
  const legend = figure?.layout?.legend || {};
  const groupclick = legend.groupclick || null;

  const items = data.flatMap((trace, index) => {
    if (trace?.showlegend === false || !trace?.name) {
      return [];
    }

    if (
      (figureId === "fog_low_cloud" || figureId === "monthly_fog" || figureId === "fog_share")
      && String(trace.name) === "Freezing fog"
    ) {
      const yVals = numericArray(trace.y);
      if (!yVals.some((value) => Number.isFinite(value) && value > 0)) {
        return [];
      }
    }

    return [{
      index,
      label: String(trace.name),
      legendgroup: trace.legendgroup || null,
      color: getTraceLegendColor(trace),
    }];
  });

  if (section === "fog_low_cloud" || figureId === "fog_low_cloud") {
    items.sort((left, right) => {
      const leftRank = fogLegendOrder.get(left.label) ?? Number.MAX_SAFE_INTEGER;
      const rightRank = fogLegendOrder.get(right.label) ?? Number.MAX_SAFE_INTEGER;
      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }
      return left.index - right.index;
    });
  }

  if (section === "smoke_dust") {
    items.sort((left, right) => {
      const leftRank = smokeLegendOrder.get(left.label) ?? Number.MAX_SAFE_INTEGER;
      const rightRank = smokeLegendOrder.get(right.label) ?? Number.MAX_SAFE_INTEGER;
      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }
      return left.index - right.index;
    });
  }

  if (figureId === "wind_rose") {
    items.sort((left, right) => {
      const leftRank = windRoseLegendOrder.get(left.label) ?? Number.MAX_SAFE_INTEGER;
      const rightRank = windRoseLegendOrder.get(right.label) ?? Number.MAX_SAFE_INTEGER;
      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }
      return left.index - right.index;
    });
  }

  return { items, groupclick };
}

function getAffectedTraceIndices(plotData, item, groupclick) {
  const withLinkedOverlays = (baseIndices) => {
    const linked = plotData
      .map((trace, index) => {
        const source = Number(trace?.meta?.sourceTrace);
        return Number.isInteger(source) && baseIndices.includes(source) ? index : -1;
      })
      .filter((index) => index >= 0);
    return Array.from(new Set([...baseIndices, ...linked]));
  };

  if (groupclick === "togglegroup" && item.legendgroup) {
    const baseIndices = plotData
      .map((trace, index) => (trace?.legendgroup === item.legendgroup ? index : -1))
      .filter((index) => index >= 0);
    return withLinkedOverlays(baseIndices);
  }

  return withLinkedOverlays([item.index]);
}

function refreshLegendState(host, legendHost, legendItems, groupclick) {
  const plotData = host.data || [];
  legendHost.querySelectorAll(".chart-legend-item").forEach((button, index) => {
    const item = legendItems[index];
    if (!item) {
      return;
    }
    const affectedIndices = getAffectedTraceIndices(plotData, item, groupclick);
    const isVisible = affectedIndices.some((traceIndex) => isTraceVisible(plotData[traceIndex]));
    button.classList.toggle("is-inactive", !isVisible);
  });
}

const fogWindHoverLayerSpecs = [
  { legendgroup: "Fog", label: "Fog", customdataIndex: 0 },
  { legendgroup: "2000ft - 1500ft cloud", label: "2000ft - 1500ft cloud", customdataIndex: 1 },
  { legendgroup: "1500ft - 1000ft cloud", label: "1500ft - 1000ft cloud", customdataIndex: 2 },
  { legendgroup: "1000ft - 500ft cloud", label: "1000ft - 500ft cloud", customdataIndex: 3 },
  { legendgroup: "< 500ft cloud", label: "< 500ft cloud", customdataIndex: 4 },
];

function buildFogWindHoverTemplate(visibleLayers) {
  const lines = [
    "%{theta:.0f}<br>",
    "%{r:.1f}",
  ];

  visibleLayers.forEach((layer) => {
    lines.push(`<br>%{customdata[${layer.customdataIndex}]:.3f}`);
  });

  return `${lines.join("")}<extra></extra>`;
}

function syncFogWindHoverTemplate(host) {
  const plotData = host?.data || [];
  const hoverTraceIndex = plotData.findIndex((trace) => trace?.meta?.hoverGrid === "fog_layer_values");
  if (hoverTraceIndex < 0) {
    return Promise.resolve();
  }

  const visibleLayers = fogWindHoverLayerSpecs.filter((layer) => {
    const groupIndices = plotData
      .map((trace, index) => (trace?.legendgroup === layer.legendgroup ? index : -1))
      .filter((index) => index >= 0);
    return groupIndices.some((traceIndex) => isTraceVisible(plotData[traceIndex]));
  });

  const hovertemplate = buildFogWindHoverTemplate(visibleLayers);
  return Plotly.restyle(host, { hovertemplate }, [hoverTraceIndex]);
}

function numericArray(values) {
  const decodedBinary = decodePlotlyBinaryArray(values);
  if (decodedBinary) {
    return decodedBinary;
  }

  if (Array.isArray(values)) {
    return values
      .map((v) => Number(v))
      .filter((v) => Number.isFinite(v));
  }
  if (values && typeof values.length === "number") {
    return Array.from(values)
      .map((v) => Number(v))
      .filter((v) => Number.isFinite(v));
  }
  if (values && typeof values === "object" && Array.isArray(values.data)) {
    return values.data
      .map((v) => Number(v))
      .filter((v) => Number.isFinite(v));
  }
  return [];
}

function tracePointCount(values) {
  const decodedBinary = decodePlotlyBinaryArray(values);
  if (decodedBinary) {
    return decodedBinary.length;
  }

  if (Array.isArray(values)) {
    return values.length;
  }
  if (values && typeof values.length === "number") {
    return values.length;
  }
  if (values && typeof values === "object" && Array.isArray(values.data)) {
    return values.data.length;
  }
  return 0;
}

function decodePlotlyBinaryArrayAligned(values) {
  if (!values || typeof values !== "object" || typeof values.bdata !== "string") {
    return null;
  }

  const dtypeRaw = String(values.dtype || "").toLowerCase();
  if (!dtypeRaw) {
    return null;
  }

  // Plotly can emit dtypes like "f8", "<f8", "|u1".
  const dtype = dtypeRaw.replace(/^[<>=|]/, "");
  const dtypeInfo = {
    f8: { ctor: Float64Array, bytes: 8 },
    f4: { ctor: Float32Array, bytes: 4 },
    i4: { ctor: Int32Array, bytes: 4 },
    u4: { ctor: Uint32Array, bytes: 4 },
    i2: { ctor: Int16Array, bytes: 2 },
    u2: { ctor: Uint16Array, bytes: 2 },
    i1: { ctor: Int8Array, bytes: 1 },
    u1: { ctor: Uint8Array, bytes: 1 },
  }[dtype];

  if (!dtypeInfo) {
    return null;
  }

  try {
    const binary = atob(values.bdata);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    if (bytes.byteLength % dtypeInfo.bytes !== 0) {
      return null;
    }

    const typed = new dtypeInfo.ctor(bytes.buffer);
    return Array.from(typed).map((value) => Number(value));
  } catch {
    return null;
  }
}

function decodePlotlyBinaryArray(values) {
  const aligned = decodePlotlyBinaryArrayAligned(values);
  if (!aligned) {
    return null;
  }
  return aligned.filter((value) => Number.isFinite(value));
}

function alignedValueArray(values) {
  const decodedBinary = decodePlotlyBinaryArrayAligned(values);
  if (decodedBinary) {
    return decodedBinary;
  }

  if (Array.isArray(values)) {
    return values.map((value) => Number(value));
  }
  if (values && typeof values.length === "number") {
    return Array.from(values).map((value) => Number(value));
  }
  if (values && typeof values === "object" && Array.isArray(values.data)) {
    return values.data.map((value) => Number(value));
  }
  return [];
}

function filledErrorArray(values, errorValue) {
  const count = tracePointCount(values);
  if (count <= 0) {
    return [];
  }
  return Array.from({ length: count }, () => errorValue);
}

function pointwiseStdArray(values) {
  const nums = (values || [])
    .map((v) => Number(v))
    .filter((v) => Number.isFinite(v));

  if (!nums.length) {
    return [];
  }

  const globalStd = stdDev(nums);
  if (nums.length === 1) {
    return [globalStd > 0 ? globalStd : 0];
  }

  return nums.map((_, idx) => {
    const left = Math.max(0, idx - 1);
    const right = Math.min(nums.length - 1, idx + 1);
    const localStd = stdDev(nums.slice(left, right + 1));
    if (localStd > 0) {
      return localStd;
    }
    return globalStd > 0 ? globalStd : 0;
  });
}

function representativeStd(values) {
  const valid = (values || [])
    .map((v) => Number(v))
    .filter((v) => Number.isFinite(v) && v > 0);
  if (!valid.length) {
    return 0;
  }
  const avg = valid.reduce((sum, v) => sum + v, 0) / valid.length;
  return Number.isFinite(avg) ? avg : 0;
}

function valueArray(values) {
  if (Array.isArray(values)) {
    return values.slice();
  }
  if (values && typeof values.length === "number") {
    return Array.from(values);
  }
  if (values && typeof values === "object" && Array.isArray(values.data)) {
    return values.data.slice();
  }
  const decodedBinary = decodePlotlyBinaryArray(values);
  return decodedBinary || [];
}

function axisLayoutKeyFromTraceAxis(axisRef, axisType) {
  const normalized = String(axisRef || axisType).toLowerCase();
  if (normalized === axisType) {
    return `${axisType}axis`;
  }
  const suffix = normalized.slice(axisType.length);
  return suffix ? `${axisType}axis${suffix}` : `${axisType}axis`;
}

function paddedAxisCeiling(axisMin, axisMax) {
  const min = Number(axisMin);
  const max = Number(axisMax);
  if (!Number.isFinite(max)) {
    return null;
  }
  const baseline = Number.isFinite(min) ? min : 0;
  const span = Math.max(max - baseline, Math.abs(max) * 0.1, 1);
  const padding = Math.max(span * 0.08, 0.4);
  return max + padding;
}

function finalizeAxisBounds(minValue, maxValue) {
  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
    return null;
  }

  let min = minValue;
  let max = maxValue;
  if (min >= 0) {
    min = 0;
  }
  if (max <= min) {
    max = min + 1;
  }

  const span = max - min;
  const upperPad = Math.max(span * 0.12, 0.5);
  const lowerPad = min < 0 ? Math.max(span * 0.04, 0.25) : 0;
  return {
    min: min - lowerPad,
    max: max + upperPad,
  };
}

function latentErrorArrays(trace) {
  const yValues = numericArray(trace?.y);
  const count = yValues.length;
  if (count <= 1) {
    return { plus: [], minus: [] };
  }

  const yStdArray = pointwiseStdArray(yValues).slice(0, count);
  const yStd = representativeStd(yStdArray);
  const plus = yStdArray.map((sd) => {
    const sdNum = Number(sd);
    return Math.max(0, Number.isFinite(sdNum) ? sdNum : yStd);
  });
  const minus = yValues.map((value, i) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return 0;
    }
    const sd = Number(plus[i]);
    const eff = Number.isFinite(sd) ? sd : yStd;
    return Math.min(eff, Math.max(0, numericValue));
  });
  return { plus, minus };
}

function traceBoundsWithError(trace, options = {}) {
  const includeLatentError = Boolean(options.includeLatentError);
  const includeOverlayError = Boolean(options.includeOverlayError);
  const yVals = valueArray(trace?.y);
  const baseVals = valueArray(trace?.base);
  const errorY = trace?.error_y;
  const hasVisibleError = Boolean(errorY?.visible)
    || (includeOverlayError && isStrictValueErrorOverlayTrace(trace) && errorY);
  let errVals = hasVisibleError ? valueArray(errorY?.array) : [];
  let errMinusVals = hasVisibleError ? valueArray(errorY?.arrayminus) : [];
  const fallbackPlus = hasVisibleError ? Number(errorY?.value) : 0;
  const symmetric = errorY?.symmetric !== false;
  const fallbackMinus = hasVisibleError
    ? (Number.isFinite(Number(errorY?.valueminus)) ? Number(errorY?.valueminus) : fallbackPlus)
    : 0;

  if (
    !hasVisibleError
    && includeLatentError
    && supportsErrorBars(trace)
    && !isErrorBarOverlayTrace(trace)
    && !isStrictValueErrorOverlayTrace(trace)
  ) {
    const latent = latentErrorArrays(trace);
    if (latent.plus.length) {
      errVals = latent.plus;
      errMinusVals = latent.minus;
    }
  }

  const count = Math.max(yVals.length, baseVals.length, errVals.length, errMinusVals.length);
  if (!count) {
    return null;
  }

  let minVal = Number.POSITIVE_INFINITY;
  let maxVal = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < count; i += 1) {
    const yNum = Number(yVals[i]);
    const baseNum = Number(baseVals[i]);
    const center = (trace?.type === "bar" ? (Number.isFinite(baseNum) ? baseNum : 0) : 0)
      + (Number.isFinite(yNum) ? yNum : 0);

    if (!Number.isFinite(center)) {
      continue;
    }

    const errNum = Number(errVals[i]);
    const errPlus = Math.max(0, Number.isFinite(errNum) ? errNum : (Number.isFinite(fallbackPlus) ? fallbackPlus : 0));

    const errMinusNum = Number(errMinusVals[i]);
    const rawErrMinus = symmetric
      ? errPlus
      : (Number.isFinite(errMinusNum) ? errMinusNum : (Number.isFinite(fallbackMinus) ? fallbackMinus : 0));
    const errMinus = Math.max(0, rawErrMinus);

    minVal = Math.min(minVal, center - errMinus);
    maxVal = Math.max(maxVal, center + errPlus);
  }

  if (!Number.isFinite(minVal) || !Number.isFinite(maxVal)) {
    return null;
  }

  return { min: minVal, max: maxVal };
}

function usesResponsiveYAxis(figureId = "") {
  if (!figureId || figureId === "wind_rose") {
    return false;
  }
  return frequencyFigureIds.has(figureId) || figureId === "scatter_wind_dewpt";
}

const FREQUENCY_CHART_MIN_MARGIN_B = 44;
const FREQUENCY_CHART_MIN_MARGIN_L = 52;
const HOURLY_PRECIP_PANEL = {
  margin: { r: 42 },
  xDomain: [0, 1],
  y2TitleStandoff: 8,
  y2TickStandoff: 2,
};
const CANONICAL_GEOMETRY_VERSION = 10;

function figureUsesFrequencyAxisLabelLock(figureId = "", layout = {}) {
  if (!figureId || layout?.polar) {
    return false;
  }
  return usesResponsiveYAxis(figureId) && figureId !== "scatter_wind_dewpt";
}

function hostUsesFrequencyAxisLabelLock(host) {
  if (!host) {
    return false;
  }
  return figureUsesFrequencyAxisLabelLock(host.dataset?.figureId || "", host.layout);
}

function effectiveFrequencyMarginBottom(host, candidate = null) {
  const baked = Number(candidate ?? host?.layout?.margin?.b);
  const base = Number.isFinite(baked) ? baked : FREQUENCY_CHART_MIN_MARGIN_B;
  return Math.max(base, FREQUENCY_CHART_MIN_MARGIN_B);
}

function copyMarginBox(margin = {}) {
  const next = {};
  ["l", "r", "t", "b"].forEach((key) => {
    const value = Number(margin[key]);
    if (Number.isFinite(value)) {
      next[key] = value;
    }
  });
  return next;
}

function layoutUsesOverlayingY2(layout = {}) {
  return String(layout?.yaxis2?.overlaying || "") === "y";
}

function computeMainBarAxisBounds(traces, axisName = "y", options = {}) {
  const barmode = String(options.barmode || "").toLowerCase();
  const includeLatentError = options.includeLatentError !== false;
  const visibleAt = options.projectedVisible || ((trace) => {
    if (!trace || trace.visible === false || trace.visible === "legendonly") {
      return false;
    }
    return isTraceVisible(trace);
  });

  let minValue = Number.POSITIVE_INFINITY;
  let maxValue = Number.NEGATIVE_INFINITY;

  if (barmode === "stack") {
    // Accumulate by x within each axis so paired offset columns (rain vs TS)
    // stay independent while exclusive TS bands stack on the shared TS x.
    const cumulative = new Map();
    (traces || []).forEach((trace, index) => {
      if (!trace || trace.type !== "bar") {
      return;
    }
      if (isErrorBarOverlayTrace(trace) || isStrictValueErrorOverlayTrace(trace)) {
      return;
    }
      if (!visibleAt(trace, index) || traceAxisName(trace) !== axisName) {
        return;
      }

      const xValues = valueArray(trace.x);
      const yValues = numericArray(trace.y);
      const count = Math.min(xValues.length, yValues.length);
      if (!count) {
        return;
      }

      const latent = includeLatentError ? latentErrorArrays(trace) : { plus: [], minus: [] };
      for (let i = 0; i < count; i += 1) {
        const xKey = String(xValues[i] ?? i);
        const base = cumulative.get(xKey) || 0;
        const yNum = Number(yValues[i]);
        const top = base + (Number.isFinite(yNum) ? yNum : 0);
        cumulative.set(xKey, top);

        const errPlus = includeLatentError ? Math.max(0, Number(latent.plus[i]) || 0) : 0;
        const errMinus = includeLatentError ? Math.min(errPlus, Math.max(0, top)) : 0;
        minValue = Math.min(minValue, top - errMinus);
        maxValue = Math.max(maxValue, top + errPlus);
      }
    });
  } else {
    (traces || []).forEach((trace, index) => {
      if (!trace || trace.type !== "bar") {
        return;
      }
      if (isErrorBarOverlayTrace(trace) || isStrictValueErrorOverlayTrace(trace)) {
        return;
      }
      if (!visibleAt(trace, index) || traceAxisName(trace) !== axisName) {
        return;
      }
      const bounds = traceBoundsWithError(trace, { includeLatentError });
    if (!bounds) {
      return;
    }
      minValue = Math.min(minValue, bounds.min);
    maxValue = Math.max(maxValue, bounds.max);
  });
  }

  return finalizeAxisBounds(minValue, maxValue);
}

function computeDualOverlayAxisMax(figure, axisName = "y") {
  const bounds = computeMainBarAxisBounds(figure?.data || [], axisName, {
    barmode: figure?.layout?.barmode,
    includeLatentError: true,
    projectedVisible: (trace) => Boolean(trace)
      && trace.visible !== false
      && trace.visible !== "legendonly",
  });
  if (!bounds || !(bounds.max > 0)) {
    return 1;
  }
  return bounds.max;
}

function applyHourlyPrecipPanelGeometry(layout = {}) {
  layout.margin = {
    ...(layout.margin || {}),
    r: Math.max(Number(layout.margin?.r) || 0, HOURLY_PRECIP_PANEL.margin.r),
  };
  layout.xaxis = {
    ...(layout.xaxis || {}),
    domain: HOURLY_PRECIP_PANEL.xDomain.slice(),
    automargin: false,
  };

  const y2Title = layout.yaxis2?.title;
  const y2TitleObj = typeof y2Title === "object" && y2Title !== null
    ? y2Title
    : { text: y2Title || "" };
  layout.yaxis2 = {
    ...(layout.yaxis2 || {}),
    automargin: false,
    ticklabelstandoff: HOURLY_PRECIP_PANEL.y2TickStandoff,
    title: {
      ...y2TitleObj,
      standoff: HOURLY_PRECIP_PANEL.y2TitleStandoff,
    },
  };

  return layout;
}

function enforceHourlyPrecipDualAxisLayout(figure, chartHeight = null) {
  figure.layout = figure.layout || {};
  if (chartHeight != null) {
    figure.layout.height = chartHeight;
  }

  const yMax = computeDualOverlayAxisMax(figure, "y");
  const y2Max = computeDualOverlayAxisMax(figure, "y2");

  figure.layout.yaxis = {
    ...(figure.layout.yaxis || {}),
    range: [0, yMax],
    autorange: false,
    rangemode: "tozero",
    automargin: false,
  };
  figure.layout.yaxis2 = {
    ...(figure.layout.yaxis2 || {}),
    overlaying: "y",
    side: "right",
    range: [0, y2Max],
    autorange: false,
    rangemode: "tozero",
    showgrid: false,
    automargin: false,
  };
  delete figure.layout.yaxis2.domain;
  applyHourlyPrecipPanelGeometry(figure.layout);
}

function buildHourlyPrecipLayoutPatch(host, options = {}) {
  const { chartHeight = null, includeAutosize = false } = options;
  const figure = { data: host?.data, layout: host?.layout };

  const patch = {
    ...stableFrequencyAxisRelayout(host),
    "margin.r": HOURLY_PRECIP_PANEL.margin.r,
    "xaxis.domain": HOURLY_PRECIP_PANEL.xDomain.slice(),
    "yaxis.range": [0, computeDualOverlayAxisMax(figure, "y")],
    "yaxis.autorange": false,
    "yaxis.rangemode": "tozero",
    "yaxis2.range": [0, computeDualOverlayAxisMax(figure, "y2")],
    "yaxis2.autorange": false,
    "yaxis2.rangemode": "tozero",
    "yaxis2.overlaying": "y",
    "yaxis2.side": "right",
    "yaxis2.automargin": false,
    "yaxis2.domain": null,
    "yaxis2.ticklabelstandoff": HOURLY_PRECIP_PANEL.y2TickStandoff,
    "yaxis2.title.standoff": HOURLY_PRECIP_PANEL.y2TitleStandoff,
  };

  if (chartHeight != null) {
    patch.height = chartHeight;
  }
  if (includeAutosize) {
    patch.width = null;
    patch.autosize = true;
  }

  return patch;
}

function applyHourlyPrecipLayout(host, options = {}) {
  if (!host?.layout?.yaxis2 || !layoutUsesOverlayingY2(host.layout)) {
    return Promise.resolve();
  }

  const patch = buildHourlyPrecipLayoutPatch(host, options);
  if (!Object.keys(patch).length) {
    return Promise.resolve();
  }

  return Plotly.relayout(host, patch).then(() => captureFrequencyAxisLabelLock(host));
}

function relayoutHourlyPrecipDualAxis(host, chartHeight = null) {
  return applyHourlyPrecipLayout(host, { chartHeight });
}

async function finalizeHourlyPrecipMaximizedLayout(host, chartHeight = null) {
  if (!host || host.dataset?.figureId !== "hourly_precip") {
    return;
  }

  const resolvedHeight = chartHeight ?? (Number.parseFloat(host.style.height) || null);
  await awaitLayoutSettle();
  await Plotly.Plots.resize(host);
  await applyHourlyPrecipLayout(host, {
    chartHeight: resolvedHeight,
    includeAutosize: true,
  });
  if (state.showErrorBars) {
    await syncDualAxisPairedBarOverlayPositions(host);
  }
}

function copyAxisDomain(axis = {}) {
  if (!Array.isArray(axis.domain) || axis.domain.length !== 2) {
    return null;
  }
  return [axis.domain[0], axis.domain[1]];
}

function collectXaxisLabelLockProps(xaxis = {}) {
  const lock = {
    ticklabelposition: xaxis.ticklabelposition || "outside",
  };

  ["tickmode", "tickangle", "ticklabelstandoff", "ticklabeloverflow", "automargin", "type", "side"].forEach((key) => {
    if (xaxis[key] !== undefined) {
      lock[key] = xaxis[key];
    }
  });

  if (Array.isArray(xaxis.range) && xaxis.range.length === 2) {
    lock.range = [xaxis.range[0], xaxis.range[1]];
  }
  if (Array.isArray(xaxis.tickvals) && xaxis.tickvals.length) {
    lock.tickvals = xaxis.tickvals.slice();
  }
  if (Array.isArray(xaxis.ticktext) && xaxis.ticktext.length) {
    lock.ticktext = xaxis.ticktext.slice();
  }
  if (Array.isArray(xaxis.categoryarray) && xaxis.categoryarray.length) {
    lock.categoryarray = xaxis.categoryarray.slice();
  }
  if (typeof xaxis.categoryorder === "string" && xaxis.categoryorder.length) {
    lock.categoryorder = xaxis.categoryorder;
  }

  return lock;
}

function collectFrequencyPlotGeometryLock(layout = {}) {
  const margin = copyMarginBox(layout.margin);
  margin.b = effectiveFrequencyMarginBottom({ layout }, margin.b);

  const domains = {
    x: copyAxisDomain(layout.xaxis) || [0, 1],
    y: copyAxisDomain(layout.yaxis) || [0, 1],
  };
  if (layout.yaxis2 && !layoutUsesOverlayingY2(layout)) {
    domains.y2 = copyAxisDomain(layout.yaxis2) || [0, 1];
  }

  const anchors = {};
  if (typeof layout.xaxis?.anchor === "string") {
    anchors.x = layout.xaxis.anchor;
  }
  if (typeof layout.yaxis?.anchor === "string") {
    anchors.y = layout.yaxis.anchor;
  }
  if (typeof layout.yaxis2?.anchor === "string") {
    anchors.y2 = layout.yaxis2.anchor;
  }

  return {
    margin,
    domains,
    anchors,
    yAutomargin: false,
    y2Automargin: false,
  };
}

function seedFrequencyPlotGeometryLock(figure, figureId = "") {
  if (!figureUsesFrequencyAxisLabelLock(figureId, figure?.layout)) {
    return;
  }

  const layout = figure.layout || {};
  const lock = {
    ...collectXaxisLabelLockProps(layout.xaxis),
    ...collectFrequencyPlotGeometryLock(layout),
  };

  state.stackedAxisLabelLocks[frequencyAxisLockKey(figureId)] = lock;
}

function seedGroupedBarXAxisLockOnly(figure, figureId = "") {
  if (!strictGroupedBarOverlayFigureIds.has(figureId)) {
    return;
  }

  const layout = figure.layout || {};
  state.stackedAxisLabelLocks[frequencyAxisLockKey(figureId)] = {
    ...collectXaxisLabelLockProps(layout.xaxis),
  };
}

function seedGroupedBarInitialYRange(figure) {
  const traces = figure?.data || [];
  const layout = figure.layout || {};
  const hasY2 = Boolean(layout.yaxis2);
  const barmode = layout.barmode;

  function boundsForAxis(axisName) {
    return computeMainBarAxisBounds(traces, axisName, {
      barmode,
      includeLatentError: true,
    });
  }

  const yBounds = boundsForAxis("y");
  if (yBounds) {
    figure.layout = figure.layout || {};
    figure.layout.yaxis = {
      ...(layout.yaxis || {}),
      range: [0, yBounds.max],
      autorange: false,
      rangemode: "tozero",
    };
  }

  if (hasY2) {
    const y2Bounds = boundsForAxis("y2");
    if (y2Bounds) {
      figure.layout.yaxis2 = {
        ...(layout.yaxis2 || {}),
        range: [0, y2Bounds.max],
        autorange: false,
        rangemode: "tozero",
      };
    }
  }
}

function invalidateCanonicalGeometry(host) {
  if (!hostUsesCanonicalGroupedBarGeometry(host)) {
    return;
  }

  const key = stackedAxisLockKey(host);
  const lock = state.stackedAxisLabelLocks[key];
  if (!lock) {
    return;
  }

  delete lock.canonicalGeometry;
  delete lock.geometryVersion;
  delete lock.margin;
  delete lock.domains;
  delete lock.anchors;
  delete lock.yaxisTick;
}

function invalidateCanonicalGeometryForVisibleCharts() {
  const visibleCount = state.latestFigures.length
    ? Math.min(state.latestFigures.length, els.charts.length)
    : 0;

  for (let i = 0; i < visibleCount; i += 1) {
    invalidateCanonicalGeometry(els.charts[i]);
  }
}

function prepareFrequencyFigureGeometry(figure, figureId = "", options = {}) {
  if (!figureUsesFrequencyAxisLabelLock(figureId, figure?.layout)) {
    return;
  }

  const seedLock = options.seedLock !== false;
  const layout = figure.layout || (figure.layout = {});
  layout.margin = {
    ...(layout.margin || {}),
    ...copyMarginBox(layout.margin),
    b: effectiveFrequencyMarginBottom({ layout }, layout.margin?.b),
  };
  layout.yaxis = {
    ...(layout.yaxis || {}),
    automargin: false,
  };
  if (layout.yaxis2) {
    layout.yaxis2 = {
      ...layout.yaxis2,
      automargin: false,
    };
  }

  if (strictGroupedBarOverlayFigureIds.has(figureId)) {
    const xDomain = figureId === "hourly_precip"
      ? HOURLY_PRECIP_PANEL.xDomain.slice()
      : [0, 1];
    layout.xaxis = {
      ...(layout.xaxis || {}),
      domain: xDomain,
      anchor: "y",
      automargin: false,
    };
    layout.yaxis = {
      ...(layout.yaxis || {}),
      domain: [0, 1],
      anchor: "x",
      automargin: false,
    };
    if (layout.yaxis2) {
      layout.yaxis2 = {
        ...layout.yaxis2,
        automargin: false,
      };
      if (figureId === "hourly_precip") {
        applyHourlyPrecipPanelGeometry(layout);
      }
    }
    layout.margin = {
      ...(layout.margin || {}),
      l: Math.max(layout.margin?.l || 0, FREQUENCY_CHART_MIN_MARGIN_L),
      b: effectiveFrequencyMarginBottom({ layout }, layout.margin?.b),
      ...(figureId === "hourly_precip"
        ? { r: Math.max(layout.margin?.r || 0, HOURLY_PRECIP_PANEL.margin.r) }
        : {}),
    };
    seedGroupedBarInitialYRange(figure);
    if (seedLock) {
    seedGroupedBarXAxisLockOnly(figure, figureId);
    }
    return;
  }

  if (seedLock) {
  seedFrequencyPlotGeometryLock(figure, figureId);
  }
}

function hostUsesCanonicalGroupedBarGeometry(host) {
  const figureId = host?.dataset?.figureId || "";
  return strictGroupedBarOverlayFigureIds.has(figureId);
}

function hasCanonicalPlotGeometry(host) {
  const lock = state.stackedAxisLabelLocks[stackedAxisLockKey(host)];
  return Boolean(
    lock?.canonicalGeometry
    && lock?.geometryVersion === CANONICAL_GEOMETRY_VERSION
    && lock?.margin
    && lock?.domains,
  );
}

function awaitLayoutSettle() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

function collectYaxisTickLockProps(yaxis = {}) {
  const lock = {};
  ["tickmode", "dtick", "tick0", "nticks", "tickformat", "side", "position"].forEach((key) => {
    if (yaxis[key] !== undefined) {
      lock[key] = yaxis[key];
    }
  });
  if (Array.isArray(yaxis.tickvals) && yaxis.tickvals.length) {
    lock.tickvals = yaxis.tickvals.slice();
  }
  return lock;
}

function readPlotGeometryFromHost(host) {
  const layout = host?._fullLayout || host?.layout || {};
  const margin = copyMarginBox(layout.margin);
  margin.b = effectiveFrequencyMarginBottom({ layout }, margin.b);
  margin.l = Math.max(margin.l || 0, FREQUENCY_CHART_MIN_MARGIN_L);
  if (usesDualAxisPairedBarOverlays(host)) {
    margin.r = Math.max(margin.r || 0, HOURLY_PRECIP_PANEL.margin.r);
  }

  const domains = {
    x: usesDualAxisPairedBarOverlays(host)
      ? HOURLY_PRECIP_PANEL.xDomain.slice()
      : [0, 1],
    y: [0, 1],
  };
  if (layout.yaxis2 && !layoutUsesOverlayingY2(layout)) {
    domains.y2 = copyAxisDomain(layout.yaxis2) || [0, 1];
  }

  const anchors = {
    x: typeof layout.xaxis?.anchor === "string" ? layout.xaxis.anchor : "y",
    y: typeof layout.yaxis?.anchor === "string" ? layout.yaxis.anchor : "x",
  };
  if (layout.yaxis2 && typeof layout.yaxis2.anchor === "string") {
    anchors.y2 = layout.yaxis2.anchor;
  }

  return {
    margin,
    domains,
    anchors,
    yaxisTick: collectYaxisTickLockProps(layout.yaxis),
    canonicalGeometry: true,
    geometryVersion: CANONICAL_GEOMETRY_VERSION,
    yAutomargin: false,
    y2Automargin: false,
  };
}

function buildPreCanonicalGeometryRelayout(host) {
  const lock = state.stackedAxisLabelLocks[stackedAxisLockKey(host)] || {};
  const relayout = {
    "xaxis.ticklabelposition": lock.ticklabelposition || "outside",
    "margin.b": effectiveFrequencyMarginBottom(host, lock?.margin?.b),
    "yaxis.automargin": false,
  };

  ["tickmode", "tickangle", "ticklabelstandoff", "ticklabeloverflow", "automargin", "type", "side"].forEach((key) => {
    if (lock[key] !== undefined) {
      relayout[`xaxis.${key}`] = lock[key];
    }
  });

  if (Array.isArray(lock.range) && lock.range.length === 2) {
    relayout["xaxis.range"] = [lock.range[0], lock.range[1]];
    relayout["xaxis.autorange"] = false;
  }
  if (Array.isArray(lock.tickvals) && lock.tickvals.length) {
    relayout["xaxis.tickvals"] = lock.tickvals.slice();
  }
  if (Array.isArray(lock.ticktext) && lock.ticktext.length) {
    relayout["xaxis.ticktext"] = lock.ticktext.slice();
  }
  if (typeof lock.categoryorder === "string" && lock.categoryorder.length) {
    relayout["xaxis.categoryorder"] = lock.categoryorder;
  }
  if (Array.isArray(lock.categoryarray) && lock.categoryarray.length) {
    relayout["xaxis.categoryarray"] = lock.categoryarray.slice();
  }

  if (host.layout?.yaxis2) {
    relayout["yaxis2.automargin"] = false;
  }

  return relayout;
}

function strictValueOverlayTraceIndices(host) {
  return (host?.data || [])
    .map((trace, index) => (isStrictValueErrorOverlayTrace(trace) ? index : -1))
    .filter((index) => index >= 0);
}

async function deleteStrictValueOverlayTraces(host) {
  const indices = strictValueOverlayTraceIndices(host);
  if (!indices.length) {
    return;
  }
  await Plotly.deleteTraces(host, indices);
}

async function calibrateCanonicalPlotGeometry(host, options = {}) {
  if (!hostUsesCanonicalGroupedBarGeometry(host)) {
    return;
  }

  const resizeOnly = options.mode === "resize";
  const isDualAxisHourlyPrecip = usesDualAxisPairedBarOverlays(host);

  if (isDualAxisHourlyPrecip && resizeOnly) {
    await Plotly.Plots.resize(host);
    await applyHourlyPrecipLayout(host, { includeAutosize: true });
    if (state.showErrorBars) {
      await syncDualAxisPairedBarOverlayPositions(host);
    }
    return;
  }

  if (hasCanonicalPlotGeometry(host) && !resizeOnly) {
    return;
  }

  // Capture reference frame from main bars only (no error-bar overlays).
  if (!resizeOnly) {
    await deleteStrictValueOverlayTraces(host);
  }

  const hostMargin = host.layout?.margin || {};
  const compareDual = hostIsCompareDualPanelHost(host);
  const calibrationRelayout = {
    ...buildPreCanonicalGeometryRelayout(host),
    "xaxis.domain": isDualAxisHourlyPrecip
      ? HOURLY_PRECIP_PANEL.xDomain.slice()
      : [0, 1],
    "yaxis.domain": [0, 1],
    "xaxis.anchor": "y",
    "yaxis.anchor": "x",
    "xaxis.automargin": false,
    "yaxis.automargin": false,
    "yaxis.rangemode": "tozero",
  };
  if (compareDual) {
    calibrationRelayout.margin = { ...COMPARE_PANEL_MARGIN };
    calibrationRelayout.showlegend = false;
  } else {
    calibrationRelayout["margin.l"] = FREQUENCY_CHART_MIN_MARGIN_L;
    calibrationRelayout["margin.r"] = isDualAxisHourlyPrecip
      ? HOURLY_PRECIP_PANEL.margin.r
      : (hostMargin.r ?? 32);
    calibrationRelayout["margin.t"] = hostMargin.t ?? 36;
    calibrationRelayout["margin.b"] = effectiveFrequencyMarginBottom(host, hostMargin.b);
  }
  if (isDualAxisHourlyPrecip) {
    calibrationRelayout["yaxis.range"] = [0, computeDualOverlayAxisMax({ data: host.data, layout: host.layout }, "y")];
    calibrationRelayout["yaxis.autorange"] = false;
    calibrationRelayout["yaxis2.range"] = [0, computeDualOverlayAxisMax({ data: host.data, layout: host.layout }, "y2")];
    calibrationRelayout["yaxis2.autorange"] = false;
    calibrationRelayout["yaxis2.rangemode"] = "tozero";
    calibrationRelayout["yaxis2.overlaying"] = "y";
    calibrationRelayout["yaxis2.side"] = "right";
    calibrationRelayout["yaxis2.domain"] = null;
  } else {
    const bounds = computeGroupedBarCalibrationAxisBounds(host, "y");
    if (bounds) {
      calibrationRelayout["yaxis.range"] = [0, bounds.max];
      calibrationRelayout["yaxis.autorange"] = false;
    }
    if (layoutUsesOverlayingY2(host.layout)) {
      const y2Bounds = computeGroupedBarCalibrationAxisBounds(host, "y2");
      if (y2Bounds) {
        calibrationRelayout["yaxis2.range"] = [0, y2Bounds.max];
        calibrationRelayout["yaxis2.autorange"] = false;
        calibrationRelayout["yaxis2.rangemode"] = "tozero";
        calibrationRelayout["yaxis2.overlaying"] = "y";
        calibrationRelayout["yaxis2.side"] = "right";
      }
      calibrationRelayout["yaxis2.domain"] = null;
    }
  }

  if (Object.keys(calibrationRelayout).length) {
    await Plotly.relayout(host, calibrationRelayout);
    await awaitLayoutSettle();
  }

  const key = stackedAxisLockKey(host);
  const xaxis = host.layout?.xaxis || {};
  state.stackedAxisLabelLocks[key] = {
    ...(state.stackedAxisLabelLocks[key] || {}),
    ...collectXaxisLabelLockProps(xaxis),
    ...readPlotGeometryFromHost(host),
  };

  if (!resizeOnly) {
    await rebuildStrictValueErrorBarOverlays(host, { forceRebuild: state.showErrorBars });
    await finishStrictValueErrorBarOverlays(host);
    await awaitLayoutSettle();
  }

  if (isDualAxisHourlyPrecip) {
    await applyHourlyPrecipLayout(host);
    if (state.showErrorBars) {
      await syncDualAxisPairedBarOverlayPositions(host);
    }
    return;
  }

  await applyCanonicalGroupedBarRelayout(host);
}

function sealCanonicalLayoutState(host) {
  const lock = state.stackedAxisLabelLocks[stackedAxisLockKey(host)];
  if (!lock?.canonicalGeometry) {
    return;
  }

  host.layout = host.layout || {};
  host.layout.margin = {
    ...(host.layout.margin || {}),
    ...lock.margin,
  };

  host.layout.xaxis = {
    ...(host.layout.xaxis || {}),
    domain: lock.domains.x.slice(),
    anchor: lock.anchors.x || "y",
    automargin: false,
    ticklabelposition: lock.ticklabelposition || "outside",
  };
  ["tickmode", "tickangle", "ticklabelstandoff", "ticklabeloverflow", "automargin", "type", "side"].forEach((key) => {
    if (lock[key] !== undefined) {
      host.layout.xaxis[key] = lock[key];
    }
  });
  if (Array.isArray(lock.range) && lock.range.length === 2) {
    host.layout.xaxis.range = [lock.range[0], lock.range[1]];
    host.layout.xaxis.autorange = false;
  }
  if (Array.isArray(lock.tickvals) && lock.tickvals.length) {
    host.layout.xaxis.tickvals = lock.tickvals.slice();
  }
  if (Array.isArray(lock.ticktext) && lock.ticktext.length) {
    host.layout.xaxis.ticktext = lock.ticktext.slice();
  }
  if (typeof lock.categoryorder === "string" && lock.categoryorder.length) {
    host.layout.xaxis.categoryorder = lock.categoryorder;
  }
  if (Array.isArray(lock.categoryarray) && lock.categoryarray.length) {
    host.layout.xaxis.categoryarray = lock.categoryarray.slice();
  }

  host.layout.yaxis = {
    ...(host.layout.yaxis || {}),
    domain: lock.domains.y.slice(),
    anchor: lock.anchors.y || "x",
    automargin: false,
  };
  const yaxisTick = lock.yaxisTick || {};
  ["tickmode", "dtick", "tick0", "nticks", "tickformat", "side", "position"].forEach((key) => {
    if (yaxisTick[key] !== undefined) {
      host.layout.yaxis[key] = yaxisTick[key];
    }
  });

  if (lock.domains.y2 && host.layout.yaxis2 && !layoutUsesOverlayingY2(host.layout)) {
    host.layout.yaxis2 = {
      ...(host.layout.yaxis2 || {}),
      domain: lock.domains.y2.slice(),
      anchor: lock.anchors.y2,
      automargin: false,
    };
  } else if (host.layout.yaxis2 && layoutUsesOverlayingY2(host.layout)) {
    host.layout.yaxis2 = {
      ...(host.layout.yaxis2 || {}),
      overlaying: "y",
      side: "right",
      automargin: false,
    };
    delete host.layout.yaxis2.domain;
  }
}

function traceAxisName(trace, defaultAxis = "y") {
  return trace?.yaxis === "y2" ? "y2" : defaultAxis;
}

function traceShouldCountForBounds(host, trace, options = {}) {
  if (!trace || String(trace.type || "").includes("polar")) {
    return false;
  }
  if (!isTraceVisible(trace)) {
    return false;
  }

  const figureId = host?.dataset?.figureId || "";
  const effectiveShowErrorBars = Boolean(options.simulateErrorBarsOn) || state.showErrorBars;
  const isOverlay = isErrorBarOverlayTrace(trace) || isStrictValueErrorOverlayTrace(trace);
  if (isOverlay) {
    return effectiveShowErrorBars;
  }

  const isStacked = String(host.layout?.barmode || "").toLowerCase() === "stack";
  if (effectiveShowErrorBars && strictValueHoverFigureIds.has(figureId) && supportsErrorBars(trace)) {
    return false;
  }
  if (effectiveShowErrorBars && isStacked && strictStackedBarOverlayFigureIds.has(figureId) && trace.type === "bar") {
    return false;
  }
  if (isScatterWindDewptCiBand(trace)) {
    return effectiveShowErrorBars;
  }
  if (trace.type === "bar" || trace.type === "scatter") {
    return true;
  }
  return false;
}

function computeResponsiveAxisBounds(host, axisName = "y", options = {}) {
  const layout = host?.layout || {};
  if (layout.polar) {
    return null;
  }

  const barmode = String(layout.barmode || "").toLowerCase();
  const traces = host?.data || [];
  let minValue = Number.POSITIVE_INFINITY;
  let maxValue = Number.NEGATIVE_INFINITY;

  const includeBounds = (bounds) => {
    if (!bounds) {
      return;
    }
    minValue = Math.min(minValue, bounds.min);
    maxValue = Math.max(maxValue, bounds.max);
  };

  if (barmode === "stack") {
    const cumulativeByAxis = new Map();
    traces.forEach((trace) => {
      if (!traceShouldCountForBounds(host, trace, options)) {
        return;
      }
      if (traceAxisName(trace) !== axisName) {
        return;
      }
      if (isErrorBarOverlayTrace(trace) || isStrictValueErrorOverlayTrace(trace)) {
        includeBounds(traceBoundsWithError(trace, { includeLatentError: false }));
        return;
      }
      if (trace.type === "bar") {
        const xValues = valueArray(trace.x);
        const yValues = numericArray(trace.y);
        const count = Math.min(xValues.length, yValues.length);
        if (!count) {
          return;
        }

        const yStdArray = pointwiseStdArray(yValues).slice(0, count);
        const yStd = representativeStd(yStdArray);
        const cumulative = cumulativeByAxis.get(axisName) || new Map();

        for (let i = 0; i < count; i += 1) {
          const xKey = String(xValues[i] ?? i);
          const base = cumulative.get(xKey) || 0;
          const yNum = Number(yValues[i]);
          const top = base + (Number.isFinite(yNum) ? yNum : 0);
          cumulative.set(xKey, top);

          const sd = Number(yStdArray[i]);
          const errPlus = Math.max(0, Number.isFinite(sd) ? sd : yStd);
          const errMinus = Math.min(errPlus, Math.max(0, top));
          minValue = Math.min(minValue, top - errMinus);
          maxValue = Math.max(maxValue, top + errPlus);
        }
        cumulativeByAxis.set(axisName, cumulative);
        return;
      }
      includeBounds(traceBoundsWithError(trace, { includeLatentError: true }));
    });
  } else {
    traces.forEach((trace) => {
      if (!traceShouldCountForBounds(host, trace, options)) {
        return;
      }
      if (traceAxisName(trace) !== axisName) {
        return;
      }
      includeBounds(traceBoundsWithError(trace, { includeLatentError: true }));
    });
  }

  return finalizeAxisBounds(minValue, maxValue);
}

function computeGroupedBarCalibrationAxisBounds(host, axisName = "y") {
  // Always derive range from main bar traces plus latent SD headroom (stack-aware).
  return computeMainBarAxisBounds(host?.data || [], axisName, {
    barmode: host?.layout?.barmode,
    includeLatentError: true,
  });
}

function computeStrictGroupedBarAxisBounds(host, axisName = "y", options = {}) {
  // Always derive range from visible main bar traces plus latent SD headroom.
  // Overlay traces exist for rendering only; switching to overlay-based bounds
  // on error-bar toggle was resetting the axis to the all-series default.
  // When barmode is stack, accumulate by x so stacked TS bands + SD clear the axis.
  return computeMainBarAxisBounds(host?.data || [], axisName, {
    barmode: host?.layout?.barmode,
    includeLatentError: true,
    projectedVisible: options.projectedVisible || ((trace) => isTraceVisible(trace)),
  });
}

function computeGroupedBarBoundsAfterLegendToggle(host, affectedIndices, nextVisibility) {
  const projectedVisible = (trace, index) => projectedTraceVisible(trace, index, affectedIndices, nextVisibility);
  const bounds = {};
  const yBounds = computeStrictGroupedBarAxisBounds(host, "y", { projectedVisible });
  if (yBounds) {
    bounds.y = yBounds;
  }
  if (host.layout?.yaxis2) {
    const y2Bounds = computeStrictGroupedBarAxisBounds(host, "y2", { projectedVisible });
    if (y2Bounds) {
      bounds.y2 = y2Bounds;
    }
  }
  return bounds;
}

function buildGroupedBarLegendToggleLayoutPatch(host, projectedBounds) {
  const lock = state.stackedAxisLabelLocks[stackedAxisLockKey(host)] || {};
  const layoutPatch = {
    ...stableFrequencyAxisRelayout(host),
    "xaxis.automargin": false,
    "yaxis.automargin": false,
  };

  if (projectedBounds.y) {
    layoutPatch["yaxis.range"] = [0, Number(projectedBounds.y.max)];
    layoutPatch["yaxis.autorange"] = false;
    layoutPatch["yaxis.rangemode"] = "tozero";
  } else if (hostUsesCanonicalGroupedBarGeometry(host)) {
    layoutPatch["yaxis.range"] = [0, 1];
    layoutPatch["yaxis.autorange"] = false;
  }

  if (projectedBounds.y2 && host.layout?.yaxis2) {
    layoutPatch["yaxis2.range"] = [0, Number(projectedBounds.y2.max)];
    layoutPatch["yaxis2.autorange"] = false;
    layoutPatch["yaxis2.automargin"] = false;
    layoutPatch["yaxis2.rangemode"] = "tozero";
  }

  if (hasCanonicalPlotGeometry(host)) {
    if (lock.anchors?.x) {
      layoutPatch["xaxis.anchor"] = lock.anchors.x;
    }
    if (lock.anchors?.y) {
      layoutPatch["yaxis.anchor"] = lock.anchors.y;
    }
    if (lock.domains?.x) {
      layoutPatch["xaxis.domain"] = lock.domains.x.slice();
    }
    if (lock.domains?.y) {
      layoutPatch["yaxis.domain"] = lock.domains.y.slice();
    }
    if (hostIsCompareDualPanelHost(host)) {
      layoutPatch.margin = { ...COMPARE_PANEL_MARGIN };
      layoutPatch.showlegend = false;
    } else if (lock.margin) {
      ["l", "r", "t", "b"].forEach((key) => {
        if (lock.margin[key] !== undefined) {
          layoutPatch[`margin.${key}`] = lock.margin[key];
        }
      });
    }
  }

  return layoutPatch;
}

function applyCanonicalGroupedBarLegendToggle(host, affectedIndices, nextVisibility) {
  if (!hostUsesCanonicalGroupedBarGeometry(host)) {
    return Promise.resolve(null);
  }

  const projectedBounds = computeGroupedBarBoundsAfterLegendToggle(host, affectedIndices, nextVisibility);
  const layoutPatch = buildGroupedBarLegendToggleLayoutPatch(host, projectedBounds);
  return Plotly.update(
    host,
    { visible: nextVisibility },
    layoutPatch,
    affectedIndices,
  ).then(() => ({ boundsApplied: true }));
}

function finalizeGroupedBarLegendToggle(host) {
  captureFrequencyAxisLabelLock(host);
  sealCanonicalLayoutState(host);
  if (usesDualAxisPairedBarOverlays(host)) {
    return applyHourlyPrecipLayout(host)
      .then(() => syncDualAxisPairedBarOverlayPositions(host));
  }
  if (
    String(host?.layout?.barmode || "").toLowerCase() === "stack"
    && strictStackedBarOverlayFigureIds.has(host?.dataset?.figureId || "")
  ) {
    return syncStackedStrictValueOverlayPositions(host);
  }
  return Promise.resolve();
}

function resolveResponsiveAxisBounds(host, axisName = "y", options = {}) {
  if (hostUsesCanonicalGroupedBarGeometry(host) && !options.simulateErrorBarsOn) {
    return computeStrictGroupedBarAxisBounds(host, axisName);
  }
  return computeResponsiveAxisBounds(host, axisName, options);
}

function buildResponsiveRangeRelayout(host) {
  const relayout = {};
  ["y", "y2"].forEach((axisName) => {
    const layoutKey = axisName === "y2" ? "yaxis2" : "yaxis";
    if (axisName === "y2" && !host.layout?.[layoutKey]) {
      return;
    }

    const bounds = resolveResponsiveAxisBounds(host, axisName);
    if (bounds) {
      relayout[`${layoutKey}.range`] = [bounds.min, bounds.max];
      relayout[`${layoutKey}.autorange`] = false;
    } else if (hostUsesCanonicalGroupedBarGeometry(host)) {
      relayout[`${layoutKey}.range`] = [0, 1];
      relayout[`${layoutKey}.autorange`] = false;
    } else if (axisName === "y") {
      relayout["yaxis.autorange"] = true;
      relayout["yaxis.range"] = null;
    } else {
      relayout[`${layoutKey}.autorange`] = true;
      relayout[`${layoutKey}.range`] = null;
    }
  });
  return relayout;
}

function pinGroupedBarYRangeBaseline(relayout) {
  ["yaxis", "yaxis2"].forEach((layoutKey) => {
    const range = relayout[`${layoutKey}.range`];
    if (Array.isArray(range) && range.length === 2 && Number.isFinite(Number(range[1]))) {
      relayout[`${layoutKey}.range`] = [0, Number(range[1])];
      relayout[`${layoutKey}.autorange`] = false;
      relayout[`${layoutKey}.rangemode`] = "tozero";
    }
  });
  return relayout;
}

function buildCanonicalGroupedBarRelayout(host) {
  const lock = state.stackedAxisLabelLocks[stackedAxisLockKey(host)] || {};
  const rangeRelayout = pinGroupedBarYRangeBaseline(buildResponsiveRangeRelayout(host));
  const frameRelayout = stableFrequencyAxisRelayout(host);
  const relayout = {
    ...frameRelayout,
    ...rangeRelayout,
    "xaxis.automargin": false,
    "yaxis.automargin": false,
  };

  if (lock.anchors?.x) {
    relayout["xaxis.anchor"] = lock.anchors.x;
  }
  if (lock.anchors?.y) {
    relayout["yaxis.anchor"] = lock.anchors.y;
  }
  if (lock.domains?.x) {
    relayout["xaxis.domain"] = lock.domains.x.slice();
  }
  if (lock.domains?.y) {
    relayout["yaxis.domain"] = lock.domains.y.slice();
  }
  if (hostIsCompareDualPanelHost(host)) {
    // Never re-apply a stacked/in-plot legend margin while dual-panel compare
    // is active — that is what left the right chart with ~276px empty space.
    relayout.margin = { ...COMPARE_PANEL_MARGIN };
    relayout.showlegend = false;
  } else if (lock.margin) {
    ["l", "r", "t", "b"].forEach((key) => {
      if (lock.margin[key] !== undefined) {
        relayout[`margin.${key}`] = lock.margin[key];
      }
    });
  }

  if (host.layout?.yaxis2) {
    relayout["yaxis2.automargin"] = false;
    if (layoutUsesOverlayingY2(host.layout)) {
      relayout["yaxis2.overlaying"] = "y";
      relayout["yaxis2.side"] = "right";
      relayout["yaxis2.domain"] = null;
    }
  }
  return relayout;
}

function applyCanonicalGroupedBarRelayout(host) {
  if (usesDualAxisPairedBarOverlays(host)) {
    return applyHourlyPrecipLayout(host);
  }

  const relayout = buildCanonicalGroupedBarRelayout(host);
  if (!Object.keys(relayout).length) {
    return Promise.resolve();
  }

  return Plotly.relayout(host, relayout)
    .then(() => captureFrequencyAxisLabelLock(host));
}

function applyResponsiveAxisRange(host) {
  if (!host || hostHasFixedTopoAxisRange(host)) {
    return Promise.resolve();
  }

  if (host.dataset?.figureId === "scatter_wind_dewpt") {
    return relayoutScatterWindDewptAxes(host);
  }

  if (host.dataset?.figureId === "hourly_precip" && layoutUsesOverlayingY2(host.layout)) {
    return applyHourlyPrecipLayout(host)
      .then(() => syncDualAxisPairedBarOverlayPositions(host));
  }

  const rangeRelayout = buildResponsiveRangeRelayout(host);
  const geometryRelayout = stableFrequencyAxisRelayout(host);
  const useCanonicalGeometry = hostUsesCanonicalGroupedBarGeometry(host) && hasCanonicalPlotGeometry(host);

  if (!Object.keys(rangeRelayout).length && !Object.keys(geometryRelayout).length) {
    return Promise.resolve();
  }

  if (useCanonicalGeometry) {
    return applyCanonicalGroupedBarRelayout(host);
  }

  const relayout = {
    ...geometryRelayout,
    ...rangeRelayout,
  };
  return Plotly.relayout(host, relayout).then(() => captureFrequencyAxisLabelLock(host));
}

async function refreshErrorBarsOnVisibleCharts() {
  const visibleCount = state.latestFigures.length
    ? Math.min(state.latestFigures.length, els.charts.length)
    : 0;

  await Promise.all(Array.from({ length: visibleCount }, async (_, idx) => {
    const host = els.charts[idx];
    if (!hostSupportsErrorBarRefresh(host)) {
      return;
    }

    await applyHostErrorBars(host);
    await rebuildStackErrorBarOverlays(host);
    await rebuildStrictValueErrorBarOverlays(host, { forceRebuild: true });
    await finishStrictValueErrorBarOverlays(host);
    await applyResponsiveAxisRange(host);
  }));

  if (state.compareEnabled && isCompareDualPanelActive()) {
    const ui = maximizedCompareUi();
    const compareHost = ui?.compareHost;
    if (compareHost && hostSupportsErrorBarRefresh(compareHost)) {
      await applyHostErrorBars(compareHost);
      await rebuildStackErrorBarOverlays(compareHost);
      await rebuildStrictValueErrorBarOverlays(compareHost, { forceRebuild: true });
      await finishStrictValueErrorBarOverlays(compareHost);
      await applyResponsiveAxisRange(compareHost);
    }
    if (state.syncAxes) {
      await applySyncedAxesToComparePair();
    }
  }
}

function maxWithError(trace) {
  const bounds = traceBoundsWithError(trace);
  return bounds ? bounds.max : null;
}

function traceUpperBound(trace) {
  const bounds = traceBoundsWithError(trace);
  return bounds ? bounds.max : null;
}

function expandAxesForErrorBars(host) {
  return applyResponsiveAxisRange(host);
}

function resolvedTracePoints(host, trace, traceIndex) {
  const xKey = axisLayoutKeyFromTraceAxis(trace?.xaxis, "x");
  const xAxisType = String(host?.layout?.[xKey]?.type || "").toLowerCase();
  const rawX = valueArray(trace?.x);
  const rawY = valueArray(trace?.y);

  const hasCategoricalX = xAxisType === "category"
    || rawX.some((val) => typeof val === "string" && val.length > 0);

  if (hasCategoricalX) {
    const x = [];
    const y = [];
    const count = Math.min(rawX.length, rawY.length);
    for (let i = 0; i < count; i += 1) {
      const yNum = Number(rawY[i]);
      if (!Number.isFinite(yNum)) {
        continue;
      }
      x.push(rawX[i]);
      y.push(yNum);
    }
    if (x.length && y.length && x.length === y.length) {
      return { x, y };
    }
  }

  const calc = host?.calcdata?.[traceIndex];
  if (Array.isArray(calc) && calc.length) {
    const x = [];
    const y = [];
    calc.forEach((point, idx) => {
      const yRaw = point?.y;
      const yNum = Number(yRaw);
      if (!Number.isFinite(yNum)) {
        return;
      }
      let xVal = point?.x;
      if (xVal == null && Array.isArray(trace?.x)) {
        xVal = trace.x[idx];
      }
      x.push(xVal);
      y.push(yNum);
    });
    if (x.length && y.length && x.length === y.length) {
      return { x, y };
    }
  }

  const xFallback = rawX;
  const yFallback = numericArray(trace?.y);
  const count = Math.min(xFallback.length || yFallback.length, yFallback.length);
  if (count <= 0) {
    return { x: [], y: [] };
  }
  return {
    x: (xFallback.length ? xFallback : Array.from({ length: count }, (_, i) => i)).slice(0, count),
    y: yFallback.slice(0, count),
  };
}

function resolvedBarTopPoints(host, trace, traceIndex) {
  const rawX = valueArray(trace?.x);
  const calc = host?.calcdata?.[traceIndex];
  if (Array.isArray(calc) && calc.length) {
    const x = [];
    const top = [];
    calc.forEach((point, idx) => {
      const yNum = Number(point?.y);
      if (!Number.isFinite(yNum)) {
        return;
      }
      const xVal = rawX[idx] != null ? rawX[idx] : point?.x;
      x.push(xVal);
      top.push(yNum);
    });
    if (x.length && top.length && x.length === top.length) {
      return { x, top };
    }
  }

  const yFallback = numericArray(trace?.y);
  const count = Math.min(rawX.length, yFallback.length);
  if (count <= 0) {
    return { x: [], top: [] };
  }
  return { x: rawX.slice(0, count), top: yFallback.slice(0, count) };
}

function stdDev(values) {
  if (!Array.isArray(values) || values.length < 2) {
    return 0;
  }
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / (values.length - 1);
  return Number.isFinite(variance) && variance > 0 ? Math.sqrt(variance) : 0;
}

function supportsErrorBars(trace) {
  return trace?.type === "bar" || trace?.type === "scatter";
}

function isErrorBarOverlayTrace(trace) {
  return trace?.meta?.errorBarOverlay === true;
}

function isStrictValueErrorOverlayTrace(trace) {
  return trace?.meta?.strictValueErrorOverlay === true;
}

function clearPlotErrorBars(host) {
  const traces = host?.data || [];
  const restyles = [];
  traces.forEach((trace, traceIndex) => {
    if (!trace || String(trace.type || "").includes("polar") || !supportsErrorBars(trace)) {
      return;
    }
    clearTraceErrorBars(trace);
    restyles.push(Plotly.restyle(host, { error_y: null, error_x: null }, [traceIndex]));
  });
  return Promise.all(restyles).then(() => undefined);
}

function usesDualAxisPairedBarOverlays(host) {
  const figureId = host?.dataset?.figureId || "";
  return dualAxisPairedBarOverlayFigureIds.has(figureId)
    && layoutUsesOverlayingY2(host?.layout);
}

function buildDualAxisPairedBarScatterOverlay(host, trace, traceIndex, options = {}) {
  const figureId = host?.dataset?.figureId || "";
  const forceErrorVisible = Boolean(options.forceErrorVisible);
  const yValues = numericArray(trace.y);
  const xValues = valueArray(trace.x);
  const count = Math.min(yValues.length, xValues.length || yValues.length);
  if (count <= 1) {
    return null;
  }

  const yStdArray = pointwiseStdArray(yValues).slice(0, count);
  const yStd = representativeStd(yStdArray);
  if (!yStdArray.some((v) => Number(v) > 0)) {
    return null;
  }

  const fallbackX = (xValues.length ? xValues : Array.from({ length: count }, (_, i) => i)).slice(0, count);
  const fallbackY = yValues.slice(0, count);
  const points = resolvedBarTopPoints(host, trace, traceIndex);
  const x = (points.x && points.x.length) ? points.x : fallbackX;
  const y = (points.top && points.top.length) ? points.top : fallbackY;
  const sourceVisible = isTraceVisible(trace);
  const errorVisible = (forceErrorVisible || state.showErrorBars) && sourceVisible;

  return {
    type: "scatter",
    mode: "markers",
    x,
    y,
    xaxis: trace.xaxis,
    yaxis: trace.yaxis,
    showlegend: false,
    hoverinfo: "skip",
    cliponaxis: false,
    visible: sourceVisible ? true : "legendonly",
    marker: {
      size: 2,
      opacity: 0,
      color: "rgba(0,0,0,0)",
    },
    error_y: {
      type: "data",
      array: yStdArray,
      arrayminus: fallbackY.map((value, i) => {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) {
          return 0;
        }
        const sd = Number(yStdArray[i]);
        const eff = Number.isFinite(sd) ? sd : yStd;
        return Math.min(eff, Math.max(0, numericValue));
      }),
      symmetric: false,
      visible: errorVisible,
      thickness: 1.8,
      width: 5,
      color: customErrorBarColor(trace, figureId),
    },
    meta: {
      errorBarOverlay: true,
      strictValueErrorOverlay: true,
      dualAxisPairedBarOverlay: true,
      sourceTrace: traceIndex,
    },
    legendgroup: trace.legendgroup || null,
  };
}

function syncDualAxisPairedBarOverlayPositions(host) {
  if (!usesDualAxisPairedBarOverlays(host)) {
    return Promise.resolve();
  }

  // Prefer explicit stack tops when exclusive TS bands are stacked on y2.
  if (
    String(host?.layout?.barmode || "").toLowerCase() === "stack"
    && strictStackedBarOverlayFigureIds.has(host?.dataset?.figureId || "")
  ) {
    return syncStackedStrictValueOverlayPositions(host);
  }

  const traces = host?.data || [];
  const indices = [];
  const xValues = [];
  const yValues = [];

  traces.forEach((trace, index) => {
    if (!isStrictValueErrorOverlayTrace(trace)) {
      return;
    }
    const sourceIndex = Number(trace?.meta?.sourceTrace);
    if (!Number.isInteger(sourceIndex) || sourceIndex < 0 || sourceIndex >= traces.length) {
      return;
    }

    const sourceTrace = traces[sourceIndex];
    const points = resolvedBarTopPoints(host, sourceTrace, sourceIndex);
    if (!points.x.length || !points.top.length) {
      return;
    }
    indices.push(index);
    xValues.push(points.x);
    yValues.push(points.top);
  });

  if (!indices.length) {
    return Promise.resolve();
  }
  return Plotly.restyle(host, { x: xValues, y: yValues }, indices);
}

function stackTopPointsBySourceIndex(host) {
  const traces = host?.data || [];
  const topsByIndex = new Map();
  if (String(host?.layout?.barmode || "").toLowerCase() !== "stack") {
    return topsByIndex;
  }

  const cumulativeByAxis = new Map();
  traces.forEach((trace, traceIndex) => {
    if (!trace || trace.type !== "bar" || isErrorBarOverlayTrace(trace) || isStrictValueErrorOverlayTrace(trace)) {
      return;
    }
    if (!isTraceVisible(trace)) {
      return;
    }

    const xValues = valueArray(trace.x);
    const yValues = numericArray(trace.y);
    const count = Math.min(xValues.length, yValues.length);
    if (!count) {
      return;
    }

    const axisKey = axisLayoutKeyFromTraceAxis(trace.yaxis, "y");
    const cumulative = cumulativeByAxis.get(axisKey) || new Map();
    const tops = [];
    const xs = [];
    for (let i = 0; i < count; i += 1) {
      const xKey = String(xValues[i] ?? i);
      const base = cumulative.get(xKey) || 0;
      const yNum = Number(yValues[i]);
      const top = base + (Number.isFinite(yNum) ? yNum : 0);
      cumulative.set(xKey, top);
      tops.push(top);
      xs.push(xValues[i]);
    }
    cumulativeByAxis.set(axisKey, cumulative);
    topsByIndex.set(traceIndex, { x: xs, top: tops });
  });

  return topsByIndex;
}

function syncStackedStrictValueOverlayPositions(host) {
  const figureId = host?.dataset?.figureId || "";
  if (String(host?.layout?.barmode || "").toLowerCase() !== "stack") {
    return Promise.resolve();
  }
  if (!strictStackedBarOverlayFigureIds.has(figureId)) {
    return Promise.resolve();
  }

  const topsByIndex = stackTopPointsBySourceIndex(host);
  const traces = host?.data || [];
  const indices = [];
  const xValues = [];
  const yValues = [];

  traces.forEach((trace, index) => {
    if (!isStrictValueErrorOverlayTrace(trace)) {
      return;
    }
    const sourceIndex = Number(trace?.meta?.sourceTrace);
    if (!Number.isInteger(sourceIndex) || sourceIndex < 0) {
      return;
    }
    const points = topsByIndex.get(sourceIndex);
    if (!points?.x?.length || !points?.top?.length) {
      return;
    }
    indices.push(index);
    xValues.push(points.x);
    yValues.push(points.top);
  });

  if (!indices.length) {
    return Promise.resolve();
  }
  return Plotly.restyle(host, { x: xValues, y: yValues }, indices);
}

function buildGroupedBarOverlayErrorY(host, sourceTrace) {
  const figureId = host?.dataset?.figureId || "";
  const yValues = numericArray(sourceTrace?.y);
  const count = yValues.length;
  if (count <= 1) {
    return null;
  }

  const yStdArray = pointwiseStdArray(yValues).slice(0, count);
  const yStd = representativeStd(yStdArray);
  if (!yStdArray.some((value) => Number(value) > 0)) {
    return null;
  }

  const sourceVisible = isTraceVisible(sourceTrace);
  let clampValues = yValues.slice(0, count);
  if (
    String(host?.layout?.barmode || "").toLowerCase() === "stack"
    && strictStackedBarOverlayFigureIds.has(figureId)
  ) {
    const sourceIndex = (host?.data || []).indexOf(sourceTrace);
    const stackTops = sourceIndex >= 0
      ? stackTopPointsBySourceIndex(host).get(sourceIndex)?.top
      : null;
    if (Array.isArray(stackTops) && stackTops.length >= count) {
      clampValues = stackTops.slice(0, count);
    }
  }

  return {
    type: "data",
    array: yStdArray,
    arrayminus: clampValues.map((value, i) => {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue)) {
        return 0;
      }
      const sd = Number(yStdArray[i]);
      const eff = Number.isFinite(sd) ? sd : yStd;
      return Math.min(eff, Math.max(0, numericValue));
    }),
    symmetric: false,
    visible: state.showErrorBars && sourceVisible,
    thickness: 1.8,
    width: 5,
    color: customErrorBarColor(sourceTrace, figureId),
  };
}

function syncGroupedBarOverlayState(host) {
  const traces = host?.data || [];
  const visibilityIndices = [];
  const visibilityValues = [];
  const errorIndices = [];
  const errorYValues = [];

  traces.forEach((trace, index) => {
    if (!isStrictValueErrorOverlayTrace(trace)) {
      return;
    }

    const sourceIndex = Number(trace?.meta?.sourceTrace);
    if (!Number.isInteger(sourceIndex) || sourceIndex < 0 || sourceIndex >= traces.length) {
      return;
    }

    const sourceTrace = traces[sourceIndex];
    const sourceVisible = isTraceVisible(sourceTrace);
    const overlayVisible = sourceVisible ? true : "legendonly";
    if (trace?.visible !== overlayVisible) {
      visibilityIndices.push(index);
      visibilityValues.push(overlayVisible);
    }

    const errorY = buildGroupedBarOverlayErrorY(host, sourceTrace);
    if (errorY) {
      errorIndices.push(index);
      errorYValues.push(errorY);
    }
  });

  const restyles = [];
  if (visibilityIndices.length) {
    restyles.push(Plotly.restyle(host, { visible: visibilityValues }, visibilityIndices));
  }
  if (errorIndices.length) {
    restyles.push(Plotly.restyle(host, { error_y: errorYValues }, errorIndices));
  }

  const figureId = host?.dataset?.figureId || "";
  const useStackedPositions = String(host?.layout?.barmode || "").toLowerCase() === "stack"
    && strictStackedBarOverlayFigureIds.has(figureId);
  const positionSync = useStackedPositions
    ? syncStackedStrictValueOverlayPositions(host)
    : (usesDualAxisPairedBarOverlays(host)
    ? syncDualAxisPairedBarOverlayPositions(host)
      : Promise.resolve());

  return restyles.length
    ? Promise.all(restyles).then(() => positionSync)
    : positionSync;
}

function syncErrorBarOverlayVisibility(host) {
  const traces = host?.data || [];
  const visibilityIndices = [];
  const visibilityValues = [];
  const errorIndices = [];
  const errorVisibilityValues = [];

  traces.forEach((trace, index) => {
    if (!isErrorBarOverlayTrace(trace)) {
      return;
    }

    const sourceIndex = Number(trace?.meta?.sourceTrace);
    if (!Number.isInteger(sourceIndex) || sourceIndex < 0 || sourceIndex >= traces.length) {
      return;
    }

    const sourceTrace = traces[sourceIndex];
    const sourceVisible = isTraceVisible(sourceTrace);
    const visible = sourceVisible ? true : "legendonly";
    if (trace?.visible !== visible) {
      visibilityIndices.push(index);
      visibilityValues.push(visible);
    }

    if (isStrictValueErrorOverlayTrace(trace) && trace?.error_y) {
      const errorVisible = state.showErrorBars && sourceVisible;
      if (Boolean(trace.error_y.visible) !== errorVisible) {
        errorIndices.push(index);
        errorVisibilityValues.push(errorVisible);
      }
    }
  });

  const restyles = [];
  if (visibilityIndices.length) {
    restyles.push(Plotly.restyle(host, { visible: visibilityValues }, visibilityIndices));
  }
  if (errorIndices.length) {
    restyles.push(Plotly.restyle(host, {
      "error_y.visible": errorVisibilityValues,
    }, errorIndices));
  }

  return restyles.length ? Promise.all(restyles) : Promise.resolve();
}

function rebuildStackErrorBarOverlays(host) {
  const isStackedBars = String(host?.layout?.barmode || "").toLowerCase() === "stack";
  if (!isStackedBars) {
    return Promise.resolve();
  }

  const figureId = host?.dataset?.figureId || "";
  if (strictValueHoverFigureIds.has(figureId)) {
    return Promise.resolve();
  }

  const overlayIndices = (host?.data || [])
    .map((trace, index) => (isErrorBarOverlayTrace(trace) ? index : -1))
    .filter((index) => index >= 0);

  const removeExisting = overlayIndices.length
    ? Plotly.deleteTraces(host, overlayIndices)
    : Promise.resolve();

  return removeExisting.then(() => {
    if (!state.showErrorBars) {
      return Promise.resolve();
    }
    const overlays = buildStackComponentOverlayTraces(host);
    return overlays.length ? Plotly.addTraces(host, overlays) : Promise.resolve();
  });
}

function buildStrictValueErrorOverlayTraces(host, options = {}) {
  const traces = host?.data || [];
  const overlays = [];
  const figureId = host?.dataset?.figureId || "";
  const forceErrorVisible = Boolean(options.forceErrorVisible);
  const isStackedBars = String(host?.layout?.barmode || "").toLowerCase() === "stack";
  const useBarOverlaysForBars = strictGroupedBarOverlayFigureIds.has(figureId)
    && !usesDualAxisPairedBarOverlays(host);

  if (isStackedBars && strictStackedBarOverlayFigureIds.has(figureId)) {
    const cumulativeByAxis = new Map();
    const includeLegendHidden = Boolean(options.includeLegendHidden);

    traces.forEach((trace, traceIndex) => {
      if (!trace || trace.type !== "bar" || isErrorBarOverlayTrace(trace) || String(trace.type || "").includes("polar")) {
        return;
      }

      const sourceVisible = isTraceVisible(trace);
      if (!includeLegendHidden && !sourceVisible) {
        return;
      }

      const xValues = valueArray(trace.x);
      const yValues = numericArray(trace.y);
      const count = Math.min(xValues.length, yValues.length);
      if (count <= 1) {
        return;
      }

      const yStdArray = pointwiseStdArray(yValues).slice(0, count);
      if (!yStdArray.some((v) => Number(v) > 0)) {
        return;
      }

      const axisKey = axisLayoutKeyFromTraceAxis(trace.yaxis, "y");
      const cumulative = cumulativeByAxis.get(axisKey) || new Map();
      const tops = [];
      const minus = [];

      for (let i = 0; i < count; i += 1) {
        const xKey = String(xValues[i] ?? i);
        const yNum = Number(yValues[i]);
        const segment = Number.isFinite(yNum) ? yNum : 0;
        // Only visible series advance the Plotly stack; legendonly placeholders
        // sit at segment height so overlay slots persist across toggles.
        let top = segment;
        if (sourceVisible) {
          const base = cumulative.get(xKey) || 0;
          top = base + segment;
        cumulative.set(xKey, top);
        }
        tops.push(top);

        const sd = Number(yStdArray[i]);
        const eff = Number.isFinite(sd) ? sd : 0;
        minus.push(Math.min(eff, Math.max(0, top)));
      }
      if (sourceVisible) {
      cumulativeByAxis.set(axisKey, cumulative);
      }

      const errorVisible = (forceErrorVisible || state.showErrorBars) && sourceVisible;
      overlays.push({
        type: "scatter",
        mode: "markers",
        x: xValues.slice(0, count),
        y: tops,
        xaxis: trace.xaxis,
        yaxis: trace.yaxis,
        showlegend: false,
        hoverinfo: "skip",
        cliponaxis: false,
        visible: sourceVisible ? true : "legendonly",
        marker: {
          size: 2,
          opacity: 0,
          color: "rgba(0,0,0,0)",
        },
        error_y: {
          type: "data",
          array: yStdArray,
          arrayminus: minus,
          symmetric: false,
          visible: errorVisible,
          thickness: 1.8,
          width: 5,
          color: customErrorBarColor(trace, figureId),
        },
        meta: {
          errorBarOverlay: true,
          strictValueErrorOverlay: true,
          sourceTrace: traceIndex,
        },
        legendgroup: trace.legendgroup || null,
      });
    });

    return finalizeErrorBarOverlays(overlays);
  }

  traces.forEach((trace, traceIndex) => {
    if (!trace || String(trace.type || "").includes("polar") || !supportsErrorBars(trace)) {
      return;
    }
    if (isErrorBarOverlayTrace(trace)) {
      return;
    }
    const includeLegendHidden = Boolean(options.includeLegendHidden);
    if (!includeLegendHidden && !isTraceVisible(trace)) {
      return;
    }

    const yValues = numericArray(trace.y);
    const xValues = valueArray(trace.x);
    const count = Math.min(yValues.length, xValues.length || yValues.length);
    if (count <= 1) {
      return;
    }

    const yStdArray = pointwiseStdArray(yValues).slice(0, count);
    const yStd = representativeStd(yStdArray);
    if (!yStdArray.some((v) => Number(v) > 0)) {
      return;
    }

    const x = (xValues.length ? xValues : Array.from({ length: count }, (_, i) => i)).slice(0, count);
    const y = yValues.slice(0, count);
    const sourceVisible = isTraceVisible(trace);
    const errorVisible = (forceErrorVisible || state.showErrorBars) && sourceVisible;

    const errorY = {
      type: "data",
      array: yStdArray,
      arrayminus: y.map((value, i) => {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) {
          return 0;
        }
        const sd = Number(yStdArray[i]);
        const eff = Number.isFinite(sd) ? sd : yStd;
        return Math.min(eff, Math.max(0, numericValue));
      }),
      symmetric: false,
      visible: errorVisible,
      thickness: 1.8,
      width: 5,
      color: customErrorBarColor(trace, figureId),
    };

    if (trace.type === "bar" && usesDualAxisPairedBarOverlays(host)) {
      const overlay = buildDualAxisPairedBarScatterOverlay(host, trace, traceIndex, options);
      if (overlay) {
        overlays.push(overlay);
      }
      return;
    }

    if (trace.type === "bar" && useBarOverlaysForBars) {
      overlays.push({
        type: "bar",
        x,
        y,
        xaxis: trace.xaxis,
        yaxis: trace.yaxis,
        showlegend: false,
        hoverinfo: "skip",
        cliponaxis: true,
        visible: sourceVisible ? true : "legendonly",
        marker: {
          color: "rgba(0,0,0,0)",
          opacity: 0,
          line: {
            color: "rgba(0,0,0,0)",
            width: 0,
          },
        },
        width: trace.width,
        offset: trace.offset,
        offsetgroup: trace.offsetgroup,
        alignmentgroup: trace.alignmentgroup,
        base: trace.base,
        error_y: errorY,
        meta: {
          errorBarOverlay: true,
          strictValueErrorOverlay: true,
          sourceTrace: traceIndex,
        },
        legendgroup: trace.legendgroup || null,
      });
      return;
    }

    if (trace.type === "bar") {
      const points = resolvedBarTopPoints(host, trace, traceIndex);
      const px = (points.x && points.x.length) ? points.x : x;
      const py = (points.top && points.top.length) ? points.top : y;
      overlays.push({
        type: "scatter",
        mode: "markers",
        x: px,
        y: py,
        xaxis: trace.xaxis,
        yaxis: trace.yaxis,
        showlegend: false,
        hoverinfo: "skip",
        cliponaxis: false,
        visible: isTraceVisible(trace) ? true : "legendonly",
        marker: {
          size: 2,
          opacity: 0,
          color: "rgba(0,0,0,0)",
        },
        error_y: errorY,
        meta: {
          errorBarOverlay: true,
          strictValueErrorOverlay: true,
          sourceTrace: traceIndex,
        },
        legendgroup: trace.legendgroup || null,
      });
      return;
    }

    overlays.push({
      type: "scatter",
      mode: "markers",
      x,
      y,
      xaxis: trace.xaxis,
      yaxis: trace.yaxis,
      showlegend: false,
      hoverinfo: "skip",
      cliponaxis: false,
      visible: isTraceVisible(trace) ? true : "legendonly",
      marker: {
        size: 2,
        opacity: 0,
        color: "rgba(0,0,0,0)",
      },
      error_y: errorY,
      meta: {
        errorBarOverlay: true,
        strictValueErrorOverlay: true,
        sourceTrace: traceIndex,
      },
      legendgroup: trace.legendgroup || null,
    });
  });

  return finalizeErrorBarOverlays(overlays);
}

async function ensureGroupedBarOverlaySlots(host) {
  const desiredOverlays = buildStrictValueErrorOverlayTraces(host, { includeLegendHidden: true });
  const desiredSources = new Set(desiredOverlays.map((overlay) => overlay.meta.sourceTrace));

  const existingBySource = new Map();
  (host?.data || []).forEach((trace, index) => {
    if (!isStrictValueErrorOverlayTrace(trace)) {
      return;
    }
    const sourceIndex = Number(trace?.meta?.sourceTrace);
    if (Number.isInteger(sourceIndex) && sourceIndex >= 0) {
      existingBySource.set(sourceIndex, index);
    }
  });

  const deleteIndices = [];
  existingBySource.forEach((index, sourceIndex) => {
    const desired = desiredOverlays.find((overlay) => overlay.meta.sourceTrace === sourceIndex);
    const existing = host.data[index];
    if (!desiredSources.has(sourceIndex)) {
      deleteIndices.push(index);
    } else if (desired && existing?.type !== desired.type) {
      deleteIndices.push(index);
    }
  });
  deleteIndices.sort((a, b) => b - a);
  for (let i = 0; i < deleteIndices.length; i += 1) {
    await Plotly.deleteTraces(host, deleteIndices[i]);
  }

  const existingSources = new Set();
  (host?.data || []).forEach((trace) => {
    if (!isStrictValueErrorOverlayTrace(trace)) {
      return;
    }
    const sourceIndex = Number(trace?.meta?.sourceTrace);
    if (Number.isInteger(sourceIndex) && sourceIndex >= 0) {
      existingSources.add(sourceIndex);
    }
  });

  const overlaysToAdd = desiredOverlays.filter((overlay) => !existingSources.has(overlay.meta.sourceTrace));
  if (overlaysToAdd.length) {
    await Plotly.addTraces(host, overlaysToAdd);
  }
}

async function syncGroupedBarOverlaysPersistent(host, options = {}) {
  if (options.forceRebuild && state.showErrorBars) {
    await deleteStrictValueOverlayTraces(host);
    const overlays = buildStrictValueErrorOverlayTraces(host, {
      includeLegendHidden: true,
      forceErrorVisible: true,
    });
    if (overlays.length) {
      await Plotly.addTraces(host, overlays);
    }
    return syncGroupedBarOverlayState(host);
  }

  await ensureGroupedBarOverlaySlots(host);
  return syncGroupedBarOverlayState(host);
}

function rebuildStrictValueErrorBarOverlays(host, options = {}) {
  const figureId = host?.dataset?.figureId || "";
  if (!strictValueHoverFigureIds.has(figureId)) {
    return Promise.resolve();
  }

  if (strictGroupedBarOverlayFigureIds.has(figureId)) {
    return syncGroupedBarOverlaysPersistent(host, options);
  }

  const overlayIndices = strictValueOverlayTraceIndices(host);
  const removeExisting = overlayIndices.length
    ? Plotly.deleteTraces(host, overlayIndices)
    : Promise.resolve();

  return removeExisting.then(() => {
    if (!state.showErrorBars) {
      return Promise.resolve();
    }
    const overlays = buildStrictValueErrorOverlayTraces(host);
    return overlays.length ? Plotly.addTraces(host, overlays) : Promise.resolve();
  });
}

function buildStackComponentOverlayTraces(host) {
  const traces = host?.data || [];
  const barmode = String(host?.layout?.barmode || "").toLowerCase();
  if (barmode !== "stack") {
    return [];
  }

  const cumulativeByAxis = new Map();
  const overlays = [];
  const figureId = host?.dataset?.figureId || "";

  traces.forEach((trace, traceIndex) => {
    if (!trace || trace.type !== "bar" || isErrorBarOverlayTrace(trace) || String(trace.type || "").includes("polar")) {
      return;
    }
    if (!isTraceVisible(trace)) {
      return;
    }

    const xValues = valueArray(trace.x);
    const yValues = numericArray(trace.y);
    const count = Math.min(xValues.length, yValues.length);
    if (count <= 1) {
      return;
    }

    const yStd = stdDev(yValues);
    if (!Number.isFinite(yStd) || yStd <= 0) {
      return;
    }

    const axisKey = axisLayoutKeyFromTraceAxis(trace.yaxis, "y");
    const cumulative = cumulativeByAxis.get(axisKey) || new Map();

    const tops = [];
    const minus = [];
    for (let i = 0; i < count; i += 1) {
      const xKey = String(xValues[i] ?? i);
      const base = cumulative.get(xKey) || 0;
      const yNum = Number(yValues[i]);
      const top = base + (Number.isFinite(yNum) ? yNum : 0);
      cumulative.set(xKey, top);
      tops.push(top);
      minus.push(Math.min(yStd, Math.max(0, top)));
    }
    cumulativeByAxis.set(axisKey, cumulative);

    overlays.push({
      type: "scatter",
      mode: "markers",
      x: xValues.slice(0, count),
      y: tops,
      xaxis: trace.xaxis,
      yaxis: trace.yaxis,
      showlegend: false,
      hoverinfo: "skip",
      cliponaxis: false,
      marker: {
        size: 2,
        opacity: 0,
        color: "rgba(0,0,0,0)",
      },
      error_y: {
        type: "data",
        array: Array.from({ length: count }, () => yStd),
        arrayminus: minus,
        symmetric: false,
        visible: true,
        thickness: 1.8,
        width: 5,
        color: customErrorBarColor(trace, figureId),
      },
      meta: {
        errorBarOverlay: true,
        stackErrorOverlay: true,
        sourceTrace: traceIndex,
      },
      legendgroup: trace.legendgroup || null,
    });
  });

  return finalizeErrorBarOverlays(overlays);
}

function buildStackOverlayTraces(host) {
  const traces = host?.data || [];
  const barmode = String(host?.layout?.barmode || "").toLowerCase();
  const figureId = host?.dataset?.figureId || "";
  if (barmode !== "stack") {
    return [];
  }

  const grouped = new Map();
  traces.forEach((trace) => {
    if (!trace || trace.type !== "bar" || String(trace.type || "").includes("polar")) {
      return;
    }
    const axisKey = axisLayoutKeyFromTraceAxis(trace.yaxis, "y");
    const xValues = valueArray(trace.x);
    const yValues = numericArray(trace.y);
    if (!xValues.length || !yValues.length) {
      return;
    }
    const axisGroup = grouped.get(axisKey) || { order: [], totals: new Map() };
    const count = Math.min(xValues.length, yValues.length);
    for (let i = 0; i < count; i += 1) {
      const xKey = String(xValues[i]);
      const yNum = Number(yValues[i]);
      if (!Number.isFinite(yNum)) {
        continue;
      }
      if (!axisGroup.totals.has(xKey)) {
        axisGroup.totals.set(xKey, 0);
        axisGroup.order.push(xValues[i]);
      }
      axisGroup.totals.set(xKey, axisGroup.totals.get(xKey) + yNum);
    }
    grouped.set(axisKey, axisGroup);
  });

  const overlays = [];
  grouped.forEach((axisGroup, axisKey) => {
    const sourceTrace = traces.find((trace) => axisLayoutKeyFromTraceAxis(trace?.yaxis, "y") === axisKey && trace?.type === "bar") || null;
    const totals = axisGroup.order.map((xVal) => axisGroup.totals.get(String(xVal)) || 0);
    const pointCount = totals.length;
    if (pointCount <= 1) {
      return;
    }

    const totalStd = stdDev(totals);
    if (totalStd <= 0) {
      return;
    }

    overlays.push({
      type: "scatter",
      mode: "markers",
      x: axisGroup.order,
      y: totals,
      xaxis: "x",
      yaxis: axisKey.replace("axis", ""),
      showlegend: false,
      hoverinfo: "skip",
      cliponaxis: false,
      marker: {
        size: 2,
        opacity: 0,
        color: "rgba(0,0,0,0)",
      },
      error_y: {
        type: "data",
        array: Array.from({ length: pointCount }, () => totalStd),
        arrayminus: totals.map((value) => {
          const numericValue = Number(value);
          if (!Number.isFinite(numericValue)) {
            return 0;
          }
          return Math.min(totalStd, Math.max(0, numericValue));
        }),
        symmetric: false,
        visible: true,
        thickness: 1.8,
        width: 5,
        color: customErrorBarColor(sourceTrace, figureId),
      },
      meta: {
        errorBarOverlay: true,
        stackErrorOverlay: true,
      },
    });
  });

  return finalizeErrorBarOverlays(overlays);
}

function clearTraceErrorBars(trace) {
  delete trace.error_y;
  delete trace.error_x;
}

function sanitizeBaseHovertemplate(template) {
  if (typeof template !== "string" || !template.length) {
    return template;
  }

  const bodyOnly = template
    .replace(/<extra>[\s\S]*?<\/extra>/gi, "")
    .replace(/\s*[+\-]\s*%\{error_[^}]+\}/gi, "")
    .replace(/\s*\/\s*[-+]?\s*%\{error_[^}]+\}/gi, "")
    .replace(/%\{error_[^}]+\}/gi, "");

  const tokens = bodyOnly.match(/%\{[^}]+\}/g) || [];
  const yToken = tokens.find((token) => /^%\{y[^}]*\}$/i.test(token));
  const rToken = tokens.find((token) => /^%\{r[^}]*\}$/i.test(token));
  const fallbackToken = tokens.find((token) => !/^%\{(?:x|theta|customdata|text|fullData\.)/i.test(token));
  const valueToken = yToken || rToken || fallbackToken || null;

  if (!valueToken) {
    return "<extra></extra>";
  }

  return `${valueToken}<extra></extra>`;
}

function axisTitleText(layout, axisKey) {
  const axis = layout?.[axisKey];
  if (!axis) {
    return "";
  }
  if (typeof axis.title === "string") {
    return axis.title;
  }
  if (axis.title && typeof axis.title.text === "string") {
    return axis.title.text;
  }
  return "";
}

function inferUnitFromAxisTitle(titleText) {
  if (typeof titleText !== "string" || !titleText.trim().length) {
    return "";
  }
  const text = titleText.trim();
  const inParens = text.match(/\(([^)]+)\)\s*$/);
  if (inParens && inParens[1]) {
    return inParens[1].trim();
  }
  const slashUnit = text.match(/([A-Za-z%]+\/[A-Za-z%]+)\s*$/);
  if (slashUnit && slashUnit[1]) {
    return slashUnit[1].trim();
  }
  const shortUnit = text.match(/\b(kt|kts|kn|mm|cm|m|C|F|K|%)\b\s*$/i);
  if (shortUnit && shortUnit[1]) {
    return shortUnit[1].trim();
  }
  return "";
}

function inferUnitFromTemplate(template) {
  if (typeof template !== "string" || !template.length) {
    return "";
  }
  const bodyOnly = template.replace(/<extra>[\s\S]*?<\/extra>/gi, "");
  const match = bodyOnly.match(/%\{(?:y|r)[^}]*\}\s*([^<\n\r]*)/i);
  if (!match || typeof match[1] !== "string") {
    return "";
  }
  const suffix = match[1]
    .replace(/^[:=\s-]+/, "")
    .replace(/\+\/-.*/i, "")
    .trim();
  if (!suffix.length || /%\{[^}]+\}/.test(suffix)) {
    return "";
  }
  return suffix;
}

function normalizeUnitSuffix(unitText) {
  if (typeof unitText !== "string") {
    return "";
  }
  let unit = unitText.trim();
  if (!unit.length) {
    return "";
  }
  if (/^c$/i.test(unit) || /^celsius$/i.test(unit)) {
    unit = "°C";
  }
  unit = unit.replace(/\(\s*c\s*\)/gi, "(°C)").replace(/(^|\s)c(\b)/gi, (match, lead, tail) => `${lead}°C${tail}`);
  if (unit.startsWith("%") || unit.startsWith("/")) {
    return unit;
  }
  return ` ${unit}`;
}

function ensureBaseHovertemplate(trace, layout = null) {
  if (!trace) {
    return null;
  }
  trace.meta = trace.meta || {};
  if (!Object.prototype.hasOwnProperty.call(trace.meta, "baseHovertemplate")) {
    const original = (typeof trace.hovertemplate === "string") ? trace.hovertemplate : null;
    trace.meta.baseHovertemplate = sanitizeBaseHovertemplate(original);
    const axisKey = axisLayoutKeyFromTraceAxis(trace.yaxis, "y");
    const axisUnit = inferUnitFromAxisTitle(axisTitleText(layout, axisKey));
    const templateUnit = inferUnitFromTemplate(original);
    trace.meta.hoverUnitSuffix = normalizeUnitSuffix(templateUnit || axisUnit);
  } else if (!Object.prototype.hasOwnProperty.call(trace.meta, "hoverUnitSuffix")) {
    const axisKey = axisLayoutKeyFromTraceAxis(trace.yaxis, "y");
    const axisUnit = inferUnitFromAxisTitle(axisTitleText(layout, axisKey));
    trace.meta.hoverUnitSuffix = normalizeUnitSuffix(axisUnit);
  }
  return trace.meta.baseHovertemplate;
}

function valueTokenWithTwoDecimals(baseTemplate) {
  const rawToken = primaryValueTokenFromTemplate(baseTemplate);
  const parsed = rawToken.match(/^%\{([^}:]+)(?::[^}]*)?\}$/);
  if (!parsed || !parsed[1]) {
    return "%{y:.2f}";
  }
  const ref = parsed[1].trim();
  if (!ref.length) {
    return "%{y:.2f}";
  }
  return `%{${ref}:.2f}`;
}

function hovertemplateWithStd(baseTemplate, sdValue = null, unitSuffix = "") {
  const valueToken = valueTokenWithTwoDecimals(baseTemplate);
  const unit = typeof unitSuffix === "string" ? unitSuffix : "";
  if (!Number.isFinite(sdValue) || sdValue <= 0) {
    return `${valueToken}${unit}<extra></extra>`;
  }
  return `${valueToken}${unit} ± ${Number(sdValue).toFixed(2)}${unit}<extra></extra>`;
}

function primaryValueTokenFromTemplate(baseTemplate) {
  const template = (typeof baseTemplate === "string" && baseTemplate.length)
    ? baseTemplate
    : "%{y:.2f}<extra></extra>";
  const tokens = template.match(/%\{[^}]+\}/g) || [];
  const yToken = tokens.find((token) => /^%\{y[^}]*\}$/i.test(token));
  const rToken = tokens.find((token) => /^%\{r[^}]*\}$/i.test(token));
  return yToken || rToken || "%{y:.2f}";
}

function strictValueHovertemplate(baseTemplate, sdValue = null, unitSuffix = "") {
  const valueToken = valueTokenWithTwoDecimals(baseTemplate);
  const unit = typeof unitSuffix === "string" ? unitSuffix : "";
  if ((typeof sdValue === "string" && sdValue.length > 0)) {
    return `${valueToken}${unit} ± ${sdValue}${unit}<extra></extra>`;
  }
  if (!Number.isFinite(sdValue) || sdValue <= 0) {
    return `${valueToken}${unit}<extra></extra>`;
  }
  return `${valueToken}${unit} ± ${Number(sdValue).toFixed(2)}${unit}<extra></extra>`;
}

function strictValueHovertemplateArray(baseTemplate, sdValues = [], unitSuffix = "") {
  return (sdValues || []).map((sd) => strictValueHovertemplate(baseTemplate, Number(sd), unitSuffix));
}

function applyStrictValueHoverTemplatesToFigure(figure, figureId) {
  if (!strictValueHoverFigureIds.has(figureId)) {
    return;
  }

  const traces = figure?.data || [];
  traces.forEach((trace) => {
    if (!trace || String(trace.type || "").includes("polar") || !supportsErrorBars(trace)) {
      return;
    }

    const baseHover = ensureBaseHovertemplate(trace, figure?.layout);
    const unitSuffix = trace?.meta?.hoverUnitSuffix || "";
    const yValues = numericArray(trace.y);
    const yStdArray = pointwiseStdArray(yValues);
    if (state.showErrorBars && yValues.length > 1 && yStdArray.some((v) => Number(v) > 0)) {
      trace.customdata = null;
      trace.hovertemplate = strictValueHovertemplateArray(baseHover, yStdArray, unitSuffix);
    } else {
      trace.customdata = null;
      trace.hovertemplate = strictValueHovertemplate(baseHover, null, unitSuffix);
    }
  });
}

function applyTraceErrorBars(trace) {
  if (!supportsErrorBars(trace)) {
    clearTraceErrorBars(trace);
    return;
  }

  const yValues = numericArray(trace.y);
  const yStdArray = pointwiseStdArray(yValues);
  if (yValues.length > 1 && yStdArray.some((v) => Number(v) > 0)) {
    trace.error_y = {
      type: "data",
      array: yStdArray,
      visible: true,
      thickness: 1.8,
      width: 5,
      color: contrastAwareErrorBarColor(trace),
    };
  } else {
    delete trace.error_y;
  }

  const xValues = numericArray(trace.x);
  const xStdArray = pointwiseStdArray(xValues);
  const mode = String(trace.mode || "").toLowerCase();
  const isScatter = trace.type === "scatter";
  if (isScatter && xValues.length > 1 && xStdArray.some((v) => Number(v) > 0)) {
    trace.error_x = {
      type: "data",
      array: xStdArray,
      visible: true,
      thickness: 1.8,
      width: 5,
      color: contrastAwareErrorBarColor(trace, 0.9),
    };
  } else {
    delete trace.error_x;
  }
}

function applyFigureErrorBars(figure) {
  if (figure?.layout?.polar) {
    return;
  }

  const traces = figure?.data || [];
  traces.forEach((trace) => {
    if (String(trace?.type || "").includes("polar")) {
      clearTraceErrorBars(trace);
      return;
    }
    if (!supportsErrorBars(trace)) {
      return;
    }
    if (!state.showErrorBars) {
      clearTraceErrorBars(trace);
      return;
    }
    applyTraceErrorBars(trace);
  });
}

function restyleSingleTrace(host, traceIndex, update) {
  const payload = { ...update };
  // For Plotly.restyle on a single trace, per-point hovertemplate arrays
  // must be wrapped once more to avoid collapsing to a single value.
  if (Array.isArray(payload.hovertemplate)) {
    payload.hovertemplate = [payload.hovertemplate];
  }
  return Plotly.restyle(host, payload, [traceIndex]);
}

function applyHostErrorBars(host) {
  if (!host || host?.layout?.polar) {
    return Promise.resolve();
  }

  const figureId = host.dataset.figureId || "";
  const useStrictValueHover = strictValueHoverFigureIds.has(figureId);

  if (figureId === "scatter_wind_dewpt") {
    const traces = host.data || [];
    const ciIndices = traces
      .map((trace, index) => (isScatterWindDewptCiBand(trace) ? index : -1))
      .filter((index) => index >= 0);
    const restyles = [];
    const pointHovertemplate = "Dew Point: %{x:.2f} °C<br>Wind Speed: %{y:.2f} kt<extra></extra>";

    traces.forEach((trace, traceIndex) => {
      const baseHover = ensureBaseHovertemplate(trace, host?.layout);
      const unitSuffix = trace?.meta?.hoverUnitSuffix || "";
      if (!trace || isErrorBarOverlayTrace(trace) || isScatterWindDewptCiBand(trace) || String(trace.type || "").includes("polar") || !supportsErrorBars(trace)) {
        return;
      }
      clearTraceErrorBars(trace);
      const mode = String(trace.mode || "").toLowerCase();
      const isPointTrace = trace.type === "scatter" && mode.includes("markers");
      const hovertemplate = isPointTrace
        ? pointHovertemplate
        : hovertemplateWithStd(baseHover, null, unitSuffix);
      const update = {
        error_y: null,
        error_x: null,
        hovertemplate,
      };
      if (useStrictValueHover && !isPointTrace) {
        update.customdata = null;
      }
      restyles.push(restyleSingleTrace(host, traceIndex, update));
    });

    if (ciIndices.length) {
      const ciVisible = scatterWindDewptCiVisible();
      restyles.push(Plotly.restyle(host, {
        visible: ciIndices.map(() => ciVisible),
        fill: ciIndices.map(() => "toself"),
        fillcolor: ciIndices.map((index) => scatterWindDewptCiFillcolor(traces[index])),
        "line.width": ciIndices.map(() => 0),
        "line.color": ciIndices.map(() => "rgba(0,0,0,0)"),
        zorder: ciIndices.map(() => 3),
      }, ciIndices));
    }

    return Promise.all(restyles).then(() => relayoutScatterWindDewptAxes(host));
  }

  const traces = host.data || [];
  const restylePromises = [];

  traces.forEach((trace, traceIndex) => {
    const baseHover = ensureBaseHovertemplate(trace, host?.layout);
    const unitSuffix = trace?.meta?.hoverUnitSuffix || "";
    const isStackedBars = String(host.layout?.barmode || "").toLowerCase() === "stack";
    const isStackedBarTrace = isStackedBars && trace?.type === "bar";
    if (!trace || isErrorBarOverlayTrace(trace) || String(trace.type || "").includes("polar") || !supportsErrorBars(trace)) {
      clearTraceErrorBars(trace);
      return;
    }

    clearTraceErrorBars(trace);
    if (!state.showErrorBars) {
      const hovertemplate = useStrictValueHover
        ? strictValueHovertemplate(baseHover, null, unitSuffix)
        : hovertemplateWithStd(baseHover, null, unitSuffix);
      const update = { error_y: null, error_x: null, hovertemplate };
      if (useStrictValueHover) {
        update.customdata = null;
      }
      restylePromises.push(restyleSingleTrace(host, traceIndex, update));
      return;
    }

    const yValues = numericArray(trace.y);
    const yStdArray = pointwiseStdArray(yValues);
    const yStd = representativeStd(yStdArray);
    const yCount = tracePointCount(trace.y);
    if (yCount <= 1 || !yStdArray.some((v) => Number(v) > 0)) {
      const hovertemplate = useStrictValueHover
        ? strictValueHovertemplate(baseHover, null, unitSuffix)
        : hovertemplateWithStd(baseHover, null, unitSuffix);
      const update = { error_y: null, error_x: null, hovertemplate };
      if (useStrictValueHover) {
        update.customdata = null;
      }
      restylePromises.push(restyleSingleTrace(host, traceIndex, update));
      return;
    }

    const yError = {
      type: "data",
      array: yStdArray.slice(0, yCount),
      arrayminus: yValues.slice(0, yCount).map((value, i) => {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) {
          return 0;
        }
        const sd = Number(yStdArray[i]);
        const eff = Number.isFinite(sd) ? sd : yStd;
        return Math.min(eff, Math.max(0, numericValue));
      }),
      symmetric: false,
      visible: true,
      thickness: 1.8,
      width: 5,
      color: customErrorBarColor(trace, figureId),
    };

    const update = {
      error_y: (isStackedBarTrace || useStrictValueHover) ? null : yError,
      hovertemplate: useStrictValueHover
        ? strictValueHovertemplateArray(baseHover, yStdArray.slice(0, yCount), unitSuffix)
        : hovertemplateWithStd(baseHover, yStd, unitSuffix),
    };
    if (useStrictValueHover) {
      update.customdata = null;
    }

    if (trace.type === "scatter") {
      const xValues = numericArray(trace.x);
      const xStdArray = pointwiseStdArray(xValues);
      const xCount = tracePointCount(trace.x);
      if (!useStrictValueHover && xCount > 1 && xStdArray.some((v) => Number(v) > 0)) {
        update.error_x = {
          type: "data",
          array: xStdArray.slice(0, xCount),
          symmetric: true,
          visible: true,
          thickness: 1.8,
          width: 5,
          color: customErrorBarColor(trace, figureId, 0.9),
        };
      }
    }

    restylePromises.push(restyleSingleTrace(host, traceIndex, update));
  });

  return Promise.all(restylePromises);
}

function renderErrorBarsToggle() {
  const button = els.errorBarsToggle;
  if (!button) {
    return;
  }
  const enabled = state.showErrorBars;
  button.textContent = "Error bars";
  button.classList.toggle("is-active", enabled);
  button.setAttribute("aria-pressed", enabled ? "true" : "false");
  button.setAttribute("aria-label", enabled ? "Error bars on" : "Error bars off");
  button.title = enabled ? "Error bars on (SD)" : "Error bars off (SD)";
}

function computeAxisBounds(figure, axisName = "y") {
  const data = figure?.data || [];
  const layout = figure?.layout || {};
  const barmode = String(layout.barmode || "").toLowerCase();
  const stackByX = barmode === "stack" ? new Map() : null;
  let minValue = Number.POSITIVE_INFINITY;
  let maxValue = Number.NEGATIVE_INFINITY;

  data.forEach((trace) => {
    if (!trace || trace.visible === false || trace.visible === "legendonly") {
      return;
    }

    const traceAxis = trace.yaxis || "y";
    if (traceAxis !== axisName) {
      return;
    }

    if (trace.type === "bar" && stackByX) {
      const yValues = numericArray(trace.y);
      if (!yValues.length) {
        return;
      }
      const xValues = Array.isArray(trace.x) ? trace.x : yValues.map((_, idx) => idx);
      yValues.forEach((yVal, idx) => {
        const xKey = String(xValues[idx] ?? idx);
        stackByX.set(xKey, (stackByX.get(xKey) || 0) + yVal);
      });
      return;
    }

    const bounds = traceBoundsWithError(trace);
    if (!bounds) {
      return;
    }
    minValue = Math.min(minValue, bounds.min);
    maxValue = Math.max(maxValue, bounds.max);
  });

  if (stackByX && stackByX.size) {
    const stackedValues = Array.from(stackByX.values());
    const stackMin = Math.min(...stackedValues);
    const stackMax = Math.max(...stackedValues);
    minValue = Math.min(minValue, stackMin);
    maxValue = Math.max(maxValue, stackMax);
  }

  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
    return null;
  }

  if (minValue >= 0) {
    minValue = 0;
  }

  if (maxValue <= minValue) {
    maxValue = minValue + 1;
  }

  const span = maxValue - minValue;
  const upperPad = Math.max(span * 0.12, 0.5);
  const lowerPad = minValue < 0 ? Math.max(span * 0.04, 0.25) : 0;
  return {
    min: minValue - lowerPad,
    max: maxValue + upperPad,
  };
}

function expandAxisLock(lock, candidate) {
  if (!candidate) {
    return lock || null;
  }
  if (!lock) {
    return { min: candidate.min, max: candidate.max };
  }
  return {
    min: Math.min(lock.min, candidate.min),
    max: Math.max(lock.max, candidate.max),
  };
}

function layoutAxisRange(axisLayout) {
  if (!axisLayout || !Array.isArray(axisLayout.range) || axisLayout.range.length < 2) {
    return null;
  }
  const min = Number(axisLayout.range[0]);
  const max = Number(axisLayout.range[1]);
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
    return null;
  }
  return { min, max };
}

function scatterWindDewptAxisExtents(figure) {
  let xMin = Number.POSITIVE_INFINITY;
  let xMax = Number.NEGATIVE_INFINITY;
  let yMin = Number.POSITIVE_INFINITY;
  let yMax = Number.NEGATIVE_INFINITY;

  (figure?.data || []).forEach((trace) => {
    if (!trace || isErrorBarOverlayTrace(trace) || String(trace.type || "").includes("polar")) {
      return;
    }

    const isCiBand = isScatterWindDewptCiBand(trace);
    const isMarkerTrace = String(trace.mode || "").includes("markers");
    if (!isMarkerTrace && !(isCiBand && state.showErrorBars)) {
      return;
    }

    const xVals = numericArray(trace.x);
    const yVals = numericArray(trace.y);
    xVals.forEach((value) => {
      if (!Number.isFinite(value)) {
        return;
      }
      xMin = Math.min(xMin, value);
      xMax = Math.max(xMax, value);
    });
    yVals.forEach((value) => {
      if (!Number.isFinite(value)) {
        return;
      }
      yMin = Math.min(yMin, value);
      yMax = Math.max(yMax, value);
    });
  });

  if (!Number.isFinite(xMin) || !Number.isFinite(xMax) || !Number.isFinite(yMin) || !Number.isFinite(yMax)) {
    return null;
  }

  return { xMin, xMax, yMin, yMax };
}

function scatterWindDewptAxisRelayout(figure) {
  const extents = scatterWindDewptAxisExtents(figure);
  if (!extents) {
    return null;
  }

  const xPadLeft = 2.5;
  const xPadRight = 1.5;
  const yPadTop = 2;
  const rawXMin = extents.xMin - xPadLeft;
  const rawXMax = extents.xMax + xPadRight;
  const rawYMax = extents.yMax + yPadTop;
  const yRangeMin = extents.yMin >= 0 ? 0 : extents.yMin - 1.5;

  const xRangeMin = Math.floor(rawXMin / 5) * 5;
  const xRangeMax = Math.ceil(rawXMax / 5) * 5;
  let yRangeMax = Math.ceil(rawYMax / 5) * 5;
  if (yRangeMax - rawYMax > 3) {
    yRangeMax = Math.max(Math.ceil(rawYMax), yRangeMin + 5);
  }

  return {
    "xaxis.range": [xRangeMin, xRangeMax],
    "xaxis.autorange": false,
    "yaxis.range": [yRangeMin, yRangeMax],
    "yaxis.autorange": false,
  };
}

const SCATTER_WIND_DEWPT_PANEL = {
  margin: { l: 40, r: 40, t: 54, b: 36 },
};

const TEMP_DEWPOINT_PANEL = {
  margin: { l: 58, r: 44, t: 36, b: 36 },
  xDomain: [0.03, 0.97],
};

const SCATTER_WIND_DEWPT_CI_FILL = {
  FU: "rgba(122,122,122,0.35)",
  DU: "rgba(239,85,59,0.35)",
  SA: "rgba(0,204,150,0.35)",
  VA: "rgba(171,99,250,0.35)",
};

function isScatterWindDewptCiBand(trace) {
  return trace?.meta?.ciBand === true || /±1SD$/i.test(String(trace?.name || "").trim());
}

function scatterWindDewptCiVisible() {
  return state.showErrorBars ? true : "legendonly";
}

function scatterWindDewptCiFillcolor(trace) {
  const code = String(trace?.name || "").split(" ")[0];
  return SCATTER_WIND_DEWPT_CI_FILL[code] || trace?.fillcolor || "rgba(128,128,128,0.35)";
}

function ensureScatterWindDewptCiBands(figure) {
  (figure?.data || []).forEach((trace) => {
    if (!isScatterWindDewptCiBand(trace)) {
      const mode = String(trace?.mode || "");
      if (mode.includes("markers")) {
        trace.zorder = 2;
      } else if (/ fit$/i.test(String(trace?.name || "").trim())) {
        trace.zorder = 4;
      }
      return;
    }

    trace.visible = scatterWindDewptCiVisible();
    trace.mode = "lines";
    trace.fill = "toself";
    trace.fillcolor = scatterWindDewptCiFillcolor(trace);
    trace.showlegend = false;
    trace.hoverinfo = "skip";
    trace.line = { width: 0, color: "rgba(0,0,0,0)" };
    trace.zorder = 3;
    trace.meta = { ...(trace.meta || {}), ciBand: true };
  });
}

function enforceScatterWindDewptAxisRanges(figure) {
  const relayout = scatterWindDewptAxisRelayout(figure);
  if (!relayout) {
    return;
  }

  figure.layout = figure.layout || {};
  figure.layout.xaxis = {
    ...(figure.layout.xaxis || {}),
    range: [...relayout["xaxis.range"]],
    autorange: false,
  };
  figure.layout.yaxis = {
    ...(figure.layout.yaxis || {}),
    range: [...relayout["yaxis.range"]],
    autorange: false,
  };
}

function enforceScatterWindDewptLayout(figure, chartHeight = null) {
  figure.layout = figure.layout || {};
  if (chartHeight != null) {
    figure.layout.height = chartHeight;
  }
  figure.layout.margin = {
    ...(figure.layout.margin || {}),
    ...SCATTER_WIND_DEWPT_PANEL.margin,
  };
  if (figure.layout.title) {
    const title = typeof figure.layout.title === "object"
      ? figure.layout.title
      : { text: figure.layout.title };
    figure.layout.title = {
      ...title,
      x: 0.01,
      xanchor: "left",
      y: 0.98,
      yanchor: "top",
    };
  }
  enforceScatterWindDewptAxisRanges(figure);
}

function enforceTempDewpointLayout(figure, chartHeight = null) {
  figure.layout = figure.layout || {};
  if (chartHeight != null) {
    figure.layout.height = chartHeight;
  }
  figure.layout.margin = {
    ...(figure.layout.margin || {}),
    ...TEMP_DEWPOINT_PANEL.margin,
  };
  figure.layout.xaxis = {
    ...(figure.layout.xaxis || {}),
    domain: TEMP_DEWPOINT_PANEL.xDomain.slice(),
    automargin: false,
  };

  const yTitle = figure.layout.yaxis?.title;
  const yTitleObj = typeof yTitle === "object" && yTitle !== null
    ? yTitle
    : { text: yTitle || "" };
  figure.layout.yaxis = {
    ...(figure.layout.yaxis || {}),
    automargin: false,
    ticklabelstandoff: 4,
    title: {
      ...yTitleObj,
      standoff: 8,
    },
  };
  if (figure.layout.yaxis2) {
    figure.layout.yaxis2 = {
      ...figure.layout.yaxis2,
      automargin: false,
    };
  }
  if (figure.layout.title) {
    const title = typeof figure.layout.title === "object"
      ? figure.layout.title
      : { text: figure.layout.title };
    figure.layout.title = {
      ...title,
      x: 0.01,
      xanchor: "left",
      y: 0.98,
      yanchor: "top",
    };
  }
}

function relayoutScatterWindDewptAxes(host, chartHeight = null) {
  if (!host) {
    return Promise.resolve();
  }

  const relayout = {
    ...(scatterWindDewptAxisRelayout({ data: host.data, layout: host.layout }) || {}),
    "margin.l": SCATTER_WIND_DEWPT_PANEL.margin.l,
    "margin.r": SCATTER_WIND_DEWPT_PANEL.margin.r,
    "margin.t": SCATTER_WIND_DEWPT_PANEL.margin.t,
    "margin.b": SCATTER_WIND_DEWPT_PANEL.margin.b,
  };
  if (chartHeight != null) {
    relayout.height = chartHeight;
  }
  return Plotly.relayout(host, relayout);
}

function applyPersistentAxisLock(figure, figureId) {
  const layout = figure?.layout || {};
  if (layout.polar || usesResponsiveYAxis(figureId) || figureId === "lightning_heatmap") {
    return;
  }

  if (figureId === "hourly_precip" && layoutUsesOverlayingY2(layout)) {
    enforceHourlyPrecipDualAxisLayout(figure);
    return;
  }

  const chartKey = `${els.icao.value}::${figureId}`;
  const existing = state.axisLocks[chartKey] || {};
  const yCandidate = computeAxisBounds(figure, "y");
  const y2Candidate = computeAxisBounds(figure, "y2");
  const yDefault = layoutAxisRange(layout.yaxis);
  const y2Default = layoutAxisRange(layout.yaxis2);

  const yBaseline = existing.y || yDefault;
  const y2Baseline = existing.y2 || y2Default;
  const yLock = expandAxisLock(yBaseline, yCandidate);
  const y2Lock = expandAxisLock(y2Baseline, y2Candidate);

  const next = {};
  if (yLock) {
    next.y = yLock;
    layout.yaxis = {
      ...(layout.yaxis || {}),
      range: [yLock.min, yLock.max],
      autorange: false,
    };
  }
  if (y2Lock) {
    next.y2 = y2Lock;
    layout.yaxis2 = {
      ...(layout.yaxis2 || {}),
      range: [y2Lock.min, y2Lock.max],
      autorange: false,
    };
  }

  if (next.y || next.y2) {
    state.axisLocks[chartKey] = next;
  }
}

function frequencyAxisLockKey(figureId = "") {
  const monthConfig = seasonMonthConfig(els.season.value);
  return [
    els.icao.value,
    figureId,
    els.season.value,
    monthConfig.monthStart,
    monthConfig.monthEnd,
    monthConfig.invertMonth ? "1" : "0",
  ].join("::");
}

function stackedAxisLockKey(host) {
  return frequencyAxisLockKey(host?.dataset?.figureId || "");
}

const MONTH_AXIS_LABELS = new Set([
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]);

const FOG_MONTHLY_FIGURE_IDS = new Set(["fog_low_cloud", "monthly_fog"]);

const DEFAULT_MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function isMonthAxisLabel(label) {
  return MONTH_AXIS_LABELS.has(String(label));
}

function selectedMonthNumbersFromControls() {
  const config = seasonMonthConfig(els.season?.value || "all");
  return selectedMonthNumbers(config.monthStart, config.monthEnd, config.invertMonth);
}

function selectedMonthNumbers(monthStart, monthEnd, invertMonth) {
  const start = Number(monthStart);
  const end = Number(monthEnd);
  const invert = Boolean(invertMonth);
  const selected = new Set();

  for (let month = 1; month <= 12; month += 1) {
    let keep;
    if (invert) {
      keep = month <= start || month >= end;
    } else if (start <= end) {
      keep = month >= start && month <= end;
    } else {
      keep = month >= start || month <= end;
    }
    if (keep) {
      selected.add(month);
    }
  }

  if (!selected.size) {
    return [];
  }

  const anchor = invert ? end : start;
  const ordered = [];
  for (let offset = 0; offset < 12; offset += 1) {
    const month = ((anchor - 1 + offset) % 12) + 1;
    if (selected.has(month)) {
      ordered.push(month);
    }
  }
  return ordered;
}

function monthLabelsFromNumbers(monthNumbers) {
  const monthNames = state.options?.months || DEFAULT_MONTH_LABELS;
  return monthNumbers
    .map((month) => monthNames[month - 1])
    .filter((label) => Boolean(label));
}

function selectedMonthLabelsFromControls() {
  return monthLabelsFromNumbers(selectedMonthNumbersFromControls());
}

function remapFogFigureToSeasonMonths(figure, targetMonthLabels) {
  const targetSet = new Set(targetMonthLabels);
  const sourceTicktext = Array.isArray(figure?.layout?.xaxis?.ticktext) && figure.layout.xaxis.ticktext.length
    ? figure.layout.xaxis.ticktext.map(String)
    : DEFAULT_MONTH_LABELS.slice();

  figure.data = (figure.data || []).map((trace) => {
    const xValues = Array.isArray(trace?.x) ? trace.x : [];
    if (!xValues.length) {
      return trace;
    }

    const yValues = alignedValueArray(trace?.y);
    const customdata = Array.isArray(trace?.customdata) ? trace.customdata.slice() : null;
    const xOffset = Number(xValues[0]) - Math.round(Number(xValues[0]));
    const newX = [];
    const newY = [];
    const newCustom = [];

    for (let i = 0; i < xValues.length; i += 1) {
      const monthLabel = customdata
        ? String(customdata[i])
        : String(sourceTicktext[i] || "");
      if (!targetSet.has(monthLabel)) {
        continue;
      }
      const position = newX.length + 1;
      newX.push(position + xOffset);
      newY.push(yValues[i]);
      if (customdata) {
        newCustom.push(monthLabel);
      }
    }

    const next = { ...trace, x: newX, y: newY };
    if (customdata) {
      next.customdata = newCustom;
    }
    return next;
  });
}

function filterCategoryTracesToSeasonMonths(figure, targetMonthLabels) {
  // Rebuild each categorical month trace in *season* order. Wrap seasons
  // (Summer, Tropical Wet) store points in calendar order (Jan…Dec) while the
  // axis is Dec→Jan→Feb / Oct→…→Apr; connecting in calendar order draws the
  // line backward across the axis and looks like doubled segments.
  const byMonthIndex = new Map(
    targetMonthLabels.map((label, index) => [String(label), index]),
  );

  figure.data = (figure.data || []).map((trace) => {
    const xValues = Array.isArray(trace?.x) ? trace.x : [];
    if (!xValues.length || xValues.some((value) => typeof value === "number")) {
      return trace;
    }

    const yValues = alignedValueArray(trace?.y);
    const customdata = Array.isArray(trace?.customdata) ? trace.customdata.slice() : null;
    const slots = targetMonthLabels.map(() => null);

    for (let i = 0; i < xValues.length; i += 1) {
      const monthLabel = String(xValues[i]);
      const slot = byMonthIndex.get(monthLabel);
      if (slot == null) {
        continue;
      }
      slots[slot] = {
        x: monthLabel,
        y: yValues[i],
        custom: customdata ? customdata[i] : undefined,
      };
    }

    const newX = [];
    const newY = [];
    const newCustom = [];
    slots.forEach((slot) => {
      if (!slot) {
        return;
      }
      newX.push(slot.x);
      newY.push(slot.y);
      if (customdata) {
        newCustom.push(slot.custom);
      }
    });

    const next = { ...trace, x: newX, y: newY };
    if (customdata) {
      next.customdata = newCustom;
    }
    return next;
  });
}

function monthCategoriesFromFigure(figure) {
  const layoutX = figure?.layout?.xaxis || {};
  if (Array.isArray(layoutX.categoryarray) && layoutX.categoryarray.length) {
    const categories = layoutX.categoryarray.map(String);
    if (categories.every(isMonthAxisLabel)) {
      return categories;
    }
  }

  const months = [];
  const seen = new Set();
  (figure?.data || []).forEach((trace) => {
    const xValues = Array.isArray(trace?.x) ? trace.x : [];
    xValues.forEach((value) => {
      const label = String(value);
      if (!isMonthAxisLabel(label) || seen.has(label)) {
        return;
      }
      seen.add(label);
      months.push(label);
    });
  });
  return months;
}

function usesNumericMonthPositions(figure) {
  const xaxis = figure?.layout?.xaxis || {};
  if (xaxis.tickmode !== "array" || !Array.isArray(xaxis.ticktext) || !xaxis.ticktext.length) {
    return false;
  }
  const traces = figure?.data || [];
  return traces.some((trace) => {
    const xValues = Array.isArray(trace?.x) ? trace.x : [];
    return xValues.some((value) => typeof value === "number");
  });
}

function enforceFrequencyMonthAxis(figure, figureId) {
  if (!monthlyFrequencyFigureIds.has(figureId)) {
    return;
  }

  const seasonMonths = selectedMonthLabelsFromControls();
  let months = monthCategoriesFromFigure(figure);

  if (FOG_MONTHLY_FIGURE_IDS.has(figureId) && usesNumericMonthPositions(figure) && seasonMonths.length) {
    remapFogFigureToSeasonMonths(figure, seasonMonths);
    months = seasonMonths;
  } else if (seasonMonths.length) {
    // Always pin wrap-season charts to season order and rewrite categorical
    // traces to match (filter + reorder). Needed even when the figure already
    // has the right *set* of months but in calendar order.
    filterCategoryTracesToSeasonMonths(figure, seasonMonths);
    months = seasonMonths;
  } else if (!months.length) {
    return;
  }

  if (!months.length) {
    return;
  }

  figure.layout = figure.layout || {};
  const xaxis = { ...(figure.layout.xaxis || {}) };

  if (usesNumericMonthPositions(figure)) {
    const positions = months.map((_, index) => index + 1);
    xaxis.tickmode = "array";
    xaxis.tickvals = positions;
    xaxis.ticktext = months;
    xaxis.range = [0.2, months.length + 0.8];
    delete xaxis.categoryarray;
    delete xaxis.categoryorder;
  } else {
    xaxis.type = "category";
    xaxis.categoryorder = "array";
    xaxis.categoryarray = months;
    delete xaxis.tickmode;
    delete xaxis.tickvals;
    delete xaxis.ticktext;
  }

  figure.layout.xaxis = xaxis;
}

function enforceHourlyFrequencyAxis(figure, figureId) {
  if (!hourlyFrequencyFigureIds.has(figureId)) {
    return;
  }

  figure.layout = figure.layout || {};
  const xaxis = { ...(figure.layout.xaxis || {}) };
  const layoutTickvals = Array.isArray(xaxis.tickvals) ? xaxis.tickvals : null;
  const layoutTicktext = Array.isArray(xaxis.ticktext) ? xaxis.ticktext : null;

  xaxis.tickmode = "array";
  xaxis.tickvals = layoutTickvals && layoutTickvals.length ? layoutTickvals.slice() : [0, 5, 10, 15, 20];
  xaxis.ticktext = layoutTicktext && layoutTicktext.length
    ? layoutTicktext.slice()
    : xaxis.tickvals.map((hour) => `${String(hour).padStart(2, "0")}Z`);
  xaxis.range = [-0.8, 23.8];
  xaxis.showgrid = false;
  delete xaxis.categoryarray;
  delete xaxis.categoryorder;
  delete xaxis.type;

  figure.layout.xaxis = xaxis;
}

function captureFrequencyAxisLabelLock(host) {
  if (!hostUsesFrequencyAxisLabelLock(host)) {
    return;
  }

  const key = stackedAxisLockKey(host);
  const existing = state.stackedAxisLabelLocks[key] || {};
  const xaxis = host.layout?.xaxis || {};
  const lock = {
    ...existing,
    ...collectXaxisLabelLockProps(xaxis),
  };

  if (existing.canonicalGeometry) {
    lock.margin = existing.margin;
    lock.domains = existing.domains;
    lock.anchors = existing.anchors;
    lock.yaxisTick = existing.yaxisTick;
    lock.canonicalGeometry = true;
    lock.geometryVersion = existing.geometryVersion;
    lock.yAutomargin = false;
    lock.y2Automargin = false;
  } else if (!existing.margin || !existing.domains) {
    Object.assign(lock, collectFrequencyPlotGeometryLock(host.layout || {}));
  }

  // Dual-panel compare must not bake r≈20 / ICAO chrome into the shared lock.
  if (hostIsCompareDualPanelHost(host) && existing.margin) {
    lock.margin = { ...existing.margin };
  } else if (lock.margin && Number(lock.margin.r) > 80) {
    lock.margin = {
      ...lock.margin,
      r: maximizedSinglePanelMarginR(host.dataset?.figureId || ""),
    };
  }

  state.stackedAxisLabelLocks[key] = lock;
}

function appendYaxisTickLockRelayout(relayout, lock) {
  const yaxisTick = lock?.yaxisTick;
  if (!yaxisTick) {
    return;
  }

  ["tickmode", "dtick", "tick0", "nticks", "tickformat", "side", "position"].forEach((key) => {
    if (yaxisTick[key] !== undefined) {
      relayout[`yaxis.${key}`] = yaxisTick[key];
    }
  });
}

function appendFrequencyPlotGeometryRelayout(relayout, lock, host) {
  if (hostIsCompareDualPanelHost(host)) {
    const panelMargin = comparePanelMarginForFigure(host?.dataset?.figureId || "");
    ["l", "r", "t", "b"].forEach((key) => {
      relayout[`margin.${key}`] = panelMargin[key];
    });
    relayout["margin.autoexpand"] = false;
  } else {
  const margin = lock?.margin;
  if (margin) {
    ["l", "r", "t", "b"].forEach((key) => {
      if (margin[key] !== undefined) {
          // Never re-apply a lite in-plot legend reservation after compare exit.
          const value = key === "r" && Number(margin[key]) > 80
            ? maximizedSinglePanelMarginR(host?.dataset?.figureId || "")
            : margin[key];
          relayout[`margin.${key}`] = value;
      }
    });
  } else {
    relayout["margin.b"] = effectiveFrequencyMarginBottom(host, lock?.marginBottom);
    relayout["margin.l"] = FREQUENCY_CHART_MIN_MARGIN_L;
    }
  }

  const domains = lock?.domains;
  if (domains?.x) {
    relayout["xaxis.domain"] = domains.x.slice();
  }
  if (domains?.y) {
    relayout["yaxis.domain"] = domains.y.slice();
  }
  if (domains?.y2 && host.layout?.yaxis2 && !layoutUsesOverlayingY2(host.layout)) {
    relayout["yaxis2.domain"] = domains.y2.slice();
  }
  if (host.layout?.yaxis2 && layoutUsesOverlayingY2(host.layout)) {
    relayout["yaxis2.domain"] = null;
    relayout["yaxis2.overlaying"] = "y";
    relayout["yaxis2.side"] = "right";
  }

  const anchors = lock?.anchors;
  relayout["xaxis.anchor"] = anchors?.x || "y";
  relayout["yaxis.anchor"] = anchors?.y || "x";
  if (anchors?.y2 && host.layout?.yaxis2) {
    relayout["yaxis2.anchor"] = anchors.y2;
  }

  appendYaxisTickLockRelayout(relayout, lock);

  relayout["yaxis.automargin"] = false;
  if (host.layout?.yaxis2) {
    relayout["yaxis2.automargin"] = false;
  }
}

function stableFrequencyAxisRelayout(host) {
  if (!hostUsesFrequencyAxisLabelLock(host)) {
    return {};
  }

  const lock = state.stackedAxisLabelLocks[stackedAxisLockKey(host)];
  const relayout = {
    "xaxis.ticklabelposition": lock?.ticklabelposition || "outside",
  };

  if (lock) {
    ["tickmode", "tickangle", "ticklabelstandoff", "ticklabeloverflow", "automargin", "type", "side"].forEach((key) => {
      if (lock[key] !== undefined) {
        relayout[`xaxis.${key}`] = lock[key];
      }
    });

    if (Array.isArray(lock.range) && lock.range.length === 2) {
      relayout["xaxis.range"] = [lock.range[0], lock.range[1]];
      relayout["xaxis.autorange"] = false;
    }
    if (Array.isArray(lock.tickvals) && lock.tickvals.length) {
      relayout["xaxis.tickvals"] = lock.tickvals.slice();
    }
    if (Array.isArray(lock.ticktext) && lock.ticktext.length) {
      relayout["xaxis.ticktext"] = lock.ticktext.slice();
    }
    if (typeof lock.categoryorder === "string" && lock.categoryorder.length) {
      relayout["xaxis.categoryorder"] = lock.categoryorder;
    }
    if (Array.isArray(lock.categoryarray) && lock.categoryarray.length) {
      relayout["xaxis.categoryarray"] = lock.categoryarray.slice();
    }
  }

  appendFrequencyPlotGeometryRelayout(relayout, lock, host);
  return relayout;
}

function captureStackedAxisLabelLock(host) {
  captureFrequencyAxisLabelLock(host);
}

function stableStackedAxisRelayout(host) {
  return stableFrequencyAxisRelayout(host);
}

function rescaleAfterLegendToggle(host) {
  return awaitLayoutSettle()
    .then(() => awaitLayoutSettle())
    .then(() => {
      if (hostUsesCanonicalGroupedBarGeometry(host) && hasCanonicalPlotGeometry(host)) {
        return applyCanonicalGroupedBarRelayout(host);
      }
      return applyResponsiveAxisRange(host);
    });
}

function stackedUirevisionToken(figureId = "") {
  const monthConfig = seasonMonthConfig(els.season.value);
  return [
    els.icao.value,
    figureId,
    els.season.value,
    monthConfig.monthStart,
    monthConfig.monthEnd,
    monthConfig.invertMonth ? "1" : "0",
    state.fogModes.monthly,
    state.fogModes.hourly,
    state.fogModes.wind,
    state.fogModes.dewpoint,
  ].join("::");
}

function renderExternalLegend(host, legendHost, figure, section = state.displayedSection, figureId = "") {
  const { items, groupclick } = getLegendItems(figure, section, figureId);
  legendHost.innerHTML = "";
  legendHost.style.minWidth = "";
  legendHost.style.marginLeft = "";
  legendHost.style.marginRight = "";

  if (!items.length) {
    legendHost.classList.add("hidden");
    host.closest(".chart-shell")?.classList.add("no-legend");
    legendHost.parentElement?.classList.add("no-legend");
    return;
  }

  host.closest(".chart-shell")?.classList.remove("no-legend");
  legendHost.parentElement?.classList.remove("no-legend");
  legendHost.classList.remove("hidden");

  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chart-legend-item";
    button.title = item.label;
    button.setAttribute("aria-label", item.label);

    const swatch = document.createElement("span");
    swatch.className = "chart-legend-swatch";
    swatch.style.background = item.color;
    swatch.style.borderColor = item.color;

    const label = document.createElement("span");
    label.className = "chart-legend-label";
    label.textContent = item.label;

    button.appendChild(swatch);
    button.appendChild(label);
    button.addEventListener("click", () => {
      const plotData = host.data || [];
      const affectedIndices = getAffectedTraceIndices(plotData, item, groupclick);
      const anyVisible = affectedIndices.some((traceIndex) => isTraceVisible(plotData[traceIndex]));
      const nextVisibility = anyVisible ? "legendonly" : true;
      const isCanonicalGroupedBar = strictGroupedBarOverlayFigureIds.has(figureId);
      const compareHost = getPairedCompareHost(host);

      // Compare dual-panel: light dual update — no geometry recalibration (that
      // was causing the size jump / flicker).
      const toggleChain = compareHost
        ? applyCompareLegendToggle(host, compareHost, figureId, affectedIndices, nextVisibility)
        : (isCanonicalGroupedBar
        ? applyCanonicalGroupedBarLegendToggle(host, affectedIndices, nextVisibility)
          .then(() => finishStrictValueErrorBarOverlays(host))
          .then(() => finalizeGroupedBarLegendToggle(host))
        : Plotly.restyle(host, { visible: affectedIndices.map(() => nextVisibility) }, affectedIndices)
          .then(() => rebuildStackErrorBarOverlays(host))
          .then(() => rebuildStrictValueErrorBarOverlays(host))
          .then(() => finishStrictValueErrorBarOverlays(host))
          .then(() => (figureId === "cloud_distribution" ? syncFogWindHoverTemplate(host) : Promise.resolve()))
          .then(() => (figureId === "wind_rose" ? refreshWindRoseCalmBarMask(host) : Promise.resolve()))
          .then(() => (figureId === "wind_rose" ? deferWindRoseCalmDomHover(host) : Promise.resolve()))
            .then(() => rescaleAfterLegendToggle(host)));

      toggleChain.then(() => {
        if (figureId) {
          captureChartLegendVisibilityFromHost(host, figureId);
        }
        refreshLegendState(host, legendHost, items, groupclick);
        if (compareHost) {
          return undefined;
        }
        return fitMobileChartAroundLegend(host).then(() => {
          if (figureId === "wind_rose") {
            scheduleWindRoseResize(host);
            return;
          }
          if (host.dataset?.figureId === "lightning_heatmap"
            && (isLightningGafZoom() || isGafLightningFigure({ layout: host.layout }))) {
            scheduleGafLightningSeal(host);
            return;
          }
          scheduleHostResize(host, { recalibrateFrame: true });
        });
      });
    });

    legendHost.appendChild(button);
  });

  refreshLegendState(host, legendHost, items, groupclick);
}

function getChartHeight(section) {
  const isWindSection = section === "wind";
  const isExpandedSection = isWindSection;

  const headerEl = document.querySelector(".app-header");
  const controlsEl = document.querySelector(".controls");
  const headerHeight = headerEl?.offsetHeight ?? 0;
  // Controls live inside the header strip; don't subtract them twice.
  const controlsInsideHeader = Boolean(headerEl && controlsEl && headerEl.contains(controlsEl));
  const controlsHeight = controlsInsideHeader ? 0 : (controlsEl?.offsetHeight ?? 0);
  const statusHeight = els.status.offsetHeight ?? 0;
  const metricsEl = els.metrics;
  const metricsVisible = Boolean(
    metricsEl
    && !metricsEl.classList.contains("hidden")
    && metricsEl.offsetParent !== null
    && metricsEl.childElementCount > 0,
  );
  const metricsHeight = metricsVisible ? (metricsEl.offsetHeight ?? 0) : 0;
  const viewportHeight = window.innerHeight;
  
  // Reserve room for page padding, the 2-row grid gap, and Plotly card chrome.
  const fixedChrome = 40;
  const available = Math.max(0, viewportHeight - headerHeight - controlsHeight - statusHeight - metricsHeight - fixedChrome);

  // Mobile single-chart: this is the max plot height before subtracting
  // the below-plot legend / toggles (see applyChartShellHeights).
  if (isMobileViewport()) {
    return Math.max(160, Math.min(1100, available - 4));
  }

  if (isExpandedSection) {
    // For expanded sections, we use more of the available viewport height, up to a max
    const maxHeight = 900;
    const targetHeight = available - 12;
    return Math.max(380, Math.min(maxHeight, targetHeight));
  }

  const maxHeight = 320;
  const perRowHeight = Math.floor((available - 8) / 2);

  return Math.max(220, Math.min(maxHeight, perRowHeight - 12));
}

const hostResizeFrames = new Map();

function chartBoxSize(host) {
  return {
    width: Math.round(host?.clientWidth || host?.offsetWidth || 0),
    height: Math.round(host?.clientHeight || host?.offsetHeight || 0),
  };
}

function hostBoxMatchesLayout(host) {
  const box = chartBoxSize(host);
  const layoutW = Math.round(Number(host?.layout?.width) || 0);
  const layoutH = Math.round(Number(host?.layout?.height) || 0);
  if (!(box.width > 40) || !(box.height > 40) || !(layoutW > 40) || !(layoutH > 40)) {
    return false;
  }
  return Math.abs(layoutW - box.width) <= 2 && Math.abs(layoutH - box.height) <= 2;
}

function chartSizeRelayout(host) {
  const box = chartBoxSize(host);
  if (!(box.width > 40) || !(box.height > 40)) {
    return {};
  }
  return { width: box.width, height: box.height, autosize: false };
}

function scheduleHostResize(host, options = {}) {
  if (!host) {
    return Promise.resolve();
  }
  if (shouldSkipLightningHourlyTopoRelayout(host)) {
    return Promise.resolve();
  }

  const existingFrame = hostResizeFrames.get(host);
  if (existingFrame) {
    cancelAnimationFrame(existingFrame);
  }

  const recalibrateFrame = Boolean(options.recalibrateFrame);
  const resizeOnly = options.mode === "resize";

  return new Promise((resolve) => {
    const frameId = requestAnimationFrame(() => {
      hostResizeFrames.delete(host);
      if (!recalibrateFrame && hostBoxMatchesLayout(host)) {
        resolve();
        return;
      }
      const sizePatch = chartSizeRelayout(host);
      const applySizeAndGeometry = () => {
          if (hostUsesCanonicalGroupedBarGeometry(host)) {
          const calibrateResizes = usesDualAxisPairedBarOverlays(host) && (recalibrateFrame || resizeOnly);
          const sized = !calibrateResizes && Object.keys(sizePatch).length
            ? Plotly.relayout(host, sizePatch)
            : Promise.resolve();
          return sized.then(() => {
            if (usesDualAxisPairedBarOverlays(host) && (recalibrateFrame || resizeOnly)) {
              if (recalibrateFrame) {
                invalidateCanonicalGeometry(host);
              }
              return calibrateCanonicalPlotGeometry(host, { mode: "resize" });
            }
            if (recalibrateFrame) {
              invalidateCanonicalGeometry(host);
              return calibrateCanonicalPlotGeometry(host)
                .then(() => applyResponsiveAxisRange(host));
            }
            if (hasCanonicalPlotGeometry(host)) {
              return applyResponsiveAxisRange(host);
            }
            return calibrateCanonicalPlotGeometry(host)
              .then(() => applyResponsiveAxisRange(host));
          });
          }
          if (!hostUsesFrequencyAxisLabelLock(host)) {
            if (isTopoMapFigure(host.dataset?.figureId || "")) {
            const patch = { ...sizePatch, ...buildTopoMapPanelRelayout(host) };
            appendAlignedPolarImagePatch(host, patch);
            return Plotly.relayout(host, patch).then(() => {
                if (host?.dataset?.figureId === "wind_rose" && isTraceVisible(windRoseCalmVisualTrace(host))) {
                  ensureWindRoseCalmBarMask(host);
                }
              });
            }
          if (!Object.keys(sizePatch).length) {
            return undefined;
          }
          return Plotly.relayout(host, sizePatch);
        }
        const relayout = { ...sizePatch, ...stableFrequencyAxisRelayout(host) };
          if (!Object.keys(relayout).length) {
          return undefined;
          }
          return Plotly.relayout(host, relayout);
      };
      Promise.resolve(applySizeAndGeometry()).finally(resolve);
    });

    hostResizeFrames.set(host, frameId);
  });
}

function markWindRoseSwapped(host) {
  if (!host) {
    return;
  }
  const token = String(Date.now());
  host.dataset.windRoseSwapped = "1";
  host.dataset.windRoseSwapToken = token;
  window.setTimeout(() => {
    if (host.dataset.windRoseSwapToken === token) {
      delete host.dataset.windRoseSwapped;
      delete host.dataset.windRoseSwapToken;
    }
  }, 600);
}

function clearWindRoseSwapMark(host) {
  if (!host?.dataset) {
    return;
  }
  delete host.dataset.windRoseSwapped;
  delete host.dataset.windRoseSwapToken;
}

function windRoseHostNeedsResize(host) {
  const layoutW = Math.round(Number(host?.layout?.width) || 0);
  const layoutH = Math.round(Number(host?.layout?.height) || 0);
  const hostW = Math.round(host?.offsetWidth || 0);
  const hostH = Math.round(host?.offsetHeight || 0);
  if (!(layoutW > 40) || !(layoutH > 40) || !(hostW > 40) || !(hostH > 40)) {
    return true;
  }
  return Math.abs(layoutW - hostW) > 1 || Math.abs(layoutH - hostH) > 1;
}

function scheduleWindRoseResize(host) {
  if (!host) {
    return Promise.resolve();
  }
  if (hostBoxMatchesLayout(host)) {
    return Promise.resolve();
  }
  return scheduleHostResize(host);
}

async function refreshMaximizedChartLayout(host) {
  if (!host) {
    return;
  }

  if (host.dataset?.figureId === "hourly_precip") {
    const chartHeight = Number.parseFloat(host.style.height) || null;
    await finalizeHourlyPrecipMaximizedLayout(host, chartHeight);
    return;
  }

  if (host.dataset?.figureId === "lightning_heatmap"
    && (isLightningGafZoom() || isGafLightningFigure({ layout: host.layout }))) {
    await rebuildAndSealGafLightningHost(host);
    return;
  }

  if (host.dataset?.figureId === "lightning_heatmap" && shouldUseHourlyLightningHeatmap()) {
    teardownLightningOverlay();
    await awaitLayoutSettle();
    await relayoutTopoMapPanel(host);
    await scheduleHostResize(host, { recalibrateFrame: true });
    await awaitLayoutSettle();
    await enterLightningHourlyOverlayCurrent(host);
    return;
  }

  await awaitLayoutSettle();
  await Plotly.relayout(host, { width: null, autosize: true });
  if (isTopoMapFigure(host.dataset?.figureId || "")) {
    await relayoutTopoMapPanel(host);
  }
  await scheduleHostResize(host, { recalibrateFrame: true });
}

function measureMobileBelowChartChrome(ui) {
  if (!ui?.card) {
    return 0;
  }
  const legend = ui.legend;
  const legendH = legend && !legend.classList.contains("hidden") ? (legend.offsetHeight || 0) : 0;
  const toolbar = ui.card.querySelector(".chart-card-toolbar");
  const toolbarH = toolbar && !toolbar.classList.contains("hidden") ? (toolbar.offsetHeight || 0) : 0;
  const zoom = ui.card.querySelector(".chart-zoom-toggle")
    || ui.shell?.querySelector(".chart-zoom-toggle");
  const zoomH = zoom && !zoom.classList.contains("hidden") ? (zoom.offsetHeight || 0) : 0;
  const gap = (legendH ? 12 : 0) + ((toolbarH || zoomH) ? 8 : 0);
  return legendH + toolbarH + zoomH + gap;
}

const MAXIMIZED_BOTTOM_CHROME_PX = 52; // keep in sync with .chart-card.is-maximized .chart-shell padding-bottom
// Mode toggle offset from card top (matches --chart-toolbar-top / --chart-top-chrome).
const WIND_ROSE_TOOLBAR_TOP_PX = 10;
// Fixed top inset for toggle + hour scroller. Applied in BOTH summary and hourly
// so roses clear the overlay controls without jumping when the scroller appears.
const WIND_ROSE_OVERLAY_CHROME_PX = 64;

// Mode toolbars (Wind / Fog) always overlay the card so they never push Plotly
// titles down in the 4-panel grid. Maximized Wind also reserves shell padding
// for the toggle + hour scroller band.
function syncMaximizedShellAndToolbarInsets(card, {
  isMaximized = false,
  pinModeToolbar = false,
} = {}) {
  if (!card) {
    return 0;
  }
  const shell = card.querySelector(".chart-shell");
  const slot = Array.from(card.children).find((el) => el.classList?.contains("chart-mode-toolbar-slot"));
  const toolbar = card.querySelector(".chart-card-toolbar.is-wind-toolbar")
    || card.querySelector(".chart-card-toolbar:not(.hidden)")
    || card.querySelector(".chart-card-toolbar");
  const toolbarVisible = Boolean(
    toolbar
    && !toolbar.classList.contains("hidden")
    && !toolbar.hidden,
  );
  // Pin whenever a mode toolbar is shown — grid and maximized.
  const shouldPin = Boolean(toolbarVisible && toolbar);
  const reserveOverlayChrome = Boolean(
    shouldPin
    && isMaximized
    && (
      toolbar.classList.contains("is-wind-toolbar")
      || toolbar.querySelector("#wr-mode-summary")
      || toolbar.querySelector("#wr-hour-scroller-container")
    ),
  );

  card.classList.toggle("has-top-chrome", shouldPin);
  card.style.setProperty("--chart-top-chrome", `${WIND_ROSE_TOOLBAR_TOP_PX}px`);
  card.style.setProperty("--chart-overlay-chrome", `${WIND_ROSE_OVERLAY_CHROME_PX}px`);
  card.style.setProperty("position", "relative");

  if (slot) {
    slot.hidden = true;
    slot.setAttribute("style", "display:none!important");
    if (toolbar && toolbar.parentElement === slot) {
      card.insertBefore(toolbar, shell || card.firstChild);
    }
  }

  if (shell) {
    shell.style.removeProperty("margin-top");
  }

  if (!toolbar || !toolbarVisible) {
    if (toolbar) {
      toolbar.classList.remove("is-mode-toolbar-pinned");
      toolbar.removeAttribute("data-av-pinned-top");
      toolbar.style.cssText = "";
    }
    if (shell) {
      shell.style.removeProperty("padding-top");
      shell.style.removeProperty("position");
      shell.style.removeProperty("z-index");
      shell.style.removeProperty("flex");
      shell.style.removeProperty("box-sizing");
    }
    return 0;
  }

  if (toolbar.parentElement !== card) {
    card.insertBefore(toolbar, shell || card.firstChild);
  }
  toolbar.classList.add("is-mode-toolbar-pinned");
  toolbar.classList.remove("hidden");
  toolbar.hidden = false;
  toolbar.dataset.avPinnedTop = String(WIND_ROSE_TOOLBAR_TOP_PX);
  toolbar.style.cssText = [
    "display:flex",
    "flex-direction:column",
    "align-items:flex-end",
    "justify-content:flex-start",
    "position:absolute",
    "right:14px",
    "left:auto",
    "bottom:auto",
    "margin:0",
    "padding:0",
    "transform:none",
    "z-index:7",
    "pointer-events:none",
    "width:auto",
    "height:auto",
  ].join(";");
  // Set top with !important so it wins over any leftover 5px toolbar-top rules.
  toolbar.style.setProperty("top", `${WIND_ROSE_TOOLBAR_TOP_PX}px`, "important");
  toolbar.querySelectorAll("button, input, select, label, a, .segmented-toggle, .lite-control-row, .hour-scroller-row").forEach((el) => {
    el.style.pointerEvents = "auto";
  });
  const scroller = toolbar.querySelector("#wr-hour-scroller-container");
  if (scroller) {
    scroller.style.setProperty("position", "absolute", "important");
    scroller.style.setProperty("top", "calc(100% + 4px)", "important");
    scroller.style.setProperty("left", "50%", "important");
    scroller.style.setProperty("transform", "translateX(-50%)", "important");
    scroller.style.setProperty("margin", "0", "important");
  }
  if (shell) {
    shell.style.position = "relative";
    shell.style.zIndex = "1";
    shell.style.flex = "1 1 auto";
    shell.style.boxSizing = "border-box";
    if (reserveOverlayChrome) {
      // Maximized Wind only — constant band so summary/hourly do not jump.
      shell.style.paddingTop = `${WIND_ROSE_OVERLAY_CHROME_PX}px`;
      return WIND_ROSE_OVERLAY_CHROME_PX;
    }
    shell.style.removeProperty("padding-top");
  }
  return 0;
}

function applyChartShellHeights(section = state.displayedSection) {
  const chartHeight = getChartHeight(section);
  const visibleCardCount = state.latestFigures.length ? Math.min(state.latestFigures.length, els.charts.length) : els.charts.length;
  const expandedRows = visibleCardCount > 2 ? 2 : 1;
  const expandedHeight = state.maximizedChartIndex === null ? chartHeight : (chartHeight * expandedRows) + (8 * Math.max(0, expandedRows - 1));
  const mobile = isMobileViewport();

  for (let i = 0; i < els.charts.length; i += 1) {
    const isMaximized = state.maximizedChartIndex === i;
    let targetHeight = isMaximized ? expandedHeight : chartHeight;
    const windMaximized = isMaximized && section === "wind" && !mobile;
    // Prefer figure id, but also accept the shell class — and on the Wind section
    // the maximized card is the rose often enough that a missing dataset must not
    // leave the mode toggle at the default 5px pad (Safari was stuck there).
    const windRoseMaximized = windMaximized
      && (
        els.charts[i]?.dataset?.figureId === "wind_rose"
        || state.latestFigures[i]?.id === "wind_rose"
        || chartUi[i]?.shell?.classList?.contains("is-wind-rose-shell")
        || (
          section === "wind"
          && isMaximized
          && Boolean(chartUi[i]?.card?.querySelector(".chart-card-toolbar.is-wind-toolbar"))
        )
      );
    const compareActive = isMaximized && isCompareDualPanelActive();
    chartUi[i].card.classList.toggle("is-wind-maximized", windMaximized);
    chartUi[i].card.classList.remove("is-wind-hourly");
    // Pin any visible mode toolbar (Wind / Fog) in grid and maximized so titles
    // stay aligned with sibling panels that have no toolbar.
    const hasVisibleModeToolbar = Boolean(
      chartUi[i]?.card?.querySelector(".chart-card-toolbar:not(.hidden)")
      || chartUi[i]?.card?.querySelector("#wr-mode-summary")
      || chartUi[i]?.card?.querySelector(".segmented-toggle")
    );
    const topInset = syncMaximizedShellAndToolbarInsets(chartUi[i].card, {
      isMaximized,
      pinModeToolbar: hasVisibleModeToolbar,
    });
    // HTML title badge on every desktop card (Plotly title is blanked at paint).
    // Dual-panel compare keeps ICAO labels on the plot panels instead.
    const figureId = els.charts[i]?.dataset?.figureId
      || state.latestFigures[i]?.id
      || "";
    const titleText = resolveCardFigureTitleText(figureId, state.latestFigures[i]?.figure);
    const showCardTitle = Boolean(
      shouldUseHtmlCardFigureTitle()
      && titleText
      && !(compareActive && isMaximized)
    );
    syncChartCardFigureTitle(chartUi[i].card, {
      show: showCardTitle,
      text: titleText,
    });
    if (mobile) {
      chartUi[i].card.style.minHeight = "";
      targetHeight = Math.max(160, targetHeight - measureMobileBelowChartChrome(chartUi[i]));
    } else if (windMaximized) {
      // Bottom Compare/Restore + constant top overlay band (toggle + hour scroller).
      chartUi[i].card.style.minHeight = "";
      targetHeight = Math.max(
        220,
        targetHeight - MAXIMIZED_BOTTOM_CHROME_PX - (topInset || WIND_ROSE_OVERLAY_CHROME_PX),
      );
    } else {
      // Maximized: shell CSS padding-bottom holds Compare/Restore; card min-height
      // includes that strip so the plot host can use the full expandedHeight above it.
      const cardPad = isMaximized ? MAXIMIZED_BOTTOM_CHROME_PX + 10 : 10;
      chartUi[i].card.style.minHeight = `${(isMaximized ? expandedHeight : chartHeight) + cardPad}px`;
      if (topInset) {
        targetHeight = Math.max(220, targetHeight - topInset);
      }
    }
    const prevHostHeight = Number.parseFloat(els.charts[i].style.height) || 0;
    els.charts[i].style.height = `${targetHeight}px`;
    const compareHost = chartUi[i]?.compareHost;
    if (compareHost) {
      if (isMaximized && isCompareDualPanelActive() && !compareDeferShellReveal) {
        compareHost.style.height = `${targetHeight}px`;
      } else if (!isMaximized) {
        compareHost.style.height = "";
      }
    }
    // Card ResizeObserver may not fire when only the inner host height changes.
    // Keep Plotly's layout height in lockstep so x-axis labels are not clipped.
    // Dual compare: route through pair size only — a primary-only resize fights
    // the settle owner and shifts columns/basemap.
    if (
      els.charts[i].classList.contains("js-plotly-plot")
      && Math.abs(prevHostHeight - targetHeight) > 1
      && !shouldSkipLightningHourlyTopoRelayout(els.charts[i])
    ) {
      if (isMaximized && isCompareDualPanelActive() && !compareDeferShellReveal) {
        if (!isCompareSettleBlocked()) {
          scheduleComparePairSizePass(50);
        }
      } else {
        scheduleHostResize(els.charts[i], { mode: "resize" });
      }
    }
  }

  return chartHeight;
}

function fitMobileChartAroundLegend(host) {
  if (!isMobileViewport() || !host) {
    return Promise.resolve();
  }
  const index = els.charts.indexOf(host);
  if (index < 0) {
    return Promise.resolve();
  }
  const ui = chartUi[index];
  ui.card.style.minHeight = "";
  const chrome = measureMobileBelowChartChrome(ui);
  const cardH = ui.card.clientHeight || 0;
  const maxPlot = getChartHeight(state.displayedSection);
  const budget = cardH > 80 ? cardH - chrome - 8 : maxPlot - chrome;
  const next = Math.max(160, Math.min(maxPlot, budget));
  const current = Number.parseFloat(host.style.height) || 0;
  if (Math.abs(current - next) < 2) {
    return Promise.resolve();
  }
  host.style.height = `${Math.round(next)}px`;
  return Promise.resolve();
}

function prepareChartsRender(figures) {
  const renderFigures = figures.map(cloneFigurePayloadForRender);
  state.latestFigures = renderFigures;
  return renderFigures.slice(0, 4);
}

async function renderChartsToDom(figures, section = state.displayedSection, onProgress) {
  // Remove any stale lightning overlay before re-rendering the base charts. Both
  // local and GAF hourly rebuild it afterwards: local via enterLightningHourlyOverlay,
  // GAF via sealGafLightningHost (which enters a scrub overlay on the sealed base).
  teardownLightningOverlay();
  const visibleFigures = prepareChartsRender(figures);
  const isExpandedSection = section === "wind";
  const hasGafLightning = isLightningGafZoom()
    && visibleFigures.some((item) => item.id === "lightning_heatmap");
  if (hasGafLightning) {
    bumpLightningLayoutGeneration();
  }
  // Class, height, and pin changes happen before the first paint so Plotly
  // is not asked to grow into a layout that is still changing.
    applyMaximizedChartState();
  if (!Number.isInteger(state.maximizedChartIndex)) {
    clearAllChartHostSizePinsSync();
  }
  const chartHeight = applyChartShellHeights(section);
  await awaitLayoutSettle();
  const totalCharts = visibleFigures.length;
  let completedCharts = 0;
  const reportChartComplete = () => {
    completedCharts += 1;
    if (onProgress) {
      onProgress(completedCharts, totalCharts);
    }
  };

  const icao = els.icao?.value || "";
  const season = els.season?.value || "all";
  const renderPromises = visibleFigures.map((item, idx) => {
    const host = els.charts[idx];
    host.dataset.figureId = item.id || "";
    const { card, legend, shell } = chartUi[idx];
    card.classList.remove("hidden");
    const targetChartHeight = Number.parseFloat(host.style.height) || chartHeight;
    const isMaximized = state.maximizedChartIndex === idx;
    const figure = item.figure;
    restoreCompareIcaoTitle(figure, item.id || "");
    const isFrequencyFigure = frequencyFigureIds.has(item.id);
    const isWindRoseFigure = item.id === "wind_rose";
    const isTopoMapShell = isTopoMapFigure(item.id);
    shell.classList.toggle("is-wind-rose-shell", isTopoMapShell);
    shell.classList.toggle("is-scatter-wind-dewpt-shell", item.id === "scatter_wind_dewpt");
    shell.classList.toggle("is-temp-dewpoint-shell", item.id === "temp_dewpoint");
    if (isTopoMapFigure(item.id)) {
      applyTopoMapPanelLayout(figure, item.id, { chartHeight: targetChartHeight });
    }
    if (isWindRoseFigure) {
      let layoutSnapshot = null;
      if (state.wrMode === "hourly" && state.windRoseLayoutRef[section]) {
        // Use the stable all-hours scale (matches scrub frames) when available,
        // otherwise fall back to the summary snapshot's range.
        const hourlyRange = ensureWindRoseHourlyScale(icao, season, section);
        layoutSnapshot = {
          ...state.windRoseLayoutRef[section],
          height: targetChartHeight,
          ...(hourlyRange ? { radialRange: [...hourlyRange] } : {}),
        };
      }
      applyWindRoseLayout(figure, section, layoutSnapshot);
      figure.layout.height = targetChartHeight;
      delete figure.layout.width;
      if (state.wrMode === "summary") {
        windRosePlayback.frameContext = null;
      } else {
        windRosePlayback.frameContext = windRoseFramePinContext(host);
      }
    }
    return prepareChartTerrainBackground(figure, icao, item.id).then(() => {
    figure.layout = figure.layout || {};
    figure.layout.legend = figure.layout.legend || {};
    figure.layout.showlegend = false;
    suppressMobileFigureTitle(figure);
    rememberFigureDisplayTitle(item.id, figure.layout.title);
    if (!isWindRoseFigure && !isTopoMapShell) {
      if (isMobileViewport()) {
        figure.layout.margin = {
          ...(figure.layout.margin || {}),
          l: Math.min(Number(figure.layout.margin?.l) || 40, 36),
          r: item.id === "hourly_precip" ? 28 : 12,
          t: Math.min(Number(figure.layout.margin?.t) || 40, 32),
          b: Math.min(Number(figure.layout.margin?.b) || 40, 28),
        };
      } else {
        figure.layout.margin = {
          ...(figure.layout.margin || {}),
          r: item.id === "hourly_precip" ? HOURLY_PRECIP_PANEL.margin.r : 32,
        };
      }
    }
    applyStrictValueHoverTemplatesToFigure(figure, item.id || "");
    enforceFrequencyMonthAxis(figure, item.id || "");
    enforceHourlyFrequencyAxis(figure, item.id || "");
    if (item.id === "temp_dewpoint") {
      enforceTempDewpointLayout(figure, targetChartHeight);
    }
    if (item.id === "hourly_precip") {
      enforceHourlyPrecipDualAxisLayout(figure, targetChartHeight);
    }
    if (item.id === "lightning_heatmap") {
      if (!isGafLightningFigure(figure)) {
        const hourlyScale = shouldUseHourlyLightningHeatmap(section) ? ensureLightningHourlyScale(icao, season) : null;
        const scale = applyLightningHeatmapStyle(figure, {
          icao,
          season,
          fixedScale: hourlyScale,
        });
        if (state.lhMode === "summary" && scale) {
          state.lightningHeatmapScaleRef = { ...scale };
          rememberLightningSummaryScale(icao, season, scale, { compare: false });
        }
      }
    }
    prepareFrequencyFigureGeometry(figure, item.id || "");
    if (isFrequencyFigure || item.id === "fog_cloud_joint") {
      figure.layout.uirevision = stackedUirevisionToken(item.id || "");
    } else if (String(figure.layout.barmode || "").toLowerCase() === "stack") {
      figure.layout.uirevision = stackedUirevisionToken(item.id || "");
    }
    if (item.id !== "scatter_wind_dewpt") {
      applyPersistentAxisLock(figure, item.id);
    }
    if (item.id === "scatter_wind_dewpt") {
      ensureScatterWindDewptCiBands(figure);
      enforceScatterWindDewptLayout(figure, targetChartHeight);
    }
    if (isFrequencyFigure) {
      figure.layout.height = targetChartHeight;
    }
    if (item.id === "fog_cloud_joint") {
      figure.layout.margin = {
        ...figure.layout.margin,
        b: 18,
      };
      figure.layout.height = targetChartHeight - 12;
    }
    if (isExpandedSection && !isWindRoseFigure) {
      figure.layout.height = targetChartHeight;
    }
    const usesDedicatedChartHeight = isWindRoseFigure
      || isFrequencyFigure
      || item.id === "fog_cloud_joint"
      || item.id === "temp_dewpoint"
      || item.id === "scatter_wind_dewpt"
      || isExpandedSection;
    if (!usesDedicatedChartHeight) {
      figure.layout.height = targetChartHeight;
      delete figure.layout.width;
    }
    if (item.id === "lightning_heatmap" && isGafLightningFigure(figure)) {
      const target = measureGafLightningSealTarget(host);
      const hostWidth = target.targetWidth > 0
        ? target.targetWidth
        : Math.round(host.offsetWidth || host.clientWidth || 0);
      const hostHeight = target.targetHeight > 0
        ? target.targetHeight
        : Math.round(host.offsetHeight || host.clientHeight || targetChartHeight || 0);
      if (hostWidth > 0) {
        figure.layout.width = hostWidth;
      }
      if (hostHeight > 0) {
        figure.layout.height = hostHeight;
      }
      figure.layout.autosize = false;
      const bbox = Array.isArray(figure.layout.meta?.gafBbox) ? figure.layout.meta.gafBbox : null;
      if (bbox && hostWidth > 0 && hostHeight > 0) {
        const comparePanel = isCompareDualPanelActive();
        const mapDomains = computeGafLightningMapDomains(bbox, hostWidth, hostHeight, {
          comparePanel,
          margin: comparePanel ? COMPARE_LIGHTNING_PANEL_MARGIN : null,
        });
        figure.layout.xaxis = { ...(figure.layout.xaxis || {}), domain: mapDomains.x };
        figure.layout.yaxis = { ...(figure.layout.yaxis || {}), domain: mapDomains.y };
      }
    } else if (isMaximized) {
      figure.layout.autosize = true;
      delete figure.layout.width;
    } else {
      clearHostWidthPinSync(host);
      figure.layout.autosize = true;
      delete figure.layout.width;
    }
    applyChartLegendVisibilityToFigure(figure, item.id);
    if (isWindRoseFigure) {
      normalizeWindRoseCalmTrace(figure);
      if (state.wrMode === "summary") {
        state.windRoseLayoutRef[section] = extractWindRoseLayoutSnapshot(figure, section, targetChartHeight);
        // Cache the summary rose so toggling hourly -> summary can restore it in
        // place without a full grid re-fetch/redraw.
        state.windRoseSummaryFigure[section] = {
          id: item.id,
          figure: JSON.parse(JSON.stringify(figure)),
        };
      }
    }
    // After all figure-style helpers: move the label onto the HTML card badge.
    blankPlotlyTitleForHtmlCardBadge(figure, item.id || "");
    const isGafLightning = item.id === "lightning_heatmap" && isGafLightningFigure(figure);
    const lockLightningHourlyPlot = isGafLightning
      || (item.id === "lightning_heatmap" && shouldUseHourlyLightningHeatmap(section));
    const paintChart = () => {
      if (isViewTransitionActive()) {
        host.style.visibility = "hidden";
      }
    return Plotly.react(host, figure.data || [], figure.layout || {}, {
      displayModeBar: false,
      responsive: !lockLightningHourlyPlot,
    }).then(() => {
      return applyHostErrorBars(host)
        .then(() => rebuildStackErrorBarOverlays(host))
        .then(() => rebuildStrictValueErrorBarOverlays(host))
        .then(() => finishStrictValueErrorBarOverlays(host))
        .then(() => {
          if (isMaximized && item.id === "hourly_precip") {
            return Promise.resolve();
          }
          return calibrateCanonicalPlotGeometry(host);
        })
        .then(() => {
          if (isMaximized && item.id === "hourly_precip") {
            return Promise.resolve();
          }
          return applyResponsiveAxisRange(host);
        })
        .then(() => {
      renderExternalLegend(host, legend, item.figure, section, item.id);
      const maybeSync = item.id === "cloud_distribution" ? syncFogWindHoverTemplate(host) : Promise.resolve();
      const isWindRosePanel = item.id === "wind_rose" && windRoseToolbarSections().has(section);
      const isScatterWindDewpt = item.id === "scatter_wind_dewpt";
      return maybeSync.then(() => fitMobileChartAroundLegend(host)).then(() => {
        if (isWindRosePanel) {
          if (host.dataset.windRoseSwapped === "1") {
            return ensureWindRoseCalmLayerOrder(host);
          }
          return scheduleHostResize(host).then(() => ensureWindRoseCalmLayerOrder(host));
        }
        if (isScatterWindDewpt) {
          return relayoutScatterWindDewptAxes(host, targetChartHeight);
        }
        if (item.id === "lightning_heatmap") {
          if (isGafLightningFigure(item.figure)) {
            return Promise.resolve();
          }
          const meta = item.figure?.layout?.meta || {};
          const activeScaleRef = shouldUseHourlyLightningHeatmap(section)
            ? ensureLightningHourlyScale(icao, season)
            : state.lightningHeatmapScaleRef;
          const scale = activeScaleRef || {
            zmin: Number(host?.data?.[0]?.zmin) || Number(meta.lightningZmin) || 0,
            zmax: Number(host?.data?.[0]?.zmax) || Number(meta.lightningZmax) || 1,
          };
          const enterOverlay = shouldUseHourlyLightningHeatmap(section) && !isMaximized;
          return finalizeLightningHeatmapPostRender(host, scale, {
            icao,
            captureSummary: state.lhMode === "summary" && supportsLightningHeatmapHourly(icao),
            pinHourly: false,
            deferRingsToOverlay: enterOverlay,
          }).then(() => {
            if (enterOverlay) {
              return enterLightningHourlyOverlayCurrent(host);
            }
            return undefined;
          });
        }
        if (isTopoMapFigure(item.id)) {
          return scheduleHostResize(host);
        }
        return scheduleHostResize(host);
      });
      });
    }).catch((error) => {
      logChartRenderWarning(item.id, error);
    });
    };
    if (isWindRoseFigure && windRoseHostCanSwapBasemap(host)) {
      if (isViewTransitionActive()) {
        host.style.visibility = "hidden";
      }
      return swapPaintedWindRoseInPlace(host, figure, icao).then((swapped) => {
        if (!swapped) {
          clearWindRoseSwapMark(host);
          return paintChart();
        }
        renderExternalLegend(host, legend, figure, section, item.id);
        return ensureWindRoseCalmLayerOrder(host).then(() => {
          deferWindRoseCalmDomHover(host);
        });
      });
    }
    clearWindRoseSwapMark(host);
    return paintChart();
    }).catch((error) => {
      logChartRenderWarning(item.id, error);
    }).finally(() => {
      reportChartComplete();
    });
  });

  if (Number.isInteger(state.maximizedChartIndex) && state.maximizedChartIndex >= visibleFigures.length) {
    state.maximizedChartIndex = null;
  }

  await Promise.all(renderPromises);

  for (let i = visibleFigures.length; i < els.charts.length; i += 1) {
    clearChart(i);
  }

  applyMaximizedChartState();
  updateChartToolbars(section);
  syncMobileChartSelect(section);
  applyMobileChartVisibility();
  syncControlsPlacementForViewport();
  syncLegendPlacementForViewport();
  // Toolbars / legends can change the settled shell height after the first
  // Plotly.react. Re-pin CSS heights, then sync any host whose Plotly layout
  // is still taller (gale month labels were clipping under overflow:hidden).
  applyChartShellHeights(section);
    await awaitLayoutSettle();
  if (isMobileViewport()) {
    await resizeVisibleMobileChart();
  }

  if (Number.isInteger(state.maximizedChartIndex) && state.maximizedChartIndex < visibleFigures.length) {
    const maximizedHost = els.charts[state.maximizedChartIndex];
    if (maximizedHost.dataset?.figureId === "hourly_precip") {
      const chartHeight = Number.parseFloat(maximizedHost.style.height) || null;
      await finalizeHourlyPrecipMaximizedLayout(maximizedHost, chartHeight);
    } else if (!(
      maximizedHost.dataset?.figureId === "lightning_heatmap"
      && (isLightningGafZoom() || isGafLightningFigure({ layout: maximizedHost.layout }))
    )) {
      await refreshMaximizedChartLayout(maximizedHost);
    }
  }

  const gafLightningIndex = visibleFigures.findIndex((item) => item.id === "lightning_heatmap");
  if (gafLightningIndex >= 0 && isLightningGafZoom()) {
    await awaitLayoutSettle();
    let sealed = await sealGafLightningHost(els.charts[gafLightningIndex]);
    if (!sealed) {
      // Mid-reflow abort — one more settle pass before leaving unsealed.
      await awaitLayoutSettle();
      sealed = await sealGafLightningHost(els.charts[gafLightningIndex]);
    }
  }

  const windRoseIndex = visibleFigures.findIndex((item) => item.id === "wind_rose");
  if (windRoseIndex >= 0 && windRoseToolbarSections().has(section)) {
    const windRoseHost = els.charts[windRoseIndex];
    // A basemap swap keeps the previous plot size. Tab changes reuse that
    // graph, so a taller Wind card was left with the short Overview rose.
    if (hostBoxMatchesLayout(windRoseHost)) {
      await ensureWindRoseCalmLayerOrder(windRoseHost);
      deferWindRoseCalmDomHover(windRoseHost);
    } else {
    await scheduleWindRoseResize(windRoseHost);
    await ensureWindRoseCalmLayerOrder(windRoseHost);
    deferWindRoseCalmDomHover(windRoseHost);
  }
  }

  await Promise.all(visibleFigures.map((item, idx) => {
    const host = els.charts[idx];
    if (!host || item.id === "wind_rose") {
      return Promise.resolve();
    }
    if (
      item.id === "lightning_heatmap"
      && (isLightningGafZoom() || isGafLightningFigure({ layout: host.layout }))
    ) {
      return Promise.resolve();
    }
    if (hostBoxMatchesLayout(host)) {
      return Promise.resolve();
    }
    return scheduleHostResize(host, { mode: "resize" });
  }));

  if (state.compareEnabled && Number.isInteger(state.maximizedChartIndex)) {
    await refreshCompareMode();
  }

  els.charts.forEach((host) => {
    if (host) {
      host.style.visibility = "";
    }
  });
}

async function drawCharts(figures, section = state.displayedSection, onProgress) {
  return renderChartsToDom(figures, section, onProgress);
}

let hasShownInitialLoading = false;
let fetchDebounceTimer = null;
let chartContainerResizeObserversInitialized = false;
const DRIVER_FETCH_DEBOUNCE_MS = 320;

const TOPO_MAP_PANEL = {
  margin: { l: 36, r: 36, t: 48, b: 22 },
  plotDomain: { x: [0.08, 0.92], y: [0.06, 0.94] },
  backgroundScale: 1.1,
  backgroundOpacity: 0.7,
};

// Desktop: colorbar sits right of the plot. Mobile: horizontal colorbar below,
// so right margin collapses and bottom margin grows.
const LIGHTNING_HEATMAP_MARGIN_R = 64;
const LIGHTNING_HEATMAP_MARGIN_R_MOBILE = 4;
const LIGHTNING_HEATMAP_MARGIN_B_MOBILE = 50;

function isMaximizedSingleWindRose() {
  if (isMobileViewport() || !Number.isInteger(state.maximizedChartIndex)) {
    return false;
  }
  if (typeof isCompareDualPanelActive === "function" && isCompareDualPanelActive()) {
    return false;
  }
  const idx = state.maximizedChartIndex;
  return state.latestFigures[idx]?.id === "wind_rose"
    || els.charts[idx]?.dataset?.figureId === "wind_rose";
}

function getTopoMapPanelSpec(figureId = "") {
  if (isMobileViewport()) {
    return {
      margin: { l: 4, r: 4, t: 8, b: 18 },
      plotDomain: { x: [0.01, 0.99], y: [0.01, 0.99] },
      backgroundScale: TOPO_MAP_PANEL.backgroundScale,
      backgroundOpacity: TOPO_MAP_PANEL.backgroundOpacity,
    };
  }
  // Maximized single Wind Rose: fill more of the host (square still height-limited).
  if (figureId === "wind_rose" && isMaximizedSingleWindRose()) {
    return {
      margin: { l: 20, r: 20, t: 18, b: 12 },
      plotDomain: { x: [0.02, 0.98], y: [0.02, 0.98] },
      backgroundScale: TOPO_MAP_PANEL.backgroundScale,
      backgroundOpacity: TOPO_MAP_PANEL.backgroundOpacity,
    };
  }
  // Non-maximized Wind Rose. Overview uses a wider fill; Wind tab is a taller
  // single-row panel so keep the rose slightly smaller. margin.t clears the
  // absolute hour scroller overlaying the top-right of the card.
  if (figureId === "wind_rose") {
    if (state.displayedSection === "wind") {
      return {
        margin: { l: 28, r: 28, t: 54, b: 32 },
        plotDomain: { x: [0.08, 0.92], y: [0.10, 0.90] },
        backgroundScale: TOPO_MAP_PANEL.backgroundScale,
        backgroundOpacity: TOPO_MAP_PANEL.backgroundOpacity,
      };
    }
    return {
      margin: { l: 20, r: 20, t: 50, b: 18 },
      plotDomain: { x: [0.03, 0.97], y: [0.05, 0.95] },
      backgroundScale: TOPO_MAP_PANEL.backgroundScale,
      backgroundOpacity: TOPO_MAP_PANEL.backgroundOpacity,
    };
  }
  return {
    margin: { ...TOPO_MAP_PANEL.margin },
    plotDomain: {
      x: TOPO_MAP_PANEL.plotDomain.x.slice(),
      y: TOPO_MAP_PANEL.plotDomain.y.slice(),
    },
    backgroundScale: TOPO_MAP_PANEL.backgroundScale,
    backgroundOpacity: TOPO_MAP_PANEL.backgroundOpacity,
  };
}

function getLightningHeatmapMarginR() {
  return isMobileViewport() ? LIGHTNING_HEATMAP_MARGIN_R_MOBILE : LIGHTNING_HEATMAP_MARGIN_R;
}

function getLightningHeatmapMarginB(baseB = TOPO_MAP_PANEL.margin.b) {
  return isMobileViewport() ? LIGHTNING_HEATMAP_MARGIN_B_MOBILE : baseB;
}

const POLAR_TOPO_FIGURE_IDS = new Set([
  "wind_rose",
  "precip_split",
  "cloud_distribution",
  "radial_scatter_dust",
]);

const topoMapFigureIds = new Set([
  ...POLAR_TOPO_FIGURE_IDS,
  "lightning_heatmap",
]);

const POLAR_BACKGROUND_SCALE = TOPO_MAP_PANEL.backgroundScale;
const POLAR_BACKGROUND_OPACITY = TOPO_MAP_PANEL.backgroundOpacity;
const CARTESIAN_TOPO_OPACITY = TOPO_MAP_PANEL.backgroundOpacity;
const LIGHTNING_HEATMAP_COLORSCALE = [
  [0, "rgba(0,0,0,0)"],
  [0.15, "rgba(255,210,170,0.28)"],
  [0.35, "rgba(255,130,60,0.52)"],
  [0.55, "rgba(240,60,0,0.72)"],
  [0.75, "rgba(220,20,0,0.86)"],
  [1, "rgba(170,0,0,0.95)"],
];
const LIGHTNING_HEATMAP_RADIUS_KM = 30;
const LIGHTNING_HEATMAP_EXTENT_KM = 60;
const LIGHTNING_HEATMAP_GRID = 48;
const LIGHTNING_HEATMAP_COLOR_PERCENTILE = 95;
// In hourly mode the raw range made cells read as near-saturated. Doubling the
// upper limit stretches the colour ramp so typical hourly counts sit lower on the
// scale with more headroom toward the peak.
const LIGHTNING_HOURLY_SCALE_HEADROOM = 2;
const LIGHTNING_HEATMAP_OPACITY = 0.5;
// National hourly is 386×791. Above this, scrubbing uses a canvas blit.
const NATIONAL_LIGHTNING_CANVAS_CELL_THRESHOLD = 40000;
const LIGHTNING_HEATMAP_RING_RADII_KM = [8, 16];
const TOPO_ZOOM_LEVEL = 9;
const TOPO_CROP_PX = 512;
const EARTH_RADIUS_M = 6378137;
function isTopoMapFigure(figureId = "") {
  return topoMapFigureIds.has(figureId);
}

function isPolarTopoFigureId(figureId = "") {
  return POLAR_TOPO_FIGURE_IDS.has(figureId);
}

function applyTopoMapPanelLayout(figure, figureId = "", options = {}) {
  if (!figure?.layout || !isTopoMapFigure(figureId)) {
    return;
  }

  const { chartHeight = null } = options;
  const panel = getTopoMapPanelSpec(figureId);
  figure.layout.margin = { ...panel.margin };
  if (chartHeight != null) {
    figure.layout.height = chartHeight;
  }
  delete figure.layout.width;

  const domainX = panel.plotDomain.x.slice();
  const domainY = panel.plotDomain.y.slice();

  if (figureId === "lightning_heatmap") {
    figure.layout.margin.r = getLightningHeatmapMarginR();
    figure.layout.margin.b = getLightningHeatmapMarginB(panel.margin.b);
    const isGaf = isGafLightningFigure(figure);
    const bbox = Array.isArray(figure.layout?.meta?.gafBbox) ? figure.layout.meta.gafBbox : null;
    const plotWidth = Number(figure.layout.width) || Number(options.plotWidth) || 360;
    const plotHeight = Number(chartHeight) || Number(figure.layout.height) || 360;
    const mapDomains = isGaf && bbox
      ? computeGafLightningMapDomains(bbox, plotWidth, plotHeight)
      : { x: domainX, y: domainY };
    figure.layout.xaxis = {
      ...(figure.layout.xaxis || {}),
      domain: mapDomains.x,
      automargin: false,
      fixedrange: true,
    };
    figure.layout.yaxis = {
      ...(figure.layout.yaxis || {}),
      domain: mapDomains.y,
      automargin: false,
      fixedrange: true,
    };
    if (isGaf) {
      // Aspect is encoded in the domain; scaleanchor letterboxing lets scatter
      // overlays paint into empty gutters around the basemap.
      delete figure.layout.xaxis.scaleanchor;
      delete figure.layout.xaxis.scaleratio;
      delete figure.layout.xaxis.constrain;
    } else {
      figure.layout.xaxis.scaleanchor = "y";
      figure.layout.xaxis.scaleratio = 1;
      figure.layout.xaxis.constrain = "domain";
      enforceLightningHeatmapTopoAxis(figure);
    }
    const trace = (figure.data || []).find((entry) => String(entry?.type || "").toLowerCase() === "heatmap");
    if (trace) {
      trace.colorbar = lightningHeatmapColorbar(trace.colorbar || {});
    }
    if (isMobileViewport()) {
      figure.layout.title = { text: "" };
    }
    return;
  }

  figure.layout.polar = {
    ...(figure.layout.polar || {}),
    bgcolor: figure.layout.polar?.bgcolor || "rgba(0,0,0,0)",
    domain: { x: domainX, y: domainY },
  };
}

function buildTopoMapPanelRelayout(host) {
  const figureId = host?.dataset?.figureId || "";
  if (!isTopoMapFigure(figureId)) {
    return {};
  }

  const panel = getTopoMapPanelSpec(figureId);
  const domainX = panel.plotDomain.x.slice();
  const domainY = panel.plotDomain.y.slice();
  const relayout = {
    "margin.l": panel.margin.l,
    "margin.r": panel.margin.r,
    "margin.t": panel.margin.t,
    "margin.b": panel.margin.b,
  };

  if (figureId === "lightning_heatmap") {
    const lightningMargin = hostIsCompareDualPanelHost(host)
      ? COMPARE_LIGHTNING_PANEL_MARGIN
      : null;
    Object.assign(relayout, {
      "margin.r": lightningMargin ? lightningMargin.r : getLightningHeatmapMarginR(),
      "margin.b": lightningMargin ? lightningMargin.b : getLightningHeatmapMarginB(panel.margin.b),
      "margin.l": lightningMargin ? lightningMargin.l : panel.margin.l,
      "margin.t": lightningMargin ? lightningMargin.t : panel.margin.t,
      "xaxis.domain": domainX,
      "yaxis.domain": domainY,
    });
    const meta = host?.layout?.meta || {};
    if (String(meta.lightningView || "") === "gaf") {
      const bbox = Array.isArray(meta.gafBbox) ? meta.gafBbox : null;
      const width = Math.round(host.layout?.width || host.offsetWidth || host.clientWidth || 0);
      const height = Math.round(host.layout?.height || host.offsetHeight || host.clientHeight || 0);
      if (bbox && width > 0 && height > 0) {
        const mapDomains = computeGafLightningMapDomains(bbox, width, height, {
          comparePanel: Boolean(lightningMargin),
          margin: lightningMargin,
        });
        relayout["xaxis.domain"] = mapDomains.x;
        relayout["yaxis.domain"] = mapDomains.y;
      }
      relayout["xaxis.scaleanchor"] = null;
      relayout["xaxis.scaleratio"] = null;
      relayout["xaxis.constrain"] = null;
      if (bbox && bbox.length === 4) {
        relayout["xaxis.range"] = [bbox[2], bbox[3]];
        relayout["yaxis.range"] = [bbox[0], bbox[1]];
        relayout["xaxis.autorange"] = false;
        relayout["yaxis.autorange"] = false;
      }
      return relayout;
    }
    const halfExtent = Number(meta.topoExtentKm) / 2;
    if (Number.isFinite(halfExtent) && halfExtent > 0) {
      relayout["xaxis.range"] = [-halfExtent, halfExtent];
      relayout["yaxis.range"] = [-halfExtent, halfExtent];
      relayout["xaxis.autorange"] = false;
      relayout["yaxis.autorange"] = false;
      relayout["xaxis.title"] = { text: "" };
      relayout["yaxis.title"] = { text: "" };
      relayout["xaxis.showgrid"] = false;
      relayout["yaxis.showgrid"] = false;
      relayout["xaxis.zeroline"] = false;
      relayout["yaxis.zeroline"] = false;
      relayout["xaxis.showline"] = false;
      relayout["yaxis.showline"] = false;
      relayout["xaxis.ticks"] = "";
      relayout["yaxis.ticks"] = "";
      relayout["xaxis.showticklabels"] = false;
      relayout["yaxis.showticklabels"] = false;
      relayout["xaxis.tickmode"] = "array";
      relayout["xaxis.tickvals"] = [0];
      relayout["xaxis.ticktext"] = [""];
      relayout["yaxis.tickmode"] = "array";
      relayout["yaxis.tickvals"] = [0];
      relayout["yaxis.ticktext"] = [""];
    }
    return relayout;
  }

  relayout["polar.domain.x"] = domainX;
  relayout["polar.domain.y"] = domainY;
  return relayout;
}

function appendAlignedPolarImagePatch(host, patch) {
  if (!host?.layout?.polar || !Array.isArray(host.layout.images) || !host.layout.images.length) {
    return patch;
  }
  if (patch["polar.domain.x"] || patch["polar.domain.y"]) {
    const domain = host.layout.polar.domain || {};
    host.layout.polar.domain = {
      x: patch["polar.domain.x"] || domain.x,
      y: patch["polar.domain.y"] || domain.y,
    };
  }
  if (Number(patch.width) > 40) {
    host.layout.width = patch.width;
  }
  if (Number(patch.height) > 40) {
    host.layout.height = patch.height;
  }
  if (host.layout.margin) {
    ["l", "r", "t", "b"].forEach((side) => {
      if (patch[`margin.${side}`] != null) {
        host.layout.margin[side] = patch[`margin.${side}`];
      }
    });
  }
  alignPolarBackgroundImages({ layout: host.layout }, TOPO_MAP_PANEL.backgroundScale);
  host.layout.images.forEach((image, index) => {
    patch[`images[${index}].x`] = image.x;
    patch[`images[${index}].y`] = image.y;
    patch[`images[${index}].sizex`] = image.sizex;
    patch[`images[${index}].sizey`] = image.sizey;
  });
  return patch;
}

function relayoutTopoMapPanel(host) {
  const patch = buildTopoMapPanelRelayout(host);
  if (!host || !Object.keys(patch).length) {
    return Promise.resolve();
  }

  // Domain and basemap move together. A second relayout left the image in the
  // old place for a frame.
  appendAlignedPolarImagePatch(host, patch);
  return Plotly.relayout(host, patch);
}

function suppressMobileFigureTitle(figure) {
  if (!figure?.layout || !isMobileViewport()) {
    return;
  }
  figure.layout.title = { text: "" };
  // Reclaim top chrome that was reserved for the in-figure title.
  if (figure.layout.margin && Number(figure.layout.margin.t) > 12) {
    figure.layout.margin = {
      ...figure.layout.margin,
      t: Math.min(Number(figure.layout.margin.t) || 12, 12),
    };
  }
}

function lightningHeatmapColorbar(extra = {}) {
  // Shared formatting wins over any prior colorbar fields so aerodrome / GAF /
  // region legends stay visually identical (scale values are set separately).
  // No "Strike count" title — the chart dropdown already names this figure.
  if (isMobileViewport()) {
    const colorbar = {
      ...extra,
      orientation: "h",
      title: { text: "" },
      x: 0.5,
      xanchor: "center",
      y: 0.02,
      yanchor: "bottom",
      len: 0.92,
      lenmode: "fraction",
      thickness: 12,
      thicknessmode: "pixels",
      xpad: 0,
      ypad: 0,
      outlinewidth: 1,
      outlinecolor: "rgb(68, 68, 68)",
    };
    delete colorbar.tickmode;
    delete colorbar.dtick;
    delete colorbar.tick0;
    return colorbar;
  }

  const colorbar = {
    ...extra,
    orientation: "v",
    title: { text: "" },
    x: 1.02,
    xanchor: "left",
    len: 0.75,
    lenmode: "fraction",
    y: 0.5,
    yanchor: "middle",
    thickness: 18,
    xpad: 0,
    ypad: 0,
    outlinewidth: 1,
    outlinecolor: "rgb(68, 68, 68)",
  };
  // Drop aerodrome-only tick forcing so Plotly auto-formats like GAF/region.
  delete colorbar.tickmode;
  delete colorbar.dtick;
  delete colorbar.tick0;
  return colorbar;
}

function lightningHeatmapColorRange(zGrid, { percentile = LIGHTNING_HEATMAP_COLOR_PERCENTILE } = {}) {
  const positives = [];
  (zGrid || []).forEach((row) => {
    (Array.isArray(row) ? row : [row]).forEach((value) => {
      const numeric = Number(value);
      if (Number.isFinite(numeric) && numeric > 0) {
        positives.push(numeric);
      }
    });
  });
  if (!positives.length) {
    return { zmin: 0, zmax: 1 };
  }

  positives.sort((a, b) => a - b);
  const zmin = positives[0];
  const zpeak = positives[positives.length - 1];
  const rank = Math.min(
    positives.length - 1,
    Math.max(0, Math.ceil((percentile / 100) * positives.length) - 1),
  );
  let zmax = positives[rank];
  zmax = Math.max(zmin + 1, Math.min(zmax, zpeak));
  if (zmax >= zpeak * 0.98) {
    zmax = zpeak;
  }
  return { zmin, zmax };
}

function lightningHeatmapGeometry(meta = {}) {
  const radiusKm = Number(meta.lightningRadiusKm) > 0 ? Number(meta.lightningRadiusKm) : LIGHTNING_HEATMAP_RADIUS_KM;
  const extentKm = Number(meta.lightningExtentKm) > 0 ? Number(meta.lightningExtentKm) : LIGHTNING_HEATMAP_EXTENT_KM;
  const grid = LIGHTNING_HEATMAP_GRID;
  const half = extentKm / 2;
  const cellSize = extentKm / grid;
  const halfCell = cellSize / 2;
  const centers = Array.from({ length: grid }, (_, idx) => -half + (idx + 0.5) * cellSize);
  return { radiusKm, extentKm, grid, half, cellSize, halfCell, centers };
}

function cellIntersectsLightningDisk(xc, yc, halfCell, radiusKm) {
  const dx = Math.max(Math.abs(xc) - halfCell, 0);
  const dy = Math.max(Math.abs(yc) - halfCell, 0);
  return Math.hypot(dx, dy) <= radiusKm + 1e-6;
}

function oldHeatmapCellValue(oldX, oldY, oldZ, xc, yc, tolerance) {
  for (let j = 0; j < oldY.length; j += 1) {
    if (Math.abs(Number(oldY[j]) - yc) > tolerance) {
      continue;
    }
    const row = Array.isArray(oldZ[j]) ? oldZ[j] : [oldZ[j]];
    for (let i = 0; i < oldX.length; i += 1) {
      if (Math.abs(Number(oldX[i]) - xc) > tolerance) {
        continue;
      }
      const value = Number(row[i]);
      return Number.isFinite(value) && value > 0 ? value : null;
    }
  }
  return null;
}

function normalizeLightningHeatmapTrace(trace, figure) {
  const meta = figure?.layout?.meta || {};
  const geom = lightningHeatmapGeometry(meta);
  const oldX = (trace.x || []).map(Number);
  const oldY = (trace.y || []).map(Number);
  const oldZ = trace.z || [];
  const oldCellSize = oldX.length >= 2 ? Math.abs(oldX[1] - oldX[0]) : geom.cellSize;
  const tolerance = oldCellSize / 2 + 1e-3;

  trace.x = [...geom.centers];
  trace.y = [...geom.centers];
  trace.z = geom.centers.map((yc) => geom.centers.map((xc) => {
    if (!cellIntersectsLightningDisk(xc, yc, geom.halfCell, geom.radiusKm)) {
      return null;
    }
    return oldHeatmapCellValue(oldX, oldY, oldZ, xc, yc, tolerance);
  }));
  return geom;
}

function applyLightningHeatmapStyle(figure, { icao = "", season = "all", fixedScale = null } = {}) {
  const trace = (figure?.data || []).find((entry) => String(entry?.type || "").toLowerCase() === "heatmap");
  if (!trace || !Array.isArray(trace.z)) {
    return null;
  }

  const geom = normalizeLightningHeatmapTrace(trace, figure);

  let zmax = 0;
  trace.z = trace.z.map((row) => {
    const values = Array.isArray(row) ? row : [row];
    return values.map((value) => {
      const numeric = Number(value);
      if (!Number.isFinite(numeric) || numeric <= 0) {
        return null;
      }
      zmax = Math.max(zmax, numeric);
      return numeric;
    });
  });

  const { zmin: computedZmin, zmax: computedZmax } = lightningHeatmapColorRange(trace.z);
  const metaZmin = Number(figure?.layout?.meta?.lightningZmin);
  const metaZmax = Number(figure?.layout?.meta?.lightningZmax);
  let resolvedZmin = computedZmin > 0 ? computedZmin : (Number.isFinite(metaZmin) ? metaZmin : 0);
  let resolvedZmax = computedZmax > 1 ? computedZmax : (Number.isFinite(metaZmax) && metaZmax > 0 ? metaZmax : 1);
  if (fixedScale && Number.isFinite(Number(fixedScale.zmax)) && Number(fixedScale.zmax) > 0) {
    resolvedZmin = Number(fixedScale.zmin) || 0;
    resolvedZmax = Number(fixedScale.zmax);
  }
  if (!zmax && resolvedZmax > 0) {
    zmax = resolvedZmax;
  }
  if (!zmax) {
    zmax = 1;
  }

  trace.zmin = resolvedZmin;
  trace.zmax = resolvedZmax;
  trace.zauto = false;
  trace.showscale = true;
  trace.hoverongaps = false;
  trace.colorscale = LIGHTNING_HEATMAP_COLORSCALE;
  trace.opacity = LIGHTNING_HEATMAP_OPACITY;
  // Match GAF/region colorbar chrome (thickness, padding, auto tick formatting).
  trace.colorbar = lightningHeatmapColorbar(trace.colorbar || {});

  figure.layout = figure.layout || {};
  if (isMobileViewport() || shouldUseHtmlCardFigureTitle()) {
    // Mobile: no title. Desktop: HTML card badge owns the label.
    if (shouldUseHtmlCardFigureTitle() && !isCompareIcaoOnlyTitle(figure.layout.title)) {
      rememberFigureDisplayTitle("lightning_heatmap", figure.layout.title?.text
        ? figure.layout.title
        : { text: "Lightning Strike Frequency" });
    }
    figure.layout.title = { text: "" };
  } else {
    const priorTitle = figure.layout.title;
    figure.layout.title = {
      ...(typeof priorTitle === "object" && priorTitle ? priorTitle : {}),
      text: "Lightning Strike Frequency",
      font: { size: 14, ...((typeof priorTitle === "object" && priorTitle?.font) || {}) },
      x: 0.01,
      xanchor: "left",
      y: 0.98,
      yanchor: "top",
    };
  }
  const scaleToken = fixedScale
    ? String(Math.round(resolvedZmax))
    : `${String(Math.round(resolvedZmin))}-${String(Math.round(resolvedZmax))}`;
  figure.layout.uirevision = [
    "lightning",
    String(icao || "").trim().toUpperCase(),
    String(season || "all"),
    fixedScale ? "hourly" : "summary",
    String(Math.round(geom.radiusKm)),
    scaleToken,
  ].join("::");

  applyLightningHeatmapRingOverlays(figure);

  return { zmin: resolvedZmin, zmax: resolvedZmax };
}

function enforceLightningHeatmapTopoAxis(figure) {
  const meta = figure?.layout?.meta || {};
  const displayExtentKm = Number(meta.topoExtentKm);
  if (!Number.isFinite(displayExtentKm) || displayExtentKm <= 0) {
    return;
  }

  const halfExtent = displayExtentKm / 2;
  figure.layout = figure.layout || {};
  figure.layout.xaxis = {
    ...(figure.layout.xaxis || {}),
    title: { text: "" },
    range: [-halfExtent, halfExtent],
    scaleanchor: "y",
    scaleratio: 1,
    autorange: false,
    showgrid: false,
    zeroline: false,
    showline: false,
    ticks: "",
    showticklabels: false,
    tickmode: "array",
    tickvals: [0],
    ticktext: [""],
  };
  figure.layout.yaxis = {
    ...(figure.layout.yaxis || {}),
    title: { text: "" },
    range: [-halfExtent, halfExtent],
    autorange: false,
    showgrid: false,
    zeroline: false,
    showline: false,
    ticks: "",
    showticklabels: false,
    tickmode: "array",
    tickvals: [0],
    ticktext: [""],
  };
}

function restyleLightningHeatmapScale(host, { zmin = 0, zmax = 1 } = {}) {
  const indices = lightningHeatmapTraceIndices(host);
  if (!indices.length) {
    return Promise.resolve();
  }
  const comparePanel = hostIsCompareDualPanelHost(host);
  if (indices.length >= 2) {
    const dataIndex = indices[0];
    const chromeIndex = indices[indices.length - 1];
    const resolvedMin = Number(zmin) || 0;
    const resolvedMax = Math.max(resolvedMin + 1, Number(zmax) || 1);
    const dataPatch = {
      zmin: [resolvedMin],
      zmax: [resolvedMax],
      zauto: [false],
      colorscale: [LIGHTNING_HEATMAP_COLORSCALE],
      showscale: [false],
    };
    return Promise.all([
      Plotly.restyle(host, dataPatch, [dataIndex]),
      Plotly.restyle(
        host,
        lightningHeatmapRestylePatch(null, { zmin: resolvedMin, zmax: resolvedMax }, { comparePanel }),
        [chromeIndex],
      ),
    ]);
  }
  return Plotly.restyle(
    host,
    lightningHeatmapRestylePatch(null, { zmin, zmax }, { comparePanel }),
    [indices[0]],
  );
}

function isWindRoseCalmTrace(trace) {
  return trace?.type === "scatterpolar" && String(trace?.name || "") === "Calm";
}

function windRoseTraceHoverFill(trace) {
  const raw = trace?.fillcolor || trace?.marker?.color || trace?.line?.color || "#fafcff";
  const rgbaMatch = String(raw).match(/rgba?\(([^)]+)\)/i);
  if (!rgbaMatch) {
    return String(raw);
  }
  const parts = rgbaMatch[1].split(",").map((part) => part.trim());
  if (parts.length < 3) {
    return String(raw);
  }
  const base = parts.slice(0, 3).map((part) => Number.parseFloat(part));
  if (base.some((channel) => !Number.isFinite(channel))) {
    return String(raw);
  }
  const alpha = parts.length >= 4 ? Number.parseFloat(parts[3]) : 1;
  if (!Number.isFinite(alpha)) {
    return String(raw);
  }
  const blend = (channel) => Math.round(channel * alpha + 255 * (1 - alpha));
  return `rgb(${blend(base[0])}, ${blend(base[1])}, ${blend(base[2])})`;
}

const WIND_ROSE_HOVER_LABEL_STROKE = "rgb(68, 68, 68)";
const WIND_ROSE_HOVER_LABEL_TEXT = "rgb(68, 68, 68)";

function windRoseHoverLabelFont(host) {
  const font = host?._fullLayout?.hoverlabel?.font || {};
  return {
    family: font.family || "Arial, sans-serif",
    size: Number(font.size) || 13,
  };
}

function clientToPlotSvgPoint(host, clientX, clientY) {
  const svg = host.querySelector(".main-svg") || host.querySelector("svg");
  if (!svg?.createSVGPoint || typeof svg.getScreenCTM !== "function") {
    return { x: clientX, y: clientY };
  }
  const ctm = svg.getScreenCTM();
  if (!ctm) {
    return { x: clientX, y: clientY };
  }
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const local = point.matrixTransform(ctm.inverse());
  return { x: local.x, y: local.y };
}

function clearWindRoseCalmHoverLayer(host) {
  host?.querySelector('.hoverlayer [data-wind-rose-calm-hover="true"]')?.remove();
}

function buildWindRoseCalmHoverPath(textBBox, lineCount, fontSize) {
  const x0 = textBBox.x - 3;
  const y0 = textBBox.y - 3;
  const lineHeight = fontSize * 1.3;
  const contentHeight = lineCount <= 1
    ? fontSize
    : fontSize + lineHeight * (lineCount - 1);
  const x1 = textBBox.x + textBBox.width + 3;
  const y1 = textBBox.y + Math.max(textBBox.height, contentHeight) + 3;
  const height = y1 - 6;
  const width = x1 - 6;
  return `M0,0L6,6v${height}h${width}v${y0 - y1}H6V${y0}Z`;
}

function buildWindRoseCalmHoverGroup(host, calmTrace, calmPct) {
  const font = windRoseHoverLabelFont(host);
  const fill = windRoseTraceHoverFill(calmTrace);
  const lines = [
    "Speed: Calm",
    `Frequency: ${Number(calmPct).toFixed(2)}%`,
  ];
  const ns = "http://www.w3.org/2000/svg";
  const g = document.createElementNS(ns, "g");
  g.classList.add("hovertext");
  g.setAttribute("data-wind-rose-calm-hover", "true");
  g.setAttribute("pointer-events", "none");

  const text = document.createElementNS(ns, "text");
  text.classList.add("nums");
  text.setAttribute("text-anchor", "start");
  text.setAttribute("data-notex", "1");
  text.style.fontFamily = font.family;
  text.style.fontSize = `${font.size}px`;
  text.style.fontWeight = "normal";
  text.style.fontStyle = "normal";
  text.style.fontVariant = "normal";
  text.style.fill = WIND_ROSE_HOVER_LABEL_TEXT;
  text.style.whiteSpace = "pre";

  const textX = 9;
  const textY = -12.4;
  text.setAttribute("x", String(textX));
  text.setAttribute("y", String(textY));
  lines.forEach((line, index) => {
    const tspan = document.createElementNS(ns, "tspan");
    tspan.classList.add("line");
    tspan.textContent = line;
    tspan.setAttribute("x", String(textX));
    tspan.setAttribute("y", String(textY));
    tspan.setAttribute("dy", index === 0 ? "0em" : "1.3em");
    text.appendChild(tspan);
  });
  g.appendChild(text);

  const hoverLayer = host.querySelector(".hoverlayer");
  if (!hoverLayer) {
    return null;
  }
  hoverLayer.appendChild(g);
  const textBBox = text.getBBox();
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", buildWindRoseCalmHoverPath(textBBox, lines.length, font.size));
  path.style.fill = fill;
  path.style.stroke = WIND_ROSE_HOVER_LABEL_STROKE;
  path.style.strokeWidth = "1px";
  g.insertBefore(path, text);
  return g;
}

function windRoseCalmPct(trace) {
  const rVals = numericArray(trace?.r);
  if (rVals.length) {
    return Math.max(...rVals);
  }
  const metaPct = Number(trace?.meta?.calmPct);
  return Number.isFinite(metaPct) ? metaPct : null;
}

const WIND_ROSE_CALM_ZORDER = 10;
const WIND_ROSE_PETAL_ZORDER = 0;
let windRoseCalmMaskSerial = 0;

function windRoseCalmMaskId(host) {
  if (!host) {
    return "wind-rose-calm-bar-mask";
  }
  if (!host.dataset.calmMaskId) {
    windRoseCalmMaskSerial += 1;
    host.dataset.calmMaskId = `wind-rose-calm-bar-mask-${windRoseCalmMaskSerial}`;
  }
  return host.dataset.calmMaskId;
}

function applyWindRoseCalmVisualTrace(trace) {
  if (!trace) {
    return;
  }
  trace.showlegend = true;
  trace.zorder = WIND_ROSE_CALM_ZORDER;
  trace.hoverinfo = "skip";
  delete trace.hoveron;
  delete trace.hovertemplate;
  delete trace.hoverlabel;
  delete trace.text;
  delete trace.marker;
  delete trace.customdata;
}

function normalizeWindRoseCalmTrace(figure) {
  const data = figure?.data;
  if (!Array.isArray(data)) {
    return;
  }

  data.forEach((trace) => {
    if (trace?.type === "barpolar") {
      trace.zorder = WIND_ROSE_PETAL_ZORDER;
    }
  });

  const calmIndex = data.findIndex((trace) => isWindRoseCalmTrace(trace));
  if (calmIndex < 0) {
    return;
  }

  applyWindRoseCalmVisualTrace(data[calmIndex]);
  if (calmIndex !== data.length - 1) {
    const [calmTrace] = data.splice(calmIndex, 1);
    data.push(calmTrace);
  }
}

const windRoseCalmDomHoverState = new WeakMap();

function windRoseCalmVisualTrace(host) {
  return (host?.data || []).find((trace) => isWindRoseCalmTrace(trace));
}

function hideWindRoseCalmDomTooltip(host) {
  clearWindRoseCalmHoverLayer(host);
}

function showWindRoseCalmDomTooltip(host, clientX, clientY, calmTrace, calmPct) {
  const pctKey = Number(calmPct).toFixed(2);
  let hoverGroup = host.querySelector('.hoverlayer [data-wind-rose-calm-hover="true"]');
  if (!hoverGroup || hoverGroup.dataset.calmPct !== pctKey) {
    if (typeof Plotly?.Fx?.unhover === "function") {
      Plotly.Fx.unhover(host);
    }
    clearWindRoseCalmHoverLayer(host);
    hoverGroup = buildWindRoseCalmHoverGroup(host, calmTrace, calmPct);
    if (hoverGroup) {
      hoverGroup.dataset.calmPct = pctKey;
    }
  }
  if (!hoverGroup) {
    return;
  }
  const anchor = clientToPlotSvgPoint(host, clientX, clientY);
  hoverGroup.setAttribute("transform", `translate(${anchor.x},${anchor.y})`);
}

function teardownWindRoseCalmDomHover(host) {
  const state = windRoseCalmDomHoverState.get(host);
  if (!state) {
    clearWindRoseCalmBarMask(host);
    return;
  }
  host.removeEventListener("mousemove", state.onMouseMove);
  host.removeEventListener("mouseleave", state.onMouseLeave);
  host.off?.("plotly_afterplot", state.onAfterPlot);
  host.off?.("plotly_relayout", state.onAfterPlot);
  host.off?.("plotly_hover", state.onPlotlyHover);
  clearWindRoseCalmHoverLayer(host);
  clearWindRoseCalmBarMask(host);
  windRoseCalmDomHoverState.delete(host);
}

function ensureWindRoseCalmDomHover(host) {
  if (!host?.dataset || host.dataset.figureId !== "wind_rose") {
    return;
  }

  const calmTrace = windRoseCalmVisualTrace(host);
  if (!calmTrace || !isTraceVisible(calmTrace)) {
    teardownWindRoseCalmDomHover(host);
    return;
  }
  const calmPct = windRoseCalmPct(calmTrace);
  if (!Number.isFinite(calmPct) || calmPct <= 0) {
    teardownWindRoseCalmDomHover(host);
    return;
  }

  let state = windRoseCalmDomHoverState.get(host);
  if (!state) {
    const onMouseMove = (event) => {
      const liveCalmTrace = windRoseCalmVisualTrace(host);
      const liveCalmPct = windRoseCalmPct(liveCalmTrace);
      if (!liveCalmTrace || !Number.isFinite(liveCalmPct) || liveCalmPct <= 0) {
        hideWindRoseCalmDomTooltip(host);
        return;
      }
      if (!isPointerInsideWindRoseCalmDisc(host, event.clientX, event.clientY)) {
        hideWindRoseCalmDomTooltip(host);
        return;
      }
      showWindRoseCalmDomTooltip(host, event.clientX, event.clientY, liveCalmTrace, liveCalmPct);
    };
    const onMouseLeave = () => hideWindRoseCalmDomTooltip(host);
    const onAfterPlot = () => {
      hideWindRoseCalmDomTooltip(host);
      ensureWindRoseCalmBarMask(host);
    };
    const onPlotlyHover = (event) => {
      const points = event?.points || [];
      if (points.some((pt) => pt?.data?.type === "barpolar")) {
        hideWindRoseCalmDomTooltip(host);
      }
    };

    host.addEventListener("mousemove", onMouseMove, { passive: true });
    host.addEventListener("mouseleave", onMouseLeave, { passive: true });
    host.on?.("plotly_afterplot", onAfterPlot);
    host.on?.("plotly_relayout", onAfterPlot);
    host.on?.("plotly_hover", onPlotlyHover);
    state = { onMouseMove, onMouseLeave, onAfterPlot, onPlotlyHover };
    windRoseCalmDomHoverState.set(host, state);
  }
}

function deferWindRoseCalmDomHover(host) {
  if (!host) {
    return;
  }
  window.setTimeout(() => ensureWindRoseCalmDomHover(host), 0);
}

function windRoseCalmDiscGeometry(host) {
  const calmTrace = windRoseCalmVisualTrace(host);
  const calmPct = windRoseCalmPct(calmTrace);
  if (!calmTrace || !isTraceVisible(calmTrace) || !Number.isFinite(calmPct) || calmPct <= 0) {
    return null;
  }

  const polar = host?._fullLayout?.polar;
  const subplot = polar?._subplot;
  if (!subplot || !Number.isFinite(subplot.cx) || !Number.isFinite(subplot.cy)) {
    return null;
  }

  const plotRadius = Number(subplot.r);
  if (!Number.isFinite(plotRadius) || plotRadius <= 0) {
    return null;
  }

  const range = polar?.radialaxis?.range || [0, 35];
  const span = Math.max((Number(range[1]) || 35) - (Number(range[0]) || 0), 0.001);
  const dataRatio = Math.max(0, Math.min(calmPct / span, 1));
  const holeRadius = plotRadius * dataRatio;
  if (!Number.isFinite(holeRadius) || holeRadius <= 0) {
    return null;
  }

  return {
    cx: subplot.cx,
    cy: subplot.cy,
    r: holeRadius,
  };
}

function windRoseCalmSubplotRadius(host) {
  return windRoseCalmDiscGeometry(host);
}

function refreshWindRoseCalmBarMask(host) {
  if (!host?.dataset || host.dataset.figureId !== "wind_rose") {
    return Promise.resolve();
  }
  const calmTrace = windRoseCalmVisualTrace(host);
  if (!calmTrace || !isTraceVisible(calmTrace)) {
    clearWindRoseCalmBarMask(host);
    return Promise.resolve();
  }
  return scheduleWindRoseResize(host).then(() => {
    ensureWindRoseCalmBarMask(host);
  });
}

function syncWindRoseCalmMaskOnly(host) {
  if (!host || host.dataset?.figureId !== "wind_rose") {
    return;
  }
  const calmTrace = windRoseCalmVisualTrace(host);
  if (!calmTrace || !isTraceVisible(calmTrace)) {
    clearWindRoseCalmBarMask(host);
    return;
  }
  ensureWindRoseCalmBarMask(host);
}

function clearWindRoseCalmBarMask(host) {
  host?.querySelector(".barlayer")?.removeAttribute("mask");
}

function ensureWindRoseCalmBarMask(host) {
  if (!host?.querySelector(".barlayer")) {
    return;
  }

  const calmDisc = windRoseCalmSubplotRadius(host);
  if (!calmDisc) {
    clearWindRoseCalmBarMask(host);
    return;
  }

  const svg = host.querySelector(".main-svg") || host.querySelector("svg");
  const barlayer = host.querySelector(".barlayer");
  if (!svg || !barlayer) {
    return;
  }

  const ns = "http://www.w3.org/2000/svg";
  let defs = svg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS(ns, "defs");
    svg.insertBefore(defs, svg.firstChild);
  }

  const maskId = windRoseCalmMaskId(host);
  let mask = defs.querySelector(`[id="${maskId}"]`);
  if (!mask) {
    mask = document.createElementNS(ns, "mask");
    mask.setAttribute("id", maskId);
    mask.setAttribute("maskUnits", "userSpaceOnUse");
    defs.appendChild(mask);
  }

  while (mask.firstChild) {
    mask.removeChild(mask.firstChild);
  }

  const width = Number(svg.getAttribute("width")) || svg.clientWidth || 800;
  const height = Number(svg.getAttribute("height")) || svg.clientHeight || 600;
  const backdrop = document.createElementNS(ns, "rect");
  backdrop.setAttribute("x", "0");
  backdrop.setAttribute("y", "0");
  backdrop.setAttribute("width", String(width));
  backdrop.setAttribute("height", String(height));
  backdrop.setAttribute("fill", "white");

  const hole = document.createElementNS(ns, "circle");
  hole.setAttribute("cx", String(calmDisc.cx));
  hole.setAttribute("cy", String(calmDisc.cy));
  hole.setAttribute("r", String(calmDisc.r));
  hole.setAttribute("fill", "black");

  mask.appendChild(backdrop);
  mask.appendChild(hole);
  barlayer.setAttribute("mask", `url(#${maskId})`);
}

function ensureWindRoseCalmLayerOrder(host) {
  if (!host?.data?.length || typeof Plotly?.restyle !== "function") {
    const calmTrace = windRoseCalmVisualTrace(host);
    if (!calmTrace || !isTraceVisible(calmTrace)) {
      clearWindRoseCalmBarMask(host);
    } else {
      ensureWindRoseCalmBarMask(host);
    }
    return Promise.resolve();
  }

  const calmIndex = host.data.findIndex((trace) => isWindRoseCalmTrace(trace));
  if (calmIndex < 0) {
    clearWindRoseCalmBarMask(host);
    return Promise.resolve();
  }

  const calmTrace = host.data[calmIndex];
  if (!isTraceVisible(calmTrace)) {
    clearWindRoseCalmBarMask(host);
    return Promise.resolve();
  }

  const barIndices = host.data
    .map((trace, index) => (trace?.type === "barpolar" ? index : -1))
    .filter((index) => index >= 0);
  const lastIndex = host.data.length - 1;
  const ops = [];

  if (calmIndex !== lastIndex && typeof Plotly.moveTraces === "function") {
    ops.push(Promise.resolve(Plotly.moveTraces(host, calmIndex, lastIndex)));
  }

  const liveCalmIndex = () => host.data.findIndex((trace) => isWindRoseCalmTrace(trace));
  const calmVisible = calmTrace.visible ?? true;
  ops.push(
    Promise.resolve(Plotly.restyle(host, {
      visible: calmVisible,
      zorder: WIND_ROSE_CALM_ZORDER,
    }, [liveCalmIndex()])),
  );

  if (barIndices.length) {
    ops.push(Promise.resolve(Plotly.restyle(host, {
      zorder: barIndices.map(() => WIND_ROSE_PETAL_ZORDER),
    }, barIndices)));
  }

  return Promise.all(ops)
    .then(() => {
      ensureWindRoseCalmBarMask(host);
    })
    .catch(() => {
      clearWindRoseCalmBarMask(host);
      return undefined;
    });
}

function windRosePolarScreenMetrics(host) {
  const fullLayout = host?._fullLayout || host?.layout;
  const polar = fullLayout?.polar;
  if (!polar) {
    return null;
  }

  const range = polar.radialaxis?.range || [0, 35];
  const r0 = Number(range[0]) || 0;
  const r1 = Number(range[1]) || 35;
  const span = Math.max(r1 - r0, 0.001);

  const mainSvg = host.querySelector(".main-svg") || host.querySelector("svg.main-svg") || host.querySelector("svg");
  const subplot = polar._subplot;
  if (
    Number.isFinite(subplot?.cx)
    && Number.isFinite(subplot?.cy)
    && Number.isFinite(subplot?.r)
    && mainSvg
  ) {
    const ctm = mainSvg.getScreenCTM?.();
    if (ctm && typeof mainSvg.createSVGPoint === "function") {
      const point = mainSvg.createSVGPoint();
      point.x = subplot.cx;
      point.y = subplot.cy;
      const center = point.matrixTransform(ctm);
      const edge = mainSvg.createSVGPoint();
      edge.x = subplot.cx + subplot.r;
      edge.y = subplot.cy;
      const edgeScreen = edge.matrixTransform(ctm);
      return {
        cx: center.x,
        cy: center.y,
        plotRadiusPx: Math.hypot(edgeScreen.x - center.x, edgeScreen.y - center.y),
        span,
      };
    }
  }

  const hostRect = host?.getBoundingClientRect?.();
  if (!hostRect?.width || !hostRect?.height) {
    return null;
  }

  const margin = fullLayout.margin || {};
  const marginLeft = Number(margin.l) || 0;
  const marginRight = Number(margin.r) || 0;
  const marginTop = Number(margin.t) || 0;
  const marginBottom = Number(margin.b) || 0;
  const plotWidth = Math.max(hostRect.width - marginLeft - marginRight, 1);
  const plotHeight = Math.max(hostRect.height - marginTop - marginBottom, 1);

  const domain = polar.domain || TOPO_MAP_PANEL.plotDomain;
  const domainX = Array.isArray(domain.x) ? domain.x : TOPO_MAP_PANEL.plotDomain.x;
  const domainY = Array.isArray(domain.y) ? domain.y : TOPO_MAP_PANEL.plotDomain.y;
  const domainWidth = Math.max(Number(domainX[1]) - Number(domainX[0]), 0.001);
  const domainHeight = Math.max(Number(domainY[1]) - Number(domainY[0]), 0.001);
  const cx = hostRect.left + marginLeft + ((Number(domainX[0]) + Number(domainX[1])) / 2) * plotWidth;
  const cy = hostRect.top + marginTop + (1 - ((Number(domainY[0]) + Number(domainY[1])) / 2)) * plotHeight;
  const plotRadiusPx = Math.min(domainWidth * plotWidth, domainHeight * plotHeight) / 2;

  return { cx, cy, plotRadiusPx, span };
}

function windRoseCalmDiscRadiusPx(host) {
  const calmTrace = (host?.data || []).find((trace) => isWindRoseCalmTrace(trace));
  if (!calmTrace || !isTraceVisible(calmTrace)) {
    return null;
  }
  const calmPct = windRoseCalmPct(calmTrace);
  if (!Number.isFinite(calmPct) || calmPct <= 0) {
    return null;
  }

  const polarMetrics = windRosePolarScreenMetrics(host);
  if (!polarMetrics) {
    return null;
  }

  return Math.max((calmPct / polarMetrics.span) * polarMetrics.plotRadiusPx, 2);
}

function isPointerInsideWindRoseCalmDisc(host, clientX, clientY) {
  const radiusPx = windRoseCalmDiscRadiusPx(host);
  const polar = windRosePolarScreenMetrics(host);
  if (!radiusPx || !polar || !Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    return false;
  }
  return Math.hypot(clientX - polar.cx, clientY - polar.cy) <= radiusPx;
}

function windRoseRadialMax(figure) {
  const sumsByTheta = new Map();
  (figure?.data || []).forEach((trace) => {
    if (trace?.type !== "barpolar") {
      return;
    }
    const rVals = numericArray(trace?.r);
    const thetaVals = numericArray(trace?.theta);
    const count = Math.min(rVals.length, thetaVals.length);
    for (let i = 0; i < count; i += 1) {
      const thetaKey = String(thetaVals[i]);
      sumsByTheta.set(thetaKey, (sumsByTheta.get(thetaKey) || 0) + rVals[i]);
    }
  });

  let max = 0;
  sumsByTheta.forEach((sum) => {
    max = Math.max(max, sum);
  });
  return max;
}

function windRoseRadialRange(maxValue) {
  const max = Number(maxValue);
  if (!Number.isFinite(max) || max <= 0) {
    return [0, 10];
  }
  const headroom = max * 1.12;
  if (headroom <= 10) {
    return [0, Math.ceil(headroom)];
  }
  if (headroom <= 25) {
    return [0, Math.ceil(headroom / 2) * 2];
  }
  return [0, Math.ceil(headroom / 5) * 5];
}

function extractWindRoseLayoutSnapshot(figure, section, chartHeight = null) {
  const radialMax = windRoseRadialMax(figure);
  const panel = getTopoMapPanelSpec("wind_rose");

  return {
    margin: { ...panel.margin },
    height: chartHeight ?? figure?.layout?.height,
    polarDomain: {
      x: panel.plotDomain.x.slice(),
      y: panel.plotDomain.y.slice(),
    },
    radialRange: windRoseRadialRange(radialMax),
    radialMax,
  };
}

function applyWindRoseRadialLayout(figure, fixedRange = null) {
  if (!figure?.layout?.polar) {
    return;
  }

  const radialRange = Array.isArray(fixedRange) && fixedRange.length === 2
    ? [...fixedRange]
    : windRoseRadialRange(windRoseRadialMax(figure));
  figure.layout.polar = {
    ...(figure.layout.polar || {}),
    radialaxis: {
      ...(figure.layout.polar?.radialaxis || {}),
      autorange: false,
      range: [...radialRange],
    },
    angularaxis: {
      ...(figure.layout.polar?.angularaxis || {}),
      direction: figure.layout.polar?.angularaxis?.direction || "clockwise",
      period: figure.layout.polar?.angularaxis?.period ?? 360,
    },
  };
}

function applyWindRoseLayout(figure, section, snapshot = null) {
  if (!figure?.layout) {
    return;
  }

  delete figure.layout.width;
  if (snapshot?.height != null) {
    figure.layout.height = snapshot.height;
  }
  applyWindRoseRadialLayout(figure, snapshot?.radialRange || null);
  // Maximized single rose: title lives on the card (top-left). Keep Plotly empty
  // so the plot can grow without a duplicate label.
  if (isMaximizedSingleWindRose()) {
    if (figure.layout.title && !isCompareIcaoOnlyTitle(figure.layout.title)) {
      rememberFigureDisplayTitle("wind_rose", figure.layout.title);
    }
    figure.layout.title = { text: "" };
    return;
  }
  // Restore title if a prior maximized pass blanked it.
  const rawTitleText = typeof figure.layout.title === "object" && figure.layout.title
    ? String(figure.layout.title.text || "").trim()
    : String(figure.layout.title || "").trim();
  if (!rawTitleText) {
    figure.layout.title = resolvePrimaryFigureTitle(
      "wind_rose",
      infoFigureDetails.wind_rose?.title || "Wind Rose",
    ) || { text: "Wind Rose" };
  }
  // Same container anchor as the other chart titles (x=0.01, y=0.98).
  // A fixed pixel drop was divided by a short layout height, then scaled to the
  // real container, so the wind rose title sat below neighbouring titles.
  if (figure.layout.title && !isCompareIcaoOnlyTitle(figure.layout.title)) {
    const title = typeof figure.layout.title === "object" && figure.layout.title
      ? figure.layout.title
      : { text: figure.layout.title };
    figure.layout.title = {
      ...title,
      x: 0.01,
      y: 0.98,
      xanchor: "left",
      yanchor: "top",
      xref: "container",
      yref: "container",
    };
  }
}

function syncChartCardFigureTitle(card, {
  show = false,
  text = "",
} = {}) {
  if (!card) {
    return;
  }
  let titleEl = card.querySelector(".chart-card-figure-title");
  if (!titleEl) {
    titleEl = document.createElement("div");
    titleEl.className = "chart-card-figure-title";
    titleEl.setAttribute("aria-hidden", "true");
    card.insertBefore(titleEl, card.firstChild);
  }
  if (text) {
    titleEl.textContent = text;
  }
  titleEl.classList.toggle("is-visible", Boolean(show));
}

// Keep the old name as an alias for maximized wind-rose call sites.
function syncWindRoseCardTitle(card, options = {}) {
  return syncChartCardFigureTitle(card, options);
}

function shouldUseHtmlCardFigureTitle() {
  return !isMobileViewport();
}

function resolveCardFigureTitleText(figureId = "", figure = null) {
  const remembered = resolvePrimaryFigureTitle(figureId, figure?.layout?.title);
  if (typeof remembered === "string" && remembered.trim()) {
    return remembered.trim();
  }
  if (remembered && typeof remembered === "object") {
    const text = String(remembered.text || "").trim();
    if (text && !isCompareIcaoOnlyTitle(remembered)) {
      return text;
    }
  }
  const infoTitle = String(infoFigureDetails[figureId]?.title || "").trim();
  if (infoTitle) {
    return infoTitle;
  }
  const raw = figure?.layout?.title;
  if (typeof raw === "string") {
    return raw.trim();
  }
  if (raw && typeof raw === "object") {
    const text = String(raw.text || "").trim();
    if (text && !isCompareIcaoOnlyTitle(raw)) {
      return text;
    }
  }
  return "";
}

function blankPlotlyTitleForHtmlCardBadge(figure, figureId = "") {
  if (!shouldUseHtmlCardFigureTitle() || !figure?.layout) {
    return;
  }
  // Dual-panel compare uses ICAO Plotly titles on each panel — leave those alone.
  if (isCompareIcaoOnlyTitle(figure.layout.title)) {
    return;
  }
  if (figure.layout.title) {
    rememberFigureDisplayTitle(figureId, figure.layout.title);
  }
  // Title lives on the HTML card badge; keep Plotly empty so the plot can use
  // the top of the paper without a plain duplicate label.
  figure.layout.title = { text: "" };
}

function isWindRoseChartHost(host) {
  return host?.dataset?.figureId === "wind_rose";
}

function airportTopoUrl(icao) {
  return withLiteDataVersion(`data-lite/${icao}/topo.png`);
}

async function loadAirportTopo(icao) {
  const code = String(icao || "").trim().toUpperCase();
  if (!code) {
    throw new Error("Missing ICAO for topo load");
  }
  // Version the cache key so regenerated topo.png is not stuck behind an old
  // Plotly-inlined data URL after LITE_DATA_VERSION bumps.
  const cacheKey = `${code}::${LITE_DATA_VERSION}`;
  if (airportTopoCache.has(cacheKey)) {
    return airportTopoCache.get(cacheKey);
  }

  const url = airportTopoUrl(code);
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Topo not found for ${code}`);
  }

  // Inline as a data URL so Plotly cannot keep a stale SVG <image> from a
  // previous same-path topo fetch (immutable /data-lite caching).
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const dataUrl = `data:image/png;base64,${btoa(binary)}`;
  airportTopoCache.set(cacheKey, dataUrl);
  return dataUrl;
}

function alignPolarBackgroundImages(figure, scale = POLAR_BACKGROUND_SCALE) {
  const polar = figure?.layout?.polar;
  const layoutImages = figure?.layout?.images;
  if (!polar || !Array.isArray(layoutImages) || !layoutImages.length) {
    return;
  }

  const domain = polar.domain || {};
  const domainX = Array.isArray(domain.x) ? domain.x : [0, 1];
  const domainY = Array.isArray(domain.y) ? domain.y : [0, 1];
  const x0 = Number(domainX[0]) || 0;
  const x1 = Number(domainX[1]) || 1;
  const y0 = Number(domainY[0]) || 0;
  const y1 = Number(domainY[1]) || 1;
  const centerX = (x0 + x1) / 2;
  const centerY = (y0 + y1) / 2;
  // Paper-fraction sizing (matches production). A pixel-square correction made
  // the 4-panel overview rose look tiny with large empty gutters.
  const sizeX = (x1 - x0) * scale;
  const sizeY = (y1 - y0) * scale;

  figure.layout.images = layoutImages.map((image) => ({
    ...image,
    x: centerX,
    y: centerY,
    xanchor: image.xanchor || "center",
    yanchor: image.yanchor || "middle",
    sizex: sizeX,
    sizey: sizeY,
  }));
}

function injectPolarBackground(
  figure,
  source,
  { opacity = POLAR_BACKGROUND_OPACITY, scale = POLAR_BACKGROUND_SCALE } = {},
) {
  if (!figure?.layout?.polar || !source) {
    return;
  }

  figure.layout = figure.layout || {};
  figure.layout.images = [
    {
      source,
      xref: "paper",
      yref: "paper",
      x: 0.5,
      y: 0.5,
      sizex: scale,
      sizey: scale,
      xanchor: "center",
      yanchor: "middle",
      sizing: "contain",
      layer: "below",
      opacity,
    },
  ];
  alignPolarBackgroundImages(figure, scale);
}

function polarFigureHasTopoImage(figure) {
  const images = figure?.layout?.images;
  return Array.isArray(images) && images.some((image) => {
    const source = image?.source;
    return typeof source === "string" && source.length > 0;
  });
}

async function preparePolarTerrainBackground(figure, icao) {
  if (!figure?.layout?.polar) {
    return;
  }

  if (state.liteMode) {
    figure.layout.images = (figure.layout.images || []).filter(
      (image) => !(image?.xref === "paper" && image?.yref === "paper"),
    );
  }

  if (!polarFigureHasTopoImage(figure)) {
    try {
      const topoUrl = await loadAirportTopo(icao);
      injectPolarBackground(figure, topoUrl);
      return;
    } catch (error) {
      console.warn(`Failed to load airport topo for ${icao}:`, error);
    }
  }

  alignPolarBackgroundImages(figure);
}

function topoCropExtentKmFromLat(latDeg, cropPx = TOPO_CROP_PX, zoom = TOPO_ZOOM_LEVEL) {
  const latRad = (Number(latDeg) || 0) * (Math.PI / 180);
  const metersPerPixel = Math.cos(latRad) * 2 * Math.PI * EARTH_RADIUS_M / (256 * (2 ** zoom));
  return (cropPx * metersPerPixel) / 1000;
}

function cartesianFigureHasTopoImage(figure) {
  const images = figure?.layout?.images;
  return Array.isArray(images) && images.some((image) => {
    return image?.xref === "x" && image?.yref === "y" && typeof image?.source === "string" && image.source.length > 0;
  });
}

function injectCartesianTopoBackground(figure, source, extentKm, { opacity = CARTESIAN_TOPO_OPACITY } = {}) {
  if (!figure?.layout || !source || !Number.isFinite(extentKm) || extentKm <= 0) {
    return;
  }

  const existing = Array.isArray(figure.layout.images) ? figure.layout.images : [];
  const overlays = existing.filter((image) => image?.xref !== "x" || image?.yref !== "y");
  figure.layout.images = [
    {
      source,
      xref: "x",
      yref: "y",
      x: 0,
      y: 0,
      sizex: extentKm,
      sizey: extentKm,
      xanchor: "center",
      yanchor: "middle",
      sizing: "stretch",
      layer: "below",
      opacity,
    },
    ...overlays,
  ];
}

async function prepareCartesianTopoBackground(figure, icao, axisExtentKm = 24, { opacity = CARTESIAN_TOPO_OPACITY } = {}) {
  if (!figure?.layout?.xaxis && !figure?.layout?.yaxis) {
    return;
  }

  if (state.liteMode) {
    figure.layout.images = (figure.layout.images || []).filter(
      (image) => !(image?.xref === "x" && image?.yref === "y"),
    );
  }

  const meta = figure.layout.meta || {};
  const cropExtentKm = Number(meta.topoCropExtentKm) || topoCropExtentKmFromLat(meta.airportLat);
  const displayExtentKm = Number(meta.topoExtentKm) || Number(axisExtentKm) || 24;

  if (!cartesianFigureHasTopoImage(figure)) {
    try {
      const topoUrl = await loadAirportTopo(icao);
      injectCartesianTopoBackground(figure, topoUrl, cropExtentKm, { opacity });
    } catch (error) {
      console.warn(`Failed to load cartesian topo for ${icao}:`, error);
      return;
    }
  }

  const halfExtent = displayExtentKm / 2;
  figure.layout.xaxis = {
    ...(figure.layout.xaxis || {}),
    title: { text: "" },
    range: [-halfExtent, halfExtent],
    scaleanchor: "y",
    scaleratio: 1,
    autorange: false,
    showgrid: false,
    zeroline: false,
    showline: false,
    ticks: "",
    showticklabels: false,
    tickmode: "array",
    tickvals: [0],
    ticktext: [""],
  };
  figure.layout.yaxis = {
    ...(figure.layout.yaxis || {}),
    title: { text: "" },
    range: [-halfExtent, halfExtent],
    autorange: false,
    showgrid: false,
    zeroline: false,
    showline: false,
    ticks: "",
    showticklabels: false,
    tickmode: "array",
    tickvals: [0],
    ticktext: [""],
  };
}

async function prepareChartTerrainBackground(figure, icao, figureId = "") {
  if (!isPolarTopoFigureId(figureId) && figureId !== "lightning_heatmap") {
    return;
  }
  if (figureId === "lightning_heatmap") {
    if (isGafLightningFigure(figure)) {
      return;
    }
    const extentKm = Number(figure?.layout?.meta?.topoExtentKm) || 24;
    return prepareCartesianTopoBackground(figure, icao, extentKm, { opacity: TOPO_MAP_PANEL.backgroundOpacity });
  }
  return preparePolarTerrainBackground(figure, icao);
}

function windRoseToolbarSections() {
  return new Set(["overview", "wind"]);
}

function shouldUseHourlyWindRose(section = state.requestedSection) {
  return windRoseToolbarSections().has(section) && state.wrMode === "hourly";
}

function resetDefaultLegendTraceVisibility(figure, figureId = "") {
  const defaults = defaultLegendTraceVisibilityByFigure[figureId] || {};
  (figure?.data || []).forEach((trace) => {
    const name = String(trace?.name || "").trim();
    if (!name || trace?.showlegend === false) {
      return;
    }
    trace.visible = Object.hasOwn(defaults, name) ? defaults[name] : true;
  });
}

function cloneFigurePayloadForRender(item) {
  if (!item?.figure) {
    return item;
  }
  const clone = JSON.parse(JSON.stringify(item));
  normalizeThunderLegendLabels(clone.figure, item.id);
  resetDefaultLegendTraceVisibility(clone.figure, item.id);
  return clone;
}

function chartLegendVisibilityKey(figureId = "") {
  return [
    els.icao?.value || "",
    figureId,
  ].join("::");
}

function clearChartLegendVisibility() {
  state.chartLegendVisibility = {};
}

function getStoredChartLegendVisibility(figureId = "") {
  if (!figureId) {
    return null;
  }
  return state.chartLegendVisibility[chartLegendVisibilityKey(figureId)] || null;
}

function captureChartLegendVisibilityFromHost(host, figureId = "") {
  if (!figureId) {
    return;
  }
  const values = {};
  (host?.data || []).forEach((trace) => {
    const name = String(trace?.name || "").trim();
    if (!name) {
      return;
    }
    values[name] = trace.visible ?? true;
  });
  if (!Object.keys(values).length) {
    return;
  }
  state.chartLegendVisibility[chartLegendVisibilityKey(figureId)] = values;
}

function applyChartLegendVisibilityToFigure(figure, figureId = "") {
  const stored = getStoredChartLegendVisibility(figureId);
  if (!stored) {
    return;
  }
  (figure?.data || []).forEach((trace) => {
    const name = String(trace?.name || "").trim();
    if (!name) {
      return;
    }
    if (Object.hasOwn(stored, name)) {
      trace.visible = stored[name];
      return;
    }
    if (thunderLegendFigureIds.has(figureId) && name === THUNDER_LEGEND_LABEL) {
      const thunderVisibility = getStoredThunderLegendVisibility(stored);
      if (thunderVisibility !== undefined) {
        trace.visible = thunderVisibility;
      }
    }
  });
}

function applyWindRoseHourParams(params, figureIds) {
  if (!figureIds.includes("wind_rose") || !shouldUseHourlyWindRose()) {
    return params;
  }
  const hour = String(els.wrHourScroller?.value ?? "0");
  params.set("hourStart", hour);
  params.set("hourEnd", hour);
  params.set("invertHour", "false");
  return params;
}

async function applyHourlyWindRoseOverride(data, icao, season, section = state.requestedSection) {
  if (!shouldUseHourlyWindRose(section) || !data?.figures?.length) {
    return data;
  }

  const hour = els.wrHourScroller?.value ?? "0";
  try {
    const hDataMap = await fetchJsonCached(liteWindRoseHourlyUrl(icao));
    const primaryIcao = String(els.icao?.value || "").trim().toUpperCase();
    // Only pin the primary ICAO pack on playback — compare loads must not
    // overwrite the map used by the main hourly slider.
    if (String(icao || "").trim().toUpperCase() === primaryIcao) {
    windRosePlayback.liteHourlyMap = hDataMap;
      windRosePlayback.liteHourlyIcao = primaryIcao;
    }
    const hResult = lookupLiteWindRoseHourlyPayload(hDataMap, season, hour);
    if (!hResult?.figures?.length) {
      return data;
    }

    const wrFig = hResult.figures.find((figure) => figure.id === "wind_rose");
    if (!wrFig) {
      return data;
    }

    const dailyWrFig = data.figures.find((figure) => figure.id === "wind_rose");
    const idx = data.figures.findIndex((figure) => figure.id === "wind_rose");
    const hourlyWrFig = JSON.parse(JSON.stringify(wrFig));
    const isPrimaryIcao = String(icao || "").trim().toUpperCase() === primaryIcao;
    if (dailyWrFig?.figure && isPrimaryIcao) {
      state.windRoseLayoutRef[section] = extractWindRoseLayoutSnapshot(dailyWrFig.figure, section);
    }
    const layoutSnapshot = isPrimaryIcao
      ? state.windRoseLayoutRef[section]
      : {
          ...(state.windRoseLayoutRef[section] || {}),
          // Compare: prefer all-hours locks so a single hour never owns the scale.
          radialRange: resolveComparePanelWindRoseRadialRange(
            state.windRoseHourlyScaleRef || state.windRoseLayoutRef[section]?.radialRange,
            state.windRoseCompareHourlyScaleRef,
          ) || state.windRoseLayoutRef[section]?.radialRange,
        };
    applyWindRoseLayout(hourlyWrFig.figure, section, layoutSnapshot);
    if (idx >= 0) {
      data.figures[idx] = hourlyWrFig;
    } else {
      data.figures.push(hourlyWrFig);
    }
  } catch (err) {
    console.warn("Failed to load hourly wind rose:", err);
  }

  return data;
}

async function fetchWindRoseDailySnapshot(section, signal) {
  if (!windRoseToolbarSections().has(section)) {
    return;
  }

  const params = getParams();
  params.set("figureIds", "wind_rose");
  params.set("hourStart", "0");
  params.set("hourEnd", "23");
  params.set("invertHour", "false");
  params.set("includeMetrics", "false");

  try {
    const response = await fetch(apiUrl(`/api/charts?${params.toString()}`), { signal });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    const windRoseFigure = data?.figures?.find((item) => item.id === "wind_rose");
    if (windRoseFigure?.figure) {
      state.windRoseLayoutRef[section] = extractWindRoseLayoutSnapshot(windRoseFigure.figure, section);
    }
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.warn("Failed to load daily wind rose layout snapshot:", error);
    }
  }
}

function initializeChartContainerResizeObservers() {
  if (chartContainerResizeObserversInitialized || typeof ResizeObserver === "undefined") {
    return;
  }

  const lastSizes = new WeakMap();
  const observer = new ResizeObserver((entries) => {
    if (!state.latestFigures.length) {
      return;
    }

    entries.forEach((entry) => {
      if (isViewTransitionActive()) {
        return;
      }
      const card = entry.target;
      const host = card.querySelector(".chart");
      if (!host || card.classList.contains("hidden")) {
        return;
      }

      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      const prev = lastSizes.get(card);
      if (prev && Math.abs(prev.width - width) <= 2 && Math.abs(prev.height - height) <= 2) {
        lastSizes.set(card, { width, height });
        return;
      }

      lastSizes.set(card, { width, height });

      const cardIndex = chartUi.findIndex((ui) => ui.card === card);
      if (cardIndex >= 0
        && cardIndex === state.maximizedChartIndex
        && isCompareDualPanelActive()) {
        // Card observer only sees the primary .chart; size both panels together.
        // Skip mid-scrub — ResizeObserver fires from Plotly restyles and would flicker.
        if (!isCompareSettleBlocked()) {
          // A matching wind rose is already at the slot size. Another pass
          // redraws the primary basemap after Compare has just opened.
          if (host.dataset?.figureId === "wind_rose" && !windRoseHostNeedsResize(host)) {
            return;
          }
          // Coalesce into the settle queue — never force delay 0 over a pending retry.
          scheduleComparePairSizePass(50);
        }
        return;
      }

      if (host.dataset?.figureId === "lightning_heatmap"
        && (isLightningGafZoom() || isGafLightningFigure({ layout: host.layout }))) {
        if (
          lightningPlayback.frameUpdating
          || lightningPlayback.sliderScrubbing
          || isViewTransitionActive()
        ) {
          // Own seals happen at the end of zoom/maximize/fetch transitions.
          // Sealing from mid-reflow ResizeObserver pins an undersized map.
          return;
        }
        scheduleGafLightningSeal(host);
        return;
      }
      if (shouldSkipLightningHourlyTopoRelayout(host)) {
        return;
      }
      if (host.dataset?.figureId === "lightning_heatmap" && shouldUseHourlyLightningHeatmap()) {
        // One size commit already includes the topo domain. A second relayout
        // after it is the local-map jump. Clear base rings before re-entering
        // the overlay so resize cannot stack a second pair underneath.
        scheduleHostResize(host, { mode: "resize" })
          .then(() => awaitLayoutSettle())
          .then(async () => {
            await clearLightningRingShapesOnHost(host);
            await deleteLightningRingTracesOnHost(host);
            return enterLightningHourlyOverlayCurrent(host);
          });
        return;
      }
      if (isWindRoseChartHost(host)) {
        const hostW = Math.round(host.offsetWidth || 0);
        const hostH = Math.round(host.offsetHeight || 0);
        const seenW = Number(host.dataset.windRoseSeenW) || 0;
        const seenH = Number(host.dataset.windRoseSeenH) || 0;
        host.dataset.windRoseSeenW = String(hostW);
        host.dataset.windRoseSeenH = String(hostH);
        // Toolbar chrome can change the card without changing the plot box.
        // Resizing then realigning the basemap is the one-frame jump.
        if (host.dataset.windRoseSwapped === "1" || !seenW || !seenH) {
          return;
        }
        if (Math.abs(seenW - hostW) <= 1 && Math.abs(seenH - hostH) <= 1) {
          return;
        }
        scheduleWindRoseResize(host);
        return;
      }
      if (isTopoMapFigure(host.dataset?.figureId || "")) {
        scheduleHostResize(host, { mode: "resize" });
        return;
      }
      if (host.dataset?.figureId === "scatter_wind_dewpt") {
        relayoutScatterWindDewptAxes(host);
        return;
      }
      if (usesDualAxisPairedBarOverlays(host)) {
        scheduleHostResize(host, { mode: "resize" });
        return;
      }
      scheduleHostResize(host);
    });
  });

  chartUi.forEach(({ card }) => {
    observer.observe(card);
  });

  chartContainerResizeObserversInitialized = true;
}

function scheduleFetchCharts(delayMs = 0) {
  if (fetchDebounceTimer) {
    clearTimeout(fetchDebounceTimer);
    fetchDebounceTimer = null;
  }

  if (delayMs <= 0) {
    fetchCharts();
    return;
  }

  fetchDebounceTimer = setTimeout(() => {
    fetchDebounceTimer = null;
    fetchCharts();
  }, delayMs);
}

async function fetchChartsLite() {
  return runViewTransition({
    message: "Fetching static data...",
    prepare: () => {
      stopWindRosePlayback();
      stopLightningPlayback();
      clearChartAxisLocks();
    },
    load: async ({ reportFetchProgress }) => {
      const icao = els.icao.value;
      const section = state.requestedSection;
      const season = els.season.value;
      const sectionChanging = state.displayedSection !== section;

      if (sectionChanging) {
        resetWindRoseModeOnSectionChange(section);
        resetLightningHeatmapModeOnSectionChange(section);
      }

      let data = await assembleLiteFigures(icao, section, season, reportFetchProgress);

      if (!data?.figures?.length) {
        const manifestAirports = liteManifestAirports();
        const inManifest = manifestAirports.includes(String(icao || "").trim().toUpperCase());
        if (!inManifest) {
          data = { figures: [], metrics: {}, error: `Airport ${icao} is not in the lite manifest.` };
        } else {
          data = { figures: [], metrics: {} };
        }
      }

      if (shouldUseHourlyWindRose(section)) {
        reportFetchProgress(1, 1, "Preparing wind rose...");
        await applyHourlyWindRoseOverride(data, icao, season);
      }

      if (isLightningGafZoom() && section === "precipitation") {
        reportFetchProgress(1, 1, "Preparing regional lightning...");
        await applyGafLightningHeatmapOverride(data, icao, season);
      } else if (shouldUseHourlyLightningHeatmap(section)) {
        reportFetchProgress(1, 1, "Preparing lightning heatmap...");
        await applyHourlyLightningHeatmapOverride(data, icao, season);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return {
        section,
        figures: data.figures || [],
        metrics: data.metrics || {},
        shouldResetMaximize: sectionChanging,
      };
    },
  });
}

async function fetchCharts() {
  if (state.liteMode) {
    return fetchChartsLite();
  }

  stopWindRosePlayback();
  clearChartAxisLocks();
  if (!validateRanges()) {
    return;
  }

  return runViewTransition({
    message: "Loading charts...",
    load: async ({ signal, reportFetchProgress }) => {
      const requestedSection = state.requestedSection;
      const sectionChanging = state.displayedSection !== requestedSection;

      if (sectionChanging) {
        resetWindRoseModeOnSectionChange(requestedSection);
      }

      const batches = getSectionFigureBatches(requestedSection);
      const allFigures = [];
      let combinedMetrics = {};
      let combinedWarning = "";

      if (shouldUseHourlyWindRose(requestedSection)) {
        reportFetchProgress(0, batches.length + 1, "Preparing wind rose...");
        await fetchWindRoseDailySnapshot(requestedSection, signal);
        if (signal.aborted) {
          const err = new Error("Aborted");
          err.name = "AbortError";
          throw err;
        }
      }

      let completedBatches = 0;
      const batchPromises = batches.map((batch, index) => {
        const params = getParams();
        if (batch.length) {
          params.set("figureIds", batch.join(","));
          applyWindRoseHourParams(params, batch);
        }
        if (index > 0) {
          params.set("includeMetrics", "false");
        }

        return fetch(apiUrl(`/api/charts?${params.toString()}`), { signal })
          .then((res) => res.json())
          .then((data) => {
            completedBatches += 1;
            if (!signal.aborted) {
              reportFetchProgress(
                completedBatches,
                batches.length,
                `Processing data (${completedBatches}/${batches.length})...`,
              );
            }
            return { index, data };
          });
      });

      const batchResults = await Promise.all(batchPromises);

      if (signal.aborted) {
        const err = new Error("Aborted");
        err.name = "AbortError";
        throw err;
      }

      batchResults
        .sort((a, b) => a.index - b.index)
        .forEach(({ data }) => {
          if (data.error) {
            throw new Error(data.error);
          }

          if (data.warning && !combinedWarning) {
            combinedWarning = data.warning;
          }
          if (data.metrics && Object.keys(data.metrics).length > 0 && Object.keys(combinedMetrics).length === 0) {
            combinedMetrics = data.metrics;
          }
          if (Array.isArray(data.figures) && data.figures.length > 0) {
            allFigures.push(...data.figures);
          }
        });

      return {
        section: requestedSection,
        figures: allFigures,
        metrics: combinedMetrics,
        shouldResetMaximize: sectionChanging,
        warning: combinedWarning,
      };
    },
  });
}

function wireControls() {
  if (els.infoBtn) {
    els.infoBtn.addEventListener("click", () => {
      openInfoModal();
    });
  }

  if (els.infoCloseBtn) {
    els.infoCloseBtn.addEventListener("click", () => {
      closeInfoModal();
    });
  }

  if (els.infoOverlay) {
    els.infoOverlay.addEventListener("click", (event) => {
      if (event.target === els.infoOverlay) {
        closeInfoModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (!isInfoModalOpen()) {
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeInfoModal();
    }
  });

  attachMobileChromeListeners();
  syncControlsPlacementForViewport();
  syncLegendPlacementForViewport();
  syncMobileSectionSelect();
  syncMobileChartSelect(state.requestedSection);
  applyMobileChartVisibility();
  renderErrorBarsToggle();

  if (els.errorBarsToggle) {
    els.errorBarsToggle.addEventListener("click", () => {
      state.showErrorBars = !state.showErrorBars;
      renderErrorBarsToggle();
      // Clear sticky focus/hover on touch so the off state matches initial white.
      els.errorBarsToggle.blur();
      if (state.latestFigures.length) {
        refreshErrorBarsOnVisibleCharts();
      }
    });
  }

  els.icao.addEventListener("change", () => {
    stopWindRosePlayback();
    stopLightningPlayback();
    windRosePlayback.liteHourlyMap = null;
    windRosePlayback.apiHourlyFigures = null;
    windRosePlayback.apiCacheKey = null;
    resetWindRoseHourlyScale();
    lightningPlayback.liteHourlyMap = null;
    lightningPlayback.liteHourlyIcao = null;
    // Regional pack id follows GAF/pair; clear so the next load picks the right cube.
    clearLightningGafSeasonPackState();
    cancelGafHourlyIdlePrefetch();
    resetLightningHourlyLayoutState();
    state.lhMode = "summary";
    state.lightningHeatmapScaleRef = null;
    state.lightningHeatmapSummaryLayoutRef = null;
    clearChartLegendVisibility();
    clearChartAxisLocks();
    invalidateCompareCache();
    const primary = String(els.icao.value || "").trim().toUpperCase();
    if (state.compareIcao && state.compareIcao === primary) {
      state.compareIcao = "";
    }
    if (els.infoOverlay && !els.infoOverlay.classList.contains("hidden")) {
      renderInfoModalContent();
    }
    fetchCharts();
  });
  els.season.addEventListener("change", refreshSeasonSelection);

  let resizeFrame = null;
  window.addEventListener("resize", () => {
    if (resizeFrame) {
      cancelAnimationFrame(resizeFrame);
    }
    resizeFrame = requestAnimationFrame(() => {
      applyMobileChartVisibility();
      applyChartShellHeights(state.displayedSection);
      resizeFrame = null;
    });
  });
}

async function init() {
  try {
    const metaBuild = document.querySelector('meta[name="avclimate-build"]')?.content || "";
    const scriptSrc = document.querySelector('script[src*="app.js"]')?.src || "";
    let buildId = metaBuild && metaBuild !== "__ASSET_VERSION__" ? metaBuild : "dev";
    if (buildId === "dev") {
      try {
        const scriptUrl = new URL(scriptSrc, window.location.href);
        buildId = scriptUrl.searchParams.get("v")
          || (scriptUrl.pathname.match(/\/js\/([^/]+)\/app\.js$/) || [])[1]
          || "dev";
      } catch (_err) {
        buildId = "dev";
      }
    }
    document.documentElement.dataset.avBuild = buildId;
    document.title = "Aviation climatology";

    const isLite = await checkLiteMode();
    await loadAirportCoverage();
    if (isLite) {
        // In lite mode, we skip fetchOptions and use the manifest.
        state.options = {
            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        };
        renderCategories();
        // Set default ICAO from manifest
        const manifestIcaos = state.manifest.icaos || state.manifest.airports;
        if (state.manifest && manifestIcaos && manifestIcaos.length > 0) {
            const icaoSelect = els.icao;
            icaoSelect.innerHTML = "";
            manifestIcaos.forEach(icao => {
                const opt = document.createElement("option");
                opt.value = icao;
                opt.textContent = airportDisplayLabel(icao);
                icaoSelect.appendChild(opt);
            });
            const defaultIcao = (state.manifest.default && state.manifest.default.airport) || manifestIcaos[0];
            icaoSelect.value = defaultIcao;
        }
        if (state.manifest?.default?.season && els.season) {
            els.season.value = state.manifest.default.season;
        }
        applySectionLayout();
        applyChartShellHeights();
        initializeChartContainerResizeObservers();
        wireControls();
        fetchCharts();
        return;
    }

    renderCategories();
    await fetchOptions();
    renderCategories();
    applySectionLayout();
    applyChartShellHeights();
    initializeChartContainerResizeObservers();
    wireControls();
    fetchCharts();
  } catch (error) {
    console.error("App initialization failed:", error);
    if (state.liteMode) {
      setStatus("Failed to initialize the static app. Check that data-lite/manifest.json is deployed.");
    } else if (window.location.hostname.endsWith("github.io") && !API_BASE) {
      setStatus("Frontend loaded. Configure AVCLIMATE_API_BASE in config.js to connect to your backend.");
    } else {
      setStatus("Failed to initialize the app.");
    }
  }
}

init();

