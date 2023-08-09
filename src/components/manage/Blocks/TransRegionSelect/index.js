import zoomSVG from '@plone/volto/icons/zoom.svg';
import TransRegionSelectEdit from './TransRegionSelectEdit';
import TransRegionSelectView from './TransRegionSelectView';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

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
    restricted: ({ properties, block }) => {
      return blockAvailableInMission(properties, block);
    },
  };

  return config;
}
