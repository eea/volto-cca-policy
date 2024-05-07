import { multiTermFacet } from '@eeacms/search';

import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';
import { cca_climate_impacts, cca_adaptation_sectors } from './../common';

const facets = [
  multiTermFacet({
    field: 'cca_rast_steps.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'RAST step(s) of relevance',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_geographical_scale.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Geographical scale',
    alwaysVisible: false,
  }),
  cca_climate_impacts,
  multiTermFacet({
    field: 'cca_tool_language.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Language(s) of the tool',
    alwaysVisible: false,
  }),
  cca_adaptation_sectors,
  multiTermFacet({
    field: 'cca_most_useful_for.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Most useful for',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_user_requirements.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'User requirements',
    alwaysVisible: false,
  }),
  ...globalSearchBaseConfig.facets,
];

export default facets;
