import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import View from './View';

const mockFeatures = [
  { get: (key) => ({ na: 'France', id: 'FR' })[key], set: jest.fn() },
];
const mockMetadata = [
  {
    France: [
      {
        nas_mixed:
          '<ul><li><a href="/nas">National strategy</a><p>Adopted</p></li></ul>',
        nap_mixed: '<p>No status</p>',
      },
    ],
  },
];

jest.mock('redux', () => ({ compose: () => (component) => component }));
jest.mock(
  '@eeacms/volto-cca-policy/hocs',
  () => ({
    withGeoJsonData: () => (component) => component,
    withClientOnly: (component) => component,
    withResponsiveContainer: () => (component) => component,
    withVisibilitySensor: () => (component) => component,
  }),
  { virtual: true },
);
jest.mock(
  '@eeacms/volto-openlayers-map',
  () => ({
    withOpenLayers: (component) => component,
  }),
  { virtual: true },
);
jest.mock(
  '@eeacms/volto-openlayers-map/api',
  () => {
    const React = require('react');
    const Container = ({ children, ...props }) => (
      <div {...props}>{children}</div>
    );
    return {
      Map: Container,
      Layers: Container,
      Controls: Container,
      Layer: { Vector: Container, Tile: Container },
    };
  },
  { virtual: true },
);
jest.mock(
  '@eeacms/volto-cca-policy/helpers/countryMap',
  () => ({
    getImageUrl: () => '/fr.png',
    tooltipStyle: {},
    adjustEuCountryNames: (names) => names,
    euCountryNamesIncludingEnergy: ['France', 'United Kingdom'],
  }),
  { virtual: true },
);
jest.mock('./hooks', () => ({
  useCountriesMetadata: () => mockMetadata,
}));
jest.mock('./mapstyle', () => ({
  makeStyles: () => ({ eucountriesStyle: {}, highlightedCountryStyle: {} }),
}));
jest.mock('./Interactions', () => ({
  Interactions: () => <div data-testid="map-interactions" />,
}));
jest.mock('@plone/volto/helpers/Url/Url', () => ({ addAppURL: (url) => url }), {
  virtual: true,
});
jest.mock(
  '@eeacms/volto-eea-design-system/ui',
  () => ({
    Callout: ({ children }) => <div>{children}</div>,
  }),
  { virtual: true },
);
jest.mock(
  '@plone/volto/components/theme/Image/Image',
  () => (props) => <img {...props} alt="" />,
  { virtual: true },
);
jest.mock('semantic-ui-react', () => {
  const React = require('react');
  const Grid = ({ children, ...props }) => <div {...props}>{children}</div>;
  Grid.Column = ({ children, ...props }) => <div {...props}>{children}</div>;
  return {
    Grid,
    Dropdown: ({ options, onChange, placeholder }) => (
      <select
        aria-label={placeholder}
        onChange={(event) => onChange?.(event, { value: event.target.value })}
      >
        {options.map((option) => (
          <option key={option.key} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    ),
  };
});

const makeOl = () => ({
  format: {
    GeoJSON: class {
      readFeatures = () => mockFeatures;
    },
  },
  source: {
    Vector: class {
      constructor(options) {
        this.options = options;
      }
    },
    TileWMS: class {
      constructor(options) {
        this.options = options;
      }
    },
  },
  proj: { fromLonLat: () => [1, 2] },
});

describe('CountryMapProfile2026 View', () => {
  it('renders map content, selects country, shows adopted links and expands the legend', async () => {
    render(<View geofeatures={{}} projection="EPSG:3857" ol={makeOl()} />);

    expect(
      screen.getByText('Climate-ADAPT country profiles'),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByTestId('map-interactions')).toBeInTheDocument(),
    );
    fireEvent.change(screen.getByLabelText('Select country'), {
      target: { value: 'France' },
    });
    expect(screen.getByText("View France's profile")).toBeInTheDocument();
    expect(screen.getByText('National strategy')).toHaveAttribute(
      'href',
      '/nas',
    );
    expect(screen.getByText('No data reported')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Legend/ }));
    expect(
      screen.getAllByText('EU Member States and EEA member countries').length,
    ).toBeGreaterThan(0);
  });

  it('hides interactions in edit mode', async () => {
    render(
      <View
        geofeatures={{}}
        projection="EPSG:3857"
        ol={makeOl()}
        mode="edit"
      />,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('map-interactions')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('37')).toBeInTheDocument();
  });
});
