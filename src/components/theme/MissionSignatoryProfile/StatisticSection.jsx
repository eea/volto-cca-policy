import {
  Statistic,
  StatisticValue,
  StatisticLabel,
  StatisticGroup,
} from 'semantic-ui-react';

const StatisticSection = ({ statistic }) => {
  return (
    <StatisticGroup widths="two" size="small">
      {statistic.map((stat, index) => (
        <Statistic key={index}>
          <StatisticValue>{stat.value}</StatisticValue>
          <StatisticLabel>{stat.label}</StatisticLabel>
        </Statistic>
      ))}
    </StatisticGroup>
  );
};

export default StatisticSection;
