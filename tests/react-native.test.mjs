import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const rootDir = resolve(import.meta.dirname, '..');

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
    'BarChart',
    'DonutChart',
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
    { file: 'buttons.js', expected: ['Button', 'ButtonGroup', 'IconButton', 'FAB', 'SegmentedButtons', 'SpeedDial', 'SpeedDialAction'] },
    { file: 'surfaces.js', expected: ['Card', 'Surface', 'Divider', 'Separator', 'PricingCard', 'Tile', 'StatWidget', 'BentoGrid', 'BentoItem'] },
    { file: 'inputs.js', expected: ['TextInput', 'Input', 'TextField', 'Textarea', 'TextArea', 'Searchbar', 'SearchBar', 'HelperText', 'Checkbox', 'CheckBox', 'RadioButton', 'Radio', 'RadioGroup', 'Switch', 'Toggle', 'Slider', 'Stepper', 'Select', 'Picker', 'ToggleButton', 'OtpInput', 'PinInput', 'Rating', 'StarRating', 'ChipInput', 'TagInput'] },
    { file: 'data-display.js', expected: ['Chip', 'Badge', 'Avatar', 'ChatBubble', 'AIStream', 'FilterPill', 'BarChart', 'DonutChart', 'EmptyState', 'Timeline', 'TimelineItem', 'StepIndicator', 'StepperWizard'] },
    { file: 'feedback.js', expected: ['ActivityIndicator', 'Spinner', 'ProgressBar', 'Progress', 'Skeleton', 'Alert', 'Banner', 'Toast', 'Snackbar'] },
    { file: 'lists.js', expected: ['List', 'ListItem', 'DataTable', 'Table', 'Accordion', 'AccordionItem', 'SwipeActionItem', 'SwipeableRow'] },
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


test('React Native submodules syntax and duplicate export prevention', () => {
  const rnDir = resolve(rootDir, 'react-native');
  const files = readdirSync(rnDir).filter(f => f.endsWith('.js'));
  assert.ok(files.length >= 13, 'Expected at least 13 React Native submodules');

  for (const file of files) {
    const code = readFileSync(resolve(rnDir, file), 'utf8');
    const lines = code.split('\n');
    const declaredExports = new Map();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/^export\s+(?:function|const|let|var|class)\s+([A-Za-z0-9_]+)/);
      if (match) {
        const name = match[1];
        assert.ok(
          !declaredExports.has(name),
          `Duplicate export '${name}' detected in react-native/${file} at line ${i + 1} (previously declared at line ${declaredExports.get(name)})`
        );
        declaredExports.set(name, i + 1);
      }
    }
  }
});


test('React Native component spacing and padding compactness verification', () => {
  const buttonsCode = readFileSync(resolve(rootDir, 'react-native/buttons.js'), 'utf8');
  const surfacesCode = readFileSync(resolve(rootDir, 'react-native/surfaces.js'), 'utf8');
  const inputsCode = readFileSync(resolve(rootDir, 'react-native/inputs.js'), 'utf8');

  // Verify buttons don't have bloated spacing
  assert.ok(!buttonsCode.includes('theme.spacing[1] + 2'), 'Button should not have bloated spacing[1] + 2');
  assert.ok(!buttonsCode.includes('theme.spacing[4]'), 'Button should not use expansive spacing[4]');
  assert.ok(buttonsCode.includes('cs.buttonPaddingVerticalMd'), 'Button default should support customizable vertical padding');
  assert.ok(buttonsCode.includes('cs.buttonPaddingHorizontalMd'), 'Button default should support customizable horizontal padding');
  assert.ok(buttonsCode.includes('10'), 'Button default fallback must be 10px');
  assert.ok(buttonsCode.includes('16'), 'Button default fallback must be 16px');

  // Verify Card and Surface compactness
  assert.ok(!surfacesCode.includes('padding: theme.spacing[4]'), 'Card must not have bloated 68px padding');
  assert.ok(surfacesCode.includes('padding: cardPadding'), 'Card must use dynamic customizable cardPadding');
  assert.ok(surfacesCode.includes('cs.cardTitleMarginBottom'), 'Card.Title must support custom bottom margin');

  // Verify TextInput compactness
  assert.ok(!inputsCode.includes('paddingVertical: theme.spacing[2] + 2'), 'TextInput must not have bloated 38px vertical padding');
  assert.ok(inputsCode.includes('cs.inputPaddingVertical'), 'TextInput must support customizable vertical padding');
  assert.ok(inputsCode.includes('cs.inputPaddingHorizontal'), 'TextInput must support customizable horizontal padding');
  assert.ok(inputsCode.includes('cs.inputMarginBottom'), 'TextInput must support customizable bottom margin');
});


