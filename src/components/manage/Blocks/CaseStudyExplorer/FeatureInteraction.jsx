import React from 'react';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';
import FeatureDisplay from './FeatureDisplay';

const circleDistanceMultiplier = 1;
const circleFootSeparation = 28;
const circleStartAngle = Math.PI / 2;

const useStyles = () => {
  const selectStyle = React.useCallback((feature) => {
    const selected = new ol.style.Style({
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
    });
    // const color = feature.get('COLOR') || '#eeeeee';
    // selected.getFill().setColor(color);
    const color = feature.values_.features[0].values_['color'] || '#ccc';
    selected.image_.getFill().setColor(color);
    return selected;
  }, []);

  return { selectStyle };
};

function getExtentOfFeatures(features) {
  const points = features.map((f) => f.getGeometry().flatCoordinates);
  const point = new ol.geom.MultiPoint(points);
  return point.getExtent();
}

function generatePointsCircle(count, clusterCenter, resolution) {
  const circumference =
    circleDistanceMultiplier * circleFootSeparation * (2 + count);
  let legLength = circumference / (Math.PI * 2); //radius from circumference
  const angleStep = (Math.PI * 2) / count;
  const res = [];
  let angle;

  legLength = Math.max(legLength, 35) * resolution; // Minimum distance to get outside the cluster icon.

  for (let i = 0; i < count; ++i) {
    // Clockwise, like spiral.
    angle = circleStartAngle + i * angleStep;
    res.push([
      clusterCenter[0] + legLength * Math.cos(angle),
      clusterCenter[1] + legLength * Math.sin(angle),
    ]);
  }

  return res;
}

export default function FeatureInteraction({
  selectedFeature,
  onFeatureSelect,
  mapCenter,
}) {
  const { map } = useMapContext();
  const { selectStyle } = useStyles();

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);

  React.useEffect(() => {
    if (!map) return;

    const select = new ol.interaction.Select({
      condition: ol.condition.click,
      style: selectStyle,
    });

    select.on('select', function (e) {
      const features = e.target.getFeatures().getArray();
      // console.log('click', features);

      features.forEach((feature) => {
        const subfeatures = feature.values_.features;
        if (subfeatures.length === 1) {
          const selectedFeature = subfeatures[0].values_;
          const extent = selectedFeature.geometry.extent_;

          onFeatureSelect(selectedFeature);
          const paddedExtent = ol.extent.buffer(extent, 50000);

          const view = map.getView();
          view.fit(paddedExtent, { ...map.getSize(), duration: 1000 });
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
    });

    function handleClick(evt) {
      if (evt.originalEvent.target.tagName === 'A') return;
      if (selectedFeature) {
        onFeatureSelect(null);

        const view = map.getView();
        view.animate({
          ...mapCenter,
          duration: 1000,
        });
      }
    }

    function handlePointerMove(e) {
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getViewport().style.cursor = hit ? 'pointer' : '';
    }

    map.addInteraction(select);
    map.on('click', handleClick);
    map.on('pointermove', handlePointerMove);

    return () => {
      map.removeInteraction(select);
      map.un('click', handleClick);
      map.un('pointermove', handlePointerMove);
    };
  }, [map, selectStyle, onFeatureSelect, selectedFeature, mapCenter]);

  return isClient ? (
    <div
      id="popup-overlay"
      style={{
        position: 'absolute',
        bottom: '30px',
        right: '30px',
        zIndex: 1,
        visibility: selectedFeature ? 'visible' : 'hidden',
      }}
    >
      {selectedFeature ? <FeatureDisplay feature={selectedFeature} /> : null}
    </div>
  ) : null;
}
