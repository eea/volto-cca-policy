import { multiTermFacet } from '@eeacms/search';

import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';
import {
  cca_climate_impacts,
  cca_adaptation_sectors,
  language,
} from './../common';

import { defineMessages } from 'react-intl';

const messages = defineMessages({
  keyCommunitySystems: {
    id: 'Key Community Systems',
    defaultMessage: 'Key Community Systems',
  },
  fundingProgramme: {
    id: 'Funding Programme',
    defaultMessage: 'Funding Programme',
  },
  hazardType: {
    id: 'Hazard Type',
    defaultMessage: 'Hazard Type',
  },
});

const facets = [
  cca_climate_impacts,
  cca_adaptation_sectors,
  multiTermFacet({
    field: 'key_system.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.keyCommunitySystems,
    iconsFamily: 'Key Community Systems',
    alwaysVisible: false,
  }),
  ...globalSearchBaseConfig.facets,
  multiTermFacet({
    field: 'cca_funding_programme.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.fundingProgramme,
    iconsFamily: 'Funding Programme',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'climate_threats.keyword',
    isFilterable: false,
    isMulti: true,
    label: messages.hazardType,
    iconsFamily: 'Hazard Type',
    alwaysVisible: false,
  }),
  language,
];

export default facets;
