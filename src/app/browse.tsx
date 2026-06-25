import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { Page } from '@/components/page';
import { PluginGrid } from '@/components/plugin-grid';
import { SearchBar } from '@/components/search-bar';
import { Section } from '@/components/section';
import { Seo } from '@/components/seo';
import { ThemedText } from '@/components/themed-text';
import { withAlpha } from '@/components/pill';
import { Radius, Spacing } from '@/constants/theme';
import { getCategories, searchPlugins } from '@/data/catalog';
import { useCatalog } from '@/hooks/use-catalog';
import { useTheme } from '@/hooks/use-theme';

export default function BrowseScreen() {
  const { plugins } = useCatalog();
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? '');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const categories = getCategories();

  const results = useMemo(
    () => searchPlugins(plugins, query, category),
    [plugins, query, category]
  );

  return (
    <Page>
      <Seo
        title="Browse plugins"
        description="Search every Claude Code plugin in Agora by name or category."
        path="/browse"
      />
      <Section eyebrow="The catalog" title="Every plugin in the square">
        <SearchBar value={query} onChange={setQuery} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}>
          <FilterChip
            label="All"
            active={!category}
            onPress={() => setCategory(undefined)}
          />
          {categories.map((c) => (
            <FilterChip
              key={c.slug}
              label={`${c.glyph} ${c.name}`}
              color={c.color}
              active={category === c.slug}
              onPress={() => setCategory(category === c.slug ? undefined : c.slug)}
            />
          ))}
        </ScrollView>

        <ThemedText type="small" themeColor="textSecondary">
          {results.length} {results.length === 1 ? 'plugin' : 'plugins'}
          {category ? ` in ${categories.find((c) => c.slug === category)?.name}` : ''}
          {query ? ` matching “${query}”` : ''}
        </ThemedText>

        <PluginGrid plugins={results} />
      </Section>
    </Page>
  );
}

function FilterChip({
  label,
  active,
  color,
  onPress,
}: {
  label: string;
  active: boolean;
  color?: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  const tint = color ?? theme.accent;
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <View
        style={[
          styles.chip,
          active
            ? { backgroundColor: withAlpha(tint, 0.18), borderColor: withAlpha(tint, 0.5) }
            : { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        <ThemedText
          type="small"
          style={{ color: active ? theme.text : theme.textSecondary, fontWeight: active ? '600' : '500' }}>
          {label}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chips: { gap: Spacing.two, paddingVertical: Spacing.one, paddingRight: Spacing.three },
  chip: {
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
});
