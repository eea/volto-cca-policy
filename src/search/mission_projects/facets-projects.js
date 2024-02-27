import { multiTermFacet } from '@eeacms/search';
import {
  include_archived,
  objectProvides,
  language,
  issued_date,
  geographic_countries,
} from './../common';

const facets = [
  multiTermFacet({
    field: 'cca_funding_programme.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Funding Programme',
    iconsFamily: 'Funding Programme',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_climate_impacts.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Climate Impacts',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_adaptation_sectors.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Adaptation Sectors',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'cca_adaptation_elements.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Adaptation Elements',
    alwaysVisible: false,
  }),
  geographic_countries,
  include_archived,
  issued_date,
  language,
  objectProvides,
];

export default facets;
