import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function Filter(props) {
  return (
    <>
      <div className="legend portals-legend">
        <div className="legend-el">
          <span className="country-eea-member legend-box"></span>
          <p className="legend-text">
            <FormattedMessage
              id="EEA member countries"
              defaultMessage="EEA member countries"
            />
          </p>
        </div>
        <div className="legend-el">
          <span className="country-eea-coopereting legend-box"></span>
          <p className="legend-text">
            <FormattedMessage
              id="EEA coopereting countries"
              defaultMessage="EEA coopereting countries"
            />
          </p>
        </div>
        <div className="legend-el">
          <span className="country-eastern legend-box"></span>
          <p className="legend-text">
            <FormattedMessage
              id="Eastern parnership members of the Energy Community"
              defaultMessage="Eastern parnership members of the Energy Community"
            />
          </p>
        </div>
        <div className="legend-el">
          <span className="legend-box"></span>
          <p className="legend-text">
            <FormattedMessage
              id="This designation is without prejudice to positions on status, and is in line with UNSCR 1244/99 and the ICJ opinion on Kosovo Declaration of Independence."
              defaultMessage="This designation is without prejudice to positions on status, and is in line with UNSCR 1244/99 and the ICJ opinion on Kosovo Declaration of Independence"
            />
          </p>
        </div>
      </div>
    </>
  );
}
