import React from 'react';
import superagent from 'superagent';
import { Grid } from 'semantic-ui-react'; // Dropdown,
import { useDispatch } from 'react-redux'; // , useSelector

import { getVocabulary } from '@plone/volto/actions'; // , searchContent
import { addAppURL } from '@plone/volto/helpers';

import { Map, Layer, Layers } from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';

/***********/
// Controls,
// Interactions,
// Circle as CircleStyle,
// Feature,
// Geom,
// Style,
//import { Vector as VectorLayer } from 'ol/layer.js';
//import ECDEIndicator from './ECDEIndicator';
// import Feature from 'ol/Feature.js';
// import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
// import { Cluster, OSM, Vector as VectorSource } from 'ol/source.js';

// import { Point } from 'ol/geom/Point.js';
//import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style.js';
// import { Cluster, OSM, Vector as VectorSource } from 'ol/source.js';

//
// const cases_url =
//   'http://localhost:3000/en/mkh/case-studies-map-arcgis.json/@@download/file';

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
  console.log('TheMap Cases', cases);
  /****/
  const Feature = ol.ol.Feature;
  console.log('Feature');
  var distance = 10;

  var count = cases.cases.length;
  var features = new Array(count);
  var e = 4500000;
  for (var i = 0; i < count; ++i) {
    var coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
    //console.log('V1', coordinates);
    features[i] = new Feature(new ol.geom.Point(coordinates));
  }
  features[0] = new Feature(
    //new ol.geom.Point(ol.proj.fromLonLat([48.864716, 2.349014])),
    //new ol.geom.Point(ol.proj.fromLonLat([2.349014, 48.864716])),
    new ol.geom.Point(ol.proj.fromLonLat([4.35609, 50.84439])),
  );
  features[1] = new Feature(
    new ol.geom.Point(ol.proj.fromLonLat([13.37691, 52.51604])),
  );
  //features[0] = new Feature(new ol.geom.Point([2.3522, 48.8566]));
  console.log('TheMap totalCases', cases, typeof cases, cases.cases.length);
  var casePoints = [];
  for (let i = 0; i < cases.cases.length; i++) {
    var _case = cases.cases[i].geometry.coordinates;
    //_case = [_case[1], _case[0]];
    console.log(i + ' V2', _case);
    //console.log('VT', ol.proj.fromLonLat([19.062072, 47.473478]));
    console.log('VT2', ol.proj.fromLonLat(_case));
    casePoints.push(new Feature(new ol.geom.Point(ol.proj.fromLonLat(_case))));
    features[i] = new Feature(new ol.geom.Point(ol.proj.fromLonLat(_case)));
  }

  var source = new ol.source.Vector({
    features: features,
    //features: casePoints,
  });
  console.log('TheMap Data', features, casePoints);

  var clusterSource = new ol.source.Cluster({
    distance: 100,
    source: source,
  });

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
            radius: 10,
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
      return style;
    },
  };
  /***********/

  /****/

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
  return (
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
        <Layer.Tile source={tileWMSSources[0]} zIndex={0} />
        <Layer.Vector {...clusterOptions} />
      </Layers>
    </Map>
  );
}
// function useFilters() {
//   const [filters, setFilters] = React.useState([]);
// }

export default function CaseStudyExplorerView(props) {
  // console.log(regions);
  const cases = useCases(addAppURL(cases_url));

  //const filters = useFilters();
  const [filters, setFilters] = React.useState([]);
  const dispatch = useDispatch();
  // const ipcc_categories = useSelector(
  //   (state) => state.vocabularies?.[IPCC]?.items,
  // );

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
  }, [cases]);

  // const [activeFilters, setActiveFilters] = React.useState({});
  //
  // console.log({ ipcc_categories, filters });

  if (__SERVER__) return '';
  return (
    <div>
      <Grid columns="12">
        <Grid.Column mobile={12} tablet={12} computer={10} className="col-left">
          <TheMap cases={cases} />
        </Grid.Column>
        <Grid.Column mobile={12} tablet={12} computer={2} className="col-left">
          {Object.entries(filters?.sectors || {}).map(
            ([value, label], index) => (
              <div key={index}>
                <input
                  value={value}
                  type="checkbox"
                  onChange={(e) => {
                    // const value =
                    // console.log(e.target.checked);
                    // setActiveFilters({...activeFilters, sector: [...activeFilters
                  }}
                />
                <span>{label}</span>
              </div>
            ),
          )}
        </Grid.Column>
      </Grid>
    </div>
  );
}
