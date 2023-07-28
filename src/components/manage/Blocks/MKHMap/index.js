import MapBlockEdit from './Edit';
import MapBlockView from './View';

import worldSVG from '@plone/volto/icons/world.svg';

export default (config) => {
  config.blocks.blocksConfig.mkh_map = {
    id: 'mkh_map',
    title: 'MKH Viewer map',
    icon: worldSVG,
    group: 'site',
    edit: MapBlockEdit,
    view: MapBlockView,
  };
  return config;
};
