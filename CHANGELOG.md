# Changelog

All notable changes to the **boodoo** framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.1] - 2026-10-21

### Added
- **Native Zero-Dependency Chart Component (`js/src/chart.js`, `scss/components/_chart.scss`, `less/boodoo.less`, `dist/`)**:
  - Ultra-lightweight data visualizations inspired by Chart.js with **zero external dependencies**.
  - Supports **Bar Charts**, **Continuous Line Charts**, **Donut Charts**, and **Pie Charts**.
  - Responsive canvas scaling with high-DPI (Retina) device pixel ratio awareness.
  - Interactive hover tooltips with automatic dark mode awareness and token bindings.
  - Direct integration with Boodoo theme color tokens (`--boodoo-primary`, `--boodoo-info`, `--boodoo-success`, `--boodoo-warning`, `--boodoo-danger`, `--boodoo-secondary`).
  - TypeScript definitions added to `js/boodoo.d.ts` and emitted into `dist/js/boodoo.d.ts`.
- **Pure React Native Chart Suite (`react-native/data-display.js`, `react-native/index.js`, `react-native/index.d.ts`)**:
  - `BarChart`: Pure native mobile bar chart with responsive heights and theme palette styling.
  - `DonutChart`: Pure native mobile donut / circular progress stat chart with segment legend.
  - Zero DOM dependencies, complying with Boodoo React Native modular architecture rules.
- **CLI & Documentation Support**:
  - Added `chart` component to `npx boodoo add chart` in `bin/boodoo.mjs`.
  - Added interactive documentation page `site/src/components/chart.html` with real-time rendered examples.
- **Comprehensive Unit & Smoke Tests (`tests/framework.test.mjs`, `tests/package-smoke.test.mjs`)**:
  - Added unit test suite verifying canvas rendering, type transitions (bar, line, donut), hover hit testing, and lifecycle `dispose()` cleanup.
  - Added package smoke assertions verifying `Chart` constructor availability across CommonJS, ESM, and TypeScript declaration bundles.

---

## [1.2.0] - 2026-10-19

### Added
- **Modular Subpath CSS Exports (`package.json`)**:
  - Added dedicated subpath exports for standalone stylesheets: `"./css/grid"`, `"./css/utilities"`, `"./css/reboot"`, and `"./css/animations"` alongside `"./css"`.
  - Enables consumers to import individual modules without loading the full framework stylesheet.
- **Architectural Rules Governance (`.agents/AGENTS.md`)**:
  - Enforced **Package Hygiene & Tarball Purity Rule**: Verified absence of stray build artifacts in `dist/css` and confirmed exclusion of internal test suites from published tarball.
  - Enforced **Modular Subpath CSS Exports Rule**: Standardized first-class subpath imports for modular stylesheets.
  - Enforced **Adaptive Spacing Scale Integrity Rule**: Codified adaptive spacer token overrides without mutating core framework step proportions.
- **Dynamic CSS Custom Property Theming for Alerts (`scss/components/_alerts.scss`, `less/boodoo.less`)**:
  - Upgraded alerts across SCSS and Less to dynamic CSS custom properties (`var(--boodoo-primary-text-emphasis, ...)`, `var(--boodoo-primary-bg-subtle, ...)`, `var(--boodoo-primary-border-subtle, ...)`) with backward-compatible fallbacks.
  - Full parity implemented across all 8 theme color variants (`primary`, `secondary`, `success`, `info`, `warning`, `danger`, `light`, `dark`).
- **Package Hygiene & Smoke Assertions (`tests/package-smoke.test.mjs`)**:
  - Added automated CI assertions verifying all modular CSS subpath exports resolve on disk.
  - Added verification that `dist/css/test_out.css` does not exist and `tests/` is excluded from `package.json` `files`.
  - Added automated tests verifying alert variables consume dynamic CSS custom properties.

### Changed
- **Package Distribution Optimization**:
  - Pruned `tests/` from `package.json` `files` array to ensure a pure, minimal distribution tarball.
  - Updated CLI scaffolder version to `1.2.0` in `bin/create-boodoo.mjs`.

---

## [1.1.9] - 2026-10-19

### Added
- **Advanced Components Suite (`scss/components/_advanced-components.scss`, `less/boodoo.less`, `js/src/advanced-components.js`, `dist/`)**:
  - **Chat Message Bubble & Streaming AI Container (`.chat-thread`, `.chat-bubble`, `.ai-stream`, `.ai-cursor`)**: Generative AI messaging container with incoming/outgoing bubbles, sender metadata, and animated stream cursor.
  - **Filter Bar & Dimension Query Builder (`.filter-bar`, `.filter-pill`, `FilterBar`)**: Multi-dimensional search and tag filter bar with active/removable pills, reset triggers, and event callbacks.
  - **Kanban / Pipeline Board (`.kanban-board`, `.kanban-column`, `.kanban-card`)**: Responsive multi-stage pipeline and task workflow board with column badges and priority chips.
  - **Bento Grid Layout Presets (`.bento-grid`, `.bento-item`, `.bento-col-span-*`, `.bento-row-span-*`)**: Dynamic CSS Grid dashboard layout system for modern SaaS apps and KPI presentations.
  - **Transfer List / Dual Listbox (`.transfer-list`, `.transfer-panel`, `.transfer-controls`, `TransferList`)**: Dual listbox selector for bidirectional item transfer with selection toggling and counter badges.
  - **Audio Player Widget (`.audio-player`, `.audio-controls`, `.audio-waveform`, `.audio-wave-bar`)**: Media playback widget with interactive simulated waveform bars and elapsed time trackers.
  - **Color Picker Popover (`.color-picker`, `.color-swatch-grid`, `.color-swatch`, `ColorPicker`)**: Compact swatch palette and hex color picker with dynamic color updates.
  - **Scroll-to-Top Floating Button (`.back-to-top`, `BackToTop`)**: Viewport-aware scroll button with smooth deceleration back to top.
- **Production Readiness & Enterprise Governance (Review Implementation)**:
  - **Security Policy (`SECURITY.md`)**: Documented supported release windows, private reporting process (`security@boodooframework.com`), SLAs, and security design principles (DOM XSS prevention, protocol allowlist, zero runtime dependencies).
  - **Contribution Standards & 14-Point Quality Checklist (`CONTRIBUTING.md`)**: Published the 14-point production component quality checklist across API & behavior, accessibility (WCAG 2.2 AA target), engineering safety, and multi-platform release criteria.
  - **Automated Package Artifact Smoke Test (`tests/package-smoke.test.mjs`)**: Verified all package exports, CommonJS and ESM bundles, TypeScript definitions, and tokens mapping as a consumer smoke test in CI.
  - **Production Readiness Dashboard (`site/src/about/production-readiness.html`)**: Interactive dashboard with multi-platform compatibility matrix, 14-point quality standards, exact verified bundle measurements, and Pebble Benders enterprise advisory support.
  - **Positioning & Comparison Balance**: Reframed framework positioning to *"One design system. Multiple platforms. No unnecessary lock-in."* across `site/index.html`, `site/src/about/vs-bootstrap.html`, and `site/src/about/vs-tailwind.html`.
- **Architectural Framework Governance Rules (`.agents/AGENTS.md`)**:
  - Enforced permanent framework rules: **Production Component Quality Checklist Rule (14-Point Standard)**, **Zero Runtime Dependency Guarantee Rule**, **Single Design Token Source of Truth Rule**, and **Cross-Documentation Consistency & Production Parity Rule**.
- **CommonJS Distribution Parity**:
  - Emitted `dist/js/boodoo.cjs` alongside ESM and UMD builds, resolving Yarn & CommonJS consumer import compatibility.
- **React Native Parity**:
  - Added `ChatBubble`, `AIStream`, and `FilterPill` primitives to `react-native/data-display.js` and `react-native/index.js` with TypeScript definitions in `react-native/index.d.ts`.
- **SCSS and LESS Dual Parity**:
  - Full parity implemented across both SCSS (`scss/components/_advanced-components.scss`) and LESS (`less/boodoo.less`).
- **Boodoo CLI**:
  - Registered all 8 new components in `COMPONENT_MAP` within `bin/boodoo.mjs`.
  - Bumped CLI scaffolder version to `1.1.9` in `bin/create-boodoo.mjs`.

---

## [1.1.8] - 2026-10-18

