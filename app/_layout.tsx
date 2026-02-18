import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* This defines the screens. 'index' is the first screen (Login) */}
        <Stack.Screen name="index" /> 
        <Stack.Screen name="home" />
      </Stack>
    </PaperProvider>
  );
}