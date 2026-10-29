import worldSVG from '@plone/volto/icons/world.svg';
import Edit from './Edit';
import View from './View';

export default function installItemsList(config) {
  config.blocks.blocksConfig.itemsList = {
    id: 'itemsList',
    title: 'Items List',
    icon: worldSVG,
    group: 'site',
    edit: Edit,
    view: View,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    restricted: ({ properties, block }) => {
      return false;
    },
  };

  return config;
}
