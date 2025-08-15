import { getBaseUrl } from '@eeacms/volto-cca-policy/utils';
import React from 'react';
import { compose } from 'redux';
import { clientOnly } from '@eeacms/volto-cca-policy/helpers';
import { useHistory } from 'react-router-dom';

import { withOpenLayers } from '@eeacms/volto-openlayers-map';
import { Map, Layer, Layers, Controls } from '@eeacms/volto-openlayers-map/api';
import {
  euCountryNames,
  tooltipStyle,
  getImageUrl,
} from '@eeacms/volto-cca-policy/helpers/country_map/countryMap';
import { withGeoJsonData } from '@eeacms/volto-cca-policy/helpers/country_map/hocs';

import withResponsiveContainer from '../withResponsiveContainer';
import withVisibilitySensor from '../withVisibilitySensor';
import { makeStyles } from './mapstyle';
import { Interactions } from './Interactions';

import './styles.less';

// const url =
//   'https://raw.githubusercontent.com/eurostat/Nuts2json/master/pub/v2/2021/4326/20M/cntrg.json';

const CountryMapObservatoryView = (props) => {
  const { geofeatures, projection, ol } = props;

  const history = useHistory();
  const styles = React.useMemo(() => makeStyles(ol), [ol]);
  const tooltipRef = React.useRef();
  const [tileWMSSources, setTileWMSSources] = React.useState();
  const [overlaySource, setOverlaySource] = React.useState();
  const [euCountriesSource, setEuCountriessource] = React.useState();

  React.useEffect(() => {
    setOverlaySource(new ol.source.Vector());

    const features = new ol.format.GeoJSON().readFeatures(geofeatures);
    const updateEuCountryNames = euCountryNames
      .map((countryName) => {
        if ('Turkey' === countryName) {
          countryName = 'Türkiye';
        }
        return countryName;
      })
      .filter((countryName) => countryName !== 'United Kingdom');

    const filtered = features.filter((f) =>
      updateEuCountryNames.includes(f.get('na')),
    );
    filtered.forEach((feature) => {
      const img = new Image();
      if ('Türkiye' === feature.values_.na) {
        feature.values_.na = 'Turkey';
      }
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
  }, [geofeatures, ol]);

  const baseUrl = getBaseUrl(props);

  const onFeatureClick = React.useCallback(
    (feature) => {
      let country = feature.get('na');
      if ('Türkiye' === country) {
        country = 'Turkey';
      }
      history.push(`${baseUrl}/${country.toLowerCase()}`);
    },
    [baseUrl, history],
  );

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
  withGeoJsonData(),
  withResponsiveContainer('countryMapObservatory'),
  withVisibilitySensor(),
  withOpenLayers,
)(CountryMapObservatoryView);
