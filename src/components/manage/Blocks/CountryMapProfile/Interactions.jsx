import React from 'react';
import {
  euCountryNames,
  setTooltipVisibility,
  getClosestFeatureToCoordinate,
} from '@eeacms/volto-cca-policy/helpers/country_map/countryMap';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';

export const Interactions = ({
  baseUrl,
  highlight,
  tooltipRef,
  thematicMapMode,
  euCountryFeatures,
  setStateHighlight,
  countries_metadata,
  ol,
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
        ol,
      );
      if (!feature) {
        const node = tooltipRef.current;
        node.style.visibility = 'hidden';
      }
      const domEvt = evt.originalEvent;

      if (
        countries_metadata.length > 0 &&
        feature &&
        [
          'Bosnia and Herzegovina',
          'Montenegro',
          'Albania',
          'North Macedonia',
          'Kosovo',
        ].includes(feature.get('na'))
      ) {
        map.getTargetElement().style.cursor = 'pointer';
        let countryName = feature.get('na');
        const node = tooltipRef.current;
        const flag = feature.get('flag').src;
        let tooltipContent =
          'No data reported through the reporting mechanism of the adapted Governance Regulation for the Energy Community\'s Contracting Parties. More information is available <a href="https://www.energy-community.org/">here</a>.';
        if (countryName === 'Kosovo') {
          tooltipContent =
            tooltipContent +
            '<hr>This designation is without prejudice to positions on status, and is in line with UNSCR 1244/99 and the ICJ opinion on Kosovo Declaration of Independence';
        }
        let tooltipContentDiv = `
          <div class="country-tooltip">
            <div id="country-name">
              <h3>${countryName}</h3>
              <img class="tooltip-country-flag" src="${flag}" height="33" width="54">
            </div>
            <div class="tooltip-content"><span>${tooltipContent}</span></div>
          </div>`;

        setTooltipVisibility(node, tooltipContentDiv, domEvt, true);
      }
      if (
        countries_metadata.length > 0 &&
        feature &&
        euCountryNames.includes(feature.get('na'))
      ) {
        let countryName = feature.get('na');
        let baseUrlPath = baseUrl;
        if (!baseUrlPath.includes('countries-regions/countries/')) {
          baseUrlPath = baseUrlPath + '/countries-regions/countries';
        }
        let noDataReportedMsg = `
          No data reported through the reporting mechanism of the Governance Regulation.
          Last information is available
          <a href="${baseUrlPath}/${countryName.toLowerCase()}">here</a>`;

        if (countryName === 'Türkiye') {
          countryName = 'Turkiye';
          noDataReportedMsg = `
            Data reported in 2021 through the reporting mechanism of the Governance Regulation.
            Information is available
            <a href="${baseUrlPath}/${countryName.toLowerCase()}">here</a>`;
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
            tooltipContent = `<span>${noDataReportedMsg}</span>`;
          } else {
            tooltipContent =
              metadata[0]?.mixed || '<span>NAS and NAP not reported</span>';
          }
        } else {
          tooltipContent =
            metadata[0]?.ccivportal_info ||
            '<span>No portal or platform reported</span>';
        }

        map.getTargetElement().style.cursor = 'pointer';
        const node = tooltipRef.current;
        const flag = feature.get('flag').src;
        const cn = countryName.toLowerCase();
        let tooltipContentDiv = `
          <div class="country-tooltip">
            <div id="country-name">
              <a href="/en/countries-regions/countries/${cn}"><h3>${countryName}</h3></a>
              <img class="tooltip-country-flag" src="${flag}" height="33" width="54">
            </div>
            <div class="tooltip-content">${tooltipContent}</div>
          </div>`;

        setTooltipVisibility(node, tooltipContentDiv, domEvt, true);
      }
    });

    map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return;
      }

      const feature = getClosestFeatureToCoordinate(
        evt.coordinate,
        euCountryFeatures.current,
        ol,
      );

      highlight.current = feature && feature.get('na');
      setStateHighlight(highlight.current);
    });
  });

  return null;
};
