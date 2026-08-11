import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import NoDataReported from './NoDataReported';

describe('NoDataReported', () => {
  it('renders the provided label inside Tab.Pane', () => {
    const testLabel = 'No data available';
    const { getByText } = render(<NoDataReported label={testLabel} />);

    expect(getByText(testLabel)).toBeInTheDocument();
  });
});
