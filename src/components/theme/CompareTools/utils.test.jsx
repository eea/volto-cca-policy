import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider as JotaiProvider } from 'jotai';
import { applyConfigurationSchema, rebind } from '@eeacms/search';
import runRequest from '@eeacms/search/lib/runRequest';
import {
  MAX_COMPARE_TOOLS,
  fetchResultsByUid,
  getCompareLocation,
  getCompareToolTitle,
  getCompareToolUid,
  getPathname,
  useCompareTools,
  useHasMounted,
} from './utils';

jest.mock('@eeacms/search', () => ({
  applyConfigurationSchema: jest.fn((config) => config),
  rebind: jest.fn((config) => config),
}));

jest.mock('@eeacms/search/lib/runRequest', () => jest.fn());

jest.mock('@plone/volto/helpers/Url/Url', () => ({
  flattenToAppURL: (url) => url.replace('https://example.com', ''),
}));

const CompareHarness = ({ tool }) => {
  const { hasMounted, isLimitReached, isSelected, setSelected, toggle } =
    useCompareTools(tool);

  return (
    <>
      <span data-testid="mounted">{String(hasMounted)}</span>
      <span data-testid="selected">{String(isSelected)}</span>
      <span data-testid="limit">{String(isLimitReached)}</span>
      <button type="button" onClick={toggle}>
        Toggle
      </button>
      <button type="button" onClick={() => setSelected(true)}>
        Select
      </button>
      <button type="button" onClick={() => setSelected(false)}>
        Remove
      </button>
    </>
  );
};

const renderCompareHarness = (tool, initialTools = []) => {
  window.localStorage.setItem(
    'cca-compare-tools',
    JSON.stringify(initialTools),
  );

  return render(
    <JotaiProvider>
      <CompareHarness tool={tool} />
    </JotaiProvider>,
  );
};

describe('Compare Tools utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('resolves comparison identifiers and titles from supported shapes', () => {
    expect(getCompareToolUid({ cca_uid: { raw: 'cca-id' } })).toBe('cca-id');
    expect(getCompareToolUid({ UID: 'plone-id' })).toBe('plone-id');
    expect(getCompareToolUid({ _result: { cca_uid: { raw: 'raw-id' } } })).toBe(
      'raw-id',
    );
    expect(getCompareToolUid({})).toBe('');
    expect(getCompareToolTitle({ title: 'Tool title' })).toBe('Tool title');
    expect(getCompareToolTitle({})).toBe('');
  });

  it('normalizes paths and removes query strings and hashes', () => {
    expect(getPathname()).toBe('');
    expect(getPathname('https://example.com/en/tools/?a=1#result')).toBe(
      '/en/tools',
    );
    expect(getPathname('/en/tools')).toBe('/en/tools');
  });

  it('builds a localized comparison location with at most four tools', () => {
    const tools = [
      { uid: 'one' },
      { uid: '' },
      { uid: 'two' },
      { uid: 'three' },
      { uid: 'four' },
      { uid: 'five' },
    ];

    expect(
      getCompareLocation(
        tools,
        { landingPageURL: '/en/navigator/tool-catalogue' },
        '/en/navigator/tool-catalogue?q=test',
        'ro',
      ),
    ).toEqual({
      pathname: '/ro/navigator/compare',
      search: '?uid=one&uid=two&uid=three',
      state: { returnURL: '/en/navigator/tool-catalogue?q=test' },
    });
    expect(MAX_COMPARE_TOOLS).toBe(4);
    expect(getCompareLocation([], {}, undefined)).toEqual({
      pathname: '/en/navigator/compare',
      search: '',
      state: { returnURL: undefined },
    });
  });

  it('fetches and converts matching search results', async () => {
    class ResultModel {
      constructor(hit, config) {
        this.hit = hit;
        this.config = config;
      }
    }
    const appConfig = {
      index_name: 'data_searchui',
      resultItemModel: { factory: 'resultModel' },
    };
    const registry = {
      searchui: { navigatorCatalogueSearch: appConfig },
      resolve: { resultModel: ResultModel },
    };
    runRequest.mockResolvedValue({
      body: { hits: { hits: [{ _id: 'one' }, { _id: 'two' }] } },
    });

    const results = await fetchResultsByUid(['one', 'two'], registry);

    expect(rebind).toHaveBeenCalledWith(appConfig);
    expect(applyConfigurationSchema).toHaveBeenCalledWith(appConfig);
    expect(runRequest).toHaveBeenCalledWith(
      {
        index: 'data_searchui',
        size: 2,
        query: {
          bool: {
            minimum_should_match: 1,
            should: [
              { terms: { 'cca_uid.keyword': ['one', 'two'] } },
              { terms: { cca_uid: ['one', 'two'] } },
            ],
          },
        },
      },
      appConfig,
    );
    expect(results).toHaveLength(2);
    expect(results[0]).toBeInstanceOf(ResultModel);
  });

  it('handles missing hits and configurations without an index', async () => {
    const registry = {
      searchui: {
        navigatorCatalogueSearch: {
          resultItemModel: { factory: 'resultModel' },
        },
      },
      resolve: { resultModel: class ResultModel {} },
    };
    runRequest.mockResolvedValue({});

    await expect(fetchResultsByUid(['one'], registry)).resolves.toEqual([]);
    expect(runRequest.mock.calls[0][0]).not.toHaveProperty('index');
  });

  it('adds, toggles, and removes a comparison tool', () => {
    renderCompareHarness({ uid: 'one', title: 'Tool one' });

    expect(screen.getByTestId('selected')).toHaveTextContent('false');
    expect(screen.getByTestId('limit')).toHaveTextContent('false');

    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('selected')).toHaveTextContent('true');
    expect(
      JSON.parse(window.localStorage.getItem('cca-compare-tools')),
    ).toEqual([{ uid: 'one', title: 'Tool one' }]);

    fireEvent.click(screen.getByText('Select'));
    expect(screen.getByTestId('selected')).toHaveTextContent('true');

    fireEvent.click(screen.getByText('Remove'));
    expect(screen.getByTestId('selected')).toHaveTextContent('false');
    expect(
      JSON.parse(window.localStorage.getItem('cca-compare-tools')),
    ).toEqual([]);
  });

  it('does not add tools without an identifier', () => {
    renderCompareHarness({ title: 'Missing UID' });

    fireEvent.click(screen.getByText('Select'));
    expect(screen.getByTestId('selected')).toHaveTextContent('false');
  });

  it('enforces the comparison limit', () => {
    const initialTools = Array.from(
      { length: MAX_COMPARE_TOOLS },
      (_, index) => ({
        uid: `tool-${index}`,
      }),
    );
    renderCompareHarness({ uid: 'extra' }, initialTools);

    expect(screen.getByTestId('limit')).toHaveTextContent('true');
    fireEvent.click(screen.getByText('Select'));
    expect(screen.getByTestId('selected')).toHaveTextContent('false');
  });

  it('exposes hasMounted state to safely coordinate client hydration', () => {
    renderCompareHarness({ uid: 'one', title: 'Tool one' });

    expect(screen.getByTestId('mounted')).toHaveTextContent('true');
  });

  it('tracks mounting status with useHasMounted', () => {
    const MountedComponent = () => {
      const mounted = useHasMounted();
      return <div data-testid="mounted-flag">{String(mounted)}</div>;
    };

    render(<MountedComponent />);
    expect(screen.getByTestId('mounted-flag')).toHaveTextContent('true');
  });
});
