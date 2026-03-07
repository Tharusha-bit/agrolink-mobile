import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

const COLORS = { primary: '#216000' };

export default function FarmerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          height: 65,
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 35,
          elevation: 10,
          borderTopWidth: 0,
        },
      }}
    >
      {/* 1. FIXED: Changed "home" to "farmerhome" to match your actual file name */}
      <Tabs.Screen
        name="farmerhome" 
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="tractor" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="projects" 
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="sprout" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile" 
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-circle" size={28} color={color} />,
        }}
      />

      {/* 2. FIXED: Hide non-tab screens from the bottom tab bar */}
      <Tabs.Screen
        name="trust"
        options={{
          href: null, // This prevents a blank tab from appearing
        }}
      />
      <Tabs.Screen
        name="project-manage"
        options={{
          href: null, // Hides the folder containing [id].tsx from the tab bar
        }}
      />
    </Tabs>
  );
}