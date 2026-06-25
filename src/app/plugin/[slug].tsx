import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/button';
import { CodeBlock } from '@/components/code-block';
import { ExternalLink } from '@/components/external-link';
import { Icon } from '@/components/icon';
import { Page } from '@/components/page';
import { Pill } from '@/components/pill';
import { PluginGrid } from '@/components/plugin-grid';
import { Section } from '@/components/section';
import { Seo } from '@/components/seo';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { getCategoryBySlug, installCommand, MARKETPLACE, sourceUrl } from '@/data/catalog';
import { PLUGINS } from '@/data/seed';
import { useCatalog } from '@/hooks/use-catalog';
import { useTheme } from '@/hooks/use-theme';

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
    () =>
      plugin ? plugins.filter((p) => p.category === plugin.category && p.slug !== plugin.slug) : [],
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
      <Seo title={plugin.displayName} description={plugin.description} path={`/plugin/${plugin.slug}`} />

      <BackLink />

      <View style={[styles.head, wide ? styles.headRow : styles.headCol]}>
        <View style={styles.headMain}>
          {category ? (
            <Link href={{ pathname: '/category/[slug]', params: { slug: category.slug } }} asChild>
              <Pressable accessibilityRole="link">
                <ThemedText type="eyebrow" themeColor="accent">
                  {category.name}
                </ThemedText>
              </Pressable>
            </Link>
          ) : null}
          <View style={styles.titleRow}>
            <ThemedText type="display" style={styles.title}>
              {plugin.displayName}
            </ThemedText>
            <Pill label={plugin.kind === 'agent' ? 'agent' : 'skill'} mono style={styles.kind} />
            {plugin.community ? <Pill label="community" tone="accent" style={styles.kind} /> : null}
          </View>
          <ThemedText type="lead" themeColor="textSecondary" style={styles.desc}>
            {plugin.description}
          </ThemedText>
        </View>

        <View
          style={[
            styles.install,
            { backgroundColor: theme.surface, borderColor: theme.border },
            wide ? styles.installWide : null,
          ]}>
          <ThemedText type="eyebrow" themeColor="textSecondary">
            Install
          </ThemedText>
          <CodeBlock code={installCommand(plugin)} />
          <ThemedText type="small" themeColor="textSecondary">
            Reload, then invoke:
          </ThemedText>
          <CodeBlock code={plugin.invocation} />
          <View style={styles.installNote}>
            <ThemedText type="small" themeColor="textSecondary">
              New here?{' '}
            </ThemedText>
            <LinkText href="/docs" label="Add the marketplace first" />
          </View>
        </View>
      </View>

      <Section label="Overview" title="What it does">
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
            <Pill key={k} label={k} />
          ))}
        </View>
        <View style={styles.sourceRow}>
          <ExternalLink href={sourceUrl(plugin)} asChild>
            <Pressable accessibilityRole="link">
              <Button
                label="View source"
                variant="secondary"
                icon={<Icon name="github" size={16} color={theme.text} />}
              />
            </Pressable>
          </ExternalLink>
          <ThemedText type="code" themeColor="textSecondary" numberOfLines={1} style={styles.repoPath}>
            {MARKETPLACE.repo}/{plugin.source.replace('./', '')}
          </ThemedText>
        </View>
      </Section>

      {related.length > 0 ? (
        <Section label="More in this category" title={category?.name ?? 'Related'}>
          <PluginGrid plugins={related} />
        </Section>
      ) : null}
    </Page>
  );
}

function BackLink() {
  const theme = useTheme();
  return (
    <Link href="/browse" asChild>
      <Pressable accessibilityRole="link" style={styles.back}>
        <Icon name="arrow-left" size={15} color={theme.textSecondary} />
        <ThemedText type="small" themeColor="textSecondary">
          Back to catalog
        </ThemedText>
      </Pressable>
    </Link>
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
        <ThemedText type="small" style={{ color: theme.accent, fontWeight: '600' }}>
          {label}
        </ThemedText>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  notFound: { gap: Spacing.three, alignItems: 'flex-start', paddingVertical: Spacing.six },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  head: { gap: Spacing.four, width: '100%' },
  headRow: { flexDirection: 'row', alignItems: 'flex-start' },
  headCol: { flexDirection: 'column' },
  headMain: { flex: 1.2, gap: Spacing.two, minWidth: 280 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, flexWrap: 'wrap' },
  title: { flexShrink: 1 },
  kind: { marginTop: 6 },
  desc: { maxWidth: 560, marginTop: Spacing.one },
  install: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.four,
    gap: Spacing.two,
    width: '100%',
  },
  installWide: { flex: 0.9, maxWidth: 420 },
  installNote: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 2 },
  long: { maxWidth: 740 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  metaItem: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    gap: 4,
    minWidth: 116,
  },
  keywords: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, flexWrap: 'wrap' },
  repoPath: { flexShrink: 1 },
});
