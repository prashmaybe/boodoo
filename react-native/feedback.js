import React from 'react';
import {
  View,
  Text as RNText,
  ActivityIndicator as RNActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Text } from './typography.js';
import { useTheme } from './theme.js';

/**
 * ActivityIndicator / Spinner
 */
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
export const Spinner = ActivityIndicator;

/**
 * ProgressBar / Progress
 */
export function ProgressBar({
  progress = 0,
  value,
  color,
  indeterminate = false,
  visible = true,
  style,
  ...props
}) {
  const theme = useTheme();
  if (!visible) return null;

  const barColor = color || theme.colors.primary;
  const rawVal = value !== undefined ? value / 100 : progress;
  const clampedProgress = Math.min(Math.max(rawVal, 0), 1);

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
export const Progress = ProgressBar;

/**
 * Skeleton Loader
 */
export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.dark ? '#334155' : '#e2e8f0',
        },
        style,
      ]}
    />
  );
}

/**
 * Alert
 */
export function Alert({
  action = 'info',
  variant = 'info',
  title,
  icon,
  children,
  style,
}) {
  const theme = useTheme();
  const effective = action || variant;

  const getColor = () => {
    switch (effective) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
      case 'danger':
        return theme.colors.danger;
      default:
        return theme.colors.primary;
    }
  };

  const tint = getColor();

  return (
    <View
      style={[
        styles.alertContainer,
        {
          backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
          borderLeftColor: tint,
          borderLeftWidth: 4,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.md,
        },
        style,
      ]}
    >
      {icon ? <View style={styles.alertIconMargin}>{icon}</View> : null}
      <View style={styles.flexOne}>
        {title ? <Text style={styles.alertTitle}>{title}</Text> : null}
        {typeof children === 'string' ? <Text variant="muted">{children}</Text> : children}
      </View>
    </View>
  );
}

/**
 * Banner
 */
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
        {icon ? <View style={styles.bannerIconMargin}>{icon}</View> : null}
        <View style={styles.flexOne}>
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
              style={styles.bannerActionItem}
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

/**
 * Toast / Snackbar
 */
export function Toast({
  visible = false,
  message,
  action,
  duration = 3000,
  onClose,
  children,
  style,
}) {
  const theme = useTheme();

  React.useEffect(() => {
    if (visible && duration > 0) {
      const t = setTimeout(() => onClose && onClose(), duration);
      return () => clearTimeout(t);
    }
  }, [visible, duration, onClose]);

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
    >
      <RNText style={[styles.snackbarText, { fontSize: theme.typography.sizes.sm }]}>
        {children || message}
      </RNText>
      {action ? (
        <TouchableOpacity
          onPress={() => {
            if (action.onPress) action.onPress();
            if (onClose) onClose();
          }}
          style={styles.snackbarActionBtn}
        >
          <RNText style={[styles.snackbarAction, { color: theme.colors.primary }]}>
            {action.label}
          </RNText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
export const Snackbar = Toast;

const styles = StyleSheet.create({
  progressBarTrack: {
    height: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderWidth: 1,
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
  flexOne: {
    flex: 1,
  },
  alertIconMargin: {
    marginRight: 10,
  },
  alertTitle: {
    fontWeight: '700',
    marginBottom: 2,
  },
  bannerIconMargin: {
    marginRight: 12,
  },
  bannerActionItem: {
    marginLeft: 16,
  },
  snackbarActionBtn: {
    marginLeft: 12,
  },
});
