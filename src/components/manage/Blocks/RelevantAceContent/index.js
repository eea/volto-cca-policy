import zoomSVG from '@plone/volto/icons/zoom.svg';
import RelevantAceContentEdit from './RelevantAceContentEdit';
import RelevantAceContentView from './RelevantAceContentView';

export default function installBlock(config) {
  config.blocks.blocksConfig.relevantAceContent = {
    id: 'relevantAceContent',
    title: 'Relevant acecontent',
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
  };

  return config;
}
