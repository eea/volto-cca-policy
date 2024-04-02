import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import RASTMap from './RASTMap';

const mockStore = configureStore();

describe('RASTMap', () => {
  it('should render the component', () => {
    const data = {
      path: '/my-item-href',
      pathname: '',
      activeMenu: 1,
      skip_items: '',
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
          <RASTMap {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('.rast-map-block')).toBeInTheDocument();
  });
});
