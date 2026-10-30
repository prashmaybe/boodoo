import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './typography.js';
import { Button } from './buttons.js';
import { useTheme } from './theme.js';

/**
 * Universal Card Component
 */
export function Card({
  mode = 'elevated',
  variant = 'elevated',
  padding,
  children,
  style,
  ...props
}) {
  const theme = useTheme();
  const cs = theme.componentSpacing || {};
  const sp = theme.spacing || {};
  const effectiveMode = mode || variant;

  const cardPadding =
    padding ??
    cs.card ??
    cs.cardPadding ??
    sp.card ??
    sp.cardPadding ??
    16;

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
          padding: cardPadding,
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

Card.Title = function CardTitle({ title, subtitle, left, right, style, marginBottom }) {
  const theme = useTheme();
  const cs = theme.componentSpacing || {};
  const sp = theme.spacing || {};
  const effMarginBottom =
    marginBottom ??
    cs.cardTitleMarginBottom ??
    cs.cardTitleBottom ??
    sp.cardTitleMarginBottom ??
    sp.cardTitleBottom ??
    8;
  return (
    <View style={[styles.cardTitleRow, { marginBottom: effMarginBottom }, style]}>
      {left ? <View style={styles.cardTitleSideLeft}>{left()}</View> : null}
      <View style={styles.cardTitleCenter}>
        <Text variant="h4" style={styles.cardTitleText}>{title}</Text>
        {subtitle ? <Text variant="muted" style={styles.cardSubtitleText}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.cardTitleSideRight}>{right()}</View> : null}
    </View>
  );
};

Card.Content = function CardContent({ children, style, marginVertical }) {
  const theme = useTheme();
  const cs = theme.componentSpacing || {};
  const sp = theme.spacing || {};
  const effMarginVertical =
    marginVertical ??
    cs.cardContentMarginVertical ??
    cs.cardContentY ??
    sp.cardContentMarginVertical ??
    sp.cardContentY ??
    4;
  return (
    <View style={[{ marginVertical: effMarginVertical }, style]}>
      {children}
    </View>
  );
};

Card.Actions = function CardActions({ children, style, marginTop, gap }) {
  const theme = useTheme();
  const cs = theme.componentSpacing || {};
  const sp = theme.spacing || {};
  const effMarginTop =
    marginTop ??
    cs.cardActionsMarginTop ??
    cs.cardActionsTop ??
    sp.cardActionsMarginTop ??
    sp.cardActionsTop ??
    12;
  const effGap =
    gap ??
    cs.cardActionsGap ??
    sp.cardActionsGap ??
    8;
  return (
    <View style={[styles.cardActions, { marginTop: effMarginTop, gap: effGap }, style]}>
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

Card.Section = function CardSection({ children, style }) {
  return <View style={style}>{children}</View>;
};

/**
 * Surface Component
 */
export function Surface({
  elevation = 1,
  padding,
  children,
  style,
  ...props
}) {
  const theme = useTheme();
  const cs = theme.componentSpacing || {};
  const sp = theme.spacing || {};
  const effPadding =
    padding ??
    cs.surface ??
    cs.surfacePadding ??
    sp.surface ??
    sp.surfacePadding ??
    16;
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
          padding: effPadding,
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

/**
 * Divider / Separator
 */
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
export const Separator = Divider;

/**
 * PricingCard (RNE UI)
 */
export function PricingCard({
  title,
  price,
  info = [],
  button,
  color,
  onButtonPress,
  padding,
  containerStyle,
}) {
  const theme = useTheme();
  const cs = theme.componentSpacing || {};
  const sp = theme.spacing || {};
  const brandColor = color || theme.colors.primary;
  const effPadding =
    padding ??
    cs.pricingCardPadding ??
    sp.pricingCardPadding ??
    20;

  return (
    <View
      style={[
        styles.pricingCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          padding: effPadding,
          ...theme.shadows.md,
        },
        containerStyle,
      ]}
    >
      <Text style={[styles.pricingTitle, { color: brandColor }]}>{title}</Text>
      <Text style={[styles.pricingPrice, { color: theme.colors.text }]}>{price}</Text>
      <View style={styles.pricingInfoList}>
        {info.map((item, idx) => (
          <Text key={idx} variant="muted" style={styles.pricingInfoItem}>
            ✓ {item}
          </Text>
        ))}
      </View>
      <Button
        title={button?.title || 'Get Started'}
        onPress={onButtonPress || button?.onPress}
        style={[styles.pricingCardButton, { backgroundColor: brandColor }]}
      />
    </View>
  );
}

/**
 * Tile (RNE UI)
 */
export function Tile({
  imageSrc,
  title,
  caption,
  icon,
  onPress,
  width = '100%',
  height = 200,
  containerStyle,
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.tileContainer,
        { width, height, borderRadius: theme.radii.lg },
        containerStyle,
      ]}
    >
      {imageSrc ? (
        <Image source={imageSrc} style={[StyleSheet.absoluteFill, { borderRadius: theme.radii.lg }]} />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.darkCard }]} />
      )}
      <View style={styles.tileOverlay}>
        {icon ? <View style={styles.tileIconMargin}>{icon}</View> : null}
        {title ? <Text style={styles.tileTitle}>{title}</Text> : null}
        {caption ? <Text style={styles.tileCaption}>{caption}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

export function StatWidget({
  title,
  value,
  trend,
  trendDirection = 'up',
  icon,
  padding,
  style,
  ...props
}) {
  const theme = useTheme();
  const cs = theme.componentSpacing || {};
  const sp = theme.spacing || {};
  const effPadding =
    padding ??
    cs.statWidgetPadding ??
    cs.statWidget ??
    sp.statWidgetPadding ??
    sp.statWidget ??
    16;
  return (
    <View
      style={[
        styles.cardBase,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          padding: effPadding,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        },
        style,
      ]}
      {...props}
    >
      <View style={styles.statHeaderRow}>
        {title ? (
          <Text style={[styles.statTitle, { fontSize: theme.typography.sizes.sm, color: theme.colors.textMuted || '#64748b' }]}>
            {title}
          </Text>
        ) : null}
        {icon ? <View>{icon}</View> : null}
      </View>
      <Text style={[styles.statValue, { color: theme.colors.text }]}>
        {value}
      </Text>
      {trend ? (
        <Text
          style={[
            styles.statTrend,
            {
              fontSize: theme.typography.sizes.xs,
              color: trendDirection === 'up' ? theme.colors.success : theme.colors.danger,
            },
          ]}
        >
          {trend}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
  pricingCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pricingPrice: {
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 8,
  },
  pricingInfoList: {
    width: '100%',
    marginVertical: 8,
    gap: 6,
  },
  pricingInfoItem: {
    fontSize: 14,
  },
  tileContainer: {
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  tileOverlay: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  tileTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  tileCaption: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 2,
  },
  cardTitleSideLeft: {
    marginRight: 12,
  },
  cardTitleCenter: {
    flex: 1,
  },
  cardTitleText: {
    fontWeight: '700',
  },
  cardSubtitleText: {
    marginTop: 2,
  },
  cardTitleSideRight: {
    marginLeft: 12,
  },
  pricingCardButton: {
    marginTop: 16,
  },
  tileIconMargin: {
    marginBottom: 8,
  },
  statHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statTitle: {
    fontWeight: '500',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statTrend: {
    fontWeight: '600',
  },
});
