/**
 * Agora design tokens — a classical-agora palette (papyrus & marble, ink, terracotta,
 * aegean blue, and gold) for light and dark mode. Colors keys are shared across both
 * schemes so `useTheme()` and `<ThemedView type=...>` stay fully typed.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1C1A15', // ink
    textSecondary: '#6E6656',
    background: '#FBF7EF', // warm marble / papyrus
    backgroundElement: '#F3ECDD', // card
    backgroundSelected: '#E9DFC9',
    border: '#E4D9C2',
    accent: '#C2552F', // terracotta
    accentText: '#FFFFFF',
    primary: '#2B6CB0', // aegean blue
    gold: '#9C7A1E',
  },
  dark: {
    text: '#F4EEE0',
    textSecondary: '#A89E8A',
    background: '#16140F', // night agora
    backgroundElement: '#211E17',
    backgroundSelected: '#2C2820',
    border: '#322D22',
    accent: '#E07A4E',
    accentText: '#1C1A15',
    primary: '#6BB0E0',
    gold: '#D9B441',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-sans)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
}) as { sans: string; serif: string; rounded: string; mono: string };

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 28,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;

/** Wide enough for a 3-up plugin grid on desktop. */
export const MaxContentWidth = 1120;
