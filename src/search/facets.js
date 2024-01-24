import { booleanFacet } from '@eeacms/search';
import { getTodayWithTime } from './utils';

const adaptation_sectors = {
  field: 'cca_adaptation_sectors.keyword',
  factory: 'MultiTermFacet',
  label: 'Adaptation Sectors',
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: true,
  show: 10000,
  isMulti: true,
  // blacklist: ['reporting', 'Default'],
  showAllOptions: true,
  alwaysVisible: true,
};

const include_archived = booleanFacet(() => ({
  field: 'IncludeArchived',
  label: 'Include archived content',
  id: 'archived-facet',
  showInFacetsList: false,
  showInSecondaryFacetsList: true,
  isFilter: true, // filters don't need facet options to show up

  // we want this to be applied by default
  // when the facet is checked, then apply the `on` key:
  off: {
    constant_score: {
      filter: {
        bool: {
          should: [
            { bool: { must_not: { exists: { field: 'expires' } } } },
            // Functions should be supported in the buildFilters
            { range: { expires: { gte: getTodayWithTime() } } },
          ],
        },
      },
    },
  },
  on: null,
}));

const clusters = {
  field: 'op_cluster',
  factory: 'MultiTermFacet',
  isFilterable: true,
  isMulti: true,
  label: 'Section',
  show: 10000,
  showInFacetsList: false,
  ignoreNLPWhenActive: true,
  blacklist: ['Others', 'Publications'],
};

const objectProvides = {
  field: 'objectProvides',
  factory: 'MultiTermFacet',
  label: 'Type of item',
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
  iconsFamily: 'Content types',
  optionsFilter: 'typesForClustersOptionsFilter',
};

const issued = {
  field: 'issued.date',
  factory: 'DropdownRangeFilter',
  wrapper: 'DummySUIFacetWrapper',
  label: ' ',
  showInFacetsList: false,
  filterType: 'any',
  isFilterable: false,
  activeFilterLabel: 'Published',
  isFilter: true,
  showInSecondaryFacetsList: true,
  isMulti: false,
  ignoreFromNlp: true,
  ranges: [
    {
      key: 'All time',
    },
    {
      key: 'Last week',
      from: 'now-1w',
      to: 'now',
    },
    {
      key: 'Last month',
      from: 'now-1m',
      to: 'now',
    },
    {
      key: 'Last 3 months',
      from: 'now-3m',
      to: 'now',
    },
    {
      key: 'Last year',
      from: 'now-1y',
      to: 'now',
    },
    {
      key: 'Last 2 years',
      from: 'now-2y',
      to: 'now',
    },
    {
      key: 'Last 5 years',
      from: 'now-5y',
      to: 'now',
    },
  ],
  default: {
    values: ['Last 5 years'],
    type: 'any',
  },
};

const climate_impacts = {
  field: 'cca_climate_impacts.keyword',
  factory: 'MultiTermFacet',
  label: 'Climate impacts',
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
  // sortOn: 'custom',
  // sortOnCustomLabel: 'Alphabetical',
  alwaysVisible: true,
};

const transnational_regions = {
  field: 'cca_geographic_transnational_region.keyword',
  factory: 'MultiTermFacet',
  label: 'Transnational regions',
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
  // sortOn: 'custom',
  // sortOnCustomLabel: 'Alphabetical',
};

const adaptation_elements = {
  field: 'cca_adaptation_elements.keyword',
  factory: 'MultiTermFacet',
  label: 'Adaptation Elements',
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
  // sortOn: 'custom',
  // sortOnCustomLabel: 'Alphabetical',
};

const key_type_measure = {
  field: 'cca_key_type_measure.keyword',
  factory: 'MultiTermFacet',
  label: 'Key Type Measure',
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
  // sortOn: 'custom',
  // sortOnCustomLabel: 'Alphabetical',
};

const funding_programme = {
  field: 'cca_funding_programme.keyword',
  factory: 'MultiTermFacet',
  label: 'Funding Programme',
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
  // sortOn: 'custom',
  // sortOnCustomLabel: 'Alphabetical',
};

const origin_websites = {
  field: 'cca_origin_websites.keyword',
  factory: 'MultiTermFacet',
  label: 'Item from third parties',
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
  // sortOn: 'custom',
  // sortOnCustomLabel: 'Alphabetical',
};

const geographic_countries = {
  field: 'cca_geographic_countries.keyword',
  factory: 'MultiTermFacet',
  label: 'Countries',
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
  // sortOn: 'custom',
  // sortOnCustomLabel: 'Alphabetical',
};

const language = {
  field: 'language',
  factory: 'MultiTermFacet',
  label: 'Language',
  showInFacetsList: false,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
  default: {
    values: ['en'],
    type: 'any',
  },
  facetValues: [
    'ar',
    'sr',
    'sq',
    'bg',
    'bs',
    'cs',
    'hr',
    'da',
    'nl',
    'el',
    'en',
    'et',
    'fi',
    'fr',
    'ga',
    'de',
    'hu',
    'is',
    'it',
    'lv',
    'lt',
    'mk',
    'mt',
    'no',
    'pl',
    'pt',
    'ro',
    'ru',
    'sh',
    'sk',
    'sl',
    'es',
    'sv',
    'tr',
  ],
  sortOn: 'custom',
  sortOnCustomLabel: 'Alphabetical',
};

const facets = [
  adaptation_sectors,
  include_archived,
  // clusters,
  objectProvides,
  issued,
  climate_impacts,
  transnational_regions,
  adaptation_elements,
  key_type_measure,
  funding_programme,
  origin_websites,
  geographic_countries,
  language,
];

export default facets;
