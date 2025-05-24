import React from 'react';
import { compose } from 'redux';
import { Grid } from 'semantic-ui-react';
import {
  getImageUrl,
  tooltipStyle,
  adjustEuCountryNames,
  euCountryNames as euCountryNamesRaw,
} from '@eeacms/volto-cca-policy/helpers/country_map/countryMap';
import { withGeoJsonData } from '@eeacms/volto-cca-policy/helpers/country_map/hocs';
import { clientOnly } from '@eeacms/volto-cca-policy/helpers';
import { withOpenLayers } from '@eeacms/volto-openlayers-map';
import { Map, Layer, Layers, Controls } from '@eeacms/volto-openlayers-map/api';
import { makeStyles } from './mapstyle';
import { Interactions } from './Interactions';
import { useCountriesMetadata } from './hooks';
import Filter from './Filter';
import withResponsiveContainer from '../withResponsiveContainer';
import withVisibilitySensor from '../withVisibilitySensor';
import { addAppURL } from '@plone/volto/helpers';

import './styles.less';

// const url =
//   'https://raw.githubusercontent.com/eurostat/Nuts2json/master/pub/v2/2021/4326/20M/cntrg.json';

const View = (props) => {
  const { geofeatures, projection, ol } = props;

  const highlight = React.useRef();
  const [stateHighlight, setStateHighlight] = React.useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const styles = React.useMemo(
    () => makeStyles(highlight, ol),
    [stateHighlight, ol],
  );
  const tooltipRef = React.useRef();
  const [tileWMSSources, setTileWMSSources] = React.useState();
  const [euCountriesSource, setEuCountriessource] = React.useState();
  const [thematicMapMode, setThematicMapMode] = React.useState(
    'National adaption policy',
  );
  const countries_metadata_url =
    '/en/countries-regions/countries/@@countries-metadata-extract?langflag=1';
  const countries_metadata = useCountriesMetadata(
    addAppURL(countries_metadata_url),
  );

  const euCountryNames = adjustEuCountryNames(euCountryNamesRaw);

  const euCountryFeatures = React.useRef();

  React.useEffect(() => {
    const features = new ol.format.GeoJSON().readFeatures(geofeatures);
    const filtered = features.filter((f) =>
      euCountryNames.includes(f.get('na')),
    );

    euCountryFeatures.current = filtered;

    if (countries_metadata.length > 0) {
      filtered.forEach((feature) => {
        let countryName = feature.get('na');
        if (countryName === 'Türkiye') {
          countryName = 'Turkiye';
        }
        if (Object.hasOwn(countries_metadata[0], countryName)) {
          let metadata = countries_metadata[0][countryName];
          if (metadata !== undefined) {
            if (thematicMapMode === 'National adaption policy') {
              if (metadata[0]?.notreported) {
                feature.set('fillBlue', 'blue3');
              } else if (
                metadata[0]?.nap_mixed?.length ||
                metadata[0]?.nas_mixed.length ||
                metadata[0]?.sap_mixed.length
              ) {
                feature.set('fillBlue', 'blue1');
              } else {
                feature.set('fillBlue', 'blue2');
              }
            } else {
              if (metadata[0]?.notreported) {
                feature.set('fillBlue', 'blue3');
              } else if (
                ['both', 'hazard', 'adaptation', 'not_specified'].includes(
                  metadata[0]?.focus_info || [],
                )
              ) {
                feature.set('fillBlue', 'blue1');
              } else {
                feature.set('fillBlue', 'blue2');
              }
            }
          }
        }
      });
    }

    filtered.forEach((feature) => {
      const img = new Image();
      img.onload = function () {
        feature.set('flag', img);
      };
      img.src = getImageUrl(feature);
    });

    const euSource = new ol.source.Vector({ features: filtered });
    setEuCountriessource(euSource);

    setTileWMSSources([
      new ol.source.TileWMS({
        url: 'https://gisco-services.ec.europa.eu/maps/service',
        params: {
          // LAYERS: 'OSMBlossomComposite',
          // LAYERS: 'OSMCartoComposite',
          // LAYERS: 'OSMPositronComposite',
          // LAYERS: 'GreyEarth',
          // LAYERS: 'OSMCarto',
          // LAYERS: 'NaturalEarth',
          LAYERS: 'OSMBrightBackground',
          TILED: true,
        },
        serverType: 'geoserver',
        transition: 0,
      }),
    ]);
  }, [geofeatures, countries_metadata, thematicMapMode, euCountryNames, ol]);

  const baseUrl = props.path || props.location?.pathname || '';

  // const onFeatureClick = React.useCallback(
  //   (feature) => {
  //     const country = feature.get('na');
  //     // history.push(`${baseUrl}/${country.toLowerCase()}`);
  //   },
  //   [baseUrl, history],
  // );
  // console.log('thematicMapMode', thematicMapMode);
  // console.log('euCountriesSource', euCountriesSource);
  // console.log('filtered', euCountriesSource?.getFeatures() || 'NOT SET YET');

  return (
    <div className="ol-country-map">
      <Grid columns="12">
        <Grid.Column mobile={12} tablet={12} computer={10} className="col-left">
          {tileWMSSources ? (
            <Map
              view={{
                center: ol.proj.fromLonLat([10, 50], projection),
                projection,
                showFullExtent: true,
                zoom: 4,
              }}
              pixelRatio={1}
            >
              <div
                ref={tooltipRef}
                style={tooltipStyle}
                className="map-tooltip"
              ></div>
              <Controls attribution={false} />
              <Layers>
                {props.mode !== 'edit' && (
                  <Interactions
                    ol={ol}
                    tooltipRef={tooltipRef}
                    // onFeatureClick={onFeatureClick}
                    countries_metadata={countries_metadata}
                    baseUrl={baseUrl}
                    thematicMapMode={thematicMapMode}
                    euCountryFeatures={euCountryFeatures}
                    highlight={highlight}
                    setStateHighlight={setStateHighlight}
                  />
                )}
                <Layer.Vector
                  source={euCountriesSource}
                  zIndex={7}
                  style={styles.eucountriesStyle}
                />
                <Layer.Tile source={tileWMSSources[0]} zIndex={0} />
              </Layers>
            </Map>
          ) : null}
        </Grid.Column>
        <Grid.Column
          mobile={12}
          tablet={12}
          computer={2}
          className="col-left"
          id="country-map-filter"
        >
          <Filter
            thematicMapMode={thematicMapMode}
            setThematicMapMode={setThematicMapMode}
          />
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default compose(
  clientOnly,
  withGeoJsonData,
  withResponsiveContainer('countryMapProfile'),
  withVisibilitySensor(),
  withOpenLayers,
)(View);
