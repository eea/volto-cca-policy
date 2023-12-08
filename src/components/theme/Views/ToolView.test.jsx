import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import ToolView from './ToolView';
import renderer from 'react-test-renderer';

const mockStore = configureStore();

jest.mock('semantic-ui-react', () => ({
  ...jest.requireActual('semantic-ui-react'),
}));

describe('ToolView', () => {
  it('should render the component', () => {
    const content = {
      title: 'My ToolView',
      geochars:
        '{\r\n "geoElements":{"element":"GLOBAL",\r\n "macrotrans":null,"biotrans":null,"countries":[],\r\n "subnational":[],"city":""}}',
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
          <ToolView content={content} />
        </MemoryRouter>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
