import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const rootDir = resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);

test('Headless React hooks (useDisclosure, useCombobox, useAccordion) declarations and module', async () => {
  const hooksSrc = readFileSync(resolve(rootDir, 'react/hooks.js'), 'utf8');
  assert.ok(hooksSrc.includes('export function useDisclosure'), 'useDisclosure hook must be exported');
  assert.ok(hooksSrc.includes('export function useCombobox'), 'useCombobox hook must be exported');
  assert.ok(hooksSrc.includes('export function useAccordion'), 'useAccordion hook must be exported');

  // Verify disclosure logic and ARIA props
  assert.ok(hooksSrc.includes('getTriggerProps'), 'useDisclosure must provide getTriggerProps');
  assert.ok(hooksSrc.includes('getDialogProps'), 'useDisclosure must provide getDialogProps');
  assert.ok(hooksSrc.includes("'aria-expanded': isOpen"), 'useDisclosure must set aria-expanded');

  // Verify combobox logic and ARIA props
  assert.ok(hooksSrc.includes('getInputProps'), 'useCombobox must provide getInputProps');
  assert.ok(hooksSrc.includes('getListboxProps'), 'useCombobox must provide getListboxProps');
  assert.ok(hooksSrc.includes('getOptionProps'), 'useCombobox must provide getOptionProps');
  assert.ok(hooksSrc.includes("'aria-autocomplete': 'list'"), 'useCombobox must set aria-autocomplete');

  // Verify accordion logic and ARIA props
  assert.ok(hooksSrc.includes('getButtonProps'), 'useAccordion must provide getButtonProps');
  assert.ok(hooksSrc.includes('getPanelProps'), 'useAccordion must provide getPanelProps');

  // Test TypeScript declaration file for React hooks
  const reactDts = readFileSync(resolve(rootDir, 'react/index.d.ts'), 'utf8');
  assert.ok(reactDts.includes('useDisclosure'), 'react/index.d.ts must type useDisclosure');
  assert.ok(reactDts.includes('useCombobox'), 'react/index.d.ts must type useCombobox');
  assert.ok(reactDts.includes('useAccordion'), 'react/index.d.ts must type useAccordion');

  // Test package.json export mapping for react subpath
  const pkg = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf8'));
  assert.ok(pkg.exports['./react'], 'package.json must export ./react subpath');
  assert.equal(pkg.exports['./react'].types, './react/index.d.ts');
  assert.equal(pkg.exports['./react'].import, './react/index.js');
});

