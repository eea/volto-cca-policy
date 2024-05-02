import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import { RedirectBlockDetails } from './RedirectBlockView';

const mockStore = configureStore();

describe('RedirectBlockDetails', () => {
  it('should render the component', () => {
    const data = {
      href: [
        {
          id: 'my-item',
          title: 'Hello',
          '@id': '/my-item',
          '@type': 'Folder',
          href: '/my-item-href',
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
          <RedirectBlockDetails data={data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('.redirect-block')).toBeInTheDocument();
  });
});
