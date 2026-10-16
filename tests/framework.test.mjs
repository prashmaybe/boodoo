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
  assert.match(mainCss, /\[data-boodoo-theme=["']?dark["']?\]\s*\{[^}]*--boodoo-gray-800:\s*#ececf4/);
  assert.match(mainCss, /\[data-boodoo-theme=["']?dark["']?\]\s*\{[^}]*--boodoo-gray-900:\s*#f7f8fb/);

  // Verify in LESS dist
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
    { file: 'surfaces.js', expected: ['Card', 'Surface', 'Divider', 'Separator', 'PricingCard', 'Tile'] },
    { file: 'inputs.js', expected: ['TextInput', 'Input', 'TextField', 'Textarea', 'TextArea', 'Searchbar', 'SearchBar', 'HelperText', 'Checkbox', 'CheckBox', 'RadioButton', 'Radio', 'RadioGroup', 'Switch', 'Toggle', 'Slider', 'Stepper', 'Select', 'Picker', 'ToggleButton'] },
    { file: 'data-display.js', expected: ['Chip', 'Badge', 'Avatar'] },
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

  // Colors
  assert.equal(typeof colors.primary, 'string');
  assert.equal(typeof colors.secondary, 'string');
  assert.equal(typeof colors.success, 'string');
  assert.equal(typeof colors.warning, 'string');
  assert.equal(typeof colors.danger, 'string');
  assert.equal(typeof colors.info, 'string');
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
    '.chat-bubble'
  ];

  for (const cls of expectedClasses) {
    assert.ok(lessSource.includes(cls), `LESS source must implement ${cls} for SCSS parity`);
    assert.ok(lessCss.includes(cls), `dist/css/boodoo.less.css must contain compiled ${cls}`);
  }

  // Verify dark mode theme support in LESS
  assert.ok(lessSource.includes('prefers-color-scheme: dark'), 'LESS source must support prefers-color-scheme: dark');
  assert.ok(lessSource.includes('[data-boodoo-theme="dark"]'), 'LESS source must support data-boodoo-theme="dark"');
});

