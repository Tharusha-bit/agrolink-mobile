/**
 * AgroLink — ProfileScreen (Production-Level Redesign)
 *
 * Key improvements over original:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. HEADER        — Premium curved green header (matches HomeScreen / EditProfile
 *                    style) with decorative circles, real avatar + ring, and a
 *                    verified badge chip. Name/role sit inside the header itself
 *                    for a modern fintech feel (no separate card overlap needed).
 *
 * 2. PROFILE CARD  — Floating "at-a-glance" stats card (crops, investments, rating)
 *                    replaces the basic name/role block, giving investors and farmers
 *                    an instant snapshot of the user's activity.
 *
 * 3. PROFILE STRENGTH — Redesigned with a segmented step-bar, a colour-coded
 *                    completion label, and actionable tip chips so users know
 *                    exactly what to do next.
 *
 * 4. MENU OPTIONS  — Icon containers now use rounded squares with per-option
 *                    accent colours for instant visual scanning. Each row has a
 *                    subtle animated press state via TouchableOpacity activeOpacity.
 *                    Section headers use a left accent pill (same pattern as SectionHeader
 *                    in HomeScreen) for consistency.
 *
 * 5. LOGOUT ROW    — Destructive action is separated by a full-width divider and
 *                    rendered last, matching industry-standard placement.
 *
 * 6. TOKENS        — Centralised COLORS / SHADOWS constants shared with the rest
 *                    of the AgroLink screen family.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider, Text } from "react-native-paper";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
// Centralised so any future rebrand is a single-file change.
const COLORS = {
  primary: "#216000",
  primaryLight: "#2E8B00",
  primaryPale: "#E8F5E1",
  accent: "#76C442",
  accentWarm: "#F5A623",
  white: "#FFFFFF",
  surface: "#F7F9F4",
  card: "#FFFFFF",
  text: "#1A2E0D",
  textSecondary: "#5C7A4A",
  textMuted: "#9BB08A",
  border: "#DDE8D4",
  error: "#D32F2F",
  errorBg: "#FFEBEE",
  info: "#3A9BD5",
  infoBg: "#E8F4FD",
  warning: "#F5A623",
  warningBg: "#FFF8ED",
};

const SHADOWS = {
  sm: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    android: { elevation: 3 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.13,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
  }),
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ProfileOptionProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  sublabel?: string;
  onPress: () => void;
  isDestructive?: boolean;
  iconBg?: string;
  iconColor?: string;
  badge?: string;
}

interface StatPillProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value: string;
  label: string;
  color: string;
}

// ─── Reusable: Stat Pill ───────────────────────────────────────────────────────
/**
 * Improvement: replaces the plain "role | ID" text with a row of
 * at-a-glance KPI pills so any visitor can immediately gauge the user's
 * activity level — a common pattern in fintech / marketplace profiles.
 */
const StatPill = ({ icon, value, label, color }: StatPillProps) => (
  <View style={sp.wrap}>
    <View style={[sp.iconCircle, { backgroundColor: color + "22" }]}>
      <MaterialCommunityIcons name={icon} size={18} color={color} />
    </View>
    <Text style={sp.value}>{value}</Text>
    <Text style={sp.label}>{label}</Text>
  </View>
);

const sp = StyleSheet.create({
  wrap: { alignItems: "center", flex: 1 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  value: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  label: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    marginTop: 1,
    textAlign: "center",
  },
});

// ─── Reusable: Profile Option Row ─────────────────────────────────────────────
/**
 * Improvement: each option now has a distinct iconBg / iconColor so users
 * can scan the menu visually without reading every label.  An optional
 * `sublabel` and `badge` prop support richer rows (e.g. "2 alerts").
 */
const ProfileOption = ({
  icon,
  label,
  sublabel,
  onPress,
  isDestructive = false,
  iconBg,
  iconColor,
  badge,
}: ProfileOptionProps) => {
  const resolvedIconBg =
    iconBg ?? (isDestructive ? COLORS.errorBg : COLORS.primaryPale);
  const resolvedIconColor =
    iconColor ?? (isDestructive ? COLORS.error : COLORS.primary);

  return (
    <TouchableOpacity style={po.row} onPress={onPress} activeOpacity={0.72}>
      {/* Icon container */}
      <View style={[po.iconBox, { backgroundColor: resolvedIconBg }]}>
        <MaterialCommunityIcons
          name={icon}
          size={21}
          color={resolvedIconColor}
        />
      </View>

      {/* Text block */}
      <View style={po.textBlock}>
        <Text style={[po.label, isDestructive && { color: COLORS.error }]}>
          {label}
        </Text>
        {sublabel && <Text style={po.sublabel}>{sublabel}</Text>}
      </View>

      {/* Optional badge */}
      {badge && (
        <View style={po.badge}>
          <Text style={po.badgeText}>{badge}</Text>
        </View>
      )}

      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={isDestructive ? COLORS.error + "88" : "#C8D9C0"}
      />
    </TouchableOpacity>
  );
};

