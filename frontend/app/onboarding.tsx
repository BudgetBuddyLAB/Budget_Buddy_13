import { useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Palette, radius, shadow, spacing } from '@/src/theme';
import { useColors } from '@/src/theme/ThemeProvider';
import { useStore } from '@/src/store/budgetStore';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: 'sparkles-outline' as const,
    accent1: '#4CAF50',
    accent2: '#00BCD4',
    title: 'Welcome to\nBudget Buddy',
    subtitle: 'Track Smart. Save Better.\nYour all-in-one money companion.',
    pillEmoji: '✨',
  },
  {
    icon: 'wallet-outline' as const,
    accent1: '#00BCD4',
    accent2: '#4CAF50',
    title: 'Track every\nrupee',
    subtitle: 'Capture expenses and income in seconds — with mood and category.',
    pillEmoji: '💸',
  },
  {
    icon: 'trophy-outline' as const,
    accent1: '#FFC107',
    accent2: '#4CAF50',
    title: 'Reach your\nsavings goals',
    subtitle: 'Set targets, watch progress rings fill, and celebrate the wins.',
    pillEmoji: '🏆',
  },
];

export default function Onboarding() {

  const c = useColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [page, setPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const { setUser } = useStore();

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const p = Math.round(e.nativeEvent.contentOffset.x / width);
    if (p !== page) setPage(p);
  };

  const goNext = () => {
    if (page < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (page + 1) * width, animated: true });
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setUser({ onboarded: true });
    router.replace('/login');
  };

  return (
    <View style={styles.container} testID="onboarding-screen">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <LinearGradient
              colors={[s.accent1 + '33', '#F7F9FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.hero}>
              <View style={[styles.iconWrap, shadow.card, { borderColor: s.accent1 }]}>
                <LinearGradient
                  colors={[s.accent1, s.accent2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <Ionicons name={s.icon} size={62} color="#fff" />
              </View>
              <View style={[styles.pill, { backgroundColor: '#fff' }]}>
                <Text style={styles.pillText}>{s.pillEmoji}  Step {i + 1} of {SLIDES.length}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.bottom}>
        <Text style={styles.title} testID={`onboarding-title-${page}`}>{SLIDES[page].title}</Text>
        <Text style={styles.subtitle}>{SLIDES[page].subtitle}</Text>

        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, page === i && styles.dotActive]} />
          ))}
        </View>

        <Pressable
          onPress={goNext}
          testID="onboarding-next-button"
          style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9 }]}
        >
          <Text style={styles.primaryText}>{page < SLIDES.length - 1 ? 'Next' : 'Get Started'}</Text>
        </Pressable>

        {page < SLIDES.length - 1 && (
          <Pressable onPress={handleFinish} testID="onboarding-skip-button" hitSlop={10}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        )}
      </SafeAreaView>
    </View>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.surface },
  slide: { height: '60%', alignItems: 'center', justifyContent: 'center' },
  hero: { alignItems: 'center', justifyContent: 'center', gap: 18 },
  iconWrap: {
    width: 160, height: 160, borderRadius: 80,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 4, borderColor: '#fff',
  },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: c.border },
  pillText: { fontSize: 12, fontWeight: '700', color: c.onSurfaceSecondary },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    backgroundColor: c.surface,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  title: { fontSize: 30, fontWeight: '800', color: c.onSurface, letterSpacing: -0.8, lineHeight: 36 },
  subtitle: { fontSize: 15, color: c.onSurfaceSecondary, marginTop: spacing.sm, lineHeight: 22 },
  dots: { flexDirection: 'row', gap: 6, marginTop: spacing.lg, marginBottom: spacing.md },
  dot: { width: 6, height: 6, borderRadius: 99, backgroundColor: c.borderStrong },
  dotActive: { width: 22, backgroundColor: c.brandPrimary },
  primaryBtn: {
    backgroundColor: c.brandPrimary,
    paddingVertical: 16,
    borderRadius: radius.pill,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 0.3 },
  skip: { textAlign: 'center', color: c.muted, marginTop: spacing.md, marginBottom: spacing.sm, fontWeight: '600' },
});
