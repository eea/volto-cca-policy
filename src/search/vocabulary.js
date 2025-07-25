import { eea_languages } from '@eeacms/volto-cca-policy/constants';
import { defineMessages } from 'react-intl';

defineMessages({
  publicationReference: {
    id: 'Publication reference',
    defaultMessage: 'Publications and reports',
  },
  video: {
    id: 'Video',
    defaultMessage: 'Videos and podcasts',
  },
});

export const vocab = {
  cluster_name: {
    cca: 'Climate-ADAPT',
  },
  'cca_key_type_measure.keyword': {
    A1: 'A1: Policy Instruments',
    A2: 'A2: Management and planning',
    A3: 'A3: Coordination cooperation and networks',
    B1: 'B1: Financing incentive instruments',
    B2: 'B2: Insurance and risk sharing instruments',
    C1: 'C1: Grey options',
    C2: 'C2: Technological options',
    D1: 'D1: Green options',
    D2: 'D2: Blue options',
    E1: 'E1: Information and awareness raising',
    E2: 'E2: Capacity building empowering and lifestyle practices',
  },
  objectProvides: {
    'Publication reference': 'Publications and reports',
    Video: 'Videos and podcasts',
  },
  language: Object.assign(
    {},
    ...eea_languages.map(({ name, code }) => ({ [code]: name })),
  ),
};
