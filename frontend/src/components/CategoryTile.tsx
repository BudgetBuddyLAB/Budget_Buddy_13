import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Palette, radius, shadow, spacing } from '@/src/theme';
import { useColors } from '@/src/theme/ThemeProvider';

interface Props {
  emoji: string;
  label: string;
  amount?: string;
  color: string;
  onPress?: () => void;
  testID?: string;
  selected?: boolean;
  style?: ViewStyle;
}

export default function CategoryTile({ emoji, label, amount, color, onPress, testID, selected, style }: Props) {

  const c = useColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.tile,
        shadow.soft,
        selected && { borderColor: color, borderWidth: 2 },
        pressed && { transform: [{ scale: 0.97 }] },
        style,
      ]}
    >
      <View style={[styles.iconBubble, { backgroundColor: color + '22' }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
      {amount !== undefined ? <Text style={styles.amount} numberOfLines={1}>{amount}</Text> : null}
    </Pressable>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: c.surfaceSecondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 96,
    borderWidth: 1,
    borderColor: c.border,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emoji: { fontSize: 22 },
  label: { fontSize: 13, fontWeight: '600', color: c.onSurface },
  amount: { fontSize: 12, color: c.muted, marginTop: 2, fontWeight: '600' },
});
