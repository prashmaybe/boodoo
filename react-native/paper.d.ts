import type { ComponentType } from 'react';

export interface BoodooPaperThemeColors {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  elevation: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
  surfaceDisabled: string;
  onSurfaceDisabled: string;
  backdrop: string;
}

export interface BoodooPaperTheme {
  version: number;
  isV3: boolean;
  dark: boolean;
  roundness: number;
  colors: BoodooPaperThemeColors;
}

export declare const boodooPaperLightTheme: BoodooPaperTheme;
export declare const boodooPaperDarkTheme: BoodooPaperTheme;

declare const _default: {
  light: BoodooPaperTheme;
  dark: BoodooPaperTheme;
};

export default _default;

