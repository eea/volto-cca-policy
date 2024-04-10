import '@testing-library/jest-dom/extend-expect';

import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';

import Spotlight from './Spotlight';

const mockStore = configureStore();

describe('Filter', () => {
  it('should render the component', () => {
    const data = {
      '@type': 'tabs_block',
      data: {
        assetPosition: 'top',
        blocks: {
          '05130306-68cd-43c4-bf29-38653e55b3d1': {
            '@type': 'tab',
            assetPosition: 'top',
            assetType: 'image',
            blocks: {
              '1a1f6fd5-3baa-4141-b10e-0e60dc15c468': {
                '@type': 'slate',
                plaintext: 'tab 4',
                value: [
                  {
                    children: [
                      {
                        text: 'tab 4',
                      },
                    ],
                    type: 'p',
                  },
                ],
              },
            },
            blocks_layout: {
              items: ['1a1f6fd5-3baa-4141-b10e-0e60dc15c468'],
            },
            iconSize: 'small',
            image: [
              {
                '@id': '/sandbox/stupid-google-answer.png',
                image_field: 'image',
                image_scales: {
                  image: [
                    {
                      'content-type': 'image/png',
                      download:
                        '@@images/8d779e05-e82e-46df-bab1-cddaa10d2a4e.png',
                      filename: 'stupid google answer.png',
                      height: 1156,
                      scales: {
                        big: {
                          download:
                            '@@images/4440f293-f10a-4e88-9db8-25629dc1e98a.png',
                          height: 72,
                          width: 80,
                        },
                        great: {
                          download:
                            '@@images/9a342bf1-5495-4656-90e6-d86ae9338b49.png',
                          height: 1082,
                          width: 1200,
                        },
                        icon: {
                          download:
                            '@@images/4d3c97e6-67d2-4618-95c8-ae2775f53183.png',
                          height: 28,
                          width: 32,
                        },
                        large: {
                          download:
                            '@@images/247a72d6-14cb-43d0-a4d2-b380ae4ef55d.png',
                          height: 721,
                          width: 800,
                        },
                        larger: {
                          download:
                            '@@images/be047d41-b062-48cd-b6c5-ad07d9302072.png',
                          height: 902,
                          width: 1000,
                        },
                        listing: {
                          download:
                            '@@images/4e979b36-e5dc-43a8-b5b9-2f8370bb2880.png',
                          height: 14,
                          width: 16,
                        },
                        medium: {
                          download:
                            '@@images/93213e1e-1719-4e18-a727-7256319c2393.png',
                          height: 54,
                          width: 60,
                        },
                        mini: {
                          download:
                            '@@images/6e2e3027-9cff-4294-9fd3-14ea18eea077.png',
                          height: 180,
                          width: 200,
                        },
                        portrait: {
                          download:
                            '@@images/62d66fe3-ba2d-4644-adcf-99de5aa0cdef.png',
                          height: 695,
                          width: 771,
                        },
                        preview: {
                          download:
                            '@@images/46d99556-436f-4b39-aa5a-eb01e5b05ee0.png',
                          height: 360,
                          width: 400,
                        },
                        small: {
                          download:
                            '@@images/c230b55b-b21b-4469-a37e-87658846f556.png',
                          height: 43,
                          width: 48,
                        },
                        teaser: {
                          download:
                            '@@images/0690878f-5349-45c6-beeb-0a40c8e09832.png',
                          height: 541,
                          width: 600,
                        },
                        thumb: {
                          download:
                            '@@images/2b3fc70c-faf3-4026-9334-5ff304edaa70.png',
                          height: 115,
                          width: 128,
                        },
                        tile: {
                          download:
                            '@@images/93e58831-e74e-4555-985e-980bd2324ef6.png',
                          height: 57,
                          width: 64,
                        },
                        tiny: {
                          download:
                            '@@images/80347191-eb2a-4894-b85e-1bb6398f4cd5.png',
                          height: 21,
                          width: 24,
                        },
                        wide: {
                          download:
                            '@@images/7bd71040-ddb5-41ed-86ac-84341fede37f.png',
                          height: 183,
                          width: 202,
                        },
                        xlarge: {
                          download:
                            '@@images/ae2d41cf-5e57-464d-84f9-6e8777a58e72.png',
                          height: 857,
                          width: 950,
                        },
                      },
                      size: 193122,
                      width: 1281,
                    },
                  ],
                },
                title: 'stupid google answer.png',
              },
            ],
            imageSize: 'icon',
          },
          '4f11fadc-c195-40a1-8252-c6f9518da4f6': {
            '@type': 'tab',
            assetPosition: 'top',
            assetType: 'image',
            blocks: {
              'e85d7c43-cc73-4c08-88c1-2363e3432726': {
                '@type': 'slate',
                plaintext: 'tab 2',
                value: [
                  {
                    children: [
                      {
                        text: 'tab 2',
                      },
                    ],
                    type: 'p',
                  },
                ],
              },
            },
            blocks_layout: {
              items: ['e85d7c43-cc73-4c08-88c1-2363e3432726'],
            },
            iconSize: 'small',
            image: [
              {
                '@id': '/sandbox/stupid-google-answer.png',
                image_field: 'image',
                image_scales: {
                  image: [
                    {
                      'content-type': 'image/png',
                      download:
                        '@@images/8d779e05-e82e-46df-bab1-cddaa10d2a4e.png',
                      filename: 'stupid google answer.png',
                      height: 1156,
                      scales: {
                        big: {
                          download:
                            '@@images/4440f293-f10a-4e88-9db8-25629dc1e98a.png',
                          height: 72,
                          width: 80,
                        },
                        great: {
                          download:
                            '@@images/9a342bf1-5495-4656-90e6-d86ae9338b49.png',
                          height: 1082,
                          width: 1200,
                        },
                        icon: {
                          download:
                            '@@images/4d3c97e6-67d2-4618-95c8-ae2775f53183.png',
                          height: 28,
                          width: 32,
                        },
                        large: {
                          download:
                            '@@images/247a72d6-14cb-43d0-a4d2-b380ae4ef55d.png',
                          height: 721,
                          width: 800,
                        },
                        larger: {
                          download:
                            '@@images/be047d41-b062-48cd-b6c5-ad07d9302072.png',
                          height: 902,
                          width: 1000,
                        },
                        listing: {
                          download:
                            '@@images/4e979b36-e5dc-43a8-b5b9-2f8370bb2880.png',
                          height: 14,
                          width: 16,
                        },
                        medium: {
                          download:
                            '@@images/93213e1e-1719-4e18-a727-7256319c2393.png',
                          height: 54,
                          width: 60,
                        },
                        mini: {
                          download:
                            '@@images/6e2e3027-9cff-4294-9fd3-14ea18eea077.png',
                          height: 180,
                          width: 200,
                        },
                        portrait: {
                          download:
                            '@@images/62d66fe3-ba2d-4644-adcf-99de5aa0cdef.png',
                          height: 695,
                          width: 771,
                        },
                        preview: {
                          download:
                            '@@images/46d99556-436f-4b39-aa5a-eb01e5b05ee0.png',
                          height: 360,
                          width: 400,
                        },
                        small: {
                          download:
                            '@@images/c230b55b-b21b-4469-a37e-87658846f556.png',
                          height: 43,
                          width: 48,
                        },
                        teaser: {
                          download:
                            '@@images/0690878f-5349-45c6-beeb-0a40c8e09832.png',
                          height: 541,
                          width: 600,
                        },
                        thumb: {
                          download:
                            '@@images/2b3fc70c-faf3-4026-9334-5ff304edaa70.png',
                          height: 115,
                          width: 128,
                        },
                        tile: {
                          download:
                            '@@images/93e58831-e74e-4555-985e-980bd2324ef6.png',
                          height: 57,
                          width: 64,
                        },
                        tiny: {
                          download:
                            '@@images/80347191-eb2a-4894-b85e-1bb6398f4cd5.png',
                          height: 21,
                          width: 24,
                        },
                        wide: {
                          download:
                            '@@images/7bd71040-ddb5-41ed-86ac-84341fede37f.png',
                          height: 183,
                          width: 202,
                        },
                        xlarge: {
                          download:
                            '@@images/ae2d41cf-5e57-464d-84f9-6e8777a58e72.png',
                          height: 857,
                          width: 950,
                        },
                      },
                      size: 193122,
                      width: 1281,
                    },
                  ],
                },
                title: 'stupid google answer.png',
              },
            ],
            imageSize: 'icon',
          },
          '76c5aabc-efcc-4a36-99ce-d930a3069dd2': {
            '@type': 'tab',
            assetPosition: 'top',
            assetType: 'image',
            blocks: {
              'deaf1edd-bc41-4096-bedc-b5915f185c1b': {
                '@type': 'slate',
              },
            },
            blocks_layout: {
              items: ['deaf1edd-bc41-4096-bedc-b5915f185c1b'],
            },
            iconSize: 'small',
            image: [
              {
                '@id': '/sandbox/stupid-google-answer.png',
                image_field: 'image',
                image_scales: {
                  image: [
                    {
                      'content-type': 'image/png',
                      download:
                        '@@images/8d779e05-e82e-46df-bab1-cddaa10d2a4e.png',
                      filename: 'stupid google answer.png',
                      height: 1156,
                      scales: {
                        big: {
                          download:
                            '@@images/4440f293-f10a-4e88-9db8-25629dc1e98a.png',
                          height: 72,
                          width: 80,
                        },
                        great: {
                          download:
                            '@@images/9a342bf1-5495-4656-90e6-d86ae9338b49.png',
                          height: 1082,
                          width: 1200,
                        },
                        icon: {
                          download:
                            '@@images/4d3c97e6-67d2-4618-95c8-ae2775f53183.png',
                          height: 28,
                          width: 32,
                        },
                        large: {
                          download:
                            '@@images/247a72d6-14cb-43d0-a4d2-b380ae4ef55d.png',
                          height: 721,
                          width: 800,
                        },
                        larger: {
                          download:
                            '@@images/be047d41-b062-48cd-b6c5-ad07d9302072.png',
                          height: 902,
                          width: 1000,
                        },
                        listing: {
                          download:
                            '@@images/4e979b36-e5dc-43a8-b5b9-2f8370bb2880.png',
                          height: 14,
                          width: 16,
                        },
                        medium: {
                          download:
                            '@@images/93213e1e-1719-4e18-a727-7256319c2393.png',
                          height: 54,
                          width: 60,
                        },
                        mini: {
                          download:
                            '@@images/6e2e3027-9cff-4294-9fd3-14ea18eea077.png',
                          height: 180,
                          width: 200,
                        },
                        portrait: {
                          download:
                            '@@images/62d66fe3-ba2d-4644-adcf-99de5aa0cdef.png',
                          height: 695,
                          width: 771,
                        },
                        preview: {
                          download:
                            '@@images/46d99556-436f-4b39-aa5a-eb01e5b05ee0.png',
                          height: 360,
                          width: 400,
                        },
                        small: {
                          download:
                            '@@images/c230b55b-b21b-4469-a37e-87658846f556.png',
                          height: 43,
                          width: 48,
                        },
                        teaser: {
                          download:
                            '@@images/0690878f-5349-45c6-beeb-0a40c8e09832.png',
                          height: 541,
                          width: 600,
                        },
                        thumb: {
                          download:
                            '@@images/2b3fc70c-faf3-4026-9334-5ff304edaa70.png',
                          height: 115,
                          width: 128,
                        },
                        tile: {
                          download:
                            '@@images/93e58831-e74e-4555-985e-980bd2324ef6.png',
                          height: 57,
                          width: 64,
                        },
                        tiny: {
                          download:
                            '@@images/80347191-eb2a-4894-b85e-1bb6398f4cd5.png',
                          height: 21,
                          width: 24,
                        },
                        wide: {
                          download:
                            '@@images/7bd71040-ddb5-41ed-86ac-84341fede37f.png',
                          height: 183,
                          width: 202,
                        },
                        xlarge: {
                          download:
                            '@@images/ae2d41cf-5e57-464d-84f9-6e8777a58e72.png',
                          height: 857,
                          width: 950,
                        },
                      },
                      size: 193122,
                      width: 1281,
                    },
                  ],
                },
                title: 'stupid google answer.png',
              },
            ],
            imageSize: 'icon',
          },
          '7cde1ed2-2f60-4cd6-9164-d8598bcc9914': {
            '@type': 'tab',
            assetPosition: 'top',
            assetType: 'image',
            blocks: {
              'fc5507d7-b22f-4ac5-9c47-1c2608b317ce': {
                '@type': 'slate',
              },
            },
            blocks_layout: {
              items: ['fc5507d7-b22f-4ac5-9c47-1c2608b317ce'],
            },
            iconSize: 'small',
            image: [
              {
                '@id': '/sandbox/stupid-google-answer.png',
                image_field: 'image',
                image_scales: {
                  image: [
                    {
                      'content-type': 'image/png',
                      download:
                        '@@images/8d779e05-e82e-46df-bab1-cddaa10d2a4e.png',
                      filename: 'stupid google answer.png',
                      height: 1156,
                      scales: {
                        big: {
                          download:
                            '@@images/4440f293-f10a-4e88-9db8-25629dc1e98a.png',
                          height: 72,
                          width: 80,
                        },
                        great: {
                          download:
                            '@@images/9a342bf1-5495-4656-90e6-d86ae9338b49.png',
                          height: 1082,
                          width: 1200,
                        },
                        icon: {
                          download:
                            '@@images/4d3c97e6-67d2-4618-95c8-ae2775f53183.png',
                          height: 28,
                          width: 32,
                        },
                        large: {
                          download:
                            '@@images/247a72d6-14cb-43d0-a4d2-b380ae4ef55d.png',
                          height: 721,
                          width: 800,
                        },
                        larger: {
                          download:
                            '@@images/be047d41-b062-48cd-b6c5-ad07d9302072.png',
                          height: 902,
                          width: 1000,
                        },
                        listing: {
                          download:
                            '@@images/4e979b36-e5dc-43a8-b5b9-2f8370bb2880.png',
                          height: 14,
                          width: 16,
                        },
                        medium: {
                          download:
                            '@@images/93213e1e-1719-4e18-a727-7256319c2393.png',
                          height: 54,
                          width: 60,
                        },
                        mini: {
                          download:
                            '@@images/6e2e3027-9cff-4294-9fd3-14ea18eea077.png',
                          height: 180,
                          width: 200,
                        },
                        portrait: {
                          download:
                            '@@images/62d66fe3-ba2d-4644-adcf-99de5aa0cdef.png',
                          height: 695,
                          width: 771,
                        },
                        preview: {
                          download:
                            '@@images/46d99556-436f-4b39-aa5a-eb01e5b05ee0.png',
                          height: 360,
                          width: 400,
                        },
                        small: {
                          download:
                            '@@images/c230b55b-b21b-4469-a37e-87658846f556.png',
                          height: 43,
                          width: 48,
                        },
                        teaser: {
                          download:
                            '@@images/0690878f-5349-45c6-beeb-0a40c8e09832.png',
                          height: 541,
                          width: 600,
                        },
                        thumb: {
                          download:
                            '@@images/2b3fc70c-faf3-4026-9334-5ff304edaa70.png',
                          height: 115,
                          width: 128,
                        },
                        tile: {
                          download:
                            '@@images/93e58831-e74e-4555-985e-980bd2324ef6.png',
                          height: 57,
                          width: 64,
                        },
                        tiny: {
                          download:
                            '@@images/80347191-eb2a-4894-b85e-1bb6398f4cd5.png',
                          height: 21,
                          width: 24,
                        },
                        wide: {
                          download:
                            '@@images/7bd71040-ddb5-41ed-86ac-84341fede37f.png',
                          height: 183,
                          width: 202,
                        },
                        xlarge: {
                          download:
                            '@@images/ae2d41cf-5e57-464d-84f9-6e8777a58e72.png',
                          height: 857,
                          width: 950,
                        },
                      },
                      size: 193122,
                      width: 1281,
                    },
                  ],
                },
                title: 'stupid google answer.png',
              },
            ],
            imageSize: 'icon',
          },
          '96470737-007c-4bd3-a2c1-d1fd2749db8a': {
            '@type': 'tab',
            assetPosition: 'top',
            assetType: 'image',
            blocks: {
              '197299c6-24cf-49c5-bd4b-b00803d74e6c': {
                '@type': 'slate',
              },
            },
            blocks_layout: {
              items: ['197299c6-24cf-49c5-bd4b-b00803d74e6c'],
            },
            iconSize: 'small',
            image: [
              {
                '@id': '/sandbox/stupid-google-answer.png',
                image_field: 'image',
                image_scales: {
                  image: [
                    {
                      'content-type': 'image/png',
                      download:
                        '@@images/8d779e05-e82e-46df-bab1-cddaa10d2a4e.png',
                      filename: 'stupid google answer.png',
                      height: 1156,
                      scales: {
                        big: {
                          download:
                            '@@images/4440f293-f10a-4e88-9db8-25629dc1e98a.png',
                          height: 72,
                          width: 80,
                        },
                        great: {
                          download:
                            '@@images/9a342bf1-5495-4656-90e6-d86ae9338b49.png',
                          height: 1082,
                          width: 1200,
                        },
                        icon: {
                          download:
                            '@@images/4d3c97e6-67d2-4618-95c8-ae2775f53183.png',
                          height: 28,
                          width: 32,
                        },
                        large: {
                          download:
                            '@@images/247a72d6-14cb-43d0-a4d2-b380ae4ef55d.png',
                          height: 721,
                          width: 800,
                        },
                        larger: {
                          download:
                            '@@images/be047d41-b062-48cd-b6c5-ad07d9302072.png',
                          height: 902,
                          width: 1000,
                        },
                        listing: {
                          download:
                            '@@images/4e979b36-e5dc-43a8-b5b9-2f8370bb2880.png',
                          height: 14,
                          width: 16,
                        },
                        medium: {
                          download:
                            '@@images/93213e1e-1719-4e18-a727-7256319c2393.png',
                          height: 54,
                          width: 60,
                        },
                        mini: {
                          download:
                            '@@images/6e2e3027-9cff-4294-9fd3-14ea18eea077.png',
                          height: 180,
                          width: 200,
                        },
                        portrait: {
                          download:
                            '@@images/62d66fe3-ba2d-4644-adcf-99de5aa0cdef.png',
                          height: 695,
                          width: 771,
                        },
                        preview: {
                          download:
                            '@@images/46d99556-436f-4b39-aa5a-eb01e5b05ee0.png',
                          height: 360,
                          width: 400,
                        },
                        small: {
                          download:
                            '@@images/c230b55b-b21b-4469-a37e-87658846f556.png',
                          height: 43,
                          width: 48,
                        },
                        teaser: {
                          download:
                            '@@images/0690878f-5349-45c6-beeb-0a40c8e09832.png',
                          height: 541,
                          width: 600,
                        },
                        thumb: {
                          download:
                            '@@images/2b3fc70c-faf3-4026-9334-5ff304edaa70.png',
                          height: 115,
                          width: 128,
                        },
                        tile: {
                          download:
                            '@@images/93e58831-e74e-4555-985e-980bd2324ef6.png',
                          height: 57,
                          width: 64,
                        },
                        tiny: {
                          download:
                            '@@images/80347191-eb2a-4894-b85e-1bb6398f4cd5.png',
                          height: 21,
                          width: 24,
                        },
                        wide: {
                          download:
                            '@@images/7bd71040-ddb5-41ed-86ac-84341fede37f.png',
                          height: 183,
                          width: 202,
                        },
                        xlarge: {
                          download:
                            '@@images/ae2d41cf-5e57-464d-84f9-6e8777a58e72.png',
                          height: 857,
                          width: 950,
                        },
                      },
                      size: 193122,
                      width: 1281,
                    },
                  ],
                },
                title: 'stupid google answer.png',
              },
            ],
            imageSize: 'icon',
          },
          'c46b71ec-434c-4b5b-925b-b821327df036': {
            '@type': 'tab',
            assetPosition: 'top',
            assetType: 'image',
            blocks: {
              '04f5e561-ff8b-4d39-91ee-05aaa80e9815': {
                '@type': 'columnsBlock',
                data: {
                  blocks: {
                    '436a9aa6-d966-4956-841b-3516d9029d07': {
                      blocks: {
                        'ffe5bc22-c9e7-4cf2-8eca-71138f7fd163': {
                          '@type': 'slate',
                          plaintext: 'hello',
                          value: [
                            {
                              children: [
                                {
                                  text: 'hello',
                                },
                              ],
                              type: 'p',
                            },
                          ],
                        },
                      },
                      blocks_layout: {
                        items: ['ffe5bc22-c9e7-4cf2-8eca-71138f7fd163'],
                      },
                      settings: {
                        backgroundColor: '#007b6c',
                      },
                    },
                  },
                  blocks_layout: {
                    items: ['436a9aa6-d966-4956-841b-3516d9029d07'],
                  },
                },
                gridCols: ['full'],
                gridSize: 12,
                styles: {},
              },
            },
            blocks_layout: {
              items: ['04f5e561-ff8b-4d39-91ee-05aaa80e9815'],
            },
            iconSize: 'small',
            image: [
              {
                '@id': '/sandbox/stupid-google-answer.png',
                image_field: 'image',
                image_scales: {
                  image: [
                    {
                      'content-type': 'image/png',
                      download:
                        '@@images/8d779e05-e82e-46df-bab1-cddaa10d2a4e.png',
                      filename: 'stupid google answer.png',
                      height: 1156,
                      scales: {
                        big: {
                          download:
                            '@@images/4440f293-f10a-4e88-9db8-25629dc1e98a.png',
                          height: 72,
                          width: 80,
                        },
                        great: {
                          download:
                            '@@images/9a342bf1-5495-4656-90e6-d86ae9338b49.png',
                          height: 1082,
                          width: 1200,
                        },
                        icon: {
                          download:
                            '@@images/4d3c97e6-67d2-4618-95c8-ae2775f53183.png',
                          height: 28,
                          width: 32,
                        },
                        large: {
                          download:
                            '@@images/247a72d6-14cb-43d0-a4d2-b380ae4ef55d.png',
                          height: 721,
                          width: 800,
                        },
                        larger: {
                          download:
                            '@@images/be047d41-b062-48cd-b6c5-ad07d9302072.png',
                          height: 902,
                          width: 1000,
                        },
                        listing: {
                          download:
                            '@@images/4e979b36-e5dc-43a8-b5b9-2f8370bb2880.png',
                          height: 14,
                          width: 16,
                        },
                        medium: {
                          download:
                            '@@images/93213e1e-1719-4e18-a727-7256319c2393.png',
                          height: 54,
                          width: 60,
                        },
                        mini: {
                          download:
                            '@@images/6e2e3027-9cff-4294-9fd3-14ea18eea077.png',
                          height: 180,
                          width: 200,
                        },
                        portrait: {
                          download:
                            '@@images/62d66fe3-ba2d-4644-adcf-99de5aa0cdef.png',
                          height: 695,
                          width: 771,
                        },
                        preview: {
                          download:
                            '@@images/46d99556-436f-4b39-aa5a-eb01e5b05ee0.png',
                          height: 360,
                          width: 400,
                        },
                        small: {
                          download:
                            '@@images/c230b55b-b21b-4469-a37e-87658846f556.png',
                          height: 43,
                          width: 48,
                        },
                        teaser: {
                          download:
                            '@@images/0690878f-5349-45c6-beeb-0a40c8e09832.png',
                          height: 541,
                          width: 600,
                        },
                        thumb: {
                          download:
                            '@@images/2b3fc70c-faf3-4026-9334-5ff304edaa70.png',
                          height: 115,
                          width: 128,
                        },
                        tile: {
                          download:
                            '@@images/93e58831-e74e-4555-985e-980bd2324ef6.png',
                          height: 57,
                          width: 64,
                        },
                        tiny: {
                          download:
                            '@@images/80347191-eb2a-4894-b85e-1bb6398f4cd5.png',
                          height: 21,
                          width: 24,
                        },
                        wide: {
                          download:
                            '@@images/7bd71040-ddb5-41ed-86ac-84341fede37f.png',
                          height: 183,
                          width: 202,
                        },
                        xlarge: {
                          download:
                            '@@images/ae2d41cf-5e57-464d-84f9-6e8777a58e72.png',
                          height: 857,
                          width: 950,
                        },
                      },
                      size: 193122,
                      width: 1281,
                    },
                  ],
                },
                title: 'stupid google answer.png',
              },
            ],
            imageSize: 'icon',
          },
          'e32a75f9-d0bf-4a06-a35c-9d6d14e0aa19': {
            '@type': 'tab',
            assetPosition: 'top',
            assetType: 'image',
            blocks: {
              '1f1b9035-6f8a-4e36-8d24-b6fa652ee117': {
                '@type': 'slate',
              },
            },
            blocks_layout: {
              items: ['1f1b9035-6f8a-4e36-8d24-b6fa652ee117'],
            },
            iconSize: 'small',
            image: [
              {
                '@id': '/sandbox/stupid-google-answer.png',
                image_field: 'image',
                image_scales: {
                  image: [
                    {
                      'content-type': 'image/png',
                      download:
                        '@@images/8d779e05-e82e-46df-bab1-cddaa10d2a4e.png',
                      filename: 'stupid google answer.png',
                      height: 1156,
                      scales: {
                        big: {
                          download:
                            '@@images/4440f293-f10a-4e88-9db8-25629dc1e98a.png',
                          height: 72,
                          width: 80,
                        },
                        great: {
                          download:
                            '@@images/9a342bf1-5495-4656-90e6-d86ae9338b49.png',
                          height: 1082,
                          width: 1200,
                        },
                        icon: {
                          download:
                            '@@images/4d3c97e6-67d2-4618-95c8-ae2775f53183.png',
                          height: 28,
                          width: 32,
                        },
                        large: {
                          download:
                            '@@images/247a72d6-14cb-43d0-a4d2-b380ae4ef55d.png',
                          height: 721,
                          width: 800,
                        },
                        larger: {
                          download:
                            '@@images/be047d41-b062-48cd-b6c5-ad07d9302072.png',
                          height: 902,
                          width: 1000,
                        },
                        listing: {
                          download:
                            '@@images/4e979b36-e5dc-43a8-b5b9-2f8370bb2880.png',
                          height: 14,
                          width: 16,
                        },
                        medium: {
                          download:
                            '@@images/93213e1e-1719-4e18-a727-7256319c2393.png',
                          height: 54,
                          width: 60,
                        },
                        mini: {
                          download:
                            '@@images/6e2e3027-9cff-4294-9fd3-14ea18eea077.png',
                          height: 180,
                          width: 200,
                        },
                        portrait: {
                          download:
                            '@@images/62d66fe3-ba2d-4644-adcf-99de5aa0cdef.png',
                          height: 695,
                          width: 771,
                        },
                        preview: {
                          download:
                            '@@images/46d99556-436f-4b39-aa5a-eb01e5b05ee0.png',
                          height: 360,
                          width: 400,
                        },
                        small: {
                          download:
                            '@@images/c230b55b-b21b-4469-a37e-87658846f556.png',
                          height: 43,
                          width: 48,
                        },
                        teaser: {
                          download:
                            '@@images/0690878f-5349-45c6-beeb-0a40c8e09832.png',
                          height: 541,
                          width: 600,
                        },
                        thumb: {
                          download:
                            '@@images/2b3fc70c-faf3-4026-9334-5ff304edaa70.png',
                          height: 115,
                          width: 128,
                        },
                        tile: {
                          download:
                            '@@images/93e58831-e74e-4555-985e-980bd2324ef6.png',
                          height: 57,
                          width: 64,
                        },
                        tiny: {
                          download:
                            '@@images/80347191-eb2a-4894-b85e-1bb6398f4cd5.png',
                          height: 21,
                          width: 24,
                        },
                        wide: {
                          download:
                            '@@images/7bd71040-ddb5-41ed-86ac-84341fede37f.png',
                          height: 183,
                          width: 202,
                        },
                        xlarge: {
                          download:
                            '@@images/ae2d41cf-5e57-464d-84f9-6e8777a58e72.png',
                          height: 857,
                          width: 950,
                        },
                      },
                      size: 193122,
                      width: 1281,
                    },
                  ],
                },
                title: 'stupid google answer.png',
              },
            ],
            imageSize: 'icon',
          },
          'e43b45aa-9d1c-40ea-925d-109eae7fd68f': {
            '@type': 'tab',
            assetPosition: 'top',
            assetType: 'image',
            blocks: {
              '144e2b39-5d31-41e3-8d6e-e7fbf525b768': {
                '@type': 'slate',
                plaintext: 'tab 3',
                value: [
                  {
                    children: [
                      {
                        text: 'tab 3',
                      },
                    ],
                    type: 'p',
                  },
                ],
              },
            },
            blocks_layout: {
              items: ['144e2b39-5d31-41e3-8d6e-e7fbf525b768'],
            },
            iconSize: 'small',
            image: [
              {
                '@id': '/sandbox/stupid-google-answer.png',
                image_field: 'image',
                image_scales: {
                  image: [
                    {
                      'content-type': 'image/png',
                      download:
                        '@@images/8d779e05-e82e-46df-bab1-cddaa10d2a4e.png',
                      filename: 'stupid google answer.png',
                      height: 1156,
                      scales: {
                        big: {
                          download:
                            '@@images/4440f293-f10a-4e88-9db8-25629dc1e98a.png',
                          height: 72,
                          width: 80,
                        },
                        great: {
                          download:
                            '@@images/9a342bf1-5495-4656-90e6-d86ae9338b49.png',
                          height: 1082,
                          width: 1200,
                        },
                        icon: {
                          download:
                            '@@images/4d3c97e6-67d2-4618-95c8-ae2775f53183.png',
                          height: 28,
                          width: 32,
                        },
                        large: {
                          download:
                            '@@images/247a72d6-14cb-43d0-a4d2-b380ae4ef55d.png',
                          height: 721,
                          width: 800,
                        },
                        larger: {
                          download:
                            '@@images/be047d41-b062-48cd-b6c5-ad07d9302072.png',
                          height: 902,
                          width: 1000,
                        },
                        listing: {
                          download:
                            '@@images/4e979b36-e5dc-43a8-b5b9-2f8370bb2880.png',
                          height: 14,
                          width: 16,
                        },
                        medium: {
                          download:
                            '@@images/93213e1e-1719-4e18-a727-7256319c2393.png',
                          height: 54,
                          width: 60,
                        },
                        mini: {
                          download:
                            '@@images/6e2e3027-9cff-4294-9fd3-14ea18eea077.png',
                          height: 180,
                          width: 200,
                        },
                        portrait: {
                          download:
                            '@@images/62d66fe3-ba2d-4644-adcf-99de5aa0cdef.png',
                          height: 695,
                          width: 771,
                        },
                        preview: {
                          download:
                            '@@images/46d99556-436f-4b39-aa5a-eb01e5b05ee0.png',
                          height: 360,
                          width: 400,
                        },
                        small: {
                          download:
                            '@@images/c230b55b-b21b-4469-a37e-87658846f556.png',
                          height: 43,
                          width: 48,
                        },
                        teaser: {
                          download:
                            '@@images/0690878f-5349-45c6-beeb-0a40c8e09832.png',
                          height: 541,
                          width: 600,
                        },
                        thumb: {
                          download:
                            '@@images/2b3fc70c-faf3-4026-9334-5ff304edaa70.png',
                          height: 115,
                          width: 128,
                        },
                        tile: {
                          download:
                            '@@images/93e58831-e74e-4555-985e-980bd2324ef6.png',
                          height: 57,
                          width: 64,
                        },
                        tiny: {
                          download:
                            '@@images/80347191-eb2a-4894-b85e-1bb6398f4cd5.png',
                          height: 21,
                          width: 24,
                        },
                        wide: {
                          download:
                            '@@images/7bd71040-ddb5-41ed-86ac-84341fede37f.png',
                          height: 183,
                          width: 202,
                        },
                        xlarge: {
                          download:
                            '@@images/ae2d41cf-5e57-464d-84f9-6e8777a58e72.png',
                          height: 857,
                          width: 950,
                        },
                      },
                      size: 193122,
                      width: 1281,
                    },
                  ],
                },
                title: 'stupid google answer.png',
              },
            ],
            imageSize: 'icon',
          },
          'eaa08b7b-474d-42f4-96cc-785f7e8455ac': {
            '@type': 'tab',
            assetPosition: 'top',
            assetType: 'image',
            blocks: {
              '297e6aa6-ffc1-4189-b28b-febc81da32f6': {
                '@type': 'slate',
              },
            },
            blocks_layout: {
              items: ['297e6aa6-ffc1-4189-b28b-febc81da32f6'],
            },
            iconSize: 'small',
            image: [
              {
                '@id': '/sandbox/stupid-google-answer.png',
                image_field: 'image',
                image_scales: {
                  image: [
                    {
                      'content-type': 'image/png',
                      download:
                        '@@images/8d779e05-e82e-46df-bab1-cddaa10d2a4e.png',
                      filename: 'stupid google answer.png',
                      height: 1156,
                      scales: {
                        big: {
                          download:
                            '@@images/4440f293-f10a-4e88-9db8-25629dc1e98a.png',
                          height: 72,
                          width: 80,
                        },
                        great: {
                          download:
                            '@@images/9a342bf1-5495-4656-90e6-d86ae9338b49.png',
                          height: 1082,
                          width: 1200,
                        },
                        icon: {
                          download:
                            '@@images/4d3c97e6-67d2-4618-95c8-ae2775f53183.png',
                          height: 28,
                          width: 32,
                        },
                        large: {
                          download:
                            '@@images/247a72d6-14cb-43d0-a4d2-b380ae4ef55d.png',
                          height: 721,
                          width: 800,
                        },
                        larger: {
                          download:
                            '@@images/be047d41-b062-48cd-b6c5-ad07d9302072.png',
                          height: 902,
                          width: 1000,
                        },
                        listing: {
                          download:
                            '@@images/4e979b36-e5dc-43a8-b5b9-2f8370bb2880.png',
                          height: 14,
                          width: 16,
                        },
                        medium: {
                          download:
                            '@@images/93213e1e-1719-4e18-a727-7256319c2393.png',
                          height: 54,
                          width: 60,
                        },
                        mini: {
                          download:
                            '@@images/6e2e3027-9cff-4294-9fd3-14ea18eea077.png',
                          height: 180,
                          width: 200,
                        },
                        portrait: {
                          download:
                            '@@images/62d66fe3-ba2d-4644-adcf-99de5aa0cdef.png',
                          height: 695,
                          width: 771,
                        },
                        preview: {
                          download:
                            '@@images/46d99556-436f-4b39-aa5a-eb01e5b05ee0.png',
                          height: 360,
                          width: 400,
                        },
                        small: {
                          download:
                            '@@images/c230b55b-b21b-4469-a37e-87658846f556.png',
                          height: 43,
                          width: 48,
                        },
                        teaser: {
                          download:
                            '@@images/0690878f-5349-45c6-beeb-0a40c8e09832.png',
                          height: 541,
                          width: 600,
                        },
                        thumb: {
                          download:
                            '@@images/2b3fc70c-faf3-4026-9334-5ff304edaa70.png',
                          height: 115,
                          width: 128,
                        },
                        tile: {
                          download:
                            '@@images/93e58831-e74e-4555-985e-980bd2324ef6.png',
                          height: 57,
                          width: 64,
                        },
                        tiny: {
                          download:
                            '@@images/80347191-eb2a-4894-b85e-1bb6398f4cd5.png',
                          height: 21,
                          width: 24,
                        },
                        wide: {
                          download:
                            '@@images/7bd71040-ddb5-41ed-86ac-84341fede37f.png',
                          height: 183,
                          width: 202,
                        },
                        xlarge: {
                          download:
                            '@@images/ae2d41cf-5e57-464d-84f9-6e8777a58e72.png',
                          height: 857,
                          width: 950,
                        },
                      },
                      size: 193122,
                      width: 1281,
                    },
                  ],
                },
                title: 'stupid google answer.png',
              },
            ],
            imageSize: 'icon',
          },
        },
        blocks_layout: {
          items: [
            'c46b71ec-434c-4b5b-925b-b821327df036',
            '4f11fadc-c195-40a1-8252-c6f9518da4f6',
            'e43b45aa-9d1c-40ea-925d-109eae7fd68f',
            '05130306-68cd-43c4-bf29-38653e55b3d1',
            '76c5aabc-efcc-4a36-99ce-d930a3069dd2',
            'e32a75f9-d0bf-4a06-a35c-9d6d14e0aa19',
            '7cde1ed2-2f60-4cd6-9164-d8598bcc9914',
            'eaa08b7b-474d-42f4-96cc-785f7e8455ac',
            '96470737-007c-4bd3-a2c1-d1fd2749db8a',
          ],
        },
        iconSize: 'small',
        imageSize: 'icon',
      },
      menuFluid: true,
      menuInverted: false,
      menuPointing: true,
      menuSecondary: true,
      variation: 'spotlight',
      verticalAlign: 'flex-start',
    };

    const store = mockStore({
      userSession: { token: '1234' },
      intl: {
        locale: 'en',
        messages: {},
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Spotlight {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('.spotlight-tabs')).toBeInTheDocument();
  });
});
