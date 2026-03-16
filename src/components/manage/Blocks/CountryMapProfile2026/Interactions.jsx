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
  selectedCountry,
  setSelectedCountry,
}) => {
  const map = useMapContext().map;

  const handleTooltip = React.useCallback(
    (feature, evt) => {
      const node = tooltipRef.current;
      if (!feature) {
        node.style.visibility = 'hidden';
        return;
      }

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
            <div class="tooltip-content"><span>${tooltipContent}</span> ABC</div>
          </div>`;

        setTooltipVisibility(node, tooltipContentDiv, evt, true);
      }
      if (
        countries_metadata.length > 0 &&
        feature &&
        (euCountryNames.includes(feature.get('na')) ||
          ['Ukraine', 'Moldova', 'Georgia', 'Türkiye', 'Turkiye'].includes(
            feature.get('na'),
          ))
      ) {
        let countryName = feature.get('na');
        let countryNamePrint = feature.get('na');
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

        if (countryName === 'Switzerland') {
          noDataReportedMsg = `
          <span>National Adaptation Strategy </span><ul><li><a href="https://www.bafu.admin.ch/bafu/en/home/topics/climate/publications-studies/publications/adaptation-climate-change-switzerland-2012.html">Adaptation to climate change in Switzerland - First part of the Federal Councils strategy</a><p style="font-style:oblique;">Adopted</p></li></ul><span>National Adaptation Plan </span><ul><li><a href="https://www.bafu.admin.ch/bafu/de/home/themen/klima/publikationen-studien/publikationen/anpassung-klimawandel-schweiz-aktionsplan-2020-2025.html">Adaptation to climate change in Switzerland: Action Plan 2020-2025</a><p style="font-style:oblique;">Adopted</p></li></ul>`;
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
        const flag = feature.get('flag').src;
        const cn = countryName.toLowerCase();
        if (countryNamePrint === 'Moldova') {
          countryNamePrint = 'Republic of Moldova';
        }
        let tooltipContentDiv = `
          <div class="country-tooltip">
            <div id="country-name">
              <a href="/en/countries-regions/countries/${cn}" target="_blank"><h3>${countryNamePrint}</h3></a>
              <img class="tooltip-country-flag" src="${flag}" height="33" width="54">
            </div>
            <div class="tooltip-content">${tooltipContent}</div>
          </div>`;

        // setTooltipVisibility(node, tooltipContentDiv, evt, true);
      }
    },
    [baseUrl, countries_metadata, map, thematicMapMode, tooltipRef],
  );

  React.useEffect(() => {
    if (!map || !euCountryFeatures.current) return;

    if (!selectedCountry) {
      map.getView().animate({
        center: ol.proj.fromLonLat([14.5, 57]),
        zoom: 3.3,
        duration: 1000,
      });
      handleTooltip(null);
      return;
    }

    const feature = euCountryFeatures.current.find(
      (f) => f.get('na') === selectedCountry,
    );
    if (feature) {
      const extent = feature.getGeometry().getExtent();
      map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        duration: 1000,
        maxZoom: 6,
      });

      // Show tooltip at center of country
      const pixel = map.getPixelFromCoordinate(ol.extent.getCenter(extent));
      handleTooltip(feature, {
        clientX: pixel[0] + map.getTargetElement().getBoundingClientRect().left,
        clientY: pixel[1] + map.getTargetElement().getBoundingClientRect().top,
      });
    } else {
      handleTooltip(null);
    }
  }, [selectedCountry, map, euCountryFeatures, ol, handleTooltip]);

  React.useEffect(() => {
    if (!map) return;

    const onClick = (evt) => {
      if (evt.dragging) {
        return;
      }
      const feature = getClosestFeatureToCoordinate(
        evt.coordinate,
        euCountryFeatures.current,
        ol,
      );
      if (feature) {
        setSelectedCountry(feature.get('na'));
      } else {
        setSelectedCountry('');
      }
    };

    const onPointerMove = (evt) => {
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
    };

    map.on('click', onClick);
    map.on('pointermove', onPointerMove);

    return () => {
      map.un('click', onClick);
      map.un('pointermove', onPointerMove);
    };
  }, [
    map,
    euCountryFeatures,
    ol,
    setSelectedCountry,
    highlight,
    setStateHighlight,
  ]);

  return null;
};
