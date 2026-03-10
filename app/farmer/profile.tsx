import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { ComponentProps, useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─────────────────────────────────────────────────────────────────────────────
// ✅ CLOUDINARY CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME = "dhnl8fkno";
const CLOUDINARY_UPLOAD_PRESET = "paddy_preset";

type MCIcon = ComponentProps<typeof MaterialCommunityIcons>["name"];
type IonIcon = ComponentProps<typeof Ionicons>["name"];

const T = {
  forest: "#1B5E20",
  deep: "#2E7D32",
  mid: "#388E3C",
  leaf: "#4CAF50",
  accent: "#66BB6A",
  accentLight: "#A5D6A7",
  pale: "#E8F5E9",
  paler: "#F4F8F2",
  white: "#FFFFFF",
  ink: "#1C2B1A",
  inkSub: "#3E5239",
  inkMuted: "#8EA882",
  border: "#D8EAD4",
  divider: "#EBF4E8",
  gold: "#F59E0B",
  goldLight: "#FEF3C7",
  red: "#EF5350",
  redPale: "#FFEBEE",
  blue: "#1976D2",
  bluePale: "#E3F2FD",
};

const SH = {
  xs: Platform.select({
    ios: {
      shadowColor: "#1B5E20",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
  }),
  sm: Platform.select({
    ios: {
      shadowColor: "#1B5E20",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.09,
      shadowRadius: 7,
    },
    android: { elevation: 3 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#1B5E20",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
  }),
};

interface SettingsItem {
  icon: MCIcon;
  label: string;
  route?: string;
  danger?: boolean;
  badge?: string;
}
const SETTINGS_GROUPS = [
  {
    title: "MY ACCOUNT",
    items: [
      {
        icon: "account-edit-outline" as MCIcon,
        label: "Edit Personal Details",
        route: "/farmer/edit-profile",
      },
      {
        icon: "shield-lock-outline" as MCIcon,
        label: "Security & Password",
        route: "/profile/security",
      },
      {
        icon: "bell-outline" as MCIcon,
        label: "Notification Preferences",
        route: "/profile/notifications",
      },
    ],
  },
  {
    title: "FARM & VERIFICATION",
    items: [
      {
        icon: "file-document-outline" as MCIcon,
        label: "My Documents",
        route: "/profile/documents",
      },
      {
        icon: "star-outline" as MCIcon,
        label: "Trust Score Details",
        route: "/farmer/trust",
      },
      {
        icon: "bank-outline" as MCIcon,
        label: "Payment Account",
        route: "/profile/payment",
      },
    ],
  },
  {
    title: "SUPPORT",
    items: [
      {
        icon: "help-circle-outline" as MCIcon,
        label: "Help & Support",
        route: "/profile/support",
      },
      {
        icon: "information-outline" as MCIcon,
        label: "About AgroLink",
        route: "/profile/about",
      },
      { icon: "logout" as MCIcon, label: "Log Out", danger: true },
    ],
  },
];

function getReputation(score: number) {
  if (score >= 71)
    return {
      level: "Gold",
      icon: "shield-check" as MCIcon,
      color: T.gold,
      bg: T.goldLight,
    };
  if (score >= 41)
    return {
      level: "Silver",
      icon: "shield-half-full" as MCIcon,
      color: "#9E9E9E",
      bg: "#F5F5F5",
    };
  return {
    level: "Bronze",
    icon: "shield-outline" as MCIcon,
    color: "#795548",
    bg: "#EFEBE9",
  };
}

function SettingsRow({
  item,
  isLast,
  onPress,
}: {
  item: SettingsItem;
  isLast: boolean;
  onPress: () => void;
}) {
  return (
    <>
      <TouchableOpacity
        style={s.menuItem}
        onPress={onPress}
        activeOpacity={0.72}
      >
        <View
          style={[s.menuIconBox, item.danger && { backgroundColor: T.redPale }]}
        >
          <MaterialCommunityIcons
            name={item.icon}
            size={20}
            color={item.danger ? T.red : T.deep}
          />
        </View>
        <Text style={[s.menuLabel, item.danger && { color: T.red }]}>
          {item.label}
        </Text>
        {item.badge && (
          <View style={s.menuBadge}>
            <Text style={s.menuBadgeText}>{item.badge}</Text>
          </View>
        )}
        {!item.danger && (
          <MaterialCommunityIcons
            name={"chevron-right" as MCIcon}
            size={18}
            color={T.inkMuted}
          />
        )}
      </TouchableOpacity>
      {!isLast && <View style={s.menuDivider} />}
    </>
  );
}

export default function FarmerProfileScreen() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("Farmer");
  const [lastName, setLastName] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState("Member since Mar 2026");

  // ✅ Directly maps to DB profileStrength
  const [trustScore, setTrustScore] = useState(20);

  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadUserData = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      const localFName = (await AsyncStorage.getItem("firstName")) || "Farmer";

      setUserId(id);
      setFirstName(localFName);

      if (id) {
        // ⚠️ UPDATE THIS IP TO YOUR LAPTOP'S WI-FI IP
        const API_URL = "http://172.20.10.6:8080";
        const res = await axios.get(`${API_URL}/api/users/${id}`);

        if (res.data) {
          setFirstName(res.data.firstName || localFName);
          setLastName(res.data.lastName || "");
          setIsVerified(res.data.isVerified === true);

          // ✅ Strict synchronization with DB value
          if (res.data.profileStrength !== undefined) {
            setTrustScore(res.data.profileStrength);
          }

          if (res.data.profileImageUrl) {
            setProfileImage(res.data.profileImageUrl);
          }

          if (res.data.createdAt) {
            const date = new Date(res.data.createdAt);
            const monthNames = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            setMemberSince(
              `Member since ${monthNames[date.getMonth()]} ${date.getFullYear()}`,
            );
          }
        }
      }
    } catch (e) {
      console.log("Could not fetch user from DB. Using local storage data.", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, []),
  );

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permissions to update your profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0].uri) {
      setUploadingImage(true);
      try {
        const fileData = {
          uri:
            Platform.OS === "ios"
              ? result.assets[0].uri.replace("file://", "")
              : result.assets[0].uri,
          type: "image/jpeg",
          name: `profile_${Date.now()}.jpg`,
        };

        const formData = new FormData();
        formData.append("file", fileData as any);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const cloudRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        if (cloudRes.data.secure_url) {
          const newUrl = cloudRes.data.secure_url;
          setProfileImage(newUrl);

          if (userId) {
            await axios.put(
              `http://172.20.10.6:8080/api/users/${userId}/profile-image`,
              {
                imageUrl: newUrl,
              },
            );
            // ✅ Instantly reflect the +10 boost in the UI until the next fetch
            setTrustScore((prev) => (prev < 100 ? prev + 10 : 100));
          }

          Alert.alert("Success", "Profile picture updated!");
        }
      } catch (err) {
        console.error("Upload failed", err);
        Alert.alert("Error", "Failed to upload image.");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  async function handleSettingsPress(item: SettingsItem) {
    if (item.danger) {
      await AsyncStorage.clear();
      router.replace("/");
      return;
    }
    if (item.route) {
      router.push(item.route as any);
    }
  }

  const rep = getReputation(trustScore);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={T.forest} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <LinearGradient
          colors={[T.forest, T.deep, T.mid]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.hero}
        >
          <View style={s.arc1} />
          <View style={s.arc2} />

          <View style={s.topNav}>
            <TouchableOpacity
              onPress={() => router.push("/farmer/farmerhome" as any)}
              style={s.navBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={"arrow-back" as IonIcon}
                size={22}
                color={T.white}
              />
            </TouchableOpacity>
            <Text style={s.navTitle}>Farmer Profile</Text>
            <TouchableOpacity style={s.navBtn}>
              <MaterialCommunityIcons
                name={"dots-horizontal" as MCIcon}
                size={22}
                color={T.white}
              />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <TouchableOpacity
            onPress={handleImageUpload}
            style={s.avatarRing}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <View style={s.avatarInner}>
                <ActivityIndicator color={T.forest} size="large" />
              </View>
            ) : profileImage ? (
              <Image source={{ uri: profileImage }} style={s.avatarImage} />
            ) : (
              <View style={s.avatarInner}>
                <MaterialCommunityIcons
                  name={"camera-plus" as MCIcon}
                  size={40}
                  color={T.deep}
                />
              </View>
            )}

            {isVerified && (
              <View style={s.verifyBubble}>
                <MaterialCommunityIcons
                  name={"check-decagram" as MCIcon}
                  size={16}
                  color={T.white}
                />
              </View>
            )}
          </TouchableOpacity>

          <Text style={s.heroName}>
            {loading ? "Loading..." : `${firstName} ${lastName}`.trim()}
          </Text>

          <View
            style={[
              s.rolePill,
              !isVerified && { backgroundColor: "rgba(255,255,255,0.08)" },
            ]}
          >
            <MaterialCommunityIcons
              name={"leaf" as MCIcon}
              size={11}
              color={isVerified ? T.accentLight : T.inkMuted}
            />
            <Text style={[s.roleText, !isVerified && { color: T.white }]}>
              {isVerified ? "Verified Farmer" : "New Farmer"}
            </Text>
          </View>

          <Text style={s.heroId}>{memberSince}</Text>

          <View style={[s.repBadge, { backgroundColor: rep.bg }]}>
            <MaterialCommunityIcons
              name={rep.icon}
              size={18}
              color={rep.color}
            />
            <Text style={[s.repText, { color: rep.color }]}>
              {rep.level} Farmer
            </Text>
          </View>
        </LinearGradient>

        {/* ══ TRUST SCORE CARD ════════════════════════════════════════════ */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push("/farmer/trust" as any)}
          style={[s.trustCard, SH.md]}
        >
          <View style={s.trustLeft}>
            <View style={[s.trustIconBox, { backgroundColor: T.goldLight }]}>
              <MaterialCommunityIcons
                name={"shield-check" as MCIcon}
                size={26}
                color={T.gold}
              />
            </View>
            <View style={s.trustTextWrap}>
              <Text style={s.trustTitle}>Trust Score</Text>
              <Text style={s.trustSub}>Tap to view full breakdown</Text>
            </View>
          </View>

          <View style={s.trustRight}>
            <Text style={s.trustScore}>{trustScore}%</Text>
            <View style={s.trustBarTrack}>
              <View style={[s.trustBarFill, { width: `${trustScore}%` }]} />
            </View>
            <Text style={s.trustGrade}>
              {trustScore >= 71
                ? "EXCELLENT"
                : trustScore >= 41
                  ? "GOOD"
                  : "BUILDING"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* ══ SETTINGS GROUPS ══════════════════════════════════════════════ */}
        {SETTINGS_GROUPS.map((group) => (
          <View key={group.title} style={s.settingsSection}>
            <Text style={s.groupLabel}>{group.title}</Text>
            <View style={[s.menuCard, SH.xs]}>
              {group.items.map((item, i) => (
                <SettingsRow
                  key={item.label}
                  item={item}
                  isLast={i === group.items.length - 1}
                  onPress={() => handleSettingsPress(item)}
                />
              ))}
            </View>
          </View>
        ))}

        <Text style={s.version}>AgroLink · v2.1.0</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.paler },
  scroll: { paddingBottom: 100 },
  hero: {
    paddingTop: 56,
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  arc1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: T.leaf,
    opacity: 0.1,
    top: -140,
    right: -70,
  },
  arc2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: T.accent,
    opacity: 0.08,
    bottom: -40,
    left: -30,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 28,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: T.white,
    letterSpacing: 0.3,
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.35)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 14,
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: T.white,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: { width: 88, height: 88, borderRadius: 44 },
  verifyBubble: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: T.accent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: T.deep,
  },
  heroName: {
    fontSize: 26,
    fontWeight: "800",
    color: T.white,
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 5,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    color: T.accentLight,
    letterSpacing: 0.4,
  },
  heroId: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 14,
  },
  repBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  repText: { fontSize: 13, fontWeight: "800" },
  trustCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.white,
    marginHorizontal: 16,
    marginTop: -20,
    marginBottom: 24,
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  trustLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  trustIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  trustTextWrap: { gap: 2 },
  trustTitle: { fontSize: 16, fontWeight: "800", color: T.ink },
  trustSub: { fontSize: 11, color: T.inkMuted },
  trustRight: { alignItems: "flex-end", gap: 5, minWidth: 70 },
  trustScore: { fontSize: 28, fontWeight: "900", color: T.gold },
  trustBarTrack: {
    width: 70,
    height: 5,
    backgroundColor: T.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  trustBarFill: { height: "100%", backgroundColor: T.gold, borderRadius: 3 },
  trustGrade: {
    fontSize: 10,
    fontWeight: "800",
    color: T.gold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  settingsSection: { paddingHorizontal: 16, marginBottom: 20 },
  groupLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: T.inkMuted,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  menuCard: { backgroundColor: T.white, borderRadius: 20, overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 12,
  },
  menuIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: T.pale,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: T.ink },
  menuBadge: {
    backgroundColor: T.pale,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  menuBadgeText: { fontSize: 11, fontWeight: "700", color: T.deep },
  menuDivider: { height: 1, backgroundColor: T.divider, marginLeft: 70 },
  version: {
    textAlign: "center",
    fontSize: 11,
    color: T.inkMuted,
    marginBottom: 16,
  },
});
