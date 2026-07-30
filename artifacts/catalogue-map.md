# Navigator Catalogue Map View — Discovery Notes

> Created during discovery phase. Use this as context when resuming work.

## Goal

Enhance the Navigator Catalogue search with a functional **Map view** alongside the existing **List view**, allowing users to browse Climate-ADAPT navigation tools geographically.

## Map View Requirements

### Visual Design
- Map centered on **Europe**
- Shows **countries** color-coded by the number of tools they have:
  - **10 or more** — darkest shade
  - **7–9** — dark shade
  - **4–6** — medium shade
  - **1–3** — light shade
  - **none** — no color / neutral

### Country Popup (on click)
```
**Italy**
5 tools available
[Explore tools →]
```
- Country name (bold)
- Count of tools matching current filters
- Button that navigates to the filtered tool listing for that country

### Filter Synchronization
- The map must **reflect the same filters** as the listing view
- When a user changes facets (countries, sectors, impacts, etc.), the map updates
- When clicking "Explore tools" on a country popup, it should apply that country filter and switch to listing view

### Pagination Concern
- **The map must show ALL results**, not just the current page
- The listing view uses pagination (10/25/50 per page), but the map aggregates across all results
- This means we need to either:
  - Fetch all results in a separate request (ignoring pagination)
  - Or use Elasticsearch aggregations to get country counts directly
- **Decision needed:** approach to be determined during planning

### Development Approach
- **Iterative development**: plan together, implement one task at a time, review, iterate
- **First task:** display all results without pagination (no map yet, just verify we can access the full dataset)
- **Subsequent tasks:** map rendering, country coloring, popups, filter sync

### API Reference
- Sample curl command: `artifacts/get_data.sh` (copied from browser network inspector)
- Endpoint: `POST http://localhost:3000/_es/globalsearch/_search`
- Response includes: `hits.hits[]` (results), `hits.total` (total count), aggregations
- Current request uses `size: 10` — we'll need to override this for the map view

---

## Design Decisions (Locked In)

### 1. Data Fetching: Reuse Existing Country Facet Aggregation
- The `geographic_countries` facet (`cca_geographic_countries.keyword`) is **already configured** in the navigator catalogue
- Because `isMulti: true`, searchlib auto-adds it to `disjunctiveFacets`
- `applyDisjunctiveFaceting` already fetches its counts via a separate ES request (`size: 0`, aggregations only)
- Country counts are available in `searchContext.facets['cca_geographic_countries.keyword'].data`:
  ```js
  { value: 'Germany', count: 15 },
  { value: 'France', count: 8 },
  ```
- **No extra requests needed** — the map reads from the existing search context
- Counts automatically reflect active filters (sectors, impacts, search term, etc.)

### 2. GeoJSON Source: Existing CountryMapObservatory Data
- Reuse the `withGeoJsonData` HOC from `CountryMapObservatoryOLView`
- Already tested in the codebase, loads Europe country boundaries
- Provides consistent country shapes across the application

### 3. Color Scheme: EEA Green Tones
- Use shades of the EEA accent green (`#289588` family)
- 5-step gradient from light (1-3 tools) to dark (10+ tools)
- Consistent with existing design system

### 4. Popup Navigation: Apply Filter + Switch to List
- Clicking "Explore tools" adds the country to active filters
- Switches from map view to listing view
- User sees filtered results in the familiar card layout

---

## Implementation Plan (Iterative)

### Phase 1: Data Access (Simplified)
- ~~Task 1: Display all results without pagination~~ — **SKIPPED**. Country counts already available via existing facet aggregation.
- **Task 1 (revised):** Verify we can read country counts from `searchContext.facets` in the map component

### Phase 2: Map Rendering
- **Task 2:** Set up OpenLayers map with GeoJSON country boundaries (reuse `withGeoJsonData`)
- **Task 3:** Implement color-coding based on tool counts (EEA green tones, 5-step)

### Phase 3: Interactivity
- **Task 4:** Add click interactions and popups (country name, count, "Explore tools" button)
- **Task 5:** Implement filter synchronization — clicking "Explore tools" applies country filter + switches to list view

### Phase 4: Polish
- **Task 6:** Legend component, responsive design, loading states
- **Task 7:** Accessibility, testing

---

## Architecture Overview

### 3-Layer Search System

1. **`@eeacms/search`** (core library)
   - Location: `frontend/node_modules/@eeacms/volto-searchlib/searchlib/`
   - Provides: registry pattern, search apps, view hooks, facet/filter system
   - Key exports: `SearchApp`, `SearchResultsApp`, `SearchView`, `registry`, `useViews`, `useSearchContext`

2. **`@eeacms/volto-searchlib`** (Volto block wrapper)
   - Location: `frontend/src/addons/volto-searchlib/`
   - Provides: `SearchBlockView`, block variations, ES proxy middleware (`/_es/*`)

3. **`@eeacms/volto-globalsearch`** (shared configuration)
   - Location: `frontend/src/addons/volto-globalsearch/`
   - Provides: `globalsearchbase` config, `build_runtime_mappings()`, base view definitions

