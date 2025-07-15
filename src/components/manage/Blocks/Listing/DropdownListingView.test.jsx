import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-intl-redux';
import DropdownListingView from './DropdownListingView';

const mockStore = configureStore();

describe('DropdownListingView', () => {
  it('renders dropdown with items', () => {
    const data = {
      '@type': 'listing',
      items: [
        {
          '@id': '/item-1',
          title: 'Item 1',
          id: 'item-1',
        },
        {
          '@id': '/item-2',
          title: 'Item 2',
          id: 'item-2',
        },
      ],
    };

    const store = mockStore({
      userSession: { token: '1234' },
      intl: {
        locale: 'en',
        messages: {},
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DropdownListingView {...data} />
        </MemoryRouter>
      </Provider>,
    );

    // Check the placeholder text is present
    expect(screen.getByText('Select')).toBeInTheDocument();

    expect(screen.getAllByText('Item 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Item 2').length).toBeGreaterThan(0);
  });
});
