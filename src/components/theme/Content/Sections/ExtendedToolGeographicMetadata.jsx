import { useIntl, defineMessages } from 'react-intl';
import MetadataItemList from './MetadataItemList';
import { renderGeochar } from './geographicMetadataUtils';

const messages = defineMessages({
  'Macro-Transnational region:': {
    id: 'Macro-Transnational region:',
    defaultMessage: 'Macro-Transnational region:',
  },
  'Biogeographical regions:': {
    id: 'Biogeographical regions:',
    defaultMessage: 'Biogeographical regions:',
  },
  'Countries:': { id: 'Countries:', defaultMessage: 'Countries:' },
  'Sub Nationals:': { id: 'Sub Nationals:', defaultMessage: 'Sub Nationals:' },
  'Cities:': { id: 'Cities:', defaultMessage: 'Cities:' },
  'City:': { id: 'City:', defaultMessage: 'Cities:' },
});

const specificSectionKeys = [
  'countries',
  'macrotrans',
  'biotrans',
  'subnational',
  'city',
];

const getSections = (content) => {
  const { geochars, spatial_layer, spatial_values } = content;

  if (!geochars) {
    if (spatial_values?.length) {
      return [
        {
          key: 'spatial_values',
          title: spatial_layer ? `${spatial_layer}:` : null,
          value: spatial_values,
        },
      ];
    }
    if (spatial_layer) {
      return [
        {
          key: 'spatial_layer',
          title: null,
          value: [spatial_layer],
        },
      ];
    }
    return [];
  }

  let parsedGeochars;
  try {
    parsedGeochars = JSON.parse(geochars);
  } catch {
    return [];
  }

  const renderedSections = renderGeochar(parsedGeochars?.geoElements) || [];

  const specificSections = specificSectionKeys
    .map((key) => renderedSections.find((section) => section.key === key))
    .filter((section) => section?.value?.length);

  if (specificSections.length > 0) {
    return specificSections;
  }

  const elementSection = renderedSections.find(
    (section) => section.key === 'element',
  );
  return elementSection?.value?.length ? [elementSection] : [];
};

const ExtendedToolGeographicMetadata = ({ content = {} }) => {
  const intl = useIntl();
  const sections = getSections(content);

  if (!sections.length) return null;

  return (
    <div className="extended-tool-geographic-metadata">
      {sections.map((section) => (
        <div
          className="geographic-category"
          key={
            section.key ||
            section.title ||
            (section.value && section.value[0]) ||
            'geo'
          }
        >
          {section.title && (
            <div className="geographic-category-title">
              {messages[section.title]
                ? intl.formatMessage(messages[section.title])
                : section.title}
            </div>
          )}
          <MetadataItemList asTags maxItems={3} value={section.value} />
        </div>
      ))}
    </div>
  );
};

export default ExtendedToolGeographicMetadata;
