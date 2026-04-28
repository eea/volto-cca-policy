import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import { render } from '@testing-library/react';
import VersionsGroup from './VersionsGroup';

const mockStore = configureStore();

const store = mockStore({
  userSession: { token: '1234' },
  intl: {
    locale: 'en',
    messages: {},
  },
});

describe('VersionsGroup', () => {
  it('returns null when there is only one version', () => {
    const content = {
      '@id': 'http://localhost:3000/my-indicator',
      '@type': 'Indicator',
      review_state: 'published',
      title: 'My Indicator',
      created: '2024-01-01T00:00:00Z',
      relatedItems: [],
    };
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <VersionsGroup content={content} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders versions list with published as latest', () => {
    const content = {
      '@id': 'http://localhost:3000/my-indicator',
      '@type': 'Indicator',
      review_state: 'published',
      title: 'My Indicator',
      created: '2024-01-01T00:00:00Z',
      relatedItems: [
        {
          '@id': 'http://localhost:3000/my-indicator-v2',
          review_state: 'archived',
          title: 'My Indicator (Archived)',
          created: '2024-06-01T00:00:00Z',
        },
      ],
    };
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <VersionsGroup content={content} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('.versions-group')).toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(container.querySelector('strong')).toBeInTheDocument();
  });

  it('renders versions when viewing an archived copy', () => {
    const content = {
      '@id': 'http://localhost:3000/my-indicator-v2',
      '@type': 'Indicator',
      review_state: 'archived',
      title: 'My Indicator (Archived)',
      created: '2024-06-01T00:00:00Z',
      relatedItems: [
        {
          '@id': 'http://localhost:3000/my-indicator',
          review_state: 'published',
          title: 'My Indicator',
          created: '2024-01-01T00:00:00Z',
        },
      ],
    };
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <VersionsGroup content={content} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('.versions-group')).toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(2);
    const links = container.querySelectorAll('li a');
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it('sorts archived versions by creation date ascending', () => {
    const content = {
      '@id': 'http://localhost:3000/my-indicator',
      '@type': 'Indicator',
      review_state: 'published',
      title: 'My Indicator',
      created: '2024-01-01T00:00:00Z',
      relatedItems: [
        {
          '@id': 'http://localhost:3000/my-indicator-v3',
          review_state: 'archived',
          title: 'My Indicator v3',
          created: '2024-12-01T00:00:00Z',
        },
        {
          '@id': 'http://localhost:3000/my-indicator-v2',
          review_state: 'archived',
          title: 'My Indicator v2',
          created: '2024-06-01T00:00:00Z',
        },
      ],
    };
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <VersionsGroup content={content} />
        </MemoryRouter>
      </Provider>,
    );
    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(3);
    expect(items[1].textContent).toContain('v2');
    expect(items[2].textContent).toContain('v3');
  });
});
