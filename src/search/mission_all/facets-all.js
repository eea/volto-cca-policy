import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';
import { multiTermFacet } from '@eeacms/search';
import {
  // objectProvides,
  // language,
  geographic_countries,
  cca_climate_impacts,
  cca_adaptation_sectors,
} from '../common';

const facets = [
  ...globalSearchBaseConfig.facets,
  cca_climate_impacts,
  cca_adaptation_sectors,
  multiTermFacet({
    field: 'cca_adaptation_elements.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Adaptation Elements',
    alwaysVisible: false,
  }),
  geographic_countries,
  // language,
  // objectProvides,
];

export default facets;
