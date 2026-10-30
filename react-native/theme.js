import React, { createContext, useContext, useMemo } from 'react';
import { colors, spacing, radii, typography, shadows } from '../tokens/index.js';

/**
 * Creates a proportional component spacing map based on a baseSpacer (default: 16).
 * Mirrors web CSS custom properties (--boodoo-card-spacer-y, --boodoo-btn-padding-y, etc.)
 * allowing seamless density customization across React Native applications.
 */
export const createComponentSpacing = (baseSpacer = 16, overrides = {}) => {
  const scale = baseSpacer / 16;
  return {
    // Base reference
    baseSpacer,

    // Card & Surface
    card: Math.round(16 * scale),
    cardPadding: Math.round(16 * scale),
    cardTitleMarginBottom: Math.round(8 * scale),
    cardContentMarginVertical: Math.round(4 * scale),
    cardActionsMarginTop: Math.round(12 * scale),
    cardActionsGap: Math.round(8 * scale),
    surface: Math.round(16 * scale),
    surfacePadding: Math.round(16 * scale),
    statWidgetPadding: Math.round(16 * scale),
    pricingCardPadding: Math.round(20 * scale),
    pricingCardMarginVertical: Math.round(8 * scale),

    // Button
    buttonPaddingVerticalSm: Math.round(7 * scale),
    buttonPaddingHorizontalSm: Math.round(12 * scale),
    buttonPaddingVerticalMd: Math.round(10 * scale),
    buttonPaddingHorizontalMd: Math.round(16 * scale),
    buttonPaddingVerticalLg: Math.round(13 * scale),
    buttonPaddingHorizontalLg: Math.round(22 * scale),
    buttonGap: Math.round(6 * scale),
    fabPaddingVerticalSm: Math.round(8 * scale),
    fabPaddingHorizontalSm: Math.round(12 * scale),
    fabPaddingVertical: Math.round(12 * scale),
    fabPaddingHorizontal: Math.round(18 * scale),

    // Inputs & Forms
    inputMarginBottom: Math.round(14 * scale),
    inputPaddingVertical: Math.round(10 * scale),
    inputPaddingHorizontal: Math.round(12 * scale),
    inputGap: Math.round(6 * scale),

    // Lists & Navigation
    listSectionMarginVertical: Math.round(8 * scale),
    listItemPaddingVertical: Math.round(12 * scale),
    listItemPaddingHorizontal: Math.round(16 * scale),
    drawerSectionMarginVertical: Math.round(8 * scale),
    drawerItemPaddingVertical: Math.round(10 * scale),
    drawerItemPaddingHorizontal: Math.round(16 * scale),

    // Overlays & Modals
    dialogPadding: Math.round(20 * scale),
    dialogTitleMarginBottom: Math.round(8 * scale),
    dialogActionsMarginTop: Math.round(12 * scale),
    modalPadding: Math.round(16 * scale),
    bottomSheetPadding: Math.round(16 * scale),
    bottomSheetPaddingBottom: Math.round(28 * scale),

    // Feedback
    alertPadding: Math.round(12 * scale),
    bannerPadding: Math.round(14 * scale),
    toastPaddingVertical: Math.round(10 * scale),
    toastPaddingHorizontal: Math.round(14 * scale),
    chatBubblePaddingVertical: Math.round(8 * scale),
    chatBubblePaddingHorizontal: Math.round(12 * scale),

    ...overrides,
  };
};

export const defaultComponentSpacing = createComponentSpacing(16);

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
  componentSpacing: defaultComponentSpacing,
  radii,
  typography,
  shadows,
};

export const defaultDarkTheme = {
  dark: true,
  colors: {
    primary: '#a78bfa',
    secondary: '#818cf8',
    background: colors.dark,
    surface: colors.darkSurface,
    card: colors.darkCard,
    text: colors.light,
    textMuted: colors.gray400,
    border: colors.darkBorder,
    notification: '#fb7185',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#fb7185',
    info: '#38bdf8',
  },
  spacing,
  componentSpacing: defaultComponentSpacing,
  radii,
  typography,
  shadows,
};

const BoodooThemeContext = createContext(defaultLightTheme);

export function BoodooProvider({ theme = 'light', customTheme = {}, children }) {
  const activeTheme = useMemo(() => {
    const base = theme === 'dark' ? defaultDarkTheme : defaultLightTheme;

    // Detect baseSpacer or customized spacing scale to adapt component spacing dynamically
    let derivedComponentSpacing = {};
    if (customTheme.baseSpacer) {
      derivedComponentSpacing = createComponentSpacing(customTheme.baseSpacer);
    } else if (
      customTheme.spacing &&
      typeof customTheme.spacing[0.5] === 'number' &&
      customTheme.spacing[0.5] !== 8
    ) {
      const detectedBase = customTheme.spacing[0.5] * 2;
      derivedComponentSpacing = createComponentSpacing(detectedBase);
    }

    const mergedComponentSpacing = {
      ...base.componentSpacing,
      ...derivedComponentSpacing,
      ...(customTheme.componentSpacing || {}),
    };

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
      componentSpacing: mergedComponentSpacing,
    };
  }, [theme, customTheme]);

  return React.createElement(
    BoodooThemeContext.Provider,
    { value: activeTheme },
    children
  );
}

export function useTheme() {
  const context = useContext(BoodooThemeContext);
  if (!context) {
    return defaultLightTheme;
  }
  return context;
}
