import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** A section with a hairline rule, a serif title, and an optional right-aligned action. */
export function Section({
  label,
  title,
  description,
  right,
  rule = true,
  children,
}: {
  label?: string;
  title?: string;
  description?: string;
  right?: ReactNode;
  rule?: boolean;
  children?: ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      {(title || right) && (
        <View style={styles.head}>
          {rule ? <View style={[styles.rule, { backgroundColor: theme.border }]} /> : null}
          <View style={styles.headRow}>
            <View style={styles.headingText}>
              {label ? (
                <ThemedText type="eyebrow" themeColor="textSecondary">
                  {label}
                </ThemedText>
              ) : null}
              {title ? <ThemedText type="title">{title}</ThemedText> : null}
              {description ? (
                <ThemedText type="lead" themeColor="textSecondary" style={styles.desc}>
                  {description}
                </ThemedText>
              ) : null}
            </View>
            {right ? <View style={styles.right}>{right}</View> : null}
          </View>
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.four, width: '100%' },
  head: { gap: Spacing.three },
  rule: { height: 1, width: '100%' },
  headRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.three,
    flexWrap: 'wrap',
  },
  headingText: { gap: Spacing.one, flexShrink: 1, minWidth: 220 },
  desc: { maxWidth: 600, marginTop: Spacing.one },
  right: { paddingBottom: 2 },
});
