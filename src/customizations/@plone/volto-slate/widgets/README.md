# Customizations

Customized for this

```js
if (data.length) {
  data = normalizeExternalData(editor, data);
} else {
  return [createEmptyParagraph()];
}
```

and this:

```js
let data = deserialize(editor, body, { collapseWhitespace: true });
```

Also added `unwrapDivs()`:

- Unwraps `<div>` elements
- Wraps loose text nodes in `<p>` tags
- Ensures imported HTML is editable in the Slate editor
