import React, { useState, useEffect } from 'react';
import spinner from '@eeacms/volto-cca-policy/../theme//assets/images/spinner.svg';
import {
  HTMLField,
  BannerTitle,
  LogoWrapper,
} from '@eeacms/volto-cca-policy/helpers';
import {
  Container,
  Accordion,
  Icon,
  Segment,
  Image,
  Button,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

if (!__SERVER__) {
  window.cds_toolbox = {
    cds_public_path: 'https://cds.climate.copernicus.eu/toolbox/',
  };
}

const createIframeOld = (div_id, details_url, details_params, spinner_url) => {
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

const createIframe = (
  div_id,
  details_url,
  details_params,
  ecde_identifier,
  spinner_url,
) => {
  // return '<iframe src="http://ecde-dev.copernicus-climate.eu/apps/ecde/?disabled=true&theme=eea&indicator=18_consecutive_dry_days" style="width: 100%; border: 0; height: min(800px, 80vh);"/>';
  if (typeof ecde_identifier !== 'undefined' && ecde_identifier) {
    return (
      // '<iframe src="http://ecde-dev.copernicus-climate.eu/apps/ecde/?disabled=true&theme=eea&indicator=' +
      '<iframe src="https://apps.copernicus-climate.eu/c3s-apps/ecde/?disabled=true&theme=eea&indicator=' +
      ecde_identifier +
      '" style="width: 100%; border: 0; height: min(800px, 80vh);"/>'
    );
  }
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

const Overview = (props) => {
  const { content } = props;
  const {
    overview_app_toolbox_url,
    overview_app_toolbox_url_v2,
    overview_app_parameters,
    overview_app_ecde_identifier,
  } = content;
  const c3s_overview_url = overview_app_toolbox_url;
  const c3s_ecde_identifier = overview_app_ecde_identifier;
  const c3s_overview_params = JSON.stringify(overview_app_parameters).replace(
    /"/g,
    "'",
  ); // we avoid double quotes in iframe text
  const [spinnerUrl, setSpinnerUrl] = useState(null);

  React.useEffect(() => {
    setSpinnerUrl(spinner);
  }, []);

  if (overview_app_ecde_identifier) {
    return (
      <div
        className="iframe-container div-chart-container"
        dangerouslySetInnerHTML={{
          __html: createIframe(
            'toolbox-app-overview',
            overview_app_toolbox_url_v2,
            c3s_overview_params,
            c3s_ecde_identifier,
            spinnerUrl,
          ),
        }}
      />
    );
  }

  return (
    <div
      className="iframe-container div-chart-container"
      dangerouslySetInnerHTML={{
        __html: createIframeOld(
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
    // indicator_title,
    title,
    logo,
    // c3sjs_overview,
  } = content;
  const [showDetails, setShowDetails] = useState(false);

  const [activeAccordion, setActiveAccordion] = React.useState([true, false]);
  const currentLanguage = useSelector((state) => state.intl.locale);

  function handleAccordionClick(e, index) {
    const _activeAccordion = JSON.parse(JSON.stringify(activeAccordion));
    _activeAccordion[index] = !_activeAccordion[index];

    setActiveAccordion(_activeAccordion);
  }

  const [showMode, setShowMode] = React.useState('normal');

  function handleShowModeClick(e, mode) {
    setShowMode(mode);
    setActiveAccordion(mode === 'full' ? [false, false] : [true, false]);
    e.preventDefault();
  }

  // const toggleIframe = () => {
  //   setShowDetails(!showDetails);
  // };

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
      <BannerTitle
        content={{ ...content, image: '' }}
        data={{
          info: [{ description: '' }],
          hideContentType: true,
          hideCreationDate: true,
          hideModificationDate: true,
          hidePublishingDate: true,
          hideDownloadButton: false,
          hideShareButton: false,
        }}
      />

      <Container className="">
        <LogoWrapper logo={logo}>
          <h2>
            <FormattedMessage
              id="Background information"
              defaultMessage="Background information"
            />
          </h2>
          {logo && (
            <Image
              src={logo?.scales?.mini?.download}
              alt={title}
              className="db-logo"
            />
          )}
        </LogoWrapper>

        <Accordion id="background" key="background" className="secondary">
          <Accordion.Title
            role="button"
            tabIndex={0}
            active={activeAccordion[0]}
            aria-expanded={activeAccordion[0]}
            index={1}
            onClick={(e) => handleAccordionClick(e, 0)}
            onKeyDown={(e) => {
              if (e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();
                handleAccordionClick(e, 0);
              }
            }}
          >
            <span className="item-title">Background Information</span>
            {activeAccordion[0] ? (
              <Icon className="ri-arrow-up-s-line" />
            ) : (
              <Icon className="ri-arrow-down-s-line" />
            )}
          </Accordion.Title>
          <Accordion.Content active={activeAccordion[0]}>
            <HTMLField value={long_description} />
          </Accordion.Content>
        </Accordion>
        <Accordion id="visualisation" key="visualisation" className="secondary">
          <Accordion.Title
            role="button"
            tabIndex={0}
            active={activeAccordion[1]}
            aria-expanded={activeAccordion[1]}
            index={1}
            onClick={(e) => handleAccordionClick(e, 1)}
            onKeyDown={(e) => {
              if (e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();
                handleAccordionClick(e, 1);
              }
            }}
          >
            <span className="item-title">Visualisation and Navigation</span>
            {activeAccordion[1] ? (
              <Icon className="ri-arrow-up-s-line" />
            ) : (
              <Icon className="ri-arrow-down-s-line" />
            )}
          </Accordion.Title>
          <Accordion.Content active={activeAccordion[1]}>
            <HTMLField value={definition_app} />
          </Accordion.Content>
        </Accordion>

        <div className="c3s-buttons">
          {showMode === 'normal' ? (
            <a href="#details">
              <Button primary onClick={(_e) => handleShowModeClick(_e, 'full')}>
                <FormattedMessage id="Fullscreen" defaultMessage="Fullscreen" />
              </Button>
            </a>
          ) : (
            <Link to={window.location.pathname}>
              <Button
                primary
                onClick={(_e) => handleShowModeClick(_e, 'normal')}
              >
                <FormattedMessage
                  id="Exit fullscreen"
                  defaultMessage="Exit fullscreen"
                />
              </Button>
            </Link>
          )}
        </div>
      </Container>

      <div className={showMode === 'full' ? 'page-document' : 'ui container'}>
        <div className="full">{!__SERVER__ && <Overview {...props} />}</div>
      </div>
      <Container>
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
            <a
              href={
                '/' +
                currentLanguage +
                '/knowledge/european-climate-data-explorer/disclaimer'
              }
            >
              <FormattedMessage id="Disclaimer" defaultMessage="Disclaimer" />
            </a>
          </p>
        </Segment>
      </Container>
    </div>
  );
}

export default C3SIndicatorView;
