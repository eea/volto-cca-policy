import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function Filter(props) {
  return (
    <>
      <div className="legend portals-legend">
        <div className="legend-el">
          <span className="country-eea-eu-member legend-box"></span>
          <p className="legend-text">
            <FormattedMessage
              id="EU Member States and EEA Member Countries"
              defaultMessage="EU Member States and EEA Member Countries"
            />
          </p>
        </div>
        <div className="legend-el">
          <span className="country-eea-member legend-box"></span>
          <p className="legend-text">
            <FormattedMessage
              id="EEA Member Countries"
              defaultMessage="EEA Member Countries"
            />
          </p>
        </div>
        <div className="legend-el">
          <span className="country-eea-coopereting legend-box"></span>
          <p className="legend-text">
            <FormattedMessage
              id="EEA Cooperating Countries and Energy Community Contracting Parties"
              defaultMessage="EEA Cooperating Countries and Energy Community Contracting Parties"
            />
          </p>
        </div>
        <div className="legend-el">
          <span className="country-eastern legend-box"></span>
          <p className="legend-text">
            <FormattedMessage
              id="Eastern Parnership Members and Energy Community Contracting Parties"
              defaultMessage="Eastern Parnership Members and Energy Community Contracting Parties"
            />
          </p>
        </div>
      </div>
    </>
  );
}
