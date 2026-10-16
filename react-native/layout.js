import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Universal Box component (Gluestack / Tamagui / Wix View)
 */
export function Box({ children, style, ...props }) {
  return <View style={style} {...props}>{children}</View>;
}

/**
 * Horizontal Stack with flexible gap (Gluestack / Tamagui XStack)
 */
export function HStack({ space = 8, reversed = false, children, style, ...props }) {
  return (
    <View
      style={[
        styles.hstack,
        {
          flexDirection: reversed ? 'row-reverse' : 'row',
          gap: space,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
export const XStack = HStack;

/**
 * Vertical Stack with flexible gap (Gluestack / Tamagui YStack)
 */
export function VStack({ space = 8, reversed = false, children, style, ...props }) {
  return (
    <View
      style={[
        styles.vstack,
        {
          flexDirection: reversed ? 'column-reverse' : 'column',
          gap: space,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
export const YStack = VStack;

/**
 * Centered layout container (Gluestack Center)
 */
export function Center({ children, style, ...props }) {
  return (
    <View style={[styles.center, style]} {...props}>
      {children}
    </View>
  );
}

/**
 * ZStack: Absolute layered stacking container (Tamagui / Gluestack)
 */
export function ZStack({ children, style, ...props }) {
  return (
    <View style={[styles.zstack, style]} {...props}>
      {React.Children.map(children, (child) => (
        <View style={StyleSheet.absoluteFill}>{child}</View>
      ))}
    </View>
  );
}

/**
 * Pressable wrapper with activeOpacity (Gluestack / RNE UI)
 */
export function Pressable({ children, onPress, style, disabled, ...props }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled}
      style={style}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}

/**
 * Responsive Grid container (Gluestack / Wix UI Lib)
 */
export function Grid({ numColumns = 2, gap = 8, children, style, ...props }) {
  return (
    <View style={[styles.grid, { gap }, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hstack: {
    alignItems: 'center',
  },
  vstack: {
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  zstack: {
    position: 'relative',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
