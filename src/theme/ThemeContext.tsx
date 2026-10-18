import React, { createContext, useContext, useMemo, useState } from 'react';
import { setThemeMode } from './ThemeStyleSheet';

export type ThemeMode = 'light' | 'dark';

export const darkColors = {
  background: '#0B0E1B',
  surface: '#161B33',
  surface2: '#14182E',
  input: '#0F1326',
  border: '#20274A',
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  primary: '#FF7597',
};

export const lightColors = {
  background: '#F4F6FB',
  surface: '#FFFFFF',
  surface2: '#F1F5F9',
  input: '#F1F5F9',
  border: '#E2E8F0',
  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#64748B',
  primary: '#E85D83',
};

const THEME_STORAGE_KEY = 'rk_theme_mode';

function getInitialTheme(): ThemeMode {
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      const saved = (globalThis as any).localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        setThemeMode(saved);
        return saved;
      }
    }
  } catch {}
  setThemeMode('dark');
  return 'dark';
}

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  colors: typeof darkColors;
  setMode: (m: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  isDark: true,
  colors: darkColors,
  setMode: () => {},
  toggleMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => getInitialTheme());

  const setMode = (nextMode: ThemeMode) => {
    setThemeMode(nextMode);
    setModeState(nextMode);
    try {
      if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
        (globalThis as any).localStorage.setItem(THEME_STORAGE_KEY, nextMode);
      }
    } catch {}
  };

  const toggleMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  // Ensure ThemeStyleSheet module state is always in sync during render
  setThemeMode(mode);

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      colors: mode === 'dark' ? darkColors : lightColors,
      setMode,
      toggleMode,
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
