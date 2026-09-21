import CatalogueChatView from './CatalogueChatView';

/**
 * Registers the CCA "catalogue" presentation variation on the AI Chatbot
 * block (from @eeacms/volto-eea-chatbot).
 *
 * Pattern: cross-addon variation push, same as ./TabsBlock pushing the
 * "spotlight" variation onto the tabs block.
 */
export default function applyConfig(config) {
  const block = config.blocks.blocksConfig.eeaChatbot;
  if (block) {
    block.variations = block.variations || [];
    if (!block.variations.find((v) => v.id === 'catalogue')) {
      block.variations.push({
        id: 'catalogue',
        title: 'Catalogue (CCA)',
        isDefault: false,
        view: CatalogueChatView,
      });
    }
  }
  return config;
}
