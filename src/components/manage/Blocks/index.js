import { compose } from 'redux';
import installMKHMap from './MKHMap';
import installECDEIndicatorsBlock from './ECDEIndicators';
import installCaseStudyExplorerBlock from './CaseStudyExplorer';
import installSearchAceContent from './SearchAceContent';
import installRelevantAceContent from './RelevantAceContent';
import installFilterAceContent from './FilterAceContent';
import installTransRegionSelect from './TransRegionSelect';
import installCountryMapObservatory from './CountryMapObservatory';
import installCountryMapHeatIndex from './CountryMapHeatIndex';
import installCountryMapProfile from './CountryMapProfile';
import installListing from './Listing';
import installRAST from './RASTBlock';
import installC3SIndicatorsOverviewBlock from './C3SIndicatorsOverviewBlock';
import installC3SIndicatorsGlossaryBlock from './C3SIndicatorsGlossaryBlock';
import installReadMore from './ReadMore';

export default function installBlocks(config) {
  config.blocks.blocksConfig.title.restricted = false;
  config.blocks.blocksConfig.layoutSettings.restricted = false;

  return compose(
    installRAST,
    installReadMore,
    installC3SIndicatorsOverviewBlock,
    installC3SIndicatorsGlossaryBlock,
    installMKHMap,
    installECDEIndicatorsBlock,
    installCaseStudyExplorerBlock,
    installCountryMapObservatory,
    installCountryMapHeatIndex,
    installCountryMapProfile,
    installSearchAceContent,
    installRelevantAceContent,
    installFilterAceContent,
    installTransRegionSelect,
    installListing,
  )(config);
}
