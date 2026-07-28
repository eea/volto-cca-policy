import {
  arrayFieldToString,
  asArray,
  downloadCsv,
  escapeCsvValue,
  exportComparisonTable,
  formatFunctionalityScore,
  getComparePageURL,
  getLocalizedLandingPageURL,
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

  it('localizes catalogue and comparison URLs', () => {
    expect(getLocalizedLandingPageURL(undefined)).toBe(
      '/en/navigator/tool-catalogue',
    );
    expect(
      getLocalizedLandingPageURL({ landingPageURL: '/en/tools' }, 'fr'),
    ).toBe('/fr/tools');
    expect(getLocalizedLandingPageURL({ landingPageURL: '/tools' }, '')).toBe(
      '/tools',
    );
    expect(
      getComparePageURL({ comparePageURL: '/en/tools/compare' }, 'de'),
    ).toBe('/de/tools/compare');
    expect(
      getComparePageURL(
        { landingPageURL: '/en/navigator/tool-catalogue' },
        'de',
      ),
    ).toBe('/de/navigator/compare');
    expect(getComparePageURL()).toBe('/en/navigator/compare');
  });

  it('exports every comparison criterion', () => {
    const tools = [
      {
        title: 'Tool A',
        values: {
          accessibility_and_usability: 'High',
          functionality: 5,
          cca_geographical_scale: ['Local'],
          cca_type_of_outputs: ['Maps'],
          cca_adaptation_support_cycle_step: ['Step 1'],
          cca_adaptation_sectors: ['Water'],
        },
      },
    ];

    exportComparisonTable(tools, (tool, field) => tool.values[field]);

    const csv = global.Blob.mock.calls[0][0][0];
    expect(csv).toContain('"Criteria","Tool A"');
    expect(csv).toContain('"Usability","High"');
    expect(csv).toContain('"Functionality","5/6"');
    expect(csv).toContain('"Spatial scale","Local"');
    expect(csv).toContain('"Output type","Maps"');
    expect(csv).toContain('"Adaptation support cycle step","Step 1"');
    expect(csv).toContain('"Sector","Water"');
  });
});
