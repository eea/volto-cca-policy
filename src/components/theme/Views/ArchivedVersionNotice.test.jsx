import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import { render } from '@testing-library/react';
import ArchivedVersionNotice from './ArchivedVersionNotice';

const mockStore = configureStore();

const store = mockStore({
  userSession: { token: '1234' },
  intl: {
    locale: 'en',
    messages: {},
  },
});

describe('ArchivedVersionNotice', () => {
  it('returns null when content is not archived', () => {
    const content = {
      '@type': 'Document',
      review_state: 'published',
      relatedItems: [],
    };
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ArchivedVersionNotice content={content} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('returns null when archived but no published related item', () => {
    const content = {
      '@type': 'Document',
      review_state: 'archived',
      relatedItems: [
        {
          '@id': 'http://localhost:3000/another-archived',
          review_state: 'archived',
        },
      ],
    };
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ArchivedVersionNotice content={content} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders a notice with a link to the published version', () => {
    const content = {
      '@id': 'http://localhost:3000/archived-indicator',
      '@type': 'Indicator',
      review_state: 'archived',
      title: 'My Indicator (Archived)',
      relatedItems: [
        {
          '@id': 'http://localhost:3000/my-indicator',
          review_state: 'published',
          title: 'My Indicator',
        },
      ],
    };
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ArchivedVersionNotice content={content} />
        </MemoryRouter>
      </Provider>,
    );
    expect(
      container.querySelector('.archived-version-notice'),
    ).toBeInTheDocument();
    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      '/my-indicator',
    );
  });
});
