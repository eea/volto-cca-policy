import worldSVG from '@plone/volto/icons/world.svg';
import Edit from './Edit';
import View from './View';

export default function installCountryMapHeatIndex(config) {
  config.blocks.blocksConfig.countryMapHeatIndex = {
    id: 'countryMapHeatIndex',
    title: 'Country Map Observatory Heat Index',
    icon: worldSVG,
    group: 'site',
    edit: Edit,
    view: View,
  };

  return config;
}
