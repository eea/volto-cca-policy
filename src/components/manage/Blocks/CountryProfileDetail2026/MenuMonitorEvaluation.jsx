import React from 'react';
import AccordionList from './AccordionList';
import { Callout } from '@eeacms/volto-eea-design-system/ui';

export default function MenuMonitorEvaluation(props) {
  const dataJsonString = props.dataJson;
  const dataJson = JSON.parse(dataJsonString);
  let elements = {
    MRE: {
      Title: 'Monitoring, reporting and evaluation (MRE)',
      id: 'mre',
      Description:
        'National MRE approaches, including their legal basis, indicators, methodologies and processes for tracking adaptation implementation and progress.',
      items: [],
    },
    StateOfPlay: {
      Title: 'State of play',
      id: 'state_play',
      Description:
        'Information on the current status of MRE activities, including indicators, data sources and ongoing monitoring across sectors. It also reviews progress in implementing planned actions and measures, including the disbursement of funding to strengthen climate resilience, adaptation-related spending in disaster risk management and, where available, the share of sectoral spending used to support climate adaptation.',
      items: [],
    },
    ProgressOnAdaptation: {
      Title: 'Progress on adaptation',
      id: 'progress',
      Description:
        'Overview of key achievements and outcomes from adaptation efforts, including progress in reducing climate impacts, vulnerabilities and risks, increasing adaptive capacity, meeting adaptation priorities and addressing barriers.',
      items: [],
    },
    StepsToReview: {
      Title: 'Policy review process',
      id: 'steps_review',
      Description:
        'Overview of the steps taken to review and update vulnerability and risk assessments, as well as national adaptation policies, strategies, plans and measures.',
      items: [],
    },
  };
  if (dataJson?.Monitoring_Evaluation) {
    if (
      dataJson?.Monitoring_Evaluation?.DescribeMonitoringReportingEvaluation
    ) {
      elements.MRE.items.push({
        Title: 'MRE methodology',
        Text: dataJson.Monitoring_Evaluation
          .DescribeMonitoringReportingEvaluation,
      });
    }
    if (dataJson?.Monitoring_Evaluation?.DescribeMREMethodology) {
      elements.MRE.items.push({
        Title: 'MRE implementation',
        Text: dataJson.Monitoring_Evaluation.DescribeMREMethodology,
      });
    }
  }
  // StateOfPlay
  if (dataJson?.Monitoring_Evaluation) {
    if (dataJson?.Monitoring_Evaluation?.DescribeStatePlay) {
      elements.StateOfPlay.items.push({
        Title: 'Implementation',
        Text: dataJson.Monitoring_Evaluation.DescribeStatePlay,
        // Text: (dangerouslySetInnerHTML = {
        //   __html: dataJson.Monitoring_Evaluation.DescribeStatePlay,
        // }),
      });
    }
    if (dataJson?.Monitoring_Evaluation?.SummaryClimateAdaptation) {
      elements.StateOfPlay.items.push({
        Title: 'Spending for climate change adaptation',
        Text: dataJson.Monitoring_Evaluation.SummaryClimateAdaptation,
      });
    }
    if (dataJson?.Monitoring_Evaluation?.SummarySpendingShare) {
      elements.StateOfPlay.items.push({
        Title: 'Spending by sector',
        Text: dataJson.Monitoring_Evaluation.SummarySpendingShare,
      });
    }
  }
  // ProgressOnAdaptation
  if (dataJson?.Monitoring_Evaluation) {
    if (dataJson?.Monitoring_Evaluation?.DescribeReducingClimateImpacts) {
      elements.ProgressOnAdaptation.items.push({
        Title:
          'Progress towards reducing climate impacts, vulnerabilities and risks',
        Text: dataJson.Monitoring_Evaluation.DescribeReducingClimateImpacts,
      });
    }
    if (dataJson?.Monitoring_Evaluation?.DescribeIncreasingAdaptiveCapacity) {
      elements.ProgressOnAdaptation.items.push({
        Title: 'Progress increasing adaptive capacity',
        Text: dataJson.Monitoring_Evaluation.DescribeIncreasingAdaptiveCapacity,
      });
    }
    if (dataJson?.Monitoring_Evaluation?.DescribeMeetingAdaptationPriorities) {
      elements.ProgressOnAdaptation.items.push({
        Title: 'Progress meeting adaptation priorities',
        Text: dataJson.Monitoring_Evaluation
          .DescribeMeetingAdaptationPriorities,
      });
    }
    if (dataJson?.Monitoring_Evaluation?.DescribeProgressTowardsAddressing) {
      elements.ProgressOnAdaptation.items.push({
        Title: 'Progress addressing barriers to adaptation',
        Text: dataJson.Monitoring_Evaluation.DescribeProgressTowardsAddressing,
      });
    }
  }
  // StepsToReview
  if (dataJson?.Monitoring_Evaluation) {
    if (dataJson?.Monitoring_Evaluation?.DescribeVulnerability) {
      elements.StepsToReview.items.push({
        Title: 'Climate change impact and vulnerability assessment',
        Text: dataJson.Monitoring_Evaluation.DescribeVulnerability,
      });
    }
    if (dataJson?.Monitoring_Evaluation?.DescribeNationalAdaptation) {
      elements.StepsToReview.items.push({
        Title: 'National adaptation policies',
        Text: dataJson.Monitoring_Evaluation.DescribeNationalAdaptation,
      });
    }
  }
  return (
    <>
      <Callout className="eea callout gray">
        <p>
          This section summarises national progress on climate change
          adaptation, including key actions, funding and monitoring efforts. It
          provides an overview of how countries strengthen resilience and
          integrate adaptation across sectors and governance levels.
        </p>
      </Callout>
      {Object.entries(elements).map(([key, element]) => {
        if (element.items.length === 0) {
          return '';
        }
        return (
          <React.Fragment key={element.id}>
            <h2 id={element.id}>{element.Title}</h2>
            <div>
              <p>{element.Description}</p>
              <AccordionList elements={element.items} />
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
}
