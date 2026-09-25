import React from 'react';
import { Icon } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';
import { Term } from '@eeacms/search/components';
import { useSearchContext } from '@eeacms/search/lib/hocs';
import { markSelectedFacetValuesFromFilters } from '@eeacms/search/lib/search/helpers';

export const CHARACTERISATION_FIELD = 'cca_geographic_characterisation.keyword';
export const TRANSNATIONAL_REGION_FIELD =
  'cca_geographic_transnational_region.keyword';
export const COUNTRIES_FIELD = 'cca_geographic_countries.keyword';

const messages = defineMessages({
  transnationalRegions: {
    id: 'Macro-Transnational region',
    defaultMessage: 'Macro-Transnational region',
  },
  countries: { id: 'Countries', defaultMessage: 'Countries' },
});

const valueAsText = (value) =>
  value && typeof value === 'object' && value.name
    ? value.name
    : String(value ?? '');

export const getFacetOptions = (facets, filters, field) => {
  const facetValue = facets?.[field];
  const facet = Array.isArray(facetValue) ? facetValue[0] : facetValue;

  return facet?.data
    ? markSelectedFacetValuesFromFilters(facet, filters || [], field, 'any')
        .data
    : [];
};

const FacetOption = ({ field, option, onChange }) => {
  const intl = useIntl();
  const value = valueAsText(option.value);
  const inputId = `navigator-geographic-${field}-${value}`.replace(
    /[^a-zA-Z0-9_-]/g,
    '-',
  );

  return (
    <label htmlFor={inputId} className="sui-multi-checkbox-facet__option-label">
      <span className="sui-multi-checkbox-facet__option-input-wrapper">
        <input
          id={inputId}
          type="checkbox"
          aria-label={value}
          className="sui-multi-checkbox-facet__checkbox"
          checked={Boolean(option.selected)}
          onChange={() => onChange(option)}
        />
        <span className="checkmark" />
        <span className="sui-multi-checkbox-facet__input-text">
          <Term
            term={intl.formatMessage({
              id: value || 'no-id',
              defaultMessage: value,
            })}
            field={field}
          />
        </span>
      </span>
      <span className="sui-multi-checkbox-facet__option-count">
        ({Number(option.count || 0).toLocaleString('en')})
      </span>
    </label>
  );
};

const ExpandableFacetGroup = ({ field, id, label, options, onChange }) => {
  const hasSelection = options.some(({ selected }) => selected);
  const [isOpen, setIsOpen] = React.useState(hasSelection);

  React.useEffect(() => {
    if (hasSelection) setIsOpen(true);
  }, [hasSelection]);

  return (
    <div className="navigator-geographic-facet-group">
      <button
        type="button"
        className="navigator-geographic-facet-group-toggle"
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{label}</span>
        <Icon name={isOpen ? 'chevron up' : 'chevron down'} />
      </button>
      {isOpen && options.length > 0 && (
        <div id={id} className="sui-multi-checkbox-facet">
          {options.map((option) => (
            <FacetOption
              key={valueAsText(option.value)}
              field={field}
              option={option}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const NavigatorGeographicCoverageFacet = ({
  className = '',
  onRemove,
  onSelect,
  options = [],
}) => {
  const intl = useIntl();
  const { addFilter, facets, filters, removeFilter } = useSearchContext();
  const transnationalOptions = getFacetOptions(
    facets,
    filters,
    TRANSNATIONAL_REGION_FIELD,
  );
  const countryOptions = getFacetOptions(facets, filters, COUNTRIES_FIELD);

  const updateChildFilter = (field, option) =>
    option.selected
      ? removeFilter(field, option.value, 'any')
      : addFilter(field, option.value, 'any');

  return (
    <fieldset
      className={`sui-facet searchlib-multiterm-facet navigator-geographic-facet ${className}`}
    >
      <div className="sui-multi-checkbox-facet navigator-geographic-facet-direct-options">
        {options.map((option) => (
          <FacetOption
            key={valueAsText(option.value)}
            field={CHARACTERISATION_FIELD}
            option={option}
            onChange={(selectedOption) =>
              selectedOption.selected
                ? onRemove(selectedOption.value)
                : onSelect(selectedOption.value)
            }
          />
        ))}
      </div>
      <ExpandableFacetGroup
        field={TRANSNATIONAL_REGION_FIELD}
        id="navigator-geographic-transnational-regions"
        label={intl.formatMessage(messages.transnationalRegions)}
        options={transnationalOptions}
        onChange={(option) =>
          updateChildFilter(TRANSNATIONAL_REGION_FIELD, option)
        }
      />
      <ExpandableFacetGroup
        field={COUNTRIES_FIELD}
        id="navigator-geographic-countries"
        label={intl.formatMessage(messages.countries)}
        options={countryOptions}
        onChange={(option) => updateChildFilter(COUNTRIES_FIELD, option)}
      />
    </fieldset>
  );
};

export default NavigatorGeographicCoverageFacet;
