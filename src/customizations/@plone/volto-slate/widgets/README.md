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
Fix missing content inside `<div>` tag:

Added `unwrapDivs()` to unwrap `<div>` elements and wrap loose text nodes in `<p>` before deserialization. This fixes issues where content inside `<div>` tags was not recognized by the Slate editor and appeared empty or uneditable in edit mode.

Preserve trailing spaces:

Fixes issue where typing a space at the end of a line wouldn’t persist due to `collapseWhitespace: true` during deserialization.

```js
const [valueFromHtml, setValueFromHtml] = React.useState(() =>
  fromHtml(value),
);

const debouncedOnChange = useMemo(() => debounce(...), [...]);
```
