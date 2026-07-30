import '@testing-library/jest-dom';
import {
  getColorForCount,
  normalizeCountryName,
  buildCountryCounts,
  mapLegendItems,
} from './utils';

describe('getColorForCount', () => {
  it('returns darkest green for 10+ tools', () => {
    expect(getColorForCount(10)).toBe('#0a5c4e');
    expect(getColorForCount(15)).toBe('#0a5c4e');
    expect(getColorForCount(100)).toBe('#0a5c4e');
  });

  it('returns dark green for 7-9 tools', () => {
    expect(getColorForCount(7)).toBe('#0d7a68');
    expect(getColorForCount(8)).toBe('#0d7a68');
    expect(getColorForCount(9)).toBe('#0d7a68');
  });

  it('returns base accent green for 4-6 tools', () => {
    expect(getColorForCount(4)).toBe('#289588');
    expect(getColorForCount(5)).toBe('#289588');
    expect(getColorForCount(6)).toBe('#289588');
  });

  it('returns light green for 1-3 tools', () => {
    expect(getColorForCount(1)).toBe('#6fc4b8');
    expect(getColorForCount(2)).toBe('#6fc4b8');
    expect(getColorForCount(3)).toBe('#6fc4b8');
  });

  it('returns lightest gray-green for 0 or falsy counts', () => {
    expect(getColorForCount(0)).toBe('#e8eded');
    expect(getColorForCount(null)).toBe('#e8eded');
    expect(getColorForCount(undefined)).toBe('#e8eded');
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

  it('colors match getColorForCount scale', () => {
    expect(mapLegendItems[0].color).toBe(getColorForCount(10));
    expect(mapLegendItems[1].color).toBe(getColorForCount(7));
    expect(mapLegendItems[2].color).toBe(getColorForCount(4));
    expect(mapLegendItems[3].color).toBe(getColorForCount(1));
    expect(mapLegendItems[4].color).toBe(getColorForCount(0));
  });

  it('has correct labels', () => {
    expect(mapLegendItems.map((item) => item.label)).toEqual([
      '10+',
      '7–9',
      '4–6',
      '1–3',
      'None',
    ]);
  });
});
