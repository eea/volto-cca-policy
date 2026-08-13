import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import ExtendedToolGeographicMetadata from './ExtendedToolGeographicMetadata';

jest.mock('./MetadataItemList', () => ({
  __esModule: true,
  default: ({ value = [] }) => (
    <p>{value.map((item) => item.title || item.token || item).join(', ')}</p>
  ),
}));

const renderComponent = (content) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <ExtendedToolGeographicMetadata content={content} />
    </IntlProvider>,
  );

describe('ExtendedToolGeographicMetadata', () => {
  it('renders geochars in the Extended Tool design order', () => {
    const { container } = renderComponent({
      geochars: JSON.stringify({
        geoElements: {
          element: 'EUROPE',
          countries: ['DE', 'FR'],
          macrotrans: ['TRANS_MACRO_ALP_SPACE', 'TRANS_MACRO_DANUBE'],
          biotrans: ['TRANS_BIO_ALPINE'],
          subnational: ['SUBN_Prov__Antwerpen__BE_'],
          city: 'Brussels',
        },
      }),
    });

    expect(
      container.querySelector('.extended-tool-geographic-metadata'),
    ).toHaveTextContent(
      'Europe · Germany, France · Alpine Space, Danube Area · Alpine · Prov. Antwerpen (BE) · Brussels',
    );
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('supports legacy spatial fields', () => {
    const { container } = renderComponent({
      spatial_layer: 'Global',
      spatial_values: [{ token: 'France' }],
    });

    expect(
      container.querySelector('.extended-tool-geographic-metadata'),
    ).toHaveTextContent('Global · France');
  });
});
