import { multiTermFacet } from '@eeacms/search';
import { defineMessages } from 'react-intl';
import {
  cca_adaptation_sectors,
  geographic_countries,
  language,
} from './../common';

const messages = defineMessages({
  climateHazards: {
    id: 'Climate hazards',
    defaultMessage: 'Climate hazards',
  },
  adaptationSupportCycleStep: {
    id: 'Adaptation Support Cycle Step',
    defaultMessage: 'Adaptation Support Cycle Step',
  },
  userGroups: {
    id: 'User Groups',
    defaultMessage: 'User Groups',
  },
  typeOfOutputs: {
    id: 'Type of Outputs',
    defaultMessage: 'Type of Outputs',
  },
  typeOfData: {
    id: 'Type of Data',
    defaultMessage: 'Type of Data',
  },
  licenseStatus: {
    id: 'License status',
    defaultMessage: 'License status',
  },
  natureBasedSolution: {
    id: 'Nature-based solution',
    defaultMessage: 'Nature-based solution',
  },
});

const facets = [
  cca_adaptation_sectors,
  {
    field: 'cca_climate_impacts.keyword',
    factory: 'MultiTermFacet',
    label: messages.climateHazards,
    showInFacetsList: true,
    filterType: 'any',
    isFilterable: false,
    show: 10000,
    isMulti: true,
  },
  geographic_countries,
  language,
  multiTermFacet({
    field: 'cca_adaptation_support_cycle_step.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.adaptationSupportCycleStep,
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_intended_user_groups.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.userGroups,
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_type_of_outputs.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.typeOfOutputs,
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_type_of_data.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.typeOfData,
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_license_status.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.licenseStatus,
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_nature_based_solution.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.natureBasedSolution,
    alwaysVisible: false,
  }),
];

export default facets;
