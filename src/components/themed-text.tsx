import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextType =
  | 'display' // serif headline
  | 'title' // serif section/page title
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
  display: { fontSize: 42, lineHeight: 47, fontWeight: '500', letterSpacing: -0.4 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '500', letterSpacing: -0.2 },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '500' },
  subtitle: { fontSize: 18, lineHeight: 26, fontWeight: '600' },
  lead: { fontSize: 17, lineHeight: 27, fontWeight: '400' },
  default: { fontSize: 16, lineHeight: 25, fontWeight: '400' },
  small: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  smallBold: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  eyebrow: {
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  code: { fontSize: 13.5, lineHeight: 20, fontWeight: '500' },
});
