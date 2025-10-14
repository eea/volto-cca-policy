import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import StatisticSection from './StatisticSection';

describe('StatisticSection', () => {
  const mockStatistics = [
    { label: 'Population year', value: 2023 },
    { label: 'Population size', value: 362.133 },
  ];

  it('renders all statistic values and labels', () => {
    const { getByText } = render(
      <StatisticSection statistic={mockStatistics} />,
    );

    expect(getByText('2023')).toBeInTheDocument();
    expect(getByText('362.133')).toBeInTheDocument();

    expect(getByText('Population year')).toBeInTheDocument();
    expect(getByText('Population size')).toBeInTheDocument();
  });
});
