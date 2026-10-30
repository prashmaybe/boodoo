<div align="center">

<a href="https://boodooframework.com">
  <img src="boodoo-brand-assets/boodoo-icon.png" alt="boodoo logo" width="108" height="152" style="max-width: 100%;">
</a>

# boodoo

**The simplicity of Bootstrap. The flexibility of Tailwind. The structure of Foundation. The polish of Material.**

*One design system. Multiple platforms. No unnecessary lock-in.*

A modular, mobile-first CSS design framework built for developers who want pre-styled accessible UI components + utility-first power with zero build overhead and zero JS framework lock-in.

<p align="center">
  <a href="https://github.com/prashmaybe/boodoo/actions/workflows/ci.yml"><img src="https://github.com/prashmaybe/boodoo/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/boodoo"><img src="https://img.shields.io/npm/v/boodoo.svg?style=flat&color=7c3aed" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/boodoo"><img src="https://img.shields.io/npm/dm/boodoo.svg?style=flat&color=5b21e6" alt="npm downloads"></a>
  <a href="https://bundlephobia.com/package/boodoo"><img src="https://img.shields.io/bundlephobia/minzip/boodoo?color=10b981" alt="bundle size"></a>
  <a href="https://github.com/prashmaybe/boodoo/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-7c3aed.svg" alt="License: MIT"></a>
</p>

