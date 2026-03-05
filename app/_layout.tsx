<<<<<<< Updated upstream
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
=======
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Hide text labels like the design
        tabBarActiveTintColor: '#fff', // White icons when active
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)', // Faded white when inactive
        tabBarStyle: {
          backgroundColor: '#4CAF50', // The Green Color
          height: 65,
          position: 'absolute',
          bottom: 20, // Float from bottom
          left: 20,
          right: 20,
          borderRadius: 35, // Pill shape
          elevation: 5, // Shadow
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="storefront" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard" // Placeholder for the 3rd icon
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-box-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="information" size={28} color={color} />,
        }}
      />
    </Tabs>
>>>>>>> Stashed changes
  );
}