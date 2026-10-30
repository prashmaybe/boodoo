import React, { useState } from 'react';
import {
  View,
  Text as RNText,
  TouchableOpacity,
  ActivityIndicator as RNActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from './theme.js';

/**
 * Cross-platform Button compatible with Paper (mode), RNE (title/type),
 * Gluestack, Tamagui, UI Kitten (status/appearance), and Wix.
 */
export function Button({
  title,
  mode = 'contained',
  variant = 'primary',
  type = 'solid',
  status,
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconRight,
  onPress,
  children,
  paddingVertical,
  paddingHorizontal,
  style,
  textStyle,
  ...props
}) {
  const theme = useTheme();
  const cs = theme.componentSpacing || {};
  const sp = theme.spacing || {};

  const effectiveVariant =
    status ||
    (type === 'outline' ? 'outline' : type === 'clear' ? 'ghost' : null) ||
    (mode === 'outlined' ? 'outline' : mode === 'text' ? 'ghost' : variant);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
      case 'small':
        return {
          paddingVertical:
            paddingVertical ??
            cs.buttonPaddingVerticalSm ??
            cs.buttonSmY ??
            sp.buttonSmY ??
            7,
          paddingHorizontal:
            paddingHorizontal ??
            cs.buttonPaddingHorizontalSm ??
            cs.buttonSmX ??
            sp.buttonSmX ??
            12,
          borderRadius: theme.radii.md,
          fontSize: theme.typography.sizes.sm,
        };
      case 'lg':
      case 'large':
        return {
          paddingVertical:
            paddingVertical ??
            cs.buttonPaddingVerticalLg ??
            cs.buttonLgY ??
            sp.buttonLgY ??
            13,
          paddingHorizontal:
            paddingHorizontal ??
            cs.buttonPaddingHorizontalLg ??
            cs.buttonLgX ??
            sp.buttonLgX ??
            22,
          borderRadius: theme.radii.lg,
          fontSize: theme.typography.sizes.lg,
        };
      default:
        return {
          paddingVertical:
            paddingVertical ??
            cs.buttonPaddingVerticalMd ??
            cs.buttonPaddingY ??
            cs.buttonMdY ??
            sp.buttonMdY ??
            sp.buttonPaddingY ??
            10,
          paddingHorizontal:
            paddingHorizontal ??
            cs.buttonPaddingHorizontalMd ??
            cs.buttonPaddingX ??
            cs.buttonMdX ??
            sp.buttonMdX ??
            sp.buttonPaddingX ??
            16,
          borderRadius: theme.radii.md,
          fontSize: theme.typography.sizes.base,
        };
    }
  };

  const getVariantStyles = () => {
    switch (effectiveVariant) {
      case 'secondary':
        return { bg: theme.colors.secondary, text: '#ffffff', border: 'transparent' };
      case 'outline':
      case 'outlined':
        return { bg: 'transparent', text: theme.colors.primary, border: theme.colors.primary };
      case 'ghost':
      case 'text':
      case 'clear':
        return { bg: 'transparent', text: theme.colors.primary, border: 'transparent' };
      case 'soft':
        return {
          bg: theme.dark ? 'rgba(124, 58, 237, 0.2)' : '#ede9fe',
          text: theme.colors.primary,
          border: 'transparent',
        };
      case 'danger':
        return { bg: theme.colors.danger, text: '#ffffff', border: 'transparent' };
      case 'success':
        return { bg: theme.colors.success, text: '#ffffff', border: 'transparent' };
      case 'warning':
        return { bg: theme.colors.warning, text: '#ffffff', border: 'transparent' };
      case 'info':
        return { bg: theme.colors.info, text: '#ffffff', border: 'transparent' };
      default:
        return { bg: theme.colors.primary, text: '#ffffff', border: 'transparent' };
    }
  };

  const sizeCfg = getSizeStyles();
  const variantCfg = getVariantStyles();
  const labelContent = children !== undefined ? children : title;

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
          borderWidth: effectiveVariant === 'outline' || effectiveVariant === 'outlined' ? 1.5 : 0,
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
        <RNActivityIndicator size="small" color={variantCfg.text} />
      ) : (
        <View style={styles.rowCentered}>
          {icon && !iconRight ? <View style={styles.iconMarginRight}>{icon}</View> : null}
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
            {labelContent}
          </RNText>
          {icon && iconRight ? <View style={styles.iconMarginLeft}>{icon}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

/**
 * ButtonGroup (RNE UI / Gluestack / UI Kitten)
 */
export function ButtonGroup({
  buttons = [],
  selectedIndex = 0,
  onPress,
  containerStyle,
  buttonStyle,
  selectedButtonStyle,
  textStyle,
  selectedTextStyle,
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.segmentedContainer,
        {
          borderColor: theme.colors.border,
          borderRadius: theme.radii.md,
          backgroundColor: theme.colors.surface,
        },
        containerStyle,
      ]}
    >
      {buttons.map((btn, index) => {
        const isSelected = selectedIndex === index;
        const isLast = index === buttons.length - 1;
        const label = typeof btn === 'string' ? btn : btn.element || btn;

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.75}
            onPress={() => onPress && onPress(index)}
            style={[
              styles.segmentedButton,
              {
                backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                borderRightWidth: isLast ? 0 : 1,
                borderRightColor: theme.colors.border,
              },
              buttonStyle,
              isSelected ? selectedButtonStyle : null,
            ]}
          >
            {typeof label === 'string' ? (
              <RNText
                style={[
                  styles.segmentedLabel,
                  { color: isSelected ? '#ffffff' : theme.colors.text },
                  textStyle,
                  isSelected ? selectedTextStyle : null,
                ]}
              >
                {label}
              </RNText>
            ) : (
              label
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/**
 * IconButton
 */
export function IconButton({
  icon,
  size = 24,
  iconColor,
  containerColor,
  disabled = false,
  onPress,
  style,
  ...props
}) {
  const theme = useTheme();
  const color = iconColor || theme.colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.iconButtonBase,
        {
          width: size + 16,
          height: size + 16,
          borderRadius: (size + 16) / 2,
          backgroundColor: containerColor || 'transparent',
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}
      {...props}
    >
      {typeof icon === 'function' ? (
        icon({ size, color })
      ) : typeof icon === 'string' ? (
        <RNText style={[styles.iconButtonText, { fontSize: size * 0.75, color }]}>{icon}</RNText>
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
}

/**
 * FAB (Floating Action Button)
 */
export function FAB({
  icon,
  label,
  small = false,
  color,
  paddingVertical,
  paddingHorizontal,
  onPress,
  style,
  ...props
}) {
  const theme = useTheme();
  const cs = theme.componentSpacing || {};
  const sp = theme.spacing || {};
  const textColor = color || '#ffffff';

  const effPaddingVertical =
    paddingVertical ??
    (small
      ? cs.fabPaddingVerticalSm ?? sp.fabPaddingVerticalSm ?? 8
      : cs.fabPaddingVertical ?? sp.fabPaddingVertical ?? 12);
  const effPaddingHorizontal =
    paddingHorizontal ??
    (small
      ? cs.fabPaddingHorizontalSm ?? sp.fabPaddingHorizontalSm ?? 12
      : cs.fabPaddingHorizontal ?? sp.fabPaddingHorizontal ?? 18);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.fabBase,
        {
          backgroundColor: theme.colors.primary,
          paddingVertical: effPaddingVertical,
          paddingHorizontal: effPaddingHorizontal,
          borderRadius: theme.radii.full,
          ...theme.shadows.md,
        },
        style,
      ]}
      {...props}
    >
      <View style={styles.rowCentered}>
        {icon ? <View style={label ? styles.fabIconMargin : null}>{icon}</View> : null}
        {label ? (
          <RNText style={[styles.fabText, { color: textColor }]}>{label}</RNText>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

FAB.Group = function FABGroup({ open = false, onStateChange, icon, actions = [], style }) {
  const theme = useTheme();
  return (
    <View style={[styles.fabGroupContainer, style]}>
      {open ? (
        <View style={styles.fabGroupItems}>
          {actions.map((act, idx) => (
            <TouchableOpacity
              key={act.label || idx}
              style={[
                styles.fabGroupItem,
                { backgroundColor: theme.colors.surface, ...theme.shadows.sm },
              ]}
              onPress={act.onPress}
            >
              {act.label ? (
                <RNText style={[styles.fabGroupLabel, { color: theme.colors.text }]}>
                  {act.label}
                </RNText>
              ) : null}
              {act.icon}
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
      <FAB
        icon={icon}
        onPress={() => onStateChange && onStateChange({ open: !open })}
      />
    </View>
  );
};

export function SegmentedButtons({
  value,
  onValueChange,
  buttons = [],
  style,
  ...props
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.segmentedContainer,
        {
          borderColor: theme.colors.border,
          borderRadius: theme.radii.md,
          backgroundColor: theme.colors.surface,
        },
        style,
      ]}
      {...props}
    >
      {buttons.map((btn, index) => {
        const isSelected = value === btn.value;
        const isFirst = index === 0;
        const isLast = index === buttons.length - 1;

        return (
          <TouchableOpacity
            key={btn.value || index}
            activeOpacity={0.7}
            disabled={btn.disabled}
            onPress={() => onValueChange && onValueChange(btn.value)}
            style={[
              styles.segmentedButton,
              {
                backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                borderTopLeftRadius: isFirst ? theme.radii.md - 1 : 0,
                borderBottomLeftRadius: isFirst ? theme.radii.md - 1 : 0,
                borderTopRightRadius: isLast ? theme.radii.md - 1 : 0,
                borderBottomRightRadius: isLast ? theme.radii.md - 1 : 0,
                borderRightWidth: isLast ? 0 : 1,
                borderRightColor: theme.colors.border,
                opacity: btn.disabled ? 0.5 : 1,
              },
              btn.style,
            ]}
          >
            <View style={styles.rowCentered}>
              {btn.icon ? <View style={styles.iconMarginRight}>{btn.icon}</View> : null}
              <RNText
                style={[
                  styles.segmentedLabel,
                  {
                    color: isSelected ? '#ffffff' : theme.colors.text,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {btn.label}
              </RNText>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/**
 * SpeedDial & SpeedDialAction
 * Expanding floating action button menu with labeled sub-actions.
 */
export function SpeedDialAction({
  icon,
  title,
  onPress,
  color,
  style,
  ...props
}) {
  const theme = useTheme();
  const bg = color || theme.colors.surface;
  const textColor = theme.colors.text;

  const dynamicLabel = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  };

  const dynamicBtn = {
    backgroundColor: bg,
    borderColor: theme.colors.border,
  };

  return (
    <View style={[styles.speedDialActionRow, style]} {...props}>
      {title ? (
        <View style={[styles.speedDialActionLabelBox, dynamicLabel]}>
          <RNText style={[styles.speedDialActionLabelText, { color: textColor }]}>{title}</RNText>
        </View>
      ) : null}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[styles.speedDialActionBtn, dynamicBtn]}
      >
        {typeof icon === 'string' ? (
          <RNText style={[styles.speedDialActionIcon, { color: theme.colors.primary }]}>{icon}</RNText>
        ) : icon}
      </TouchableOpacity>
    </View>
  );
}

export function SpeedDial({
  open,
  defaultOpen = false,
  onOpen,
  onClose,
  icon = '+',
  openIcon = '✕',
  color,
  style,
  children,
  ...props
}) {
  const theme = useTheme();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open !== undefined ? open : internalOpen;

  const toggle = () => {
    if (isOpen) {
      if (onClose) onClose();
      else setInternalOpen(false);
    } else {
      if (onOpen) onOpen();
      else setInternalOpen(true);
    }
  };

  const fabColor = color || theme.colors.primary;

  return (
    <View style={[styles.speedDialWrapper, style]} pointerEvents="box-none" {...props}>
      {isOpen ? (
        <View style={styles.speedDialActionsContainer} pointerEvents="box-none">
          {children}
        </View>
      ) : null}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={toggle}
        style={[styles.speedDialMainFab, { backgroundColor: fabColor }]}
      >
        <RNText style={styles.speedDialMainIcon}>
          {isOpen ? openIcon : icon}
        </RNText>
      </TouchableOpacity>
    </View>
  );
}
SpeedDial.Action = SpeedDialAction;

const styles = StyleSheet.create({
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconButtonBase: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabBase: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontWeight: '700',
    fontSize: 14,
  },
  fabGroupContainer: {
    alignItems: 'flex-end',
  },
  fabGroupItems: {
    marginBottom: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  fabGroupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
  fabGroupLabel: {
    marginRight: 8,
    fontWeight: '600',
    fontSize: 13,
  },
  segmentedContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    overflow: 'hidden',
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentedLabel: {
    fontSize: 13,
  },
  iconMarginRight: {
    marginRight: 6,
  },
  iconMarginLeft: {
    marginLeft: 6,
  },
  iconButtonText: {
    fontWeight: '700',
  },
  fabIconMargin: {
    marginRight: 8,
  },
  speedDialWrapper: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'flex-end',
    zIndex: 1000,
  },
  speedDialActionsContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
    gap: 10,
  },
  speedDialActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  speedDialActionLabelBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  speedDialActionLabelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  speedDialActionBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  speedDialActionIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  speedDialMainFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  speedDialMainIcon: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
});
