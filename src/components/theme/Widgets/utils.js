import {
  ACE_COUNTRIES,
  BIOREGIONS,
  SUBNATIONAL_REGIONS,
  EU_COUNTRIES,
} from '@eeacms/volto-cca-policy/helpers';

export const WIDGET_COUNTRIES = Object.entries(ACE_COUNTRIES)
  .map(([code, name]) => ({
    code,
    name,
    label: 'chk_countries_' + code,
  }))
  .filter((country) => EU_COUNTRIES.includes(country.code))
  .sort((a, b) => a.name.localeCompare(b.name));

export const WIDGET_MACRO_TRANS_REGIONS = Object.entries(BIOREGIONS)
  .map(([key, value]) => ({
    key,
    value: key,
    text: value,
  }))
  .filter((macro) => macro.key.startsWith('TRANS_MACRO_'))
  .sort((a, b) => a.text.localeCompare(b.name));

export const WIDGET_BIOGEOGRAPHICAL_REGIONS = Object.entries(BIOREGIONS)
  .map(([key, value]) => ({
    key,
    value: key,
    text: value,
  }))
  .filter((macro) => macro.key.startsWith('TRANS_BIO_'))
  .sort((a, b) => a.text.localeCompare(b.name));

export const WIDGET_SUBNATIONAL_REGIONS_OPTIONS = Object.entries(
  SUBNATIONAL_REGIONS,
)
  .map(([key, value]) => ({
    key,
    value: key,
    text: value,
  }))
  .sort((a, b) => a.text.localeCompare(b.name));
