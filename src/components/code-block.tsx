import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** A quiet command line with a `›` prompt and one-click copy on web. No terminal chrome. */
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
    <View
      style={[styles.wrap, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <View style={styles.line}>
        <ThemedText type="code" style={{ color: theme.accent }}>
          ›{' '}
        </ThemedText>
        <ThemedText type="code" selectable style={styles.code}>
          {code}
        </ThemedText>
      </View>
      <View style={styles.right}>
        {label ? (
          <ThemedText type="code" themeColor="textSecondary" style={styles.label}>
            {label}
          </ThemedText>
        ) : null}
        {canCopy ? (
          <Pressable onPress={onCopy} accessibilityRole="button" hitSlop={8} style={styles.copy}>
            <Icon name={copied ? 'check' : 'copy'} size={14} color={theme.textSecondary} />
            <ThemedText type="code" themeColor="textSecondary">
              {copied ? 'Copied' : 'Copy'}
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    width: '100%',
  },
  line: { flexDirection: 'row', alignItems: 'baseline', flex: 1, flexWrap: 'wrap' },
  code: { flexShrink: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  label: {},
  copy: { flexDirection: 'row', alignItems: 'center', gap: 5 },
});
