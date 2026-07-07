# Link Integrity — Block Field Coverage Report

**Date:** 2026-05-18
**Scope:** All blocks registered by `volto-cca-policy`, analyzed against the link integrity retrievers available in `plone.restapi` and `eea.climateadapt`.

---

## Retrievers in Play

Three retrievers scan block data when content is saved:

| Retriever | Source | Order | Fields Scanned | Scope |
|---|---|---|---|---|
| `GenericBlockLinksRetriever` | `plone.restapi` | 1 | `url`, `href`, `preview_image` (top-level only) | All blocks (`block_type = None`) |
| `TextBlockLinksRetriever` | `plone.restapi` | 100 | DraftJS `entityMap` LINK entities (`href`, `url`) | `block_type = "text"` |
| `SlateBlockLinksRetriever` | `plone.restapi` | 100 | Slate nodes: `handle_a` → `data.link.internal.internal_link[0]["@id"]`, `handle_link` → `data.url` | `block_type = "slate"` |
| `CCAObjectListLinksRetriever` | `eea.climateadapt` | 10 | `items[*].source`, `items[*].href`, `items[*].url`, top-level `linkTo`, top-level `image` | All blocks (`block_type = None`) |

**Key constraint:** `GenericBlockLinksRetriever` only checks **top-level** fields named exactly `url`, `href`, or `preview_image`. It does NOT recurse into lists, dicts, or nested structures. Any link stored in a non-standard field name or nested inside a list requires the `CCAObjectListLinksRetriever` (or a new custom retriever).

---

## Block-by-Block Analysis

### 1. Blocks WITH internal link fields — FULLY COVERED

These blocks use standard top-level field names (`href`, `url`) that `GenericBlockLinksRetriever` catches, or their nested `items` are covered by `CCAObjectListLinksRetriever`.

| Block | Field(s) | Widget | Covered By | Notes |
|---|---|---|---|---|
| **RedirectBlock** | `href` | `object_browser` | `GenericBlockLinksRetriever` | Standard `href` at top level |
| **CountryMapObservatory** | `href` | `object_browser` | `GenericBlockLinksRetriever` | Standard `href` at top level |
| **CollectionStatistics** | `href` | `object_browser` | `GenericBlockLinksRetriever` | Standard `href` at top level |
| **ASTNavigation** | `href` (top-level) | `object_browser` | `GenericBlockLinksRetriever` | Main entry page link |
| **ASTNavigation** | `items[*].href` | `object_browser` (in `object_list`) | `CCAObjectListLinksRetriever` | Nav items — `items` list with `href` field |
| **ContentLinks** | `items[*].source` | `object_browser` (in `object_list`) | `CCAObjectListLinksRetriever` | `source` in items is explicitly handled |
| **RelevantAceContent** | `items[*].source` | `object_browser` (in `object_list`) | `CCAObjectListLinksRetriever` | `source` in items is explicitly handled |

### 2. Blocks WITH internal link fields — NOT COVERED (GAP)

These blocks have fields that store internal links (via `object_browser`, path strings, or similar) but the field name or structure is **not** recognized by any existing retriever.

| Block | Field(s) | Widget / Type | Why Not Covered | Risk |
|---|---|---|---|---|
| **Listing** (standard, extended) | `linkHref` | `object_browser` | Field name is `linkHref` — not in `GenericBlockLinksRetriever` (`url`, `href`, `preview_image`) and not in `CCAObjectListLinksRetriever` (`linkTo`, `image`). The CCA retriever checks `linkTo` but Volto core uses `linkHref`. | **Medium** — The "Link to..." / "More..." button link is silently missed. |
| **RASTBlock** | `root_path` | plain `string` (path) | Stores a plain path string (e.g., `/en/knowledge-and-data/...`), NOT a `resolveuid/` URL. The retrievers only match strings containing `resolveuid`. | **Low** — Editors type paths manually; no object_browser. Moving the target folder breaks the link with no warning. |

### 3. Blocks WITHOUT internal link fields — NO ACTION NEEDED

These blocks either have no link-bearing fields, fetch content dynamically from the server, or use server-side `@components` views.

| Block | Rationale |
|---|---|
| **C3SIndicatorsGlossaryBlock** | Empty schema. Content fetched from `@components` view `c3s_indicators_glossary_table`. |
| **C3SIndicatorsListingBlock** | Empty schema. Content fetched from `@components` view `c3s_indicators_listing`. |
| **C3SIndicatorsOverviewBlock** | Empty schema (category field commented out). Content fetched from `@components` view `c3s_indicators_overview`. |
| **CaseStudyExplorer** | No schema file. Loads data from ArcGIS JSON endpoint (`@@case-studies-map.arcgis.json`). No content links stored in block data. |
| **CountryMapHeatIndex** | No schema file. Renders country map from static GeoJSON + metadata endpoint. No content links in block data. |
| **CountryMapProfile** | No schema file. Same pattern as CountryMapHeatIndex. No content links in block data. |
| **CountryProfileDetail** | No schema file. Renders HTML from `@components` view `countryprofile`. |
| **ECDEIndicators** | No schema file. Embeds CDS toolbox apps by region code. No content links in block data. |
| **FilterAceContent** | Schema has only filter parameters (vocabularies, search text, sort). No `object_browser` or link fields. Results are fetched dynamically. |
| **SearchAceContent** | Same as FilterAceContent — only filter/search parameters. No content links stored. |
| **FlourishEmbedBlock** | `embed_code` is a `textarea` with raw HTML/JS. Not parsed by any retriever. Links (if any) are external Flourish URLs. |
| **ReadMore** | Behavioral block only (labels, height, position). No links. |
| **DataConnectedEmbedBlock** | Extends `@eeacms/volto-datablocks`. Only adds a `languageParam` string field. The base block's URL fields (if any) are handled by the base package's own mechanisms. |
| **TransRegionSelect** | `region` is a vocabulary choice (not a link). Renders links dynamically from `@components` view. |
| **TabsBlock (Spotlight)** | Container block. Links in child blocks are discovered recursively by `visit_blocks`. The spotlight variation's `image` field (in tab settings) is covered by `CCAObjectListLinksRetriever` (top-level `image`). |

