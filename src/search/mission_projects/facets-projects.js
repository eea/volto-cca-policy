import { multiTermFacet } from '@eeacms/search';

import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';

const facets = [
  multiTermFacet({
    field: 'cca_funding_programme.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Funding Programme',
    iconsFamily: 'Funding Programme',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_climate_impacts.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Climate Impacts',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_adaptation_sectors.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Adaptation Sectors',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_adaptation_elements.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Adaptation Elements',
    alwaysVisible: false,
  }),
  ...globalSearchBaseConfig.facets,
];

export default facets;
