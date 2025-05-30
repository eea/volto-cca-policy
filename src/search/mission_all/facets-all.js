import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';
import { multiTermFacet } from '@eeacms/search';
import {
  // objectProvides,
  language,
  geographic_countries,
  cca_climate_impacts,
  cca_adaptation_sectors,
} from '../common';

import { defineMessages } from 'react-intl';

const messages = defineMessages({
  typeOfItem: {
    id: 'Type of item',
    defaultMessage: 'Type of item',
  },
  adaptationApproaches: {
    id: 'Adaptation Approaches',
    defaultMessage: 'Adaptation Approaches',
  },
  countries: { id: 'Countries', defaultMessage: 'Countries' },
});

const blacklist = ['IncludeArchived', 'issued.date', 'language'];
let globalFacets = globalSearchBaseConfig.facets.filter(
  (f) => !blacklist.includes(f.field),
);

for (let i = 0; i < globalFacets.length; i++) {
  if (globalFacets[i]['field'] === 'objectProvides') {
    globalFacets[i]['label'] = messages.typeOfItem;
  }
  if (
    globalFacets[i]['field'] === 'spatial' &&
    typeof globalFacets[i]['label'] === 'string' &&
    globalFacets[i]['label'] === 'Countries'
  ) {
    globalFacets[i]['label'] = messages.countries;
  }
}

globalFacets = globalFacets.concat(
  cca_climate_impacts,
  cca_adaptation_sectors,
  geographic_countries,
  language,
  multiTermFacet({
    field: 'cca_adaptation_elements.keyword',
    isFilterable: false,
    isMulti: true,
    // label: 'Adaptation Approaches',
    label: messages.adaptationApproaches,
    alwaysVisible: false,
  }),
);

let facetsOrderList = [
  'objectProvides',
  'cca_adaptation_sectors.keyword',
  'cca_climate_impacts.keyword',
  'cca_adaptation_elements.keyword',
  'spatial',
  'language',
];
let facetsOrder = [];
facetsOrderList.forEach((element) => {
  const _facet = globalFacets.filter((f) => f.field === element);
  if (_facet.length) {
    facetsOrder.push(_facet[0]);
  }
});
facetsOrder = facetsOrder.concat(
  globalFacets.filter((f) => !facetsOrderList.includes(f.field)),
);

const facets = [
  ...facetsOrder,
  // cca_climate_impacts,
  // cca_adaptation_sectors,
  // multiTermFacet({
  //   field: 'cca_adaptation_elements.keyword',
  //   isFilterable: false,
  //   isMulti: true,
  //   label: 'Adaptation Approaches',
  //   alwaysVisible: false,
  // }),
  // geographic_countries,
  // language,
  // objectProvides,
];

export default facets;
