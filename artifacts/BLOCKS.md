# Custom Blocks in `volto-cca-policy`

This addon registers **20 custom blocks** and extends **2 existing blocks** (Listing, Tabs Block) with new variations.
All blocks are installed via `src/components/manage/Blocks/index.js`.

---

## Custom Blocks

### AST Navigation
- **Block ID:** `astNavigation`
- **Group:** `site`
- **Restricted to:** Mission pages (via `blockAvailableInMission`)
- **What it does:** Renders a visual navigation map (logo map) for the *Adaptation Support Tool (AST)*. Supports two image types (`ast` and `uast`). Editors configure 6 linked items that map to clickable regions on the logo image. Clicking a region navigates to the corresponding content page.

### C3S Indicators Glossary
- **Block ID:** `c3SIndicatorsGlossaryBlock`
- **Group:** `site`
- **Restricted to:** Mission pages
- **What it does:** Displays a glossary table of C3S (Copernicus Climate Change Service) indicator terms. The content is provided by a server-side `@components` view (`c3s_indicators_glossary_table`) and rendered as raw HTML.

### C3S Indicators Listing
- **Block ID:** `c3SIndicatorListingBlock`
- **Group:** `site`
- **Restricted to:** Mission pages
- **What it does:** Renders a description and a linked list of C3S indicators. Content (description text + item list with URLs) is provided by the server-side `@components` view `c3s_indicators_listing`.

### C3S Indicators Overview
- **Block ID:** `c3SIndicatorsOverviewBlock`
- **Group:** `site`
- **Restricted to:** Mission pages
- **What it does:** Displays an HTML description/overview of C3S indicators, fetched from the server-side `@components` view `c3s_indicators_overview`.

### Case Study Explorer
- **Block ID:** `caseStudyExplorer`
- **Group:** `site`
- **Restricted to:** Mission pages
- **What it does:** An interactive map-based explorer for climate adaptation case studies. Loads case study data from an ArcGIS JSON endpoint (`@@case-studies-map.arcgis.json`). Provides filter controls (sectors, impacts, etc.) and an interactive map with clickable features. Supports URL-based filter parameters.

### Collection Statistics
- **Block ID:** `collectionStats`
- **Group:** `site`
- **What it does:** Displays aggregated statistics for a content collection. Shows two groups of stats with icons and counts:
  - **Health impacts:** Climate-sensitive diseases, Heat, Wildfires, Droughts and floods, Air pollution and aero-allergens
  - **Content types:** Adaptation options, Case studies, Guidance, Indicators, Information portals, Organisations, Publications, Research projects, Tools, Videos
- Stats are computed from query stats via `getQueryStats` and can link to filtered search results.

### Content Links
- **Block ID:** `contentLinks`
- **Group:** `site`
- **Variations:**
  - `default` — Simple list of linked content items
  - `navigationList` — Navigation-style list with active-state highlighting based on current URL
  - `dropdown` — Dropdown selector for linking to content items (with configurable placeholder text)
- **What it does:** Displays a set of manually selected content items as links. Useful for sidebars, navigation menus, or quick-access link groups.

### Country Map Heat Index
- **Block ID:** `countryMapHeatIndex`
- **Group:** `site`
- **Restricted to:** Mission pages
- **What it does:** An interactive OpenLayers map of European countries colored by heat index data. Fetches metadata from `@@countries-heat-index-json`. Countries are highlighted with tooltips and are clickable, navigating to the respective country page. Includes a filter control and supports lazy loading via visibility sensor.

### Country Map Observatory
- **Block ID:** `countryMapObservatory`
- **Group:** `site`
- **Restricted to:** Mission pages
- **What it does:** An interactive OpenLayers map for the Health Observatory section. Renders EU countries with metadata from `@@countries-metadata-extract-2025`. Supports thematic map modes (e.g., "National adaptation policy"), tooltips, and click-to-navigate interactions. Uses WMS tile sources and lazy loading.

### Country Map Profile
- **Block ID:** `countryMapProfile`
- **Group:** `site`
- **Restricted to:** Mission pages
- **What it does:** An interactive OpenLayers map for country profiles. Renders EU countries with metadata from `@@countries-metadata-extract-2025` (including flag images). Supports thematic map modes, tooltips, click-to-navigate, and a filter control. Uses WMS tile sources and lazy loading.

### Country Profile Detail
- **Block ID:** `countryProfileDetail`
- **Group:** `site`
- **What it does:** Renders the detailed country profile content provided by a server-side `@components` view (`countryprofile.html`). Displays tabbed sections with accordions, including a language disclaimer for non-English content and optional top messages/accordions.

### Data Connected Embed Block
- **Block ID:** `data_connected_embed` (extends `@eeacms/volto-datablocks`)
- **What it does:** Customizes the data-connected embed block from `volto-datablocks` to inject the current page language (`lang`) as an additional query parameter. This ensures embedded data visualizations respect the page's language context. Wraps the base `ViewEmbedBlock` with Redux connectivity and `injectIntl`.

