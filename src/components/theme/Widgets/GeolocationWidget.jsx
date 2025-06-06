import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Label, Button } from 'semantic-ui-react';
import config from '@plone/volto/registry';

import { injectIntl } from 'react-intl';
import { FormFieldWrapper } from '@plone/volto/components';
import MapContainer from './GeolocationWidgetMapContainer';

const defaultValue = {
  latitude: 55.6761,
  longitude: 12.5683,
};

const GeolocationWidget = (props) => {
  const { id, value, onChange } = props;

  const [address, setAddress] = useState('');
  const [isFetching, setIsFetching] = useState();

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
    setIsFetching(true);
    try {
      const response = await fetch(path);
      locations = await response.json();
      setIsFetching(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('error in fetching location', e);
    }

    if (locations?.length) {
      const { lat, lon } = locations[0];
      onChange(id, { latitude: lat, longitude: lon });
    }
  };

  if (__SERVER__) return '';

  const lat = value?.latitude ?? defaultValue.latitude;
  const long = value?.longitude ?? defaultValue.longitude;
  const mapKey = `${lat}_${long}`;

  return (
    <FormFieldWrapper {...props} className="geolocation-field">
      <div className="ui form">
        <div className="inline fields">
          <div className="field">
            <Input
              type="text"
              value={address}
              onChange={handleAddressChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(e);
              }}
            />
          </div>
          <div className="field">
            <Button onClick={handleSearch}>
              {isFetching ? 'Loading' : 'Search'}
            </Button>
          </div>
        </div>
      </div>
      <MapContainer
        key={mapKey}
        longitude={value?.longitude || defaultValue.longitude}
        latitude={value?.latitude || defaultValue.latitude}
        onChange={({ latitude, longitude }) =>
          onChange(id, { ...value, longitude, latitude })
        }
      />
      <div className="ui form">
        <div className="inline fields">
          <div className="field">
            <Label>Latitude</Label>
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
            <Label>Longitude</Label>
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