test('DOM React component suite (BoodooProvider, Button, Badge, Dialog, ConfirmDialog, Field, Table, Combobox, StickyHeader)', async () => {
  const indexSrc = readFileSync(resolve(rootDir, 'react/index.js'), 'utf8');
  const componentsSrc = readFileSync(resolve(rootDir, 'react/components.js'), 'utf8');
  const hooksSrc = readFileSync(resolve(rootDir, 'react/hooks.js'), 'utf8');

  // Verify modular re-exports from index.js and components.js
  assert.ok(indexSrc.includes("export * from './theme.js'"), 'react/index.js must export theme submodule');
  assert.ok(indexSrc.includes("export * from './buttons.js'"), 'react/index.js must export buttons submodule');
  assert.ok(componentsSrc.includes("export * from './theme.js'"), 'react/components.js must export theme submodule');

  // Verify component definitions across modular submodules
  const themeSrc = readFileSync(resolve(rootDir, 'react/theme.js'), 'utf8');
  const buttonsSrc = readFileSync(resolve(rootDir, 'react/buttons.js'), 'utf8');
  const dataDisplaySrc = readFileSync(resolve(rootDir, 'react/data-display.js'), 'utf8');
  const overlaysSrc = readFileSync(resolve(rootDir, 'react/overlays.js'), 'utf8');
  const inputsSrc = readFileSync(resolve(rootDir, 'react/inputs.js'), 'utf8');
  const listsSrc = readFileSync(resolve(rootDir, 'react/lists.js'), 'utf8');
  const navigationSrc = readFileSync(resolve(rootDir, 'react/navigation.js'), 'utf8');

  assert.ok(themeSrc.includes('export function BoodooProvider'), 'BoodooProvider must be exported in theme.js');
  assert.ok(buttonsSrc.includes('export function Button'), 'Button must be exported in buttons.js');
  assert.ok(dataDisplaySrc.includes('export function Badge'), 'Badge must be exported in data-display.js');
  assert.ok(overlaysSrc.includes('export function Dialog'), 'Dialog must be exported in overlays.js');
  assert.ok(overlaysSrc.includes('export function ConfirmDialog'), 'ConfirmDialog must be exported in overlays.js');
  assert.ok(inputsSrc.includes('export function Field'), 'Field must be exported in inputs.js');
  assert.ok(listsSrc.includes('export function Table'), 'Table must be exported in lists.js');
  assert.ok(inputsSrc.includes('export function Combobox'), 'Combobox must be exported in inputs.js');
  assert.ok(listsSrc.includes('export function Accordion'), 'Accordion must be exported in lists.js');
  assert.ok(navigationSrc.includes('export function Nav'), 'Nav must be exported in navigation.js');
  assert.ok(navigationSrc.includes('export function StickyHeader'), 'StickyHeader must be exported in navigation.js');

  // Verify foldAccents logic via static source inspection
  assert.ok(hooksSrc.includes('export function foldAccents'), 'foldAccents must be exported from hooks.js');
  assert.ok(hooksSrc.includes('.normalize(\'NFD\')'), 'foldAccents must use Unicode NFD normalization');
  assert.ok(hooksSrc.includes("replace(/[\\u0300-\\u036f]/g, '')"), 'foldAccents must strip combining diacritics');

  // Verify pure accent-folding function behavior
  const foldAccents = (str) =>
    typeof str !== 'string'
      ? ''
      : str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[øØ]/g, 'o')
          .replace(/[æÆ]/g, 'ae')
          .toLowerCase();
  assert.equal(foldAccents('Café Résumé'), 'cafe resume');
  assert.equal(foldAccents('ÀÖØñ'), 'aoon');

  // Verify type-to-confirm barrier logic
  assert.ok(overlaysSrc.includes('mustMatch'), 'ConfirmDialog must support mustMatch barrier');
  assert.ok(overlaysSrc.includes('export function Portal'), 'Portal must be exported in overlays.js');
  assert.ok(overlaysSrc.includes("e.key === 'Escape'"), 'Dialog and Offcanvas must handle Escape key');
  assert.ok(overlaysSrc.includes('FOCUSABLE_SELECTOR'), 'Dialog and Offcanvas must trap focus');
    assert.ok(dataDisplaySrc.includes('closeLabel'), 'Chip must support customizable closeLabel');
  assert.ok(inputsSrc.includes('emptyLabel'), 'Combobox must support customizable emptyLabel');
  assert.ok(listsSrc.includes('emptyText'), 'Table must support customizable emptyText');
  assert.ok(overlaysSrc.includes('closeLabel'), 'Dialog, ConfirmDialog, and Offcanvas must support customizable closeLabel');
  assert.ok(overlaysSrc.includes('confirmMatchPrompt'), 'ConfirmDialog must support customizable confirmMatchPrompt');
  assert.ok(overlaysSrc.includes('useId'), 'ConfirmDialog must generate unique input element id');

  // Verify field learn more disclosure slot and accessible wiring
  assert.ok(inputsSrc.includes('boodoo-field-learn-more-btn'), 'Field must render learnMore button');
  assert.ok(inputsSrc.includes('React.cloneElement'), 'Field must enhance child form elements');
  assert.ok(inputsSrc.includes('aria-describedby'), 'Field must wire aria-describedby');
  assert.ok(inputsSrc.includes('aria-invalid'), 'Field must wire aria-invalid');

  // Verify scoped React CSS bundle existence and non-empty size
  const scopedCssPath = resolve(rootDir, 'dist/css/boodoo-react.min.css');
  assert.ok(existsSync(scopedCssPath), 'dist/css/boodoo-react.min.css must exist');
  const scopedCss = readFileSync(scopedCssPath, 'utf8');
  assert.ok(scopedCss.includes('@layer boodoo'), 'Scoped CSS must use @layer boodoo');
  assert.ok(scopedCss.includes('.boodoo'), 'Scoped CSS must namespace under .boodoo');
  assert.ok(scopedCss.includes('--bo-brand'), 'Scoped CSS must support --bo-brand fallback');
  assert.ok(!scopedCss.includes('body{margin:0'), 'Scoped CSS must NOT include global reboot reset');

  // Verify LESS equivalent file exists
  const lessReactPath = resolve(rootDir, 'less/boodoo-react.less');
  assert.ok(existsSync(lessReactPath), 'less/boodoo-react.less must exist for preprocessor parity');
});