const po = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    ...SHADOWS.sm,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textBlock: { flex: 1 },
  label: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  sublabel: { fontSize: 11.5, color: COLORS.textMuted, marginTop: 2 },
  badge: {
    backgroundColor: COLORS.accentWarm,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeText: { fontSize: 11, fontWeight: "700", color: COLORS.white },
});

// ─── Reusable: Section Header ─────────────────────────────────────────────────
/** Consistent left-pill style matching HomeScreen's SectionHeader. */
const SectionLabel = ({ title }: { title: string }) => (
  <View style={sl.row}>
    <View style={sl.pill} />
    <Text style={sl.text}>{title}</Text>
  </View>
);

const sl = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 4,
  },
  pill: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    marginRight: 10,
  },
  text: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});

// ─── Profile Strength Segment Bar ─────────────────────────────────────────────
/**
 * Improvement: replaces the single thin bar with a segmented step indicator.
 * Each completed segment is filled; the label and hint are colour-coded by
 * completion level so the feedback feels urgent or encouraging.
 */
const StrengthBar = ({ percent }: { percent: number }) => {
  const STEPS = 5;
  const filled = Math.round((percent / 100) * STEPS);
  const color =
    percent < 40
      ? COLORS.error
      : percent < 70
        ? COLORS.accentWarm
        : COLORS.accent;
  const label =
    percent < 40
      ? "Needs work"
      : percent < 70
        ? "Getting there"
        : "Looking great!";

  // Actionable next steps
  const TIPS = [
    "Add a photo",
    "Verify NIC",
    "Add bank account",
    "Add 3+ skills",
    "Complete address",
  ];
  const nextTip = TIPS[filled] ?? null;

  return (
    <View style={str.wrap}>
      <View style={str.topRow}>
        <Text style={str.title}>Profile Strength</Text>
        <View style={[str.badge, { backgroundColor: color + "22" }]}>
          <Text style={[str.badgeText, { color }]}>
            {label} · {percent}%
          </Text>
        </View>
      </View>

      {/* Segmented bar */}
      <View style={str.segRow}>
        {Array.from({ length: STEPS }).map((_, i) => (
          <View
            key={i}
            style={[
              str.seg,
              i < filled
                ? { backgroundColor: color }
                : { backgroundColor: COLORS.border },
              i < STEPS - 1 && { marginRight: 5 },
            ]}
          />
        ))}
      </View>

      {/* Next action tip */}
      {nextTip && (
        <View style={str.tipRow}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={13}
            color={COLORS.accentWarm}
          />
          <Text style={str.tipText}>
            Next: <Text style={{ fontWeight: "700" }}>{nextTip}</Text>
          </Text>
        </View>
      )}
    </View>
  );
};

