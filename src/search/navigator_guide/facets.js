import { multiTermFacet } from '@eeacms/search';
import { defineMessages } from 'react-intl';
import { cca_adaptation_sectors, cca_climate_impacts } from './../common';
import {
  CHARACTERISATION_FIELD,
  COUNTRIES_FIELD,
  TRANSNATIONAL_REGION_FIELD,
} from '../navigator_catalogue/geographicCoverage';

const messages = defineMessages({
  adaptationSupportCycleStep: {
    id: 'Adaptation Support Cycle Step',
    defaultMessage: 'Adaptation Support Cycle Step',
  },
});

const facets = [
  cca_adaptation_sectors,
  cca_climate_impacts,
  multiTermFacet({
    field: CHARACTERISATION_FIELD,
    filterType: 'any',
    isFilterable: false,
    isMulti: true,
    show: 10000,
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: COUNTRIES_FIELD,
    filterType: 'any',
    isFilterable: false,
    isMulti: true,
    show: 10000,
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: TRANSNATIONAL_REGION_FIELD,
    filterType: 'any',
    isFilterable: false,
    isMulti: true,
    show: 10000,
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_adaptation_support_cycle_step.keyword',
    filterType: 'all',
    isFilterable: false,
    isMulti: true,
    label: messages.adaptationSupportCycleStep,
    alwaysVisible: false,
  }),
];

export default facets;
