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

Also added `unwrapDivs()` to unwrap `<div>` elements and wrap loose text nodes in `<p>` before deserialization. This fixes issues where content inside `<div>` tags was not recognized by the Slate editor and appeared empty or uneditable in edit mode.