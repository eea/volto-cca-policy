import React, { useContext, memo } from 'react';

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

function sourcePropsEqual(prev, next) {
  return prev.source?.link === next.source?.link;
}

export class DocCardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.warn('DocCard failed to render rich catalogue card:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

/**
 * Document card rendered once the globalsearch ES lookup (by document URL)
 * resolves as the full Navigator catalogue card.
 *
 * If the document is not found in Elasticsearch (or lookup fails), no card
 * is displayed.
 */
const EnhancedDocCard = memo(function EnhancedDocCard({ source }) {
  const { result } = useCatalogueDoc(source?.link);

  if (!result) {
    return null;
  }

  return (
    <DocCardErrorBoundary fallback={null}>
      <div className="catalogue-chat-card-inline">
        <div className="catalogue-chat-navigator-card">
          <NavigatorCatalogueCardItem result={result} />
        </div>
      </div>
    </DocCardErrorBoundary>
  );
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
  return <EnhancedDocCard source={source} />;
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
