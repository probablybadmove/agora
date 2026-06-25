import { StyleSheet, View, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** A small, neutral tag — hairline bordered, no per-item color. `mono` for code-ish labels. */
export function Pill({
  label,
  mono = false,
  tone = 'neutral',
  style,
}: {
  label: string;
  mono?: boolean;
  tone?: 'neutral' | 'accent';
  style?: ViewStyle;
}) {
  const theme = useTheme();
  const color = tone === 'accent' ? theme.accent : theme.textSecondary;
  return (
    <View style={[styles.pill, { borderColor: theme.border }, style]}>
      <ThemedText
        type={mono ? 'code' : 'small'}
        style={[styles.label, mono ? styles.mono : null, { color }]}>
        {label}
      </ThemedText>
    </View>
  );
}

/** #RRGGBB -> rgba() with the given alpha. Kept for occasional accent tints. */
export function withAlpha(hex: string, alpha: number): string {
  const m = /^#?([\da-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: { fontWeight: '500' },
  mono: { fontSize: 12 },
});
