import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Universal Box component (Gluestack / Tamagui / Wix View)
 */
export function Box({ children, style, ...props }) {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
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
 * Distributes child elements into numColumns equal flexible columns with shared row layout,
 * accounting for inter-column gap without overflowing container bounds.
 */
export function Grid({ numColumns = 2, gap = 8, children, style, ...props }) {
  const cols = Math.max(1, Number(numColumns) || 2);
  const childArray = React.Children.toArray(children).filter(Boolean);
  const rows = [];

  for (let i = 0; i < childArray.length; i += cols) {
    rows.push(childArray.slice(i, i + cols));
  }

  return (
    <View style={[styles.grid, { gap }, style]} {...props}>
      {rows.map((rowItems, rowIdx) => {
        const emptySlots = cols - rowItems.length;
        return (
          <View key={`row-${rowIdx}`} style={[styles.gridRow, { gap }]}>
            {rowItems.map((child, colIdx) => (
              <View key={`col-${colIdx}`} style={styles.gridCol}>
                {child}
              </View>
            ))}
            {emptySlots > 0 &&
              Array.from({ length: emptySlots }).map((_, slotIdx) => (
                <View key={`empty-${slotIdx}`} style={styles.gridCol} />
              ))}
          </View>
        );
      })}
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
    flexDirection: 'column',
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    width: '100%',
  },
  gridCol: {
    flex: 1,
    boxSizing: 'border-box',
  },
});
