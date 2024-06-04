import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import RedirectToLogin from './RedirectToLogin';
import config from '@plone/volto/registry';
import { render } from '@testing-library/react';

config.blocks = {
  blocksConfig: {
    title: {
      view: () => <div>Title Block Component</div>,
    },
  },
};

const mockStore = configureStore();

describe('RedirectToLogin', () => {
  it('redirects to login if no token', () => {
    const store = mockStore({
      userSession: { token: '1234' },
      intl: {
        locale: 'en',
        messages: {},
      },
    });
    const history = { push: jest.fn(() => null) };
    const location = {
      pathname: '/en/metadata/add',
      search: '?type=NewsItem',
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <RedirectToLogin history={history} token={null} location={location} />
        </MemoryRouter>
      </Provider>,
    );

    expect(history.push.mock.calls[0][0]).toBe(
      '/login?return_url=%2Fen%2Fmetadata%2Fadd%3Ftype%3DNewsItem',
    );
  });

  it('does not redirect to login if token', () => {
    const store = mockStore({
      userSession: { token: '1234' },
      intl: {
        locale: 'en',
        messages: {},
      },
    });
    const history = { push: jest.fn(() => null) };
    const location = {
      pathname: '/en/metadata/add',
      search: '?type=NewsItem',
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <RedirectToLogin
            history={history}
            token={'something'}
            location={location}
          />
        </MemoryRouter>
      </Provider>,
    );

    expect(history.push.mock.calls).toHaveLength(0);
  });
});
