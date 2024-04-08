import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import MissiongFundingCCAView from './MissionFundingCCAView';

const mockStore = configureStore();

describe('MissiongFundingCCAView', () => {
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
          <MissiongFundingCCAView {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(
      container.querySelector('.mission-funding-cca-view'),
    ).toBeInTheDocument();
  });
});
