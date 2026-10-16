import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity,
  Switch as RNSwitch,
  StyleSheet,
} from 'react-native';
import { Text } from './typography.js';
import { useTheme } from './theme.js';

/**
 * TextInput / Input / TextField
 */
export function TextInput({
  label,
  error,
  errorMessage,
  mode = 'outlined',
  left,
  right,
  leftIcon,
  rightIcon,
  placeholder,
  value,
  onChangeText,
  style,
  inputStyle,
  ...props
}) {
  const theme = useTheme();
  const isFlat = mode === 'flat';
  const errText = error || errorMessage;

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
            borderColor: errText ? theme.colors.danger : theme.colors.border,
            borderWidth: isFlat ? 0 : 1,
            borderBottomWidth: isFlat ? 2 : 1,
            borderBottomColor: errText ? theme.colors.danger : isFlat ? theme.colors.primary : theme.colors.border,
            borderRadius: isFlat ? 0 : theme.radii.md,
          },
        ]}
      >
        {left || leftIcon ? <View style={{ paddingLeft: 12 }}>{left || leftIcon}</View> : null}
        <RNTextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
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
        {right || rightIcon ? <View style={{ paddingRight: 12 }}>{right || rightIcon}</View> : null}
      </View>
      {errText ? (
        <Text style={{ color: theme.colors.danger, fontSize: theme.typography.sizes.xs, marginTop: 4 }}>
          {errText}
        </Text>
      ) : null}
    </View>
  );
}
export const Input = TextInput;
export const TextField = TextInput;

/**
 * Textarea / TextArea
 */
export function Textarea({ numberOfLines = 4, style, inputStyle, ...props }) {
  return (
    <TextInput
      multiline
      numberOfLines={numberOfLines}
      inputStyle={[{ minHeight: numberOfLines * 24, textAlignVertical: 'top' }, inputStyle]}
      style={style}
      {...props}
    />
  );
}
export const TextArea = Textarea;

/**
 * Searchbar / SearchBar
 */
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
export const SearchBar = Searchbar;

/**
 * HelperText
 */
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

/**
 * Checkbox / CheckBox
 */
export function Checkbox({
  checked = false,
  status = 'unchecked',
  title,
  disabled = false,
  onPress,
  color,
  uncheckedColor,
  style,
}) {
  const theme = useTheme();
  const isChecked = checked || status === 'checked';
  const activeColor = color || theme.colors.primary;
  const inactiveColor = uncheckedColor || theme.colors.border;

  const boxElement = (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.checkboxBox,
        {
          borderColor: isChecked ? activeColor : inactiveColor,
          backgroundColor: isChecked ? activeColor : 'transparent',
          borderRadius: 4,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {isChecked ? <RNText style={styles.checkboxCheck}>✓</RNText> : null}
    </TouchableOpacity>
  );

  if (title) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        onPress={onPress}
        style={styles.selectionItem}
      >
        {boxElement}
        <RNText
          style={[
            styles.selectionLabel,
            { color: theme.colors.text, opacity: disabled ? 0.5 : 1, marginLeft: 10, flex: 1 },
          ]}
        >
          {title}
        </RNText>
      </TouchableOpacity>
    );
  }

  return boxElement;
}
export const CheckBox = Checkbox;

Checkbox.Item = function CheckboxItem({ label, status, checked, onPress, disabled, style, labelStyle }) {
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
      <Checkbox status={status} checked={checked} disabled={disabled} onPress={onPress} />
    </TouchableOpacity>
  );
};

/**
 * RadioButton / Radio
 */
const RadioGroupContext = createContext(null);

export function RadioButton({
  value,
  status,
  checked = false,
  disabled = false,
  onPress,
  color,
  style,
}) {
  const theme = useTheme();
  const groupCtx = useContext(RadioGroupContext);
  const isChecked = groupCtx ? groupCtx.value === value : checked || status === 'checked';
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
          borderColor: isChecked ? activeColor : theme.colors.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {isChecked ? (
        <View style={[styles.radioInner, { backgroundColor: activeColor }]} />
      ) : null}
    </TouchableOpacity>
  );
}
export const Radio = RadioButton;

RadioButton.Group = function RadioButtonGroup({ value, onValueChange, children }) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      {children}
    </RadioGroupContext.Provider>
  );
};
export const RadioGroup = RadioButton.Group;

RadioButton.Item = function RadioButtonItem({ label, value, status, onPress, disabled, style, labelStyle }) {
  const theme = useTheme();
  const groupCtx = useContext(RadioGroupContext);
  const isChecked = groupCtx ? groupCtx.value === value : status === 'checked';

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
      <RadioButton value={value} status={isChecked ? 'checked' : 'unchecked'} disabled={disabled} onPress={handlePress} />
    </TouchableOpacity>
  );
};

