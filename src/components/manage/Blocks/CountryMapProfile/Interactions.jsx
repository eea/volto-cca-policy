import React from 'react';
import {
  euCountryNames,
  setTooltipVisibility,
  getClosestFeatureToCoordinate,
} from '@eeacms/volto-cca-policy/helpers';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';

const energyCommunityCountries = [
  'Bosnia and Herzegovina',
  'Montenegro',
  'Albania',
  'North Macedonia',
  'Kosovo',
];

const additionalProfileCountries = [
  'Ukraine',
  'Moldova',
  'Georgia',
  'Türkiye',
  'Turkiye',
];

const energyCommunityMessage =
  'No data reported through the reporting mechanism of the adapted Governance Regulation for the Energy Community\'s Contracting Parties. More information is available <a href="https://www.energy-community.org/">here</a>.';

const kosovoDisclaimer =
  '<hr>This designation is without prejudice to positions on status, and is in line with UNSCR 1244/99 and the ICJ opinion on Kosovo Declaration of Independence';

const getBaseUrlPath = (baseUrl) =>
  baseUrl.includes('countries-regions/countries/')
    ? baseUrl
    : `${baseUrl}/countries-regions/countries`;

const getTooltipContent = (metadata, thematicMapMode, noDataReportedMsg) => {
  if (thematicMapMode === 'National adaption policy') {
    return metadata[0]?.notreported
      ? `<span>${noDataReportedMsg}</span>`
      : metadata[0]?.mixed || '<span>NAS and NAP not reported</span>';
  }

  return (
    metadata[0]?.ccivportal_info ||
    '<span>No portal or platform reported</span>'
  );
};

const showEnergyCommunityTooltip = ({ feature, map, tooltipRef, event }) => {
  const countryName = feature.get('na');
  const flag = feature.get('flag').src;
  const tooltipContent =
    countryName === 'Kosovo'
      ? energyCommunityMessage + kosovoDisclaimer
      : energyCommunityMessage;
  const tooltipContentDiv = `
    <div class="country-tooltip">
      <div id="country-name">
        <h3>${countryName}</h3>
        <img class="tooltip-country-flag" src="${flag}" height="33" width="54">
      </div>
      <div class="tooltip-content"><span>${tooltipContent}</span></div>
    </div>`;

  map.getTargetElement().style.cursor = 'pointer';
  setTooltipVisibility(tooltipRef.current, tooltipContentDiv, event, true);
};

const showCountryProfileTooltip = ({
  baseUrl,
  countriesMetadata,
  event,
  feature,
  map,
  thematicMapMode,
  tooltipRef,
}) => {
  const originalCountryName = feature.get('na');
  let countryName = originalCountryName;
  const baseUrlPath = getBaseUrlPath(baseUrl);
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

  if (countryName === 'Switzerland') {
    noDataReportedMsg = `
      <span>National Adaptation Strategy </span><ul><li><a href="https://www.bafu.admin.ch/bafu/en/home/topics/climate/publications-studies/publications/adaptation-climate-change-switzerland-2012.html">Adaptation to climate change in Switzerland - First part of the Federal Councils strategy</a><p style="font-style:oblique;">Adopted</p></li></ul><span>National Adaptation Plan </span><ul><li><a href="https://www.bafu.admin.ch/bafu/de/home/themen/klima/publikationen-studien/publikationen/anpassung-klimawandel-schweiz-aktionsplan-2020-2025.html">Adaptation to climate change in Switzerland: Action Plan 2020-2025</a><p style="font-style:oblique;">Adopted</p></li></ul>`;
  }

  if (!Object.hasOwn(countriesMetadata[0], countryName)) return;

  const metadata = countriesMetadata[0][countryName];
  if (metadata === undefined) return;

  const tooltipContent = getTooltipContent(
    metadata,
    thematicMapMode,
    noDataReportedMsg,
  );
  const countryNamePrint =
    originalCountryName === 'Moldova'
      ? 'Republic of Moldova'
      : originalCountryName;
  const flag = feature.get('flag').src;
  const countryPath = countryName.toLowerCase();
  const tooltipContentDiv = `
    <div class="country-tooltip">
      <div id="country-name">
        <a href="/en/countries-regions/countries/${countryPath}" target="_blank"><h3>${countryNamePrint}</h3></a>
        <img class="tooltip-country-flag" src="${flag}" height="33" width="54">
      </div>
      <div class="tooltip-content">${tooltipContent}</div>
    </div>`;

  map.getTargetElement().style.cursor = 'pointer';
  setTooltipVisibility(tooltipRef.current, tooltipContentDiv, event, true);
};

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

    const handleClick = (evt) => {
      if (evt.dragging) return;

      const feature = getClosestFeatureToCoordinate(
        evt.coordinate,
        euCountryFeatures.current,
        ol,
      );

      if (!feature) {
        tooltipRef.current.style.visibility = 'hidden';
        return;
      }

      if (countries_metadata.length === 0) return;

      const countryName = feature.get('na');
      const tooltipOptions = {
        event: evt.originalEvent,
        feature,
        map,
        tooltipRef,
      };

      if (energyCommunityCountries.includes(countryName)) {
        showEnergyCommunityTooltip(tooltipOptions);
      }

      if (
        euCountryNames.includes(countryName) ||
        additionalProfileCountries.includes(countryName)
      ) {
        showCountryProfileTooltip({
          ...tooltipOptions,
          baseUrl,
          countriesMetadata: countries_metadata,
          thematicMapMode,
        });
      }
    };

    const handlePointerMove = (evt) => {
      if (evt.dragging) return;

      const feature = getClosestFeatureToCoordinate(
        evt.coordinate,
        euCountryFeatures.current,
        ol,
      );

      highlight.current = feature && feature.get('na');
      setStateHighlight(highlight.current);
    };

    map.on('click', handleClick);
    map.on('pointermove', handlePointerMove);

    return () => {
      map.un('click', handleClick);
      map.un('pointermove', handlePointerMove);
    };
  }, [
    baseUrl,
    countries_metadata,
    euCountryFeatures,
    highlight,
    map,
    ol,
    setStateHighlight,
    thematicMapMode,
    tooltipRef,
  ]);

  return null;
};
