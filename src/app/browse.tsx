import { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Page } from '@/components/page';
import { PluginGrid } from '@/components/plugin-grid';
import { SearchBar } from '@/components/search-bar';
import { Section } from '@/components/section';
import { Seo } from '@/components/seo';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { getCategories, searchPlugins } from '@/data/catalog';
import { useCatalog } from '@/hooks/use-catalog';
import { useTheme } from '@/hooks/use-theme';

export default function BrowseScreen() {
  const theme = useTheme();
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
      <Section
        title="The catalog"
        rule={false}
        right={
          <Button
            label="Submit a plugin"
            href="/submit"
            variant="secondary"
            size="sm"
            iconRight={<Icon name="arrow-right" size={15} color={theme.text} />}
          />
        }>
        <SearchBar value={query} onChange={setQuery} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}>
          <FilterChip label="All" active={!category} onPress={() => setCategory(undefined)} />
          {categories.map((c) => (
            <FilterChip
              key={c.slug}
              label={c.name}
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
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ hovered }: { pressed: boolean; hovered?: boolean }) => (
        <View
          style={[
            styles.chip,
            {
              backgroundColor: active ? theme.text : 'transparent',
              borderColor: active ? theme.text : hovered ? theme.borderStrong : theme.border,
            },
          ]}>
          <ThemedText
            type="small"
            style={{
              color: active ? theme.background : theme.textSecondary,
              fontWeight: active ? '600' : '500',
            }}>
            {label}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chips: { gap: Spacing.two, paddingVertical: Spacing.one, paddingRight: Spacing.three },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
});
