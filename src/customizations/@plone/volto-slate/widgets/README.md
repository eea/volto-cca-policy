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
