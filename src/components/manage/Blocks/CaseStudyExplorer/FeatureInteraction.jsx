import React from 'react';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';

const useStyles = () => {
  const selected = React.useMemo(
    () =>
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 12,
          fill: new ol.style.Fill({
            color: '#005c96',
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 92, 150, 0.9)',
            width: 2,
          }),
        }),
      }),
    [],
  );

  const selectStyle = React.useCallback(
    (feature) => {
      // const color = feature.get('COLOR') || '#eeeeee';
      // selected.getFill().setColor(color);
      const color = feature.values_.features[0].values_['color'] || '#ccc';
      selected.image_.getFill().setColor(color);
      return selected;
    },
    [selected],
  );

  return { selected, selectStyle };
};

function getExtentOfFeatures(features) {
  const points = features.map((f) => f.getGeometry().flatCoordinates);
  const point = new ol.geom.MultiPoint(points);
  return point.getExtent();
}

export default function FeatureInteraction({ onFeatureSelect }) {
  const { map } = useMapContext();
  const { selectStyle } = useStyles();

  React.useEffect(() => {
    if (!map) return;

    const select = new ol.interaction.Select({
      condition: ol.condition.click,
      style: selectStyle,
    });

    select.on('select', function (e) {
      const features = e.target.getFeatures().getArray();

      features.forEach((feature) => {
        const subfeatures = feature.values_.features;
        if (subfeatures.length === 1) {
          const selectedFeature = subfeatures[0].values_;
          const extent = selectedFeature.geometry.extent_;

          onFeatureSelect(selectedFeature);
          const paddedExtent = ol.extent.buffer(extent, 50000);

          map.getView().fit(paddedExtent, { ...map.getSize(), duration: 1000 });
        } else {
          // zoom to extent of cluster points
          const extent = getExtentOfFeatures(subfeatures);

          let extentBuffer =
            (extent[3] - extent[1] + extent[2] - extent[0]) / 4;
          extentBuffer = extentBuffer < 500 ? 500 : extentBuffer;
          const paddedExtent = ol.extent.buffer(extent, extentBuffer);
          map.getView().fit(paddedExtent, { ...map.getSize(), duration: 1000 });
        }
      });

      return null;
    });

    map.addInteraction(select);

    // TODO: does this accumulate?
    map.on('pointermove', (e) => {
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getViewport().style.cursor = hit ? 'pointer' : '';
    });

    return () => map.removeInteraction(select);
  }, [map, selectStyle, onFeatureSelect]);

  return null;
}
