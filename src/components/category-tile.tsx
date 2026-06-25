import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Pill, withAlpha } from '@/components/pill';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import type { CategoryWithCount } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';

export function CategoryTile({ category }: { category: CategoryWithCount }) {
  const theme = useTheme();
  return (
    <Link href={{ pathname: '/category/[slug]', params: { slug: category.slug } }} asChild>
      <Pressable accessibilityRole="link" style={styles.pressable}>
        {({ hovered }: { pressed: boolean; hovered?: boolean }) => (
          <View
            style={[
              styles.tile,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: hovered ? withAlpha(category.color, 0.6) : theme.border,
                transform: [{ translateY: hovered ? -2 : 0 }],
              },
            ]}>
            <View style={styles.top}>
              <View style={[styles.glyph, { backgroundColor: withAlpha(category.color, 0.16) }]}>
                <ThemedText style={styles.glyphText}>{category.glyph}</ThemedText>
              </View>
              <Pill label={`${category.count}`} color={category.color} />
            </View>
            <ThemedText type="heading">{category.name}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
              {category.description}
            </ThemedText>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressable: { flex: 1 },
  tile: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    minHeight: 150,
    transitionProperty: 'transform, border-color',
    transitionDuration: '160ms',
  } as object,
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  glyph: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphText: { fontSize: 20, lineHeight: 26 },
});
