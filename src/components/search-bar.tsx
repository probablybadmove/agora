import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search plugins…',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const theme = useTheme();
  return (
    <View
      style={[styles.wrap, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <ThemedText type="default" themeColor="textSecondary">
        🔍
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.input, { color: theme.text, fontFamily: Fonts.sans }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
    // remove web focus outline; RN web passes this through
    outlineStyle: 'none',
  } as object,
});
