import { Outfit_400Regular, Outfit_700Bold, useFonts } from '@expo-google-fonts/outfit';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { ProjectProvider } from '../src/context/ProjectContext'; // Global Data

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-Bold': Outfit_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ProjectProvider>
      <PaperProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* 1. Public Screens */}
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />

          {/* 2. Protected Tabs (The two worlds) */}
          <Stack.Screen name="(investor)" options={{ headerShown: false }} />
          <Stack.Screen name="(farmer)" options={{ headerShown: false }} />

          {/* 3. Global Sub-Screens (Stack on top of tabs) */}
          <Stack.Screen name="profile/edit" options={{ presentation: 'modal' }} />
          <Stack.Screen name="profile/security" />
          <Stack.Screen name="project/create" />
        </Stack>
      </PaperProvider>
    </ProjectProvider>
  );
}