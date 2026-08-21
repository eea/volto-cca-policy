import React from 'react';

import NavigatorCatalogueCardItem from '@eeacms/volto-cca-policy/components/Search/NavigatorCatalogue/NavigatorCatalogueCardItem';
import { useCatalogueDoc } from './useCatalogueDoc';

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
export function DocumentCard({ source, index }) {
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
        {isWeb && link ? (
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

/**
 * Document card that upgrades itself: while it has only the Onyx-provided
 * fields it renders the basic `DocumentCard`; once the globalsearch ES
 * lookup (by document URL) resolves it re-renders as the full Navigator
 * catalogue card.
 */
export function EnhancedDocCard({ source, index }) {
  const { result } = useCatalogueDoc(source?.link);

  if (result) {
    return (
      <div className="catalogue-chat-navigator-card">
        <NavigatorCatalogueCardItem result={result} />
      </div>
    );
  }
  return <DocumentCard source={source} index={index} />;
}

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
      d.semantic_identifier.trim().toLowerCase() === title.trim().toLowerCase(),
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
