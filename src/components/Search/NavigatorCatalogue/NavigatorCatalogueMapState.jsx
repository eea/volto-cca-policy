import React from 'react';
import { Button } from 'semantic-ui-react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

const messages = defineMessages({
  countrySelectionRequired: {
    id: 'Map view is only applicable when countries are selected in the <strong>Geographic coverage</strong>.',
    defaultMessage:
      'Map view is only applicable when countries are selected in the <strong>Geographic coverage</strong>.',
  },
  clearGeographicCoverageFilters: {
    id: 'Clear other geographic coverage filters to enable the map.',
    defaultMessage:
      'Clear other geographic coverage filters to enable the map.',
  },
  clearGeographicCoverageFiltersButton: {
    id: 'Clear filters',
    defaultMessage: 'Clear filters',
  },
  selectCountryForMap: {
    id: 'Select a country to explore the map',
    defaultMessage: 'Select a country to explore the map',
  },
});

const NavigatorCatalogueMapState = ({ children, isMapDisabled, onClear }) => {
  const intl = useIntl();

  return (
    <div
      className={`navigator-catalogue-map-state${
        isMapDisabled ? ' is-disabled' : ''
      }`}
      aria-disabled={isMapDisabled || undefined}
    >
      <div
        className="navigator-catalogue-map-content"
        aria-hidden={isMapDisabled || undefined}
        inert={isMapDisabled ? '' : undefined}
      >
        {children}
      </div>

      {isMapDisabled && (
        <div className="navigator-catalogue-map-overlay">
          <div className="navigator-catalogue-map-notice" role="status">
            <h4>{intl.formatMessage(messages.selectCountryForMap)}</h4>
            <p>
              <FormattedMessage
                {...messages.countrySelectionRequired}
                values={{ strong: (text) => <strong>{text}</strong> }}
              />
            </p>
            <p>
              <FormattedMessage {...messages.clearGeographicCoverageFilters} />
            </p>
            <Button
              className="primary map-notice-clear-button"
              onClick={onClear}
            >
              {intl.formatMessage(
                messages.clearGeographicCoverageFiltersButton,
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigatorCatalogueMapState;
