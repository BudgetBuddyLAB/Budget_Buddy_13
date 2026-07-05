import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Palette, radius, shadow, spacing } from '@/src/theme';
import { useColors } from '@/src/theme/ThemeProvider';
import { SavingsGoal } from '@/src/types';
import { formatMoney } from '@/src/utils/format';

interface Props {
  goal: SavingsGoal;
  onPress?: () => void;
  testID?: string;
}

export default function GoalCard({ goal, onPress, testID }: Props) {

  const c = useColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const pct = Math.max(0, Math.min(1, goal.target > 0 ? goal.saved / goal.target : 0));
  const size = 60;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);
  const completed = pct >= 1;
  const dueDate = new Date(goal.deadline);
  const daysLeft = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [styles.card, shadow.soft, pressed && { transform: [{ scale: 0.98 }] }]}
    >
      <View style={styles.ringWrap}>
        <Svg width={size} height={size}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={c.surfaceTertiary} strokeWidth={stroke} fill="none" />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={completed ? c.success : c.brandSecondary}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <Text style={styles.pct}>{Math.round(pct * 100)}%</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{goal.name}</Text>
        <Text style={styles.amounts}>
          <Text style={{ fontWeight: '800', color: c.onSurface }}>{formatMoney(goal.saved)}</Text>
          <Text style={{ color: c.muted }}> / {formatMoney(goal.target)}</Text>
        </Text>
        <Text style={styles.meta}>
          {completed ? 'Goal reached 🎉' : daysLeft > 0 ? `${daysLeft} days left` : 'Past due'} • {goal.priority}
        </Text>
      </View>
    </Pressable>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: c.surfaceSecondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: c.border,
  },
  ringWrap: { width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
  pct: { position: 'absolute', fontSize: 12, fontWeight: '800', color: c.onSurface },
  body: { flex: 1 },
  name: { fontWeight: '800', fontSize: 15, color: c.onSurface },
  amounts: { fontSize: 13, marginTop: 2 },
  meta: { fontSize: 11, color: c.muted, marginTop: 4, textTransform: 'capitalize' },
});
