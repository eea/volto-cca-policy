export const CHARACTERISATION_FIELD = 'cca_navigator_geographic_scope';
export const TRANSNATIONAL_REGION_FIELD =
  'cca_geographic_transnational_region.keyword';
export const COUNTRIES_FIELD = 'cca_geographic_countries.keyword';

export const geographicCoverageRuntimeMappings = {
  [CHARACTERISATION_FIELD]: {
    type: 'keyword',
    script: {
      source: `
        boolean hasCountries = doc.containsKey('cca_geographic_countries.keyword') && doc['cca_geographic_countries.keyword'].size() != 0;
        boolean hasTransnational = doc.containsKey('cca_geographic_transnational_region.keyword') && doc['cca_geographic_transnational_region.keyword'].size() != 0;
        boolean hasSubnational = doc.containsKey('cca_sub_nationals.keyword') && doc['cca_sub_nationals.keyword'].size() != 0;
        boolean hasCity = doc.containsKey('cca_city.keyword') && doc['cca_city.keyword'].size() != 0;

        if (!hasCountries && !hasTransnational && !hasSubnational && !hasCity) {
          for (def value : doc['cca_geographic_characterisation.keyword']) {
            emit(value);
          }
        }
      `,
    },
  },
};

export const getGeographicCoverageFacetValue = ({
  aggregations,
  fieldName,
}) => {
  const aggregation = aggregations?.[fieldName];
  if (!aggregation) return undefined;

  const counts = Object.fromEntries(
    (aggregation.buckets || []).map(({ key, doc_count }) => [key, doc_count]),
  );

  return [
    {
      field: fieldName,
      type: 'value',
      data: ['Europe', 'Global'].map((value) => ({
        value,
        count: counts[value] || 0,
      })),
    },
  ];
};
