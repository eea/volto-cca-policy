import AccordionList from './AccordionList';

export default function MenuMonitorEvaluation(props) {
  const dataJsonString = props.dataJson;
  const dataJson = JSON.parse(dataJsonString);
  let elements = {
    MRE: {
      Title: 'Monitoring, reporting and evaluation (MRE)',
      Description:
        "This section explains the country's formal approach to MRE, including the frameworks, legal basic and specific processes that guide implementation.",
      items: [],
    },
    StateOfPlay: {
      Title: 'State of play',
      Description:
        'A summary of the current status of MRE activities, including the indicators used, data sources, ad ongoing monitoring efforts across different sectors.',
      items: [],
    },
    ProgressOnAdaptation: {
      Title: 'Progress on adaptation',
      Description:
        'This section highlights key achievements, outcomes from adaptation efforts',
      items: [],
    },
    StepsToReview: {
      Title: 'Monitoring, reporting and evaluation (MRE)',
      Description:
        "This section explains the country's formal approach to MRE, including the frameworks, legal basic and specific processes that guide implementation.",
      items: [],
    },
  };
  if (dataJson?.Monitoring_Evaluation) {
    if (dataJson?.Monitoring_Evaluation?.DescribeMREMethodology) {
      elements.MRE.items.push({
        Title: 'MRE methodology',
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
      <div class="documentDescription eea callout">
        <p>
          This section{' '}
          <strong>
            summarizes national progress on climate change adaptation
          </strong>
          , including key actions, funding, and monitoring efforts. It provides
          an overview of how each country strengthens resilience and integrates
          adaptation across sectors and governance levels.
        </p>
      </div>
      {Object.entries(elements).map(([key, element]) => (
        <div key={key}>
          <h2>{element.Title}</h2>
          <p>{element.Description}</p>
          <AccordionList elements={element.items} />
        </div>
      ))}
    </>
  );
}