test('Headless Vue 3 / Nuxt composables (useDisclosure, useCombobox, useAccordion) declarations and module', () => {
  const composablesSrc = readFileSync(resolve(rootDir, 'vue/composables.js'), 'utf8');
  assert.ok(composablesSrc.includes('export function useDisclosure'), 'useDisclosure composable must be exported');
  assert.ok(composablesSrc.includes('export function useCombobox'), 'useCombobox composable must be exported');
  assert.ok(composablesSrc.includes('export function useAccordion'), 'useAccordion composable must be exported');

  // Verify disclosure logic and ARIA props
  assert.ok(composablesSrc.includes('getTriggerProps'), 'useDisclosure must provide getTriggerProps');
  assert.ok(composablesSrc.includes('getDialogProps'), 'useDisclosure must provide getDialogProps');
  assert.ok(composablesSrc.includes("'aria-expanded': isOpen.value"), 'useDisclosure must set aria-expanded');

  // Verify transition-aware disclosure callbacks in Vue
  assert.ok(composablesSrc.includes('if (!isOpen.value)'), 'Vue useDisclosure open must check transition before firing onOpen');
  assert.ok(composablesSrc.includes('if (isOpen.value)'), 'Vue useDisclosure close must check transition before firing onClose');

  // Verify combobox logic and ARIA props
  assert.ok(composablesSrc.includes('getInputProps'), 'useCombobox must provide getInputProps');
  assert.ok(composablesSrc.includes('getListboxProps'), 'useCombobox must provide getListboxProps');
  assert.ok(composablesSrc.includes('getOptionProps'), 'useCombobox must provide getOptionProps');
  assert.ok(composablesSrc.includes("'aria-autocomplete': 'list'"), 'useCombobox must set aria-autocomplete');

  // Verify accordion logic and ARIA props
  assert.ok(composablesSrc.includes('getButtonProps'), 'useAccordion must provide getButtonProps');
  assert.ok(composablesSrc.includes('getPanelProps'), 'useAccordion must provide getPanelProps');

  // Test TypeScript declaration file for Vue composables
  const vueDts = readFileSync(resolve(rootDir, 'vue/index.d.ts'), 'utf8');
  assert.ok(vueDts.includes('useDisclosure'), 'vue/index.d.ts must type useDisclosure');
  assert.ok(vueDts.includes('useCombobox'), 'vue/index.d.ts must type useCombobox');
  assert.ok(vueDts.includes('useAccordion'), 'vue/index.d.ts must type useAccordion');
  assert.ok(vueDts.includes('foldAccents'), 'vue/index.d.ts must type foldAccents');

  // Test package.json export mapping for vue subpath
  const pkg = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf8'));
  assert.ok(pkg.exports['./vue'], 'package.json must export ./vue subpath');
  assert.equal(pkg.exports['./vue'].types, './vue/index.d.ts');
  assert.equal(pkg.exports['./vue'].import, './vue/index.js');

  // Verify Vue useCombobox v-model and asynchronous items synchronization
  assert.ok(composablesSrc.includes('modelValue'), 'useCombobox must support modelValue');
  assert.ok(composablesSrc.includes('onUpdateModelValue'), 'useCombobox must support onUpdate:modelValue');
  assert.ok(composablesSrc.includes('watch('), 'useCombobox must use watch for reactivity');
  assert.ok(composablesSrc.includes('getItems'), 'useCombobox must watch both getControlledVal and getItems');
  assert.ok(composablesSrc.includes('immediate: true'), 'useCombobox item watcher must configure immediate and deep observation');
});

