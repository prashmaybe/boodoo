<div align="center">

# boodoo

**The simplicity of Bootstrap. The flexibility of Tailwind. The structure of Foundation. The polish of Material.**

A modular, mobile-first CSS design framework — without JS framework lock-in. Built for developers who want pre-styled accessible UI components + utility-first power with zero build overhead.

[![CI](https://github.com/prashmaybe/boodoo/actions/workflows/ci.yml/badge.svg)](https://github.com/prashmaybe/boodoo/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/boodoo.svg?style=flat)](https://www.npmjs.com/package/boodoo)
[![npm downloads](https://img.shields.io/npm/dm/boodoo.svg?style=flat)](https://www.npmjs.com/package/boodoo)
[![License: MIT](https://img.shields.io/badge/License-MIT-7c3aed.svg)](https://github.com/prashmaybe/boodoo/blob/main/LICENSE)

</div>

---

boodoo is inspired by the best ideas in modern CSS frameworks:

- **Bootstrap** — 12-column mobile-first flexbox grid, battle-tested components, zero-dependency `data-*` JS API
- **Foundation** — Tidy scaffolds, typography scales, clean layout helpers
- **Tailwind CSS** — Functional utility classes with responsive breakpoint variants
- **Material Design** — Elevation tokens, motion curves, touch ripple effects, floating labels

---

## ✨ Highlights

- **Modern CSS native primitives** — CSS Anchor Positioning (`anchor()`, `position-anchor`), Scroll-Driven Animations (`animation-timeline: scroll() / view()`), Container Queries (`@container`), HTML5 `<dialog>` & `[popover]` with `@starting-style` transitions, and CSS `:has()` parent styling
- **Declarative Headless React & Vue 3 Hooks** — First-party headless hooks (`boodoo/react`) and composables (`boodoo/vue`) including `useDisclosure`, `useCombobox`, and `useAccordion` for Next.js, Remix, Vite, Nuxt, and Vue 3
- **WAI-ARIA Accessibility Suite** — Screen-reader live region announcer (`a11y.announce`), roving tabindex coordinator (`a11y.setRovingTabindex`), and accessible focus trapping (`a11y.createFocusTrap`)
- **Complete TypeScript Surface** — Full `.d.ts` type declarations across all entrypoints (`boodoo`, `boodoo/tokens`, `boodoo/react-native`, `boodoo/react`, `boodoo/vue`)
- **Unified Design Tokens** — Single unified brand palette across Sass, Less, tokens JSON, and React Native themes
- **Sanitized Public APIs** — Zero-dependency HTML entity escaping across Toasts, Chip Input, and Command Palette
- **Zero runtime dependencies** — Vanilla JS, tree-shakeable, SSR-safe, no jQuery or Popper required
- **Developer Tooling & CLI** — `npx boodoo add <component>` shadcn-style component injector, `npx boodoo migrate --from=bootstrap|tailwind` automated codemod, `npx boodoo create` instant multi-framework project scaffolder (Next.js, Vite, React Native, Electron, etc.), and official VS Code IntelliSense snippet suite
- **Cross-Platform Mobile & Desktop** — Pure native components (`boodoo/react-native`), React Native Paper MD3 theme presets (`boodoo/paper`), Universal Tokens (`boodoo/tokens`), and desktop window drag regions
- **Mobile-first architecture** — Responsive flexbox grid from 320px to 1400px+, plus 2D CSS Grid utility suite
- **Rich components** — 50+ accessible components including Stat / Metric Widgets, Activity Feed & Notifications, Mega Menu, Fullscreen Dialogs, Guided Tours, Combobox, Splitter, Speed Dial, Lightbox, Command Palette (`Ctrl+K`), Bottom Sheet, Stepper, Toasts, and Floating Action Buttons (FAB Dock)
- **Source-first authoring** — Author in **Sass** (primary) or **Less**; retheme dynamically via runtime CSS custom properties
- **Accessible & touch-friendly** — `role="dialog"`, `aria-modal="true"`, focus-visible rings, `prefers-reduced-motion`, and 44px minimum touch targets
- **Multiple delivery methods** — High-speed CDN, npm package, Sass/Less source, or precompiled minified CSS


---

## ⚡ Performance & Bundle Breakdown

| Asset | Minified | Gzip | Brotli | Description |
| :--- | :---: | :---: | :---: | :--- |
| `boodoo.min.css` | ~538 KB | ~73.5 KB | ~49.8 KB | Full framework (all 50+ components + utilities) |
| `boodoo-utilities.min.css` | ~193 KB | ~22.2 KB | ~11.7 KB | Tailwind-style utility classes only |
| `boodoo-grid.min.css` | ~19 KB | ~2.4 KB | ~1.6 KB | Flexbox grid + CSS Grid containers only |
| `boodoo-reboot.min.css` | ~12 KB | ~3.2 KB | ~2.8 KB | Modern CSS reset & base typography |
| `boodoo-animations.min.css` | ~5 KB | ~1.1 KB | ~0.9 KB | Motion utilities & keyframes |
| `boodoo.min.js` | ~157 KB | ~28.6 KB | ~23.9 KB | Pure vanilla JS minified with a11y suite (zero dependencies) |
| `boodoo.js` | ~172 KB | ~33.1 KB | ~27.4 KB | Pure vanilla JS unminified bundle |

### 📉 How Clean Structural Grid Scaffolding Slashes Bundle Sizes

Standard modern front-end configurations (such as **vanilla React + Tailwind CSS**) often suffer from hidden payload compounding and runtime overhead:

1. **Elimination of Utility Class Sprawl in the DOM & AST**: In typical Tailwind and React setups, structural scaffolding requires sprawling class chains on every element (e.g. `flex flex-col md:flex-row items-center justify-between gap-4 p-6 w-full max-w-7xl mx-auto`). In React JSX, these string-heavy attributes bloat the compiled JavaScript bundle, virtual DOM memory tree, and server-rendered HTML payloads. boodoo replaces this repetition with standardized structural scaffolding (`.container`, `.row`, `.col-*`) and 2D CSS Grid primitives, drastically reducing token duplication.
2. **Tiny Modular Footprint (`boodoo-grid.min.css` is only ~2.2 KB gzip)**: When your application only requires structural layout and responsive alignment, importing `boodoo-grid.min.css` delivers a complete 12-column mobile-first flexbox system alongside CSS Grid layout helpers at just **~2.2 KB gzipped / 1.5 KB brotli**. Compared to hauling hundreds of kilobytes of utility CSS parsers or runtime CSS-in-JS abstractions, boodoo loads instantaneously.
3. **Zero JavaScript Runtime Tax**: React-based UI libraries (Tailwind UI component wrappers, Headless UI, Radix, shadcn) require React runtime reconciliation (`react`, `react-dom` adding 45+ KB gzip before application logic starts) just to manage basic grid transitions, collapsible layouts, and drawer states. boodoo’s scaffolding operates purely on native browser layout engines and zero-overhead declarative HTML primitives (`<dialog>`, `popover`, `@container`), completely eliminating layout-driven JavaScript execution.
4. **Superior Caching & Zero Build Lock-In**: Unlike bundler-purged Tailwind setups where every slight markup tweak triggers unique CSS build outputs that invalidate client caches, boodoo’s clean grid scaffolding is cache-stable across all pages and subdomains.

| Architectural Metric | Vanilla React + Tailwind Setup | boodoo Structural Grid Scaffolding |
| :--- | :--- | :--- |
| **Grid & Layout Delivery** | Bundler-compiled atomic classes scattered across JSX | **~2.2 KB gzipped** standalone stylesheet (`boodoo-grid.min.css`) |
| **Runtime Engine Overhead** | 45+ KB gzip (React + ReactDOM + state hooks) | **0 KB** (Native browser flexbox & CSS Grid engine) |
| **DOM / Markup Footprint** | Bloated inline class strings on every layout node | Semantic structural containers (`.container`, `.row`, `.col`) |
| **Build Pipeline Dependency** | Mandatory (Node.js, PostCSS / Tailwind CLI, bundler) | **Zero build required** (Direct CDN or modular Sass/Less) |
| **Cache Reusability** | Purged atomic CSS cache invalidated on markup changes | Persistent browser-cached global asset |

---

## 🚀 Quick start

### CDN

```html
<link href="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo.min-0baa755e.css" rel="stylesheet">
<script src="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo-f57676e3.js"></script>
```

### npm

```bash
npm install boodoo
```

```js
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

### Sass source

```scss
// Override any token before importing
$boodoo-primary: #7C3AED;

@import "node_modules/boodoo/scss/boodoo";
```

### Less source

```less
@import "node_modules/boodoo/less/boodoo";
```

### Lean builds

```html
<link href="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo-grid.min-03b6ee31.css"      rel="stylesheet"> <!-- grid only -->
<link href="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo-utilities.min-cf761191.css" rel="stylesheet"> <!-- utilities only -->
<link href="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo-reboot.min-8f22f2db.css"    rel="stylesheet"> <!-- reset only -->
```

---

## 📦 What's included

```
boodoo/
├── dist/
│   ├── css/
│   │   ├── boodoo.css / boodoo.min.css          # full framework
│   │   ├── boodoo-grid.css / .min.css         # grid + containers
│   │   ├── boodoo-reboot.css / .min.css       # normalize + base
│   │   ├── boodoo-utilities.css / .min.css    # Tailwind-style utilities
│   │   ├── boodoo-animations.css / .min.css   # motion
│   │   └── boodoo.less.css                    # compiled from Less
│   └── js/
│       ├── boodoo.js                          # UMD bundle
│       └── boodoo.esm.js                      # ES module (SSR-safe)
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
├── scss/                                      # Sass source
├── less/                                      # Less build
├── js/src/                                    # Vanilla JS modules
└── site/                                      # Documentation (static)
```

---

## 🧩 Components

Accordion · Activity Feed & Notifications · AI Prompt & Chat · Alerts · Avatar · Badge · Bottom Sheet · Breadcrumb & Dropdown · Buttons · Button group · Card · Carousel · Chips & Tag Input · Collapse · Combobox / Autocomplete · Command Palette · Context Menu · Data Table · Dialog & Fullscreen Dialog · Dock (App Shelf) · Dropdowns · Empty State · Floating Action Button (FAB Dock) · Guided Tour · Kbd · KPI Stat Card · Lightbox Gallery · List group · Mega Menu · Modal · Navs & tabs · Navbar · Offcanvas · Pagination · Placeholders · Popovers · Progress · Rating · Ripple (Material) · Scrollspy · Segmented Control · Sidebar · Skeleton · Speed Dial (FAB) · Spinners · Splitter (Docking Panes) · Stat / Metric Widget · Stepper · Timeline · Toasts · Tooltips · Tree View


Plus **forms** (control, select, checks/radios/switches, range, input group, floating labels, OTP & PIN, dropzone & file upload, color & date pickers, validation), **icon token helpers** (`.icon`, `.icon-sm`–`2xl`), and ~150 **utility classes** (spacing, flex, grid, display, position, text, borders, shadows, elevation, scroll-driven animations…).

---

## 🛠 Build from source
 
```bash
npm run build       # compile all Sass, Less, and JS bundles into dist/
npm run site        # generate static HTML documentation pages in site/docs/
npm run sitemap     # generate dynamic sitemap.xml
npm run www         # full deployable build into www/ (dist + docs + assets)
npm run serve:site  # local live preview server at http://localhost:8080
npm run watch       # watch SCSS source for live recompilation
```

Requirements: Node 18+, [Dart Sass](https://sass-lang.com/install), optionally [Less](https://lesscss.org/).

---

## 🎨 Theming & Spacing Customization

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

## 📄 Documentation & Changelog

The full documentation site is in `site/` and deployed at **https://boodooframework.com**:

- **Getting started** · Installation · Usage & CDN · Theming · Starter template
- **Layout** (containers, grid, columns, gutters, CSS grid, breakpoints)
- **Content** (typography, images, tables, figures)
- **Forms** · **Components** · **Helpers** · **Utilities** · **Motion**
- **About** · Design principles · Brand assets · boodoo vs Bootstrap · boodoo vs Tailwind · [Changelog](site/src/about/changelog.html) · [License](site/src/about/license.html)

Track version releases, migrations, and notable changes on the [boodoo Changelog](https://boodooframework.com/docs/about/changelog.html).

## 🎨 Brand

Official brand assets (logo lockup, icon set, banner, OG image, color tokens) live in `boodoo-brand-assets/` and are mirrored into the docs site under `assets/brand/`. See the [Brand page](site/src/about/brand.html) for usage guidelines. The framework's default theme maps to the brand palette: primary `#7c3aed`, secondary `#5b21e6`, dark `#17135f`, ink `#11143d`, muted `#5c6280`.

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

MIT License — see [LICENSE](site/src/about/license.html). Copyright © 2026 <a href="https://pebblebenders.com/" target="_blank" rel="noopener" class="text-decoration-underline text-muted fw-semibold">Pebble Benders</a>.

---

<div align="center">
  <sub>Engineered and maintained by <a href="https://pebblebenders.com/" target="_blank" rel="noopener">Pebble Benders</a>—Need a custom web application built? <a href="https://pebblebenders.com/" target="_blank" rel="noopener">Work with us</a>.</sub>
</div>

---

<div align="center">
  <sub>Built with ❤️ and boodoo itself (dogfooding).</sub>
</div>