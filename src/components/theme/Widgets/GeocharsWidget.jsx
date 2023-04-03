import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextArea, Radio, Checkbox, Dropdown, Input } from 'semantic-ui-react';
import {
  WIDGET_COUNTRIES,
  WIDGET_MACRO_TRANS_REGIONS,
  WIDGET_BIOGEOGRAPHICAL_REGIONS,
  WIDGET_SUBNATIONAL_REGIONS_OPTIONS,
} from '@eeacms/volto-cca-policy/helpers';

import { injectIntl } from 'react-intl';
import { FormFieldWrapper } from '@plone/volto/components';

const SelectElement = (props) => {
  const { element, handleSelect } = props;
  return (
    <div className="select-element ui segment">
      <h5>Select the characterisation for this item</h5>
      <Radio
        label="Global"
        name="radioGroup"
        value="GLOBAL"
        checked={element}
        onChange={handleSelect}
      />
      <Radio
        label="Europe"
        name="radioGroup"
        value="EUROPE"
        checked={!element}
        onChange={handleSelect}
      />
    </div>
  );
};

const SelectSubRegions = (props) => {
  const { regions, availableRegions, handleSelect } = props;
  return (
    <div className="select-subnational-regions ui segment">
      <h5>Subnational Regions</h5>
      <Dropdown
        placeholder="Subnational Regions"
        fluid
        multiple
        selection
        options={availableRegions}
        value={regions}
        onChange={handleSelect}
      />
    </div>
  );
};

const SelectCity = (props) => {
  const { city, handleSelect } = props;
  return (
    <div className="select-city ui segment">
      <h5>Municipality Name</h5>
      <Input type="text" placeholder="" value={city} onChange={handleSelect} />
    </div>
  );
};

const SelectMacroRegions = (props) => {
  const { regions, handleSelect } = props;
  return (
    <div className="select-macro-trans-regions ui segment">
      <h5>Macro-Transnational Regions</h5>
      <Dropdown
        placeholder="Macro-Transnational Regions"
        fluid
        multiple
        selection
        options={WIDGET_MACRO_TRANS_REGIONS}
        value={regions}
        onChange={handleSelect}
      />
    </div>
  );
};

const SelectBioRegions = (props) => {
  const { regions, handleSelect } = props;
  return (
    <div className="select-biogeographical-regions ui segment">
      <h5>Biogeographical Regions</h5>
      <Dropdown
        placeholder="Biogeographical Regions"
        fluid
        multiple
        selection
        options={WIDGET_BIOGEOGRAPHICAL_REGIONS}
        value={regions}
        onChange={handleSelect}
      />
    </div>
  );
};

const SelectCountries = (props) => {
  const { countries, handleSelect } = props;
  return (
    <div className="select-countries ui segment">
      <h5>Countries</h5>
      <p>Select one or more European Union countries covered by this item</p>
      {WIDGET_COUNTRIES.map((country) => (
        <Checkbox
          key={country.code}
          value={country.code}
          label={country.name}
          checked={countries.includes(country.code)}
          onChange={handleSelect}
        />
      ))}
    </div>
  );
};

