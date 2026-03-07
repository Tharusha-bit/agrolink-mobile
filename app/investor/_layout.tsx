import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

const COLORS = { primary: '#216000' };

export default function InvestorLayout() {
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
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-variant" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-line" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-tie" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}