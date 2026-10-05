import AccordionList from './AccordionList';
import { Callout } from '@eeacms/volto-eea-design-system/ui';

export default function MenuLegalPolicy(props) {
  const dataJsonString = props.dataJson;
  const dataJson = JSON.parse(dataJsonString);
  let elements = [];
  if (dataJson?.Legal_Policies) {
    if (dataJson?.Legal_Policies?.LegalPolicyFrameworks) {
      elements.push({
        Title: 'Legal and policy frameworks and regulations',
        Text: dataJson.Legal_Policies.LegalPolicyFrameworks,
      });
    }
    if (dataJson?.Legal_Policies?.ArrangementsCCIV_assessments) {
      elements.push({
        Title: 'Climate vulnerability and risk assessment',
        Text: dataJson.Legal_Policies.ArrangementsCCIV_assessments,
      });
    }
    if (dataJson?.Legal_Policies?.DescribeInstitutionalArrangements) {
      elements.push({
        Title:
          'Planning, implementation, monitoring and evaluation of adaptation policy',
        Text: dataJson.Legal_Policies.DescribeInstitutionalArrangements,
      });
    }
    if (dataJson?.Legal_Policies?.DescribeEIA) {
      elements.push({
        Title: 'Integration into environmental assessment',
        Text: dataJson.Legal_Policies.DescribeEIA,
      });
    }
    if (dataJson?.Legal_Policies?.DescribeDRR) {
      elements.push({
        Title: 'Integration into disaster risk management',
        Text: dataJson.Legal_Policies.DescribeDRR,
      });
    }
    if (dataJson?.Legal_Policies?.DescribeCollection) {
      elements.push({
        Title: 'Collection and ownership of data',
        Text: dataJson.Legal_Policies.DescribeCollection,
      });
    }
  }
  return (
    <>
      <Callout className="eea callout gray">
        <p>
          This section outlines the legal and policy frameworks, regulations,
          institutional arrangements and governance structures that support
          national climate adaptation. It summarises how institutions coordinate
          action, how adaptation policies are planned, implemented, monitored,
          evaluated and revised, and how climate impacts and resilience are
          integrated into environmental assessment procedures and disaster risk
          management frameworks.
        </p>
      </Callout>
      <AccordionList elements={elements} />
    </>
  );
}