const GeocharsWidget = (props) => {
  const { id, value, onChange, placeholder } = props;
  const [tempJSON, setTempJSON] = useState(null);
  const [isGlobal, setIsGlobal] = useState(false);
  const [selectedMacroRegions, setSelectedMacroRegions] = useState([]);
  const [selectedBioRegions, setSelectedBioRegions] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedSubRegions, setSelectedSubRegions] = useState([]);
  const [availableRegions, setAvailableRegions] = useState(
    WIDGET_SUBNATIONAL_REGIONS_OPTIONS,
  );
  const [selectedCity, setSelectedCity] = useState('');

  const geoElements = JSON.parse(value).geoElements;
  const element = geoElements.element;
  const countries = geoElements.countries;
  const macroRegions = geoElements.macrotrans;
  const bioRegions = geoElements.biotrans;
  const subRegions = geoElements.subnational;
  const city = geoElements.city;

  const DEFAULT_GEOCHARS = {
    geoElements: {
      element: 'GLOBAL',
      macrotrans: [],
      biotrans: [],
      countries: [],
      subnational: [],
      city: '',
    },
  };

  const getJSON = () => {
    return JSON.parse(value);
  };

  const updateJSON = (value) => {
    return JSON.stringify(value);
  };

  const onhandleChange = (id, value) => {
    onChange(id, value);
  };

  const updateTextarea = (value) => {
    const textarea = document.getElementById('field-geochars');
    textarea.value = value;
  };

  const handleIsGlobal = (e, { value }) => {
    setIsGlobal(value === 'GLOBAL');
    let valueJSON = getJSON();
    if (value === 'GLOBAL') {
      setTempJSON(valueJSON);
      valueJSON = DEFAULT_GEOCHARS;
    } else {
      if (tempJSON !== null) {
        valueJSON = tempJSON;
        setTempJSON(null);
      }
    }
    valueJSON.geoElements.element = value;
    let updated = updateJSON(valueJSON);
    onChange(id, updated);
    updateTextarea(updated);
  };

  const handleMacroRegions = (e, { value }) => {
    setSelectedMacroRegions(value);
    let valueJSON = getJSON();
    valueJSON.geoElements.macrotrans = value;
    let updated = updateJSON(valueJSON);
    onChange(id, updated);
    updateTextarea(updated);
  };

  const handleBioRegions = (e, { value }) => {
    setSelectedBioRegions(value);
    let valueJSON = getJSON();
    valueJSON.geoElements.biotrans = value;
    let updated = updateJSON(valueJSON);
    onChange(id, updated);
    updateTextarea(updated);
  };

  const handleSubRegions = (e, { value }) => {
    setSelectedSubRegions(value);
    let valueJSON = getJSON();
    valueJSON.geoElements.subnational = value;
    let updated = updateJSON(valueJSON);
    onChange(id, updated);
    updateTextarea(updated);
  };

  const isRegionOfCountries = (region, countries) => {
    for (let country of countries) {
      if (region.key.includes('_' + country)) {
        return true;
      }
    }
    return false;
  };

  const isSelectedRegion = (region) => {
    return selectedSubRegions.includes(region.key);
  };

  const handleCountries = (e, { value }) => {
    let updated = [];
    if (selectedCountries.includes(value)) {
      updated = selectedCountries.filter((country) => country !== value);
    } else {
      updated = [...selectedCountries, value];
    }
    setSelectedCountries(updated);
    setAvailableRegions(
      WIDGET_SUBNATIONAL_REGIONS_OPTIONS.filter(
        (reg) => isRegionOfCountries(reg, updated) || isSelectedRegion(reg),
      ),
    );
    let valueJSON = getJSON();
    valueJSON.geoElements.countries = updated;
    updated = updateJSON(valueJSON);
    onChange(id, updated);
    updateTextarea(updated);
  };

  const handleSelectCity = (e, { value }) => {
    setSelectedCity(value);
    let valueJSON = getJSON();
    valueJSON.geoElements.city = value;
    let updated = updateJSON(valueJSON);
    onChange(id, updated);
    updateTextarea(updated);
  };

  React.useEffect(() => {
    setIsGlobal(element === 'GLOBAL');
  }, [element]);

  React.useEffect(() => {
    if (countries !== selectedCountries) {
      setSelectedCountries(countries);
    }
    if (macroRegions !== selectedMacroRegions) {
      setSelectedMacroRegions(macroRegions);
    }
    if (bioRegions !== selectedBioRegions) {
      setSelectedBioRegions(bioRegions);
    }
    if (subRegions !== selectedSubRegions) {
      setSelectedSubRegions(subRegions);
    }
    if (city !== selectedCity) {
      setSelectedCity(city);
    }
    updateTextarea(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormFieldWrapper {...props} className="geochars-field">
      <SelectElement element={isGlobal} handleSelect={handleIsGlobal} />
      {!isGlobal && (
        <>
          <SelectMacroRegions
            regions={selectedMacroRegions}
            handleSelect={handleMacroRegions}
          />
          <SelectBioRegions
            regions={selectedBioRegions}
            handleSelect={handleBioRegions}
          />
          <SelectCountries
            countries={selectedCountries}
            handleSelect={handleCountries}
          />
          <SelectSubRegions
            regions={selectedSubRegions}
            availableRegions={availableRegions}
            handleSelect={handleSubRegions}
          />
          <SelectCity city={selectedCity} handleSelect={handleSelectCity} />
        </>
      )}
      <TextArea
        style={{ display: 'none' }}
        id={`field-${id}`}
        name={id}
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
