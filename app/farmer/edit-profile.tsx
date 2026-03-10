import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const COLORS = {
  primary: "#216000",
  primaryLight: "#2E8B00",
  primaryPale: "#E8F5E1",
  accent: "#76C442",
  white: "#FFFFFF",
  surface: "#F7F9F4",
  card: "#FFFFFF",
  text: "#1A2E0D",
  textSecondary: "#5C7A4A",
  textMuted: "#9BB08A",
  border: "#DDE8D4",
  error: "#D32F2F",
  errorBg: "#FFF0F0",
  gold: "#F59E0B",
  goldLight: "#FEF3C7",
};

const SHADOWS = {
  sm: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 6,
    },
    android: { elevation: 3 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.11,
      shadowRadius: 14,
    },
    android: { elevation: 6 },
  }),
};

const SUGGESTED_SKILLS = [
  "Irrigation",
  "Paddy",
  "Organic",
  "Horticulture",
  "Poultry",
  "Aquaculture",
];

// ─── Translations ──────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    header: "Edit Details",
    personalInfo: "Personal Information",
    legalDetails: "Legal details for verification",
    fName: "First Name",
    lName: "Last Name",
    nic: "NIC Number",
    contact: "Contact Details",
    contactSub: "For farm verification",
    address: "Address",
    addrHint: "💡 Add an address to gain +5 Trust Score!",
    skills: "Skills & Expertise",
    skillsSub: "Your farming strengths",
    skillsHint: "💡 Each new skill adds +1 to your Trust Score!",
    addSkill: "Add a skill...",
    quickAdd: "Quick Add:",
    save: "Save Profile",
    cancel: "Cancel",
    saving: "Saving...",
    errReq: "is required",
    successTitle: "Success",
    successBody: "Profile updated successfully!",
    errFail: "Failed to update profile.",
  },
  si: {
    header: "විස්තර සංස්කරණය",
    personalInfo: "පුද්ගලික තොරතුරු",
    legalDetails: "තහවුරු කිරීම සඳහා නීතිමය විස්තර",
    fName: "මුල් නම",
    lName: "අවසන් නම",
    nic: "ජා.හැ. අංකය",
    contact: "සම්බන්ධතා විස්තර",
    contactSub: "ගොවිපල තහවුරු කිරීම සඳහා",
    address: "ලිපිනය",
    addrHint: "💡 ලිපිනයක් එක්කර +5 ක විශ්වාස ලකුණු ලබාගන්න!",
    skills: "කුසලතා සහ විශේෂඥතා",
    skillsSub: "ඔබේ ගොවිතැන් හැකියාවන්",
    skillsHint: "💡 සෑම කුසලතාවක්ම +1 ක ලකුණු එක් කරයි!",
    addSkill: "කුසලතාවක් එක් කරන්න...",
    quickAdd: "ඉක්මන් එක් කිරීම්:",
    save: "සුරකින්න",
    cancel: "අවලංගු කරන්න",
    saving: "සුරකිමින් පවතී...",
    errReq: "අවශ්‍යයි",
    successTitle: "සාර්ථකයි",
    successBody: "ගිණුම සාර්ථකව යාවත්කාලීන විය!",
    errFail: "යාවත්කාලීන කිරීම අසාර්ථකයි.",
  },
  ta: {
    header: "விவரங்களை திருத்து",
    personalInfo: "தனிப்பட்ட தகவல்",
    legalDetails: "சரிபார்ப்புக்கான சட்ட விவரங்கள்",
    fName: "முதல் பெயர்",
    lName: "கடைசி பெயர்",
    nic: "தே.அ. அட்டை எண்",
    contact: "தொடர்பு விவரங்கள்",
    contactSub: "பண்ணை சரிபார்ப்புக்கு",
    address: "முகவரி",
    addrHint: "💡 முகவரியைச் சேர்த்து +5 நம்பிக்கை மதிப்பெண்ணைப் பெறுங்கள்!",
    skills: "திறன்கள் & நிபுணத்துவம்",
    skillsSub: "உங்கள் விவசாய பலங்கள்",
    skillsHint: "💡 ஒவ்வொரு திறனும் +1 மதிப்பெண்ணை சேர்க்கும்!",
    addSkill: "திறனைச் சேர்...",
    quickAdd: "விரைவாகச் சேர்:",
    save: "சுயவிவரத்தை சேமி",
    cancel: "ரத்துசெய்",
    saving: "சேமிக்கிறது...",
    errReq: "தேவை",
    successTitle: "வெற்றி",
    successBody: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
    errFail: "புதுப்பிப்பது தோல்வியடைந்தது.",
  },
};

