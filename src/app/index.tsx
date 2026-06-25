import { useMemo, useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/button';
import { CategoryTile } from '@/components/category-tile';
import { CodeBlock } from '@/components/code-block';
import { Icon } from '@/components/icon';
import { Page } from '@/components/page';
import { PluginGrid } from '@/components/plugin-grid';
import { Section } from '@/components/section';
import { Seo } from '@/components/seo';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { categoriesWithCounts, featured } from '@/data/catalog';
import { COPY } from '@/data/copy';
import { useCatalog } from '@/hooks/use-catalog';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();
  const { plugins } = useCatalog();
  const { width } = useWindowDimensions();
  const wide = width >= 880;

  const featuredPlugins = useMemo(() => featured(plugins), [plugins]);
  const cats = useMemo(() => categoriesWithCounts(plugins), [plugins]);

  return (
    <Page>
      <Seo
        title="Agora — a marketplace for Claude Code plugins"
        description={COPY.heroSubhead}
        bare
      />

      {/* Hero */}
      <View style={[styles.hero, wide ? styles.heroRow : styles.heroCol]}>
        <View style={styles.heroText}>
          <ThemedText type="eyebrow" themeColor="textSecondary">
            Claude Code · plugin marketplace
          </ThemedText>
          <ThemedText type="display" style={styles.headline}>
            {COPY.heroHeadline}
          </ThemedText>
          <ThemedText type="lead" themeColor="textSecondary" style={styles.subhead}>
            {COPY.heroSubhead}
          </ThemedText>
          <View style={styles.ctaRow}>
            <Button
              label="Add to Claude Code"
              href="/docs"
              size="lg"
              iconRight={<Icon name="arrow-right" size={17} color={theme.background} />}
            />
            <Button label="Browse plugins" href="/browse" variant="secondary" size="lg" />
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {plugins.length} plugins · {cats.length} categories · open source under MIT
          </ThemedText>
        </View>

        <View
          style={[
            styles.panel,
            { backgroundColor: theme.surface, borderColor: theme.border },
            wide ? styles.panelWide : null,
          ]}>
          <View style={styles.panelHead}>
            <Icon name="terminal" size={16} color={theme.textSecondary} />
            <ThemedText type="eyebrow" themeColor="textSecondary">
              Quickstart
            </ThemedText>
          </View>
          <QuickStep n="1" label="Add the marketplace" code="/plugin marketplace add probablybadmove/agora" />
          <QuickStep n="2" label="Install a plugin" code="/plugin install conventional-commits@agora" />
          <QuickStep n="3" label="Reload, then run it" code="/reload-plugins" />
        </View>
      </View>

      {/* Featured */}
      <Section
        title="Featured"
        right={
          <Button
            label="All plugins"
            href="/browse"
            variant="ghost"
            size="sm"
            iconRight={<Icon name="arrow-right" size={15} color={theme.text} />}
          />
        }>
        <PluginGrid plugins={featuredPlugins} />
      </Section>

      {/* Categories */}
      <Section title="Browse by category">
        <CategoryGrid cats={cats} />
      </Section>

      {/* Contribute */}
      <Section
        title="An open square"
        description="Agora takes pull requests. Add a plugin directory, register it in the manifest, and it's on the shelf for everyone.">
        <View style={styles.contribute}>
          <Button
            label="Read the publish guide"
            href="/docs"
            variant="secondary"
            iconRight={<Icon name="arrow-right" size={16} color={theme.text} />}
          />
        </View>
      </Section>
    </Page>
  );
}

function QuickStep({ n, label, code }: { n: string; label: string; code: string }) {
  const theme = useTheme();
  return (
    <View style={styles.step}>
      <View style={styles.stepLabel}>
        <ThemedText type="code" style={{ color: theme.accent }}>
          {n}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {label}
        </ThemedText>
      </View>
      <CodeBlock code={code} />
    </View>
  );
}

function CategoryGrid({ cats }: { cats: ReturnType<typeof categoriesWithCounts> }) {
  const [width, setWidth] = useState(0);
  const cols = width >= 900 ? 4 : width >= 560 ? 2 : 1;
  const gap = Spacing.three;
  const tileW = width > 0 ? (width - gap * (cols - 1)) / cols : undefined;
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  return (
    <View style={[styles.catGrid, { gap }]} onLayout={onLayout}>
      {cats.map((c) => (
        <View key={c.slug} style={{ width: tileW ?? '100%' }}>
          <CategoryTile category={c} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { gap: Spacing.five, width: '100%', paddingTop: Spacing.two },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroCol: { flexDirection: 'column' },
  heroText: { flex: 1.15, gap: Spacing.three, minWidth: 280 },
  headline: { maxWidth: 540, marginTop: Spacing.one },
  subhead: { maxWidth: 500 },
  ctaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginTop: Spacing.one },
  panel: {
    borderWidth: 1,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    gap: Spacing.three,
    width: '100%',
  },
  panelWide: { flex: 0.95, maxWidth: 460 },
  panelHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: 2 },
  step: { gap: 6 },
  stepLabel: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
  contribute: { flexDirection: 'row' },
});
