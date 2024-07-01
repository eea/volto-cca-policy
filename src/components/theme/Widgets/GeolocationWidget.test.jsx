import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';

import GeolocationWidget from './GeolocationWidget';

jest.mock(
  '@eeacms/volto-cca-policy/components/theme/Widgets/GeolocationWidgetMapContainer',
);
const mockStore = configureStore();

describe('GeolocationWidget', () => {
  it('should render the component', () => {
    const data = {
      value: {
        latitude: 10,
        longitude: 50,
      },
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
          <GeolocationWidget {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toBeTruthy();
  });
});
