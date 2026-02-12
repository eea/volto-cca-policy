import { compose } from 'redux';
import { Grid } from 'semantic-ui-react';
import { withGeoJsonData } from '@eeacms/volto-cca-policy/helpers/country_map/hocs';
import { clientOnly } from '@eeacms/volto-cca-policy/helpers';
import { withOpenLayers } from '@eeacms/volto-openlayers-map';
import withResponsiveContainer from '../withResponsiveContainer';
import withVisibilitySensor from '../withVisibilitySensor';

import './styles.less';

// const url =
//   'https://raw.githubusercontent.com/eurostat/Nuts2json/master/pub/v2/2021/4326/20M/cntrg.json';

const View = (props) => {
  return (
    <div className="country-profile-detail">
      <Grid columns="12">
        <Grid.Column
          mobile={12}
          tablet={12}
          computer={10}
          className="col-right"
        >
          CONTENT HERE
        </Grid.Column>
        <Grid.Column mobile={12} tablet={12} computer={2} className="col-left">
          MENU HERE
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default compose(
  clientOnly,
  withGeoJsonData(true),
  withResponsiveContainer('countryMapProfileBlock'),
  withVisibilitySensor(),
  withOpenLayers,
)(View);
