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
      {avatar ? <View style={styles.chipMarginRight}>{avatar}</View> : null}
      {icon ? <View style={styles.chipMarginRight}>{icon}</View> : null}
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
        <TouchableOpacity onPress={onClose} style={styles.chipCloseBtn}>
          <RNText style={[styles.chipCloseText, { color: theme.colors.textMuted }]}>✕</RNText>
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
        <RNText style={[styles.avatarIconText, { fontSize: size * 0.45, color }]}>{icon}</RNText>
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
      <View style={styles.aiStreamRow}>
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
          <RNText style={[styles.filterPillCloseText, { color: theme.colors.danger || '#e11d48' }]}>×</RNText>
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
  chartContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  chartHeader: {
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  barChartTrack: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderBottomWidth: 1,
    minHeight: 140,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  barPill: {
    width: '100%',
    minHeight: 4,
  },
  barLabel: {
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
  donutHole: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipMarginRight: {
    marginRight: 6,
  },
  chipCloseBtn: {
    marginLeft: 6,
  },
  chipCloseText: {
    fontSize: 13,
  },
  avatarIconText: {
    textAlign: 'center',
  },
  aiStreamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterPillCloseText: {
    fontWeight: 'bold',
  },
  donutRingWrapper: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  donutRingBase: {
    borderWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutTotalText: {
    fontSize: 24,
    fontWeight: '700',
  },
  donutTotalLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sparkCol: {
    height: '100%',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  sparkDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  emptyStateBase: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateIconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateGlyph: {
    fontSize: 28,
  },
  emptyStateTitle: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 280,
  },
  emptyStateActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emptyStateActionItem: {
    minWidth: 100,
  },
  timelineContainer: {
    paddingVertical: 12,
  },
  timelineItemRow: {
    flexDirection: 'row',
  },
  timelineLeftTrack: {
    alignItems: 'center',
    width: 32,
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineDotIcon: {
    fontSize: 11,
    color: '#ffffff',
  },
  timelineCheckIcon: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    marginVertical: 2,
  },
  timelineContentWrap: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 20,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineTitle: {
    fontWeight: '600',
  },
  timelineTime: {},
  timelineDescription: {
    lineHeight: 18,
  },
  stepIndicatorContainer: {
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  stepIndicatorTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    minWidth: 50,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepLabelText: {
    textAlign: 'center',
  },
  stepConnectingLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
    marginBottom: 20,
  },
});

/**
 * BarChart Component (Pure React Native)
 */
export function BarChart({
  labels = [],
  datasets = [],
  title,
  subtitle,
  height = 140,
  style,
  ...props
}) {
  const theme = useTheme();
  const dataset = datasets[0] || { data: [] };
  const data = dataset.data || [];
  const maxVal = Math.max(...data, 10);

  return (
    <View
      style={[
        styles.chartContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      {...props}
    >
      {title ? (
        <View style={styles.chartHeader}>
          <RNText style={[styles.chartTitle, { color: theme.colors.text }]}>
            {title}
          </RNText>
          {subtitle ? (
            <RNText style={[styles.chartSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </RNText>
          ) : null}
        </View>
      ) : null}

      <View style={[styles.barChartTrack, { borderBottomColor: theme.colors.border, minHeight: height }]}>
        {data.map((val, idx) => {
          const pct = Math.max(0.04, val / maxVal);
          const barH = pct * (height - 30);
          const color = (dataset.colors && dataset.colors[idx]) || theme.colors.primary;

          return (
            <View key={idx} style={styles.barCol}>
              <RNText style={[styles.barValue, { color: theme.colors.textSecondary }]}>
                {val}
              </RNText>
              <View
                style={[
                  styles.barPill,
                  {
                    height: barH,
                    backgroundColor: color,
                    borderTopLeftRadius: theme.radii.sm,
                    borderTopRightRadius: theme.radii.sm,
                  },
                ]}
              />
              <RNText style={[styles.barLabel, { color: theme.colors.textSecondary }]}>
                {labels[idx] || ''}
              </RNText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/**
 * EmptyState
 * Zero-data illustration, title, description, and primary/secondary actions.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  style,
  titleStyle,
  descriptionStyle,
  ...props
}) {
  const theme = useTheme();
  const containerPadding = compact ? 20 : 36;
  const iconSize = compact ? 48 : 64;

  const containerDynamic = {
    padding: containerPadding,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
  };

  const iconCircleDynamic = {
    width: iconSize,
    height: iconSize,
    borderRadius: iconSize / 2,
    backgroundColor: theme.dark ? 'rgba(124, 58, 237, 0.15)' : '#ede9fe',
  };

  return (
    <View style={[styles.emptyStateBase, containerDynamic, style]} {...props}>
      {icon ? (
        <View style={[styles.emptyStateIconCircle, iconCircleDynamic]}>
          {typeof icon === 'string' ? (
            <RNText style={styles.emptyStateGlyph}>{icon}</RNText>
          ) : (
            icon
          )}
        </View>
      ) : null}
      {title ? (
        <RNText
          style={[
            styles.emptyStateTitle,
            { color: theme.colors.text, fontSize: theme.typography.sizes.lg },
            titleStyle,
          ]}
        >
          {title}
        </RNText>
      ) : null}
      {description ? (
        <RNText
          style={[
            styles.emptyStateDescription,
            { color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm },
            descriptionStyle,
          ]}
        >
          {description}
        </RNText>
      ) : null}
      {action || secondaryAction ? (
        <View style={styles.emptyStateActionsRow}>
          {action ? <View style={styles.emptyStateActionItem}>{action}</View> : null}
          {secondaryAction ? <View style={styles.emptyStateActionItem}>{secondaryAction}</View> : null}
        </View>
      ) : null}
    </View>
  );
}

/**
 * Timeline & TimelineItem
 * Activity history and progress milestones.
 */
export function TimelineItem({
  title,
  description,
  timestamp,
  status = 'completed',
  icon,
  isLast = false,
  style,
  ...props
}) {
  const theme = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return theme.colors.primary;
      case 'completed':
        return theme.colors.success || '#1c9e50';
      case 'error':
        return theme.colors.danger || '#e11d48';
      default:
        return theme.colors.textMuted;
    }
  };

  const dotColor = getStatusColor();
  const dotDynamic = {
    backgroundColor: dotColor,
    borderColor: status === 'active' ? theme.colors.surface : dotColor,
    borderWidth: status === 'active' ? 2 : 0,
    shadowColor: status === 'active' ? dotColor : 'transparent',
    shadowOpacity: status === 'active' ? 0.4 : 0,
    shadowRadius: status === 'active' ? 4 : 0,
    elevation: status === 'active' ? 2 : 0,
  };

  const lineDynamic = {
    backgroundColor: theme.colors.border,
  };

  return (
    <View style={[styles.timelineItemRow, style]} {...props}>
      <View style={styles.timelineLeftTrack}>
        <View style={[styles.timelineDot, dotDynamic]}>
          {icon ? (
            typeof icon === 'string' ? (
              <RNText style={styles.timelineDotIcon}>{icon}</RNText>
            ) : (
              icon
            )
          ) : status === 'completed' ? (
            <RNText style={styles.timelineCheckIcon}>✓</RNText>
          ) : null}
        </View>
        {!isLast ? <View style={[styles.timelineLine, lineDynamic]} /> : null}
      </View>
      <View style={styles.timelineContentWrap}>
        <View style={styles.timelineHeaderRow}>
          <RNText
            style={[
              styles.timelineTitle,
              { color: theme.colors.text, fontSize: theme.typography.sizes.base },
            ]}
          >
            {title}
          </RNText>
          {timestamp ? (
            <RNText
              style={[
                styles.timelineTime,
                { color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs },
              ]}
            >
              {timestamp}
            </RNText>
          ) : null}
        </View>
        {description ? (
          <RNText
            style={[
              styles.timelineDescription,
              { color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm },
            ]}
          >
            {description}
          </RNText>
        ) : null}
      </View>
    </View>
  );
}

export function Timeline({ children, style, ...props }) {
  const count = React.Children.count(children);
  return (
    <View style={[styles.timelineContainer, style]} {...props}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          isLast: child.props.isLast !== undefined ? child.props.isLast : idx === count - 1,
        });
      })}
    </View>
  );
}

/**
 * StepIndicator / StepperWizard
 * Multi-step form and wizard progress indicator.
 */
export function StepIndicator({
  steps = [],
  currentStep = 0,
  onStepPress,
  style,
  ...props
}) {
  const theme = useTheme();

  return (
    <View style={[styles.stepIndicatorContainer, style]} {...props}>
      <View style={styles.stepIndicatorTrackRow}>
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          const isLast = idx === steps.length - 1;

          const circleColor = isCompleted
            ? (theme.colors.success || '#1c9e50')
            : isActive
            ? theme.colors.primary
            : theme.colors.border;

          const textColor = isCompleted || isActive ? '#ffffff' : theme.colors.textMuted;

          const circleDynamic = {
            backgroundColor: circleColor,
            borderColor: isActive ? theme.colors.primary : 'transparent',
          };

          const lineDynamic = {
            backgroundColor: isCompleted ? (theme.colors.success || '#1c9e50') : theme.colors.border,
          };

          const label = typeof step === 'string' ? step : (step.title || step.label);

          return (
            <React.Fragment key={idx}>
              <TouchableOpacity
                disabled={!onStepPress}
                activeOpacity={0.8}
                onPress={() => onStepPress?.(idx)}
                style={styles.stepItem}
              >
                <View style={[styles.stepCircle, circleDynamic]}>
                  <RNText style={[styles.stepNumberText, { color: textColor }]}>
                    {isCompleted ? '✓' : idx + 1}
                  </RNText>
                </View>
                {label ? (
                  <RNText
                    style={[
                      styles.stepLabelText,
                      {
                        color: isActive ? theme.colors.primary : theme.colors.textMuted,
                        fontWeight: isActive ? '600' : '400',
                        fontSize: theme.typography.sizes.xs,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {label}
                  </RNText>
                ) : null}
              </TouchableOpacity>
              {!isLast ? <View style={[styles.stepConnectingLine, lineDynamic]} /> : null}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}
export const StepperWizard = StepIndicator;

/**
 * Donut / Pie Progress Stat Chart (Pure React Native)
 */
export function DonutChart({
  title,
  subtitle,
  segments = [],
  total,
  size = 180,
  style,
  ...props
}) {
  const theme = useTheme();
  const computedTotal = total || segments.reduce((acc, s) => acc + (s.value || 0), 0) || 1;

  return (
    <View
      style={[
        styles.chartContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      {...props}
    >
      {title ? (
        <View style={styles.chartHeader}>
          <RNText style={[styles.chartTitle, { color: theme.colors.text }]}>
            {title}
          </RNText>
          {subtitle ? (
            <RNText style={[styles.chartSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </RNText>
          ) : null}
        </View>
      ) : null}

      <View style={styles.donutRingWrapper}>
        <View
          style={[
            styles.donutRingBase,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: segments[0]?.color || theme.colors.primary,
            },
          ]}
        >
          <RNText style={[styles.donutTotalText, { color: theme.colors.text }]}>
            {computedTotal}
          </RNText>
          <RNText style={[styles.donutTotalLabel, { color: theme.colors.textSecondary }]}>
            Total
          </RNText>
        </View>
      </View>

      <View style={styles.legendRow}>
        {segments.map((seg, idx) => (
          <View key={idx} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: seg.color || theme.colors.primary }]} />
            <RNText style={[styles.legendText, { color: theme.colors.text }]}>
              {seg.label}: {seg.value}
            </RNText>
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * LineChart Component (Pure React Native)
 */
export function LineChart({
  labels = [],
  datasets = [],
  title,
  subtitle,
  height = 160,
  style,
  ...props
}) {
  const theme = useTheme();
  const dataset = datasets[0] || { data: [] };
  const data = dataset.data || [];
  const maxVal = Math.max(...data, 10);

  return (
    <View
      style={[
        styles.chartContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      {...props}
    >
      {title ? (
        <View style={styles.chartHeader}>
          <RNText style={[styles.chartTitle, { color: theme.colors.text }]}>
            {title}
          </RNText>
          {subtitle ? (
            <RNText style={[styles.chartSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </RNText>
          ) : null}
        </View>
      ) : null}

      <View style={[styles.barChartTrack, { borderBottomColor: theme.colors.border, minHeight: height, alignItems: 'flex-end' }]}>
        {data.map((val, idx) => {
          const pct = Math.max(0.08, val / maxVal);
          const dotBottom = pct * (height - 35);
          const color = dataset.borderColor || theme.colors.primary;

          return (
            <View key={idx} style={[styles.barCol, styles.sparkCol]}>
              <View
                style={[
                  styles.sparkDot,
                  {
                    bottom: dotBottom,
                    backgroundColor: color,
                  },
                ]}
              />
              <RNText style={[styles.barLabel, { color: theme.colors.textSecondary }]}>
                {labels[idx] || ''}
              </RNText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/**
 * EmptyState
 * Zero-data illustration, title, description, and primary/secondary actions.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  style,
  titleStyle,
  descriptionStyle,
  ...props
}) {
  const theme = useTheme();
  const containerPadding = compact ? 20 : 36;
  const iconSize = compact ? 48 : 64;

  const containerDynamic = {
    padding: containerPadding,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
  };

  const iconCircleDynamic = {
    width: iconSize,
    height: iconSize,
    borderRadius: iconSize / 2,
    backgroundColor: theme.dark ? 'rgba(124, 58, 237, 0.15)' : '#ede9fe',
  };

  return (
    <View style={[styles.emptyStateBase, containerDynamic, style]} {...props}>
      {icon ? (
        <View style={[styles.emptyStateIconCircle, iconCircleDynamic]}>
          {typeof icon === 'string' ? (
            <RNText style={styles.emptyStateGlyph}>{icon}</RNText>
          ) : (
            icon
          )}
        </View>
      ) : null}
      {title ? (
        <RNText
          style={[
            styles.emptyStateTitle,
            { color: theme.colors.text, fontSize: theme.typography.sizes.lg },
            titleStyle,
          ]}
        >
          {title}
        </RNText>
      ) : null}
      {description ? (
        <RNText
          style={[
            styles.emptyStateDescription,
            { color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm },
            descriptionStyle,
          ]}
        >
          {description}
        </RNText>
      ) : null}
      {action || secondaryAction ? (
        <View style={styles.emptyStateActionsRow}>
          {action ? <View style={styles.emptyStateActionItem}>{action}</View> : null}
          {secondaryAction ? <View style={styles.emptyStateActionItem}>{secondaryAction}</View> : null}
        </View>
      ) : null}
    </View>
  );
}

/**
 * Timeline & TimelineItem
 * Activity history and progress milestones.
 */
export function TimelineItem({
  title,
  description,
  timestamp,
  status = 'completed',
  icon,
  isLast = false,
  style,
  ...props
}) {
  const theme = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return theme.colors.primary;
      case 'completed':
        return theme.colors.success || '#1c9e50';
      case 'error':
        return theme.colors.danger || '#e11d48';
      default:
        return theme.colors.textMuted;
    }
  };

  const dotColor = getStatusColor();
  const dotDynamic = {
    backgroundColor: dotColor,
    borderColor: status === 'active' ? theme.colors.surface : dotColor,
    borderWidth: status === 'active' ? 2 : 0,
    shadowColor: status === 'active' ? dotColor : 'transparent',
    shadowOpacity: status === 'active' ? 0.4 : 0,
    shadowRadius: status === 'active' ? 4 : 0,
    elevation: status === 'active' ? 2 : 0,
  };

  const lineDynamic = {
    backgroundColor: theme.colors.border,
  };

  return (
    <View style={[styles.timelineItemRow, style]} {...props}>
      <View style={styles.timelineLeftTrack}>
        <View style={[styles.timelineDot, dotDynamic]}>
          {icon ? (
            typeof icon === 'string' ? (
              <RNText style={styles.timelineDotIcon}>{icon}</RNText>
            ) : (
              icon
            )
          ) : status === 'completed' ? (
            <RNText style={styles.timelineCheckIcon}>✓</RNText>
          ) : null}
        </View>
        {!isLast ? <View style={[styles.timelineLine, lineDynamic]} /> : null}
      </View>
      <View style={styles.timelineContentWrap}>
        <View style={styles.timelineHeaderRow}>
          <RNText
            style={[
              styles.timelineTitle,
              { color: theme.colors.text, fontSize: theme.typography.sizes.base },
            ]}
          >
            {title}
          </RNText>
          {timestamp ? (
            <RNText
              style={[
                styles.timelineTime,
                { color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs },
              ]}
            >
              {timestamp}
            </RNText>
          ) : null}
        </View>
        {description ? (
          <RNText
            style={[
              styles.timelineDescription,
              { color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm },
            ]}
          >
            {description}
          </RNText>
        ) : null}
      </View>
    </View>
  );
}

export function Timeline({ children, style, ...props }) {
  const count = React.Children.count(children);
  return (
    <View style={[styles.timelineContainer, style]} {...props}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          isLast: child.props.isLast !== undefined ? child.props.isLast : idx === count - 1,
        });
      })}
    </View>
  );
}

/**
 * StepIndicator / StepperWizard
 * Multi-step form and wizard progress indicator.
 */
export function StepIndicator({
  steps = [],
  currentStep = 0,
  onStepPress,
  style,
  ...props
}) {
  const theme = useTheme();

  return (
    <View style={[styles.stepIndicatorContainer, style]} {...props}>
      <View style={styles.stepIndicatorTrackRow}>
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          const isLast = idx === steps.length - 1;

          const circleColor = isCompleted
            ? (theme.colors.success || '#1c9e50')
            : isActive
            ? theme.colors.primary
            : theme.colors.border;

          const textColor = isCompleted || isActive ? '#ffffff' : theme.colors.textMuted;

          const circleDynamic = {
            backgroundColor: circleColor,
            borderColor: isActive ? theme.colors.primary : 'transparent',
          };

          const lineDynamic = {
            backgroundColor: isCompleted ? (theme.colors.success || '#1c9e50') : theme.colors.border,
          };

          const label = typeof step === 'string' ? step : (step.title || step.label);

          return (
            <React.Fragment key={idx}>
              <TouchableOpacity
                disabled={!onStepPress}
                activeOpacity={0.8}
                onPress={() => onStepPress?.(idx)}
                style={styles.stepItem}
              >
                <View style={[styles.stepCircle, circleDynamic]}>
                  <RNText style={[styles.stepNumberText, { color: textColor }]}>
                    {isCompleted ? '✓' : idx + 1}
                  </RNText>
                </View>
                {label ? (
                  <RNText
                    style={[
                      styles.stepLabelText,
                      {
                        color: isActive ? theme.colors.primary : theme.colors.textMuted,
                        fontWeight: isActive ? '600' : '400',
                        fontSize: theme.typography.sizes.xs,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {label}
                  </RNText>
                ) : null}
              </TouchableOpacity>
              {!isLast ? <View style={[styles.stepConnectingLine, lineDynamic]} /> : null}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}
export const StepperWizard = StepIndicator;


