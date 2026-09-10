import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import ExtendedToolGeographicMetadata from './ExtendedToolGeographicMetadata';

jest.mock('./MetadataItemList', () => ({
  __esModule: true,
  default: ({ value = [], asTags, maxItems }) => (
    <div
      data-testid="metadata-item-list"
      data-astags={asTags ? 'true' : 'false'}
      data-maxitems={maxItems}
    >
      {value.map((item) => item.title || item.token || item).join(', ')}
    </div>
  ),
}));

const renderComponent = (content) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <ExtendedToolGeographicMetadata content={content} />
    </IntlProvider>,
  );

describe('ExtendedToolGeographicMetadata', () => {
  it('renders categories and tags in order without Europe prefix', () => {
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

    const metadataEl = container.querySelector(
      '.extended-tool-geographic-metadata',
    );
    expect(metadataEl).toHaveTextContent(
      'Countries:Germany, France' +
        'Macro-Transnational region:Alpine Space, Danube Area' +
        'Biogeographical regions:Alpine' +
        'Sub Nationals:Prov. Antwerpen (BE)' +
        'Cities:Brussels',
    );
    expect(metadataEl).not.toHaveTextContent('Europe');

    const titles = container.querySelectorAll('.geographic-category-title');
    expect(titles).toHaveLength(5);
    expect(titles[0]).toHaveTextContent('Countries:');
    expect(titles[1]).toHaveTextContent('Macro-Transnational region:');
    expect(titles[2]).toHaveTextContent('Biogeographical regions:');
    expect(titles[3]).toHaveTextContent('Sub Nationals:');
    expect(titles[4]).toHaveTextContent('Cities:');

    const tagContainers = screen.getAllByTestId('metadata-item-list');
    expect(tagContainers).toHaveLength(5);
    tagContainers.forEach((tc) => {
      expect(tc).toHaveAttribute('data-astags', 'true');
      expect(tc).toHaveAttribute('data-maxitems', '3');
    });
  });

  it('renders country category without Europe prefix (e.g. Portugal)', () => {
    const { container } = renderComponent({
      geochars: JSON.stringify({
        geoElements: {
          element: 'EUROPE',
          countries: ['PT'],
        },
      }),
    });

    const metadataEl = container.querySelector(
      '.extended-tool-geographic-metadata',
    );
    expect(metadataEl).toHaveTextContent('Countries:Portugal');
    expect(metadataEl).not.toHaveTextContent('Europe');
  });

  it('renders city category as Cities without Europe prefix (e.g. Selected cities)', () => {
    const { container } = renderComponent({
      geochars: JSON.stringify({
        geoElements: {
          element: 'EUROPE',
          city: 'Selected cities',
        },
      }),
    });

    const metadataEl = container.querySelector(
      '.extended-tool-geographic-metadata',
    );
    expect(metadataEl).toHaveTextContent('Cities:Selected cities');
    expect(metadataEl).not.toHaveTextContent('Europe');
  });

  it('renders element when no specific regions exist', () => {
    const { container } = renderComponent({
      geochars: JSON.stringify({
        geoElements: {
          element: 'EUROPE',
        },
      }),
    });

    const metadataEl = container.querySelector(
      '.extended-tool-geographic-metadata',
    );
    expect(metadataEl).toHaveTextContent('Europe');
    expect(
      container.querySelector('.geographic-category-title'),
    ).not.toBeInTheDocument();
  });

  it('renders Global when element is GLOBAL and no specific regions exist', () => {
    const { container } = renderComponent({
      geochars: JSON.stringify({
        geoElements: {
          element: 'GLOBAL',
        },
      }),
    });

    const metadataEl = container.querySelector(
      '.extended-tool-geographic-metadata',
    );
    expect(metadataEl).toHaveTextContent('Global');
    expect(
      container.querySelector('.geographic-category-title'),
    ).not.toBeInTheDocument();
  });

  it('supports legacy spatial fields', () => {
    const { container } = renderComponent({
      spatial_layer: 'Countries',
      spatial_values: [{ token: 'France' }],
    });

    const metadataEl = container.querySelector(
      '.extended-tool-geographic-metadata',
    );
    expect(metadataEl).toHaveTextContent('Countries:France');
  });
});
