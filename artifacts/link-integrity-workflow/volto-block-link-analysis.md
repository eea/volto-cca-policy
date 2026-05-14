# Volto Block Link Discovery Analysis - volto-cca-policy

This document analyzes the custom blocks defined in the `volto-cca-policy` add-on to identify which fields contain internal links and whether they are covered by the standard Plone/Volto link integrity discovery mechanism.

## Standard Discovery Mechanism Recap

As documented in `volto-block-link-discovery.md`, the `GenericBlockLinksRetriever` automatically extracts internal links from the following top-level fields:
- `url`
- `href`
- `preview_image`

Any field not named exactly like one of these, or any link nested within a list or dictionary (unless it's a `blocks` container), requires a specialized retriever on the backend.

## Analysis of volto-cca-policy Blocks

### 1. Blocks Covered by Generic Retriever
The following blocks use standard field names at the top level and should be automatically tracked.

| Block | Field | Description |
|---|---|---|
| `RedirectBlock` | `href` | The target object for the redirection. |
| `CountryMapObservatory` | `href` | The parent location of all country profiles. |
| `CollectionStatistics` | `href` | The destination listing page. |
| `ASTNavigation` | `href` | The main entry page to AST/UAST (top-level). |

### 2. Blocks NOT Covered (Custom Field Names)
The following blocks use field names that are not recognized by the generic retriever.

| Block | Field | Description |
|---|---|---|
| `Listing` (Shadowed) | `linkTo` | Standard Volto listing block uses `linkTo` for the "More..." link. |

### 3. Blocks NOT Covered (Nested Links)
The following blocks store links within an `object_list`. The generic retriever does not scan inside these lists.

| Block | Field Path | Description |
|---|---|---|
| `ContentLinks` | `items[*].source` | A list of hand-picked content items. |
| `RelevantAceContent` | `items[*].source` | A list of hand-picked content items (assigned items). |
| `ASTNavigation` | `items[*].href` | Individual navigation steps in the AST map. |

### 4. Special Cases

#### `FlourishEmbedBlock`
- **Field**: `embed_code` (Textarea)
- **Status**: Not covered.
- **Reason**: Contains raw HTML/JS snippets. Discovery would require parsing the HTML for URLs, which is not performed by the standard block retrievers.

#### `TabsBlock` (Spotlight Variation)
- **Status**: Covered (indirectly).
- **Reason**: This is a container block. The `NestedBlocksVisitor` handles the recursion into its child blocks, so any links within those children will be discovered normally.

#### `ReadMore`
- **Status**: No Links.
- **Reason**: This is a behavioral block that manipulates the DOM of its siblings on the frontend. It does not store links in its own block data.

## Recommendations for Link Integrity

To ensure full coverage for `volto-cca-policy` content, the following actions are recommended:

1.  **Backend Adapters**: Register custom `IBlockFieldLinkIntegrityRetriever` adapters for `ContentLinks`, `RelevantAceContent`, and `ASTNavigation` to extract links from their `items` lists.
2.  **Field Mapping**: If possible, refactor `ContentLinks` and `RelevantAceContent` to use `href` or `url` instead of `source` for individual items, although a custom retriever is still needed for the list structure.
3.  **Core Coverage**: Verify if `plone.restapi` or `plone.volto` provides a specialized retriever for the `listing` block's `linkTo` field. If not, one should be added.
