import { multiTermFacet } from '@eeacms/search';
import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';
import spatialWhitelist from '@eeacms/volto-globalsearch/config/json/spatialWhitelist';
import {
  cca_adaptation_sectors,
  language,
  // geographic_countries,
} from './../common';

import { defineMessages } from 'react-intl';

const messages = defineMessages({
  rastStepssOfRelevance: {
    id: 'RAST step(s) of relevance',
    defaultMessage: 'RAST step(s) of relevance',
  },
  eligibleToReceiveFunding: {
    id: 'Eligible to receive funding',
    defaultMessage: 'Eligible to receive funding',
  },
  countries: {
    id: 'Countries',
    defaultMessage: 'Countries',
  },
});

const blacklist = ['IncludeArchived', 'issued.date', 'language', 'spatial'];

const facets = [
  multiTermFacet({
    field: 'cca_rast_steps.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.rastStepssOfRelevance,
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_eligible_entities.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.eligibleToReceiveFunding,
    alwaysVisible: false,
  }),
  cca_adaptation_sectors,
  ...globalSearchBaseConfig.facets.filter((f) => !blacklist.includes(f.field)),
  language,
  multiTermFacet({
    field: 'spatial',
    isFilterable: true,
    isMulti: true,
    label: messages.countries,
    spatialWhitelist: spatialWhitelist,
    show: 10000,
    iconsFamily: 'Countries',
    enableExact: true,
    alwaysVisible: false,
  }),
];

export default facets;
