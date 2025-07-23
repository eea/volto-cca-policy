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

Also added `unwrapTopLevelDivs()` to unwrap <div> elements and wrap text nodes in <p> before deserialization, ensuring imported HTML is editable in the Slate editor.
