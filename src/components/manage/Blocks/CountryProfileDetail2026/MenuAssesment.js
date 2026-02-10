import React from 'react';
import { Grid, TabPane, Tab } from 'semantic-ui-react';
import ReactDOMServer from 'react-dom/server';
import './styles.less';

import StatusCircle from './StatusCircle';
import AccordionList from './AccordionList';

export default function MenuProfile(props) {
  const dataJsonString = props.dataJson;
  const dataJson = JSON.parse(dataJsonString);

  let elements = [];
  if (dataJson?.National_Circumstances) {
    if (dataJson?.National_Circumstances?.MainActivitiesClimateMonitoring) {
      elements.push({
        Title: 'Climate monitoring, modelling, projections and scenarios',
        Text: dataJson.National_Circumstances.MainActivitiesClimateMonitoring,
      });
    }
    if (dataJson?.National_Circumstances?.ApproachesMethodologiesTools) {
      elements.push({
        Title:
          'Methodologies and tools (including uncertainties and challenges)',
        Text: dataJson.National_Circumstances.ApproachesMethodologiesTools,
      });
    }
  }
  if (dataJson?.Observed_Future_Climate_Hazards) {
    if (dataJson?.Observed_Future_Climate_Hazards?.GeneralAspectsAssessment) {
      elements.push({
        Title:
          'General aspects of climate change impact & vulnerability assessment',
        Text: dataJson.Observed_Future_Climate_Hazards.GeneralAspectsAssessment,
      });
    }
    if (
      dataJson?.Observed_Future_Climate_Hazards?.DescribeExistingEnvironmental
    ) {
      elements.push({
        Title: 'Overview of existing pressures',
        Text: dataJson.Observed_Future_Climate_Hazards
          .DescribeExistingEnvironmental,
      });
    }
    if (dataJson?.Observed_Future_Climate_Hazards?.DescribeSecondaryEffects) {
      elements.push({
        Title: 'Secondary effects',
        Text: dataJson.Observed_Future_Climate_Hazards.DescribeSecondaryEffects,
      });
    }
  }
  let hazards = dataJson.Observed_Future_Climate_Hazards.HazardsForm[0].Hazards;

  let panesHazardData = {
    SolidMass: {
      Title: 'Solid mass',
      Description:
        'Overview of solid mass-related hazards and their observed and projected status',
      AC: [],
      CH: [],
    },
    Temperature: {
      Title: 'Temperature',
      Description:
        'Overview of temperature-related hazards and their observed and projected status',
      AC: [],
      CH: [],
    },
    Water: {
      Title: 'Water',
      Description:
        'Overview of water-related hazards and their observed and projected status',
      AC: [],
      CH: [],
    },
    Wind: {
      Title: 'Wind',
      Description:
        'Overview of wind-related hazards and their observed and projected status',
      AC: [],
      CH: [],
    },
  };
  for (let i = 0; i < hazards.length; i++) {
    const hazardData = hazards[i];
    if (hazardData.Occurrence !== 'Future') {
      continue;
    }
    panesHazardData[hazardData.Group][hazardData.Type].push({
      Title: hazardData.Event,
      Status: mapStatus(hazardData.PatternValue),
    });
  }
  let panesHazard = [];
  Object.entries(panesHazardData).forEach(([key, data]) => {
    let content = <PanesHazardContent data={data} />;
    panesHazard.push({
      menuItem: data.Title,
      render: () => <TabPane>{content}</TabPane>,
    });
  });

  const panesKeys = Object.values(dataJson?.Key_Affected_Sectors ?? {}).map(
    (item) => item.PrimarySector,
  );

  const resultPanesKeys = [
    ...panesKeys
      .filter((item) => item.toLowerCase() !== 'other')
      .sort((a, b) => a.localeCompare(b)),
    ...panesKeys.filter((item) => item.toLowerCase() === 'other'),
  ];

  Object.entries(resultPanesKeys).forEach(([key, data]) => {
    let keyElements = [];
    Object.entries(dataJson?.Key_Affected_Sectors ?? []).forEach(
      ([sectorKey, sectorData]) => {
        if (sectorData.PrimarySector === data) {
          keyElements.push({
            // Id: sectorKey + '_0',
            Title:
              'Observed impact of key hazards, including changes in frequency and magnitude',
            Text: ReactDOMServer.renderToString(
              <KeyAffectedSectorContent
                rating={sectorData.ImpactsKeyHazards}
                assestment={sectorData.DescribeImpactsKeyHazards}
              />,
            ),
          });
          keyElements.push({
            // Id: sectorKey + '_1',
            Title:
              'Key hazards likelihood of occurrence and exposure to them under future climate',
            Text: ReactDOMServer.renderToString(
              <KeyAffectedSectorContent
                rating={sectorData.KeyHazardsLikelihood}
                assestment={sectorData.DescribeLikelihood}
              />,
            ),
          });
          keyElements.push({
            // Id: sectorKey + '_2',
            Title: 'Vulnerability, including adaptive capacity',
            Text: ReactDOMServer.renderToString(
              <KeyAffectedSectorContent
                rating={sectorData.Vulnerability}
                assestment={sectorData.DescribeVulnerability}
              />,
            ),
          });
          keyElements.push({
            // Id: sectorKey + '_3',
            Title: 'Risk of potential future impacts',
            Text: ReactDOMServer.renderToString(
              <KeyAffectedSectorContent
                rating={sectorData.RiskFutureImpacts}
                assestment={sectorData.DescribeRisk}
              />,
            ),
          });
        }
      },
    );
    if (keyElements.length) {
      panesKeys.push({
        menuItem: (data.charAt(0).toUpperCase() + data.slice(1))
          .split('(')[0]
          .trim(),
        render: () => <AccordionList elements={keyElements} />,
      });
    }
  });
  return (
    <>
      <h2>Hazard assessment</h2>
      <Tab
        className="secondary menu"
        panes={panesHazard}
        grid={{ paneWidth: 8, tabWidth: 4 }}
        menu={{
          tabular: true,
          vertical: false,
          inverted: false,
          pointing: true,
          fluid: true,
          className: 'secondary',
          tabIndex: 0,
        }}
      />
      <h2>Supporting assessment information</h2>
      <AccordionList elements={elements} />
      <h2>Key affected sectors</h2>
      <Tab
        className="secondary menu"
        panes={panesKeys}
        grid={{ paneWidth: 8, tabWidth: 4 }}
        menu={{
          tabular: true,
          vertical: true,
          inverted: false,
          pointing: true,
          fluid: true,
          className: 'secondary',
          tabIndex: 0,
        }}
      />
    </>
  );
}

