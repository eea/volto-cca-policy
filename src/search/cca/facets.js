import {
  objectProvides,
  language,
  issued_date,
  geographic_countries,
} from '../common';

import { defineMessages } from 'react-intl';

const messages = defineMessages({
  adaptationApproaches: {
    id: 'Adaptation Approaches',
    defaultMessage: 'Adaptation Approaches',
  },
  adaptationSectors: {
    id: 'Adaptation Sectors',
    defaultMessage: 'Adaptation Sectors',
  },
  climateImpacts: {
    id: 'Climate Impacts',
    defaultMessage: 'Climate Impacts',
  },
  fundingProgramme: {
    id: 'Funding Programme',
    defaultMessage: 'Funding Programme',
  },
  itemFromThirdParties: {
    id: 'Item from third parties',
    defaultMessage: 'Item from third parties',
  },
  keyTypeMeasure: {
    id: 'Key Type Measure',
    defaultMessage: 'Key Type Measure',
  },
  section: {
    id: 'Section',
    defaultMessage: 'Section',
  },
  transnationalRegions: {
    id: 'Transnational regions',
    defaultMessage: 'Transnational regions',
  },
});

const op_cluster = {
  field: 'op_cluster',
  factory: 'MultiTermFacet',
  isFilterable: true,
  isMulti: true,
  label: messages.section,
  show: 10000,
  showInFacetsList: false,
  ignoreNLPWhenActive: true,
  blacklist: ['Others', 'Publications'],
};

const adaptation_sectors = {
  field: 'cca_adaptation_sectors.keyword',
  factory: 'MultiTermFacet',
  label: messages.adaptationSectors,
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: true,
  show: 10000,
  isMulti: true,
  // blacklist: ['reporting', 'Default'],
  showAllOptions: true,
  alwaysVisible: true,
};

const climate_impacts = {
  field: 'cca_climate_impacts.keyword',
  factory: 'MultiTermFacet',
  label: messages.climateImpacts,
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
  label: messages.transnationalRegions,
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
  label: messages.adaptationApproaches,
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
  label: messages.keyTypeMeasure,
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
  label: messages.fundingProgramme,
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
  label: messages.itemFromThirdParties,
  showInFacetsList: true,
  filterType: 'any',
  isFilterable: false,
  show: 10000,
  isMulti: true,
  // sortOn: 'custom',
  // sortOnCustomLabel: 'Alphabetical',
};

const facets = [
  adaptation_sectors,
  // clusters,
  op_cluster,
  objectProvides,
  issued_date,
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
