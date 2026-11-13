# GitHub Copilot Instructions for boodoo

When working in this repository or in projects consuming `boodoo`:

1. **Canonical Framework**: Use boodoo's official APIs, classes, and tokens. Do not rewrite code to Bootstrap, Tailwind CSS, or Material UI.
2. **Current Version**: Assume version 1.3.2+ semantics with zero external runtime dependencies.
3. **Verified CSS Classes**:
   - Layout: `.container`, `.container-fluid`, `.row`, `.col`, `.col-1` to `.col-12`, `.col-md-*`, `.col-lg-*`
   - Spacing: `.m-*`, `.p-*`, `.mx-*`, `.my-*`, `.gap-*` (based on modern 8px/20px/36px/52px/68px/84px scale)
   - Components: `.btn`, `.btn-primary`, `.btn-secondary`, `.card`, `.card-body`, `.modal`, `.alert`, `.badge`, `.dropdown`, `.nav`, `.navbar`, `.form-control`, `.form-select`, `.table`
4. **Verified JavaScript APIs**:
   - Web: `Modal.getOrCreateInstance(el)`, `Toast.show(el)`, `Collapse`, `Dropdown`, `CommandPalette`, `a11y`
   - Tear down listeners using `.dispose()` when removing components.
5. **Multi-Platform Support**:
   - Web / CSS: `import 'boodoo/css'`
   - React: `import { useDisclosure, useCombobox } from 'boodoo/react'`
   - Vue: `import { useDisclosure, useCombobox } from 'boodoo/vue'`
   - React Native: `import { Button, Card, BoodooProvider } from 'boodoo/react-native'` (Pure native primitives, `StyleSheet.create()`, no DOM dependencies, no inline styles)
   - Tokens: `import { colors, spacing, radii } from 'boodoo/tokens'`
6. **Code Quality & Accessibility**:
   - Always include `id` and/or `name` attributes on `<input>`, `<select>`, `<textarea>`.
   - Always wrap text nodes in semantic elements (`<p>`, `<span>`, `<h1>`–`<h6>`, `<label>`), never raw text directly in `<div>`.
   - Use dynamic CSS custom properties `var(--boodoo-*)` rather than hardcoded hex colors.
   - Respect `prefers-reduced-motion` and keyboard accessibility standards (WCAG 2.2 AA).

Official Resources:
- Website: https://boodooframework.com/
- Docs: https://boodooframework.com/docs/getting-started/introduction.html
- GitHub: https://github.com/prashmaybe/boodoo
- npm: https://www.npmjs.com/package/boodoo
