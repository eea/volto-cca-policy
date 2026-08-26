import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable';

import { useChatController } from '@eeacms/volto-eea-chatbot/ChatBlock/hooks';
import { RendererComponent } from '@eeacms/volto-eea-chatbot/ChatBlock/packets';
import { BlinkingDot } from '@eeacms/volto-eea-chatbot/ChatBlock/components/BlinkingDot';
import AutoResizeTextarea from '@eeacms/volto-eea-chatbot/ChatBlock/components/AutoResizeTextarea';
import EmptyState from '@eeacms/volto-eea-chatbot/ChatBlock/components/EmptyState';
import '@eeacms/volto-eea-chatbot/ChatBlock/style.less';
import { EnhancedDocCard, InlineDocCard } from './DocumentCard';
import { remarkCcaDocCards } from './docCards';
import './catalogue-chat.less';

function SourceCards({ message }) {
  const { citations = {}, documents = [] } = message;

  const sources = useMemo(() => {
    const inverseMap = Object.entries(citations).reduce(
      (acc, [k, v]) => ({ ...acc, [v]: k }),
      {},
    );
    return Object.values(citations)
      .map((docId) => {
        const doc = documents.find((d) => d.document_id === docId);
        return doc ? { ...doc, index: inverseMap[docId] } : null;
      })
      .filter(Boolean);
  }, [citations, documents]);

  if (sources.length === 0) return null;

  return (
    <div className="catalogue-chat-sources">
      <h4 className="catalogue-chat-sources-heading">
        Relevant documents ({sources.length})
      </h4>
      <div className="catalogue-chat-cards">
        {sources.map((source, i) => (
          <EnhancedDocCard
            source={source}
            index={source.index}
            key={`${source.document_id}-${i}`}
          />
        ))}
      </div>
    </div>
  );
}

function UserBubble({ message }) {
  return (
    <div className="catalogue-chat-row user">
      <div className="catalogue-chat-user-message">{message.message}</div>
    </div>
  );
}

function AssistantMessage({ message, libs }) {
  // Render through the chatbot core's RendererComponent (the same path the
  // classic AIMessage uses) so the answer gets the progressive typewriter
  // reveal, blinking cursor, citation rendering and an in-progress indicator
  // while the assistant is still working (e.g. during the search-tool phase).
  const [messageDisplayed, setMessageDisplayed] = useState(false);
  const displayGroups = message.groupedPackets.filter((group) =>
    message.displayPackets.includes(group.ind),
  );

  // Inline document cards: `![[doc: Title]]` markers in the answer text are
  // converted by the remark plugin (docCards.js) into `cca-doc-card`
  // elements, rendered with this component override.
  const extraMarkdownComponents = useMemo(
    () => ({
      'cca-doc-card': ({ title }) => (
        <InlineDocCard title={title} documents={message.documents} />
      ),
    }),
    [message.documents],
  );

  return (
    <div className="catalogue-chat-row assistant">
      <div className="circle assistant">CCA</div>
      <div className="catalogue-chat-assistant-content">
        {message.error ? (
          <div className="ui message negative">{message.error}</div>
        ) : displayGroups.length === 0 ? (
          <BlinkingDot addMargin />
        ) : (
          displayGroups.map((group) => (
            <RendererComponent
              key={group.ind}
              packets={group.packets}
              onComplete={() => setMessageDisplayed(true)}
              animate={!messageDisplayed}
              stopPacketSeen={!!message.isComplete}
              message={message}
              libs={libs}
              extraRemarkPlugins={[remarkCcaDocCards]}
              extraMarkdownComponents={extraMarkdownComponents}
            >
              {({ content }) => (
                <div className="message-text-wrapper">{content}</div>
              )}
            </RendererComponent>
          ))
        )}
        {/* Hidden for now — the inline ![[doc: ...]] cards replace the
            "Relevant documents" section. Uncomment to bring it back:
        {!message.error && <SourceCards message={message} />}
        */}
      </div>
    </div>
  );
}

// NOTE: the block fields arrive as top-level props — ChatBlockView renders
// `<Presentation persona={...} {...blockData} />` (no `data` prop), same
// contract as the classic ChatWindow presentation.
function CatalogueChatView({
  persona,
  isEditMode,
  isPlaywrightTest,
  block_id,
  initialQuery,
  remarkGfm,
  placeholderPrompt = 'Ask a question',
  qgenAsistantId,
  enableQgen,
  deepResearch,
  onyxVersion,
  showAssistantTitle,
  showAssistantDescription,
  ...rest
}) {
  const libs = useMemo(() => ({ remarkGfm }), [remarkGfm]);
  const history = useHistory();

  const {
    onSubmit,
    onFetchRelatedQuestions,
    messages,
    isStreaming,
    isFetchingRelatedQuestions,
    clearChat,
  } = useChatController({
    personaId: persona.id,
    qgenAsistantId,
    enableQgen,
    deepResearch,
    onyxVersion,
  });

  const [showLandingPage, setShowLandingPage] = useState(true);
  useEffect(() => {
    setShowLandingPage(messages.length === 0);
  }, [messages]);

  // Auto-submit query from URL parameter on mount
  useEffect(() => {
    if (initialQuery && messages.length === 0 && !isStreaming) {
      onSubmit({ message: initialQuery });
      setShowLandingPage(false);
      history.replace(window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChoice = (message) => {
    onSubmit({ message });
    setShowLandingPage(false);
  };

  return (
    <div
      className="catalogue-chat chat-window"
      data-playwright-block-id={isPlaywrightTest ? block_id : undefined}
    >
      <div className="messages">
        {showLandingPage ? (
          <>
            {showAssistantTitle !== false && <h2>{persona.name}</h2>}
            {showAssistantDescription !== false && <p>{persona.description}</p>}
            <EmptyState {...rest} persona={persona} onChoice={handleChoice} />
          </>
        ) : (
          <>
            <button
              type="button"
              className="catalogue-chat-clear"
              disabled={isStreaming}
              onClick={clearChat}
            >
              New chat
            </button>
            <div className="catalogue-chat-conversation">
              {messages.map((message) =>
                message.type === 'user' ? (
                  <UserBubble key={message.nodeId} message={message} />
                ) : (
                  <AssistantMessage
                    key={message.nodeId}
                    message={message}
                    libs={libs}
                  />
                ),
              )}
            </div>
          </>
        )}
      </div>

      <div className="chat-form">
        <Form>
          <div className="textarea-wrapper">
            {/* @ts-ignore TODO: convert AutoResizeTextarea to TypeScript */}
            <AutoResizeTextarea
              maxRows={8}
              minRows={1}
              placeholder={
                messages.length > 0 ? 'Ask follow-up...' : placeholderPrompt
              }
              isStreaming={isStreaming}
              onSubmit={onSubmit}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}

export default injectLazyLibs(['rehypePrism', 'remarkGfm'])(CatalogueChatView);
