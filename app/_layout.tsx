import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Hide text labels
        tabBarActiveTintColor: '#fff', // White when active
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)', // Faded white when inactive
        tabBarStyle: {
          backgroundColor: '#4CAF50', // Green primary color
          height: 65,
          position: 'absolute',
          bottom: 20, // Float from bottom
          left: 20,
          right: 20,
          borderRadius: 35, // Pill shape
          elevation: 5, // Shadow for Android
          shadowColor: '#000', // Shadow for iOS
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          borderTopWidth: 0, // Remove default border
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="invest"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="storefront" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-box-outline" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-circle-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}