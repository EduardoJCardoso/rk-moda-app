let currentMode: 'light' | 'dark' = 'dark';

export const setThemeMode = (mode: 'light' | 'dark') => {
  currentMode = mode;
};

export const getThemeMode = () => currentMode;

const WHITE_TEXT_ON_ACCENT_KEYS = new Set([
  'submitBtnText',
  'saveBtnText',
  'newOrderBtnText',
  'newProdBtnText',
  'newClientBtnText',
  'tabItemTextActive',
  'tabBtnTextActive',
  'categoryChipTextActive',
  'stateChipTextActive',
  'optionChipTextActive',
  'sizeChipTextActive',
  'themeButtonTextActive',
  'profileAvatarText',
  'avatarMiniText',
  'avatarText',
]);

const bgMap: Record<string, string> = {
  '#0B0E1B': '#F4F6FB',
  '#0F1225': '#FFFFFF',
  '#0F1326': '#F1F5F9',
  '#14182E': '#FFFFFF',
  '#161B33': '#FFFFFF',
  '#1A203F': '#FFF1F5',
  '#1E2547': '#FDF2F8',
  '#1F2547': '#F1F5F9',
  '#20274A': '#E2E8F0',
  '#242B4E': '#E2E8F0',
  '#2B3563': '#CBD5E1',
  '#334155': '#CBD5E1',
};

const textMap: Record<string, string> = {
  '#FFFFFF': '#0F172A',
  '#E2E8F0': '#1E293B',
  '#CBD5E1': '#334155',
  '#94A3B8': '#475569',
  '#64748B': '#64748B',
  '#475569': '#64748B',
  '#34D399': '#059669',
  '#FBBF24': '#D97706',
  '#C084FC': '#7C3AED',
  '#A78BFA': '#7C3AED',
  '#60A5FA': '#2563EB',
  '#93C5FD': '#2563EB',
  '#FB7185': '#E11D48',
  '#F472B6': '#DB2777',
};

const borderMap: Record<string, string> = {
  '#20274A': '#E2E8F0',
  '#242B4E': '#E2E8F0',
  '#2B3563': '#CBD5E1',
  '#334155': '#CBD5E1',
};

const rgbaMap = (v: string): string => {
  if (v.startsWith('rgba(0, 0, 0')) return 'rgba(15, 23, 42, 0.45)';
  if (v.startsWith('rgba(36, 43, 78')) return '#E2E8F0';
  if (v.startsWith('rgba(30, 37, 71')) return '#E2E8F0';
  if (v.includes('255, 117, 151')) return v.replace('255, 117, 151', '232, 93, 131');
  if (v.includes('168, 85, 247')) return 'rgba(139, 92, 246, 0.12)';
  if (v.includes('16, 185, 129')) return 'rgba(16, 185, 129, 0.14)';
  if (v.includes('251, 191, 36')) return 'rgba(245, 158, 11, 0.16)';
  return v;
};

function convertToLightStyle(styleKey: string, styleObj: Record<string, any>): Record<string, any> {
  const lightStyle: Record<string, any> = {};

  for (const prop of Object.keys(styleObj)) {
    const value = styleObj[prop];

    if (prop === 'shadowOpacity' && typeof value === 'number') {
      lightStyle[prop] = Math.min(value, 0.08);
      continue;
    }

    if (prop === 'shadowColor' && value === '#000000') {
      lightStyle[prop] = '#0F172A';
      continue;
    }

    if (typeof value !== 'string') {
      lightStyle[prop] = value;
      continue;
    }

    if (value.startsWith('rgba(')) {
      lightStyle[prop] = rgbaMap(value);
      continue;
    }

    if (prop === 'backgroundColor') {
      if (styleKey === 'tabItem' && value === '#14182E') {
        lightStyle[prop] = '#F1F5F9';
      } else if (value === '#FFFFFF') {
        lightStyle[prop] = '#FFFFFF';
      } else {
        lightStyle[prop] = bgMap[value] ?? value;
      }
      continue;
    }

    if (prop === 'color') {
      if (
        value === '#FFFFFF' &&
        (WHITE_TEXT_ON_ACCENT_KEYS.has(styleKey) || styleObj.backgroundColor === '#FF7597')
      ) {
        lightStyle[prop] = '#FFFFFF';
      } else {
        lightStyle[prop] = textMap[value] ?? value;
      }
      continue;
    }

    if (prop.toLowerCase().includes('border') && prop.toLowerCase().includes('color')) {
      lightStyle[prop] = borderMap[value] ?? bgMap[value] ?? value;
      continue;
    }

    lightStyle[prop] = bgMap[value] ?? textMap[value] ?? value;
  }

  return lightStyle;
}

import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export const ThemeStyleSheet = {
  create<T extends NamedStyles<T> | NamedStyles<any>>(styles: T & NamedStyles<any>): T {
    const darkResolved: Record<string, any> = {};
    const lightResolved: Record<string, any> = {};
    const out: any = {};

    Object.keys(styles).forEach((k) => {
      const raw = (styles as any)[k] || {};
      darkResolved[k] = { ...raw };
      lightResolved[k] = convertToLightStyle(k, raw);

      Object.defineProperty(out, k, {
        enumerable: true,
        configurable: false,
        get() {
          return currentMode === 'dark' ? darkResolved[k] : lightResolved[k];
        },
      });
    });

    return out as T;
  },
};
