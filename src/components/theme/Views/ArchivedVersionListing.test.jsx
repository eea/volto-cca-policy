import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import ArchivedVersionListing from './ArchivedVersionListing';

jest.mock('@plone/volto/helpers/Url/Url', () => ({
  flattenToAppURL: (url) => url.replace('http://localhost:3000', ''),
}));

jest.mock('@eeacms/volto-cca-policy/components', () => ({
  AccordionList: ({ accordions }) => (
    <div className="accordion-list">
      {accordions.map((accordion, index) => (
        <div key={index}>
          <div>{accordion.title}</div>
          <div>{accordion.content}</div>
        </div>
      ))}
    </div>
  ),
}));

const renderWithIntl = (ui) =>
  render(
    <IntlProvider locale="en">
      <MemoryRouter>{ui}</MemoryRouter>
    </IntlProvider>,
  );

describe('ArchivedVersionListing', () => {
  it('returns null when there are no archived versions', () => {
    const content = {
      archived_versions: [],
    };

    const { container } = renderWithIntl(
      <ArchivedVersionListing content={content} />,
    );

    expect(container.innerHTML).toBe('');
  });

  it('returns null when archived_versions is missing', () => {
    const content = {};

    const { container } = renderWithIntl(
      <ArchivedVersionListing content={content} />,
    );

    expect(container.innerHTML).toBe('');
  });

  it('renders archived version links', () => {
    const content = {
      archived_versions: [
        {
          '@id': 'http://localhost:3000/indicator-v1',
          title: 'Indicator v1',
        },
        {
          '@id': 'http://localhost:3000/indicator-v2',
          title: 'Indicator v2',
        },
      ],
    };

    renderWithIntl(<ArchivedVersionListing content={content} />);

    expect(
      screen.getByText('Previous versions of this indicator'),
    ).toBeInTheDocument();

    expect(screen.getByText('Indicator v1')).toHaveAttribute(
      'href',
      '/indicator-v1',
    );

    expect(screen.getByText('Indicator v2')).toHaveAttribute(
      'href',
      '/indicator-v2',
    );
  });

  it('uses the URL as link text when title is missing', () => {
    const content = {
      archived_versions: [
        {
          '@id': 'http://localhost:3000/indicator-v1',
        },
      ],
    };

    renderWithIntl(<ArchivedVersionListing content={content} />);

    expect(screen.getByText('/indicator-v1')).toHaveAttribute(
      'href',
      '/indicator-v1',
    );
  });
});
