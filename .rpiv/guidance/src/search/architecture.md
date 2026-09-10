# Search Configuration Layer

## Responsibility
Configures multiple Elasticsearch-powered search engines for Climate-ADAPT's different portal areas: main search, health observatory, and EU mission sub-portals (stories, tools, projects, funding, all). Built on `@eeacms/volto-searchlib` (Search UI wrapper).

## Dependencies
- **@eeacms/search** (`volto-searchlib`): `mergeConfig`, search UI framework, result components
- **@elastic/search-ui**: Underlying Elasticsearch client and React bindings
- **`src/components/Result/`**: Custom result item renderers registered via `config.settings.searchlib.resolve`

## Consumers
- **`src/index.js`**: Calls `installSearchEngine(config)` to apply all search configs
- **Search page components**: Consume `config.searchui` entries to render search interfaces

## Module Structure
```
src/search/
├── index.js                   # Installer — chains all engine configs, applies shared extraQueryParams
├── utils.js                   # Shared utilities (date formatting, proxy address, thumb URL)
├── vocabulary.js              # Shared search vocabulary definitions
└── {engine-name}/             # One directory per search engine
    ├── config.js              # Main config — merges with globalsearchbase, sets index/host/facets
    ├── config-*.js            # Variant configs (e.g., config-health.js)
    ├── facets.js              # Facet definitions (fields, filters, display options)
    └── views.js               # Result view configurations (tiles, cards, landing pages)
```

## Search Engine Config Pattern

Each engine config function receives `config`, merges with the global search base, and sets engine-specific parameters. All engines share `extraQueryParams` (date decay scoring, text field boosting) applied in `index.js`.

```javascript
// cca/config.js — Main search engine
import { mergeConfig } from '@eeacms/search';
import facets from './facets';
import views from './views';
import { vocab } from '../vocabulary';

export default function installMainSearch(config) {
  config.searchui.ccaSearch = {
    ...mergeConfig(envConfig, config.searchui.globalsearchbase),
    elastic_index: '_es/globalsearch',
    index_name: 'data_searchui',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
    vocab,
  };
  config.searchui.ccaSearch.facets = facets;
  // ... content sections, permanent filters, etc.
  return config;
}

// index.js — Chain all engines
const applyConfig = (config) => {
  config.settings.searchlib = [
    installMainSearch,
    installHealthSearch,
    installMissionStoriesSearch,
    // ... more engines
  ].reduce((acc, cur) => cur(acc), config.settings.searchlib);

  // Apply shared query params to all engines
  const searchui = config.settings.searchlib.searchui;
  searchui.ccaSearch.extraQueryParams = extraQueryParams;
  searchui.ccaHealthSearch.extraQueryParams = extraQueryParams;
  // ...
  return config;
};
```

## Custom Result Views

Custom result item components (e.g., `HealthHorizontalCardItem`, `ClusterHorizontalCardItem`) are registered in `src/index.js` via `config.settings.searchlib.resolve` and referenced by name in the search engine's view config.

```javascript
// src/index.js
config.settings.searchlib.resolve.HealthHorizontalCardItem = {
  component: HealthHorizontalCardItem,
};
```

## Architectural Boundaries
- **NO hardcoded Elasticsearch URLs in config**: Use `RAZZLE_ES_PROXY_ADDR` env var or `getClientProxyAddress()` for client-side fallback
- **NO engine-specific styles**: Search styling comes from `@eeacms/search` and global `theme/globals/search.less`

<important if="you are adding a new search engine">
## Adding a New Search Engine
1. Create `src/search/{engine-name}/` directory
2. Add `config.js` — merge with `globalsearchbase`, set `elastic_index`, `host`, `vocab`
3. Add `facets.js` — define facet fields, filter types, display options
4. Add `views.js` — define result views, tiles, landing page params
5. Register in `src/search/index.js` — add to the reduce chain and apply `extraQueryParams`
6. If custom result items needed, create in `src/components/Result/` and register in `src/index.js` via `searchlib.resolve`
</important>
