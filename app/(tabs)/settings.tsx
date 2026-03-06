import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getSession } from "../../src/lib/auth";
import {
  getDefaultLocationSelection,
  getStoredLocationSelection,
  saveLocationSelection,
  sriLankaLocations,
} from "../../src/lib/sri-lanka-locations";
import { useLanguage } from "../../src/lib/language";

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
  const { t } = useLanguage();
  const [roleLabel, setRoleLabel] = useState("Guest");
  const [email, setEmail] = useState("Not signed in");
  const [selectedProvince, setSelectedProvince] = useState(
    getDefaultLocationSelection().province,
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    getDefaultLocationSelection().district,
  );

  const visibleDistricts = useMemo(() => {
    return (
      sriLankaLocations.find((item) => item.province === selectedProvince)
        ?.districts ?? []
    );
  }, [selectedProvince]);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const [session, storedLocation] = await Promise.all([
        getSession(),
        getStoredLocationSelection(),
      ]);

      if (!active || !session) {
        return;
      }

      setRoleLabel(
        session.user.role === "farmer" ? "Farmer account" : "Investor account",
      );
      setEmail(session.user.email);

      if (storedLocation) {
        setSelectedProvince(storedLocation.province);
        setSelectedDistrict(storedLocation.district);
      }
    };

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    const nextDistrict =
      sriLankaLocations.find((item) => item.province === province)?.districts[0]
        ?.district ?? "";
    setSelectedDistrict(nextDistrict);
  };

  const handleSaveLocation = async () => {
    await saveLocationSelection({
      province: selectedProvince,
      district: selectedDistrict,
    });

    Alert.alert(
      t("settings.locationSavedTitle"),
      t("settings.locationSavedMessage", {
        district: selectedDistrict,
        province: selectedProvince,
      }),
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t("settings.title")}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("settings.accountTitle")}</Text>
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
            <Text style={styles.rowLabel}>
              {t("settings.securityBaselineTitle")}
            </Text>
            <Text style={styles.rowValue}>
              {t("settings.securityBaselineMessage")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("settings.locationTitle")}</Text>
        <Text style={styles.helperText}>
          {t("settings.locationDescription")}
        </Text>

        <View style={styles.currentLocationCard}>
          <MaterialCommunityIcons
            name="map-marker-radius-outline"
            size={20}
            color={COLORS.primary}
          />
          <View style={styles.rowTextWrap}>
            <Text style={styles.rowLabel}>{t("settings.currentLocation")}</Text>
            <Text style={styles.rowValue}>
              {selectedDistrict}, {selectedProvince}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>{t("settings.province")}</Text>
        <View style={styles.chipWrap}>
          {sriLankaLocations.map((province) => {
            const active = province.province === selectedProvince;
            return (
              <TouchableOpacity
                key={province.province}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => handleProvinceChange(province.province)}
              >
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {province.province}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>{t("settings.district")}</Text>
        <View style={styles.chipWrap}>
          {visibleDistricts.map((district) => {
            const active = district.district === selectedDistrict;
            return (
              <TouchableOpacity
                key={district.district}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedDistrict(district.district)}
              >
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {district.district}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveLocation}
        >
          <MaterialCommunityIcons
            name="content-save-outline"
            size={18}
            color="#fff"
          />
          <Text style={styles.saveButtonText}>
            {t("settings.saveLocation")}
          </Text>
        </TouchableOpacity>
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
  helperText: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  currentLocationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.primaryPale,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  sectionLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 10,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },
  chipTextActive: {
    color: COLORS.white,
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
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },
});
