import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import ContentLinksView from './ContentLinksView';
import config from '@plone/volto/registry';

config.blocks = {
  blocksConfig: {
    contentLinks: {
      variations: [
        {
          id: 'default',
          title: 'Simple list (default)',
          isDefault: true,
        },
        {
          id: 'navigationList',
          title: 'Navigation list',
          isDefault: false,
        },
      ],
    },
  },
};

const mockStore = configureStore();

jest.mock('semantic-ui-react', () => ({
  ...jest.requireActual('semantic-ui-react'),
  Icon: () => <div>Icon</div>,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: () => <div>Link</div>,
}));

describe('ContentLinksView', () => {
  it('should render the component', () => {
    const data = {
      '@type': 'contentLinks',
      items: [
        {
          item_title: 'Item 1',
          source: [
            {
              '@id': '/item-1',
              title: 'Item 1',
            },
          ],
        },
        {
          '@id': '7e2af23d-3905-404c-895f-0d31ea5878ef',
          item_title: 'Item 2',
          source: [
            {
              '@id': '/item-2',
              title: 'Item 2',
            },
          ],
        },
      ],
      show_share_btn: false,
      title: 'Navigation',
      variation: 'default',
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
          <ContentLinksView data={data} />
        </MemoryRouter>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
