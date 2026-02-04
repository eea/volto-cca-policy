import AccordionList from './AccordionList';

export default function MenuNationalCircumstances(props) {
  const dataJsonString = props.dataJson;
  const dataJson = JSON.parse(dataJsonString);
  let elements = [];
  if (dataJson?.National_Circumstances) {
    if (dataJson?.National_Circumstances?.BiogeophysicalCharacteristics) {
      elements.push({
        Title: 'Biogeophysical characteristics',
        Text: dataJson.National_Circumstances.BiogeophysicalCharacteristics,
      });
    }
    if (dataJson?.National_Circumstances?.DemographicSituation) {
      elements.push({
        Title: 'Demographic situation',
        Text: dataJson.National_Circumstances.DemographicSituation,
      });
    }
    if (dataJson?.National_Circumstances?.EconomicInfrastructuralSituation) {
      elements.push({
        Title: 'Economic and infrastructural situation',
        Text: dataJson.National_Circumstances.EconomicInfrastructuralSituation,
      });
    }
  }
  return (
    <>
      <div class="documentDescription eea callout">
        <p>
          Lorem ipsum dolor sit amet consectetur. Nunc ac velit felis fermentum
          pretium vulputate sapien eleifend. Amet dolor ultricies laoreet sed.
          Ut semper lacinia nisl aliquet aenean gravida. Quam lectus viverra eu
          enim a lorem sed vestibulum. Suspendisse a dictum eu venenatis mattis.
        </p>
      </div>
      <AccordionList elements={elements} />
    </>
  );
}
