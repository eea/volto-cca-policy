# Test Fix Specification for volto-cca-policy

> Generated: 2026-05-14
> Branch: `link-integrity-workflow`
> Machine timezone: EEST (UTC+3)

## Current State

```
Test Suites: 4 failed, 57 passed, 61 total
Tests:       7 failed, 115 passed, 122 total
Snapshots:   6 failed, 12 passed, 18 total
```

Four test suites fail for three distinct root causes:

| # | Test File | Failure Type | Root Cause |
|---|-----------|-------------|------------|
| 1 | `Spotlight.test.jsx` | Suite won't run | `node:crypto` module resolution (uuid@10 + Jest 26) |
| 2 | `GeolocationWidget.test.jsx` | Assertion error | Mock path mismatch → real OpenLayers loads in Jest |
| 3 | `EventView.test.jsx` | 3 snapshot mismatches | Timezone-dependent date formatting |
| 4 | `CcaEventView.test.jsx` | 3 snapshot mismatches | Timezone-dependent date formatting |

---

## Problem 1: `node:crypto` — Spotlight.test.jsx

### Symptom

```
ENOENT: no such file or directory, open 'node:crypto'
    at Runtime.readFile (node_modules/jest-runtime/build/index.js:1987:21)
    at Object.<anonymous> (node_modules/uuid/dist/rng.js:7:42)
```

### Root Cause

The `uuid` package (v10.0.0) uses `require('node:crypto')` — the Node.js built-in module protocol prefix (`node:`). Jest 26.6.3 does not understand this protocol and tries to resolve `node:crypto` as a filesystem path, which fails.

`Spotlight.test.jsx` doesn't import `uuid` directly. It's a transitive dependency pulled in through Volto core or one of its addons when the Spotlight component tree is evaluated.

### Proposed Fix

Add a `moduleNameMapper` entry in `jest-addon.config.js` to redirect `node:crypto` to the real Node.js `crypto` module:

**File: `jest-addon.config.js`**

In the `moduleNameMapper` section, add:

```js
'^node:crypto$': 'crypto',
```

This tells Jest to resolve `node:crypto` to the standard `crypto` module, which Node.js provides natively and Jest can handle.

