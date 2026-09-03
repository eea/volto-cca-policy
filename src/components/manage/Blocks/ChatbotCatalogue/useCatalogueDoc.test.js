import { act, renderHook } from '@testing-library/react-hooks';

import { registry } from '@eeacms/search';
import { fetchResult } from '@eeacms/search/lib/hocs/useResult';
import { useCatalogueDoc } from './useCatalogueDoc';

jest.mock('@eeacms/search', () => ({
  registry: { searchui: {} },
}));

jest.mock('@eeacms/search/lib/hocs/useResult', () => ({
  fetchResult: jest.fn(),
}));

const appConfig = { app: 'navigatorCatalogueSearch', endpoint: '/_es' };

const flushPromises = () => act(() => Promise.resolve());

describe('useCatalogueDoc', () => {
  beforeEach(() => {
    fetchResult.mockReset();
    registry.searchui.navigatorCatalogueSearch = appConfig;
  });

  it('returns a null result and loading state while the fetch is pending', () => {
    fetchResult.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() =>
      useCatalogueDoc('https://example.com/doc-a'),
    );
    expect(result.current).toEqual({ result: null, loading: true });
  });

  it('exposes the searchlib result when the document is found', async () => {
    const esResult = { found: true, uid: 'https://example.com/doc-b' };
    fetchResult.mockResolvedValue(esResult);

    const { result } = renderHook(() =>
      useCatalogueDoc('https://example.com/doc-b'),
    );
    await flushPromises();

    expect(fetchResult).toHaveBeenCalledWith(
      'https://example.com/doc-b',
      appConfig,
      registry,
    );
    expect(result.current).toEqual({ result: esResult, loading: false });
  });

  it('resolves to null when the document is not found', async () => {
    fetchResult.mockResolvedValue({ found: false });

    const { result } = renderHook(() =>
      useCatalogueDoc('https://example.com/doc-missing'),
    );
    await flushPromises();

    expect(result.current).toEqual({ result: null, loading: true });
  });

  it('resolves to null when the request fails', async () => {
    fetchResult.mockRejectedValue(new Error('ES unavailable'));

    const { result } = renderHook(() =>
      useCatalogueDoc('https://example.com/doc-fail'),
    );
    await flushPromises();

    expect(result.current).toEqual({ result: null, loading: true });
  });

  it('caches the fetch per URL: repeated renders do not refetch', async () => {
    fetchResult.mockResolvedValue({
      found: true,
      uid: 'https://example.com/doc-c',
    });

    const { result, rerender } = renderHook(() =>
      useCatalogueDoc('https://example.com/doc-c'),
    );
    await flushPromises();
    rerender();
    await flushPromises();

    expect(fetchResult).toHaveBeenCalledTimes(1);
    expect(result.current.result).toEqual({
      found: true,
      uid: 'https://example.com/doc-c',
    });
  });

  it('serves an already-resolved URL synchronously from the resolved cache', async () => {
    fetchResult.mockResolvedValue({
      found: true,
      uid: 'https://example.com/doc-d',
    });

    const first = renderHook(() =>
      useCatalogueDoc('https://example.com/doc-d'),
    );
    await flushPromises();
    first.unmount();

    // A fresh render for the same URL must not refetch and starts with the
    // cached result (no basic -> full flash).
    fetchResult.mockClear();
    const second = renderHook(() =>
      useCatalogueDoc('https://example.com/doc-d'),
    );
    expect(fetchResult).not.toHaveBeenCalled();
    expect(second.result.current.result).toEqual({
      found: true,
      uid: 'https://example.com/doc-d',
    });
  });

  it('does not fetch when the search app is not configured', async () => {
    delete registry.searchui.navigatorCatalogueSearch;

    const { result } = renderHook(() =>
      useCatalogueDoc('https://example.com/doc-unconfigured'),
    );
    await flushPromises();

    expect(fetchResult).not.toHaveBeenCalled();
    expect(result.current).toEqual({ result: null, loading: true });
  });

  it('returns idle state (not loading) when no URL is given', () => {
    const { result } = renderHook(() => useCatalogueDoc(undefined));
    expect(result.current).toEqual({ result: null, loading: false });
  });

  it('normalizes URLs before fetching from Elasticsearch', async () => {
    fetchResult.mockResolvedValue({ found: true });
    renderHook(() =>
      useCatalogueDoc(
        'http://cca.localhost/metadata/tools/climate-policy-radar/',
      ),
    );
    await flushPromises();

    expect(fetchResult).toHaveBeenCalledWith(
      'https://climate-adapt.eea.europa.eu/en/metadata/tools/climate-policy-radar',
      appConfig,
      registry,
    );
  });
});
