import React from 'react';
import { Text as RNText } from 'react-native';
import { useTheme } from './theme.js';

/**
 * Universal Text component supporting Paper variants, RNE UI heading props,
 * Gluestack Heading/Text, and UI Kitten / Wix typography tokens.
 */
export function Text({
  variant = 'body',
  h1,
  h2,
  h3,
  h4,
  category,
  color,
  style,
  children,
  ...props
}) {
  const theme = useTheme();

  const getVariantStyle = () => {
    if (h1) return { fontSize: theme.typography.sizes['4xl'], fontWeight: '700', lineHeight: 42 };
    if (h2) return { fontSize: theme.typography.sizes['3xl'], fontWeight: '700', lineHeight: 36 };
    if (h3) return { fontSize: theme.typography.sizes['2xl'], fontWeight: '600', lineHeight: 30 };
    if (h4) return { fontSize: theme.typography.sizes.xl, fontWeight: '600', lineHeight: 26 };

    const effective = category || variant;
    switch (effective) {
      case 'displayLarge':
      case 'h1':
        return { fontSize: theme.typography.sizes['4xl'], fontWeight: '700', lineHeight: 42 };
      case 'displayMedium':
      case 'h2':
        return { fontSize: theme.typography.sizes['3xl'], fontWeight: '700', lineHeight: 36 };
      case 'displaySmall':
      case 'h3':
        return { fontSize: theme.typography.sizes['2xl'], fontWeight: '600', lineHeight: 30 };
      case 'headlineMedium':
      case 'h4':
        return { fontSize: theme.typography.sizes.xl, fontWeight: '600', lineHeight: 26 };
      case 'titleMedium':
      case 'lead':
        return { fontSize: theme.typography.sizes.lg, fontWeight: '500', lineHeight: 26, color: theme.colors.textMuted };
      case 'bodySmall':
      case 'c1':
      case 'muted':
        return { fontSize: theme.typography.sizes.sm, color: theme.colors.textMuted };
      case 'labelSmall':
      case 'c2':
      case 'caption':
        return { fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted };
      default:
        return { fontSize: theme.typography.sizes.base, lineHeight: 22 };
    }
  };

  return (
    <RNText
      style={[
        { color: color || theme.colors.text },
        getVariantStyle(),
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

/**
 * Heading component (Gluestack / RNE UI / Tamagui)
 */
export function Heading({ size = 'xl', style, children, ...props }) {
  const theme = useTheme();
  const fontSizes = {
    '2xs': theme.typography.sizes.xs,
    xs: theme.typography.sizes.sm,
    sm: theme.typography.sizes.base,
    md: theme.typography.sizes.lg,
    lg: theme.typography.sizes.xl,
    xl: theme.typography.sizes['2xl'],
    '2xl': theme.typography.sizes['3xl'],
    '3xl': theme.typography.sizes['4xl'],
  };
  return (
    <RNText
      style={[
        {
          fontSize: fontSizes[size] || theme.typography.sizes.xl,
          fontWeight: '700',
          color: theme.colors.text,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}
