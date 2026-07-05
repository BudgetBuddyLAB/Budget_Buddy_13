import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, BarChart, LineChart } from 'react-native-gifted-charts';
import { useStore } from '@/src/store/budgetStore';
import { Palette, radius, shadow, spacing } from '@/src/theme';
import { useColors } from '@/src/theme/ThemeProvider';
import { EXPENSE_CATEGORIES, MOODS } from '@/src/constants/categories';
import { formatMoney, formatShort, sameMonth } from '@/src/utils/format';
import VoiceAssistant from '@/src/components/VoiceAssistant';

const { width } = Dimensions.get('window');

type Range = 'week' | 'month' | 'year';

export default function AnalyticsScreen() {

  const c = useColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const { transactions } = useStore();
  const [range, setRange] = useState<Range>('month');

  const filtered = useMemo(() => {
    const now = Date.now();
    const cutoffMs: Record<Range, number> = {
      week: 7 * 24 * 3600 * 1000,
      month: 30 * 24 * 3600 * 1000,
      year: 365 * 24 * 3600 * 1000,
    };
    return transactions.filter((t) => now - new Date(t.date).getTime() <= cutoffMs[range]);
  }, [transactions, range]);

  const expenseTotal = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const incomeTotal = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  const pieData = useMemo(() => {
    const data = EXPENSE_CATEGORIES.map((c) => ({
      value: filtered.filter((t) => t.type === 'expense' && t.category === c.id).reduce((s, t) => s + t.amount, 0),
      color: c.color,
      text: c.label,
    })).filter((d) => d.value > 0);
    return data;
  }, [filtered]);

  // Last 6 months bar
  const barData = useMemo(() => {
    const months: { label: string; value: number; frontColor: string }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString('en-IN', { month: 'short' });
      const val = transactions
        .filter((t) => t.type === 'expense' && new Date(t.date).getMonth() === d.getMonth() && new Date(t.date).getFullYear() === d.getFullYear())
        .reduce((s, t) => s + t.amount, 0);
      months.push({ label, value: val, frontColor: c.brandPrimary });
    }
    return months;
  }, [transactions]);

  // Income vs Expense line (last 6 months)
  const lineIncome = useMemo(() => {
    const arr: { value: number; label: string }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const v = transactions
        .filter((t) => t.type === 'income' && new Date(t.date).getMonth() === d.getMonth() && new Date(t.date).getFullYear() === d.getFullYear())
        .reduce((s, t) => s + t.amount, 0);
      arr.push({ value: v, label: d.toLocaleDateString('en-IN', { month: 'short' }) });
    }
    return arr;
  }, [transactions]);

  const lineExpense = useMemo(() => {
    return barData.map((m) => ({ value: m.value, label: m.label }));
  }, [barData]);

  // Mood breakdown
  const moodStats = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter((t) => sameMonth(t.date)).forEach((t) => {
      map[t.mood] = (map[t.mood] || 0) + 1;
    });
    return map;
  }, [transactions]);
  const totalMoodCount = Object.values(moodStats).reduce((a, b) => a + b, 0);
  const topMood = Object.entries(moodStats).sort((a, b) => b[1] - a[1])[0];

  // Top categories
  const topCats = pieData.slice().sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.h1}>Analytics</Text>
          <Text style={styles.subtitle}>Understand where your money goes.</Text>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Segmented */}
        <View style={styles.segment}>
          {(['week', 'month', 'year'] as Range[]).map((r) => {
            const active = range === r;
            return (
              <Pressable
                key={r}
                onPress={() => setRange(r)}
                testID={`range-${r}`}
                style={[styles.segItem, active && styles.segItemActive]}
              >
                <Text style={[styles.segText, active && styles.segTextActive]}>
                  {r === 'week' ? 'Week' : r === 'month' ? 'Month' : 'Year'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Summary */}
        <View style={[styles.summaryRow]}>
          <View style={[styles.summaryCard, shadow.soft]}>
            <Text style={styles.muted}>Total Expense</Text>
            <Text style={[styles.summaryNum, { color: c.expense }]} testID="analytics-expense-total">{formatMoney(expenseTotal)}</Text>
          </View>
          <View style={[styles.summaryCard, shadow.soft]}>
            <Text style={styles.muted}>Total Income</Text>
            <Text style={[styles.summaryNum, { color: c.income }]} testID="analytics-income-total">{formatMoney(incomeTotal)}</Text>
          </View>
        </View>

        {/* Pie */}
        <View style={[styles.card, shadow.soft]}>
          <Text style={styles.cardTitle}>Spending by Category</Text>
          {pieData.length === 0 ? (
            <Text style={styles.muted}>Add some expenses to see breakdown.</Text>
          ) : (
            <View style={styles.pieRow}>
              <PieChart
                data={pieData}
                donut
                radius={80}
                innerRadius={50}
                centerLabelComponent={() => (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: c.muted, fontSize: 11, fontWeight: '600' }}>Spent</Text>
                    <Text style={{ color: c.onSurface, fontWeight: '800', fontSize: 15 }}>{formatShort(expenseTotal)}</Text>
                  </View>
                )}
              />
              <View style={styles.legend}>
                {topCats.map((d, i) => (
                  <View key={i} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                    <Text style={styles.legendText} numberOfLines={1}>
                      {d.text}
                    </Text>
                    <Text style={styles.legendVal}>{formatShort(d.value)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Bar */}
        <View style={[styles.card, shadow.soft]}>
          <Text style={styles.cardTitle}>Monthly Expenses</Text>
          <BarChart
            data={barData}
            width={width - 96}
            barWidth={22}
            spacing={18}
            barBorderRadius={6}
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisLabelTextStyle={{ color: c.muted, fontSize: 10 }}
            yAxisTextStyle={{ color: c.muted, fontSize: 10 }}
            noOfSections={4}
            frontColor={c.brandPrimary}
            hideRules
          />
        </View>

        {/* Line */}
        <View style={[styles.card, shadow.soft]}>
          <Text style={styles.cardTitle}>Income vs Expense</Text>
          <LineChart
            data={lineIncome}
            data2={lineExpense}
            color1={c.income}
            color2={c.expense}
            thickness={3}
            dataPointsColor1={c.income}
            dataPointsColor2={c.expense}
            width={width - 96}
            spacing={42}
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisLabelTextStyle={{ color: c.muted, fontSize: 10 }}
            yAxisTextStyle={{ color: c.muted, fontSize: 10 }}
            hideRules
            curved
            initialSpacing={10}
          />
          <View style={{ flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={[styles.legendDot, { backgroundColor: c.income }]} />
              <Text style={styles.muted}>Income</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={[styles.legendDot, { backgroundColor: c.expense }]} />
              <Text style={styles.muted}>Expense</Text>
            </View>
          </View>
        </View>

        {/* Mood */}
        <View style={[styles.card, shadow.soft]}>
          <Text style={styles.cardTitle}>Mood Tracker</Text>
          {totalMoodCount === 0 ? (
            <Text style={styles.muted}>Log a transaction to start tracking moods.</Text>
          ) : (
            <>
              <Text style={styles.muted}>
                Most common: <Text style={{ color: c.onSurface, fontWeight: '800' }}>
                  {MOODS.find((m) => m.id === (topMood?.[0] as string))?.emoji} {MOODS.find((m) => m.id === (topMood?.[0] as string))?.label}
                </Text>
              </Text>
              <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
                {MOODS.map((m) => {
                  const count = moodStats[m.id] || 0;
                  const pct = totalMoodCount > 0 ? count / totalMoodCount : 0;
                  return (
                    <View key={m.id} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <Text style={{ fontSize: 18 }}>{m.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <View style={styles.barTrack}>
                          <View style={[styles.barFill, { width: `${Math.max(2, pct * 100)}%`, backgroundColor: c.brandPrimary }]} />
                        </View>
                      </View>
                      <Text style={[styles.muted, { width: 32, textAlign: 'right' }]}>{count}</Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </View>

        {/* Insights */}
        <View style={[styles.card, shadow.soft]}>
          <Text style={styles.cardTitle}>Smart Insights</Text>
          {topCats[0] ? (
            <Text style={styles.insightText}>
              <Ionicons name="bulb" size={14} color={c.warning} /> You spent the most on{' '}
              <Text style={{ fontWeight: '800', color: topCats[0].color }}>{topCats[0].text}</Text> this {range}.
            </Text>
          ) : null}
          {incomeTotal > 0 && expenseTotal > 0 && (
            <Text style={styles.insightText}>
              <Ionicons name="trending-up" size={14} color={c.success} /> Savings rate{' '}
              <Text style={{ fontWeight: '800', color: c.success }}>
                {Math.max(0, Math.round(((incomeTotal - expenseTotal) / incomeTotal) * 100))}%
              </Text>
              {' '}of income.
            </Text>
          )}
          {expenseTotal > incomeTotal && incomeTotal > 0 && (
            <Text style={styles.insightText}>
              <Ionicons name="warning" size={14} color={c.error} /> You're spending more than you earn — review big tickets.
            </Text>
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
      <VoiceAssistant bottom={90} />
    </View>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  root: { flex: 1, backgroundColor: c.surface },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  h1: { fontSize: 26, fontWeight: '800', color: c.onSurface, letterSpacing: -0.5 },
  subtitle: { color: c.muted, marginTop: 2 },
  scroll: { paddingHorizontal: spacing.lg },
  segment: { flexDirection: 'row', backgroundColor: c.surfaceSecondary, borderRadius: radius.pill, padding: 4, borderWidth: 1, borderColor: c.border, marginBottom: spacing.md },
  segItem: { flex: 1, paddingVertical: 9, borderRadius: radius.pill, alignItems: 'center' },
  segItemActive: { backgroundColor: c.brandPrimary },
  segText: { fontWeight: '700', color: c.onSurfaceSecondary, fontSize: 13 },
  segTextActive: { color: '#fff' },
  summaryRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  summaryCard: { flex: 1, backgroundColor: c.surfaceSecondary, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: c.border },
  summaryNum: { fontSize: 18, fontWeight: '800', marginTop: 2 },
  muted: { color: c.muted, fontSize: 12, fontWeight: '600' },
  card: { backgroundColor: c.surfaceSecondary, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: c.border },
  cardTitle: { fontSize: 15, fontWeight: '800', color: c.onSurface, marginBottom: spacing.md },
  pieRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  legend: { flex: 1, gap: 6 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 99 },
  legendText: { flex: 1, color: c.onSurfaceSecondary, fontSize: 12, fontWeight: '600' },
  legendVal: { color: c.onSurface, fontSize: 12, fontWeight: '800' },
  barTrack: { height: 8, backgroundColor: c.surfaceTertiary, borderRadius: 99, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 99 },
  insightText: { color: c.onSurfaceSecondary, fontSize: 13, lineHeight: 20, marginTop: 4 },
});
