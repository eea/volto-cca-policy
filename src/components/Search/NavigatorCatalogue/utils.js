/**
 * Color scale for tool counts (EEA green tones)
 * Used by the map view to color-code countries
 */
export const mapColorScale = [
  { minimum: 10, label: '10 or more', color: '#0F6B3F' },
  { minimum: 7, label: '7 - 9', color: '#007B6C' },
  { minimum: 4, label: '4 - 6', color: '#84C79A' },
  { minimum: 1, label: '1 - 3', color: '#C2E3CD' },
  { minimum: 0, label: 'None', color: '#E1E7DF' },
];

export const getColorForCount = (count) =>
  mapColorScale.find(({ minimum }) => count >= minimum)?.color ||
  mapColorScale.at(-1).color;

/**
 * Normalize country names between GeoJSON and facet data
 */
export const normalizeCountryName = (name) => {
  if (!name) return name;
  const normalizer = {
    Türkiye: 'Turkey',
    'United Kingdom': 'United Kingdom',
    'Czech Rep.': 'Czechia',
    'Bosnia and Herz.': 'Bosnia and Herzegovina',
  };
  return normalizer[name] || name;
};

/**
 * Build a country -> count lookup from facet data
 * @param {Object} facets - searchContext.facets
 * @returns {Object} countryName -> count
 */
export const buildCountryCounts = (facets) => {
  const countriesFacetArray = facets?.['cca_geographic_countries.keyword'];
  const countriesFacet = Array.isArray(countriesFacetArray)
    ? countriesFacetArray[0]
    : countriesFacetArray;
  const countryData = countriesFacet?.data || [];

  const counts = {};
  countryData.forEach((entry) => {
    counts[entry.value] = entry.count;
  });
  return counts;
};

/**
 * Legend items for the map view
 */
export const mapLegendItems = mapColorScale.map(({ label, color }) => ({
  label,
  color,
}));

const unwrapRawValue = (value) =>
  value?.raw === undefined ? value : value.raw;

export const rawValueAsArray = (value) => {
  const raw = unwrapRawValue(value);
  if (!raw) return [];
  return Array.isArray(raw) ? raw.filter(Boolean) : [raw].filter(Boolean);
};

export const asArray = (value) =>
  rawValueAsArray(value).map((value) => value?.title || value?.token || value);

export const arrayFieldToString = (value) => asArray(value).join(', ');

export const formatFunctionalityScore = (value) => {
  const raw = unwrapRawValue(value);
  const score = raw === null || raw === undefined ? Number.NaN : Number(raw);

  return Number.isFinite(score) ? `${Math.min(6, Math.max(0, score))}/6` : '—';
};

export const escapeCsvValue = (value) => {
  const stringValue = value === undefined || value === null ? '' : `${value}`;
  return `"${stringValue.replace(/"/g, '""')}"`;
};

export const downloadCsv = (filename, rows) => {
  const csv = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

export const getLocalizedLandingPageURL = (appConfig, currentLang = 'en') => {
  const lang = currentLang || 'en';
  const landingPageURL =
    appConfig?.landingPageURL || '/en/navigator/tool-catalogue';

  return landingPageURL.replace(/^\/en(?=\/|$)/, `/${lang}`);
};

export const getComparePageURL = (appConfig, currentLang = 'en') => {
  const lang = currentLang || 'en';
  const comparePageURL = appConfig?.comparePageURL || '/en/navigator/compare';

  return comparePageURL.replace(/^\/en(?=\/|$)/, `/${lang}`);
};

export const exportComparisonTable = (tools, getToolField) => {
  const rows = [
    ['Criteria', ...tools.map((tool) => tool.title)],
    [
      'Usability',
      ...tools.map((tool) =>
        arrayFieldToString(getToolField(tool, 'accessibility_and_usability')),
      ),
    ],
    [
      'Functionality',
      ...tools.map((tool) =>
        formatFunctionalityScore(getToolField(tool, 'functionality')),
      ),
    ],
    [
      'Spatial scale',
      ...tools.map((tool) =>
        arrayFieldToString(getToolField(tool, 'cca_geographical_scale')),
      ),
    ],
    [
      'Output type',
      ...tools.map((tool) =>
        arrayFieldToString(getToolField(tool, 'cca_type_of_outputs')),
      ),
    ],
    [
      'Adaptation support cycle step',
      ...tools.map((tool) =>
        arrayFieldToString(
          getToolField(tool, 'cca_adaptation_support_cycle_step'),
        ),
      ),
    ],
    [
      'Sector',
      ...tools.map((tool) =>
        arrayFieldToString(getToolField(tool, 'cca_adaptation_sectors')),
      ),
    ],
  ];

  downloadCsv('navigator-catalogue-comparison.csv', rows);
};
