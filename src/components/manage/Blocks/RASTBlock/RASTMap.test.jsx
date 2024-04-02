import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import RASTMap from './RASTMap';

const mockStore = configureStore();

describe('RASTMap', () => {
  it('should render the component', () => {
    const data = {
      path: '/my-item-href',
      pathname: '',
      activeMenu: 1,
      skip_items: '',
      items: [
        {
          id: 'my-item1',
          title: 'Hello1',
          '@id': '/my-item1',
          '@type': 'Folder',
          url: '/my-item-href1',
        },
        {
          id: 'my-item2',
          title: 'Hello2',
          '@id': '/my-item2',
          '@type': 'Folder',
          url: '/my-item-href2',
        },
        {
          id: 'my-item3',
          title: 'Hello3',
          '@id': '/my-item3',
          '@type': 'Folder',
          url: '/my-item-href3',
        },
        {
          id: 'my-item4',
          title: 'Hello4',
          '@id': '/my-item4',
          '@type': 'Folder',
          url: '/my-item-href4',
        },
        {
          id: 'my-item5',
          title: 'Hello5',
          '@id': '/my-item5',
          '@type': 'Folder',
          url: '/my-item-href5',
        },
        {
          id: 'my-item6',
          title: 'Hello6',
          '@id': '/my-item6',
          '@type': 'Folder',
          url: '/my-item-href6',
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

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <RASTMap {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('.rast-map-block')).toBeInTheDocument();
  });
});
