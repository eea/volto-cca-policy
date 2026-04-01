import { compose } from 'redux';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

import installECDEIndicatorsBlock from './ECDEIndicators';
import installCaseStudyExplorerBlock from './CaseStudyExplorer';
import installSearchAceContent from './SearchAceContent';
import installRelevantAceContent from './RelevantAceContent';
import installFilterAceContent from './FilterAceContent';
import installTransRegionSelect from './TransRegionSelect';
import installCountryMapObservatory from './CountryMapObservatory';
import installCountryProfileDetail from './CountryProfileDetail';
import installListing from './Listing';
import installRAST from './RASTBlock';
import installC3SIndicatorsListingBlock from './C3SIndicatorsListingBlock';
import installC3SIndicatorsOverviewBlock from './C3SIndicatorsOverviewBlock';
import installC3SIndicatorsGlossaryBlock from './C3SIndicatorsGlossaryBlock';
import installReadMore from './ReadMore';
import installCollectionStats from './CollectionStatistics';
import installTabsBlock from './TabsBlock';
import installRedirectBlock from './RedirectBlock';
import installContentLinks from './ContentLinks';
import installASTNavigation from './ASTNavigation';
import installFlourishEmbedBlock from './FlourishEmbedBlock';
import installDataConnectedEmbed from './DataConnectedEmbedBlock';
import installCountryMapProfile from './CountryMapProfile';

export default function installBlocks(config) {
  config.blocks.blocksConfig.title.restricted = false;
  config.blocks.blocksConfig.layoutSettings.restricted = false;

  if (config.blocks.blocksConfig.maps) {
    config.blocks.blocksConfig.maps.restricted = false;
  }

  if (config.blocks.blocksConfig.layoutSettings) {
    config.blocks.blocksConfig.layoutSettings.blockHasOwnFocusManagement = false;
  }

  if (config.blocks.blocksConfig.video) {
    config.blocks.blocksConfig.video.restricted = false;
  }

  config.blocks.blocksConfig.nextCloudVideo = {
    ...config.blocks.blocksConfig.nextCloudVideo,
    whiteList: [
      'https://cmshare.eea.europa.eu',
      'https://shareit.eea.europa.eu',
    ],
  };

  if (config.blocks.blocksConfig.countryFlag) {
    config.blocks.blocksConfig.countryFlag = {
      ...config.blocks.blocksConfig.countryFlag,
      restricted: ({ properties, block }) => {
        return blockAvailableInMission(properties, block);
      },
    };
  }

  // override the noResultsComponent to avoid the "No results" text
  config.blocks.blocksConfig['listing'].noResultsComponent = () => null;

  return compose(
    installRAST,
    installReadMore,
    installC3SIndicatorsOverviewBlock,
    installC3SIndicatorsListingBlock,
    installC3SIndicatorsGlossaryBlock,
    installECDEIndicatorsBlock,
    installCaseStudyExplorerBlock,
    installCountryMapObservatory,
    installCountryProfileDetail,
    installSearchAceContent,
    installRelevantAceContent,
    installFilterAceContent,
    installTransRegionSelect,
    installCollectionStats,
    installTabsBlock,
    installListing,
    installRedirectBlock,
    installContentLinks,
    installASTNavigation,
    installCountryMapProfile,
    installFlourishEmbedBlock,
    installDataConnectedEmbed,
  )(config);
}
