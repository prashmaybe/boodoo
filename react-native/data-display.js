import React from 'react';
import { View, Text as RNText, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from './theme.js';

/**
 * Chip / Tag
 */
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

/**
 * Badge
 */
export function Badge({
  value,
  variant = 'primary',
  status = 'primary',
  size = 20,
  visible = true,
  children,
  style,
  textStyle,
  ...props
}) {
  const theme = useTheme();
  if (!visible) return null;

  const effective = status || variant;
  const getVariantStyles = () => {
    switch (effective) {
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
  const content = children !== undefined ? children : value;

  return (
    <View
      style={[
        styles.badgeBase,
        {
          backgroundColor: v.bg,
          minWidth: size,
          height: size,
          paddingHorizontal: content ? 6 : 0,
          borderRadius: size / 2,
        },
        style,
      ]}
      {...props}
    >
      {content ? (
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
          {content}
        </RNText>
      ) : null}
    </View>
  );
}

/**
 * Avatar
 */
export function Avatar({
  size = 48,
  source,
  title,
  rounded = true,
  style,
  children,
  ...props
}) {
  const theme = useTheme();
  const radius = rounded ? size / 2 : theme.radii.md;

  if (source) {
    return (
      <Image
        source={source}
        style={[
          styles.avatarBase,
          { width: size, height: size, borderRadius: radius },
          style,
        ]}
      />
    );
  }

  if (title) {
    return (
      <View
        style={[
          styles.avatarBase,
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: theme.colors.primary,
          },
          style,
        ]}
      >
        <RNText style={[styles.avatarText, { fontSize: size * 0.4 }]}>{title}</RNText>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.avatarBase,
        {
          width: size,
          height: size,
          borderRadius: radius,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

Avatar.Text = function AvatarText({ label, title, size = 48, color = '#ffffff', style, labelStyle }) {
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
        {label || title}
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

/**
 * ChatBubble Primitive
 */
export function ChatBubble({
  message,
  outgoing = false,
  timestamp,
  style,
  textStyle,
  ...props
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.chatBubbleBase,
        {
          alignSelf: outgoing ? 'flex-end' : 'flex-start',
          backgroundColor: outgoing
            ? theme.colors.primary
            : theme.dark
            ? theme.colors.surface
            : '#f1f5f9',
          borderBottomRightRadius: outgoing ? 4 : 16,
          borderBottomLeftRadius: outgoing ? 16 : 4,
          borderWidth: outgoing ? 0 : 1,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      {...props}
    >
      <RNText
        style={[
          styles.chatText,
          {
            color: outgoing ? '#ffffff' : theme.colors.text,
          },
          textStyle,
        ]}
      >
        {message}
      </RNText>
      {timestamp ? (
        <RNText
          style={[
            styles.chatTime,
            {
              color: outgoing ? 'rgba(255,255,255,0.7)' : theme.colors.textSecondary || '#64748b',
            },
          ]}
        >
          {timestamp}
        </RNText>
      ) : null}
    </View>
  );
}

/**
 * AIStream Primitive
 */
export function AIStream({
  children,
  streaming = false,
  citations = [],
  onCitationPress,
  style,
  ...props
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.aiStreamBase,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderLeftColor: theme.colors.primary,
        },
        style,
      ]}
      {...props}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
        <RNText style={[styles.aiStreamText, { color: theme.colors.text }]}>
          {children}
        </RNText>
        {streaming ? (
          <View style={[styles.aiCursor, { backgroundColor: theme.colors.primary }]} />
        ) : null}
      </View>
      {citations && citations.length > 0 ? (
        <View style={styles.aiCitationsRow}>
          {citations.map((cite, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => onCitationPress && onCitationPress(cite)}
              style={[
                styles.citationPill,
                {
                  backgroundColor: theme.dark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.08)',
                },
              ]}
            >
              <RNText style={[styles.citationText, { color: theme.colors.primary }]}>
                {typeof cite === 'string' ? cite : cite.title || `[${i + 1}]`}
              </RNText>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/**
 * FilterPill Primitive
 */
export function FilterPill({
  label,
  value,
  onRemove,
  style,
  ...props
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.filterPillBase,
        {
          backgroundColor: theme.dark ? theme.colors.surface : '#f1f5f9',
          borderColor: theme.colors.border,
        },
        style,
      ]}
      {...props}
    >
      {label ? (
        <RNText style={[styles.filterPillLabel, { color: theme.colors.textSecondary || '#64748b' }]}>
          {label}:{' '}
        </RNText>
      ) : null}
      <RNText style={[styles.filterPillValue, { color: theme.colors.text }]}>
        {value}
      </RNText>
      {onRemove ? (
        <TouchableOpacity onPress={onRemove} style={styles.filterPillClose}>
          <RNText style={{ color: theme.colors.danger || '#e11d48', fontWeight: 'bold' }}>×</RNText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: '#ffffff',
  },
  chatBubbleBase: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '80%',
    marginBottom: 6,
  },
  chatText: {
    fontSize: 15,
    lineHeight: 20,
  },
  chatTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  aiStreamBase: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 3,
    marginVertical: 8,
  },
  aiStreamText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiCursor: {
    width: 2,
    height: 16,
    marginLeft: 3,
  },
  aiCitationsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  citationPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  citationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterPillBase: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 6,
  },
  filterPillLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  filterPillValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterPillClose: {
    marginLeft: 6,
    paddingHorizontal: 2,
  },
});
