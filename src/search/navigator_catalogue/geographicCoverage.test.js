import {
  CHARACTERISATION_FIELD,
  geographicCoverageRuntimeMappings,
  getGeographicCoverageFacetValue,
} from './geographicCoverage';

describe('geographic coverage runtime mapping', () => {
  it('defines an exclusive keyword scope from all specific location fields', () => {
    const mapping = geographicCoverageRuntimeMappings[CHARACTERISATION_FIELD];

    expect(mapping.type).toBe('keyword');
    expect(mapping.script.source).toContain(
      "doc['cca_geographic_countries.keyword']",
    );
    expect(mapping.script.source).toContain(
      "doc['cca_geographic_transnational_region.keyword']",
    );
    expect(mapping.script.source).toContain("doc['cca_sub_nationals.keyword']");
    expect(mapping.script.source).toContain("doc['cca_city.keyword']");
    expect(mapping.script.source).toContain(
      "doc['cca_geographic_characterisation.keyword']",
    );
  });
});

describe('geographic coverage facet value', () => {
  it('keeps the facet available with zero counts when its buckets are empty', () => {
    expect(
      getGeographicCoverageFacetValue({
        aggregations: {
          [CHARACTERISATION_FIELD]: { buckets: [] },
        },
        fieldName: CHARACTERISATION_FIELD,
      }),
    ).toEqual([
      {
        field: CHARACTERISATION_FIELD,
        type: 'value',
        data: [
          { value: 'Europe', count: 0 },
          { value: 'Global', count: 0 },
        ],
      },
    ]);
  });

  it('returns Europe and Global alphabetically with their counts', () => {
    expect(
      getGeographicCoverageFacetValue({
        aggregations: {
          [CHARACTERISATION_FIELD]: {
            buckets: [
              { key: 'Global', doc_count: 25 },
              { key: 'Europe', doc_count: 20 },
            ],
          },
        },
        fieldName: CHARACTERISATION_FIELD,
      })[0].data,
    ).toEqual([
      { value: 'Europe', count: 20 },
      { value: 'Global', count: 25 },
    ]);
  });
});
