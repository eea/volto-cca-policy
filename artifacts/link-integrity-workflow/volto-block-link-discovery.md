# How Volto Discovers Links in Blocks for Link Integrity

When a content item is saved in Plone, the system needs to know which other internal items it links to, so it can maintain the `zc.relation` catalog (specifically using the `isReferencing` relationship). 

For traditional Plone, this meant parsing HTML in `RichText` fields. For Volto, the content is stored as JSON blocks, requiring a different approach.

## The Plone REST API Foundation
The discovery of links within JSON blocks is driven by a specific interface defined in `plone.restapi`:
`plone.restapi.interfaces.IBlockFieldLinkIntegrityRetriever`

When a Dexterity object with the `IBlocks` behavior is modified, the backend iterates over its blocks. For each block, it looks for subscribers (adapters) registered to provide `IBlockFieldLinkIntegrityRetriever` for that specific block type (identified by the `@type` property in the JSON).

## Nested Block Support in `plone.volto`
Volto introduces complex layouts that allow blocks to be nested inside other blocks (e.g., a text block placed inside a column block, or an image inside a slider). 

If Plone only looked at the top-level blocks, it would miss links hidden deep within these nested structures. To solve this, `plone.volto` provides a generic adapter in `src/plone/volto/linkintegrity.py` called `NestedBlockLinkRetriever`.

### How `NestedBlockLinkRetriever` Works:

1. **Generic Registration**: It is registered as a subscriber for *any* block type (`block_type = None`), ensuring it runs for every block parsed by the system.
2. **Identifying Nested Structures**: When analyzing a block, it explicitly checks for JSON keys that are known to contain arrays of nested blocks in Volto core:
   - `columns`
   - `hrefList`
   - `slides`
3. **Recursive Extraction**: If it finds a list of blocks under any of these specific keys, it iterates through them.
4. **Delegation**: For each nested block found, it queries the component registry for `IBlockFieldLinkIntegrityRetriever` subscribers registered for that exact nested block's `@type`.
5. **Aggregation**: It aggregates all the discovered links from the nested blocks into a single `set()` and returns it.

```python
# Snippet from plone.volto/linkintegrity.py
def __call__(self, block):
    links = set()
    for nested_name in ("columns", "hrefList", "slides"):
        nested_blocks = block.get(nested_name, [])
        if not isinstance(nested_blocks, list):
            continue
        for nested_block in nested_blocks:
            links |= self.retrieveLinks(nested_block)
    return links
```

## Summary
The discovery process is highly extensible. `plone.restapi` provides the mechanism to extract links from standard block fields (like finding a `resolveuid/` in a text block). `plone.volto` builds upon this by providing the `NestedBlockLinkRetriever`, which acts as a recursive crawler. 

Together, they ensure that the Plone backend can walk through a deeply nested JSON block tree, extract all internal references, and keep the link integrity graph completely up to date.