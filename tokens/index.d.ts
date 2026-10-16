export interface BoodooColorTokens {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  secondary: string;
  secondaryHover: string;
  secondaryActive: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  dark: string;
  light: string;
  white: string;
  black: string;
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray600: string;
  gray700: string;
  gray800: string;
  gray900: string;
  darkSurface: string;
  darkCard: string;
  darkBorder: string;
}

export interface BoodooSpacingScale {
  0: number;
  0.5: number;
  1: number;
  1.5: number;
  2: number;
  2.5: number;
  3: number;
  3.5: number;
  4: number;
  4.5: number;
  5: number;
  6: number;
  8: number;
  10: number;
  [key: string]: number;
}

export interface BoodooRadiiScale {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface BoodooTypographyTokens {
  fontFamily: string;
  sizes: Record<string, number>;
  weights: Record<string, string>;
  lineHeights: Record<string, number>;
}

export interface BoodooShadowTokens {
  none: Record<string, unknown>;
  sm: Record<string, unknown>;
  md: Record<string, unknown>;
  lg: Record<string, unknown>;
}

export declare const colors: BoodooColorTokens;
export declare const spacing: BoodooSpacingScale;
export declare const radii: BoodooRadiiScale;
export declare const typography: BoodooTypographyTokens;
export declare const shadows: BoodooShadowTokens;

export declare function createSpacing(baseSpacer?: number): BoodooSpacingScale;

export interface BoodooTokensBundle {
  colors: BoodooColorTokens;
  spacing: BoodooSpacingScale;
  radii: BoodooRadiiScale;
  typography: BoodooTypographyTokens;
  shadows: BoodooShadowTokens;
}

declare const boodooTokens: BoodooTokensBundle;
export default boodooTokens;
