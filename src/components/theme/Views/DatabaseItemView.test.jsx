import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import DatabaseItemView from './DatabaseItemView';
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

jest.mock('@eeacms/volto-embed', () => {
  return {
    PrivacyProtection: jest.fn(({ children }) => <div>{children}</div>),
  };
});

describe('DatabaseItemView', () => {
  it('should render the component', () => {
    const content = {
      title: 'My DatabaseItemView',
      long_description: {
        'content-type': null,
        data:
          '<p>Nam commodo suscipit quam. Praesent egestas neque eu enim. Quisque rutrum.</p>',
        encoding: 'utf-8',
      },
      publication_date: '2022-06-24',
      geochars:
        '{\r\n "geoElements":{"element":"GLOBAL",\r\n "macrotrans":null,"biotrans":null,"countries":[],\r\n "subnational":[],"city":""}}',
      keywords: ['keyword 1', 'keyword 2'],
      websites: ['https://example.org/'],
      contributions: [
        {
          title: 'Contributor 1',
          url: '/',
        },
        {
          title: 'Contributor 2',
          url: '/',
        },
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
          <DatabaseItemView content={content} />
        </MemoryRouter>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
