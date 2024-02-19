import { multiTermFacet } from '@eeacms/search';

import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';

const facets = [
  multiTermFacet({
    field: 'cca_climate_impacts.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Climate Impacts',
    iconsFamily: 'Climate Impacts',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_adaptation_sectors.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Adaptation Sectors',
    iconsFamily: 'Adaptation Sectors',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'key_system.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Key Community Systems',
    iconsFamily: 'Key Community Systems',
    alwaysVisible: false,
  }),
  ...globalSearchBaseConfig.facets,
  multiTermFacet({
    field: 'cca_funding_programme.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Funding Programme',
    iconsFamily: 'Funding Programme',
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
