import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useStore } from '@/src/store/budgetStore';
import { Palette, radius, shadow, spacing } from '@/src/theme';
import { useColors } from '@/src/theme/ThemeProvider';
import { Transaction } from '@/src/types';
import { getCategory } from '@/src/constants/categories';
import { formatMoney } from '@/src/utils/format';
import TransactionRow from '@/src/components/TransactionRow';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

interface DayCell {
  date: Date | null;
  income: number;
  expense: number;
  count: number;
}

export default function CalendarScreen() {
  const router = useRouter();
  const c = useColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const { transactions, deleteTransaction } = useStore();
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState<Date | null>(new Date());

  // Build grid for the visible month
  const grid = useMemo<DayCell[]>(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: DayCell[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ date: null, income: 0, expense: 0, count: 0 });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayTxns = transactions.filter((t) => isSameDay(new Date(t.date), date));
      const income = dayTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = dayTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      cells.push({ date, income, expense, count: dayTxns.length });
    }
    // pad to multiple of 7
    while (cells.length % 7 !== 0) cells.push({ date: null, income: 0, expense: 0, count: 0 });
    return cells;
  }, [cursor, transactions]);

  // Month totals
  const monthTotals = useMemo(() => {
    const inMonth = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth();
    });
    return {
      income: inMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: inMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      count: inMonth.length,
    };
  }, [transactions, cursor]);

  const dayTransactions = useMemo(() => {
    if (!selected) return [];
    return transactions.filter((t) => isSameDay(new Date(t.date), selected));
  }, [transactions, selected]);

  const goPrev = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const goNext = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  const goToday = () => {
    const today = new Date();
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(today);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} testID="calendar-back" hitSlop={10} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={20} color={c.onSurface} />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.h1}>Calendar</Text>
          </View>
          <Pressable onPress={goToday} testID="calendar-today" hitSlop={10} style={[styles.iconBtn, styles.todayBtn]}>
            <Text style={styles.todayTxt}>Today</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <View style={styles.monthBar}>
        <Pressable onPress={goPrev} testID="calendar-prev" hitSlop={10} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={20} color={c.onSurface} />
        </Pressable>
        <Text style={styles.monthLabel} testID="calendar-month-label">
          {cursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </Text>
        <Pressable onPress={goNext} testID="calendar-next" hitSlop={10} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={20} color={c.onSurface} />
        </Pressable>
      </View>

      <View style={styles.monthSummary}>
        <View style={styles.summaryItem}>
          <Text style={styles.muted}>Income</Text>
          <Text style={[styles.summaryVal, { color: c.income }]}>{formatMoney(monthTotals.income)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.muted}>Expense</Text>
          <Text style={[styles.summaryVal, { color: c.expense }]}>{formatMoney(monthTotals.expense)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.muted}>Txns</Text>
          <Text style={styles.summaryVal}>{monthTotals.count}</Text>
        </View>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((w) => (
          <Text key={w} style={styles.weekTxt}>{w}</Text>
        ))}
      </View>

      <View style={styles.gridCard}>
        {Array.from({ length: grid.length / 7 }).map((_, weekIdx) => (
          <View key={weekIdx} style={styles.weekGrid}>
            {grid.slice(weekIdx * 7, weekIdx * 7 + 7).map((cell, i) => {
              const isToday = cell.date && isSameDay(cell.date, new Date());
              const isSelected = cell.date && selected && isSameDay(cell.date, selected);
              return (
                <Pressable
                  key={i}
                  testID={cell.date ? `day-${cell.date.getDate()}` : `day-empty-${weekIdx}-${i}`}
                  disabled={!cell.date}
                  onPress={() => cell.date && setSelected(cell.date)}
                  style={[styles.dayCell, isSelected && { backgroundColor: c.brandPrimary }]}
                >
                  {cell.date && (
                    <>
                      <Text
                        style={[
                          styles.dayNum,
                          isToday && !isSelected && { color: c.brandPrimary, fontWeight: '800' },
                          isSelected && { color: c.onBrandPrimary, fontWeight: '800' },
                        ]}
                      >
                        {cell.date.getDate()}
                      </Text>
                      <View style={styles.dotsRow}>
                        {cell.expense > 0 && <View style={[styles.dot, { backgroundColor: isSelected ? '#fff' : c.expense }]} />}
                        {cell.income > 0 && <View style={[styles.dot, { backgroundColor: isSelected ? '#fff' : c.income }]} />}
                      </View>
                    </>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Day detail */}
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>
          {selected ? selected.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }) : 'Select a day'}
        </Text>
        <Text style={styles.muted} testID="day-summary">
          {dayTransactions.length} transactions
        </Text>
      </View>

      <FlatList
        data={dayTransactions}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={28} color={c.muted} />
            <Text style={styles.muted}>No transactions on this day.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TransactionRow
            txn={item}
            testID={`cal-txn-${item.id}`}
            onDelete={() => deleteTransaction(item.id)}
          />
        )}
      />
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
    iconBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: c.surfaceSecondary, borderWidth: 1, borderColor: c.border },
    todayBtn: { width: 'auto', paddingHorizontal: 12 },
    todayTxt: { color: c.brandPrimary, fontWeight: '800', fontSize: 12 },
    h1: { fontSize: 18, fontWeight: '800', color: c.onSurface, letterSpacing: -0.3 },
    monthBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
    navBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: c.surfaceSecondary, borderWidth: 1, borderColor: c.border },
    monthLabel: { fontSize: 16, fontWeight: '800', color: c.onSurface },
    monthSummary: { flexDirection: 'row', backgroundColor: c.surfaceSecondary, marginHorizontal: spacing.lg, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: c.border, marginBottom: spacing.sm },
    summaryItem: { flex: 1, alignItems: 'center' },
    muted: { color: c.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
    summaryVal: { color: c.onSurface, fontSize: 15, fontWeight: '800', marginTop: 2 },
    weekRow: { flexDirection: 'row', paddingHorizontal: spacing.lg + 6, marginTop: spacing.sm, marginBottom: 4 },
    weekTxt: { flex: 1, textAlign: 'center', color: c.muted, fontSize: 11, fontWeight: '700' },
    gridCard: { marginHorizontal: spacing.lg, backgroundColor: c.surfaceSecondary, borderRadius: radius.lg, padding: 6, borderWidth: 1, borderColor: c.border, ...shadow.soft, shadowColor: c.shadow },
    weekGrid: { flexDirection: 'row' },
    dayCell: { flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', margin: 2, borderRadius: 12 },
    dayNum: { color: c.onSurface, fontSize: 14, fontWeight: '600' },
    dotsRow: { flexDirection: 'row', gap: 3, marginTop: 4, height: 4 },
    dot: { width: 4, height: 4, borderRadius: 2 },
    detailCard: { marginHorizontal: spacing.lg, marginTop: spacing.md, marginBottom: spacing.sm },
    detailTitle: { color: c.onSurface, fontWeight: '800', fontSize: 16, letterSpacing: -0.3 },
    empty: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 6 },
  });
