import { Tab } from 'semantic-ui-react';
import AccordionList from './AccordionList';
import ReactDOMServer from 'react-dom/server';

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
        render: () => <AccordionList elements={keyElements} />,
      });
    }
  });
  return (
    <>
      <div class="documentDescription eea callout">
        <p>
          This section provides an overview of the country’s
          <strong>
            {' '}
            climate change adaptation strategy and its implementation
          </strong>
          . It summarizes strategic priorities, governance processes, and how
          adaptation is integrated into sectoral planning. Where available, it
          also presents actions and measures that support climate resilience
          across key sectors.
        </p>
      </div>
      <AccordionList elements={elements} />
      <h2>Selection of actions and (programmes of) measures</h2>
      <p>
        This section provides an overview of the adaptation actions and measures
        reported by the country. The measures are grouped by sector to reflect
        the areas most affected by climate change and the corresponding
        responses.
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
