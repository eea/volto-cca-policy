import React from 'react';
import superagent from 'superagent';

export function useCountriesMetadata(url) {
  const [countries_metadata, setCountriesMetadata] = React.useState([]);

  React.useEffect(() => {
    superagent
      .get(url)
      .set('accept', 'json')
      .then((resp) => {
        const res = JSON.parse(resp.text);
        setCountriesMetadata(res);
      });
  }, [url]);

  return countries_metadata;
}
