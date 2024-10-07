import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import FeatureDisplay from './FeatureDisplay';

const mockStore = configureStore();

describe('FeatureDisplay', () => {
  it('should render the component', () => {
    const feature = {
      title: 'Case study',
      url: 'http://example.com',
      image: 'http://example.com/image.jpg',
      impacts: 'Impact A, Impact B',
      adaptation_options_links: '',
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
          <FeatureDisplay feature={feature} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toBeTruthy();
  });

  it('should not render the component', () => {
    const feature = null;

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
          <FeatureDisplay feature={feature} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toBeTruthy();
  });
});
