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
import installRAST from './RASTBlock';

export default function installBlocks(config) {
  config.blocks.blocksConfig.title.restricted = false;
  config.blocks.blocksConfig.layoutSettings.restricted = false;

  return compose(
    installRAST,
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
  )(config);
}
