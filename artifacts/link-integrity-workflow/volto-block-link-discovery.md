# How Volto Discovers Links in Blocks for Link Integrity

When a content item is saved in Plone, the system needs to know which other internal items it links to, so it can maintain the `zc.relation` catalog (specifically using the `isReferencing` relationship). 

For traditional Plone, this meant parsing HTML in `RichText` fields. For Volto, the content is stored as JSON blocks, requiring a recursive discovery mechanism.

## Sub-block Storage and Discovery

Sub-blocks are stored in the JSON data of a parent block using one of two primary patterns. The Plone backend uses a recursive generator called `visit_blocks` (defined in `plone.restapi.blocks`) to walk this tree.

### 1. Dictionary Mapping (Key-Value)
This is the standard Volto pattern for container-like blocks.
- **Storage Pattern**: A dictionary where keys are UUIDs and values are the sub-block data.
- **Common Keys**: `blocks` or `data["blocks"]`.
- **Discovery**: `plone.restapi.blocks.NestedBlocksVisitor` is registered for these keys. It yields each value in the dictionary.

### 2. Sequential Lists
This pattern is used by layout-oriented blocks where the order is strictly positional.
- **Storage Pattern**: A simple list of block data objects.
- **Core Volto Keys**: `columns`, `slides`, `hrefList`.
- **Discovery**: `plone.volto.transforms.NestedBlocksVisitor` handles these keys. It iterates through the list and yields each block.

### 3. Recursive Discovery Logic
The `visit_blocks` function uses `IBlockVisitor` subscribers to find children. When a visitor yields a sub-block, `visit_blocks` immediately recurses into that sub-block. This ensures that a block tree of any depth (e.g., a Grid containing Columns containing Teasers) is fully flattened during the discovery phase.

## Internal Link Extraction

Once a block is discovered, the `BlocksRetriever` (in `plone.restapi.blocks_linkintegrity`) uses `IBlockFieldLinkIntegrityRetriever` subscribers to find internal links within that specific block's fields.

### Automatic Link Detection (The Generic Retriever)
The `GenericBlockLinksRetriever` provides a "zero-configuration" discovery for most custom blocks. It automatically scans the following fields if they contain the `resolveuid/` pattern:
- `url`
- `href`
- `preview_image`

**Note**: If a block uses custom field names for links (e.g., `source`, `target`, `link_to`), they will **NOT** be caught by the generic retriever unless they are specifically registered.

### Complex Data Extraction
Some blocks store links deep within complex JSON structures rather than simple top-level strings. These require specialized retrievers:

1. **Slate Blocks (Rich Text)**:
   - Uses `SlateBlockLinksRetriever`.
   - Recursively walks the Slate node tree.
   - Extracts UIDs from `data.link.internal.internal_link[0]["@id"]` and `data.url`.

2. **DraftJS Blocks (Legacy Text)**:
   - Uses `TextBlockLinksRetriever`.
   - Parses the `entityMap` for `LINK` entities.
   - Extracts data from `url` and `href` keys within the entity data.

## Redundancy and Reliability
To ensure maximum reliability, `plone.volto` includes a `NestedBlockLinkRetriever` (registered with `block_type = None`). This serves as a fail-safe that manually walks the `columns`, `hrefList`, and `slides` keys to trigger link extraction, providing a second layer of defense for nested layouts.

## Summary for Developers
To ensure a custom block is correctly tracked by the link integrity system:

1.  **Field Naming**: Prefer naming your link fields `url` or `href` to benefit from the generic retriever.
2.  **Nesting**: If your block contains sub-blocks, store them in a dictionary under the key `blocks`.
3.  **Link Format**: Always store internal links using the `resolveuid/<UID>` format.
4.  **Custom Retrievers**: If you must use unique field names or storage patterns, register a custom `IBlockFieldLinkIntegrityRetriever` adapter for your block's `@type` in the backend.
