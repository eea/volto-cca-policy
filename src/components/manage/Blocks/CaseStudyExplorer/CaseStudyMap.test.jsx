import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import CaseStudyMap from './CaseStudyMap';
import * as utils from './utils';

const mockStore = configureStore();

jest.mock('./utils', () => ({
  getFeatures: jest.fn(),
}));

// Mock the OpenLayers API
jest.mock('@eeacms/volto-openlayers-map/api', () => ({
  Map: jest.fn(({ children }) => <div>{children}</div>),
  Layer: {
    Tile: jest.fn(() => <div />),
  },
  Layers: jest.fn(({ children }) => <div>{children}</div>),
}));

// Mock additional OpenLayers functionality
jest.mock('@eeacms/volto-openlayers-map', () => ({
  openlayers: {
    source: {
      TileWMS: jest.fn().mockImplementation(() => ({})),
    },
    proj: {
      fromLonLat: jest.fn().mockReturnValue([0, 0]),
    },
    control: {
      defaults: jest.fn().mockReturnValue([]),
    },
  },
}));

jest.mock('./FeatureInteraction', () => () => (
  <div>Mock Feature Interaction</div>
));

const store = mockStore({
  userSession: { token: '1234' },
  intl: {
    locale: 'en',
    messages: {},
  },
});

describe('CaseStudyMap', () => {
  it('renders the component with features', () => {
    const data = {
      activeItems: [
        {
          geometry: {
            color: '#009900',
            svg: { fill_color: '#009900' },
            type: 'Point',
            coordinates: [4.19059753418, 52.0476343911],
          },
          properties: {
            impacts: ',FLOODING,SEALEVELRISE,STORM,',
            title: 'Sand Motor',
            portal_type: 'casestudy',
            description:
              '<p>The Sand Motor is a mega-nourishment implemented in the Delfland Coast.</p>',
            url: 'http://website.com',
            adaptation_options_links:
              "<a href='http://website.com'>Beach and shoreface nourishment</a>",
            elements_str: 'Nature-based solutions',
            image: 'http://website.com/preview',
            origin_adaptecca: 20,
            adaptation_options: 'Dune construction',
          },
        },
      ],
      items: [
        {
          geometry: {
            color: '#009900',
            svg: { fill_color: '#009900' },
            type: 'Point',
            coordinates: [4.19059753418, 52.0476343911],
          },
          properties: {
            impacts: ',FLOODING,SEALEVELRISE,STORM,',
            title: 'Sand Motor',
            portal_type: 'casestudy',
            description:
              '<p>The Sand Motor is a mega-nourishment implemented in the Delfland Coast.</p>',
            url: 'http://website.com',
            adaptation_options_links:
              "<a href='http://website.com'>Beach and shoreface nourishment</a>",
            elements_str: 'Nature-based solutions',
            image: 'http://website.com/preview',
            origin_adaptecca: 20,
            adaptation_options: 'Dune construction',
          },
        },
      ],
    };

    utils.getFeatures.mockReturnValueOnce(data.items); // Mock getFeatures to return data

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CaseStudyMap {...data} />
        </MemoryRouter>
      </Provider>,
    );

    expect(container).toBeTruthy(); // Ensure the component renders correctly
  });

  it('does not render the component when there are no features', () => {
    utils.getFeatures.mockReturnValueOnce([]); // Mock getFeatures to return an empty array

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CaseStudyMap activeItems={[]} items={[]} />
        </MemoryRouter>
      </Provider>,
    );

    expect(container).toBeEmptyDOMElement(); // Expect the container to be empty
  });
});
