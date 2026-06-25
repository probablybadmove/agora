import { useMemo, useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { PluginCard } from '@/components/plugin-card';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { getCategories } from '@/data/catalog';
import type { Plugin } from '@/data/types';

const GAP = Spacing.three;

export function PluginGrid({ plugins }: { plugins: Plugin[] }) {
  const [width, setWidth] = useState(0);
  const categoryBySlug = useMemo(
    () => Object.fromEntries(getCategories().map((c) => [c.slug, c])),
    []
  );

  const cols = width >= 980 ? 3 : width >= 620 ? 2 : 1;
  const cardWidth = width > 0 ? (width - GAP * (cols - 1)) / cols : undefined;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  if (plugins.length === 0) {
    return (
      <View style={styles.empty} onLayout={onLayout}>
        <ThemedText type="default" themeColor="textSecondary">
          No plugins match your search — try a different term or category.
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.grid} onLayout={onLayout}>
      {plugins.map((p) => (
        <View key={p.slug} style={{ width: cardWidth ?? '100%' }}>
          <PluginCard plugin={p} category={categoryBySlug[p.category]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, width: '100%' },
  empty: { paddingVertical: Spacing.five, alignItems: 'center' },
});
