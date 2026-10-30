# Project Overview

Volto (React) add-on for Climate-ADAPT — the European Climate Adaptation Platform. Provides custom blocks, views, widgets, search engines, theme overrides, and core component shadowing for a Plone 6 + Volto 17 backend.

## Architecture

```
volto-cca-policy/
├── src/index.js              # Add-on entry — applyConfig composes all installers
├── src/components/           # Custom UI: blocks, views, widgets, search results
├── src/customizations/       # Shadowed Volto/EEA/core components (must have README.md)
├── src/search/               # Elasticsearch search engine configurations (7 engines)
├── src/store/                # Redux reducers, actions, middleware
├── src/helpers/              # Shared utilities (.js) and React components (.jsx)
├── src/icons/                # Custom SVG icon registry
├── theme/                    # Semantic UI LESS theme (EEA design system base)
├── locales/                  # 27 EU language translation catalogs
├── cypress/                  # End-to-end acceptance tests
├── jest-addon.config.js      # Jest configuration with coverage path resolution
└── package.json              # Addon dependencies and EEA addon chain
```

**Config flow:** `src/index.js` exports `applyConfig(config)` → composes `installBlocks`, `installSearchEngine`, `installStore` → each mutates `config` and returns it → Volto merges at build time.

## Commands

| Command | What it does |
|---|---|
| `make start` | Start dev environment (Docker Compose: frontend + backend) |
| `make test` | Run Jest tests in Docker |
| `make lint` | ESLint check |
| `make lint-fix` | Auto-fix ESLint issues |
| `make i18n` | Extract translation strings from JSX |
| `make cypress-open` | Open Cypress interactive test runner |
| `make cypress-run` | Run Cypress tests headlessly |

## Business Context

Climate-ADAPT serves the European Commission and EEA with climate adaptation data, tools, and knowledge resources across 27 EU languages. The site has three main areas: the main Climate-ADAPT portal, the Health Observatory, and the EU Mission on Adaptation sub-portal.

<important if="you are adding a new block to this layer">
- See `.rpiv/guidance/src/components/architecture.md` — Block Installer Pattern & Adding a New Block
</important>

<important if="you are shadowing a core Volto or EEA addon component">
- See `.rpiv/guidance/src/customizations/architecture.md` — Shadowing Pattern
- Every shadowed component MUST have a README.md explaining the modification
</important>

<important if="you are adding a new search engine or modifying search configuration">
- See `.rpiv/guidance/src/search/architecture.md` — Search Engine Config Pattern
</important>

<important if="you are adding Redux state (reducers, actions, middleware)">
- See `.rpiv/guidance/src/store/architecture.md` — Reducer & Action Creator Patterns
</important>

<important if="you are working with theme styles or Semantic UI overrides">
- See `.rpiv/guidance/theme/architecture.md` — Theme Override Pattern
- Block-specific styles go in the block's own `styles.less`, NOT in the global theme
</important>

<important if="you are writing or modifying tests">
- Unit: Jest + React Testing Library, test files as `.test.jsx` co-located with components
- E2E: Cypress 13, run via `make cypress-open` or `make cypress-run`
- Jest config: `jest-addon.config.js` with module mapping for `@eeacms/*` and `@plone/volto`
- Snapshots in `__snapshots__/` directories; update with `make test-update`
</important>

<important if="you are working with internationalization or translations">
- 27 EU languages in `locales/` (one directory per language code)
- Extract strings with `make i18n` after modifying JSX with `FormattedMessage` or `defineMessages`
- Use `react-intl` — `defineMessages` for message definitions, `FormattedMessage` / `useIntl` in components
- String `id` is the English key; `defaultMessage` is the English fallback
</important>

<important if="you are adding server-side rendering (SSR) middleware">
- SSR express middleware in `src/express-middleware.js` — proxies `@@` views (case studies map, country metadata, translation)
- Guard server-only code with `if (__SERVER__)` checks
- The middleware is conditionally installed in `src/index.js` when `__SERVER__` is true
</important>
