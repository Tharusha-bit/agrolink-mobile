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
      {/* ─── 1. VISIBLE TABS (The 3 Main Icons) ─── */}
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

      {/* ─── 2. HIDDEN SUB-PAGES ─── */}
      <Tabs.Screen
        name="trust"
        options={{
          href: null, // ✅ Correct Expo way to hide the tab button
          tabBarStyle: { display: 'none' }, // ✅ Hides the background bar when screen is open
        }}
      />
      <Tabs.Screen
        name="project-manage"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="project-edit"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}