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
  "Fog included in present weather code OR visibility < 1000 m and T−Td < 2 °C and precipitation < 0.2 mm";

const infoLowCloudBins =
  "Broken or overcast coverage within respective height bins";

const infoRainDayRule =
  "Rain/drizzle/shower/thunder present-weather, or daily precipitation > 0.2 mm";


const infoHourlyPrecipRainRule =
  "10-minute precipitation > 0.2 mm";

const infoPrecipSplitRule =
  "10-minute precipitation > 0.2 mm, or rain/shower/thunder present weather";

const infoThunderDayRule = "≥1 lightning strike within 8 km of aerodrome (from 2009)";

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
    description: "Average monthly rain days and thunderstorm days.",
    classification: [
      { term: "Rain day", detail: infoRainDayRule },
      { term: "Thunder day", detail: infoThunderDayRule },
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
    description: "Average monthly rain days and thunderstorm days.",
    classification: [
      { term: "Rain day", detail: infoRainDayRule },
      { term: "Thunder day", detail: infoThunderDayRule },
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
    description: "Precipitating observation counts by UTC hour on the primary axis; thunderstorm hours on the secondary axis.",
    classification: [
      { term: "Precipitation", detail: infoHourlyPrecipRainRule },
      { term: "Thunderstorm", detail: "Unique UTC hours per BoM year with at least one strike within 8 km, averaged by UTC hour (from 2009); secondary axis" },
      { term: "Aggregation", detail: "Observation counts by UTC hour; average per hour across years" },
    ],
  },
  lightning_heatmap: {
    title: "Lightning Strike Frequency",
    description: "Strike counts within a 30 km radius of the aerodrome, with 8 km and 16 km range rings, over the same terrain background as radial plots.",
    classification: [
      { term: "Coverage", detail: infoThunderDayRule },
      { term: "Grid", detail: "48×48 cells (~1.25 km) over a 60 km square aligned to the 30 km strike radius" },
      { term: "Background", detail: "Terrain from airport topo.png — same zoom-9 crop span as radial plots" },
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

const state = {
  requestedSection: "overview",
  displayedSection: "overview",
  maximizedChartIndex: null,
  showErrorBars: false,
  fogModes: {
    monthly: "all",
    hourly: "all",
    wind: "all",
    dewpoint: "all",
  },
  options: null,
  latestFigures: [],
  axisLocks: {},
  stackedAxisLabelLocks: {},
  liteMode: false,
  manifest: null,
  airportCoverage: null,
  wrMode: "summary", // 'summary' or 'hourly'
  lhMode: "summary", // 'summary' or 'hourly' (lightning heatmap)
  windRoseLayoutRef: {},
  lightningHeatmapScaleRef: null,
  lightningHeatmapHourlyScaleRef: null,
  lightningHeatmapHourlyScaleKey: null,
  lightningHeatmapSummaryLayoutRef: null,
  lightningHeatmapLayoutRef: null,
  lightningHeatmapPinnedTraceRef: null,
  chartLegendVisibility: {},
};

const liteCache = new Map();
const airportTopoCache = new Map();

async function checkLiteMode() {
  try {
    const res = await fetch("data-lite/manifest.json");
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
  return false;
}

async function loadAirportCoverage() {
  try {
    const res = await fetch("data-lite/airport-coverage.json");
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

async function fetchJsonCached(url) {
  if (liteCache.has(url)) return liteCache.get(url);

  let res = await fetch(liteJsonGzUrl(url));
  if (!res.ok && url !== liteJsonGzUrl(url)) {
    res = await fetch(url);
  }
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);

  const data = await parseLiteJsonResponse(res);
  liteCache.set(url, data);
  liteCache.set(liteJsonGzUrl(url), data);
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

async function assembleLiteFigures(icao, section, season) {
  const figureOrder = infoSectionOverview[section]?.figureOrder || [];
  const [basePayload, modeFigures] = await Promise.all([
    fetchLiteSectionPayload(icao, section, season),
    Promise.all(
      liteModeFigureSpecsForSection(section).map(async (spec) => {
        const mode = state.fogModes[spec.modeKey] || "all";
        const shard = await fetchLiteFigureShard(icao, spec.figureId, season, mode);
        return shard;
      }),
    ),
  ]);

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

  showLoading("Updating chart...");
  try {
    const shards = await Promise.all(
      specs.map((spec) => fetchLiteFigureShard(icao, spec.figureId, season, mode)),
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

    await drawCharts(state.latestFigures, section);
    hideLoading();
  } catch (error) {
    console.error(error);
    if (!isBenignChartRenderError(error)) {
      setStatus(`Error: ${error.message}`);
    } else {
      setStatus("");
    }
    hideLoading();
  }
}

const fogLegendOrder = new Map([
  ["2000ft - 1500ft cloud", 0],
  ["1500ft - 1000ft cloud", 1],
  ["1000ft - 500ft cloud", 2],
  ["< 500ft cloud", 3],
  ["Fog", 4],
]);

const smokeLegendOrder = new Map([
  ["FU", 0],
  ["DU", 1],
  ["SA", 2],
  ["VA", 3],
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
};

const THUNDER_LEGEND_LABEL = "Thunderstorm";
const LEGACY_THUNDER_LEGEND_LABELS = new Set([
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
    if (LEGACY_THUNDER_LEGEND_LABELS.has(name) || name === THUNDER_LEGEND_LABEL) {
      trace.name = THUNDER_LEGEND_LABEL;
    }
  });
}

function getStoredThunderLegendVisibility(stored) {
  if (!stored) {
    return undefined;
  }
  const keys = [...LEGACY_THUNDER_LEGEND_LABELS, THUNDER_LEGEND_LABEL];
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

const dualSliderDefs = [
  { key: "year", minEl: "year-start", maxEl: "year-end", highlightEl: "year-highlight", minValueEl: "year-start-value", maxValueEl: "year-end-value", format: (v) => String(v) },
  { key: "month", minEl: "month-start", maxEl: "month-end", highlightEl: "month-highlight", invertEl: "invert-month", minValueEl: "month-start-value", maxValueEl: "month-end-value", format: (v) => state.options.months[Number(v) - 1] },
  { key: "hour", minEl: "hour-start", maxEl: "hour-end", highlightEl: "hour-highlight", invertEl: "invert-hour", minValueEl: "hour-start-value", maxValueEl: "hour-end-value", format: (v) => `${String(v).padStart(2, "0")}Z` },
];

const els = {
  categoryRow: document.getElementById("category-row"),
  icao: document.getElementById("icao"),
  season: document.getElementById("season"),
  enso: document.getElementById("enso"),
  iod: document.getElementById("iod"),
  sam: document.getElementById("sam"),
  mjo: document.getElementById("mjo"),
  errorBarsToggle: document.getElementById("error-bars-toggle"),
  yearStart: document.getElementById("year-start"),
  yearEnd: document.getElementById("year-end"),
  monthStart: document.getElementById("month-start"),
  monthEnd: document.getElementById("month-end"),
  hourStart: document.getElementById("hour-start"),
  hourEnd: document.getElementById("hour-end"),
  invertMonth: document.getElementById("invert-month"),
  invertHour: document.getElementById("invert-hour"),
  yearStartValue: document.getElementById("year-start-value"),
  yearEndValue: document.getElementById("year-end-value"),
  monthStartValue: document.getElementById("month-start-value"),
  monthEndValue: document.getElementById("month-end-value"),
  hourStartValue: document.getElementById("hour-start-value"),
  hourEndValue: document.getElementById("hour-end-value"),
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
  let shell = card.querySelector(".chart-shell");
  let legend = card.querySelector(".chart-legend");
  let maximizeButton = card.querySelector(".chart-maximize-btn");

  if (!shell) {
    shell = document.createElement("div");
    shell.className = "chart-shell";
    host.replaceWith(shell);
    shell.appendChild(host);

    legend = document.createElement("div");
    legend.className = "chart-legend hidden";
    shell.appendChild(legend);
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
      state.maximizedChartIndex = state.maximizedChartIndex === chartIndex ? null : chartIndex;
      if (state.lhMode === "hourly") {
        resetLightningHourlyLayoutState();
      }
      applyMaximizedChartState();
      invalidateCanonicalGeometryForVisibleCharts();
      if (state.latestFigures.length) {
        drawCharts(state.latestFigures, state.displayedSection);
      } else {
        applyChartShellHeights(state.displayedSection);
      }
    });
    card.appendChild(maximizeButton);
  }

  return { card, shell, legend, maximizeButton };
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
  ["Graph", "Description", "Classification method"].forEach((label) => {
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
    descCell.textContent = detail.description;
    row.appendChild(descCell);

    row.appendChild(renderInfoClassificationCell(detail.classification));
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
let loadingTimer = null;

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

function setLoadingState(progress, message) {
  loadingProgress = Math.max(0, Math.min(100, progress));
  els.loadingBarFill.style.width = `${loadingProgress}%`;
  if (message) {
    els.loadingStatus.textContent = message;
  }
}

function showLoading(message = "Preparing charts...") {
  if (loadingTimer) {
    clearInterval(loadingTimer);
    loadingTimer = null;
  }
  setLoadingState(12, message);
  els.loadingOverlay.classList.remove("hidden");
  // Add loading class to chart grid to lock layout
  const chartGrid = document.getElementById("chart-grid");
  if (chartGrid) chartGrid.classList.add("is-loading");

  loadingTimer = setInterval(() => {
    if (loadingProgress < 90) {
      setLoadingState(loadingProgress + 6);
    }
  }, 180);
}

function hideLoading() {
  if (loadingTimer) {
    clearInterval(loadingTimer);
    loadingTimer = null;
  }
  setLoadingState(100, "Ready");
  setTimeout(() => {
    els.loadingOverlay.classList.add("hidden");
    // Remove loading class from chart grid
    const chartGrid = document.getElementById("chart-grid");
    if (chartGrid) chartGrid.classList.remove("is-loading");
    setLoadingState(0, "Preparing charts...");
  }, 120);
}

function resetMaximizedChartState() {
  state.maximizedChartIndex = null;
  applyMaximizedChartState();
}

function applyMaximizedChartState() {
  const hasMaximizedChart = Number.isInteger(state.maximizedChartIndex);
  const visibleCardCount = state.latestFigures.length ? Math.min(state.latestFigures.length, els.charts.length) : els.charts.length;
  const chartGrid = document.getElementById("chart-grid");
  if (chartGrid) {
    chartGrid.classList.toggle("has-maximized-chart", hasMaximizedChart);
    chartGrid.style.setProperty("--expanded-chart-rows", visibleCardCount > 2 ? "2" : "1");
  }

  chartUi.forEach(({ card, maximizeButton }, index) => {
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
  });
}

function renderCategories() {
  els.categoryRow.innerHTML = "";
  const buttonRow = document.createElement("div");
  buttonRow.className = "category-buttons";
  sections.forEach((section) => {
    const btn = document.createElement("button");
    btn.className = `category-btn ${section.key === state.requestedSection ? "active" : ""}`;
    btn.textContent = section.label;
    btn.addEventListener("click", () => {
      if (state.requestedSection === section.key) {
        return;
      }
      state.requestedSection = section.key;
      resetMaximizedChartState();
      renderCategories();
      clearChartAxisLocks();
      fetchCharts();
    });
    buttonRow.appendChild(btn);
  });
  els.categoryRow.appendChild(buttonRow);
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
      updateChartToolbars();
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
    return;
  }

  if (section === "fog_low_cloud") {
    fogPanels.forEach((panel) => {
      renderDayTypeToggle(els.chartToolbars[panel.key], panel.key);
    });
    return;
  }

  if (section === "overview") {
    renderDayTypeToggle(els.overviewFogModeToolbar, "monthly");
  }

  renderWindRoseToolbar(section);
  renderLightningHeatmapToolbar(section);
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
  apiCacheKey: null,
  apiHourlyFigures: null,
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
    const icao = els.icao.value;
    const url = liteWindRoseHourlyUrl(icao);
    const needsFetch = !liteWindRoseHourlyIsCached(icao);
    if (needsFetch) {
      showLoading("Preparing animation...");
    }
    try {
      windRosePlayback.liteHourlyMap = await fetchJsonCached(url);
    } finally {
      if (needsFetch) {
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

function resolveWindRoseHourFigure(hour, icao, season) {
  if (state.liteMode) {
    const hResult = lookupLiteWindRoseHourlyPayload(windRosePlayback.liteHourlyMap, season, hour);
    return hResult?.figures?.find((figure) => figure.id === "wind_rose") || null;
  }
  return windRosePlayback.apiHourlyFigures?.get(Number(hour)) || null;
}

async function renderWindRoseHourFrame(hour, section = state.displayedSection) {
  if (!shouldUseHourlyWindRose(section)) {
    return;
  }

  const host = getWindRoseChartHost();
  if (!host) {
    return;
  }

  const icao = els.icao.value;
  const season = els.season.value;
  if (state.liteMode && !windRosePlayback.liteHourlyMap) {
    windRosePlayback.liteHourlyMap = await fetchJsonCached(liteWindRoseHourlyUrl(icao));
  }
  const sourceFigure = resolveWindRoseHourFigure(hour, icao, season);
  if (!sourceFigure?.figure) {
    return;
  }

  const hourlyWrFig = JSON.parse(JSON.stringify(sourceFigure));
  resetDefaultLegendTraceVisibility(hourlyWrFig.figure);
  const chartHeight = Number.parseFloat(host.style.height) || getChartHeight(section);
  const layoutSnapshot = state.windRoseLayoutRef[section]
    ? { ...state.windRoseLayoutRef[section], height: chartHeight }
    : null;

  applyWindRoseLayout(hourlyWrFig.figure, section, layoutSnapshot);
  hourlyWrFig.figure.layout = hourlyWrFig.figure.layout || {};
  hourlyWrFig.figure.layout.height = chartHeight;
  delete hourlyWrFig.figure.layout.width;
  hourlyWrFig.figure.layout.showlegend = false;

  await preparePolarTerrainBackground(hourlyWrFig.figure, icao);
  applyStrictValueHoverTemplatesToFigure(hourlyWrFig.figure, "wind_rose");
  applyChartLegendVisibilityToFigure(hourlyWrFig.figure, "wind_rose");

  await Plotly.react(host, hourlyWrFig.figure.data || [], hourlyWrFig.figure.layout || {}, {
    displayModeBar: false,
    responsive: true,
  });

  const windRoseIndex = state.latestFigures.findIndex((item) => item.id === "wind_rose");
  if (windRoseIndex >= 0) {
    state.latestFigures[windRoseIndex] = hourlyWrFig;
    const { legend } = chartUi[windRoseIndex];
    renderExternalLegend(host, legend, hourlyWrFig.figure, section, "wind_rose");
  }

  await scheduleWindRoseResize(host);
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
  resetLightningHeatmapModeOnSectionChange(nextSection);
  clearChartLegendVisibility();
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
  }
}

function attachWindRoseListeners() {
  if (els.wrModeSummary) {
    els.wrModeSummary.addEventListener("click", () => {
      stopWindRosePlayback();
      state.wrMode = "summary";
      els.wrModeSummary.classList.add("active");
      els.wrModeHourly.classList.remove("active");
      els.wrHourScrollerContainer.classList.add("hidden");
      if (state.displayedSection === "wind" || state.displayedSection === "overview") fetchCharts();
    });
  }

  if (els.wrModeHourly) {
    els.wrModeHourly.addEventListener("click", () => {
      stopWindRosePlayback();
      state.wrMode = "hourly";
      els.wrModeHourly.classList.add("active");
      els.wrModeSummary.classList.remove("active");
      els.wrHourScrollerContainer.classList.remove("hidden");
      if (state.displayedSection === "wind" || state.displayedSection === "overview") fetchCharts();
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
  return ui.shell.querySelector(".lightning-hour-overlay");
}

function positionLightningOverlay(baseHost, overlay) {
  if (!baseHost || !overlay) {
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
  let overlay = ui.shell.querySelector(".lightning-hour-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "lightning-hour-overlay";
    ui.shell.appendChild(overlay);
  }
  positionLightningOverlay(baseHost, overlay);
  return overlay;
}

function buildLightningOverlayLayout(baseHost) {
  const full = baseHost?._fullLayout || {};
  const size = full._size || {};
  const layoutMargin = baseHost?.layout?.margin || {};
  const width = Math.round(baseHost.offsetWidth || baseHost.clientWidth || 0);
  const height = Math.round(baseHost.offsetHeight || baseHost.clientHeight || 0);
  const xRange = Array.isArray(full.xaxis?.range) ? full.xaxis.range.slice() : null;
  const yRange = Array.isArray(full.yaxis?.range) ? full.yaxis.range.slice() : null;
  const margin = {
    l: Math.round(Number.isFinite(size.l) ? size.l : (layoutMargin.l || 0)),
    r: Math.round(Number.isFinite(size.r) ? size.r : (layoutMargin.r || 0)),
    t: Math.round(Number.isFinite(size.t) ? size.t : (layoutMargin.t || 0)),
    b: Math.round(Number.isFinite(size.b) ? size.b : (layoutMargin.b || 0)),
  };
  const axisCommon = {
    fixedrange: true,
    visible: false,
    showgrid: false,
    zeroline: false,
    ticks: "",
    showticklabels: false,
  };
  return {
    width,
    height,
    autosize: false,
    margin,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    showlegend: false,
    hovermode: "closest",
    xaxis: { ...axisCommon, range: xRange || undefined, autorange: !xRange },
    yaxis: { ...axisCommon, range: yRange || undefined, autorange: !yRange },
  };
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
  const layout = buildLightningOverlayLayout(baseHost);
  const trace = buildLightningOverlayDataTrace(baseHost, z);
  overlay.classList.add("is-visible");
  await Plotly.react(overlay, [trace], layout, { displayModeBar: false, responsive: false });
  const ctx = getLightningHourlyPinContext(baseHost);
  lightningPlayback.overlayActive = true;
  lightningPlayback.pinnedWidth = ctx.width;
  lightningPlayback.pinnedHeight = ctx.height;
  lightningPlayback.pinnedMaximized = ctx.maximized;
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
  return Plotly.restyle(overlay, { z: [z] }, [0]);
}

function teardownLightningOverlay() {
  lightningPlayback.overlayActive = false;
  const overlay = getLightningOverlayHost();
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
  lightningPlayback.layoutPinned = false;
  lightningPlayback.pinnedWidth = null;
  lightningPlayback.pinnedHeight = null;
  lightningPlayback.pinnedMaximized = null;
  state.lightningHeatmapLayoutRef = null;
  state.lightningHeatmapPinnedTraceRef = null;
  // Drop the memoized hourly colour scale so it is recomputed for the current
  // ICAO/season on the next render. It is keyed by ICAO::season, so scrubbing
  // (which never calls this) keeps a stable scale and stays flicker-free.
  state.lightningHeatmapHourlyScaleRef = null;
  state.lightningHeatmapHourlyScaleKey = null;
  syncLightningHourlyColorbarVisibility();
}

const lightningPlayback = {
  timer: null,
  playing: false,
  suppressSliderFetch: false,
  renderInFlight: false,
  liteHourlyMap: null,
  liteHourlyIcao: null,
  layoutPinned: false,
  frameUpdating: false,
  pendingHour: null,
  pinnedWidth: null,
  pinnedHeight: null,
  pinnedMaximized: null,
  overlayActive: false,
};

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
  const code = String(icao || "").trim().toUpperCase();
  if (!supportsLightningHeatmapHourly(code)) {
    throw new Error("Hourly lightning heatmap is not available for this aerodrome");
  }
  if (lightningPlayback.liteHourlyMap && lightningPlayback.liteHourlyIcao === code) {
    return;
  }

  const url = liteLightningHourlyUrl(code);
  const needsFetch = !liteCache.has(url);
  if (needsFetch) {
    showLoading("Preparing lightning animation...");
  }
  try {
    lightningPlayback.liteHourlyMap = await fetchJsonCached(url);
    lightningPlayback.liteHourlyIcao = code;
  } finally {
    if (needsFetch) {
      hideLoading();
    }
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

function lightningHeatmapRestylePatch(z, scale = {}) {
  const scaleMin = Number(scale.zmin) || 0;
  const scaleMax = Math.max(scaleMin + 1, Number(scale.zmax) || 1);
  const dtick = lightningColorbarDtick(scaleMin, scaleMax);
  const patch = {
    zmin: [scaleMin],
    zmax: [scaleMax],
    zauto: [false],
    showscale: [true],
    colorscale: [LIGHTNING_HEATMAP_COLORSCALE],
    "colorbar.dtick": [dtick],
    "colorbar.tick0": [Math.floor(scaleMin / dtick) * dtick],
    "colorbar.title.text": ["Strike count"],
    "colorbar.x": [1.02],
    "colorbar.xanchor": ["left"],
    "colorbar.y": [0.5],
    "colorbar.yanchor": ["middle"],
    "colorbar.len": [0.75],
  };
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

function finalizeLightningHeatmapPostRender(host, scale, { icao = "", captureSummary = false, pinHourly = false } = {}) {
  return restyleLightningHeatmapScale(host, scale)
    .then(() => relayoutTopoMapPanel(host))
    .then(() => scheduleHostResize(host))
    .then(async () => {
      await awaitLayoutSettle();
      if (captureSummary) {
        captureLightningHeatmapSummaryLayoutRef(host);
      }
      if (pinHourly) {
        await finalizeLightningHourlyLayoutPin(host);
      }
    });
}

async function pinLightningHeatmapHourlyLayout(host) {
  return finalizeLightningHourlyLayoutPin(host);
}

function captureLightningHeatmapSummaryScale(figure, { icao = "", season = "all" } = {}) {
  const clone = JSON.parse(JSON.stringify(figure || {}));
  const scale = applyLightningHeatmapStyle(clone, { icao, season });
  if (scale) {
    state.lightningHeatmapScaleRef = { ...scale };
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
  const key = `${String(icao || "").trim().toUpperCase()}::${String(season || "all")}`;
  if (state.lightningHeatmapHourlyScaleKey !== key || !state.lightningHeatmapHourlyScaleRef) {
    const scale = computeLightningHourlyScale(season);
    if (scale) {
      state.lightningHeatmapHourlyScaleRef = { ...scale };
      state.lightningHeatmapHourlyScaleKey = key;
    }
  }
  return state.lightningHeatmapHourlyScaleRef;
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
  try {
    let targetHour = hour;
    do {
      lightningPlayback.pendingHour = null;
      await renderLightningHeatmapHourFrameCore(targetHour, section);
      targetHour = lightningPlayback.pendingHour;
    } while (targetHour != null);
  } finally {
    lightningPlayback.renderInFlight = false;
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
    state.lightningHeatmapScaleRef = null;
    lightningPlayback.liteHourlyMap = null;
    lightningPlayback.liteHourlyIcao = null;
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
    els.lhHourScroller.addEventListener("pointerdown", () => {
      if (lightningPlayback.playing) {
        stopLightningPlayback();
      }
    });
    els.lhHourScroller.addEventListener("input", () => {
      if (lightningPlayback.playing) {
        stopLightningPlayback();
      }
      els.lhHourValue.textContent = formatWindRoseHourLabel(els.lhHourScroller.value);
      if (lightningPlayback.suppressSliderFetch) {
        return;
      }
      if (lightningHeatmapToolbarSections().has(state.displayedSection) && shouldUseHourlyLightningHeatmap()) {
        renderLightningHeatmapHourFrame(els.lhHourScroller.value);
      }
    });
    els.lhHourScroller.addEventListener("change", () => {
      if (lightningPlayback.suppressSliderFetch || lightningPlayback.playing) {
        return;
      }
      if (!lightningHeatmapToolbarSections().has(state.displayedSection)) {
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

function fillSelect(select, options, selectedValue) {
  select.innerHTML = "";
  options.forEach((value) => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = value;
    if (value === selectedValue) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

function monthNameFromNumber(value) {
  const idx = Math.max(1, Math.min(12, Number(value))) - 1;
  return state.options.months[idx];
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

function applySeasonMonthRange() {
  const config = seasonMonthConfig(els.season.value);
  els.monthStart.value = String(config.monthStart);
  els.monthEnd.value = String(config.monthEnd);
  els.invertMonth.checked = config.invertMonth;
  updateSliderLabels();
}

function refreshSeasonSelection() {
  stopWindRosePlayback();
  stopLightningPlayback();
  windRosePlayback.apiHourlyFigures = null;
  windRosePlayback.apiCacheKey = null;
  state.lightningHeatmapScaleRef = null;
  state.lightningHeatmapSummaryLayoutRef = null;
  resetLightningHourlyLayoutState();
  applySeasonMonthRange();
  clearChartAxisLocks();
  fetchCharts();
}

function clearChartAxisLocks() {
  state.axisLocks = {};
  state.stackedAxisLabelLocks = {};
}

function updateDualSliderTrack(def) {
  const minInput = document.getElementById(def.minEl);
  const maxInput = document.getElementById(def.maxEl);
  const highlight = document.getElementById(def.highlightEl);
  const invertInput = def.invertEl ? document.getElementById(def.invertEl) : null;

  const min = Number(minInput.min);
  const max = Number(minInput.max);
  const start = Number(minInput.value);
  const end = Number(maxInput.value);

  const span = Math.max(1, max - min);
  const startPct = ((start - min) / span) * 100;
  const endPct = ((end - min) / span) * 100;
  const isInverted = Boolean(invertInput && invertInput.checked);

  // Use two-tone track colors so invert mode is visibly different at a glance.
  const selectedColor = "rgba(170, 214, 255, 0.95)";
  const unselectedColor = "rgba(17, 43, 88, 0.45)";

  highlight.style.left = "0%";
  highlight.style.width = "100%";

  if (isInverted) {
    highlight.style.background = `linear-gradient(to right, ${selectedColor} 0%, ${selectedColor} ${startPct}%, ${unselectedColor} ${startPct}%, ${unselectedColor} ${endPct}%, ${selectedColor} ${endPct}%, ${selectedColor} 100%)`;
    highlight.classList.add("is-inverted");
    return;
  }

  highlight.style.background = `linear-gradient(to right, ${unselectedColor} 0%, ${unselectedColor} ${startPct}%, ${selectedColor} ${startPct}%, ${selectedColor} ${endPct}%, ${unselectedColor} ${endPct}%, ${unselectedColor} 100%)`;
  highlight.classList.remove("is-inverted");
}

function updateSliderLabels() {
  dualSliderDefs.forEach((def) => {
    const minInput = document.getElementById(def.minEl);
    const maxInput = document.getElementById(def.maxEl);
    const minValueEl = document.getElementById(def.minValueEl);
    const maxValueEl = document.getElementById(def.maxValueEl);

    minValueEl.textContent = def.format(minInput.value);
    maxValueEl.textContent = def.format(maxInput.value);
    updateDualSliderTrack(def);
  });
}

function normalizeRanges(changedField) {
  let yearStart = Number(els.yearStart.value);
  let yearEnd = Number(els.yearEnd.value);
  let monthStart = Number(els.monthStart.value);
  let monthEnd = Number(els.monthEnd.value);
  let hourStart = Number(els.hourStart.value);
  let hourEnd = Number(els.hourEnd.value);

  if (yearStart > yearEnd) {
    if (changedField === "year-start") {
      yearEnd = yearStart;
      els.yearEnd.value = String(yearEnd);
    } else {
      yearStart = yearEnd;
      els.yearStart.value = String(yearStart);
    }
  }

  if (monthStart > monthEnd) {
    if (changedField === "month-start") {
      monthEnd = monthStart;
      els.monthEnd.value = String(monthEnd);
    } else {
      monthStart = monthEnd;
      els.monthStart.value = String(monthStart);
    }
  }

  if (hourStart > hourEnd) {
    if (changedField === "hour-start") {
      hourEnd = hourStart;
      els.hourEnd.value = String(hourEnd);
    } else {
      hourStart = hourEnd;
      els.hourStart.value = String(hourStart);
    }
  }
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

  els.yearStart.value = data.default.yearStart;
  els.yearEnd.value = data.default.yearEnd;
  els.monthStart.value = String(data.months.indexOf(data.default.monthStart) + 1);
  els.monthEnd.value = String(data.months.indexOf(data.default.monthEnd) + 1);
  els.hourStart.value = data.default.hourStart;
  els.hourEnd.value = data.default.hourEnd;
  els.invertMonth.checked = data.default.invertMonth;
  els.invertHour.checked = data.default.invertHour;
  state.requestedSection = data.default.section;
  state.displayedSection = data.default.section;
  updateSliderLabels();
  })();

  try {
    await fetchOptions.inFlightPromise;
  } finally {
    fetchOptions.inFlightPromise = null;
  }

  return state.options;
}

function getParams() {
  const params = new URLSearchParams({
    section: state.requestedSection,
    season: els.season.value,
    enso: els.enso.value,
    iod: els.iod.value,
    sam: els.sam.value,
    mjo: els.mjo.value,
    fogMonthlyMode: state.fogModes.monthly,
    fogHourlyMode: state.fogModes.hourly,
    fogWindMode: state.fogModes.wind,
    fogDewpointMode: state.fogModes.dewpoint,
    icao: els.icao.value,
    yearStart: String(els.yearStart.value),
    yearEnd: String(els.yearEnd.value),
    monthStart: monthNameFromNumber(els.monthStart.value),
    monthEnd: monthNameFromNumber(els.monthEnd.value),
    hourStart: String(els.hourStart.value),
    hourEnd: String(els.hourEnd.value),
    invertMonth: String(els.invertMonth.checked),
    invertHour: String(els.invertHour.checked),
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
  const yearStart = Number(els.yearStart.value);
  const yearEnd = Number(els.yearEnd.value);
  const hourStart = Number(els.hourStart.value);
  const hourEnd = Number(els.hourEnd.value);

  if (Number.isNaN(yearStart) || Number.isNaN(yearEnd) || yearStart > yearEnd) {
    setStatus("Year range is invalid.");
    return false;
  }

  if (Number.isNaN(hourStart) || Number.isNaN(hourEnd) || hourStart > hourEnd) {
    setStatus("Hour range is invalid.");
    return false;
  }

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
  const { card, shell, legend, maximizeButton } = chartUi[index];
  Plotly.purge(host);
  legend.innerHTML = "";
  legend.classList.add("hidden");
  shell.classList.add("no-legend");
  shell.classList.remove("is-wind-rose-shell", "is-scatter-wind-dewpt-shell");
  card.classList.add("hidden");
  card.classList.remove("is-maximized", "is-hidden-for-maximized");
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

function decodePlotlyBinaryArray(values) {
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
    return Array.from(typed)
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));
  } catch {
    return null;
  }
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

const FREQUENCY_CHART_MIN_MARGIN_B = 36;
const FREQUENCY_CHART_MIN_MARGIN_L = 52;
const HOURLY_PRECIP_PANEL = {
  margin: { r: 42 },
  xDomain: [0, 1],
  y2TitleStandoff: 8,
  y2TickStandoff: 2,
};
const CANONICAL_GEOMETRY_VERSION = 9;

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

function computeDualOverlayAxisMax(figure, axisName = "y") {
  const traces = figure?.data || [];
  let maxValue = Number.NEGATIVE_INFINITY;
  traces.forEach((trace) => {
    if (!trace || trace.type !== "bar" || trace.visible === false || trace.visible === "legendonly") {
      return;
    }
    if (traceAxisName(trace) !== axisName) {
      return;
    }
    const bounds = traceBoundsWithError(trace, { includeLatentError: true });
    if (!bounds) {
      return;
    }
    maxValue = Math.max(maxValue, bounds.max);
  });
  if (!Number.isFinite(maxValue) || maxValue <= 0) {
    return 1;
  }
  return finalizeAxisBounds(0, maxValue)?.max ?? maxValue;
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

  function boundsForAxis(axisName) {
    let minValue = Number.POSITIVE_INFINITY;
    let maxValue = Number.NEGATIVE_INFINITY;

    traces.forEach((trace) => {
      if (!trace || trace.type !== "bar" || isErrorBarOverlayTrace(trace) || isStrictValueErrorOverlayTrace(trace)) {
        return;
      }
      if (traceAxisName(trace) !== axisName) {
        return;
      }
      const bounds = traceBoundsWithError(trace, { includeLatentError: true });
      if (!bounds) {
        return;
      }
      minValue = Math.min(minValue, bounds.min);
      maxValue = Math.max(maxValue, bounds.max);
    });

    return finalizeAxisBounds(minValue, maxValue);
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

function prepareFrequencyFigureGeometry(figure, figureId = "") {
  if (!figureUsesFrequencyAxisLabelLock(figureId, figure?.layout)) {
    return;
  }

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
    seedGroupedBarXAxisLockOnly(figure, figureId);
    return;
  }

  seedFrequencyPlotGeometryLock(figure, figureId);
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
  const calibrationRelayout = {
    ...buildPreCanonicalGeometryRelayout(host),
    "margin.l": FREQUENCY_CHART_MIN_MARGIN_L,
    "margin.r": isDualAxisHourlyPrecip
      ? HOURLY_PRECIP_PANEL.margin.r
      : (hostMargin.r ?? 32),
    "margin.t": hostMargin.t ?? 36,
    "margin.b": effectiveFrequencyMarginBottom(host, hostMargin.b),
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

  traces.forEach((trace) => {
    if (isErrorBarOverlayTrace(trace) || isStrictValueErrorOverlayTrace(trace) || trace.type !== "bar") {
      return;
    }
    if (traceAxisName(trace) !== axisName) {
      return;
    }
    includeBounds(traceBoundsWithError(trace, { includeLatentError: true }));
  });

  return finalizeAxisBounds(minValue, maxValue);
}

function computeStrictGroupedBarAxisBounds(host, axisName = "y", options = {}) {
  const traces = host?.data || [];
  const visibleAt = options.projectedVisible || ((trace) => isTraceVisible(trace));
  let minValue = Number.POSITIVE_INFINITY;
  let maxValue = Number.NEGATIVE_INFINITY;

  const includeBounds = (bounds) => {
    if (!bounds) {
      return;
    }
    minValue = Math.min(minValue, bounds.min);
    maxValue = Math.max(maxValue, bounds.max);
  };

  // Always derive range from visible main bar traces plus latent SD headroom.
  // Overlay traces exist for rendering only; switching to overlay-based bounds
  // on error-bar toggle was resetting the axis to the all-series default.
  traces.forEach((trace, index) => {
    if (!visibleAt(trace, index) || isErrorBarOverlayTrace(trace) || trace.type !== "bar") {
      return;
    }
    if (traceAxisName(trace) !== axisName) {
      return;
    }
    includeBounds(traceBoundsWithError(trace, { includeLatentError: true }));
  });

  return finalizeAxisBounds(minValue, maxValue);
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
    if (lock.margin) {
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
  if (lock.margin) {
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
  return {
    type: "data",
    array: yStdArray,
    arrayminus: yValues.slice(0, count).map((value, i) => {
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

  const positionSync = usesDualAxisPairedBarOverlays(host)
    ? syncDualAxisPairedBarOverlayPositions(host)
    : Promise.resolve();

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
        const base = cumulative.get(xKey) || 0;
        const yNum = Number(yValues[i]);
        const top = base + (Number.isFinite(yNum) ? yNum : 0);
        cumulative.set(xKey, top);
        tops.push(top);

        const sd = Number(yStdArray[i]);
        const eff = Number.isFinite(sd) ? sd : 0;
        minus.push(Math.min(eff, Math.max(0, top)));
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
        visible: true,
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
          visible: true,
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
  button.textContent = enabled ? "On" : "Off";
  button.classList.toggle("is-active", enabled);
  button.setAttribute("aria-pressed", enabled ? "true" : "false");
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
  return [
    els.icao.value,
    figureId,
    els.season.value,
    els.monthStart.value,
    els.monthEnd.value,
    els.invertMonth.checked ? "1" : "0",
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

    const yValues = Array.isArray(trace?.y) ? trace.y : [];
    const customdata = Array.isArray(trace?.customdata) ? trace.customdata : null;
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
  const targetSet = new Set(targetMonthLabels);
  figure.data = (figure.data || []).map((trace) => {
    const xValues = Array.isArray(trace?.x) ? trace.x : [];
    if (!xValues.length || xValues.some((value) => typeof value === "number")) {
      return trace;
    }

    const yValues = Array.isArray(trace?.y) ? trace.y : [];
    const customdata = Array.isArray(trace?.customdata) ? trace.customdata : null;
    const newX = [];
    const newY = [];
    const newCustom = [];

    for (let i = 0; i < xValues.length; i += 1) {
      const monthLabel = String(xValues[i]);
      if (!targetSet.has(monthLabel)) {
        continue;
      }
      newX.push(monthLabel);
      newY.push(yValues[i]);
      if (customdata) {
        newCustom.push(customdata[i]);
      }
    }

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
  } else if (!months.length && seasonMonths.length) {
    months = seasonMonths;
  } else if (
    seasonMonths.length
    && months.length > seasonMonths.length
    && months.every(isMonthAxisLabel)
  ) {
    months = seasonMonths;
    filterCategoryTracesToSeasonMonths(figure, seasonMonths);
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
  const margin = lock?.margin;
  if (margin) {
    ["l", "r", "t", "b"].forEach((key) => {
      if (margin[key] !== undefined) {
        relayout[`margin.${key}`] = margin[key];
      }
    });
  } else {
    relayout["margin.b"] = effectiveFrequencyMarginBottom(host, lock?.marginBottom);
    relayout["margin.l"] = FREQUENCY_CHART_MIN_MARGIN_L;
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
  return [
    els.icao.value,
    figureId,
    els.season.value,
    els.enso.value,
    els.iod.value,
    els.sam.value,
    els.mjo.value,
    els.yearStart.value,
    els.yearEnd.value,
    els.monthStart.value,
    els.monthEnd.value,
    els.hourStart.value,
    els.hourEnd.value,
    els.invertMonth.checked ? "1" : "0",
    els.invertHour.checked ? "1" : "0",
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
    legendHost.parentElement.classList.add("no-legend");
    return;
  }

  legendHost.parentElement.classList.remove("no-legend");
  legendHost.classList.remove("hidden");

  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chart-legend-item";

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

      const toggleChain = isCanonicalGroupedBar
        ? applyCanonicalGroupedBarLegendToggle(host, affectedIndices, nextVisibility)
          .then(() => finishStrictValueErrorBarOverlays(host))
          .then(() => finalizeGroupedBarLegendToggle(host))
        : Plotly.restyle(host, { visible: affectedIndices.map(() => nextVisibility) }, affectedIndices)
          .then(() => rebuildStackErrorBarOverlays(host))
          .then(() => rebuildStrictValueErrorBarOverlays(host))
          .then(() => finishStrictValueErrorBarOverlays(host))
          .then(() => (figureId === "cloud_distribution" ? syncFogWindHoverTemplate(host) : Promise.resolve()))
          .then(() => rescaleAfterLegendToggle(host));

      toggleChain.then(() => {
        if (figureId) {
          captureChartLegendVisibilityFromHost(host, figureId);
        }
        refreshLegendState(host, legendHost, items, groupclick);
      });
    });

    legendHost.appendChild(button);
  });

  refreshLegendState(host, legendHost, items, groupclick);
}

function getChartHeight(section) {
  const isWindSection = section === "wind";
  const isExpandedSection = isWindSection;

  const headerHeight = document.querySelector(".app-header")?.offsetHeight ?? 0;
  const controlsHeight = document.querySelector(".controls")?.offsetHeight ?? 0;
  const statusHeight = els.status.offsetHeight ?? 0;
  const metricsHeight = els.metrics.offsetHeight ?? 0;
  const footerHeight = document.querySelector(".time-controls")?.offsetHeight ?? 0;
  const viewportHeight = window.innerHeight;
  
  // Reserve room for page padding, the 2-row grid gap, and Plotly card chrome.
  const fixedChrome = 40;
  const available = Math.max(0, viewportHeight - headerHeight - controlsHeight - statusHeight - metricsHeight - footerHeight - fixedChrome);

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
      Promise.resolve(Plotly.Plots.resize(host))
        .then(() => {
          if (hostUsesCanonicalGroupedBarGeometry(host)) {
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
          }
          if (!hostUsesFrequencyAxisLabelLock(host)) {
            if (isTopoMapFigure(host.dataset?.figureId || "")) {
              return relayoutTopoMapPanel(host);
            }
            return;
          }
          const relayout = stableFrequencyAxisRelayout(host);
          if (!Object.keys(relayout).length) {
            return;
          }
          return Plotly.relayout(host, relayout);
        })
        .finally(resolve);
    });

    hostResizeFrames.set(host, frameId);
  });
}

function scheduleWindRoseResize(host) {
  if (!host) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      Promise.resolve(Plotly.Plots.resize(host))
        .then(() => relayoutTopoMapPanel(host))
        .finally(resolve);
    });
  });
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

function applyChartShellHeights(section = state.displayedSection) {
  const chartHeight = getChartHeight(section);
  const visibleCardCount = state.latestFigures.length ? Math.min(state.latestFigures.length, els.charts.length) : els.charts.length;
  const expandedRows = visibleCardCount > 2 ? 2 : 1;
  const expandedHeight = state.maximizedChartIndex === null ? chartHeight : (chartHeight * expandedRows) + (8 * Math.max(0, expandedRows - 1));

  for (let i = 0; i < els.charts.length; i += 1) {
    const isMaximized = state.maximizedChartIndex === i;
    const targetHeight = isMaximized ? expandedHeight : chartHeight;
    els.charts[i].style.height = `${targetHeight}px`;
    chartUi[i].card.style.minHeight = `${targetHeight + 10}px`;
  }

  return chartHeight;
}

async function drawCharts(figures, section = state.displayedSection) {
  // Remove any stale lightning overlay before re-rendering the base charts; it is
  // rebuilt afterwards when hourly mode is active.
  teardownLightningOverlay();
  const renderFigures = figures.map(cloneFigurePayloadForRender);
  state.latestFigures = renderFigures;
  const isWindSection = section === "wind";
  const isExpandedSection = section === "wind";
  const chartHeight = applyChartShellHeights(section);
  const visibleFigures = renderFigures.slice(0, 4);

  // Keep maximize controls hidden until all chart renders complete.

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
      const layoutSnapshot = state.wrMode === "hourly" && state.windRoseLayoutRef[section]
        ? { ...state.windRoseLayoutRef[section], height: targetChartHeight }
        : null;
      applyWindRoseLayout(figure, section, layoutSnapshot);
      figure.layout.height = targetChartHeight;
      delete figure.layout.width;
      if (state.wrMode === "summary") {
        state.windRoseLayoutRef[section] = extractWindRoseLayoutSnapshot(figure, section, targetChartHeight);
      }
    }
    return prepareChartTerrainBackground(figure, icao, item.id).then(() => {
    figure.layout = figure.layout || {};
    figure.layout.legend = figure.layout.legend || {};
    figure.layout.showlegend = false;
    if (!isWindRoseFigure) {
      figure.layout.margin = {
        ...(figure.layout.margin || {}),
        r: item.id === "hourly_precip" ? HOURLY_PRECIP_PANEL.margin.r : 32,
      };
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
      const hourlyScale = shouldUseHourlyLightningHeatmap(section) ? ensureLightningHourlyScale(icao, season) : null;
      const scale = applyLightningHeatmapStyle(figure, {
        icao,
        season,
        fixedScale: hourlyScale,
      });
      if (state.lhMode === "summary" && supportsLightningHeatmapHourly(icao) && scale) {
        state.lightningHeatmapScaleRef = { ...scale };
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
    if (isMaximized) {
      figure.layout.autosize = true;
      delete figure.layout.width;
    }
    applyChartLegendVisibilityToFigure(figure, item.id);
    const skipHourlyPrecipMaximizePipeline = isMaximized && item.id === "hourly_precip";
    const lockLightningHourlyPlot = item.id === "lightning_heatmap" && shouldUseHourlyLightningHeatmap(section);
    return Plotly.react(host, figure.data || [], figure.layout || {}, {
      displayModeBar: false,
      responsive: !lockLightningHourlyPlot,
    }).then(() => {
      return applyHostErrorBars(host)
        .then(() => rebuildStackErrorBarOverlays(host))
        .then(() => rebuildStrictValueErrorBarOverlays(host))
        .then(() => finishStrictValueErrorBarOverlays(host))
        .then(() => {
          if (skipHourlyPrecipMaximizePipeline) {
            return Promise.resolve();
          }
          return calibrateCanonicalPlotGeometry(host);
        })
        .then(() => {
          if (skipHourlyPrecipMaximizePipeline) {
            return Promise.resolve();
          }
          return applyResponsiveAxisRange(host);
        })
        .then(() => {
      renderExternalLegend(host, legend, item.figure, section, item.id);
      const maybeSync = item.id === "cloud_distribution" ? syncFogWindHoverTemplate(host) : Promise.resolve();
      const isWindRosePanel = item.id === "wind_rose" && windRoseToolbarSections().has(section);
      const isScatterWindDewpt = item.id === "scatter_wind_dewpt";
      return maybeSync.then(() => {
        if (isWindRosePanel) {
          return scheduleWindRoseResize(host);
        }
        if (isScatterWindDewpt) {
          return relayoutScatterWindDewptAxes(host, targetChartHeight);
        }
        if (item.id === "lightning_heatmap") {
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
          }).then(() => {
            // Maximized hourly builds its overlay from refreshMaximizedChartLayout
            // after the maximize settle; default hourly enters it here.
            if (enterOverlay) {
              return enterLightningHourlyOverlayCurrent(host);
            }
            return undefined;
          });
        }
        if (isTopoMapFigure(item.id)) {
          return relayoutTopoMapPanel(host).then(() => scheduleHostResize(host));
        }
        return scheduleHostResize(host);
      });
      });
    }).catch((error) => {
      logChartRenderWarning(item.id, error);
    });
    }).catch((error) => {
      logChartRenderWarning(item.id, error);
    });
  });

  for (let i = visibleFigures.length; i < els.charts.length; i += 1) {
    clearChart(i);
  }

  if (Number.isInteger(state.maximizedChartIndex) && state.maximizedChartIndex >= visibleFigures.length) {
    state.maximizedChartIndex = null;
  }

  await Promise.all(renderPromises);

  applyMaximizedChartState();
  updateChartToolbars(section);

  if (Number.isInteger(state.maximizedChartIndex) && state.maximizedChartIndex < visibleFigures.length) {
    const maximizedHost = els.charts[state.maximizedChartIndex];
    if (maximizedHost.dataset?.figureId === "hourly_precip") {
      const chartHeight = Number.parseFloat(maximizedHost.style.height) || null;
      await finalizeHourlyPrecipMaximizedLayout(maximizedHost, chartHeight);
    } else {
      await refreshMaximizedChartLayout(maximizedHost);
    }
  }

  const windRoseIndex = visibleFigures.findIndex((item) => item.id === "wind_rose");
  if (windRoseIndex >= 0 && windRoseToolbarSections().has(section)) {
    await scheduleWindRoseResize(els.charts[windRoseIndex]);
  }
}

let pendingFetch = null;
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
  figure.layout.margin = { ...TOPO_MAP_PANEL.margin };
  if (chartHeight != null) {
    figure.layout.height = chartHeight;
  }
  delete figure.layout.width;

  const domainX = TOPO_MAP_PANEL.plotDomain.x.slice();
  const domainY = TOPO_MAP_PANEL.plotDomain.y.slice();

  if (figureId === "lightning_heatmap") {
    figure.layout.xaxis = {
      ...(figure.layout.xaxis || {}),
      domain: domainX,
      scaleanchor: "y",
      scaleratio: 1,
      automargin: false,
    };
    figure.layout.yaxis = {
      ...(figure.layout.yaxis || {}),
      domain: domainY,
      automargin: false,
    };
    enforceLightningHeatmapTopoAxis(figure);
    const trace = (figure.data || []).find((entry) => String(entry?.type || "").toLowerCase() === "heatmap");
    if (trace) {
      trace.colorbar = {
        ...(trace.colorbar || {}),
        x: 1.02,
        xanchor: "left",
        len: 0.75,
        y: 0.5,
        yanchor: "middle",
      };
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

  const domainX = TOPO_MAP_PANEL.plotDomain.x.slice();
  const domainY = TOPO_MAP_PANEL.plotDomain.y.slice();
  const relayout = {
    "margin.l": TOPO_MAP_PANEL.margin.l,
    "margin.r": TOPO_MAP_PANEL.margin.r,
    "margin.t": TOPO_MAP_PANEL.margin.t,
    "margin.b": TOPO_MAP_PANEL.margin.b,
  };

  if (figureId === "lightning_heatmap") {
    Object.assign(relayout, {
      "xaxis.domain": domainX,
      "yaxis.domain": domainY,
    });
    const meta = host?.layout?.meta || {};
    const halfExtent = Number(meta.topoExtentKm) / 2;
    if (Number.isFinite(halfExtent) && halfExtent > 0) {
      relayout["xaxis.range"] = [-halfExtent, halfExtent];
      relayout["yaxis.range"] = [-halfExtent, halfExtent];
      relayout["xaxis.autorange"] = false;
      relayout["yaxis.autorange"] = false;
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

function relayoutTopoMapPanel(host) {
  const patch = buildTopoMapPanelRelayout(host);
  if (!host || !Object.keys(patch).length) {
    return Promise.resolve();
  }

  return Plotly.relayout(host, patch).then(() => {
    if (!host.layout?.polar || !Array.isArray(host.layout.images) || !host.layout.images.length) {
      return;
    }
    alignPolarBackgroundImages({ layout: host.layout }, TOPO_MAP_PANEL.backgroundScale);
    const images = host.layout.images;
    const imagePatch = {};
    images.forEach((image, index) => {
      imagePatch[`images[${index}].x`] = image.x;
      imagePatch[`images[${index}].y`] = image.y;
      imagePatch[`images[${index}].sizex`] = image.sizex;
      imagePatch[`images[${index}].sizey`] = image.sizey;
    });
    if (Object.keys(imagePatch).length) {
      return Plotly.relayout(host, imagePatch);
    }
  });
}

function lightningColorbarDtick(zmin, zmax) {
  const span = Math.max(1, (Number(zmax) || 1) - (Number(zmin) || 0));
  const targetTicks = 5;
  const raw = span / targetTicks;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  let step = magnitude;
  if (normalized <= 1) {
    step = magnitude;
  } else if (normalized <= 2) {
    step = 2 * magnitude;
  } else if (normalized <= 5) {
    step = 5 * magnitude;
  } else {
    step = 10 * magnitude;
  }
  return step;
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

function applyLightningHeatmapRingOverlays(figure) {
  figure.layout = figure.layout || {};
  const radii = LIGHTNING_HEATMAP_RING_RADII_KM;
  const nonRingShapes = (figure.layout.shapes || []).filter(
    (shape) => !(shape?.type === "circle" && shape?.xref === "x" && shape?.yref === "y"),
  );
  const ringShapes = radii.map((radius) => ({
    type: "circle",
    xref: "x",
    yref: "y",
    x0: -radius,
    y0: -radius,
    x1: radius,
    y1: radius,
    line: { color: "rgba(255,255,255,0.9)", width: 1.5 },
    fillcolor: "rgba(0,0,0,0)",
  }));
  figure.layout.shapes = [...ringShapes, ...nonRingShapes];
  figure.layout.annotations = (figure.layout.annotations || []).filter(
    (entry) => !(entry?.xref === "x" && entry?.yref === "y" && radii.includes(Number(entry?.y))),
  );
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
  const dtick = lightningColorbarDtick(resolvedZmin, resolvedZmax);
  trace.colorbar = {
    ...(trace.colorbar || {}),
    title: { text: "Strike count" },
    tickmode: "linear",
    tick0: Math.floor(resolvedZmin / dtick) * dtick,
    dtick,
    x: 1.02,
    xanchor: "left",
    y: 0.5,
    yanchor: "middle",
    len: 0.75,
  };

  figure.layout = figure.layout || {};
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
    range: [-halfExtent, halfExtent],
    scaleanchor: "y",
    scaleratio: 1,
    autorange: false,
    tickmode: "array",
    tickvals: [0],
    ticktext: [""],
  };
  figure.layout.yaxis = {
    ...(figure.layout.yaxis || {}),
    range: [-halfExtent, halfExtent],
    autorange: false,
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
      Plotly.restyle(host, lightningHeatmapRestylePatch(null, { zmin: resolvedMin, zmax: resolvedMax }), [chromeIndex]),
    ]);
  }
  return Plotly.restyle(host, lightningHeatmapRestylePatch(null, { zmin, zmax }), [indices[0]]);
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

  return {
    margin: { ...TOPO_MAP_PANEL.margin },
    height: chartHeight ?? figure?.layout?.height,
    polarDomain: {
      x: TOPO_MAP_PANEL.plotDomain.x.slice(),
      y: TOPO_MAP_PANEL.plotDomain.y.slice(),
    },
    radialRange: windRoseRadialRange(radialMax),
    radialMax,
  };
}

function applyWindRoseRadialLayout(figure) {
  if (!figure?.layout?.polar) {
    return;
  }

  const radialRange = windRoseRadialRange(windRoseRadialMax(figure));
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
  applyWindRoseRadialLayout(figure);
}

function isWindRoseChartHost(host) {
  return host?.dataset?.figureId === "wind_rose";
}

function airportTopoUrl(icao) {
  return `data-lite/${icao}/topo.png`;
}

async function loadAirportTopo(icao) {
  const code = String(icao || "").trim().toUpperCase();
  if (!code) {
    throw new Error("Missing ICAO for topo load");
  }
  if (airportTopoCache.has(code)) {
    return airportTopoCache.get(code);
  }

  const url = airportTopoUrl(code);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Topo not found for ${code}`);
  }

  airportTopoCache.set(code, url);
  return url;
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
    range: [-halfExtent, halfExtent],
    scaleanchor: "y",
    scaleratio: 1,
    autorange: false,
    tickmode: "array",
    tickvals: [0],
    ticktext: [""],
  };
  figure.layout.yaxis = {
    ...(figure.layout.yaxis || {}),
    range: [-halfExtent, halfExtent],
    autorange: false,
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
    windRosePlayback.liteHourlyMap = hDataMap;
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
    if (dailyWrFig?.figure) {
      state.windRoseLayoutRef[section] = extractWindRoseLayoutSnapshot(dailyWrFig.figure, section);
    }
    applyWindRoseLayout(hourlyWrFig.figure, section, state.windRoseLayoutRef[section]);
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
      const card = entry.target;
      const host = card.querySelector(".chart");
      if (!host || card.classList.contains("hidden")) {
        return;
      }

      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      const prev = lastSizes.get(card);
      if (prev && prev.width === width && prev.height === height) {
        return;
      }

      lastSizes.set(card, { width, height });
      if (shouldSkipLightningHourlyTopoRelayout(host)) {
        return;
      }
      if (host.dataset?.figureId === "lightning_heatmap" && shouldUseHourlyLightningHeatmap()) {
        // Resize the static base, then rebuild the overlay against the new geometry.
        scheduleHostResize(host, { mode: "resize" })
          .then(() => relayoutTopoMapPanel(host))
          .then(() => awaitLayoutSettle())
          .then(() => enterLightningHourlyOverlayCurrent(host));
        return;
      }
      if (isWindRoseChartHost(host)) {
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
  stopWindRosePlayback();
  stopLightningPlayback();
  clearChartAxisLocks();
  const icao = els.icao.value;
  const section = state.requestedSection;
  if (state.displayedSection !== section) {
    resetMaximizedChartState();
    resetWindRoseModeOnSectionChange(section);
    resetLightningHeatmapModeOnSectionChange(section);
  }
  const season = els.season.value;

  showLoading("Fetching static data...");
  try {
    let data = await assembleLiteFigures(icao, section, season);

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
      await applyHourlyWindRoseOverride(data, icao, season);
    }

    if (shouldUseHourlyLightningHeatmap(section)) {
      await applyHourlyLightningHeatmapOverride(data, icao, season);
    }

    if (data.error) {
      throw new Error(data.error);
    }

    state.displayedSection = section;
    applySectionLayout();
    await drawCharts(data.figures || [], section);
    renderMetrics(data.metrics || {}, section);
    setStatus("");
    hideLoading();
  } catch (e) {
    console.error(e);
    if (!isBenignChartRenderError(e)) {
      setStatus(`Error: ${e.message}`);
    } else {
      setStatus("");
    }
    hideLoading();
  }
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

  const showOverlay = true;
  const requestedSection = state.requestedSection;
  if (state.displayedSection !== requestedSection) {
    resetMaximizedChartState();
    resetWindRoseModeOnSectionChange(requestedSection);
  }

  const controller = new AbortController();
  if (pendingFetch) {
    pendingFetch.abort();
  }
  pendingFetch = controller;

  if (showOverlay) {
    showLoading("Loading charts...");
  }

  try {
    const batches = getSectionFigureBatches(requestedSection);
    const allFigures = [];
    let combinedMetrics = {};
    let combinedWarning = "";

    if (shouldUseHourlyWindRose(requestedSection)) {
      await fetchWindRoseDailySnapshot(requestedSection, controller.signal);
      if (controller.signal.aborted) {
        return;
      }
    }

    if (showOverlay) {
      setLoadingState(20, `Processing data (0/${batches.length})...`);
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

      return fetch(apiUrl(`/api/charts?${params.toString()}`), { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          completedBatches += 1;
          if (!controller.signal.aborted && showOverlay) {
            const batchProgress = 20 + Math.floor((completedBatches / batches.length) * 45);
            setLoadingState(batchProgress, `Processing data (${completedBatches}/${batches.length})...`);
          }
          return { index, data };
        });
    });

    const batchResults = await Promise.all(batchPromises);

    if (controller.signal.aborted) {
      return;
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

    const data = {
      figures: allFigures,
      metrics: combinedMetrics,
      warning: combinedWarning,
    };
    if (showOverlay) {
      setLoadingState(82, "Rendering charts...");
    }

    if (controller.signal.aborted) {
      return;
    }

    if (data.error) {
      setStatus(data.error);
      return;
    }

    if (data.warning) {
      setStatus(data.warning);
    } else {
      setStatus("");
    }

    // Ensure section-specific layout/toolbars are applied before Plotly sizing.
    state.displayedSection = requestedSection;
    applySectionLayout(requestedSection);

    await drawCharts(data.figures || [], requestedSection);

    if (controller.signal.aborted) {
      return;
    }

    renderMetrics(data.metrics, requestedSection);
  } catch (err) {
    if (err.name !== "AbortError") {
      if (err?.message && !isBenignChartRenderError(err)) {
        setStatus(err.message);
        return;
      }
      if (isBenignChartRenderError(err)) {
        setStatus("");
        return;
      }
      if (window.location.hostname.endsWith("github.io") && !API_BASE) {
        setStatus("Failed to load charts. Set AVCLIMATE_API_BASE in config.js to your deployed backend URL.");
      } else {
        setStatus("Failed to load charts.");
      }
    }
  } finally {
    if (pendingFetch === controller) {
      pendingFetch = null;
      if (showOverlay) {
        hasShownInitialLoading = true;
        hideLoading();
      }
    }
  }
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

  renderErrorBarsToggle();

  if (els.errorBarsToggle) {
    els.errorBarsToggle.addEventListener("click", () => {
      state.showErrorBars = !state.showErrorBars;
      renderErrorBarsToggle();
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
    lightningPlayback.liteHourlyMap = null;
    lightningPlayback.liteHourlyIcao = null;
    resetLightningHourlyLayoutState();
    state.lhMode = "summary";
    state.lightningHeatmapScaleRef = null;
    state.lightningHeatmapSummaryLayoutRef = null;
    clearChartLegendVisibility();
    clearChartAxisLocks();
    if (els.infoOverlay && !els.infoOverlay.classList.contains("hidden")) {
      renderInfoModalContent();
    }
    fetchCharts();
  });
  els.season.addEventListener("change", refreshSeasonSelection);

  if (!state.liteMode) {
    [els.enso, els.iod, els.sam, els.mjo].forEach((el) => {
      el.addEventListener("change", () => scheduleFetchCharts(DRIVER_FETCH_DEBOUNCE_MS));
    });
  }

  [
    [els.yearStart, "year-start"],
    [els.yearEnd, "year-end"],
    [els.monthStart, "month-start"],
    [els.monthEnd, "month-end"],
    [els.hourStart, "hour-start"],
    [els.hourEnd, "hour-end"],
  ].forEach(([el, field]) => {
    el.addEventListener("input", () => {
      normalizeRanges(field);
      updateSliderLabels();
    });
    el.addEventListener("change", () => {
      normalizeRanges(field);
      updateSliderLabels();
      fetchCharts();
    });
  });

  [els.invertMonth, els.invertHour].forEach((el) => {
    el.addEventListener("change", () => {
      updateSliderLabels();
      fetchCharts();
    });
  });

  let resizeFrame = null;
  window.addEventListener("resize", () => {
    if (resizeFrame) {
      cancelAnimationFrame(resizeFrame);
    }
    resizeFrame = requestAnimationFrame(() => {
      applyChartShellHeights(state.displayedSection);
      if (state.latestFigures.length) {
        els.charts.forEach((host, index) => {
          if (index < state.latestFigures.length && !chartUi[index].card.classList.contains("hidden")) {
            if (isWindRoseChartHost(host)) {
              const chartHeight = getChartHeight(state.displayedSection);
              Plotly.relayout(host, { height: chartHeight })
                .then(() => scheduleWindRoseResize(host));
              return;
            }
            if (host.dataset?.figureId === "scatter_wind_dewpt") {
              const chartHeight = getChartHeight(state.displayedSection);
              Plotly.relayout(host, { height: chartHeight })
                .then(() => relayoutScatterWindDewptAxes(host));
              return;
            }
            let resizeOptions = {};
            if (usesDualAxisPairedBarOverlays(host)) {
              resizeOptions = { mode: "resize" };
            } else if (strictGroupedBarOverlayFigureIds.has(host.dataset?.figureId || "")) {
              resizeOptions = { recalibrateFrame: true };
            }
            scheduleHostResize(host, resizeOptions);
          }
        });
      }
      resizeFrame = null;
    });
  });
}

async function init() {
  try {
    const isLite = await checkLiteMode();
    await loadAirportCoverage();
    if (isLite) {
        // In lite mode, we skip fetchOptions and use the manifest.
        // Initialize minimal options so month slider labels work correctly.
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
                opt.textContent = icao;
                icaoSelect.appendChild(opt);
            });
            const defaultIcao = (state.manifest.default && state.manifest.default.airport) || manifestIcaos[0];
            icaoSelect.value = defaultIcao;
        }
        if (state.manifest?.default?.season && els.season) {
            els.season.value = state.manifest.default.season;
        }
        applySeasonMonthRange();
        applySectionLayout();
        applyChartShellHeights();
        initializeChartContainerResizeObservers();
        wireControls();
        fetchCharts();
        return;
    }

    renderCategories();
    await fetchOptions();
    applySeasonMonthRange();
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

