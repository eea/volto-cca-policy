import AccordionList from './AccordionList';

export default function MenuSubNational(props) {
  const dataJsonString = props.dataJson;
  const dataJson = JSON.parse(dataJsonString);
  let elementsSubNational = [];
  if (dataJson?.Sub_National_Adaptation) {
    if (dataJson?.Sub_National_Adaptation?.SummarizeLegalRequirements) {
      elementsSubNational.push({
        Title: 'Legal requirements',
        Text: dataJson.Sub_National_Adaptation.SummarizeLegalRequirements,
      });
    }
    if (dataJson?.Sub_National_Adaptation?.SummarizeNetworks) {
      elementsSubNational.push({
        Title: 'Networks and collaborations',
        Text: dataJson.Sub_National_Adaptation.SummarizeNetworks,
      });
    }
    if (dataJson?.Sub_National_Adaptation?.SummarizeGoodPractice) {
      elementsSubNational.push({
        Title: 'Good practice examples of networks or other collaborations',
        Text: dataJson.Sub_National_Adaptation.SummarizeGoodPractice,
      });
    }
    if (dataJson?.Sub_National_Adaptation?.OverviewContent) {
      elementsSubNational.push({
        Title: 'Overview of the content of sub-national policies',
        Text: dataJson.Sub_National_Adaptation.OverviewContent,
      });
    }
    if (dataJson?.Sub_National_Adaptation?.OverviewMeasures) {
      elementsSubNational.push({
        Title: 'Stakeholder engagement - public',
        Text: dataJson.Sub_National_Adaptation.OverviewMeasures,
      });
    }
    if (dataJson?.Sub_National_Adaptation?.OverviewPrivateSector) {
      elementsSubNational.push({
        Title: 'Stakeholder engagement - private',
        Text: dataJson.Sub_National_Adaptation.OverviewPrivateSector,
      });
    }
    if (dataJson?.Sub_National_Adaptation?.DescribeSubNationalImplementation) {
      elementsSubNational.push({
        Title: 'State of play of the implementation of measures planned',
        Text: dataJson.Sub_National_Adaptation
          .DescribeSubNationalImplementation,
      });
    }
    if (dataJson?.Sub_National_Adaptation?.DescribeSubnationalAdaptation) {
      elementsSubNational.push({
        Title:
          'Overview of good practices to review subnational adaptation policies',
        Text: dataJson.Sub_National_Adaptation.DescribeSubnationalAdaptation,
      });
    }
    if (dataJson?.Sub_National_Adaptation?.DescribeDetailCooperationEnhance) {
      elementsSubNational.push({
        Title: 'Cooperation - adaptation action',
        Text: dataJson.Sub_National_Adaptation.DescribeDetailCooperationEnhance,
      });
    }
  }
  let elementsGoodPractics = [];
  Object.entries(
    dataJson?.Cooperation_Experience?.AvailableGoodPractices ?? [],
  ).forEach(([key, data]) => {
    elementsGoodPractics.push({
      Title: data.Title,
      Text: data.DescribeGoodPractice,
    });
  });
  return (
    <>
      <div class="documentDescription eea callout">
        <p>
          This section presents examples of good practices reported by the
          country, together with cooperation activities that support climate
          adaptation. It highlights{' '}
          <strong>
            practical experience, lessons learnt and collaborative efforts at
            national, regional and international levels.
          </strong>
        </p>
      </div>
      <div>
        <h2>Sub-national governance and institutional arrangements</h2>
        <div class="styled-dividerBlock secondary has--theme--secondary styled">
          <div class="ui fitted divider secondary divider-spacing-s"></div>
        </div>
        <div class="styled-dividerBlock">
          <div class="ui hidden divider divider-spacing-s"></div>
        </div>
        <p>
          This section provides an overview of governance structures and
          institutional arrangements at sub-national level, including how local
          and regional authorities organize, coordinate and implement adaptation
          actions.
        </p>
        <AccordionList elements={elementsSubNational} />
      </div>
      <div>
        <h2>Good practices and lessons learnt</h2>
        <div class="styled-dividerBlock secondary has--theme--secondary styled">
          <div class="ui fitted divider secondary divider-spacing-s"></div>
        </div>
        <div class="styled-dividerBlock">
          <div class="ui hidden divider divider-spacing-s"></div>
        </div>
        <p>
          This section presents selected good practices and lessons learnt
          reported by the country. The number and type of practices may vary
          depending on national experience, priorities and reporting status.
        </p>
        <AccordionList elements={elementsGoodPractics} />
      </div>
    </>
  );
}
