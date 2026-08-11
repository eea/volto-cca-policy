import { Statistic } from 'semantic-ui-react';

const StatisticSection = ({ statistic }) => {
  return (
    <Statistic.Group widths="two" size="small">
      {statistic.map((stat, index) => (
        <Statistic key={index}>
          <Statistic.Value>{stat.value}</Statistic.Value>
          <Statistic.Label>{stat.label}</Statistic.Label>
        </Statistic>
      ))}
    </Statistic.Group>
  );
};

export default StatisticSection;
