import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import UASTLogoMap from './UASTLogoMap';

const mockStore = configureStore();

describe('UASTLogoMap', () => {
  it('should render the component', () => {
    const data = {
      items: {
        'step-1': {
          '@id': '/en/knowledge/tools/urban-ast/step-1-0',
          title: 'Preparing the ground for adaptation',
          items: [
            {
              '@id': '/en/knowledge/tools/urban-ast/step-1-1',
              title: '1.1 Obtaining political support for adaptation',
            },
          ],
        },
      },
      pathname: '/en/knowledge/tools/urban-ast',
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
          <UASTLogoMap {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toBeTruthy();
  });
});
