import { compose } from 'redux';
import installMKHMap from './MKHMap';
import installECDEIndicatorsBlock from './ECDEIndicators';
import installCaseStudyExplorerBlock from './CaseStudyExplorer';
import installCountryMapBlock from './CountryMap';
import installSearchAceContent from './SearchAceContent';
import installRelevantAceContent from './RelevantAceContent';
import installFilterAceContent from './FilterAceContent';

export default function installBlocks(config) {
  config.blocks.blocksConfig.title.restricted = false;
  return compose(
    installMKHMap,
    installECDEIndicatorsBlock,
    installCaseStudyExplorerBlock,
    installCountryMapBlock,
    installSearchAceContent,
    installRelevantAceContent,
    installFilterAceContent,
  )(config);
}