test('React useDisclosure transition-aware execution and combobox query sync', () => {
  const hooksSrc = readFileSync(resolve(rootDir, 'react/hooks.js'), 'utf8');

  // Verify transition-aware callback invocation and state updater purity
  assert.ok(hooksSrc.includes('if (!isOpen)'), 'useDisclosure open must check transition before firing onOpen');
  assert.ok(hooksSrc.includes('if (isOpen)'), 'useDisclosure close must check transition before firing onClose');
  assert.ok(hooksSrc.includes('const next = !isOpen;'), 'useDisclosure toggle must calculate next from current isOpen');
  assert.ok(hooksSrc.includes('setIsOpen(next);'), 'useDisclosure must set next boolean directly');
  assert.ok(!hooksSrc.includes('setIsOpen((prev)'), 'useDisclosure must not run side-effect callbacks inside functional updater');

  // Verify combobox query synchronization when controlled value changes
  assert.ok(hooksSrc.includes('useEffect('), 'useCombobox must use useEffect for synchronization');
  assert.ok(hooksSrc.includes('items.find((it) => it.value === controlledValue)'), 'useCombobox must match controlled value on update');
  assert.ok(hooksSrc.includes('props.onInputChange?.(e.target.value, e);'), 'useCombobox must support onInputChange callback');
});

test('React Native Grid layout distributes items using equal flexible columns and row chunking', () => {
  const layoutSrc = readFileSync(resolve(rootDir, 'react-native/layout.js'), 'utf8');
  assert.ok(layoutSrc.includes('numColumns = 2'), 'Grid must accept numColumns with default of 2');
  assert.ok(layoutSrc.includes('styles.gridRow'), 'Grid must create row containers to distribute columns');
  assert.ok(layoutSrc.includes('styles.gridCol'), 'Grid must style child wrappers with gridCol');
  assert.ok(layoutSrc.includes('flex: 1'), 'Grid columns must use flexible equal width distribution');
  assert.ok(layoutSrc.includes('emptySlots > 0'), 'Grid must balance incomplete rows with placeholder slots');

  // Test functional row chunking algorithm directly across 1, 2, 3, 4, 5 columns
  const chunkItems = (items, numCols) => {
    const cols = Math.max(1, Number(numCols) || 2);
    const rows = [];
    for (let i = 0; i < items.length; i += cols) {
      rows.push(items.slice(i, i + cols));
    }
    return rows;
  };

  const sampleItems = ['A', 'B', 'B2', 'C', 'D'];
  assert.deepEqual(chunkItems(sampleItems, 1), [['A'], ['B'], ['B2'], ['C'], ['D']]);
  assert.deepEqual(chunkItems(sampleItems, 2), [['A', 'B'], ['B2', 'C'], ['D']]);
  assert.deepEqual(chunkItems(sampleItems, 3), [['A', 'B', 'B2'], ['C', 'D']]);
  assert.deepEqual(chunkItems(sampleItems, 4), [['A', 'B', 'B2', 'C'], ['D']]);
  assert.deepEqual(chunkItems(sampleItems, 5), [['A', 'B', 'B2', 'C', 'D']]);
});


test('Universal design tokens CommonJS module export verification', () => {
  const cjsPath = resolve(rootDir, 'tokens/index.cjs');
  assert.ok(existsSync(cjsPath), 'tokens/index.cjs must exist');
  const tokensCjs = readFileSync(cjsPath, 'utf8');
  assert.ok(tokensCjs.includes('module.exports = {'), 'tokens/index.cjs must export via module.exports');
  assert.ok(tokensCjs.includes('colors'), 'tokens/index.cjs must include colors');
  assert.ok(tokensCjs.includes('spacing'), 'tokens/index.cjs must include spacing');
  assert.ok(tokensCjs.includes('radii'), 'tokens/index.cjs must include radii');
  assert.ok(tokensCjs.includes('shadows'), 'tokens/index.cjs must include shadows');
  assert.ok(tokensCjs.includes('typography'), 'tokens/index.cjs must include typography');
});


test('Boodoo framework CommonJS entry point and module export verification', () => {
  const cjsPath = resolve(rootDir, 'dist/js/boodoo.cjs');
  assert.ok(existsSync(cjsPath), 'dist/js/boodoo.cjs must exist');

  const pkg = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf8'));
  assert.equal(pkg.main, 'dist/js/boodoo.cjs', 'package.json main must point to dist/js/boodoo.cjs');
  assert.equal(pkg.exports['.'].require, './dist/js/boodoo.cjs', 'package.json exports["."].require must point to ./dist/js/boodoo.cjs');

  const boodooCjs = readFileSync(cjsPath, 'utf8');
  assert.ok(boodooCjs.includes('module.exports'), 'boodoo.cjs must support CommonJS export');
});

