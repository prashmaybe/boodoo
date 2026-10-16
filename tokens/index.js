/**
 * boodoo Design Tokens
 * Exportable design constants for Web, React Native, and cross-platform UI.
 */

export const colors = {
  // Brand
  primary: '#7c3aed',
  primaryHover: '#6d28d9',
  primaryActive: '#5b21b6',
  secondary: '#06b6d4',
  secondaryHover: '#0891b2',
  secondaryActive: '#0e7490',

  // Status & Feedback
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',

  // Neutrals / Base
  dark: '#0f172a',
  light: '#f8fafc',
  white: '#ffffff',
  black: '#000000',

  // Grays
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a',

  // Dark mode surface tokens
  darkSurface: '#1e293b',
  darkCard: '#0f172a',
  darkBorder: '#334155',
};

export const createSpacing = (baseSpacer = 16) => ({
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

export const spacing = {
  0: 0,
  0.5: 8,
  1: 20,
  1.5: 28,
  2: 36,
  2.5: 44,
  3: 52,
  3.5: 60,
  4: 68,
  4.5: 76,
  5: 84,
  6: 100,
  8: 132,
  10: 164,
};

export const radii = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  fontFamily: 'System',
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const shadows = {
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

export const boodooTokens = {
  colors,
  spacing,
  radii,
  typography,
  shadows,
};

export default boodooTokens;
