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
  multiTermFacet({
    field: 'cca_intended_user_groups.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'User Groups',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_type_of_outputs.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Type of Outputs',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_type_of_data.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Type of Data',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_license_status.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'License status',
    alwaysVisible: false,
  }),
];

export default facets;
