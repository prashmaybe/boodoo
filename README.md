<div align="center">

# boodoo

**A modular, mobile-first CSS design framework** inspired by **Bootstrap**, **Foundation**, **Tailwind CSS**, and **Material Design**.

Build fast, responsive, accessible sites — with zero runtime dependencies.

</div>

---

boodoo fuses four great design systems into one cohesive toolkit:

- **Bootstrap** — 12-column mobile-first grid, battle-tested components, `data-*` JS API
- **Foundation** — utility breadth, tidy scaffolds, gray palette
- **Tailwind CSS** — functional utility classes with responsive variants
- **Material Design** — elevation tokens, motion curves, ripple, floating labels

---

## ✨ Highlights

- **Zero dependencies** — ~296 KB CSS + ~56 KB vanilla JS, no jQuery, no bundler required
- **Mobile-first** — responsive grid from 320px to 1400px+, plus CSS Grid utilities
- **Source-first** — author in **Sass** (primary) or **Less**; retheme by overriding tokens
- **Accessible** — focus-visible, `prefers-reduced-motion`, ARIA wiring, 44px touch targets
- **Touch-friendly** — carousel swipe, safe damping, `touch-manipulation` helpers
- **Modern CSS** — `aspect-ratio`, `text-wrap: balance`, CSS Grid, `backdrop-filter`, all progressively enhanced
- **Multiple delivery methods** — CDN, npm, Sass source, Less source, or precompiled CSS

---

## 🚀 Quick start

### CDN

```html
<link href="https://boodoo.dihadiwala.com/dist/css/boodoo.min.css" rel="stylesheet">
<script src="https://boodoo.dihadiwala.com/dist/js/boodoo.js"></script>
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
<link href="https://boodoo.dihadiwala.com/dist/css/boodoo-grid.min.css"   rel="stylesheet">  <!-- grid only -->
<link href="https://boodoo.dihadiwala.com/dist/css/boodoo-utilities.min.css" rel="stylesheet"> <!-- utilities only -->
<link href="https://boodoo.dihadiwala.com/dist/css/boodoo-reboot.min.css" rel="stylesheet">  <!-- reset only -->
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

Accordion · Alerts · Avatar · Badge · Breadcrumb · Buttons · Button group · Card · Carousel · Collapse · Dropdowns · List group · Modal · Navs & tabs · Navbar · Offcanvas · Pagination · Placeholders · Popovers · Progress · Scrollspy · Spinners · Toasts · Tooltips · Ripple (Material)

Plus **forms** (control, select, checks/radios/switches, range, input group, floating labels, validation) and ~150 **utility classes** (spacing, flex, grid, display, position, text, borders, shadows, elevation…).

---

## 🛠 Build from source

```bash
npm run css     # compile all Sass → dist/css
npm run css:less # compile the Less build
npm run js      # bundle JS → dist/js
npm run build   # css + js
npm run serve:site  # serve docs at http://localhost:8080
node build/site-build.mjs  # rebuild docs pages
```

Requirements: Node 18+, [Dart Sass](https://sass-lang.com/install), optionally [Less](https://lesscss.org/).

---

## 🎨 Theming

boodoo is token-driven. Every color, radius, shadow, and timing value is either a Sass variable or a CSS custom property:

```scss
$boodoo-primary: #7952b3;
$boodoo-border-radius: 0.375rem;
```

```css
:root {
  --boodoo-primary: #5b2ef2;
  --boodoo-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 10%);
}
```

Dark mode is automatic via `prefers-color-scheme: dark`, and can be forced with `data-boodoo-theme="light|dark"` on `<html>`.

---

## 📄 Documentation

The full documentation site (like getbootstrap.com) is in `site/` and deployed at **https://boodoo.dihadiwala.com**:

- Getting started · Installation · Usage & CDN · Theming
- Layout (containers, grid, columns, gutters, CSS grid, breakpoints)
- Content (typography, images, tables, figures)
- Forms · Components · Helpers · Utilities · Motion

Each page includes live examples and copy-able code snippets.

---

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