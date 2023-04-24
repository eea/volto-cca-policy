import React from 'react';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';

const useStyles = () => {
  const selected = React.useMemo(
    () =>
      new ol.style.Style({
        fill: new ol.style.Fill({
          color: '#cccccc',
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255, 0, 0, 0.7)',
          width: 2,
        }),
      }),
    [],
  );

  const selectStyle = React.useCallback(
    (feature) => {
      const color = feature.get('COLOR') || '#eeeeee';
      selected.getFill().setColor(color);
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
          // console.log('selected', selectedFeature);
          onFeatureSelect(selectedFeature);
        } else {
          const extent = getExtentOfFeatures(subfeatures);
          const paddedExtent = ol.extent.buffer(extent, -50);
          map.getView().fit(paddedExtent, map.getSize());
        }
      });

      return null;

      // if (!features.length) onFeatureSelect(null);
    });

    map.addInteraction(select);

    map.on('pointermove', (e) => {
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getViewport().style.cursor = hit ? 'pointer' : '';
    });

    return () => map.removeInteraction(select);
  }, [map, selectStyle, onFeatureSelect]);

  return null;
}
