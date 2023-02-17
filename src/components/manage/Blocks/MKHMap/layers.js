import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import mapSVG from './map.svg';

const serviceUrl =
  'https://nest.discomap.eea.europa.eu/arcgis/rest/services/CLIMA/Regions_cities/MapServer/';

console.log('ol', ol);

function r() {
  return Math.floor(Math.random() * 256);
}

const fillColors = {
  '0': [125, 125, 125, 1],
  'NUTS 0': [0, 0, 0, 1],
  'NUTS 1': [255, 0, 0, 1],
  'NUTS 2': [0, 255, 0, 1],
  'NUTS 3': [0, 0, 255, 1],
};

const makeLayer = (layerId) => {
  // return null;

  const fillStyle = new ol.style.Style({
    fill: new ol.style.Fill(),
    stroke: new ol.style.Stroke({
      color: [0, 0, 0, 1],
      width: 0.5,
    }),
  });

  const pinStyle = new ol.style.Style({
    image: new ol.style.Icon({
      src: mapSVG,
      color: '#BADA55',
      crossOrigin: 'anonymous',
    }),
  });

  const vectorSource = new ol.source.Vector({
    format: new ol.format.EsriJSON(),
    url: function (extent, resolution, projection) {
      // ArcGIS Server only wants the numeric portion of the projection ID.
      const srid = projection
        .getCode()
        .split(/:(?=\d+$)/)
        .pop();

      const url =
        serviceUrl +
        layerId +
        '/query/?f=json&' +
        'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
        encodeURIComponent(
          '{"xmin":' +
            extent[0] +
            ',"ymin":' +
            extent[1] +
            ',"xmax":' +
            extent[2] +
            ',"ymax":' +
            extent[3] +
            ',"spatialReference":{"wkid":' +
            srid +
            '}}',
        ) +
        '&geometryType=esriGeometryEnvelope&inSR=' +
        srid +
        '&outFields=*' +
        '&outSR=' +
        srid;

      return url;
    },
    strategy: ol.loadingstrategy.tile(
      ol.tilegrid.createXYZ({
        tileSize: 512,
      }),
    ),
    attributions: 'European Environment Agency',
  });

  return {
    source: vectorSource,
    style: function (feature) {
      // console.log('feature', feature);

      const country_code = feature.get('CNTR_CODE');
      const nuts_id = feature.get('NUTS_ID');
      const nuts_name = feature.get('NUTS_NAME');
      const level_code = feature.get('LEVEL_CODE');
      // const shape = feature.get('SHAPE');

      // console.log({ country_code, nuts_id, nuts_name, level_code, feature });

      // const classify = feature.get('LU_2014');
      const color = fillColors[level_code] || [r(), r(), r(), 1];
      fillStyle.getFill().setColor(color);

      return nuts_id ? fillStyle : pinStyle;
    },
    opacity: 0.7,
  };
};

export const countries = __CLIENT__ && makeLayer('0');
export const cities = __CLIENT__ && makeLayer('1');
export const regions = __CLIENT__ && makeLayer('2');
