import { StyleSheet } from 'react-native';
import { darkColors, lightColors } from './ThemeContext';
let currentMode: 'light'|'dark' = 'dark';
export const setThemeMode = (mode: 'light'|'dark') => { currentMode = mode; };
const map: Record<string,string> = {
 '#0B0E1B': lightColors.background, '#0F1326': lightColors.input, '#0F1225': lightColors.input, '#14182E': lightColors.surface2, '#161B33': lightColors.surface, '#1F2547': '#E8EBF2', '#20274A': lightColors.border, '#242B4E': lightColors.border, '#FFFFFF': lightColors.text, '#E2E8F0': '#1F2937', '#CBD5E1': '#475569', '#94A3B8': lightColors.textSecondary, '#64748B': '#64748B', '#475569': '#64748B', '#334155': '#CBD5E1'
};
const rgbaMap=(v:string)=>{
 if(currentMode==='dark') return v;
 if(v.startsWith('rgba(0, 0, 0')) return 'rgba(15, 23, 42, 0.35)';
 if(v.includes('255, 117, 151')) return v.replace('255, 117, 151','232, 93, 131');
 if(v.includes('168, 85, 247')) return 'rgba(139, 92, 246, 0.10)';
 if(v.includes('16, 185, 129')) return v;
 return v;
};
const themed=(value:any):any=>{
 if(currentMode==='dark') return value;
 if(typeof value==='string') return value.startsWith('rgba(') ? rgbaMap(value) : (map[value] ?? value);
 return value;
};
export const ThemeStyleSheet = {
 create<T extends Record<string, any>>(styles:T):T {
  const out:any={};
  Object.keys(styles).forEach(k=>{
   out[k]=new Proxy(styles[k]||{}, { get(target,prop){ return themed(target[prop as any]); } });
  });
  return out as T;
 }
};
