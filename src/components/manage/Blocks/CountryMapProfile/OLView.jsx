import React from 'react';
import { compose } from 'redux';
import { clientOnly } from '@eeacms/volto-cca-policy/helpers';
import { useHistory } from 'react-router-dom';

import { Map, Layer, Layers, Controls } from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import { euCountryNames } from '@eeacms/volto-cca-policy/helpers/country_map/countryMap';

import withResponsiveContainer from '../withResponsiveContainer';
import { makeStyles } from './mapstyle';
import { Interactions } from './Interactions';
import { withGeoJsonData } from './hocs';

import Filter from './Filter';
import { Grid } from 'semantic-ui-react';
import { useCountriesMetadata } from './hooks';
import { addAppURL } from '@plone/volto/helpers';

import './styles.less';

// const url =
//   'https://raw.githubusercontent.com/eurostat/Nuts2json/master/pub/v2/2021/4326/20M/cntrg.json';

const tooltipStyle = {
  position: 'absolute',
  zIndex: 2,
  display: 'inline-block',
  visibility: 'hidden',
  top: '0px',
  left: '0px',
  backgroundColor: 'black',
  color: 'white',
  padding: '0.3em',
  cursor: 'pointer',
  fontSize: '10px',
};

function getImageUrl(feature) {
  let id = feature.get('id').toLowerCase();
  if (id === 'el') {
    id = 'gr'; // fix Greece
  }
  if (id === 'uk') {
    id = 'gb'; // fix Greece
  }
  return 'https://flagcdn.com/w320/' + id + '.png';
}

const View = (props) => {
  const { geofeatures, projection } = props;

  const history = useHistory();
  const styles = React.useMemo(makeStyles, []);
  const tooltipRef = React.useRef();
  const [tileWMSSources, setTileWMSSources] = React.useState();
  const [overlaySource, setOverlaySource] = React.useState();
  // const [overlaySource2, setOverlaySource2] = React.useState();
  const [euCountriesSource, setEuCountriessource] = React.useState();
  const [thematicMapMode, setThematicMapMode] = React.useState(
    'National adaption policy',
  );
  const [nap1, setNap1] = React.useState();
  const [nap2, setNap2] = React.useState();
  const [nap3, setNap3] = React.useState();
  const countries_metadata_url =
    '/en/countries-regions/countries/@@countries-metadata-extract?langflag=1';
  const countries_metadata = useCountriesMetadata(
    addAppURL(countries_metadata_url),
  );
  console.log('countries_metadata:', countries_metadata);
  for (let i = 0; i < euCountryNames.length; i++) {
    if (euCountryNames[i] == 'Turkey') {
      euCountryNames[i] = 'Türkiye';
    }
    if (euCountryNames[i] == 'United Kingdom') {
      euCountryNames[i] = 'United Kingdom DEL';
    }
  }
  // setOverlaySource(new ol.source.Vector());
  // const overlaySource2 = setOverlaySource(new ol.source.Vector());

  React.useEffect(() => {
    setOverlaySource(new ol.source.Vector());

    const features = new ol.format.GeoJSON().readFeatures(geofeatures);
    const filtered = features.filter((f) =>
      euCountryNames.includes(f.get('na')),
    );

    filtered.forEach((feature) => {
      const img = new Image();
      img.onload = function () {
        feature.set('flag', img);
      };
      img.src = getImageUrl(feature);
    });

    // for (let i = 0; i < filtered.length; i++) {
    //   if (filtered[i].get('na') == 'Romania') {
    //     // overlaySource2.addFeature(filtered[i]);
    //   }
    // }

    let fillCountries = { blue1: [], blue2: [], blue3: [] };
    if (countries_metadata.length > 0) {
      for (let i = 0; i < filtered.length; i++) {
        let countryData = filtered[i];
        let countryName = countryData.get('na');
        if (countryName === 'Türkiye') {
          countryName = 'Turkiye';
        }
        if (!Object.hasOwn(countries_metadata[0], countryName)) {
          continue;
        }
        let metadata = countries_metadata[0][countryName];
        if (metadata === undefined) {
          continue;
        }
        if (thematicMapMode == 'National adaption policy') {
          if (metadata[0]?.notreported) {
            fillCountries.blue3.push(countryData);
          } else if (
            metadata[0]?.nap_mixed?.length ||
            metadata[0]?.nas_mixed.length ||
            metadata[0]?.sap_mixed.length
          ) {
            fillCountries.blue1.push(countryData);
          } else {
            fillCountries.blue2.push(countryData);
          }
        } else {
          if (metadata[0]?.notreported) {
            fillCountries.blue3.push(countryData);
          } else if (
            ['both', 'hazard', 'adaptation', 'not_specified'].includes(
              metadata[0]?.focus_info || [],
            )
          ) {
            fillCountries.blue1.push(countryData);
          } else {
            fillCountries.blue2.push(countryData);
          }
        }
      }
    }
    const nap1Source = new ol.source.Vector({ features: fillCountries.blue1 });
    setNap1(nap1Source);
    const nap2Source = new ol.source.Vector({ features: fillCountries.blue2 });
    setNap2(nap2Source);
    const nap3Source = new ol.source.Vector({ features: fillCountries.blue3 });
    setNap3(nap3Source);

    const euSource = new ol.source.Vector({ features: filtered });
    setEuCountriessource(euSource);

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
    console.log('countries_metadata:', countries_metadata);
  }, [geofeatures, countries_metadata, thematicMapMode]);

  const baseUrl = props.path || props.location?.pathname || '';

  const onFeatureClick = React.useCallback(
    (feature) => {
      const country = feature.get('na');
      // history.push(`${baseUrl}/${country.toLowerCase()}`);
    },
    [baseUrl, history],
  );
  console.log('thematicMapMode', thematicMapMode);
  console.log('overlaySource', overlaySource);
  console.log('euCountriesSource', euCountriesSource);
  console.log('filtered', euCountriesSource?.getFeatures() || 'NOT SET YET');
  console.log('OVERLAY SOURCE ROOT:', overlaySource?.getFeatures());
  // console.log('OVERLAY SOURCE2 ROOT:', overlaySource2?.getFeatures());

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
                    overlaySource={overlaySource}
                    tooltipRef={tooltipRef}
                    onFeatureClick={onFeatureClick}
                    countries_metadata={countries_metadata}
                    baseUrl={baseUrl}
                    thematicMapMode={thematicMapMode}
                  />
                )}
                <Layer.Vector
                  source={overlaySource}
                  zIndex={4}
                  style={styles.overlayStyle}
                />
                <Layer.Vector
                  source={nap3}
                  zIndex={3}
                  style={styles.blue3Style}
                />
                <Layer.Vector
                  source={nap2}
                  zIndex={3}
                  style={styles.blue2Style}
                />
                <Layer.Vector
                  source={nap1}
                  zIndex={3}
                  style={styles.blue1Style}
                />
                <Layer.Vector
                  source={euCountriesSource}
                  zIndex={2}
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
  clientOnly,
  withGeoJsonData,
  withResponsiveContainer('countryMapProfile'),
)(View);
