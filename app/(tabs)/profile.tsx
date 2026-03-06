import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider, Text } from "react-native-paper";
import { Colors } from "../../src/constants/Colors";
import { clearSession, getSession } from "../../src/lib/auth";
import {
  authenticateWithBiometrics,
  getBiometricSupport,
  isBiometricUnlockEnabled,
  setBiometricUnlockEnabled,
} from "../../src/lib/biometrics";
import { AppLanguage, useLanguage } from "../../src/lib/language";

// Define the type for the props to avoid TypeScript warnings (Optional but good practice)
interface ProfileOptionProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  isDestructive?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [profileName, setProfileName] = useState("AgroLink User");
  const [profileRole, setProfileRole] = useState<"farmer" | "investor">(
    "farmer",
  );
  const [profileId, setProfileId] = useState("AL-0000");
  const [refreshing, setRefreshing] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState("Biometric unlock");
  const [biometricLoading, setBiometricLoading] = useState(true);

  const loadSession = useCallback(async (active = true) => {
    const [session, biometricPreference, biometricSupport] = await Promise.all([
      getSession(),
      isBiometricUnlockEnabled(),
      getBiometricSupport().catch(() => ({
        available: false,
        enrolled: false,
        label: "Biometric unlock",
      })),
    ]);

    if (!active || !session) {
      return;
    }

    setProfileName(session.user.name);
    setProfileRole(session.user.role);
    setProfileId(
      session.user.role === "farmer" ? "FM-20321212" : "IV-88421019",
    );
    setBiometricEnabled(biometricPreference);
    setBiometricAvailable(biometricSupport.available);
    setBiometricLabel(biometricSupport.label);
    setBiometricLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    loadSession();

    return () => {
      active = false;
    };
  }, [loadSession]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadSession(true);
    } finally {
      setRefreshing(false);
    }
  }, [loadSession]);

  const handleLogout = async () => {
    await clearSession();
    router.replace("/login");
  };

  const handleBiometricToggle = async (nextValue: boolean) => {
    if (!nextValue) {
      await setBiometricUnlockEnabled(false);
      setBiometricEnabled(false);
      Alert.alert(
        t("profile.quickUnlockDisabledTitle"),
        t("profile.quickUnlockDisabledMessage"),
      );
      return;
    }

    if (!biometricAvailable) {
      Alert.alert(
        t("profile.quickUnlockFailedTitle"),
        t("profile.quickUnlockUnavailable"),
      );
      return;
    }

    const result = await authenticateWithBiometrics(
      t("profile.quickUnlockTitle"),
    );
    if (!result.success) {
      Alert.alert(
        t("profile.quickUnlockFailedTitle"),
        t("profile.quickUnlockFailedMessage"),
      );
      return;
    }

    await setBiometricUnlockEnabled(true);
    setBiometricEnabled(true);
    Alert.alert(
      t("profile.quickUnlockEnabledTitle"),
      t("profile.quickUnlockEnabledMessage"),
    );
  };

  // Reusable Option Component
  const ProfileOption = ({
    icon,
    label,
    onPress,
    isDestructive = false,
  }: ProfileOptionProps) => (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <View
        style={[
          styles.iconBox,
          { backgroundColor: isDestructive ? "#FFEBEE" : "#E8F5E9" },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={isDestructive ? "#D32F2F" : Colors.primary}
        />
      </View>
      <Text style={[styles.optionLabel, isDestructive && { color: "#D32F2F" }]}>
        {label}
      </Text>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
          progressBackgroundColor="#fff"
        />
      }
    >
      {/* 1. Profile Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{t("profile.myProfile")}</Text>
          <View style={styles.headerLanguageChip}>
            <MaterialCommunityIcons name="translate" size={14} color="#fff" />
            <Text style={styles.headerLanguageText}>
              {language === "en"
                ? t("common.english")
                : language === "si"
                  ? t("common.sinhala")
                  : t("common.tamil")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            style={styles.avatar}
          />
          <View style={styles.cameraBtn}>
            <MaterialCommunityIcons name="camera" size={16} color="#fff" />
          </View>
        </View>
        <Text style={styles.name}>{profileName}</Text>
        <Text style={styles.role}>
          {profileRole === "farmer"
            ? t("profile.roleFarmer")
            : t("profile.roleInvestor")}{" "}
          | ID: {profileId}
        </Text>

        {/* Profile Strength */}
        <View style={styles.strengthContainer}>
          <Text style={styles.strengthLabel}>
            {t("profile.profileStrength", { percent: 40 })}
          </Text>
          <View style={styles.strengthBarBg}>
            <View style={[styles.strengthBarFill, { width: "40%" }]} />
          </View>
          <Text style={styles.strengthHint}>
            {t("profile.completeProfile")}
          </Text>
        </View>
      </View>

      {/* 2. Menu Options */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionHeader}>{t("profile.accountSettings")}</Text>

        {/* ✅ FIXED: Linked to 'app/profile/edit.tsx' */}
        <ProfileOption
          icon="account-edit"
          label={t("profile.editPersonalDetails")}
          onPress={() => router.push("/profile/edit")}
        />

        {/* ✅ FIXED: Linked to 'app/profile/security.tsx' */}
        <ProfileOption
          icon="shield-lock"
          label={t("profile.securityPassword")}
          onPress={() => router.push("/profile/security")}
        />

        <ProfileOption
          icon="bank"
          label={t("profile.paymentMethods")}
          onPress={() =>
            Alert.alert(
              t("profile.paymentMethodsTitle"),
              t("profile.paymentMethodsMessage"),
            )
          }
        />

        <ProfileOption
          icon="bell-ring-outline"
          label={t("profile.alertsCenter")}
          onPress={() => router.push("/alerts")}
        />

        <Text style={styles.sectionHeader}>{t("profile.languageTitle")}</Text>
        <View style={styles.languageCard}>
          <Text style={styles.languageDescription}>
            {t("profile.languageDescription")}
          </Text>
          <View style={styles.languageRow}>
            {(
              [
                { key: "en", label: t("common.english") },
                { key: "si", label: t("common.sinhala") },
                { key: "ta", label: t("common.tamil") },
              ] as Array<{ key: AppLanguage; label: string }>
            ).map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.languageChip,
                  language === item.key && styles.languageChipActive,
                ]}
                onPress={() => setLanguage(item.key)}
              >
                <Text
                  style={[
                    styles.languageChipText,
                    language === item.key && styles.languageChipTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionHeader}>
          {t("profile.profileStrengthTitle")}
        </Text>
        <View style={styles.biometricCard}>
          <View style={styles.biometricHeaderRow}>
            <View style={styles.biometricCopyWrap}>
              <Text style={styles.biometricTitle}>
                {t("profile.quickUnlockTitle")}
              </Text>
              <Text style={styles.biometricDescription}>
                {t("profile.quickUnlockDescription")}
              </Text>
              <Text style={styles.biometricMeta}>
                {biometricAvailable
                  ? biometricLabel
                  : t("profile.quickUnlockUnavailable")}
              </Text>
            </View>
            {biometricLoading ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
              <Switch
                value={biometricEnabled}
                onValueChange={handleBiometricToggle}
                thumbColor="#fff"
                trackColor={{ false: "#C8D7BF", true: Colors.primary }}
              />
            )}
          </View>
        </View>

        <Text style={styles.sectionHeader}>{t("profile.support")}</Text>
        <ProfileOption
          icon="help-circle"
          label={t("profile.helpSupport")}
          onPress={() =>
            Alert.alert(
              t("profile.helpSupportTitle"),
              t("profile.helpSupportMessage"),
            )
          }
        />
        <ProfileOption
          icon="file-document"
          label={t("profile.termsConditions")}
          onPress={() =>
            Alert.alert(t("profile.termsTitle"), t("profile.termsMessage"))
          }
        />

        <Divider style={{ marginVertical: 20 }} />

        {/* ✅ FIXED: Logout goes back to Login Screen */}
        <ProfileOption
          icon="logout"
          label={t("profile.logout")}
          onPress={handleLogout}
          isDestructive
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  contentContainer: { paddingBottom: 120 },
  header: {
    backgroundColor: Colors.primary,
    height: 150,
    padding: 20,
    alignItems: "center",
  },
  headerRow: {
    marginTop: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerLanguageChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerLanguageText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -50,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 4,
  },
  avatarContainer: { position: "relative" },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 20,
  },

  name: { fontSize: 22, fontWeight: "bold", marginTop: 10, color: "#333" },
  role: { fontSize: 14, color: "gray", marginBottom: 15 },

  strengthContainer: { width: "100%", marginTop: 10 },
  strengthLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 5,
  },
  strengthBarBg: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    width: "100%",
  },
  strengthBarFill: { height: 8, backgroundColor: "#66BB6A", borderRadius: 4 },
  strengthHint: {
    fontSize: 11,
    color: "#D32F2F",
    marginTop: 5,
    textAlign: "center",
  },

  menuContainer: { padding: 20 },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
  },
  languageCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
  },
  languageDescription: {
    fontSize: 12,
    color: "gray",
    lineHeight: 18,
    marginBottom: 12,
  },
  languageRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  languageChip: {
    backgroundColor: "#E8F5E9",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  languageChipActive: {
    backgroundColor: Colors.primary,
  },
  languageChipText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  languageChipTextActive: {
    color: "#fff",
  },
  biometricCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
  },
  biometricHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  biometricCopyWrap: {
    flex: 1,
  },
  biometricTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#223018",
    marginBottom: 6,
  },
  biometricDescription: {
    fontSize: 12,
    color: "gray",
    lineHeight: 18,
    marginBottom: 6,
  },
  biometricMeta: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: "700",
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionLabel: {
    flex: 1,
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
