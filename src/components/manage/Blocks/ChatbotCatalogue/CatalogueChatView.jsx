import React from 'react';
import { ChatWindow } from '@eeacms/volto-eea-chatbot/ChatBlock/chat';
import { CompareToolsPanel } from '../../../theme/CompareTools/CompareToolsPanel';

import { CcaDocCard } from './DocumentCard';
import { remarkCcaDocCards } from './docCards';
import { remarkCcaNextSteps } from './nextSteps';
import SuggestedNextSteps from './SuggestedNextSteps';
import './catalogue-chat.less';

// Stable object/component identity so react-markdown does not treat the
// custom element as a new component type on every render.
const extraMarkdownComponents = {
  'cca-doc-card': CcaDocCard,
  'cca-suggested-next-steps': SuggestedNextSteps,
};

const extraRemarkPlugins = [remarkCcaDocCards, remarkCcaNextSteps];

/**
 * The CCA "catalogue" presentation for the AI Chatbot block.
 *
 * It reuses the classic `ChatWindow` (and therefore keeps all the classic
 * functionality — the "Thinking"/tools accordion, styled "New chat" button,
 * streaming placeholder, quality check, related questions, feedback, etc.)
 * and only customises two things:
 *
 *  1. `hideSourcesTab` — the classic "Sources" tab/sidebar/inline list is
 *     suppressed, because the cited documents are presented as inline
 *     catalogue cards instead.
 *  2. `extraRemarkPlugins` + `extraMarkdownComponents` — the
 *     `![[doc: Title]]` markers in the answer text (see `docCards.js`) are
 *     turned into inline Navigator-style catalogue cards (`CcaDocCard`),
 *     and "Suggested next steps" sections are turned into styled callout boxes.
 *
 * It also renders `<CompareToolsPanel />` so that when users activate the
 * "Compare" checkbox on any document card, the floating comparison panel
 * appears and allows navigating to the side-by-side comparison view.
 *
 * `ChatBlockView` renders this as `<Presentation persona {...blockData} />`,
 * so all block fields arrive as top-level props and are forwarded unchanged.
 */
function CatalogueChatView(props) {
  return (
    <>
      <ChatWindow
        {...props}
        hideSourcesTab
        extraRemarkPlugins={extraRemarkPlugins}
        extraMarkdownComponents={extraMarkdownComponents}
      />
      <CompareToolsPanel />
    </>
  );
}

export default CatalogueChatView;
