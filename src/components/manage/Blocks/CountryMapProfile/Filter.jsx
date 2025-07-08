import React from 'react';
import { Radio } from 'semantic-ui-react';

function hidePopup() {
  const collections = document.getElementsByClassName('map-tooltip');
  for (let i = 0; i < collections.length; i++) {
    collections[i].style.visibility = 'hidden';
  }
}

export default function Filter(props) {
  const { thematicMapMode, setThematicMapMode } = props;
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
