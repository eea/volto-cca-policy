import React, { useState, useEffect } from 'react';
import spinner from '@eeacms/volto-cca-policy/../theme//assets/images/spinner.svg';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import { Grid } from 'semantic-ui-react';

if (!__SERVER__) {
  window.cds_toolbox = {
    cds_public_path: 'https://cds.climate.copernicus.eu/toolbox/',
  };
}

const createIframe = (div_id, details_url, details_params, spinner_url) => {
  return `
  <iframe width="100%" height="800px" srcdoc="<html><head>
    <title>CDS integration test</title>
    <meta charset='utf-8' />
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
    <script>
        window.cds_toolbox = { cds_public_path: 'https://cds.climate.copernicus.eu/toolbox/' };
    </script>
    <script type='text/javascript' src='https://cds.climate.copernicus.eu/toolbox/toolbox-latest.js'></script>
    </head>
    <body>
      <div class='t-ct'>
        <div id='${div_id}'>
          <div class='pre-app-loading'>
            <img src='${spinner_url}' alt='Loading'>
            <div>
              ...loading configuration...
            </div>
          </div>
        </div>
      </div>
      <script type='text/javascript'>
      document.addEventListener('DOMContentLoaded',
        function () {
          window.cds_toolbox.runApp(
            '${div_id}',
            '${details_url}',
            ${details_params}
          );
        }, false);
      </script>
    </body></html>"
  />`;
};

const Details = (props) => {
  const { content } = props;
  const c3s_details_url = content.details_app_toolbox_url;
  const c3s_details_params = JSON.stringify(
    content.details_app_parameters,
  ).replace(/"/g, "'"); // we avoid double quotes in iframe text
  const [spinnerUrl, setSpinnerUrl] = useState(null);

  React.useEffect(() => {
    setSpinnerUrl(spinner);
  }, []);

  return (
    <div
      className="iframe-container"
      dangerouslySetInnerHTML={{
        __html: createIframe(
          'toolbox-app-details',
          c3s_details_url,
          c3s_details_params,
          spinnerUrl,
        ),
      }}
    />
  );
};

const Overview = (props) => {
  const { content } = props;
  const c3s_overview_url = content.overview_app_toolbox_url;
  const c3s_overview_params = JSON.stringify(
    content.overview_app_parameters,
  ).replace(/"/g, "'"); // we avoid double quotes in iframe text
  const [spinnerUrl, setSpinnerUrl] = useState(null);

  React.useEffect(() => {
    setSpinnerUrl(spinner);
  }, []);

  return (
    <div
      className="iframe-container"
      dangerouslySetInnerHTML={{
        __html: createIframe(
          'toolbox-app-overview',
          c3s_overview_url,
          c3s_overview_params,
          spinnerUrl,
        ),
      }}
    />
  );
};

function C3SIndicatorView(props) {
  const { content } = props;
  const [showDetails, setShowDetails] = useState(false);

  const toggleIframe = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    if (window.location.hash === '#details') {
      setShowDetails(true);
    }
  }, []);

  useEffect(() => {
    if (showDetails) {
      window.history.pushState({}, '', '#details');
    } else {
      window.history.pushState({}, '', window.location.pathname);
    }
  }, [showDetails]);

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
              <a
                href="/knowledge/european-climate-data-explorer/"
                className="btn-right"
              >
                <button className="ui button primary">ECDE homepage</button>
              </a>
              <h1>{content.title}</h1>
              <HTMLField
                value={content.long_description}
                className="long_description"
              />
              <a href="#details" className="btn-right">
                <button className="ui button primary" onClick={toggleIframe}>
                  {showDetails ? 'Go back' : 'Explore in detail'}
                </button>
              </a>
              <h2>
                {content.indicator_title} {showDetails && ' - Explore index'}
              </h2>
              {!__SERVER__ && !showDetails && <Overview {...props} />}
              {!__SERVER__ && showDetails && <Details {...props} />}

              <p>
                Content in the European Climate Data Explorer pages is delivered
                by the{' '}
                <a href="https://climate.copernicus.eu/">
                  Copernicus Climate Change Service (C3S)
                </a>{' '}
                implemented by ECMWF.{' '}
                <a href="/knowledge/european-climate-data-explorer/disclaimer">
                  Disclaimer
                </a>
              </p>
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default C3SIndicatorView;
