import { type ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Shared page chrome: a pinned header, a scrolling body capped to a readable max width,
 * and the footer. Used by every screen so navigation and spacing stay consistent.
 */
export function Page({ children, maxWidth = MaxContentWidth }: { children: ReactNode; maxWidth?: number }) {
  const theme = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SiteHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}>
        <View style={[styles.content, { maxWidth }]}>{children}</View>
        <SiteFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.five,
    gap: Spacing.six,
  },
});
