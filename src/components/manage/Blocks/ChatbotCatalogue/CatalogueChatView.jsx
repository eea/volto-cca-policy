import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import loadable from '@loadable/component';
import { Form } from 'semantic-ui-react';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable';

import { useChatController } from '@eeacms/volto-eea-chatbot/ChatBlock/hooks';
import { components as markdownComponents } from '@eeacms/volto-eea-chatbot/ChatBlock/components/markdown';
import AutoResizeTextarea from '@eeacms/volto-eea-chatbot/ChatBlock/components/AutoResizeTextarea';
import EmptyState from '@eeacms/volto-eea-chatbot/ChatBlock/components/EmptyState';
import '@eeacms/volto-eea-chatbot/ChatBlock/style.less';
import './catalogue-chat.less';

const Markdown = loadable(() => import('react-markdown'));

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  });
}

/**
 * Rough document card in the style of the Navigator catalogue cards
 * (volto-cca-policy NavigatorCatalogueCardItem).
 *
 * NOTE: this rough version only shows the metadata Onyx sends
 * (title, blurb, date, type, link). The full catalogue metadata
 * (sectors, hazards, license, cycle, image) comes with the Plone REST
 * enrichment in the next iteration.
 */
function DocumentCard({ source, index }) {
  if (!source || typeof source !== 'object' || !source.semantic_identifier) {
    return null;
  }
  const {
    semantic_identifier: title,
    blurb,
    updated_at,
    source_type,
    link,
  } = source;
  const isWeb = source_type === 'web';

  return (
    <div className="catalogue-chat-card">
      <div className="catalogue-chat-card-header">
        {typeof index === 'number' && (
          <span className="chat-citation">{index}</span>
        )}
        {isWeb ? (
          <a
            className="catalogue-chat-card-title"
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            {title}
          </a>
        ) : (
          <span className="catalogue-chat-card-title" title={title}>
            {title}
          </span>
        )}
      </div>
      {blurb && <div className="catalogue-chat-card-blurb">{blurb}</div>}
      <div className="catalogue-chat-card-footer">
        <span className="catalogue-chat-card-type">
          {isWeb ? 'Web' : 'Document'}
        </span>
        {updated_at && (
          <span className="catalogue-chat-card-date">
            {formatDate(updated_at)}
          </span>
        )}
      </div>
    </div>
  );
}

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
          <DocumentCard source={source} key={`${source.document_id}-${i}`} />
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

function AssistantMessage({ message, libs, isLast, isStreaming }) {
  const { remarkGfm } = libs;
  return (
    <div className="catalogue-chat-row assistant">
      <div className="circle assistant">CCA</div>
      <div className="catalogue-chat-assistant-content">
        {message.error ? (
          <div className="ui message negative">{message.error}</div>
        ) : (
          <div className="message-text-content">
            <Markdown
              components={markdownComponents(message, undefined, [])}
              remarkPlugins={remarkGfm ? [remarkGfm.default] : []}
            >
              {(message.message || '') + (isStreaming && isLast ? ' ▊' : '')}
            </Markdown>
          </div>
        )}
        {!message.error && <SourceCards message={message} />}
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

  const lastAssistantIndex = messages.reduce(
    (acc, m, i) => (m.type === 'assistant' ? i : acc),
    -1,
  );

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
              {messages.map((message, index) =>
                message.type === 'user' ? (
                  <UserBubble key={message.messageId} message={message} />
                ) : (
                  <AssistantMessage
                    key={message.messageId}
                    message={message}
                    libs={libs}
                    isLast={index === lastAssistantIndex}
                    isStreaming={isStreaming}
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
