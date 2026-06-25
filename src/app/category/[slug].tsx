import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Page } from '@/components/page';
import { PluginGrid } from '@/components/plugin-grid';
import { Section } from '@/components/section';
import { Seo } from '@/components/seo';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { getCategoryBySlug } from '@/data/catalog';
import { CATEGORIES } from '@/data/seed';
import { useCatalog } from '@/hooks/use-catalog';
import { useTheme } from '@/hooks/use-theme';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default function CategoryScreen() {
  const theme = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { plugins } = useCatalog();
  const category = getCategoryBySlug(slug);
  const items = useMemo(() => plugins.filter((p) => p.category === slug), [plugins, slug]);

  if (!category) {
    return (
      <Page>
        <View style={styles.notFound}>
          <ThemedText type="title">Category not found</ThemedText>
          <Button label="Browse all plugins" href="/browse" />
        </View>
      </Page>
    );
  }

  return (
    <Page>
      <Seo
        title={`${category.name} plugins`}
        description={category.description}
        path={`/category/${category.slug}`}
      />

      <Link href="/browse" asChild>
        <Pressable accessibilityRole="link" style={styles.back}>
          <Icon name="arrow-left" size={15} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary">
            Back to catalog
          </ThemedText>
        </Pressable>
      </Link>

      <View style={styles.header}>
        <ThemedText type="eyebrow" themeColor="accent">
          Category · {String(items.length).padStart(2, '0')}
        </ThemedText>
        <ThemedText type="display">{category.name}</ThemedText>
        <ThemedText type="lead" themeColor="textSecondary" style={{ maxWidth: 560 }}>
          {category.description}
        </ThemedText>
      </View>

      <Section title={`${items.length} ${items.length === 1 ? 'plugin' : 'plugins'}`}>
        <PluginGrid plugins={items} />
      </Section>
    </Page>
  );
}

const styles = StyleSheet.create({
  notFound: { gap: Spacing.three, alignItems: 'flex-start', paddingVertical: Spacing.six },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  header: { gap: Spacing.two },
});
