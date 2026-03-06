import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getSession } from "../../src/lib/auth";

const COLORS = {
  primary: "#216000",
  primaryPale: "#E8F5E1",
  white: "#FFFFFF",
  surface: "#F7F9F4",
  text: "#1A2E0D",
  textMuted: "#6D8660",
  border: "#DDE8D4",
  danger: "#D32F2F",
};

export default function SettingsScreen() {
  const [roleLabel, setRoleLabel] = useState("Guest");
  const [email, setEmail] = useState("Not signed in");

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const session = await getSession();
      if (!active || !session) {
        return;
      }

      setRoleLabel(
        session.user.role === "farmer" ? "Farmer account" : "Investor account",
      );
      setEmail(session.user.email);
    };

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="account-badge"
            size={20}
            color={COLORS.primary}
          />
          <View style={styles.rowTextWrap}>
            <Text style={styles.rowLabel}>{roleLabel}</Text>
            <Text style={styles.rowValue}>{email}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={20}
            color={COLORS.primary}
          />
          <View style={styles.rowTextWrap}>
            <Text style={styles.rowLabel}>Security baseline</Text>
            <Text style={styles.rowValue}>
              Role-based session, local persistence, and backend-ready auth flow
              enabled.
            </Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 20, paddingBottom: 120 },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 18,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  rowTextWrap: { flex: 1 },
  rowLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  rowValue: { color: COLORS.textMuted, fontSize: 12, lineHeight: 18 },
});
