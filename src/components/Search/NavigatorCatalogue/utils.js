import { addFilterParams } from '@eeacms/volto-cca-policy/search/queryUtils';

/**
 * Color scale for tool counts (EEA green tones)
 * Used by the map view to color-code countries
 */
export const mapColorScale = [
  {
    minimum: 4,
    label: '4 or more',
    messageKey: 'fourOrMore',
    color: '#0F6B3F',
  },
  { minimum: 3, label: '3', color: '#007B6C' },
  { minimum: 2, label: '2', color: '#84C79A' },
  { minimum: 1, label: '1', color: '#C2E3CD' },
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

export const filterCountryCounts = (countryCounts, filters) => {
  const selectedCountries =
    filters?.find(({ field }) => field === 'cca_geographic_countries.keyword')
      ?.values || [];

  if (!selectedCountries.length) return countryCounts;

  return Object.fromEntries(
    selectedCountries
      .filter((country) => countryCounts[country] !== undefined)
      .map((country) => [country, countryCounts[country]]),
  );
};

const mapIncompatibleGeographicFields = new Set([
  'cca_navigator_geographic_scope',
  'cca_geographic_transnational_region.keyword',
]);

export const hasMapIncompatibleGeographicSelection = (filters) =>
  Boolean(
    filters?.find(
      ({ field, values }) =>
        mapIncompatibleGeographicFields.has(field) && values?.length > 0,
    ),
  );

export const clearMapIncompatibleGeographicFilters = (searchContext) => {
  searchContext?.filters
    ?.filter(
      ({ field, values }) =>
        mapIncompatibleGeographicFields.has(field) && values?.length > 0,
    )
    .forEach(({ field, type = 'any' }) =>
      searchContext.removeFilter(field, null, type),
    );
};

export const setCountryFilter = (searchContext, countryName) => {
  searchContext?.setFilter(
    'cca_geographic_countries.keyword',
    countryName,
    'any',
  );
};

/**
 * Legend items for the map view
 */
export const mapLegendItems = mapColorScale.map(
  ({ label, messageKey, color }) => ({
    label,
    messageKey,
    color,
  }),
);

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
  return `"${stringValue.replaceAll('"', '""')}"`;
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

export const getNavigatorCataloguePageURL = (currentLang = 'en') => {
  const lang = currentLang || 'en';

  return `/${lang}/navigator/tool-catalogue`;
};

export const getEuropeanWideToolsSearchState = (currentLang = 'en') => {
  const lang = currentLang || 'en';

  return {
    current: 1,
    filters: [
      { field: 'language', type: 'any', values: [lang] },
      {
        field: 'cca_navigator_geographic_scope',
        type: 'any',
        values: ['Europe'],
      },
    ],
    searchTerm: '',
    sortField: 'title.index',
    sortDirection: 'asc',
    sortList: null,
  };
};

export const getEuropeanWideToolsURL = (currentLang = 'en') => {
  const lang = currentLang || 'en';
  const { filters, sortDirection, sortField } =
    getEuropeanWideToolsSearchState(lang);
  const params = new URLSearchParams();

  params.set('size', 'n_10_n');
  addFilterParams(params, filters);
  params.set('sort-field', sortField);
  params.set('sort-direction', sortDirection);

  return `${getNavigatorCataloguePageURL(lang)}?${params.toString()}`;
};

export const getComparePageURL = (currentLang = 'en') => {
  const lang = currentLang || 'en';

  return `/${lang}/navigator/compare`;
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
  ];

  downloadCsv('navigator-catalogue-comparison.csv', rows);
};