### ECDE Indicators
- **Block ID:** `ecdeIndicators`
- **Group:** `site`
- **Restricted to:** Mission pages
- **What it does:** Embeds European Climate Data Explorer (ECDE) indicator visualizations from the Copernicus Climate Data Store (CDS). Loads region data from an EEA ArcGIS service and renders interactive CDS toolbox apps (e.g., growing degree days, mean temperature) for selected European NUTS regions.

### Filter AceContent
- **Block ID:** `filterAceContent`
- **Group:** `site`
- **Restricted to:** Mission pages
- **Variations:**
  - `simpleListing` — Listing view (default)
  - `simpleCards` — Card grid view
- **What it does:** Provides a faceted search/filter interface for ACE (Adaptation Content Exchange) content. Supports filtering by bio-regions, countries, climate impacts, sectors, element types, funding programmes, macro-regions, key types, and free-text search. Uses a custom select widget with styled dropdowns.

### Flourish Visualization
- **Block ID:** `FlourishEmbedBlock`
- **Group:** `site`
- **What it does:** Embeds interactive data visualizations from [Flourish.studio](https://flourish.studio). Editors paste a Flourish embed code, and the block extracts the visualization URL, wraps it in an iframe with privacy protection (lazy loading via consent gate), and displays it at a fixed height of 980px.

### RAST (Related And Sub-Tree) Block
- **Block ID:** `rastBlock`
- **Group:** `site`
- **Restricted to:** Mission pages
- **What it does:** Renders a contextual navigation block showing related content and sub-items from a configurable root path. Supports skipping specific items and optionally showing subfolders. Uses `ContextNavigation` and `RASTAccordion` components to display a hierarchical accordion-style navigation tree.

### Read More
- **Block ID:** `readMoreBlock`
- **Group:** `site`
- **What it does:** Creates a collapsible "read more" section. Wraps all preceding sibling blocks in a height-constrained container with an expand/collapse button. Configurable properties include open/closed labels, button position, and initial height.

### Redirection Block
- **Block ID:** `redirectBlock`
- **Group:** `site`
- **What it does:** Automatically redirects anonymous users to a configured target URL. Logged-in users (editors) see a discreet notice showing the redirect target instead of being redirected, so they can still edit the page.

### Relevant AceContent
- **Block ID:** `relevantAceContent`
- **Group:** `site`
- **Restricted to:** Mission pages
- **What it does:** Displays a list of relevant ACE (Adaptation Content Exchange) items. Supports two modes: manually selected items and dynamically searched results (by element type, sector, search type, special tags, or search text). Can combine both modes. Renders as a simple linked list.

### Search AceContent
- **Block ID:** `searchAceContent`
- **Group:** `site`
- **Restricted to:** Mission pages
- **What it does:** Displays search results from the ACE content search API. Shows results as a linked list with translated labels and counts. Includes a "Share your information" button linking to the share page.

### Tabs Block — Spotlight Variation
- **Block ID:** `tabs_block` (extends `@eeacms/volto-tabs-block`)
- **Variation added:** `spotlight`
- **What it does:** Adds a "Spotlight" variation to the standard tabs block. Renders tab content with a spotlight-style layout featuring configurable icons or images (with position and size options), simple markdown support, and scroll-to-target behavior.

### Trans Region Select
- **Block ID:** `transRegionSelect`
- **Group:** `site`
- **Restricted to:** Mission pages
- **What it does:** Renders a dropdown selector for transnational regions. Fetches region data from the content's `@components` view (`transnationalregion`) and provides a dropdown with links to each region's page, plus a default "Other regions" option.

---

## Extended Standard Blocks

### Listing (standard Volto block — extended)
The standard Volto `listing` block is extended with **6 new variations**:

| Variation | Description |
|-----------|-------------|
| `dropdown` | Renders listed items as a dropdown selector with a configurable placeholder text |
| `organisationCards` | Displays items as a 4-column card grid with logo/image and description (for organisations) |
| `indicatorCards` | Displays C3S/Lancet Countdown indicators as styled cards with title and description |
| `eventCards` | Displays events as cards with date info, contact details, event URL, and EEA branding |
| `eventAccordion` | Displays events in an accordion layout with formatted date ranges and "read more" expand |
| `simpleListing` | Plain text list of linked items (minimal styling) |
| `simpleCards` | Generic 4-column card grid with image/logo and title |

Additionally, the listing block's `noResultsComponent` is overridden to render nothing (instead of showing "No results" text).

---

## Shared Utilities

- **`withResponsiveContainer.js`** — HOC that wraps map blocks in a responsive container (used by Country Map blocks)
- **`withVisibilitySensor.jsx`** — HOC that defers map initialization until the block is visible in the viewport (lazy loading)
