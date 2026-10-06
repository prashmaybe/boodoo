<div align="center">

# boodoo

**The simplicity of Bootstrap. The flexibility of Tailwind. The structure of Foundation. The polish of Material.**

A modular, mobile-first CSS design framework — without JS framework lock-in. Built for developers who want pre-styled accessible UI components + utility-first power with zero build overhead.

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
- **Dual-Engine "Class-First + Data-Attribute" styling** — Clean semantic markup without class bloat (`[data-boodoo-variant]`, `[data-size]`, zero-build variable utilities)
- **Zero runtime dependencies** — Vanilla JS, tree-shakeable, SSR-safe, no jQuery or React required
- **Developer Tooling & CLI** — `npx create-boodoo` project scaffolder (Vanilla, Vite, Next.js, Electron, Angular, Cordova/PhoneGap, Meteor, Photon, React Native Web) and official VS Code IntelliSense snippet suite
- **Cross-Platform, Mobile & Desktop Ready** — First-class support for Angular, Cordova, PhoneGap, Meteor, Photon Desktop UI, React Native Web, Electron, and Tauri with draggable titlebars (`-webkit-app-region: drag`), Fluent/Mica, Aqua, Adwaita, and Photon tokens
- **Mobile-first architecture** — Responsive flexbox grid from 320px to 1400px+, plus 2D CSS Grid utility suite
- **Rich components** — 38+ accessible components including Combobox / Autocomplete, Splitter (Docking Panes), Speed Dial (FAB Menu), Lightbox Media Viewer, Command Palette (`Ctrl+K`), Bottom Sheet, Stepper Wizard, Smart Toasts with progress bar, and Floating Action Buttons (FAB)
- **Source-first authoring** — Author in **Sass** (primary) or **Less**; retheme easily by overriding design tokens or with the Interactive Theme Builder
- **Accessible & touch-friendly** — Focus-visible rings, `prefers-reduced-motion` compliance, ARIA wiring, and 44px minimum touch targets
- **Multiple delivery methods** — High-speed CDN, npm package, Sass/Less source, or precompiled minified CSS


---

## ⚡ Performance & Bundle Breakdown

| Asset | Minified | Gzip | Brotli | Description |
| :--- | :---: | :---: | :---: | :--- |
| `boodoo.min.css` | ~422 KB | ~58.4 KB | ~38.8 KB | Full framework (all 38+ components + utilities) |
| `boodoo-utilities.min.css` | ~188 KB | ~21.6 KB | ~11.6 KB | Tailwind-style utility classes only |
| `boodoo-grid.min.css` | ~13 KB | ~1.7 KB | ~1.2 KB | Flexbox grid + CSS Grid containers only |
| `boodoo-reboot.min.css` | ~10 KB | ~3.0 KB | ~2.6 KB | Modern CSS reset & base typography |
| `boodoo-animations.min.css` | ~4 KB | ~0.9 KB | ~0.7 KB | Motion utilities & keyframes |
| `boodoo.js` | ~119 KB | ~24.1 KB | ~20.9 KB | Pure vanilla JS (zero dependencies) |

### 📉 How Clean Structural Grid Scaffolding Slashes Bundle Sizes

Standard modern front-end configurations (such as **vanilla React + Tailwind CSS**) often suffer from hidden payload compounding and runtime overhead:

1. **Elimination of Utility Class Sprawl in the DOM & AST**: In typical Tailwind and React setups, structural scaffolding requires sprawling class chains on every element (e.g. `flex flex-col md:flex-row items-center justify-between gap-4 p-6 w-full max-w-7xl mx-auto`). In React JSX, these string-heavy attributes bloat the compiled JavaScript bundle, virtual DOM memory tree, and server-rendered HTML payloads. boodoo replaces this repetition with standardized structural scaffolding (`.container`, `.row`, `.col-*`) and 2D CSS Grid primitives, drastically reducing token duplication.
2. **Tiny Modular Footprint (`boodoo-grid.min.css` is only ~1.7 KB gzip)**: When your application only requires structural layout and responsive alignment, importing `boodoo-grid.min.css` delivers a complete 12-column mobile-first flexbox system alongside CSS Grid layout helpers at just **~1.7 KB gzipped / 1.2 KB brotli**. Compared to hauling hundreds of kilobytes of utility CSS parsers or runtime CSS-in-JS abstractions, boodoo loads instantaneously.
3. **Zero JavaScript Runtime Tax**: React-based UI libraries (Tailwind UI component wrappers, Headless UI, Radix, shadcn) require React runtime reconciliation (`react`, `react-dom` adding 45+ KB gzip before application logic starts) just to manage basic grid transitions, collapsible layouts, and drawer states. boodoo’s scaffolding operates purely on native browser layout engines and zero-overhead declarative HTML primitives (`<dialog>`, `popover`, `@container`), completely eliminating layout-driven JavaScript execution.
4. **Superior Caching & Zero Build Lock-In**: Unlike bundler-purged Tailwind setups where every slight markup tweak triggers unique CSS build outputs that invalidate client caches, boodoo’s clean grid scaffolding is cache-stable across all pages and subdomains.

