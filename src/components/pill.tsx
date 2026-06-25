import { StyleSheet, View, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** A small rounded label, optionally tinted by an accent color (e.g. a category). */
export function Pill({
  label,
  color,
  glyph,
  emphasis = 'soft',
  style,
}: {
  label: string;
  color?: string;
  glyph?: string;
  emphasis?: 'soft' | 'outline';
  style?: ViewStyle;
}) {
  const theme = useTheme();
  const tint = color ?? theme.textSecondary;

  return (
    <View
      style={[
        styles.pill,
        emphasis === 'soft'
          ? { backgroundColor: withAlpha(tint, 0.14) }
          : { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: theme.border },
        style,
      ]}>
      {glyph ? <ThemedText type="small">{glyph}</ThemedText> : null}
      <ThemedText type="small" style={[styles.label, { color: emphasis === 'soft' ? tint : theme.textSecondary }]}>
        {label}
      </ThemedText>
    </View>
  );
}

/** #RRGGBB -> rgba() with the given alpha. Falls back to the input for non-hex colors. */
export function withAlpha(hex: string, alpha: number): string {
  const m = /^#?([\da-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: 4,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  label: { fontWeight: '600' },
});
