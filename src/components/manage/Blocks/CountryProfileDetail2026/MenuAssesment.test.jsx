import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MenuAssesment from './MenuAssesment';

jest.mock('./AccordionList', () => ({ elements }) => (
  <div>
    {elements.map(({ Title, Text }) => (
      <p key={Title}>
        {Title}: {Text}
      </p>
    ))}
  </div>
));
jest.mock('./StatusCircle', () => ({ statusValue }) => (
  <span>{statusValue}</span>
));
jest.mock(
  '@eeacms/volto-eea-design-system/ui',
  () => ({
    Callout: ({ children }) => <div>{children}</div>,
  }),
  { virtual: true },
);

describe('MenuAssesment', () => {
  it('renders hazard groups and reported sector assessments', () => {
    const data = {
      National_Circumstances: {
        MainActivitiesClimateMonitoring: 'Monitoring',
        ApproachesMethodologiesTools: 'Methods',
      },
      Observed_Future_Climate_Hazards: {
        GeneralAspectsAssessment: 'General',
        DescribeExistingEnvironmental: 'Pressures',
        DescribeSecondaryEffects: 'Secondary',
        HazardsForm: [
          {
            Hazards: [
              {
                Group: 'SolidMass',
                Type: 'AC',
                Event: 'Heat_wave',
                Occurrence: 'Observed',
                YesNo_Value: 'Yes',
              },
              {
                Group: 'SolidMass',
                Type: 'AC',
                Event: 'Heat_wave Future',
                Occurrence: 'Future',
                PatternValue: '+ significantly increasing',
              },
              {
                Group: 'SolidMass',
                Type: 'CH',
                Event: 'Drought',
                Occurrence: 'Observed',
                YesNo_Value: 'No',
              },
              {
                Group: 'SolidMass',
                Type: 'CH',
                Event: 'Drought Future',
                Occurrence: 'Future',
                PatternValue: '= without significant change',
              },
            ],
          },
        ],
      },
      Key_Affected_Sectors: {
        energy: {
          PrimarySector: 'Energy',
          ImpactsKeyHazards: 'High',
          DescribeImpactsKeyHazards: 'Observed impacts',
          KeyHazardsLikelihood: 'Likely',
          DescribeLikelihood: 'Likely\nIncreasing',
          Vulnerability: 'Medium',
          DescribeVulnerability: 'Vulnerable',
          RiskFutureImpacts: 'High',
          DescribeRisk: 'Risky',
        },
        other: {
          PrimarySector: 'Other',
          ImpactsKeyHazards: 'Low',
          DescribeImpactsKeyHazards: 'Other impact',
          KeyHazardsLikelihood: 'Unlikely',
          DescribeLikelihood: 'Unlikely',
          Vulnerability: 'Low',
          DescribeVulnerability: 'Stable',
          RiskFutureImpacts: 'Low',
          DescribeRisk: 'Low risk',
        },
      },
    };

    render(<MenuAssesment dataJson={JSON.stringify(data)} />);

    expect(screen.getByText('Hazard assessment')).toBeInTheDocument();
    expect(
      screen.getByText('Supporting assessment information'),
    ).toBeInTheDocument();
    expect(screen.getByText('Key affected sectors')).toBeInTheDocument();
    expect(screen.getByText('Heat wave')).toBeInTheDocument();
    expect(
      screen.getByText(/Observed impact of key hazards/),
    ).toBeInTheDocument();
  });
});
