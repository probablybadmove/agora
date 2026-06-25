import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextType =
  | 'display' // big classical serif headline
  | 'title' // page/section serif title
  | 'heading' // smaller serif heading
  | 'subtitle'
  | 'lead' // intro paragraph
  | 'default'
  | 'small'
  | 'smallBold'
  | 'eyebrow' // uppercase, letter-spaced label
  | 'code';

type FontFamily = 'sans' | 'serif' | 'mono' | 'rounded';

export type ThemedTextProps = TextProps & {
  type?: TextType;
  family?: FontFamily;
  themeColor?: ThemeColor;
};

export function ThemedText({
  style,
  type = 'default',
  family,
  themeColor,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  const fam = family ?? defaultFamily[type];

  return (
    <Text
      style={[{ color: theme[themeColor ?? 'text'], fontFamily: Fonts[fam] }, styles[type], style]}
      {...rest}
    />
  );
}

const defaultFamily: Record<TextType, FontFamily> = {
  display: 'serif',
  title: 'serif',
  heading: 'serif',
  subtitle: 'sans',
  lead: 'sans',
  default: 'sans',
  small: 'sans',
  smallBold: 'sans',
  eyebrow: 'sans',
  code: 'mono',
};

const styles = StyleSheet.create({
  display: { fontSize: 52, lineHeight: 56, fontWeight: '600', letterSpacing: -0.5 },
  title: { fontSize: 34, lineHeight: 40, fontWeight: '600', letterSpacing: -0.3 },
  heading: { fontSize: 24, lineHeight: 30, fontWeight: '600' },
  subtitle: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
  lead: { fontSize: 18, lineHeight: 28, fontWeight: '400' },
  default: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  small: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  smallBold: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  code: { fontSize: 13, lineHeight: 20, fontWeight: '500' },
});
