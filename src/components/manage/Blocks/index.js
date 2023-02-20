import { compose } from 'redux';
import installMKHMap from './MKHMap';

export default function installBlocks(config) {
  config.blocks.blocksConfig.title.restricted = false;
  return compose(
    installMKHMap,
    //
  )(config);
}
