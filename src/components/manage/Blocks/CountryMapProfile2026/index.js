import worldSVG from '@plone/volto/icons/world.svg';
import Edit from './Edit';
import View from './View';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default function installCountryMapProfile2026(config) {
  config.blocks.blocksConfig.countryMapProfile2026 = {
    id: 'countryMapProfile2026',
    title: 'Country Map Profile 2026',
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
