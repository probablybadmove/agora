import { Link, type Href } from 'expo-router';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  label: string;
  href?: Href;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  style?: ViewStyle;
};

export function Button({
  label,
  href,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  style,
}: Props) {
  const theme = useTheme();
  const pad = size === 'lg' ? Spacing.three : size === 'sm' ? Spacing.two : 10;
  const padH = size === 'lg' ? Spacing.four : Spacing.three;

  const bg =
    variant === 'primary'
      ? theme.accent
      : variant === 'secondary'
        ? theme.backgroundElement
        : 'transparent';
  const fg = variant === 'primary' ? theme.accentText : theme.text;
  const border = variant === 'secondary' ? theme.border : 'transparent';

  const inner = (pressed: boolean) => (
    <View
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: variant === 'secondary' ? StyleSheet.hairlineWidth * 2 : 0,
          paddingVertical: pad,
          paddingHorizontal: padH,
          opacity: pressed ? 0.82 : 1,
        },
        style,
      ]}>
      {icon}
      <ThemedText
        type={size === 'sm' ? 'smallBold' : 'default'}
        style={[styles.label, { color: fg }]}>
        {label}
      </ThemedText>
      {iconRight}
    </View>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable accessibilityRole="link">{({ pressed }) => inner(pressed)}</Pressable>
      </Link>
    );
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {({ pressed }) => inner(pressed)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: Radius.pill,
  },
  label: { fontWeight: '600' },
});
