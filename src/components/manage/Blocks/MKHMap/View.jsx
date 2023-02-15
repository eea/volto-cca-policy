import React, { useState, useEffect } from 'react';
import { Form, Radio } from 'semantic-ui-react';
import {
  Controls,
  Interactions,
  Layer,
  Map,
  useMapContext,
} from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';

import * as layers from './layers';

import './style.less';

function SourceSelector(props) {
  const { id, choices, selected, onChange } = props;
  return (
    <Form>
      <Form.Field>
        <Radio
          label="All"
          name={id}
          value="all"
          checked={selected.length === choices.length}
          onChange={() => onChange(choices)}
        />
        {choices.map((name) => (
          <Radio
            label={name}
            name={id}
            value={name}
            checked={selected.length === 1 && selected.indexOf(name) > -1}
            onChange={() => onChange([name])}
          />
        ))}
      </Form.Field>
    </Form>
  );
}

function FeatureInteraction(props) {
  const { map } = useMapContext();

  const selected = React.useMemo(
    () =>
      new ol.style.Style({
        fill: new ol.style.Fill({
          color: '#eeeeee',
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255, 255, 255, 0.7)',
          width: 2,
        }),
      }),
    [],
  );

  const selectStyle = React.useCallback(
    (feature) => {
      const color = feature.get('COLOR') || '#eeeeee';
      selected.getFill().setColor(color);
      return selected;
    },
    [selected],
  );

  React.useEffect(() => {
    if (!map) return;
    const select = new ol.interaction.Select({
      condition: ol.condition.click,
      style: selectStyle,
    });
    map.addInteraction(select);
    select.on('select', function (e) {
      const features = e.target.getFeatures().getArray();
      features.forEach((feature) => {
        // const country_code = feature.get('CNTR_CODE');
        // const nuts_id = feature.get('NUTS_ID');
        // const nuts_name = feature.get('NUTS_NAME');
        // const level_code = feature.get('LEVEL_CODE');
        console.log(feature.values_);
      });
      // const clicked =
      // console.log({
      //   target: e.target,
      //   features: e.target.getFeatures(),
      //   event: e,
      // });
    });
    return () => map.removeInteraction(select);
  }, [map, selectStyle]);

  return null;
}

export default function View(props) {
  const [tileWMSSources, setTileWMSSources] = useState([]);

  useEffect(() => {
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

  const [sources, setSources] = React.useState([Object.keys(layers)[1]]);

  if (__SERVER__) return '';

  return (
    <div className="explore-sites-wrapper">
      <SourceSelector
        id="layer-selector"
        choices={Object.keys(layers)}
        selected={sources}
        onChange={setSources}
      />
      <div className="explore-sites">
        <Map
          view={{
            center: ol.proj.fromLonLat([20, 50]),
            showFullExtent: true,
            zoom: 5,
          }}
          pixelRatio={1}
          controls={ol.control.defaults({ attribution: false })}
        >
          <Controls attribution={false} zoom={false} />
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
          <Layer.Tile source={tileWMSSources[0]} zIndex={0} />
          {sources.map((name, index) => (
            <Layer.Vector
              key={name}
              title={name}
              zIndex={index}
              {...layers[name]}
            />
          ))}
          <FeatureInteraction />
        </Map>
      </div>
    </div>
  );
}