---

## Navigator Catalogue — Current State

### Configuration Files

All in `frontend/src/addons/volto-cca-policy/src/search/navigator_catalogue/`:

| File | Purpose |
|------|---------|
| `config.js` | Main config — merges with `globalsearchbase`, sets `cluster_name: 'cca_navigator'` permanent filter, configures facets/views |
| `views.js` | Declares 2 views: `listing` (default) and `map` |
| `facets.js` | Countries, climate impacts, adaptation sectors, language, cycle steps, user groups, output types, data types, license, NBS |

### views.js — Map View Already Registered

```js
const viewsCatalogue = {
  resultViews: [
    {
      id: 'listing',
      title: 'List view',
      icon: 'ri-list-check',
      isDefault: true,
      factories: { view: 'HorizontalCard.Group', item: 'NavigatorCatalogueCardItem' },
    },
    {
      id: 'map',
      title: 'Map view',
      icon: 'ri-map-2-line',
      isDefault: false,
      factories: { view: 'NavigatorCatalogueMapView', item: 'NavigatorCatalogueCardItem' },
    },
  ],
};
```

### Component Registration (src/index.js)

```js
config.settings.searchlib.resolve.NavigatorCatalogueCardItem = { component: NavigatorCatalogueCardItem };
config.settings.searchlib.resolve.NavigatorCatalogueMapView = { component: NavigatorCatalogueMapView };
config.settings.searchlib.resolve.NavigatorCatalogueContentView = { component: NavigatorCatalogueContentView };
```

### Current Map View — Placeholder Only

```jsx
// src/components/Search/NavigatorCatalogue/NavigatorCatalogueMapView.jsx
const NavigatorCatalogueMapView = () => (
  <div className="navigator-catalogue-map-placeholder">
    <p>Map view.</p>
  </div>
);
```

---

## Rendering Chain

```
SearchResultsView
  └─ SearchResultsApp (@eeacms/search)
       └─ SearchView
            └─ BodyContent
                 └─ ContentBodyView (NavigatorCatalogueContentView)
                      └─ ResultViewComponent (resolved from registry)
                           └─ Item components (NavigatorCatalogueCardItem) as children
```

### How Views Are Resolved

1. `NavigatorCatalogueContentView` reads `views.activeViewId` via `useViews()`
2. Looks up `resultViews.find(view => view.id === activeViewId)`
3. Resolves `listingViewDef.factories.view` through `registry.resolve[name].component`
4. For `listing` → `'HorizontalCard.Group'` → `<div className="listing">{children}</div>`
5. For `map` → `'NavigatorCatalogueMapView'` → the component to implement

### How Items Are Passed

`BodyContent` (from searchlib) maps results and renders them as children:

```jsx
{results.map((result, i) => (
  <Item key={`${i}-${result.id}`} result={result} {...itemViewProps} />
))}
```

The `Item` component comes from `listingViewDef.factories.item` (both listing and map use `NavigatorCatalogueCardItem`).

---

## Key Components Reference

### NavigatorCatalogueContentView
- Path: `src/components/Search/NavigatorCatalogue/NavigatorCatalogueContentView.jsx`
- Manages view tab switching (listing ↔ map)
- Sets `layoutMode` to `'fixed'` for listing, `'fullwidth'` for map
- Renders `ResultViewComponent` resolved from registry
- Contains: ActiveFilterList, DropdownFacetsList, Sorting, Paging, ResultsPerPageSelector, DownloadButton, CompareToolsPanel

### NavigatorCatalogueCardItem
- Path: `src/components/Search/NavigatorCatalogue/NavigatorCatalogueCardItem.jsx`
- Renders individual tool cards with: icon, provider, title, description, sectors, hazards, cycle steps, license, compare checkbox, "View tool" button
- Uses `result.href`, `result.title`, `result.cca_adaptation_sectors`, `result.cca_climate_impacts`, etc.

---

## Existing Map Infrastructure

### @eeacms/volto-openlayers-map

- Location: `frontend/node_modules/@eeacms/volto-openlayers-map/`
- Provides:
  - `withOpenLayers` HOC — lazy-loads all OpenLayers modules (`ol`, `ol.source`, `ol.layer`, `ol.style`, etc.)
  - `<Map>` — main map container with view config
  - `<Layer.Tile>`, `<Layer.Vector>`, `<Layer.VectorImage>` — layer components
  - `<Layers>` — layer group wrapper
  - `<Controls>` — zoom, attribution controls
  - `<Interactions>` — drag, zoom, select, keyboard
  - `useMapContext` hook — access OL map instance, add layers/interactions

### Reference Implementation: CountryMapObservatoryOLView

- Path: `src/components/manage/Blocks/CountryMapObservatory/CountryMapObservatoryOLView.jsx`
- Demonstrates: WMS tile layers from `gisco-services.ec.europa.eu`, vector layers from GeoJSON, click interactions, tooltips, styling
- Uses `compose()` with `withOpenLayers`, `withGeoJsonData`, `withResponsiveContainer`, `withVisibilitySensor`

