import { Tab } from 'semantic-ui-react';
import AccordionList from './AccordionList';
import ReactDOMServer from 'react-dom/server';
import { Callout } from '@eeacms/volto-eea-design-system/ui';

export default function MenuStrategiesPlansGoals(props) {
  const dataJsonString = props.dataJson;
  const dataJson = JSON.parse(dataJsonString);
  let elements = [];
  if (dataJson?.Strategies_Plans) {
    if (dataJson?.Strategies_Plans?.AdaptationPriorities) {
      elements.push({
        Title: 'Adaptation priorities',
        Text: dataJson.Strategies_Plans.AdaptationPriorities,
      });
    }
    if (dataJson?.Strategies_Plans?.Challenges) {
      elements.push({
        Title: 'Challenges, gaps and barriers',
        Text: dataJson.Strategies_Plans.Challenges,
      });
    }
    if (dataJson?.Strategies_Plans?.SummaryNationalStrategies) {
      elements.push({
        Title: 'Summaries of national strategies',
        Text: dataJson.Strategies_Plans.SummaryNationalStrategies,
      });
    }
    if (dataJson?.Strategies_Plans?.OverviewEffortsClimate) {
      elements.push({
        Title: 'Integration into sectoral policies, plans and programs',
        Text: dataJson.Strategies_Plans.OverviewEffortsClimate,
      });
    }
    if (dataJson?.Strategies_Plans?.OverviewMeasures) {
      elements.push({
        Title: 'Stakeholder engagement - public',
        Text: dataJson.Strategies_Plans.OverviewMeasures,
      });
    }
    if (dataJson?.Strategies_Plans?.OverviewPrivateSector) {
      elements.push({
        Title: 'Stakeholder engagement - private',
        Text: dataJson.Strategies_Plans.OverviewPrivateSector,
      });
    }
  }

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
    Object.entries(dataJson?.Strategies_Plans?.Action_Measures ?? []).forEach(
      ([sectorKey, sectorData]) => {
        if (sectorData.SectorsAffected === key) {
          keyElements.push({
            Title: sectorData.Title,
            Text: ReactDOMServer.renderToString(
              <CategoryContent data={sectorData} />,
            ),
          });
        }
      },
    );
    if (keyElements.length) {
      panesKeys.push({
        menuItem: data,
        render: () => (
          <div>
            <AccordionList elements={keyElements} />
          </div>
        ),
      });
    }
  });
  return (
    <>
      <Callout>
        <p>
          This section summarises national adaptation strategies, policies,
          plans and goals, including key priorities, challenges, gaps and
          barriers to adaptation. Where available, it also outlines planned
          adaptation actions and measures, as well as broader national efforts
          to advance climate resilience.
        </p>
      </Callout>
      <h2 id="overview">Adaptation governance overview</h2>
      <p>
        Governance approach to climate adaptation, including strategic
        priorities, key challenges, stakeholder processes and how adaptation is
        embedded across policies and planning frameworks.
      </p>
      <AccordionList elements={elements} />
      <h2 id="measures">Adaptation actions and measures</h2>
      <p>
        Overview of reported adaptation actions and measures. The measures are
        grouped by sector to reflect the areas most affected by climate change.
      </p>
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

const CategoryContent = ({ data }) => {
  return (
    <>
      <p>
        <strong>Description</strong>
      </p>
      <p>{data.shortDescriptionMeasureAction}</p>
      <p>
        <strong>Key type measure (KTM)</strong>
      </p>
      <p>{data.KeyTypeMeasure}</p>
      <p>
        <strong>Sub-KTM</strong>
      </p>
      <p>{data.subKTM}</p>
    </>
  );
};
