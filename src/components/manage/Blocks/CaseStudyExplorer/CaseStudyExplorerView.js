import React from 'react';
import superagent from 'superagent';
import { Grid } from 'semantic-ui-react'; // Dropdown,
import { useDispatch } from 'react-redux'; // , useSelector

import { getVocabulary } from '@plone/volto/actions'; // , searchContent
import { addAppURL } from '@plone/volto/helpers';

import { Map, Layer, Layers } from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';

import InfoOverlay from './InfoOverlay';
import FeatureInteraction from './FeatureInteraction';
import './styles.less';

const cases_url = '@@case-studies-map.arcgis.json';
const IPCC = 'eea.climateadapt.aceitems_ipcc_category';

function useCases(url) {
  const [cases, setCases] = React.useState([]);

  React.useEffect(() => {
    superagent
      .get(cases_url)
      .set('accept', 'json')
      .then((resp) => {
        const res = JSON.parse(resp.text);
        setCases(res.features);
      });
  }, []);

  return cases;
}

function TheMap(cases) {
  const [selectedCase, onSelectedCase] = React.useState();
  //const [casesDisplay, setCasesDisplay] = React.useState([]);
  const [singlePointCases, setSinglePointCases] = React.useState([]);
  const Feature = ol.ol.Feature;
  //console.log('CASES', cases);

  const features = cases.cases.map((c, index) => {
    const {
      geometry: { coordinates },
    } = c;
    const point = new Feature(
      new ol.geom.Point(ol.proj.fromLonLat(coordinates)),
    );
    point.setId(index);
    point.setProperties(
      {
        title: c.properties.title,
        image: c.properties.image,
        adaptations: c.properties.sectors_str,
        impacts: c.properties.impacts_str,
        adaptation_options_links: c.properties.adaptation_options_links,
        index: index,
      },
      false,
    );
    //return new Feature({ labelPoint: point, index: index });
    return point;
  });
  //console.log('Features list', features);

  var source = new ol.source.Vector({
    features,
  });
  var clusterSource = new ol.source.Cluster({
    distance: 50,
    source: source,
  });

  var singlePoints = [];
  singlePoints.push(
    new Feature(new ol.geom.Point(ol.proj.fromLonLat([4.35609, 50.84439]))),
  );
  var styleCache = {};
  var clusterOptions = {
    source: clusterSource,
    style: function (feature) {
      var size = feature.get('features').length;
      //var size = feature.get('casePoints').length;
      var style = styleCache[size];
      if (!style) {
        style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 10 + Math.min(Math.floor(size / 3), 10),
            stroke: new ol.style.Stroke({
              color: '#fff',
            }),
            fill: new ol.style.Fill({
              color: '#3399CC',
            }),
          }),
          text: new ol.style.Text({
            text: size.toString(),
            fill: new ol.style.Fill({
              color: '#fff',
            }),
          }),
        });
        styleCache[size] = style;
      }
      if (size === 1) {
        return new ol.style.Style({
          image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
              color: '#fff',
            }),
            fill: new ol.style.Fill({
              color: '#000000',
            }),
          }),
        });
      }
      return style;
    },
  };

  var pointsOptions = {
    //source: new ol.source.Vector({ features }),
    //source: new ol.source.Vector({ singlePoints }),
    style: function (feature) {
      return new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: '#fff',
          }),
          fill: new ol.style.Fill({
            color: '#3399CC',
          }),
        }),
      });
    },
  };

  const [tileWMSSources, setTileWMSSources] = React.useState([]);

  React.useEffect(() => {
    setTileWMSSources([
      new ol.source.TileWMS({
        url: 'https://gisco-services.ec.europa.eu/maps/service',
        params: {
          LAYERS: 'OSMBlossomComposite',
          TILED: true,
        },
        serverType: 'geoserver',
        transition: 0,
      }),
    ]);
  }, []); // ol.source.TileWMS, ol.source.Vector

  // var raster = new TileLayer({
  //   source: new OSM(),
  // });

  // layers={[raster, clusters]}
  return features.length > 0 ? (
    <Map
      view={{
        center: ol.proj.fromLonLat([20, 50]),
        showFullExtent: true,
        zoom: 4,
      }}
      pixelRatio={1}
      controls={ol.control.defaults({ attribution: false })}
    >
      <Layers>
        <InfoOverlay
          selectedFeature={selectedCase}
          layerId={tileWMSSources?.[0]}
        />
        <FeatureInteraction onFeatureSelect={onSelectedCase} />
        <Layer.Tile source={tileWMSSources[0]} zIndex={0} />
        <Layer.Vector {...clusterOptions} zIndex={1} />
        <Layer.Vector {...pointsOptions} zIndex={2} />
      </Layers>
    </Map>
  ) : null;
}
// function useFilters() {
//   const [filters, setFilters] = React.useState([]);
// }

