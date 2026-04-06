import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import SimpleItemListingView from './SimpleItemListingView';

const mockStore = configureStore();

jest.mock('@plone/volto/components', () => ({
  ConditionalLink: ({ children }) => <div>{children}</div>,
}));

jest.mock('@plone/volto/helpers', () => ({
  getBaseUrl: (id) => id,
}));

describe('SimpleItemListingView', () => {
  it('renders item titles and falls back to id when title missing', () => {
    const items = [
      { '@id': '/item-1', title: 'Item One', id: 'item-1' },
      { '@id': '/item-2', id: 'item-2' },
    ];

    const store = mockStore({
      intl: { locale: 'en', messages: {} },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SimpleItemListingView items={items} isEditMode={false} />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Item One')).toBeInTheDocument();
    // second item has no title so should fall back to id
    expect(screen.getByText('item-2')).toBeInTheDocument();
  });

  it('renders items when in edit mode', () => {
    const items = [{ '@id': '/item-3', title: 'Edit Item', id: 'item-3' }];

    const store = mockStore({
      intl: { locale: 'en', messages: {} },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SimpleItemListingView items={items} isEditMode={true} />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Edit Item')).toBeInTheDocument();
  });
});
