import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import GovernanceTab from './GovernanceTab';

describe('GovernanceTab', () => {
  const mockResult = {
    Title: 'Governance Section',
    Introduction: 'This is an introduction to governance.',
    Describe_Title: 'Opportunities and benefits of climate action',
  };

  it('renders the governance tab correctly with all sections', () => {
    render(<GovernanceTab result={mockResult} />);

    expect(screen.getByText('Governance Section')).toBeInTheDocument();
    expect(
      screen.getByText('This is an introduction to governance.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Opportunities and benefits of climate action'),
    ).toBeInTheDocument();
  });
});
