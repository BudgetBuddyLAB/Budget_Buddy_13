import { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore, useMonthlySummary } from '@/src/store/budgetStore';
import { Palette, radius, shadow, spacing } from '@/src/theme';
import { useColors } from '@/src/theme/ThemeProvider';
import BudgetRing from '@/src/components/BudgetRing';
import CategoryTile from '@/src/components/CategoryTile';
import TransactionRow from '@/src/components/TransactionRow';
import AddTransactionSheet, { AddTxnSheetHandle } from '@/src/components/AddTransactionSheet';
import VoiceAssistant from '@/src/components/VoiceAssistant';
import { EXPENSE_CATEGORIES } from '@/src/constants/categories';
import { formatMoney, formatShort, greet, sameMonth } from '@/src/utils/format';

export default function HomeScreen() {

  const c = useColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const { user, transactions, deleteTransaction } = useStore();
  const summary = useMonthlySummary();
  const sheetRef = useRef<AddTxnSheetHandle>(null);

  const recent = useMemo(() => transactions.slice(0, 8), [transactions]);

  // Per-category month totals
  const catTotals = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense' && sameMonth(t.date))
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return map;
  }, [transactions]);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  const quickActions = [
    { id: 'add-expense', icon: 'remove-circle' as const, label: 'Expense', color: c.expense, onPress: () => sheetRef.current?.open({ type: 'expense' }) },
    { id: 'add-income', icon: 'add-circle' as const, label: 'Income', color: c.income, onPress: () => sheetRef.current?.open({ type: 'income' }) },
    { id: 'transfer', icon: 'swap-horizontal' as const, label: 'Transfer', color: c.brandSecondary, onPress: () => sheetRef.current?.open({ type: 'expense' }) },
    { id: 'goal', icon: 'flag' as const, label: 'New Goal', color: c.warning, onPress: () => sheetRef.current?.open({ type: 'income' }) },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.hello}>{greet()},</Text>
            <Text style={styles.name} testID="home-greeting-name">{user.name || 'Buddy'} 👋</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <Pressable
            testID="home-add-button"
            onPress={() => sheetRef.current?.open({ type: 'expense' })}
            style={({ pressed }) => [styles.headerAdd, pressed && { opacity: 0.8 }]}
          >
            <Ionicons name="notifications-outline" size={20} color={c.onSurface} />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={[styles.hero, shadow.card]} testID="hero-card">
          <LinearGradient
            colors={[c.brandPrimary, c.brandSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroRow}>
              <View>
                <Text style={styles.heroLabel}>Total Balance</Text>
                <Text style={styles.heroBalance} testID="home-balance">{formatMoney(summary.balance)}</Text>
                <Text style={styles.heroSub}>This month • {summary.count} txns</Text>
              </View>
              <BudgetRing
                size={120}
                stroke={10}
                progress={summary.budget > 0 ? summary.expense / summary.budget : 0}
                label="Spent"
                valueText={`${Math.round(summary.spentPct)}%`}
                caption={`of ${formatShort(summary.budget)}`}
                ringColor="#FFFFFF"
                trackColor="rgba(255,255,255,0.25)"
              />
            </View>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStat}>
                <View style={styles.heroPill}><Ionicons name="arrow-down" size={14} color="#fff" /></View>
                <View>
                  <Text style={styles.heroStatLabel}>Income</Text>
                  <Text style={styles.heroStatValue} testID="home-income">{formatMoney(summary.income)}</Text>
                </View>
              </View>
              <View style={styles.heroStat}>
                <View style={[styles.heroPill, { backgroundColor: 'rgba(0,0,0,0.18)' }]}>
                  <Ionicons name="arrow-up" size={14} color="#fff" />
                </View>
                <View>
                  <Text style={styles.heroStatLabel}>Expense</Text>
                  <Text style={styles.heroStatValue} testID="home-expense">{formatMoney(summary.expense)}</Text>
                </View>
              </View>
              <View style={styles.heroStat}>
                <View style={[styles.heroPill, { backgroundColor: 'rgba(0,0,0,0.18)' }]}>
                  <Ionicons name="trending-up" size={14} color="#fff" />
                </View>
                <View>
                  <Text style={styles.heroStatLabel}>Savings</Text>
                  <Text style={styles.heroStatValue} testID="home-savings">{formatMoney(summary.savings)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickRow}>
          {quickActions.map((q) => (
            <Pressable
              key={q.id}
              onPress={q.onPress}
              testID={`quick-${q.id}`}
              style={({ pressed }) => [styles.quickItem, shadow.soft, pressed && { transform: [{ scale: 0.96 }] }]}
            >
              <View style={[styles.quickIcon, { backgroundColor: q.color + '22' }]}>
                <Ionicons name={q.icon} size={22} color={q.color} />
              </View>
              <Text style={styles.quickLabel}>{q.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Categories Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <FlatList
          scrollEnabled={false}
          data={EXPENSE_CATEGORIES}
          keyExtractor={(c) => c.id}
          numColumns={4}
          columnWrapperStyle={{ gap: spacing.sm }}
          contentContainerStyle={{ gap: spacing.sm }}
          renderItem={({ item }) => (
            <CategoryTile
              testID={`cat-tile-${item.id}`}
              emoji={item.emoji}
              label={item.label}
              color={item.color}
              amount={catTotals[item.id] ? formatShort(catTotals[item.id]) : `${'\u20B9'}0`}
            />
          )}
        />

        {/* Recent transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recent.length > 0 && (
            <Text style={styles.muted}>{transactions.length} total</Text>
          )}
        </View>
        {recent.length === 0 ? (
          <View style={styles.empty} testID="home-empty">
            <Ionicons name="receipt-outline" size={32} color={c.muted} />
            <Text style={styles.emptyText}>No transactions yet. Tap + to add one.</Text>
          </View>
        ) : (
          recent.map((t) => (
            <TransactionRow
              key={t.id}
              txn={t}
              testID={`txn-${t.id}`}
              onPress={() => sheetRef.current?.open({ edit: t })}
              onDelete={() => deleteTransaction(t.id)}
            />
          ))
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* FAB */}
      <Pressable
        testID="fab-add"
        onPress={() => sheetRef.current?.open({ type: 'expense' })}
        style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.94 }] }]}
      >
        <LinearGradient
          colors={[c.brandPrimary, c.brandSecondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>

      <AddTransactionSheet ref={sheetRef} />
      <VoiceAssistant bottom={80} />
    </View>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  root: { flex: 1, backgroundColor: c.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  hello: { color: c.muted, fontSize: 13, fontWeight: '600' },
  name: { color: c.onSurface, fontSize: 22, fontWeight: '800', marginTop: 2, letterSpacing: -0.4 },
  date: { color: c.muted, fontSize: 12, marginTop: 2 },
  headerAdd: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: c.surfaceSecondary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: c.border,
  },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  hero: { borderRadius: 28, overflow: 'hidden', marginTop: spacing.sm },
  heroContent: { padding: spacing.lg, gap: spacing.lg },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroBalance: { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 4, letterSpacing: -1 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  heroStatsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.15)', padding: spacing.md, borderRadius: radius.lg },
  heroStat: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  heroPill: { width: 28, height: 28, borderRadius: 99, backgroundColor: 'rgba(0,0,0,0.18)', alignItems: 'center', justifyContent: 'center' },
  heroStatLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '600' },
  heroStatValue: { color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: -0.2 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: c.onSurface, marginTop: spacing.xl, marginBottom: spacing.md, letterSpacing: -0.2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.md },
  muted: { color: c.muted, fontSize: 12, fontWeight: '600' },
  quickRow: { flexDirection: 'row', gap: spacing.sm },
  quickItem: { flex: 1, backgroundColor: c.surfaceSecondary, borderRadius: radius.lg, paddingVertical: 14, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: c.border },
  quickIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 12, fontWeight: '700', color: c.onSurface },
  empty: { alignItems: 'center', gap: 8, padding: spacing.xl, backgroundColor: c.surfaceSecondary, borderRadius: radius.lg, borderWidth: 1, borderColor: c.border },
  emptyText: { color: c.muted, fontSize: 13 },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: c.brandPrimary,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
