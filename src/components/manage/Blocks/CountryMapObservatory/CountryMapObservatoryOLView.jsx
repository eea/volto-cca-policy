import { getBaseUrl } from '@eeacms/volto-cca-policy/utils';
import React from 'react';
import { compose } from 'redux';
import { clientOnly } from '@eeacms/volto-cca-policy/helpers';
import { useHistory } from 'react-router-dom';

import { Map, Layer, Layers, Controls } from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import { euCountryNames } from '@eeacms/volto-cca-policy/helpers/country_map/countryMap';
import { withGeoJsonData } from '@eeacms/volto-cca-policy/helpers/country_map/hocs';

import withResponsiveContainer from '../withResponsiveContainer';
import withVisibilitySensor from '../withVisibilitySensor';
import { makeStyles } from './mapstyle';
import { Interactions } from './Interactions';

import './styles.less';

// const url =
//   'https://raw.githubusercontent.com/eurostat/Nuts2json/master/pub/v2/2021/4326/20M/cntrg.json';

const tooltipStyle = {
  position: 'absolute',
  zIndex: 2,
  display: 'inline-block',
  visibility: 'hidden',
  top: '0px',
  left: '0px',
  backgroundColor: 'black',
  color: 'white',
  padding: '0.3em',
  cursor: 'pointer',
  fontSize: '10px',
};

function getImageUrl(feature) {
  let id = feature.get('id').toLowerCase();
  if (id === 'el') {
    id = 'gr'; // fix Greece
  }
  if (id === 'uk') {
    id = 'gb'; // fix Greece
  }
  return 'https://flagcdn.com/w320/' + id + '.png';
}

const CountryMapObservatoryView = (props) => {
  const { geofeatures, projection } = props;

  const history = useHistory();
  const styles = React.useMemo(makeStyles, []);
  const tooltipRef = React.useRef();
  const [tileWMSSources, setTileWMSSources] = React.useState();
  const [overlaySource, setOverlaySource] = React.useState();
  const [euCountriesSource, setEuCountriessource] = React.useState();

  React.useEffect(() => {
    setOverlaySource(new ol.source.Vector());

    const features = new ol.format.GeoJSON().readFeatures(geofeatures);
    const filtered = features.filter((f) =>
      euCountryNames.includes(f.get('na')),
    );

    filtered.forEach((feature) => {
      const img = new Image();
      img.onload = function () {
        feature.set('flag', img);
      };
      img.src = getImageUrl(feature);
    });

    const euSource = new ol.source.Vector({ features: filtered });
    setEuCountriessource(euSource);

    setTileWMSSources([
      new ol.source.TileWMS({
        url: 'https://gisco-services.ec.europa.eu/maps/service',
        params: {
          // LAYERS: 'OSMBlossomComposite', OSMCartoComposite, OSMPositronComposite
          LAYERS: 'OSMBrightBackground',
          TILED: true,
        },
        serverType: 'geoserver',
        transition: 0,
      }),
    ]);
  }, [geofeatures]);

  const baseUrl = getBaseUrl(props);

  const onFeatureClick = React.useCallback(
    (feature) => {
      const country = feature.get('na');
      history.push(`${baseUrl}/${country.toLowerCase()}`);
    },
    [baseUrl, history],
  );
  // console.log(geofeatures, projection, euCountriesSource, overlaySource);

  return tileWMSSources ? (
    <Map
      view={{
        center: ol.proj.fromLonLat([10, 50], projection),
        projection,
        showFullExtent: true,
        zoom: 4,
      }}
      pixelRatio={1}
    >
      <div ref={tooltipRef} style={tooltipStyle} className="map-tooltip"></div>
      <Controls attribution={false} />
      <Layers>
        {props.mode !== 'edit' && (
          <Interactions
            overlaySource={overlaySource}
            tooltipRef={tooltipRef}
            onFeatureClick={onFeatureClick}
          />
        )}
        <Layer.Vector
          source={overlaySource}
          zIndex={3}
          style={styles.overlayStyle}
        />
        <Layer.Vector
          source={euCountriesSource}
          zIndex={2}
          style={styles.eucountriesStyle}
        />
        <Layer.Tile source={tileWMSSources[0]} zIndex={0} />
      </Layers>
    </Map>
  ) : null;
};

export default compose(
  clientOnly,
  withGeoJsonData,
  withResponsiveContainer('countryMapObservatory'),
  withVisibilitySensor(),
)(CountryMapObservatoryView);
