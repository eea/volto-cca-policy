import React from 'react';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';

import FeatureDisplay from './FeatureDisplay';
import { getFeatures } from './utils';
import {
  clusterStyle,
  useStyles,
  getExtentOfFeatures,
  setClicked,
} from './useInteractiveStyles';

function FeatureInteraction({
  selectedFeature,
  onFeatureSelect,
  mapCenter,
  features,
  activeItems,
  olSource,
  olLayer,
  olInteraction,
  olStyle,
  olGeom,
  olProj,
  olCondition,
  ol,
}) {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);

  const { map } = useMapContext();
  const [clusterLayer, setClusterLayer] = React.useState();
  const [clusterCirclesLayer, setClusterCirclesLayer] = React.useState();
  const { selectStyle, clusterCircleStyle } = useStyles({
    olStyle,
    olGeom,
    ol,
  });

  const [pointsSource] = React.useState(
    new olSource.Vector({
      features,
    }),
  );

  const [clusterSource] = React.useState(
    new olSource.Cluster({
      distance: 50,
      source: pointsSource,
    }),
  );

  React.useEffect(() => {
    if (activeItems) {
      const features = getFeatures(activeItems, { ol, olGeom, olProj });
      pointsSource.clear();
      pointsSource.addFeatures(features);
    }
  }, [activeItems, pointsSource, ol, olGeom, olProj]);

  // form the clusters layer
  React.useEffect(() => {
    if (!map) return;

    // Layer displaying the expanded view of overlapping cluster members.
    const clusterCirclesLayer = new olLayer.Vector({
      source: clusterSource,
      style: clusterCircleStyle,
    });
    setClusterCirclesLayer(clusterCirclesLayer);
    map.addLayer(clusterCirclesLayer);

    const clusterLayer = new olLayer.Vector({
      source: clusterSource,
      style: clusterStyle(olStyle),
    });
    setClusterLayer(clusterLayer);
    map.addLayer(clusterLayer);
  }, [map, clusterSource, clusterCircleStyle, olLayer, olStyle]);

  React.useEffect(() => {
    if (!(map && clusterLayer)) return;

    const select = new olInteraction.Select({
      condition: olCondition.click,
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
          const extent = getExtentOfFeatures(subfeatures, olGeom);

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
    ol.extent,
    olInteraction,
    olGeom,
    olCondition,
  ]);

  function onClosePopup(evt) {
    evt.preventDefault();

    if (selectedFeature) {
      onFeatureSelect(null);

      const view = map.getView();
      view.animate({
        ...mapCenter,
        duration: 2000,
      });
    }
  }

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
      {selectedFeature ? (
        <FeatureDisplay feature={selectedFeature} onClose={onClosePopup} />
      ) : null}
    </div>
  ) : null;
}

export default injectLazyLibs([
  'olSource',
  'olLayer',
  'olInteraction',
  'ol',
  'olStyle',
  'olGeom',
  'olProj',
  'olCondition',
])(FeatureInteraction);
