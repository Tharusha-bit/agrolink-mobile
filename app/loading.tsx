import React, { useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { useLanguage } from "../src/lib/language";

export default function LoadingScreen() {
  const router = useRouter();
  const { t } = useLanguage();
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
      <Text style={styles.text}>{t("splash.loading")}</Text>
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
  text: {
    marginTop: 12,
    color: "#216000",
    fontSize: 14,
    fontWeight: "600",
  },
});
