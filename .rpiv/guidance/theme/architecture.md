# Theme Layer (Semantic UI LESS)

## Responsibility
Visual theme for Climate-ADAPT built on Semantic UI LESS with the EEA design system (`eea-volto-theme-folder`) as the base. Provides site-wide variables, element overrides, domain-specific styles (mission, observatory), and design tokens.

## Dependencies
- **Semantic UI LESS**: Theme system with `@themesFolder`, `@siteFolder`, element/collection/module/view overrides
- **eea-volto-theme-folder**: EEA design system base theme (all elements set to `@eea`)
- **volto-themes**: Theme infrastructure (`@themesFolder: '~volto-themes'`)

## Consumers
- **Volto build system**: Compiles LESS through `theme.config` entry point
- **Block components**: Import block-specific `styles.less` from `src/components/manage/Blocks/`
- **`src/index.js`**: Imports `slate-styles.less` for Slate editor styling

## Module Structure
```
theme/
├── theme.config             # Semantic UI config — all elements → 'eea' theme, addon overrides loader
├── tokens/                  # Design tokens
│   ├── colors.less          # Color palette definitions
│   └── tokens.less          # Aggregated tokens imported by site.variables
├── globals/                 # Site-wide styles
│   ├── site.variables       # Brand colors, toolbar dimensions, imports tokens
│   ├── site.overrides       # Global override rules
│   ├── mission.less         # EU Mission-specific styles
│   ├── observatory.less     # Health Observatory-specific styles
│   ├── search.less          # Search interface styles
│   ├── blocks.less          # Block layout utilities
│   ├── views.less           # Content type view styles
│   └── print.less           # Print stylesheet
├── elements/                # Per-element overrides (button, list)
├── collections/             # Per-collection overrides (table)
├── extras/                  # EEA custom component overrides (banner, footer, header, hero, etc.)
└── assets/                  # Images (Header logos, Footer logos)
```

## Theme Override Pattern

Use `.variables` files to change design tokens (colors, sizes) and `.overrides` files to add/modify CSS rules. The `theme.config` sets `@site: 'eea'` so all Semantic UI elements inherit EEA styling by default — only override what Climate-ADAPT needs differently.

```less
// site.variables — Brand colors and dimensions
@import '@eeacms/volto-cca-policy/../theme/tokens/tokens';

@secondaryColor: #005c97;
@ccaGreenColor: #8a9c39;
@ccaOrangeColor: #ef7000;
@linkColor: #006bb8;

@toolbarWidth: 80px;
@sidebarWidth: 375px;
```

## Block Styles Convention

Block-specific styles go in the block's own `styles.less` file under `src/components/manage/Blocks/{BlockName}/styles.less` — NOT in the global theme directory. Global theme files are reserved for site-wide patterns.

## Architectural Boundaries
- **NO block styles in global theme**: Each block owns its styles.less
- **NO raw color values in overrides**: Reference tokens from `tokens/tokens.less`
- **NO JavaScript-injected styles for layout**: Use LESS; dynamic styles (map highlights) use JSS in `.js` files
