/**
 * Custom animated bottom tab bar with sliding pill highlight.
 * Used in app/(tabs)/_layout.tsx.
 */
import React, { useEffect, useMemo } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, shadow, spacing } from '@/src/theme';
import { useColors } from '@/src/theme/ThemeProvider';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home',
  analytics: 'bar-chart',
  goals: 'flag',
  profile: 'person-circle',
};
const LABELS: Record<string, string> = {
  index: 'Home',
  analytics: 'Analytics',
  goals: 'Goals',
  profile: 'Profile',
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {

  const c = useColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const insets = useSafeAreaInsets();
  const tabWidth = useSharedValue(0);
  const indicatorX = useSharedValue(0);

  // animate indicator on tab change
  useEffect(() => {
    if (tabWidth.value > 0) {
      indicatorX.value = withTiming(state.index * tabWidth.value, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [state.index, tabWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: tabWidth.value,
  }));

  return (
    <View
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width - spacing.md * 2;
        const tw = w / state.routes.length;
        tabWidth.value = tw;
        indicatorX.value = state.index * tw;
      }}
      testID="bottom-tab-bar"
    >
      <View style={styles.inner}>
        <Animated.View style={[styles.indicator, indicatorStyle]} pointerEvents="none" />
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
          const iconName = ICONS[route.name] ?? 'ellipse';
          const label = LABELS[route.name] ?? route.name;
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              testID={`tab-${route.name === 'index' ? 'home' : route.name}`}
              style={styles.tab}
              hitSlop={6}
            >
              <Ionicons name={iconName} size={focused ? 22 : 20} color={focused ? c.brandPrimary : c.muted} />
              <Text style={[styles.label, { color: focused ? c.brandPrimary : c.muted, fontWeight: focused ? '800' : '600' }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  bar: {
    backgroundColor: c.surfaceSecondary,
    borderTopWidth: 1,
    borderTopColor: c.border,
    paddingTop: 8,
    paddingHorizontal: spacing.md,
    ...shadow.soft,
  },
  inner: {
    flexDirection: 'row',
    position: 'relative',
    height: 56,
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    backgroundColor: c.brandTertiary,
    borderRadius: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: { fontSize: 11, marginTop: 2, letterSpacing: 0.2 },
});
