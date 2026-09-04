# Store Layer (Redux State Management)

## Responsibility
Manages addon-specific Redux state: physical breadcrumbs (separate from standard breadcrumbs for `@physical-breadcrumbs` endpoint) and query statistics. Also provides a Redux middleware for automatic language path redirection.

## Dependencies
- **Redux**: Action types, reducer pattern, middleware
- **@plone/volto**: Action type constants (`GET_BREADCRUMBS`), `flattenToAppURL` helper
- **lodash**: `map` for transforming API responses

## Consumers
- **`src/customizations/volto/components/manage/Contents/ContentsBreadcrumbs.jsx`**: Uses `physicalBreadcrumbs` reducer instead of standard breadcrumbs
- **`src/index.js`**: Registers reducers via `installStore` and middleware via `storeExtenders`

## Module Structure
```
src/store/
├── index.js              # Installer — registers addonReducers
├── middleware.js         # langRedirection middleware (auto-redirect /en/ to /{locale}/)
├── constants.js          # Action type constants
├── actions/              # Action creators (one per feature)
│   ├── physical-breadcrumbs.js
│   └── querystats.js
└── reducers/             # Reducers (one per feature)
    ├── physical-breadcrumbs.js
    └── querystats.js
```

## Reducer Pattern (Standard Pending/Success/Fail)

All reducers follow the standard Volto async action pattern with `_PENDING`, `_SUCCESS`, `_FAIL` suffixes. The `querystats` reducer uses `action.id` for keyed state (multiple concurrent queries).

```javascript
// Standard reducer pattern
const initialState = { error: null, items: [], loaded: false, loading: false };

export default function myReducer(state = initialState, action = {}) {
  switch (action.type) {
    case `${ACTION_TYPE}_PENDING`:
      return { ...state, error: null, loaded: false, loading: true };
    case `${ACTION_TYPE}_SUCCESS`:
      return { ...state, items: action.result, loaded: true, loading: false };
    case `${ACTION_TYPE}_FAIL`:
      return { ...state, error: action.error, items: [], loaded: false, loading: false };
    default:
      return state;
  }
}
```

## Action Creator Pattern

Actions return plain objects with `type` and `request` — Volto's API middleware handles the HTTP call and dispatches the `_PENDING`/`_SUCCESS`/`_FAIL` lifecycle.

```javascript
export function getPhysicalBreadcrumbs(url) {
  return {
    type: GET_PHYSICAL_BREADCRUMBS,
    request: { op: 'get', path: `${url}/@physical-breadcrumbs` },
  };
}
```

## Language Redirection Middleware

The `langRedirection` middleware intercepts `@@router/LOCATION_CHANGE` actions to automatically redirect `/en/` paths to the user's preferred locale (e.g., `/en/page` → `/de/page`). Skips search pages and URLs with `?set_language` query param. Also strips `++api++` from paths.

## Architectural Boundaries
- **NO direct API calls in reducers**: Use action creators that return `request` objects — Volto's middleware handles HTTP
- **NO shared mutable state**: Each feature gets its own reducer slice registered in `addonReducers`

<important if="you are adding a new reducer to this layer">
## Adding a New Reducer
1. Add action type constant in `src/store/constants.js` (or a new constants file)
2. Create `actions/{feature}.js` — action creator returning `{ type, request: { op, path } }`
3. Create `reducers/{feature}.js` — standard pending/success/fail reducer
4. Register in `src/store/index.js` — add to `config.addonReducers`
5. Export from `src/store/index.js` barrel if the action/reducer is consumed externally
</important>
