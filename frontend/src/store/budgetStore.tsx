/**
 * Budget Buddy — App-wide state store (Context + AsyncStorage).
 * Keeps transactions, savings goals, and user profile.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavingsGoal, Transaction, UserProfile } from '@/src/types';
import { sameMonth, todayISO } from '@/src/utils/format';

const STORAGE_KEY = 'budget_buddy_state_v1';

interface PersistedState {
  user: UserProfile;
  transactions: Transaction[];
  goals: SavingsGoal[];
}

const DEFAULT_USER: UserProfile = {
  name: 'Buddy',
  email: '',
  monthlyBudget: 25000,
  isGuest: true,
  onboarded: false,
};

function seedTransactions(): Transaction[] {
  const now = new Date();
  const mk = (daysAgo: number, partial: Partial<Transaction>): Transaction => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return {
      id: `seed-${daysAgo}-${Math.random().toString(36).slice(2, 7)}`,
      type: 'expense',
      amount: 0,
      category: 'others',
      title: '',
      date: d.toISOString(),
      mood: 'normal',
      paymentMethod: 'upi',
      ...partial,
    } as Transaction;
  };
  return [
    mk(0, { type: 'income', amount: 35000, category: 'salary', title: 'Monthly Salary', mood: 'happy', paymentMethod: 'bank' }),
    mk(1, { amount: 320, category: 'food', title: 'Lunch with team', mood: 'happy', paymentMethod: 'upi' }),
    mk(2, { amount: 1200, category: 'shopping', title: 'New Headphones', mood: 'excited', paymentMethod: 'card' }),
    mk(3, { amount: 60, category: 'transport', title: 'Auto fare', mood: 'normal', paymentMethod: 'cash' }),
    mk(4, { amount: 850, category: 'bills', title: 'Electricity bill', mood: 'sad', paymentMethod: 'upi' }),
    mk(5, { amount: 480, category: 'entertainment', title: 'Movie night', mood: 'excited', paymentMethod: 'card' }),
    mk(6, { amount: 250, category: 'medical', title: 'Pharmacy', mood: 'normal', paymentMethod: 'cash' }),
    mk(8, { amount: 180, category: 'food', title: 'Coffee & cake', mood: 'happy', paymentMethod: 'upi' }),
    mk(10, { type: 'income', amount: 4500, category: 'freelance', title: 'Logo design', mood: 'confident', paymentMethod: 'bank' }),
  ];
}

function seedGoals(): SavingsGoal[] {
  const inDays = (d: number) => {
    const x = new Date();
    x.setDate(x.getDate() + d);
    return x.toISOString();
  };
  return [
    { id: 'g1', name: 'New Laptop', target: 80000, saved: 24000, deadline: inDays(180), priority: 'high', createdAt: todayISO() },
    { id: 'g2', name: 'Trip to Goa', target: 25000, saved: 18000, deadline: inDays(60), priority: 'medium', createdAt: todayISO() },
    { id: 'g3', name: 'Emergency Fund', target: 50000, saved: 12500, deadline: inDays(365), priority: 'high', createdAt: todayISO() },
  ];
}

interface StoreCtx {
  ready: boolean;
  user: UserProfile;
  transactions: Transaction[];
  goals: SavingsGoal[];
  setUser: (u: Partial<UserProfile>) => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (g: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, patch: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  resetAll: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUserState] = useState<UserProfile>(DEFAULT_USER);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: PersistedState = JSON.parse(raw);
          setUserState({ ...DEFAULT_USER, ...parsed.user });
          setTransactions(parsed.transactions || []);
          setGoals(parsed.goals || []);
        } else {
          // First launch — seed
          setTransactions(seedTransactions());
          setGoals(seedGoals());
        }
      } catch (e) {
        console.warn('store load failed', e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, transactions, goals } as PersistedState)
    ).catch(() => {});
  }, [ready, user, transactions, goals]);

  const setUser = useCallback((u: Partial<UserProfile>) => {
    setUserState((p) => ({ ...p, ...u }));
  }, []);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setTransactions((prev) => [{ ...t, id }, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, patch: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addGoal = useCallback((g: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const id = `g-${Date.now()}`;
    setGoals((prev) => [{ ...g, id, createdAt: todayISO() }, ...prev]);
  }, []);

  const updateGoal = useCallback((id: string, patch: Partial<SavingsGoal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const resetAll = useCallback(() => {
    setTransactions(seedTransactions());
    setGoals(seedGoals());
    setUserState({ ...DEFAULT_USER, onboarded: true });
  }, []);

  const value = useMemo<StoreCtx>(
    () => ({
      ready,
      user,
      transactions,
      goals,
      setUser,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      resetAll,
    }),
    [ready, user, transactions, goals, setUser, addTransaction, updateTransaction, deleteTransaction, addGoal, updateGoal, deleteGoal, resetAll]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore must be inside StoreProvider');
  return v;
}

export function useMonthlySummary() {
  const { transactions, user } = useStore();
  return useMemo(() => {
    const monthTx = transactions.filter((t) => sameMonth(t.date));
    const income = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = income - expense;
    const savings = Math.max(0, balance);
    const budget = user.monthlyBudget;
    const spentPct = budget > 0 ? Math.min(100, (expense / budget) * 100) : 0;
    const remaining = Math.max(0, budget - expense);
    return { income, expense, balance, savings, budget, spentPct, remaining, count: monthTx.length };
  }, [transactions, user.monthlyBudget]);
}
