import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import config from '@plone/volto/registry';

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

const defaultValue = {
  latitude: 55.6761,
  longitude: 12.5683,
};

const GeolocationWidget = (props) => {
  const { id, value, onChange } = props;

  const [tileWMSSources, setTileWMSSources] = useState([]);
  const [address, setAddress] = useState('');

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const url = `https://nominatim.openstreetmap.org/search?q=${address}&format=json`;

    const { corsProxyPath = '/cors-proxy', host, port } = config.settings;
    const base = __SERVER__
      ? `http://${host}:${port}`
      : `${window.location.protocol}//${window.location.host}`;

    const path = `${base}${corsProxyPath}/${url}`;

    let locations;
    try {
      const response = await fetch(path);
      locations = await response.json();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('error in fetching location', e);
    }

    if (locations?.length) {
      const { lat, lon } = locations[0];
      onChange(id, { latitude: lat, longitude: lon });
    }
  };

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

  const lat = value?.latitude ?? defaultValue.latitude;
  const long = value?.longitude ?? defaultValue.longitude;
  const mapKey = `${lat}_${long}`;

  return (
    <FormFieldWrapper {...props} className="geolocation-field">
      <div className="ui form">
        <div className="inline fields">
          <div className="field">
            <Input type="text" value={address} onChange={handleAddressChange} />
          </div>
          <div className="field">
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>
      <MapContainer
        key={mapKey}
        longitude={value?.longitude || defaultValue.longitude}
        latitude={value?.latitude || defaultValue.latitude}
        source={tileWMSSources[0]}
      />
      <div className="ui form">
        <div className="inline fields">
          <div className="field">
            <Input
              type="number"
              placeholder="latitude"
              value={value?.latitude || defaultValue.latitude}
              onChange={(e) =>
                onChange(id, { ...value, latitude: e.target.value })
              }
            />
          </div>
          <div className="field">
            <Input
              type="number"
              placeholder="longitude"
              value={value?.longitude || defaultValue.longitude}
              onChange={(e) =>
                onChange(id, { ...value, longitude: e.target.value })
              }
            />
          </div>
        </div>
      </div>
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
