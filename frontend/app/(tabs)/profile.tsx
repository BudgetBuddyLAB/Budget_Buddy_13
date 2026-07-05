import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore, useMonthlySummary } from '@/src/store/budgetStore';
import { Palette, radius, shadow, spacing } from '@/src/theme';
import { useColors, useTheme } from '@/src/theme/ThemeProvider';
import { formatMoney } from '@/src/utils/format';
import { exportCsv, exportPdf } from '@/src/utils/export';

export default function ProfileScreen() {
  const c = useColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const { isDark, toggle: toggleTheme } = useTheme();
  const { user, setUser, transactions, resetAll } = useStore();
  const summary = useMonthlySummary();
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [pinLock, setPinLock] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(user.monthlyBudget));
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Statistics
  const monthTxns = transactions.filter((t) => new Date(t.date).getMonth() === new Date().getMonth());
  const expenseAmounts = monthTxns.filter((t) => t.type === 'expense').map((t) => t.amount);
  const avg = expenseAmounts.length ? Math.round(expenseAmounts.reduce((s, n) => s + n, 0) / expenseAmounts.length) : 0;
  const high = expenseAmounts.length ? Math.max(...expenseAmounts) : 0;
  const low = expenseAmounts.length ? Math.min(...expenseAmounts) : 0;

  const badges = [
    { id: 'starter', label: 'First Saver', emoji: '🌱', unlocked: transactions.length > 0 },
    { id: 'streak', label: '7-Day Streak', emoji: '🔥', unlocked: transactions.length >= 7 },
    { id: 'savings', label: 'Saved 10K+', emoji: '🏆', unlocked: summary.savings >= 10000 },
    { id: 'budgeter', label: 'Budget Master', emoji: '💪', unlocked: summary.expense > 0 && summary.expense <= summary.budget },
  ];

  const handleLogout = () => {
    setUser({ email: '', isGuest: false, onboarded: false, name: 'Buddy' });
    router.replace('/onboarding');
  };

  const handleSaveProfile = () => {
    const n = Number(budgetInput);
    if (n > 0) setUser({ monthlyBudget: n });
    if (nameInput.trim()) setUser({ name: nameInput.trim() });
    if (emailInput.trim()) setUser({ email: emailInput.trim() });
    setEditOpen(false);
    showToast('Profile updated');
  };

  const handleExportCsv = async () => {
    const res = await exportCsv(transactions);
    showToast(res.message);
  };

  const handleExportPdf = async () => {
    const res = await exportPdf(transactions, { income: summary.income, expense: summary.expense, balance: summary.balance });
    showToast(res.message);
  };

  const goCalendar = () => router.push('/calendar');

  // Row helper — defined inside so it captures `c` + `styles`
  type Tone = 'default' | 'warning' | 'error';
  const Row = (props: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    rightControl?: React.ReactNode;
    onPress?: () => void;
    testID?: string;
    last?: boolean;
    tone?: Tone;
  }) => {
    const tone: Tone = props.tone ?? 'default';
    const tint = tone === 'error' ? c.error : tone === 'warning' ? c.warning : c.brandPrimary;
    const textColor = tone === 'error' ? c.error : tone === 'warning' ? c.warning : c.onSurface;
    return (
      <Pressable
        onPress={props.onPress}
        testID={props.testID}
        style={({ pressed }) => [
          styles.row,
          !props.last && styles.rowDivider,
          pressed && props.onPress && { backgroundColor: c.surfaceTertiary },
        ]}
      >
        <View style={[styles.rowIcon, { backgroundColor: tint + '22' }]}>
          <Ionicons name={props.icon} size={18} color={tint} />
        </View>
        <Text style={[styles.rowLabel, { color: textColor }]}>{props.label}</Text>
        {props.rightControl ? (
          props.rightControl
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            {props.value && <Text style={styles.rowValue}>{props.value}</Text>}
            {props.onPress && <Ionicons name="chevron-forward" size={16} color={c.muted} />}
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.h1}>Profile</Text>
          <Text style={styles.subtitle}>Manage your account and preferences.</Text>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Identity card — text only, no avatar */}
        <View style={[styles.identity, shadow.card]}>
          <LinearGradient
            colors={[c.brandPrimary, c.brandSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.identityContent}>
            <View style={styles.identityHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.identityLabel}>USER</Text>
                <Text style={styles.identityName} numberOfLines={1} testID="profile-name">
                  {user.name || 'Buddy'}
                </Text>
                <Text style={styles.identityEmail} numberOfLines={1} testID="profile-email">
                  {user.isGuest ? 'Guest mode' : user.email || 'Not set'}
                </Text>
              </View>
              <Pressable onPress={() => setEditOpen(true)} style={styles.editBtn} testID="profile-edit-button">
                <Ionicons name="create-outline" size={18} color="#fff" />
              </Pressable>
            </View>
            <View style={styles.identityDivider} />
            <View style={styles.identityMetaRow}>
              <View style={styles.identityMeta}>
                <Text style={styles.identityMetaLabel}>BUDGET</Text>
                <Text style={styles.identityMetaValue} testID="profile-budget">{formatMoney(user.monthlyBudget)}</Text>
              </View>
              <View style={styles.identityMeta}>
                <Text style={styles.identityMetaLabel}>CURRENCY</Text>
                <Text style={styles.identityMetaValue}>INR ₹</Text>
              </View>
              <View style={styles.identityMeta}>
                <Text style={styles.identityMetaLabel}>THEME</Text>
                <Text style={styles.identityMetaValue}>{isDark ? 'Dark' : 'Light'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsRow}>
          <View style={[styles.stat, shadow.soft]}>
            <Text style={styles.statLabel}>Avg / Txn</Text>
            <Text style={styles.statValue}>{formatMoney(avg)}</Text>
          </View>
          <View style={[styles.stat, shadow.soft]}>
            <Text style={styles.statLabel}>Highest</Text>
            <Text style={styles.statValue}>{formatMoney(high)}</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.stat, shadow.soft]}>
            <Text style={styles.statLabel}>Lowest</Text>
            <Text style={styles.statValue}>{formatMoney(low)}</Text>
          </View>
          <View style={[styles.stat, shadow.soft]}>
            <Text style={styles.statLabel}>Net Worth</Text>
            <Text style={styles.statValue}>{formatMoney(summary.balance)}</Text>
          </View>
        </View>

        {/* Badges */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.badgesGrid}>
          {badges.map((b) => (
            <View key={b.id} style={[styles.badge, shadow.soft, !b.unlocked && { opacity: 0.45 }]}>
              <Text style={{ fontSize: 28 }}>{b.emoji}</Text>
              <Text style={styles.badgeLabel}>{b.label}</Text>
              <Text style={[styles.muted, { fontSize: 10 }]}>{b.unlocked ? 'Unlocked' : 'Locked'}</Text>
            </View>
          ))}
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={[styles.settingGroup, shadow.soft]}>
          <Row
            icon="moon"
            label="Dark Mode"
            rightControl={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                testID="setting-darkmode"
                trackColor={{ true: c.brandPrimary, false: c.borderStrong }}
              />
            }
          />
          <Row
            icon="notifications"
            label="Notifications"
            rightControl={<Switch value={notifications} onValueChange={setNotifications} testID="setting-notifications" trackColor={{ true: c.brandPrimary, false: c.borderStrong }} />}
          />
          <Row
            icon="lock-closed"
            label="PIN Lock"
            rightControl={<Switch value={pinLock} onValueChange={setPinLock} testID="setting-pinlock" trackColor={{ true: c.brandPrimary, false: c.borderStrong }} />}
          />
          <Row icon="calendar" label="Calendar View" onPress={goCalendar} testID="setting-calendar" />
          <Row icon="card" label="Monthly Budget" value={formatMoney(user.monthlyBudget)} onPress={() => setEditOpen(true)} testID="setting-budget" />
          <Row icon="cash" label="Currency" value="INR ₹" onPress={() => {}} testID="setting-currency" />
          <Row icon="document-text" label="Export PDF Report" onPress={handleExportPdf} testID="setting-export-pdf" />
          <Row icon="download" label="Export CSV" onPress={handleExportCsv} testID="setting-export" />
          <Row icon="refresh" label="Reset Data" onPress={resetAll} testID="setting-reset" tone="warning" />
          <Row icon="log-out" label="Logout" onPress={handleLogout} testID="setting-logout" tone="error" last />
        </View>

        <Text style={styles.foot}>Budget Buddy v1.0 • Track Smart. Save Better.</Text>
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Toast */}
      {toast && (
        <View style={styles.toast} testID="profile-toast" pointerEvents="none">
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}

      {/* Profile edit modal */}
      <Modal visible={editOpen} transparent animationType="slide" onRequestClose={() => setEditOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setEditOpen(false)} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              testID="profile-name-input"
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Your name"
              placeholderTextColor={c.muted}
              style={styles.input}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              testID="profile-email-input"
              value={emailInput}
              onChangeText={setEmailInput}
              placeholder="you@email.com"
              placeholderTextColor={c.muted}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <Text style={styles.label}>Monthly Budget (₹)</Text>
            <TextInput
              testID="budget-input"
              value={budgetInput}
              onChangeText={setBudgetInput}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor={c.muted}
            />

            <Pressable onPress={handleSaveProfile} testID="budget-save-button" style={({ pressed }) => [styles.savePrimary, pressed && { opacity: 0.9 }]}>
              <Text style={styles.saveText}>Save Changes</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
    h1: { fontSize: 26, fontWeight: '800', color: c.onSurface, letterSpacing: -0.5 },
    subtitle: { color: c.muted, marginTop: 2 },
    scroll: { paddingHorizontal: spacing.lg },
    identity: { borderRadius: 24, overflow: 'hidden' },
    identityContent: { padding: spacing.lg },
    identityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    identityLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
    identityName: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 4, letterSpacing: -0.4 },
    identityEmail: { color: 'rgba(255,255,255,0.92)', fontSize: 13, marginTop: 2, fontWeight: '500' },
    editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
    identityDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.22)', marginVertical: spacing.md },
    identityMetaRow: { flexDirection: 'row', justifyContent: 'space-between' },
    identityMeta: { flex: 1 },
    identityMetaLabel: { color: 'rgba(255,255,255,0.78)', fontSize: 9, fontWeight: '700', letterSpacing: 1 },
    identityMetaValue: { color: '#fff', fontSize: 14, fontWeight: '800', marginTop: 4, letterSpacing: -0.2 },
    muted: { color: c.muted, fontSize: 12, fontWeight: '600' },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: c.onSurface, marginTop: spacing.xl, marginBottom: spacing.md },
    statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
    stat: { flex: 1, backgroundColor: c.surfaceSecondary, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: c.border },
    statLabel: { color: c.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    statValue: { color: c.onSurface, fontSize: 17, fontWeight: '800', marginTop: 4 },
    badgesGrid: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
    badge: { flexBasis: '47%', backgroundColor: c.surfaceSecondary, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: c.border },
    badgeLabel: { fontSize: 12, fontWeight: '700', color: c.onSurface, marginTop: 4 },
    settingGroup: { backgroundColor: c.surfaceSecondary, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: c.border },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 12, paddingHorizontal: spacing.md, backgroundColor: c.surfaceSecondary },
    rowDivider: { borderBottomWidth: 1, borderBottomColor: c.border },
    rowIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    rowLabel: { flex: 1, fontWeight: '600', fontSize: 14 },
    rowValue: { color: c.muted, fontSize: 13, fontWeight: '600' },
    foot: { textAlign: 'center', color: c.muted, marginTop: spacing.lg, fontSize: 12 },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: c.scrim },
    modalWrap: { flex: 1, justifyContent: 'flex-end' },
    modalCard: { backgroundColor: c.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: spacing.lg, paddingBottom: spacing.xl },
    handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 99, backgroundColor: c.borderStrong, marginBottom: spacing.md },
    modalTitle: { fontSize: 22, fontWeight: '800', color: c.onSurface, letterSpacing: -0.4 },
    label: { fontSize: 11, color: c.muted, fontWeight: '700', marginTop: spacing.md, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 },
    input: { backgroundColor: c.surfaceSecondary, borderRadius: radius.md, padding: 14, fontSize: 15, color: c.onSurface, borderWidth: 1, borderColor: c.border },
    savePrimary: { backgroundColor: c.brandPrimary, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center', marginTop: spacing.lg },
    saveText: { color: c.onBrandPrimary, fontWeight: '800', fontSize: 15 },
    toast: {
      position: 'absolute',
      bottom: 90,
      left: spacing.lg,
      right: spacing.lg,
      backgroundColor: c.surfaceInverse,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: radius.pill,
      alignItems: 'center',
    },
    toastText: { color: c.onSurfaceInverse, fontWeight: '700', fontSize: 13 },
  });