const str = StyleSheet.create({
  wrap: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 13, fontWeight: "700", color: COLORS.textSecondary },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11.5, fontWeight: "700" },
  segRow: { flexDirection: "row", marginBottom: 10 },
  seg: { flex: 1, height: 7, borderRadius: 4 },
  tipRow: { flexDirection: "row", alignItems: "center" },
  tipText: { fontSize: 12, color: COLORS.textMuted, marginLeft: 4 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        {/*
          Improvement: full premium curved header — matches HomeScreen and
          EditProfileScreen for a cohesive shell experience.
          Name + role live inside the header to prevent the jarring
          "card cuts into header" visual that the original had.
        */}
        <View style={s.header}>
          {/* Decorative depth circles */}
          <View style={s.decLg} />
          <View style={s.decSm} />

          {/* Title row */}
          <View style={s.headerTopRow}>
            <Text style={s.headerTitle}>My Profile</Text>
            {/* Settings shortcut */}
            <TouchableOpacity style={s.settingsBtn} activeOpacity={0.8}>
              <MaterialCommunityIcons
                name="cog-outline"
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={s.avatarSection}>
            <View style={s.avatarRing}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=12" }}
                style={s.avatar}
              />
              <TouchableOpacity style={s.cameraBtn} activeOpacity={0.85}>
                <MaterialCommunityIcons
                  name="camera"
                  size={13}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>

            {/* Name + verified chip */}
            <View style={s.nameRow}>
              <Text style={s.name}>W.T.P. Fernando</Text>
              <View style={s.verifiedChip}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={13}
                  color={COLORS.accent}
                />
                <Text style={s.verifiedText}>Verified</Text>
              </View>
            </View>

            {/* Role + ID */}
            <Text style={s.role}>Farmer · ID: 20321212</Text>
          </View>
        </View>

        {/* ── STATS CARD ───────────────────────────────────────────────────── */}
        {/*
          Improvement: floating stats card replaces the basic role text.
          Gives any viewer an immediate, quantified sense of the user's
          activity — a pattern common in fintech / marketplace profiles.
        */}
        <View style={[s.statsCard, SHADOWS.md]}>
          <StatPill
            icon="sprout"
            value="8"
            label="Active Crops"
            color={COLORS.accent}
          />
          <View style={s.statDivider} />
          <StatPill
            icon="cash-multiple"
            value="LKR 2.4M"
            label="Total Invested"
            color={COLORS.accentWarm}
          />
          <View style={s.statDivider} />
          <StatPill
            icon="star"
            value="4.8"
            label="Rating"
            color={COLORS.primary}
          />
        </View>

        {/* ── PROFILE STRENGTH ─────────────────────────────────────────────── */}
        <View style={[s.card, SHADOWS.sm, { marginTop: 16 }]}>
          <StrengthBar percent={40} />
        </View>

        {/* ── MENU ─────────────────────────────────────────────────────────── */}
        <View style={s.menu}>
          <SectionLabel title="Account Settings" />

          <ProfileOption
            icon="account-edit"
            label="Edit Personal Details"
            sublabel="Name, NIC, address and more"
            iconBg={COLORS.primaryPale}
            iconColor={COLORS.primary}
            onPress={() => router.push("/profile/edit")}
          />
          <ProfileOption
            icon="shield-lock"
            label="Security & Password"
            sublabel="2FA, password, login history"
            iconBg={COLORS.infoBg}
            iconColor={COLORS.info}
            onPress={() => router.push("/profile/security")}
          />
          <ProfileOption
            icon="bank"
            label="Payment Methods"
            sublabel="Add or manage bank accounts"
            iconBg={COLORS.warningBg}
            iconColor={COLORS.accentWarm}
            badge="New"
            onPress={() =>
              Alert.alert(
                "Payment methods",
                "Bank account management is available from Settings.",
              )
            }
          />

          <SectionLabel title="Support" />

          <ProfileOption
            icon="help-circle-outline"
            label="Help & Support"
            sublabel="FAQs, live chat, report an issue"
            iconBg={COLORS.primaryPale}
            iconColor={COLORS.accent}
            onPress={() =>
              Alert.alert(
                "Help & Support",
                "Contact support@agrolink.app for account or investment help.",
              )
            }
          />
          <ProfileOption
            icon="file-document-outline"
            label="Terms & Conditions"
            sublabel="Privacy policy and legal terms"
            iconBg={COLORS.primaryPale}
            iconColor={COLORS.textSecondary}
            onPress={() =>
              Alert.alert(
                "Terms & Conditions",
                "Legal and privacy details are available in the app documentation.",
              )
            }
          />

          {/* Danger zone separator */}
          <Divider style={s.divider} />

          <ProfileOption
            icon="logout"
            label="Log Out"
            isDestructive
            onPress={() => router.replace("/")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Screen Styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.surface },
  scroll: { flex: 1 },

  /* HEADER */
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "ios" ? 60 : 48,
    paddingHorizontal: 24,
    paddingBottom: 48,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  decLg: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.primaryLight,
    top: -60,
    right: -50,
    opacity: 0.5,
  },
  decSm: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accent,
    bottom: -20,
    left: -30,
    opacity: 0.18,
  },

  headerTopRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarSection: { alignItems: "center" },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.55)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  nameRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  name: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -0.4,
    marginRight: 8,
  },
  verifiedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 3,
  },
  verifiedText: { fontSize: 11, fontWeight: "700", color: COLORS.white },
  role: { fontSize: 13, color: "rgba(255,255,255,0.65)", letterSpacing: 0.2 },

  /* STATS CARD */
  statsCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 24,
    marginTop: -24,
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  statDivider: { width: 1, height: 44, backgroundColor: COLORS.border },

  /* GENERIC CARD */
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 20,
  },

  /* MENU */
  menu: { paddingHorizontal: 20, marginTop: 20 },
  divider: { marginVertical: 8, backgroundColor: COLORS.border },
});
