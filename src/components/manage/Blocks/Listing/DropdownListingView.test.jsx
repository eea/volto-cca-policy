import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import DropdownListingView from './DropdownListingView';
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

describe('DropdownListingView', () => {
  it('should render the component', () => {
    const data = {
      '@type': 'listing',
      items: [
        {
          '@id': '/item-1',
          title: 'Item 1',
          id: 'item-1',
        },
        {
          '@id': '/item-2',
          title: 'Item 2',
          id: 'item-2',
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
          <DropdownListingView {...data} />
        </MemoryRouter>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
