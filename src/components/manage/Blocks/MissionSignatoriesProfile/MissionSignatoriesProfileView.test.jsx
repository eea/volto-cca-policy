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
  it('should render the component with data', () => {
    const data = {
      _v_results: [
        {
          Describe: 'Test description',
          Provide: 'Test evidence',
          planning_titles: [{ Signatory: 'Test Signatory Title' }],
        },
      ],
    };

    const { getByText } = render(<MissionSignatoriesProfileView data={data} />);

    // Assert static text
    expect(getByText('Governance')).toBeInTheDocument();
    expect(getByText('Assessment')).toBeInTheDocument();
    expect(getByText('Planning')).toBeInTheDocument();
    expect(getByText('Action Pages')).toBeInTheDocument();
  });

  it('should render tabs and switch content correctly', async () => {
    const data = {
      _v_results: [
        {
          planning_titles: [{ Signatory: 'Test Signatory Title' }],
        },
      ],
    };

    const { getByText } = render(<MissionSignatoriesProfileView data={data} />);

    // Click on the 'Governance' tab
    const governanceTab = getByText('Governance');
    fireEvent.click(governanceTab);

    // Wait for the content to change
    await waitFor(() =>
      expect(getByText('Governance Content')).toBeInTheDocument(),
    );

    // Click on the 'Introduction' tab
    const introductionTab = getByText('Introduction');
    fireEvent.click(introductionTab);

    // Wait for the content to change
    await waitFor(() =>
      expect(getByText('Introduction Content')).toBeInTheDocument(),
    );

    // Click on the 'Assessment' tab
    const assessmentTab = getByText('Assessment');
    fireEvent.click(assessmentTab);

    // Wait for the content to change
    await waitFor(() =>
      expect(getByText('Assessment Content')).toBeInTheDocument(),
    );
  });

  it('should handle missing data gracefully', () => {
    const { getByText } = render(<MissionSignatoriesProfileView data={{}} />);

    // Test if the component gracefully handles missing or incomplete data
    expect(getByText('Governance')).toBeInTheDocument();
    expect(getByText('Assessment')).toBeInTheDocument();
    expect(getByText('Planning')).toBeInTheDocument();
    expect(getByText('Action Pages')).toBeInTheDocument();

    // Check that no specific data from `result` breaks the rendering
    expect(getByText('Introduction')).toBeInTheDocument();
    expect(getByText('Governance')).toBeInTheDocument();
  });
});
