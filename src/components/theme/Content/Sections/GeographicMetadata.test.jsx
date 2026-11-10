import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import GeographicMetadata from './GeographicMetadata';

const renderComponent = (content) =>
  render(
    <MemoryRouter>
      <IntlProvider locale="en" messages={{}}>
        <GeographicMetadata content={content} />
      </IntlProvider>
    </MemoryRouter>,
  );

describe('GeographicMetadata', () => {
  it('links countries to their search facet', () => {
    renderComponent({
      geochars: JSON.stringify({ geoElements: { countries: ['Germany'] } }),
      spatial_layer: '',
      spatial_values: [],
    });

    const link = screen.getByRole('link', { name: 'Germany' });
    const params = new URL(link.href).searchParams;

    expect(params.get('filters[2][field]')).toBe(
      'cca_geographic_countries.keyword',
    );
    expect(params.get('filters[2][values][0]')).toBe('Germany');
  });

  it('links spatial country values to their search facet', () => {
    renderComponent({
      geochars: null,
      spatial_layer: 'Countries',
      spatial_values: [{ token: 'France' }],
    });

    expect(screen.getByRole('link', { name: 'France' })).toBeInTheDocument();
  });

  it('links macro-transnational regions to their search facet', () => {
    renderComponent({
      geochars: JSON.stringify({
        geoElements: { macrotrans: ['TRANS_MACRO_ALP_SPACE'] },
      }),
      spatial_layer: '',
      spatial_values: [],
    });

    const link = screen.getByRole('link', { name: 'Alpine Space' });
    const params = new URL(link.href).searchParams;

    expect(params.get('filters[2][field]')).toBe(
      'cca_geographic_transnational_region.keyword',
    );
    expect(params.get('filters[2][values][0]')).toBe('Alpine Space');
  });
});
