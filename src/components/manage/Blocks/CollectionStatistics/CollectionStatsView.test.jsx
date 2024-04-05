import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import CollectionStatsView from './CollectionStatsView';

const mockStore = configureStore();

describe('CollectionStatsView', () => {
  it('should render the component', () => {
    const data = {};

    const store = mockStore({
      userSession: { token: '1234' },
      intl: {
        locale: 'en',
        messages: {},
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CollectionStatsView {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('.collection-stats')).toBeInTheDocument();
  });
});
