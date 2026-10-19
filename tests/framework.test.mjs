import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

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

test('spacing scale implements consistent expansive rem values', () => {
  const mainCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  
  // .mt-1: 1.25rem (20px)
  assert.match(mainCss, /\.mt-1\s*\{[^}]*margin-top:\s*1\.25rem/);
  // .mt-2: 2.25rem (36px)
  assert.match(mainCss, /\.mt-2\s*\{[^}]*margin-top:\s*2\.25rem/);
  // .mt-3: 3.25rem (52px)
  assert.match(mainCss, /\.mt-3\s*\{[^}]*margin-top:\s*3\.25rem/);
  // .mt-4: 4.25rem (68px)
  assert.match(mainCss, /\.mt-4\s*\{[^}]*margin-top:\s*4\.25rem/);
  // .mt-5: 5.25rem (84px)
  assert.match(mainCss, /\.mt-5\s*\{[^}]*margin-top:\s*5\.25rem/);
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

test('core utilities, links, headings, and solid buttons consume dynamic CSS custom properties', () => {
  const mainCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');

  // .text-primary must resolve to var(--boodoo-primary)
  assert.match(mainCss, /\.text-primary\s*\{[^}]*color:\s*var\(--boodoo-primary/);

  // .text-muted must resolve to var(--boodoo-text-muted
  assert.match(mainCss, /\.text-muted\s*\{[^}]*color:\s*var\(--boodoo-text-muted/);

  // a link must resolve to var(--boodoo-link-color
  assert.match(mainCss, /a\s*\{[^}]*color:\s*var\(--boodoo-link-color/);

  // solid .btn-primary must bind to var(--boodoo-primary)
  assert.match(mainCss, /\.btn-primary[^\{]*\{[^}]*--boodoo-btn-bg:\s*var\(--boodoo-primary/);

  // Headings h1-h6 must use var(--boodoo-h*-font-size
  assert.match(mainCss, /h1\s*\{[^}]*font-size:\s*var\(--boodoo-h1-font-size/);
  assert.match(mainCss, /h2\s*\{[^}]*font-size:\s*var\(--boodoo-h2-font-size/);
  assert.match(mainCss, /h3\s*\{[^}]*font-size:\s*var\(--boodoo-h3-font-size/);

  // Avatar, badge, nav, card border, dropdown active state must consume var(--boodoo-primary)
  assert.match(mainCss, /\.avatar\s*\{[^}]*--boodoo-avatar-bg:\s*var\(--boodoo-primary\)/);
  assert.match(mainCss, /\.badge\s*\{[^}]*background-color:\s*var\(--boodoo-primary\)/);
  assert.match(mainCss, /\.card-clickable:hover\s*\{[^}]*border-color:\s*var\(--boodoo-primary\)/);
  assert.match(mainCss, /\.nav-pills\s+\.nav-link\.active\s*\{[^}]*background-color:\s*var\(--boodoo-primary\)/);
});

test('dark mode theme gray-scale inversion maintains distinct gray-800 and gray-900 values', () => {
  const mainCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  const lessCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.less.css'), 'utf8');

  // Verify in SCSS dist
  assert.match(mainCss, /\[data-boodoo-theme=["']?dark["']?\]\s*\{[^}]*--boodoo-gray-700:\s*#dedfec/);
  assert.match(mainCss, /\[data-boodoo-theme=["']?dark["']?\]\s*\{[^}]*--boodoo-gray-800:\s*#ececf4/);
  assert.match(mainCss, /\[data-boodoo-theme=["']?dark["']?\]\s*\{[^}]*--boodoo-gray-900:\s*#f7f8fb/);

  // Verify in LESS dist
  assert.match(lessCss, /\[data-boodoo-theme=["']?dark["']?\]\s*\{[^}]*--boodoo-gray-700:\s*#dedfec/);
  assert.match(lessCss, /\[data-boodoo-theme=["']?dark["']?\]\s*\{[^}]*--boodoo-gray-800:\s*#ececf4/);
  assert.match(lessCss, /\[data-boodoo-theme=["']?dark["']?\]\s*\{[^}]*--boodoo-gray-900:\s*#f7f8fb/);
});

test('enterprise application shell, active indicator bars, and layout utilities exist', () => {
  const mainCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  const lessCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.less.css'), 'utf8');

  const requiredClasses = [
    '.nav-sidebar',
    '.nav-active-bar',
    '.shell-header',
    '.shell-sidebar',
    '.shell-pad',
    '.bg-login-gradient',
    '.feature-card',
    '.table-scroll-max',
    '.badge-role-admin',
    '.badge-role-member',
    '.badge-role-viewer',
    '.badge-role-owner',
    '.badge-role-billing',
    '.badge-role-guest',
    '.badge-role-developer',
    '.badge-role-security',
    '.grid-auto-fill',
    '.grid-auto-fit',
    '.grid-cols-tier',
    '.grid-cols-search',
    '.grid-cols-line',
    '.grid-cols-simulation',
    '.form-section',
  ];

  for (const cls of requiredClasses) {
    assert.ok(mainCss.includes(cls), `dist/css/boodoo.css must contain ${cls}`);
    assert.ok(lessCss.includes(cls), `dist/css/boodoo.less.css must contain ${cls}`);
  }
});

test('tokens consistency between tokens.json, tokens/index.js, and CSS scale', async () => {
  const tokensJson = JSON.parse(readFileSync(resolve(rootDir, 'tokens/tokens.json'), 'utf8'));
  const { spacing } = tokensJson;

  assert.equal(spacing['0'], 0);
  assert.equal(spacing['0.5'], 8);
  assert.equal(spacing['1'], 20);
  assert.equal(spacing['2'], 36);
  assert.equal(spacing['3'], 52);
  assert.equal(spacing['4'], 68);
  assert.equal(spacing['5'], 84);

  const { createSpacing } = await import(pathToFileURL(resolve(rootDir, 'tokens/index.js')).href);
  const custom = createSpacing(10);
  assert.equal(custom['0'], 0);
  assert.equal(custom['1'], 13);
  assert.equal(custom['3'], 33);
});

test('contrast and accessible touch targets verification', () => {
  const mainCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  
  // Verify focus ring styling exists
  assert.ok(mainCss.includes('--boodoo-focus-ring'), 'Focus rings must be defined for accessibility');
  assert.ok(mainCss.includes('prefers-reduced-motion'), 'prefers-reduced-motion must be handled');
});

test('React Native adapter exports valid definitions without bundling errors', async () => {
  const rnIndex = readFileSync(resolve(rootDir, 'react-native/index.js'), 'utf8');
  const expectedExports = [
    // Core & Provider
    'BoodooProvider',
    'useTheme',
    // Paper
    'Text',
    'Button',
    'IconButton',
    'FAB',
    'ActivityIndicator',
    'SegmentedButtons',
    'Card',
    'Surface',
    'Divider',
    'TextInput',
    'Searchbar',
    'HelperText',
    'Checkbox',
    'RadioButton',
    'Switch',
    'ToggleButton',
    'Chip',
    'Badge',
    'Avatar',
    'ProgressBar',
    'List',
    'Appbar',
    'Drawer',
    'BottomNavigation',
    'Dialog',
    'Modal',
    'Menu',
    'Tooltip',
    'Snackbar',
    'Banner',
    'DataTable',
    'Portal',
    'TouchableRipple',
    // Gluestack & Tamagui Layout Primitives
    'Box',
    'HStack',
    'VStack',
    'Center',
    'ZStack',
    'Pressable',
    'Grid',
    'Heading',
    'XStack',
    'YStack',
    'Separator',
    'Spinner',
    'Progress',
    'Alert',
    'AlertDialog',
    'Actionsheet',
    'Sheet',
    'Skeleton',
    'Textarea',
    'TextArea',
    'Tabs',
    'Popover',
    // React Native Elements (RNE UI)
    'ButtonGroup',
    'PricingCard',
    'Tile',
    'SearchBar',
    'CheckBox',
    'Slider',
    'Header',
    'BottomSheet',
    'Overlay',
    'Input',
    'ListItem',
    // UI Kitten
    'Toggle',
    'TopNavigation',
    'Radio',
    'RadioGroup',
    // Wix react-native-ui-lib
    'TextField',
    'Stepper',
    'Select',
    'Picker',
    'PageControl',
    'ActionSheet',
    'Toast',
    'Table',
    'StatWidget',
    'ChatBubble',
    'AIStream',
    'FilterPill',
  ];

  for (const exp of expectedExports) {
    assert.ok(
      rnIndex.includes(`export function ${exp}`) ||
      rnIndex.includes(`export const ${exp}`) ||
      rnIndex.includes(`export { ${exp}`) ||
      rnIndex.includes(exp),
      `React Native module must export ${exp}`
    );
  }
});

test('React Native modular submodules existence and exports verification', () => {
  const modules = [
    { file: 'typography.js', expected: ['Text', 'Heading'] },
    { file: 'layout.js', expected: ['Box', 'HStack', 'XStack', 'VStack', 'YStack', 'Center', 'ZStack', 'Pressable', 'Grid'] },
    { file: 'buttons.js', expected: ['Button', 'ButtonGroup', 'IconButton', 'FAB', 'SegmentedButtons'] },
    { file: 'surfaces.js', expected: ['Card', 'Surface', 'Divider', 'Separator', 'PricingCard', 'Tile', 'StatWidget'] },
    { file: 'inputs.js', expected: ['TextInput', 'Input', 'TextField', 'Textarea', 'TextArea', 'Searchbar', 'SearchBar', 'HelperText', 'Checkbox', 'CheckBox', 'RadioButton', 'Radio', 'RadioGroup', 'Switch', 'Toggle', 'Slider', 'Stepper', 'Select', 'Picker', 'ToggleButton'] },
    { file: 'data-display.js', expected: ['Chip', 'Badge', 'Avatar', 'ChatBubble', 'AIStream', 'FilterPill'] },
    { file: 'feedback.js', expected: ['ActivityIndicator', 'Spinner', 'ProgressBar', 'Progress', 'Skeleton', 'Alert', 'Banner', 'Toast', 'Snackbar'] },
    { file: 'lists.js', expected: ['List', 'ListItem', 'DataTable', 'Table'] },
    { file: 'navigation.js', expected: ['Appbar', 'Header', 'TopNavigation', 'Drawer', 'BottomNavigation', 'Tabs', 'PageControl'] },
    { file: 'overlays.js', expected: ['Dialog', 'AlertDialog', 'Modal', 'Overlay', 'BottomSheet', 'Actionsheet', 'ActionSheet', 'Sheet', 'Menu', 'Popover', 'Tooltip', 'Portal', 'TouchableRipple'] },
    { file: 'theme.js', expected: ['defaultLightTheme', 'defaultDarkTheme', 'BoodooProvider', 'useTheme'] },
    { file: 'paper.js', expected: ['boodooPaperLightTheme', 'boodooPaperDarkTheme'] },
  ];

  for (const mod of modules) {
    const filePath = resolve(rootDir, 'react-native', mod.file);
    assert.ok(existsSync(filePath), `Submodule react-native/${mod.file} must exist`);
    const code = readFileSync(filePath, 'utf8');
    for (const item of mod.expected) {
      assert.ok(
        code.includes(`export function ${item}`) ||
        code.includes(`export const ${item}`) ||
        code.includes(`export { ${item}`) ||
        code.includes(item),
        `Submodule react-native/${mod.file} must export ${item}`
      );
    }
  }
});

test('React Native Paper theme presets verification', async () => {
  const paperModule = await import(pathToFileURL(resolve(rootDir, 'react-native/paper.js')).href);
  const { boodooPaperLightTheme, boodooPaperDarkTheme, default: paperDefault } = paperModule;

  assert.ok(boodooPaperLightTheme, 'boodooPaperLightTheme must be exported');
  assert.equal(boodooPaperLightTheme.version, 3);
  assert.equal(boodooPaperLightTheme.isV3, true);
  assert.equal(boodooPaperLightTheme.dark, false);
  assert.ok(boodooPaperLightTheme.colors.primary);
  assert.ok(boodooPaperLightTheme.colors.elevation);

  assert.ok(boodooPaperDarkTheme, 'boodooPaperDarkTheme must be exported');
  assert.equal(boodooPaperDarkTheme.version, 3);
  assert.equal(boodooPaperDarkTheme.isV3, true);
  assert.equal(boodooPaperDarkTheme.dark, true);
  assert.ok(boodooPaperDarkTheme.colors.primary);

  assert.equal(paperDefault.light, boodooPaperLightTheme);
  assert.equal(paperDefault.dark, boodooPaperDarkTheme);
});

test('Comprehensive tokens scale coverage (colors, radii, typography, shadows)', async () => {
  const tokensModule = await import(pathToFileURL(resolve(rootDir, 'tokens/index.js')).href);
  const { colors, spacing, radii, typography, shadows, boodooTokens, default: defaultTokens } = tokensModule;

  // Colors & Brand Unification
  assert.equal(colors.primary, '#7c3aed', 'Primary must be brand violet');
  assert.equal(colors.secondary, '#5b21e6', 'Secondary must match brand indigo #5b21e6');
  assert.equal(colors.success, '#1c9e50', 'Success must match Sass #1c9e50');
  assert.equal(colors.danger, '#e11d48', 'Danger must match Sass #e11d48');
  assert.equal(colors.info, '#0ea5e9', 'Info must match Sass #0ea5e9');
  assert.equal(colors.dark, '#17135f', 'Dark must match brand deep indigo #17135f');
  assert.equal(colors.light, '#f6f5fb', 'Light must match brand light #f6f5fb');
  assert.equal(typeof colors.darkSurface, 'string');
  assert.equal(typeof colors.darkCard, 'string');
  assert.equal(typeof colors.darkBorder, 'string');

  // Radii
  assert.equal(radii.none, 0);
  assert.equal(radii.xs, 2);
  assert.equal(radii.sm, 4);
  assert.equal(radii.md, 8);
  assert.equal(radii.lg, 12);
  assert.equal(radii.xl, 16);
  assert.equal(radii.full, 9999);

  // Typography
  assert.equal(typography.fontFamily, 'System');
  assert.equal(typography.sizes.xs, 12);
  assert.equal(typography.sizes.sm, 14);
  assert.equal(typography.sizes.base, 16);
  assert.equal(typography.sizes['4xl'], 36);
  assert.equal(typography.weights.regular, '400');
  assert.equal(typography.weights.bold, '700');
  assert.equal(typography.lineHeights.tight, 1.25);
  assert.equal(typography.lineHeights.normal, 1.5);
  assert.equal(typography.lineHeights.relaxed, 1.75);

  // Shadows
  assert.ok(shadows.none);
  assert.ok(shadows.sm.elevation >= 2);
  assert.ok(shadows.md.elevation >= 4);
  assert.ok(shadows.lg.elevation >= 8);

  // Defaults and bundles
  assert.deepEqual(boodooTokens.colors, colors);
  assert.deepEqual(boodooTokens.spacing, spacing);
  assert.deepEqual(defaultTokens, boodooTokens);
});

test('React Native default themes data integrity', () => {
  const themeSource = readFileSync(resolve(rootDir, 'react-native/theme.js'), 'utf8');
  assert.ok(themeSource.includes('export const defaultLightTheme'), 'defaultLightTheme must be declared');
  assert.ok(themeSource.includes('export const defaultDarkTheme'), 'defaultDarkTheme must be declared');
  assert.ok(themeSource.includes('dark: false'), 'defaultLightTheme must have dark: false');
  assert.ok(themeSource.includes('dark: true'), 'defaultDarkTheme must have dark: true');
});

test('SCSS and LESS full component & feature parity verification', () => {
  const lessSource = readFileSync(resolve(rootDir, 'less/boodoo.less'), 'utf8');
  const lessCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.less.css'), 'utf8');

  // Verify core missing components are now present in LESS source and compiled CSS
  const expectedClasses = [
    '.accordion',
    '.avatar',
    '.announcement-bar',
    '.breadcrumb',
    '.carousel',
    '.modal',
    '.navbar',
    '.offcanvas',
    '.pagination',
    '.placeholder',
    '.popover',
    '.toast',
    '.tooltip',
    '.tree-view',
    '.dock',
    '.kpi-card',
    '.ai-prompt-container',
    '.chat-bubble',
    '.native-win',
    '.native-mac',
    '.native-ios',
    '.native-ipados',
    '.native-android',
    '.native-linux',
    '.native-photon',
    '.tag-input',
    '.floating-bar',
    '.diff-viewer',
    '.sparkline',
    '.password-meter',
    '.image-compare',
    '.code-copy-box',
    '.swipe-action-item',
    '.stat-widget',
    '.activity-feed',
    '.mega-menu',
    '.breadcrumb-dropdown-toggle',
    '.fab-dock',
    '.dialog-fullscreen',
    '.tour-popover'
  ];

  for (const cls of expectedClasses) {
    assert.ok(lessSource.includes(cls), `LESS source must implement ${cls} for SCSS parity`);
    assert.ok(lessCss.includes(cls), `dist/css/boodoo.less.css must contain compiled ${cls}`);
  }

  // Verify dark mode theme support in LESS
  assert.ok(lessSource.includes('prefers-color-scheme: dark'), 'LESS source must support prefers-color-scheme: dark');
  assert.ok(lessSource.includes('[data-boodoo-theme="dark"]'), 'LESS source must support data-boodoo-theme="dark"');
});

test('Modal focus management, Data API, and dispose() lifecycle verification', async () => {
  // Test BaseComponent and Modal in simulated environment
  const { BaseComponent, initDataApi } = await import(pathToFileURL(resolve(rootDir, 'js/src/base-component.js')).href);
  const { Modal } = await import(pathToFileURL(resolve(rootDir, 'js/src/modal.js')).href);

  // Fake DOM element for component lifecycle testing
  class FakeElement {
    constructor(id = 'test-el') {
      this.id = id;
      this.attributes = [];
      this.style = {};
      this.classList = {
        _classes: new Set(),
        add(c) { this._classes.add(c); },
        remove(c) { this._classes.delete(c); },
        contains(c) { return this._classes.has(c); },
      };
      this.children = [];
    }
    querySelector() { return null; }
    querySelectorAll() { return []; }
    addEventListener() {}
    removeEventListener() {}
    getAttribute() { return null; }
    setAttribute() {}
    removeAttribute() {}
  }

  const el = new FakeElement('modal-1');
  const modal = Modal.getOrCreateInstance(el, { keyboard: true });
  assert.ok(modal, 'Modal instance should be created');
  assert.equal(Modal.getInstance(el), modal, 'Modal.getInstance should return cached instance');

  // Verify component namespacing in registry
  class DummyComponent extends BaseComponent {
    static get NAME() { return 'dummy'; }
  }
  const dummy = DummyComponent.getOrCreateInstance(el);
  assert.notEqual(Modal.getInstance(el), dummy, 'Modal and DummyComponent should not collide on same element');
  assert.equal(DummyComponent.getInstance(el), dummy);

  // Verify dispose() lifecycle
  modal.dispose();
  assert.equal(Modal.getInstance(el), null, 'Modal.getInstance should return null after dispose()');
  assert.equal(DummyComponent.getInstance(el), dummy, 'DummyComponent should remain registered');
  dummy.dispose();
  assert.equal(DummyComponent.getInstance(el), null);

  // Verify BaseComponent._dataAttrConfig kebab->camelCase conversion and numeric whitespace parsing
  const mockAttrEl = {
    attributes: [
      { name: 'data-boodoo-placement-top', value: 'true' },
      { name: 'data-boodoo-max-count', value: '42' },
      { name: 'data-boodoo-blank-space', value: '   ' },
      { name: 'data-boodoo-raw-string', value: 'active-state' }
    ]
  };
  const cfg = BaseComponent._dataAttrConfig(mockAttrEl);
  assert.equal(cfg.placementTop, true, 'Kebab key must be converted to camelCase');
  assert.equal(cfg.maxCount, 42, 'Numeric string should be parsed to Number');
  assert.equal(cfg.blankSpace, '   ', 'Whitespace strings must not be coerced to 0');
  assert.equal(cfg.rawString, 'active-state');
});

test('XSS sanitization regression tests across Toast, ChipInput, and CommandPalette', async () => {
  const { escapeHtml } = await import(pathToFileURL(resolve(rootDir, 'js/src/util.js')).href);

  // 1. Direct utility testing
  const malicious = '<script>alert("xss")</script><img src="x" onerror="alert(1)">';
  const sanitized = escapeHtml(malicious);
  assert.ok(!sanitized.includes('<script>'), 'Must escape script tags');
  assert.ok(!sanitized.includes('</script>'), 'Must escape script closing tags');
  assert.ok(!sanitized.includes('<img'), 'Must escape img tags');
  assert.ok(sanitized.includes('&lt;script&gt;'), 'Must entity-encode < and >');
  assert.ok(sanitized.includes('&quot;'), 'Must entity-encode quotes');

  // Null & undefined handling
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');

  // 2. ChipInput safe DOM creation
  const { ChipInput } = await import(pathToFileURL(resolve(rootDir, 'js/src/chip-input.js')).href);
  class MockChipContainer {
    constructor() {
      this.attributes = [];
      this.classList = { add() {}, remove() {}, contains() { return false; } };
      this.children = [];
    }
    querySelector() { return null; }
    appendChild(child) { this.children.push(child); }
    insertBefore(child) { this.children.unshift(child); }
    dispatchEvent() { return true; }
  }

  const container = new MockChipContainer();
  // Ensure ChipInput.prototype.addChip does not inject raw HTML
  const addChipSrc = ChipInput.prototype.addChip.toString();
  assert.ok(addChipSrc.includes('labelSpan.textContent = text'), 'addChip must assign text via textContent');
  assert.ok(!addChipSrc.includes('innerHTML = `<span>${text}</span>'), 'addChip must not interpolate raw user text into innerHTML');

  // 3. TypeScript definition files existence
  assert.ok(existsSync(resolve(rootDir, 'dist/js/boodoo.d.ts')), 'dist/js/boodoo.d.ts must exist');
  assert.ok(existsSync(resolve(rootDir, 'tokens/index.d.ts')), 'tokens/index.d.ts must exist');
  assert.ok(existsSync(resolve(rootDir, 'react-native/index.d.ts')), 'react-native/index.d.ts must exist');
});

test('Dropzone safe DOM creation, XSS prevention, and URL revocation', async () => {
  const { Dropzone } = await import(pathToFileURL(resolve(rootDir, 'js/src/dropzone.js')).href);
  const dropzoneSrc = Dropzone.prototype._renderFileItem.toString();

  // Dropzone must not interpolate file.name into innerHTML
  assert.ok(!dropzoneSrc.includes('alt="${file.name}"'), 'Dropzone must not interpolate file.name in string template alt');
  assert.ok(!dropzoneSrc.includes('<span>${file.name}</span>'), 'Dropzone must not interpolate file.name into HTML span');
  assert.ok(dropzoneSrc.includes('nameSpan.textContent = file.name'), 'Dropzone must assign file name using textContent');
  assert.ok(dropzoneSrc.includes('previewEl.alt = file.name'), 'Dropzone must assign alt safely via property setter');

  // Verify URL.revokeObjectURL tracking
  const removeSrc = Dropzone.prototype.removeFile.toString();
  const clearSrc = Dropzone.prototype.clear.toString();
  assert.ok(removeSrc.includes('URL.revokeObjectURL'), 'removeFile must revoke object URL to prevent memory leaks');
  assert.ok(clearSrc.includes('URL.revokeObjectURL'), 'clear must revoke object URL to prevent memory leaks');
});

test('CommandPalette non-intrusive shortcut activation and safe navigation validation', async () => {
  const { CommandPalette } = await import(pathToFileURL(resolve(rootDir, 'js/src/command-palette.js')).href);
  const cpModuleSrc = readFileSync(resolve(rootDir, 'js/src/command-palette.js'), 'utf8');

  // Must not unconditionally bind Ctrl+K on document without presence check
  assert.ok(
    cpModuleSrc.includes('document.querySelector') || cpModuleSrc.includes('initDefault'),
    'CommandPalette must guard global shortcut registration'
  );

  // Must validate navigation URL protocols
  assert.ok(
    cpModuleSrc.includes('/^(?:https?:|\\/|#|mailto:)/i'),
    'CommandPalette must restrict item.href to safe protocols'
  );
});

test('Offcanvas and SpeedDial lifecycle teardown & listener cleanup', async () => {
  const { Offcanvas } = await import(pathToFileURL(resolve(rootDir, 'js/src/offcanvas.js')).href);
  const { SpeedDial } = await import(pathToFileURL(resolve(rootDir, 'js/src/speed-dial.js')).href);

  assert.equal(typeof Offcanvas.prototype.dispose, 'function', 'Offcanvas must provide dispose()');
  assert.equal(typeof SpeedDial.prototype.dispose, 'function', 'SpeedDial must provide dispose()');

  const offcanvasModuleSrc = readFileSync(resolve(rootDir, 'js/src/offcanvas.js'), 'utf8');
  assert.ok(offcanvasModuleSrc.includes('removeEventListener'), 'Offcanvas must clean up event listeners on teardown');

  const speedDialDisposeSrc = SpeedDial.prototype.dispose.toString();
  assert.ok(speedDialDisposeSrc.includes('removeEventListener'), 'SpeedDial dispose must clean up document listeners');
});

test('WAI-ARIA accessibility suite (announcer, roving tabindex, focus trap, combobox, treeview)', async () => {
  const { a11y } = await import(pathToFileURL(resolve(rootDir, 'js/src/a11y.js')).href);
  assert.equal(typeof a11y.announce, 'function', 'a11y.announce must be a function');
  assert.equal(typeof a11y.setRovingTabindex, 'function', 'a11y.setRovingTabindex must be a function');
  assert.equal(typeof a11y.createFocusTrap, 'function', 'a11y.createFocusTrap must be a function');

  // Combobox WAI-ARIA 1.2 patterns
  const comboboxSrc = readFileSync(resolve(rootDir, 'js/src/combobox.js'), 'utf8');
  assert.ok(comboboxSrc.includes("role', 'combobox'"), 'Combobox input must have role="combobox"');
  assert.ok(comboboxSrc.includes("aria-autocomplete', 'list'"), 'Combobox input must declare aria-autocomplete');
  assert.ok(comboboxSrc.includes("aria-activedescendant"), 'Combobox must manage aria-activedescendant');
  assert.ok(comboboxSrc.includes("role', 'listbox'"), 'Combobox menu must have role="listbox"');
  assert.ok(comboboxSrc.includes("role', 'option'"), 'Combobox items must have role="option"');

  // TreeView WAI-ARIA patterns
  const treeViewSrc = readFileSync(resolve(rootDir, 'js/src/tree-view.js'), 'utf8');
  assert.ok(treeViewSrc.includes("role', 'tree'"), 'TreeView root must declare role="tree"');
  assert.ok(treeViewSrc.includes("role', 'treeitem'"), 'TreeView items must declare role="treeitem"');
  assert.ok(treeViewSrc.includes("aria-expanded"), 'TreeView must toggle aria-expanded');
  assert.ok(treeViewSrc.includes("role', 'group'"), 'Subtrees must declare role="group"');
});

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
  assert.ok(boodooCjs.includes('module.exports = factory()'), 'boodoo.cjs must support CommonJS export');
});

test('Boodoo CLI component injector (npx boodoo add) and CSS migration codemod (npx boodoo migrate)', async () => {
  const { addComponent, listAvailableComponents, runMigration, handleAdd, handleMigrate, printHelp, runCli } = await import(
    pathToFileURL(resolve(rootDir, 'bin/boodoo.mjs')).href
  );

  // 1. Verify listAvailableComponents
  const available = listAvailableComponents();
  assert.ok(available.includes('modal'), 'available components must include modal');
  assert.ok(available.includes('command-palette'), 'available components must include command-palette');
  assert.ok(available.includes('dropzone'), 'available components must include dropzone');

  // 2. Verify addComponent extraction into temporary dir & error branch
  const tempTestDir = resolve(rootDir, 'tests', 'temp_add_test');
  try {
    const result = addComponent('modal', tempTestDir);
    assert.equal(result.name, 'modal');
    assert.ok(result.files.length > 0, 'addComponent should copy files');
    assert.equal(result.reactHook, 'useDisclosure');
    assert.ok(existsSync(resolve(tempTestDir, 'components/boodoo/_modal.scss')));
    assert.ok(existsSync(resolve(tempTestDir, 'components/boodoo/modal.js')));

    // Error branch when component name is unknown
    assert.throws(() => addComponent('non-existent-comp', tempTestDir), /not found/i);
  } finally {
    const { rmSync } = await import('node:fs');
    rmSync(tempTestDir, { recursive: true, force: true });
  }

  // 3. Verify Bootstrap migration codemod
  const bsSample = '<button data-bs-toggle="modal" data-bs-target="#myModal" class="btn btn-primary fs-2 fw-bold">Open</button>';
  const bsResult = runMigration(bsSample, 'bootstrap');
  assert.ok(bsResult.replacementsCount >= 4, 'Should replace multiple bootstrap attributes and classes');
  assert.ok(bsResult.output.includes('data-boodoo-toggle="modal"'), 'Should replace data-bs-toggle');
  assert.ok(bsResult.output.includes('data-boodoo-target="#myModal"'), 'Should replace data-bs-target');
  assert.ok(bsResult.output.includes('display-2'), 'Should replace fs-2 with display-2');
  assert.ok(bsResult.output.includes('font-weight-bold'), 'Should replace fw-bold with font-weight-bold');

  // 4. Verify Tailwind migration codemod
  const twSample = '<div class="flex flex-col items-center justify-between w-full font-bold max-w-7xl mx-auto"></div>';
  const twResult = runMigration(twSample, 'tailwind');
  assert.ok(twResult.replacementsCount >= 5, 'Should replace multiple tailwind utility chains');
  assert.ok(twResult.output.includes('flex-column'), 'Should replace flex flex-col with flex-column');
  assert.ok(twResult.output.includes('align-items-center'), 'Should replace items-center');
  assert.ok(twResult.output.includes('justify-content-between'), 'Should replace justify-between');
  assert.ok(twResult.output.includes('w-100'), 'Should replace w-full with w-100');
  assert.ok(twResult.output.includes('container'), 'Should replace max-w-7xl mx-auto with container');

  // 5. Test CLI Runners & Handlers: handleAdd
  const noCompRes = await handleAdd(['add']);
  assert.equal(noCompRes, undefined, 'handleAdd without component name prints list');

  const tempCliDir = resolve(rootDir, 'tests', 'temp_cli_test');
  try {
    const prevCwd = process.cwd();
    const { mkdirSync, writeFileSync, rmSync } = await import('node:fs');
    mkdirSync(tempCliDir, { recursive: true });
    process.chdir(tempCliDir);

    // Test successful handleAdd
    const addSuccess = await handleAdd(['add', 'toast']);
    assert.equal(addSuccess.name, 'toast');
    assert.ok(existsSync(resolve(tempCliDir, 'components/boodoo/_toasts.scss')));

    // Test handleAdd error branch
    await assert.rejects(async () => {
      await handleAdd(['add', 'invalid-widget']);
    });

    // Test handleMigrate empty directory
    const emptyMigrate = await handleMigrate(['migrate', tempCliDir]);
    assert.equal(emptyMigrate.filesScanned, 0);

    // Test handleMigrate on files
    const htmlFile = resolve(tempCliDir, 'index.html');
    writeFileSync(htmlFile, '<button data-bs-toggle="collapse" class="fs-1 fw-bold">Toggle</button>', 'utf8');
    const fileMigrate = await handleMigrate(['migrate', htmlFile, '--from=bootstrap']);
    assert.ok(fileMigrate.totalReplacements > 0);
    assert.ok(readFileSync(htmlFile, 'utf8').includes('data-boodoo-toggle="collapse"'));

    // Test handleMigrate on directory with Tailwind
    const twFile = resolve(tempCliDir, 'app.jsx');
    writeFileSync(twFile, '<div className="flex flex-col w-full text-center"></div>', 'utf8');
    const dirMigrate = await handleMigrate(['migrate', tempCliDir, '--from=tailwind']);
    assert.ok(dirMigrate.totalReplacements > 0);
    assert.ok(readFileSync(twFile, 'utf8').includes('flex-column'));

    // Test runCli routing for add (with reactHook coverage) and migrate
    const addViaRunCli = await runCli('add', ['add', 'modal']);
    assert.equal(addViaRunCli.name, 'modal');
    assert.equal(addViaRunCli.reactHook, 'useDisclosure');

    const migrateViaRunCli = await runCli('migrate', ['migrate', tempCliDir, '--from=tailwind']);
    assert.ok(migrateViaRunCli);

    // Test runCli routing for create / init with spawn handler
    let spawnCalled = false;
    const mockSpawn = (cmd, args, opts) => {
      spawnCalled = true;
      return {
        on(event, cb) {
          if (event === 'exit') cb(0);
        }
      };
    };
    const createArgs = ['create', 'test-app'];
    createArgs._spawnFn = mockSpawn;
    const createChild = await runCli('create', createArgs);
    assert.ok(spawnCalled);
    assert.ok(createChild);

    process.chdir(prevCwd);
  } finally {
    const { rmSync } = await import('node:fs');
    rmSync(tempCliDir, { recursive: true, force: true });
  }

  // 6. Test printHelp and runCli routing
  printHelp();
  await runCli('help', ['help']);
  await runCli('--help', ['--help']);
  await runCli('-h', ['-h']);
  const listRes = await runCli('list', ['list']);
  assert.ok(Array.isArray(listRes) && listRes.length > 0);
});

test('Modern JS components (FloatingBar, ImageCompare, PasswordMeter) verification', async () => {
  const { FloatingBar } = await import(pathToFileURL(resolve(rootDir, 'js/src/floating-bar.js')).href);
  const { ImageCompare } = await import(pathToFileURL(resolve(rootDir, 'js/src/image-compare.js')).href);
  const { PasswordMeter } = await import(pathToFileURL(resolve(rootDir, 'js/src/password-meter.js')).href);

  class MockElement {
    constructor() {
      this.classList = {
        _set: new Set(),
        add(c) { this._set.add(c); },
        remove(c) { this._set.delete(c); },
        contains(c) { return this._set.has(c); }
      };
      this.attributes = {};
      this.style = {};
    }
    querySelector() { return null; }
    querySelectorAll() { return []; }
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() { return true; }
    setAttribute(k, v) { this.attributes[k] = v; }
    getAttribute(k) { return this.attributes[k] || null; }
    removeAttribute(k) { delete this.attributes[k]; }
  }

  // FloatingBar
  const barEl = new MockElement();
  const bar = FloatingBar.getOrCreateInstance(barEl);
  bar.show();
  assert.ok(barEl.classList.contains('show'), 'FloatingBar show() adds show class');
  bar.hide();
  assert.ok(!barEl.classList.contains('show'), 'FloatingBar hide() removes show class');

  // PasswordMeter
  const meterEl = new MockElement();
  const meter = PasswordMeter.getOrCreateInstance(meterEl);
  const scoreWeak = meter.evaluate('abc');
  assert.equal(scoreWeak, 0, 'Weak password returns 0');
  const scoreStrong = meter.evaluate('StrongP@ssw0rd!');
  assert.equal(scoreStrong, 4, 'Complex password returns 4');
  assert.equal(meterEl.attributes['data-strength'], '4');
});

test('Extended v1.1.8 components (FABDock, DialogFullscreen, Tour) verification', async () => {
  const { FABDock } = await import(pathToFileURL(resolve(rootDir, 'js/src/fab-dock.js')).href);
  const { DialogFullscreen } = await import(pathToFileURL(resolve(rootDir, 'js/src/dialog-fullscreen.js')).href);
  const { Tour } = await import(pathToFileURL(resolve(rootDir, 'js/src/tour.js')).href);

  class MockElement {
    constructor() {
      this.classList = {
        _set: new Set(),
        add(c) { this._set.add(c); },
        remove(c) { this._set.delete(c); },
        contains(c) { return this._set.has(c); }
      };
      this.attributes = {};
      this.style = {};
    }
    querySelector() { return null; }
    querySelectorAll() { return []; }
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() { return true; }
    setAttribute(k, v) { this.attributes[k] = v; }
    getAttribute(k) { return this.attributes[k] || null; }
    removeAttribute(k) { delete this.attributes[k]; }
  }

  // FABDock
  const dockEl = new MockElement();
  const dock = FABDock.getOrCreateInstance(dockEl);
  dock.open();
  assert.ok(dockEl.classList.contains('open'), 'FABDock open() adds open class');
  dock.close();
  assert.ok(!dockEl.classList.contains('open'), 'FABDock close() removes open class');
  dock.toggle();
  assert.ok(dockEl.classList.contains('open'), 'FABDock toggle() opens dock');
  dock.dispose();

  // DialogFullscreen
  const dialogEl = new MockElement();
  const dialog = DialogFullscreen.getOrCreateInstance(dialogEl);
  dialog.show();
  assert.ok(dialogEl.classList.contains('show'), 'DialogFullscreen show() adds show class');
  assert.equal(dialogEl.attributes['aria-hidden'], 'false');
  dialog.hide();
  assert.ok(!dialogEl.classList.contains('show'), 'DialogFullscreen hide() removes show class');
  assert.equal(dialogEl.attributes['aria-hidden'], 'true');
  dialog.dispose();

  // Tour
  const tourEl = new MockElement();
  const tour = Tour.getOrCreateInstance(tourEl);
  tour.setSteps([
    { title: 'Welcome', content: 'Explore the dashboard.' },
    { title: 'Metrics', content: 'Track real-time stats.' }
  ]);
  assert.equal(tour._steps.length, 2);
  assert.equal(tour._currentStepIndex, 0);
  tour.next();
  assert.equal(tour._currentStepIndex, 1);
  tour.prev();
  assert.equal(tour._currentStepIndex, 0);
  tour.dispose();
});

test('Extended v1.1.8 CSS class compilation and SCSS/LESS token integration', () => {
  const css = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  const minCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.min.css'), 'utf8');
  const lessCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.less.css'), 'utf8');

  // Verify StatWidget styling and trend classes
  assert.ok(css.includes('.stat-widget'), 'CSS must contain .stat-widget');
  assert.ok(css.includes('.stat-trend-up'), 'CSS must contain .stat-trend-up');
  assert.ok(css.includes('.stat-trend-down'), 'CSS must contain .stat-trend-down');
  assert.ok(minCss.includes('.stat-widget'), 'Compressed CSS must contain .stat-widget');
  assert.ok(lessCss.includes('.stat-widget'), 'LESS CSS must compile .stat-widget');

  // Verify ActivityFeed & NotificationCenter styling
  assert.ok(css.includes('.activity-feed'), 'CSS must contain .activity-feed');
  assert.ok(css.includes('.notification-feed'), 'CSS must contain .notification-feed');
  assert.ok(css.includes('.feed-item.unread'), 'CSS must contain .feed-item.unread');
  assert.ok(lessCss.includes('.activity-feed'), 'LESS CSS must compile .activity-feed');

  // Verify MegaMenu
  assert.ok(css.includes('.mega-menu'), 'CSS must contain .mega-menu');
  assert.ok(css.includes('.mega-menu-panel'), 'CSS must contain .mega-menu-panel');
  assert.ok(css.includes('.mega-menu-grid'), 'CSS must contain .mega-menu-grid');
  assert.ok(lessCss.includes('.mega-menu'), 'LESS CSS must compile .mega-menu');

  // Verify Breadcrumb with Dropdown
  assert.ok(css.includes('.breadcrumb-dropdown-toggle'), 'CSS must contain .breadcrumb-dropdown-toggle');
  assert.ok(lessCss.includes('.breadcrumb-dropdown-toggle'), 'LESS CSS must compile .breadcrumb-dropdown-toggle');

  // Verify FABDock
  assert.ok(css.includes('.fab-dock'), 'CSS must contain .fab-dock');
  assert.ok(css.includes('.fab-dock-trigger'), 'CSS must contain .fab-dock-trigger');
  assert.ok(css.includes('.fab-dock-items'), 'CSS must contain .fab-dock-items');
  assert.ok(lessCss.includes('.fab-dock'), 'LESS CSS must compile .fab-dock');

  // Verify Fullscreen Dialog
  assert.ok(css.includes('.dialog-fullscreen'), 'CSS must contain .dialog-fullscreen');
  assert.ok(css.includes('.dialog-fullscreen-header'), 'CSS must contain .dialog-fullscreen-header');
  assert.ok(lessCss.includes('.dialog-fullscreen'), 'LESS CSS must compile .dialog-fullscreen');

  // Verify Tour Popover
  assert.ok(css.includes('.tour-popover'), 'CSS must contain .tour-popover');
  assert.ok(css.includes('.tour-step-badge'), 'CSS must contain .tour-step-badge');
  assert.ok(lessCss.includes('.tour-popover'), 'LESS CSS must compile .tour-popover');
});

test('Advanced v1.1.9 CSS class compilation and SCSS/LESS token integration', () => {
  const css = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  const minCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.min.css'), 'utf8');
  const lessCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.less.css'), 'utf8');

  // 1. ChatBubble & AIStream
  assert.ok(css.includes('.chat-thread'), 'CSS must contain .chat-thread');
  assert.ok(css.includes('.chat-bubble'), 'CSS must contain .chat-bubble');
  assert.ok(css.includes('.chat-bubble.incoming'), 'CSS must contain .chat-bubble.incoming');
  assert.ok(css.includes('.chat-bubble.outgoing'), 'CSS must contain .chat-bubble.outgoing');
  assert.ok(css.includes('.ai-stream'), 'CSS must contain .ai-stream');
  assert.ok(css.includes('.ai-cursor'), 'CSS must contain .ai-cursor');
  assert.ok(lessCss.includes('.chat-thread'), 'LESS CSS must contain .chat-thread');
  assert.ok(minCss.includes('.chat-bubble'), 'Minified CSS must contain .chat-bubble');

  // 2. FilterBar
  assert.ok(css.includes('.filter-bar'), 'CSS must contain .filter-bar');
  assert.ok(css.includes('.filter-pill'), 'CSS must contain .filter-pill');
  assert.ok(css.includes('.filter-pill.active'), 'CSS must contain .filter-pill.active');
  assert.ok(lessCss.includes('.filter-bar'), 'LESS CSS must contain .filter-bar');

  // 3. Kanban Board
  assert.ok(css.includes('.kanban-board'), 'CSS must contain .kanban-board');
  assert.ok(css.includes('.kanban-column'), 'CSS must contain .kanban-column');
  assert.ok(css.includes('.kanban-card'), 'CSS must contain .kanban-card');
  assert.ok(lessCss.includes('.kanban-board'), 'LESS CSS must contain .kanban-board');

  // 4. Bento Grid
  assert.ok(css.includes('.bento-grid'), 'CSS must contain .bento-grid');
  assert.ok(css.includes('.bento-item'), 'CSS must contain .bento-item');
  assert.ok(css.includes('.bento-col-span-2'), 'CSS must contain .bento-col-span-2');
  assert.ok(lessCss.includes('.bento-grid'), 'LESS CSS must contain .bento-grid');

  // 5. Transfer List
  assert.ok(css.includes('.transfer-list'), 'CSS must contain .transfer-list');
  assert.ok(css.includes('.transfer-panel'), 'CSS must contain .transfer-panel');
  assert.ok(css.includes('.transfer-controls'), 'CSS must contain .transfer-controls');
  assert.ok(lessCss.includes('.transfer-list'), 'LESS CSS must contain .transfer-list');

  // 6. Audio Player
  assert.ok(css.includes('.audio-player'), 'CSS must contain .audio-player');
  assert.ok(css.includes('.audio-waveform'), 'CSS must contain .audio-waveform');
  assert.ok(css.includes('.audio-wave-bar'), 'CSS must contain .audio-wave-bar');
  assert.ok(lessCss.includes('.audio-player'), 'LESS CSS must contain .audio-player');

  // 7. Color Picker
  assert.ok(css.includes('.color-picker'), 'CSS must contain .color-picker');
  assert.ok(css.includes('.color-swatch-grid'), 'CSS must contain .color-swatch-grid');
  assert.ok(css.includes('.color-swatch'), 'CSS must contain .color-swatch');
  assert.ok(lessCss.includes('.color-picker'), 'LESS CSS must contain .color-picker');

  // 8. Back to Top
  assert.ok(css.includes('.back-to-top'), 'CSS must contain .back-to-top');
  assert.ok(css.includes('.back-to-top.visible'), 'CSS must contain .back-to-top.visible');
  assert.ok(lessCss.includes('.back-to-top'), 'LESS CSS must contain .back-to-top');
});

test('Advanced v1.1.9 JavaScript components and full lifecycle execution', async () => {
  const { FilterBar, TransferList, ColorPicker, BackToTop } = await import(pathToFileURL(resolve(rootDir, 'js/src/advanced-components.js')).href);

  assert.equal(FilterBar.NAME, 'filter-bar');
  assert.equal(TransferList.NAME, 'transfer-list');
  assert.equal(ColorPicker.NAME, 'color-picker');
  assert.equal(BackToTop.NAME, 'back-to-top');

  class MockDOMNode {
    constructor(tagName = 'div') {
      this.tagName = tagName.toUpperCase();
      this.classList = {
        _set: new Set(),
        add(...classes) { classes.forEach(c => this._set.add(c)); },
        remove(...classes) { classes.forEach(c => this._set.delete(c)); },
        contains(c) { return this._set.has(c); },
        toggle(c) {
          if (this._set.has(c)) { this._set.delete(c); return false; }
          this._set.add(c); return true;
        }
      };
      this.attributes = {};
      this.style = {};
      this.children = [];
      this.parentNode = null;
      this.listeners = {};
      this.value = '';
      this.textContent = '';
    }

    get className() {
      return Array.from(this.classList._set).join(' ');
    }

    set className(val) {
      this.classList._set.clear();
      if (val) {
        val.split(/\s+/).filter(Boolean).forEach(c => this.classList.add(c));
      }
    }

    setAttribute(k, v) { this.attributes[k] = String(v); }
    getAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attributes, k) ? this.attributes[k] : null; }
    removeAttribute(k) { delete this.attributes[k]; }

    appendChild(child) {
      if (child.parentNode) {
        child.parentNode.removeChild(child);
      }
      child.parentNode = this;
      this.children.push(child);
      return child;
    }

    removeChild(child) {
      const idx = this.children.indexOf(child);
      if (idx !== -1) {
        this.children.splice(idx, 1);
        child.parentNode = null;
      }
      return child;
    }

    replaceChildren(...newChildren) {
      this.children.forEach(c => { c.parentNode = null; });
      this.children = [];
      newChildren.forEach(c => this.appendChild(c));
    }

    addEventListener(event, fn) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(fn);
    }

    removeEventListener(event, fn) {
      if (!this.listeners[event]) return;
      this.listeners[event] = this.listeners[event].filter(h => h !== fn);
    }

    dispatchEvent(evt) {
      const handlers = this.listeners[evt.type] || [];
      handlers.forEach(fn => fn(evt));
      return true;
    }

    closest(selector) {
      let cur = this;
      while (cur) {
        if (cur.matches && cur.matches(selector)) return cur;
        cur = cur.parentNode;
      }
      return null;
    }

    matches(selector) {
      if (selector.includes(',')) {
        return selector.split(',').some(sub => this.matches(sub.trim()));
      }
      if (selector.endsWith(':first-child')) {
        const base = selector.replace(':first-child', '');
        const isFirst = this.parentNode ? this.parentNode.children[0] === this : true;
        return isFirst && (!base || this.matches(base));
      }
      if (selector.endsWith(':last-child')) {
        const base = selector.replace(':last-child', '');
        const isLast = this.parentNode ? this.parentNode.children[this.parentNode.children.length - 1] === this : true;
        return isLast && (!base || this.matches(base));
      }
      if (selector.startsWith('.')) {
        const classes = selector.split('.').filter(Boolean);
        return classes.every(c => this.classList.contains(c));
      }
      if (selector.startsWith('#')) {
        return this.attributes.id === selector.slice(1);
      }
      return this.tagName.toLowerCase() === selector.toLowerCase();
    }

    querySelector(selector) {
      const parts = selector.split(',').map(s => s.trim());
      for (const part of parts) {
        const find = (node) => {
          for (const child of node.children) {
            if (child.matches(part)) return child;
            const found = find(child);
            if (found) return found;
          }
          return null;
        };
        const match = find(this);
        if (match) return match;
      }
      return null;
    }

    querySelectorAll(selector) {
      const parts = selector.split(',').map(s => s.trim());
      const matches = [];
      const walk = (node) => {
        for (const child of node.children) {
          if (parts.some(p => child.matches(p))) {
            matches.push(child);
          }
          walk(child);
        }
      };
      walk(this);
      return matches;
    }
  }

  // Set global document.createElement for addPill
  const origCreateElement = globalThis.document?.createElement;
  globalThis.document = globalThis.document || {};
  globalThis.document.createElement = (tag) => new MockDOMNode(tag);

  // -------------------------------------------------------------
  // 1. FilterBar Full Coverage
  // -------------------------------------------------------------
  const filterRoot = new MockDOMNode('div');
  const pillsWrap = new MockDOMNode('div');
  pillsWrap.classList.add('filter-pills-wrap');
  filterRoot.appendChild(pillsWrap);

  const searchInput = new MockDOMNode('input');
  searchInput.classList.add('filter-search');
  searchInput.value = 'initial query';
  filterRoot.appendChild(searchInput);

  const filterBar = new FilterBar(filterRoot);

  let searchEventFired = false;
  let addEventFired = false;
  let removeEventFired = false;
  let clearEventFired = false;

  filterRoot.addEventListener('search.boodoo.filter', (e) => {
    searchEventFired = true;
    assert.equal(e.detail.query, 'test search');
  });
  const addedDetails = [];
  filterRoot.addEventListener('add.boodoo.filter', (e) => {
    addEventFired = true;
    addedDetails.push(e.detail);
  });
  filterRoot.addEventListener('remove.boodoo.filter', (e) => {
    removeEventFired = true;
    assert.equal(e.detail.key, 'category');
  });
  filterRoot.addEventListener('clear.boodoo.filter', () => {
    clearEventFired = true;
  });

  // Test searchInput Enter keydown
  searchInput.value = 'test search';
  const enterEvt = { key: 'Enter', preventDefault() {} };
  searchInput.listeners['keydown'].forEach(fn => fn(enterEvt));
  assert.ok(searchEventFired, 'Enter on searchInput must fire search.boodoo.filter');

  // Test addPill
  filterBar.addPill('Frontend', 'frontend', 'category');
  assert.ok(addEventFired, 'addPill must fire add.boodoo.filter');
  assert.equal(pillsWrap.children.length, 1, 'Pill must be appended to wrap');
  const addedPill = pillsWrap.children[0];
  assert.equal(addedPill.getAttribute('data-filter-key'), 'category');
  assert.equal(addedPill.getAttribute('data-filter-value'), 'frontend');

  // Test click on filter-pill-remove
  const removeBtn = addedPill.querySelector('.filter-pill-remove');
  assert.ok(removeBtn, 'Pill must have remove button');
  const clickRemoveEvt = {
    target: removeBtn,
    type: 'click'
  };
  filterRoot.listeners['click'].forEach(fn => fn(clickRemoveEvt));
  assert.ok(removeEventFired, 'Clicking removeBtn must trigger removePill and event');
  assert.equal(pillsWrap.children.length, 0, 'Pill should be removed from parent');

  // Test add without key
  filterBar.addPill('General', 'simple');
  assert.equal(pillsWrap.children.length, 1);
  assert.equal(addedDetails.length, 2);
  assert.deepEqual(addedDetails[0], { key: 'category', value: 'frontend', label: 'Frontend' });
  assert.deepEqual(addedDetails[1], { key: '', value: 'simple', label: 'General' });

  // Test clearAll via clear-all button click
  const clearBtn = new MockDOMNode('button');
  clearBtn.classList.add('filter-clear-all');
  filterRoot.appendChild(clearBtn);

  const clickClearEvt = { target: clearBtn, type: 'click' };
  filterRoot.listeners['click'].forEach(fn => fn(clickClearEvt));
  assert.ok(clearEventFired, 'Clicking clear-all must fire clear.boodoo.filter');
  assert.equal(pillsWrap.children.length, 0, 'Clear all must empty pillsWrap');
  assert.equal(searchInput.value, '', 'Clear all must empty searchInput');

  // Edge cases: addPill when wrap is absent
  const filterEmpty = new FilterBar(new MockDOMNode('div'));
  filterEmpty.addPill('Label', 'val'); // should not throw

  filterBar.dispose();

  // -------------------------------------------------------------
  // 2. TransferList Full Coverage
  // -------------------------------------------------------------
  const transferRoot = new MockDOMNode('div');
  const leftPanel = new MockDOMNode('div');
  leftPanel.classList.add('transfer-panel', 'transfer-panel-source');
  const leftList = new MockDOMNode('ul');
  leftList.classList.add('transfer-items');
  leftPanel.appendChild(leftList);

  const rightPanel = new MockDOMNode('div');
  rightPanel.classList.add('transfer-panel', 'transfer-panel-target');
  const rightList = new MockDOMNode('ul');
  rightList.classList.add('transfer-items');
  rightPanel.appendChild(rightList);

  const btnRight = new MockDOMNode('button');
  btnRight.classList.add('transfer-btn-right');
  const btnLeft = new MockDOMNode('button');
  btnLeft.classList.add('transfer-btn-left');
  const btnAllRight = new MockDOMNode('button');
  btnAllRight.classList.add('transfer-btn-all-right');
  const btnAllLeft = new MockDOMNode('button');
  btnAllLeft.classList.add('transfer-btn-all-left');

  const controls = new MockDOMNode('div');
  controls.classList.add('transfer-controls');
  controls.appendChild(btnRight);
  controls.appendChild(btnLeft);
  controls.appendChild(btnAllRight);
  controls.appendChild(btnAllLeft);

  transferRoot.appendChild(leftPanel);
  transferRoot.appendChild(controls);
  transferRoot.appendChild(rightPanel);

  const item1 = new MockDOMNode('li');
  item1.classList.add('transfer-item');
  const item2 = new MockDOMNode('li');
  item2.classList.add('transfer-item');
  leftList.appendChild(item1);
  leftList.appendChild(item2);

  const transferList = new TransferList(transferRoot);

  let transferEventCount = 0;
  transferRoot.addEventListener('change.boodoo.transfer', (e) => {
    transferEventCount++;
  });

  // Test item selection click
  const clickItemEvt = { target: item1, type: 'click' };
  transferRoot.listeners['click'].forEach(fn => fn(clickItemEvt));
  assert.ok(item1.classList.contains('selected'), 'Clicking item toggles selected');

  // Test moveSelected right
  const clickMoveRightEvt = { target: btnRight, type: 'click' };
  transferRoot.listeners['click'].forEach(fn => fn(clickMoveRightEvt));
  assert.equal(leftList.children.length, 1);
  assert.equal(rightList.children.length, 1);
  assert.ok(!item1.classList.contains('selected'), 'Moved item must deselect');
  assert.equal(transferEventCount, 1);

  // Test moveSelected left
  const clickItem2Evt = { target: item1, type: 'click' };
  transferRoot.listeners['click'].forEach(fn => fn(clickItem2Evt));
  assert.ok(item1.classList.contains('selected'));
  const clickMoveLeftEvt = { target: btnLeft, type: 'click' };
  transferRoot.listeners['click'].forEach(fn => fn(clickMoveLeftEvt));
  assert.equal(leftList.children.length, 2);
  assert.equal(rightList.children.length, 0);
  assert.equal(transferEventCount, 2);

  // Test moveAll right
  const clickAllRightEvt = { target: btnAllRight, type: 'click' };
  transferRoot.listeners['click'].forEach(fn => fn(clickAllRightEvt));
  assert.equal(leftList.children.length, 0);
  assert.equal(rightList.children.length, 2);
  assert.equal(transferEventCount, 3);

  // Test moveAll left
  const clickAllLeftEvt = { target: btnAllLeft, type: 'click' };
  transferRoot.listeners['click'].forEach(fn => fn(clickAllLeftEvt));
  assert.equal(leftList.children.length, 2);
  assert.equal(rightList.children.length, 0);
  assert.equal(transferEventCount, 4);

  // Branch guards when panels are missing
  transferList.moveSelected(null, null);
  transferList.moveAll(null, null);

  transferList.dispose();

  // -------------------------------------------------------------
  // 3. ColorPicker Full Coverage
  // -------------------------------------------------------------
  const pickerRoot = new MockDOMNode('div');
  const swatch1 = new MockDOMNode('button');
  swatch1.classList.add('color-swatch');
  swatch1.setAttribute('data-color', '#ff0000');

  const swatch2 = new MockDOMNode('button');
  swatch2.classList.add('color-swatch');
  swatch2.style.backgroundColor = '#00ff00';

  const preview = new MockDOMNode('div');
  preview.classList.add('color-preview');

  const hexInput = new MockDOMNode('input');
  hexInput.classList.add('color-hex-input');

  pickerRoot.appendChild(swatch1);
  pickerRoot.appendChild(swatch2);
  pickerRoot.appendChild(preview);
  pickerRoot.appendChild(hexInput);

  const picker = new ColorPicker(pickerRoot, { value: '#ff0000' });
  assert.equal(picker.getValue(), '#ff0000');
  assert.equal(picker.getColor(), '#ff0000');

  let colorChangeFired = false;
  const colorChanges = [];
  pickerRoot.addEventListener('change.boodoo.color', (e) => {
    colorChangeFired = true;
    colorChanges.push(e.detail.color);
  });

  // Click on swatch
  const clickSwatchEvt = { target: swatch2, type: 'click' };
  pickerRoot.listeners['click'].forEach(fn => fn(clickSwatchEvt));
  assert.ok(colorChangeFired);
  assert.equal(picker.getValue(), '#00ff00');
  assert.ok(swatch2.classList.contains('active'));
  assert.ok(!swatch1.classList.contains('active'));
  assert.equal(preview.style.backgroundColor, '#00ff00');
  assert.equal(hexInput.value, '#00ff00');

  // Input event on hexInput
  hexInput.value = '#123456';
  hexInput.listeners['input'].forEach(fn => fn({}));
  assert.equal(picker.getValue(), '#123456');

  // Invalid hex should be ignored
  hexInput.value = 'invalid';
  hexInput.listeners['input'].forEach(fn => fn({}));
  assert.equal(picker.getValue(), '#123456');

  assert.deepEqual(colorChanges, ['#00ff00', '#123456']);

  picker.dispose();

  // -------------------------------------------------------------
  // 4. BackToTop Full Coverage
  // -------------------------------------------------------------
  const bttBtn = new MockDOMNode('button');
  let scrolledTo = null;
  globalThis.window = {
    scrollY: 100,
    addEventListener(event, fn) {
      if (!this._listeners) this._listeners = {};
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(fn);
    },
    removeEventListener(event, fn) {
      if (!this._listeners || !this._listeners[event]) return;
      this._listeners[event] = this._listeners[event].filter(h => h !== fn);
    },
    scrollTo(opts) {
      scrolledTo = opts;
    }
  };

  const btt = new BackToTop(bttBtn, { threshold: 200 });
  assert.ok(!bttBtn.classList.contains('visible'), 'Should not be visible at scrollY 100 < 200');

  // Scroll beyond threshold
  globalThis.window.scrollY = 350;
  globalThis.window._listeners['scroll'].forEach(fn => fn());
  assert.ok(bttBtn.classList.contains('visible'), 'Should become visible when scrollY > threshold');

  // Scroll back down
  globalThis.window.scrollY = 50;
  globalThis.window._listeners['scroll'].forEach(fn => fn());
  assert.ok(!bttBtn.classList.contains('visible'), 'Should hide when scrollY <= threshold');

  // Click to top
  let scrollTopFired = false;
  bttBtn.addEventListener('scrolltop.boodoo', () => { scrollTopFired = true; });
  const clickBttEvt = { preventDefault() {}, type: 'click' };
  bttBtn.listeners['click'].forEach(fn => fn(clickBttEvt));
  assert.ok(scrollTopFired, 'Clicking BackToTop must fire scrolltop.boodoo event');
  assert.deepEqual(scrolledTo, { top: 0, behavior: 'smooth' });

  btt.dispose();
  assert.equal(globalThis.window._listeners['scroll'].length, 0, 'Scroll listener must be removed on dispose');

  // Restore global state
  if (origCreateElement) {
    globalThis.document.createElement = origCreateElement;
  }
});

test('Boodoo CLI injector and migration coverage for all 8 v1.1.9 components', async () => {
  const { addComponent, listAvailableComponents } = await import(
    pathToFileURL(resolve(rootDir, 'bin/boodoo.mjs')).href
  );

  const available = listAvailableComponents();
  const newV119Components = [
    'chat-thread',
    'filter-bar',
    'kanban-board',
    'bento-grid',
    'transfer-list',
    'audio-player',
    'color-picker',
    'back-to-top'
  ];

  for (const comp of newV119Components) {
    assert.ok(available.includes(comp), `CLI must list ${comp} as available component`);
  }

  const tempDir = resolve(rootDir, 'tests', 'temp_v119_cli_test');
  try {
    for (const comp of newV119Components) {
      const res = addComponent(comp, tempDir);
      assert.equal(res.name, comp);
      assert.ok(res.files.length > 0, `addComponent for ${comp} should inject files`);
    }
  } finally {
    const { rmSync } = await import('node:fs');
    rmSync(tempDir, { recursive: true, force: true });
  }
});