### Added
- **Extended Components Suite (`scss/components/_extended-components.scss`, `less/boodoo.less`, `js/src/*`, `dist/`)**:
  - **Stat / Metric Widget (`.stat-widget`, `.stat-header`, `.stat-value`, `.stat-trend`)**: Modern dashboard metric card with customizable trend pill badges, icon containers, and interactive hover elevation states.
  - **Activity Feed & Notification Center (`.activity-feed`, `.notification-feed`, `.feed-item`, `.unread`)**: Multi-item event stream and alert notification list with avatar slots, unread highlight bars, and action triggers.
  - **Mega Menu Layout (`.mega-menu`, `.mega-menu-panel`, `.mega-menu-grid`)**: Full-width header navigation flyout with multi-column categorised link grids and header sections.
  - **Breadcrumb with Nested Dropdown (`.breadcrumb-item.dropdown`, `.breadcrumb-dropdown-toggle`)**: Contextual breadcrumb navigation supporting inline popover and dropdown menus for hierarchy exploration.
  - **Floating Action Button Dock (`.fab-dock`, `FABDock`)**: Fixed-position expandable multi-action dock with smooth stagger pop-in micro-animations, keyboard ESC navigation, and click-outside dismissal.
  - **Fullscreen Immersive Dialog (`.dialog-fullscreen`, `DialogFullscreen`)**: Native mobile-style and desktop full-viewport modal dialogs with smooth sliding entrance, body scroll lock, and ESC key handling.
  - **Guided Tour / Product Walkthrough (`.tour-popover`, `Tour`)**: Interactive step-by-step onboarding walkthroughs with target highlighting, step indicators, progress dots, and keyboard navigation.
- **React Native Parity**:
  - Exported `StatWidget` primitive in `react-native/surfaces.js` and `react-native/index.js` with pure native primitives and full theme integration.
- **SCSS and LESS Dual Parity**:
  - All new component styling primitives implemented across both SCSS (`scss/components/_extended-components.scss`) and LESS (`less/boodoo.less`) with zero syntax errors.
- **CLI & TypeScript Declarations**:
  - Registered components in Boodoo CLI (`npx boodoo add stat-widget`, `npx boodoo add fab-dock`, etc.).
  - Added comprehensive TypeScript definitions (`FABDock`, `DialogFullscreen`, `Tour`) in `js/boodoo.d.ts` and `dist/js/boodoo.d.ts`.

---

## [1.1.7] - 2026-10-18

### Added
- **Modern UI Component Suite (`scss/components/_modern-components.scss`, `less/boodoo.less`, `js/src/*`, `dist/`)**:
  - **Tag / Token Input (`.tag-input`, `.tag-item`, `.tag-remove`, `ChipInput`)**: Interactive multi-token keyboard and mouse tag input with removable chips, backspace navigation, and autocomplete alignment.
  - **Floating Bulk Action Bar (`.floating-bar`, `FloatingBar`)**: Contextual floating action bar anchored to the bottom viewport with transition animations, selected counter bindings, and dismiss actions for bulk data operations.
  - **Image Comparison Slider (`.image-compare`, `ImageCompare`)**: High-performance touch and drag split slider allowing interactive side-by-side or overlaid comparison of images and graphic assets.
  - **Password Strength Meter (`.password-meter`, `PasswordMeter`)**: Real-time password evaluation with dynamic score indicators, strength meters (Weak, Fair, Good, Strong), and custom target bindings.
  - **Diff & Code Comparison Viewer (`.diff-viewer`, `.diff-table`, `.diff-add`, `.diff-del`)**: Monospace code diff layout with distinct line additions, deletions, hunk headers, and gutter line numbering.
  - **Metric Sparkline & Micro-Charts (`.sparkline`, `.sparkline-bar`)**: CSS and SVG micro-trendline and inline bar sparklines for dashboard metrics and KPI cards.
  - **Copy-to-Clipboard Code Snippet Box (`.code-copy-box`, `.code-copy-btn`)**: Dark-themed code presentation box with integrated floating copy button and syntax container.
  - **Mobile Swipe-to-Action List Item (`.swipe-action-item`, `.swipe-action-reveal`)**: Native-feeling touch swipe actions reveal pattern for mobile web applications.
- **SCSS and LESS Dual Preprocessor Parity**:
  - Full functional and selector parity implemented across SCSS and LESS (`less/boodoo.less`) with zero syntax deprecations.
- **TypeScript Definitions (`js/boodoo.d.ts`, `dist/js/boodoo.d.ts`)**:
  - Added full typings for `FloatingBar`, `ImageCompare`, and `PasswordMeter`.

---

## [1.1.6] - 2026-10-18

### Added
- **Headless Vue 3 & Nuxt Composables (`vue/composables.js`, `vue/index.js`, `vue/index.d.ts`, `boodoo/vue`)**:
  - Implemented declarative Vue 3 / Nuxt composables mirroring `boodoo/react`:
    - `useDisclosure`: Headless reactive dialog, drawer, and modal state management returning `isOpen`, `open()`, `close()`, `toggle()`, `getTriggerProps()`, and `getDialogProps()`.
    - `useCombobox`: Reactive autocomplete query and keyboard navigation (ArrowUp, ArrowDown, Enter, Escape) with W3C ARIA active-descendant support.
    - `useAccordion`: Single- and multi-panel reactive expand/collapse coordination with `getButtonProps()` and `getPanelProps()`.
  - Added full TypeScript definitions (`vue/index.d.ts`) and configured `./vue` subpath export in `package.json`.
- **Continuous Integration Pipeline & README Status Badges (`.github/workflows/ci.yml`, `README.md`)**:
  - Configured GitHub Actions matrix CI testing against Node.js 20 and 22 LTS on `push` and `pull_request` events.
  - Validates full compilation (`npm run build`) and passes test suites (`npm run test:unit`) with zero regressions.
  - Added official CI status badge, npm version, monthly downloads, and MIT license shields to the README.
- **Native CSS Modern Primitives Polish (`scss/components/_native.scss`, `less/boodoo.less`, `site/src/components/native.html`)**:
  - Expanded and refined native modern web primitives including CSS Anchor Positioning (`anchor()`, `position-anchor`), Scroll-Driven Animations (`animation-timeline`), Container Queries (`@container`), and native Popover/Dialog transitions.
  - Achieved strict feature parity across both SCSS and LESS preprocessor bundles (`less/boodoo.less`).

### Fixed & Enhanced
- **Global Ripple Event Delegation & Affordance (`js/src/ripple.js`, `scss/components/_ripple.scss`, `tests/framework.test.mjs`)**:
  - Enhanced ripple effects to support global pointer delegation on surfaces with `data-boodoo-ripple` or `.has-ripple` across dynamically inserted DOM elements.
  - Ensured explicit cursor and pointer affordances on interactive ripple triggers.
- **Form Color Swatch Aspect Ratio (`scss/forms/_pickers.scss`, `less/boodoo.less`)**:
  - Fixed color picker swatch items to strictly preserve a 1:1 circular aspect ratio with `border-radius: 50%` and `aspect-ratio: 1 / 1`.
- **Documentation Container Boundaries & Overflow (`site/src/utilities/display.html`, `site/src/components/banner.html`, `site/src/components/toasts.html`, `scss/_animations.scss`)**:
  - Fixed demo container height bounds for stacked toasts, centered announcement pills, and resolved container overflow in display utility previews.
  - Fixed infinite spinning utility class styling and SCSS animation keyframe alignment.
- **Build Pipeline Script Robustness (`package.json`)**:
  - Switched CSS build scripts from `npx --no-install sass` to standard npm binary execution `sass`. This eliminates unexpected npx interactive cancellation during fresh installs and CI pipelines.
- **Scaffolding CLI Alignment (`bin/create-boodoo.mjs`)**:
  - Bumped `create-boodoo` project generator version default to `1.1.6`.
- **Documentation & README Size Tracking**:
  - Aligned static performance table in `README.md` to match actual compiled asset measurements (`502 KB` / `~70 KB` gzip CSS, `~133 KB` / `~25 KB` gzip minified JS, `~145 KB` raw JS).

---

## [1.1.5] - 2026-10-17

### Added
- **Headless React Hooks (`react/hooks.js`, `react/index.js`, `react/index.d.ts`, `boodoo/react`)**:
  - Introduced first-party declarative headless React hooks for seamless integration in Next.js, Remix, Vite, and React tree apps:
    - `useDisclosure`: Declarative modal/dialog/drawer state management with `getTriggerProps()` and `getDialogProps()`.
    - `useCombobox`: Autocomplete filter state, keyboard active-descendant tracking, and ARIA listbox bindings with `getInputProps()`, `getListboxProps()`, and `getOptionProps()`.
    - `useAccordion`: Single- and multi-panel expand/collapse state with `getButtonProps()` and `getPanelProps()`.
  - Added TypeScript declarations (`react/index.d.ts`) and exported via the `"boodoo/react"` package subpath.
