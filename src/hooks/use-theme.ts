/** Agora is light-only — always return the light palette. */

import { Colors } from '@/constants/theme';

export function useTheme() {
  return Colors.light;
}
