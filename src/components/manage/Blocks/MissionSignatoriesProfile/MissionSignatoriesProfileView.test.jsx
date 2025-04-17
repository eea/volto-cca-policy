import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MissionSignatoriesProfileView from './MissionSignatoriesProfileView';

// Mock the tab components with minimal placeholders
jest.mock('./TabSections/IntroductionTab', () => () => (
  <div>Mocked Introduction</div>
));
jest.mock('./TabSections/GovernanceTab', () => () => (
  <div>Mocked Governance</div>
));
jest.mock('./TabSections/AssessmentTab', () => () => (
  <div>Mocked Assessment</div>
));
jest.mock('./TabSections/PlanningTab', () => () => <div>Mocked Planning</div>);
jest.mock('./TabSections/ActionPagesTab', () => () => (
  <div>Mocked Action Pages</div>
));

describe('MissionSignatoriesProfileView', () => {
  const data = {
    _v_results: {
      planning: {
        planning_titles: [{}],
      },
      governance: [{}],
    },
  };

  it('renders tab labels and default content', () => {
    render(<MissionSignatoriesProfileView data={data} />);

    // Tab labels
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Governance')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Action Pages')).toBeInTheDocument();

    // Default selected tab content (Introduction)
    expect(screen.getByText('Mocked Introduction')).toBeInTheDocument();
  });

  it('switches tabs and renders corresponding content', () => {
    render(<MissionSignatoriesProfileView data={data} />);

    fireEvent.click(screen.getByText('Governance'));
    expect(screen.getByText('Mocked Governance')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Assessment'));
    expect(screen.getByText('Mocked Assessment')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Planning'));
    expect(screen.getByText('Mocked Planning')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Action Pages'));
    expect(screen.getByText('Mocked Action Pages')).toBeInTheDocument();
  });
});