/**
 * Switch / Toggle
 */
export function Switch({
  value = false,
  checked = false,
  onValueChange,
  onChange,
  disabled = false,
  color,
  style,
  ...props
}) {
  const theme = useTheme();
  const isVal = value || checked;
  const handleChange = onValueChange || onChange;

  return (
    <RNSwitch
      value={isVal}
      onValueChange={handleChange}
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
export const Toggle = Switch;

/**
 * Slider
 */
export function Slider({
  value = 0,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  onValueChange,
  thumbTintColor,
  minimumTrackTintColor,
  maximumTrackTintColor,
  disabled = false,
  style,
}) {
  const theme = useTheme();
  const ratio = Math.min(Math.max((value - minimumValue) / (maximumValue - minimumValue || 1), 0), 1);
  const activeTrack = minimumTrackTintColor || theme.colors.primary;
  const inactiveTrack = maximumTrackTintColor || theme.colors.border;
  const thumbColor = thumbTintColor || theme.colors.primary;

  return (
    <View style={[styles.sliderContainer, style]}>
      <View style={[styles.sliderTrack, { backgroundColor: inactiveTrack }]}>
        <View style={[styles.sliderFill, { width: `${ratio * 100}%`, backgroundColor: activeTrack }]} />
      </View>
      <View
        style={[
          styles.sliderThumb,
          {
            left: `${ratio * 100}%`,
            backgroundColor: thumbColor,
            opacity: disabled ? 0.5 : 1,
            ...theme.shadows.sm,
          },
        ]}
      />
    </View>
  );
}

/**
 * Stepper (Wix)
 */
export function Stepper({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  style,
}) {
  const theme = useTheme();

  return (
    <View style={[styles.stepperContainer, { borderColor: theme.colors.border }, style]}>
      <TouchableOpacity
        onPress={() => onValueChange && onValueChange(Math.max(value - step, min))}
        disabled={value <= min}
        style={styles.stepperBtn}
      >
        <RNText style={[styles.stepperBtnText, { color: theme.colors.text }]}>−</RNText>
      </TouchableOpacity>
      <View style={styles.stepperValue}>
        <RNText style={[styles.stepperValueText, { color: theme.colors.text }]}>{value}</RNText>
      </View>
      <TouchableOpacity
        onPress={() => onValueChange && onValueChange(Math.min(value + step, max))}
        disabled={value >= max}
        style={styles.stepperBtn}
      >
        <RNText style={[styles.stepperBtnText, { color: theme.colors.text }]}>+</RNText>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Select / Picker
 */
export function Select({
  selectedValue,
  onValueChange,
  placeholder = 'Select option',
  options = [],
  style,
}) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const selectedLabel = options.find((o) => (o.value || o) === selectedValue);
  const labelText = typeof selectedLabel === 'object' ? selectedLabel.label : selectedLabel || placeholder;

  return (
    <View style={[{ position: 'relative' }, style]}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => setOpen(!open)}
        style={[
          styles.selectTrigger,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radii.md,
          },
        ]}
      >
        <RNText style={{ color: selectedValue ? theme.colors.text : theme.colors.textMuted }}>
          {labelText}
        </RNText>
        <RNText style={{ color: theme.colors.textMuted, fontSize: 12 }}>▼</RNText>
      </TouchableOpacity>
      {open ? (
        <View
          style={[
            styles.selectDropdown,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.md,
              ...theme.shadows.md,
            },
          ]}
        >
          {options.map((opt, idx) => {
            const val = opt.value !== undefined ? opt.value : opt;
            const lbl = opt.label !== undefined ? opt.label : opt;
            const isSelected = selectedValue === val;

            return (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  if (onValueChange) onValueChange(val);
                  setOpen(false);
                }}
                style={[
                  styles.selectOption,
                  { backgroundColor: isSelected ? (theme.dark ? '#334155' : '#ede9fe') : 'transparent' },
                ]}
              >
                <RNText
                  style={{
                    color: isSelected ? theme.colors.primary : theme.colors.text,
                    fontWeight: isSelected ? '700' : '400',
                  }}
                >
                  {lbl}
                </RNText>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
export const Picker = Select;

/**
 * ToggleButton
 */
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

const styles = StyleSheet.create({
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
  sliderContainer: {
    height: 36,
    justifyContent: 'center',
    position: 'relative',
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    top: 8,
    marginLeft: -10,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  stepperBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  stepperBtnText: {
    fontSize: 18,
    fontWeight: '700',
  },
  stepperValue: {
    paddingHorizontal: 12,
  },
  stepperValueText: {
    fontSize: 15,
    fontWeight: '600',
  },
  selectTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  selectDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    marginTop: 4,
    zIndex: 1000,
    overflow: 'hidden',
  },
  selectOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
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
});
