import { compose } from 'redux';

import installECDEIndicatorsBlock from './ECDEIndicators';
import installCaseStudyExplorerBlock from './CaseStudyExplorer';
import installSearchAceContent from './SearchAceContent';
import installRelevantAceContent from './RelevantAceContent';
import installFilterAceContent from './FilterAceContent';
import installTransRegionSelect from './TransRegionSelect';
import installCountryMapObservatory from './CountryMapObservatory';
import installCountryProfileDetail from './CountryProfileDetail';
import installCountryProfileDetail2026 from './CountryProfileDetail2026';
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

// import installCountryMapHeatIndex from './CountryMapHeatIndex';
import installCountryMapProfile from './CountryMapProfile';
import installCountryMapProfile2026 from './CountryMapProfile2026';

export default function installBlocks(config) {
  config.blocks.blocksConfig.title.restricted = false;
  config.blocks.blocksConfig.layoutSettings.restricted = false;

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
    installCountryProfileDetail2026,
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
    installCountryMapProfile2026,
    installFlourishEmbedBlock,
    installDataConnectedEmbed,
    // installMKHMap,
    // installCountryMapHeatIndex,
  )(config);
}
