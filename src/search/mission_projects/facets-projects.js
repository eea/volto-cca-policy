import { multiTermFacet } from '@eeacms/search';
import {
  include_archived,
  objectProvides,
  language,
  issued_date,
  geographic_countries,
  cca_climate_impacts,
  cca_adaptation_sectors,
} from './../common';

import { defineMessages } from 'react-intl';

const messages = defineMessages({
  fundingProgramme: {
    id: 'Funding Programme',
    defaultMessage: 'Funding Programme',
  },
  adaptationApproaches: {
    id: 'Adaptation Approaches',
    defaultMessage: 'Adaptation Approaches',
  },
});

const facets = [
  multiTermFacet({
    field: 'cca_funding_programme.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.fundingProgramme,
    iconsFamily: 'Funding Programme',
    alwaysVisible: false,
  }),
  cca_climate_impacts,
  cca_adaptation_sectors,
  multiTermFacet({
    field: 'cca_adaptation_elements.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Adaptation Approaches',
    label: messages.adaptationApproaches,
    alwaysVisible: false,
  }),
  geographic_countries,
  include_archived,
  issued_date,
  language,
  objectProvides,
];

export default facets;
