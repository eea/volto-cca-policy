import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextArea, Radio, Checkbox, Dropdown, Input } from 'semantic-ui-react';
import {
  ACE_COUNTRIES,
  BIOREGIONS,
  SUBNATIONAL_REGIONS,
} from '@eeacms/volto-cca-policy/helpers';

import { injectIntl } from 'react-intl';
import { FormFieldWrapper } from '@plone/volto/components';

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
    <div className="select-countries ui segment">
      <h5>Countries</h5>
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

const MACRO_TRANS_REGIONS = Object.entries(BIOREGIONS)
  .map(([key, value]) => ({
    key,
    value,
    text: value,
  }))
  .filter((macro) => macro.key.startsWith('TRANS_MACRO_'))
  .sort((a, b) => a.text.localeCompare(b.name));

const SelectMacroTransnationalRegions = (props) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleSelectChange = (e, { value }) => {
    setSelectedValues(value);
  };

  return (
    <div className="select-macro-trans-regions ui segment">
      <h5>Macro-Transnational Regions</h5>
      <Dropdown
        placeholder="Macro-Transnational Regions"
        fluid
        multiple
        selection
        options={MACRO_TRANS_REGIONS}
        value={selectedValues}
        onChange={handleSelectChange}
      />
    </div>
  );
};

const BIOGEOGRAPHICAL_REGIONS = Object.entries(BIOREGIONS)
  .map(([key, value]) => ({
    key,
    value,
    text: value,
  }))
  .filter((macro) => macro.key.startsWith('TRANS_BIO_'))
  .sort((a, b) => a.text.localeCompare(b.name));

const SelectBiogeographicalRegions = (props) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleSelectChange = (e, { value }) => {
    setSelectedValues(value);
  };

  return (
    <div className="select-biogeographical-regions ui segment">
      <h5>Biogeographical Regions</h5>
      <Dropdown
        placeholder="Biogeographical Regions"
        fluid
        multiple
        selection
        options={BIOGEOGRAPHICAL_REGIONS}
        value={selectedValues}
        onChange={handleSelectChange}
      />
    </div>
  );
};

const SUBNATIONAL_REGIONS_OPTIONS = Object.entries(SUBNATIONAL_REGIONS)
  .map(([key, value]) => ({
    key,
    value,
    text: value,
  }))
  .sort((a, b) => a.text.localeCompare(b.name));

const SelectSubnationalRegions = (props) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleSelectChange = (e, { value }) => {
    setSelectedValues(value);
  };

  return (
    <div className="select-subnational-regions ui segment">
      <h5>Subnational Regions</h5>
      <Dropdown
        placeholder="Subnational Regions"
        fluid
        multiple
        selection
        options={SUBNATIONAL_REGIONS_OPTIONS}
        value={selectedValues}
        onChange={handleSelectChange}
      />
    </div>
  );
};

const SelectCity = (props) => {
  const [selectedCity, setSelectedCity] = useState('');

  const handleSelectChange = (e, { value }) => {
    setSelectedCity(value);
  };

  return (
    <div className="select-city ui segment">
      <h5>Municipality Name</h5>
      <Input
        type="text"
        placeholder=""
        value={selectedCity}
        onChange={handleSelectChange}
      />
    </div>
  );
};

const GeocharsWidget = (props) => {
  const { id, value, onChange, placeholder } = props;
  const [isGlobal, setIsGlobal] = useState(false);

  const geoElements = JSON.parse(value).geoElements;
  const element = geoElements.element;
  const countries = geoElements.countries;

  const getJSON = () => {
    return JSON.parse(value);
  };

  const updateJSON = (value) => {
    return JSON.stringify(value);
  };

  const onhandleChange = (id, value) => {
    onChange(id, value);
  };

  const handleIsGlobal = (e, { value }) => {
    setIsGlobal(value === 'GLOBAL');
    let valueJSON = getJSON();
    valueJSON.geoElements.element = value;
    onChange(id, updateJSON(valueJSON));
  };

  React.useEffect(() => {
    setIsGlobal(element === 'GLOBAL');
  }, [element]);

  return (
    <FormFieldWrapper {...props} className="textarea">
      <div className="select-element ui segment">
        <h5>Select the characterisation for this item</h5>
        <Radio
          label="Global"
          name="radioGroup"
          value="GLOBAL"
          checked={isGlobal}
          onChange={handleIsGlobal}
        />
        <Radio
          label="Europe"
          name="radioGroup"
          value="EUROPE"
          checked={!isGlobal}
          onChange={handleIsGlobal}
        />
      </div>
      {!isGlobal && (
        <>
          <SelectMacroTransnationalRegions selectedValues={[]} />
          <SelectBiogeographicalRegions selectedValues={[]} />
          <SelectCountries selectedCountries={countries} />
          <SelectSubnationalRegions selectedValues={[]} />
          <SelectCity value={''} />
        </>
      )}
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
