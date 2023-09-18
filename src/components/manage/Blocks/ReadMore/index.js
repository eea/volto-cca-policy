import ReadMoreEdit from './ReadMoreEdit';
import ReadMoreView from './ReadMoreView';
import iconSVG from '@plone/volto/icons/divide-horizontal.svg';

export default function installBlock(config) {
  config.blocks.blocksConfig.readMoreBlock = {
    id: 'readMoreBlock',
    title: 'Read more',
    icon: iconSVG,
    group: 'site',
    edit: ReadMoreEdit,
    view: ReadMoreView,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  return config;
}
