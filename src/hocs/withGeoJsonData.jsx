import React from 'react';
import geoJsonUrl from '@eeacms/volto-cca-policy/cntrg.data';

const projection = 'EPSG:4326';
const projectionFlat = 'EPSG:3857';

const fetchGeoFeatures = async () => {
  const response = await fetch(geoJsonUrl);
  return response.json();
};

export const withGeoJsonData = (showFlatMap) => (WrappedComponent) => {
  function Wrapper(props) {
    const [geofeatures, setGeofeatures] = React.useState();
    React.useEffect(() => {
      fetchGeoFeatures().then(setGeofeatures);
    }, []);

    return geofeatures ? (
      <WrappedComponent
        {...props}
        geofeatures={geofeatures}
        projection={showFlatMap ? projectionFlat : projection}
      />
    ) : null;
  }

  return Wrapper;
};
