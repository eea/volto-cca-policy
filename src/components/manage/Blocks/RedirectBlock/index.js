import zoomSVG from '@plone/volto/icons/zoom.svg';
import RedirectBlockEdit from './RedirectBlockEdit';
import RedirectBlockView from './RedirectBlockView';
// import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default function installBlock(config) {
  config.blocks.blocksConfig.redirectBlock = {
    id: 'redirectBlock',
    title: 'Redirection Block',
    icon: zoomSVG,
    group: 'site',
    view: RedirectBlockView,
    edit: RedirectBlockEdit,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    variations: [],
    restricted: false,
    // restricted: ({ properties, block }) => {
    //   return blockAvailableInMission(properties, block);
    // },
  };

  return config;
}
