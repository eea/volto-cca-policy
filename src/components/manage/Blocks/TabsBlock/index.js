import { DefaultEdit } from '@eeacms/volto-tabs-block/components';
import Spotlight from './Spotlight';

export default function applyConfig(config) {
  config.blocks.blocksConfig.tabs_block.variations.push({
    id: 'spotlight',
    title: 'Spotlight',
    isDefault: false,
    edit: DefaultEdit,
    view: Spotlight,
  });
  return config;
}
