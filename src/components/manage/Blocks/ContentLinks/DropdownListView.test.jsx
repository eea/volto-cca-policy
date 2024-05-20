import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import DropdownListView from './DropdownListView';
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

describe('DropdownListView', () => {
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
          <DropdownListView {...data} />
        </MemoryRouter>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
