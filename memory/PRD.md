# Budget Buddy — Product Requirements (PRD)

## Overview
Budget Buddy is a personal-finance / expense-tracking mobile app built with React Native (Expo). Tagline: "Track Smart. Save Better." It targets students and individuals who want a beautiful, minimal money tracker without sign-up friction.

> Note: Original spec asked for Flutter; user confirmed React Native (Expo) build (option 1). Equivalent stack: Expo + React Native, AsyncStorage for local persistence, react-native-reanimated for animations, react-native-svg for ring/charts, react-native-gifted-charts for analytics, expo-speech for TTS, Web Speech API for STT (with text-fallback when unavailable).

## Tech Stack
- **Framework**: Expo SDK 54, React Native 0.81, expo-router (file-based)
- **Storage**: AsyncStorage (keys `budget_buddy_state_v1`, `budget_buddy_theme_mode_v1`)
- **State**: React Context (`/app/frontend/src/store/budgetStore.tsx`, `/app/frontend/src/theme/ThemeProvider.tsx`)
- **UI**: react-native-reanimated, react-native-svg, expo-linear-gradient, @gorhom/bottom-sheet, react-native-gifted-charts, @expo/vector-icons (Ionicons)
- **Voice**: `expo-speech` for TTS + web SpeechRecognition for STT + text-input fallback
- **Export**: `expo-file-system` + `expo-sharing` + `expo-print` (CSV + PDF with native share sheet; web triggers download / print dialog)
- **Backend**: FastAPI + MongoDB scaffold present but **unused** (app is local-only by user choice)

## Theme
- `lightColors` + `darkColors` palettes in `theme/index.ts`
- `ThemeProvider` exposes `useTheme()` (mode/isDark/setMode/toggle/colors) and `useColors()` (active palette)
- Mode persisted to AsyncStorage; system preference honored when mode === 'system'
- All screens use `const c = useColors(); const styles = useMemo(() => makeStyles(c), [c]);` pattern

## Screens
1. **Onboarding (`/onboarding`)** — 3-slide swipe carousel with gradient hero + icon, Next/Skip/Get Started.
2. **Login (`/login`)** — Email login (local) + Guest login. Gradient header.
3. **Tabs (`/(tabs)`)** with custom animated pill tab bar:
   - **Home** — Hero gradient card (Total Balance + animated budget ring + Income/Expense/Savings stats), Quick Actions row, 4×2 Category grid with month totals, Recent Transactions list (tap=edit, trash=delete), FAB (+), Voice Assistant mic.
   - **Analytics** — Week/Month/Year segmented filter, Pie (categories), Bar (monthly expenses), Line (income vs expense), Mood tracker, Smart Insights.
   - **Goals** — Aggregate progress card, individual goal cards with progress rings, "+ New Goal" modal, deposit/withdraw modal, delete.
   - **Profile** — Identity card (Name, Email, Budget, Currency, Theme — **no avatar/image**), Statistics (Avg/Highest/Lowest/Net Worth), Achievements (4 badges), Settings (Dark Mode toggle, Notifications, PIN Lock, Calendar View, Budget, Currency, Export PDF Report, Export CSV, Reset, Logout), Edit Profile modal, toast feedback.
4. **Calendar (`/calendar`)** — Month grid with red/green dots per day for expense/income; tap a day to see its transactions; back/today/prev/next navigation.

## Key Features
- Add / Edit / Delete transactions (expense + income) with category, payment method, mood, notes
- Live monthly summary (income, expense, balance, savings) derived from transactions
- Savings goals with deposit / withdraw + animated progress rings
- Analytics charts (pie/bar/line) + mood breakdown + smart insights
- Achievement badges (gamification)
- **AI Voice Assistant**: floating mic on Home/Analytics/Goals. Tap=listen (or stops), long-press=open text fallback. Supports:
  - "Add expense 500 for food"
  - "Add income 30000"
  - "Show today's expenses"
  - "How much have I spent this month?"
  - "What is my remaining budget?"
  - "Open analytics / goals / profile / home"
  Responds via TTS (`expo-speech`) and shows transcript + reply bubble.
- Animated bottom tab indicator (sliding pill)
- INR (₹) currency, India locale formatting
- Seed data on first launch for instant demo

## Removed Per User Request
- All image features: profile avatar, camera, gallery, image picker, image cropping, avatar placeholders, image preview, onboarding photographic images (replaced with gradient icon hero)

## Folder Structure
```
/app/frontend
├── app/
│   ├── _layout.tsx              # Root layout with StoreProvider + SafeAreaProvider
│   ├── index.tsx                # Boot redirect
│   ├── onboarding.tsx
│   ├── login.tsx
│   └── (tabs)/
│       ├── _layout.tsx          # Custom tab bar
│       ├── index.tsx            # Home
│       ├── analytics.tsx
│       ├── goals.tsx
│       └── profile.tsx
├── src/
│   ├── components/
│   │   ├── BudgetRing.tsx
│   │   ├── CategoryTile.tsx
│   │   ├── TransactionRow.tsx
│   │   ├── GoalCard.tsx
│   │   ├── AddTransactionSheet.tsx
│   │   ├── CustomTabBar.tsx
│   │   └── VoiceAssistant.tsx
│   ├── store/
│   │   └── budgetStore.tsx
│   ├── constants/
│   │   └── categories.ts
│   ├── theme/
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── format.ts
│   │   └── storage/
│   └── hooks/
│       └── use-icon-fonts.ts
```

## Data Model (AsyncStorage key `budget_buddy_state_v1`)
```ts
{
  user: { name, email, monthlyBudget, isGuest, onboarded },
  transactions: [{ id, type, amount, category, title, notes?, date, mood, paymentMethod }],
  goals: [{ id, name, target, saved, deadline, priority, createdAt }]
}
```

## Out of Scope (V1)
- Cloud sync / Firebase
- Real device push notifications
- PDF/Excel export (CSV via console only)
- Biometric/Fingerprint hardware integration (UI toggle only)