- **WAI-ARIA Accessibility & Screen-Reader Suite (`js/src/a11y.js`, `boodoo.a11y`)**:
  - `a11y.announce(message, politeness)`: Screen-reader dynamic announcement via persistent, visually hidden `aria-live="polite"` and `aria-live="assertive"` status regions.
  - `a11y.setRovingTabindex(items, activeIndex)`: W3C roving tabindex coordinator across interactive lists, comboboxes, tree views, and toolbars.
  - `a11y.createFocusTrap(container, options)`: Full keyboard focus trapping for dialogs, modals, and offcanvas with automatic focus return on teardown.
- **WAI-ARIA Patterns on Complex Components (`js/src/combobox.js`, `js/src/tree-view.js`)**:
  - **Combobox**: Updated to W3C ARIA 1.2 Combobox specification (`role="combobox"`, `role="listbox"`, `role="option"`, `aria-autocomplete="list"`, `aria-activedescendant`, `aria-selected`, and `aria-expanded`).
  - **TreeView**: Full WAI-ARIA tree structure (`role="tree"`, `role="treeitem"`, `role="group"`) with arrow-key roving focus and Left/Right arrow expand/collapse keybindings.
- **Competitive Architecture Comparison Matrix (`site/index.html`)**:
  - Added a deep comparison table on the website landing page contrasting Boodoo against Bootstrap 5, Tailwind CSS, Material UI (MUI), and Foundation across 8 architectural metrics.

### Security & Governance
- **Protected Main Branch Rule Enforced (`.agents/AGENTS.md`)**:
  - Enforced a rule prohibiting direct pushes to `main`. All changes must be developed in feature/release branches and merged via Pull Requests.

---

## [1.1.4] - 2026-10-16

### Security
- **Dependabot Security Resolution across Starter Templates (`site/examples/starters/`, `www/examples/starters/`)**:
  - Upgraded Next.js in starters to `^15.5.28` (along with `react` and `react-dom` to `^19.0.0`), resolving critical RCE, SSRF, Cache Poisoning, and DoS vulnerabilities (GHSA-v6wh-96g9-6wx3, CVE-2026-53632, CVE-2026-53633, CVE-2026-53634).
  - Upgraded Vite to `^6.4.4` in `react-vite` and `vue-vite` starters, resolving Windows UNC path NTLM disclosure, path traversal in optimized deps `.map` handling, and `server.fs.deny` bypass vulnerabilities.
  - Closed all 58 repository Dependabot security alerts.
- **Public API XSS Vulnerability Elimination (`js/src/util.js`, `js/boodoo.js`, `js/src/chip-input.js`, `js/src/command-palette.js`, `js/src/dropzone.js`, `js/src/tooltip.js`)**:
  - Implemented lightweight, dependency-free `escapeHtml(str)` utility to entity-encode untrusted characters (`&`, `<`, `>`, `"`, `'`).
  - **Toast (`boodoo.toast`)**: Sanitized both `title` and `message` strings before DOM rendering.
  - **Chip Input (`ChipInput.addChip`)**: Switched from vulnerable `innerHTML` interpolation to safe DOM element creation using `labelSpan.textContent = text`.
  - **Command Palette (`CommandPalette._renderResults`, `CommandPalette._handleSelect`)**: Escaped all user-supplied search items, titles, and keyboard shortcuts; added strict URL protocol validation (`https:`, `http:`, `/`, `#`, `mailto:`) preventing `javascript:` protocol execution.
  - **Dropzone (`Dropzone._showPreview`)**: Converted from string interpolation to safe DOM element creation with `img.alt = file.name` and automatic `URL.revokeObjectURL()` resource cleanup.
  - **Popover (`Popover.setContent`)**: Content is now assigned safely via `textContent` by default; only evaluates as HTML if explicit `{ html: true }` configuration is enabled.

### Added
- **Complete TypeScript Declaration Surface (`dist/js/boodoo.d.ts`, `tokens/index.d.ts`, `react-native/index.d.ts`, `package.json`)**:
  - Authored first-class `.d.ts` type definition files across all framework entrypoints.
  - Added root and subpath `"types"` exports in `package.json` for `.`, `./tokens`, and `./react-native`.
  - Added CommonJS token exports (`tokens/index.cjs`) for universal Node.js tooling compatibility.
- **Component-Namespaced Registry (`js/src/base-component.js`)**:
  - Re-architected `BaseComponent` registry to namespace by `Map<ComponentClass, Map<Element, Instance>>`.
  - Multiple components (such as `Tooltip` and `Dropdown`) can now attach to the same DOM element without colliding or overwriting each other.
- **True JS Minification & Dynamic Build Banner (`build/js-bundle.mjs`)**:
  - Added dedicated JavaScript minification stage generating genuine compressed bundles (`boodoo.min.js`) rather than raw duplicates.
  - Dynamically reads framework version from `package.json` for accurate header banners.
- **Behavioral & Security Unit Testing Suite (`tests/framework.test.mjs`)**:
  - Added test suites for `Modal` instance initialization, focus trapping, multi-component isolation, and complete `dispose()` lifecycle clean-up.
  - Added regression test suites validating `escapeHtml`, `ChipInput` DOM safety, `Dropzone` object URL revocation, `CommandPalette` non-intrusive listeners, and `.d.ts` declaration file existence.

### Fixed & Enhanced
- **Interactive Component Lifecycle Teardown (`js/src/modal.js`, `js/src/offcanvas.js`, `js/src/speed-dial.js`, `js/src/command-palette.js`)**:
  - **Modal**: Added `role="dialog"`, `aria-modal="true"`, and full `dispose()` method unbinding Escape and Tab keydown listeners, removing wheel scroll guards, and detaching backdrops.
  - **Offcanvas**: Complete `dispose()` cleaning up keydown and backdrop click listeners.
  - **SpeedDial**: Complete `dispose()` cleaning up document click-outside and keydown triggers.
  - **CommandPalette**: Non-intrusive `Ctrl+K` listener registration that avoids intercepting shortcuts unless initialized or triggered in DOM.
- **Brand Token Unification Across Web and Mobile (`tokens/tokens.json`, `tokens/index.js`, `tokens/index.cjs`, `react-native/theme.js`, `react-native/paper.js`, `scss/_root.scss`, `less/boodoo.less`)**:
  - Unified all token palettes to match the canonical brand scale:
    - Primary: Brand Violet (`#7c3aed`)
    - Secondary: Brand Indigo (`#5b21e6`, replacing cyan `#06b6d4`)
    - Success: `#1c9e50`
    - Danger: `#e11d48`
    - Info: `#0ea5e9`
    - Dark / Base: Deep Indigo (`#17135f`, replacing slate `#0f172a`)
    - Neutrals: Unified Foundation grays (`#f7f8fb` to `#11143d`)
  - Web CSS, React Native themes, and React Native Paper MD3 presets now share an identical system of record.
- **Event Listener Leak Prevention in Dismiss Triggers (`js/src/util.js`)**:
  - Replaced repetitive capturing click listeners in `enableDismissTrigger` with a single delegated document listener managing all dismissible components.
- **CLI Scaffolder Updates (`bin/create-boodoo.mjs`)**:
  - Bumped CLI template dependency pin to `1.1.4`.
  - Replaced deep internal stylesheet imports with canonical `import 'boodoo/css';`.

---

## [1.1.3] - 2026-10-16

