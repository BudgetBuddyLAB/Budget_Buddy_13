import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '@/src/store/budgetStore';
import { Palette, radius, spacing } from '@/src/theme';
import { useColors } from '@/src/theme/ThemeProvider';

export default function Login() {

  const c = useColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const router = useRouter();
  const { setUser } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    setUser({ name: name.trim() || email.split('@')[0], email: email.trim(), isGuest: false, onboarded: true });
    router.replace('/(tabs)');
  };

  const handleGuest = () => {
    setUser({ name: 'Guest', email: '', isGuest: true, onboarded: true });
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container} testID="login-screen">
      <LinearGradient
        colors={[c.brandPrimary, c.brandSecondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <Text style={styles.brand}>Budget Buddy</Text>
          <Text style={styles.tag}>Track Smart. Save Better.</Text>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.cardWrap}>
        <View style={styles.card}>
          <Text style={styles.h1}>Welcome back</Text>
          <Text style={styles.h2}>Sign in to continue managing your money.</Text>

          <Text style={styles.label}>Name (optional)</Text>
          <TextInput
            placeholder="Your name"
            placeholderTextColor={c.muted}
            value={name}
            onChangeText={setName}
            style={styles.input}
            testID="login-name-input"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@email.com"
            placeholderTextColor={c.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            testID="login-email-input"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="••••••"
            placeholderTextColor={c.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            testID="login-password-input"
          />

          {error && (
            <Text style={styles.error} testID="login-error">{error}</Text>
          )}

          <Pressable
            onPress={handleEmailLogin}
            style={({ pressed }) => [styles.primary, pressed && { opacity: 0.9 }]}
            testID="login-submit-button"
          >
            <Text style={styles.primaryText}>Sign In</Text>
          </Pressable>

          <Pressable hitSlop={8}>
            <Text style={styles.link}>Forgot password?</Text>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            onPress={handleGuest}
            style={({ pressed }) => [styles.secondary, pressed && { opacity: 0.85 }]}
            testID="login-guest-button"
          >
            <Ionicons name="person-outline" size={18} color={c.onSurface} />
            <Text style={styles.secondaryText}>Continue as Guest</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.surface },
  header: { paddingBottom: 110, paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  brand: { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: -0.6, marginTop: spacing.lg },
  tag: { color: 'rgba(255,255,255,0.92)', fontWeight: '500', marginTop: 4 },
  cardWrap: { flex: 1, marginTop: -90, paddingHorizontal: spacing.lg },
  card: {
    backgroundColor: c.surfaceSecondary,
    borderRadius: 28,
    padding: spacing.xl,
    shadowColor: '#0B1220',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 6,
  },
  h1: { fontSize: 22, fontWeight: '800', color: c.onSurface, letterSpacing: -0.4 },
  h2: { color: c.muted, marginTop: 4, marginBottom: spacing.lg, fontSize: 13 },
  label: { fontSize: 11, color: c.muted, fontWeight: '700', marginTop: spacing.md, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 },
  input: {
    backgroundColor: c.surfaceTertiary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: c.onSurface,
  },
  error: { color: c.error, marginTop: spacing.sm, fontWeight: '600' },
  primary: {
    backgroundColor: c.brandPrimary,
    paddingVertical: 16,
    borderRadius: radius.pill,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  primaryText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  link: { textAlign: 'center', color: c.brandPrimary, marginTop: spacing.md, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginVertical: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: c.border },
  dividerText: { color: c.muted, fontSize: 12 },
  secondary: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: c.border,
  },
  secondaryText: { color: c.onSurface, fontWeight: '700' },
});
