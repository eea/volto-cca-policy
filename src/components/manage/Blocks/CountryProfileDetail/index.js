import worldSVG from '@plone/volto/icons/world.svg';
import Edit from './Edit';
import View from './View';
// import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default function installCountryProfileDetailBlock(config) {
  config.blocks.blocksConfig.countryProfileDetail = {
    id: 'countryProfileDetail',
    title: 'Country Profile Detail',
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
      return false;
    },
  };

  return config;
}
