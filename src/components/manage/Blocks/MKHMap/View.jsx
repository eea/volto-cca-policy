import React, { useState, useEffect } from 'react';
// import { Message, Container } from 'semantic-ui-react';
import Map from '@eeacms/volto-openlayers-map/Map';
import { Interactions } from '@eeacms/volto-openlayers-map/Interactions';
import { Controls } from '@eeacms/volto-openlayers-map/Controls';
import { Layers, Layer } from '@eeacms/volto-openlayers-map/Layers';
import { openlayers } from '@eeacms/volto-openlayers-map';

import { nuts0source, nuts2source } from './layers';

import './style.less';

export default function View(props) {
  console.log('view');

  const [options, setOptions] = React.useState({});
  const [vectorSource, setVectorSource] = useState(null);
  const [tileWMSSources, setTileWMSSources] = useState([]);
  const { extent, format, proj, style, source } = openlayers;

  // const { results = [], payload = {} } = props.search || {};

  // const activePageResults = results.filter((_, index) => {
  //   return (
  //     index >= (payload?.activePage - 1) * payload?.row_size &&
  //     index <= payload?.activePage * payload?.row_size - 1
  //   );
  // });

  useEffect(() => {
    if (__SERVER__) return;
    setVectorSource(new source.Vector());
    setTileWMSSources([
      new source.TileWMS({
        url: 'https://gisco-services.ec.europa.eu/maps/service',
        params: {
          LAYERS: 'OSMBlossomComposite',
          TILED: true,
        },
        serverType: 'geoserver',
        transition: 0,
      }),
      // new source.
      // new source.TileWMS({
      //   extent: [
      //     -3603195.606899999,
      //     3197087.8112000003,
      //     3796164.5945000015,
      //     1.1077138825000003e7,
      //   ],
      //   url:
      //     // 'https://nest.discomap.eea.europa.eu/arcgis/rest/services/CLIMA/Regions_cities/MapServer',
      //     'https://bio.discomap.eea.europa.eu/arcgis/services/ProtectedSites/Natura2000Sites/MapServer/WMSServer',
      //   params: { LAYERS: '2', TILED: true },
      //   serverType: 'geoserver',
      //   transition: 0,
      // }),
    ]);
    /* eslint-disable-next-line */
  }, []);

  // useEffect(() => {
  //   if (__SERVER__ || !vectorSource) {
  //     return;
  //   }
  //
  //   if (activePageResults.length === 0 && vectorSource) {
  //     vectorSource.clear();
  //     setOptions({
  //       ...options,
  //       extent: new extent.buffer(
  //         [
  //           -3603195.606899999,
  //           3197087.8112000003,
  //           3796164.5945000015,
  //           1.1077138825000003e7,
  //         ],
  //         -3603195.606899999 * 0.01,
  //       ),
  //     });
  //     return;
  //   }
  //
  //   const esrijsonFormat = new format.EsriJSON();
  //
  //   // Get sites of active page
  //   fetch(
  //     getActiveSitesURL(activePageResults.map((item) => `'${item.site_code}'`)),
  //   ).then(function (response) {
  //     if (response.status !== 200) return;
  //
  //     vectorSource.clear();
  //
  //     response.json().then(function (data) {
  //       if (data.features && data.features.length > 0) {
  //         const features = esrijsonFormat.readFeatures(data);
  //         if (features.length > 0) {
  //           vectorSource.addFeatures(features);
  //           const vectorExtent = vectorSource.getExtent();
  //           let size = extent.getSize(vectorExtent);
  //           setOptions({
  //             ...options,
  //             extent: new extent.buffer(vectorExtent, size[0] * 0.03),
  //           });
  //         }
  //       }
  //     });
  //   });
  //   /* eslint-disable-next-line */
  // }, [JSON.stringify(activePageResults)]);

  if (__SERVER__ || !vectorSource) return '';
  console.log('vectorSource', vectorSource);
  return (
    <div className="explore-sites-wrapper">
      <div className="explore-sites">
        <Map
          view={{
            center: proj.fromLonLat([20, 50]),
            showFullExtent: true,
            zoom: 5,
          }}
          pixelRatio={1}
          {...options}
        >
          <Layers>
            <Layer.Tile source={tileWMSSources[0]} zIndex={0} />
            {/* <Layer.Tile source={tileWMSSources[1]} zIndex={1} /> */}
            <Layer.Vector
              source={nuts0source}
              title="highlightLayer"
              zIndex={2}
            />
            <Layer.Vector
              source={nuts2source}
              title="highlightLayer"
              zIndex={2}
            />
          </Layers>
          <Controls attribution={true} zoom={false} />
          <Interactions
            doubleClickZoom={true}
            dragAndDrop={false}
            dragPan={true}
            keyboardPan={true}
            keyboardZoom={true}
            mouseWheelZoom={true}
            pointer={false}
            select={false}
          />
        </Map>
      </div>
    </div>
  );
}

// style={
//   new style.Style({
//     fill: new style.Fill({
//       color: 'rgba(255,255,255,0.4)',
//     }),
//     stroke: new style.Stroke({
//       color: '#00A390',
//       // color: '#F8E473',
//       width: 3,
//     }),
//     image: new style.Circle({
//       radius: 5,
//       fill: new style.Fill({ color: 'rgba(4, 167, 125,0.6)' }),
//       // fill: new style.Fill({ color: 'rgba(248,228,115,0.6)' }),
//       stroke: new style.Stroke({
//         color: 'rgba(242, 180, 87, 1)',
//         width: 2,
//       }),
//     }),
//   })
// }
