import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** A terminal-style snippet box. On web it offers one-click copy. */
export function CodeBlock({ code, label }: { code: string; label?: string }) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  const canCopy = Platform.OS === 'web';
  const onCopy = () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      });
    }
  };

  return (
    <View style={[styles.wrap, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <View style={styles.row}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: '#E0795A' }]} />
          <View style={[styles.dot, { backgroundColor: theme.gold }]} />
          <View style={[styles.dot, { backgroundColor: '#5BB98B' }]} />
        </View>
        {label ? (
          <ThemedText type="small" themeColor="textSecondary">
            {label}
          </ThemedText>
        ) : null}
        {canCopy ? (
          <Pressable onPress={onCopy} accessibilityRole="button" style={styles.copyBtn} hitSlop={8}>
            <ThemedText type="small" style={{ color: theme.primary, fontWeight: '600' }}>
              {copied ? 'Copied ✓' : 'Copy'}
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
      <ThemedText type="code" selectable style={styles.code}>
        {code}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    padding: Spacing.three,
    gap: Spacing.two,
    width: '100%',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  dots: { flexDirection: 'row', gap: 6, marginRight: 'auto' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  copyBtn: { marginLeft: 'auto', paddingHorizontal: 4 },
  code: { },
});
