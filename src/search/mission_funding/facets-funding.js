import { multiTermFacet } from '@eeacms/search';
import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';
import spatialWhitelist from '@eeacms/volto-globalsearch/config/json/spatialWhitelist';
import { cca_adaptation_sectors } from './../common';

const blacklist = ['IncludeArchived', 'issued.date', 'spatial'];

const facets = [
  multiTermFacet({
    field: 'cca_rast_steps.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'RAST step(s) of relevance',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_eligible_entities.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Eligible to receive funding',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'spatial',
    isFilterable: true,
    isMulti: true,
    label: 'Countries',
    spatialWhitelist: spatialWhitelist,
    show: 10000,
    iconsFamily: 'Countries',
    enableExact: true,
    alwaysVisible: false,
  }),
  cca_adaptation_sectors,

  ...globalSearchBaseConfig.facets.filter((f) => !blacklist.includes(f.field)),
];

export default facets;
