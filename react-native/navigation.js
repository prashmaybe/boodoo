import React from 'react';
import {
  View,
  Text as RNText,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { IconButton } from './buttons.js';
import { Text } from './typography.js';
import { useTheme } from './theme.js';

/**
 * Appbar / Header
 */
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

export function Header({
  leftComponent,
  centerComponent,
  rightComponent,
  backgroundColor,
  style,
  ...props
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.appbarHeader,
        {
          backgroundColor: backgroundColor || theme.colors.surface,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: 1,
        },
        style,
      ]}
      {...props}
    >
      <View style={{ minWidth: 40, alignItems: 'flex-start' }}>{leftComponent}</View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {typeof centerComponent === 'string' ? (
          <Text variant="h4" style={{ fontWeight: '700' }}>{centerComponent}</Text>
        ) : (
          centerComponent
        )}
      </View>
      <View style={{ minWidth: 40, alignItems: 'flex-end' }}>{rightComponent}</View>
    </View>
  );
}
export const TopNavigation = Header;

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

/**
 * Drawer
 */
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

/**
 * BottomNavigation / Tabs
 */
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
export const Tabs = BottomNavigation;

/**
 * PageControl
 */
export function PageControl({
  numOfPages = 3,
  currentPage = 0,
  onPagePress,
  color,
  inactiveColor,
  style,
}) {
  const theme = useTheme();
  const activeDot = color || theme.colors.primary;
  const inActiveDot = inactiveColor || theme.colors.border;

  return (
    <View style={[styles.pageControlContainer, style]}>
      {Array.from({ length: numOfPages }).map((_, idx) => {
        const isActive = currentPage === idx;
        return (
          <TouchableOpacity
            key={idx}
            disabled={!onPagePress}
            onPress={() => onPagePress && onPagePress(idx)}
            style={[
              styles.pageControlDot,
              {
                backgroundColor: isActive ? activeDot : inActiveDot,
                width: isActive ? 16 : 8,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
  pageControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  pageControlDot: {
    height: 8,
    borderRadius: 4,
  },
});
