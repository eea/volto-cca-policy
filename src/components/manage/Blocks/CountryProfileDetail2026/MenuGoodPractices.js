import { Tab } from 'semantic-ui-react';
import AccordionList from './AccordionList';

export default function MenuGoodPractices(props) {
  const dataJsonString = props.dataJson;
  const dataJson = JSON.parse(dataJsonString);
  let panesGoodPractices = [];
  if (dataJson?.National_Circumstances) {
    if (dataJson?.National_Circumstances?.BiogeophysicalCharacteristics) {
      panesGoodPractices.push({
        menuItem: 'International frameworks',
        render: () => (
          <>
            <p className="callout">
              This section shows the country’s involvement in international and
              regional cooperation frameworks that support climate adaptation.
            </p>
            <div className="styled-dividerBlock secondary has--theme--secondary styled">
              <div className="ui divider secondary divider-spacing-s"></div>
            </div>
            {dataJson.National_Circumstances.BiogeophysicalCharacteristics}
          </>
        ),
      });
    }
    if (dataJson?.National_Circumstances?.DemographicSituation) {
      panesGoodPractices.push({
        menuItem: 'Science',
        render: () => (
          <>
            <p className="callout">
              This section highlights cooperation in research, knowledge
              exchange, and scientific activities related to climate adaptation.
            </p>
            <div className="styled-dividerBlock secondary has--theme--secondary styled">
              <div className="ui divider secondary divider-spacing-s"></div>
            </div>
            {dataJson.National_Circumstances.DemographicSituation}
          </>
        ),
      });
    }
    if (dataJson?.National_Circumstances?.EconomicInfrastructuralSituation) {
      panesGoodPractices.push({
        menuItem: 'Policy',
        render: () => (
          <>
            <p className="callout">
              This section summarizes collaboration on policy development,
              governance, and shared adaptation initiatives.
            </p>
            <div className="styled-dividerBlock secondary has--theme--secondary styled">
              <div className="ui divider secondary divider-spacing-s"></div>
            </div>
            {dataJson.National_Circumstances.EconomicInfrastructuralSituation}
          </>
        ),
      });
    }
  }

  let elements = [];
  Object.entries(
    dataJson?.Cooperation_Experience?.AvailableGoodPractices ?? [],
  ).forEach(([key, data]) => {
    elements.push({
      Title: data.Title,
      Text: data.DescribeGoodPractice,
    });
  });
  return (
    <>
      <div>
        <h2>Cooperation and experience</h2>
        <p>
          This section presents the country's cooperation activities, including
          scientific collaboration, international partnerships and policy-level
          synergies that support climate adaptation.
        </p>
        <Tab
          className="secondary menu"
          panes={panesGoodPractices}
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
      </div>
      <h2>Good practices and lessons learnt</h2>
      <div className="styled-dividerBlock tertiary has--theme--tertiary styled">
        <div className="ui fitted divider tertiary divider-spacing-s"></div>
      </div>
      <p>
        This section presents selected good practices and lessons learnt
        reported by the country. The number and type of practices may vary
        depending on national experience, priorities and reporting status.
      </p>
      <AccordionList elements={elements} />
    </>
  );
}
