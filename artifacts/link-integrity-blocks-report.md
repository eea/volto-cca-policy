# Volto Block Link Integrity Analysis Report - volto-cca-policy

## Objective
Identify blocks within the `volto-cca-policy` add-on that contain internal links in fields or structures not covered by the standard Plone/Volto link integrity discovery mechanisms.

## Standard Coverage Recap

The following mechanisms are provided by core packages:

1.  **`plone.restapi` (Generic Retriever)**: Automatically extracts links from top-level fields: `url`, `href`, `preview_image`.
2.  **`plone.restapi` (Visitors)**: Recursively visits sub-blocks stored in `blocks` or `data.blocks`.
3.  **`plone.volto` (Visitors/Retrievers)**: Recursively visits sub-blocks stored in `columns`, `hrefList`, and `slides`.
4.  **`eea.climateadapt` (Backend Custom Retriever)**: Specifically covers `items[*].source`, `items[*].href`, `items[*].url`, and top-level `linkTo` and `image`.

## Analysis of volto-cca-policy Blocks

| Block (@type) | Field Location | Covered? | Reason / Mechanism |
| :--- | :--- | :--- | :--- |
| `ContentLinks` | `items[*].source` | **Yes** | `CCAObjectListLinksRetriever` (Backend) |
| `RelevantAceContent` | `items[*].source` | **Yes** | `CCAObjectListLinksRetriever` (Backend) |
| `ASTNavigation` | `items[*].href` | **Yes** | `CCAObjectListLinksRetriever` (Backend) |
| `Listing` (Shadowed) | `linkTo` | **Yes** | `CCAObjectListLinksRetriever` (Backend) |
| `RedirectBlock` | `href` | **Yes** | `GenericBlockLinksRetriever` (Core) |
| `CountryMapObservatory`| `href` | **Yes** | `GenericBlockLinksRetriever` (Core) |
| `CollectionStatistics` | `href` | **Yes** | `GenericBlockLinksRetriever` (Core) |
| `TabsBlock` (Spotlight)| `tabs[*].blocks` | **NO** | `tabs` key is not visited by core visitors. |
| `TabsBlock` (Spotlight)| `tabs[*].image` | **NO** | `tabs` structure is not scanned for link fields. |
| `FlourishEmbedBlock` | `embed_code` | **NO** | Raw HTML/JS (requires parsing). |
| `CaseStudyExplorer` | `adaptation_options_links` | **NO** | Raw HTML (often dynamic source). |
| `RASTBlock` | `root_path` | **NO** | Hardcoded string path (not a UID). |

## Detailed Findings

### 1. TabsBlock (Spotlight Variation)
The `TabsBlock` in `volto-cca-policy` uses a custom `tabs` key to store a dictionary of tab data. Each tab can contain its own sub-blocks (`blocks` key) and a promotional `image`.
*   **Sub-blocks Visibility**: Since neither `plone.restapi` nor `plone.volto` includes `tabs` in their `IBlockVisitor` implementations, the backend link integrity system is "blind" to any blocks placed inside a spotlight tab.
*   **Image Visibility**: The `image` field within a tab is nested inside the `tabs` object list/map, which is not scanned by the generic or CCA-specific retrievers.

### 2. FlourishEmbedBlock
This block stores raw HTML or Javascript snippets for embedding Flourish charts. Internal links within these snippets are not tracked because they are not stored as structured data or `resolveuid/` patterns.

### 3. RASTBlock
Uses a `root_path` field which stores an absolute path as a string (e.g., `/en/knowledge-and-data/...`). Link integrity tracking depends on `resolveuid/` patterns and `zc.relation` objects. Paths are not automatically tracked or updated if the target moves.

## Recommendations

1.  **Expand Backend Retriever**: Update `CCAObjectListLinksRetriever` (or add a new one) to handle the `tabs` structure:
    *   Visit each item in the `tabs` dictionary.
    *   Extract links from the `image` field if present.
    *   (Optional) If `tabs` items contain their own blocks, a custom `IBlockVisitor` should be registered to allow core recursion to reach them.
2.  **Refactor RASTBlock**: If possible, change `root_path` to use a proper object browser widget and store a UID.
3.  **Documentation**: Advise developers to stick to `blocks`, `columns`, or `slides` for sub-block storage, or `items` for list-based links to benefit from existing retrievers.
