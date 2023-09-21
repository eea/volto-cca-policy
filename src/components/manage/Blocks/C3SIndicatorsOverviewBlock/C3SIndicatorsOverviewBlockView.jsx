import React from 'react';
import axios from 'axios';

export default function C3SIndicatorsOverviewBlockView(props) {
  const [pageDescription, setPageDescription] = React.useState('');
  const [indicators, setIndicators] = React.useState([]);

  const category = props.data.category;

  const getIndicatorsData = () => {
    const url =
      '/++api++/en/knowledge/european-climate-data-explorer/' +
      category +
      '/@c3s_indicators_overview';

    axios
      .get(url)
      .then((response) => {
        setPageDescription(response.data.c3s_indicators_overview.description);
        setIndicators(response.data.c3s_indicators_overview.items);
      })
      .catch((error) => {
        // console.error(error);
      });
  };

  React.useEffect(() => {
    getIndicatorsData();
  });

  return (
    <div className="block c3sindicators-overview-block">
      <p>{pageDescription}</p>
      {indicators ? (
        <ul>
          {indicators.map((item, index) => (
            <li key={index}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}