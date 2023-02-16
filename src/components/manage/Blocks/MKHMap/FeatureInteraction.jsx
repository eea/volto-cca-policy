import React from 'react';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';

export default function FeatureInteraction({ onFeatureSelect }) {
  const { map } = useMapContext();

  const selected = React.useMemo(
    () =>
      new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 0, 0, 0.7)',
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
        // const country_code = feature.get('CNTR_CODE');
        // const nuts_id = feature.get('NUTS_ID');
        // const nuts_name = feature.get('NUTS_NAME');
        // const level_code = feature.get('LEVEL_CODE');
        // console.log(feature.values_);
        // console.log(e, e.target);
        onFeatureSelect(feature.values_);
      });
      // const clicked =
      // console.log({
      //   target: e.target,
      //   features: e.target.getFeatures(),
      //   event: e,
      // });
    });
    return () => map.removeInteraction(select);
  }, [map, selectStyle, onFeatureSelect]);

  return null;
}
