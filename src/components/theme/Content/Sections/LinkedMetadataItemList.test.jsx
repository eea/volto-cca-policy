import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import LinkedMetadataItemList from './LinkedMetadataItemList';

const renderComponent = (props) =>
  render(
    <MemoryRouter>
      <IntlProvider locale="en" messages={{}}>
        <LinkedMetadataItemList field="example.keyword" {...props} />
      </IntlProvider>
    </MemoryRouter>,
  );

describe('LinkedMetadataItemList', () => {
  const value = [{ title: 'Flooding' }, { title: 'Drought' }];

  it('renders comma-separated links inline', () => {
    renderComponent({ value, asInline: true });

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0].parentElement).toHaveClass('metadata-inline');
    expect(links[0].parentElement).toHaveTextContent('Flooding, Drought');
  });

  it('renders linked items as a stacked list', () => {
    renderComponent({ value, asList: true });

    expect(screen.getByRole('list')).toHaveClass('metadata-list');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('uses a text search when linking a keyword', () => {
    renderComponent({
      value: ['Flood risk'],
      field: undefined,
    });

    const params = new URL(screen.getByRole('link').href).searchParams;

    expect(params.get('q')).toBe('Flood risk');
    expect(params.has('filters[2][field]')).toBe(false);
  });

  it('can use a token for the search value and a title for the label', () => {
    renderComponent({
      value: [{ token: 'funding-token', title: 'Funding programme' }],
      getSearchValue: (item) => item.token,
    });

    const link = screen.getByRole('link', { name: 'Funding programme' });
    const params = new URL(link.href).searchParams;

    expect(params.get('filters[2][field]')).toBe('example.keyword');
    expect(params.get('filters[2][values][0]')).toBe('funding-token');
  });
});
