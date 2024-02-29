import React from 'react';
import { Radio } from 'semantic-ui-react';

export default function Filter(props) {
  const { thematicMapMode, setThematicMapMode } = props;
  return (
    <>
      <h2>Choose thematic map:</h2>
      <div id="sections-selector">
        <Radio
          label="National adaption policy"
          name="country-map-section"
          value="National adaption policy"
          checked={thematicMapMode === 'National adaption policy'}
          onChange={(_e, { value }) => {
            setThematicMapMode(value);
          }}
        />
        <Radio
          label="Adaptation portals and platforms"
          name="country-map-section"
          value="Adaptation portals and platforms"
          checked={thematicMapMode === 'Adaptation portals and platforms'}
          onChange={(_e, { value }) => {
            setThematicMapMode(value);
          }}
        />
      </div>

      {thematicMapMode === 'Adaptation portals and platforms' && (
        <div className="legend portals-legend">
          <div className="legend-el">
            <span className="country-both legend-box"></span>
            <p className="legend-text">
              Adaptation portal or platform reported
            </p>
          </div>
          <div className="legend-el">
            <span className="country-noportal legend-box"></span>
            <p className="legend-text">No portal or platform reported</p>
          </div>
          <div className="legend-el">
            <span className="country-notreported legend-box"></span>
            <p className="legend-text">No data reported in 2023</p>
          </div>
          <div className="legend-el">
            <span className="country-outside legend-box"></span>
            <p className="legend-text">Outside EEA coverage</p>
          </div>
        </div>
      )}

      {thematicMapMode === 'National adaption policy' && (
        <div className="legend nasnap-legend">
          <div className="legend-el">
            <span className="country-nasnap legend-box"></span>
            <p className="legend-text">
              National adaptation policy reported in 2023
            </p>
          </div>
          <div className="legend-el">
            <span className="country-nap legend-box"></span>
            <p className="legend-text">
              National adaptation policy not reported beyond mandatory reporting
              in 2023
            </p>
          </div>
          <div className="legend-el">
            <span className="country-nas legend-box"></span>
            <p className="legend-text">No data reported in 2023</p>
          </div>
          <div className="legend-el">
            <span className="country-none legend-box"></span>
            <p className="legend-text">Outside EEA coverage</p>
          </div>
        </div>
      )}
    </>
  );
}
