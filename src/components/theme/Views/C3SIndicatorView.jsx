import React, { useState, useEffect } from 'react';
import spinner from '@eeacms/volto-cca-policy/../theme//assets/images/spinner.svg';
import {
  HTMLField,
  BannerTitle,
  LogoWrapper,
} from '@eeacms/volto-cca-policy/helpers';
import { Accordion, Icon, Segment, Image } from 'semantic-ui-react';
import { PortalMessage } from '@eeacms/volto-cca-policy/components';

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
  const { details_app_toolbox_url, details_app_parameters } = content;

  const c3s_details_url = details_app_toolbox_url;
  const c3s_details_params = JSON.stringify(details_app_parameters).replace(
    /"/g,
    "'",
  ); // we avoid double quotes in iframe text
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
  const { overview_app_toolbox_url, overview_app_parameters } = content;
  const c3s_overview_url = overview_app_toolbox_url;
  const c3s_overview_params = JSON.stringify(overview_app_parameters).replace(
    /"/g,
    "'",
  ); // we avoid double quotes in iframe text
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
  const {
    definition_app,
    long_description,
    indicator_title,
    title,
    logo,
  } = content;
  const [showDetails, setShowDetails] = useState(false);
  const hasIndicatorTitle =
    indicator_title && indicator_title !== '_' && indicator_title !== '-';

  const [activeAccIndex, setActiveAccIndex] = React.useState(null);

  function handleAccClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeAccIndex === index ? -1 : index;

    setActiveAccIndex(newIndex);
  }

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
    <div className="db-item-view c3sindicator-view">
      <BannerTitle content={{ ...content, image: '' }} />

      <div className="ui container">
        <PortalMessage content={content} />
        <LogoWrapper logo={logo}>
          <h2>Background information</h2>
          {logo && (
            <Image
              src={logo?.scales?.mini?.download}
              alt={title}
              className="db-logo"
            />
          )}
        </LogoWrapper>

        <HTMLField value={long_description} />

        <div className="c3s-buttons">
          <a href="#details">
            <button className="ui button primary" onClick={toggleIframe}>
              {showDetails ? 'Go back' : 'Explore in detail'}
            </button>
          </a>
          <a href="/knowledge/european-climate-data-explorer/">
            <button className="ui button primary">ECDE homepage</button>
          </a>
        </div>

        {definition_app && !hasIndicatorTitle && (
          <Accordion>
            <Accordion.Title
              className="accordion-title "
              active={activeAccIndex === 0}
              index={0}
              onClick={handleAccClick}
            >
              <span>Visualisation and Navigation</span>
              {activeAccIndex === 0 ? (
                <Icon name="ri-arrow-up-s-line" size="24px" />
              ) : (
                <Icon name="ri-arrow-down-s-line" size="24px" />
              )}
            </Accordion.Title>
            <Accordion.Content active={activeAccIndex === 0}>
              <HTMLField value={definition_app} />
            </Accordion.Content>
          </Accordion>
        )}

        <h2>
          {hasIndicatorTitle && <>{indicator_title}</>}
          {showDetails && ' - Explore index'}
        </h2>

        <div>
          {!__SERVER__ && !showDetails && <Overview {...props} />}
          {!__SERVER__ && showDetails && <Details {...props} />}
        </div>

        <Segment>
          <p>
            Content in the European Climate Data Explorer pages is delivered by
            the{' '}
            <a href="https://climate.copernicus.eu/">
              Copernicus Climate Change Service (C3S)
            </a>{' '}
            implemented by ECMWF.
          </p>
          <p>
            <a href="/knowledge/european-climate-data-explorer/disclaimer">
              Disclaimer
            </a>
          </p>
        </Segment>
      </div>
    </div>
  );
}

export default C3SIndicatorView;
