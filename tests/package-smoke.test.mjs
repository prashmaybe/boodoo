import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');
const require = createRequire(import.meta.url);

test('Package Artifact Smoke: package.json exports mapping and built assets', async (t) => {
  const pkgJsonPath = resolve(root, 'package.json');
  assert.ok(existsSync(pkgJsonPath), 'package.json must exist');
  const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));

  await t.test('1. Main entry points exist on disk and are non-empty', () => {
    const requiredFiles = [
      pkg.main,
      pkg.module,
      pkg.types,
      pkg.typings,
      pkg.style,
      pkg.sass
    ];

    for (const f of requiredFiles) {
      const fullPath = resolve(root, f);
      assert.ok(existsSync(fullPath), `Target entry point ${f} must exist on disk`);
      const stat = readFileSync(fullPath, 'utf8');
      assert.ok(stat.length > 50, `File ${f} must not be empty or a stub (size: ${stat.length} bytes)`);
    }
  });

  await t.test('2. CommonJS bundle resolves cleanly and exposes expected core classes', () => {
    const cjsPath = resolve(root, pkg.main);
    const boodooCjs = require(cjsPath);
    assert.ok(boodooCjs, 'CommonJS bundle must require without error');

    // Verify key classes and functional plugins exist
    const expectedSymbols = [
      'Modal', 'Toast', 'Offcanvas', 'Tab', 'Collapse',
      'FilterBar', 'TransferList', 'ColorPicker', 'BackToTop',
      'Alert', 'Button', 'Dropdown', 'CommandPalette', 'DataTable', 'Chart',
      'a11y', 'FloatingBar', 'ImageCompare', 'PasswordMeter'
    ];

    for (const sym of expectedSymbols) {
      assert.ok(boodooCjs[sym] !== undefined, `CommonJS export ${sym} must exist`);
    }
  });

  await t.test('3. ESM bundle resolves cleanly via dynamic import and exports components', async () => {
    const esmPath = resolve(root, pkg.module);
    const boodooEsm = await import(`file://${esmPath}`);
    assert.ok(boodooEsm, 'ESM bundle must import without error');
    assert.ok(typeof boodooEsm.Modal === 'function', 'ESM export Modal must be a constructor');
    assert.ok(typeof boodooEsm.Chart === 'function', 'ESM export Chart must be a constructor');
    assert.ok(typeof boodooEsm.FilterBar === 'function', 'ESM export FilterBar must be a constructor');
    assert.ok(typeof boodooEsm.TransferList === 'function', 'ESM export TransferList must be a constructor');
    assert.ok(typeof boodooEsm.ColorPicker === 'function', 'ESM export ColorPicker must be a constructor');
    assert.ok(typeof boodooEsm.BackToTop === 'function', 'ESM export BackToTop must be a constructor');
    assert.ok(typeof boodooEsm.a11y === 'object', 'ESM export a11y must be an object');
    assert.ok(typeof boodooEsm.FloatingBar === 'function', 'ESM export FloatingBar must be a constructor');
    assert.ok(typeof boodooEsm.ImageCompare === 'function', 'ESM export ImageCompare must be a constructor');
    assert.ok(typeof boodooEsm.PasswordMeter === 'function', 'ESM export PasswordMeter must be a constructor');
  });

  await t.test('4. Design Tokens exports resolve across CJS, ESM, and JSON', async () => {
    const tokensCjsPath = resolve(root, 'tokens/index.cjs');
    const tokensEsmPath = resolve(root, 'tokens/index.js');
    const tokensJsonPath = resolve(root, 'tokens/tokens.json');

    assert.ok(existsSync(tokensCjsPath), 'tokens/index.cjs must exist');
    assert.ok(existsSync(tokensEsmPath), 'tokens/index.js must exist');
    assert.ok(existsSync(tokensJsonPath), 'tokens/tokens.json must exist');

    const tokensCjs = require(tokensCjsPath);
    assert.ok(tokensCjs.colors && tokensCjs.colors.primary, 'CommonJS tokens must contain colors.primary');
    assert.ok(tokensCjs.spacing && tokensCjs.spacing[1] !== undefined, 'CommonJS tokens must contain spacing');

    const tokensEsm = await import(`file://${tokensEsmPath}`);
    assert.ok(tokensEsm.colors && tokensEsm.colors.primary, 'ESM tokens must contain colors.primary');
    assert.ok(tokensEsm.spacing && tokensEsm.spacing[1] !== undefined, 'ESM tokens must contain spacing');

    const tokensJson = JSON.parse(readFileSync(tokensJsonPath, 'utf8'));
    assert.ok(tokensJson.colors && tokensJson.colors.primary, 'tokens.json must contain colors.primary');
  });

  await t.test('5. React and Vue subpath exports exist with TypeScript declarations', () => {
    const subpaths = [
      { name: 'react', js: 'react/index.js', dts: 'react/index.d.ts' },
      { name: 'vue', js: 'vue/index.js', dts: 'vue/index.d.ts' },
      { name: 'react-native', js: 'react-native/index.js', dts: 'react-native/index.d.ts' }
    ];

    for (const sub of subpaths) {
      const jsPath = resolve(root, sub.js);
      const dtsPath = resolve(root, sub.dts);
      assert.ok(existsSync(jsPath), `Subpath ${sub.name} entry ${sub.js} must exist`);
      assert.ok(existsSync(dtsPath), `Subpath ${sub.name} types ${sub.dts} must exist`);
    }
  });

  await t.test('6. TypeScript declaration bundle dist/js/boodoo.d.ts defines newly added components', () => {
    const dtsPath = resolve(root, 'dist/js/boodoo.d.ts');
    assert.ok(existsSync(dtsPath), 'dist/js/boodoo.d.ts must exist');
    const dtsContent = readFileSync(dtsPath, 'utf8');

    const newComponents = [
      'FilterBar', 'TransferList', 'ColorPicker', 'BackToTop', 'Chart',
      'a11y', 'FloatingBar', 'ImageCompare', 'PasswordMeter'
    ];

    for (const c of newComponents) {
      assert.ok(dtsContent.includes(c), `TypeScript definitions must declare ${c}`);
    }
  });

  await t.test('7. Modular CSS and Preprocessor subpath exports exist on disk and resolve', () => {
    const subpaths = [
      './css', './css/grid', './css/utilities', './css/reboot', './css/animations',
      './scss', './scss/*', './less', './less/*'
    ];
    for (const sub of subpaths) {
      assert.ok(pkg.exports[sub], `package.json exports must define ${sub}`);
    }
  });

  await t.test('8. Package hygiene: No stray artifacts in dist/css and tests/ excluded from files', () => {
    assert.equal(existsSync(resolve(root, 'dist/css/test_out.css')), false, 'test_out.css must NOT exist in dist/css');
    assert.equal(existsSync(resolve(root, 'test-out.css.map')), false, 'test-out.css.map must NOT exist in root');
    assert.equal(pkg.files.includes('tests/'), false, 'tests/ must NOT be included in package.json files array');
  });

  await t.test('9. Dynamic CSS custom property theming on alerts', () => {
    const boodooCss = readFileSync(resolve(root, 'dist/css/boodoo.css'), 'utf8');
    assert.ok(boodooCss.includes('--boodoo-alert-color: var(--boodoo-primary-text-emphasis,'), 'Alert colors must consume CSS custom properties with fallbacks');
    assert.ok(boodooCss.includes('--boodoo-alert-bg: var(--boodoo-primary-bg-subtle,'), 'Alert bg must consume CSS custom properties with fallbacks');
    assert.ok(boodooCss.includes('--boodoo-alert-border: var(--boodoo-primary-border-subtle,'), 'Alert border must consume CSS custom properties with fallbacks');
  });

  await t.test('10. Clean entry-point subpath imports: Tokens and peer-wrapper modules', async () => {
    const tokenModule = await import(pathToFileURL(resolve(root, 'tokens/index.js')).href);
    assert.ok(tokenModule.boodooTokens || tokenModule.default, 'Tokens module must export boodooTokens');
    assert.ok(tokenModule.colors, 'Tokens must define color palette');

    const wrapperChecks = [
      { sub: './react', file: 'react/index.js', expected: ['useDisclosure', 'useCombobox'] },
      { sub: './vue', file: 'vue/index.js', expected: ['useDisclosure', 'useCombobox'] },
      { sub: './react-native', file: 'react-native/index.js', expected: ['BoodooProvider', 'Button'] },
    ];

    for (const { sub, file, expected } of wrapperChecks) {
      assert.ok(pkg.exports[sub], `package.json exports must define ${sub}`);
      const filePath = resolve(root, file);
      assert.ok(existsSync(filePath), `Wrapper file ${file} must exist`);
      const content = readFileSync(filePath, 'utf8');
      for (const exp of expected) {
        assert.ok(content.includes(exp), `${file} must export ${exp}`);
      }
    }
  });

  await t.test('11. Full public API parity assertion across source entry, ESM bundle, CJS bundle, and TypeScript definitions', async () => {
    const entrySrc = readFileSync(resolve(root, 'js/boodoo.js'), 'utf8');
    const exportBlockMatch = entrySrc.match(/export\s*\{([^}]+)\};/);
    assert.ok(exportBlockMatch, 'js/boodoo.js must have an export { ... } block');
    const entryNamedExports = exportBlockMatch[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    assert.ok(entryNamedExports.length >= 45, `Expected >= 45 named exports in js/boodoo.js, got ${entryNamedExports.length}`);

    // Drifted symbols specifically highlighted in review
    const criticalSymbols = ['a11y', 'FloatingBar', 'ImageCompare', 'PasswordMeter', 'initDataApi', 'initRipple', 'registerCustomElements'];
    for (const sym of criticalSymbols) {
      assert.ok(entryNamedExports.includes(sym), `js/boodoo.js must export critical symbol ${sym}`);
    }

    // Verify ESM bundle exports
    const esmPath = resolve(root, pkg.module);
    const boodooEsm = await import(`file://${esmPath}?t=${Date.now()}`);
    for (const sym of entryNamedExports) {
      assert.ok(boodooEsm[sym] !== undefined, `dist/js/boodoo.esm.js must export ${sym}`);
    }
    assert.ok(boodooEsm.default !== undefined, 'dist/js/boodoo.esm.js must have default export');

    // Verify CommonJS bundle exports
    const cjsPath = resolve(root, pkg.main);
    const boodooCjs = require(cjsPath);
    for (const sym of entryNamedExports) {
      assert.ok(boodooCjs[sym] !== undefined, `dist/js/boodoo.cjs must export ${sym}`);
    }

    // Verify TypeScript declaration dist/js/boodoo.d.ts exports
    const dtsSrc = readFileSync(resolve(root, 'dist/js/boodoo.d.ts'), 'utf8');
    const dtsExportMatch = dtsSrc.match(/export\s*\{([^}]+)\};/);
    assert.ok(dtsExportMatch, 'dist/js/boodoo.d.ts must have an export { ... } block');
    const dtsNamedExports = dtsExportMatch[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    for (const sym of entryNamedExports) {
      assert.ok(dtsNamedExports.includes(sym), `dist/js/boodoo.d.ts must export ${sym}`);
    }

    assert.equal(dtsNamedExports.length, entryNamedExports.length, 'TypeScript definitions must export exact same number of named symbols as js/boodoo.js');
  });
});
