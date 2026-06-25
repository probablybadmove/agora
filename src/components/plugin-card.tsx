import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Pill } from '@/components/pill';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import type { Category, Plugin } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';

export function PluginCard({ plugin, category }: { plugin: Plugin; category?: Category }) {
  const theme = useTheme();

  return (
    <Link href={{ pathname: '/plugin/[slug]', params: { slug: plugin.slug } }} asChild>
      <Pressable accessibilityRole="link" style={styles.pressable}>
        {({ hovered }: { pressed: boolean; hovered?: boolean }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: hovered ? theme.backgroundElement : theme.surface,
                borderColor: hovered ? theme.borderStrong : theme.border,
              },
            ]}>
            <View style={styles.top}>
              <ThemedText type="eyebrow" themeColor="textSecondary">
                {category?.name ?? plugin.category}
              </ThemedText>
              <Pill label={plugin.kind === 'agent' ? 'agent' : 'skill'} mono />
            </View>

            <View style={styles.body}>
              <ThemedText type="heading" numberOfLines={1}>
                {plugin.displayName}
              </ThemedText>
              <ThemedText
                type="small"
                themeColor="textSecondary"
                numberOfLines={3}
                style={styles.desc}>
                {plugin.description}
              </ThemedText>
            </View>

            <View style={[styles.footer, { borderTopColor: theme.border }]}>
              <ThemedText type="code" numberOfLines={1} style={styles.invoke}>
                <ThemedText type="code" style={{ color: theme.accent }}>
                  ›{' '}
                </ThemedText>
                {plugin.invocation}
              </ThemedText>
              <Icon name="arrow-right" size={16} color={hovered ? theme.accent : theme.textSecondary} />
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressable: { flex: 1 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.three,
    minHeight: 200,
    transitionProperty: 'background-color, border-color',
    transitionDuration: '140ms',
  } as object,
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  body: { gap: 6, flex: 1 },
  desc: {},
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    borderTopWidth: 1,
    paddingTop: Spacing.three,
  },
  invoke: { flexShrink: 1 },
});
