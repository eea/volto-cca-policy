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

export const formatFunctionalityScore = (value) => {
  const raw = value?.raw !== undefined ? value.raw : value;
  const score = raw === null || raw === undefined ? Number.NaN : Number(raw);

  return Number.isFinite(score) ? `${Math.min(6, Math.max(0, score))}/6` : '—';
};

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
  link.remove();

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
    [
      'Usability',
      ...tools.map((tool) =>
        arrayFieldToString(getToolField(tool, 'accessibility_and_usability')),
      ),
    ],
    [
      'Functionality',
      ...tools.map((tool) =>
        formatFunctionalityScore(getToolField(tool, 'functionality')),
      ),
    ],
    [
      'Spatial scale',
      ...tools.map((tool) =>
        arrayFieldToString(getToolField(tool, 'cca_geographical_scale')),
      ),
    ],
    [
      'Output type',
      ...tools.map((tool) =>
        arrayFieldToString(getToolField(tool, 'cca_type_of_outputs')),
      ),
    ],
    [
      'Adaptation support cycle step',
      ...tools.map((tool) =>
        arrayFieldToString(
          getToolField(tool, 'cca_adaptation_support_cycle_step'),
        ),
      ),
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
