import {
  arrayFieldToString,
  asArray,
  downloadCsv,
  escapeCsvValue,
  exportComparisonTable,
  formatFunctionalityScore,
  formatPublicationDate,
  getComparePageURL,
  getEuropeanWideToolsSearchState,
  getEuropeanWideToolsURL,
  getNavigatorCataloguePageURL,
  rawValueAsArray,
  valuesAsText,
} from './utils';

describe('Navigator Catalogue utilities', () => {
  let clickSpy;
  let createObjectURL;
  let originalBlob;
  let revokeObjectURL;

  beforeEach(() => {
    originalBlob = global.Blob;
    global.Blob = jest.fn((parts, options) => ({ parts, options }));
    clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
    createObjectURL = jest.fn(() => 'blob:test');
    revokeObjectURL = jest.fn();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    });
  });

  afterEach(() => {
    global.Blob = originalBlob;
    clickSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it('normalizes raw, scalar, title, token, and empty values', () => {
    expect(rawValueAsArray({ raw: ['One', null, { title: 'Two' }] })).toEqual([
      'One',
      { title: 'Two' },
    ]);
    expect(asArray()).toEqual([]);
    expect(asArray({ raw: null })).toEqual([]);
    expect(asArray({ raw: ['One', null, { title: 'Two' }] })).toEqual([
      'One',
      'Two',
    ]);
    expect(asArray({ token: 'TOKEN' })).toEqual(['TOKEN']);
    expect(asArray('Value')).toEqual(['Value']);
    expect(arrayFieldToString({ raw: ['One', 'Two'] })).toBe('One, Two');
  });

  it('extracts unique text values from metadata fields', () => {
    expect(
      valuesAsText(
        { raw: ['Water', { title: 'Climate' }] },
        { token: 'Water' },
        null,
      ),
    ).toBe('Water, Climate');
  });

  it('formats valid publication dates as year strings and invalid dates as empty strings', () => {
    expect(formatPublicationDate({ raw: ['2026-07-24'] })).toBe('2026');
    expect(formatPublicationDate('N/A')).toBe('');
    expect(formatPublicationDate({ raw: { invalid: true } })).toBe('');
    expect(formatPublicationDate(null)).toBe('');
  });

  it('formats functionality scores and clamps invalid ranges', () => {
    expect(formatFunctionalityScore({ raw: 4 })).toBe('4/6');
    expect(formatFunctionalityScore(-2)).toBe('0/6');
    expect(formatFunctionalityScore(9)).toBe('6/6');
    expect(formatFunctionalityScore(null)).toBe('—');
    expect(formatFunctionalityScore('invalid')).toBe('—');
  });

  it('escapes CSV values', () => {
    expect(escapeCsvValue()).toBe('""');
    expect(escapeCsvValue(null)).toBe('""');
    expect(escapeCsvValue('A "quoted" value')).toBe('"A ""quoted"" value"');
  });

  it('downloads CSV data and cleans up the temporary link', () => {
    const appendSpy = jest.spyOn(document.body, 'appendChild');
    const removeSpy = jest.spyOn(HTMLAnchorElement.prototype, 'remove');

    downloadCsv('comparison.csv', [
      ['Title', 'Tool'],
      ['Sector', 'Water'],
    ]);

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(appendSpy).toHaveBeenCalledWith(expect.any(HTMLAnchorElement));
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test');
  });

  it.each([undefined, '', 'en', 'fr', 'de'])(
    'builds catalogue and comparison URLs for locale %s',
    (locale) => {
      const lang = locale || 'en';
      expect(getNavigatorCataloguePageURL(locale)).toBe(
        `/${lang}/navigator/tool-catalogue`,
      );
      expect(getComparePageURL(locale)).toBe(`/${lang}/navigator/compare`);
    },
  );

  it('builds the locale-aware European-wide tools URL', () => {
    const url = new URL(getEuropeanWideToolsURL('de'), 'https://example.com');

    expect(url.pathname).toBe('/de/navigator/tool-catalogue');
    expect(url.searchParams.get('size')).toBe('n_10_n');
    expect(url.searchParams.get('filters[0][field]')).toBe('language');
    expect(url.searchParams.get('filters[0][type]')).toBe('any');
    expect(url.searchParams.get('filters[0][values][0]')).toBe('de');
    expect(url.searchParams.get('filters[1][field]')).toBe(
      'cca_navigator_geographic_scope',
    );
    expect(url.searchParams.get('filters[1][type]')).toBe('any');
    expect(url.searchParams.get('filters[1][values][0]')).toBe('Europe');
    expect(url.searchParams.get('sort-field')).toBe('title.index');
    expect(url.searchParams.get('sort-direction')).toBe('asc');
  });

  it('builds the live search state for European-wide tools', () => {
    expect(getEuropeanWideToolsSearchState('de')).toEqual({
      current: 1,
      filters: [
        { field: 'language', type: 'any', values: ['de'] },
        {
          field: 'cca_navigator_geographic_scope',
          type: 'any',
          values: ['Europe'],
        },
      ],
      searchTerm: '',
      sortField: 'title.index',
      sortDirection: 'asc',
      sortList: null,
    });
  });

  it('preserves non-geographic filters for European-wide tools', () => {
    const currentFilters = [
      { field: 'language', type: 'any', values: ['en'] },
      {
        field: 'cca_adaptation_sectors.keyword',
        type: 'any',
        values: ['Water management'],
      },
      {
        field: 'cca_climate_impacts.keyword',
        type: 'any',
        values: ['Flooding'],
      },
      {
        field: 'cca_geographic_countries.keyword',
        type: 'any',
        values: ['Germany'],
      },
    ];

    const state = getEuropeanWideToolsSearchState('de', currentFilters);

    expect(state.filters).toEqual([
      { field: 'language', type: 'any', values: ['de'] },
      {
        field: 'cca_adaptation_sectors.keyword',
        type: 'any',
        values: ['Water management'],
      },
      {
        field: 'cca_climate_impacts.keyword',
        type: 'any',
        values: ['Flooding'],
      },
      {
        field: 'cca_navigator_geographic_scope',
        type: 'any',
        values: ['Europe'],
      },
    ]);

    const url = new URL(
      getEuropeanWideToolsURL('de', currentFilters),
      'https://example.com',
    );
    const fields = [...url.searchParams.entries()]
      .filter(([key]) => key.endsWith('[field]'))
      .map(([, value]) => value);

    expect(fields).toEqual([
      'language',
      'cca_adaptation_sectors.keyword',
      'cca_climate_impacts.keyword',
      'cca_navigator_geographic_scope',
    ]);
  });

  it('exports every comparison criterion', () => {
    const tools = [
      {
        title: 'Tool A',
        values: {
          accessibility_and_usability: 'High',
          functionality: 5,
          cca_type_of_outputs: ['Maps'],
          cca_adaptation_support_cycle_step: ['Step 1'],
        },
      },
    ];

    exportComparisonTable(tools, (tool, field) => tool.values[field]);

    const csv = global.Blob.mock.calls[0][0][0];
    expect(csv).toContain('"Criteria","Tool A"');
    expect(csv).toContain('"Usability","High"');
    expect(csv).toContain('"Functionality","5/6"');
    expect(csv).toContain('"Output type","Maps"');
    expect(csv).toContain('"Adaptation support cycle step","Step 1"');
  });
});
