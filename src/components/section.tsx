import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export function Section({
  eyebrow,
  title,
  description,
  right,
  children,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  right?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <View style={styles.section}>
      {(eyebrow || title || right) && (
        <View style={styles.header}>
          <View style={styles.headingText}>
            {eyebrow ? (
              <ThemedText type="eyebrow" themeColor="accent">
                {eyebrow}
              </ThemedText>
            ) : null}
            {title ? <ThemedText type="title">{title}</ThemedText> : null}
            {description ? (
              <ThemedText type="lead" themeColor="textSecondary" style={styles.desc}>
                {description}
              </ThemedText>
            ) : null}
          </View>
          {right ? <View>{right}</View> : null}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.four, width: '100%' },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.three,
    flexWrap: 'wrap',
  },
  headingText: { gap: Spacing.two, flexShrink: 1, minWidth: 240 },
  desc: { maxWidth: 640 },
});
