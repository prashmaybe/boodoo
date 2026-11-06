## Description

Please include a summary of the change and which issue it addresses. Include relevant motivation and context.

Fixes #(issue)

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactor / Chore

## Scope

- [ ] Core CSS / SCSS
- [ ] Core LESS (`less/boodoo.less` parity maintained)
- [ ] Core Vanilla JS Components
- [ ] React Wrapper (`react/`)
- [ ] Vue Wrapper (`vue/`)
- [ ] React Native Mobile (`react-native/`)
- [ ] Design Tokens (`tokens/`)
- [ ] Documentation / Site

## 14-Point Production Quality Checklist

Please confirm your PR satisfies all applicable points from the [Contributing Guide](CONTRIBUTING.md#4-production-component-quality-checklist-14-point-standard):

- [ ] **1. API & Behavior:** Public API documented with variants, defaults, and custom event dispatches (`boodoo:*`).
- [ ] **2. Controlled & Uncontrolled:** Supports both controlled and uncontrolled states.
- [ ] **3. State Coverage:** Implements loading, empty, disabled, error, active, and boundary states.
- [ ] **4. Semantic Elements & Form Identifiers:** Semantic tags with mandatory `id` and/or `name` attributes on form controls. Text nodes wrapped in semantic elements.
- [ ] **5. Keyboard Navigation:** Fully reachable via keyboard with visible focus indicators.
- [ ] **6. ARIA Roles & States:** Proper `aria-*` attributes and live announcements.
- [ ] **7. Reduced Motion & Contrast:** Respects `prefers-reduced-motion` and passes WCAG 2.2 AA contrast.
- [ ] **8. Automated Tests:** 100% test pass in `npm test` (`tests/framework.test.mjs`, `tests/package-smoke.test.mjs`).
- [ ] **9. Dual TypeScript Types:** TypeScript declarations updated (`js/boodoo.d.ts`, `react/index.d.ts`, etc.).
- [ ] **10. Safe DOM Construction:** No unescaped `innerHTML` or raw string interpolations.
- [ ] **11. Teardown Lifecycle:** Clean `dispose()` unbinding document/window listeners and revoking object URLs.
- [ ] **12. Zero Leaked Globals:** No global CSS variable contamination or memory leaks.
- [ ] **13. Multi-Platform Standards:** React Native components use `StyleSheet.create()` only (zero inline styles) and core primitives only.
- [ ] **14. Documentation & Changelog:** Documentation fragments or examples updated; notable changes recorded.

