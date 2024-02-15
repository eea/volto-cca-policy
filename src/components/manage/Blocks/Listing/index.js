import OrganisationCardsListingView from './OrganisationCardsListingView';
import IndicatorCardsListingView from './IndicatorCardsListingView';

export default function installListing(config) {
  config.blocks.blocksConfig.listing = {
    ...config.blocks.blocksConfig.listing,
    variations: [
      ...config.blocks.blocksConfig.listing.variations,
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
    ],
  };

  return config;
}
