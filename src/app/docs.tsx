import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Markdown } from '@/components/markdown';
import { Page } from '@/components/page';
import { Section } from '@/components/section';
import { Seo } from '@/components/seo';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { COPY } from '@/data/copy';
import { useTheme } from '@/hooks/use-theme';

export default function DocsScreen() {
  return (
    <Page maxWidth={860}>
      <Seo
        title="Docs"
        description="Add the Agora marketplace to Claude Code, install plugins, and publish your own."
        path="/docs"
      />
      <Section label="Documentation" title="Add Agora to Claude Code">
        <Markdown content={stripLeadingHeading(COPY.addToClaudeMarkdown)} />
      </Section>

      <Section title="List your plugin">
        <Markdown content={stripLeadingHeading(COPY.publishGuideMarkdown)} />
        <View style={styles.docCta}>
          <Button label="Submit a plugin" href="/submit" />
        </View>
      </Section>

      <Section title="About Agora">
        <Markdown content={stripLeadingHeading(COPY.aboutMarkdown)} />
      </Section>

      <Section label="Questions" title="FAQ">
        <View style={styles.faq}>
          {COPY.faq.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </View>
      </Section>
    </Page>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const theme = useTheme();
  return (
    <View
      style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <ThemedText type="subtitle" family="serif">
        {q}
      </ThemedText>
      <ThemedText type="default" themeColor="textSecondary" style={styles.answer}>
        {a}
      </ThemedText>
    </View>
  );
}

/** The section already supplies the title, so drop the markdown's own leading `##` heading. */
function stripLeadingHeading(md: string): string {
  return md.replace(/^\s*#{1,3}\s+.*\n+/, '');
}

const styles = StyleSheet.create({
  docCta: { flexDirection: 'row', marginTop: Spacing.one },
  faq: { gap: Spacing.three, width: '100%' },
  card: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  answer: { maxWidth: 720 },
});
