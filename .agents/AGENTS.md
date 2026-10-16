# Boodoo Framework - Project Rules & Publishing Workflow


## Dynamic Dist Asset Size Tracking Rule
Whenever compiled framework dist files (`dist/css/*`, `dist/js/*`) or source files (`scss/`, `less/`, `js/`) are updated:

1. **Dynamic Size Injection**: Documentation fragments (`site/src/**/*.html`) and the landing page (`site/index.html`) must use dynamic template variables (e.g. `{{cssMinKb}}`, `{{cssRawKb}}`, `{{jsRawKb}}`, `{{jsMinKb}}`, `{{gridMinKb}}`, `{{rebootMinKb}}`, `{{utilsMinKb}}`, `{{animMinKb}}`) rather than hardcoded size numbers.
2. **Build Scripts**: `build/site-build.mjs` and `build/www-build.mjs` calculate real-time compiled file sizes from `dist/` via `getDistSizes()` and inject them across all generated HTML pages during `npm run www` / `npm run site`.
3. **README Accuracy**: Always ensure the performance tables and size highlights in `README.md` are updated to match the latest build measurements.

## Form Field Element Identification Rule
Form field elements (`<input>`, `<select>`, `<textarea>`) must always include an `id` or `name` attribute:

1. **Accessibility & Usability**: Every form field element must have an `id` (for `<label for="...">` association and accessibility tree mapping) and/or a `name` attribute (for form submission, serialization, and browser autofill).
2. **Examples & Documentation**: All form controls, snippets, components, and documentation examples across the framework (`site/src/**/*.html`, `site/**/*.html`, docs, test files) must strictly abide by this rule.

## Text Wrapping Rule
Text nodes must never be placed directly inside layout/container block elements like `<div>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<aside>`, or `<nav>`. Instead, text must always be wrapped in dedicated inline or semantic text elements:

1. **Semantic Text Elements**: Always wrap text in appropriate elements such as `<p>`, `<span>`, `<strong>`, `<em>`, `<h1>`–`<h6>`, `<small>`, `<kbd>`, `<code>`, `<label>`, or `<a>`.
2. **Container Purity**: Block containers such as `<div>` and `<section>` are strictly structural layouts (flex, grid, rows, cols, containers) and should only contain other elements, never raw/naked text strings.
3. **Consistency Across Framework**: All templates, HTML fragments, documentation examples, and component generation scripts across the project (`site/src/**/*.html`, `site/**/*.html`, `js/src/**/*.js`) must strictly follow this rule.

## Zip Archive CDN Hosting & Exclusion Rule
No `.zip` binary archive files may be committed or retained inside the project codebase or repository:

1. **Repository Exclusion**: All `.zip` files are strictly excluded from source control via `.gitignore` (`*.zip`, `site/archives/*.zip`, `www/archives/*.zip`). No zip binary must ever be added to git.
2. **CDN Delivery**: All downloadable zip archives (framework bundles, starter kits, example bundles) must be referenced exclusively via CDN URLs or dynamic template variables (`{{archiveLatestZip}}`, `{{archiveFrameworkZip}}`, `{{archiveExamplesZip}}`, `{{archiveStarterReact}}`, `{{archiveStarterVue}}`, `{{archiveStarterNext}}`, `{{archiveStarterHtml}}`). Hardcoded local zip links are strictly prohibited.
3. **Post-Creation CDN Upload**: When new zip archives are generated via `build/zip-build.mjs`, they must be uploaded to the CDN / release host (e.g., GitHub Releases / jsDelivr / CDN storage) post-creation. Code and templates must consume them via their CDN URLs recorded in `archives.json` / CDN endpoints, keeping the repository lean and binary-free.

## SCSS and LESS Dual-Source Feature Parity Rule
All features, styling primitives, theme tokens, layout utilities, and components added to Boodoo must be implemented and maintained across both SCSS (`scss/`) and LESS (`less/boodoo.less`):

1. **Equal Support & Parity**: Whenever a new component, styling modifier, utility class, design token, custom property binding, or dark mode behavior is added to `scss/`, its exact functional equivalent must simultaneously be implemented in `less/boodoo.less`.
2. **Build Validation**: The LESS distribution (`dist/css/boodoo.less.css`) must compile cleanly via `npm run css:less` on every change with zero syntax errors and zero deprecation warnings.
3. **Automated Verification**: `tests/framework.test.mjs` must enforce parity between SCSS and LESS implementations so that regressions or omissions in either stylesheet preprocessor are caught during `npm test`.

