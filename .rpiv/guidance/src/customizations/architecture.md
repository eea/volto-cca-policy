# Customizations Layer (Component Shadowing)

## Responsibility
Overrides of Volto core, EEA addon, and plone-collective components via Volto's shadowing system. Each shadowed component must have a `README.md` explaining the rationale. Mirrors the original package path under `src/customizations/`.

## Dependencies
- **@plone/volto**: Core components, reducers, middleware being shadowed
- **@eeacms/* addons**: EEA design system and theme components being overridden
- **Redux**: For reducer and middleware shadowing

## Consumers
- **Volto build system**: Automatically resolves shadowed components before core versions
- **`src/components/manage/Workflow/`**: The Workflow shadow imports `WorkflowLinkIntegrityModal` from the components layer

## Module Structure
```
src/customizations/
├── volto/                     # Shadow core Volto components
│   ├── components/manage/     # Editor-side overrides
│   │   ├── Workflow/          # Link integrity check on private transitions
│   │   ├── Contents/          # Physical breadcrumbs instead of standard
│   │   ├── Multilingual/      # Translation object customization
│   │   ├── Widgets/           # ObjectBrowserWidget override
│   │   ├── View/              # DefaultView, LinkView, View overrides
│   │   └── ...
│   ├── components/theme/      # Public-facing overrides (App, Header, Sitemap)
│   ├── helpers/               # Helper function overrides (LanguageMap, Url)
│   ├── reducers/              # Redux reducer overrides (actions, breadcrumbs, navigation)
│   └── middleware/            # API middleware override
├── @eeacms/                   # Shadow EEA addon components
│   ├── volto-eea-design-system/ui/Header/  # Header menu and search popups
│   ├── volto-block-style/     # StyleWrapper schema override
│   ├── volto-listing-block/   # Listing block cards and item templates
│   └── volto-banner/          # Banner override
├── @plone/volto-slate/        # Slate editor overrides (Table, Text, Image, normalize)
└── @plone-collective/         # Community addon overrides
    ├── volto-authomatic/      # Login component
    └── volto-rss-provider/    # Express middleware
```

## Shadowing Pattern

Mirror the original file path from the target package. Every shadowed component MUST include a `README.md` (or `Readme.md`) explaining what was changed and why.

```
# Original path:
@plone/volto/components/manage/Workflow/Workflow.jsx

# Shadow path:
src/customizations/volto/components/manage/Workflow/Workflow.jsx
                  + README.md
```

## Volto Slate Override Pattern

The `@plone/volto-slate` shadowing is extensive — covering Table deconstruction, Text block, Image plugin, normalization, and block utilities. These are needed because Climate-ADAPT uses a patched Volto-slate fork with custom behavior for table handling and image processing.

## Architectural Boundaries
- **NO shadowing without README.md**: Every shadowed file must document its purpose
- **NO silent passthrough**: If a shadowed component only delegates to the original, remove the shadow — it adds maintenance burden
- **Minimize shadow surface**: Prefer Volto's config API (`config.blocks`, `config.views`, etc.) over shadowing when possible

<important if="you are shadowing a new core component">
## Shadowing a New Component
1. Determine the original file path in the target package (e.g., `@plone/volto/components/manage/X/X.jsx`)
2. Create `src/customizations/volto/components/manage/X/X.jsx` mirroring the path
3. Add `README.md` in the same directory explaining the modification
4. Import from `@plone/volto/components/manage/X/X.jsx` if you need the original as a base
5. For EEA addons, use `src/customizations/@eeacms/{addon-name}/` prefix
</important>
