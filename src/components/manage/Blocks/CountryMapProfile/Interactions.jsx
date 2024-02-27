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

export const Interactions = ({
  overlaySource,
  tooltipRef,
  onFeatureClick,
  countries_metadata,
  baseUrl,
  thematicMapMode,
}) => {
  const map = useMapContext().map;

  console.log('OVERLAY SOURCE MAIN2:', overlaySource.getFeatures());
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
      console.log('FEATURE:', feature?.get('na') || 'NA');
      console.log('HIGHLIGHT:', highlight?.get('na') || 'NA');
      if (feature && euCountryNames.includes(feature.get('na'))) {
        console.log('FEATURE IS EUROPE COUNTRY');
      }
      console.log('OVERLAY SOURCE:', overlaySource.getFeatures());
      if (feature !== highlight) {
        if (highlight) {
          try {
            map.getTargetElement().style.cursor = '';
            overlaySource.removeFeature(highlight);
          } catch {}
        }
        if (feature && euCountryNames.includes(feature.get('na'))) {
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
      const domEvt = evt.originalEvent;
      const pixel = map.getEventPixel(evt.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });

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
  }, [map, overlaySource, tooltipRef, onFeatureClick]);

  return null;
};
