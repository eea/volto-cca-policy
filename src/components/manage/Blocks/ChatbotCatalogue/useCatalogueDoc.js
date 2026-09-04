import { useEffect, useState } from 'react';
import { registry } from '@eeacms/search';
import { fetchResult } from '@eeacms/search/lib/hocs/useResult';

const searchAppName = 'navigatorCatalogueSearch';

/**
 * Fetch a document from the globalsearch Elasticsearch index by URL.
 *
 * The globalsearch index uses the document URL as the ES `_id`, and the
 * volto-searchlib express middleware whitelists/proxies
 * `GET /_es/{app}/_doc/{id}` (see esGetDocWhitelist in
 * volto-searchlib/src/middleware/elasticsearch.js). `fetchResult`
 * (searchlib) issues that GET and wraps the hit in the searchlib Result
 * model — the same object the Navigator catalogue cards consume.
 *
 * Results are cached in a module-level Map for the lifetime of the page
 * (no refetch on re-render, repeat questions, or multiple cards for the
 * same document).
 */
const docCache = new Map();
// Resolved values (Result | null) keyed by URL. Lets a card that has already
// been fetched render the full card synchronously instead of flashing the
// basic card first (repeat doc, remount, or a second message citing the same
// URL).
const resolvedCache = new Map();

/**
 * Normalize URLs so they match the globalsearch Elasticsearch index `_id`.
 * In globalsearch, Climate-ADAPT tools use `https://climate-adapt.eea.europa.eu/en/...`
 * without trailing slashes.
 */
export function normalizeCatalogueUrl(url) {
  if (!url || typeof url !== 'string') return url;
  let normalized = url.trim();
  // Strip trailing slashes
  while (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  // Map localhost or cca.localhost to production domain used in the globalsearch index
  normalized = normalized.replace(
    /^https?:\/\/(?:cca\.localhost|localhost(?::\d+)?)/i,
    'https://climate-adapt.eea.europa.eu',
  );
  // Ensure /en/ prefix for metadata or other paths in Climate-ADAPT
  // e.g. https://climate-adapt.eea.europa.eu/metadata/... -> https://climate-adapt.eea.europa.eu/en/metadata/...
  const ccaDomain = 'https://climate-adapt.eea.europa.eu';
  if (normalized.toLowerCase().startsWith(ccaDomain.toLowerCase())) {
    const path = normalized.slice(ccaDomain.length);
    if (path.startsWith('/') && !path.startsWith('/en/') && path !== '/en') {
      normalized = `${ccaDomain}/en${path}`;
    }
  }
  return normalized;
}

// The search app configs live on the searchlib registry's mutable `searchui`
// part (see CompareTools/utils.js fetchResultsByUid for the same pattern).
function getAppConfig() {
  return registry.searchui?.[searchAppName] || null;
}

function fetchCatalogueDoc(rawUrl) {
  const url = normalizeCatalogueUrl(rawUrl);
  const appConfig = getAppConfig();
  if (!docCache.has(url)) {
    docCache.set(
      url,
      appConfig
        ? fetchResult(url, appConfig, registry)
            .then((result) => {
              const value = result && result.found !== false ? result : null;
              resolvedCache.set(url, value);
              return value;
            })
            .catch(() => {
              resolvedCache.set(url, null);
              return null;
            })
        : Promise.resolve(null),
    );
  }
  return docCache.get(url);
}

export function useCatalogueDoc(rawUrl) {
  const url = normalizeCatalogueUrl(rawUrl);
  // Start from the resolved cache (if any) so a known doc renders as the full
  // card immediately, avoiding a basic→full flash on mount.
  const [result, setResult] = useState(() =>
    url && resolvedCache.has(url) ? resolvedCache.get(url) : null,
  );

  useEffect(() => {
    if (!url) {
      setResult(null);
      return undefined;
    }
    // Already resolved: stay in sync without an effect round-trip.
    if (resolvedCache.has(url)) {
      setResult(resolvedCache.get(url));
      return undefined;
    }
    let ignore = false;
    fetchCatalogueDoc(url).then((doc) => {
      if (!ignore) {
        setResult(doc);
      }
    });
    return () => {
      ignore = true;
    };
  }, [url]);

  return { result, loading: !!url && result === null };
}
