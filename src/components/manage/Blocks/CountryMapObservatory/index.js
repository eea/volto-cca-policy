import worldSVG from '@plone/volto/icons/world.svg';
import CountryMapObservatoryEdit from './CountryMapObservatoryEdit';
import CountryMapObservatoryView from './CountryMapObservatoryView';

export default function installCountryMapObservatoryBlock(config) {
  config.blocks.blocksConfig.countryMapObservatory = {
    id: 'countryMapObservatory',
    title: 'Country Map Observatory',
    icon: worldSVG,
    group: 'common',
    edit: CountryMapObservatoryEdit,
    view: CountryMapObservatoryView,
  };

  return config;
}
