import React from 'react';
import { compose } from 'redux';
import { Icon, Button } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';
import { useSearchContext, useViews } from '@eeacms/search/lib/hocs';
import { withOpenLayers } from '@eeacms/volto-openlayers-map';
import { useMapContext } from '@eeacms/volto-openlayers-map/api';
import { Map, Layer, Layers, Controls } from '@eeacms/volto-openlayers-map/api';
import { euCountryNames, clientOnly } from '@eeacms/volto-cca-policy/helpers';
import {
  withResponsiveContainer,
  withVisibilitySensor,
  withGeoJsonData,
} from '@eeacms/volto-cca-policy/hocs';
import {
  getColorForCount,
  normalizeCountryName,
  buildCountryCounts,
  mapLegendItems,
} from './utils';

const messages = defineMessages({
  toolAvailability: {
    id: '{count, plural, =0 {No tools available} one {# tool available} other {# tools available}}',
    defaultMessage:
      '{count, plural, =0 {No tools available} one {# tool available} other {# tools available}}',
  },
  exploreTools: {
    id: 'Explore tools',
    defaultMessage: 'Explore tools',
  },
  toolsPerCountry: {
    id: 'Tools per country',
    defaultMessage: 'Tools per country',
  },
  close: {
    id: 'Close',
    defaultMessage: 'Close',
  },
});

/* istanbul ignore next */
const CountryClickInteractions = ({ ol, countryCounts, onExploreTools }) => {
  const { map } = useMapContext();
  const intl = useIntl();
  const [tooltipData, setTooltipData] = React.useState(null);

  React.useEffect(() => {
    if (!map) return;

    const handleClick = (evt) => {
      if (evt.dragging) return;
      const pixel = map.getEventPixel(evt.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, (f) => f);
      if (!feature) {
        setTooltipData(null);
        return;
      }

      const name = feature.get('na');
      const normalized = normalizeCountryName(name);
      const count = countryCounts[normalized] || 0;

      setTooltipData({
        name: normalized,
        count,
        pixel: [evt.originalEvent.clientX, evt.originalEvent.clientY],
        mapRect: map.getTargetElement().getBoundingClientRect(),
      });
    };

    const handlePointerMove = (evt) => {
      if (evt.dragging) return;
      const pixel = map.getEventPixel(evt.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, (f) => f);
      map.getTargetElement().style.cursor = feature ? 'pointer' : '';
    };

    map.on('singleclick', handleClick);
    map.on('pointermove', handlePointerMove);

    return () => {
      map.un('singleclick', handleClick);
      map.un('pointermove', handlePointerMove);
    };
  }, [map, countryCounts]);

  // Render tooltip as a portal-like overlay
  return (
    <>
      {tooltipData && (
        <div
          className="navigator-catalogue-map-tooltip"
          style={{
            left: `${tooltipData.pixel[0] - tooltipData.mapRect.left + 15}px`,
            top: `${tooltipData.pixel[1] - tooltipData.mapRect.top - 10}px`,
          }}
        >
          <div className="tooltip-header">
            <strong>{tooltipData.name}</strong>
          </div>
          <div className="tooltip-body">
            <span className="tooltip-count">
              {intl.formatMessage(messages.toolAvailability, {
                count: tooltipData.count,
              })}
            </span>
          </div>
          {tooltipData.count > 0 && (
            <div className="tooltip-actions">
              <Button
                labelPosition="right"
                className="primary small icon"
                onClick={() => onExploreTools(tooltipData.name)}
              >
                {intl.formatMessage(messages.exploreTools)}
                <Icon className="ri-arrow-right-line" />
              </Button>
            </div>
          )}
          <Button
            className="tooltip-close"
            onClick={() => setTooltipData(null)}
            aria-label={intl.formatMessage(messages.close)}
          >
            <Icon className="ri-close-line" aria-hidden="true" />
          </Button>
        </div>
      )}
    </>
  );
};

/* istanbul ignore next */
const NavigatorCatalogueMapViewInner = (props) => {
  const { geofeatures, projection, ol } = props;
  const intl = useIntl();
  const searchContext = useSearchContext();
  const views = useViews();

  // Handler: replace country filter + switch to list view
  const handleExploreTools = React.useCallback(
    (countryName) => {
      const field = 'cca_geographic_countries.keyword';
      // Clear existing country filter, then set the new one
      searchContext?.removeFilter(field);
      searchContext?.addFilter(field, countryName, 'any');
      // Switch to listing view
      views.setActiveViewId('listing');
    },
    [searchContext, views],
  );

  // Build lookup: countryName -> count
  const countryCounts = React.useMemo(
    () => buildCountryCounts(searchContext?.facets),
    [searchContext?.facets],
  );

  const [tileWMSSources, setTileWMSSources] = React.useState(null);
  const [euCountriesSource, setEuCountriesSource] = React.useState(null);

  React.useEffect(() => {
    // Tile layer
    setTileWMSSources([
      new ol.source.TileWMS({
        url: 'https://gisco-services.ec.europa.eu/maps/service',
        params: {
          LAYERS: 'OSMBrightBackground',
          TILED: true,
        },
        serverType: 'geoserver',
        transition: 0,
      }),
    ]);

    // Country vector layer with per-feature styles
    const features = new ol.format.GeoJSON().readFeatures(geofeatures, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });
    const filtered = features.filter((f) =>
      euCountryNames.includes(f.get('na')),
    );

    // Apply style to each feature
    filtered.forEach((feature) => {
      const name = feature.get('na');
      const normalized = normalizeCountryName(name);
      const count = countryCounts[normalized] || 0;
      const fillColor = getColorForCount(count);

      feature.setStyle(
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#333333',
            width: 1,
          }),
          fill: new ol.style.Fill({
            color: fillColor,
          }),
        }),
      );
    });

    setEuCountriesSource(new ol.source.Vector({ features: filtered }));
  }, [geofeatures, ol, countryCounts]);

  if (!tileWMSSources || !euCountriesSource) {
    return (
      <div className="navigator-catalogue-map-loading">
        <i className="icon loading" />
        Loading map...
      </div>
    );
  }

  return (
    <div className="navigator-catalogue-map">
      <div className="navigator-catalogue-map-canvas">
        <Map
          view={{
            center: ol.proj.fromLonLat([14.5, 57], projection),
            projection,
            showFullExtent: true,
            zoom: 3.6,
          }}
          pixelRatio={1}
        >
          <Controls attribution={false} />
          <Layers>
            <CountryClickInteractions
              ol={ol}
              countryCounts={countryCounts}
              onExploreTools={handleExploreTools}
            />
            <Layer.Vector source={euCountriesSource} zIndex={2} />
            <Layer.Tile source={tileWMSSources[0]} zIndex={0} />
          </Layers>
        </Map>
      </div>

      <aside
        className="navigator-catalogue-map-legend"
        aria-label={intl.formatMessage(messages.toolsPerCountry)}
      >
        <h4 className="legend-title">
          {intl.formatMessage(messages.toolsPerCountry)}
        </h4>
        {mapLegendItems.map((item) => (
          <div key={item.label} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </aside>
    </div>
  );
};

/* istanbul ignore next */
export default compose(
  clientOnly,
  withGeoJsonData(true),
  withResponsiveContainer('navigatorCatalogueMap'),
  withVisibilitySensor(),
  withOpenLayers,
)(NavigatorCatalogueMapViewInner);
