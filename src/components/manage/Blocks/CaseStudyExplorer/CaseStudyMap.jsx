import React from 'react';

import { Map, Layer, Layers } from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';

import InfoOverlay from './InfoOverlay';
import FeatureInteraction from './FeatureInteraction';

import { getFeatures } from './utils';

const styleCache = {};

export default function CaseStudyMap(props) {
  const { items, activeItems } = props;
  const [selectedCase, onSelectedCase] = React.useState();

  const features = getFeatures(items); //console.log('Features list', features);

  const [tileWMSSources, setTileWMSSources] = React.useState([]);
  const [pointsSource] = React.useState(
    new ol.source.Vector({
      features,
    }),
  );

  const [clusterSource] = React.useState(
    new ol.source.Cluster({
      distance: 50,
      source: pointsSource,
    }),
  );

  React.useEffect(() => {
    if (activeItems) {
      pointsSource.clear();
      pointsSource.addFeatures(getFeatures(activeItems));
    }
  }, [activeItems, pointsSource]);

  React.useEffect(() => {
    setTileWMSSources([
      new ol.source.TileWMS({
        url: 'https://gisco-services.ec.europa.eu/maps/service',
        params: {
          LAYERS: 'OSMBlossomComposite',
          TILED: true,
        },
        serverType: 'geoserver',
        transition: 0,
      }),
    ]);
  }, []);

  return features.length > 0 ? (
    <Map
      view={{
        center: ol.proj.fromLonLat([20, 50]),
        showFullExtent: true,
        zoom: 4,
      }}
      pixelRatio={1}
      controls={ol.control.defaults({ attribution: false })}
    >
      <Layers>
        <InfoOverlay
          selectedFeature={selectedCase}
          onFeatureSelect={onSelectedCase}
          layerId={tileWMSSources?.[0]}
        />
        <FeatureInteraction onFeatureSelect={onSelectedCase} />
        <Layer.Tile source={tileWMSSources[0]} zIndex={0} />
        <Layer.Vector style={clusterStyle} source={clusterSource} zIndex={1} />
      </Layers>
    </Map>
  ) : null;
}

function clusterStyle(feature) {
  const size = feature.get('features').length;
  //const size = feature.get('casePoints').length;
  let style = styleCache[size];

  if (!style) {
    style = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 10 + Math.min(Math.floor(size / 3), 10),
        stroke: new ol.style.Stroke({
          color: '#fff',
        }),
        fill: new ol.style.Fill({
          color: '#3399CC',
        }),
      }),
      text: new ol.style.Text({
        text: size.toString(),
        fill: new ol.style.Fill({
          color: '#fff',
        }),
      }),
    });
    styleCache[size] = style;
  }

  return size === 1
    ? new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: '#fff',
          }),
          fill: new ol.style.Fill({
            color: '#000000',
          }),
        }),
      })
    : style;
}
