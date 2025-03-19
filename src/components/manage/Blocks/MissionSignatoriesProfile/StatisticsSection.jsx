import React from 'react';

const StatisticsSection = ({ statistics }) => {
  return (
    <div className="ui small two statistics center">
      {statistics.map((stat, index) => (
        <div key={index} className="ui statistic">
          <div className="value slate text-center secondary">
            <p>{stat.value}</p>
          </div>
          <div className="label slate text-center primary">
            <p>{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsSection;
