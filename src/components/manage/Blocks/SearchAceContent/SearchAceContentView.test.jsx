import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import SearchAceContentView from './SearchAceContentView';

const mockStore = configureStore();

jest.mock('semantic-ui-react', () => ({
  ...jest.requireActual('semantic-ui-react'),
  Icon: () => <div>Icon</div>,
}));

describe('SearchAceContentView', () => {
  it('should render the component', () => {
    const data = {
      _v_results: [
        ['Publications and reports', 154, '/', []],
        ['Information portals', 57, '/', []],
      ],
    };

    const store = mockStore({
      userSession: { token: '1234' },
      intl: {
        locale: 'en',
        messages: {},
      },
    });

    const component = renderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <SearchAceContentView data={data} />
        </MemoryRouter>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