### Added
- **Full Modular React Native UI Component Suite (`react-native/`, subpath `boodoo/react-native`)**:
  - Re-architected native mobile framework from a monolithic file into 12 clean, tree-shakeable, dedicated submodules with zero DOM dependencies and 100% pure React Native primitives (`View`, `Text`, `StyleSheet`, `Pressable`, `TextInput`, `Modal`):
    - **`typography.js`** (2 components):
      - `Text`: Universal typography primitive supporting Paper variants (`displayLarge`, `headlineMedium`, `titleLarge`, `bodyMedium`, `labelSmall`), React Native Elements heading flags (`h1`–`h4`), UI Kitten `category` presets, and custom colors.
      - `Heading`: Layout heading component with levels 1 through 6, semantic sizes, and automatic font weight scaling.
    - **`layout.js`** (9 components):
      - `Box`: Fundamental layout container with theme-aware padding, margin, surface colors, borders, and rounded corners.
      - `HStack` / `XStack`: Horizontal flex container with customizable child spacing gap, alignment, and flex-wrap.
      - `VStack` / `YStack`: Vertical flex layout stack supporting configurable child element spacing.
      - `Center`: Centering flexbox wrapper aligning items along both axes.
      - `ZStack`: Absolute-positioned depth stacking container for overlays, floating badges, and hero elements.
      - `Pressable`: Interactive responsive touch wrapper with opacity feedback and theme-driven states.
      - `Grid`: Multi-column native layout grid primitive with column count configuration and gutters.
    - **`buttons.js`** (5 components):
      - `Button`: Cross-platform button compatible with React Native Paper (`mode="contained|outlined|text|elevated"`), RNE UI (`title`, `type="solid|outline|clear"`), UI Kitten (`status="primary|success|warning|danger|info"`), and Wix UI Lib, with loading spinner and disabled states.
      - `ButtonGroup`: Multi-segment button array for option selection with active highlights.
      - `IconButton`: Circular or rounded touchable icon trigger with custom background tints.
      - `FAB`: Floating Action Button supporting extended labels, surface elevation, and fixed screen positioning.
      - `SegmentedButtons`: iOS and Material segmented pill selector with mutually exclusive or multi-toggle states.
    - **`surfaces.js`** (6 components):
      - `Card`: Content card with optional subcomponents (`Card.Content`, `Card.Cover`, `Card.Actions`, `Card.Title`) and hover/press feedback.
      - `Surface`: Elevated surface container consuming theme elevation tokens and dark-mode surface inverters.
      - `Divider` / `Separator`: Horizontal and vertical hairline dividers supporting inset margins and subhead labels.
      - `PricingCard`: RNE UI-inspired subscription tier card with price tags, feature bullet lists, and CTA triggers.
      - `Tile`: Image-backed content tile with overlay captions and touch callbacks.
    - **`inputs.js`** (20 components):
      - `TextInput` / `Input` / `TextField`: Cross-platform text entry supporting Paper outlined/flat modes, RNE UI error messages, icons, left/right accessories, and disabled states.
      - `Textarea` / `TextArea`: Multi-line text field with min-height constraints and scroll handling.
      - `Searchbar` / `SearchBar`: Search input with clear button, debounced query handling, and search icon slot.
      - `HelperText`: Sub-field validation and instructional micro-copy supporting error and info modes.
      - `Checkbox` / `CheckBox`: Material and agnostic checkbox toggle with checked, unchecked, and indeterminate icons.
      - `RadioButton` / `Radio` / `RadioGroup`: Mutual exclusion option groups with accessible selection events.
      - `Switch` / `Toggle`: Platform-native toggle switch with theme color bindings.
      - `Slider`: Range slider with thumb interaction, step intervals, and min/max limits.
      - `Stepper`: Numeric step increment/decrement control with tactile touch buttons.
      - `Select` / `Picker`: Native dropdown selector supporting modal picker dialogs and option lists.
      - `ToggleButton`: Standalone binary toggle button with selected styling.
    - **`data-display.js`** (3 components):
      - `Chip`: Compact interactive token with avatar slots, close triggers, and selected pills.
      - `Badge`: Notification and status badge supporting numerical counters and dot indicators.
      - `Avatar`: User avatar supporting image URIs (`Avatar.Image`), initials text (`Avatar.Text`), and icons (`Avatar.Icon`).
    - **`feedback.js`** (9 components):
      - `ActivityIndicator` / `Spinner`: Animated loading indicators with theme color mapping and size controls.
      - `ProgressBar` / `Progress`: Linear meter bar with indeterminate and determinate percentage values.
      - `Skeleton`: Content placeholder shimmer loader for cards, text blocks, and avatars.
      - `Alert`: Semantic alert banner supporting `info`, `success`, `warning`, and `danger` variants.
      - `Banner`: Collapsible top banner with action triggers and illustration slot.
      - `Toast` / `Snackbar`: Ephemeral bottom notification with dismiss button and timer autohide.
    - **`lists.js`** (4 components):
      - `List`: Grouped list container with section titles (`List.Section`, `List.Subheader`).
      - `ListItem`: Flexible row component with left icon/avatar, title, subtitle, right accessory, and accordion support (`List.Accordion`).
      - `DataTable` / `Table`: Native tabular data layout supporting `DataTable.Header`, `DataTable.Row`, `DataTable.Cell`, and `DataTable.Pagination`.
    - **`navigation.js`** (7 components):
      - `Appbar` / `Header`: Top screen bar with title, back navigation action (`Appbar.BackAction`), and action icons (`Appbar.Action`).
      - `TopNavigation`: UI Kitten-style header layout with accessory slots.
      - `Drawer`: Slide-over navigation panel with section links and user profile slots.
      - `BottomNavigation`: Mobile bottom tab bar with icon, active indicator pill, and badge notifications.
      - `Tabs`: Scrollable or fixed horizontal tab strips for view switching.
      - `PageControl`: Carousel and onboarding pagination dot indicator.
    - **`overlays.js`** (13 components):
      - `Dialog` / `AlertDialog`: Accessible modal alerts with title, body content, and action confirmations.
      - `Modal` / `Overlay`: Fullscreen or centered overlay dialogs with backdrop dimming and dismiss callbacks.
      - `BottomSheet` / `Actionsheet` / `ActionSheet` / `Sheet`: Bottom-docked sliding sheet with swipe-to-dismiss gesture support and drag handles.
      - `Menu`: Contextual anchor-positioned popup list.
      - `Popover`: Anchored floating callout balloon with arrow indicator.
      - `Tooltip`: Hover/long-press micro-copy helper bubble.
      - `Portal`: Host-agnostic React portal layer for rendering overlays outside parent hierarchy.
      - `TouchableRipple`: Material Design ink ripple touch feedback container.
    - **`theme.js`** & **`paper.js`**:
      - `BoodooProvider`, `useTheme`, `defaultLightTheme`, and `defaultDarkTheme` context providers.
      - `boodooPaperLightTheme` and `boodooPaperDarkTheme` Material Design 3 (MD3) preset adapters directly consumable by React Native Paper's `<PaperProvider theme={boodooPaperLightTheme}>`.
- **Enterprise Application Shell & Layout Utilities (`scss/_helpers.scss`, `less/boodoo.less`)**:
  - `.shell-header`: Sticky top bar with `var(--boodoo-zindex-sticky, 1020)` z-index mapping, body background, and subtle border.
  - `.shell-sidebar`: Full viewport-height (`100vh`) scrolling navigation sidebar.
  - `.shell-pad`, `.shell-pad-sm`, `.shell-pad-lg`: Responsive internal shell padding scale for dashboards.
  - `.bg-login-gradient`: Multi-stop diagonal mesh gradient for login, onboarding, and auth screens.
  - `.bg-hero-gradient`: Top-radial spotlight ambient gradient for landing pages and marketing banners.
  - `.feature-card`: Interactive elevated feature card with hover translateY lift, border-color transition, and dynamic shadow.
  - `.form-section`, `.form-section-title`, `.form-section-desc`: Grouped card wrappers for enterprise multi-step forms.
- **Responsive CSS Grid Auto Columns & Layout Templates (`scss/_grid.scss`, `less/boodoo.less`)**:
  - Gutter Bridge: Added full `--boodoo-gutter-x` and `--boodoo-gutter-y` support across `.grid` containers.
  - Auto-Fit & Auto-Fill utilities: `.grid-auto-fill`, `.grid-auto-fit`, `.grid-auto-fill-sm/md/lg`, `.grid-auto-fit-sm/md/lg` allowing dynamic card grids without media query boilerplate.
  - Enterprise Grid Templates: `.grid-cols-tier` (pricing columns), `.grid-cols-search` (filter bar layouts), `.grid-cols-line` (key-value audit logs), `.grid-cols-simulation` (data telemetry layouts).
- **SaaS Role Badges & Navigation Active Bar (`scss/components/_badge.scss`, `scss/components/_nav.scss`, `less/boodoo.less`)**:
  - 8 Semantic Role Badges: Added `.badge-role-admin`, `.badge-role-member`, `.badge-role-viewer`, `.badge-role-owner`, `.badge-role-billing`, `.badge-role-guest`, `.badge-role-developer`, and `.badge-role-security` with soft tint backgrounds and themed text.
  - Navigation Active Bars: Added `.nav-active-bar` with `.nav-active-bar-start` (vertical sidebar 3px indicator line) and `.nav-active-bar-bottom` (horizontal tab underline).
  - Max-Height Table Scrolling: Added `.table-scroll-max` paired with `.table-scroll-sm` (240px), `.table-scroll-md` (380px), `.table-scroll-lg` (520px), and `.table-scroll-xl` (680px).
- **Dynamic CodePen Snippet Landing Logic (`site/layout.html`)**:
  - Enhanced CodePen integration to automatically land users in the appropriate editor panel based on the code type:
    - Pure JavaScript snippets open directly in the **JS editor** (`editors: '001'`).
    - CSS/Sass snippets open directly in the **CSS editor** (`editors: '010'`).
    - HTML and component templates open directly in the **HTML editor** (`editors: '100'`).

### Fixed
- **Standard Cross-Browser `appearance` Property (`scss/_reboot.scss`, `less/boodoo.less`)**:
  - Fixed vendor-prefix compliance by adding standard `appearance: none;` alongside `-webkit-appearance: none;` across search cancel buttons and form decoration resets.
