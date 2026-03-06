import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../src/constants/Colors";
import { useLanguage } from "../../src/lib/language";

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const compact = width < 390;
  const bottomInset = Math.max(insets.bottom, 10);
  const iconCircleSize = compact ? 34 : 38;

  const renderCircleIcon = (
    name: keyof typeof MaterialCommunityIcons.glyphMap,
    color: string,
    focused: boolean,
  ) => (
    <View
      style={{
        width: iconCircleSize,
        height: iconCircleSize,
        borderRadius: iconCircleSize / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? Colors.white : "rgba(255,255,255,0.12)",
      }}
    >
      <MaterialCommunityIcons
        name={name}
        size={compact ? 18 : 20}
        color={color}
      />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "rgba(255,255,255,0.76)",
        tabBarActiveBackgroundColor: "transparent",
        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          bottom: bottomInset + 8,
          height: (compact ? 50 : 56) + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: compact ? 4 : 5,
          paddingHorizontal: compact ? 8 : 9,
          borderRadius: 9999,
          backgroundColor: "#245f10",
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.16)",
          elevation: 18,
          shadowColor: "#0f2505",
          shadowOffset: { width: 0, height: 14 },
          shadowOpacity: 0.28,
          shadowRadius: 24,
        },
        tabBarLabelStyle: {
          fontSize: compact ? 9 : 10,
          fontWeight: "800",
          marginTop: 0,
        },
        tabBarItemStyle: {
          borderRadius: 9999,
          marginHorizontal: 5,
          marginVertical: compact ? 4 : 5,
          minHeight: compact ? 36 : 40,
          paddingVertical: 1,
          maxWidth: compact ? 74 : 82,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, focused }) => (
            renderCircleIcon("home-variant", color, focused)
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t("tabs.dashboard"),
          tabBarIcon: ({ color, focused }) => (
            renderCircleIcon("chart-box-outline", color, focused)
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
          tabBarIcon: ({ color, focused }) => (
            renderCircleIcon("account-circle", color, focused)
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