// ─── Reusable Components ───────────────────────────────────────────────────────
const ProfileField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = "default",
  error,
}: any) => {
  const [focused, setFocused] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(anim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(anim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });
  const labelColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.textSecondary, COLORS.primary],
  });
  const iconColor = focused ? COLORS.primary : COLORS.textMuted;

  return (
    <View style={pf.wrap}>
      <Animated.Text
        style={[pf.label, { color: error ? COLORS.error : labelColor }]}
      >
        {label}
      </Animated.Text>
      <Animated.View
        style={[
          pf.inputWrap,
          { borderColor: error ? COLORS.error : borderColor },
          error && { backgroundColor: COLORS.errorBg },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={error ? COLORS.error : iconColor}
          style={pf.icon}
        />
        <TextInput
          style={pf.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          keyboardType={keyboardType}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </Animated.View>
      {error ? (
        <View style={pf.errorRow}>
          <Ionicons name="alert-circle" size={14} color={COLORS.error} />
          <Text style={pf.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};
const pf = StyleSheet.create({
  wrap: { marginBottom: 18 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: COLORS.text, height: "100%" },
  errorRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginLeft: 4,
    fontWeight: "600",
  },
});

const SectionCard = ({ title, subtitle, icon, children }: any) => (
  <View style={[sc.card, SHADOWS.sm]}>
    <View style={sc.header}>
      <View style={sc.iconWrap}>
        <MaterialCommunityIcons name={icon} size={22} color={COLORS.primary} />
      </View>
      <View>
        <Text style={sc.title}>{title}</Text>
        <Text style={sc.subtitle}>{subtitle}</Text>
      </View>
    </View>
    {children}
  </View>
);
const sc = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryPale,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
});

const SkillChip = ({ label, onRemove }: any) => (
  <View style={chip.wrap}>
    <MaterialCommunityIcons
      name="sprout"
      size={14}
      color={COLORS.primary}
      style={{ marginRight: 6 }}
    />
    <Text style={chip.label}>{label}</Text>
    <TouchableOpacity
      onPress={onRemove}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{ marginLeft: 8 }}
    >
      <Ionicons name="close-circle" size={18} color={COLORS.primary} />
    </TouchableOpacity>
  </View>
);
const chip = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryPale,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  label: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function EditProfileScreen() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nic, setNic] = useState("");
  const [address, setAddress] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // Track if address is empty for gamification hint
  const [initialAddressEmpty, setInitialAddressEmpty] = useState(false);

  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<any>({});

  // Translation State
  const [lang, setLang] = useState<"en" | "si" | "ta">("en");
  const t = TRANSLATIONS[lang];

  // ⚠️ UPDATE THIS IP TO YOUR LAPTOP'S WI-FI IP
  const API_URL = "http://172.20.10.6:8080";

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const id = await AsyncStorage.getItem("userId");
          if (id) {
            setUserId(id);
            const res = await axios.get(`${API_URL}/api/users/${id}`);
            if (res.data) {
              setFirstName(res.data.firstName || "");
              setLastName(res.data.lastName || "");
              setNic(res.data.nic || "");

              // ✅ FIXED: Strictly fetches address, ignores city fallback
              const fetchedAddress = res.data.address || "";
              setAddress(fetchedAddress);

              if (fetchedAddress.trim() === "") {
                setInitialAddressEmpty(true);
              }

              setSkills(res.data.skills || []);
            }
          }
        } catch (error) {
          console.error("Failed to load profile data", error);
        } finally {
          setFetching(false);
        }
      };
      loadData();
    }, []),
  );

  const validate = () => {
    const e: any = {};
    if (!firstName.trim()) e.firstName = `${t.fName} ${t.errReq}`;
    if (!lastName.trim()) e.lastName = `${t.lName} ${t.errReq}`;
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    if (!userId) return;

    try {
      setLoading(true);
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        nic: nic.trim(),
        address: address.trim(),
        skills: skills,
      };

      const res = await axios.put(`${API_URL}/api/users/${userId}`, payload);

      if (res.status === 200) {
        await AsyncStorage.setItem("firstName", firstName.trim());
        Alert.alert(t.successTitle, t.successBody, [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (err) {
      console.error("Save error", err);
      Alert.alert("Error", t.errFail);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (s?: string) => {
    const skillToAdd = (s || newSkill).trim();
    if (!skillToAdd || skills.includes(skillToAdd)) return;
    setSkills([...skills, skillToAdd]);
    setNewSkill("");
  };

  const removeSkill = (index: number) =>
    setSkills(skills.filter((_, i) => i !== index));
  const suggestions = SUGGESTED_SKILLS.filter((s) => !skills.includes(s));

  if (fetching) {
    return (
      <View
        style={[
          s.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── HEADER ── */}
          <View style={s.header}>
            <View style={s.decCircleLg} />
            <View style={s.decCircleSm} />

            <View style={s.topNavRow}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={s.backBtn}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
              </TouchableOpacity>
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
                <TouchableOpacity
                  onPress={() => setLang("ta")}
                  style={[s.langBtn, lang === "ta" && s.langBtnActive]}
                >
                  <Text style={[s.langText, lang === "ta" && s.langTextActive]}>
                    தமிழ்
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.headerTitleWrap}>
              <Text style={s.headerTitle}>{t.header}</Text>
            </View>
          </View>

          {/* ── PERSONAL INFO ── */}
          <View style={{ marginTop: 20 }}>
            <SectionCard
              title={t.personalInfo}
              subtitle={t.legalDetails}
              icon="card-account-details-outline"
            >
              <ProfileField
                label={t.fName}
                value={firstName}
                onChangeText={(v: string) => {
                  setFirstName(v);
                  setErrors({ ...errors, firstName: "" });
                }}
                placeholder="e.g. Kasun"
                icon="account-outline"
                error={errors.firstName}
              />
              <ProfileField
                label={t.lName}
                value={lastName}
                onChangeText={(v: string) => {
                  setLastName(v);
                  setErrors({ ...errors, lastName: "" });
                }}
                placeholder="e.g. Perera"
                icon="account-outline"
                error={errors.lastName}
              />
              <ProfileField
                label={t.nic}
                value={nic}
                onChangeText={(v: string) => {
                  setNic(v);
                  setErrors({ ...errors, nic: "" });
                }}
                placeholder="e.g. 991234567V"
                icon="identifier"
                error={errors.nic}
              />
            </SectionCard>

            {/* ── CONTACT ── */}
            <SectionCard
              title={t.contact}
              subtitle={t.contactSub}
              icon="map-marker-radius-outline"
            >
              {initialAddressEmpty && (
                <View style={s.hintBox}>
                  <Text style={s.hintText}>{t.addrHint}</Text>
                </View>
              )}
              <ProfileField
                label={t.address}
                value={address}
                onChangeText={(v: string) => {
                  setAddress(v);
                  setErrors({ ...errors, address: "" });
                }}
                placeholder="e.g. 12 Kandy Rd, Colombo"
                icon="home-outline"
                error={errors.address}
              />
            </SectionCard>

            {/* ── SKILLS ── */}
            <SectionCard title={t.skills} subtitle={t.skillsSub} icon="leaf">
              <View style={s.hintBox}>
                <Text style={s.hintText}>{t.skillsHint}</Text>
              </View>

              <View style={s.skillInputRow}>
                <View style={s.skillInputWrap}>
                  <MaterialCommunityIcons
                    name="sprout-outline"
                    size={18}
                    color={COLORS.textMuted}
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    style={s.skillInput}
                    value={newSkill}
                    onChangeText={setNewSkill}
                    placeholder={t.addSkill}
                    placeholderTextColor={COLORS.textMuted}
                    onSubmitEditing={() => addSkill()}
                  />
                </View>
                <TouchableOpacity
                  style={s.addBtn}
                  onPress={() => addSkill()}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>

              {suggestions.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={s.suggestLabel}>{t.quickAdd}</Text>
                  <View style={s.chipsWrap}>
                    {suggestions.slice(0, 4).map((sg) => (
                      <TouchableOpacity
                        key={sg}
                        style={s.suggestChip}
                        onPress={() => addSkill(sg)}
                      >
                        <Ionicons
                          name="add-circle-outline"
                          size={14}
                          color={COLORS.primary}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={s.suggestChipText}>{sg}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <View style={s.chipsWrap}>
                {skills.map((sk, i) => (
                  <SkillChip
                    key={i}
                    label={sk}
                    onRemove={() => removeSkill(i)}
                  />
                ))}
              </View>
            </SectionCard>

            {/* ── SAVE BUTTON ── */}
            <View style={s.saveSection}>
              <TouchableOpacity
                style={[s.saveBtn, loading && s.saveBtnLoading]}
                onPress={handleSave}
                disabled={loading}
                activeOpacity={0.9}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="content-save-check"
                      size={20}
                      color={COLORS.white}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={s.saveBtnText}>{t.save}</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ padding: 10 }}
              >
                <Text style={s.discardText}>{t.cancel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  scrollContent: { paddingBottom: 40 },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    ...SHADOWS.md,
  },
  decCircleLg: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: COLORS.primaryLight,
    top: -80,
    right: -60,
    opacity: 0.4,
  },
  decCircleSm: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.accent,
    bottom: -40,
    left: -20,
    opacity: 0.2,
  },

  topNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    ...SHADOWS.sm,
  },
  langGroup: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 3,
  },
  langBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  langBtnActive: { backgroundColor: COLORS.white },
  langText: { fontSize: 10, fontWeight: "700", color: "rgba(255,255,255,0.7)" },
  langTextActive: { color: COLORS.primary },

  headerTitleWrap: { marginTop: 10 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.5,
  },

  hintBox: {
    backgroundColor: COLORS.goldLight,
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  hintText: { color: "#8D6E63", fontSize: 12, fontWeight: "600" },

  skillInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  skillInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    marginRight: 10,
  },
  skillInput: { flex: 1, fontSize: 14, color: COLORS.text },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.sm,
  },
  suggestLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap" },
  suggestChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestChipText: { fontSize: 12, fontWeight: "600", color: COLORS.primary },

  saveSection: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 18,
    width: "100%",
    ...SHADOWS.md,
  },
  saveBtnLoading: { opacity: 0.8 },
  saveBtnText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  discardText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: "600",
    textDecorationLine: "underline",
    marginTop: 10,
  },
});
