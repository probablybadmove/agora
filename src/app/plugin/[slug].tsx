import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/button';
import { CodeBlock } from '@/components/code-block';
import { ExternalLink } from '@/components/external-link';
import { Page } from '@/components/page';
import { Pill, withAlpha } from '@/components/pill';
import { PluginGrid } from '@/components/plugin-grid';
import { Section } from '@/components/section';
import { Seo } from '@/components/seo';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { getCategoryBySlug, installCommand, MARKETPLACE, sourceUrl } from '@/data/catalog';
import { PLUGINS } from '@/data/seed';
import { useCatalog } from '@/hooks/use-catalog';
import { useTheme } from '@/hooks/use-theme';

/** Prerender one static HTML page per plugin at export time (great for SEO + deep links). */
export function generateStaticParams() {
  return PLUGINS.map((p) => ({ slug: p.slug }));
}

export default function PluginScreen() {
  const theme = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { plugins } = useCatalog();
  const { width } = useWindowDimensions();
  const wide = width >= 880;

  const plugin = useMemo(() => plugins.find((p) => p.slug === slug), [plugins, slug]);
  const related = useMemo(
    () => (plugin ? plugins.filter((p) => p.category === plugin.category && p.slug !== plugin.slug) : []),
    [plugins, plugin]
  );

  if (!plugin) {
    return (
      <Page>
        <View style={styles.notFound}>
          <ThemedText type="title">Plugin not found</ThemedText>
          <ThemedText type="lead" themeColor="textSecondary">
            We couldn&apos;t find a plugin called “{slug}”.
          </ThemedText>
          <Button label="Browse all plugins" href="/browse" />
        </View>
      </Page>
    );
  }

  const category = getCategoryBySlug(plugin.category);

  return (
    <Page>
      <Seo
        title={plugin.displayName}
        description={plugin.description}
        path={`/plugin/${plugin.slug}`}
      />
      <Link href="/browse" asChild>
        <Pressable accessibilityRole="link" style={styles.back}>
          <ThemedText type="small" themeColor="textSecondary">
            ← Back to catalog
          </ThemedText>
        </Pressable>
      </Link>

      <View style={[styles.head, wide ? styles.headRow : styles.headCol]}>
        <View style={styles.headMain}>
          <View style={styles.titleRow}>
            <View style={[styles.glyph, { backgroundColor: withAlpha(plugin.color, 0.16) }]}>
              <ThemedText style={styles.glyphText}>{plugin.glyph}</ThemedText>
            </View>
            <View style={styles.titleText}>
              <ThemedText type="title">{plugin.displayName}</ThemedText>
              <View style={styles.pills}>
                {category ? (
                  <Link
                    href={{ pathname: '/category/[slug]', params: { slug: category.slug } }}
                    asChild>
                    <Pressable accessibilityRole="link">
                      <Pill label={category.name} glyph={category.glyph} color={plugin.color} />
                    </Pressable>
                  </Link>
                ) : null}
                <Pill
                  label={plugin.kind === 'agent' ? 'Subagent' : 'Skill'}
                  color={theme.textSecondary}
                />
              </View>
            </View>
          </View>
          <ThemedText type="lead" themeColor="textSecondary" style={styles.desc}>
            {plugin.description}
          </ThemedText>
        </View>

        {/* Install panel */}
        <View
          style={[
            styles.install,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            wide ? styles.installWide : null,
          ]}>
          <ThemedText type="eyebrow" themeColor="textSecondary">
            Install
          </ThemedText>
          <CodeBlock code={installCommand(plugin)} label="in Claude Code" />
          <ThemedText type="small" themeColor="textSecondary">
            Then <ThemedText type="code">/reload-plugins</ThemedText> and invoke:
          </ThemedText>
          <CodeBlock code={plugin.invocation} />
          <ThemedText type="small" themeColor="textSecondary">
            New here? <LinkText href="/docs" label="Add the marketplace first" />.
          </ThemedText>
        </View>
      </View>

      {/* Overview */}
      <Section eyebrow="Overview" title="What it does">
        <ThemedText type="default" themeColor="textSecondary" style={styles.long}>
          {plugin.longDescription}
        </ThemedText>
        <View style={styles.meta}>
          <Meta label="Version" value={plugin.version} />
          <Meta label="License" value={plugin.license} />
          <Meta label="Author" value={plugin.author.name} />
          <Meta label="Type" value={plugin.kind === 'agent' ? 'Subagent' : 'Skill'} />
        </View>
        <View style={styles.keywords}>
          {plugin.keywords.map((k) => (
            <Pill key={k} label={k} emphasis="outline" />
          ))}
        </View>
        <View style={styles.sourceRow}>
          <ExternalLink href={sourceUrl(plugin)} asChild>
            <Pressable accessibilityRole="link">
              <Button label="View source on GitHub" variant="secondary" />
            </Pressable>
          </ExternalLink>
          <ThemedText type="small" themeColor="textSecondary">
            {MARKETPLACE.repo}/{plugin.source.replace('./', '')}
          </ThemedText>
        </View>
      </Section>

      {related.length > 0 ? (
        <Section eyebrow="More in this category" title={category?.name ?? 'Related'}>
          <PluginGrid plugins={related} />
        </Section>
      ) : null}
    </Page>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.metaItem, { borderColor: theme.border }]}>
      <ThemedText type="eyebrow" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="default">{value}</ThemedText>
    </View>
  );
}

function LinkText({ href, label }: { href: '/docs'; label: string }) {
  const theme = useTheme();
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link">
        <ThemedText type="small" style={{ color: theme.primary, fontWeight: '600' }}>
          {label}
        </ThemedText>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  notFound: { gap: Spacing.three, alignItems: 'flex-start', paddingVertical: Spacing.six },
  back: { alignSelf: 'flex-start' },
  head: { gap: Spacing.four, width: '100%' },
  headRow: { flexDirection: 'row', alignItems: 'flex-start' },
  headCol: { flexDirection: 'column' },
  headMain: { flex: 1.2, gap: Spacing.three, minWidth: 280 },
  titleRow: { flexDirection: 'row', gap: Spacing.three, alignItems: 'center' },
  glyph: {
    width: 60,
    height: 60,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphText: { fontSize: 30, lineHeight: 36 },
  titleText: { gap: Spacing.two, flexShrink: 1 },
  pills: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  desc: { maxWidth: 560 },
  install: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    gap: Spacing.two,
    width: '100%',
  },
  installWide: { flex: 0.9, maxWidth: 420 },
  long: { maxWidth: 760 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  metaItem: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: Radius.md,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    gap: 4,
    minWidth: 120,
  },
  keywords: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, flexWrap: 'wrap' },
});
