import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/button';
import { ExternalLink } from '@/components/external-link';
import { Icon } from '@/components/icon';
import { Page } from '@/components/page';
import { Section } from '@/components/section';
import { Seo } from '@/components/seo';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { MARKETPLACE } from '@/data/catalog';
import { useTheme } from '@/hooks/use-theme';

const ISSUE_URL = `https://github.com/${MARKETPLACE.repo}/issues/new?template=plugin-submission.yml`;

const STEPS = [
  'Build your plugin in your own public GitHub repo, with a valid `.claude-plugin/plugin.json` at the root.',
  'Open the plugin-submission issue (button on the right) and fill in your name, owner/repo, description, and category.',
  'A maintainer reviews it and adds an entry to `marketplace.json` that points at your repo — your code never moves.',
  'Once merged, it installs as `/plugin install <name>@agora` and shows up in the catalog here.',
];

export default function SubmitScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const wide = width >= 880;

  return (
    <Page>
      <Seo
        title="Submit a plugin"
        description="List your Claude Code plugin in Agora. Your plugin stays in your own repo; we add a referencing entry."
        path="/submit"
      />

      <View style={styles.header}>
        <ThemedText type="eyebrow" themeColor="textSecondary">
          Contribute
        </ThemedText>
        <ThemedText type="display" style={styles.headline}>
          List your plugin in Agora
        </ThemedText>
        <ThemedText type="lead" themeColor="textSecondary" style={styles.lead}>
          Agora is an open marketplace. Your plugin stays in your own GitHub repo — we just add a
          line to the manifest that references it, so it becomes installable for everyone.
        </ThemedText>
      </View>

      <View style={[styles.cols, wide ? styles.row : styles.col]}>
        {/* Steps */}
        <View style={styles.steps}>
          {STEPS.map((s, i) => (
            <View key={i} style={styles.step}>
              <View style={[styles.num, { borderColor: theme.border }]}>
                <ThemedText type="code" style={{ color: theme.accent }}>
                  {String(i + 1).padStart(2, '0')}
                </ThemedText>
              </View>
              <ThemedText type="default" themeColor="textSecondary" style={styles.stepText}>
                <Inline text={s} />
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Submit card */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.border },
            wide ? styles.cardWide : null,
          ]}>
          <ThemedText type="eyebrow" themeColor="textSecondary">
            Before you submit
          </ThemedText>
          <View style={styles.checks}>
            <Check label="A public GitHub repo" />
            <Check label="A valid .claude-plugin/plugin.json" />
            <Check label="A one-line description + category" />
          </View>
          <ExternalLink href={ISSUE_URL} asChild>
            <Pressable accessibilityRole="link">
              <Button
                label="Submit on GitHub"
                size="lg"
                icon={<Icon name="github" size={17} color={theme.background} />}
                style={styles.submitBtn}
              />
            </Pressable>
          </ExternalLink>
          <ThemedText type="small" themeColor="textSecondary" style={styles.fine}>
            Opens a pre-filled issue. Prefer a PR? See the{' '}
            <SubmitLink /> .
          </ThemedText>
        </View>
      </View>
    </Page>
  );
}

function Check({ label }: { label: string }) {
  const theme = useTheme();
  return (
    <View style={styles.check}>
      <Icon name="check" size={16} color={theme.accent} />
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

function SubmitLink() {
  const theme = useTheme();
  return (
    <ExternalLink href={`https://github.com/${MARKETPLACE.repo}`} asChild>
      <Pressable accessibilityRole="link">
        <ThemedText type="small" style={{ color: theme.accent, fontWeight: '600' }}>
          repo
        </ThemedText>
      </Pressable>
    </ExternalLink>
  );
}

/** Minimal inline `code` rendering for the step text. */
function Inline({ text }: { text: string }) {
  const theme = useTheme();
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('`') && p.endsWith('`') ? (
          <ThemedText
            key={i}
            type="code"
            style={{ color: theme.text, backgroundColor: theme.backgroundSelected }}>
            {p.slice(1, -1)}
          </ThemedText>
        ) : (
          <ThemedText key={i} type="default" themeColor="textSecondary">
            {p}
          </ThemedText>
        )
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.two, paddingTop: Spacing.two },
  headline: { maxWidth: 600, marginTop: Spacing.one },
  lead: { maxWidth: 620 },
  cols: { gap: Spacing.five, width: '100%' },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  col: { flexDirection: 'column' },
  steps: { flex: 1.2, gap: Spacing.three, minWidth: 280 },
  step: { flexDirection: 'row', gap: Spacing.three, alignItems: 'flex-start' },
  num: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  stepText: { flex: 1 },
  card: {
    borderWidth: 1,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    gap: Spacing.three,
    width: '100%',
  },
  cardWide: { flex: 0.85, maxWidth: 380 },
  checks: { gap: Spacing.two },
  check: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  submitBtn: { alignSelf: 'stretch' },
  fine: {},
});
