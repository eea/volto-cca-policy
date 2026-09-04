import React, { useContext, memo } from 'react';
import { Icon } from 'semantic-ui-react';
import ExternalLink from '@eeacms/search/components/Result/ExternalLink';

import NavigatorCatalogueCardItem from '@eeacms/volto-cca-policy/components/Search/NavigatorCatalogue/NavigatorCatalogueCardItem';
// The `ChatMessageContext` seam only exists in @eeacms/volto-eea-chatbot from
// the release that follows the "block variations" work
// (eea/volto-eea-chatbot#32). Environments that resolve the published ^4.0.0
// package (e.g. the standalone CI build) don't have the named export, and a
// static named import would make webpack fail the whole app build there. So
// import the module namespace instead and degrade gracefully when the seam
// is missing (the cards then fall back to the basic metadata card).
import * as ChatBlockChat from '@eeacms/volto-eea-chatbot/ChatBlock/chat';
import { useCatalogueDoc } from './useCatalogueDoc';

// Fall back to an inert context (default value `undefined`) when the seam is
// absent, so `useContext` below is always called with a stable context object.
const ChatMessageContext =
  ChatBlockChat.ChatMessageContext || React.createContext(undefined);

/**
 * Clean page titles returned from Onyx/scrapers that append pipeline/section suffixes,
 * e.g. "Climate policy radar | Tools | Discover the key services...".
 */
export function cleanDocumentTitle(title) {
  if (!title || typeof title !== 'string') return '';
  const pipeIndex = title.indexOf('|');
  const firstPart = pipeIndex === -1 ? title : title.slice(0, pipeIndex);
  return firstPart.trim() || title.trim();
}

/**
 * Robust title matching between the assistant's marker and the message's cited documents.
 * Tolerates case differences, clean vs noisy pipeline titles, and prefixes.
 */
export function matchesDocumentTitle(docTitle, searchTitle) {
  if (!docTitle || !searchTitle) return false;
  const d1 = docTitle.trim().toLowerCase();
  const s1 = searchTitle.trim().toLowerCase();
  if (d1 === s1) return true;

  const dClean = cleanDocumentTitle(docTitle).toLowerCase();
  const sClean = cleanDocumentTitle(searchTitle).toLowerCase();
  if (dClean && sClean && dClean === sClean) return true;

  if (d1.startsWith(sClean) || s1.startsWith(dClean)) return true;
  if (
    dClean &&
    sClean &&
    (dClean.includes(sClean) || sClean.includes(dClean))
  ) {
    return true;
  }
  return false;
}

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

// `InlineDocCard` rebuilds the `source` object on every render (the answer is
// re-rendered on each streaming tick), so a plain `===` prop comparison would
// never memoize. Compare the actual fields instead.
function sourceEqual(prevSource, nextSource) {
  return (
    prevSource?.semantic_identifier === nextSource?.semantic_identifier &&
    prevSource?.blurb === nextSource?.blurb &&
    prevSource?.updated_at === nextSource?.updated_at &&
    prevSource?.source_type === nextSource?.source_type &&
    prevSource?.link === nextSource?.link
  );
}

function sourcePropsEqual(prev, next) {
  return prev.index === next.index && sourceEqual(prev.source, next.source);
}

/**
 * Document card styled to match the Navigator catalogue cards
 * (volto-cca-policy NavigatorCatalogueCardItem), used when full searchlib
 * metadata is not yet loaded or for external/unindexed sources.
 */
const DocumentCard = memo(function DocumentCard({ source, index }) {
  if (!source || typeof source !== 'object' || !source.semantic_identifier) {
    return null;
  }
  const {
    semantic_identifier: rawTitle,
    blurb,
    updated_at,
    source_type,
    link,
  } = source;
  const isWeb = source_type === 'web';
  const title = cleanDocumentTitle(rawTitle);
  const formattedDate = formatDate(updated_at);
  const typeLabel = isWeb ? 'Web' : 'Document';

  return (
    <div className="catalogue-chat-navigator-card">
      <div className="navigator-catalogue-item">
        <div className="navigator-tool-icon large" aria-hidden="true">
          <Icon className="ri-file-line" />
        </div>

        <div className="catalogue-item-main">
          <div className="catalogue-item-top">
            <div className="navigator-tool-provider">
              {typeof index === 'number' && (
                <span className="chat-citation">{index} </span>
              )}
              {typeLabel}
            </div>
            {formattedDate && (
              <span className="catalogue-date">{formattedDate}</span>
            )}
          </div>

          <div className="catalogue-item-heading">
            <h4>
              {link ? (
                <ExternalLink href={link} title={title}>
                  {title}
                </ExternalLink>
              ) : (
                <span title={title}>{title}</span>
              )}
            </h4>
          </div>

          {blurb && <p className="catalogue-description">{blurb}</p>}

          <div className="catalogue-item-footer">
            <div className="catalogue-meta license-type">
              <span className="catalogue-type">Type: {typeLabel}</span>
            </div>

            <div className="catalogue-actions">
              {link && (
                <ExternalLink
                  href={link}
                  className="ui button primary icon"
                  labelPosition="left"
                >
                  View
                  <Icon className="ri-arrow-right-line" />
                </ExternalLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}, sourcePropsEqual);

/**
 * Document card that upgrades itself: while it has only the Onyx-provided
 * fields it renders the basic `DocumentCard`; once the globalsearch ES
 * lookup (by document URL) resolves it re-renders as the full Navigator
 * catalogue card.
 *
 * Memoized: the answer markdown is re-rendered on every streaming tick, but
 * the (already-shown, potentially heavy) card should only re-render when its
 * own data changes, not on every tick. Its own basic→full upgrade is driven
 * by internal state, which still re-renders it exactly once.
 */
const EnhancedDocCard = memo(function EnhancedDocCard({ source, index }) {
  const { result } = useCatalogueDoc(source?.link);

  if (result) {
    return (
      <div className="catalogue-chat-navigator-card">
        <NavigatorCatalogueCardItem result={result} />
      </div>
    );
  }
  return <DocumentCard source={source} index={index} />;
}, sourcePropsEqual);

/**
 * Inline document card, rendered in the message text where the assistant
 * emitted a `![[doc: Title]]` marker (see docCards.js). Tries to match the
 * title against the message's cited documents to enrich with link/blurb.
 */
export function InlineDocCard({ title, documents = [] }) {
  const doc = (documents || []).find(
    (d) =>
      d.semantic_identifier &&
      title &&
      matchesDocumentTitle(d.semantic_identifier, title),
  );
  const source = {
    semantic_identifier: title,
    blurb: doc?.blurb,
    updated_at: doc?.updated_at,
    source_type: doc?.source_type,
    link: doc?.link,
  };
  return (
    <div className="catalogue-chat-card-inline">
      <EnhancedDocCard source={source} />
    </div>
  );
}

/**
 * Stable react-markdown component for the `cca-doc-card` element emitted by
 * the `remarkCcaDocCards` plugin. It reads the owning message from
 * `ChatMessageContext` (set by the core `ChatMessage`) to match the marker
 * title against that message's cited documents.
 *
 * Kept as a top-level (stable) component type so react does not remount it
 * on every render while the answer streams.
 */
export function CcaDocCard({ title }) {
  const message = useContext(ChatMessageContext);
  return <InlineDocCard title={title} documents={message?.documents} />;
}
