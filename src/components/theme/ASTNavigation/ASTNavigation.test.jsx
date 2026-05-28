import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { IntlProvider } from 'react-intl';
import ASTNavigation from './ASTNavigation';
import * as searchActions from '@plone/volto/actions/search/search';

const mockStore = configureStore();

jest.mock('@plone/volto/actions/search/search', () => ({
  searchContent: jest.fn(() => ({
    type: 'SEARCH_CONTENT',
    payload: {},
  })),
}));

jest.mock('./ASTAccordion', () => {
  return function MockASTAccordion() {
    return <div data-testid="ast-accordion">ASTAccordion</div>;
  };
});

describe('ASTNavigation', () => {
  const defaultProps = {
    astNavigation: {
      root_path: 'knowledge/tools/adaptation-support-tool',
    },
  };

  const mockLocation = {
    pathname: '/en/knowledge/tools/adaptation-support-tool',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the navigation wrapper with ASTAccordion when items exist', () => {
    const items = [
      {
        '@id': '/en/knowledge/tools/adaptation-support-tool/step-1',
        title: 'Step 1',
      },
      {
        '@id': '/en/knowledge/tools/adaptation-support-tool/step-2',
        title: 'Step 2',
      },
    ];

    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      search: {
        subrequests: {
          ast: {
            items: items,
          },
        },
      },
    });

    const { container, getByTestId } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockLocation.pathname]}>
          <IntlProvider locale="en" messages={{}}>
            <ASTNavigation {...defaultProps} />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    const navigationDiv = container.querySelector('.ast-navigation');
    expect(navigationDiv).toBeInTheDocument();
    expect(getByTestId('ast-accordion')).toBeInTheDocument();
  });

  it('should not render anything when no items exist', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      search: {
        subrequests: {
          ast: {
            items: [],
          },
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockLocation.pathname]}>
          <IntlProvider locale="en" messages={{}}>
            <ASTNavigation {...defaultProps} />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(container.querySelector('.ast-navigation')).not.toBeInTheDocument();
  });

  it('should not render anything when items are undefined', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      search: {
        subrequests: null,
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockLocation.pathname]}>
          <IntlProvider locale="en" messages={{}}>
            <ASTNavigation {...defaultProps} />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(container.querySelector('.ast-navigation')).not.toBeInTheDocument();
  });

  it('should dispatch searchContent for adaptation support tool', () => {
    const items = [
      {
        '@id': '/en/knowledge/tools/adaptation-support-tool/step-1',
        title: 'Step 1',
      },
    ];

    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      search: {
        subrequests: {
          ast: {
            items: items,
          },
        },
      },
    });

    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={['/en/knowledge/tools/adaptation-support-tool']}
        >
          <IntlProvider locale="en" messages={{}}>
            <ASTNavigation
              {...defaultProps}
              astNavigation={{
                root_path: 'knowledge/tools/adaptation-support-tool',
              }}
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(searchActions.searchContent).toHaveBeenCalledWith(
      '/en/knowledge/tools/adaptation-support-tool',
      {
        'path.depth': 1,
        portal_type: ['Folder'],
        object_provides: 'eea.climateadapt.interfaces.ICover',
        review_state: 'published',
        b_size: 100,
      },
      'ast',
    );
  });

  it('should dispatch searchContent for urban adaptation support tool', () => {
    const items = [
      {
        '@id': '/en/knowledge/tools/urban-ast/step-1',
        title: 'Step 1',
      },
    ];

    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      search: {
        subrequests: {
          ast: {
            items: items,
          },
        },
      },
    });

    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/en/knowledge/tools/urban-ast']}>
          <IntlProvider locale="en" messages={{}}>
            <ASTNavigation
              {...defaultProps}
              astNavigation={{
                root_path: 'knowledge/tools/urban-ast',
              }}
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(searchActions.searchContent).toHaveBeenCalledWith(
      '/en/knowledge/tools/urban-ast',
      {
        'path.depth': 1,
        portal_type: ['Folder'],
        review_state: 'published',
        b_size: 100,
      },
      'ast',
    );
  });

  it('should pass correct props to ASTAccordion', () => {
    const items = [
      {
        '@id': '/en/knowledge/tools/adaptation-support-tool/step-1',
        title: 'Step 1',
      },
    ];

    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      search: {
        subrequests: {
          ast: {
            items: items,
          },
        },
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockLocation.pathname]}>
          <IntlProvider locale="en" messages={{}}>
            <ASTNavigation {...defaultProps} />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(getByTestId('ast-accordion')).toBeInTheDocument();
  });

  it('should handle different language locales', () => {
    const items = [
      {
        '@id': '/fr/knowledge/tools/adaptation-support-tool/step-1',
        title: 'Étape 1',
      },
    ];

    const store = mockStore({
      intl: {
        locale: 'fr',
        messages: {},
      },
      search: {
        subrequests: {
          ast: {
            items: items,
          },
        },
      },
    });

    store.dispatch = jest.fn();

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={['/fr/knowledge/tools/adaptation-support-tool']}
        >
          <IntlProvider locale="fr" messages={{}}>
            <ASTNavigation
              {...defaultProps}
              astNavigation={{
                root_path: 'knowledge/tools/adaptation-support-tool',
              }}
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(searchActions.searchContent).toHaveBeenCalledWith(
      '/fr/knowledge/tools/adaptation-support-tool',
      expect.any(Object),
      'ast',
    );

    expect(container.querySelector('.ast-navigation')).toBeInTheDocument();
  });
});
