import { openlayers as ol } from '@eeacms/volto-openlayers-map';

const serviceUrl =
  'https://nest.discomap.eea.europa.eu/arcgis/rest/services/CLIMA/Regions_cities/MapServer';

console.log('ol', ol);

const makeLayer = (layerId) => {
  // return null;
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
    // attributions:
    //   'University of Leicester (commissioned by the ' +
    //   '<a href="https://www.arcgis.com/home/item.html?id=' +
    //   'd5f05b1dc3dd4d76906c421bc1727805">National Trust</a>)',
  });

  const vector = new ol.layer.Vector({
    source: vectorSource,
    // style: function (feature) {
    //   const classify = feature.get('LU_2014');
    //   const color = fillColors[classify] || [0, 0, 0, 0];
    //   style.getFill().setColor(color);
    //   return style;
    // },
    // opacity: 0.7,
  });

  return vector;
};

export const nuts0source = __CLIENT__ && makeLayer('0');
export const nuts2source = __CLIENT__ && makeLayer('2');
