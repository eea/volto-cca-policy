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

// The search app configs live on the searchlib registry's mutable `searchui`
// part (see CompareTools/utils.js fetchResultsByUid for the same pattern).
function getAppConfig() {
  return registry.searchui?.[searchAppName] || null;
}

function fetchCatalogueDoc(url) {
  const appConfig = getAppConfig();
  if (!docCache.has(url)) {
    docCache.set(
      url,
      appConfig
        ? fetchResult(url, appConfig, registry)
            .then((result) =>
              result && result.found !== false ? result : null,
            )
            .catch(() => null)
        : Promise.resolve(null),
    );
  }
  return docCache.get(url);
}

export function useCatalogueDoc(url) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!url) {
      setResult(null);
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
