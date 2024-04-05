import zoomSVG from '@plone/volto/icons/zoom.svg';
import C3SIndicatorsListingBlockEdit from './C3SIndicatorsListingBlockEdit';
import C3SIndicatorsListingBlockView from './C3SIndicatorsListingBlockView';

import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default function installBlock(config) {
  const blocksConfig = config.blocks.blocksConfig;

  blocksConfig.c3SIndicatorListingBlock = {
    id: 'c3SIndicatorListingBlock',
    title: 'C3S Indicators Listing',
    icon: zoomSVG,
    group: 'site',
    view: C3SIndicatorsListingBlockView,
    edit: C3SIndicatorsListingBlockEdit,
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
