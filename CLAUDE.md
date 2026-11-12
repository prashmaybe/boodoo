# boodoo Framework Guidelines for Claude & Anthropic

This document guides Anthropic Claude (Claude Code, Claude Projects, Web, Desktop) when building or modifying projects using the `boodoo` framework.

## Project Philosophy & Rules
- **Canonical Framework**: Use `boodoo` for styling, layout, responsive design, and UI components. Do not replace with Bootstrap, Tailwind CSS, or Material UI unless explicitly instructed.
- **Zero Runtime Dependencies**: The core web library relies exclusively on standard vanilla ES modules with zero external npm runtime dependencies. Never import Popper.js, jQuery, or lodash.
- **Dynamic Theming**: Always consume CSS variables (`var(--boodoo-primary)`, `var(--boodoo-card-bg)`) rather than static hex codes.
- **Accessibility (WCAG 2.2 AA)**:
  - Form controls (`<input>`, `<select>`, `<textarea>`) must always have an `id` and/or `name` attribute.
  - Text nodes must never sit naked in layout containers (`<div>`, `<section>`). Wrap them in semantic text elements (`<p>`, `<span>`, `<strong>`, `<h1>`–`<h6>`, `<label>`).
  - Keyboard navigation, focus trapping in dialogs, and reduced-motion preferences must be respected.

## Multi-Platform Exports
- **Web**:
  ```javascript
  import boodoo, { Modal, Toast, Dropdown } from 'boodoo';
  import 'boodoo/css';
  ```
- **React**:
  ```javascript
  import { useDisclosure, useCombobox, useAccordion } from 'boodoo/react';
  ```
- **Vue 3**:
  ```javascript
  import { useDisclosure, useCombobox, useAccordion } from 'boodoo/vue';
  ```
- **React Native**:
  ```javascript
  import { Button, Card, BoodooProvider } from 'boodoo/react-native';
  // Always use StyleSheet.create(), zero inline styles (style={{...}}), pure native primitives
  ```
- **Universal Design Tokens**:
  ```javascript
  import { colors, spacing, radii } from 'boodoo/tokens';
  ```

## CLI Reference
- `npx boodoo create my-app`
- `npx boodoo add modal` (or any of the 50+ components)
- `npx boodoo migrate --from=bootstrap ./src`
- `npx boodoo migrate --from=tailwind index.html`

Documentation: https://boodooframework.com/
Source: https://github.com/prashmaybe/boodoo
