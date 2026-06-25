import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
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
                backgroundColor: hovered ? theme.backgroundElement : theme.surface,
                borderColor: hovered ? theme.borderStrong : theme.border,
              },
            ]}>
            <View style={styles.top}>
              <ThemedText type="code" style={{ color: theme.accent }}>
                {String(category.count).padStart(2, '0')}
              </ThemedText>
              <Icon name="arrow-right" size={15} color={hovered ? theme.accent : theme.textSecondary} />
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
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    minHeight: 138,
    transitionProperty: 'background-color, border-color',
    transitionDuration: '140ms',
  } as object,
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
