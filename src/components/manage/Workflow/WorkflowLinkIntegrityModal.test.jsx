import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import { render, screen } from '@testing-library/react';
import WorkflowLinkIntegrityModal from './WorkflowLinkIntegrityModal';

const mockStore = configureStore();

function makeStore(overrides = {}) {
  return mockStore({
    linkIntegrity: {
      result: null,
      loading: false,
      loaded: true,
      ...overrides,
    },
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

describe('WorkflowLinkIntegrityModal', () => {
  it('renders nothing when not open', () => {
    const store = makeStore();
    const { container } = renderWithProviders(
      <WorkflowLinkIntegrityModal
        open={false}
        onCancel={() => {}}
        onOk={() => {}}
      />,
      store,
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows loading state while link integrity check is in progress', () => {
    const store = makeStore({ loading: true });
    renderWithProviders(
      <WorkflowLinkIntegrityModal
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
      />,
      store,
    );
    expect(screen.getByText('Checking references...')).toBeInTheDocument();
  });

  it('auto-proceeds when no breaches are found', () => {
    const store = makeStore({
      result: [{ breaches: [], '@id': 'http://localhost:8080/Plone/target' }],
      loaded: true,
    });
    const { container } = renderWithProviders(
      <WorkflowLinkIntegrityModal
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
      />,
      store,
    );
    // brokenReferences === 0 so the Confirm dialog is not rendered
    expect(container.innerHTML).toBe('');
  });

  it('shows warning modal with breach list when breaches are found', () => {
    const store = makeStore({
      result: [
        {
          '@id': 'http://localhost:8080/Plone/target',
          title: 'Target Page',
          breaches: [
            {
              '@id': 'http://localhost:8080/Plone/source1',
              title: 'Source Page 1',
              uid: 'uid-source1',
            },
          ],
        },
      ],
      loaded: true,
    });
    renderWithProviders(
      <WorkflowLinkIntegrityModal
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
      />,
      store,
    );
    expect(
      screen.getByText('Warning: Potential broken links'),
    ).toBeInTheDocument();
    expect(screen.getByText('Source Page 1')).toBeInTheDocument();
    expect(
      screen.getByText('Change state anyway'),
    ).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('aggregates multiple breaches from the same source', () => {
    const store = makeStore({
      result: [
        {
          '@id': 'http://localhost:8080/Plone/target1',
          title: 'Target 1',
          breaches: [
            {
              '@id': 'http://localhost:8080/Plone/source1',
              title: 'Source Page',
              uid: 'uid-source1',
            },
          ],
        },
        {
          '@id': 'http://localhost:8080/Plone/target2',
          title: 'Target 2',
          breaches: [
            {
              '@id': 'http://localhost:8080/Plone/source1',
              title: 'Source Page',
              uid: 'uid-source1',
            },
          ],
        },
      ],
      loaded: true,
    });
    renderWithProviders(
      <WorkflowLinkIntegrityModal
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
      />,
      store,
    );
    // Both breaches come from the same source, so brokenReferences === 1
    expect(screen.getByText('Source Page')).toBeInTheDocument();
    expect(screen.getByText('Target 1')).toBeInTheDocument();
    expect(screen.getByText('Target 2')).toBeInTheDocument();
  });
});
