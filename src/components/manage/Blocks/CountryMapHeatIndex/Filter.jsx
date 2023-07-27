export default function Filter(props) {
  const { thematicMapMode, setThematicMapMode } = props;
  return (
    <>
      <h2>Choose thematic map:</h2>
      <div id="sections-selector">
        <input
          type="radio"
          name="country-map-section"
          value="hhap"
          checked="checked"
          onChange={(e) => {
            setThematicMapMode(e.target.value);
          }}
        />
        Heat health action plans (HHAP)
        <br />
        <input
          type="radio"
          name="country-map-section"
          value="hhws"
          onChange={(e) => {
            setThematicMapMode(e.target.value);
          }}
        />
        Heat health warning systems (HHWS)
      </div>

      {thematicMapMode === 'hhap' && (
        <div className="legend climate-legend">
          <div className="legend-el">
            <span className="country-national-hhap legend-box"></span>
            <p className="legend-text">National HHAP</p>
          </div>
          <div className="legend-el">
            <span className="country-subnational-hhap legend-box"></span>
            <p className="legend-text">Subnational or local</p>
          </div>
          <div className="legend-el">
            <span className="country-no-hhap legend-box"></span>
            <p className="legend-text">No HHAP</p>
          </div>
          <div className="legend-el">
            <span className="country-national-hhap legend-box"></span>
            <p className="legend-text">No information</p>
          </div>
        </div>
      )}

      {thematicMapMode === 'hhws' && (
        <div className="legend portals-legend">
          <div className="legend-el">
            <span className="country-national-hhap legend-box"></span>
            <p className="legend-text">
              HHWS available (click on country for further information)
            </p>
          </div>
          <div className="legend-el">
            <span className="country-none legend-box"></span>
            <p className="legend-text">No information</p>
          </div>
        </div>
      )}
    </>
  );
}
