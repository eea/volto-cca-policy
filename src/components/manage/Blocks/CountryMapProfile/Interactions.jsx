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
  onFeatureClick,
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
      console.log('set highlight', highlight.current);

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
      const pixel = map.getEventPixel(evt.originalEvent);

      const feature = getClosestFeatureToCoordinate(
        evt.coordinate,
        euCountryFeatures.current,
      );
      console.log('current feature', feature.get('na'));

      // map.forEachFeatureAtPixel(pixel, function (f) {
      //   if (f && !feature) {
      //     feature = f;
      //   }
      // });

      if (
        countries_metadata.length > 0 &&
        feature &&
        euCountryNames.includes(feature.get('na'))
      ) {
        // if (countries_metadata.length>0) {
        let countryName = feature.get('na');
        let noDataReportedMsg =
          'No data reported through the reporting mechanism of the Governance Regulation. Last information is available <a href="' +
          baseUrl +
          '/' +
          countryName.toLowerCase() +
          '">here</a>';
        if (countryName === 'Türkiye') {
          countryName = 'Turkiye';
          noDataReportedMsg =
            'Data reported in 2021 through the reporting mechanism of the Governance Regulation. Information is available <a href="' +
            baseUrl +
            '/' +
            countryName.toLowerCase() +
            '">here</a>';
        }
        if (!Object.hasOwn(countries_metadata[0], countryName)) {
          return;
        }
        let metadata = countries_metadata[0][countryName];
        if (metadata === undefined) {
          return;
        }
        let tooltipContent = '';
        if (thematicMapMode === 'National adaption policy') {
          if (metadata[0]?.notreported) {
            tooltipContent = '<span>' + noDataReportedMsg + '</span>';
          } else {
            tooltipContent =
              metadata[0]?.mixed || '<span>NAS and NAP not reported</span>';
          }
        } else {
          tooltipContent =
            metadata[0]?.ccivportal_info ||
            '<span>No portal or platform reported</span>';
          // tooltipContent.split('<p style="font-weight:bold;"></p>').join('');
        }
        // overlaySource.addFeature(feature);
        map.getTargetElement().style.cursor = 'pointer';
        const node = tooltipRef.current;
        let tooltipContentDiv =
          `<div id="country-name">
            <a href="https://climate-adapt.eea.europa.eu/en/countries-regions/countries/` +
          countryName.toLowerCase() +
          `">
              <h3>` +
          countryName +
          `</h3>
            </a>
            <img class="tooltip-country-flag" src="` +
          feature.get('flag').src +
          // feature.getflag +
          `" height="33" width="54">
          </div><div class="tooltip-content">` +
          tooltipContent +
          `</div>`;
        setTooltipVisibility(
          node,
          '<div class="country-tooltip">' + tooltipContentDiv + '</div>',
          domEvt,
          true,
        );
      }

      // if (feature) {
      //   onFeatureClick(feature);
      // }
    });
  }, [map, tooltipRef, onFeatureClick]);

  return null;
};
