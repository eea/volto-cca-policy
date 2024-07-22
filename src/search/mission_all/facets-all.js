import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';
import { multiTermFacet } from '@eeacms/search';
import {
  // objectProvides,
  // language,
  geographic_countries,
  cca_climate_impacts,
  cca_adaptation_sectors,
} from '../common';

const blacklist = ['IncludeArchived', 'issued.date'];
let globalFacets = globalSearchBaseConfig.facets.filter(
  (f) => !blacklist.includes(f.field),
);

for (let i = 0; i < globalFacets.length; i++) {
  if (globalFacets[i]['field'] === 'objectProvides') {
    globalFacets[i]['label'] = 'Type of item';
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
