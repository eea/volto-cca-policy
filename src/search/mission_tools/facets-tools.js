import { multiTermFacet } from '@eeacms/search';

import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';

import {
  include_archived,
  cca_climate_impacts,
  cca_adaptation_sectors,
  language,
} from './../common';

import { defineMessages } from 'react-intl';

const messages = defineMessages({
  rastStepsOfRelevance: {
    id: 'RAST step(s) of relevance',
    defaultMessage: 'RAST step(s) of relevance',
  },
  geographicalScale: {
    id: 'Geographical scale',
    defaultMessage: 'Geographical scale',
  },
  languagesOfTheTool: {
    id: 'Language(s) of the tool',
    defaultMessage: 'Language(s) of the tool',
  },
  mostUsefulFor: { id: 'Most useful for', defaultMessage: 'Most useful for' },
  userRequirements: {
    id: 'User requirements',
    defaultMessage: 'User requirements',
  },
});

const facets = [
  multiTermFacet({
    field: 'cca_rast_steps.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.rastStepsOfRelevance,
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_geographical_scale.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.geographicalScale,
    alwaysVisible: false,
  }),
  cca_climate_impacts,
  multiTermFacet({
    field: 'cca_tool_language.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.languagesOfTheTool,
    alwaysVisible: false,
  }),
  cca_adaptation_sectors,
  multiTermFacet({
    field: 'cca_most_useful_for.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.mostUsefulFor,
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_user_requirements.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.userRequirements,
    alwaysVisible: false,
  }),
  language,
  include_archived,
  ...globalSearchBaseConfig.facets.filter(
    (f) => !['language', 'IncludeArchived'].includes(f.field),
  ),
];

export default facets;
