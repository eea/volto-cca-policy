import { defineMessages } from 'react-intl';
import {
  CHARACTERISATION_FIELD,
  COUNTRIES_FIELD,
  GEOGRAPHIC_SCOPE_VALUES,
  TRANSNATIONAL_REGION_FIELD,
} from '../navigator_catalogue/geographicCoverage';

const messages = defineMessages({
  adaptationSectors: {
    id: 'Adaptation sectors',
    defaultMessage: 'Adaptation sectors',
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
  climateHazards: {
    id: 'Climate hazards',
    defaultMessage: 'Climate hazards',
  },
  climateHazardsQuestion: {
    id: 'Which climate hazard are you addressing?',
    defaultMessage: 'Which climate hazard are you addressing?',
  },
  climateHazardsDescription: {
    id: 'Choose one or more hazards relevant to your work. This narrows tools to those covering your risk.',
    defaultMessage:
      'Choose one or more hazards relevant to your work. This narrows tools to those covering your risk.',
  },
  geographicCoverage: {
    id: 'Geographic coverage',
    defaultMessage: 'Geographic coverage',
  },
  geographicCoverageQuestion: {
    id: 'Which geographic coverage do you need?',
    defaultMessage: 'Which geographic coverage do you need?',
  },
  geographicCoverageDescription: {
    id: 'Choose the geographic area your tool should cover. All coverage categories remain visible, and choosing a different category replaces the previous geographic selection.',
    defaultMessage:
      'Choose the geographic area your tool should cover. All coverage categories remain visible, and choosing a different category replaces the previous geographic selection.',
  },
  geographicCoverageSelectionHint: {
    id: 'Select all that apply within one category',
    defaultMessage: 'Select all that apply within one category',
  },
  broadCoverage: {
    id: 'European-wide and global',
    defaultMessage: 'European-wide and global',
  },
  countries: {
    id: 'Countries',
    defaultMessage: 'Countries',
  },
  transnationalRegions: {
    id: 'Transnational regions',
    defaultMessage: 'Transnational regions',
  },
  other: {
    id: 'Other',
    defaultMessage: 'Other',
  },
  otherDescription: {
    id: 'Tools that have not been assigned to any of the coverage entries above.',
    defaultMessage:
      'Tools that have not been assigned to any of the coverage entries above.',
  },
  adaptationStage: {
    id: 'Adaptation stage',
    defaultMessage: 'Adaptation stage',
  },
  adaptationStageQuestion: {
    id: 'What step of the adaptation support cycle are you working on?',
    defaultMessage:
      'What step of the adaptation support cycle are you working on?',
  },
  adaptationStageDescription: {
    id: 'The steps follow the Climate-ADAPT Adaptation Support Tool cycle. Pick the step(s) you need support for - we keep tools that help at those points in the process.',
    defaultMessage:
      'The steps follow the Climate-ADAPT Adaptation Support Tool cycle. Pick the step(s) you need support for - we keep tools that help at those points in the process.',
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
    id: 'climateHazards',
    label: messages.climateHazards,
    title: messages.climateHazardsQuestion,
    description: messages.climateHazardsDescription,
    field: 'cca_climate_impacts.keyword',
    filterType: 'any',
  },
  {
    id: 'geographicCoverage',
    label: messages.geographicCoverage,
    title: messages.geographicCoverageQuestion,
    description: messages.geographicCoverageDescription,
    selectionHint: messages.geographicCoverageSelectionHint,
    groups: [
      {
        id: 'broadCoverage',
        label: messages.broadCoverage,
        hideLabel: true,
        field: CHARACTERISATION_FIELD,
        filterType: 'any',
        options: [
          { value: GEOGRAPHIC_SCOPE_VALUES.europe },
          { value: GEOGRAPHIC_SCOPE_VALUES.global },
        ],
      },
      {
        id: 'countries',
        label: messages.countries,
        field: COUNTRIES_FIELD,
        filterType: 'any',
      },
      {
        id: 'transnationalRegions',
        label: messages.transnationalRegions,
        field: TRANSNATIONAL_REGION_FIELD,
        filterType: 'any',
      },
      {
        id: 'other',
        label: messages.other,
        description: messages.otherDescription,
        field: CHARACTERISATION_FIELD,
        filterType: 'any',
        options: [
          {
            value: GEOGRAPHIC_SCOPE_VALUES.others,
            label: 'Other',
          },
        ],
      },
    ],
  },
  {
    id: 'adaptationStage',
    label: messages.adaptationStage,
    title: messages.adaptationStageQuestion,
    description: messages.adaptationStageDescription,
    field: 'cca_adaptation_support_cycle_step.keyword',
    filterType: 'all',
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

export const getGuideStepFields = (step) =>
  [
    ...new Set(
      step?.groups?.length
        ? step.groups.map(({ field }) => field)
        : [step?.field],
    ),
  ].filter(Boolean);

export default guideSteps;
