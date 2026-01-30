import zoomSVG from '@plone/volto/icons/zoom.svg';
import FilterAceContentEdit from './FilterAceContentEdit';
import FilterAceContentView from './FilterAceContentView';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default function installBlock(config) {
  config.blocks.blocksConfig.filterAceContent = {
    id: 'filterAceContent',
    title: 'Filter AceContent',
    icon: zoomSVG,
    group: 'site',
    view: FilterAceContentView,
    edit: FilterAceContentEdit,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    variations: [
      {
        id: 'listing',
        title: 'Listing',
        isDefault: true,
        fullobjects: true,
      },
      {
        id: 'cards',
        title: 'Cards',
        isDefault: false,
        fullobjects: true,
      },
    ],
    restricted: ({ properties, block }) => {
      return blockAvailableInMission(properties, block);
    },
  };

  return config;
}
