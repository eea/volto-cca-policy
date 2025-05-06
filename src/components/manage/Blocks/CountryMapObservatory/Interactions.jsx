import React from 'react';

import { euCountryNames } from '@eeacms/volto-cca-policy/helpers/country_map/countryMap';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';

let highlight = null; // easy global

function setTooltipVisibility(node, label, event, visible) {
  if (!node) return;
  if (visible) {
    node.innerHTML = label;
    node.style.visibility = 'visible';
    node.style.left = `${Math.floor(event.layerX)}px`;
    node.style.top = `${Math.floor(event.layerY)}px`;
  } else {
    node.innerHTML = '';
    node.style.visibility = 'hidden';
  }
}

export const Interactions = ({ overlaySource, tooltipRef, onFeatureClick }) => {
  const map = useMapContext().map;

  const euCountryNamesFiltered = euCountryNames.filter(
    (euCountryName) => euCountryName !== 'United Kingdom',
  );

  React.useEffect(() => {
    if (!map) return;

    map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return;
      }
      const domEvt = evt.originalEvent;
      const pixel = map.getEventPixel(evt.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });
      if (feature !== highlight) {
        if (highlight) {
          try {
            map.getTargetElement().style.cursor = '';
            overlaySource.removeFeature(highlight);
          } catch {}
        }
        if (feature && euCountryNamesFiltered.includes(feature.get('na'))) {
          overlaySource.addFeature(feature);
          map.getTargetElement().style.cursor = 'pointer';
          const node = tooltipRef.current;
          setTooltipVisibility(node, feature.get('na'), domEvt, true);
          highlight = feature;
        }
      } else {
        // setTooltipVisibility(tooltipRef.current, null, domEvt, false);
      }
    });

    map.on('click', function (evt) {
      if (evt.dragging) {
        return;
      }
      const pixel = map.getEventPixel(evt.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });
      if (feature) {
        onFeatureClick(feature);
      }
    });
  }, [map, overlaySource, tooltipRef, onFeatureClick]);

  return null;
};
