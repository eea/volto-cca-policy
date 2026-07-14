const guideSteps = [
  {
    id: 'sector',
    label: 'Sector',
    title: 'Which sector are you interested in?',
    description: 'Select all sectors that apply.',
    field: 'cca_adaptation_sectors.keyword',
    filterType: 'all',
  },
  {
    id: 'hazard',
    label: 'Hazard',
    title: 'Which climate hazard are you addressing?',
    description: 'Select all hazards that apply.',
    field: 'cca_climate_impacts.keyword',
    filterType: 'any',
  },
];

export default guideSteps;
