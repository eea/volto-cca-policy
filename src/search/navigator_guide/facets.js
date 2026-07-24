import { multiTermFacet } from '@eeacms/search';
import {
  cca_adaptation_sectors,
  cca_climate_impacts,
  geographic_countries,
  language,
} from './../common';

const facets = [
  cca_adaptation_sectors,
  cca_climate_impacts,
  geographic_countries,
  language,
  multiTermFacet({
    field: 'cca_adaptation_support_cycle_step.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Adaptation Support Cycle Step',
    alwaysVisible: false,
  }),
];

export default facets;
