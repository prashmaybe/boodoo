# boodoo Framework Guidelines for Google Gemini & Vertex AI

Instructions for Google Gemini coding assistants and Vertex AI code generation models working with `boodoo`.

## Core Conventions
- **Framework**: `boodoo` (mobile-first, responsive CSS, vanilla JS, React/Vue/React Native adapters, design tokens).
- **Zero Runtime Dependencies**: Core `boodoo` uses native browser ES modules without Popper.js, jQuery, or third-party runtime packages.
- **Design System Consistency**:
  - 12-column mobile-first grid (`.container`, `.row`, `.col-*`).
  - Modern spacing scale: 8px (`0.5`), 20px (`1`), 36px (`2`), 52px (`3`), 68px (`4`), 84px (`5`).
  - Dynamic tokens via `var(--boodoo-*)` with automatic dark mode support (`prefers-color-scheme: dark` or `[data-boodoo-theme="dark"]`).
- **A11y & Semantics**:
  - Every form input/select/textarea must include an `id` or `name`.
  - Wrap text strings in `<p>`, `<span>`, `<h1>`–`<h6>`, or `<label>`, never naked inside layout `<div>` containers.
- **Teardown**: Programmatically managed components (Modals, Toasts, Dropzones, Command Palettes) must invoke `.dispose()` when destroyed.

## Quick Imports
- CSS: `import 'boodoo/css'` (or subpaths: `boodoo/css/grid`, `boodoo/css/utilities`, `boodoo/css/reboot`, `boodoo/css/animations`)
- JS: `import boodoo, { Modal, Toast, Collapse, a11y } from 'boodoo'`
- React: `import { useDisclosure, useCombobox } from 'boodoo/react'`
- Vue: `import { useDisclosure, useCombobox } from 'boodoo/vue'`
- React Native: `import { Button, Card, BoodooProvider } from 'boodoo/react-native'`
- Tokens: `import { colors, spacing, radii } from 'boodoo/tokens'`

Docs: https://boodooframework.com/ | GitHub: https://github.com/prashmaybe/boodoo