---

## Summary of Gaps

### Gap 1: Listing block — `linkHref` field

**Problem:** The standard Volto listing block stores its "More..." link in a field named `linkHref`. The `GenericBlockLinksRetriever` only scans `url`, `href`, `preview_image`. The `CCAObjectListLinksRetriever` scans `linkTo` and `image` — neither matches `linkHref`.

**Impact:** If an editor configures a listing block with a "Link to..." destination, and that destination is moved or made private, the link integrity system will NOT report this listing block as a breacher.

**Remediation options:**
1. **Extend `CCAObjectListLinksRetriever`** to also scan `linkHref` (add it to the top-level fields list alongside `linkTo` and `image`). This is the simplest fix — one line change.
2. **Register a dedicated `ListingBlockLinksRetriever`** adapted to `block_type = "listing"`. More explicit but more code.

**Recommendation:** Option 1 — add `linkHref` to the top-level fields in `CCAObjectListLinksRetriever`.

### Gap 2: RASTBlock — `root_path` field

**Problem:** `root_path` stores a plain content path (e.g., `/en/knowledge-and-data/rast`) as a string. It is NOT stored as `resolveuid/<UID>`, so even if the field name were recognized, `get_urls_from_value` would not match it (it checks for `resolveuid` in the string).

**Impact:** If the root folder is moved, the RAST block silently points to a 404. No link integrity warning.

**Remediation options:**
1. **Change the widget** to `object_browser` and store as `resolveuid/` — then add `root_path` to a retriever. This is a schema change with migration implications.
2. **Accept the risk** — the field is typed manually by editors and is inherently fragile regardless of link integrity.
3. **Add a custom deserializer** that converts the path to `resolveuid/` on save, then add `root_path` to a retriever.

**Recommendation:** Option 2 (accept risk) for now — the field is a single path string used by a small number of blocks, and converting it to `object_browser` would be a larger UX change. Document the limitation.

---

## Coverage Matrix

| Block | Link Fields | Generic Retriever | CCA Retriever | Gap? |
|---|---|---|---|---|
| RedirectBlock | `href` | ✅ | — | No |
| CountryMapObservatory | `href` | ✅ | — | No |
| CollectionStatistics | `href` | ✅ | — | No |
| ASTNavigation | `href` (top) | ✅ | — | No |
| ASTNavigation | `items[*].href` | ❌ | ✅ | No |
| ContentLinks | `items[*].source` | ❌ | ✅ | No |
| RelevantAceContent | `items[*].source` | ❌ | ✅ | No |
| **Listing** | `linkHref` | ❌ | ❌ | **Yes** |
| RASTBlock | `root_path` | ❌ | ❌ | Yes (low risk) |
| FlourishEmbedBlock | `embed_code` | ❌ | ❌ | N/A (external) |
| All others | (none) | — | — | No |

---

## Notes on plone.restapi / plone.volto Checkouts

- **plone.restapi** is checked out at `backend/sources/plone.restapi/`. It provides `GenericBlockLinksRetriever` (fields: `url`, `href`, `preview_image`), `TextBlockLinksRetriever` (DraftJS), and `SlateBlockLinksRetriever`.
- **plone.volto** is NOT checked out in `backend/sources/`. It is installed as a packaged dependency in the backend venv. No custom link integrity retrievers were found in the EEA policy package (`eea.volto.policy`) — it only provides serialization/deserialization transformers, not link retrievers.
- The `CCAObjectListLinksRetriever` in `eea.climateadapt` is the **only** custom link integrity retriever in the project. It runs at order 10 (before Generic at order 1, but both return independent lists that are unioned).

---

## Recommendations

1. **Fix the Listing gap immediately** — add `linkHref` to `CCAObjectListLinksRetriever`'s top-level field scan (one-line change in `blocks_linkintegrity.py`).
2. **Consider adding `image` to Generic coverage analysis** — `CCAObjectListLinksRetriever` already covers `image`, but if a future block uses `image` without items, it would only be caught by CCA's retriever.
3. **Document the RASTBlock limitation** in the block's developer notes or BLOCKS.md.
4. **Future blocks:** Always name link fields `href` or `url` at the top level, or `items[*].href` / `items[*].source` for nested lists, to benefit from existing retrievers.
