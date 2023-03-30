import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextArea, Radio, Checkbox } from 'semantic-ui-react';
import {
  ACE_COUNTRIES,
  // BIOREGIONS,
  // SUBNATIONAL_REGIONS,
} from '@eeacms/volto-cca-policy/helpers';

import { injectIntl } from 'react-intl';
import { FormFieldWrapper } from '@plone/volto/components';

export const SelectElement = (props) => {
  const [value, setValue] = useState(null);
  const handleChange = (event, { value }) => setValue(value);
  const { element } = props;

  React.useEffect(() => {
    if (element) {
      setValue(element);
    }
  }, [element]);

  return (
    <div className="select-element">
      <p>Select the characterisation for this item</p>
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
    </div>
  );
};

const COUNTRIES = Object.entries(ACE_COUNTRIES)
  .map(([code, name]) => ({
    code,
    name,
    label: 'chk_countries_' + code,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const SelectCountries = (props) => {
  const { selectedCountries } = props;

  return (
    <div className="select-countries">
      <h4>Countries</h4>
      <p>Select one or more European Union countries covered by this item</p>
      {COUNTRIES.map((country) => (
        <Checkbox
          key={country.code}
          value={country.label}
          label={country.name}
          checked={selectedCountries.includes(country.code)}
        />
      ))}
    </div>
  );
};

const GeocharsWidget = (props) => {
  const { id, value, onChange, placeholder } = props;

  const geoElements = JSON.parse(value).geoElements;
  const element = geoElements.element;
  const countries = geoElements.countries;

  const onhandleChange = (id, value) => {
    onChange(id, value);
  };

  return (
    <FormFieldWrapper {...props} className="textarea">
      <SelectElement element={element} />
      <SelectCountries selectedCountries={countries} />
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
