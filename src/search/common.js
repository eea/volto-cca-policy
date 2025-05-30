import { eea_languages } from '@eeacms/volto-cca-policy/constants';
import { booleanFacet } from '@eeacms/search';
import { getTodayWithTime } from './utils';

import { defineMessages, FormattedMessage } from 'react-intl';

const messages = defineMessages({
  countries: {
    id: 'Countries',
    defaultMessage: 'Countries',
  },
  climateImpacts: {
    id: 'Climate Impacts',
    defaultMessage: 'Climate Impacts',
  },
  adaptationSectors: {
    id: 'Adaptation Sectors',
    defaultMessage: 'Adaptation Sectors',
  },
  includeArchivedContent: {
    id: 'Include archived content',
    defaultMessage: 'Include archived content',
  },
  typeOfItem: {
    id: 'Type of item',
    defaultMessage: 'Type of item',
  },
  language: {
    id: 'Language',
    defaultMessage: 'Language',
  },
  Published: {
    id: 'Published',
    defaultMessage: 'Published',
  },
});

export const geographic_countries = {
  field: 'cca_geographic_countries.keyword',
  factory: 'MultiTermFacet',
  label: messages.countries,
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
};

export const cca_climate_impacts = {
  field: 'cca_climate_impacts.keyword',
  factory: 'MultiTermFacet',
  label: messages.climateImpacts,
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
};

export const cca_adaptation_sectors = {
  field: 'cca_adaptation_sectors.keyword',
  factory: 'MultiTermFacet',
  label: messages.adaptationSectors,
  showInFacetsList: true,
  filterType: 'all',
  isFilterable: false,
  show: 10000,
  isMulti: true,
};

export const include_archived = booleanFacet(() => ({
  field: 'IncludeArchived',
  label: messages.includeArchivedContent,
  id: 'IncludeArchived',
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

export const objectProvides = {
  field: 'objectProvides',
  factory: 'MultiTermFacet',
  label: messages.typeOfItem,
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
  iconsFamily: 'Content types',
  optionsFilter: 'typesForClustersOptionsFilter',
};

export const issued_date = {
  field: 'issued.date',
  factory: 'DropdownRangeFilter',
  wrapper: 'DummySUIFacetWrapper',
  label: ' ',
  showInFacetsList: false,
  filterType: 'any',
  isFilterable: false,
  activeFilterLabel: messages.Published,
  isFilter: true,
  showInSecondaryFacetsList: true,
  isMulti: false,
  ignoreFromNlp: true,
  ranges: [
    {
      label: <FormattedMessage id="All time" defaultMessage="All time" />,
      key: 'All time',
    },
    {
      label: <FormattedMessage id="Last week" defaultMessage="Last week" />,

      key: 'Last week',
      from: 'now-1w',
      to: 'now',
    },
    {
      label: <FormattedMessage id="Last month" defaultMessage="Last month" />,
      key: 'Last month',
      from: 'now-1m',
      to: 'now',
    },
    {
      label: (
        <FormattedMessage id="Last 3 months" defaultMessage="Last 3 months" />
      ),
      key: 'Last 3 months',
      from: 'now-3m',
      to: 'now',
    },
    {
      label: <FormattedMessage id="Last year" defaultMessage="Last year" />,
      key: 'Last year',
      from: 'now-1y',
      to: 'now',
    },
    {
      label: (
        <FormattedMessage id="Last 2 years" defaultMessage="Last 2 years" />
      ),
      key: 'Last 2 years',
      from: 'now-2y',
      to: 'now',
    },
    {
      label: (
        <FormattedMessage id="Last 5 years" defaultMessage="Last 5 years" />
      ),
      key: 'Last 5 years',
      from: 'now-5y',
      to: 'now',
    },
  ],
  default: {
    values: ['All time'],
    type: 'any',
  },
};

export const language = {
  field: 'language',
  factory: 'MultiTermFacet',
  label: messages.language,
  showInFacetsList: false,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
  default: (options) => {
    const { language } = options || {};
    // console.log('options', options);

    return {
      values: [language || 'en'],
      type: 'any',
    };
  },
  facetValues: eea_languages.map(({ code }) => code),
  sortOn: 'custom',
  sortOnCustomLabel: 'Alphabetical',
};

// [
//     'de',
//     'en',
//     'es',
//     'fr',
//     'it',
//     'pl',
//     // 'ar',
//     // 'bg',
//     // 'bs',
//     // 'cs',
//     // 'da',
//     // 'el',
//     // 'et',
//     // 'fi',
//     // 'ga',
//     // 'hr',
//     // 'hu',
//     // 'is',
//     // 'lt',
//     // 'lv',
//     // 'mk',
//     // 'mt',
//     // 'nl',
//     // 'no',
//     // 'pt',
//     // 'ro',
//     // 'ru',
//     // 'sh',
//     // 'sk',
//     // 'sl',
//     // 'sq',
//     // 'sr',
//     // 'sv',
//     // 'tr',
//   ]
