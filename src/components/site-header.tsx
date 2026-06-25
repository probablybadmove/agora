import { Link, usePathname } from 'expo-router';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AgoraMark } from '@/components/agora-mark';
import { Button } from '@/components/button';
import { ExternalLink } from '@/components/external-link';
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
          paddingTop: insets.top + Spacing.two,
        },
      ]}>
      <View style={styles.inner}>
        <Link href="/" asChild>
          <Pressable accessibilityRole="link" style={styles.brand}>
            <AgoraMark size={30} color={theme.accent} />
            <ThemedText type="heading" family="serif" style={styles.wordmark}>
              Agora
            </ThemedText>
            {!compact ? (
              <ThemedText type="eyebrow" themeColor="textSecondary" style={styles.brandTag}>
                marketplace
              </ThemedText>
            ) : null}
          </Pressable>
        </Link>

        <View style={styles.nav}>
          <NavLink href="/browse" label="Browse" />
          <NavLink href="/docs" label="Docs" />
          {!compact ? (
            <ExternalLink href={GITHUB_URL} asChild>
              <Pressable accessibilityRole="link">
                <ThemedText type="default" themeColor="textSecondary">
                  GitHub
                </ThemedText>
              </Pressable>
            </ExternalLink>
          ) : null}
          <Button label={compact ? 'Add' : 'Add to Claude Code'} href="/docs" size="sm" />
        </View>
      </View>
    </View>
  );
}

function NavLink({ href, label }: { href: '/browse' | '/docs'; label: string }) {
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
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    paddingBottom: Spacing.two,
    paddingHorizontal: Spacing.three,
    // keep header pinned on web while content scrolls
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
  brandTag: { marginLeft: 2, marginTop: 6 },
  nav: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
});
