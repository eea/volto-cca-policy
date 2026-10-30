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
  const steps = [
    { field: 'sector' },
    {
      groups: [
        { field: 'coverage' },
        { field: 'country' },
        { field: 'coverage' },
      ],
    },
    { field: 'stage' },
  ];

  beforeEach(() => {
    getFacetOptions.mockReset();
  });

  it('loads the complete option list for every guide field', async () => {
    const facetOptions = { sector: ['Energy'], stage: ['Step 1'] };
    getFacetOptions.mockResolvedValue(facetOptions);

    const { result } = renderHook(() =>
      useGuideFacetOptions(appConfig, steps, 'en'),
    );
    await flushPromises();

    expect(getFacetOptions).toHaveBeenCalledWith(
      {
        ...appConfig,
        permanentFilters: [{ term: { language: 'en' } }],
      },
      ['sector', 'coverage', 'country', 'stage'],
    );
    expect(result.current).toEqual(facetOptions);
  });

  it('keeps existing permanent filters and restricts options to the locale', async () => {
    getFacetOptions.mockResolvedValue({ sector: ['Agriculture'] });
    const configuredApp = {
      facets: [],
      permanentFilters: [{ term: { cluster_name: 'cca_navigator' } }],
    };

    renderHook(() => useGuideFacetOptions(configuredApp, steps, 'ro'));
    await flushPromises();

    expect(getFacetOptions).toHaveBeenCalledWith(
      {
        ...configuredApp,
        permanentFilters: [
          { term: { cluster_name: 'cca_navigator' } },
          { term: { language: 'ro' } },
        ],
      },
      ['sector', 'coverage', 'country', 'stage'],
    );
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

    const { result, unmount } = renderHook(() =>
      useGuideFacetOptions(appConfig, steps),
    );
    unmount();
    resolveRequest({ sector: ['Energy'] });
    await flushPromises();

    expect(result.current).toEqual({});
  });
});
