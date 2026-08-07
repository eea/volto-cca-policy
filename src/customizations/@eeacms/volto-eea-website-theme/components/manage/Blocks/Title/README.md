The EEA Title block shows content type and date metadata by default.

For selected Climate-ADAPT content types, this metadata should instead be hidden by default.

What changed:

The EEA Title block Edit component is customized to set these values to true:

```
hideContentType
hideCreationDate
hidePublishingDate
hideModificationDate
```

The defaults are applied only to configured content types:

```
const HIDE_METADATA_BY_DEFAULT_TYPES = [
  GUIDANCE,
  NEWS_ITEM,
];
```
