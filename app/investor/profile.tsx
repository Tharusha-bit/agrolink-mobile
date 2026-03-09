/**
 * AgroLink — FarmerProfileScreen (Production-Level Redesign)
 */

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
const C = {
  forest: "#216000",
  forestMid: "#2A7A00",
  forestLight: "#3A9900",
  forestPale: "#E8F5E1",
  forestGhost: "#F2FAF0",
  gold: "#C9A84C",
  goldPale: "#FDF6E3",
  gain: "#2E8B57",
  gainBg: "#EAF7F0",
  pending: "#D4900A",
  pendingBg: "#FFF8E6",
  loss: "#C0392B",
  lossBg: "#FDECEB",
  info: "#2471A3",
  infoBg: "#EBF5FB",
  white: "#FFFFFF",
  surface: "#F8FBF7",
  cardBg: "#FFFFFF",
  border: "#DCE8D5",
  borderLight: "#EDF5E8",
  text: "#1A2E0D",
  textSub: "#4A6B3A",
  textMuted: "#8FA882",
};

const SH = {
  xs: Platform.select({
    ios: {
      shadowColor: "#216000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
    },
    android: { elevation: 2 },
  }),
  sm: Platform.select({
    ios: {
      shadowColor: "#216000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#216000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.14,
      shadowRadius: 20,
    },
    android: { elevation: 8 },
  }),
};

// ─── Translations Dictionary ───────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    navTitle: "MY PROFILE",
    verified: "Verified",
    role: "Farmer",
    activeProj: "Active Projects",
    totalFund: "Total Funding",
    rating: "Rating",
    accSet: "Account Settings",
    editDet: "Edit Personal Details",
    editSub: "Name, NIC, address and more",
    secPass: "Security & Password",
    secSub: "2FA, password, login history",
    payMeth: "Payment Methods",
    paySub: "Add or manage bank accounts",
    support: "Support",
    help: "Help & Support",
    helpSub: "FAQs, live chat, report an issue",
    terms: "Terms & Conditions",
    termsSub: "Privacy policy and legal terms",
    logout: "Log Out",
  },
  si: {
    navTitle: "මගේ පැතිකඩ",
    verified: "තහවුරු කර ඇත",
    role: "ගොවියා",
    activeProj: "සක්‍රිය ව්‍යාපෘති",
    totalFund: "මුළු අරමුදල්",
    rating: "ශ්‍රේණිගත කිරීම",
    accSet: "ගිණුම් සැකසුම්",
    editDet: "පුද්ගලික විස්තර සංස්කරණය",
    editSub: "නම, ජා.හැ.අ, ලිපිනය සහ තවත් දේ",
    secPass: "ආරක්ෂාව සහ මුරපදය",
    secSub: "2FA, මුරපදය, පිවිසුම් ඉතිහාසය",
    payMeth: "ගෙවීම් ක්‍රම",
    paySub: "බැංකු ගිණුම් කළමනාකරණය",
    support: "සහාය",
    help: "උදව් සහ සහාය",
    helpSub: "නිති අසන පැණ, සජීවී කතාබස්",
    terms: "නියමයන් සහ කොන්දේසි",
    termsSub: "රහස්‍යතා ප්‍රතිපත්තිය",
    logout: "ඉවත් වන්න",
  },
  ta: {
    navTitle: "என் சுயவிவரம்",
    verified: "சரிபார்க்கப்பட்டது",
    role: "விவசாயி",
    activeProj: "செயலில் உள்ள திட்டங்கள்",
    totalFund: "மொத்த நிதி",
    rating: "மதிப்பீடு",
    accSet: "கணக்கு அமைப்புகள்",
    editDet: "தனிப்பட்ட விவரங்களை திருத்து",
    editSub: "பெயர், முகவரி மற்றும் பல",
    secPass: "பாதுகாப்பு & கடவுச்சொல்",
    secSub: "2FA, கடவுச்சொல்",
    payMeth: "கட்டண முறைகள்",
    paySub: "வங்கி கணக்குகளை நிர்வகிக்க",
    support: "ஆதரவு",
    help: "உதவி மற்றும் ஆதரவு",
    helpSub: "நேரலை அரட்டை, புகாரளி",
    terms: "விதிமுறைகள் & நிபந்தனைகள்",
    termsSub: "தனியுரிமை கொள்கை",
    logout: "வெளியேறு",
  },
};

