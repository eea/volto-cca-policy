import { defineMessages } from 'react-intl';
const messages = defineMessages({
  placeholderClimateSearch: {
    id: 'Search the Climate-ADAPT database',
    defaultMessage: 'Search the Climate-ADAPT database',
  },
  placeholderObservatorySearch: {
    id: 'Search the Observatory Resource Catalogue...',
    defaultMessage: 'Search the Observatory Resource Catalogue...',
  },
  placeholderMissionSearch: {
    id: 'Search the EU Mission on Adaptation',
    defaultMessage: 'Search the EU Mission on Adaptation',
  },
  // rest of site
  sitemap: {
    id: 'Sitemap',
    defaultMessage: 'Sitemap',
  },
  managedBy: {
    id: 'Managed by',
    defaultMessage: 'Managed by',
  },
  exploreEnvironmentalInformationSystems: {
    id: 'Explore our environmental information systems',
    defaultMessage: 'Explore our environmental information systems',
  },
  about: {
    id: 'About',
    defaultMessage: 'About',
  },
  aboutUs: {
    id: 'About us',
    defaultMessage: 'About us',
  },
  contactUs: {
    id: 'Contact us',
    defaultMessage: 'Contact us',
  },
  contact: {
    id: 'Contact',
    defaultMessage: 'Contact',
  },
  privacy: {
    id: 'Privacy',
    defaultMessage: 'Privacy',
  },
  help: {
    id: 'Help',
    defaultMessage: 'Help',
  },
  privacyStatement: {
    id: 'Privacy statement',
    defaultMessage: 'Privacy statement',
  },
  accessibility: {
    id: 'Accessibility',
    defaultMessage: 'Accessibility',
  },
  legalNotice: {
    id: 'Legal notice',
    defaultMessage: 'Legal notice',
  },
  dashboard: {
    id: 'Dashboard',
    defaultMessage: 'Dashboard',
  },
  login: {
    id: 'Login',
    defaultMessage: 'Login',
  },
  cmsLogin: {
    id: 'CMS Login',
    defaultMessage: 'CMS Login',
  },
  phNews: {
    id: 'News',
    defaultMessage: 'News',
  },
  phOrganisation: {
    id: 'Organisation',
    defaultMessage: 'Organisation',
  },
  phTool: {
    id: 'Tool',
    defaultMessage: 'Tool',
  },
  phIndicator: {
    id: 'Indicator',
    defaultMessage: 'Indicator',
  },
  phMissionStory: {
    id: 'Mission story',
    defaultMessage: 'Mission story',
  },
  phAdaptationOption: {
    id: 'Adaptation option',
    defaultMessage: 'Adaptation option',
  },
  phVideosAndPodcasts: {
    id: 'Videos and podcasts',
    defaultMessage: 'Videos and podcasts',
  },
  phMissionTool: {
    id: 'Mission tool',
    defaultMessage: 'Mission tool',
  },
  phCaseStudy: {
    id: 'Case study',
    defaultMessage: 'Case study',
  },
  phGuidance: {
    id: 'Guidance',
    defaultMessage: 'Guidance',
  },
  phInformationPortal: {
    id: 'Information portal',
    defaultMessage: 'Information portal',
  },
  phFundingOportunity: {
    id: 'Funding oportunity',
    defaultMessage: 'Funding oportunity',
  },
  phProjectsAces: {
    id: 'Research and knowledge project',
    defaultMessage: 'Research and knowledge project',
  },
  phWebapge: {
    id: 'Webpage',
    defaultMessage: 'Webpage',
  },
  phEvent: {
    id: 'Event',
    defaultMessage: 'Event',
  },
  phResearchAndKnowledgeProject: {
    id: 'Research and knowledge project',
    defaultMessage: 'Research and knowledge project',
  },
});

export const messagesList = defineMessages({
  a1def: {
    id: 'Governance and Institutional',
    defaultMessage: 'Governance and Institutional',
  },
  a1: {
    id: 'Policy Instruments',
    defaultMessage: 'Policy Instruments',
  },
  a2: {
    id: 'Management and planning',
    defaultMessage: 'Management and planning',
  },
  a3: {
    id: 'Coordination cooperation and networks',
    defaultMessage: 'Coordination cooperation and networks',
  },
  b1def: {
    id: 'Economic and Finance',
    defaultMessage: 'Economic and Finance',
  },
  b1: {
    id: 'Financing incentive instruments',
    defaultMessage: 'Financing incentive instruments',
  },
  b2: {
    id: 'Insurance and risk sharing instruments',
    defaultMessage: 'Insurance and risk sharing instruments',
  },
  c1def: {
    id: 'Physical and technological',
    defaultMessage: 'Physical and technological',
  },
  c1: {
    id: 'Grey options',
    defaultMessage: 'Grey options',
  },
  c2: {
    id: 'Technological options',
    defaultMessage: 'Technological options',
  },
  d1def: {
    id: 'Nature based Solutions and Ecosystem based approaches',
    defaultMessage: 'Nature based Solutions and Ecosystem based approaches',
  },
  d1: {
    id: 'Green options',
    defaultMessage: 'Green options',
  },
  d2: {
    id: 'Blue options',
    defaultMessage: 'Blue options',
  },
  e1def: {
    id: 'Knowledge and behavioural change',
    defaultMessage: 'Knowledge and behavioural change',
  },
  e1: {
    id: 'Information and awareness raising',
    defaultMessage: 'Information and awareness raising',
  },
  e2: {
    id: 'Capacity building empowering and lifestyle practices',
    defaultMessage: 'Capacity building empowering and lifestyle practices',
  },
  e3: {
    id: 'Capacity building empowering and lifestyle practices',
    defaultMessage: 'Capacity building empowering and lifestyle practices',
  },
  healthImpacts: {
    id: 'Health Impacts',
    defaultMessage: 'Health Impacts',
  },
  types: {
    id: 'Types',
    defaultMessage: 'Types',
  },
});

