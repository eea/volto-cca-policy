import React from 'react';

export default function Filter(props) {
  return (
    <>
      <div className="legend portals-legend">
        <div className="legend-el">
          <span className="country-eea-member legend-box"></span>
          <p className="legend-text">EEA member countries</p>
        </div>
        <div className="legend-el">
          <span className="country-eea-coopereting legend-box"></span>
          <p className="legend-text">EEA coopereting countries</p>
        </div>
        <div className="legend-el">
          <span className="country-eastern legend-box"></span>
          <p className="legend-text">
            Eastern parnership members of the Energy Community
          </p>
        </div>
      </div>
    </>
  );
}
