import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import Filter from './Filter';

const mockStore = configureStore();

describe('Filter', () => {
  it('should render the component', () => {
    const data = {
      thematicMapMode: 'hhap',
      setThematicMapMode(param) {
        return param;
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
          <Filter {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('#cse-filter')).toBeInTheDocument();
  });
});
