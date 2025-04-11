import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import MissionSignatoriesProfileView from './MissionSignatoriesProfileView';

describe('MissionSignatoriesProfileView', () => {
  it('should render the component with data', () => {
    const data = {
      _v_results: [
        {
          Signatory: 'Test Signatory',
          Describe: 'Test description',
          Provide: 'Test evidence',
        },
      ],
    };

    const { getByText } = render(<MissionSignatoriesProfileView data={data} />);

    expect(getByText('Governance')).toBeInTheDocument();
    expect(getByText('Assessment')).toBeInTheDocument();
    expect(getByText('Planning')).toBeInTheDocument();
    expect(getByText('Action Pages')).toBeInTheDocument();
  });

  it('should render tabs and switch content', () => {
    const data = {
      _v_results: [
        {
          Signatory: 'Test Signatory',
        },
      ],
    };

    const { getByText } = render(<MissionSignatoriesProfileView data={data} />);
    const governanceTab = getByText('Governance');
    fireEvent.click(governanceTab);
    expect(
      getByText('Opportunities and benefits of climate action'),
    ).toBeInTheDocument();
  });
});
