import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useWindowDimensions } from "react-native";
import { Colors } from "../../src/constants/Colors";
import { useLanguage } from "../../src/lib/language";

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const { t } = useLanguage();
  const compact = width < 390;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: "rgba(255,255,255,0.7)",
        tabBarStyle: {
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 14,
          height: compact ? 64 : 70,
          paddingBottom: compact ? 10 : 12,
          paddingTop: compact ? 10 : 12,
          borderRadius: 999,
          backgroundColor: Colors.primary,
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarLabelStyle: { fontSize: compact ? 10 : 12, fontWeight: "700" },
        tabBarItemStyle: { borderRadius: 999 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("tabs.home"),
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
          title: t("tabs.dashboard"),
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
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
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
