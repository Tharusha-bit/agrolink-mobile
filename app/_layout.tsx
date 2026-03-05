import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />  {/* Splash */}
        <Stack.Screen name="login" />  {/* Login - MAKE SURE THIS LINE EXISTS */}
        <Stack.Screen name="signup" /> {/* Signup */}
        <Stack.Screen name="(tabs)" /> {/* Home/Dashboard */}
      </Stack>
    </PaperProvider>
  );
}