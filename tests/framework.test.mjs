// =====================================================================
// BOODOO FRAMEWORK TEST SUITE ORCHESTRATOR
// Imports modular test sub-suites across:
// - CSS & Design Tokens (compilation, dark mode, @layer, spacing, parity)
// - React Native (primitives, submodules, StyleSheet-only, density, Paper)
// - Web Components & Accessibility (WAI-ARIA, safe DOM, XSS, lifecycles)
// - Framework Adapters (React hooks, Vue composables, CommonJS entry points)
// - Developer CLI (boodoo add/migrate/list and create-boodoo scaffolder)
// - Website Documentation & Integrity (redirections, canonicals, Haticons)
// =====================================================================

import './css-tokens.test.mjs';
import './react-native.test.mjs';
import './components.test.mjs';
import './framework-adapters.test.mjs';
import './cli.test.mjs';
import './site-docs.test.mjs';
