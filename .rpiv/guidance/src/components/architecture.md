# Components Layer

## Responsibility
Custom UI components for Climate-ADAPT: content editor blocks (`manage/`), public-facing views and widgets (`theme/`), and search result item renderers (`Result/`). Sits atop Volto core and EEA design system addons.

## Dependencies
- **@plone/volto**: Block config API, helpers, Redux actions
- **semantic-ui-react**: Layout primitives (Grid, Label, etc.)
- **@eeacms/volto-openlayers-map**: OpenLayers wrapper for map blocks
- **react-intl**: Internationalization (`defineMessages`, `FormattedMessage`, `useIntl`)
- **@eeacms/search**: `useAppConfig`, `registry.resolve` for search result components

## Consumers
- **`src/index.js`**: Registers components as views, widgets, and app extras
- **`src/components/manage/Blocks/index.js`**: Composes all block installers into `config.blocks.blocksConfig`
- **Volto core**: Consumes blocks via the standard block rendering system

## Module Structure
```
src/components/
├── index.js                    # Barrel exports
├── manage/                     # Content editor components
│   ├── Blocks/                 # One directory per block type
│   │   ├── {BlockName}/        # index.js (installer) + Edit.js + View.js (+ helpers)
│   │   ├── withResponsiveContainer.jsx  # Shared HOC — responsive container sizing
│   │   └── withVisibilitySensor.jsx     # Shared HOC — lazy render on scroll into view
│   ├── CreateArchivedCopyButton/  # Toolbar button for archiving
│   └── Workflow/              # Link integrity modal for workflow transitions
├── theme/                      # Public-facing components
│   ├── Views/                  # Content type views (one per @type)
│   ├── Widgets/                # Form widgets (geochars, geolocation, promotional_image)
│   ├── ASTNavigation/          # Adaptation Support Tool navigation
│   ├── MissionSignatoryProfile/ # Signatory profile with tabbed sections
│   └── {Component}/            # Utility components (AccordionList, BannerTitle, etc.)
├── Result/                     # Custom search result item renderers
└── manage/TransparentOverlay.jsx  # Full-screen overlay for async operations
```

## Block Installer Pattern (CRITICAL: `config` composition)

Each block is an installer function that adds an entry to `config.blocks.blocksConfig` and returns `config`. All installers are composed in `Blocks/index.js` via Redux `compose()`.

```javascript
// {BlockName}/index.js
export default function installBlock(config) {
  config.blocks.blocksConfig.myBlock = {
    id: 'myBlock',
    title: 'My Block',
    icon: iconSVG,
    group: 'site',
    edit: Edit,
    view: View,
    security: { addPermission: [], view: [] },
  };
  return config;
}

// Blocks/index.js — Compose all installers
export default function installBlocks(config) {
  return compose(installRAST, installReadMore, /* ... */)(config);
}
```

## Edit Wraps View Pattern (Default)

Most blocks share a single View and pass `mode="edit"` from Edit. Block settings are edited via the **Block sidebar**, not inline. Use separate Edit+View only when the block needs a custom in-canvas editor.

```javascript
// Edit.js
import View from './View';
export default function MyBlockEdit(props) {
  return <View {...props} mode="edit" />;
}

// View.js — Branches on mode
export default function MyBlockView({ mode, block, data }) {
  const isEditing = mode === 'edit';
}
```

## Block Styles Convention

Each block gets its own `styles.less` co-located in the block directory — never in global theme files.

## Architectural Boundaries
- **NO direct Redux dispatch in theme components**: Use Volto's `@plone/volto/actions` or custom actions from `src/store/actions/`
- **NO server-side rendering of map blocks**: Guard with `if (__SERVER__) return <Loading />`
- **NO inline styles for layout**: Use LESS files or Semantic UI classes

<important if="you are adding a new block to this layer">
## Adding a New Block
1. Create `src/components/manage/Blocks/{BlockName}/` directory
2. Add `index.js` — installer function registering in `config.blocks.blocksConfig`
3. Add `View.js` — the main rendering component (handles both view and edit modes)
4. Add `Edit.js` — wraps View with `mode="edit"` (or create separate Edit if inline editing needed)
5. Add `styles.less` if custom styling is needed (imported from View.js)
6. Register the installer in `src/components/manage/Blocks/index.js` compose chain
7. Set `restricted` if the block should only appear in certain contexts (use `blockAvailableInMission`)
</important>

<important if="you are writing or modifying tests for this layer">
## Testing Conventions
- Jest test files use `.test.jsx` suffix, co-located with components
- Test snapshots in `__snapshots__/` subdirectories
- Run via `make test` (Docker) or `CI=true make test` for CI mode
- Mock external dependencies (e.g., `GeolocationWidgetMapContainer` in `__mocks__/`)
</important>
