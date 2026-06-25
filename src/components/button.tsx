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
  const padV = size === 'lg' ? 13 : size === 'sm' ? 7 : 10;
  const padH = size === 'lg' ? Spacing.four : size === 'sm' ? Spacing.three : Spacing.three;

  const bg =
    variant === 'primary' ? theme.text : variant === 'secondary' ? 'transparent' : 'transparent';
  const fg = variant === 'primary' ? theme.background : theme.text;
  const border = variant === 'secondary' ? theme.borderStrong : 'transparent';

  const inner = (pressed: boolean, hovered?: boolean) => (
    <View
      style={[
        styles.base,
        {
          backgroundColor: variant === 'ghost' && hovered ? theme.backgroundElement : bg,
          borderColor: variant === 'secondary' && hovered ? theme.text : border,
          borderWidth: variant === 'secondary' ? 1 : 0,
          paddingVertical: padV,
          paddingHorizontal: padH,
          opacity: pressed ? 0.78 : 1,
        },
        style,
      ]}>
      {icon}
      <ThemedText type={size === 'sm' ? 'smallBold' : 'default'} style={[styles.label, { color: fg }]}>
        {label}
      </ThemedText>
      {iconRight}
    </View>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable accessibilityRole="link">
          {({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => inner(pressed, hovered)}
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => inner(pressed, hovered)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: Radius.md,
  },
  label: { fontWeight: '600' },
});
