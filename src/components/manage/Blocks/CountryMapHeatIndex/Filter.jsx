import React from 'react';
import { Radio } from 'semantic-ui-react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';

const messages = defineMessages({
  hhap: {
    id: 'Heat health action plans (HHAP)',
    defaultMessage: 'Heat health action plans (HHAP)',
  },
  hhws: {
    id: 'Heat health warning systems (HHWS)',
    defaultMessage: 'Heat health warning systems (HHWS)',
  },
});

function hidePopup() {
  const collections = document.getElementsByClassName('map-tooltip');
  for (let i = 0; i < collections.length; i++) {
    collections[i].style.visibility = 'hidden';
  }
}

export default function Filter(props) {
  const { thematicMapMode, setThematicMapMode } = props;
  const intl = useIntl();
  return (
    <>
      <p className="title">
        <FormattedMessage
          id="Choose thematic map:"
          defaultMessage="Choose thematic map:"
        />
      </p>
      <div id="sections-selector">
        <Radio
          label={intl.formatMessage(messages.hhap)}
          name="country-map-section"
          value="hhap"
          checked={thematicMapMode === 'hhap'}
          onChange={(_e, { value }) => {
            setThematicMapMode(value);
            hidePopup();
          }}
        />
        <Radio
          label={intl.formatMessage(messages.hhws)}
          name="country-map-section"
          value="hhws"
          checked={thematicMapMode === 'hhws'}
          onChange={(_e, { value }) => {
            setThematicMapMode(value);
          }}
        />
      </div>

      {thematicMapMode === 'hhap' && (
        <div className="legend climate-legend">
          <div className="legend-el">
            <span className="country-national-hhap legend-box"></span>
            <p className="legend-text">
              <FormattedMessage
                id="National HHAP"
                defaultMessage="National HHAP"
              />
            </p>
          </div>
          <div className="legend-el">
            <span className="country-subnational-hhap legend-box"></span>
            <p className="legend-text">
              <FormattedMessage
                id="Subnational or local"
                defaultMessage="Subnational or local"
              />
            </p>
          </div>
          <div className="legend-el">
            <span className="country-no-hhap legend-box"></span>
            <p className="legend-text">
              <FormattedMessage id="No HHAP" defaultMessage="No HHAP" />
            </p>
          </div>
          <div className="legend-el">
            <span className="country-none legend-box"></span>
            <p className="legend-text">
              <FormattedMessage
                id="No information"
                defaultMessage="No information"
              />
            </p>
          </div>
        </div>
      )}

      {thematicMapMode === 'hhws' && (
        <div className="legend portals-legend">
          <div className="legend-el">
            <span className="country-national-hhap legend-box"></span>
            <p className="legend-text">
              <FormattedMessage
                id="HHWS available (click on country for further information)"
                defaultMessage="HHWS available (click on country for further information)"
              />
            </p>
          </div>
          <div className="legend-el">
            <span className="country-none legend-box"></span>
            <p className="legend-text">
              <FormattedMessage
                id="No information"
                defaultMessage="No information"
              />
            </p>
          </div>
        </div>
      )}
    </>
  );
}
