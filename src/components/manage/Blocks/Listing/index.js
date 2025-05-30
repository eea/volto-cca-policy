import OrganisationCardsListingView from './OrganisationCardsListingView';
import IndicatorCardsListingView from './IndicatorCardsListingView';
import EventCardsListingView from './EventCardsListingView';
import DropdownListingView from './DropdownListingView';
import EventAccordionListingView from './EventAccordionListingView';

export default function installListing(config) {
  config.blocks.blocksConfig.listing = {
    ...config.blocks.blocksConfig.listing,
    variations: [
      ...config.blocks.blocksConfig.listing.variations,
      {
        id: 'dropdown',
        title: 'Dropdown',
        template: DropdownListingView,
        isDefault: false,
        fullobjects: true,
        schemaEnhancer: ({ schema }) => {
          schema.properties.placeholder_text = {
            title: 'Placeholder text',
          };
          schema.fieldsets[0].fields.push('placeholder_text');
          return schema;
        },
      },
      {
        id: 'organisationCards',
        title: 'Organisation Cards',
        template: OrganisationCardsListingView,
        isDefault: false,
        fullobjects: true,
      },
      {
        id: 'indicatorCards',
        title: 'Indicator Cards',
        template: IndicatorCardsListingView,
        isDefault: false,
        fullobjects: true,
      },
      {
        id: 'eventCards',
        title: 'Event Cards',
        template: EventCardsListingView,
        isDefault: false,
        fullobjects: true,
      },
      {
        id: 'eventAccordion',
        title: 'Event Accordion',
        template: EventAccordionListingView,
        isDefault: false,
        fullobjects: true,
      },
    ],
  };

  return config;
}
