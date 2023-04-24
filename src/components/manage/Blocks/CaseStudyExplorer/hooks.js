import React from 'react';
import superagent from 'superagent';

const cases_url = '@@case-studies-map.arcgis.json';

export function useCases(url) {
  const [cases, setCases] = React.useState([]);

  React.useEffect(() => {
    superagent
      .get(cases_url)
      .set('accept', 'json')
      .then((resp) => {
        const res = JSON.parse(resp.text);
        setCases(res.features);
      });
  }, []);

  return cases;
}
