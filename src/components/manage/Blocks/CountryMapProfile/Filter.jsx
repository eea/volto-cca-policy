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
          checked="checked"
          onChange={(e) => {
            setThematicMapMode(e.target.value);
          }}
        />
        National adaption policy
        <br />
        <input
          type="radio"
          name="country-map-section"
          value="Climate change impact and vulnerability assessments"
          onChange={(e) => {
            setThematicMapMode(e.target.value);
          }}
        />
        Climate change impact and vulnerability assessments
        <br />
        <input
          type="radio"
          name="country-map-section"
          value="Adaptation portals and platforms"
          onChange={(e) => {
            setThematicMapMode(e.target.value);
          }}
        />
        Adaptation portals and platforms
      </div>

      {thematicMapMode ===
        'Climate change impact and vulnerability assessments' && (
        <div className="legend climate-legend">
          <div className="legend-el">
            <span className="content-available legend-box"></span>
            <p className="legend-text">One or more assessments reported</p>
          </div>
          <div className="legend-el">
            <span className="country-none legend-box"></span>
            <p className="legend-text">No assessments reported</p>
          </div>
          <div className="legend-el">
            <span className="country-outside legend-box"></span>
            <p className="legend-text">Outside EEA coverage</p>
          </div>
          <div className="legend-el">
            <span className="country-notreported legend-box"></span>
            <p className="legend-text">No data reported in 2021</p>
          </div>
        </div>
      )}

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
            <span className="country-outside legend-box"></span>
            <p className="legend-text">Outside EEA coverage</p>
          </div>
          <div className="legend-el">
            <span className="country-notreported legend-box"></span>
            <p className="legend-text">No data reported in 2021</p>
          </div>
        </div>
      )}

      {thematicMapMode === 'National adaption policy' && (
        <div className="legend nasnap-legend">
          <div className="legend-el">
            <span className="country-nasnap legend-box"></span>
            <p className="legend-text">NAS and NAP reported as adopted</p>
          </div>
          <div className="legend-el">
            <span className="country-nap legend-box"></span>
            <p className="legend-text">Only NAP reported as adopted</p>
          </div>
          <div className="legend-el">
            <span className="country-nas legend-box"></span>
            <p className="legend-text">Only NAS reported as adopted</p>
          </div>
          <div className="legend-el">
            <span className="country-sap legend-box"></span>
            <p className="legend-text">SAP reported as adopted</p>
          </div>
          <div className="legend-el">
            <span className="country-none legend-box"></span>
            <p className="legend-text">Outside EEA coverage</p>
          </div>
          <div className="legend-el">
            <span className="country-notreported legend-box"></span>
            <p className="legend-text">No data reported in 2021</p>
          </div>
        </div>
      )}
    </>
  );
}
