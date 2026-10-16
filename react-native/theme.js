import React, { createContext, useContext, useMemo } from 'react';
import { colors, spacing, radii, typography, shadows } from '../tokens/index.js';

export const defaultLightTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.light,
    surface: colors.white,
    card: colors.white,
    text: colors.dark,
    textMuted: colors.gray500,
    border: colors.gray200,
    notification: colors.danger,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.info,
  },
  spacing,
  radii,
  typography,
  shadows,
};

export const defaultDarkTheme = {
  dark: true,
  colors: {
    primary: '#a78bfa',
    secondary: '#22d3ee',
    background: colors.dark,
    surface: colors.darkSurface,
    card: colors.darkCard,
    text: colors.light,
    textMuted: colors.gray400,
    border: colors.darkBorder,
    notification: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
    info: '#60a5fa',
  },
  spacing,
  radii,
  typography,
  shadows,
};

const BoodooThemeContext = createContext(defaultLightTheme);

export function BoodooProvider({ theme = 'light', customTheme = {}, children }) {
  const activeTheme = useMemo(() => {
    const base = theme === 'dark' ? defaultDarkTheme : defaultLightTheme;
    return {
      ...base,
      ...customTheme,
      colors: {
        ...base.colors,
        ...(customTheme.colors || {}),
      },
      spacing: {
        ...base.spacing,
        ...(customTheme.spacing || {}),
      },
    };
  }, [theme, customTheme]);

  return (
    <BoodooThemeContext.Provider value={activeTheme}>
      {children}
    </BoodooThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(BoodooThemeContext);
  if (!context) {
    return defaultLightTheme;
  }
  return context;
}
