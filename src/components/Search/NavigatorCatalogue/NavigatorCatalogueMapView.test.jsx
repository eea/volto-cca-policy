import '@testing-library/jest-dom';
import {
  getColorForCount,
  normalizeCountryName,
  buildCountryCounts,
  mapLegendItems,
} from './utils';

describe('getColorForCount', () => {
  it('returns darkest green for 10+ tools', () => {
    expect(getColorForCount(10)).toBe('#0F6B3F');
    expect(getColorForCount(15)).toBe('#0F6B3F');
    expect(getColorForCount(100)).toBe('#0F6B3F');
  });

  it('returns dark green for 7-9 tools', () => {
    expect(getColorForCount(7)).toBe('#007B6C');
    expect(getColorForCount(8)).toBe('#007B6C');
    expect(getColorForCount(9)).toBe('#007B6C');
  });

  it('returns base accent green for 4-6 tools', () => {
    expect(getColorForCount(4)).toBe('#84C79A');
    expect(getColorForCount(5)).toBe('#84C79A');
    expect(getColorForCount(6)).toBe('#84C79A');
  });

  it('returns light green for 1-3 tools', () => {
    expect(getColorForCount(1)).toBe('#C2E3CD');
    expect(getColorForCount(2)).toBe('#C2E3CD');
    expect(getColorForCount(3)).toBe('#C2E3CD');
  });

  it('returns lightest gray-green for 0 or falsy counts', () => {
    expect(getColorForCount(0)).toBe('#E1E7DF');
    expect(getColorForCount(null)).toBe('#E1E7DF');
    expect(getColorForCount(undefined)).toBe('#E1E7DF');
  });
});

describe('normalizeCountryName', () => {
  it('normalizes Türkiye to Turkey', () => {
    expect(normalizeCountryName('Türkiye')).toBe('Turkey');
  });

  it('normalizes Czech Rep. to Czechia', () => {
    expect(normalizeCountryName('Czech Rep.')).toBe('Czechia');
  });

  it('normalizes Bosnia and Herz. to Bosnia and Herzegovina', () => {
    expect(normalizeCountryName('Bosnia and Herz.')).toBe(
      'Bosnia and Herzegovina',
    );
  });

  it('returns unchanged name for non-special countries', () => {
    expect(normalizeCountryName('Germany')).toBe('Germany');
    expect(normalizeCountryName('Italy')).toBe('Italy');
    expect(normalizeCountryName('France')).toBe('France');
    expect(normalizeCountryName('Spain')).toBe('Spain');
  });

  it('handles null and undefined', () => {
    expect(normalizeCountryName(null)).toBeNull();
    expect(normalizeCountryName(undefined)).toBeUndefined();
  });
});

describe('buildCountryCounts', () => {
  it('builds correct lookup from facet data array', () => {
    const facets = {
      'cca_geographic_countries.keyword': [
        {
          field: 'cca_geographic_countries.keyword',
          type: 'value',
          data: [
            { value: 'Germany', count: 5 },
            { value: 'Italy', count: 3 },
            { value: 'France', count: 1 },
          ],
        },
      ],
    };

    const counts = buildCountryCounts(facets);
    expect(counts).toEqual({
      Germany: 5,
      Italy: 3,
      France: 1,
    });
  });

  it('handles empty facet data', () => {
    const facets = {
      'cca_geographic_countries.keyword': [
        { field: 'cca_geographic_countries.keyword', data: [] },
      ],
    };
    const counts = buildCountryCounts(facets);
    expect(Object.keys(counts)).toHaveLength(0);
  });

  it('handles missing facet gracefully', () => {
    const facets = {};
    const counts = buildCountryCounts(facets);
    expect(counts).toEqual({});
  });

  it('handles undefined facets gracefully', () => {
    const counts = buildCountryCounts(undefined);
    expect(counts).toEqual({});
  });

  it('handles null facets gracefully', () => {
    const counts = buildCountryCounts(null);
    expect(counts).toEqual({});
  });

  it('handles non-array facet value', () => {
    const facets = {
      'cca_geographic_countries.keyword': {
        data: [{ value: 'Germany', count: 5 }],
      },
    };
    const counts = buildCountryCounts(facets);
    expect(counts).toEqual({ Germany: 5 });
  });

  it('handles missing count values', () => {
    const facets = {
      'cca_geographic_countries.keyword': [{ data: [{ value: 'Germany' }] }],
    };
    const counts = buildCountryCounts(facets);
    expect(counts.Germany).toBeUndefined();
  });
});

describe('mapLegendItems', () => {
  it('has 5 legend items', () => {
    expect(mapLegendItems).toHaveLength(5);
  });

  it('uses the current legend color palette', () => {
    expect(mapLegendItems[0].color).toBe('#0F6B3F');
    expect(mapLegendItems[1].color).toBe('#007B6C');
    expect(mapLegendItems[2].color).toBe('#84C79A');
    expect(mapLegendItems[3].color).toBe('#C2E3CD');
    expect(mapLegendItems[4].color).toBe('#E1E7DF');
  });

  it('has correct labels', () => {
    expect(mapLegendItems.map((item) => item.label)).toEqual([
      '10 or more',
      '7 - 9',
      '4 - 6',
      '1 - 3',
      'None',
    ]);
  });
});