// ─── Types & Reusable Components (StatPill, ProfileOption, SectionLabel) ───────
// (Kept exactly as your teammate designed them)
interface ProfileOptionProps {
  icon: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  isDestructive?: boolean;
  iconBg?: string;
  iconColor?: string;
  badge?: string;
}
interface StatPillProps {
  icon: string;
  value: string;
  label: string;
  color: string;
}

const StatPill = ({ icon, value, label, color }: StatPillProps) => (
  <View style={sp.wrap}>
    <View style={[sp.iconCircle, { backgroundColor: color + "15" }]}>
      <MaterialCommunityIcons name={icon as any} size={18} color={color} />
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
    color: C.text,
    letterSpacing: -0.3,
  },
  label: {
    fontSize: 10.5,
    color: C.textMuted,
    marginTop: 1,
    textAlign: "center",
  },
});

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
  const resolvedIconBg = iconBg ?? (isDestructive ? C.lossBg : C.forestPale);
  const resolvedIconColor = iconColor ?? (isDestructive ? C.loss : C.forest);
  return (
    <TouchableOpacity style={po.row} onPress={onPress} activeOpacity={0.72}>
      <View style={[po.iconBox, { backgroundColor: resolvedIconBg }]}>
        <MaterialCommunityIcons
          name={icon as any}
          size={21}
          color={resolvedIconColor}
        />
      </View>
      <View style={po.textBlock}>
        <Text style={[po.label, isDestructive && { color: C.loss }]}>
          {label}
        </Text>
        {sublabel && <Text style={po.sublabel}>{sublabel}</Text>}
      </View>
      {badge && (
        <View style={po.badge}>
          <Text style={po.badgeText}>{badge}</Text>
        </View>
      )}
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={isDestructive ? C.loss + "88" : "#C8D9C0"}
      />
    </TouchableOpacity>
  );
};
const po = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.cardBg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    ...SH.sm,
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
  label: { fontSize: 15, fontWeight: "600", color: C.text },
  sublabel: { fontSize: 11.5, color: C.textMuted, marginTop: 2 },
  badge: {
    backgroundColor: C.pending,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeText: { fontSize: 11, fontWeight: "700", color: C.white },
});

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
    backgroundColor: C.gold,
    marginRight: 10,
  },
  text: {
    fontSize: 13,
    fontWeight: "800",
    color: C.textSub,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});

