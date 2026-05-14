# How Volto Discovers Links in Blocks for Link Integrity

When a content item is saved in Plone, the system needs to know which other internal items it links to, so it can maintain the `zc.relation` catalog (specifically using the `isReferencing` relationship). 

For traditional Plone, this meant parsing HTML in `RichText` fields. For Volto, the content is stored as JSON blocks, requiring a recursive discovery mechanism.

## The Foundation: `visit_blocks`
Discovery starts with a recursive generator in `plone.restapi` called `visit_blocks`. It walks the entire tree of blocks, including nested ones, by delegating the discovery of "children" to multiple `IBlockVisitor` subscribers.

### How Sub-blocks are Stored and Discovered
There are three main patterns for storing sub-blocks in Volto:

1. **Dictionary Mapping (`blocks`)**:
   - **Pattern**: `block["blocks"]` or `block["data"]["blocks"]` is a dictionary where keys are UUIDs and values are block data.
   - **Visitor**: `plone.restapi.blocks.NestedBlocksVisitor` handles these. It yields the `.values()` of these dictionaries.

2. **Sequential Lists**:
   - **Pattern**: `block["columns"]`, `block["slides"]`, or `block["hrefList"]` are lists of block data objects.
   - **Visitor**: `plone.volto.transforms.NestedBlocksVisitor` handles these core Volto layout keys.

3. **Recursive Children (Slate)**:
   - **Pattern**: Slate blocks (rich text) store content as a tree of nodes, where each node can have a `children` list. 
   - **Visitor**: `plone.restapi.blocks.NestedBlocksVisitor` also has special logic for `__somersault__` (plate) blocks to walk these children.

## Link Extraction: `IBlockFieldLinkIntegrityRetriever`
Once `visit_blocks` has identified a specific block data object, the system looks for `IBlockFieldLinkIntegrityRetriever` subscribers to extract internal links from that block's fields.

### Key Fields Used for Linking
The backend recognizes several fields as potential sources for internal links. A link is identified as internal if it contains the string `resolveuid/`.

1. **Generic Link Fields**:
   - **Fields**: `url`, `href`, `preview_image`.
   - **Implementation**: `GenericBlockLinksRetriever` (in `plone.restapi`).
   - **Logic**: It automatically checks these keys in *any* block type. It can even find links inside nested lists or dictionaries assigned to these keys.

2. **Slate (Rich Text) Links**:
   - **Implementation**: `SlateBlockLinksRetriever` (in `plone.restapi`).
   - **Logic**: It deep-walks the Slate JSON tree. It looks for nodes of type `a` or `link`.
   - **Specific Path**: It extracts the UID from `data.link.internal.internal_link[0]["@id"]` or `data.url`.

3. **DraftJS (Old Text) Links**:
   - **Implementation**: `TextBlockLinksRetriever` (in `plone.restapi`).
   - **Logic**: It parses the `entityMap` looking for `LINK` entities and extracts their `url` or `href` data.

## Redundancy and Reliability
In `plone.volto`, there is an additional `NestedBlockLinkRetriever` (registered for `block_type = None`). This serves as a fail-safe that manually triggers link extraction on the `columns`, `hrefList`, and `slides` keys, ensuring that even if the primary visitor missed something, the link integrity system will still catch it.

## Summary for Developers
To ensure a custom block supports link integrity:
- **Use standard keys**: Store your main link in a field named `url` or `href`.
- **Use standard nesting**: If your block contains sub-blocks, store them in a dictionary under the key `blocks`.
- **Custom implementation**: If you must use custom keys, register a new `IBlockFieldLinkIntegrityRetriever` for your `@type` in the backend. 
- **Internal links**: Always store internal links using the `resolveuid/<UID>` format (Volto's `UniversalLink` and `ObjectBrowser` widgets do this by default). 
