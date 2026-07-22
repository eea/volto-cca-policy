export const asArray = (value) => {
  if (!value) return [];
  const raw = value.raw !== undefined ? value.raw : value;
  if (!raw) return [];
  const values = Array.isArray(raw)
    ? raw.filter(Boolean)
    : [raw].filter(Boolean);

  return values.map((value) => value?.title || value?.token || value);
};

export const arrayFieldToString = (value) => asArray(value).join(', ');

export const escapeCsvValue = (value) => {
  const stringValue = value === undefined || value === null ? '' : `${value}`;
  return `"${stringValue.replace(/"/g, '""')}"`;
};

export const downloadCsv = (filename, rows) => {
  const csv = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const getLocalizedLandingPageURL = (appConfig, currentLang = 'en') => {
  const lang = currentLang || 'en';
  const landingPageURL = appConfig?.landingPageURL || '/en/navigator';

  return landingPageURL.replace(/^\/en(?=\/|$)/, `/${lang}`);
};

export const getComparePageURL = (appConfig, currentLang = 'en') => {
  const landingPageURL = getLocalizedLandingPageURL(appConfig, currentLang);

  return `${landingPageURL.replace(/\/$/, '')}/compare`;
};

export const exportComparisonTable = (tools, getToolField) => {
  const rows = [
    ['Criteria', ...tools.map((tool) => tool.title)],
    ['Usability', ...tools.map(() => 'Moderate')],
    ['Functionality', ...tools.map(() => 'functionality score detail')],
    ['Spatial scale', ...tools.map(() => 'Spatial scale data')],
    ['Output type', ...tools.map(() => 'Output type data')],
    [
      'Adaptation support cycle step',
      ...tools.map(() => 'Adaptation support cycle step data'),
    ],
    [
      'Sector',
      ...tools.map((tool) =>
        arrayFieldToString(getToolField(tool, 'cca_adaptation_sectors')),
      ),
    ],
  ];

  downloadCsv('navigator-catalogue-comparison.csv', rows);
};
