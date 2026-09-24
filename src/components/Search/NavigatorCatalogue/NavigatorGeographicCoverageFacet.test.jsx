import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { useSearchContext } from '@eeacms/search/lib/hocs';
import NavigatorGeographicCoverageFacet, {
  COUNTRIES_FIELD,
  TRANSNATIONAL_REGION_FIELD,
} from './NavigatorGeographicCoverageFacet';

jest.mock('@eeacms/search/components', () => ({
  Term: ({ term }) => <>{term}</>,
}));
jest.mock('@eeacms/search/lib/hocs', () => ({
  useSearchContext: jest.fn(),
}));

const renderFacet = ({
  filters = [],
  onRemove = jest.fn(),
  onSelect = jest.fn(),
} = {}) => {
  const addFilter = jest.fn();
  const removeFilter = jest.fn();

  useSearchContext.mockReturnValue({
    addFilter,
    removeFilter,
    filters,
    facets: {
      [TRANSNATIONAL_REGION_FIELD]: [
        {
          data: [
            { value: 'Alpine Space', count: 3 },
            { value: 'Outermost regions', count: 2 },
          ],
        },
      ],
      [COUNTRIES_FIELD]: [
        {
          data: [
            { value: 'Germany', count: 4 },
            { value: 'Spain', count: 2 },
          ],
        },
      ],
    },
  });

  render(
    <IntlProvider locale="en">
      <NavigatorGeographicCoverageFacet
        onRemove={onRemove}
        onSelect={onSelect}
        options={[
          { value: 'Global', count: 5, selected: false },
          { value: 'Europe', count: 8, selected: false },
          {
            value: 'Macro-Transnational region',
            count: 4,
            selected: false,
          },
          { value: 'Countries', count: 6, selected: false },
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

  it('shows Globe and Europe as direct options and filters by the raw value', () => {
    const { onSelect } = renderFacet();

    expect(screen.getByText('Global')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Global'));

    expect(onSelect).toHaveBeenCalledWith('Global');
  });

  it('expands and filters Macro-Transnational region values', () => {
    const { addFilter } = renderFacet();

    fireEvent.click(
      screen.getByRole('button', { name: 'Macro-Transnational region' }),
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
});
