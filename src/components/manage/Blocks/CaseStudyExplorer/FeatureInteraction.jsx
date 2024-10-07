import React from 'react';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';
import FeatureDisplay from './FeatureDisplay';
import { getFeatures } from './utils';
import {
  clusterStyle,
  useStyles,
  getExtentOfFeatures,
  setClicked,
} from './useInteractiveStyles';

export default function FeatureInteraction({
  selectedFeature,
  onFeatureSelect,
  mapCenter,
  features,
  activeItems,
}) {
  const { map } = useMapContext();
  const [clusterLayer, setClusterLayer] = React.useState();
  const [clusterCirclesLayer, setClusterCirclesLayer] = React.useState();
  const { selectStyle, clusterCircleStyle } = useStyles();

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

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);

  // form the clusters layer
  React.useEffect(() => {
    if (!map) return;

    // Layer displaying the expanded view of overlapping cluster members.
    const clusterCirclesLayer = new ol.layer.Vector({
      source: clusterSource,
      style: clusterCircleStyle,
    });
    setClusterCirclesLayer(clusterCirclesLayer);
    map.addLayer(clusterCirclesLayer);

    const clusterLayer = new ol.layer.Vector({
      source: clusterSource,
      style: clusterStyle,
    });
    setClusterLayer(clusterLayer);
    map.addLayer(clusterLayer);
  }, [map, clusterSource, clusterCircleStyle]);

  React.useEffect(() => {
    if (!(map && clusterLayer)) return;

    const select = new ol.interaction.Select({
      condition: ol.condition.click,
      style: selectStyle,
    });

    select.on('select', function (e) {
      const features = e.target.getFeatures().getArray();
      // const pixel = e.mapBrowserEvent.pixel;
      // clusterLayer.getFeatures(pixel).then((fs) => {
      //   console.log('fs', { fs, features });
      // });

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

          const view = map.getView();
          const resolution = view.getResolution();
          const extent = getExtentOfFeatures(subfeatures);

          if (
            view.getZoom() === view.getMaxZoom() ||
            (ol.extent.getWidth(extent) < resolution &&
              ol.extent.getHeight(extent) < resolution)
          ) {
            // console.log('set cluster circles style', features[0]);
            setClicked(features[0], resolution);
            clusterCirclesLayer.setStyle(clusterCircleStyle);
          } else {
            let extentBuffer =
              (extent[3] - extent[1] + extent[2] - extent[0]) / 4;
            extentBuffer = extentBuffer < 500 ? 500 : extentBuffer;
            const paddedExtent = ol.extent.buffer(extent, extentBuffer);
            map
              .getView()
              .fit(paddedExtent, { ...map.getSize(), duration: 1000 });
          }
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
  }, [
    map,
    selectStyle,
    onFeatureSelect,
    selectedFeature,
    mapCenter,
    clusterLayer,
    clusterCircleStyle,
    clusterCirclesLayer,
  ]);

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
