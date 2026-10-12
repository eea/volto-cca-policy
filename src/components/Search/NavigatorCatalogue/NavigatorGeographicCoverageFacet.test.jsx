import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { useSearchContext, useViews } from '@eeacms/search/lib/hocs';
import NavigatorGeographicCoverageFacet from './NavigatorGeographicCoverageFacet';
import {
  CHARACTERISATION_FIELD,
  COUNTRIES_FIELD,
  TRANSNATIONAL_REGION_FIELD,
} from '../../../search/navigator_catalogue/geographicCoverage';

jest.mock('@eeacms/search/components', () => ({
  Term: ({ term }) => <>{term}</>,
}));
jest.mock('@eeacms/search/lib/hocs', () => ({
  useSearchContext: jest.fn(),
  useViews: jest.fn(),
}));

const renderFacet = ({
  activeViewId = 'listing',
  detailedOptions = true,
  filters = [],
  onRemove = jest.fn(),
  onSelect = jest.fn(),
} = {}) => {
  const addFilter = jest.fn();
  const removeFilter = jest.fn();

  useViews.mockReturnValue({ activeViewId });

  useSearchContext.mockReturnValue({
    addFilter,
    removeFilter,
    filters,
    facets: {
      [TRANSNATIONAL_REGION_FIELD]: [
        {
          data: detailedOptions
            ? [
                { value: 'Alpine Space', count: 3 },
                { value: 'Outermost regions', count: 2 },
              ]
            : [],
        },
      ],
      [COUNTRIES_FIELD]: [
        {
          data: detailedOptions
            ? [
                { value: 'Germany', count: 4 },
                { value: 'Spain', count: 2 },
              ]
            : [],
        },
      ],
    },
  });

  render(
    <IntlProvider locale="en">
      <NavigatorGeographicCoverageFacet
        countriesLabel={{ id: 'Countries', defaultMessage: 'Countries' }}
        onRemove={onRemove}
        onSelect={onSelect}
        transnationalRegionsLabel={{
          id: 'Transnational regions',
          defaultMessage: 'Transnational regions',
        }}
        options={[
          { value: 'Europe', count: 8, selected: false },
          { value: 'Global', count: 5, selected: false },
        ]}
      />
    </IntlProvider>,
  );

  return { addFilter, onRemove, onSelect, removeFilter };
};

describe('NavigatorGeographicCoverageFacet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows Global and Europe as direct options', () => {
    renderFacet();

    expect(
      screen
        .getAllByRole('checkbox')
        .slice(0, 2)
        .map((option) => option.getAttribute('aria-label')),
    ).toEqual(['Europe', 'Global']);
  });

  it('clears detailed coverage before selecting a direct scope', () => {
    const { onSelect, removeFilter } = renderFacet({
      filters: [
        {
          field: COUNTRIES_FIELD,
          values: ['Germany'],
          type: 'any',
        },
      ],
    });

    fireEvent.click(screen.getByLabelText('Europe'));

    expect(removeFilter).toHaveBeenCalledWith(COUNTRIES_FIELD, null, 'any');
    expect(removeFilter).toHaveBeenCalledWith(
      TRANSNATIONAL_REGION_FIELD,
      null,
      'any',
    );
    expect(onSelect).toHaveBeenCalledWith('Europe');
  });

  it('expands and filters Macro-Transnational region values', () => {
    const { addFilter } = renderFacet();

    fireEvent.click(
      screen.getByRole('button', { name: 'Transnational regions' }),
    );
    fireEvent.click(screen.getByLabelText('Outermost regions'));

    expect(addFilter).toHaveBeenCalledWith(
      TRANSNATIONAL_REGION_FIELD,
      'Outermost regions',
      'any',
    );
  });

  it('opens Countries when it contains an active selection and removes it', () => {
    const { removeFilter } = renderFacet({
      filters: [
        {
          field: COUNTRIES_FIELD,
          values: ['Germany'],
          type: 'any',
        },
      ],
    });

    fireEvent.click(screen.getByLabelText('Germany'));

    expect(removeFilter).toHaveBeenCalledWith(
      COUNTRIES_FIELD,
      'Germany',
      'any',
    );
  });

  it('shows empty detailed coverage groups while Europe is selected', () => {
    const { onRemove } = renderFacet({
      detailedOptions: false,
      filters: [
        {
          field: CHARACTERISATION_FIELD,
          values: ['Europe'],
          type: 'any',
        },
      ],
    });

    expect(screen.getByLabelText('Europe')).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'Countries' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Transnational regions' }),
    );

    expect(screen.getAllByText('No options available.')).toHaveLength(2);

    fireEvent.click(screen.getByLabelText('Europe'));

    expect(onRemove).toHaveBeenCalledWith('Europe');
  });

  it('keeps detailed coverage available when a country is selected', () => {
    renderFacet({
      filters: [
        {
          field: COUNTRIES_FIELD,
          values: ['Germany'],
          type: 'any',
        },
      ],
    });

    expect(screen.getByRole('button', { name: 'Countries' })).toBeEnabled();
    expect(screen.getByLabelText('Germany')).toBeEnabled();
    expect(
      screen.getByRole('button', { name: 'Transnational regions' }),
    ).toBeEnabled();
  });

  it('shows only countries in the map view', () => {
    renderFacet({ activeViewId: 'map' });

    expect(screen.queryByLabelText('Europe')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Global')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Countries' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByLabelText('Germany')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Transnational regions' }),
    ).not.toBeInTheDocument();
  });

  it('clears hidden geographic filters when selecting a country on the map', () => {
    const { addFilter, removeFilter } = renderFacet({
      activeViewId: 'map',
      filters: [
        {
          field: TRANSNATIONAL_REGION_FIELD,
          values: ['Alpine Space'],
          type: 'any',
        },
      ],
    });

    fireEvent.click(screen.getByLabelText('Germany'));

    expect(removeFilter).toHaveBeenCalledWith(
      CHARACTERISATION_FIELD,
      null,
      'any',
    );
    expect(removeFilter).toHaveBeenCalledWith(
      TRANSNATIONAL_REGION_FIELD,
      null,
      'any',
    );
    expect(addFilter).toHaveBeenCalledWith(COUNTRIES_FIELD, 'Germany', 'any');
  });

  it('shows hidden active geographic filters in the map view', () => {
    renderFacet({
      activeViewId: 'map',
      detailedOptions: false,
      filters: [
        {
          field: CHARACTERISATION_FIELD,
          values: ['Europe'],
          type: 'any',
        },
      ],
    });

    expect(screen.queryByLabelText('Europe')).not.toBeInTheDocument();
    expect(screen.getByText('Active filters:')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
  });
});
