import React from 'react';
import superagent from 'superagent';
import { Dropdown, Grid } from 'semantic-ui-react';
import { searchContent } from '@plone/volto/actions';
import ECDEIndicator from './ECDEIndicator';
import { useDispatch, useSelector } from 'react-redux';

const comunities_url =
  'https://nest.discomap.eea.europa.eu/arcgis/rest/services/CLIMA/Regions_cities/MapServer/1/query?where=1+%3D+1&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson';

//
//
function useCommunities() {
  const [communities, setCommunities] = React.useState([]);

  React.useEffect(() => {
    superagent
      .get(comunities_url)
      .set('accept', 'json')
      .then((resp) => {
        const res = JSON.parse(resp.text);
        const _communities = res.features.map((o) => [
          o.attributes.GISCO_ID,
          o.attributes.LAU_Name_Excel,
        ]);
        // console.log('res', _communities); //JSON.parse(resp.text)
        setCommunities(_communities);
      });
  }, []);

  return communities;
}

function useIndicators() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const action = searchContent(
      '/',
      {
        portal_type: 'eea.climateadapt.c3sindicator',
        origin_website: 'C3S',
      },
      'ecde_indicators',
    );
    dispatch(action);
  }, [dispatch]);

  const indicators = useSelector(
    (state) => state.search.subrequests.ecde_indicators?.items || [],
  );
  console.log('indicators', indicators);

  return indicators;
}

export default function ECDEIndicatorsView(props) {
  const [selectedIndicator, setSelectedIndicator] = React.useState();

  const communities = useCommunities();
  const indicators = useIndicators();

  // console.log(communities);
  return (
    <div>
      {selectedIndicator}
      <Grid>
        <Grid.Column width={4}>
          <div>
            <strong>Communities</strong>
            <Dropdown
              clearable
              options={communities.map(([key, label]) => ({
                key,
                text: label,
                value: key,
              }))}
              selection
            />
          </div>
          <div>
            <strong>Indicators</strong>
            <Dropdown
              clearable
              options={indicators.map((indic) => ({
                key: indic['@id'],
                text: indic.title,
                value: indic['@id'],
              }))}
              selection
              onChange={(e, { value }) => setSelectedIndicator(value)}
            />
          </div>
        </Grid.Column>
        <Grid.Column width={8}>
          {selectedIndicator ? (
            <ECDEIndicator indicatorUrl={selectedIndicator} />
          ) : null}
        </Grid.Column>
      </Grid>
    </div>
  );
}
