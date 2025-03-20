import React from 'react';

import {
  StatisticValue,
  StatisticLabel,
  StatisticGroup,
  Statistic,
} from 'semantic-ui-react';

const StatisticsSection = ({ statistics }) => {
  return (
    <>
      <StatisticGroup widths="two" size="small">
        {statistics.map((stat, index) => (
          <Statistic key={index}>
            <StatisticValue>{stat.value}</StatisticValue>
            <StatisticLabel>{stat.label}</StatisticLabel>
          </Statistic>
        ))}
      </StatisticGroup>
    </>
  );
};

export default StatisticsSection;
