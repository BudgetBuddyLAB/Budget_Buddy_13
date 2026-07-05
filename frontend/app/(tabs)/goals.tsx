import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/src/store/budgetStore';
import { Palette, radius, shadow, spacing } from '@/src/theme';
import { useColors } from '@/src/theme/ThemeProvider';
import GoalCard from '@/src/components/GoalCard';
import VoiceAssistant from '@/src/components/VoiceAssistant';
import { SavingsGoal } from '@/src/types';
import { formatMoney } from '@/src/utils/format';

type Priority = 'low' | 'medium' | 'high';

export default function GoalsScreen() {

  const c = useColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const { goals, addGoal, updateGoal, deleteGoal } = useStore();
  const [editorOpen, setEditorOpen] = useState(false);
  const [detailGoal, setDetailGoal] = useState<SavingsGoal | null>(null);

  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadlineDays, setDeadlineDays] = useState('90');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState<string | null>(null);

  const [depositAmt, setDepositAmt] = useState('');

  const openEditor = () => {
    setName(''); setTarget(''); setDeadlineDays('90'); setPriority('medium'); setError(null);
    setEditorOpen(true);
  };

  const handleSaveGoal = () => {
    const t = Number(target);
    const days = Number(deadlineDays) || 90;
    if (!name.trim()) { setError('Enter a goal name'); return; }
    if (!t || t <= 0) { setError('Enter a valid target amount'); return; }
    const deadline = new Date(); deadline.setDate(deadline.getDate() + days);
    addGoal({ name: name.trim(), target: t, saved: 0, deadline: deadline.toISOString(), priority });
    setEditorOpen(false);
  };

  const handleDeposit = (delta: number) => {
    if (!detailGoal) return;
    const next = Math.max(0, detailGoal.saved + delta);
    updateGoal(detailGoal.id, { saved: next });
    setDetailGoal({ ...detailGoal, saved: next });
    setDepositAmt('');
  };

  const handleDeleteGoal = () => {
    if (!detailGoal) return;
    deleteGoal(detailGoal.id);
    setDetailGoal(null);
  };

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.h1}>Savings Goals</Text>
            <Text style={styles.subtitle}>Set targets. Celebrate progress.</Text>
          </View>
          <Pressable testID="goals-add-button" onPress={openEditor} style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}>
            <Ionicons name="add" size={22} color="#fff" />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.summary, shadow.soft]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.muted}>Saved across all goals</Text>
            <Text style={styles.summaryNum} testID="goals-total-saved">{formatMoney(totalSaved)}</Text>
            <Text style={styles.muted}>of {formatMoney(totalTarget)} target</Text>
          </View>
          <View style={styles.progressBubble}>
            <Text style={styles.progressPct}>
              {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
            </Text>
          </View>
        </View>

        {goals.length === 0 ? (
          <View style={[styles.empty, shadow.soft]} testID="goals-empty">
            <Ionicons name="flag-outline" size={32} color={c.muted} />
            <Text style={styles.emptyTitle}>No goals yet</Text>
            <Text style={styles.emptyText}>Tap + to create your first savings goal.</Text>
          </View>
        ) : (
          goals.map((g) => (
            <GoalCard key={g.id} goal={g} testID={`goal-${g.id}`} onPress={() => setDetailGoal(g)} />
          ))
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Editor modal */}
      <Modal visible={editorOpen} animationType="slide" transparent onRequestClose={() => setEditorOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setEditorOpen(false)} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>New Goal</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
              testID="goal-name-input"
              placeholder="e.g. Trip to Goa"
              placeholderTextColor={c.muted}
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <Text style={styles.label}>Target Amount ({'\u20B9'})</Text>
            <TextInput
              testID="goal-target-input"
              placeholder="50000"
              placeholderTextColor={c.muted}
              keyboardType="numeric"
              value={target}
              onChangeText={setTarget}
              style={styles.input}
            />
            <Text style={styles.label}>Deadline (days from today)</Text>
            <TextInput
              testID="goal-deadline-input"
              placeholder="90"
              placeholderTextColor={c.muted}
              keyboardType="numeric"
              value={deadlineDays}
              onChangeText={setDeadlineDays}
              style={styles.input}
            />
            <Text style={styles.label}>Priority</Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                const active = priority === p;
                const chipColor = p === 'high' ? c.error : p === 'medium' ? c.warning : c.brandSecondary;
                return (
                  <Pressable
                    key={p}
                    testID={`priority-${p}`}
                    onPress={() => setPriority(p)}
                    style={[styles.priorityChip, { borderColor: active ? chipColor : c.border, backgroundColor: active ? chipColor + '22' : c.surfaceSecondary }]}
                  >
                    <Text style={[styles.priorityText, active && { color: chipColor, fontWeight: '800' }]}>{p}</Text>
                  </Pressable>
                );
              })}
            </View>
            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable onPress={handleSaveGoal} testID="goal-save-button" style={({ pressed }) => [styles.save, pressed && { opacity: 0.9 }]}>
              <Text style={styles.saveText}>Create Goal</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Detail modal */}
      <Modal visible={!!detailGoal} animationType="slide" transparent onRequestClose={() => setDetailGoal(null)}>
        <Pressable style={styles.backdrop} onPress={() => setDetailGoal(null)} />
        {detailGoal && (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalWrap}>
            <View style={styles.modalCard}>
              <View style={styles.handle} />
              <Text style={styles.modalTitle}>{detailGoal.name}</Text>
              <Text style={styles.muted}>Target {formatMoney(detailGoal.target)}</Text>
              <Text style={[styles.summaryNum, { marginTop: spacing.sm }]}>{formatMoney(detailGoal.saved)}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[styles.barFill, {
                    width: `${Math.min(100, (detailGoal.saved / detailGoal.target) * 100)}%`,
                    backgroundColor: detailGoal.saved >= detailGoal.target ? c.success : c.brandSecondary,
                  }]}
                />
              </View>

              <Text style={styles.label}>Deposit / Withdraw Amount</Text>
              <TextInput
                testID="goal-deposit-input"
                placeholder="500"
                placeholderTextColor={c.muted}
                keyboardType="numeric"
                value={depositAmt}
                onChangeText={setDepositAmt}
                style={styles.input}
              />
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <Pressable
                  testID="goal-deposit-button"
                  onPress={() => {
                    const n = Number(depositAmt);
                    if (n > 0) handleDeposit(n);
                  }}
                  style={({ pressed }) => [styles.save, { flex: 1 }, pressed && { opacity: 0.9 }]}
                >
                  <Text style={styles.saveText}>+ Deposit</Text>
                </Pressable>
                <Pressable
                  testID="goal-withdraw-button"
                  onPress={() => {
                    const n = Number(depositAmt);
                    if (n > 0) handleDeposit(-n);
                  }}
                  style={({ pressed }) => [styles.save, { flex: 1, backgroundColor: c.surfaceTertiary }, pressed && { opacity: 0.9 }]}
                >
                  <Text style={[styles.saveText, { color: c.onSurface }]}>- Withdraw</Text>
                </Pressable>
              </View>

              <Pressable
                testID="goal-delete-button"
                onPress={handleDeleteGoal}
                style={({ pressed }) => [styles.delete, pressed && { opacity: 0.8 }]}
              >
                <Ionicons name="trash-outline" size={16} color={c.error} />
                <Text style={{ color: c.error, fontWeight: '700' }}>Delete Goal</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        )}
      </Modal>
      <VoiceAssistant bottom={90} />
    </View>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  root: { flex: 1, backgroundColor: c.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  h1: { fontSize: 26, fontWeight: '800', color: c.onSurface, letterSpacing: -0.5 },
  subtitle: { color: c.muted, marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.brandPrimary, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: spacing.lg },
  summary: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.surfaceSecondary, padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: c.border },
  summaryNum: { fontSize: 22, fontWeight: '800', color: c.onSurface, letterSpacing: -0.4 },
  muted: { color: c.muted, fontSize: 12, fontWeight: '600' },
  progressBubble: { width: 64, height: 64, borderRadius: 32, backgroundColor: c.brandTertiary, alignItems: 'center', justifyContent: 'center' },
  progressPct: { fontWeight: '800', color: c.brandPrimary },
  empty: { backgroundColor: c.surfaceSecondary, borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: c.border, gap: 6 },
  emptyTitle: { fontWeight: '800', fontSize: 16, color: c.onSurface, marginTop: 4 },
  emptyText: { color: c.muted, fontSize: 13 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(17,24,39,0.45)' },
  modalWrap: { flex: 1, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: c.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: spacing.lg, paddingBottom: spacing.xl },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 99, backgroundColor: c.borderStrong, marginBottom: spacing.md },
  modalTitle: { fontSize: 22, fontWeight: '800', color: c.onSurface, letterSpacing: -0.4 },
  label: { fontSize: 11, color: c.muted, fontWeight: '700', marginTop: spacing.md, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 },
  input: { backgroundColor: c.surfaceSecondary, borderRadius: radius.md, padding: 12, fontSize: 15, color: c.onSurface, borderWidth: 1, borderColor: c.border },
  priorityChip: { flex: 1, paddingVertical: 10, borderRadius: radius.pill, alignItems: 'center', borderWidth: 1.5 },
  priorityText: { color: c.onSurfaceSecondary, textTransform: 'capitalize', fontWeight: '700' },
  error: { color: c.error, marginTop: spacing.sm, fontWeight: '600' },
  save: { backgroundColor: c.brandPrimary, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center', marginTop: spacing.lg },
  saveText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  delete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: spacing.md, paddingVertical: 10 },
  barTrack: { height: 10, backgroundColor: c.surfaceTertiary, borderRadius: 99, overflow: 'hidden', marginTop: spacing.md },
  barFill: { height: '100%', borderRadius: 99 },
});
