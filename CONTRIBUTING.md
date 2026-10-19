# Contributing to Boodoo

Thank you for your interest in contributing to Boodoo! Boodoo is a dependable, cross-platform design system built for web, native mobile, and desktop environments.

To ensure consistency, accessibility, and high production quality across all platforms, all contributions follow the guidelines outlined below.

---

## 1. Protected Main Branch & PR Workflow

- **No Direct Commits to `main`:** The `main` branch is strictly protected. Direct pushes are disabled.
- **Branch Naming Conventions:**
  - `feat/<feature-name>` for new components, tokens, or functionality.
  - `fix/<bug-name>` for bug fixes and accessibility patches.
  - `docs/<topic>` for documentation improvements.
  - `chore/<task>` for build tool, dependency, or CI updates.
- **Pull Request Lifecycle:**
  1. Open a PR against `main`.
  2. Ensure the automated CI workflow passes (linting, build, smoke tests, unit tests, and site generation).
  3. All PRs require review and approval before merging.

---

## 2. Development Setup

```bash
# Clone the repository
git clone https://github.com/prashmaybe/boodoo.git
cd boodoo

# Install dependencies
npm install

# Compile all distributions (CSS, SCSS, LESS, JS, CJS, ESM, and Types)
npm run build

# Run unit and integration tests
npm test

# Run documentation generator locally
npm run site
```

---

## 3. Preprocessor Parity Rule (SCSS & LESS)

Every styling change, component, utility, token, and dark mode rule added to Sass (`scss/`) must have an exact functional equivalent implemented in Less (`less/boodoo.less`).

- Validate Less compilation:
  ```bash
  npm run css:less
  ```
- Automated parity assertions run as part of `npm test`.

---

## 4. Production Component Quality Checklist (14-Point Standard)

Every component submitted or modified must satisfy all 14 acceptance criteria before it is labeled production-ready:

### API & Behavior
- [ ] **1. Documented Props & Events:** Clear public API documentation with variants, defaults, and custom event dispatches (`boodoo:change`, `boodoo:open`, etc.).
- [ ] **2. Controlled & Uncontrolled Modes:** Accommodates both programmatic manipulation and self-contained declarative state.
- [ ] **3. State Coverage:** Implements loading, empty, disabled, error, active, and boundary states.

### Accessibility (Target: WCAG 2.2 AA)
- [ ] **4. Semantic Elements & Form Identifiers:** Semantic tags (`<button>`, `<dialog>`, `<nav>`, `<input>`) with mandatory `id` and/or `name` attributes for form controls. Text nodes must be wrapped in semantic text elements, never raw containers.
- [ ] **5. Keyboard Navigation & Visible Focus:** Full keyboard reachability (Tab, Enter, Space, Arrows, Escape) with high-contrast visible focus rings.
- [ ] **6. ARIA Roles, States, & Announcements:** Appropriate `aria-*` attributes (`aria-expanded`, `aria-selected`, `aria-valuenow`, `role="region"`) and live region announcements where content updates dynamically.
- [ ] **7. Reduced Motion & Contrast:** Respects `prefers-reduced-motion` with instantaneous or non-disorienting transitions; passes WCAG AA 4.5:1 contrast ratios across both light and dark themes.

### Engineering & Safety
- [ ] **8. Unit & Interaction Tests:** 100% automated test coverage in `tests/framework.test.mjs` verifying DOM creation, event handlers, and edge cases.
- [ ] **9. Dual TypeScript Declarations:** Type definitions updated in `js/boodoo.d.ts` and emitted to `dist/js/boodoo.d.ts`.
- [ ] **10. Safe DOM Construction (No XSS):** Elements constructed via safe DOM methods (`document.createElement()`, `element.textContent`, `element.setAttribute()`). Raw strings are never interpolated into `innerHTML`.
- [ ] **11. Lifecycle Teardown & Resource Revocation:** Implement clean `dispose()` methods removing window/document listeners, timers, and revoking object URLs (`URL.revokeObjectURL()`).
- [ ] **12. Zero Leaked Globals:** No global CSS variable contamination or accidental mutation of undeclared root properties.

### Multi-Platform & Release
- [ ] **13. Cross-Browser & Mobile Verification:** Verified in Chromium, Firefox, WebKit, and mobile viewports. React Native implementations must use pure native primitives (`View`, `Text`, `Pressable`, `StyleSheet`) with zero DOM access.
- [ ] **14. Documentation & Migration Notes:** Interactive playground examples, copy-paste snippets, and version change notes in `CHANGELOG.md`.

---

## 5. Security & Reporting

Please report security vulnerabilities confidentially according to our [SECURITY.md](SECURITY.md). Do not submit security vulnerabilities via public issues or PRs.
