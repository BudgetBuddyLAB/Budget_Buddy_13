/**
 * Budget Buddy — AI Voice Assistant
 * - TTS via expo-speech (works on web + native + Expo Go)
 * - STT via Web Speech API on web preview (works in Chrome-based browsers)
 *   On native, we gracefully degrade to a manual text command input.
 * - Floating mic FAB + listening indicator + recognized text overlay.
 * - Command parser supports add expense/income, navigation, and Q&A about
 *   spend / remaining / today.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
  cancelAnimation,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useStore, useMonthlySummary } from '@/src/store/budgetStore';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/src/constants/categories';
import { CategoryId } from '@/src/types';
import { Palette, radius, shadow, spacing } from '@/src/theme';
import { useColors } from '@/src/theme/ThemeProvider';
import { formatMoney, sameMonth } from '@/src/utils/format';

interface Props {
  bottom?: number; // distance from bottom; tweak per screen
}

export default function VoiceAssistant({ bottom = 150 }: Props) {

  const c = useColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const router = useRouter();
  const { addTransaction, transactions } = useStore();
  const summary = useMonthlySummary();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState<string | null>(null);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [fallbackText, setFallbackText] = useState('');
  const recognitionRef = useRef<any>(null);

  // Pulse animation for the mic
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (listening) {
      pulse.value = withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
    } else {
      cancelAnimation(pulse);
      pulse.value = withTiming(0, { duration: 200 });
    }
  }, [listening, pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.35 }],
    opacity: 0.5 - pulse.value * 0.35,
  }));

  const speak = (text: string) => {
    try {
      Speech.stop();
      Speech.speak(text, { language: 'en-IN', rate: 1.0, pitch: 1.0 });
    } catch (_e) {}
  };

  const finalizeListening = () => {
    setListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_e) {}
      recognitionRef.current = null;
    }
  };

  const startWebSTT = (): boolean => {
    // @ts-ignore — web only
    const Ctor = typeof window !== 'undefined' && (window.SpeechRecognition || (window as any).webkitSpeechRecognition);
    if (!Ctor) return false;
    const rec = new Ctor();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (event: any) => {
      let t = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        t += event.results[i][0].transcript;
      }
      setTranscript(t);
      if (event.results[event.results.length - 1].isFinal) {
        handleCommand(t);
      }
    };
    rec.onerror = () => {
      setListening(false);
      setFallbackOpen(true);
    };
    rec.onend = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    return true;
  };

  const startListening = () => {
    setTranscript('');
    setReply(null);
    setListening(true);
    if (Platform.OS === 'web') {
      const ok = startWebSTT();
      if (!ok) {
        // Browser without speech support — fall back to text prompt
        setListening(false);
        setFallbackOpen(true);
      }
    } else {
      // Native (Expo Go): no native STT module available — open text fallback
      setListening(false);
      setFallbackOpen(true);
    }
  };

  const stopListening = () => {
    finalizeListening();
  };

  // ---- Command parser ----
  const handleCommand = (raw: string) => {
    const text = raw.trim().toLowerCase();
    setTranscript(raw);
    if (!text) {
      setReply('I did not catch that.');
      speak('I did not catch that.');
      return;
    }

    // Navigation
    if (text.includes('analytic')) {
      respond('Opening Analytics');
      router.push('/(tabs)/analytics');
      return;
    }
    if (text.includes('goal')) {
      respond('Opening Goals');
      router.push('/(tabs)/goals');
      return;
    }
    if (text.includes('profile') || text.includes('setting')) {
      respond('Opening Profile');
      router.push('/(tabs)/profile');
      return;
    }
    if (text.includes('home') || text.includes('dashboard')) {
      respond('Opening Home');
      router.push('/(tabs)');
      return;
    }

    // Questions
    if (text.includes("today's expense") || text.includes('today expense') || text.includes('today expenses')) {
      const today = new Date().toDateString();
      const total = transactions
        .filter((t) => t.type === 'expense' && new Date(t.date).toDateString() === today)
        .reduce((s, t) => s + t.amount, 0);
      respond(`You spent ${formatMoney(total)} today.`);
      return;
    }
    if (text.includes('spent') && text.includes('month')) {
      respond(`This month you spent ${formatMoney(summary.expense)}.`);
      return;
    }
    if (text.includes('remaining budget') || (text.includes('budget') && text.includes('left'))) {
      respond(`You have ${formatMoney(summary.remaining)} remaining of your ${formatMoney(summary.budget)} budget.`);
      return;
    }
    if (text.includes('income') && text.includes('this month')) {
      respond(`Your income this month is ${formatMoney(summary.income)}.`);
      return;
    }

    // Add expense / income — accept patterns like:
    // "add an expense of 500 for food"
    // "add income of 30000"
    const amountMatch = text.match(/(\d[\d,]*\.?\d*)/);
    const amount = amountMatch ? Number(amountMatch[1].replace(/,/g, '')) : NaN;

    if ((text.includes('add') || text.includes('log') || text.includes('spent')) && !isNaN(amount) && amount > 0) {
      const isIncome = text.includes('income') || text.includes('salary') || text.includes('earn') || text.includes('received');
      const allCats = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      let category: CategoryId = (isIncome ? 'salary' : 'others');
      for (const c of allCats) {
        if (text.includes(c.label.toLowerCase()) || text.includes(c.id)) {
          category = c.id;
          break;
        }
      }
      addTransaction({
        type: isIncome ? 'income' : 'expense',
        amount,
        category,
        title: isIncome ? 'Voice Income' : 'Voice Expense',
        date: new Date().toISOString(),
        mood: 'normal',
        paymentMethod: 'upi',
      });
      respond(`Added ${isIncome ? 'income' : 'expense'} of ${formatMoney(amount)}${category !== 'others' && category !== 'salary' ? ' for ' + category : ''}.`);
      return;
    }

    respond("Sorry, I can't help with that yet. Try: 'add expense 500 for food', or 'open analytics'.");
  };

  const respond = (msg: string) => {
    setReply(msg);
    speak(msg);
    // auto-dismiss
    setTimeout(() => setReply(null), 4500);
  };

  const handleFallbackSubmit = () => {
    setFallbackOpen(false);
    const t = fallbackText.trim();
    setFallbackText('');
    if (t) handleCommand(t);
  };

  // ---- Render ----
  const helperText = useMemo(
    () =>
      'Try: "Add expense 500 for food", "Open analytics", "How much spent this month?"',
    []
  );

  return (
    <>
      {/* Reply / Transcript bubble */}
      {(transcript || reply) && (
        <View style={[styles.bubble, { bottom: bottom + 70 }]} testID="voice-reply-bubble">
          {transcript ? <Text style={styles.bubbleQuote}>"{transcript}"</Text> : null}
          {reply ? <Text style={styles.bubbleReply}>{reply}</Text> : null}
        </View>
      )}

      <Pressable
        onPress={listening ? stopListening : startListening}
        onLongPress={() => {
          if (listening) finalizeListening();
          setFallbackOpen(true);
        }}
        delayLongPress={350}
        testID="voice-assistant-fab"
        style={({ pressed }) => [
          styles.fab,
          { bottom },
          listening && { backgroundColor: c.error },
          pressed && { transform: [{ scale: 0.94 }] },
        ]}
      >
        {listening && <Animated.View style={[styles.ring, ringStyle]} />}
        <Ionicons name={listening ? 'mic' : 'mic-outline'} size={22} color="#fff" />
      </Pressable>

      {/* Text fallback (native + browsers without STT) */}
      <Modal visible={fallbackOpen} transparent animationType="fade" onRequestClose={() => setFallbackOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setFallbackOpen(false)} />
        <View style={styles.fallbackCard}>
          <View style={styles.handle} />
          <Text style={styles.fallbackTitle}>Voice Assistant</Text>
          <Text style={styles.fallbackHint}>{helperText}</Text>
          <TextInput
            testID="voice-fallback-input"
            placeholder="Type a command…"
            placeholderTextColor={c.muted}
            value={fallbackText}
            onChangeText={setFallbackText}
            style={styles.fallbackInput}
            autoFocus
            onSubmitEditing={handleFallbackSubmit}
            returnKeyType="send"
          />
          <Pressable
            testID="voice-fallback-submit"
            onPress={handleFallbackSubmit}
            style={({ pressed }) => [styles.fallbackBtn, pressed && { opacity: 0.9 }]}
          >
            <Text style={styles.fallbackBtnText}>Send</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  fab: {
    position: 'absolute',
    left: spacing.lg,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: c.brandSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
    shadowColor: c.brandSecondary,
    shadowOpacity: 0.35,
    zIndex: 50,
  },
  ring: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: c.error,
  },
  bubble: {
    position: 'absolute',
    right: spacing.lg,
    left: spacing.lg,
    backgroundColor: '#0F172A',
    padding: spacing.md,
    borderRadius: radius.lg,
    ...shadow.card,
    zIndex: 51,
  },
  bubbleQuote: { color: '#94A3B8', fontStyle: 'italic', fontSize: 12, marginBottom: 4 },
  bubbleReply: { color: '#fff', fontWeight: '700', fontSize: 14, lineHeight: 20 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(17,24,39,0.45)' },
  fallbackCard: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: c.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 99, backgroundColor: c.borderStrong, marginBottom: spacing.md },
  fallbackTitle: { fontSize: 20, fontWeight: '800', color: c.onSurface, letterSpacing: -0.3 },
  fallbackHint: { color: c.muted, marginTop: 4, marginBottom: spacing.md, fontSize: 12 },
  fallbackInput: {
    backgroundColor: c.surfaceSecondary,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: c.border,
    color: c.onSurface,
    fontSize: 15,
  },
  fallbackBtn: { marginTop: spacing.md, backgroundColor: c.brandPrimary, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' },
  fallbackBtnText: { color: '#fff', fontWeight: '800' },
});
