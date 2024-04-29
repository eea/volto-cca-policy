import { multiTermFacet } from '@eeacms/search';

import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';
import { cca_climate_impacts, cca_adaptation_sectors } from './../common';

const facets = [
  cca_climate_impacts,
  cca_adaptation_sectors,
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
