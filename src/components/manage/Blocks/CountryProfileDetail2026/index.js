import worldSVG from '@plone/volto/icons/world.svg';
import CountryProfileDetail2026Edit from './CountryProfileDetail2026Edit';
import CountryProfileDetail2026View from './CountryProfileDetail2026View';

export default function installCountryProfileDetail2026Block(config) {
  config.blocks.blocksConfig.countryProfileDetail2026 = {
    id: 'countryProfileDetail2026',
    title: 'Country Profile Detail 2026',
    icon: worldSVG,
    group: 'site',
    edit: CountryProfileDetail2026Edit,
    view: CountryProfileDetail2026View,
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
