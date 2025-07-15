import FlourishEmbedBlockEdit from './FlourishEmbedBlockEdit';
import FlourishEmbedBlockView from './FlourishEmbedBlockView';
import sliderSVG from '@plone/volto/icons/slider.svg';

export default function installBlock(config) {
  config.blocks.blocksConfig.FlourishEmbedBlock = {
    id: 'FlourishEmbedBlock',
    title: 'Flourish visualization',
    icon: sliderSVG,
    group: 'site',
    edit: FlourishEmbedBlockEdit,
    view: FlourishEmbedBlockView,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  return config;
}
