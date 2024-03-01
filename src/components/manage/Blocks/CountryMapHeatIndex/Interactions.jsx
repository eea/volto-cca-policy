import React from 'react';

import { euCountryNames } from '@eeacms/volto-cca-policy/helpers/country_map/countryMap';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';

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

const getClosestFeatureToCoordinate = (coordinate, features) => {
  if (!features.length) return null;
  const x = coordinate[0];
  const y = coordinate[1];
  let closestFeature = null;
  const closestPoint = [NaN, NaN];
  let minSquaredDistance = Infinity;

  features.forEach((feature) => {
    const geometry = feature.getGeometry();
    const previousMinSquaredDistance = minSquaredDistance;
    minSquaredDistance = geometry.closestPointXY(
      x,
      y,
      closestPoint,
      minSquaredDistance,
    );
    if (minSquaredDistance < previousMinSquaredDistance) {
      closestFeature = feature;
    }
  });

  return closestFeature;
};

export const Interactions = ({
  tooltipRef,
  // onFeatureClick,
  countries_metadata,
  baseUrl,
  thematicMapMode,
  euCountryFeatures,
  highlight,
  setStateHighlight,
}) => {
  const map = useMapContext().map;

  React.useEffect(() => {
    if (!map) return;

    map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return;
      }

      const feature = getClosestFeatureToCoordinate(
        evt.coordinate,
        euCountryFeatures.current,
      );

      highlight.current = feature && feature.get('na');
      setStateHighlight(highlight.current);

      // const domEvt = evt.originalEvent;
      // const pixel = map.getEventPixel(evt.originalEvent);
      // const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
      //   return feature;
      // });
      // console.log('current feature', feature.get('na'));
      // console.log('FEATURE:', feature?.get('na') || 'NA');
      // console.log('HIGHLIGHT:', highlight?.get('na') || 'NA');
      // if (feature && euCountryNames.includes(feature.get('na'))) {
      //   console.log('FEATURE IS EUROPE COUNTRY');
      // }
      // if (feature !== highlight) {
      //   if (highlight) {
      //     try {
      //       map.getTargetElement().style.cursor = '';
      //       // overlaySource.removeFeature(highlight);
      //     } catch {}
      //   }
      //   if (feature && euCountryNames.includes(feature.get('na'))) {
      //     // overlaySource.addFeature(feature);
      //     map.getTargetElement().style.cursor = 'pointer';
      //     const node = tooltipRef.current;
      //     setTooltipVisibility(node, feature.get('na'), domEvt, true);
      //     highlight.current = feature.get('na');
      //   }
      // } else {
      //   // setTooltipVisibility(tooltipRef.current, null, domEvt, false);
      // }
    });

    map.on('click', function (evt) {
      if (evt.dragging) {
        return;
      }
      const domEvt = evt.originalEvent;
      // const pixel = map.getEventPixel(evt.originalEvent);

      const feature = getClosestFeatureToCoordinate(
        evt.coordinate,
        euCountryFeatures.current,
      );
      let countryName = feature.get('na');
      if (
        Object.hasOwn(countries_metadata, countryName) &&
        thematicMapMode === 'hhws' &&
        euCountryNames.includes(countryName) &&
        countries_metadata[countryName].hhws === 'HWWS exists'
      ) {
        let metadata = countries_metadata[countryName];
        if (metadata === undefined) {
          return;
        }
        let tooltipContent = '<strong>Heat index of HHWS:</strong> ';
        map.getTargetElement().style.cursor = 'pointer';
        const node = tooltipRef.current;
        let tooltipContentDiv =
          `<div id="country-name">
              <h3>` +
          countryName +
          `</h3>
          </div><div class="tooltip-content"><span>` +
          tooltipContent +
          countries_metadata[countryName].heat_index_description +
          `</span><br/><br/><span><a href="` +
          countries_metadata[countryName].website +
          `">HHWS website</a></span></div>`;
        setTooltipVisibility(
          node,
          '<div class="country-tooltip">' + tooltipContentDiv + '</div>',
          domEvt,
          true,
        );
      } else {
        const collections = document.getElementsByClassName('map-tooltip');
        for (let i = 0; i < collections.length; i++) {
          collections[i].style.visibility = 'hidden';
        }
      }

      // if (feature) {
      //   onFeatureClick(feature);
      // }
    });
  });
  // }, [map, tooltipRef, onFeatureClick]);
  return null;
};