export default function CaseStudyExplorerView(props) {
  // console.log(regions);
  const cases = useCases(addAppURL(cases_url));
  const [mapKey, setMapKey] = React.useState('-');

  //const filters = useFilters();
  const [activeFilters, setActiveFilters] = React.useState({
    sectors: [],
    impacts: [],
  });
  const [casesDisplay, setCasesDisplay] = React.useState(cases);
  const [filters, setFilters] = React.useState([]);
  const dispatch = useDispatch();
  //const ipcc_categories = useSelector(
  //  (state) => state.vocabularies?.[IPCC]?.items,
  //);

  React.useEffect(() => {
    const action = getVocabulary({
      vocabNameOrURL: IPCC,
    });
    dispatch(action);
  }, [dispatch]);

  React.useEffect(() => {
    let _filters = { sectors: {}, impacts: {} };

    // console.log('acis', typeof cases, cases[0], cases);
    // console.log(Object.keys(cases));
    for (var key of Object.keys(cases)) {
      // console.log(key, cases[key]);
      var _case = cases[key];
      let sectorKeys = _case.properties.sectors.split(',');
      let sectorNames = _case.properties.sectors_str.split(',');
      for (var i = 0; i < sectorNames.length; i++) {
        if (!_filters.sectors.hasOwnProperty(sectorKeys[i + 1])) {
          _filters.sectors[sectorKeys[i + 1]] = sectorNames[i];
        }
      }
      let impactKeys = _case.properties.impacts.split(',');
      let impactNames = _case.properties.impacts_str.split(',');
      for (i = 0; i < impactNames.length; i++) {
        if (!_filters.impacts.hasOwnProperty(impactKeys[i + 1])) {
          _filters.impacts[impactKeys[i + 1]] = impactNames[i];
        }
      }
    }
    setFilters(_filters);
    setMapKey(
      casesDisplay.length +
        '-' +
        activeFilters.sectors +
        '-' +
        activeFilters.impacts,
    );
  }, [cases]);

  React.useEffect(() => {
    var data = cases.filter((_case) => {
      if (activeFilters.sectors.length === 0) {
        return _case;
      }
      var temp = false;
      activeFilters.sectors.map((filter) => {
        if (_case.properties.sectors.includes(',' + filter + ',')) {
          temp = true;
        }
      });
      activeFilters.impacts.map((filter) => {
        if (_case.properties.impacts.includes(',' + filter + ',')) {
          temp = true;
        }
      });
      if (temp) {
        return _case;
      }
    });
    //console.log('activeFilters filter cases', data);
    setCasesDisplay(data);
    setMapKey(
      casesDisplay.length +
        '-' +
        activeFilters.sectors +
        '-' +
        activeFilters.impacts,
    );
  }, [activeFilters]);

  if (__SERVER__) return '';
  //console.log('ACTIVE FILTERS', activeFilters);
  //console.log(mapKey);
  return (
    <div>
      <Grid columns="12">
        <Grid.Column mobile={12} tablet={12} computer={9} className="col-left">
          <TheMap key={mapKey} cases={casesDisplay} filters={activeFilters} />
        </Grid.Column>
        <Grid.Column
          mobile={12}
          tablet={12}
          computer={3}
          className="col-left"
          id="cse-filter"
        >
          <h4>Adaptation sectors</h4>
          {Object.entries(filters?.sectors || {}).map(
            ([value, label], index) => (
              <p key={index}>
                <span>{label}</span>
                <input
                  value={value}
                  type="checkbox"
                  onChange={(e) => {
                    // const value =
                    var temp = JSON.parse(JSON.stringify(activeFilters));
                    if (e.target.checked) {
                      temp.sectors.push(e.target.value);
                    } else {
                      temp.sectors = temp.sectors.filter((value) => {
                        if (value !== e.target.value) return value;
                        return null;
                      });
                    }
                    setActiveFilters(temp);
                  }}
                />
              </p>
            ),
          )}
          <h4>Climate impacts</h4>
          {Object.entries(filters?.impacts || {}).map(
            ([value, label], index) => (
              <p key={index}>
                <span>{label}</span>
                <input
                  value={value}
                  type="checkbox"
                  onChange={(e) => {
                    // const value =
                    var temp = JSON.parse(JSON.stringify(activeFilters));
                    if (e.target.checked) {
                      temp.impacts.push(e.target.value);
                    } else {
                      temp.impacts = temp.impacts.filter((value) => {
                        if (value !== e.target.value) return value;
                        return null;
                      });
                    }
                    setActiveFilters(temp);
                  }}
                />
              </p>
            ),
          )}
        </Grid.Column>
      </Grid>
    </div>
  );
}
