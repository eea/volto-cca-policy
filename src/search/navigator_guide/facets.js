import {
  cca_adaptation_sectors,
  cca_climate_impacts,
  geographic_countries,
  language,
} from './../common';

const englishLanguage = {
  ...language,
  default: {
    values: ['en'],
    type: 'any',
  },
};

const facets = [
  cca_adaptation_sectors,
  cca_climate_impacts,
  geographic_countries,
  englishLanguage,
];

export default facets;