- **Dark Mode Gray Scale Step Flattening Defect (`scss/_root.scss`, `less/boodoo.less`)**:
  - Fixed dark mode gray scale mapping where `--boodoo-gray-800` previously flattened into the same value as `--boodoo-gray-900`.
  - Inverted `--boodoo-gray-800` to `#ececf4` (light gray-200) and `--boodoo-gray-900` to `#f7f8fb` (light gray-100) across both `@media (prefers-color-scheme: dark)` and `[data-boodoo-theme="dark"]`.
- **Runtime CSS Custom Property Theming Across Components (`scss/components/*`, `less/boodoo.less`)**:
  - Replaced compile-time hardcoded Sass color literals with runtime dynamic custom property bindings:
    - `.avatar`: Binds `--boodoo-avatar-bg` to `var(--boodoo-primary)` and `--boodoo-avatar-color` to `var(--boodoo-white)`.
    - `.badge`: Binds `background-color` to `var(--boodoo-primary)`, soft badges bind to `var(--boodoo-primary-subtle)`, and outline borders consume `var(--boodoo-primary)`.
    - `.card-clickable`: Hover borders dynamically bind to `var(--boodoo-primary)`.
    - `.nav`: Active links and pills dynamically bind to `var(--boodoo-primary)`.
    - `.dropdown-item.active`: Dynamically binds to `var(--boodoo-dropdown-link-active-bg, var(--boodoo-primary))`.
    - `.navbar-nav .nav-link.active`: Dynamically binds to `var(--boodoo-primary)`.
- **Dynamic CSS Custom Properties for Utilities, Links, Headings, and Solid Buttons (`scss/_maps.scss`, `scss/_reboot.scss`, `scss/components/_buttons.scss`)**:
  - `.text-primary` and `.bg-primary` compile to `var(--boodoo-primary) !important;`.
  - `.text-muted` compiles to `var(--boodoo-text-muted, var(--boodoo-gray-600, #6c757d)) !important;`.
  - `a` hyperlinks consume `var(--boodoo-link-color)` and `var(--boodoo-link-hover-color)`.
  - Headings `h1`–`h6` consume `var(--boodoo-heading-color)` and `var(--boodoo-h1-font-size)` through `var(--boodoo-h6-font-size)`.
  - Solid `.btn-primary` and palette variants bind `--boodoo-btn-bg` and `--boodoo-btn-border` to `var(--boodoo-#{$name})` using `color-mix(...)` for hover and active state transitions.
- **Sticky Helpers Sticky Z-Index Flexibility (`scss/_helpers.scss`, `scss/_utilities.scss`, `less/boodoo.less`)**:
  - `.sticky-top`, `.sticky-bottom`, and `.sticky-lg-top` now bind to `var(--boodoo-zindex-sticky, 1020)` for flexible stacking context control.
- **Spacing Scale Documentation & Token Alignment (`CHANGELOG.md`, `tokens/tokens.json`, `tests/framework.test.mjs`)**:
  - Corrected changelog discrepancies to accurately reflect the actual compiled generous modern spacing scale (`0 = 0`, `0.5 = 8px`, `1 = 20px`, `2 = 36px`, `3 = 52px`, `4 = 68px`, `5 = 84px`) while providing `createSpacing()` for Bootstrap 4/8/16/24/48px density.

---

## [1.1.2] - 2026-10-16

### Added
- **New Component: Dock / App Shelf (`.dock`, `scss/components/_dock.scss`, `less/boodoo.less`)**:
  - macOS & iPadOS-inspired floating app shelf and persistent bottom navigation bar.
  - Features glassmorphism background (`backdrop-filter: blur(...)`), customizable icon magnification effects, active app dot indicators (`.dock-dot`), badge support, separator dividers (`.dock-divider`), and positioning variants (`.dock-bottom`, `.dock-top`, `.dock-start`, `.dock-end`).
  - Fully responsive with auto-scrolling overflow on narrow viewports.
  - Published comprehensive interactive documentation and code examples in `docs/components/dock.html`.
- **New Component: KPI Stat Card (`.kpi-card`, `scss/components/_kpi-card.scss`, `less/boodoo.less`)**:
  - Dashboard analytics metric card for SaaS, e-commerce, and admin backends.
  - Built-in slots for metric value (`.kpi-value`), label (`.kpi-label`), trend indicator pills (`.kpi-trend.kpi-trend-up`, `.kpi-trend.kpi-trend-down`, `.kpi-trend-neutral`), visual icon wrappers (`.kpi-icon`), and mini progress tracking bars (`.kpi-progress`).
  - Supports variant styles including `.kpi-card-gradient`, `.kpi-card-bordered`, and glassmorphic elevations with full dark mode token adaptation.
  - Published interactive documentation with realistic SaaS dashboard metrics in `docs/components/kpi-card.html`.
- **New Component: AI Prompt & Chat Input (`.ai-prompt`, `scss/components/_ai-prompt.scss`, `less/boodoo.less`)**:
  - Purpose-built conversational input interface for generative AI, LLM assistants, and chat applications.
  - Includes auto-expanding textarea container, action triggers (`.ai-prompt-btn`, `.ai-prompt-btn-stop`), quick suggestion chips/prompts row (`.ai-prompt-chips`), token/character counter (`.ai-prompt-counter`), model selector dropdown slot, and attachment action buttons.
  - Interactive status states: streaming mode (`.ai-prompt-streaming`), focus ring animations, and disabled states.
  - Published interactive documentation in `docs/components/ai-prompt.html`.
- **Full SCSS and LESS Feature & Component Parity (`scss/`, `less/boodoo.less`, `tests/framework.test.mjs`)**:
  - Implemented 100% component parity between SCSS and LESS distributions across all 44 components.
  - Added full LESS implementations for:
    - `.dock` (App shelf / macOS-style floating dock)
    - `.kpi-card` (Dashboard KPI metrics with trend badges and progress indicators)
    - `.ai-prompt` (AI chat inputs, prompt suggestion chips, stop/send action triggers)
    - `.banner` (Dismissible header/footer notification banners)
    - `.bottom-sheet` (Mobile drawer and touch-friendly action sheets)
    - `.chip` (Tag inputs, filter pills, removable badges)
    - `.command-palette` (Search & quick command launcher)
    - `.context-menu` (Right-click popup menus)
    - `.data-table` (Sortable, filterable responsive tables)
    - `.dropzone` (Drag-and-drop file uploaders)
    - `.empty-state` (First-time user & empty search indicators)
    - `.kbd` (Styled keyboard shortcut keys)
    - `.lightbox` (Fullscreen modal media viewports)
    - `.otp-input` (SMS/2FA code verification digit groups)
    - `.rating` (Star and numeric rating indicators)
    - `.segmented-control` (iOS-style switchable pill tabs)
    - `.speed-dial` (Material Floating Action Button menus)
    - `.splitter` (Docking, resizable pane layouts)
    - `.stepper` (Multi-step wizards and checkout trackers)
    - `.timeline` (Chronological activity & audit logs)
    - `.tree-view` (Nested file and organizational hierarchy trees)
  - Established permanent **Dual-Source Feature Parity Rule** in project guidelines (`.agents/AGENTS.md`) enforced via automated unit tests.
- **Documentation Navigation Auto-Focus & Centering (`site/layout.html`, `site/assets/docs.css`)**:
  - On page load and navigation, active sidebar links (`.docs-nav-list li a.active`) automatically calculate their offset and scroll into view (`sidebar.scrollTop`) centered within the visible viewport.
  - Added enhanced active state styling with a 3px primary indicator bar, gradient highlight pill, and `:focus-visible` accessibility rings.
- **Automated Unit Testing & Component Validation Suite (`tests/framework.test.mjs`, `package.json`)**:
  - Added 11 automated test suites covering CSS bundle generation, `@layer` omission, spacing scales, CSS variable color bindings, token parity, accessibility focus rings/reduced motion, React Native exports, and complete SCSS/LESS parity verification.
  - Integrated `npm run test:unit` directly into `npm test`.

### Fixed
- **Material Comparison Floating Button (`site/src/about/vs-material.html`)**:
  - Fixed floating action button escaping the example card on `vs-material.html` by applying `.position-static` to the inline demonstration button.
- **Spacing Scale Architecture & Customization (`scss/_variables.scss`, `site/src/utilities/spacing.html`)**:
  - Documented and validated the default generous modern spacing scale: `0` (0), `0.5` (0.5rem = 8px), `1` (1.25rem = 20px), `2` (2.25rem = 36px), `3` (3.25rem = 52px), `4` (4.25rem = 68px), and `5` (5.25rem = 84px), engineered for comfortable SaaS card and section breathing room.
  - Added comprehensive documentation and developer guides for customizing spacing to a compact Bootstrap scale (`1 = 0.25rem`, `3 = 1rem`, `5 = 3rem`) or any custom density via CSS variables (`--boodoo-spacer-*`), SCSS `$boodoo-spacers`, LESS `@boodoo-spacer`, and `boodoo/tokens` JavaScript / React Native APIs.
