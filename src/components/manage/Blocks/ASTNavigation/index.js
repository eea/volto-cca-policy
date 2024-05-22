import contentSVG from '@plone/volto/icons/content.svg';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';
import ASTNavigationView from './ASTNavigationView';
import ASTNavigationEdit from './ASTNavigationEdit';

export default function installBlock(config) {
  const blocksConfig = config.blocks.blocksConfig;

  blocksConfig.astNavigation = {
    id: 'astNavigation',
    title: 'AST Navigation',
    icon: contentSVG,
    group: 'site',
    view: ASTNavigationView,
    edit: ASTNavigationEdit,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    variations: [],
    restricted: ({ properties, block }) => {
      return blockAvailableInMission(properties, block);
    },
  };

  return config;
}
