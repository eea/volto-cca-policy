import worldSVG from '@plone/volto/icons/world.svg';
import CountryMapEdit from './CountryMapEdit';
import CountryMapView from './CountryMapView';

export default function installCountryMapBlock(config) {
  config.blocks.blocksConfig.countryMap = {
    id: 'countryMap',
    title: 'Country Map',
    icon: worldSVG,
    group: 'common',
    edit: CountryMapEdit,
    view: CountryMapView,
  };

  return config;
}
