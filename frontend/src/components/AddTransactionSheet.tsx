/**
 * Add Transaction Bottom Sheet — supports both Expense + Income with mood + payment method.
 */
import React, { forwardRef, useImperativeHandle, useState, useCallback, useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/src/store/budgetStore';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, MOODS, PAYMENT_METHODS } from '@/src/constants/categories';
import { Palette, radius, shadow, spacing } from '@/src/theme';
import { useColors } from '@/src/theme/ThemeProvider';
import { CategoryId, Mood, PaymentMethod, Transaction, TxnType } from '@/src/types';
import { todayISO } from '@/src/utils/format';

export interface AddTxnSheetHandle {
  open: (initial?: { type?: TxnType; edit?: Transaction }) => void;
  close: () => void;
}

const AddTransactionSheet = forwardRef<AddTxnSheetHandle>((_props, ref) => {

  const c = useColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const { addTransaction, updateTransaction } = useStore();
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState<TxnType>('expense');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<CategoryId>('food');
  const [payment, setPayment] = useState<PaymentMethod>('upi');
  const [mood, setMood] = useState<Mood>('happy');
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback((t: TxnType = 'expense') => {
    setType(t);
    setAmount('');
    setTitle('');
    setNotes('');
    setCategory(t === 'expense' ? 'food' : 'salary');
    setPayment('upi');
    setMood('happy');
    setError(null);
    setEditingId(null);
  }, []);

  useImperativeHandle(ref, () => ({
    open: (initial) => {
      const t = initial?.type ?? initial?.edit?.type ?? 'expense';
      reset(t);
      if (initial?.edit) {
        const e = initial.edit;
        setEditingId(e.id);
        setType(e.type);
        setAmount(String(e.amount));
        setTitle(e.title);
        setNotes(e.notes ?? '');
        setCategory(e.category);
        setPayment(e.paymentMethod);
        setMood(e.mood);
      }
      setVisible(true);
    },
    close: () => setVisible(false),
  }));

  const categories = useMemo(
    () => (type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES),
    [type]
  );

  const handleSave = () => {
    const num = Number(amount);
    if (!num || isNaN(num) || num <= 0) {
      setError('Enter a valid positive amount');
      return;
    }
    if (!title.trim()) {
      setError('Add a short title');
      return;
    }
    const payload: Omit<Transaction, 'id'> = {
      type,
      amount: num,
      title: title.trim(),
      notes: notes.trim() || undefined,
      category,
      paymentMethod: payment,
      mood,
      date: todayISO(),
    };
    if (editingId) {
      updateTransaction(editingId, payload);
    } else {
      addTransaction(payload);
    }
    setVisible(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
      <Pressable style={styles.backdrop} onPress={() => setVisible(false)} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetWrap}
      >
        <View style={[styles.sheet, shadow.card]}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text style={styles.title}>{editingId ? 'Edit transaction' : 'Add transaction'}</Text>
            <Pressable onPress={() => setVisible(false)} hitSlop={10} testID="sheet-close">
              <Ionicons name="close" size={22} color={c.onSurfaceSecondary} />
            </Pressable>
          </View>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {(['expense', 'income'] as TxnType[]).map((t) => {
              const active = type === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => {
                    setType(t);
                    setCategory(t === 'expense' ? 'food' : 'salary');
                  }}
                  style={[styles.tabPill, active && { backgroundColor: t === 'expense' ? c.expense : c.income }]}
                  testID={`tab-${t}`}
                >
                  <Text style={[styles.tabText, active && { color: '#fff' }]}>
                    {t === 'expense' ? 'Expense' : 'Income'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
            {/* Amount */}
            <View style={styles.amountWrap}>
              <Text style={styles.amountPrefix}>{'\u20B9'}</Text>
              <TextInput
                testID="input-amount"
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                placeholderTextColor={c.muted}
                keyboardType="numeric"
                style={styles.amountInput}
              />
            </View>

            {/* Title */}
            <Text style={styles.fieldLabel}>Title</Text>
            <TextInput
              testID="input-title"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Lunch with friends"
              placeholderTextColor={c.muted}
              style={styles.input}
            />

            {/* Categories */}
            <Text style={styles.fieldLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {categories.map((c) => {
                const active = category === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setCategory(c.id)}
                    testID={`cat-${c.id}`}
                    style={[
                      styles.chip,
                      { borderColor: active ? c.color : c.border, backgroundColor: active ? c.color + '22' : c.surfaceSecondary },
                    ]}
                  >
                    <Text style={styles.chipEmoji}>{c.emoji}</Text>
                    <Text style={[styles.chipText, active && { color: c.color, fontWeight: '700' }]}>{c.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Payment */}
            <Text style={styles.fieldLabel}>Payment method</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {PAYMENT_METHODS.map((p) => {
                const active = payment === p.id;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => setPayment(p.id)}
                    testID={`pay-${p.id}`}
                    style={[
                      styles.chip,
                      { borderColor: active ? c.brandPrimary : c.border, backgroundColor: active ? c.brandTertiary : c.surfaceSecondary },
                    ]}
                  >
                    <Text style={styles.chipEmoji}>{p.emoji}</Text>
                    <Text style={[styles.chipText, active && { color: c.brandPrimary, fontWeight: '700' }]}>{p.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Mood */}
            <Text style={styles.fieldLabel}>How did it feel?</Text>
            <View style={styles.moodRow}>
              {MOODS.map((m) => {
                const active = mood === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => setMood(m.id)}
                    testID={`mood-${m.id}`}
                    style={[styles.moodBubble, active && { backgroundColor: c.brandTertiary, borderColor: c.brandPrimary }]}
                  >
                    <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Notes */}
            <Text style={styles.fieldLabel}>Notes (optional)</Text>
            <TextInput
              testID="input-notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Add a note"
              placeholderTextColor={c.muted}
              style={[styles.input, { height: 72, textAlignVertical: 'top' }]}
              multiline
            />

            {error && (
              <Text style={styles.errorText} testID="form-error">
                {error}
              </Text>
            )}
          </ScrollView>

          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.9 }]}
            testID="save-transaction-button"
          >
            <Text style={styles.saveText}>{editingId ? 'Update' : 'Save'} {type === 'expense' ? 'Expense' : 'Income'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

AddTransactionSheet.displayName = 'AddTransactionSheet';
export default AddTransactionSheet;

const makeStyles = (c: Palette) => StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(17,24,39,0.45)' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: c.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    maxHeight: '92%',
  },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 99, backgroundColor: c.borderStrong, marginBottom: spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { fontSize: 20, fontWeight: '800', color: c.onSurface, letterSpacing: -0.4 },
  tabsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  tabPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.pill,
    backgroundColor: c.surfaceTertiary,
    alignItems: 'center',
  },
  tabText: { fontWeight: '700', color: c.onSurfaceSecondary },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: c.surfaceSecondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: c.border,
    marginBottom: spacing.md,
  },
  amountPrefix: { fontSize: 28, color: c.muted, marginRight: 4, fontWeight: '700' },
  amountInput: { fontSize: 38, fontWeight: '800', color: c.onSurface, letterSpacing: -1, minWidth: 80, padding: 0 },
  fieldLabel: { fontSize: 12, color: c.muted, fontWeight: '700', marginTop: spacing.md, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.6 },
  input: {
    backgroundColor: c.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: c.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: c.onSurface,
  },
  chipRow: { gap: spacing.sm, paddingVertical: 2, paddingRight: spacing.md },
  chip: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  chipEmoji: { fontSize: 14 },
  chipText: { fontSize: 13, color: c.onSurfaceSecondary, fontWeight: '600' },
  moodRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  moodBubble: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.surfaceSecondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodEmoji: { fontSize: 24 },
  errorText: { color: c.error, marginTop: spacing.sm, fontWeight: '600' },
  saveBtn: {
    backgroundColor: c.brandPrimary,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 0.2 },
});
