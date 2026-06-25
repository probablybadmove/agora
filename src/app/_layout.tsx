import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

// Light-only.
export default function RootLayout() {
  const colors = Colors.light;
  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'fade',
          }}
        />
        <StatusBar style="dark" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
