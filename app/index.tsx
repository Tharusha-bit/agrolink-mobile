import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getSession } from "../src/lib/auth";
import { useLanguage } from "../src/lib/language";

// ─── Design Tokens (Matching your new theme) ──────────────────────────────────
const COLORS = {
  primary: "#216000", // Deep Forest Green background
  primaryLight: "#2E8B00", // Lighter circle
  accent: "#76C442", // Accent circle
  white: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.8)", // Semi-transparent white
};

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const session = await getSession();

      setTimeout(() => {
        if (!active) {
          return;
        }

        if (session) {
          router.replace("/(tabs)/home");
          return;
        }

        router.replace("/login");
      }, 1800);
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── DECORATIVE BACKGROUND ── */}
      {/* These circles match the Login/Home header style */}
      <View style={s.decCircleLg} />
      <View style={s.decCircleSm} />

      {/* ── CENTER CONTENT ── */}
      <View style={s.content}>
        {/* White Badge for Logo */}
        <View style={s.logoBadge}>
          <Image
            source={require("../src/assets/logo.png")}
            style={s.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={s.appName}>AgroLink</Text>
        <Text style={s.tagline}>{t("common.tagline")}</Text>
      </View>

      {/* ── LOADER ── */}
      <View style={s.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.white} />
        <Text style={s.loadingText}>{t("splash.initializing")}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // Full Green Screen
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  /* Decorative Background Circles */
  decCircleLg: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: COLORS.primaryLight,
    top: -100,
    right: -100,
    opacity: 0.15,
  },
  decCircleSm: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.accent,
    bottom: -50,
    left: -50,
    opacity: 0.1,
  },

  content: {
    alignItems: "center",
    marginBottom: 60, // Push content up slightly
  },

  /* Logo Badge: Makes the logo pop on green background */
  logoBadge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  logo: {
    width: 90,
    height: 90,
  },

  appName: {
    fontSize: 42,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 15,
    color: COLORS.textMuted,
    fontWeight: "500",
    letterSpacing: 1.5,
    marginTop: 4,
  },

  /* Bottom Loader */
  loaderContainer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 10,
    fontWeight: "600",
  },
});