- **Dynamic Component CSS Variable Theming & Dark Mode Inversion (`scss/_root.scss`, `scss/content/_tables.scss`, `scss/components/*`)**:
  - Replaced hardcoded compile-time Sass color literals in `.table`, `.btn-outline-*`, `.pagination`, `.list-group`, and `.avatar` with dynamic CSS custom properties (`var(--boodoo-...)`).
  - Dark mode rules (`@media (prefers-color-scheme: dark)` and `[data-boodoo-theme="dark"]`) now dynamically invert the entire gray-scale palette (`--boodoo-gray-100` through `--boodoo-gray-900`) and surface tokens (`--boodoo-light`, `--boodoo-dark`), allowing immediate runtime re-theming across components.
  - Converted table striped and hover background formulas to use CSS `color-mix(...)` driven by CSS custom properties.
  - Refactored `.accordion-button::after` caret icon to use CSS `mask-image` with `var(--boodoo-accordion-icon-color, currentColor)` and active background colors, eliminating static hex color fills.
- **CSS Cascade Layers Specificity Trap Removed (`scss/_root.scss`)**:
  - Removed empty `@layer reset, tokens, components, utilities;` declaration that erroneously caused consumer layered CSS to lose specificity battles against unlayered framework styles.
- **Modular Core CSS Bundle Surface (`scss/boodoo.scss`)**:
  - Excluded uncompiled native platform skins (`@import "components/native";`) from the core framework distribution, keeping the compiled web bundle lean and strictly standard-compliant.

---

## [1.1.1] - 2026-10-13

### Added
- **React Native Mobile Component Suite (`react-native/index.js`, subpath `boodoo/react-native`)**:
  - Pure native mobile components for iOS & Android without DOM dependencies: `BoodooProvider`, `Button`, `Card`, `Badge`, `Text`, `TextInput`, and `useTheme`.
  - Built with pure React Native `StyleSheet` primitives — 0 external packages, zero native linking, Expo Go compatible.
- **React Native Paper Theme Adapter (`react-native/paper.js`, subpath `boodoo/paper`)**:
  - Drop-in MD3 Light and Dark theme presets (`boodooPaperLightTheme`, `boodooPaperDarkTheme`) enabling existing React Native Paper projects to immediately inherit Boodoo's brand aesthetics without migrating components.
- **Universal Design Tokens (`tokens/index.js`, `tokens/tokens.json`, subpath `boodoo/tokens`)**:
  - Exported complete token system (colors, spacing, radii, typography, elevation shadows) as modular JavaScript and JSON constants for cross-platform sharing across Web, Desktop, and Mobile.
- **Complete Framework Migration Suite**:
  - Added dedicated, step-by-step migration guides and class mappings for all major alternatives:
    1. [Migrate from Bootstrap](site/src/about/migrate-from-bootstrap.html)
    2. [Migrate from Tailwind CSS](site/src/about/migrate-from-tailwind.html)
    3. [Migrate from Foundation](site/src/about/migrate-from-foundation.html)
    4. [Migrate from Material Design](site/src/about/migrate-from-material.html)
    5. [Migrate from React Native Paper](site/src/about/migrate-from-react-native-paper.html)
  - Added bidirectional cross-linking between all "vs" comparison pages and migration guides.
- **Expo Mobile Starter Scaffold (`bin/create-boodoo.mjs`)**:
  - Added template 10 (`React Native Mobile (Expo SDK 51 + Boodoo Native UI)`) to `npx create-boodoo`.
- **boodoo vs React Native Paper Guide (`site/src/about/vs-react-native-paper.html`)**:
  - Published comprehensive architectural comparison, performance breakdown, and zero-risk two-phase migration roadmap.
- **React Native Mobile Starter Zip Archive**:
  - Generates standalone `boodoo-react-native-starter.zip` accessible via CDN template variables and downloadable from documentation and starter guides.

---

## [1.1.0] - 2026-10-11

### Added
- **Motion & Animation Utilities (`scss/_animations.scss`)**:
  - Expanded keyframe animation utilities including `.anim-pulse`, `.anim-bounce`, `.anim-ping`, `.anim-spin`, `.anim-fade-in`, `.anim-slide-up`, and transition speed helpers (`.anim-fast`, `.anim-slow`).
  - Added dedicated interactive documentation page (`docs/motion/animations.html`) showcasing animated preview cards, replay controls, duration modifiers, easing functions, and code examples.
- **Announcement Banner Component (`scss/components/_banner.scss`, `js/src/banner.js`)**:
  - New `.banner` component supporting dismissible headers/footers, fixed positioning (`.banner-fixed-top`, `.banner-fixed-bottom`), full color palettes, actions, and auto-dismiss JavaScript integration.
  - Published comprehensive Banner documentation page (`docs/components/banner.html`).
- **Enhanced Dropzone & File Pickers (`js/src/dropzone.js`, `scss/components/_dropzone.scss`)**:
  - Drag-and-drop file upload component with visual feedback, progress indicators, preview thumbnail generation, and multi-file validation.
- **Dynamic Asset Sizing & Remote Archive Architecture**:
  - Replaced hardcoded package and archive download sizes across documentation with dynamic template injection variables.
  - Migrated zip release distribution assets to CDN endpoints (`cdn.jsdelivr.net`) keeping the core repository lightweight.
- **create-boodoo Tech Stack & Version Indicators**:
  - Enhanced `create-boodoo` CLI (`bin/create-boodoo.mjs`) template selection prompt with explicit technology stack versions across all 9 scaffolds:
    1. **HTML5 + Sass Starter**: HTML5, Sass ^1.77.0, Boodoo v1.1.0
    2. **Vite + Vanilla**: Vite ^5.0.0, Vanilla JS, Boodoo v1.1.0
    3. **Next.js / React**: Next.js ^14.2.0, React ^18.3.0, Boodoo v1.1.0
    4. **Electron Desktop App**: Electron ^32.0.0, Node.js, Boodoo v1.1.0
    5. **Angular Starter**: Angular ^18.0.0, TypeScript ~5.4.2, RxJS ~7.8.0, Boodoo v1.1.0
    6. **Cordova & PhoneGap Mobile**: Cordova Hybrid, Mobile WebView, Boodoo v1.1.0
    7. **Meteor.js Full-Stack App**: Meteor.js ^2.0.0, Blaze ReactiveVar, Boodoo v1.1.0
    8. **Photon Desktop UI**: Electron ^32.0.0, Photon UI CSS, Boodoo v1.1.0
    9. **React Native Web**: React ^18.3.0, React Native Web ^0.19.0, Vite ^5.0.0, Boodoo v1.1.0

### Fixed & Improved
- **Code & Template Sanitization**:
  - Audited inline styling and text wrapping across all documentation snippets and component layouts, ensuring strict adherence to semantic typography and framework standards.
- **Documentation & Navigation Consistency**:
  - Refined site navigation indexes, sitemap generation, and cross-framework comparison pages.

---

## [1.0.9] - 2026-10-06

### Added
- **Multi-Platform & Framework Expansion (Angular, Cordova, PhoneGap, Meteor, Photon, React Native)**:
  - **`create-boodoo` Scaffolder Suite**: Expanded `bin/create-boodoo.mjs` to 9 production-ready starter templates:
    1. Vanilla HTML5 + Sass
    2. Vite + Vanilla
    3. Next.js / React
    4. Electron Desktop App
    5. Angular Starter (Standalone Components + Boodoo CSS & scripts)
    6. Cordova & PhoneGap Hybrid Mobile App (`config.xml`, `deviceready` lifecycle, viewport safe-area styling)
    7. Meteor.js Full-Stack App (Reactive templates + Boodoo components)
    8. Photon Desktop UI (Classic macOS & Electron desktop panes, toolbar, segmented buttons, tab bars)
    9. React Native Web (Universal web & mobile architecture)
  - **Photon Native UI Primitives**: Added `.native-photon` styling suite in `scss/components/_native.scss` supporting `.toolbar-header`, `.toolbar-footer`, `.pane-group`, `.pane`, `.pane-sidebar`, `.nav-group`, `.tab-group`, and native macOS/Electron push buttons.
  - **Cordova & PhoneGap Lifecycle Support**: Integrated Cordova/PhoneGap `deviceready` event hook directly into Boodoo JS `autoInit()`.
  - **Platforms & Frameworks Guide**: Published `site/src/getting-started/platforms.html` with step-by-step code samples and configuration for Angular, Cordova/PhoneGap, Meteor, Photon, and React Native Web.
  - **Interactive CodePen Integration**: Added one-click "CodePen" launch buttons beside the "Copy" action for all component and demo documentation code snippets across the website, pre-filling external Boodoo CDN stylesheets and scripts with live runnable HTML/CSS/JS payloads.

