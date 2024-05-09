import { compose } from 'redux';

// import installMKHMap from './MKHMap';
import installECDEIndicatorsBlock from './ECDEIndicators';
import installCaseStudyExplorerBlock from './CaseStudyExplorer';
import installSearchAceContent from './SearchAceContent';
import installRelevantAceContent from './RelevantAceContent';
import installFilterAceContent from './FilterAceContent';
import installTransRegionSelect from './TransRegionSelect';
import installCountryMapObservatory from './CountryMapObservatory';
import installCountryMapHeatIndex from './CountryMapHeatIndex';
import installCountryMapProfile from './CountryMapProfile';
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
    // installMKHMap,
    installECDEIndicatorsBlock,
    installCaseStudyExplorerBlock,
    installCountryMapObservatory,
    installCountryMapHeatIndex,
    installCountryMapProfile,
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
  )(config);
}
