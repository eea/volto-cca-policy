import {
  objectProvides,
  language,
  issued_date,
  geographic_countries,
} from '../common';

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
// const clusters = {
//   field: 'op_cluster',
//   factory: 'MultiTermFacet',
//   isFilterable: true,
//   isMulti: true,
//   label: 'Section',
//   show: 10000,
//   showInFacetsList: false,
//   ignoreNLPWhenActive: true,
//   blacklist: ['Others', 'Publications'],
// };

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
  label: 'Adaptation Approaches',
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
