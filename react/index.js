// =====================================================================
// BOODOO — Headless React Hooks & Modular DOM Components Entry Point
// =====================================================================

// Headless hooks
export { useDisclosure, useCombobox, useAccordion, foldAccents } from './hooks.js';

// Modular Submodules
export * from './theme.js';
export * from './typography.js';
export * from './layout.js';
export * from './buttons.js';
export * from './surfaces.js';
export * from './inputs.js';
export * from './data-display.js';
export * from './feedback.js';
export * from './lists.js';
export * from './navigation.js';
export * from './overlays.js';

// Re-export core components directly for explicit barrel discoverability
export { Button } from './buttons.js';
export { Dialog } from './overlays.js';
export { Input } from './inputs.js';
export { Card } from './surfaces.js';
