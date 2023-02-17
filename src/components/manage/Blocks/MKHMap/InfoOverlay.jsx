import React from 'react';
import { Message } from 'semantic-ui-react';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import FeatureDisplay from './FeatureDisplay';

export default function InfoOverlay({ selectedFeature }) {
  const { map } = useMapContext();
  const [tooltip, setTooltipRef] = React.useState();
  const [showTooltip, setShowTooltip] = React.useState();

  React.useEffect(() => {
    if (!(map && tooltip)) return;

    const overlay = new ol.Overlay({
      element: document.getElementById('popup-overlay'),
      positioning: 'bottom-center',
      offset: [0, -10],
      stopEvent: false,
    });
    map.addOverlay(overlay);

    function handler(evt) {
      const coordinate = evt.coordinate;
      const { pixel, target } = evt;
      const features = target.getFeaturesAtPixel(pixel);
      // console.log('features', features, features.length);

      if (features.length) {
        overlay.setPosition(coordinate);
        setShowTooltip(true);
      } else {
        setShowTooltip(false);
      }
    }

    map.on('click', handler);

    return () => {
      map.un('click', handler);
    };
  }, [map, tooltip]); //

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);

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
      <Message>
        <FeatureDisplay feature={selectedFeature} />
      </Message>
    </div>
  ) : null;
}
