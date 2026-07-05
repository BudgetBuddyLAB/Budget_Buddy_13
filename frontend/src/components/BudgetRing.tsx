/**
 * Animated SVG progress ring used on the Home Hero card.
 */
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { Palette, font } from '@/src/theme';
import { useColors } from '@/src/theme/ThemeProvider';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  size?: number;
  stroke?: number;
  progress: number; // 0..1
  label?: string;
  valueText: string;
  caption?: string;
  ringColor?: string;
  trackColor?: string;
}

export default function BudgetRing({
  size = 180,
  stroke = 14,
  progress,
  label,
  valueText,
  caption,
  ringColor,
  trackColor,
}: Props) {

  const c = useColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const resolvedRing = ringColor ?? c.brandPrimary;
  const resolvedTrack = trackColor ?? c.surfaceTertiary;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withTiming(Math.max(0, Math.min(1, progress)), {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, p]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - p.value),
  }));

  return (
    <View style={[styles.wrap, { width: size, height: size }]}> 
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={resolvedRing} stopOpacity="1" />
            <Stop offset="1" stopColor={c.brandSecondary} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={resolvedTrack}
          strokeWidth={stroke}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
          {valueText}
        </Text>
        {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      </View>
    </View>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: font.size.sm, color: c.muted, fontWeight: '600', letterSpacing: 0.4, marginBottom: 2 },
  value: { fontSize: 26, color: c.onSurface, fontWeight: '800', letterSpacing: -0.5 },
  caption: { fontSize: font.size.sm, color: c.muted, marginTop: 2, fontWeight: '500' },
});
