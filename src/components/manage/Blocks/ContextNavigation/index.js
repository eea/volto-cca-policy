import codeSVG from '@plone/volto/icons/code.svg';
import ContextNavigationEdit from './ContextNavigationEdit';
import ContextNavigationView from './ContextNavigationView';
import BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';

export default (config) => {
  config.blocks.blocksConfig.contextNavigation = {
    id: 'contextNavigation',
    title: 'Navigation',
    icon: codeSVG,
    group: 'site',
    view: ContextNavigationView,
    edit: ContextNavigationEdit,
    schema: BlockSettingsSchema,
    restricted: true,
    mostUsed: true,
    blockHasOwnFocusManagement: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  return config;
};
