import React from 'react';
import { useSearchContext } from '@eeacms/search/lib/hocs';

/**
 * DEBUG: Task 1 verification — read country counts from facet data.
 * Once verified, replace with actual map rendering.
 */
const NavigatorCatalogueMapView = () => {
  const searchContext = useSearchContext();
  const { facets, results, totalResults, wasSearched } = searchContext || {};

  // The geographic_countries facet field name
  // Note: facets[field] returns an array [{ field, type, data: [...] }]
  const countriesFacetArray = facets?.['cca_geographic_countries.keyword'];
  const countriesFacet = Array.isArray(countriesFacetArray)
    ? countriesFacetArray[0]
    : countriesFacetArray;
  const countryData = countriesFacet?.data || [];

  // Sort by count descending for readability
  const sortedCountries = [...countryData].sort((a, b) => b.count - a.count);

  return (
    <div
      className="navigator-catalogue-map-placeholder"
      style={{
        display: 'block',
        padding: '2rem',
        minHeight: '400px',
        border: '1px dashed #cbd4dc',
        margin: '1rem 0',
      }}
    >
      <h3 style={{ marginTop: 0, color: '#0a3d61' }}>
        Task 1: Facet Data Verification
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Search state:</strong>{' '}
        {wasSearched ? 'Searched' : 'Not searched yet'}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>totalResults:</strong> {totalResults ?? 'N/A'}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>results (current page):</strong> {results?.length ?? 0}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>facets keys:</strong>{' '}
        {facets ? Object.keys(facets).join(', ') : 'N/A'}
      </div>

      <hr />

      <h4>Raw facet object: cca_geographic_countries.keyword</h4>
      <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <pre
          style={{
            width: '100%',
            maxWidth: '100%',
            fontSize: '0.75rem',
            overflowX: 'auto',
            maxHeight: '400px',
            background: '#f5f5f5',
            padding: '1rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
          }}
        >
          {JSON.stringify(countriesFacet, null, 2)}
        </pre>
      </div>

      <h4>Full facets object keys + types</h4>
      <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <pre
          style={{
            width: '100%',
            maxWidth: '100%',
            fontSize: '0.75rem',
            overflowX: 'auto',
            maxHeight: '400px',
            background: '#f5f5f5',
            padding: '1rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
          }}
        >
          {facets
            ? Object.entries(facets)
                .map(([key, val]) => {
                  if (Array.isArray(val)) {
                    return `"${key}": array[${val.length}] → ${JSON.stringify(val).slice(0, 200)}`;
                  }
                  return `"${key}": ${typeof val} → ${JSON.stringify(val).slice(0, 200)}`;
                })
                .join('\n')
            : 'N/A'}
        </pre>
      </div>

      <h4>
        Countries (from facets[{'>'}]cca_geographic_countries.keyword{'<'}])
      </h4>

      {countryData.length === 0 ? (
        <p style={{ color: '#999' }}>
          No country facet data available yet. Check raw data above.
        </p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #0a3d61' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Country</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>Count</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Bucket</th>
            </tr>
          </thead>
          <tbody>
            {sortedCountries.map((entry) => {
              const count = entry.count || 0;
              let bucket = 'none';
              if (count >= 10) bucket = '10+';
              else if (count >= 7) bucket = '7-9';
              else if (count >= 4) bucket = '4-6';
              else if (count >= 1) bucket = '1-3';

              return (
                <tr
                  key={entry.value}
                  style={{ borderBottom: '1px solid #e0e0e0' }}
                >
                  <td style={{ padding: '0.4rem 0.5rem' }}>{entry.value}</td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '0.4rem 0.5rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {count}
                  </td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>{bucket}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NavigatorCatalogueMapView;
