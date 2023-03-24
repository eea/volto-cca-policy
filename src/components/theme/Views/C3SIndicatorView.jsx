import React, { useState } from 'react';
import spinner from '@eeacms/volto-cca-policy/../theme//assets/images/spinner.svg';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import { Grid } from 'semantic-ui-react';

if (__CLIENT__) {
  window.cds_toolbox = {
    cds_public_path: 'https://cds.climate.copernicus.eu/toolbox/',
  };
}

const createIframe2 = (details_url, selected_region, spinner_url) => {
  let selected_app;
  // selected_region = 'Bayern';

  selected_app = details_url
    .split('https://cds.climate.copernicus.eu/workflows/c3s/')[1]
    .split('/')[0];
  // console.log('selected app: ', selected_app);
  //
  // console.log('region: ', selected_region);

  return `
  <iframe width="100%" height="800px" srcdoc="<head>
    <title>CDS integration test</title>
    <meta charset='utf-8' />
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
    <script type='text/javascript'>
        window.cds_toolbox = { cds_public_path: 'https://cds.climate.copernicus.eu/toolbox/' };
    </script>
    <script type='text/javascript' src='https://cds.climate.copernicus.eu/toolbox/toolbox-latest.js'></script>
    <script src='https://code.jquery.com/jquery-3.6.3.min.js'
        integrity='sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=' crossorigin='anonymous'></script>

  <body>
    <div class='t-ct'>
        <div id='toolbox-app'>
            <div class='pre-app-loading'>
                <img src='${spinner_url}' alt='Loading'>
                <div>
                    ...loading configuration...
                </div>
            </div>
        </div>
    </div>

    <script>
        (function () {
            const ID = 'toolbox-app';
            $(document).ready(() => {
                window.cds_toolbox.runApp(ID, 'https://cds.climate.copernicus.eu/workflows/c3s/${selected_app}/master/configuration.json', {
                    workflowParams: {
                        default: '${selected_region}'
                    }
                });
            });
        })();

    </script>

</body>" />`;
};

const createIframe1 = (details_url, details_params, spinner_url) => {
  console.log('AAAAAAAAAAAAAAAa');
  console.log('details url', details_url);

  return `
  <iframe width="100%" height="500px" srcdoc="<head>
    <title>CDS integration test</title>
    <meta charset='utf-8' />
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
    <script type='text/javascript'>
        window.cds_toolbox = { cds_public_path: 'https://cds.climate.copernicus.eu/toolbox/' };
    </script>
    <script type='text/javascript' src='https://cds.climate.copernicus.eu/toolbox/toolbox-latest.js'></script>
    <script src='https://code.jquery.com/jquery-3.6.3.min.js'
        integrity='sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=' crossorigin='anonymous'></script>
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
      <script type="text/javascript">
        (function () {
          document.addEventListener('DOMContentLoaded', function () {
            window.cds_toolbox.runApp(
              'toolbox-app-overview',
              'https://cds.climate.copernicus.eu/workflows/c3s/hidden-app-health-heatwave-overview-web/master/configuration.json?configuration_version=3.0',
              {"workflowParams": {"hdef": "climatological_related"}}
            );
          }, false);
        })();
      </script>
    </body>"
  />`;
};

const Details = (props) => {
  const { content } = props;
  const c3s_details_url = content.details_app_toolbox_url;
  const c3s_details_params = content.details_app_parameters;
  console.log('content', content);
  console.log('def app', content.definition_app);
  console.log('app 1', c3s_details_url);
  console.log('app 2', c3s_details_params);
  const [spinnerUrl, setSpinnerUrl] = useState(null);
  const details_url =
    'https://cds.climate.copernicus.eu/workflows/c3s/ecde-app-growing-degree-days/master/configuration.json';

  console.log(details_url);

  React.useEffect(() => {
    setSpinnerUrl(spinner);
  }, []);

  let test = 1;

  if (test === 2) {
    return (
      <div
        className="iframe-container"
        dangerouslySetInnerHTML={{
          __html: createIframe2(details_url, 'Vest', spinnerUrl),
        }}
      />
    );
  }

  if (test === 1) {
    return (
      <div
        className="iframe-container"
        dangerouslySetInnerHTML={{
          __html: createIframe1(
            c3s_details_url,
            c3s_details_params,
            spinnerUrl,
          ),
        }}
      />
    );
  }
  return null;
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
              <Details {...props} />
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default C3SIndicatorView;
