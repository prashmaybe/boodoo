<div align="center">

# budu

**A modular, mobile-first CSS design framework** inspired by **Bootstrap**, **Foundation**, **Tailwind CSS**, and **Material Design**.

Build fast, responsive, accessible sites — with zero runtime dependencies.

</div>

---

budu fuses four great design systems into one cohesive toolkit:

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
<link href="https://budu.dihadiwala.com/dist/css/budu.min.css" rel="stylesheet">
<script src="https://budu.dihadiwala.com/dist/js/budu.js"></script>
```

### npm

```bash
npm install budu
```

```js
import budu from 'budu/dist/js/budu.esm.js';      // ESM, tree-shakeable
import 'budu/dist/css/budu.min.css';
```

### Sass source

```scss
// Override any token before importing
$budu-primary: #0d6efd;

@import "node_modules/budu/scss/budu";
```

### Less source

```less
@import "node_modules/budu/less/budu";
```

### Lean builds

```html
<link href="https://budu.dihadiwala.com/dist/css/budu-grid.min.css"   rel="stylesheet">  <!-- grid only -->
<link href="https://budu.dihadiwala.com/dist/css/budu-utilities.min.css" rel="stylesheet"> <!-- utilities only -->
<link href="https://budu.dihadiwala.com/dist/css/budu-reboot.min.css" rel="stylesheet">  <!-- reset only -->
```

---

## 📦 What's included

```
budu/
├── dist/
│   ├── css/
│   │   ├── budu.css / budu.min.css          # full framework
│   │   ├── budu-grid.css / .min.css         # grid + containers
│   │   ├── budu-reboot.css / .min.css       # normalize + base
│   │   ├── budu-utilities.css / .min.css    # Tailwind-style utilities
│   │   ├── budu-animations.css / .min.css   # motion
│   │   └── budu.less.css                    # compiled from Less
│   └── js/
│       ├── budu.js                          # UMD bundle
│       └── budu.esm.js                      # ES module (SSR-safe)
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

budu is token-driven. Every color, radius, shadow, and timing value is either a Sass variable or a CSS custom property:

```scss
$budu-primary: #7952b3;
$budu-border-radius: 0.375rem;
```

```css
:root {
  --budu-primary: #5b2ef2;
  --budu-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 10%);
}
```

Dark mode is automatic via `prefers-color-scheme: dark`, and can be forced with `data-budu-theme="light|dark"` on `<html>`.

---

## 📄 Documentation

The full documentation site (like getbootstrap.com) is in `site/` and deployed at **https://budu.dihadiwala.com**:

- Getting started · Installation · Usage & CDN · Theming
- Layout (containers, grid, columns, gutters, CSS grid, breakpoints)
- Content (typography, images, tables, figures)
- Forms · Components · Helpers · Utilities · Motion

Each page includes live examples and copy-able code snippets.

---

## 🎨 Brand

Official brand assets (logo lockup, icon set, banner, OG image, color tokens) live in `budu-brand-assets/` and are mirrored into the docs site under `assets/brand/`. See the [Brand page](site/src/about/brand.html) for usage guidelines. The framework's default theme maps to the brand palette: primary `#7c3aed`, secondary `#5b21e6`, dark `#17135f`, ink `#11143d`, muted `#5c6280`.

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
  <sub>Built with ❤️ and budu itself (dogfooding).</sub>
</div>