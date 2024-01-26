import { Form, Radio } from 'semantic-ui-react';

export default function Filter(props) {
  const { thematicMapMode, setThematicMapMode } = props;
  return (
    <>
      <h2>Choose thematic map:</h2>
      <Form>
        <Form.Field>
          <Radio
            id="HHAP"
            key="HHAP"
            label="Heat health action plans (HHAP)"
            name="country-map-section"
            value="hhap"
            checked={thematicMapMode === 'hhap'}
            onChange={(_e, { value }) => {
              setThematicMapMode(value);
            }}
          />
          <Radio
            id="HHWS"
            label="Heat health warning systems (HHWS)"
            name="country-map-section"
            value="hhws"
            checked={thematicMapMode === 'hhws'}
            onChange={(_e, { value }) => {
              setThematicMapMode(value);
            }}
          />
        </Form.Field>
      </Form>

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
