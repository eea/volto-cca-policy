import { compose } from 'redux';
import installLayoutSettings from './LayoutSettings';
import installMKHMap from './MKHMap';

export default function installBlocks(config) {
  config.blocks.blocksConfig.title.restricted = false;
  return compose(
    installLayoutSettings,
    installMKHMap,
    //
  )(config);
}
