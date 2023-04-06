import React from 'react';
import PropTypes from 'prop-types';
import { Input, TextArea } from 'semantic-ui-react';

import { injectIntl } from 'react-intl';
import { FormFieldWrapper } from '@plone/volto/components';

import {
  Controls,
  Interactions,
  Layer,
  Map,
  Layers,
} from '@eeacms/volto-openlayers-map/api';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';

const GeolocationWidget = (props) => {
  // const { id, value, onChange, placeholder } = props;
  const { id, value, placeholder } = props;

  // const onhandleChange = (id, value) => {
  //   onChange(id, value);
  // };

  const [tileWMSSources, setTileWMSSources] = React.useState([]);
  const [latitude, setLatitude] = React.useState(value.latitude);
  const [longitude, setLongitude] = React.useState(value.longitude);

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

  if (__SERVER__) return '';

  return (
    <FormFieldWrapper {...props} className="geolocation-field">
      <Input
        type="number"
        placeholder="latitude"
        value={latitude}
        onChange={(ev) => {
          setLatitude(ev.target.value);
        }}
      />
      <Input
        type="number"
        placeholder="longitude"
        value={longitude}
        onChange={(ev) => {
          setLongitude(ev.target.value);
        }}
      />
      <div className="explore-sites-wrapper">
        <div id="explore-sites">
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
              <Layer.Tile source={tileWMSSources[0]} zIndex={0} />
            </Layers>
          </Map>
        </div>
      </div>
      <TextArea
        id={`field-${id}`}
        name={id}
        disabled={true}
        placeholder={placeholder}
      />
    </FormFieldWrapper>
  );
};

GeolocationWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.object,
  onChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  wrapped: PropTypes.bool,
  placeholder: PropTypes.string,
};

GeolocationWidget.defaultProps = {
  description: null,
  required: false,
  error: [],
  value: null,
  onChange: null,
  onEdit: null,
  onDelete: null,
};

export default injectIntl(GeolocationWidget);
