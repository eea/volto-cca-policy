import React from 'react';
import geoJsonUrl from '@eeacms/volto-cca-policy/cntrg.data';

const projection = 'EPSG:4326';

export const withGeoJsonData = (WrappedComponent) => {
  function Wrapper(props) {
    const [geofeatures, setGeofeatures] = React.useState();
    React.useEffect(() => {
      async function handler() {
        const resp = await fetch(geoJsonUrl);
        const features = await resp.json();
        setGeofeatures(features);
      }
      handler();
    }, []);

    return geofeatures ? (
      <WrappedComponent
        {...props}
        geofeatures={geofeatures}
        projection={projection}
      />
    ) : null;
  }

  return Wrapper;
};
