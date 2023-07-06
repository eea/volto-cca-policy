import React from 'react';
import superagent from 'superagent';

const url = '/en/@@countries-heat-index-json';

export function useCountriesMetadata(url) {
  console.log('REQ URL', url);
  const [countries_metadata, setCountriesMetadata] = React.useState([]);

  React.useEffect(() => {
    superagent
      .get(url)
      .set('accept', 'json')
      .then((resp) => {
        console.log('RESPONSE METADATA', resp);
        const res = JSON.parse(resp.text);
        setCountriesMetadata(res);
      });
  }, []);

  return countries_metadata;
}
