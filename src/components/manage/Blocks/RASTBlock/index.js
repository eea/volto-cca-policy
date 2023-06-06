import zoomSVG from '@plone/volto/icons/zoom.svg';
import RASTEdit from './RASTEdit';
import RASTView from './RASTView';

export default function installBlock(config) {
  config.blocks.blocksConfig.rastBlock = {
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
  };

  return config;
}
