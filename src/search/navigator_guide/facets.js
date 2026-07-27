import { multiTermFacet } from '@eeacms/search';
import { defineMessages } from 'react-intl';
import {
  cca_adaptation_sectors,
  cca_climate_impacts,
  geographic_countries,
  language,
} from './../common';

const messages = defineMessages({
  adaptationSupportCycleStep: {
    id: 'Adaptation Support Cycle Step',
    defaultMessage: 'Adaptation Support Cycle Step',
  },
});

const facets = [
  cca_adaptation_sectors,
  cca_climate_impacts,
  geographic_countries,
  language,
  multiTermFacet({
    field: 'cca_adaptation_support_cycle_step.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.adaptationSupportCycleStep,
    alwaysVisible: false,
  }),
];

export default facets;
