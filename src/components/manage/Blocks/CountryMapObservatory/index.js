import worldSVG from '@plone/volto/icons/world.svg';
import CountryMapObservatoryEdit from './CountryMapObservatoryEdit';
import CountryMapObservatoryView from './CountryMapObservatoryOLView';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

export default function installCountryMapObservatoryBlock(config) {
  config.blocks.blocksConfig.countryMapObservatory = {
    id: 'countryMapObservatory',
    title: 'Country Map Observatory',
    icon: worldSVG,
    group: 'site',
    edit: CountryMapObservatoryEdit,
    view: CountryMapObservatoryView,
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
