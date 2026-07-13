import AccordionList from './AccordionList';
import { Callout } from '@eeacms/volto-eea-design-system/ui';

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
      <Callout className="eea callout gray">
        <p>
          This section provides an overview of the national circumstances that
          shape climate adaptation needs and priorities, including current and
          projected climate impacts, vulnerabilities, risks and adaptive
          capacity. It covers the biogeophysical characteristics, demographic
          conditions and economic and infrastructural factors that are relevant
          to the design, planning and implementation of effective adaptation
          actions.
        </p>
      </Callout>
      <AccordionList elements={elements} />
    </>
  );
}
