import React from 'react';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';

export default function FeatureInteraction({ onFeatureSelect }) {
  const { map } = useMapContext();

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

  React.useEffect(() => {
    if (!map) return;
    const select = new ol.interaction.Select({
      condition: ol.condition.click,
      style: selectStyle,
    });
    map.addInteraction(select);
    select.on('select', function (e) {
      const features = e.target.getFeatures().getArray();
      features.forEach((feature) => {
        //onFeatureSelect(feature.values_);
        if (feature.values_.features.length === 1) {
          onFeatureSelect(feature.values_.features[0].values_);
        }
      });
      // if (!features.length) onFeatureSelect(null);
    });

    map.on('pointermove', (e) => {
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getViewport().style.cursor = hit ? 'pointer' : '';
    });

    return () => map.removeInteraction(select);
  }, [map, selectStyle, onFeatureSelect]);

  return null;
}
