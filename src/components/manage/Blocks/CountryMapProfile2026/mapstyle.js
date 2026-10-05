import { makeStyles as makeCountryMapStyles } from '../CountryMapProfile/mapstyle';

export const makeStyles = (highlight, selectedCountry, ol) =>
  makeCountryMapStyles(highlight, ol, {
    selectedCountry,
    countriesCoopereting: ['UA', 'MD', 'RS', 'BA', 'MK', 'ME', 'AL', 'XK'],
    countriesEastern: ['MO', 'GE'],
  });
