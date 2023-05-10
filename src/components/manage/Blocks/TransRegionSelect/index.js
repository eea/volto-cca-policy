import zoomSVG from '@plone/volto/icons/zoom.svg';
import TransRegionSelectEdit from './TransRegionSelectEdit';
import TransRegionSelectView from './TransRegionSelectView';

export default function installBlock(config) {
  config.blocks.blocksConfig.transRegionSelect = {
    id: 'transRegionSelect',
    title: 'Trans Region Select',
    icon: zoomSVG,
    group: 'site',
    view: TransRegionSelectView,
    edit: TransRegionSelectEdit,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    variations: [],
  };

  return config;
}
