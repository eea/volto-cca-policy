import React from 'react';
import { compose } from 'redux';
import { clientOnly } from '@eeacms/volto-cca-policy/helpers';

import { Map, Layer, Layers, Controls } from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import {
  euCountryNames as euCountryNamesRaw,
  tooltipStyle,
  getImageUrl,
  adjustEuCountryNames,
} from '@eeacms/volto-cca-policy/helpers/country_map/countryMap';
import { withGeoJsonData } from '@eeacms/volto-cca-policy/helpers/country_map/hocs';

import withResponsiveContainer from '../withResponsiveContainer';
import withVisibilitySensor from '../withVisibilitySensor';
import { makeStyles } from './mapstyle';
import { Interactions } from './Interactions';

import Filter from './Filter';
import { Grid } from 'semantic-ui-react';
import { useCountriesMetadata } from './hooks';
import { addAppURL } from '@plone/volto/helpers';

import './styles.less';

// const url =
//   'https://raw.githubusercontent.com/eurostat/Nuts2json/master/pub/v2/2021/4326/20M/cntrg.json';

const View = (props) => {
  const { geofeatures, projection } = props;

  const highlight = React.useRef();
  const [stateHighlight, setStateHighlight] = React.useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const styles = React.useMemo(() => makeStyles(highlight), [stateHighlight]);
  const tooltipRef = React.useRef();
  const [tileWMSSources, setTileWMSSources] = React.useState();
  const [euCountriesSource, setEuCountriessource] = React.useState();
  const [thematicMapMode, setThematicMapMode] = React.useState('hhap');
  const countries_metadata_url = '/en/@@countries-heat-index-json?langflag=1';
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
    //Update name for Bosnia and Herzegovina
    for (let i in features) {
      if (features[i].get('na').includes('Bosnia and Herzegovina')) {
        features[i].set('na', 'Bosnia-Herzegovina');
        break;
      }
    }

    euCountryFeatures.current = filtered;

    filtered.forEach((feature) => {
      let countryName = feature.get('na');
      if (countryName === 'Türkiye') {
        countryName = 'Turkey';
      }
      if (Object.hasOwn(countries_metadata, countryName)) {
        let metadata = countries_metadata[countryName];
        if (metadata !== undefined) {
          if (thematicMapMode === 'hhap') {
            switch (metadata.hhap) {
              case 'National HHAP':
                feature.set('fillColor', 'blue1');
                break;
              case 'Subnational or local HHAP':
                feature.set('fillColor', 'blue2');
                break;
              case 'No HHAP':
                feature.set('fillColor', 'gray1');
                break;
              case 'No information':
                feature.set('fillColor', 'gray2');
                break;
              default:
            }
          } else {
            switch (metadata.hhws) {
              case 'HWWS exists':
                feature.set('fillColor', 'blue1');
                break;
              case 'No information':
                feature.set('fillColor', 'gray2');
                break;
              default:
            }
          }
        }
      }
    });

    setTileWMSSources([
      new ol.source.TileWMS({
        url: 'https://gisco-services.ec.europa.eu/maps/service',
        params: {
          // LAYERS: 'OSMBlossomComposite', OSMCartoComposite, OSMPositronComposite
          LAYERS: 'OSMBrightBackground',
          TILED: true,
        },
        serverType: 'geoserver',
        transition: 0,
      }),
    ]);

    filtered.forEach((feature) => {
      const img = new Image();
      img.onload = function () {
        feature.set('flag', img);
      };
      img.src = getImageUrl(feature);
    });

    const euSource = new ol.source.Vector({ features: filtered });
    setEuCountriessource(euSource);
  }, [geofeatures, countries_metadata, thematicMapMode, euCountryNames]);

  return (
    <div>
      <Grid columns="12">
        <Grid.Column mobile={9} tablet={9} computer={10} className="col-left">
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
                    tooltipRef={tooltipRef}
                    // onFeatureClick={onFeatureClick}
                    countries_metadata={countries_metadata}
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
          mobile={3}
          tablet={3}
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
  withGeoJsonData,
  clientOnly,
  withResponsiveContainer('countryMapHeatIndex'),
  withVisibilitySensor(),
)(View);
