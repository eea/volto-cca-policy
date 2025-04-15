import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import GovernanceTab from './GovernanceTab';

describe('GovernanceTab', () => {
  const mockResult = {
    Describe_Title: 'Opportunities and benefits of climate action',
    Provide_Title: 'Further details and evidence',
  };

  it('renders the governance tab correctly', () => {
    const { getByText } = render(<GovernanceTab result={mockResult} />);

    expect(
      getByText('Opportunities and benefits of climate action'),
    ).toBeInTheDocument();
    expect(getByText('Further details and evidence')).toBeInTheDocument();
  });
});
