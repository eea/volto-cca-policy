import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-intl-redux';
import { BrokenLinksComponent } from './BrokenLinks';

const mockStore = configureStore();

describe('BrokenLinksComponent', () => {
  it('should render the component', async () => {
    const store = mockStore({
      userSession: { token: '1234' },
      intl: {
        locale: 'en',
        messages: {},
      },
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            broken_links: {},
          }),
      }),
    );

    const reactTable = await import('@tanstack/react-table');

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <BrokenLinksComponent reactTable={reactTable} />
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});