[**Explore Documentation**](https://boodooframework.com) · [**Live Examples**](https://boodooframework.com/examples/) · [**Getting Started**](https://boodooframework.com/docs/getting-started/introduction.html) · [**Changelog**](https://boodooframework.com/docs/about/changelog.html) · [**Report Issue**](https://github.com/prashmaybe/boodoo/issues)

</div>

---

boodoo combines the best architectural ideas across modern design frameworks:

- **Bootstrap** — 12-column mobile-first flexbox grid, battle-tested components, zero-dependency `data-*` JS API
- **Foundation** — Tidy scaffolds, typography scales, clean layout helpers
- **Tailwind CSS** — Functional utility classes with responsive breakpoint variants
- **Material Design** — Elevation tokens, motion curves, touch ripple effects, floating labels

---

## ✨ Highlights

- **Modern CSS Native Primitives** — CSS Anchor Positioning (`anchor()`, `position-anchor`), Scroll-Driven Animations (`animation-timeline: scroll() / view()`), Container Queries (`@container`), HTML5 `<dialog>` & `[popover]` with `@starting-style` transitions, and CSS `:has()` parent styling.
- **Declarative Headless React & Vue 3 Hooks** — First-party headless hooks (`boodoo/react`) and composables (`boodoo/vue`) including `useDisclosure`, `useCombobox`, and `useAccordion` for Next.js, Remix, Vite, Nuxt, and Vue 3.
- **WAI-ARIA Accessibility Suite** — Screen-reader live region announcer (`a11y.announce`), roving tabindex coordinator (`a11y.setRovingTabindex`), and accessible focus trapping (`a11y.createFocusTrap`).
- **Complete TypeScript Surface** — Full `.d.ts` type declarations across all entrypoints (`boodoo`, `boodoo/tokens`, `boodoo/react-native`, `boodoo/react`, `boodoo/vue`).
- **Unified Design Tokens** — Single unified brand palette across Sass, Less, tokens JSON, and React Native themes.
- **Sanitized Public APIs** — Zero-dependency HTML entity escaping across Toasts, Chip Input, and Command Palette.
- **Zero Runtime Dependencies** — Vanilla JS, tree-shakeable, SSR-safe, no jQuery or Popper required.
- **Developer Tooling & CLI** — `npx boodoo add <component>` shadcn-style component injector, `npx boodoo migrate --from=bootstrap|tailwind` automated codemod, `npx boodoo create` instant multi-framework project scaffolder (Next.js, Vite, React Native, Electron, etc.), and official VS Code IntelliSense snippet suite.
- **Cross-Platform Mobile & Desktop** — Pure native components (`boodoo/react-native`), React Native Paper MD3 theme presets (`boodoo/paper`), Universal Tokens (`boodoo/tokens`), and desktop window drag regions.
- **Mobile-First Architecture** — Responsive flexbox grid from 320px to 1400px+, plus 2D CSS Grid utility suite.
- **Zero-Dependency Native Charts** — Ultra-lightweight canvas visualizations inspired by Chart.js (Bar, Line, Donut, Pie) with high-DPI scaling, interactive tooltips, and theme token bindings — plus pure React Native mobile charts.
- **Rich Components** — 50+ accessible components including Zero-Dependency Charts, Stat / Metric Widgets, Activity Feed & Notifications, Mega Menu, Fullscreen Dialogs, Guided Tours, Combobox, Splitter, Speed Dial, Lightbox, Command Palette (`Ctrl+K`), Bottom Sheet, Stepper, Toasts, and Floating Action Buttons (FAB Dock).
- **Source-First Authoring** — Author in **Sass** (primary) or **Less**; retheme dynamically via runtime CSS custom properties.
- **Accessible & Touch-Friendly** — `role="dialog"`, `aria-modal="true"`, focus-visible rings, `prefers-reduced-motion`, and 44px minimum touch targets.
- **Multiple Delivery Methods** — High-speed CDN, npm package, Sass/Less source, or precompiled minified CSS.

---

## ⚡ Performance & Bundle Breakdown

All distribution assets are tested, minified, and verified on every release build:

| Asset | Minified | Gzip | Brotli | Description |
| :--- | :---: | :---: | :---: | :--- |
| `boodoo.min.css` | ~539 KB | ~75.1 KB | ~51.1 KB | Full framework (all 50+ components + utilities) |
| `boodoo-utilities.min.css` | ~193 KB | ~22.2 KB | ~11.7 KB | Tailwind-style utility classes only |
| `boodoo-grid.min.css` | ~19 KB | ~2.4 KB | ~1.6 KB | Flexbox grid + CSS Grid containers only |
| `boodoo-reboot.min.css` | ~12 KB | ~3.2 KB | ~2.8 KB | Modern CSS reset & base typography |
| `boodoo-animations.min.css` | ~4 KB | ~1.1 KB | ~0.9 KB | Motion utilities & keyframes |
| `boodoo.min.js` | ~178 KB | ~34.1 KB | ~28.5 KB | Pure vanilla JS minified with charts & full a11y suite (zero dependencies) |
| `boodoo.js` | ~195 KB | ~39.2 KB | ~32.6 KB | Pure vanilla JS unminified bundle with source maps |

#### 🔬 Reproducible Benchmark Instructions

Every measurement above is directly verifiable from the compiled distribution assets using Node.js standard compression modules (`zlib`):

```bash
# 1. Build the production distributions
npm run build

# 2. Verify exact byte sizes, gzip, and brotli compression:
node -e "
import('node:fs').then(fs => {
  import('node:zlib').then(z => {
    ['dist/css/boodoo.min.css', 'dist/css/boodoo-grid.min.css', 'dist/css/boodoo-utilities.min.css', 'dist/css/boodoo-reboot.min.css', 'dist/js/boodoo.min.js'].forEach(file => {
      const buf = fs.readFileSync(file);
      console.log(file.padEnd(34), 'Minified:', (buf.length / 1024).toFixed(1) + ' KB', 'Gzip:', (z.gzipSync(buf).length / 1024).toFixed(1) + ' KB', 'Brotli:', (z.brotliCompressSync(buf).length / 1024).toFixed(1) + ' KB');
    });
  });
});"
```

### 📉 How Clean Structural Grid Scaffolding Slashes Bundle Sizes

Standard modern front-end configurations (such as **vanilla React + Tailwind CSS**) often suffer from hidden payload compounding and runtime overhead:

1. **Elimination of Utility Class Sprawl in the DOM & AST**: In typical Tailwind and React setups, structural scaffolding requires sprawling class chains on every element (e.g. `flex flex-col md:flex-row items-center justify-between gap-4 p-6 w-full max-w-7xl mx-auto`). In React JSX, these string-heavy attributes bloat the compiled JavaScript bundle, virtual DOM memory tree, and server-rendered HTML payloads. boodoo replaces this repetition with standardized structural scaffolding (`.container`, `.row`, `.col-*`) and 2D CSS Grid primitives, drastically reducing token duplication.
2. **Tiny Modular Footprint (`boodoo-grid.min.css` is only ~2.4 KB gzip)**: When your application only requires structural layout and responsive alignment, importing `boodoo-grid.min.css` delivers a complete 12-column mobile-first flexbox system alongside CSS Grid layout helpers at just **~2.4 KB gzipped / 1.6 KB brotli**. Compared to hauling hundreds of kilobytes of utility CSS parsers or runtime CSS-in-JS abstractions, boodoo loads instantaneously.
3. **Zero JavaScript Runtime Tax**: React-based UI libraries (Tailwind UI component wrappers, Headless UI, Radix, shadcn) require React runtime reconciliation (`react`, `react-dom` adding 45+ KB gzip before application logic starts) just to manage basic grid transitions, collapsible layouts, and drawer states. boodoo’s scaffolding operates purely on native browser layout engines and zero-overhead declarative HTML primitives (`<dialog>`, `popover`, `@container`), completely eliminating layout-driven JavaScript execution.
4. **Superior Caching & Zero Build Lock-In**: Unlike bundler-purged Tailwind setups where every slight markup tweak triggers unique CSS build outputs that invalidate client caches, boodoo’s clean grid scaffolding is cache-stable across all pages and subdomains.

| Architectural Metric | Vanilla React + Tailwind Setup | boodoo Structural Grid Scaffolding |
| :--- | :--- | :--- |
| **Grid & Layout Delivery** | Bundler-compiled atomic classes scattered across JSX | **~2.4 KB gzipped** standalone stylesheet (`boodoo-grid.min.css`) |
| **Runtime Engine Overhead** | 45+ KB gzip (React + ReactDOM + state hooks) | **0 KB** (Native browser flexbox & CSS Grid engine) |
| **DOM / Markup Footprint** | Bloated inline class strings on every layout node | Semantic structural containers (`.container`, `.row`, `.col`) |
| **Build Pipeline Dependency** | Mandatory (Node.js, PostCSS / Tailwind CLI, bundler) | **Zero build required** (Direct CDN or modular Sass/Less) |
| **Cache Reusability** | Purged atomic CSS cache invalidated on markup changes | Persistent browser-cached global asset |

---

## 🚀 Quick Start

### CDN

```html
<!-- Full Framework Bundle -->
<link href="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo.min-0baa755e.css" rel="stylesheet">
<script src="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo-f57676e3.js" defer></script>
```

#### Lean Modular CDN Builds

```html
<link href="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo-grid.min-03b6ee31.css"      rel="stylesheet"> <!-- grid only (~2.4 KB gzip) -->
<link href="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo-utilities.min-cf761191.css" rel="stylesheet"> <!-- utilities only (~22 KB gzip) -->
<link href="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo-reboot.min-8f22f2db.css"    rel="stylesheet"> <!-- reset only (~3.2 KB gzip) -->
```

### npm

```bash
npm install boodoo
```

```javascript
// Web & Modern Bundlers (Subpath imports)
import boodoo, { Modal, Toast, Collapse, a11y } from 'boodoo';
import 'boodoo/css';

// Headless Declarative React Hooks (Next.js, Remix, Vite)
import { useDisclosure, useCombobox, useAccordion } from 'boodoo/react';

// Headless Declarative Vue 3 Composables (Nuxt, Vite)
import { useDisclosure as useVueDisclosure, useCombobox as useVueCombobox, useAccordion as useVueAccordion } from 'boodoo/vue';

// React Native Mobile (iOS & Android)
import { Button, Card, BoodooProvider } from 'boodoo/react-native';

// Universal Design Tokens
import { colors, spacing, radii } from 'boodoo/tokens';

// React Native Paper MD3 Theme Adapter
import { boodooPaperLightTheme, boodooPaperDarkTheme } from 'boodoo/paper';
```

---

## 🛠️ Developer CLI & Tooling

Scaffold projects, add copy-paste components, or codemod existing codebases:

```bash
# Scaffold a full starter app (Next.js, Vite, React Native, Electron, HTML5)
npx boodoo create my-app

# Inject a component directly into your source (shadcn-style)
npx boodoo add modal
npx boodoo add command-palette

# Automatically migrate classes from Bootstrap or Tailwind
npx boodoo migrate --from=bootstrap ./src
npx boodoo migrate --from=tailwind index.html

# List all copy-pasteable components
npx boodoo list
```

---

## 🧩 Components & Primitives (50+)

Every component is fully accessible (WCAG 2.2 AA target), responsive, and supports both zero-dependency declarative `data-*` attributes and programmatic JavaScript APIs. Click any component below to view live interactive documentation, accessibility specifications, and copy-paste code snippets:

### 🧭 Navigation & Layout
| Component | Description | Live Docs |
| :--- | :--- | :--- |
| **Navbar** | Responsive brand navigation with mobile toggle, search, and navlinks | [View Docs](https://boodooframework.com/docs/components/navbar.html) |
| **Mega Menu** | Multi-column categorized navigation for complex product directories | [View Docs](https://boodooframework.com/docs/components/advanced-components.html#mega-menu) |
| **Sidebar** | Collapsible application navigation drawer with active item indicators | [View Docs](https://boodooframework.com/docs/components/sidebar.html) |
| **Offcanvas** | Slide-out side drawer for mobile navigation, carts, and filters | [View Docs](https://boodooframework.com/docs/components/offcanvas.html) |
| **Breadcrumb** | Hierarchical trail navigation with schema metadata support | [View Docs](https://boodooframework.com/docs/components/breadcrumb.html) |
| **Navs & Tabs** | Accessible tabbed panels with keyboard roving tabindex | [View Docs](https://boodooframework.com/docs/components/navs.html) |
| **Pagination** | Page sequence coordinator with range controls and disabled states | [View Docs](https://boodooframework.com/docs/components/pagination.html) |
| **Dock (App Shelf)** | macOS-style floating application shelf with hover scale magnification | [View Docs](https://boodooframework.com/docs/components/dock.html) |

### 🪟 Overlays & Dialogs
| Component | Description | Live Docs |
| :--- | :--- | :--- |
| **Modal** | Accessible dialog with focus trap, backdrop blur, and smooth transitions | [View Docs](https://boodooframework.com/docs/components/modal.html) |
| **Fullscreen Dialog** | Immersive multi-step modal dialog for distraction-free workflows | [View Docs](https://boodooframework.com/docs/components/extended-components.html#dialog-fullscreen) |
| **Bottom Sheet** | Mobile-native draggable sheet with snap points and velocity physics | [View Docs](https://boodooframework.com/docs/components/bottom-sheet.html) |
| **Command Palette** | Global shortcut search dialog (`Ctrl+K` / `Cmd+K`) with fuzzy navigation | [View Docs](https://boodooframework.com/docs/components/command-palette.html) |
| **Dropdowns** | Position-aware action menus with keyboard navigation and submenus | [View Docs](https://boodooframework.com/docs/components/dropdowns.html) |
| **Popovers** | Rich contextual overlays anchored to trigger elements | [View Docs](https://boodooframework.com/docs/components/popovers.html) |
| **Tooltips** | Lightweight hover/focus hints with smart auto-placement | [View Docs](https://boodooframework.com/docs/components/tooltips.html) |
| **Context Menu** | Right-click contextual action menus with boundary detection | [View Docs](https://boodooframework.com/docs/components/context-menu.html) |
| **Lightbox Gallery** | Fullscreen media viewer with swipe gestures and image zoom | [View Docs](https://boodooframework.com/docs/components/lightbox.html) |

### 📊 Data Display & Surfaces
| Component | Description | Live Docs |
| :--- | :--- | :--- |
| **Card** | Flexible content container with headers, footers, and image overlays | [View Docs](https://boodooframework.com/docs/components/card.html) |
| **Chart** | Zero-dependency responsive data charts (bar, line, donut, pie) with theme token styling | [View Docs](https://boodooframework.com/docs/components/chart.html) |
| **KPI Stat Card** | Metrics display widget with trends, sparkline badges, and change indicators | [View Docs](https://boodooframework.com/docs/components/kpi-card.html) |
| **Data Table** | Sortable, filterable tabular data display with sticky headers and pagination | [View Docs](https://boodooframework.com/docs/components/data-table.html) |
| **Tree View** | Hierarchical expandable tree view for files and categorized directories | [View Docs](https://boodooframework.com/docs/components/tree-view.html) |
| **List Group** | Vertical and horizontal item lists with active states and action buttons | [View Docs](https://boodooframework.com/docs/components/list-group.html) |
| **Timeline** | Chronological event stream with icons, badges, and status lines | [View Docs](https://boodooframework.com/docs/components/timeline.html) |
| **Avatar & Groups** | User profile image container with status dots, initials, and stacked groups | [View Docs](https://boodooframework.com/docs/components/avatar.html) |
| **Badge** | Small status counter and label with dynamic theme color variants | [View Docs](https://boodooframework.com/docs/components/badge.html) |
| **Chips & Tag Input** | Interactive chips with removable tags, avatar prefixes, and keyboard deletion | [View Docs](https://boodooframework.com/docs/components/chip.html) |
| **Empty State** | Polished placeholder illustration, heading, and call-to-action for blank views | [View Docs](https://boodooframework.com/docs/components/empty-state.html) |
| **Kbd** | Visual keyboard key indicator for documenting shortcuts and hotkeys | [View Docs](https://boodooframework.com/docs/components/kbd.html) |

### ⚡ Interactive & Feedback
| Component | Description | Live Docs |
| :--- | :--- | :--- |
| **Buttons & Groups** | Solid, soft, ghost, and outline buttons with loading states | [View Docs](https://boodooframework.com/docs/components/buttons.html) |
| **Accordion** | Collapsible content panels with smooth height transitions and icons | [View Docs](https://boodooframework.com/docs/components/accordion.html) |
| **Collapse** | Toggle visibility of arbitrary page elements programmatically or via HTML | [View Docs](https://boodooframework.com/docs/components/collapse.html) |
| **Carousel** | Touch-swipeable content and image slider with hardware acceleration | [View Docs](https://boodooframework.com/docs/components/carousel.html) |
| **Stepper** | Multi-step progress indicator for checkouts and registration flows | [View Docs](https://boodooframework.com/docs/components/stepper.html) |
| **Guided Tour** | Step-by-step element highlight walk-through for product onboarding | [View Docs](https://boodooframework.com/docs/components/extended-components.html#tour) |
| **Toasts** | Stackable notification banners with auto-dismiss timers and progress bars | [View Docs](https://boodooframework.com/docs/components/toasts.html) |
| **Alerts & Banners** | Inline contextual messages (success, warning, danger, info) | [View Docs](https://boodooframework.com/docs/components/alerts.html) |
| **Progress Bar** | Animated, striped, and indeterminate progress indicators | [View Docs](https://boodooframework.com/docs/components/progress.html) |
| **Spinners** | Lightweight CSS loading animations for buttons and full pages | [View Docs](https://boodooframework.com/docs/components/spinners.html) |
| **Skeleton** | Shimmer loading placeholders that reduce perceived latency | [View Docs](https://boodooframework.com/docs/components/skeleton.html) |
| **Rating** | Interactive star rating component with half-star precision and hover feedback | [View Docs](https://boodooframework.com/docs/components/rating.html) |
| **Ripple Effect** | Material-inspired ink ripple response on click and touch interactions | [View Docs](https://boodooframework.com/docs/components/ripple.html) |
| **Scrollspy** | Automatically updates active navigation items based on viewport scroll position | [View Docs](https://boodooframework.com/docs/components/scrollspy.html) |

### 🚀 Productivity & Advanced Tools
| Component | Description | Live Docs |
| :--- | :--- | :--- |
| **Combobox / Autocomplete** | Searchable select with keyboard arrow navigation and remote data support | [View Docs](https://boodooframework.com/docs/components/combobox.html) |
| **Splitter (Docking Panes)** | Resizable multi-pane layout with draggable splitter handles | [View Docs](https://boodooframework.com/docs/components/splitter.html) |
| **Speed Dial & FAB Dock** | Floating action buttons with quick-action speed dial menus | [View Docs](https://boodooframework.com/docs/components/speed-dial.html) |
| **AI Prompt & Chat Thread** | Structured chat thread bubbles, streaming indicator, and prompt input box | [View Docs](https://boodooframework.com/docs/components/ai-prompt.html) |
| **Activity Feed** | Real-time event notifications and activity stream with user badges | [View Docs](https://boodooframework.com/docs/components/advanced-components.html#activity-feed) |
| **Segmented Control** | iOS-style sliding pill selector for tabs and view filters | [View Docs](https://boodooframework.com/docs/components/segmented-control.html) |

### 📝 Form Controls & Data Input
All form controls feature built-in validation states, accessibility labels, and support floating labels:
- [**Form Overview**](https://boodooframework.com/docs/forms/overview.html) · [**Form Control**](https://boodooframework.com/docs/forms/form-control.html) — Text inputs, textareas, file inputs, color pickers, and sizes (`sm`, `lg`)
- [**Select Menu**](https://boodooframework.com/docs/forms/select.html) — Native custom selects with consistent cross-browser arrow styling
- [**Checks, Radios & Switches**](https://boodooframework.com/docs/forms/checks.html) — Accessible toggle switches, checkboxes, and radio button lists
- [**Input Group**](https://boodooframework.com/docs/forms/input-group.html) — Prepend/append icons, buttons, dropdowns, and prefix tags to inputs
- [**Floating Labels**](https://boodooframework.com/docs/forms/floating-labels.html) — Pure CSS animated floating label form inputs
- [**Range Slider**](https://boodooframework.com/docs/forms/range.html) — Cross-browser styled range tracks and custom thumb sliders
- [**OTP & PIN Input**](https://boodooframework.com/docs/forms/otp.html) — Auto-focusing multi-box verification code input with paste handling
- [**Dropzone & File Upload**](https://boodooframework.com/docs/forms/dropzone.html) — Drag-and-drop file upload zone with preview thumbnails and file revocation
- [**Date & Color Pickers**](https://boodooframework.com/docs/forms/pickers.html) — Clean styled native picker interfaces
- [**Form Validation**](https://boodooframework.com/docs/forms/validation.html) — Browser-native HTML5 validation styles with accessible feedback tooltips

Explore fully assembled templates in the [**Live Examples Gallery**](https://boodooframework.com/examples/) (Dashboard, Checkout, Sign-in, Pricing, Heroes, Blog, Album, and Cover).

---

## 🎨 Theming & Customization

boodoo is token-driven and engineered for minimal customization effort across any consumption pattern (CSS, Sass, Less, npm/yarn packages, React Native):

### 1. Pure CSS / CDN (Runtime Variables)
Override CSS custom properties on `:root` or any element container:
```css
:root {
  --boodoo-primary: #7c3aed;
  /* Customize spacing scale dynamically */
  --boodoo-spacer: 1rem;
  --boodoo-spacer-1: 1.25rem;
  --boodoo-spacer-2: 2.25rem;
  --boodoo-spacer-3: 3.25rem;
}
```

### 2. Sass / SCSS (npm / yarn / Vite / Next.js)
Override `$boodoo-spacer` or provide your own `$boodoo-spacers` map before importing:
```scss
// Override base spacer or individual steps
$boodoo-primary: #7C3AED;
$boodoo-spacer: 1.125rem;
$boodoo-spacers: (
  0: 0,
  1: 1rem,
  2: 1.5rem,
  3: 2rem,
  4: 3rem,
  5: 4rem
);

@import "node_modules/boodoo/scss/boodoo";
```

### 3. LESS Source
```less
@boodoo-spacer: 1.15rem;
@boodoo-primary: #7c3aed;
@import "node_modules/boodoo/less/boodoo";
```

### 4. JavaScript / TypeScript & React Native
Use `createSpacing()` from `boodoo/tokens` or provide a custom spacing object to `<BoodooProvider>`:
```jsx
import { createSpacing } from 'boodoo/tokens';
import { BoodooProvider, Button, Card } from 'boodoo/react-native';

const mySpacing = createSpacing(14); // Generates custom scale from 14px base

export default function App() {
  return (
    <BoodooProvider customTheme={{ spacing: mySpacing }}>
      <Card><Button title="Custom Spacing" /></Card>
    </BoodooProvider>
  );
}
```

Dark mode is automatic via `prefers-color-scheme: dark`, and can be forced with `data-boodoo-theme="light|dark"` on `<html>`. All component colors adapt dynamically via runtime CSS custom properties.

---

## 📦 What's Included

```
boodoo/
├── dist/
│   ├── css/
│   │   ├── boodoo.css / boodoo.min.css        # Full framework bundle
│   │   ├── boodoo-grid.css / .min.css         # Grid + containers
│   │   ├── boodoo-reboot.css / .min.css       # Normalize + base element reset
│   │   ├── boodoo-utilities.css / .min.css    # Tailwind-style utilities (150+)
│   │   ├── boodoo-animations.css / .min.css   # Motion keyframes
│   │   └── boodoo.less.css                    # Compiled from Less source
│   └── js/
│       ├── boodoo.js / boodoo.min.js          # UMD bundle (vanilla JS runtime)
│       ├── boodoo.esm.js                      # ES module (SSR-safe)
│       └── boodoo.d.ts                        # TypeScript declarations
├── react-native/                              # Pure React Native mobile components & theme provider
│   ├── index.js                               # boodoo/react-native modular root re-export
│   ├── layout.js                              # Box, HStack, XStack, VStack, YStack, Center, ZStack, Pressable, Grid
│   ├── typography.js                          # Text, Heading
│   ├── buttons.js                             # Button, ButtonGroup, IconButton, FAB, SegmentedButtons
│   ├── surfaces.js                            # Card, Surface, Divider, Separator, PricingCard, Tile
│   ├── inputs.js                              # TextInput, Input, TextField, Textarea, Searchbar, Checkbox, Radio, Switch, Slider
│   ├── data-display.js                        # Chip, Badge, Avatar
│   ├── feedback.js                            # ActivityIndicator, Spinner, ProgressBar, Progress, Skeleton, Alert, Banner, Toast, Snackbar
│   ├── lists.js                               # List, ListItem, DataTable, Table
│   ├── navigation.js                          # Appbar, Header, TopNavigation, Drawer, BottomNavigation, Tabs, PageControl
│   ├── overlays.js                            # Dialog, AlertDialog, Modal, Overlay, BottomSheet, Actionsheet, Sheet, Menu, Popover, Tooltip
│   ├── theme.js                               # BoodooProvider, useTheme, defaultLightTheme, defaultDarkTheme
│   └── paper.js                               # boodoo/paper (React Native Paper MD3 theme presets)
├── tokens/                                    # Universal design tokens
│   ├── index.js                               # boodoo/tokens JS constants
│   └── tokens.json                            # boodoo/tokens.json cross-platform tokens
├── bin/                                       # Scaffolding CLI (npx create-boodoo)
├── scss/                                      # Sass source architecture
├── less/                                      # Less build
├── js/src/                                    # Vanilla JS modules
└── site/                                      # Documentation (static)
```

---

## 🛠️ Build from Source

```bash
npm run build       # compile all Sass, Less, and JS bundles into dist/
npm test            # run unit tests, package smoke assertions, and site build
npm run site        # generate static HTML documentation pages in site/docs/
npm run sitemap     # generate dynamic sitemap.xml
npm run www         # full deployable build into www/ (dist + docs + assets)
npm run serve:site  # local live preview server at http://localhost:8080
npm run watch       # watch SCSS source for live recompilation
```

Requirements: Node 18+, [Dart Sass](https://sass-lang.com/install), optionally [Less](https://lesscss.org/).

---

## 📄 Documentation & Changelog

The full documentation site is in `site/` and deployed at **https://boodooframework.com**:

- **Getting Started** · Installation · Usage & CDN · Theming · Starter template
- **Layout** (containers, grid, columns, gutters, CSS grid, breakpoints)
- **Content** (typography, images, tables, figures)
- **Forms** · **Components** · **Helpers** · **Utilities** · **Motion**
- **About** · Design principles · Brand assets · boodoo vs Bootstrap · boodoo vs Tailwind · [Changelog](https://boodooframework.com/docs/about/changelog.html) · [License](https://boodooframework.com/docs/about/license.html) · [Privacy](https://boodooframework.com/docs/about/privacy.html) · [Terms](https://boodooframework.com/docs/about/terms.html)

Track version releases, migrations, and notable changes on the [boodoo Changelog](https://boodooframework.com/docs/about/changelog.html).

---

## 🎨 Brand

Official brand assets (logo lockup, icon set, banner, OG image, color tokens) live in `boodoo-brand-assets/` and are mirrored into the docs site under `assets/brand/`. See the [Brand page](https://boodooframework.com/docs/about/brand.html) for usage guidelines. The framework's default theme maps to the brand palette: primary `#7c3aed`, secondary `#5b21e6`, dark `#17135f`, ink `#11143d`, muted `#5c6280`.

---

## ♿ Accessibility

- Focus ring shown only for keyboard users (`:focus-visible`)
- All animations disable under `prefers-reduced-motion`
- Modals trap focus · dropdowns close with `Esc` · carousels support arrow keys
- 44px minimum touch-target sizes
- Skip-links and correct ARIA roles/state across components

---

## 📦 Browser & Desktop Runtime Support

- **Browsers**: Latest two stable versions of Chrome, Edge, Firefox, Safari, Opera + evergreen mobile browsers. Internet Explorer is not supported. Legacy CSS features degrade gracefully via `@supports`.
- **Desktop & Hybrid Apps**: First-class compatibility with **Electron**, **Tauri**, and **Capacitor**. Zero-overhead runtime, built-in window drag regions, custom frameless titlebars, and native OS tokens (Windows Mica, macOS Aqua, Linux Adwaita). Check the [Electron Desktop Guide](https://boodooframework.com/docs/getting-started/electron.html).

---

## 📄 License

MIT License — see [LICENSE](https://github.com/prashmaybe/boodoo/blob/main/LICENSE). Copyright © 2026 [Pebble Benders](https://pebblebenders.com/).

---

<div align="center">
  <sub>Engineered and maintained by <a href="https://pebblebenders.com/" target="_blank" rel="noopener">Pebble Benders</a> — Need a custom web application built? <a href="https://pebblebenders.com/" target="_blank" rel="noopener">Work with us</a>.</sub>
</div>

---

<div align="center">
  <sub>Built with ❤️ and boodoo itself (dogfooding).</sub>
</div>