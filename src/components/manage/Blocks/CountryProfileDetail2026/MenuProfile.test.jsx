import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MenuProfile from './MenuProfile';

jest.mock('semantic-ui-react', () => {
  const Grid = ({ children }) => <div>{children}</div>;
  Grid.Column = ({ children }) => <div>{children}</div>;
  return { Grid };
});
jest.mock('./StatusCircle', () => ({ statusValue }) => (
  <span>{statusValue}</span>
));

const profileData = {
  Legal_Policies: {
    AdaptationPolicies: [
      {
        Type: 'Policy: Strategy',
        Link: '/strategy',
        Title: 'Strategy link',
        Status: 'Status (Adopted)',
      },
      {
        Type: 'Plan',
        Link: '/plan',
        Title: 'Plan link',
        Status: 'Adopted - In force',
      },
      {
        Type: 'Missing status',
        Link: '/missing',
        Title: 'Missing',
        Status: 42,
      },
    ],
  },
  National_Circumstances: {
    Meteo_observation: [
      { Name: 'Weather data', WebLink: '/weather', Status: 'Available' },
    ],
    Climate_Projections_Services: [
      {
        Description: 'Climate service',
        WebLink: '/climate',
        Status: 'Available',
      },
    ],
  },
  Monitoring_Evaluation: {
    Monitoring_Indicator_Methodologies: [
      {
        Description: 'MRE report',
        Link: '/mre',
        IndicatorsMethodology: 'Reported',
      },
    ],
  },
  Contact: [
    {
      Contact_General: [
        {
          Organisation: 'Climate office',
          Department: 'Adaptation',
          Website: '/contact',
        },
      ],
      Website: [
        {
          Type: 'Website',
          Title: 'Portal',
          Department: 'Climate',
          Url: '/portal',
        },
        { Type: 'Other', Title: 'Ignored portal', Url: '/ignored' },
      ],
      Publications: [{ Publisher: 'Publisher', WebLink: '/publication' }],
    },
    { Website: [{ Type: 'Website', Title: 'Second portal', Url: '/second' }] },
  ],
};

describe('MenuProfile', () => {
  it('renders policies, services, portals, publications, contacts and the Energy Community notice', () => {
    render(
      <MenuProfile
        dataJson={JSON.stringify(profileData)}
        countryName="Albania"
      />,
    );
    expect(screen.getByText('Strategy')).toBeInTheDocument();
    expect(screen.getByText('Weather data')).toBeInTheDocument();
    expect(screen.getByText('Climate service')).toBeInTheDocument();
    expect(screen.getAllByText('MRE report')).toHaveLength(2);
    expect(screen.getByText('Portal')).toBeInTheDocument();
    expect(screen.queryByText('Second portal')).not.toBeInTheDocument();
    expect(screen.getByText('Publisher')).toBeInTheDocument();
    expect(screen.getByText('Climate office')).toBeInTheDocument();
    expect(screen.getByText(/adapted Regulation/)).toBeInTheDocument();
  });

  it('supports object contacts and the standard reporting notice', () => {
    render(
      <MenuProfile
        dataJson={JSON.stringify({
          Legal_Policies: { AdaptationPolicies: [] },
          Contact: { Contact_General: [], Website: [], Publications: [] },
        })}
        countryName="France"
      />,
    );
    expect(screen.getByText(/according to the Regulation/)).toBeInTheDocument();
    expect(screen.getByText('Adaptation policies')).toBeInTheDocument();
  });
});
