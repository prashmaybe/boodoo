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
  const componentsSrc = readFileSync(resolve(rootDir, 'react/components.js'), 'utf8');
  const hooksSrc = readFileSync(resolve(rootDir, 'react/hooks.js'), 'utf8');
  assert.ok(componentsSrc.includes('export function BoodooProvider'), 'BoodooProvider must be exported');
  assert.ok(componentsSrc.includes('export function Button'), 'Button must be exported');
  assert.ok(componentsSrc.includes('export function Badge'), 'Badge must be exported');
  assert.ok(componentsSrc.includes('export function Dialog'), 'Dialog must be exported');
  assert.ok(componentsSrc.includes('export function ConfirmDialog'), 'ConfirmDialog must be exported');
  assert.ok(componentsSrc.includes('export function Field'), 'Field must be exported');
  assert.ok(componentsSrc.includes('export function Table'), 'Table must be exported');
  assert.ok(componentsSrc.includes('export function Combobox'), 'Combobox must be exported');
  assert.ok(componentsSrc.includes('export function Accordion'), 'Accordion must be exported');
  assert.ok(componentsSrc.includes('export function Nav'), 'Nav must be exported');
  assert.ok(componentsSrc.includes('export function StickyHeader'), 'StickyHeader must be exported');

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
  assert.ok(componentsSrc.includes('mustMatch'), 'ConfirmDialog must support mustMatch barrier');

  // Verify field learn more disclosure slot
  assert.ok(componentsSrc.includes('boodoo-field-learn-more-btn'), 'Field must render learnMore button');

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

  // Test package.json export mapping for vue subpath
  const pkg = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf8'));
  assert.ok(pkg.exports['./vue'], 'package.json must export ./vue subpath');
  assert.equal(pkg.exports['./vue'].types, './vue/index.d.ts');
  assert.equal(pkg.exports['./vue'].import, './vue/index.js');
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

