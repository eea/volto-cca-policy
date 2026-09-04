import CatalogueChatView from './CatalogueChatView';

const ALLOWED_ROLES = ['Manager', 'Site Administrator', 'Editor'];

export const isChatbotRestricted = ({ user }) => {
  if (user?.roles) {
    return !user.roles.some((role) => ALLOWED_ROLES.includes(role));
  }
  return false;
};

/**
 * Registers the CCA "catalogue" presentation variation on the AI Chatbot
 * block (from @eeacms/volto-eea-chatbot) and loosens the role restriction
 * to allow Managers, Site Administrators, and Editors.
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
    block.restricted = isChatbotRestricted;
  }

  const danswer = config.blocks.blocksConfig.danswerChat;
  if (danswer) {
    danswer.restricted = isChatbotRestricted;
  }

  return config;
}
