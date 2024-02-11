import React from 'react';
import { compose } from 'redux';
import { clientOnly } from '@eeacms/volto-cca-policy/helpers';
import withResponsiveContainer from '../withResponsiveContainer';

import { Map, Layer, Layers, Controls } from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import { euCountryNames } from '@eeacms/volto-cca-policy/helpers/country_map/countryMap';
import { makeStyles } from './mapstyle';
import { Interactions } from './Interactions';

import './styles.less';
const url =
  'https://raw.githubusercontent.com/eurostat/Nuts2json/master/pub/v2/2021/4326/20M/cntrg.json';

const tooltipStyle = {
  position: 'relative',
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

const CountryMapObservatoryView = (props) => {
  const styles = React.useMemo(makeStyles, []);
  const tooltipRef = React.useRef();
  const [tileWMSSources, setTileWMSSources] = React.useState();
  const [rectsSource, setRectsSource] = React.useState();
  const [overlaySource, setOverlaySource] = React.useState();
  const [euCountriesSource, setEuCountriessource] = React.useState();

  React.useEffect(() => {
    setOverlaySource(new ol.source.Vector());
    const euSource = new ol.source.Vector();
    setEuCountriessource(euSource);
    const vs = new ol.source.Vector({
      url,
      format: new ol.format.GeoJSON(),
    });
    vs.on('addfeature', function (evt) {
      const { feature } = evt;
      const img = new Image();
      img.onload = function () {
        feature.set('flag', img);
      };
      img.src =
        'https://flagcdn.com/w320/' + feature.get('id').toLowerCase() + '.png';
    });
    vs.on('featuresloadend', (ev) => {
      const filtered = ev.features.filter((f) =>
        euCountryNames.includes(f.get('na')),
      );
      euSource.addFeatures(filtered);
    });
    setRectsSource(vs);

    setTileWMSSources([
      new ol.source.TileWMS({
        url: 'https://gisco-services.ec.europa.eu/maps/service',
        params: {
          // LAYERS: 'OSMBlossomComposite', OSMCartoComposite, OSMPositronComposite
          LAYERS: 'OSMPositronComposite',
          TILED: true,
        },
        serverType: 'geoserver',
        transition: 0,
      }),
    ]);
  }, []);

  return rectsSource ? (
    <Map
      view={{
        center: ol.proj.fromLonLat([10, 52]),
        showFullExtent: true,
        zoom: 3.8,
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
            baseUrl={props.path || props.location?.pathname || ''}
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
        <Layer.Vector
          source={rectsSource}
          zIndex={1}
          style={styles.emptyStyle}
        />
        <Layer.Tile source={tileWMSSources[0]} zIndex={0} />
      </Layers>
    </Map>
  ) : null;
};

export default compose(
  clientOnly,
  withResponsiveContainer('countryMapObservatory'),
)(CountryMapObservatoryView);
