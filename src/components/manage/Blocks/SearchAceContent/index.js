import zoomSVG from '@plone/volto/icons/zoom.svg';
import SearchAceContentEdit from './SearchAceContentEdit';
import SearchAceContentView from './SearchAceContentView';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default function installBlock(config) {
  config.blocks.blocksConfig.searchAceContent = {
    id: 'searchAceContent',
    title: 'Search AceContent',
    icon: zoomSVG,
    group: 'site',
    view: SearchAceContentView,
    edit: SearchAceContentEdit,
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
