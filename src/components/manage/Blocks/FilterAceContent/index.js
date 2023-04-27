import zoomSVG from '@plone/volto/icons/zoom.svg';
import FilterAceContentEdit from './FilterAceContentEdit';
import FilterAceContentView from './FilterAceContentView';

export default function installBlock(config) {
  config.blocks.blocksConfig.filterAceContent = {
    id: 'filterAceContent',
    title: 'Filter Ace Content',
    icon: zoomSVG,
    group: 'site',
    view: FilterAceContentView,
    edit: FilterAceContentEdit,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    variations: [],
  };

  return config;
}
