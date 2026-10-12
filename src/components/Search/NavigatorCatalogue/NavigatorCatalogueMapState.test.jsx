import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import NavigatorCatalogueMapState from './NavigatorCatalogueMapState';

const renderMapState = (props) =>
  render(
    <IntlProvider locale="en">
      <NavigatorCatalogueMapState {...props}>
        <div data-testid="country-map">Map</div>
      </NavigatorCatalogueMapState>
    </IntlProvider>,
  );

describe('NavigatorCatalogueMapState', () => {
  it('leaves the map interactive when it is enabled', () => {
    renderMapState({ isMapDisabled: false, onClear: jest.fn() });

    expect(screen.getByTestId('country-map').parentElement).not.toHaveAttribute(
      'inert',
    );
    expect(
      screen.queryByText('Select a country to explore the map'),
    ).not.toBeInTheDocument();
  });

  it('disables the map and handles the clear action', () => {
    const onClear = jest.fn();
    renderMapState({ isMapDisabled: true, onClear });

    expect(screen.getByTestId('country-map').parentElement).toHaveAttribute(
      'inert',
    );
    expect(
      screen.getByText('Select a country to explore the map'),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Clear filters',
      }),
    );
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
