export default function Filter(props) {
  const { thematicMapMode, setThematicMapMode } = props;
  return (
    <>
      <h2>Choose thematic map:</h2>
      <div id="sections-selector">
        <input
          type="radio"
          name="country-map-section"
          value="National adaption policy"
          checked={thematicMapMode === 'National adaption policy'}
          onClick={(e) => {
            setThematicMapMode(e.target.value);
          }}
        />
        National adaption policy
        <br />
        <input
          type="radio"
          name="country-map-section"
          value="Adaptation portals and platforms"
          checked={thematicMapMode === 'Adaptation portals and platforms'}
          onClick={(e) => {
            setThematicMapMode(e.target.value);
          }}
        />
        Adaptation portals and platforms
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
            <span className="country-nodata2 legend-box"></span>
            <p className="legend-text">No portal or platform reported</p>
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

      {thematicMapMode === 'National adaption policy' && (
        <div className="legend nasnap-legend">
          <div className="legend-el">
            <span className="country-nasnap legend-box"></span>
            <p className="legend-text">
              National adaptation policy reported in 2023
            </p>
          </div>
          <div className="legend-el">
            <span className="country-nodata2 legend-box"></span>
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
