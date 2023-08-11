import worldSVG from '@plone/volto/icons/world.svg';
import Edit from './Edit';
import View from './View';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default function installCountryMapHeatIndex(config) {
  config.blocks.blocksConfig.countryMapHeatIndex = {
    id: 'countryMapHeatIndex',
    title: 'Country Map Observatory Heat Index',
    icon: worldSVG,
    group: 'site',
    edit: Edit,
    view: View,
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
