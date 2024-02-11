import React from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { clientOnly } from '@eeacms/volto-cca-policy/helpers';
import withResponsiveContainer from '../withResponsiveContainer.js';

import { Map, Layer, Layers, Controls } from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';
import { euCountryNames } from '@eeacms/volto-cca-policy/helpers/country_map/countryMap.js';

import './styles.less';
const url =
  'https://raw.githubusercontent.com/eurostat/Nuts2json/master/pub/v2/2021/4326/20M/cntrg.json';

let highlight = null; // easy global

const makeStyles = () => {
  const fill = new ol.style.Fill();
  const stroke = new ol.style.Stroke({
    // color: 'rgba(255,255,255,0.8)',
    color: '#A0A0A0',
    width: 2,
  });

  const overlayStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#A0A0A0',
      width: 2,
    }),
    fill: new ol.style.Fill({
      color: 'rgb(1, 112, 183, 0.8)',
    }),
    renderer: function (pixelCoordinates, state) {
      const context = state.context;
      const geometry = state.geometry.clone();
      geometry.setCoordinates(pixelCoordinates);
      const extent = geometry.getExtent();
      const width = ol.extent.getWidth(extent);
      const height = ol.extent.getHeight(extent);
      const flag = state.feature.get('flag');
      if (!flag || height < 1 || width < 1) {
        return;
      }

      // Stitch out country shape from the blue canvas
      context.save();
      const renderContext = ol.render.toContext(context, {
        pixelRatio: 1,
      });
      renderContext.setFillStrokeStyle(fill, stroke);
      renderContext.drawGeometry(geometry);
      context.clip();

      // Fill transparent country with the flag image
      const bottomLeft = ol.extent.getBottomLeft(extent);
      const left = bottomLeft[0];
      const bottom = bottomLeft[1];
      context.drawImage(flag, left, bottom, width, height);
      context.restore();
    },
  });

  const emptyStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgb(1, 1, 1, 0)',
      width: 1,
    }),
    fill: new ol.style.Fill({
      color: 'rgb(1, 1, 1, 0)',
    }),
  });

  const eucountriesStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#A0A0A0',
      width: 1,
    }),
    fill: new ol.style.Fill({
      color: 'rgb(1, 112, 183, 0.3)',
    }),
  });

  return { eucountriesStyle, emptyStyle, overlayStyle };
};

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

const Interactions = ({ overlaySource, tooltipRef, baseUrl }) => {
  const history = useHistory();
  const map = useMapContext().map;

  React.useEffect(() => {
    if (!map) return;
    map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return;
      }
      const pixel = map.getEventPixel(evt.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });
      if (feature !== highlight) {
        if (highlight) {
          try {
            map.getTargetElement().style.cursor = '';
            overlaySource.removeFeature(highlight);
          } catch {}
        }
        if (feature && euCountryNames.includes(feature.get('na'))) {
          overlaySource.addFeature(feature);
          map.getTargetElement().style.cursor = 'pointer';
          const node = tooltipRef.current;
          if (node) {
            node.innerHTML = feature.get('na');
            node.style.visibility = 'visible';
            node.style.left = `${Math.floor(evt.originalEvent.layerX)}px`;
            node.style.top = `${Math.floor(evt.originalEvent.layerY)}px`;
          }
          highlight = feature;
        }
      }
    });
    map.on('click', function (evt) {
      if (evt.dragging) {
        return;
      }
      const pixel = map.getEventPixel(evt.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });
      if (feature) {
        const country = feature.get('na');
        history.push(`${baseUrl}/${country.toLowerCase()}`);
      }
    });
  }, [map, overlaySource, tooltipRef, baseUrl, history]);
  return null;
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
