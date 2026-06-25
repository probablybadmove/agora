import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AgoraMark } from '@/components/agora-mark';
import { ExternalLink } from '@/components/external-link';
import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { MARKETPLACE } from '@/data/catalog';
import { useTheme } from '@/hooks/use-theme';

const GITHUB_URL = `https://github.com/${MARKETPLACE.repo}`;

export function SiteFooter() {
  const theme = useTheme();
  return (
    <View style={[styles.footer, { borderTopColor: theme.border }]}>
      <View style={styles.inner}>
        <View style={styles.brandCol}>
          <View style={styles.brandRow}>
            <AgoraMark size={20} color={theme.textSecondary} />
            <ThemedText type="heading" family="serif">
              Agora
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary" style={styles.tagline}>
            The public square for Claude Code plugins.
          </ThemedText>
        </View>

        <View style={styles.links}>
          <FooterLink href="/browse" label="Browse" />
          <FooterLink href="/submit" label="Submit" />
          <FooterLink href="/docs" label="Docs" />
          <ExternalLink href={GITHUB_URL} asChild>
            <Pressable accessibilityRole="link" style={styles.ext}>
              <Icon name="github" size={15} color={theme.textSecondary} />
              <ThemedText type="small" themeColor="textSecondary">
                GitHub
              </ThemedText>
            </Pressable>
          </ExternalLink>
          <ExternalLink href="https://gagansingh.tech" asChild>
            <Pressable accessibilityRole="link" style={styles.ext}>
              <ThemedText type="small" themeColor="textSecondary">
                gagansingh.tech
              </ThemedText>
              <Icon name="arrow-up-right" size={13} color={theme.textSecondary} />
            </Pressable>
          </ExternalLink>
        </View>
      </View>

      <View style={styles.innerBottom}>
        <ThemedText type="small" themeColor="textSecondary">
          © {YEAR} Agora · Built by Gagan Singh · MIT
        </ThemedText>
      </View>
    </View>
  );
}

const YEAR = 2026;

function FooterLink({ href, label }: { href: '/browse' | '/docs' | '/submit'; label: string }) {
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link">
        <ThemedText type="small" themeColor="textSecondary">
          {label}
        </ThemedText>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    marginTop: Spacing.six,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.three,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.four,
  },
  innerBottom: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    marginTop: Spacing.four,
  },
  brandCol: { gap: Spacing.two, maxWidth: 320 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  tagline: {},
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.four, alignItems: 'center' },
  ext: { flexDirection: 'row', alignItems: 'center', gap: 5 },
});
