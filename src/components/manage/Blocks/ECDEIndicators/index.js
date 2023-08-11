import worldSVG from '@plone/volto/icons/world.svg';
import ECDEIndicatorsEdit from './ECDEIndicatorsEdit';
import ECDEIndicatorsView from './ECDEIndicatorsView';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default function installECDEIndicatorsBlock(config) {
  config.blocks.blocksConfig.ecdeIndicators = {
    id: 'ecdeIndicators',
    title: 'ECDE Indicators',
    icon: worldSVG,
    group: 'site',
    edit: ECDEIndicatorsEdit,
    view: ECDEIndicatorsView,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    restricted: ({ properties, block }) => {
      return blockAvailableInMission(properties, block);
    },
  };

  return config;
}
