import { withOpenLayers } from '@eeacms/volto-openlayers-map';
// import { openlayers as ol } from '@eeacms/volto-openlayers-map';
import {
  Controls,
  Interactions,
  Layer,
  Layers,
  Map,
} from '@eeacms/volto-openlayers-map/api';
import React, { useState } from 'react';
import { useMapContext } from '@eeacms/volto-openlayers-map/hocs';

function PinInteraction({ longitude, latitude, onChange, ol }) {
  const mapContext = useMapContext();
  const { addLayer, addInteraction, map } = mapContext;

  React.useEffect(() => {
    if (
      !map ||
      typeof latitude === 'undefined' ||
      typeof longitude === 'undefined'
    )
      return;

    // Create a feature (the pin) and set it to be draggable
    const pin = new ol.ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude])), // Initial location
    });

    // Style for the pin
    pin.setStyle(
      new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
        }),
      }),
    );

    // Create a vector layer to hold the pin
    const vectorSource = new ol.source.Vector({
      features: [pin],
    });

    const vectorLayer = new ol.layer.Vector({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);

    // Add drag interaction
    const dragInteraction = new ol.interaction.Modify({
      source: vectorSource,
      pixelTolerance: 20,
    });

    map.addInteraction(dragInteraction);

    // Log the new position when the pin is dragged
    dragInteraction.on('modifyend', function (event) {
      const feature = event.features.getArray()[0];
      const coordinates = feature.getGeometry().getCoordinates();
      const lonLat = ol.proj.toLonLat(coordinates);
      const [longitude, latitude] = lonLat;
      onChange({ latitude, longitude });
    });
  }, [addInteraction, addLayer, map, onChange, latitude, longitude, ol]);

  return null;
}

const TileSetLoader = (props) => {
  const [tileWMSSources, setTileWMSSources] = useState([]);
  const { ol } = props;

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
  }, [ol]);

  return tileWMSSources ? (
    <MapContainer {...props} source={tileWMSSources[0]} />
  ) : null;
};

const MapContainer = (props) => {
  const { longitude, latitude, source, onChange, ol } = props;
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
        <PinInteraction
          ol={ol}
          latitude={latitude}
          longitude={longitude}
          onChange={onChange}
        />
        <Interactions
          doubleClickZoom={true}
          dragAndDrop={true}
          dragPan={true}
          keyboardPan={true}
          keyboardZoom={true}
          mouseWheelZoom={true}
          pointer={true}
          select={true}
        />
        <Layer.Tile source={source} zIndex={0} />
      </Layers>
    </Map>
  );
};

export default withOpenLayers(TileSetLoader);
