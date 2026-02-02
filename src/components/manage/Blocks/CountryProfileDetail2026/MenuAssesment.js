import React from 'react';
import { Grid, TabPane, Tab } from 'semantic-ui-react';
import ReactDOMServer from 'react-dom/server';
import './styles.less';

import StatusCircle from './StatusCircle';
import AccordionList from './AccordionList';

export default function MenuProfile(props) {
  const [activePanes, setActivePanes] = React.useState({});

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
    if (hazardData.Occurrence != 'Future') {
      continue;
    }
    console.log(hazardData);
    panesHazardData[hazardData.Group][hazardData.Type].push({
      Title: hazardData.Event,
      Status: '?!?!',
    });
  }
  console.log('panesHazardData', panesHazardData);
  let panesHazard = [];
  Object.entries(panesHazardData).forEach(([key, data]) => {
    let content = <PanesHazardContent data={data} />;
    panesHazard.push({
      menuItem: data.Title,
      render: () => <TabPane>{content}</TabPane>,
    });
  });

  let panesKeysData = {
    'agriculture and food': 'Agriculture & food',
    biodiversity: 'Biodiversity',
    buildings: 'Buildings',
    business: 'Business',
    energy: 'Energy',
    forestry: 'Forestry',
    health: 'Health',
    'land use planning': 'Land use planning',
    tourism: 'Tourism',
    transport: 'Transport',
    'water management': 'Water management',
    other: 'Other',
    urban: 'Urban',
    CivilProtection: 'Civil protection',
    // 'coastal areas'
    // 'finance and insurance'
  };
  let panesKeys = [];
  Object.entries(panesKeysData).forEach(([key, data]) => {
    let keyElements = [];
    Object.entries(dataJson?.Key_Affected_Sectors ?? []).forEach(
      ([sectorKey, sectorData]) => {
        if (sectorData.PrimarySector == key) {
          keyElements.push({
            Title: sectorData.SectorDescribe,
            Text: ReactDOMServer.renderToString(
              <KeyAffectedSectorContent data={sectorData} />,
            ),
          });
        }
      },
    );
    if (keyElements.length) {
      panesKeys.push({
        menuItem: data,
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
        <span class="fw-light">{data.Description}</span>
      </p>
      <div>
        <p>
          <strong>Acute Hazards</strong>
        </p>
        <div class="styled-dividerBlock">
          <div class="ui fitted divider divider-spacing-s"></div>
        </div>
        <Grid columns="12" className="cpBgGray">
          <Grid.Column
            mobile={12}
            tablet={12}
            computer={6}
            className="col-right"
          >
            <p>
              <span class="fw-light">Hazard type</span>
            </p>
          </Grid.Column>
          <Grid.Column
            mobile={12}
            tablet={12}
            computer={6}
            className="col-right"
          >
            <p>
              <span class="fw-light">Future status</span>
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
                  <span class="fw-light">{data.Title}</span>
                </p>
              </Grid.Column>
              <Grid.Column
                mobile={12}
                tablet={12}
                computer={6}
                className="col-right"
              >
                <p>
                  <span class="fw-light">
                    <StatusCircle statusValue={data.Status} />
                    {data.Status}
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
        <div class="styled-dividerBlock">
          <div class="ui fitted divider divider-spacing-s"></div>
        </div>
        <Grid columns="12" className="cpBgGray">
          <Grid.Column
            mobile={12}
            tablet={12}
            computer={6}
            className="col-right"
          >
            <p>
              <span class="fw-light">Hazard type</span>
            </p>
          </Grid.Column>
          <Grid.Column
            mobile={12}
            tablet={12}
            computer={6}
            className="col-right"
          >
            <p>
              <span class="fw-light">Future status</span>
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
                  <span class="fw-light">{data.Title}</span>
                </p>
              </Grid.Column>
              <Grid.Column
                mobile={12}
                tablet={12}
                computer={6}
                className="col-right"
              >
                <p>
                  <span class="fw-light">
                    <StatusCircle statusValue={data.Status} />
                    {data.Status}
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

const KeyAffectedSectorContent = ({ data }) => {
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
            <b>{data.Vulnerability}</b>
          </p>
        </Grid.Column>
      </Grid>
      <p>
        <strong>Assessment</strong>
      </p>
      {data.DescribeImpactsKeyHazards}
    </>
  );
};
