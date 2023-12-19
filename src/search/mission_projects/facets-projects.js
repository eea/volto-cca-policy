import { multiTermFacet } from '@eeacms/search';

import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';

const facets = [
  ...globalSearchBaseConfig.facets,
  multiTermFacet({
    field: 'cca_adaptation_sectors.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Sectors',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_climate_impacts.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Climate impacts',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_adaptation_elements.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Adaptation Elements',
    alwaysVisible: false,
  }),
];

export default facets;
