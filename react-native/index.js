import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text as RNText,
  TouchableOpacity,
  TextInput as RNTextInput,
  StyleSheet,
  ActivityIndicator as RNActivityIndicator,
  Switch as RNSwitch,
  Modal as RNModal,
  ScrollView,
  Image,
} from 'react-native';
import { useTheme } from './theme.js';

/* -------------------------------------------------------------------------- */
/*                                    TEXT                                    */
/* -------------------------------------------------------------------------- */
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
      case 'muted':
        return { fontSize: theme.typography.sizes.sm, color: theme.colors.textMuted };
      case 'labelSmall':
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

/* -------------------------------------------------------------------------- */
/*                                   BUTTON                                   */
/* -------------------------------------------------------------------------- */
export function Button({
  mode = 'contained',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  onPress,
  children,
  style,
  textStyle,
  ...props
}) {
  const theme = useTheme();

  const effectiveVariant = mode === 'outlined' ? 'outline' : mode === 'text' ? 'ghost' : variant;

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
    switch (effectiveVariant) {
      case 'secondary':
        return { bg: theme.colors.secondary, text: '#ffffff', border: 'transparent' };
      case 'outline':
      case 'outlined':
        return { bg: 'transparent', text: theme.colors.primary, border: theme.colors.primary };
      case 'ghost':
      case 'text':
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
      default:
        return { bg: theme.colors.primary, text: '#ffffff', border: 'transparent' };
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
          {icon ? <View style={{ marginRight: 6 }}>{icon}</View> : null}
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
        </View>
      )}
    </TouchableOpacity>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 ICON BUTTON                                */
/* -------------------------------------------------------------------------- */
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
        <RNText style={{ fontSize: size * 0.75, color, fontWeight: '700' }}>{icon}</RNText>
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
}

/* -------------------------------------------------------------------------- */
/*                                     FAB                                    */
/* -------------------------------------------------------------------------- */
export function FAB({
  icon,
  label,
  small = false,
  color,
  onPress,
  style,
  ...props
}) {
  const theme = useTheme();
  const textColor = color || '#ffffff';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.fabBase,
        {
          backgroundColor: theme.colors.primary,
          paddingVertical: small ? 8 : 14,
          paddingHorizontal: small ? 14 : 20,
          borderRadius: theme.radii.full,
          ...theme.shadows.md,
        },
        style,
      ]}
      {...props}
    >
      <View style={styles.rowCentered}>
        {icon ? <View style={{ marginRight: label ? 8 : 0 }}>{icon}</View> : null}
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

