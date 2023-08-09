import worldSVG from '@plone/volto/icons/world.svg';
import CaseStudyExplorerEdit from './CaseStudyExplorerEdit';
import CaseStudyExplorerView from './CaseStudyExplorerView';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default function installCaseStudyExplorerBlock(config) {
  config.blocks.blocksConfig.caseStudyExplorer = {
    id: 'caseStudyExplorer',
    title: 'Case Study Explorer',
    icon: worldSVG,
    group: 'site',
    edit: CaseStudyExplorerEdit,
    view: CaseStudyExplorerView,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    restricted: ({ properties, block }) => {
      return blockAvailableInMission(properties, block);
    },
  };

  return config;
}