---

## [1.0.8] - 2026-09-30

### Added
- **Electron Desktop Application Integration & Scaffolding**:
  - **`create-boodoo` Scaffolder Template**: Added option `4) Electron Desktop App (Cross-Platform Native UI)` to `bin/create-boodoo.mjs`, producing a ready-to-run Electron app with frameless custom titlebars, window controls, IPC event bridge, responsive sidebar, and Boodoo component demo.
  - **Comprehensive Electron Documentation**: Added official guide (`site/src/getting-started/electron.html`) covering setup, frameless window drag mechanics (`-webkit-app-region: drag`), IPC window controls, CSP configurations, and recommended desktop components (Splitter, Command Palette, Native UI tokens, Data Table).
  - **Browser & Runtime Support Expansion**: Documented verified desktop runtime compatibility (Electron, Tauri, WebView2, Capacitor) in `site/src/getting-started/browser-support.html` and `README.md`.

### Fixed
- **Leverage Browser Caching & Static Asset Cache-Control**:
  - Implemented comprehensive `mod_expires` and `mod_headers` directives in `.htaccess`, setting 1-year immutable caching (`max-age=31536000, public, immutable`) for CSS, JS, SVGs, WebP/PNG, icons, and web fonts.
- **Eliminate Render-Blocking Resources & Webfont Load Optimization**:
  - Configured font stylesheet preloading and asynchronous loading (`media="print" onload="this.media='all'"`) with `<noscript>` fallback across all site pages and templates.
  - Retained `&display=swap` to prevent invisible text during webfont download.
  - Added the `defer` attribute to framework scripts (`boodoo.js` and `search.js`) to unblock main thread HTML parsing.
- **Cumulative Layout Shift (CLS) Prevention**:
  - Added explicit `width="32"` and `height="32"` attributes to all navbar brand images (`boodoo-icon.svg`) across landing, documentation layouts, 404, and example templates.
- **Accessibility & Form Control Identification**:
  - Added explicit semantic `name`, `type`, and `<label for="...">` associations to interactive showcase controls in compliance with framework accessibility rules.

---

## [1.0.7] - 2026-09-30

### Added
- **New Interactive UI Components**:
  - **Combobox / Autocomplete Select (`Combobox`, `[data-boodoo="combobox"]`)**: Full keyboard navigation (Arrow Up/Down, Enter, Esc), dynamic fuzzy filtering, clear button (`[data-boodoo-combobox-clear]`), and programmatic instance API (`js/src/combobox.js`, `scss/components/_combobox.scss`).
  - **Resizable Splitter & Docking Panes (`Splitter`, `[data-boodoo="splitter"]`)**: Horizontal and vertical orientation draggable divider (`.splitter-gutter`) with pointer capture, keyboard step resizing, and bounded min/max sizes (`js/src/splitter.js`, `scss/components/_splitter.scss`).
  - **Speed Dial / FAB Action Menu (`SpeedDial`, `.fab-menu`)**: Expandable floating action menu with staggered actions, micro-interactions, click and hover triggers (`js/src/speed-dial.js`, `scss/components/_speed-dial.scss`).
  - **Lightbox / Media Zoom Viewer (`Lightbox`, `[data-boodoo="lightbox"]`)**: Fullscreen gallery preview with swipe/cycling navigation, image zoom toggle, counter, caption, and backdrop blur (`js/src/lightbox.js`, `scss/components/_lightbox.scss`).
- **Emerging Web Platform Primitives**:
  - **CSS Anchor Positioning**: Declarative tethering for popovers, dropdowns, and tooltips using `position-anchor`, `top: anchor(bottom)`, `left: anchor(center)`, and `position-try-options: flip-block, flip-inline` (`scss/components/_popover.scss`, `scss/components/_tooltip.scss`, `scss/components/_dropdown.scss`).
  - **Native Scroll-Driven Animations**: Zero-JS scroll indicators and viewport reveals utilizing `animation-timeline: scroll()` and `animation-timeline: view()` (`.scroll-progress-bar`, `.scroll-reveal`, `.scroll-shrink-header` in `scss/_animations.scss`).
  - **CSS `@starting-style` & Discrete Transitions**: Modern top-layer transitions animating `display` and `overlay` properties smoothly from `display: none` on native `<dialog>` and `[popover]` without JavaScript timers (`scss/components/_modal.scss`, `scss/components/_popover.scss`).
- **Developer Tooling & Ecosystem**:
  - **`create-boodoo` Scaffolding CLI**: Interactive CLI (`npx create-boodoo` / `bin/create-boodoo.mjs`) to jumpstart projects with templates for Vanilla HTML5/Sass, Vite + Boodoo, and Next.js / React.
  - **Official VS Code Extension**: Full IntelliSense autocomplete and snippet pack for layout, components, custom properties, and anchor positioning (`tools/vscode-boodoo/`).
  - **Icon Token System**: Unified SVG icon sizing tokens (`.icon`, `.icon-xs` through `.icon-2xl`) that automatically scale with typography and theme color inheritance (`scss/_helpers.scss`, `less/boodoo.less`).

---

## [1.0.6] - 2026-09-27

### Added
- **Full JavaScript Component Exports in ESM & Bundles**:
  - Exported all components and utilities from ESM bundle and core entry (`build/js-bundle.mjs`, `js/boodoo.js`), including `Alert`, `BottomSheet`, `Button`, `ChipInput`, `Collapse`, `CommandPalette`, `ContextMenu`, `DataTable`, `Dropdown`, `Modal`, `Offcanvas`, `OTP`, `Popover`, `Rating`, `ScrollSpy`, `Sidebar`, `Stepper`, `Tab`, `Toast`, `Tooltip`, `TreeView`, `Carousel`, `clipboard`, `initDataApi`, `initRipple`, `registerCustomElements`, and `theme`.

### Fixed
- **Dismiss Trigger Event Propagation & Selector Resolution**:
  - Enhanced `enableDismissTrigger` (`js/src/util.js`, `js/boodoo.js`) to accurately locate dismiss trigger controls (`[data-boodoo-dismiss]`), resolve parent component containers via component selectors or fallback names, support both `.hide()` and `.close()` handlers, and ensure accurate dismiss handling for `Alert`, `BottomSheet`, and `Toast`.
- **Alert Component Dismissal**:
  - Broadened `Alert.selector` to target `[data-boodoo-alert], .alert` and removed hard dependency on `.show` presence in `hide()` to support dismiss animations reliably (`js/src/alert.js`).
- **Toast Initialization & Dismissal**:
  - Added dedicated global click listener for `[data-boodoo-dismiss="toast"]` with capture phase to reliably close active toasts.
  - Automatically instantiate and track pre-rendered toasts (`.toast.show[data-boodoo-delay]`, `.toast[data-boodoo-autohide="true"]`) during DOMContentLoaded/load (`js/src/toast.js`).
- **Documentation Strict Text Wrapping Compliance**:
  - Wrapped text nodes inside semantic elements (`<span>`) in documentation examples (`site/src/components/alerts.html`, `site/src/components/toasts.html`) in compliance with project rules.

---

## [1.0.5] - 2026-09-26

### Added
- **Modern CSS Native Primitives**:
  - **Container Queries (`@container`)**: Added `@mixin container-up` and `@mixin container-down` mixins (`scss/_mixins.scss`), `.card-container`, and `.card-responsive` (`scss/components/_card.scss`) for viewport-independent component reorganization.
  - **Native `<dialog>` & `[popover]` Integration**: Full zero-JS styling support for native HTML5 `<dialog class="modal">` with `::backdrop` and `[popover].popover` with `:popover-open` (`scss/components/_modal.scss`, `scss/components/_popover.scss`).
  - **Modern CSS `:has()` Parent Selectors**: Native state-based parent reactivity without JS watchers, including `.form-group:has(.form-control:invalid)` / `:valid` (`scss/forms/_validation.scss`) and `.card:has(.badge-*)` / `.card:has(input:checked)` (`scss/components/_card.scss`).
  - **CSS Cascade Layers (`@layer`)**: Added `@layer reset, tokens, components, utilities;` across the design token hierarchy in `scss/_root.scss` to eliminate specificity collisions.
