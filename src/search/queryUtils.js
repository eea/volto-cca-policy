import { OBSERVATORY_PARTNERS } from '@eeacms/volto-cca-policy/constants';

const addFilterParams = (params, filters) => {
  filters.forEach((f, i) => {
    params.set(`filters[${i}][field]`, f.field);
    params.set(`filters[${i}][type]`, f.type);
    (f.values || []).forEach((val, vi) => {
      params.set(`filters[${i}][values][${vi}]`, val);
    });
  });
};

export const makeContributionsSearchQuery = ({ id } = {}) => {
  const organisation = OBSERVATORY_PARTNERS?.[id];
  const base = '/en/observatory/advanced-search';

  // If partner is missing, fall back to base (or return null if you prefer)
  if (!organisation) return `${base}?size=n_10_n`;

  const params = new URLSearchParams();
  params.set('size', 'n_10_n');

  addFilterParams(params, [
    {
      field: 'cca_partner_contributors.keyword',
      type: 'any',
      values: [organisation],
    },
    { field: 'issued.date', type: 'any', values: ['All time'] },
    { field: 'language', type: 'any', values: ['en'] },
  ]);

  params.set('sort-field', 'issued.date');
  params.set('sort-direction', 'desc');

  return `${base}?${params.toString()}`;
};

export const makeAdvancedSearchQuery = ({ field, value } = {}) => {
  const base = '/en/data-and-downloads/';
  const params = new URLSearchParams();
  params.set('size', 'n_10_n');

  const filters = [
    { field: 'issued.date', values: ['All time'], type: 'any' },
    { field: 'language', values: ['en'], type: 'any' },
    // { field: 'objectProvides', values: [contentType], type: 'any' },
  ];

  if (field) {
    filters.push({ field, values: [value], type: 'all' });
  }

  addFilterParams(params, filters);

  params.set('sort-field', 'issued.date');
  params.set('sort-direction', 'desc');

  if (!field) {
    params.set('q', value ?? '');
  }

  return `${base}?${params.toString()}`;
};
