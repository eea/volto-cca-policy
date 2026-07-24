import { defineMessages } from 'react-intl';

const messages = defineMessages({
  sector: {
    id: 'Sector',
    defaultMessage: 'Sector',
  },
  sectorQuestion: {
    id: 'What sectors does your work focus on?',
    defaultMessage: 'What sectors does your work focus on?',
  },
  sectorDescription: {
    id: 'Start the guided tour by selecting one or more sector. On the right, you will begin to see a preview of the available tools, filtered according to your selections.',
    defaultMessage:
      'Start the guided tour by selecting one or more sector. On the right, you will begin to see a preview of the available tools, filtered according to your selections.',
  },
  hazard: {
    id: 'Hazard',
    defaultMessage: 'Hazard',
  },
  hazardQuestion: {
    id: 'Which climate hazard are you addressing?',
    defaultMessage: 'Which climate hazard are you addressing?',
  },
  hazardDescription: {
    id: 'Choose one or more hazards relevant to your work. This narrows tools to those covering your risk.',
    defaultMessage:
      'Choose one or more hazards relevant to your work. This narrows tools to those covering your risk.',
  },
  adaptationStage: {
    id: 'Adaptation stage',
    defaultMessage: 'Adaptation stage',
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
    id: 'sector',
    label: messages.sector,
    title: messages.sectorQuestion,
    description: messages.sectorDescription,
    field: 'cca_adaptation_sectors.keyword',
    filterType: 'all',
  },
  {
    id: 'hazard',
    label: messages.hazard,
    title: messages.hazardQuestion,
    description: messages.hazardDescription,
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
  {
    id: 'coverage',
    label: messages.coverage,
    title: messages.coverageQuestion,
    description: messages.coverageDescription,
    field: 'cca_geographical_scale.keyword',
    filterType: 'any',
  },
];

export default guideSteps;
