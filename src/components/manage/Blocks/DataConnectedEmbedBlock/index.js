import { composeSchema } from '@eeacms/volto-cca-policy/schema-utils';
import DataConnectedEmbedBlockView from './DataConnectedEmbedBlockView';

export default function applyConfig(config) {
  const { data_connected_embed } = config.blocks.blocksConfig;

  data_connected_embed.schemaEnhancer = composeSchema(
    data_connected_embed.schemaEnhancer,
  );
  data_connected_embed.view = DataConnectedEmbedBlockView;

  return config;
}