const StrengthBar = ({ percent }: { percent: number }) => {
  const STEPS = 5;
  const filled = Math.round((percent / 100) * STEPS);
  const color = percent < 40 ? C.loss : percent < 70 ? C.pending : C.gain;
  const label =
    percent < 40
      ? "Needs work"
      : percent < 70
        ? "Getting there"
        : "Looking great!";
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
        <View style={[str.badge, { backgroundColor: color + "15" }]}>
          <Text style={[str.badgeText, { color }]}>
            {label} · {percent}%
          </Text>
        </View>
      </View>
      <View style={str.segRow}>
        {Array.from({ length: STEPS }).map((_, i) => (
          <View
            key={i}
            style={[
              str.seg,
              i < filled
                ? { backgroundColor: color }
                : { backgroundColor: C.borderLight },
              i < STEPS - 1 && { marginRight: 5 },
            ]}
          />
        ))}
      </View>
      {nextTip && (
        <View style={str.tipRow}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={13}
            color={C.gold}
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
    borderTopColor: C.border,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 13, fontWeight: "700", color: C.textSub },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11.5, fontWeight: "700" },
  segRow: { flexDirection: "row", marginBottom: 10 },
  seg: { flex: 1, height: 7, borderRadius: 4 },
  tipRow: { flexDirection: "row", alignItems: "center" },
  tipText: { fontSize: 12, color: C.textMuted, marginLeft: 4 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function FarmerProfileScreen() {
  const router = useRouter();

  // ✅ 1. Get real data from Login Params
  const { firstName, id } = useLocalSearchParams();
  const displayName = firstName || "Farmer"; // Fallback if direct navigated
  const displayId = id || "20321212";

  // ✅ 2. Setup Language State
  const [lang, setLang] = useState<"en" | "si" | "ta">("en");
  const t = TRANSLATIONS[lang];

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.forest} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        <View style={s.header}>
          <View style={s.ring1} />
          <View style={s.ring2} />
          <View style={s.ring3} />

          <View style={s.nav}>
            <TouchableOpacity style={s.navBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color={C.forest} />
            </TouchableOpacity>

            <Text style={s.navTitle}>{t.navTitle}</Text>

            {/* ✅ Language Switcher Button Group */}
            <View style={s.langGroup}>
              <TouchableOpacity
                onPress={() => setLang("en")}
                style={[s.langBtn, lang === "en" && s.langBtnActive]}
              >
                <Text style={[s.langText, lang === "en" && s.langTextActive]}>
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLang("si")}
                style={[s.langBtn, lang === "si" && s.langBtnActive]}
              >
                <Text style={[s.langText, lang === "si" && s.langTextActive]}>
                  සිං
                </Text>
              </TouchableOpacity>
            </View>
          </View>

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
                  color={C.white}
                />
              </TouchableOpacity>
            </View>

            <View style={s.nameRow}>
              {/* ✅ Dynamic Name Rendering */}
              <Text style={s.name}>{displayName}</Text>
              <View style={s.verifiedChip}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={13}
                  color={C.gain}
                />
                <Text style={s.verifiedText}>{t.verified}</Text>
              </View>
            </View>

            <Text style={s.role}>
              {t.role} · ID: {displayId}
            </Text>
          </View>
        </View>

        {/* ── STATS CARD ───────────────────────────────────────────────────── */}
        <View style={[s.statsCard, SH.md]}>
          <StatPill
            icon="sprout"
            value="3"
            label={t.activeProj}
            color={C.gain}
          />
          <View style={s.statDivider} />
          <StatPill
            icon="cash-multiple"
            value="LKR 1.2M"
            label={t.totalFund}
            color={C.pending}
          />
          <View style={s.statDivider} />
          <StatPill icon="star" value="4.7" label={t.rating} color={C.gold} />
        </View>

        <View style={[s.card, SH.sm, { marginTop: 16 }]}>
          <StrengthBar percent={65} />
        </View>

        {/* ── MENU ─────────────────────────────────────────────────────────── */}
        <View style={s.menu}>
          <SectionLabel title={t.accSet} />

          <ProfileOption
            icon="account-edit-outline"
            label={t.editDet}
            sublabel={t.editSub}
            iconBg={C.forestPale}
            iconColor={C.forest}
            onPress={() => router.push("/profile/edit" as any)}
          />
          <ProfileOption
            icon="shield-lock-outline"
            label={t.secPass}
            sublabel={t.secSub}
            iconBg={C.infoBg}
            iconColor={C.info}
            onPress={() => router.push("/profile/security" as any)}
          />
          <ProfileOption
            icon="bank-outline"
            label={t.payMeth}
            sublabel={t.paySub}
            iconBg={C.pendingBg}
            iconColor={C.pending}
            badge="New"
            onPress={() => console.log("Bank")}
          />

          <SectionLabel title={t.support} />

          <ProfileOption
            icon="help-circle-outline"
            label={t.help}
            sublabel={t.helpSub}
            iconBg={C.forestPale}
            iconColor={C.gain}
            onPress={() => console.log("Help")}
          />
          <ProfileOption
            icon="file-document-outline"
            label={t.terms}
            sublabel={t.termsSub}
            iconBg={C.forestPale}
            iconColor={C.textSub}
            onPress={() => console.log("Terms")}
          />

          <Divider style={s.divider} />

          {/* ✅ Fixed Logout Route */}
          <ProfileOption
            icon="logout"
            label={t.logout}
            isDestructive
            onPress={() => router.replace("/login" as any)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Screen Styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  header: {
    backgroundColor: C.forest,
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingHorizontal: 22,
    paddingBottom: 36,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
  },
  ring1: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    top: -80,
    right: -80,
  },
  ring2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    top: -40,
    right: -40,
  },
  ring3: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -10,
    right: 10,
  },

  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  navTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },

  /* ✅ New Styles for the Header Language Switcher */
  langGroup: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 3,
  },
  langBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 15 },
  langBtnActive: { backgroundColor: C.white },
  langText: { fontSize: 10, fontWeight: "700", color: "rgba(255,255,255,0.7)" },
  langTextActive: { color: C.forest },

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
    backgroundColor: C.forestMid,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: C.white,
  },

  nameRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  name: {
    fontSize: 22,
    fontWeight: "900",
    color: C.white,
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
  verifiedText: { fontSize: 11, fontWeight: "700", color: C.white },
  role: { fontSize: 13, color: "rgba(255,255,255,0.65)", letterSpacing: 0.2 },

  statsCard: {
    backgroundColor: C.cardBg,
    marginHorizontal: 20,
    marginTop: -24,
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  statDivider: { width: 1, height: 44, backgroundColor: C.border },
  card: {
    backgroundColor: C.cardBg,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
  },
  menu: { paddingHorizontal: 20, marginTop: 20 },
  divider: { marginVertical: 8, backgroundColor: C.border },
});
