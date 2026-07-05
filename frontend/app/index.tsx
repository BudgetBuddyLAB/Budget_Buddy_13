import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useStore } from '@/src/store/budgetStore';
import { colors } from '@/src/theme';

/**
 * Boot screen: decides where to send the user based on persisted state.
 */
export default function Index() {
  const { ready, user } = useStore();

  useEffect(() => {}, [ready]);

  if (!ready) {
    return (
      <View style={styles.container} testID="boot-loader">
        <ActivityIndicator size="large" color={colors.brandPrimary} />
      </View>
    );
  }

  if (!user.onboarded) return <Redirect href="/onboarding" />;
  if (!user.email && !user.isGuest) return <Redirect href="/login" />;
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
});