### Reference Implementation: GeolocationWidgetMapContainer

- Path: `src/components/theme/Widgets/GeolocationWidgetMapContainer.jsx`
- Demonstrates: draggable pin marker, vector source/layer creation, projection conversion (`ol.proj.fromLonLat` / `ol.proj.toLonLat`), modify interaction

---

## Data Model — Geographic Fields in Search Results

| Field | Type | Description |
|-------|------|-------------|
| `cca_geographic_countries.keyword` | string[] | Country names (e.g. "Germany", "France") |
| `cca_geographical_scale.keyword` | string[] | Spatial scale descriptors |
| `spatial` | string[] | From global search config (country/region names) |
| `cca_preview_image` | string | Preview image URL |
| `tool_provider` | object | `{ raw: "Provider Name" }` |
| `href` | string | Link to the tool page |
| `about` | object | `{ raw: "full URL" }` |

**Open question**: Do search results include lat/lon coordinates directly? If not, we may need to:
- Geocode country names via Nominatim (OpenStreetMap) — already used by `GeolocationWidget`
- Or embed coordinates in the Elasticsearch index via a custom field

---

## Styles

- Main styles: `theme/globals/navigator.less`
- Existing placeholder style: `.navigator-catalogue-map-placeholder` (min-height: 320px, dashed border, centered content)
- Search-specific styles: `theme/globals/search.less`
- Design tokens: `@eeacms/volto-design-tokens` (colors, spacing, etc.)
- Key color variables: `@navigatorAccentColor: #289588`, `@navigatorBorderColor: #d7dee5`, `@navigatorMetaTextColor: #7c8a96`

---

## Search Catalogue Registry Pattern

Custom components are registered in `src/index.js`:

```js
config.settings.searchlib.resolve.ComponentName = { component: ComponentClass };
```

The base registry (`searchlib/registry.js`) has built-in entries like:
- `'HorizontalCard.Group'` → `<div className="listing">{props.children}</div>`
- `'Card.Group'` → `<Card.Group stackable itemsPerRow={4} doubling />`
- `'Item.Group'` → `<Item.Group />`

---

## Files Involved

### Navigator Catalogue Configuration
- `src/search/navigator_catalogue/config.js`
- `src/search/navigator_catalogue/views.js`
- `src/search/navigator_catalogue/facets.js`

### Navigator Catalogue Components
- `src/components/Search/NavigatorCatalogue/NavigatorCatalogueMapView.jsx` — **TO IMPLEMENT**
- `src/components/Search/NavigatorCatalogue/NavigatorCatalogueCardItem.jsx`
- `src/components/Search/NavigatorCatalogue/NavigatorCatalogueContentView.jsx`
- `src/components/Search/NavigatorCatalogue/utils.js`

### Shared Search Infrastructure
- `src/search/index.js` — registers all search catalogues
- `src/search/common.js` — shared facet definitions (countries, climate impacts, etc.)
- `src/search/utils.js` — `getTodayWithTime()`, `getClientProxyAddress()`, `getSearchThumbUrl()`
- `src/search/vocabulary.js` — vocab mappings for display labels

### Main Addon Entry
- `src/index.js` — component registration, Volto config

### Styles
- `theme/globals/navigator.less`
- `theme/globals/search.less`

### Reference Implementations (maps)
- `src/components/manage/Blocks/CountryMapObservatory/CountryMapObservatoryOLView.jsx`
- `src/components/theme/Widgets/GeolocationWidgetMapContainer.jsx`

---

## What Needs to Be Built

1. **Replace `NavigatorCatalogueMapView.jsx`** with a real OpenLayers map component
2. **Access search results** — use `useSearchContext()` from `@eeacms/search/lib/hocs` to get `results` array
3. **Plot markers** on the map — resolve geographic data (country names → coordinates, or use embedded coords)
4. **Handle interactions** — click markers to show result info / navigate to items
5. **Responsive layout** — content view already switches to `fullwidth` for map view
6. **LESS styles** — map container, markers, popups, responsive breakpoints
7. **Consider**: clustering for many results, zoom-to-fit, loading states

---

## Dependencies Already Available

- `@eeacms/volto-openlayers-map` — OL wrapper components and HOCs
- `@eeacms/search` — `useSearchContext`, `useViews`, `useAppConfig`, `registry`
- `@elastic/react-search-ui` — `Sorting`, search context
- `semantic-ui-react` — UI components (Popup, Icon, etc.)
- `react-intl` — `defineMessages`, `useIntl`, `FormattedMessage`
- `jotai` — `useAtomValue` for state management
- `@eeacms/volto-design-tokens` — design system tokens

---

## Notes

- The `navigator-catalogue-above-results` div in `NavigatorCatalogueContentView` holds the view tabs (List / Map)
- `NAVIGATOR_VIEW_IDS = ['listing', 'map']` controls which views are available
- The map view receives results as children (same as listing), but for a map we likely need direct access to results via context rather than children
- `CompareToolsPanel` is rendered after the result view in `NavigatorCatalogueContentView` — may need to stay visible in map view
