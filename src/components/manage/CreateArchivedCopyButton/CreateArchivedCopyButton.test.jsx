import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import { render, fireEvent } from '@testing-library/react';
import CreateArchivedCopyButton from './CreateArchivedCopyButton';
import { INDICATOR } from '@eeacms/volto-cca-policy/constants';

jest.mock('@plone/volto/components/manage/Pluggable', () => ({
  Plug: ({ children }) => <>{children}</>,
}));

jest.mock('superagent', () => ({
  post: jest.fn(() => ({
    set: jest.fn(() => ({
      set: jest.fn(() => ({
        send: jest.fn(() =>
          Promise.resolve({
            body: { '@id': 'http://localhost:3000/my-indicator-v2' },
          }),
        ),
      })),
    })),
  })),
}));

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('@plone/volto/components/manage/Toast/Toast', () => () => null);
jest.mock('@plone/volto/helpers/Url/Url', () => ({
  flattenToAppURL: (url) => url.replace('http://localhost:3000', ''),
  expandToBackendURL: (url) =>
    url.replace('http://localhost:3000', 'http://localhost:8080/Plone'),
}));

const mockStore = configureStore();

function makeStore(contentOverrides = {}, token = '1234') {
  return mockStore({
    content: {
      data: {
        '@type': INDICATOR,
        review_state: 'published',
        '@id': 'http://localhost:3000/my-indicator',
        id: 'my-indicator',
        title: 'My Indicator',
        ...contentOverrides,
      },
    },
    userSession: { token },
    intl: { locale: 'en', messages: {} },
  });
}

function renderWithProviders(ui, store) {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
  );
}

describe('CreateArchivedCopyButton', () => {
  it('returns null when user is not logged in', () => {
    const store = makeStore({}, null);
    const { container } = renderWithProviders(
      <CreateArchivedCopyButton />,
      store,
    );
    expect(container.innerHTML).toBe('');
  });

  it('returns null for non-indicator content type', () => {
    const store = makeStore({ '@type': 'Document' });
    const { container } = renderWithProviders(
      <CreateArchivedCopyButton />,
      store,
    );
    expect(container.innerHTML).toBe('');
  });

  it('returns null for non-published indicator', () => {
    const store = makeStore({ review_state: 'draft' });
    const { container } = renderWithProviders(
      <CreateArchivedCopyButton />,
      store,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders the button for a published indicator with a logged-in user', () => {
    const store = makeStore();
    const { container } = renderWithProviders(
      <CreateArchivedCopyButton />,
      store,
    );
    expect(
      container.querySelector('#create-archived-copy-btn'),
    ).toBeInTheDocument();
    expect(container.querySelector('#create-archived-copy-btn').title).toBe(
      'Create an archived copy',
    );
  });

  it('opens modal when button is clicked', () => {
    const store = makeStore();
    const { container, getByText } = renderWithProviders(
      <CreateArchivedCopyButton />,
      store,
    );
    fireEvent.click(container.querySelector('#create-archived-copy-btn'));
    expect(getByText('Create an archived copy')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
    expect(getByText('Create')).toBeInTheDocument();
  });

  it('closes modal on cancel', () => {
    const store = makeStore();
    const { container, getByText, queryByText } = renderWithProviders(
      <CreateArchivedCopyButton />,
      store,
    );
    fireEvent.click(container.querySelector('#create-archived-copy-btn'));
    expect(getByText('Create an archived copy')).toBeInTheDocument();
    fireEvent.click(getByText('Cancel'));
    expect(queryByText('Title')).toBeNull();
  });
});
