import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextArea, Radio } from 'semantic-ui-react';

import { injectIntl } from 'react-intl';
import { FormFieldWrapper } from '@plone/volto/components';

export const GlobalLocal = (props) => {
  const [value, setValue] = useState(null);
  const handleChange = (event, { value }) => setValue(value);
  const { element } = props;

  React.useEffect(() => {
    if (element) {
      setValue(element);
    }
  }, [element]);

  return (
    <>
      <Radio
        label="Global"
        name="radioGroup"
        value="GLOBAL"
        checked={value === 'GLOBAL'}
        onChange={handleChange}
      />
      <Radio
        label="Europe"
        name="radioGroup"
        value="EUROPE"
        checked={value === 'EUROPE'}
        onChange={handleChange}
      />
    </>
  );
};

const GeocharsWidget = (props) => {
  const { id, value, onChange, placeholder } = props;

  const geoElements = JSON.parse(value).geoElements;
  const element = geoElements.element;

  const onhandleChange = (id, value) => {
    onChange(id, value);
  };

  return (
    <FormFieldWrapper {...props} className="textarea">
      <GlobalLocal element={element} />
      <TextArea
        id={`field-${id}`}
        name={id}
        value={value || ''}
        disabled={props.isDisabled}
        placeholder={placeholder}
        onChange={({ target }) =>
          onhandleChange(id, target.value === '' ? undefined : target.value)
        }
      />
    </FormFieldWrapper>
  );
};

GeocharsWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  onChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  wrapped: PropTypes.bool,
  placeholder: PropTypes.string,
};

GeocharsWidget.defaultProps = {
  description: null,
  required: false,
  error: [],
  value: null,
  onChange: null,
  onEdit: null,
  onDelete: null,
};

export default injectIntl(GeocharsWidget);
