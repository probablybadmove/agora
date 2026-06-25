/**
 * Agora design tokens — a single, light, editorial palette: warm paper, ink, and one
 * restrained terracotta accent. No per-item color, no dark mode (the app is light-only).
 * Colors.dark mirrors Colors.light so any stray color-scheme read still renders light.
 */

import '@/global.css';

import { Platform } from 'react-native';

const light = {
  text: '#1B1A16', // ink
  textSecondary: '#666155', // muted ink (AA on paper)
  background: '#FBFAF6', // warm paper
  surface: '#FFFFFF', // raised cards
  backgroundElement: '#F1EEE6', // quiet panels / code
  backgroundSelected: '#E8E2D5',
  border: '#E4DED1', // hairline
  borderStrong: '#D3CCBC',
  accent: '#A83A24', // Pompeii red — used sparingly
  accentText: '#FBFAF6',
  primary: '#A83A24',
  gold: '#9A7B2E',
} as const;

export const Colors = {
  light,
  dark: light,
} as const;

export type ThemeColor = keyof typeof light;

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
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;

/** Wide enough for a 3-up catalog grid on desktop. */
export const MaxContentWidth = 1080;
