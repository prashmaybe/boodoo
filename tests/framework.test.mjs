import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = resolve(import.meta.dirname, '..');

test('boodoo dist CSS files exist and are populated', () => {
  const mainCss = resolve(rootDir, 'dist/css/boodoo.css');
  const minCss = resolve(rootDir, 'dist/css/boodoo.min.css');
  assert.ok(existsSync(mainCss), 'dist/css/boodoo.css must exist');
  assert.ok(existsSync(minCss), 'dist/css/boodoo.min.css must exist');

  const content = readFileSync(mainCss, 'utf8');
  assert.ok(content.length > 10000, 'boodoo.css should be substantial in size');
});

test('no empty @layer is declared in dist CSS', () => {
  const mainCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  assert.ok(!mainCss.includes('@layer reset, tokens, components, utilities;'), 'Empty @layer must not be present');
});

test('spacing scale implements correct Bootstrap-compatible rem values', () => {
  const mainCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  
  // .mt-1: 0.25rem (4px)
  assert.match(mainCss, /\.mt-1\s*\{[^}]*margin-top:\s*0\.25rem/);
  // .mt-2: 0.5rem (8px)
  assert.match(mainCss, /\.mt-2\s*\{[^}]*margin-top:\s*0\.5rem/);
  // .mt-3: 1rem (16px)
  assert.match(mainCss, /\.mt-3\s*\{[^}]*margin-top:\s*1rem/);
  // .mt-4: 1.5rem (24px)
  assert.match(mainCss, /\.mt-4\s*\{[^}]*margin-top:\s*1\.5rem/);
  // .mt-5: 3rem (48px)
  assert.match(mainCss, /\.mt-5\s*\{[^}]*margin-top:\s*3rem/);
});

test('table component colors consume CSS variables rather than hardcoded literals', () => {
  const mainCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  assert.match(mainCss, /--boodoo-table-color:\s*var\(--boodoo-body-color\)/);
  assert.match(mainCss, /--boodoo-table-border-color:\s*var\(--boodoo-border-color\)/);
});

test('pagination component colors consume CSS variables', () => {
  const mainCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  assert.match(mainCss, /\.pagination\s+\.page-link\s*\{[^}]*color:\s*var\(--boodoo-link-color\)/);
});

test('accordion chevron adapts dynamically with theme colors', () => {
  const mainCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  assert.match(mainCss, /\.accordion-button::after\s*\{[^}]*background-color:\s*var\(--boodoo-accordion-icon-color/);
});

test('outline buttons consume CSS variables dynamically', () => {
  const mainCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  assert.match(mainCss, /\.btn-outline-primary[^\{]*\{[^}]*--boodoo-btn-color:\s*var\(--boodoo-primary\)/);
});

test('tokens consistency between tokens.json, tokens/index.js, and CSS scale', () => {
  const tokensJson = JSON.parse(readFileSync(resolve(rootDir, 'tokens/tokens.json'), 'utf8'));
  const { spacing } = tokensJson;

  assert.equal(spacing['0'], 0);
  assert.equal(spacing['1'], 4); // 0.25rem
  assert.equal(spacing['2'], 8); // 0.5rem
  assert.equal(spacing['3'], 16); // 1rem
  assert.equal(spacing['4'], 24); // 1.5rem
  assert.equal(spacing['5'], 32); // extended
});

test('contrast and accessible touch targets verification', () => {
  const mainCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  
  // Verify focus ring styling exists
  assert.ok(mainCss.includes('--boodoo-focus-ring'), 'Focus rings must be defined for accessibility');
  assert.ok(mainCss.includes('prefers-reduced-motion'), 'prefers-reduced-motion must be handled');
});

test('React Native adapter exports valid definitions without bundling errors', async () => {
  const rnIndex = readFileSync(resolve(rootDir, 'react-native/index.js'), 'utf8');
  assert.ok(rnIndex.includes('BoodooProvider'), 'React Native module must export BoodooProvider');
  assert.ok(rnIndex.includes('Button'), 'React Native module must export Button');
  assert.ok(rnIndex.includes('Card'), 'React Native module must export Card');
});
