import { StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search plugins',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Icon name="search" size={18} color={theme.textSecondary} />
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
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 2,
    outlineStyle: 'none',
  } as object,
});
