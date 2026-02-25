import React from 'react';
import superagent from 'superagent';
import { Dropdown, Grid } from 'semantic-ui-react';
import { searchContent } from '@plone/volto/actions';
import ECDEIndicator from './ECDEIndicator';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { C3S_INDICATOR } from '@eeacms/volto-cca-policy/constants';

const regions_url =
  'https://nest.discomap.eea.europa.eu/arcgis/rest/services/CLIMA/Regions_cities/MapServer/2/query?where=1+%3D+1&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson';

function useRegions() {
  const [regions, setRegions] = React.useState([]);

  React.useEffect(() => {
    superagent
      .get(regions_url)
      .set('accept', 'json')
      .then((resp) => {
        const res = JSON.parse(resp.text);
        // console.log(res);
        if (res?.features) {
          const _regions = res.features
            .map((o) => [
              // o.attributes.GISCO_ID,
              // o.attributes.LAU_Name_Excel,
              o.attributes.NUTS_ID,
              o.attributes.NUTS_NAME,
            ])
            .sort((a, b) => (a[1] > b[1] ? 1 : a[1] === b[1] ? 0 : -1));
          // console.log('res', _regions); //JSON.parse(resp.text)
          setRegions(_regions);
        }
      });
  }, []);

  return regions;
}

function useIndicators() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const action = searchContent(
      '/',
      {
        portal_type: C3S_INDICATOR,
        origin_website: 'C3S',
      },
      'ecde_indicators',
    );
    dispatch(action);
  }, [dispatch]);

  const indicators = useSelector(
    (state) => state.search.subrequests.ecde_indicators?.items || [],
  );
  // console.log('indicators', indicators);

  return indicators;
}

export default function ECDEIndicatorsView(props) {
  const [selectedIndicator, setSelectedIndicator] = React.useState();
  const [selectedRegion, setSelectedRegion] = React.useState();

  const regions = useRegions();
  const indicators = useIndicators();

  // console.log(regions);
  return (
    <div>
      <Grid columns="12">
        <Grid.Column mobile={12} tablet={12} computer={2} className="col-left">
          <div className="regions-selector">
            <strong>
              <FormattedMessage id="Regions" defaultMessage="Regions" />
            </strong>
            <Dropdown
              clearable
              options={regions.map(([key, label]) => ({
                key,
                text: label,
                value: key,
              }))}
              selection
              onChange={(e, { value }) => setSelectedRegion(value)}
            />
          </div>
          <div className="indicators-selector">
            <strong>
              <FormattedMessage id="Indicators" defaultMessage="Indicators" />
            </strong>
            <Dropdown
              clearable
              options={indicators.map((indic) => ({
                key: indic['@id'],
                text: indic.title,
                value: indic['@id'],
              }))}
              selection
              onChange={(e, { value }) => {
                setSelectedIndicator(value);
                setSelectedRegion(
                  indicators.filter((item) => item['@id'] === value)[0]?.title,
                );
              }}
            />
          </div>
        </Grid.Column>
        <Grid.Column
          mobile={12}
          tablet={12}
          computer={10}
          className="col-right"
        >
          {selectedIndicator ? (
            <ECDEIndicator
              indicatorUrl={selectedIndicator}
              selectedRegion={selectedRegion}
            />
          ) : null}
        </Grid.Column>
      </Grid>
    </div>
  );
}