const PanesHazardContent = ({ data }) => {
  return (
    <>
      <p>
        <span className="fw-light">{data.Description}</span>
      </p>
      <div>
        <p>
          <strong>Acute Hazards</strong>
        </p>
        <div className="styled-dividerBlock">
          <div className="ui fitted divider divider-spacing-s"></div>
        </div>
        <Grid columns="12" className="cpBgGray">
          <Grid.Column
            mobile={12}
            tablet={12}
            computer={6}
            className="col-right"
          >
            <p>
              <span className="fw-light">Hazard type</span>
            </p>
          </Grid.Column>
          <Grid.Column
            mobile={12}
            tablet={12}
            computer={6}
            className="col-right"
          >
            <p>
              <span className="fw-light">Future status</span>
            </p>
          </Grid.Column>

          {data.AC.map((data, index) => (
            <>
              <Grid.Column
                mobile={12}
                tablet={12}
                computer={6}
                className="col-right"
              >
                <p>
                  <span className="fw-light">{data.Title}</span>
                </p>
              </Grid.Column>
              <Grid.Column
                mobile={12}
                tablet={12}
                computer={6}
                className="col-right"
              >
                <p>
                  <span className="fw-light">
                    <StatusCircle statusValue={data.Status} />
                  </span>
                </p>
              </Grid.Column>
            </>
          ))}
        </Grid>
      </div>
      <div>
        <p>
          <strong>Chronic Hazards</strong>
        </p>
        <div className="styled-dividerBlock">
          <div className="ui fitted divider divider-spacing-s"></div>
        </div>
        <Grid columns="12" className="cpBgGray">
          <Grid.Column
            mobile={12}
            tablet={12}
            computer={6}
            className="col-right"
          >
            <p>
              <span className="fw-light">Hazard type</span>
            </p>
          </Grid.Column>
          <Grid.Column
            mobile={12}
            tablet={12}
            computer={6}
            className="col-right"
          >
            <p>
              <span className="fw-light">Future status</span>
            </p>
          </Grid.Column>
          {data.CH.map((data, index) => (
            <>
              <Grid.Column
                mobile={12}
                tablet={12}
                computer={6}
                className="col-right"
              >
                <p>
                  <span className="fw-light">{data.Title}</span>
                </p>
              </Grid.Column>
              <Grid.Column
                mobile={12}
                tablet={12}
                computer={6}
                className="col-right"
              >
                <p>
                  <span className="fw-light">
                    <StatusCircle statusValue={data.Status} />
                  </span>
                </p>
              </Grid.Column>
            </>
          ))}
        </Grid>
      </div>
    </>
  );
};

const KeyAffectedSectorContent = ({ rating, assestment }) => {
  return (
    <>
      <Grid columns="12">
        <Grid.Column mobile={12} tablet={12} computer={8} className="col-right">
          <p>
            <strong>Rating</strong>
          </p>
        </Grid.Column>
        <Grid.Column mobile={12} tablet={12} computer={4} className="col-right">
          <p>
            <b>{rating}</b>
          </p>
        </Grid.Column>
      </Grid>
      <p>
        <strong>Assessment</strong>
      </p>
      {assestment}
    </>
  );
};

function mapStatus(name) {
  let response = '';
  switch (name) {
    case '? evolution uncertain or unknown':
      response = 'uncertain / unknown';
      break;
    case '- significantly decreasing':
      response = 'significantly decreasing';
      break;
    case '+ significantly increasing':
      response = 'significantly increasing';
      break;
    case '0 hazard not of relevance':
      response = 'not of relevance';
      break;
    case '= without significant change':
      response = 'no significant change';
      break;
    default:
      response = 'NOT FOUND:' + name;
  }
  return response;
}
