import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';
import { multiTermFacet } from '@eeacms/search';
import {
  // objectProvides,
  // language,
  geographic_countries,
  cca_climate_impacts,
  cca_adaptation_sectors,
} from '../common';

let globalFacets = globalSearchBaseConfig.facets;
for (let i = 0; i < globalFacets.length; i++) {
  if (globalFacets[i]['field'] === 'IncludeArchived') {
    globalFacets[i]['showInSecondaryFacetsList'] = false;
  }
  if (globalFacets[i]['field'] === 'issued.date') {
    globalFacets[i]['showInSecondaryFacetsList'] = false;
  }
}

const facets = [
  ...globalFacets,
  cca_climate_impacts,
  cca_adaptation_sectors,
  multiTermFacet({
    field: 'cca_adaptation_elements.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Adaptation Approaches',
    alwaysVisible: false,
  }),
  geographic_countries,
  // language,
  // objectProvides,
];

export default facets;
