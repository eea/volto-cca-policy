import MapBlockEdit from './Edit';
import MapBlockView from './View';
import worldSVG from '@plone/volto/icons/world.svg';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default (config) => {
  config.blocks.blocksConfig.mkh_map = {
    id: 'mkh_map',
    title: 'MKH Viewer map',
    icon: worldSVG,
    group: 'site',
    edit: MapBlockEdit,
    view: MapBlockView,
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
};
