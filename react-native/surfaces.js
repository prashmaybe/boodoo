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

Card.Section = function CardSection({ children, style }) {
  return <View style={style}>{children}</View>;
};

/**
 * Surface Component
 */
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
  containerStyle,
}) {
  const theme = useTheme();
  const brandColor = color || theme.colors.primary;

  return (
    <View
      style={[
        styles.pricingCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
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
        style={{ backgroundColor: brandColor, marginTop: 16 }}
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
        {icon ? <View style={{ marginBottom: 8 }}>{icon}</View> : null}
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
  style,
  ...props
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.cardBase,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          padding: theme.spacing[4],
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        },
        style,
      ]}
      {...props}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        {title ? (
          <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textMuted || '#64748b', fontWeight: '500' }}>
            {title}
          </Text>
        ) : null}
        {icon ? <View>{icon}</View> : null}
      </View>
      <Text style={{ fontSize: 28, fontWeight: '700', color: theme.colors.text, marginBottom: 4 }}>
        {value}
      </Text>
      {trend ? (
        <Text
          style={{
            fontSize: theme.typography.sizes.xs,
            fontWeight: '600',
            color: trendDirection === 'up' ? theme.colors.success : theme.colors.danger,
          }}
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
    padding: 24,
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
    marginVertical: 12,
  },
  pricingInfoList: {
    width: '100%',
    marginVertical: 12,
    gap: 8,
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
});
