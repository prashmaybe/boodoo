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

## DOM XSS Prevention & Safe Insertion Rule
Untrusted or runtime user data (such as file names, labels, user input strings, and query parameters) must never be directly interpolated into HTML strings or assigned via `innerHTML`:

1. **Safe DOM Construction**: Dynamic elements must be constructed using safe DOM methods (`document.createElement()`, `element.textContent`, `element.setAttribute()`), or sanitized using an approved escaper (`escapeHtml()`) before insertion.
2. **Attribute Safety**: Never interpolate raw strings into attributes (such as `alt="${file.name}"` or `title="${label}"`). Always assign them directly via property setters (`img.alt = file.name`) or escape quotes and HTML control characters.
3. **Automated Verification**: Component tests and regressions in `tests/framework.test.mjs` must assert that strings containing special HTML characters (`<`, `>`, `"`, `&`) are treated strictly as text nodes or properly escaped, preventing code execution.

## Non-Intrusive Global Shortcut & Safe Navigation Rule
Library components must not hijack global shortcuts without contextual presence or user opt-in, and all programmatic navigation must validate protocols:

1. **No Unconditional Global Interception**: Global keyboard listeners (e.g. `Ctrl+K`, `Cmd+K`) must not be registered on `document` or `window` unconditionally unless the target element or trigger exists in the current DOM (e.g. `[data-boodoo="command-palette"]` or `.command-palette-backdrop`), or until explicitly activated via an API initialization call (e.g. `CommandPalette.initDefault()`).
2. **Safe Navigation URLs**: Any component handling URL redirects or item navigation (e.g., Command Palette item selection) must validate the URL scheme against a strict allowlist (`https:`, `http:`, `/`, `#`, `mailto:`) before mutating `window.location`. Unsafe protocols such as `javascript:` or `data:` must never be executed.

## Lifecycle Teardown & Resource Revocation Rule
All interactive components and plugins with document-level event listeners, timers, observer handles, or object URLs must implement a robust teardown cycle:

1. **Document Listener Cleanup**: Any component adding listeners to `document` or `window` (click outside dismiss, Escape key handlers, scroll/resize trackers) must store stable function references and remove all listeners inside `dispose()`.
2. **Resource & URL Revocation**: Any component generating ephemeral browser resources such as `URL.createObjectURL(blob)` (e.g., Dropzone file previews) must retain track of created URLs and explicitly call `URL.revokeObjectURL(url)` upon item removal or component teardown.
3. **Synchronous Teardown Purity**: `dispose()` must perform synchronous cleanup and detach from the DOM and element registry immediately, without relying on pending asynchronous CSS transitions that could dereference nulled state.

## Dual TypeScript Declaration Maintenance Rule
Public package entry points and bundles must maintain accompanying TypeScript definitions (`.d.ts`):

1. **Persistent Source Definitions**: Because `dist/` is gitignored, the primary TypeScript declaration file for the framework JS bundle must be maintained under source control (e.g. `js/boodoo.d.ts`).
2. **Automated Bundle Emission**: The build script (`build/js-bundle.mjs`) must copy/emit `dist/js/boodoo.d.ts` during every JS compilation run (`npm run js`), ensuring that `dist/js/boodoo.d.ts` always exists when consumers run `npm run build` or `npm test`.
3. **Export Map Alignment**: All entries defined in `package.json` `"types"` or `"exports.[*].types"` must have matching `.d.ts` definitions emitted to `dist/` upon build completion.

## Protected Main Branch & PR Workflow Rule
Direct pushes to the `main` branch are strictly prohibited:

1. **No Direct Pushes to Main**: Developers, contributors, and automated agents must never commit or push directly to `main`. All changes must be developed in dedicated feature or bugfix branches (e.g., `feat/...`, `fix/...`, `chore/...`).
2. **Pull Request Workflow**: All code, documentation, assets, and configuration changes must be submitted via a Pull Request (PR) targeted against `main`.
3. **Review & CI Verification**: PRs must pass all automated test suites, linting, build verification, and receive required reviews/approvals before merging into `main`.

## Cross-Documentation Consistency & Production Parity Rule
All framework public documentation, landing pages, package READMEs, changelogs, and site fragments must speak with complete consistency and zero disparity:

1. **Uniform Inventory Numbers**: The framework component inventory must be consistently stated across all surfaces (50+ built-in components and 150+ utility classes). Stale legacy counts (e.g. 12 components, 26+ components, 40+ components) are strictly prohibited.
2. **Synchronized Release Versions**: The active framework version must be declared identically across `package.json`, `README.md`, `CHANGELOG.md`, `site/src/about/changelog.html`, and `site/index.html`. Documentation fragments must consume dynamic `{{version}}` variables rather than hardcoded version numbers.
3. **Measured Benchmarks Truthfulness**: All bundle sizes published in tables (uncompressed, minified, gzipped, brotli) in `README.md` and `site/src/about/production-readiness.html` must match the exact real-time measurements generated by `build/site-build.mjs` (`getDistSizes()`).
4. **Balanced Architecture Claims**: Positioning must consistently follow the approved standard: *"One design system. Multiple platforms. No unnecessary lock-in."* Competitor comparisons must document verifiable criteria (build step requirements, runtime dependencies, token sharing, native mobile support) rather than sweeping or disparaging claims.
## Production Component Quality Checklist Rule (14-Point Standard)
Every component added or modified in Boodoo must pass all 14 criteria of the production quality checklist before merging or publishing:

