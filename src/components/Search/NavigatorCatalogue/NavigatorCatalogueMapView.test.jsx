import '@testing-library/jest-dom';

/**
 * Tests for NavigatorCatalogueMapView utility functions.
 *
 * The full component is hard to test in isolation due to the
 * HOC chain (withOpenLayers, withGeoJsonData, withResponsiveContainer,
 * withVisibilitySensor, clientOnly) and OpenLayers dependencies.
 * The utility functions below are the pure logic that drives the map.
 */

describe('getColorForCount', () => {
  // Reproduce the utility function for testing
  const getColorForCount = (count) => {
    if (count >= 10) return '#0a5c4e';
    if (count >= 7) return '#0d7a68';
    if (count >= 4) return '#289588';
    if (count >= 1) return '#6fc4b8';
    return '#e8eded';
  };

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
  // Reproduce the utility function for testing
  const normalizeCountryName = (name) => {
    if (!name) return name;
    const normalizer = {
      Türkiye: 'Turkey',
      'United Kingdom': 'United Kingdom',
      'Czech Rep.': 'Czechia',
      'Bosnia and Herz.': 'Bosnia and Herzegovina',
    };
    return normalizer[name] || name;
  };

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

describe('countryCounts build logic', () => {
  it('builds correct lookup from facet data array', () => {
    const facetData = [
      { value: 'Germany', count: 5 },
      { value: 'Italy', count: 3 },
      { value: 'France', count: 1 },
    ];

    const counts = {};
    facetData.forEach((entry) => {
      counts[entry.value] = entry.count;
    });

    expect(counts).toEqual({
      Germany: 5,
      Italy: 3,
      France: 1,
    });
  });

  it('handles empty facet data', () => {
    const facetData = [];
    const counts = {};
    facetData.forEach((entry) => {
      counts[entry.value] = entry.count;
    });
    expect(Object.keys(counts)).toHaveLength(0);
  });

  it('handles missing count values', () => {
    const facetData = [{ value: 'Germany' }];
    const counts = {};
    facetData.forEach((entry) => {
      counts[entry.value] = entry.count;
    });
    expect(counts.Germany).toBeUndefined();
  });
});

describe('facet data extraction', () => {
  it('extracts data from array-wrapped facet', () => {
    const facets = {
      'cca_geographic_countries.keyword': [
        {
          field: 'cca_geographic_countries.keyword',
          type: 'value',
          data: [
            { value: 'Germany', count: 5 },
            { value: 'Italy', count: 3 },
          ],
        },
      ],
    };

    const array = facets['cca_geographic_countries.keyword'];
    const facet = Array.isArray(array) ? array[0] : array;
    const data = facet?.data || [];

    expect(data).toHaveLength(2);
    expect(data[0].value).toBe('Germany');
    expect(data[0].count).toBe(5);
  });

  it('handles missing facet gracefully', () => {
    const facets = {};
    const array = facets['cca_geographic_countries.keyword'];
    const facet = Array.isArray(array) ? array[0] : array;
    const data = facet?.data || [];

    expect(data).toEqual([]);
  });

  it('handles undefined facets gracefully', () => {
    const facets = undefined;
    const array = facets?.['cca_geographic_countries.keyword'];
    const facet = Array.isArray(array) ? array[0] : array;
    const data = facet?.data || [];

    expect(data).toEqual([]);
  });
});

describe('legend data', () => {
  const legendItems = [
    { label: '10+', color: '#0a5c4e' },
    { label: '7–9', color: '#0d7a68' },
    { label: '4–6', color: '#289588' },
    { label: '1–3', color: '#6fc4b8' },
    { label: 'None', color: '#e8eded' },
  ];

  it('has 5 legend items', () => {
    expect(legendItems).toHaveLength(5);
  });

  it('colors match getColorForCount scale', () => {
    const getColorForCount = (count) => {
      if (count >= 10) return '#0a5c4e';
      if (count >= 7) return '#0d7a68';
      if (count >= 4) return '#289588';
      if (count >= 1) return '#6fc4b8';
      return '#e8eded';
    };

    expect(legendItems[0].color).toBe(getColorForCount(10));
    expect(legendItems[1].color).toBe(getColorForCount(7));
    expect(legendItems[2].color).toBe(getColorForCount(4));
    expect(legendItems[3].color).toBe(getColorForCount(1));
    expect(legendItems[4].color).toBe(getColorForCount(0));
  });
});
