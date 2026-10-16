import React, { useState } from 'react';
import {
  View,
  Text as RNText,
  TouchableOpacity,
  Modal as RNModal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from './theme.js';

/**
 * Dialog / AlertDialog
 */
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
export const AlertDialog = Dialog;

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

/**
 * Modal / Overlay
 */
export function Modal({
  visible = false,
  onDismiss,
  onRequestClose,
  dismissable = true,
  contentContainerStyle,
  children,
  ...props
}) {
  const theme = useTheme();
  const handleClose = () => {
    if (dismissable) {
      if (onDismiss) onDismiss();
      if (onRequestClose) onRequestClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      {...props}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleClose}
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
export const Overlay = Modal;

/**
 * BottomSheet / Actionsheet / Sheet
 */
export function BottomSheet({
  isVisible = false,
  visible = false,
  onBackdropPress,
  onClose,
  children,
  style,
}) {
  const theme = useTheme();
  const isShow = isVisible || visible;
  const close = onBackdropPress || onClose;

  return (
    <RNModal visible={isShow} transparent animationType="slide" onRequestClose={close}>
      <TouchableOpacity activeOpacity={1} onPress={close} style={styles.sheetBackdrop}>
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.sheetContainer,
            {
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: theme.radii.xl,
              borderTopRightRadius: theme.radii.xl,
              ...theme.shadows.lg,
            },
            style,
          ]}
        >
          <View style={styles.sheetHandle} />
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
}
export const Actionsheet = BottomSheet;
export const ActionSheet = BottomSheet;
export const Sheet = BottomSheet;

/**
 * Menu / Dropdown / Popover
 */
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
export const Popover = Menu;

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

/**
 * Tooltip
 */
export function Tooltip({
  title,
  popover,
  children,
  leaveTouchDelay = 1500,
  style,
}) {
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const label = title || popover;

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
          {typeof label === 'string' ? (
            <RNText style={styles.tooltipText}>{label}</RNText>
          ) : (
            label
          )}
        </View>
      ) : null}
      <TouchableOpacity activeOpacity={0.8} onLongPress={handleLongPress}>
        {children}
      </TouchableOpacity>
    </View>
  );
}

/**
 * Portal & Ripple utilities
 */
export function Portal({ children }) {
  return <>{children}</>;
}
Portal.Host = function PortalHost({ children }) {
  return <>{children}</>;
};

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

const styles = StyleSheet.create({
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
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    padding: 20,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
    alignSelf: 'center',
    marginBottom: 16,
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
});
