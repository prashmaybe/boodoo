/**
 * boodoo Design Tokens (CommonJS)
 * Exportable design constants for Node / CJS consumers.
 */

const colors = {
  // Brand
  primary: '#7c3aed',
  primaryHover: '#6d28d9',
  primaryActive: '#5b21b6',
  secondary: '#5b21e6',
  secondaryHover: '#4c1bc0',
  secondaryActive: '#3d149c',

  // Status & Feedback
  success: '#1c9e50',
  warning: '#f59e0b',
  danger: '#e11d48',
  info: '#0ea5e9',

  // Neutrals / Base
  dark: '#17135f',
  light: '#f6f5fb',
  white: '#ffffff',
  black: '#000000',

  // Grays (Unified with Sass/LESS scale)
  gray50: '#f7f8fb',
  gray100: '#f7f8fb',
  gray200: '#ececf4',
  gray300: '#dedfec',
  gray400: '#c2c4d8',
  gray500: '#8b8fb0',
  gray600: '#5c6280',
  gray700: '#3f4463',
  gray800: '#272c4f',
  gray900: '#11143d',

  // Dark mode surface tokens
  darkSurface: '#272c4f',
  darkCard: '#17135f',
  darkBorder: '#3f4463',
};

const createSpacing = (baseSpacer = 16) => ({
  0: 0,
  0.5: Math.round(baseSpacer * 0.5),
  1: Math.round(baseSpacer * 1.25),
  1.5: Math.round(baseSpacer * 1.75),
  2: Math.round(baseSpacer * 2.25),
  2.5: Math.round(baseSpacer * 2.75),
  3: Math.round(baseSpacer * 3.25),
  3.5: Math.round(baseSpacer * 3.75),
  4: Math.round(baseSpacer * 4.25),
  4.5: Math.round(baseSpacer * 4.75),
  5: Math.round(baseSpacer * 5.25),
  6: Math.round(baseSpacer * 6.25),
  8: Math.round(baseSpacer * 8.25),
  10: Math.round(baseSpacer * 10.25),
});

const spacing = createSpacing(16);

const radii = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

const typography = {
  fontFamilies: {
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  fontWeights: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
};

const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
};

const boodooTokens = {
  colors,
  spacing,
  radii,
  typography,
  shadows,
};

module.exports = {
  colors,
  createSpacing,
  spacing,
  radii,
  typography,
  shadows,
  boodooTokens,
  default: boodooTokens,
};
