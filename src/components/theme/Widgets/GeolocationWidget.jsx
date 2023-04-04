import React from 'react';
import PropTypes from 'prop-types';
import { TextArea } from 'semantic-ui-react';

import { injectIntl } from 'react-intl';
import { FormFieldWrapper } from '@plone/volto/components';

const GeolocationWidget = (props) => {
  // const { id, value, onChange, placeholder } = props;
  const { id, value, placeholder } = props;

  // const onhandleChange = (id, value) => {
  //   onChange(id, value);
  // };

  const latitude = value.latitude;
  const longitude = value.longitude;

  return (
    <FormFieldWrapper {...props} className="geolocation-field">
      <h5>
        {latitude}, {longitude}
      </h5>
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
