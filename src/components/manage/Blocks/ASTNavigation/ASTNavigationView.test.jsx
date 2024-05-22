import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { Provider } from 'react-intl-redux';
import ASTNavigationView from './ASTNavigationView';

const mockStore = configureStore();

describe('ASTLogoMap', () => {
  it('should render the component', () => {
    const data = {
      items: {
        'step-0': {
          '@id': '/en/knowledge/tools/adaptation-support-tool',
          title: 'Preparing the ground for adaptation',
          items: [
            {
              '@id': '/en/knowledge/tools/adaptation-support-tool/step-1-1',
              title:
                '1.1 Obtaining high-level political support for adaptation',
            },
          ],
        },
      },
      pathname: '/en/knowledge/tools/adaptation-support-tool',
      image_type: 'ast',
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
          <ASTNavigationView path="/en/ast-nav" data={data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toBeTruthy();
  });
});
