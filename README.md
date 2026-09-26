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

- **Zero runtime dependencies** — Vanilla JS (~80 KB / ~17.2 KB gzipped), tree-shakeable, SSR-safe, no jQuery or React required
- **Framework agnostic** — Works seamlessly with HTML, PHP, Laravel, Rails, Django, Node, static sites, or any web stack
- **Mobile-first architecture** — Responsive flexbox grid from 320px to 1400px+, plus 2D CSS Grid utility suite
- **Source-first authoring** — Author in **Sass** (primary) or **Less**; retheme easily by overriding design tokens
- **Accessible & touch-friendly** — Focus-visible rings, `prefers-reduced-motion` compliance, ARIA wiring, and 44px minimum touch targets
- **Multiple delivery methods** — High-speed CDN, npm package, Sass/Less source, or precompiled minified CSS

---

## ⚡ Performance & Bundle Breakdown

| Asset | Minified | Gzip | Brotli | Description |
| :--- | :---: | :---: | :---: | :--- |
| `boodoo.min.css` | ~374 KB | ~51.4 KB | ~33.4 KB | Full framework (all 34+ components + utilities) |
| `boodoo-utilities.min.css` | ~188 KB | ~21.4 KB | ~11.5 KB | Tailwind-style utility classes only |
| `boodoo-grid.min.css` | ~13 KB | ~1.7 KB | ~1.2 KB | Flexbox grid + CSS Grid containers only |
| `boodoo-reboot.min.css` | ~10 KB | ~3.0 KB | ~2.6 KB | Modern CSS reset & base typography |
| `boodoo-animations.min.css` | ~4 KB | ~0.9 KB | ~0.7 KB | Motion utilities & keyframes |
| `boodoo.js` | ~80 KB | ~17.2 KB | ~14.8 KB | Pure vanilla JS (zero dependencies) |

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

Accordion · Alerts · Avatar · Badge · Bottom Sheet · Breadcrumb · Buttons · Button group · Card · Carousel · Chips & Tag Input · Collapse · Command Palette · Context Menu · Data Table · Dropdowns · Empty State · Kbd · List group · Modal · Navs & tabs · Navbar · Offcanvas · Pagination · Placeholders · Popovers · Progress · Rating · Ripple (Material) · Scrollspy · Segmented Control · Sidebar · Skeleton · Spinners · Stepper · Timeline · Toasts · Tooltips · Tree View


Plus **forms** (control, select, checks/radios/switches, range, input group, floating labels, OTP & PIN, dropzone & file upload, color & date pickers, validation) and ~150 **utility classes** (spacing, flex, grid, display, position, text, borders, shadows, elevation…).

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

## 📦 Browser support

Latest two stable versions of Chrome, Edge, Firefox, Safari, Opera + evergreen mobile browsers. Internet Explorer is not supported. Legacy CSS features degrade gracefully via `@supports`.

---

## 📄 License

MIT License — see [LICENSE](site/src/about/license.html). Copyright © 2026 Pebble Benders.

---

<div align="center">
  <sub>Built with ❤️ and boodoo itself (dogfooding).</sub>
</div>