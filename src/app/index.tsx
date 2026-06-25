import { useMemo, useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, useWindowDimensions, View } from 'react-native';

import { AgoraMark } from '@/components/agora-mark';
import { Button } from '@/components/button';
import { CategoryTile } from '@/components/category-tile';
import { CodeBlock } from '@/components/code-block';
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
          <View style={styles.heroEyebrow}>
            <AgoraMark size={22} color={theme.accent} />
            <ThemedText type="eyebrow" themeColor="accent">
              Claude Code plugin marketplace
            </ThemedText>
          </View>
          <ThemedText type="display" style={styles.headline}>
            {COPY.heroHeadline}
          </ThemedText>
          <ThemedText type="lead" themeColor="textSecondary" style={styles.subhead}>
            {COPY.heroSubhead}
          </ThemedText>
          <View style={styles.ctaRow}>
            <Button label="Add to Claude Code" href="/docs" size="lg" />
            <Button label="Browse plugins" href="/browse" variant="secondary" size="lg" />
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {plugins.length} plugins · {cats.length} categories · one command to install
          </ThemedText>
        </View>

        <View
          style={[
            styles.heroPanel,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            wide ? styles.heroPanelWide : null,
          ]}>
          <ThemedText type="eyebrow" themeColor="textSecondary">
            Get started
          </ThemedText>
          <View style={styles.panelStep}>
            <ThemedText type="small" themeColor="textSecondary">
              1. Add the marketplace
            </ThemedText>
            <CodeBlock code="/plugin marketplace add probablybadmove/agora" />
          </View>
          <View style={styles.panelStep}>
            <ThemedText type="small" themeColor="textSecondary">
              2. Install any plugin
            </ThemedText>
            <CodeBlock code="/plugin install conventional-commits@agora" />
          </View>
        </View>
      </View>

      {/* Featured */}
      <Section
        eyebrow="Featured"
        title="Tools worth a place on your shelf"
        right={<Button label="View all" href="/browse" variant="secondary" size="sm" />}>
        <PluginGrid plugins={featuredPlugins} />
      </Section>

      {/* Categories */}
      <Section eyebrow="The stalls" title="Browse by category">
        <CategoryGrid cats={cats} />
      </Section>

      {/* How it works */}
      <Section eyebrow="How it works" title="Three steps, then back to building">
        <Steps />
      </Section>

      {/* Closing CTA */}
      <View style={[styles.band, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <View style={styles.bandText}>
          <ThemedText type="title">Bring your own stall</ThemedText>
          <ThemedText type="lead" themeColor="textSecondary" style={{ maxWidth: 520 }}>
            Agora is an open square. Add a plugin with a single pull request and it&apos;s live for
            everyone.
          </ThemedText>
        </View>
        <Button label="Read the publish guide" href="/docs" size="lg" />
      </View>
    </Page>
  );
}

function CategoryGrid({ cats }: { cats: ReturnType<typeof categoriesWithCounts> }) {
  const [width, setWidth] = useState(0);
  const cols = width >= 900 ? 4 : width >= 620 ? 2 : 1;
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

function Steps() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const wide = width >= 880;
  const steps = [
    { n: '1', title: 'Add the marketplace', code: '/plugin marketplace add probablybadmove/agora' },
    { n: '2', title: 'Install a plugin', code: '/plugin install dockerize@agora' },
    { n: '3', title: 'Reload, then run', code: '/reload-plugins' },
  ];
  return (
    <View style={[styles.steps, { flexDirection: wide ? 'row' : 'column' }]}>
      {steps.map((s) => (
        <View
          key={s.n}
          style={[
            styles.step,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          ]}>
          <View style={[styles.stepNum, { backgroundColor: theme.accent }]}>
            <ThemedText type="smallBold" style={{ color: theme.accentText }}>
              {s.n}
            </ThemedText>
          </View>
          <ThemedText type="heading">{s.title}</ThemedText>
          <CodeBlock code={s.code} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { gap: Spacing.five, width: '100%' },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroCol: { flexDirection: 'column' },
  heroText: { flex: 1.1, gap: Spacing.three, minWidth: 280 },
  heroEyebrow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  headline: { maxWidth: 560 },
  subhead: { maxWidth: 520 },
  ctaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginTop: Spacing.one },
  heroPanel: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    gap: Spacing.three,
    width: '100%',
  },
  heroPanelWide: { flex: 0.9, maxWidth: 440 },
  panelStep: { gap: Spacing.two },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
  steps: { gap: Spacing.three, width: '100%' },
  step: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  band: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: Radius.xl,
    padding: Spacing.five,
    gap: Spacing.four,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bandText: { gap: Spacing.two, flexShrink: 1, minWidth: 260 },
});
