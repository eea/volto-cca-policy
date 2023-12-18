import { multiTermFacet } from '@eeacms/search';

import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';

const facets = [
  ...globalSearchBaseConfig.facets,
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
  multiTermFacet({
    field: 'cca_adaptation_sectors.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Sectors',
    iconsFamily: 'Sectors',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'key_system.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Key System',
    iconsFamily: 'Key System',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'climate_threats.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Hazard Type',
    iconsFamily: 'Hazard Type',
    alwaysVisible: false,
  }),
];

export default facets;
