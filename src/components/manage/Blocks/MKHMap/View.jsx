import React from 'react';
import { Form, Radio } from 'semantic-ui-react';
import {
  Controls,
  Interactions,
  Layer,
  Map,
  Layers,
} from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';

import * as layers from './layers';
import FeatureInteraction from './FeatureInteraction';
import InfoOverlay from './InfoOverlay';
// import { v4 as uuid } from 'uuid';

import './style.less';

function SourceSelector(props) {
  const { id, choices, selected, onChange } = props;
  return (
    <Form>
      <Form.Field>
        <Radio
          key="all"
          label="All"
          name={id}
          value="all"
          checked={selected.length === choices.length}
          onChange={() => onChange(choices)}
        />
        {choices.map((name) => (
          <Radio
            key={name}
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

export default function View(props) {
  const [tileWMSSources, setTileWMSSources] = React.useState([]);
  const [selectedFeature, onFeatureSelect] = React.useState();

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

  const [sources, setSources] = React.useState([Object.keys(layers)[2]]);

  if (__SERVER__) return '';

  return (
    <div className="explore-sites-wrapper">
      <SourceSelector
        id="layer-selector"
        choices={Object.keys(layers)}
        selected={sources}
        onChange={setSources}
      />
      <div id="explore-sites">
        <Map
          view={{
            center: ol.proj.fromLonLat([20, 50]),
            showFullExtent: true,
            zoom: 5,
          }}
          pixelRatio={1}
          controls={ol.control.defaults({ attribution: false })}
        >
          <Layers>
            <InfoOverlay selectedFeature={selectedFeature} />
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
            <FeatureInteraction onFeatureSelect={onFeatureSelect} />
          </Layers>
        </Map>
      </div>
    </div>
  );
}
