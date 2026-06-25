import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Page } from '@/components/page';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <Page>
        <View style={styles.wrap}>
          <ThemedText type="display">404</ThemedText>
          <ThemedText type="lead" themeColor="textSecondary">
            This stall is empty. The page you&apos;re after isn&apos;t in the square.
          </ThemedText>
          <Button label="Back to Agora" href="/" size="lg" />
        </View>
      </Page>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three, alignItems: 'flex-start', paddingVertical: Spacing.six },
});
