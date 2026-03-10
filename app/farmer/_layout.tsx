import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

const COLORS = { primary: "#216000" };

// ─── 1. OUR CUSTOM TAB BAR ────────────────────────────────────────────────────
// This completely overrides Expo's default bar. It gives us 100% control over the UI.
function FarmerTabBar({ state, descriptors, navigation }: any) {
  // Hide the bar entirely if we are on a sub-page (like 'trust' or 'edit-profile')
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarStyle?.display === "none") {
    return null;
  }

  return (
    <View style={s.tabBarWrap}>
      {state.routes.map((route: any, index: number) => {
        // 🚨 THE MAGIC BULLET: If the file isn't one of these 3, DO NOT render a button!
        if (!["farmerhome", "projects", "profile"].includes(route.name)) {
          return null;
        }

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Assign icons based on the route name
        let iconName = "help";
        if (route.name === "farmerhome") iconName = "tractor";
        else if (route.name === "projects") iconName = "sprout";
        else if (route.name === "profile") iconName = "account-circle";

        return (
          <TouchableOpacity
            key={route.name}
            activeOpacity={0.8}
            onPress={onPress}
            style={s.tabItem}
          >
            <MaterialCommunityIcons
              name={iconName as any}
              size={30}
              color={isFocused ? "#ffffff" : "rgba(255,255,255,0.4)"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── 2. MAIN LAYOUT ──────────────────────────────────────────────────────────
export default function FarmerLayout() {
  return (
    <Tabs
      // Tell Expo Router to use OUR custom bar instead of theirs
      tabBar={(props) => <FarmerTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* ─── VISIBLE TABS ─── */}
      <Tabs.Screen name="farmerhome" />
      <Tabs.Screen name="projects" />
      <Tabs.Screen name="profile" />

      {/* ─── HIDDEN SUB-PAGES ─── */}
      {/* We only need to pass { display: 'none' } so our custom bar knows to hide itself when these are open */}
      <Tabs.Screen
        name="trust"
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="project-manage"
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen name="chat" options={{ tabBarStyle: { display: "none" } }} />
      <Tabs.Screen
        name="analytics"
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="project-edit"
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{ tabBarStyle: { display: "none" } }}
      />
    </Tabs>
  );
}

// ─── 3. STYLES ───────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  tabBarWrap: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    height: 65,
    position: "absolute",
    bottom: Platform.OS === "android" ? 40 : 30,
    left: 20,
    right: 20,
    borderRadius: 35,
    paddingHorizontal: 20, // Pushes the outer icons inward slightly
    alignItems: "center",
    justifyContent: "space-between", // Spreads the 3 icons out evenly (left, center, right)
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});
