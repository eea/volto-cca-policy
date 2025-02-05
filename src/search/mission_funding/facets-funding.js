import { multiTermFacet } from '@eeacms/search';
import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';
// import spatialWhitelist from '@eeacms/volto-globalsearch/config/json/spatialWhitelist';
import { cca_adaptation_sectors, language } from './../common';
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
});

const blacklist = ['IncludeArchived', 'issued.date', 'spatial', 'language'];

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
  language,
  // multiTermFacet({
  //   field: 'spatial',
  //   isFilterable: true,
  //   isMulti: true,
  //   label: 'Countries',
  //   spatialWhitelist: spatialWhitelist,
  //   show: 10000,
  //   iconsFamily: 'Countries',
  //   enableExact: true,
  //   alwaysVisible: false,
  // }),

  ...globalSearchBaseConfig.facets.filter((f) => !blacklist.includes(f.field)),
];

export default facets;
