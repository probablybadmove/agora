import { Link } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { MARKETPLACE } from '@/data/catalog';
import { useTheme } from '@/hooks/use-theme';

const COMMAND = `/plugin marketplace add ${MARKETPLACE.repo}`;

/**
 * Claude Code has no web deep link to add a marketplace (tracked upstream but unimplemented),
 * so the honest "Add to Claude Code" action is: copy the exact command, then tell the user to
 * paste it. On web it copies + confirms; on native (no clipboard) it links to the docs.
 */
export function AddToClaude({
  size = 'md',
  compact = false,
}: {
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const padV = size === 'lg' ? 13 : size === 'sm' ? 7 : 10;
  const padH = size === 'lg' ? Spacing.four : Spacing.three;

  const idleLabel = compact ? 'Add' : 'Add to Claude Code';
  const doneLabel = compact ? 'Copied' : 'Copied — paste in Claude Code';

  const body = (pressed: boolean, done: boolean) => (
    <View
      style={[
        styles.btn,
        {
          backgroundColor: theme.text,
          paddingVertical: padV,
          paddingHorizontal: padH,
          opacity: pressed ? 0.8 : 1,
        },
      ]}>
      <Icon
        name={done ? 'check' : 'terminal'}
        size={size === 'sm' ? 14 : 16}
        color={theme.background}
      />
      <ThemedText
        type={size === 'sm' ? 'smallBold' : 'default'}
        style={[styles.label, { color: theme.background }]}>
        {done ? doneLabel : idleLabel}
      </ThemedText>
    </View>
  );

  // Native: no clipboard — point at the install docs instead.
  if (Platform.OS !== 'web') {
    return (
      <Link href="/docs" asChild>
        <Pressable accessibilityRole="link">{({ pressed }) => body(pressed, false)}</Pressable>
      </Link>
    );
  }

  const onPress = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(COMMAND).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2600);
      });
    }
  };

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {({ pressed }: { pressed: boolean }) => body(pressed, copied)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: Radius.md,
  },
  label: { fontWeight: '600' },
});
