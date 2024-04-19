import React from 'react';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import FeatureDisplay from './FeatureDisplay';
import { usePrevious } from '@plone/volto/helpers/Utils/usePrevious';

const isCluster = (features) => {
  return features.length > 1 ? true : features[0].values_?.features?.length > 1;
};

export default function InfoOverlay({
  selectedFeature,
  onFeatureSelect,
  layerId,
  hasCusters = false,
}) {
  const { map } = useMapContext();
  const [tooltip, setTooltipRef] = React.useState();
  const [showTooltip, setShowTooltip] = React.useState();

  const prevLayerId = usePrevious(layerId);

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);

  React.useEffect(() => {
    if (prevLayerId && layerId !== prevLayerId) {
      setShowTooltip(false);
    }
  }, [layerId, prevLayerId]);

  React.useEffect(() => {
    if (!(map && tooltip)) return;

    const overlay = new ol.Overlay({
      element: document.getElementById('popup-overlay'),
      positioning: 'bottom-center',
      offset: [10, -10],
      stopEvent: false,
    });
    map.addOverlay(overlay);

    function handler(evt) {
      const coordinate = evt.coordinate;
      const { pixel, target } = evt;
      const features = target.getFeaturesAtPixel(pixel);

      if (features.length && (hasCusters ? !isCluster(features) : true)) {
        overlay.setPosition(coordinate);
        setShowTooltip(true);
      } else {
        // handle a click in an overlay popup
        if (evt.originalEvent.target.tagName === 'A') return;
        setShowTooltip(false);
        onFeatureSelect(null);
      }
    }

    map.on('click', handler);

    return () => {
      map.un('click', handler);
      map.removeOverlay(overlay);
    };
  }, [map, tooltip, onFeatureSelect, hasCusters]);

  return isClient ? (
    <div
      id="popup-overlay"
      style={{
        position: 'absolute',
        zIndex: 1,
        visibility: showTooltip ? 'visible' : 'hidden',
      }}
      ref={setTooltipRef}
    >
      {selectedFeature ? <FeatureDisplay feature={selectedFeature} /> : null}
    </div>
  ) : null;
}
