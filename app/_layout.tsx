import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LanguageProvider } from "../src/lib/language";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="alerts" />
          <Stack.Screen name="profile/edit" />
          <Stack.Screen name="profile/security" />
          <Stack.Screen name="profile/investor profile" />
        </Stack>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
