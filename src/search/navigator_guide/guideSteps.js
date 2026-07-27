import { defineMessages } from 'react-intl';

const messages = defineMessages({
  adaptationSectors: {
    id: 'Adaptation Sectors',
    defaultMessage: 'Adaptation Sectors',
  },
  adaptationSectorsQuestion: {
    id: 'What sectors does your work focus on?',
    defaultMessage: 'What sectors does your work focus on?',
  },
  adaptationSectorsDescription: {
    id: 'Start the guided tour by selecting one or more sector. On the right, you will begin to see a preview of the available tools, filtered according to your selections.',
    defaultMessage:
      'Start the guided tour by selecting one or more sector. On the right, you will begin to see a preview of the available tools, filtered according to your selections.',
  },
  climateImpacts: {
    id: 'Climate Impacts',
    defaultMessage: 'Climate Impacts',
  },
  climateImpactsQuestion: {
    id: 'Which climate hazard are you addressing?',
    defaultMessage: 'Which climate hazard are you addressing?',
  },
  climateImpactsDescription: {
    id: 'Choose one or more hazards relevant to your work. This narrows tools to those covering your risk.',
    defaultMessage:
      'Choose one or more hazards relevant to your work. This narrows tools to those covering your risk.',
  },
  adaptationStage: {
    id: 'Adaptation Stage',
    defaultMessage: 'Adaptation Stage',
  },
  adaptationStageQuestion: {
    id: 'What stage of the adaptation stage are you working on?',
    defaultMessage: 'What stage of the adaptation stage are you working on?',
  },
  adaptationStageDescription: {
    id: 'The steps follows the Climate-ADAPT Adaptation Support Tool cycle. Pick the stage(s) you need support for - we keep tools that help at thor points in the process.',
    defaultMessage:
      'The steps follows the Climate-ADAPT Adaptation Support Tool cycle. Pick the stage(s) you need support for - we keep tools that help at thor points in the process.',
  },
  coverage: {
    id: 'Coverage',
    defaultMessage: 'Coverage',
  },
  coverageQuestion: {
    id: 'Which spatial coverage do you need?',
    defaultMessage: 'Which spatial coverage do you need?',
  },
  coverageDescription: {
    id: 'Pick the levels your work operates at. We keep tools whose data and guidance reach those scales.',
    defaultMessage:
      'Pick the levels your work operates at. We keep tools whose data and guidance reach those scales.',
  },
});

const guideSteps = [
  {
    id: 'adaptationSectors',
    label: messages.adaptationSectors,
    title: messages.adaptationSectorsQuestion,
    description: messages.adaptationSectorsDescription,
    field: 'cca_adaptation_sectors.keyword',
    filterType: 'all',
  },
  {
    id: 'climateImpacts',
    label: messages.climateImpacts,
    title: messages.climateImpactsQuestion,
    description: messages.climateImpactsDescription,
    field: 'cca_climate_impacts.keyword',
    filterType: 'any',
  },
  {
    id: 'adaptationStage',
    label: messages.adaptationStage,
    title: messages.adaptationStageQuestion,
    description: messages.adaptationStageDescription,
    field: 'cca_adaptation_support_cycle_step.keyword',
    filterType: 'any',
  },
  // {
  //   id: 'coverage',
  //   label: messages.coverage,
  //   title: messages.coverageQuestion,
  //   description: messages.coverageDescription,
  //   field: 'cca_geographical_scale.keyword',
  //   filterType: 'any',
  // },
];

export default guideSteps;
