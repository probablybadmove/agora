import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Pill, withAlpha } from '@/components/pill';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import type { Category, Plugin } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';

export function PluginCard({ plugin, category }: { plugin: Plugin; category?: Category }) {
  const theme = useTheme();

  return (
    <Link href={{ pathname: '/plugin/[slug]', params: { slug: plugin.slug } }} asChild>
      <Pressable accessibilityRole="link" style={styles.pressable}>
        {({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: hovered ? withAlpha(plugin.color, 0.6) : theme.border,
                opacity: pressed ? 0.9 : 1,
                transform: [{ translateY: hovered ? -2 : 0 }],
              },
            ]}>
            <View style={styles.top}>
              <View style={[styles.glyph, { backgroundColor: withAlpha(plugin.color, 0.16) }]}>
                <ThemedText style={styles.glyphText}>{plugin.glyph}</ThemedText>
              </View>
              <Pill
                label={plugin.kind === 'agent' ? 'Subagent' : 'Skill'}
                color={theme.textSecondary}
              />
            </View>

            <View style={styles.body}>
              <ThemedText type="heading" numberOfLines={1}>
                {plugin.displayName}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" numberOfLines={3} style={styles.desc}>
                {plugin.description}
              </ThemedText>
            </View>

            <View style={styles.footer}>
              {category ? (
                <Pill label={category.name} glyph={category.glyph} color={plugin.color} />
              ) : null}
              <ThemedText type="code" themeColor="textSecondary" numberOfLines={1} style={styles.invoke}>
                {plugin.invocation}
              </ThemedText>
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
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.three,
    minHeight: 196,
    // smooth hover lift on web
    transitionProperty: 'transform, border-color',
    transitionDuration: '160ms',
  } as object,
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  glyph: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphText: { fontSize: 22, lineHeight: 28 },
  body: { gap: 6, flex: 1 },
  desc: {},
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  invoke: { flexShrink: 1, textAlign: 'right' },
});
