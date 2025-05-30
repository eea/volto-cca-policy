import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import C3SIndicatorsGlossaryBlockView from './C3SIndicatorsGlossaryBlockView';

const mockStore = configureStore();

describe('C3SIndicatorsGlossaryBlockView', () => {
  it('should render the component', () => {
    const data = {
      mode: 'test',
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
          <C3SIndicatorsGlossaryBlockView {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toBeTruthy();
  });
});
