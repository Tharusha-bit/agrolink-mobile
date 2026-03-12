import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ProjectProvider } from '../src/context/ProjectContext'; 

export default function RootLayout() {
  return (
  <ProjectProvider>
    <Tabs
      screenOptions={{
        headerShown: true, 
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
  </ProjectProvider>

  
  );
}

