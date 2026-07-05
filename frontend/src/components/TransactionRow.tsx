import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, radius, spacing } from '@/src/theme';
import { useColors } from '@/src/theme/ThemeProvider';
import { Transaction } from '@/src/types';
import { getCategory } from '@/src/constants/categories';
import { formatDayMonth, formatMoney } from '@/src/utils/format';

interface Props {
  txn: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
  testID?: string;
}

export default function TransactionRow({ txn, onPress, onDelete, testID }: Props) {

  const c = useColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const cat = getCategory(txn.category);
  const isIncome = txn.type === 'income';
  return (
    <View style={styles.outer} testID={testID}>
      <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]} onPress={onPress}>
        <View style={[styles.icon, { backgroundColor: cat.color + '22' }]}>
          <Text style={styles.emoji}>{cat.emoji}</Text>
        </View>
        <View style={styles.middle}>
          <Text style={styles.title} numberOfLines={1}>
            {txn.title || cat.label}
          </Text>
          <Text style={styles.sub}>
            {formatDayMonth(txn.date)} • {cat.label}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.amount, { color: isIncome ? c.income : c.expense }]}>
            {(isIncome ? '+ ' : '- ') + formatMoney(txn.amount)}
          </Text>
          {onDelete && (
            <Pressable
              onPress={onDelete}
              hitSlop={8}
              testID={`${testID}-delete`}
              style={({ pressed }) => [styles.del, pressed && { opacity: 0.6 }]}
            >
              <Ionicons name="trash-outline" size={16} color={c.muted} />
            </Pressable>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  outer: { backgroundColor: c.surfaceSecondary, borderRadius: radius.md, marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  icon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 20 },
  middle: { flex: 1 },
  title: { fontWeight: '700', color: c.onSurface, fontSize: 14 },
  sub: { color: c.muted, fontSize: 12, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 4 },
  amount: { fontWeight: '800', fontSize: 14, letterSpacing: -0.2 },
  del: { paddingTop: 2 },
});
