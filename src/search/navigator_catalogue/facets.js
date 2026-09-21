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
    id: 'Adaptation policy cycle',
    defaultMessage: 'Adaptation policy cycle',
  },
  typeOfOutputs: {
    id: 'Type of outputs',
    defaultMessage: 'Type of outputs',
  },
  focusAreas: {
    id: 'Focus areas',
    defaultMessage: 'Focus areas',
  },
  implementationLevel: {
    id: 'Implementation level',
    defaultMessage: 'Implementation level',
  },
  adaptationApproaches: {
    id: 'Adaptation approaches',
    defaultMessage: 'Adaptation approaches',
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
  multiTermFacet({
    field: 'cca_focus_areas.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.focusAreas,
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_place_of_implementation.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.implementationLevel,
    alwaysVisible: false,
  }),
  geographic_countries,
  multiTermFacet({
    field: 'cca_adaptation_support_cycle_step.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.adaptationSupportCycleStep,
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
    field: 'cca_elements.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.adaptationApproaches,
    alwaysVisible: false,
  }),
  language,
];

export default facets;
