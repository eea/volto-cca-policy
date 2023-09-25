import zoomSVG from '@plone/volto/icons/zoom.svg';
import C3SIndicatorsGlossaryBlockEdit from './C3SIndicatorsGlossaryBlockEdit';
import C3SIndicatorsGlossaryBlockView from './C3SIndicatorsGlossaryBlockView';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default function installBlock(config) {
  const blocksConfig = config.blocks.blocksConfig;

  blocksConfig.c3SIndicatorsGlossaryBlock = {
    id: 'c3SIndicatorsGlossaryBlock',
    title: 'C3S Indicators Glossary',
    icon: zoomSVG,
    group: 'site',
    view: C3SIndicatorsGlossaryBlockView,
    edit: C3SIndicatorsGlossaryBlockEdit,
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
