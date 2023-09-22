import zoomSVG from '@plone/volto/icons/zoom.svg';
import C3SIndicatorsOverviewBlockEdit from './C3SIndicatorsOverviewBlockEdit';
import C3SIndicatorsOverviewBlockView from './C3SIndicatorsOverviewBlockView';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default function installBlock(config) {
  const blocksConfig = config.blocks.blocksConfig;

  blocksConfig.c3SIndicatorsOverviewBlock = {
    id: 'c3SIndicatorsOverviewBlock',
    title: 'C3S Indicators Overview',
    icon: zoomSVG,
    group: 'site',
    view: C3SIndicatorsOverviewBlockView,
    edit: C3SIndicatorsOverviewBlockEdit,
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
