import zoomSVG from '@plone/volto/icons/zoom.svg';
import SearchAceContentEdit from './SearchAceContentEdit';
import SearchAceContentView from './SearchAceContentView';

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
  };

  return config;
}
