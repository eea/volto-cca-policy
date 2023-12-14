import { multiTermFacet } from '@eeacms/search';

import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';

const facets = [
  ...globalSearchBaseConfig.facets,
  // multiTermFacet({
  //   field: 'spatial',
  //   isFilterable: false,
  //   isMulti: true,
  //   label: 'Country',
  //   iconsFamily: 'Country',
  //   alwaysVisible: false,
  // }),
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
