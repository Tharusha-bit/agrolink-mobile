import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, StatusBar } from "react-native";
import { useRouter } from "expo-router";

export default function LoadingScreen() {
  const router = useRouter();
  useEffect(() => {
    // Simulate loading, then go to login
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#216000" />
      <ActivityIndicator size="large" color="#216000" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9F4",
  },
});
