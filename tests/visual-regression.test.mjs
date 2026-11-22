import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

test('Visual and Layout Structure Integrity Assertions', async (t) => {
  await t.test('1. Layout files contain required viewport meta, theme tokens, and semantic wrappers', () => {
    const layout = fs.readFileSync(path.join(root, 'site', 'layout.html'), 'utf8');
    assert.ok(layout.includes('viewport'), 'Layout must have responsive viewport meta tag');
    assert.ok(layout.includes('data-boodoo-theme'), 'Layout must configure theme binding');
    assert.ok(layout.includes('docs-sidebar'), 'Layout must include sidebar container');
    assert.ok(layout.includes('boodoo.js'), 'Layout must include main framework JS');
  });

  await t.test('2. Compiled CSS distribution bundles contain verified media queries and grid structures', () => {
    const css = fs.readFileSync(path.join(root, 'dist', 'css', 'boodoo.css'), 'utf8');
    assert.ok(css.includes('@media (min-width: 576px)'), 'CSS must include sm breakpoint');
    assert.ok(css.includes('@media (min-width: 768px)'), 'CSS must include md breakpoint');
    assert.ok(css.includes('@media (min-width: 992px)'), 'CSS must include lg breakpoint');
    assert.ok(css.includes('--boodoo-primary'), 'CSS must contain dynamic primary theme property');
    assert.ok(css.includes('.container'), 'CSS must include container grid layout');
    assert.ok(css.includes('.row'), 'CSS must include row flex layout');
  });
});
