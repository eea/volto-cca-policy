import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import C3SIndicatorsListingBlockView from './C3SIndicatorsListingBlockView';

const mockStore = configureStore();

describe('C3SIndicatorsListingBlockView', () => {
  it('should render the component', () => {
    const data = {
      metadata: {
        '@components': {
          c3s_indicators_listing: {
            items: [
              { url: 'https://www.europa.eu', title: 'Europa' },
              { url: 'https://www.copernicus.eu/en', title: 'Copernicus' },
            ],
          },
        },
      },
    };

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
          <C3SIndicatorsListingBlockView {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toBeTruthy();
  });
});
