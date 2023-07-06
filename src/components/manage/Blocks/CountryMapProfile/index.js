import worldSVG from '@plone/volto/icons/world.svg';
import Edit from './Edit';
import View from './View';

export default function installCountryMapProfile(config) {
  config.blocks.blocksConfig.countryMapProfile = {
    id: 'countryMapProfile',
    title: 'Country Map Profile',
    icon: worldSVG,
    group: 'common',
    edit: Edit,
    view: View,
  };

  return config;
}
