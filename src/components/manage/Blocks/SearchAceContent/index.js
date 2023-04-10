import world from '@plone/volto/icons/world.svg';
import SearchAceContentEdit from './SearchAceContentEdit';
import SearchAceContentView from './SearchAceContentView';

export default function installBlock(config) {
  config.blocks.blocksConfig.searchAceContent = {
    id: 'searchAceContent',
    title: 'Search AceContent',
    icon: world,
    group: 'common',
    view: SearchAceContentView,
    edit: SearchAceContentEdit,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    variations: [],
  };

  return config;
}