## Dynamic CSS Custom Property Theming Rule
Components, utility classes, hyperlinks, headings, and interactive states must bind to dynamic CSS custom properties (`var(--boodoo-...)`) rather than baking compile-time preprocessor values into the output:

1. **No Hardcoded Hex/Color Literals**: Never hardcode static theme colors (`$boodoo-primary`, `#7c3aed`) into component selectors (`.avatar`, `.badge`, `.card`, `.nav`, `.dropdown-item`, `.table`, `.btn-primary`, `.text-primary`, `a`, `h1`–`h6`). Always use `var(--boodoo-primary)` or `var(--boodoo-<token>, <fallback>)`.
2. **Runtime Re-Theming**: Overriding `--boodoo-primary` or any theme token on `:root` or a scoped container at runtime in the browser must immediately cascade through components, buttons, active states, text colors, links, and borders without requiring stylesheet recompilation.
3. **Utility Generation**: All utility classes generated in `$boodoo-color-map` and `$boodoo-utilities` must evaluate to CSS custom property bindings (`var(--boodoo-<name>, ...)`) so dynamic palette customization remains fully responsive in production.

## Dark Theme Inversion & Gray Scale Separation Rule
Dark mode rules (`@media (prefers-color-scheme: dark)` and `[data-boodoo-theme="dark"]`) must invert the gray scale without flattening distinct steps:

1. **Strict Step Separation**: The dark mode gray inversion must strictly mirror the light scale step-by-step: `--boodoo-gray-800` must map to light gray-200 (`#ececf4`), and `--boodoo-gray-900` must map to light gray-100 (`#f7f8fb`). Never assign both gray-800 and gray-900 to the same pale color.
2. **Surface Token Parity**: `--boodoo-light` and `--boodoo-dark` must invert dynamically between light and dark surfaces, and all component backgrounds (`--boodoo-card-bg`, `--boodoo-dropdown-bg`, `--boodoo-form-control-bg`) must consume their respective inverted dark-surface tokens.
3. **Automated Inversion Testing**: `tests/framework.test.mjs` must assert that dark mode selectors contain distinct values for `--boodoo-gray-800` and `--boodoo-gray-900` across both SCSS and LESS compiled bundles.

## Cross-Browser Standard Appearance Property Rule
Whenever vendor-prefixed appearance properties (`-webkit-appearance` or `-moz-appearance`) are declared, the standard `appearance` property must always be specified alongside them:

1. **Standard Property Declaration**: Any reboot rule, form control reset, search decoration, or range input declaring `-webkit-appearance: <val>` must simultaneously declare the standard `appearance: <val>` for complete standards compliance and future-proof browser compatibility.
2. **Consistent Resets**: Both SCSS (`scss/_reboot.scss`, `scss/forms/*`) and LESS (`less/boodoo.less`) must maintain the dual appearance declaration across all interactive elements (`[type="search"]`, `[type="button"]`, select dropdowns, checkboxes, range sliders).

## Spacing Scale Truthfulness & Density Configuration Rule
The framework's spacing scale, tokens, tests, and documentation must remain strictly aligned and truthful:

1. **Truth in Documentation**: Documentation pages (`site/src/utilities/spacing.html`), tokens (`tokens/tokens.json`), and changelogs (`CHANGELOG.md`) must accurately describe the actual compiled scale (e.g. generous modern scale: `0.5 = 8px`, `1 = 20px`, `2 = 36px`, `3 = 52px`, `4 = 68px`, `5 = 84px`). Never state in release notes or documentation that a different scale is compiled than what the code and tests enforce.
2. **Multi-Density Flexibility**: Boodoo must document and support seamless density customization across all environments: runtime CSS variables (`--boodoo-spacer-*`), Sass `$boodoo-spacers`, Less `@boodoo-spacer`, and JavaScript `createSpacing()` for compact Bootstrap (4/8/16/24/48px) and custom scales.

## Modular React Native Component Architecture Rule
React Native mobile components (`react-native/`) must remain modular and strictly free of DOM dependencies:

1. **Submodule Architecture**: Components must be organized into dedicated, cohesive submodules (`typography.js`, `layout.js`, `buttons.js`, `surfaces.js`, `inputs.js`, `data-display.js`, `feedback.js`, `lists.js`, `navigation.js`, `overlays.js`, `theme.js`, `paper.js`) re-exported via `react-native/index.js`. Never collapse all components into a single giant monolithic file.
2. **Pure Primitives**: Mobile components must rely exclusively on core React Native primitives (`View`, `Text`, `StyleSheet`, `Pressable`, `TextInput`, `Modal`) — zero DOM access, zero uncompiled CSS, and zero mandatory external native dependencies.





