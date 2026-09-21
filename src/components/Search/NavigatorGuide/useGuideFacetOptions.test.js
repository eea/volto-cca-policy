import { act, renderHook } from '@testing-library/react-hooks';
import { getFacetOptions } from '@eeacms/search/components/SearchApp/useFacetsWithAllOptions';
import useGuideFacetOptions from './useGuideFacetOptions';

jest.mock(
  '@eeacms/search/components/SearchApp/useFacetsWithAllOptions',
  () => ({ getFacetOptions: jest.fn() }),
);

const flushPromises = () => act(() => Promise.resolve());

describe('useGuideFacetOptions', () => {
  const appConfig = { facets: [] };
  const steps = [{ field: 'sector' }, { field: 'stage' }];

  beforeEach(() => {
    getFacetOptions.mockReset();
  });

  it('loads the complete option list for every guide field', async () => {
    const facetOptions = { sector: ['Energy'], stage: ['Step 1'] };
    getFacetOptions.mockResolvedValue(facetOptions);

    const { result } = renderHook(() => useGuideFacetOptions(appConfig, steps));
    await flushPromises();

    expect(getFacetOptions).toHaveBeenCalledWith(appConfig, [
      'sector',
      'stage',
    ]);
    expect(result.current).toEqual(facetOptions);
  });

  it('keeps the fallback state when loading fails', async () => {
    getFacetOptions.mockRejectedValue(new Error('Search unavailable'));

    const { result } = renderHook(() => useGuideFacetOptions(appConfig, steps));
    await flushPromises();

    expect(result.current).toEqual({});
  });

  it('does not update state after unmounting', async () => {
    let resolveRequest;
    getFacetOptions.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    const { unmount } = renderHook(() =>
      useGuideFacetOptions(appConfig, steps),
    );
    unmount();
    resolveRequest({ sector: ['Energy'] });
    await flushPromises();
  });
});
