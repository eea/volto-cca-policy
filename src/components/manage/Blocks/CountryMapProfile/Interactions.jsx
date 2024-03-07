import React from 'react';

import {
  euCountryNames,
  setTooltipVisibility,
  getClosestFeatureToCoordinate,
} from '@eeacms/volto-cca-policy/helpers/country_map/countryMap';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';

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

    map.on('click', function (evt) {
      if (evt.dragging) {
        return;
      }

      const feature = getClosestFeatureToCoordinate(
        evt.coordinate,
        euCountryFeatures.current,
      );
      const domEvt = evt.originalEvent;

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
    });
  });
  // }, [map, tooltipRef, onFeatureClick]);
  return null;
};
