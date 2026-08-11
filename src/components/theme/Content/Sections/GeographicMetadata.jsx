import { Fragment } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
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
});

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
            <p>
              {spatial_values
                .map((item) => item.token)
                .map((token) =>
                  intl.formatMessage({
                    id: token,
                    defaultMessage: token,
                  }),
                )
                .join(', ')}
            </p>
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
                <h5>{intl.formatMessage(messages[section.title])}</h5>
              )}
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
            </Fragment>
          ),
      )}
    </div>
  );
};

export default GeographicMetadata;
