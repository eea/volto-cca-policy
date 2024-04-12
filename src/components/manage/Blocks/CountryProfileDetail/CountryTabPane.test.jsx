import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import CountryTabPane from './CountryTabPane';

const mockStore = configureStore();

describe('CountryTabPane', () => {
  const setActivePanes = () => {
    return 0;
  };
  it('should render the component', () => {
    const data = {
      _index: 2,
      contents: [[{ type: 'div', value: '<p class="testing>Just a test</p>' }]],
      activePanes: 1,
      setActivePanes: setActivePanes,
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
          <CountryTabPane {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('.testing')).toBeInTheDocument();
    // expect(container).toBeTruthy();
  });
});
