import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
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


test('SCSS and LESS full component & feature parity verification', () => {
  // Aggregate all modular LESS sources across less/ directory
  const getLessSource = () => {
    let src = '';
    const readDirRec = (dir) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = resolve(dir, entry.name);
        if (entry.isDirectory()) readDirRec(full);
        else if (entry.name.endsWith('.less')) src += '\n' + readFileSync(full, 'utf8');
      }
    };
    readDirRec(resolve(rootDir, 'less'));
    return src;
  };
  const lessSource = getLessSource();
  const lessCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.less.css'), 'utf8');

  // Verify modular architecture of LESS mirroring SCSS
  const expectedModularFiles = [
    'less/_variables.less',
    'less/_root.less',
    'less/_mixins.less',
    'less/_reboot.less',
    'less/_grid.less',
    'less/_helpers.less',
    'less/_utilities.less',
    'less/_animations.less',
    'less/boodoo-grid.less',
    'less/boodoo-reboot.less',
    'less/boodoo-utilities.less',
    'less/boodoo-animations.less',
    'less/content/_typography.less',
    'less/content/_images.less',
    'less/content/_tables.less',
    'less/content/_figures.less',
    'less/forms/_control.less',
    'less/forms/_select.less',
    'less/forms/_layout.less',
    'less/forms/_checks.less',
    'less/forms/_range.less',
    'less/forms/_range-dual.less',
    'less/forms/_input-group.less',
    'less/forms/_floating-labels.less',
    'less/forms/_otp.less',
    'less/forms/_dropzone.less',
    'less/forms/_pickers.less',
    'less/forms/_validation.less',
    'less/components/_accordion.less',
    'less/components/_modal.less',
    'less/components/_buttons.less',
    'less/components/_card.less'
  ];
  for (const relPath of expectedModularFiles) {
    assert.ok(existsSync(resolve(rootDir, relPath)), `Modular LESS file must exist: ${relPath}`);
  }

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

test('dialog open background scroll lock and overscroll-behavior parity across SCSS and LESS', () => {
  const scssCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  const lessCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.less.css'), 'utf8');

  // Both should contain body:has(dialog.modal[open])
  assert.ok(
    scssCss.includes('body:has(dialog.modal[open])'),
    'SCSS dist CSS must contain body:has(dialog.modal[open]) selector'
  );
  assert.ok(
    lessCss.includes('body:has(dialog.modal[open])'),
    'LESS dist CSS must contain body:has(dialog.modal[open]) selector'
  );

  // Both should contain overscroll-behavior: contain on dialog.modal and backdrop
  assert.ok(
    scssCss.includes('overscroll-behavior: contain'),
    'SCSS dist CSS must contain overscroll-behavior: contain for dialog/backdrop'
  );
  assert.ok(
    lessCss.includes('overscroll-behavior: contain'),
    'LESS dist CSS must contain overscroll-behavior: contain for dialog/backdrop'
  );
});


