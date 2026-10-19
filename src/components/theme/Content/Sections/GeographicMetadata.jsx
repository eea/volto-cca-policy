import { Fragment } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import LinkedMetadataItemList from './LinkedMetadataItemList';
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
  'City:': { id: 'City:', defaultMessage: 'City:' },
  'Cities:': { id: 'Cities:', defaultMessage: 'Cities:' },
  'Municipalities & other:': {
    id: 'Municipalities & other:',
    defaultMessage: 'Municipalities & other:',
  },
});

const linkedSectionFields = {
  macrotrans: 'cca_geographic_transnational_region.keyword',
  countries: 'cca_geographic_countries.keyword',
};

const GeographicMetadata = (props) => {
  const { content } = props;
  const { spatial_values, spatial_layer, geochars } = content;
  const j = geochars ? JSON.parse(geochars) : null;
  const intl = useIntl();

  if (j === null) {
    if (spatial_layer) {
      return (
        <div className="geochar">
          <p>{spatial_layer}</p>
          <h5>
            <FormattedMessage id="Countries:" defaultMessage="Countries:" />
          </h5>
          {spatial_values && spatial_values.length > 0 && (
            <LinkedMetadataItemList
              value={spatial_values.map((item) => item.token)}
              field="cca_geographic_countries.keyword"
              // contentType={contentTypeLabel}
            />
          )}
        </div>
      );
    }

    return '';
  }

  const { geoElements } = j;

  let rendered = renderGeochar(geoElements);

  return (
    <div className="geochar">
      {rendered.map(
        (section, index) =>
          section.value && (
            <Fragment key={index}>
              {section.title && (
                <h5>
                  {messages[section.title]
                    ? intl.formatMessage(messages[section.title])
                    : section.title}
                </h5>
              )}
              {linkedSectionFields[section.key] ? (
                <LinkedMetadataItemList
                  value={section.value}
                  field={linkedSectionFields[section.key]}
                  // contentType={contentTypeLabel}
                />
              ) : (
                <p>
                  {section.value
                    .map((countryName) =>
                      intl.formatMessage({
                        id: countryName,
                        defaultMessage: countryName,
                      }),
                    )
                    .join(', ')}
                </p>
              )}
            </Fragment>
          ),
      )}
    </div>
  );
};

export default GeographicMetadata;
