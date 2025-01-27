import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import AdaptationOptionView from './AdaptationOptionView';
import renderer from 'react-test-renderer';
import config from '@plone/volto/registry';

config.blocks = {
  blocksConfig: {
    title: {
      view: () => <div>Title Block Component</div>,
    },
  },
};

const mockStore = configureStore();

jest.mock('semantic-ui-react', () => ({
  ...jest.requireActual('semantic-ui-react'),
}));

describe('AdaptationOptionView', () => {
  it('should render the component', () => {
    const content = {
      title: 'AdaptationOptionView',
      geochars:
        '{\r\n "geoElements":{"element":"GLOBAL",\r\n "macrotrans":null,"biotrans":null,"countries":[],\r\n "subnational":[],"city":""}}',
      ipcc_category: [
        {
          title: 'Structural and physical: Ecosystem-based adaptation options',
          token: 'STRUCT_ECO',
        },
      ],
      websites: ['https://my-website.com'],
      cca_published: '2022-06-24T12:52:50+00:00',
      source: {
        'content-type': 'text/html',
        data: '<p>Some text</p>',
        encoding: 'utf-8',
      },
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
          <AdaptationOptionView content={content} />
        </MemoryRouter>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