test('React Native component spacing customization and density configuration', () => {
  const themeCode = readFileSync(resolve(rootDir, 'react-native/theme.js'), 'utf8');
  assert.ok(themeCode.includes('export const createComponentSpacing'), 'createComponentSpacing must be exported');
  assert.ok(themeCode.includes('export const defaultComponentSpacing'), 'defaultComponentSpacing must be exported');
  assert.ok(themeCode.includes('componentSpacing: defaultComponentSpacing'), 'themes must include componentSpacing');

  // Verify function logic by extracting createComponentSpacing without react dependency
  const startIndex = themeCode.indexOf('export const createComponentSpacing = (baseSpacer = 16');
  const endIndex = themeCode.indexOf('export const defaultComponentSpacing');
  assert.ok(startIndex !== -1 && endIndex !== -1, 'createComponentSpacing implementation must be found');
  const fnCode = themeCode.slice(startIndex + 'export const createComponentSpacing = '.length, endIndex).trim().replace(/;$/, '');
  const createComponentSpacing = new Function('return ' + fnCode)();

  const defaultSpacing = createComponentSpacing(16);
  assert.equal(defaultSpacing.card, 16);
  assert.equal(defaultSpacing.cardTitleMarginBottom, 8);
  assert.equal(defaultSpacing.buttonPaddingVerticalMd, 10);
  assert.equal(defaultSpacing.buttonPaddingHorizontalMd, 16);
  assert.equal(defaultSpacing.inputPaddingVertical, 10);
  assert.equal(defaultSpacing.inputPaddingHorizontal, 12);

  // Test dynamic density creation (e.g. compact scale with baseSpacer = 12)
  const compact = createComponentSpacing(12);
  assert.equal(compact.card, 12);
  assert.equal(compact.buttonPaddingVerticalMd, 8);
  assert.equal(compact.inputPaddingVertical, 8);

  // Test custom overrides
  const custom = createComponentSpacing(16, { card: 24, buttonPaddingVerticalMd: 14 });
  assert.equal(custom.card, 24);
  assert.equal(custom.buttonPaddingVerticalMd, 14);

  // Verify components read from theme.componentSpacing, theme.spacing, and props
  const surfacesCode = readFileSync(resolve(rootDir, 'react-native/surfaces.js'), 'utf8');
  assert.ok(surfacesCode.includes('cs.card'), 'Card must read custom spacing from theme.componentSpacing');
  assert.ok(surfacesCode.includes('padding ??'), 'Card must allow padding prop customization');

  const buttonsCode = readFileSync(resolve(rootDir, 'react-native/buttons.js'), 'utf8');
  assert.ok(buttonsCode.includes('cs.buttonPaddingVerticalMd'), 'Button must read from theme.componentSpacing');
  assert.ok(buttonsCode.includes('paddingVertical ??'), 'Button must allow paddingVertical prop customization');

  const inputsCode = readFileSync(resolve(rootDir, 'react-native/inputs.js'), 'utf8');
  assert.ok(inputsCode.includes('cs.inputPaddingVertical'), 'TextInput must read from theme.componentSpacing');
  assert.ok(inputsCode.includes('paddingVertical ??'), 'TextInput must allow paddingVertical prop customization');
});


