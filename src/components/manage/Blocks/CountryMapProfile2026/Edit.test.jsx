import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountryMapProfile2026Edit from './Edit';

jest.mock('./View', () => (props) => (
  <div data-testid="map-view">{props.mode}</div>
));

it('renders the map view in edit mode', () => {
  render(<CountryMapProfile2026Edit />);
  expect(screen.getByTestId('map-view')).toHaveTextContent('edit');
});
