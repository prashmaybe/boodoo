# Changelog

All notable changes to the **boodoo** framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.3] - 2026-10-16

### Added
- **Full Modular React Native UI Component Suite (`react-native/`, subpath `boodoo/react-native`)**:
  - Expanded native mobile coverage with 12 clean, dedicated modular submodules:
    - `layout.js` (`Box`, `HStack`, `XStack`, `VStack`, `YStack`, `Center`, `ZStack`, `Pressable`, `Grid`)
    - `typography.js` (`Text`, `Heading`)
    - `buttons.js` (`Button`, `ButtonGroup`, `IconButton`, `FAB`, `SegmentedButtons`)
    - `surfaces.js` (`Card`, `Surface`, `Divider`, `Separator`, `PricingCard`, `Tile`)
    - `inputs.js` (`TextInput`, `Input`, `TextField`, `Textarea`, `TextArea`, `Searchbar`, `SearchBar`, `HelperText`, `Checkbox`, `CheckBox`, `RadioButton`, `Radio`, `RadioGroup`, `Switch`, `Toggle`, `Slider`, `Stepper`, `Select`, `Picker`, `ToggleButton`)
    - `data-display.js` (`Chip`, `Badge`, `Avatar`)
    - `feedback.js` (`ActivityIndicator`, `Spinner`, `ProgressBar`, `Progress`, `Skeleton`, `Alert`, `Banner`, `Toast`, `Snackbar`)
    - `lists.js` (`List`, `ListItem`, `DataTable`, `Table`)
    - `navigation.js` (`Appbar`, `Header`, `TopNavigation`, `Drawer`, `BottomNavigation`, `Tabs`, `PageControl`)
    - `overlays.js` (`Dialog`, `AlertDialog`, `Modal`, `Overlay`, `BottomSheet`, `Actionsheet`, `ActionSheet`, `Sheet`, `Menu`, `Popover`, `Tooltip`, `Portal`, `TouchableRipple`)
    - `theme.js` (`BoodooProvider`, `useTheme`, `defaultLightTheme`, `defaultDarkTheme`)
    - `paper.js` (`boodooPaperLightTheme`, `boodooPaperDarkTheme`)
  - Features complete cross-platform coverage for React Native Paper, React Native Elements (RNE UI), Gluestack, Tamagui, UI Kitten, and Wix UI Lib.
- **Enterprise Application Shell & Layout Utilities (`scss/_helpers.scss`, `less/boodoo.less`)**:
  - Added `.shell-header` with sticky header positioning and z-index mapping.
  - Added `.shell-sidebar` with viewport-height scrolling.
  - Added `.shell-pad`, `.shell-pad-sm`, and `.shell-pad-lg` for responsive shell padding.
  - Added `.bg-login-gradient` and `.bg-hero-gradient` aesthetic gradient backgrounds.
  - Added `.feature-card` interactive elevated cards with hover lift.
  - Added `.form-section`, `.form-section-title`, and `.form-section-desc` chrome utilities.
- **Responsive Grid Auto Columns & Gutter Bridge (`scss/_grid.scss`, `less/boodoo.less`)**:
  - Enabled `.grid` gutter bridge with `--boodoo-gutter-x` and `--boodoo-gutter-y`.
  - Added auto-fit and auto-fill column layout utilities: `.grid-auto-fill`, `.grid-auto-fit`, `.grid-auto-fill-sm/md/lg`, `.grid-auto-fit-sm/md/lg`.
  - Added enterprise column templates: `.grid-cols-tier`, `.grid-cols-search`, `.grid-cols-line`, `.grid-cols-simulation`.
- **SaaS Role Badges & Navigation Active Bar (`scss/components/_badge.scss`, `scss/components/_nav.scss`, `less/boodoo.less`)**:
  - Added 8 semantic role badges: `.badge-role-admin`, `.badge-role-member`, `.badge-role-viewer`, `.badge-role-owner`, `.badge-role-billing`, `.badge-role-guest`, `.badge-role-developer`, `.badge-role-security`.
  - Added `.nav-sidebar` and `.nav-active-bar` (`.nav-active-bar-start`, `.nav-active-bar-bottom`) for navigation menus.
  - Added `.table-scroll-max` (`.table-scroll-sm/md/lg/xl`) max-height table scrolling wrappers.

### Fixed
- **Dark Mode Gray Scale Inversion Defect (`scss/_root.scss`, `less/boodoo.less`)**:
  - Fixed dark mode gray scale mapping where `--boodoo-gray-800` was previously identical to `--boodoo-gray-900`.
  - Inverted `--boodoo-gray-800` to `#ececf4` (light gray-200) and `--boodoo-gray-900` to `#f7f8fb` (light gray-100) across both media queries and `[data-boodoo-theme="dark"]`.
- **Dynamic CSS Variable Theming Across Components (`scss/components/*`, `less/boodoo.less`)**:
  - Replaced hardcoded Sass variables with dynamic CSS custom properties:
    - `.avatar`: `--boodoo-avatar-bg: var(--boodoo-primary)` and `--boodoo-avatar-color: var(--boodoo-white)`.
    - `.badge`: `background-color: var(--boodoo-primary)`, soft badges, and outline borders now read `var(--boodoo-...)`.
    - `.card-clickable`: Hover border now dynamically binds to `var(--boodoo-primary)`.
    - `.nav`: Active states and pills bind to `var(--boodoo-primary)`.
    - `.dropdown-item.active`: Now binds to `var(--boodoo-dropdown-link-active-bg, var(--boodoo-primary))`.
    - `.navbar-nav .nav-link.active`: Dynamically binds to `var(--boodoo-primary)`.
- **CSS Custom Properties for Utilities, Links, Headings, and Solid Buttons (`scss/_maps.scss`, `scss/_reboot.scss`, `scss/components/_buttons.scss`)**:
  - `.text-primary` and `.bg-primary` compile to `var(--boodoo-primary) !important;`.
  - `.text-muted` compiles to `var(--boodoo-text-muted, var(--boodoo-gray-600, #6c757d)) !important;`.
  - `a` hyperlinks consume `var(--boodoo-link-color)` and `var(--boodoo-link-hover-color)`.
  - Headings `h1`–`h6` consume `var(--boodoo-heading-color)` and `var(--boodoo-h1-font-size)` through `var(--boodoo-h6-font-size)`.
  - Solid `.btn-primary` and variants bind `--boodoo-btn-bg` and `--boodoo-btn-border` to `var(--boodoo-#{$name})` with `color-mix(...)` for hover/active states.
- **Sticky Helpers Sticky Z-Index Flexibility (`scss/_helpers.scss`, `scss/_utilities.scss`, `less/boodoo.less`)**:
  - `.sticky-top`, `.sticky-bottom`, and `.sticky-lg-top` now bind to `var(--boodoo-zindex-sticky, 1020)`.

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
