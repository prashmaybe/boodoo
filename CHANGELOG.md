# Changelog

All notable changes to the **boodoo** framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
