import React, { useState } from 'react';
import {
  Controls,
  Interactions,
  Layer,
  Map,
  Layers,
} from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';

const TileSetLoader = (props) => {
  const [tileWMSSources, setTileWMSSources] = useState([]);

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
  }, []);

  return tileWMSSources ? (
    <MapContainer {...props} source={tileWMSSources[0]} />
  ) : null;
};

const MapContainer = (props) => {
  const { longitude, latitude, source } = props;
  return (
    <Map
      view={{
        center: ol.proj.fromLonLat([longitude, latitude]),
        showFullExtent: true,
        zoom: 15,
      }}
      pixelRatio={1}
      controls={ol.control.defaults({ attribution: false })}
    >
      <Layers>
        <Controls attribution={false} zoom={false} />
        <Interactions
          doubleClickZoom={true}
          dragAndDrop={false}
          dragPan={true}
          keyboardPan={true}
          keyboardZoom={true}
          mouseWheelZoom={true}
          pointer={true}
          select={false}
        />
        <Layer.Tile source={source} zIndex={0} />
      </Layers>
    </Map>
  );
};

export default TileSetLoader;
