import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MissionSignatoriesProfileView from './MissionSignatoriesProfileView';

// Mock components for tabs
jest.mock('./TabSections/IntroductionTab', () => () => (
  <div>Introduction Content</div>
));
jest.mock('./TabSections/GovernanceTab', () => () => (
  <div>Governance Content</div>
));
jest.mock('./TabSections/AssessmentTab', () => () => (
  <div>Assessment Content</div>
));
jest.mock('./TabSections/PlanningTab', () => () => <div>Planning Content</div>);
jest.mock('./TabSections/ActionPagesTab', () => () => (
  <div>Action Pages Content</div>
));

describe('MissionSignatoriesProfileView', () => {
  const data = {
    _v_results: {
      planning_titles: [{ Signatory: 'Test Signatory Title' }],
      planning_goals: [],
      planning_climate_action: [],
      planning_climate_sectors: [],
      governance: [{}],
    },
  };

  it('should render the component with data and tabs', () => {
    const { getByText } = render(<MissionSignatoriesProfileView data={data} />);

    expect(getByText('Governance')).toBeInTheDocument();
    expect(getByText('Assessment')).toBeInTheDocument();
    expect(getByText('Planning')).toBeInTheDocument();
    expect(getByText('Action Pages')).toBeInTheDocument();
    expect(getByText('Introduction')).toBeInTheDocument();
  });

  it('should render Signatory title', () => {
    const { getByText } = render(<MissionSignatoriesProfileView data={data} />);
    expect(getByText('Test Signatory Title')).toBeInTheDocument();
  });

  it('should handle missing planning_titles gracefully', () => {
    const data = { _v_results: { governance: [{}] } };
    const { container } = render(<MissionSignatoriesProfileView data={data} />);
    expect(container).toBeInTheDocument();
  });

  it('should handle empty _v_results object gracefully', () => {
    const { getByText } = render(
      <MissionSignatoriesProfileView data={{ _v_results: {} }} />,
    );
    expect(getByText('Introduction')).toBeInTheDocument();
  });

  it('should handle completely missing data prop', () => {
    const { getByText } = render(<MissionSignatoriesProfileView data={{}} />);
    expect(getByText('Planning')).toBeInTheDocument();
    expect(getByText('Introduction')).toBeInTheDocument();
  });

  it('should render all tab labels', () => {
    const { getByText } = render(<MissionSignatoriesProfileView data={{}} />);
    [
      'Introduction',
      'Governance',
      'Assessment',
      'Planning',
      'Action Pages',
    ].forEach((label) => {
      expect(getByText(label)).toBeInTheDocument();
    });
  });

  it('should switch between tabs and display correct content', async () => {
    const { getByText } = render(<MissionSignatoriesProfileView data={data} />);

    fireEvent.click(getByText('Governance'));
    await waitFor(() =>
      expect(getByText('Governance Content')).toBeInTheDocument(),
    );

    fireEvent.click(getByText('Introduction'));
    await waitFor(() =>
      expect(getByText('Introduction Content')).toBeInTheDocument(),
    );

    fireEvent.click(getByText('Assessment'));
    await waitFor(() =>
      expect(getByText('Assessment Content')).toBeInTheDocument(),
    );

    fireEvent.click(getByText('Planning'));
    await waitFor(() =>
      expect(getByText('Planning Content')).toBeInTheDocument(),
    );

    fireEvent.click(getByText('Action Pages'));
    await waitFor(() =>
      expect(getByText('Action Pages Content')).toBeInTheDocument(),
    );
  });
});
