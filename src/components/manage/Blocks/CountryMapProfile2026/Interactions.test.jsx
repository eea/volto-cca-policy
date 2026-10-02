import React from 'react';
import { render, act } from '@testing-library/react';
import { Interactions } from './Interactions';

const mockView = { animate: jest.fn(), fit: jest.fn() };
const mockMap = {
  getView: jest.fn(() => mockView),
  getTargetElement: jest.fn(() => ({
    style: {},
    getBoundingClientRect: () => ({ left: 10, top: 20 }),
  })),
  getPixelFromCoordinate: jest.fn(() => [4, 5]),
  on: jest.fn(),
  un: jest.fn(),
};
jest.mock(
  '@eeacms/volto-openlayers-map/api',
  () => ({
    useMapContext: () => ({ map: mockMap }),
  }),
  { virtual: true },
);
jest.mock(
  '@eeacms/volto-cca-policy/helpers/countryMap',
  () => ({
    euCountryNames: ['France', 'Moldova'],
    getClosestFeatureToCoordinate: jest.fn(),
  }),
  { virtual: true },
);

import { getClosestFeatureToCoordinate } from '@eeacms/volto-cca-policy/helpers/countryMap';

describe('CountryMapProfile2026 Interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockView.animate.mockClear();
    mockView.fit.mockClear();
  });

  it('registers map handlers, selects features, updates highlights and cleans up', () => {
    const selectedFeature = {
      get: (key) => (key === 'na' ? 'France' : undefined),
      getGeometry: () => ({ getExtent: () => [0, 0, 1, 1] }),
    };
    getClosestFeatureToCoordinate.mockReturnValue(selectedFeature);
    const setSelectedCountry = jest.fn();
    const setStateHighlight = jest.fn();
    const tooltipRef = { current: { style: {} } };
    const features = { current: [selectedFeature] };
    const ol = {
      proj: { fromLonLat: jest.fn(() => [14, 57]) },
      extent: { getCenter: jest.fn(() => [0.5, 0.5]) },
    };
    const { unmount } = render(
      <Interactions
        baseUrl="/en"
        highlight={{ current: null }}
        tooltipRef={tooltipRef}
        euCountryFeatures={features}
        setStateHighlight={setStateHighlight}
        countries_metadata={[{ France: [{}] }]}
        ol={ol}
        selectedCountry="France"
        setSelectedCountry={setSelectedCountry}
      />,
    );

    expect(mockMap.getView().fit).toHaveBeenCalled();
    const clickHandler = mockMap.on.mock.calls.find(
      ([event]) => event === 'click',
    )[1];
    const moveHandler = mockMap.on.mock.calls.find(
      ([event]) => event === 'pointermove',
    )[1];
    act(() => {
      clickHandler({ dragging: false, coordinate: [0, 0] });
      moveHandler({ dragging: false, coordinate: [0, 0] });
    });
    expect(setSelectedCountry).toHaveBeenCalledWith('France');
    expect(setStateHighlight).toHaveBeenCalledWith('France');

    unmount();
    expect(mockMap.un).toHaveBeenCalledWith('click', clickHandler);
    expect(mockMap.un).toHaveBeenCalledWith('pointermove', moveHandler);
  });

  it('resets the view when no country is selected and ignores dragging events', () => {
    const feature = { get: () => 'France' };
    const features = { current: [feature] };
    const ol = { proj: { fromLonLat: jest.fn(() => [1, 2]) }, extent: {} };
    const { unmount } = render(
      <Interactions
        baseUrl="/en/countries-regions/countries"
        highlight={{ current: null }}
        tooltipRef={{ current: { style: {} } }}
        euCountryFeatures={features}
        setStateHighlight={jest.fn()}
        countries_metadata={[]}
        ol={ol}
        selectedCountry=""
        setSelectedCountry={jest.fn()}
      />,
    );
    expect(mockMap.getView().animate).toHaveBeenCalledWith(
      expect.objectContaining({ zoom: 3.3 }),
    );
    const clickHandler = mockMap.on.mock.calls.find(
      ([event]) => event === 'click',
    )[1];
    const moveHandler = mockMap.on.mock.calls.find(
      ([event]) => event === 'pointermove',
    )[1];
    const callsBefore = getClosestFeatureToCoordinate.mock.calls.length;
    act(() => {
      clickHandler({ dragging: true, coordinate: [0, 0] });
      moveHandler({ dragging: true, coordinate: [0, 0] });
    });
    expect(getClosestFeatureToCoordinate).toHaveBeenCalledTimes(callsBefore);
    unmount();
  });
});
