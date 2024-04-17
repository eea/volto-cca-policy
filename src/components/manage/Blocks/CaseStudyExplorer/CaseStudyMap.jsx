import React from 'react';

import { Map, Layer, Layers } from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';

import InfoOverlay from './InfoOverlay';
import FeatureInteraction from './FeatureInteraction';

import { getFeatures } from './utils';

export default function CaseStudyMap(props) {
  const { items, activeItems } = props;
  const [selectedCase, onSelectedCase] = React.useState();

  const features = getFeatures(items);

  const [tileWMSSources] = React.useState([
    new ol.source.TileWMS({
      url: 'https://gisco-services.ec.europa.eu/maps/service',
      params: {
        LAYERS: 'OSMCartoComposite',
        TILED: true,
      },
      serverType: 'geoserver',
      transition: 0,
    }),
  ]);
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
          layerId={tileWMSSources[0]}
          hasCusters={true}
        />
        <FeatureInteraction onFeatureSelect={onSelectedCase} />
        <Layer.Tile source={tileWMSSources[0]} zIndex={0} />
        <Layer.Vector style={clusterStyle} source={clusterSource} zIndex={1} />
      </Layers>
    </Map>
  ) : null;
}

const _cached = {};

function getStyle(size, haveAdaptecca) {
  let style = _cached[size + '_' + haveAdaptecca];

  if (!style) {
    style =
      size === 1
        ? new ol.style.Style({
            image: new ol.style.Circle({
              radius: 5,
              stroke: new ol.style.Stroke({
                color: '#fff',
              }),
              fill: new ol.style.Fill({
                color: haveAdaptecca ? '#00ffff' : '#005c96',
              }),
            }),
          })
        : new ol.style.Style({
            image: new ol.style.Circle({
              radius: 10 + Math.min(Math.floor(size / 3), 10),
              stroke: new ol.style.Stroke({
                color: '#fff',
              }),
              fill: new ol.style.Fill({
                color: haveAdaptecca ? '#318CE7' : '#005c96',
              }),
            }),
            text: new ol.style.Text({
              text: size.toString(),
              fill: new ol.style.Fill({
                color: '#fff',
              }),
            }),
          });
    _cached[size + '_' + haveAdaptecca] = style;
  }
  return style;
}

function clusterStyle(feature) {
  const size = feature.get('features').length;
  const cases = feature
    .get('features')
    .filter((_case) => _case['values_']['origin_adaptecca'] < 20);

  return getStyle(size, cases.length > 0 ? 1 : 0);
}
