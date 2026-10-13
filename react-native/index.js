import React from 'react';
import {
  View,
  Text as RNText,
  TouchableOpacity,
  TextInput as RNTextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from './theme.js';

/**
 * Boodoo Text Component
 */
export function Text({
  variant = 'body',
  color,
  style,
  children,
  ...props
}) {
  const theme = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return { fontSize: theme.typography.sizes['4xl'], fontWeight: '700', lineHeight: 42 };
      case 'h2':
        return { fontSize: theme.typography.sizes['3xl'], fontWeight: '700', lineHeight: 36 };
      case 'h3':
        return { fontSize: theme.typography.sizes['2xl'], fontWeight: '600', lineHeight: 30 };
      case 'h4':
        return { fontSize: theme.typography.sizes.xl, fontWeight: '600', lineHeight: 26 };
      case 'lead':
        return { fontSize: theme.typography.sizes.lg, fontWeight: '400', lineHeight: 26, color: theme.colors.textMuted };
      case 'muted':
        return { fontSize: theme.typography.sizes.sm, color: theme.colors.textMuted };
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
 * Boodoo Button Component
 */
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
  children,
  style,
  textStyle,
  ...props
}) {
  const theme = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: theme.spacing[1] + 2,
          paddingHorizontal: theme.spacing[3],
          borderRadius: theme.radii.md,
          fontSize: theme.typography.sizes.sm,
        };
      case 'lg':
        return {
          paddingVertical: theme.spacing[3] + 2,
          paddingHorizontal: theme.spacing[5],
          borderRadius: theme.radii.lg,
          fontSize: theme.typography.sizes.lg,
        };
      default:
        return {
          paddingVertical: theme.spacing[2] + 3,
          paddingHorizontal: theme.spacing[4],
          borderRadius: theme.radii.md,
          fontSize: theme.typography.sizes.base,
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          bg: theme.colors.secondary,
          text: '#ffffff',
          border: 'transparent',
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: theme.colors.primary,
          border: theme.colors.primary,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: theme.colors.primary,
          border: 'transparent',
        };
      case 'soft':
        return {
          bg: theme.dark ? 'rgba(124, 58, 237, 0.2)' : '#ede9fe',
          text: theme.colors.primary,
          border: 'transparent',
        };
      case 'danger':
        return {
          bg: theme.colors.danger,
          text: '#ffffff',
          border: 'transparent',
        };
      case 'success':
        return {
          bg: theme.colors.success,
          text: '#ffffff',
          border: 'transparent',
        };
      default:
        return {
          bg: theme.colors.primary,
          text: '#ffffff',
          border: 'transparent',
        };
    }
  };

  const sizeCfg = getSizeStyles();
  const variantCfg = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.buttonBase,
        {
          backgroundColor: disabled ? theme.colors.border : variantCfg.bg,
          borderColor: disabled ? 'transparent' : variantCfg.border,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          paddingVertical: sizeCfg.paddingVertical,
          paddingHorizontal: sizeCfg.paddingHorizontal,
          borderRadius: sizeCfg.borderRadius,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantCfg.text} />
      ) : (
        <RNText
          style={[
            styles.buttonText,
            {
              color: disabled ? theme.colors.textMuted : variantCfg.text,
              fontSize: sizeCfg.fontSize,
            },
            textStyle,
          ]}
        >
          {children}
        </RNText>
      )}
    </TouchableOpacity>
  );
}

/**
 * Boodoo Card Component
 */
export function Card({
  variant = 'elevated',
  children,
  style,
  ...props
}) {
  const theme = useTheme();

  const getCardStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'flat':
        return {
          backgroundColor: theme.colors.surface,
        };
      default: // elevated
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.md,
        };
    }
  };

  return (
    <View
      style={[
        styles.cardBase,
        {
          borderRadius: theme.radii.lg,
          padding: theme.spacing[4],
        },
        getCardStyle(),
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

Card.Title = function CardTitle({ title, subtitle, style }) {
  const theme = useTheme();
  return (
    <View style={[{ marginBottom: theme.spacing[2] }, style]}>
      <Text variant="h4" style={{ fontWeight: '700' }}>{title}</Text>
      {subtitle ? <Text variant="muted" style={{ marginTop: 2 }}>{subtitle}</Text> : null}
    </View>
  );
};

Card.Content = function CardContent({ children, style }) {
  const theme = useTheme();
  return (
    <View style={[{ marginVertical: theme.spacing[2] }, style]}>
      {children}
    </View>
  );
};

Card.Actions = function CardActions({ children, style }) {
  const theme = useTheme();
  return (
    <View style={[styles.cardActions, { marginTop: theme.spacing[3] }, style]}>
      {children}
    </View>
  );
};

/**
 * Boodoo Badge Component
 */
export function Badge({
  variant = 'primary',
  children,
  style,
  textStyle,
  ...props
}) {
  const theme = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { bg: theme.colors.success, text: '#ffffff' };
      case 'warning':
        return { bg: theme.colors.warning, text: '#ffffff' };
      case 'danger':
        return { bg: theme.colors.danger, text: '#ffffff' };
      case 'secondary':
        return { bg: theme.colors.secondary, text: '#ffffff' };
      case 'soft':
        return { bg: theme.dark ? 'rgba(124, 58, 237, 0.2)' : '#ede9fe', text: theme.colors.primary };
      default:
        return { bg: theme.colors.primary, text: '#ffffff' };
    }
  };

  const v = getVariantStyles();

  return (
    <View
      style={[
        styles.badgeBase,
        {
          backgroundColor: v.bg,
          paddingVertical: 3,
          paddingHorizontal: 8,
          borderRadius: theme.radii.full,
        },
        style,
      ]}
      {...props}
    >
      <RNText
        style={[
          styles.badgeText,
          {
            color: v.text,
            fontSize: theme.typography.sizes.xs,
          },
          textStyle,
        ]}
      >
        {children}
      </RNText>
    </View>
  );
}

/**
 * Boodoo TextInput Component
 */
export function TextInput({
  label,
  error,
  style,
  inputStyle,
  ...props
}) {
  const theme = useTheme();

  return (
    <View style={[{ marginBottom: theme.spacing[3] }, style]}>
      {label ? (
        <Text style={{ fontSize: theme.typography.sizes.sm, fontWeight: '600', marginBottom: 6 }}>
          {label}
        </Text>
      ) : null}
      <RNTextInput
        placeholderTextColor={theme.colors.textMuted}
        style={[
          styles.inputBase,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            color: theme.colors.text,
            borderRadius: theme.radii.md,
            paddingHorizontal: theme.spacing[3],
            paddingVertical: theme.spacing[2] + 2,
            fontSize: theme.typography.sizes.base,
          },
          inputStyle,
        ]}
        {...props}
      />
      {error ? (
        <Text style={{ color: theme.colors.danger, fontSize: theme.typography.sizes.xs, marginTop: 4 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  cardBase: {
    overflow: 'hidden',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  badgeBase: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontWeight: '700',
  },
  inputBase: {
    borderWidth: 1,
  },
});

export { BoodooProvider, useTheme } from './theme.js';
export { boodooPaperLightTheme, boodooPaperDarkTheme } from './paper.js';
