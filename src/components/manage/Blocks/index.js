import { compose } from 'redux';
import installLayoutSettings from './LayoutSettings';

export default function installBlocks(config) {
  config.blocks.blocksConfig.title.restricted = false;
  return compose(
    installLayoutSettings,
    //
  )(config);
}
