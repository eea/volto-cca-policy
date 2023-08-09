import zoomSVG from '@plone/volto/icons/zoom.svg';
import RelevantAceContentEdit from './RelevantAceContentEdit';
import RelevantAceContentView from './RelevantAceContentView';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default function installBlock(config) {
  config.blocks.blocksConfig.relevantAceContent = {
    id: 'relevantAceContent',
    title: 'Relevant AceContent',
    icon: zoomSVG,
    group: 'site',
    view: RelevantAceContentView,
    edit: RelevantAceContentEdit,
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
