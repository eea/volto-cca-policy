import worldSVG from '@plone/volto/icons/world.svg';
import ECDEIndicatorsEdit from './ECDEIndicatorsEdit';
import ECDEIndicatorsView from './ECDEIndicatorsView';

export default function installECDEIndicatorsBlock(config) {
  config.blocks.blocksConfig.ecdeIndicators = {
    id: 'ecdeIndicators',
    title: 'ECDE Indicators',
    icon: worldSVG,
    group: 'site',
    edit: ECDEIndicatorsEdit,
    view: ECDEIndicatorsView,
  };

  return config;
}
