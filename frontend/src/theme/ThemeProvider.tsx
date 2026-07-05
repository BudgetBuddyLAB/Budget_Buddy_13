/**
 * Theme provider — light/dark mode with AsyncStorage persistence.
 * Exposes `useTheme()` (mode + setMode) and `useColors()` (active palette).
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { lightColors, darkColors, Palette } from './index';

const STORAGE_KEY = 'budget_buddy_theme_mode_v1';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeCtxValue {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
  colors: Palette;
}

const Ctx = createContext<ThemeCtxValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [systemDark, setSystemDark] = useState<boolean>(() => Appearance.getColorScheme() === 'dark');

  // Persist + load
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw === 'light' || raw === 'dark' || raw === 'system') {
          setModeState(raw);
        }
      } catch (_e) {}
    })();
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemDark(colorScheme === 'dark');
    });
    return () => sub.remove();
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m).catch(() => {});
  }, []);

  const isDark = mode === 'dark' || (mode === 'system' && systemDark);
  const colors = isDark ? darkColors : lightColors;

  const toggle = useCallback(() => {
    setMode(isDark ? 'light' : 'dark');
  }, [isDark, setMode]);

  const value = useMemo<ThemeCtxValue>(
    () => ({ mode, isDark, setMode, toggle, colors }),
    [mode, isDark, setMode, toggle, colors]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtxValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme must be used inside ThemeProvider');
  return v;
}

export function useColors(): Palette {
  return useTheme().colors;
}
