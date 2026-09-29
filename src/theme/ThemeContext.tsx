import React, { createContext, useContext, useMemo, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
export const darkColors = { background: '#0B0E1B', surface: '#14182E', surface2: '#161B33', input: '#0F1326', border: '#20274A', text: '#FFFFFF', textSecondary: '#94A3B8', textTertiary: '#64748B', primary: '#FF7597' };
export const lightColors = { background: '#F7F8FC', surface: '#FFFFFF', surface2: '#F1F3F8', input: '#FFFFFF', border: '#E2E8F0', text: '#111827', textSecondary: '#64748B', textTertiary: '#94A3B8', primary: '#E85D83' };

const ThemeContext = createContext<{ mode: ThemeMode; setMode: (m: ThemeMode) => void }>({ mode: 'dark', setMode: () => {} });
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [mode,setMode]=useState<ThemeMode>('dark');
  const value=useMemo(()=>({mode,setMode}),[mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
export const useTheme=()=>useContext(ThemeContext);