const messagesById = (messages) =>
  Object.fromEntries(
    Object.values(messages).map((message) => [message.id, message]),
  );

const formatMessageById = (intl, value, messageMap) => {
  const message = messageMap[value];
  return message ? intl.formatMessage(message) : value;
};

export const toolVocabularyMessages = defineMessages({
  heat: {
    id: 'Heat',
    defaultMessage: 'Heat',
  },
  heavyPrecipitation: {
    id: 'Heavy precipitation / extreme rainfall',
    defaultMessage: 'Heavy precipitation / extreme rainfall',
  },
  flood: {
    id: 'Flood',
    defaultMessage: 'Flood',
  },
  drought: {
    id: 'Drought',
    defaultMessage: 'Drought',
  },
  windStorm: {
    id: 'Wind / storm',
    defaultMessage: 'Wind / storm',
  },
  coldWaves: {
    id: 'Cold waves / extreme cold',
    defaultMessage: 'Cold waves / extreme cold',
  },
  seaLevelRise: {
    id: 'Sea level rise',
    defaultMessage: 'Sea level rise',
  },
  wildfire: {
    id: 'Fire / wildfire',
    defaultMessage: 'Fire / wildfire',
  },
  coastalFlooding: {
    id: 'Coastal flooding / storm surge',
    defaultMessage: 'Coastal flooding / storm surge',
  },
  snowAvalanche: {
    id: 'Snow / Avalanche',
    defaultMessage: 'Snow / Avalanche',
  },
  nonHazardSpecific: {
    id: 'Non hazard-specific',
    defaultMessage: 'Non hazard-specific',
  },
  landslide: {
    id: 'Landslide',
    defaultMessage: 'Landslide',
  },
  coastalAreas: {
    id: 'Coastal areas',
    defaultMessage: 'Coastal areas',
  },
  urbanAreas: {
    id: 'Urban areas',
    defaultMessage: 'Urban areas',
  },
  mountainAreas: {
    id: 'Mountain areas',
    defaultMessage: 'Mountain areas',
  },
  global: {
    id: 'Global',
    defaultMessage: 'Global',
  },
  european: {
    id: 'European',
    defaultMessage: 'European',
  },
  transnational: {
    id: 'Transnational',
    defaultMessage: 'Transnational',
  },
  euOutermostRegions: {
    id: 'EU Outermost regions',
    defaultMessage: 'EU Outermost regions',
  },
  national: {
    id: 'National',
    defaultMessage: 'National',
  },
  subnational: {
    id: 'Subnational',
    defaultMessage: 'Subnational',
  },
  step1PreparingGround: {
    id: 'Step 1: Preparing the Ground for Adaptation',
    defaultMessage: 'Step 1: Preparing the Ground for Adaptation',
  },
  step2AssessingRisks: {
    id: 'Step 2: Assessing Climate Change Risks and Vulnerabilities',
    defaultMessage:
      'Step 2: Assessing Climate Change Risks and Vulnerabilities',
  },
  step3IdentifyingOptions: {
    id: 'Step 3: Identifying Adaptation Options',
    defaultMessage: 'Step 3: Identifying Adaptation Options',
  },
  step4AssessingOptions: {
    id: 'Step 4: Assessing and Prioritising Adaptation Options',
    defaultMessage: 'Step 4: Assessing and Prioritising Adaptation Options',
  },
  step5Implementation: {
    id: 'Step 5: Implementation',
    defaultMessage: 'Step 5: Implementation',
  },
  step6MonitoringEvaluation: {
    id: 'Step 6: Monitoring and Evaluation (M&E)',
    defaultMessage: 'Step 6: Monitoring and Evaluation (M&E)',
  },
  mapsAndGraphs: {
    id: 'Maps and graphs',
    defaultMessage: 'Maps and graphs',
  },
  reportsAndDecisionSupport: {
    id: 'Reports and decision support',
    defaultMessage: 'Reports and decision support',
  },
  datasetsAndIndicators: {
    id: 'Datasets and indicators',
    defaultMessage: 'Datasets and indicators',
  },
  narratives: {
    id: 'Narratives',
    defaultMessage: 'Narratives',
  },
  bestPracticeExamples: {
    id: 'Best practice examples',
    defaultMessage: 'Best practice examples',
  },
  natureBasedSolutions: {
    id: 'Nature-based solutions',
    defaultMessage: 'Nature-based solutions',
  },
  justResilience: {
    id: 'Just resilience',
    defaultMessage: 'Just resilience',
  },
  costBenefitRatio: {
    id: 'Cost-benefit ratio',
    defaultMessage: 'Cost-benefit ratio',
  },
});

const toolVocabularyMessagesById = messagesById(toolVocabularyMessages);

export const formatToolVocabularyValue = (intl, value) =>
  formatMessageById(intl, value, toolVocabularyMessagesById);

export const formatClimateImpact = (intl, impact) =>
  formatToolVocabularyValue(intl, impact);

export default messages;
