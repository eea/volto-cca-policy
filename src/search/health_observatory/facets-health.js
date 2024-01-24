import { booleanFacet } from '@eeacms/search';
import { getTodayWithTime } from './../utils';

const issued_date = {
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

const op_cluster = {
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

const healthImpacts = {
  field: 'cca_health_impacts.keyword',
  factory: 'MultiTermFacet',
  label: 'Health impacts',
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
  // sortOn: 'custom',
  // sortOnCustomLabel: 'Alphabetical',
};

const partnerContributions = {
  field: 'cca_partner_contributors.keyword',
  factory: 'MultiTermFacet',
  label: 'Observatory partner',
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
  // sortOn: 'custom',
  // sortOnCustomLabel: 'Alphabetical',
};

const year = {
  field: 'year',
  factory: 'HistogramFacet',
  label: 'Publishing year',
  height: 100,
  showInFacetsList: true,
  isFilterable: false,
  isMulti: true,
  ranges: [
    {
      from: 1994,
      to: 1995,
    },
    {
      from: 1995,
      to: 1996,
    },
    {
      from: 1996,
      to: 1997,
    },
    {
      from: 1997,
      to: 1998,
    },
    {
      from: 1998,
      to: 1999,
    },
    {
      from: 1999,
      to: 2000,
    },
    {
      from: 2000,
      to: 2001,
    },
    {
      from: 2001,
      to: 2002,
    },
    {
      from: 2002,
      to: 2003,
    },
    {
      from: 2003,
      to: 2004,
    },
    {
      from: 2004,
      to: 2005,
    },
    {
      from: 2005,
      to: 2006,
    },
    {
      from: 2006,
      to: 2007,
    },
    {
      from: 2007,
      to: 2008,
    },
    {
      from: 2008,
      to: 2009,
    },
    {
      from: 2009,
      to: 2010,
    },
    {
      from: 2010,
      to: 2011,
    },
    {
      from: 2011,
      to: 2012,
    },
    {
      from: 2012,
      to: 2013,
    },
    {
      from: 2013,
      to: 2014,
    },
    {
      from: 2014,
      to: 2015,
    },
    {
      from: 2015,
      to: 2016,
    },
    {
      from: 2016,
      to: 2017,
    },
    {
      from: 2017,
      to: 2018,
    },
    {
      from: 2018,
      to: 2019,
    },
    {
      from: 2019,
      to: 2020,
    },
    {
      from: 2020,
      to: 2021,
    },
    {
      from: 2021,
      to: 2022,
    },
    {
      from: 2022,
      to: 2023,
    },
  ],
  step: 10,
  aggs_script:
    "def vals = doc['year']; if (vals.length == 0){return 2500} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2500);}return ret;}",
};

const facets = [
  {
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
  },
  {
    field: 'cca_health_impacts.keyword',
    factory: 'MultiTermFacet',
    label: 'Health impacts',
    showInFacetsList: true,
    filterType: 'any',
    isFilterable: false,
    show: 10000,
    isMulti: true,
    // sortOn: 'custom',
    sortOnCustomLabel: 'Alphabetical',
    alwaysVisible: true,
  },
  {
    field: 'cca_partner_contributors.keyword',
    factory: 'MultiTermFacet',
    label: 'Observatory partner',
    showInFacetsList: true,
    filterType: 'any',
    isFilterable: false,
    show: 10000,
    isMulti: true,
    // sortOn: 'custom',
    sortOnCustomLabel: 'Alphabetical',
    alwaysVisible: true,
  },
  {
    field: 'year',
    factory: 'HistogramFacet',
    label: 'Publishing year',
    height: 100,
    showInFacetsList: true,
    isFilterable: false,
    isMulti: true,
    ranges: [
      {
        from: 1994,
        to: 1995,
      },
      {
        from: 1995,
        to: 1996,
      },
      {
        from: 1996,
        to: 1997,
      },
      {
        from: 1997,
        to: 1998,
      },
      {
        from: 1998,
        to: 1999,
      },
      {
        from: 1999,
        to: 2000,
      },
      {
        from: 2000,
        to: 2001,
      },
      {
        from: 2001,
        to: 2002,
      },
      {
        from: 2002,
        to: 2003,
      },
      {
        from: 2003,
        to: 2004,
      },
      {
        from: 2004,
        to: 2005,
      },
      {
        from: 2005,
        to: 2006,
      },
      {
        from: 2006,
        to: 2007,
      },
      {
        from: 2007,
        to: 2008,
      },
      {
        from: 2008,
        to: 2009,
      },
      {
        from: 2009,
        to: 2010,
      },
      {
        from: 2010,
        to: 2011,
      },
      {
        from: 2011,
        to: 2012,
      },
      {
        from: 2012,
        to: 2013,
      },
      {
        from: 2013,
        to: 2014,
      },
      {
        from: 2014,
        to: 2015,
      },
      {
        from: 2015,
        to: 2016,
      },
      {
        from: 2016,
        to: 2017,
      },
      {
        from: 2017,
        to: 2018,
      },
      {
        from: 2018,
        to: 2019,
      },
      {
        from: 2019,
        to: 2020,
      },
      {
        from: 2020,
        to: 2021,
      },
      {
        from: 2021,
        to: 2022,
      },
      {
        from: 2022,
        to: 2023,
      },
    ],
    step: 10,
    aggs_script:
      "def vals = doc['year']; if (vals.length == 0){return 2500} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2500);}return ret;}",
  },
  ...special,
];

export default facets;
