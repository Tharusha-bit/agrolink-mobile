import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useWindowDimensions } from "react-native";
import { Colors } from "../../src/constants/Colors";

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const compact = width < 390;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary, // Deep Green
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: compact ? 60 : 65,
          paddingBottom: compact ? 8 : 10,
          paddingTop: compact ? 8 : 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "#fff",
          elevation: 10, // Shadow
        },
        tabBarLabelStyle: { fontSize: compact ? 10 : 12, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home-variant"
              size={compact ? 24 : 28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="chart-box-outline"
              size={compact ? 24 : 28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="cog-outline"
              size={compact ? 24 : 28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-circle"
              size={compact ? 24 : 28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Investorprofilehubscreen"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