/* -------------------------------------------------------------------------- */
/*                             ACTIVITY INDICATOR                             */
/* -------------------------------------------------------------------------- */
export function ActivityIndicator({
  animating = true,
  color,
  size = 'small',
  style,
  ...props
}) {
  const theme = useTheme();
  if (!animating) return null;
  return (
    <RNActivityIndicator
      size={size}
      color={color || theme.colors.primary}
      style={style}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                 SEGMENTED BUTTONS                          */
/* -------------------------------------------------------------------------- */
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
                backgroundColor: isSelected
                  ? theme.colors.primary
                  : 'transparent',
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
              {btn.icon ? <View style={{ marginRight: 6 }}>{btn.icon}</View> : null}
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

/* -------------------------------------------------------------------------- */
/*                                    CARD                                    */
/* -------------------------------------------------------------------------- */
export function Card({
  mode = 'elevated',
  variant = 'elevated',
  children,
  style,
  ...props
}) {
  const theme = useTheme();
  const effectiveMode = mode || variant;

  const getCardStyle = () => {
    switch (effectiveMode) {
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'flat':
      case 'contained':
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

Card.Title = function CardTitle({ title, subtitle, left, right, style }) {
  const theme = useTheme();
  return (
    <View style={[styles.cardTitleRow, { marginBottom: theme.spacing[2] }, style]}>
      {left ? <View style={{ marginRight: 12 }}>{left()}</View> : null}
      <View style={{ flex: 1 }}>
        <Text variant="h4" style={{ fontWeight: '700' }}>{title}</Text>
        {subtitle ? <Text variant="muted" style={{ marginTop: 2 }}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={{ marginLeft: 12 }}>{right()}</View> : null}
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

Card.Cover = function CardCover({ source, style, ...props }) {
  const theme = useTheme();
  return (
    <Image
      source={source}
      style={[
        styles.cardCover,
        {
          borderTopLeftRadius: theme.radii.lg,
          borderTopRightRadius: theme.radii.lg,
        },
        style,
      ]}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                                   SURFACE                                  */
/* -------------------------------------------------------------------------- */
export function Surface({
  elevation = 1,
  children,
  style,
  ...props
}) {
  const theme = useTheme();
  const shadowStyle =
    elevation >= 4
      ? theme.shadows.lg
      : elevation >= 2
      ? theme.shadows.md
      : elevation >= 1
      ? theme.shadows.sm
      : theme.shadows.none;

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.md,
          padding: theme.spacing[3],
        },
        shadowStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   DIVIDER                                  */
/* -------------------------------------------------------------------------- */
export function Divider({
  bold = false,
  inset = false,
  style,
  ...props
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          height: bold ? 2 : StyleSheet.hairlineWidth || 1,
          backgroundColor: theme.colors.border,
          marginLeft: inset ? 72 : 0,
        },
        style,
      ]}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                 TEXT INPUT                                 */
/* -------------------------------------------------------------------------- */
export function TextInput({
  label,
  error,
  mode = 'outlined',
  left,
  right,
  style,
  inputStyle,
  ...props
}) {
  const theme = useTheme();
  const isFlat = mode === 'flat';

  return (
    <View style={[{ marginBottom: theme.spacing[3] }, style]}>
      {label ? (
        <Text style={{ fontSize: theme.typography.sizes.sm, fontWeight: '600', marginBottom: 6 }}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            borderWidth: isFlat ? 0 : 1,
            borderBottomWidth: isFlat ? 2 : 1,
            borderBottomColor: error ? theme.colors.danger : isFlat ? theme.colors.primary : theme.colors.border,
            borderRadius: isFlat ? 0 : theme.radii.md,
          },
        ]}
      >
        {left ? <View style={{ paddingLeft: 12 }}>{left}</View> : null}
        <RNTextInput
          placeholderTextColor={theme.colors.textMuted}
          style={[
            styles.inputBase,
            {
              color: theme.colors.text,
              fontSize: theme.typography.sizes.base,
              paddingHorizontal: theme.spacing[3],
              paddingVertical: theme.spacing[2] + 2,
            },
            inputStyle,
          ]}
          {...props}
        />
        {right ? <View style={{ paddingRight: 12 }}>{right}</View> : null}
      </View>
      {error ? (
        <Text style={{ color: theme.colors.danger, fontSize: theme.typography.sizes.xs, marginTop: 4 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  SEARCHBAR                                 */
/* -------------------------------------------------------------------------- */
export function Searchbar({
  placeholder = 'Search',
  value,
  onChangeText,
  onClearIconPress,
  icon,
  style,
  inputStyle,
  ...props
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.searchbarContainer,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.full,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        },
        style,
      ]}
    >
      <View style={{ marginLeft: 12 }}>
        {icon || <RNText style={{ color: theme.colors.textMuted }}>🔍</RNText>}
      </View>
      <RNTextInput
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.searchbarInput,
          {
            color: theme.colors.text,
            fontSize: theme.typography.sizes.base,
          },
          inputStyle,
        ]}
        {...props}
      />
      {value ? (
        <TouchableOpacity
          onPress={() => {
            if (onClearIconPress) onClearIconPress();
            if (onChangeText) onChangeText('');
          }}
          style={{ marginRight: 12 }}
        >
          <RNText style={{ color: theme.colors.textMuted, fontSize: 16 }}>✕</RNText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 HELPER TEXT                                */
/* -------------------------------------------------------------------------- */
export function HelperText({
  type = 'info',
  visible = true,
  children,
  style,
  ...props
}) {
  const theme = useTheme();
  if (!visible) return null;

  const isError = type === 'error';
  return (
    <RNText
      style={[
        styles.helperText,
        {
          color: isError ? theme.colors.danger : theme.colors.textMuted,
          fontSize: theme.typography.sizes.xs,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  CHECKBOX                                  */
/* -------------------------------------------------------------------------- */
export function Checkbox({
  status = 'unchecked',
  disabled = false,
  onPress,
  color,
  uncheckedColor,
  style,
}) {
  const theme = useTheme();
  const checked = status === 'checked';
  const activeColor = color || theme.colors.primary;
  const inactiveColor = uncheckedColor || theme.colors.border;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.checkboxBox,
        {
          borderColor: checked ? activeColor : inactiveColor,
          backgroundColor: checked ? activeColor : 'transparent',
          borderRadius: 4,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {checked ? <RNText style={styles.checkboxCheck}>✓</RNText> : null}
    </TouchableOpacity>
  );
}

Checkbox.Item = function CheckboxItem({ label, status, onPress, disabled, style, labelStyle }) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[styles.selectionItem, style]}
    >
      <RNText
        style={[
          styles.selectionLabel,
          { color: theme.colors.text, opacity: disabled ? 0.5 : 1 },
          labelStyle,
        ]}
      >
        {label}
      </RNText>
      <Checkbox status={status} disabled={disabled} onPress={onPress} />
    </TouchableOpacity>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 RADIO BUTTON                               */
/* -------------------------------------------------------------------------- */
const RadioGroupContext = createContext(null);

export function RadioButton({
  value,
  status,
  disabled = false,
  onPress,
  color,
  style,
}) {
  const theme = useTheme();
  const groupCtx = useContext(RadioGroupContext);
  const checked = groupCtx ? groupCtx.value === value : status === 'checked';
  const activeColor = color || theme.colors.primary;

  const handlePress = () => {
    if (disabled) return;
    if (groupCtx && groupCtx.onValueChange) {
      groupCtx.onValueChange(value);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={handlePress}
      style={[
        styles.radioOuter,
        {
          borderColor: checked ? activeColor : theme.colors.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {checked ? (
        <View style={[styles.radioInner, { backgroundColor: activeColor }]} />
      ) : null}
    </TouchableOpacity>
  );
}

RadioButton.Group = function RadioButtonGroup({ value, onValueChange, children }) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      {children}
    </RadioGroupContext.Provider>
  );
};

RadioButton.Item = function RadioButtonItem({ label, value, status, onPress, disabled, style, labelStyle }) {
  const theme = useTheme();
  const groupCtx = useContext(RadioGroupContext);
  const checked = groupCtx ? groupCtx.value === value : status === 'checked';

  const handlePress = () => {
    if (disabled) return;
    if (groupCtx && groupCtx.onValueChange) {
      groupCtx.onValueChange(value);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={handlePress}
      style={[styles.selectionItem, style]}
    >
      <RNText
        style={[
          styles.selectionLabel,
          { color: theme.colors.text, opacity: disabled ? 0.5 : 1 },
          labelStyle,
        ]}
      >
        {label}
      </RNText>
      <RadioButton value={value} status={checked ? 'checked' : 'unchecked'} disabled={disabled} onPress={handlePress} />
    </TouchableOpacity>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    SWITCH                                  */
/* -------------------------------------------------------------------------- */
export function Switch({
  value = false,
  onValueChange,
  disabled = false,
  color,
  style,
  ...props
}) {
  const theme = useTheme();
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: theme.colors.border,
        true: color || theme.colors.primary,
      }}
      thumbColor={'#ffffff'}
      style={style}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                TOGGLE BUTTON                               */
/* -------------------------------------------------------------------------- */
const ToggleGroupContext = createContext(null);

export function ToggleButton({
  icon,
  value,
  status,
  disabled = false,
  onPress,
  style,
  ...props
}) {
  const theme = useTheme();
  const groupCtx = useContext(ToggleGroupContext);
  const isChecked = groupCtx ? groupCtx.value === value : status === 'checked';

  const handlePress = () => {
    if (disabled) return;
    if (groupCtx && groupCtx.onValueChange) {
      groupCtx.onValueChange(groupCtx.value === value ? null : value);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={handlePress}
      style={[
        styles.toggleButton,
        {
          backgroundColor: isChecked ? (theme.dark ? 'rgba(124, 58, 237, 0.25)' : '#ede9fe') : 'transparent',
          borderColor: theme.colors.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...props}
    >
      {typeof icon === 'function' ? (
        icon({ color: isChecked ? theme.colors.primary : theme.colors.text })
      ) : typeof icon === 'string' ? (
        <RNText style={{ color: isChecked ? theme.colors.primary : theme.colors.text, fontWeight: '600' }}>
          {icon}
        </RNText>
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
}

ToggleButton.Group = function ToggleButtonGroup({ value, onValueChange, children }) {
  return (
    <ToggleGroupContext.Provider value={{ value, onValueChange }}>
      {children}
    </ToggleGroupContext.Provider>
  );
};

ToggleButton.Row = function ToggleButtonRow({ value, onValueChange, children, style }) {
  return (
    <ToggleButton.Group value={value} onValueChange={onValueChange}>
      <View style={[styles.toggleRow, style]}>{children}</View>
    </ToggleButton.Group>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    CHIP                                    */
/* -------------------------------------------------------------------------- */
export function Chip({
  mode = 'flat',
  selected = false,
  disabled = false,
  icon,
  avatar,
  onPress,
  onClose,
  children,
  style,
  textStyle,
  ...props
}) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.chipBase,
        {
          backgroundColor: selected
            ? theme.dark
              ? 'rgba(124, 58, 237, 0.25)'
              : '#ede9fe'
            : theme.colors.surface,
          borderColor: mode === 'outlined' ? theme.colors.border : 'transparent',
          borderWidth: mode === 'outlined' ? 1 : 0,
          borderRadius: theme.radii.full,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...props}
    >
      {avatar ? <View style={{ marginRight: 6 }}>{avatar}</View> : null}
      {icon ? <View style={{ marginRight: 6 }}>{icon}</View> : null}
      <RNText
        style={[
          styles.chipText,
          {
            color: selected ? theme.colors.primary : theme.colors.text,
            fontSize: theme.typography.sizes.sm,
          },
          textStyle,
        ]}
      >
        {children}
      </RNText>
      {onClose ? (
        <TouchableOpacity onPress={onClose} style={{ marginLeft: 6 }}>
          <RNText style={{ color: theme.colors.textMuted, fontSize: 13 }}>✕</RNText>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    BADGE                                   */
/* -------------------------------------------------------------------------- */
export function Badge({
  variant = 'primary',
  size = 20,
  visible = true,
  children,
  style,
  textStyle,
  ...props
}) {
  const theme = useTheme();
  if (!visible) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { bg: theme.colors.success, text: '#ffffff' };
      case 'warning':
        return { bg: theme.colors.warning, text: '#ffffff' };
      case 'danger':
      case 'error':
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
          minWidth: size,
          height: size,
          paddingHorizontal: children ? 6 : 0,
          borderRadius: size / 2,
        },
        style,
      ]}
      {...props}
    >
      {children ? (
        <RNText
          style={[
            styles.badgeText,
            {
              color: v.text,
              fontSize: theme.typography.sizes.xs - 1,
            },
            textStyle,
          ]}
        >
          {children}
        </RNText>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   AVATAR                                   */
/* -------------------------------------------------------------------------- */
export function Avatar({
  size = 48,
  style,
  children,
  ...props
}) {
  return (
    <View
      style={[
        styles.avatarBase,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

Avatar.Text = function AvatarText({ label, size = 48, color = '#ffffff', style, labelStyle }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.avatarBase,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.primary,
        },
        style,
      ]}
    >
      <RNText
        style={[
          styles.avatarText,
          { color, fontSize: size * 0.4 },
          labelStyle,
        ]}
      >
        {label}
      </RNText>
    </View>
  );
};

Avatar.Icon = function AvatarIcon({ icon, size = 48, color = '#ffffff', style }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.avatarBase,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.primary,
        },
        style,
      ]}
    >
      {typeof icon === 'function' ? (
        icon({ size: size * 0.5, color })
      ) : typeof icon === 'string' ? (
        <RNText style={{ fontSize: size * 0.45, color }}>{icon}</RNText>
      ) : (
        icon
      )}
    </View>
  );
};

Avatar.Image = function AvatarImage({ source, size = 48, style }) {
  return (
    <Image
      source={source}
      style={[
        styles.avatarBase,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                                PROGRESS BAR                                */
/* -------------------------------------------------------------------------- */
export function ProgressBar({
  progress = 0,
  color,
  indeterminate = false,
  visible = true,
  style,
  ...props
}) {
  const theme = useTheme();
  if (!visible) return null;

  const barColor = color || theme.colors.primary;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={[
        styles.progressBarTrack,
        {
          backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : theme.colors.border,
          borderRadius: theme.radii.full,
        },
        style,
      ]}
      {...props}
    >
      <View
        style={[
          styles.progressBarFill,
          {
            backgroundColor: barColor,
            width: indeterminate ? '50%' : `${clampedProgress * 100}%`,
            borderRadius: theme.radii.full,
          },
        ]}
      />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    LIST                                    */
/* -------------------------------------------------------------------------- */
export const List = {};

List.Section = function ListSection({ title, children, style, titleStyle }) {
  const theme = useTheme();
  return (
    <View style={[{ marginVertical: theme.spacing[2] }, style]}>
      {title ? (
        <RNText
          style={[
            styles.listSectionTitle,
            { color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm },
            titleStyle,
          ]}
        >
          {title}
        </RNText>
      ) : null}
      {children}
    </View>
  );
};

List.Subheader = function ListSubheader({ children, style }) {
  const theme = useTheme();
  return (
    <RNText
      style={[
        styles.listSubheader,
        { color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};

List.Item = function ListItem({
  title,
  description,
  left,
  right,
  onPress,
  disabled = false,
  style,
  titleStyle,
  descriptionStyle,
}) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || !onPress}
      onPress={onPress}
      style={[
        styles.listItem,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {left ? <View style={{ marginRight: 14 }}>{left()}</View> : null}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <RNText
          style={[
            styles.listItemTitle,
            { color: theme.colors.text, fontSize: theme.typography.sizes.base },
            titleStyle,
          ]}
        >
          {title}
        </RNText>
        {description ? (
          <RNText
            style={[
              styles.listItemDescription,
              { color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm },
              descriptionStyle,
            ]}
          >
            {description}
          </RNText>
        ) : null}
      </View>
      {right ? <View style={{ marginLeft: 14 }}>{right()}</View> : null}
    </TouchableOpacity>
  );
};

List.Icon = function ListIcon({ icon, color, style }) {
  const theme = useTheme();
  return (
    <View style={[styles.listIcon, style]}>
      {typeof icon === 'function' ? (
        icon({ color: color || theme.colors.primary })
      ) : typeof icon === 'string' ? (
        <RNText style={{ fontSize: 20, color: color || theme.colors.primary }}>{icon}</RNText>
      ) : (
        icon
      )}
    </View>
  );
};

List.Accordion = function ListAccordion({
  title,
  description,
  left,
  right,
  expanded = false,
  onPress,
  children,
  style,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const theme = useTheme();
  const isOpen = onPress !== undefined ? expanded : internalOpen;

  const toggle = () => {
    if (onPress) {
      onPress();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  return (
    <View style={[{ overflow: 'hidden' }, style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggle}
        style={[
          styles.listItem,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        {left ? <View style={{ marginRight: 14 }}>{left()}</View> : null}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <RNText
            style={[
              styles.listItemTitle,
              { color: theme.colors.text, fontSize: theme.typography.sizes.base },
            ]}
          >
            {title}
          </RNText>
          {description ? (
            <RNText
              style={[
                styles.listItemDescription,
                { color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm },
              ]}
            >
              {description}
            </RNText>
          ) : null}
        </View>
        {right ? (
          <View style={{ marginLeft: 14 }}>{right({ isExpanded: isOpen })}</View>
        ) : (
          <RNText style={{ color: theme.colors.textMuted, fontSize: 16 }}>
            {isOpen ? '▲' : '▼'}
          </RNText>
        )}
      </TouchableOpacity>
      {isOpen ? <View style={{ paddingLeft: 16 }}>{children}</View> : null}
    </View>
  );
};

List.AccordionGroup = function ListAccordionGroup({ children }) {
  return <View>{children}</View>;
};

/* -------------------------------------------------------------------------- */
/*                                    APPBAR                                  */
/* -------------------------------------------------------------------------- */
export const Appbar = function AppbarRoot({ children, style, ...props }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.appbarBase,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: 1,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

Appbar.Header = function AppbarHeader({ children, style, ...props }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.appbarHeader,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: 1,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

Appbar.Content = function AppbarContent({ title, subtitle, style, titleStyle, subtitleStyle }) {
  const theme = useTheme();
  return (
    <View style={[styles.appbarContent, style]}>
      <RNText
        style={[
          styles.appbarTitle,
          { color: theme.colors.text, fontSize: theme.typography.sizes.lg },
          titleStyle,
        ]}
      >
        {title}
      </RNText>
      {subtitle ? (
        <RNText
          style={[
            styles.appbarSubtitle,
            { color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs },
            subtitleStyle,
          ]}
        >
          {subtitle}
        </RNText>
      ) : null}
    </View>
  );
};

Appbar.Action = function AppbarAction({ icon, onPress, color, style, ...props }) {
  return (
    <IconButton
      icon={icon}
      iconColor={color}
      onPress={onPress}
      size={20}
      style={[{ marginHorizontal: 2 }, style]}
      {...props}
    />
  );
};

Appbar.BackAction = function AppbarBackAction({ onPress, color, style, ...props }) {
  return (
    <IconButton
      icon="←"
      iconColor={color}
      onPress={onPress}
      size={20}
      style={[{ marginHorizontal: 2 }, style]}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                                   DRAWER                                   */
/* -------------------------------------------------------------------------- */
export const Drawer = {};

Drawer.Section = function DrawerSection({ title, children, style }) {
  const theme = useTheme();
  return (
    <View style={[{ marginVertical: theme.spacing[2] }, style]}>
      {title ? (
        <RNText
          style={[
            styles.drawerSectionTitle,
            { color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs },
          ]}
        >
          {title}
        </RNText>
      ) : null}
      {children}
    </View>
  );
};

Drawer.Item = function DrawerItem({
  label,
  icon,
  active = false,
  onPress,
  style,
  labelStyle,
  ...props
}) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.drawerItem,
        {
          backgroundColor: active
            ? theme.dark
              ? 'rgba(124, 58, 237, 0.25)'
              : '#ede9fe'
            : 'transparent',
          borderRadius: theme.radii.full,
        },
        style,
      ]}
      {...props}
    >
      {icon ? <View style={{ marginRight: 12 }}>{icon}</View> : null}
      <RNText
        style={[
          styles.drawerLabel,
          {
            color: active ? theme.colors.primary : theme.colors.text,
            fontWeight: active ? '700' : '500',
            fontSize: theme.typography.sizes.base,
          },
          labelStyle,
        ]}
      >
        {label}
      </RNText>
    </TouchableOpacity>
  );
};

/* -------------------------------------------------------------------------- */
/*                              BOTTOM NAVIGATION                             */
/* -------------------------------------------------------------------------- */
export function BottomNavigation({
  navigationState = { index: 0, routes: [] },
  onIndexChange,
  renderScene,
  style,
  barStyle,
}) {
  const theme = useTheme();
  const activeRoute = navigationState.routes[navigationState.index];

  return (
    <View style={[styles.bottomNavContainer, style]}>
      <View style={{ flex: 1 }}>
        {renderScene ? renderScene({ route: activeRoute, jumpTo: onIndexChange }) : null}
      </View>
      <View
        style={[
          styles.bottomNavBar,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            borderTopWidth: 1,
          },
          barStyle,
        ]}
      >
        {navigationState.routes.map((route, idx) => {
          const isActive = navigationState.index === idx;
          return (
            <TouchableOpacity
              key={route.key || idx}
              activeOpacity={0.75}
              onPress={() => onIndexChange && onIndexChange(idx)}
              style={styles.bottomNavItem}
            >
              {route.icon ? (
                <View style={{ marginBottom: 4 }}>
                  {typeof route.icon === 'function'
                    ? route.icon({ color: isActive ? theme.colors.primary : theme.colors.textMuted })
                    : route.icon}
                </View>
              ) : null}
              <RNText
                style={[
                  styles.bottomNavLabel,
                  {
                    color: isActive ? theme.colors.primary : theme.colors.textMuted,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {route.title || route.key}
              </RNText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    DIALOG                                  */
/* -------------------------------------------------------------------------- */
export function Dialog({
  visible = false,
  onDismiss,
  dismissable = true,
  children,
  style,
}) {
  const theme = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (dismissable && onDismiss) onDismiss();
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (dismissable && onDismiss) onDismiss();
        }}
        style={styles.modalBackdrop}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.dialogContainer,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.xl,
              ...theme.shadows.lg,
            },
            style,
          ]}
        >
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
}

Dialog.Title = function DialogTitle({ children, style }) {
  const theme = useTheme();
  return (
    <RNText
      style={[
        styles.dialogTitle,
        { color: theme.colors.text, fontSize: theme.typography.sizes.xl },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};

Dialog.Content = function DialogContent({ children, style }) {
  return <View style={[styles.dialogContent, style]}>{children}</View>;
};

Dialog.Actions = function DialogActions({ children, style }) {
  return <View style={[styles.dialogActions, style]}>{children}</View>;
};

Dialog.ScrollArea = function DialogScrollArea({ children, style }) {
  return (
    <ScrollView style={[styles.dialogScrollArea, style]}>
      {children}
    </ScrollView>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    MODAL                                   */
/* -------------------------------------------------------------------------- */
export function Modal({
  visible = false,
  onDismiss,
  dismissable = true,
  contentContainerStyle,
  children,
  ...props
}) {
  const theme = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (dismissable && onDismiss) onDismiss();
      }}
      {...props}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (dismissable && onDismiss) onDismiss();
        }}
        style={styles.modalBackdrop}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.lg,
              ...theme.shadows.lg,
            },
            contentContainerStyle,
          ]}
        >
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    MENU                                    */
/* -------------------------------------------------------------------------- */
export function Menu({
  visible = false,
  onDismiss,
  anchor,
  children,
  contentStyle,
  style,
}) {
  const theme = useTheme();

  return (
    <View style={style}>
      {anchor}
      {visible ? (
        <RNModal transparent visible={visible} animationType="fade" onRequestClose={onDismiss}>
          <TouchableOpacity activeOpacity={1} onPress={onDismiss} style={styles.modalBackdrop}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.menuCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radii.md,
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                  ...theme.shadows.md,
                },
                contentStyle,
              ]}
            >
              {children}
            </TouchableOpacity>
          </TouchableOpacity>
        </RNModal>
      ) : null}
    </View>
  );
}

Menu.Item = function MenuItem({
  title,
  icon,
  disabled = false,
  onPress,
  style,
  titleStyle,
}) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.menuItem,
        { opacity: disabled ? 0.4 : 1 },
        style,
      ]}
    >
      {icon ? <View style={{ marginRight: 10 }}>{icon}</View> : null}
      <RNText
        style={[
          styles.menuItemTitle,
          { color: theme.colors.text, fontSize: theme.typography.sizes.base },
          titleStyle,
        ]}
      >
        {title}
      </RNText>
    </TouchableOpacity>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   TOOLTIP                                  */
/* -------------------------------------------------------------------------- */
export function Tooltip({
  title,
  children,
  leaveTouchDelay = 1500,
  style,
}) {
  const [show, setShow] = useState(false);
  const theme = useTheme();

  const handleLongPress = () => {
    setShow(true);
    setTimeout(() => setShow(false), leaveTouchDelay);
  };

  return (
    <View style={[{ position: 'relative' }, style]}>
      {show ? (
        <View
          style={[
            styles.tooltipBox,
            {
              backgroundColor: theme.dark ? '#334155' : '#1e293b',
              borderRadius: theme.radii.sm,
            },
          ]}
        >
          <RNText style={styles.tooltipText}>{title}</RNText>
        </View>
      ) : null}
      <TouchableOpacity activeOpacity={0.8} onLongPress={handleLongPress}>
        {children}
      </TouchableOpacity>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  SNACKBAR                                  */
/* -------------------------------------------------------------------------- */
export function Snackbar({
  visible = false,
  action,
  duration = 4000,
  onDismiss,
  children,
  style,
  ...props
}) {
  const theme = useTheme();

  React.useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        if (onDismiss) onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  return (
    <View
      style={[
        styles.snackbarBase,
        {
          backgroundColor: theme.dark ? '#1e293b' : '#0f172a',
          borderRadius: theme.radii.md,
          ...theme.shadows.md,
        },
        style,
      ]}
      {...props}
    >
      <RNText style={[styles.snackbarText, { fontSize: theme.typography.sizes.sm }]}>
        {children}
      </RNText>
      {action ? (
        <TouchableOpacity
          onPress={() => {
            if (action.onPress) action.onPress();
            if (onDismiss) onDismiss();
          }}
          style={{ marginLeft: 12 }}
        >
          <RNText style={[styles.snackbarAction, { color: theme.colors.primary }]}>
            {action.label}
          </RNText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   BANNER                                   */
/* -------------------------------------------------------------------------- */
export function Banner({
  visible = true,
  actions = [],
  icon,
  children,
  style,
  ...props
}) {
  const theme = useTheme();
  if (!visible) return null;

  return (
    <View
      style={[
        styles.bannerBase,
        {
          backgroundColor: theme.dark ? 'rgba(124, 58, 237, 0.15)' : '#f5f3ff',
          borderColor: theme.colors.border,
          borderBottomWidth: 1,
        },
        style,
      ]}
      {...props}
    >
      <View style={styles.bannerRow}>
        {icon ? <View style={{ marginRight: 12 }}>{icon}</View> : null}
        <View style={{ flex: 1 }}>
          <RNText style={[styles.bannerText, { color: theme.colors.text }]}>
            {children}
          </RNText>
        </View>
      </View>
      {actions.length > 0 ? (
        <View style={styles.bannerActions}>
          {actions.map((act, idx) => (
            <TouchableOpacity
              key={act.label || idx}
              onPress={act.onPress}
              style={{ marginLeft: 16 }}
            >
              <RNText style={[styles.bannerActionText, { color: theme.colors.primary }]}>
                {act.label}
              </RNText>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 DATA TABLE                                 */
/* -------------------------------------------------------------------------- */
export const DataTable = function DataTableRoot({ children, style, ...props }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.dataTableBase,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: theme.radii.md,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

DataTable.Header = function DataTableHeader({ children, style }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.dataTableRow,
        {
          backgroundColor: theme.dark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
          borderBottomColor: theme.colors.border,
          borderBottomWidth: 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

DataTable.Title = function DataTableTitle({ children, numeric = false, style, textStyle }) {
  const theme = useTheme();
  return (
    <View style={[styles.dataTableCell, numeric && { alignItems: 'flex-end' }, style]}>
      <RNText
        style={[
          styles.dataTableTitleText,
          { color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs },
          textStyle,
        ]}
      >
        {children}
      </RNText>
    </View>
  );
};

DataTable.Row = function DataTableRow({ children, onPress, style }) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={!onPress}
      onPress={onPress}
      style={[
        styles.dataTableRow,
        {
          borderBottomColor: theme.colors.border,
          borderBottomWidth: StyleSheet.hairlineWidth || 1,
        },
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

DataTable.Cell = function DataTableCell({ children, numeric = false, style, textStyle }) {
  const theme = useTheme();
  return (
    <View style={[styles.dataTableCell, numeric && { alignItems: 'flex-end' }, style]}>
      {typeof children === 'string' || typeof children === 'number' ? (
        <RNText
          style={[
            styles.dataTableCellText,
            { color: theme.colors.text, fontSize: theme.typography.sizes.sm },
            textStyle,
          ]}
        >
          {children}
        </RNText>
      ) : (
        children
      )}
    </View>
  );
};

DataTable.Pagination = function DataTablePagination({
  page = 0,
  numberOfPages = 1,
  label,
  onPageChange,
  style,
}) {
  const theme = useTheme();
  return (
    <View style={[styles.dataTablePagination, style]}>
      <RNText style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs }}>
        {label || `${page + 1} of ${numberOfPages}`}
      </RNText>
      <View style={{ flexDirection: 'row', marginLeft: 16 }}>
        <TouchableOpacity
          disabled={page <= 0}
          onPress={() => onPageChange && onPageChange(page - 1)}
          style={{ padding: 6, opacity: page <= 0 ? 0.3 : 1 }}
        >
          <RNText style={{ color: theme.colors.text }}>◀</RNText>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={page >= numberOfPages - 1}
          onPress={() => onPageChange && onPageChange(page + 1)}
          style={{ padding: 6, opacity: page >= numberOfPages - 1 ? 0.3 : 1 }}
        >
          <RNText style={{ color: theme.colors.text }}>▶</RNText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   PORTAL                                   */
/* -------------------------------------------------------------------------- */
export function Portal({ children }) {
  // Pure native wrapper for portal-rendered overlays
  return <>{children}</>;
}

Portal.Host = function PortalHost({ children }) {
  return <>{children}</>;
};

/* -------------------------------------------------------------------------- */
/*                              TOUCHABLE RIPPLE                              */
/* -------------------------------------------------------------------------- */
export function TouchableRipple({
  children,
  onPress,
  disabled = false,
  style,
  ...props
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={style}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */
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
  cardBase: {
    overflow: 'hidden',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cardCover: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputBase: {
    flex: 1,
  },
  searchbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  searchbarInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  helperText: {
    marginTop: 4,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCheck: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: -2,
  },
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  selectionLabel: {
    fontSize: 15,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  toggleButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipBase: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipText: {
    fontWeight: '600',
  },
  badgeBase: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontWeight: '700',
  },
  avatarBase: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  listSectionTitle: {
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  listSubheader: {
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth || 1,
  },
  listItemTitle: {
    fontWeight: '500',
  },
  listItemDescription: {
    marginTop: 2,
  },
  listIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appbarBase: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  appbarHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  appbarContent: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  appbarTitle: {
    fontWeight: '700',
  },
  appbarSubtitle: {
    marginTop: 1,
  },
  drawerSectionTitle: {
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginHorizontal: 12,
    marginVertical: 4,
  },
  drawerLabel: {},
  bottomNavContainer: {
    flex: 1,
  },
  bottomNavBar: {
    flexDirection: 'row',
    height: 58,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  bottomNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bottomNavLabel: {
    fontSize: 11,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
  },
  dialogTitle: {
    fontWeight: '700',
    marginBottom: 12,
  },
  dialogContent: {
    marginVertical: 8,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  dialogScrollArea: {
    maxHeight: 240,
    marginVertical: 8,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    padding: 20,
  },
  menuCard: {
    paddingVertical: 6,
    minWidth: 160,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  menuItemTitle: {
    fontWeight: '500',
  },
  tooltipBox: {
    position: 'absolute',
    bottom: '100%',
    alignSelf: 'center',
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1000,
  },
  tooltipText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  snackbarBase: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9999,
  },
  snackbarText: {
    color: '#ffffff',
    flex: 1,
  },
  snackbarAction: {
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bannerBase: {
    padding: 16,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bannerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bannerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  bannerActionText: {
    fontWeight: '700',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  dataTableBase: {
    overflow: 'hidden',
  },
  dataTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dataTableCell: {
    flex: 1,
    justifyContent: 'center',
  },
  dataTableTitleText: {
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dataTableCellText: {},
  dataTablePagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});

/* -------------------------------------------------------------------------- */
/*                                   EXPORTS                                  */
/* -------------------------------------------------------------------------- */
export { BoodooProvider, useTheme } from './theme.js';
export { boodooPaperLightTheme, boodooPaperDarkTheme } from './paper.js';