**Why this approach:**
- Minimal: one line in the config, no new files needed.
- Follows the established pattern used across the addon ecosystem (moduleNameMapper entries in jest-addon.config.js).
- Does NOT require creating a mock file (the AI agent's `crypto-mock.js` approach).
- The real `crypto` module works fine in Jest's Node.js environment — it just needs the `node:` prefix stripped.

---

## Problem 2: Mock path mismatch — GeolocationWidget.test.jsx

### Symptom

```
Invalid lib or bundle name ol,olCondition,olControl,olCoordinate,olEvents,olExtent,olFormat,olGeom,olInteraction,olLayer,olLoadingstrategy,olOverlay,olProj,olRender,olSource,olStyle,olTilegrid
    at flattenLazyBundle (Loadable/Loadable.js:30:11)
```

### Root Cause

Two layers of the problem:

**Layer 1 — Webpack vs Jest module resolution mismatch:**

Volto's webpack config uses `RelativeResolverPlugin` (`webpack-plugins/webpack-relative-resolver.js`) which rewrites relative imports into absolute addon-scoped paths at build time. For example, in production:

```
import MapContainer from './GeolocationWidgetMapContainer'
```

gets resolved by webpack to:

```
@eeacms/volto-cca-policy/components/theme/Widgets/GeolocationWidgetMapContainer
```

Jest does **not** use webpack. It resolves `./GeolocationWidgetMapContainer` as a relative filesystem path. So the two environments resolve the same import line to **different module identifiers**.

**Layer 2 — The test mocks the absolute path, but Jest loads the relative path:**

```js
// In the test — mocks the absolute (webpack-resolved) path:
jest.mock(
  '@eeacms/volto-cca-policy/components/theme/Widgets/GeolocationWidgetMapContainer',
);

// But GeolocationWidget.jsx imports it relatively:
import MapContainer from './GeolocationWidgetMapContainer';
```

In Jest, these are two different modules. The mock never applies. The real `GeolocationWidgetMapContainer` loads, which uses the `withOpenLayers` HOC from `volto-openlayers-map`. That HOC calls `useLazyLibs()` to dynamically load OpenLayers bundles, which crashes in Jest's environment.

### Proposed Fix

Two options. **Option A is recommended** because it fixes the source code to match the project convention (the rest of the codebase uses `@eeacms/volto-cca-policy/...` absolute imports — the relative import in `GeolocationWidget.jsx` is the outlier).

---

#### Option A: Change the source code to use the absolute import (recommended)

**File: `src/components/theme/Widgets/GeolocationWidget.jsx`**

Replace:

```js
import MapContainer from './GeolocationWidgetMapContainer';
```

With:

```js
import MapContainer from '@eeacms/volto-cca-policy/components/theme/Widgets/GeolocationWidgetMapContainer';
```

This makes the import consistent with the rest of the codebase (20+ files in this addon use `@eeacms/volto-cca-policy/...` imports). The existing test mock path (`@eeacms/volto-cca-policy/components/theme/Widgets/GeolocationWidgetMapContainer`) will now match in **both** webpack and Jest environments. No test file changes needed.

---

#### Option B: Mock both paths in the test file

If changing the source code is not desired, mock **both** the relative and absolute paths in the test:

**File: `src/components/theme/Widgets/GeolocationWidget.test.jsx`**

Replace:

```js
jest.mock(
  '@eeacms/volto-cca-policy/components/theme/Widgets/GeolocationWidgetMapContainer',
);
```

With:

```js
const MapContainerMock = () => <div id="map-container-mock" />;

// Mock the relative path (what Jest resolves):
jest.mock('./GeolocationWidgetMapContainer', () => MapContainerMock);

// Mock the absolute path (what webpack resolves — belt and suspenders):
jest.mock(
  '@eeacms/volto-cca-policy/components/theme/Widgets/GeolocationWidgetMapContainer',
  () => MapContainerMock,
);
```

**Why Option A is preferred:**
- One-line source code change, zero test changes.
- The relative import `./GeolocationWidgetMapContainer` is the **only** relative import to a sibling file within this addon's component tree. Every other internal import in `volto-cca-policy` uses the `@eeacms/volto-cca-policy/...` convention.
- Fixes the root cause (import inconsistency) rather than working around it in every test file.
- The existing test mock already targets the correct absolute path — it just never matched because of the relative import in the source.

---

## Problem 3 & 4: Timezone-dependent snapshots — EventView.test.jsx, CcaEventView.test.jsx

### Symptom

```
- Snapshot  - 2
+ Received  + 2

      <span className="start-time">
-       3:20 PM
+       6:20 PM
      </span>
```

The snapshots expect `3:20 PM` but the test produces `6:20 PM` (a 3-hour offset = UTC vs EEST).

### Root Cause

The test data uses UTC timestamps (e.g., `'2019-06-23T15:20:00+00:00'`). The `EventDetails` component (from `@eeacms/volto-cca-policy/helpers`) formats these dates using JavaScript's built-in `Date` methods, which convert to the **local timezone**. The snapshots were recorded on a machine in UTC (or a timezone with offset 0), but the current test machine is in EEST (UTC+3).

The snapshots contain:
- `3:20 PM` for `15:20:00+00:00` — correct in UTC
- `4:20 PM` for `16:20:00+00:00` — correct in UTC

On EEST, these render as `6:20 PM` and `7:20 PM` respectively.

### Proposed Fix

Set `TZ=UTC` for the Jest process so date formatting is deterministic and matches the snapshots. This is done via the `TZ` environment variable, which is the standard, cross-platform way to control timezone in JavaScript tests.

Two approaches (pick one):

**Approach A — Makefile target (recommended):**

Modify the `test` target in `frontend/Makefile` to set `TZ=UTC`:

```makefile
test: ## Run Jest tests for Volto add-on
	TZ=UTC RAZZLE_JEST_CONFIG=$(filter-out $@,$(MAKECMDGOALS))/jest-addon.config.js yarn test $(filter-out $@,$(MAKECMDGOALS))
```

This is the cleanest approach because:
- It applies to ALL addon tests consistently, preventing the same issue in other addons.
- No changes needed in individual test files.
- `TZ=UTC` is the standard approach for timezone-independent tests in CI environments.

**Approach B — jest.setup.js (if Approach A is not preferred):**

Add to `jest.setup.js` (at the top, before any imports that might use Date):

```js
// Ensure deterministic timezone for snapshot tests
process.env.TZ = 'UTC';
```

**Why this approach:**
- `TZ=UTC` is the established convention for deterministic date formatting in tests.
- Does not modify the component code or test data.
- Does not require updating snapshots — the tests will produce the same output as the recorded snapshots.
- Solves the problem for any future tests that render dates.

---

## Summary of Changes

### Option A (recommended — fix source import)

| File | Change | Lines |
|------|--------|-------|
| `jest-addon.config.js` | Add `'^node:crypto$': 'crypto'` to `moduleNameMapper` | +1 |
| `src/components/theme/Widgets/GeolocationWidget.jsx` | Change `import ... from './GeolocationWidgetMapContainer'` → `import ... from '@eeacms/volto-cca-policy/components/theme/Widgets/GeolocationWidgetMapContainer'` | 1 line |
| `frontend/Makefile` (root) | Add `TZ=UTC` to the `test` target | +1 |

### Option B (mock both paths in test)

| File | Change | Lines |
|------|--------|-------|
| `jest-addon.config.js` | Add `'^node:crypto$': 'crypto'` to `moduleNameMapper` | +1 |
| `src/components/theme/Widgets/GeolocationWidget.test.jsx` | Mock both `./GeolocationWidgetMapContainer` and `@eeacms/.../GeolocationWidgetMapContainer` | ~6 lines |
| `frontend/Makefile` (root) | Add `TZ=UTC` to the `test` target | +1 |

**No changes needed to:**
- `jest.setup.js` — the existing setup (with `thunk` middleware) is correct.
- `EventView.test.jsx` or `CcaEventView.test.jsx` — the snapshots are correct (UTC), the timezone environment is the fix.
- Any snapshot files — once `TZ=UTC` is set, they will match.
- `GeolocationWidget.test.jsx` (Option A only) — the existing absolute-path mock already works once the source import is aligned.

## What the Previous AI Agent Did Wrong

The previous attempt made these changes (now stashed/discarded):

1. **`jest.setup.js` — massive rewrite:** Mocked `uuid`, `redux-mock-store`, `useLazyLibs` globally; added `lazyBundles`/`loadables` config; switched to CommonJS `require()`. This was overly invasive — it changed the global test environment for ALL 61 test suites, introducing risk of masking real issues.

2. **`EventView.test.jsx` and `CcaEventView.test.jsx`:** Removed the `jest.mock('Loadable')` + `beforeAll(__setLoadables())` pattern. This was counterproductive — the Loadable mock is the established pattern used by 19+ test files across the addons. Removing it doesn't fix the timezone issue at all.

3. **`GeolocationWidget.test.jsx`:** Added `thunk` middleware to the local `configureStore()` call. Unnecessary — `jest.setup.js` already configures `configureStore([thunk])` globally. Also changed the mock path to `./GeolocationWidgetMapContainer` which fixes the Jest-side resolution but doesn't address the root cause: the source code uses a relative import where the rest of the codebase uses absolute `@eeacms/...` imports, creating a webpack/Jest resolution mismatch.

4. **Created `src/crypto-mock.js`:** An unnecessary file when `moduleNameMapper: 'node:crypto' -> 'crypto'` solves it in one line.