- **Dual-Engine "Class-First + Data-Attribute" Styling**:
  - Semantic HTML defaults for `button[role="button"]`, `input[type="*"]:not([class])`, and `select:not([class])` (`scss/components/_buttons.scss`, `scss/forms/_control.scss`, `scss/forms/_select.scss`).
  - Attribute-driven variants and sizes: `[data-boodoo-variant]`, `[data-size="lg|sm|block"]`, `[data-boodoo-button]`, `[data-boodoo-input]`, and `[data-boodoo-select]`.
  - Zero-Build Utility Mode mapping CSS custom properties dynamically (`.b-var-pad`, `.b-var-gap`, `.b-var-bg`, `.b-var-color`, `.b-var-radius`, `.b-var-w`, `.b-var-h` in `scss/_utilities.scss`).
- **High-Impact Component Additions & Enhancements**:
  - **Floating Action Buttons (FAB)**: Added Material-inspired `.btn-fab`, `.fab-extended`, `.fab-sm`, and corner placement classes (`.fab-bottom-end`, `.fab-bottom-start`, `.fab-top-end`).
  - **Interactive Stepper & Multi-step Wizard**: Added vanilla JavaScript `Stepper` component (`js/src/stepper.js`) with linear step validation, tab container activation (`data-boodoo-target`), programmatic API (`goTo`, `next`, `prev`, `reset`), and click navigation.
  - **Smart Toast Notifications with Progress Bar**: Integrated animated countdown indicator bar (`.toast-progress`) and automatic duration binding into `Toast` component (`js/src/toast.js`, `scss/components/_toasts.scss`).
- **Interactive Documentation & Playground**:
  - **Interactive Theme Builder GUI**: Real-time color picker, border radius, and typography customizer with live component sandbox and instant CSS custom properties export snippet on `site/src/getting-started/theme.html`.
  - Comprehensive documentation and interactive live examples for Container Queries, `:has()` selectors, Native `<dialog>`, Native Popover, FAB, and Stepper Wizard.

### Fixed
- **Disabled Form Controls Cursor**:
  - Added `cursor: not-allowed;` to `:disabled` states for `.form-control` and `.form-select` in both Sass (`scss/forms/_control.scss`, `scss/forms/_select.scss`) and Less (`less/boodoo.less`).


## [1.0.4] - 2026-09-26

### Added
- **Data Table / Data Grid Component (`DataTable`)**:
  - Interactive table suite supporting sortable column headers (`.sortable`, `.sort-asc`, `.sort-desc`), row selection checkboxes with select-all indeterminate synchronization, expandable detail drawer rows (`.data-table-expandable-row`, `.data-table-row-detail`), sticky headers (`.data-table-sticky`), and dense/compact variations (`.data-table-compact`, `.data-table-dense`).
  - Source SCSS (`scss/components/_data-table.scss`), Less styling (`less/boodoo.less`), and vanilla JS module (`js/src/data-table.js`).
- **Sidebar & Drawer Component (`Sidebar`)**:
  - Persistent and collapsible desktop multi-level navigation sidebar (`.sidebar`, `.sidebar-collapsed`, `.sidebar-dark`) with nested submenu toggling (`data-boodoo-toggle="sidebar-submenu"`), badge integration, and header/footer scaffolds.
  - Source SCSS (`scss/components/_sidebar.scss`), Less styling (`less/boodoo.less`), and vanilla JS module (`js/src/sidebar.js`).
- **Dropzone & File Upload Enhancement**:
  - Drag-and-drop file upload container with invisible file input overlay, `.file-list` preview cards, file format icons, progress bars, and file action buttons (`scss/forms/_dropzone.scss`, `less/boodoo.less`).
- **Context Menu Component (`ContextMenu`)**:
  - Right-click floating menu (`.context-menu`, `data-boodoo-toggle="context-menu"`) with dynamic cursor positioning, viewport collision protection, keyboard shortcuts, and ESC/outside-click dismissal (`scss/components/_context-menu.scss`, `js/src/context-menu.js`).
- **Color Picker & Date/Time Wrappers**:
  - Enhanced UI skins for native inputs: `.form-color-picker` with live hex readout badge and preview swatch, `.form-picker-group` with integrated calendar/clock icons, and `.form-date-range` (`scss/forms/_pickers.scss`, `less/boodoo.less`).
- **Empty State Component**:
  - Visual placeholder pattern (`.empty-state`, `.empty-state-card`, `.empty-state-sm`) with circular icon badges, headings, descriptive text, action button groups, and contextual status variants (`.empty-state-icon-success`, `.empty-state-icon-warning`, `.empty-state-icon-danger`).
- **Chips & Tag Input Component (`ChipInput`)**:
  - Interactive chips and tags (`.chip`, `.chip-remove`, `.chip-primary`, etc.) and dynamic `.chip-input-container` supporting tag creation on `Enter`/comma and deletion on `Backspace` (`scss/components/_chip.scss`, `js/src/chip-input.js`).

### Fixed
- **Floating Labels Autofill & Pre-touch State**:
  - Added support for `:-webkit-autofill` and `:autofill` states on `.form-control` and `.form-control-plaintext` within `.form-floating`.
  - Resolved an issue where browser-autofilled credentials or values prior to user interaction/focus would cause input text and floating labels to collide/overlap.
  - Added `.form-floating` support to `less/boodoo.less` with parity for autofill and textarea elements.

## [1.0.3] - 2026-09-19

### Added
- **Bottom Sheet Component (`BottomSheet`)**:
  - Full mobile-first sliding drawer sheet with drag/swipe-down-to-dismiss touch gestures, spring physics, and keyboard navigation (`Escape`).
  - SCSS/Less styling (`scss/components/_bottom-sheet.scss`, `less/boodoo.less`) with backdrop blurring, responsive max-width, height variants (`.bottom-sheet-full`, `.bottom-sheet-half`), and handle grab states.
  - Interactive declarative data API via `data-boodoo-toggle="bottom-sheet"` and `data-boodoo-dismiss="bottom-sheet"`.
  - Comprehensive documentation and interactive demo at `site/src/components/bottom-sheet.html` and `www/docs/components/bottom-sheet.html`.
- **Segmented Control Component**:
  - Apple/macOS-styled interactive pill toggles (`.segmented-control`, `.segmented-item`) supporting size modifiers (`.segmented-control-sm`, `.segmented-control-lg`) and full-width blocks (`.segmented-control-block`).
  - Seamless light and dark mode color token mapping.
  - Documentation and interactive preview at `site/src/components/segmented-control.html` and `www/docs/components/segmented-control.html`.
- **Keyboard Keycaps Component (`<kbd>`)**:
  - Tactile 3D shortcut keycaps (`.kbd`, `.kbd-xs`, `.kbd-sm`, `.kbd-lg`, `.kbd-group`) with monospace typography and dark-mode adaptation.
  - Documentation and examples at `site/src/components/kbd.html` and `www/docs/components/kbd.html`.
- **Split Buttons**:
  - Added `.btn-split` and `.btn-split-toggle` classes for grouped action-dropdown trigger combinations.
- **Enhanced Programmatic Toast API**:
  - Convenience helper methods on `boodoo.toast`: `boodoo.toast.success()`, `boodoo.toast.danger()` / `boodoo.toast.error()`, `boodoo.toast.warning()`, and `boodoo.toast.info()`.
  - Auto-cleanup removing toast elements from DOM upon completion of hide transitions.

### Changed
- **Form Accessibility & Field Identification**:
  - Added explicit `id` and `name` attributes to all form controls, `<input>`, `<select>`, `<textarea>`, OTP components, and Command Palette search inputs across the framework and documentation to strictly comply with WCAG accessibility standards and autofill specifications.
- **Text Wrapping and Container Purity**:
  - Cleaned up documentation templates and component snippets across `site/src/` to ensure raw text nodes are always wrapped in semantic inline elements (`<span>`, `<p>`, `<strong>`, `<label>`) rather than bare container blocks (`<div>`, `<section>`).
- **Synchronized Less Styling**:
  - Updated `less/boodoo.less` to mirror modern SCSS component additions, variables, and color token parity.
- **Documentation & Site Polish**:
  - Added dedicated navigation entries and live interactive documentation for Bottom Sheet, Segmented Control, and Kbd.
  - Updated sitemap and docs navigation indexes (`www/sitemap.xml`, `www/assets/data/docs-nav.json`).

---

## [1.0.2] - 2026-08-25

### Added
- Comprehensive component documentation and interactive examples across all core widgets.
- Core utilities for layout, spacing, flexbox, CSS Grid, animations, and typography.
- Automated static site generator and sitemap builder.
- Dynamic asset size tracking for build pipelines.

---

## [1.0.1] - 2026-08-25

### Added
- Initial automated sitemap generation.
- Automated project rules and publish workflow documentation.
- Brand asset lockup and design token specifications.

---

## [1.0.0] - 2026-08-25

### Added
- Initial release of boodoo framework.
- Core SCSS and Less compilation pipelines.
- 12-column responsive flexbox grid and utility classes.
- Vanilla JavaScript component library with zero runtime dependencies.
- CDN and npm distribution setup.
