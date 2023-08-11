import zoomSVG from '@plone/volto/icons/zoom.svg';
import RASTEdit from './RASTEdit';
import RASTView from './RASTView';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default function installBlock(config) {
  const blocksConfig = config.blocks.blocksConfig;

  blocksConfig.rastBlock = {
    id: 'rastBlock',
    title: 'RAST',
    icon: zoomSVG,
    group: 'site',
    view: RASTView,
    edit: RASTEdit,
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
