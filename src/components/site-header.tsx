import { Link, usePathname } from 'expo-router';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddToClaude } from '@/components/add-to-claude';
import { AgoraMark } from '@/components/agora-mark';
import { ExternalLink } from '@/components/external-link';
import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { MARKETPLACE } from '@/data/catalog';
import { useTheme } from '@/hooks/use-theme';

const GITHUB_URL = `https://github.com/${MARKETPLACE.repo}`;

export function SiteHeader() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const compact = width < 760;

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
          paddingTop: insets.top + 10,
        },
      ]}>
      <View style={styles.inner}>
        <Link href="/" asChild>
          <Pressable accessibilityRole="link" style={styles.brand}>
            <AgoraMark size={26} color={theme.accent} />
            <ThemedText type="heading" family="serif" style={styles.wordmark}>
              Agora
            </ThemedText>
            {!compact ? (
              <View style={[styles.divider, { backgroundColor: theme.borderStrong }]} />
            ) : null}
            {!compact ? (
              <ThemedText type="eyebrow" themeColor="textSecondary">
                marketplace
              </ThemedText>
            ) : null}
          </Pressable>
        </Link>

        <View style={styles.nav}>
          <NavLink href="/browse" label="Browse" />
          {!compact ? <NavLink href="/submit" label="Submit" /> : null}
          <NavLink href="/docs" label="Docs" />
          <ExternalLink href={GITHUB_URL} asChild>
            <Pressable accessibilityRole="link" style={styles.iconLink} aria-label="GitHub">
              <Icon name="github" size={19} color={theme.textSecondary} />
            </Pressable>
          </ExternalLink>
          <AddToClaude size="sm" compact={compact} />
        </View>
      </View>
    </View>
  );
}

function NavLink({ href, label }: { href: '/browse' | '/docs' | '/submit'; label: string }) {
  const theme = useTheme();
  const pathname = usePathname();
  const active = pathname.startsWith(href);
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link">
        {({ hovered }: { pressed: boolean; hovered?: boolean }) => (
          <ThemedText
            type="default"
            style={{
              color: active || hovered ? theme.text : theme.textSecondary,
              fontWeight: active ? '600' : '400',
            }}>
            {label}
          </ThemedText>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: Spacing.three,
    position: 'sticky',
    top: 0,
    zIndex: 50,
  } as object,
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  wordmark: { letterSpacing: 0.2 },
  divider: { width: 1, height: 16, marginHorizontal: 2 },
  nav: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  iconLink: { padding: 2 },
});
