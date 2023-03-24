import React, { useState } from 'react';
import spinner from '@eeacms/volto-cca-policy/../theme//assets/images/spinner.svg';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import { Grid } from 'semantic-ui-react';

if (!__SERVER__) {
  window.cds_toolbox = {
    cds_public_path: 'https://cds.climate.copernicus.eu/toolbox/',
  };
}

const createIframe = (details_url, details_params, spinner_url) => {
  return `
  <iframe width="100%" height="500px" srcdoc="<html><head>
    <title>CDS integration test</title>
    <meta charset='utf-8' />
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
    <script>
        window.cds_toolbox = { cds_public_path: 'https://cds.climate.copernicus.eu/toolbox/' };
    </script>
    <script type='text/javascript' src='https://cds.climate.copernicus.eu/toolbox/toolbox-latest.js'></script>
    </head>
    <body>
      <div class='t-ct'>
        <div id='toolbox-app-details'>
          <div class='pre-app-loading'>
            <img src='${spinner_url}' alt='Loading'>
            <div>
              ...loading configuration...
            </div>
          </div>
        </div>
      </div>
      <script type='text/javascript'>
      var url = 'https://cds.climate.copernicus.eu/workflows/c3s/hidden-app-health-heatwave-overview-web/master/configuration.json?configuration_version=3.0';
      document.addEventListener('DOMContentLoaded',
        function () {
          window.cds_toolbox.runApp(
            'toolbox-app-details',
            url,
            {'workflowParams': {'hdef': 'climatological_related'}}
          );
        }, false);
      </script>
    </body></html>"
  />`;
};

const Details = (props) => {
  const { content } = props;
  const c3s_details_url = content.details_app_toolbox_url;
  const c3s_details_params = content.details_app_parameters;
  const [spinnerUrl, setSpinnerUrl] = useState(null);

  React.useEffect(() => {
    setSpinnerUrl(spinner);
  }, []);

  return (
    <div
      className="iframe-container"
      dangerouslySetInnerHTML={{
        __html: createIframe(c3s_details_url, c3s_details_params, spinnerUrl),
      }}
    />
  );
};

function C3SIndicatorView(props) {
  const { content } = props;

  return (
    <div className="c3sindicator-view">
      <div className="ui container">
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={12}
              className="col-full"
            >
              <h1>{content.title}</h1>
              <a href="/knowledge/european-climate-data-explorer/">
                <button className="ui button primary">ECDE homepage</button>
              </a>
              <HTMLField
                value={content.long_description}
                className="long_description"
              />
              {!__SERVER__ && <Details {...props} />}
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default C3SIndicatorView;