| Architectural Metric | Vanilla React + Tailwind Setup | boodoo Structural Grid Scaffolding |
| :--- | :--- | :--- |
| **Grid & Layout Delivery** | Bundler-compiled atomic classes scattered across JSX | **~1.7 KB gzipped** standalone stylesheet (`boodoo-grid.min.css`) |
| **Runtime Engine Overhead** | 45+ KB gzip (React + ReactDOM + state hooks) | **0 KB** (Native browser flexbox & CSS Grid engine) |
| **DOM / Markup Footprint** | Bloated inline class strings on every layout node | Semantic structural containers (`.container`, `.row`, `.col`) |
| **Build Pipeline Dependency** | Mandatory (Node.js, PostCSS / Tailwind CLI, bundler) | **Zero build required** (Direct CDN or modular Sass/Less) |
| **Cache Reusability** | Purged atomic CSS cache invalidated on markup changes | Persistent browser-cached global asset |

---

## 🚀 Quick start

### CDN

```html
<link href="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo.min-86cc87a5.css" rel="stylesheet">
<script src="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo-3e0a74ee.js"></script>
```

### npm

```bash
npm install boodoo
```

```js
import boodoo from 'boodoo/dist/js/boodoo.esm.js';      // ESM, tree-shakeable
import 'boodoo/dist/css/boodoo.min.css';
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
<link href="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo-grid.min-00656288.css"   rel="stylesheet">  <!-- grid only -->
<link href="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo-utilities.min-10ded7df.css" rel="stylesheet"> <!-- utilities only -->
<link href="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo-reboot.min-bac848f1.css" rel="stylesheet">  <!-- reset only -->
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
├── scss/                                    # Sass source
├── less/                                    # Less build
├── js/src/                                  # Vanilla JS modules
└── site/                                    # Documentation (static)
```

---

## 🧩 Components

Accordion · Alerts · Avatar · Badge · Bottom Sheet · Breadcrumb · Buttons · Button group · Card · Carousel · Chips & Tag Input · Collapse · Combobox / Autocomplete · Command Palette · Context Menu · Data Table · Dropdowns · Empty State · Kbd · Lightbox Gallery · List group · Modal · Navs & tabs · Navbar · Offcanvas · Pagination · Placeholders · Popovers · Progress · Rating · Ripple (Material) · Scrollspy · Segmented Control · Sidebar · Skeleton · Speed Dial (FAB) · Spinners · Splitter (Docking Panes) · Stepper · Timeline · Toasts · Tooltips · Tree View


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

## 🎨 Theming

boodoo is token-driven. Every color, radius, shadow, and timing value is either a Sass variable or a CSS custom property:

```scss
$boodoo-primary: #7C3AED;
$boodoo-border-radius: 0.5rem;
```

```css
:root {
  --boodoo-primary: #7c3aed;
  --boodoo-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 10%);
}
```

Dark mode is automatic via `prefers-color-scheme: dark`, and can be forced with `data-boodoo-theme="light|dark"` on `<html>`.

---

## 📄 Documentation & Changelog

The full documentation site is in `site/` and deployed at **https://boodoo.dihadiwala.com**:

- **Getting started** · Installation · Usage & CDN · Theming · Starter template
- **Layout** (containers, grid, columns, gutters, CSS grid, breakpoints)
- **Content** (typography, images, tables, figures)
- **Forms** · **Components** · **Helpers** · **Utilities** · **Motion**
- **About** · Design principles · Brand assets · boodoo vs Bootstrap · boodoo vs Tailwind · [Changelog](site/src/about/changelog.html) · [License](site/src/about/license.html)

Track version releases, migrations, and notable changes on the [boodoo Changelog](https://boodoo.dihadiwala.com/docs/about/changelog.html).

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
- **Desktop & Hybrid Apps**: First-class compatibility with **Electron**, **Tauri**, and **Capacitor**. Zero-overhead runtime, built-in window drag regions, custom frameless titlebars, and native OS tokens (Windows Mica, macOS Aqua, Linux Adwaita). Check the [Electron Desktop Guide](https://boodoo.dihadiwala.com/docs/getting-started/electron.html).

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