<div align="center">

<a href="https://boodooframework.com">
  <img src="boodoo-brand-assets/boodoo-icon.png" alt="boodoo logo" width="108" height="152" style="max-width: 100%;">
</a>

# boodoo

**The simplicity of Bootstrap. The flexibility of Tailwind. The structure of Foundation. The polish of Material.**

*One design system. Multiple platforms. No unnecessary lock-in.*

A modular, mobile-first CSS design framework built for developers who want battle-tested, accessible UI components with utility-first speed and zero runtime dependencies.

<p align="center">
  <a href="https://github.com/prashmaybe/boodoo/actions/workflows/ci.yml"><img src="https://github.com/prashmaybe/boodoo/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/boodoo"><img src="https://img.shields.io/npm/v/boodoo.svg?style=flat&color=7c3aed" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/boodoo"><img src="https://img.shields.io/npm/dm/boodoo.svg?style=flat&color=5b21e6" alt="npm downloads"></a>
  <a href="https://bundlephobia.com/package/boodoo"><img src="https://img.shields.io/bundlephobia/minzip/boodoo?color=10b981" alt="bundle size"></a>
  <a href="https://github.com/prashmaybe/boodoo/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-7c3aed.svg" alt="License: MIT"></a>
</p>

[**Explore Documentation**](https://boodooframework.com) · [**Live Examples**](https://boodooframework.com/examples/) · [**Getting Started**](https://boodooframework.com/docs/getting-started/introduction.html) · [**Report Issue**](https://github.com/prashmaybe/boodoo/issues)

</div>

---

## 💡 Why boodoo?

| Core Advantage | What It Delivers |
| :--- | :--- |
| 🚀 **Zero Runtime Dependencies** | Vanilla ES modules, SSR-safe, no jQuery, no Popper, zero supply-chain risk. |
| 📱 **True Multi-Platform** | Web (HTML/CSS), React/Next.js, Vue 3/Nuxt, React Native (iOS/Android), and Electron. |
| ♿ **WCAG 2.2 AA Standard** | Roving tabindex, focus traps, screen-reader live announcements, and touch target minimums. |
| 🎨 **Dynamic CSS Theming** | Runtime custom properties (`var(--boodoo-*)`) for instant re-theming without stylesheet rebuilds. |
| 🧩 **50+ Built-In Components** | Modal, Command Palette (`Ctrl+K`), Drawer, Mega Menu, Combobox, Toasts, Data Table, and more. |
| ⚡ **Modular Subpath Imports** | Load only what you need: Grid (`~2.4 KB` gzip), Utilities (`~22 KB` gzip), or Reboot (`~3 KB` gzip). |

---

## ⚡ Quick Start

### Option 1: Direct CDN (Zero Build Step)

Add the precompiled stylesheet and script directly to your HTML:

```html
<!-- boodoo Modern Responsive CSS -->
<link rel="stylesheet" href="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo.min-0baa755e.css">

<!-- Optional Vanilla JS runtime (data-* attributes, interactive modals, toasts, popovers) -->
<script src="https://cdn.dihadiwala.com/s/app_299a167f351ab3de/2026/09/boodoo-f57676e3.js" defer></script>
```

### Option 2: npm Package

Install the core package in your project:

```bash
npm install boodoo
```

#### Modern Web Bundlers (Vite, Webpack, Rollup)

```javascript
// Import full stylesheet or modular subpaths
import 'boodoo/css';

// Import components, controllers, and accessibility helpers
import boodoo, { Modal, Toast, Collapse, a11y } from 'boodoo';
```

#### Headless React Hooks (Next.js, Remix, Vite)

```jsx
import { useDisclosure, useCombobox, useAccordion } from 'boodoo/react';

export function HeaderNav() {
  const { isOpen, toggle, getDisclosureProps } = useDisclosure();
  return (
    <nav>
      <button onClick={toggle}>Menu</button>
      <div {...getDisclosureProps()} hidden={!isOpen}>Navigation Items</div>
    </nav>
  );
}
```

#### Headless Vue 3 / Nuxt Composables

```vue
<script setup>
import { useDisclosure } from 'boodoo/vue';
const { isOpen, toggle, getDisclosureProps } = useDisclosure();
</script>

<template>
  <button @click="toggle">Toggle Details</button>
  <div v-bind="getDisclosureProps()" v-show="isOpen">Collapsible Content</div>
</template>
```

#### React Native Mobile (iOS & Android)

```jsx
import { BoodooProvider, Button, Card, Text } from 'boodoo/react-native';

export default function MobileScreen() {
  return (
    <BoodooProvider>
      <Card>
        <Text variant="headline">Welcome to boodoo Mobile</Text>
        <Button title="Get Started" variant="primary" />
      </Card>
    </BoodooProvider>
  );
}
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

## 📊 Measured Performance & Bundles

All distribution assets are tested, minified, and verified on every release build:

| Asset | Minified | Gzip | Brotli | Description |
| :--- | :---: | :---: | :---: | :--- |
| `boodoo.min.css` | ~538 KB | ~74.9 KB | ~50.7 KB | Complete framework (all 50+ components + utilities) |
| `boodoo-utilities.min.css` | ~193 KB | ~22.2 KB | ~11.7 KB | Tailwind-style utility classes only |
| `boodoo-grid.min.css` | ~19 KB | ~2.4 KB | ~1.6 KB | Mobile-first 12-column grid + CSS Grid containers |
| `boodoo-reboot.min.css` | ~12 KB | ~3.2 KB | ~2.8 KB | Modern CSS reset & base element styling |
| `boodoo-animations.min.css` | ~5 KB | ~1.1 KB | ~0.9 KB | Motion curves, transitions & keyframes |
| `boodoo.min.js` | ~156 KB | ~29.8 KB | ~24.9 KB | Pure vanilla JS minified with full a11y suite |
| `boodoo.js` | ~171 KB | ~34.3 KB | ~28.6 KB | Pure vanilla JS unminified bundle with source maps |

---

## 🧩 Comprehensive Component Suite (50+)

Boodoo includes over 50 accessible, production-ready components:

<details open>
<summary><b>Click to expand full component directory</b></summary>
<br>

* **Navigation & Structure**: Navbar, Mega Menu, Sidebar, Offcanvas, Breadcrumb, Tabs, Pagination, Dock (App Shelf), Fab Dock.
* **Overlays & Dialogs**: Modal, Fullscreen Dialog, Bottom Sheet, Lightbox Gallery, Command Palette (`Ctrl+K`), Popovers, Tooltips, Context Menu.
* **Data Display**: Card, KPI Stat Card, Data Table, Tree View, List Group, Avatar, Badge, Chip, Timeline, Empty State, Bento Grid.
* **Interactive & Feedback**: Accordion, Collapse, Stepper, Guided Tour, Carousel, Rating, Progress Bar, Spinners, Skeleton, Toasts, Alerts, Banner, Ripple.
* **Productivity & Advanced**: Combobox / Autocomplete, Splitter (Docking Panes), Speed Dial (FAB), Color Picker, Audio Player, AI Prompt & Chat Thread, Activity Feed.
* **Forms & Validation**: Form Control, Floating Labels, Input Group, Select, Checkbox / Radio / Switch, Range Slider, OTP & PIN Input, Dropzone File Upload, Field Validation.

</details>

---

## 🎨 Dual-Source Authoring & Dynamic Theming

### Sass / SCSS Source

```scss
// Override variables before importing
$boodoo-primary: #7C3AED;
$boodoo-border-radius: 0.75rem;

@import "node_modules/boodoo/scss/boodoo";
```

### LESS Source

```less
@boodoo-primary: #7c3aed;

@import "node_modules/boodoo/less/boodoo";
```

### Runtime Browser Theming (CSS Custom Properties)

```css
:root {
  --boodoo-primary: #7c3aed;
  --boodoo-secondary: #5b21e6;
  --boodoo-spacer: 1rem;
}

/* Forced Theme Override */
[data-boodoo-theme="dark"] {
  --boodoo-card-bg: #17135f;
}
```

---

## 📦 What's Included

```
boodoo/
├── dist/
│   ├── css/
│   │   ├── boodoo.css / .min.css              # Full compiled CSS bundle
│   │   ├── boodoo-grid.css / .min.css         # Flexbox + CSS Grid layout
│   │   ├── boodoo-reboot.css / .min.css       # Clean element reset
│   │   ├── boodoo-utilities.css / .min.css    # 150+ utility classes
│   │   ├── boodoo-animations.css / .min.css   # Motion keyframes
│   │   └── boodoo.less.css                    # Compiled from Less source
│   └── js/
│       ├── boodoo.js / .min.js                # UMD client runtime
│       ├── boodoo.esm.js                      # ES Module (SSR-safe)
│       └── boodoo.d.ts                        # TypeScript declarations
├── react-native/                              # Pure React Native mobile components
│   ├── index.js                               # Root re-export
│   ├── layout.js                              # Box, HStack, VStack, Center, Grid
│   ├── typography.js                          # Text, Heading
│   ├── buttons.js                             # Button, IconButton, FAB
│   ├── surfaces.js                            # Card, Surface, Divider
│   ├── inputs.js                              # TextInput, Switch, Checkbox
│   ├── data-display.js                        # Chip, Badge, Avatar
│   ├── feedback.js                            # ProgressBar, Alert, Skeleton
│   ├── navigation.js                          # Appbar, Drawer, Tabs
│   ├── overlays.js                            # Modal, BottomSheet, Menu
│   └── paper.js                               # React Native Paper MD3 adapters
├── tokens/                                    # Universal design tokens (JSON, ESM, CJS)
├── scss/                                      # Sass source architecture
├── less/                                      # Less source stylesheet
└── site/                                      # Documentation & examples site
```

---

## 🛠️ Local Development & Scripts

```bash
# Install dependencies
npm install

# Compile all Sass, Less, JS bundles & TypeScript definitions
npm run build

# Run unit tests, smoke checks, and accessibility verification
npm test

# Build deployable documentation site to site/docs/
npm run site

# Full production build into www/ (dist + docs + assets)
npm run www

# Start local documentation server at http://localhost:8080
npm run serve:site
```

---

## ♿ Accessibility & Standards

* **Keyboard Reachable**: Roving tabindex coordinators, focus trapping, and visible focus rings (`:focus-visible`).
* **Motion Mindful**: Smooth transitions that automatically respect `prefers-reduced-motion`.
* **Touch Ready**: Built-in 44px minimum touch targets across all mobile interactive controls.
* **Sanitized APIs**: Safe DOM manipulation and HTML entity protection against untrusted user strings.

---

## 📄 License & Community

MIT License — see [LICENSE](https://github.com/prashmaybe/boodoo/blob/main/LICENSE).

Engineered and maintained by [Pebble Benders](https://pebblebenders.com/). Built with ❤️ and boodoo itself.