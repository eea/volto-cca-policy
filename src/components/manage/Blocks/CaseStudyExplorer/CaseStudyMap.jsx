import React from 'react';

import { Map, Layer, Layers } from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';

import FeatureInteraction from './FeatureInteraction';

import { getFeatures } from './utils';

export default function CaseStudyMap(props) {
  const { items, activeItems } = props;
  const [selectedCase, onSelectedCase] = React.useState();

  const features = React.useMemo(() => getFeatures(items), [items]);

  const [tileWMSSources] = React.useState([
    new ol.source.TileWMS({
      // see https://gisco-services.ec.europa.eu/maps/demo/ for more layers
      url: 'https://gisco-services.ec.europa.eu/maps/service',
      params: {
        LAYERS: 'OSMCartoComposite',
        TILED: true,
      },
      serverType: 'geoserver',
      transition: 0,
    }),
  ]);

  const mapCenter = React.useMemo(
    () => ({
      center: ol.proj.fromLonLat([20, 50]),
      showFullExtent: true,
      zoom: 4,
    }),
    [],
  );

  return features.length > 0 ? (
    <Map
      view={mapCenter}
      pixelRatio={1}
      controls={ol.control.defaults({ attribution: false })}
    >
      <Layers>
        <FeatureInteraction
          onFeatureSelect={onSelectedCase}
          selectedFeature={selectedCase}
          mapCenter={mapCenter}
          features={features}
          activeItems={activeItems}
        />
        <Layer.Tile source={tileWMSSources[0]} zIndex={0} />
      </Layers>
    </Map>
  ) : null;
}