1. **API & Behavior**: Documented props, variants, defaults, and custom event dispatches (`boodoo:*`). Supports both controlled (programmatic) and uncontrolled modes. Full state handling for loading, empty, disabled, error, active, and boundary conditions.
2. **Accessibility Standards (WCAG 2.2 AA Target)**: Semantic HTML tags (`<button>`, `<dialog>`, `<nav>`, `<input>`) with mandatory `id` and/or `name` attributes for form controls. Text nodes must be wrapped in semantic text elements, never raw container blocks. Keyboard reachable with visible focus indicators, roving tabindex, ARIA roles/states, polite/assertive live announcements, and `prefers-reduced-motion` compliance.
3. **Engineering & Security**: 100% automated test coverage in `tests/framework.test.mjs`. Dual TypeScript definitions emitted in `dist/js/boodoo.d.ts`. Safe DOM construction with zero unescaped HTML interpolation. Synchronous lifecycle teardown with `dispose()`, event listener dereferencing, and object URL revocation.
4. **Multi-Platform Validation**: Verified cross-browser and mobile responsive. React Native components must rely strictly on core native primitives (`View`, `Text`, `Pressable`, `StyleSheet`) with zero DOM access.

## Zero Runtime Dependency Guarantee Rule
Boodoo core and its client runtime must remain 100% free of external runtime npm dependencies:

1. **Zero Supply-Chain Risk**: The core package (`boodoo`) must have `dependencies: {}` in `package.json`. No external runtime libraries (such as Popper.js, jQuery, lodash, or Emotion) may be added to runtime bundles.
2. **Self-Contained Primitives**: All positioning algorithms, DOM utilities, sanitizers, animators, and math helpers must be implemented as native, self-contained vanilla ES modules.
3. **Optional Peer Integrations**: Framework wrappers (`react`, `vue`, `react-native`) must remain optional peer dependencies declared under `peerDependencies` and `peerDependenciesMeta` with `"optional": true`.

## Single Design Token Source of Truth Rule
Design decisions across color, typography, elevation, spacing, and border radii must originate from a single canonical source of truth:

1. **Tokens Canonical Source**: All design tokens must be maintained in `tokens/tokens.json` and mirrored in `tokens/index.js` (ESM) and `tokens/index.cjs` (CJS).
2. **Cross-Platform Generation**: Stylesheet variables in Sass (`scss/_variables.scss`), Less (`less/boodoo.less`), and mobile themes (`react-native/theme.js`, `react-native/paper.js`) must align with and inherit from this unified token palette.
3. **Automated Token Assertion**: `tests/framework.test.mjs` must assert token parity across JSON, JavaScript, CSS custom properties, and React Native themes on every build.

## Package Hygiene & Tarball Purity Rule
All published packages and source tarballs must be strictly pruned of build artifacts, test suites, and temporary scratch files:

1. **No Stray Output in Dist**: The compiled `dist/` directory must only contain public, validated framework distribution files. Stray compiler outputs, temporary bundles (such as `test_out.css`, `*.tmp`), or uncompressed scratch files are strictly prohibited.
2. **Files Whitelist Hygiene**: Test files (`tests/`), internal build scripts (`build/`), and internal fixtures must never be listed in `package.json` `"files"` array. The tarball must remain minimal and strictly restricted to runtime distributions, source styles, and public token definitions.
3. **Automated Smoke Assertion**: `tests/package-smoke.test.mjs` must assert the absence of stray artifacts in `dist/css` and verify that `tests/` is not part of `package.json` `"files"` on every build.

## Modular Subpath CSS Exports Rule
Boodoo package exports must support modular, subpath imports of independent CSS bundles in addition to the full bundle:

1. **Subpath Declarations**: `package.json` `"exports"` must expose first-class subpaths for individual stylesheets: `"./css/grid"`, `"./css/utilities"`, `"./css/reboot"`, and `"./css/animations"`.
2. **Consumer Lightweight Integration**: Consumers who only require the grid layout, reboot resets, or utility classes must be able to import the minimal bundle without being forced to load the full framework stylesheet.

## Adaptive Spacing Scale Integrity Rule
The framework spacing scale is designed around adaptive base spacer tokens and must preserve its foundational architecture:

1. **Token Hierarchy**: Base spacing scales derive from `--boodoo-spacer` (`$boodoo-spacer: 1rem` / 16px) with intentional proportional steps (`0.5: 8px`, `1: 20px`, `2: 36px`, etc.).
2. **Adaptive Override Pattern**: Applications requiring custom density (such as compact backoffice screens or dense mockup scales) must achieve density adjustments by customizing `--boodoo-spacer` or specific `--boodoo-spacer-*` custom properties at runtime, or via preprocessor `$boodoo-spacer` / `@boodoo-spacer` variables, rather than mutating core framework step proportions.