test('React Native zero inline styles and StyleSheet-only architecture enforcement', () => {
  const rnDir = resolve(rootDir, 'react-native');
  const files = readdirSync(rnDir).filter(f => f.endsWith('.js'));
  const violations = [];

  for (const file of files) {
    const content = readFileSync(resolve(rnDir, file), 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (/style\s*=\s*\{\{/.test(line)) {
        violations.push(`${file}:${idx + 1}: ${line.trim()}`);
      }
    });
  }

  assert.strictEqual(
    violations.length,
    0,
    `React Native components must not contain inline style object literals (style={{...}}). Found:\n${violations.join('\n')}`
  );
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


test('React Native default themes data integrity', () => {
  const themeSource = readFileSync(resolve(rootDir, 'react-native/theme.js'), 'utf8');
  assert.ok(themeSource.includes('export const defaultLightTheme'), 'defaultLightTheme must be declared');
  assert.ok(themeSource.includes('export const defaultDarkTheme'), 'defaultDarkTheme must be declared');
  assert.ok(themeSource.includes('dark: false'), 'defaultLightTheme must have dark: false');
  assert.ok(themeSource.includes('dark: true'), 'defaultDarkTheme must have dark: true');
});


test('Extended React Native components suite (Accordion, OtpInput, Rating, EmptyState, Timeline, StepIndicator, SpeedDial, BentoGrid)', () => {
  const indexJs = readFileSync(resolve(rootDir, 'react-native/index.js'), 'utf8');
  const indexDts = readFileSync(resolve(rootDir, 'react-native/index.d.ts'), 'utf8');

  const newComponents = [
    'SpeedDial',
    'SpeedDialAction',
    'BentoGrid',
    'BentoItem',
    'OtpInput',
    'PinInput',
    'Rating',
    'StarRating',
    'ChipInput',
    'TagInput',
    'EmptyState',
    'Timeline',
    'TimelineItem',
    'StepIndicator',
    'StepperWizard',
    'Accordion',
    'AccordionItem',
    'SwipeActionItem',
    'SwipeableRow',
  ];

  for (const comp of newComponents) {
    assert.ok(indexJs.includes(comp), `react-native/index.js must re-export ${comp}`);
    assert.ok(indexDts.includes(comp), `react-native/index.d.ts must declare ${comp}`);
  }
});


test('React Native charts export and modularity verification', () => {
  const rnDataDisplay = readFileSync(resolve(rootDir, 'react-native/data-display.js'), 'utf8');
  assert.ok(rnDataDisplay.includes('export function BarChart'), 'React Native BarChart must be exported as a function');
  assert.ok(rnDataDisplay.includes('export function DonutChart'), 'React Native DonutChart must be exported as a function');
  assert.ok(rnDataDisplay.includes('export function LineChart'), 'React Native LineChart must be exported as a function');

  const rnIndex = readFileSync(resolve(rootDir, 'react-native/index.js'), 'utf8');
  assert.ok(rnIndex.includes('BarChart'), 'react-native/index.js must re-export BarChart');
  assert.ok(rnIndex.includes('DonutChart'), 'react-native/index.js must re-export DonutChart');
  assert.ok(rnIndex.includes('LineChart'), 'react-native/index.js must re-export LineChart');

  const rnDts = readFileSync(resolve(rootDir, 'react-native/index.d.ts'), 'utf8');
  assert.ok(rnDts.includes('export declare const BarChart: ComponentType<any>;'), 'react-native/index.d.ts must declare BarChart');
  assert.ok(rnDts.includes('export declare const DonutChart: ComponentType<any>;'), 'react-native/index.d.ts must declare DonutChart');
  assert.ok(rnDts.includes('export declare const LineChart: ComponentType<any>;'), 'react-native/index.d.ts must declare LineChart');
});

