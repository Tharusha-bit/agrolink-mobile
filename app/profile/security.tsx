import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
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
  errorBg: "#FFF0F0",
  success: "#2E7D32",
  successBg: "#F1F8E9",
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

// ─── Translations ──────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    headerTitle: "Security Settings",
    headerSub: "Change your password to keep your account safe",
    cardTitle: "Update Credentials",
    curPass: "Current Password",
    curPassHint: "Enter current password",
    newPass: "New Password",
    newPassHint: "Enter new password",
    confPass: "Confirm New Password",
    confPassHint: "Re-type new password",
    reqLength: "At least 8 characters",
    reqUpper: "One uppercase letter (A–Z)",
    reqNum: "One number (0–9)",
    reqSpec: "One special character (!@#…)",
    strLabel: "Password strength",
    strWeak: "Weak",
    strFair: "Fair",
    strGood: "Good",
    strStrong: "Strong",
    matchYes: "Passwords match",
    matchNo: "Passwords do not match",
    agreeTitle: "I understand",
    agreeSub:
      "My current password will no longer work after this change. I will need to use the new password to log in.",
    updateBtn: "Update Password",
    cancelBtn: "Cancel & Go Back",
    updating: "Updating...",
    errCurReq: "Current password is required",
    errNewReq: "New password is required",
    errReqFail: "Password does not meet all requirements",
    errConfReq: "Please confirm your new password",
    errMatch: "Passwords do not match",
    errAgree: "You must acknowledge this change before continuing",
    errWrongCur: "The current password you entered is incorrect.",
    successTitle: "Password Updated ✓",
    successBody:
      "Your new password is active. Please use it next time you log in.",
    errTitle: "Error",
    errBody: "Something went wrong. Please try again.",
  },
  si: {
    headerTitle: "ආරක්ෂක සැකසුම්",
    headerSub: "ගිණුම ආරක්ෂිතව තබා ගැනීමට මුරපදය වෙනස් කරන්න",
    cardTitle: "අක්තපත්‍ර යාවත්කාලීන කරන්න",
    curPass: "වත්මන් මුරපදය",
    curPassHint: "වත්මන් මුරපදය ඇතුළත් කරන්න",
    newPass: "නව මුරපදය",
    newPassHint: "නව මුරපදය ඇතුළත් කරන්න",
    confPass: "නව මුරපදය තහවුරු කරන්න",
    confPassHint: "නව මුරපදය නැවත ඇතුළත් කරන්න",
    reqLength: "අවම වශයෙන් අක්ෂර 8 ක්",
    reqUpper: "එක් කැපිටල් අකුරක් (A-Z)",
    reqNum: "එක් අංකයක් (0-9)",
    reqSpec: "එක් විශේෂ සංකේතයක් (!@#…)",
    strLabel: "මුරපදයේ ප්‍රබලත්වය",
    strWeak: "දුර්වලයි",
    strFair: "සාමාන්‍යයි",
    strGood: "හොඳයි",
    strStrong: "ප්‍රබලයි",
    matchYes: "මුරපද ගැළපේ",
    matchNo: "මුරපද නොගැළපේ",
    agreeTitle: "මට වැටහේ",
    agreeSub:
      "මගේ වත්මන් මුරපදය මින් ඉදිරියට ක්‍රියා නොකරයි. ඊළඟ වතාවේ පිවිසීමට නව මුරපදය භාවිතා කළ යුතුය.",
    updateBtn: "මුරපදය යාවත්කාලීන කරන්න",
    cancelBtn: "අවලංගු කර ආපසු යන්න",
    updating: "යාවත්කාලීන කරමින්...",
    errCurReq: "වත්මන් මුරපදය අවශ්‍යයි",
    errNewReq: "නව මුරපදය අවශ්‍යයි",
    errReqFail: "මුරපදය සියලුම අවශ්‍යතා සපුරාලන්නේ නැත",
    errConfReq: "කරුණාකර නව මුරපදය තහවුරු කරන්න",
    errMatch: "මුරපද නොගැළපේ",
    errAgree: "ඉදිරියට යාමට පෙර ඔබ මෙය පිළිගත යුතුය",
    errWrongCur: "ඔබ ඇතුළත් කළ වත්මන් මුරපදය වැරදියි.",
    successTitle: "සාර්ථකයි ✓",
    successBody:
      "ඔබේ නව මුරපදය සක්‍රියයි. කරුණාකර ඊළඟ වතාවේ පිවිසීමේදී එය භාවිතා කරන්න.",
    errTitle: "දෝෂයකි",
    errBody: "යමක් වැරදී ඇත. කරුණාකර නැවත උත්සාහ කරන්න.",
  },
  ta: {
    headerTitle: "பாதுகாப்பு அமைப்புகள்",
    headerSub: "கணக்கை பாதுகாப்பாக வைக்க கடவுச்சொல்லை மாற்றவும்",
    cardTitle: "சான்றுகளைப் புதுப்பிக்கவும்",
    curPass: "தற்போதைய கடவுச்சொல்",
    curPassHint: "தற்போதைய கடவுச்சொல்லை உள்ளிடவும்",
    newPass: "புதிய கடவுச்சொல்",
    newPassHint: "புதிய கடவுச்சொல்லை உள்ளிடவும்",
    confPass: "உறுதிப்படுத்தவும்",
    confPassHint: "மீண்டும் உள்ளிடவும்",
    reqLength: "குறைந்தது 8 எழுத்துக்கள்",
    reqUpper: "ஒரு பெரிய எழுத்து (A-Z)",
    reqNum: "ஒரு எண் (0-9)",
    reqSpec: "ஒரு சிறப்பு குறியீடு (!@#…)",
    strLabel: "வலிமை",
    strWeak: "பலவீனம்",
    strFair: "நியாயமான",
    strGood: "நல்ல",
    strStrong: "வலுவான",
    matchYes: "பொருந்துகின்றன",
    matchNo: "பொருந்தவில்லை",
    agreeTitle: "நான் புரிகிறேன்",
    agreeSub:
      "எனது தற்போதைய கடவுச்சொல் இனி வேலை செய்யாது. நான் புதிய கடவுச்சொல்லைப் பயன்படுத்த வேண்டும்.",
    updateBtn: "புதுப்பிக்கவும்",
    cancelBtn: "ரத்துசெய்",
    updating: "புதுப்பிக்கிறது...",
    errCurReq: "தற்போதைய கடவுச்சொல் தேவை",
    errNewReq: "புதிய கடவுச்சொல் தேவை",
    errReqFail: "அனைத்து தேவைகளையும் பூர்த்தி செய்யவில்லை",
    errConfReq: "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    errMatch: "கடவுச்சொற்கள் பொருந்தவில்லை",
    errAgree: "தொடர்வதற்கு முன் நீங்கள் இதை ஏற்க வேண்டும்",
    errWrongCur: "தற்போதைய கடவுச்சொல் தவறானது.",
    successTitle: "வெற்றி ✓",
    successBody: "உங்கள் புதிய கடவுச்சொல் செயலில் உள்ளது.",
    errTitle: "பிழை",
    errBody: "ஏதோ தவறு நடந்துவிட்டது. மீண்டும் முயற்சிக்கவும்.",
  },
};

// ─── Password Strength Logic ───────────────────────────────────────────────────
const getRequirements = (t: any) => [
  { key: "length", label: t.reqLength, test: (p: string) => p.length >= 8 },
  { key: "upper", label: t.reqUpper, test: (p: string) => /[A-Z]/.test(p) },
  { key: "number", label: t.reqNum, test: (p: string) => /[0-9]/.test(p) },
  {
    key: "special",
    label: t.reqSpec,
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
];

const getStrength = (password: string, t: any) => {
  const passed = getRequirements(t).filter((r) => r.test(password)).length;
  if (passed === 0) return { score: 0, label: "", color: COLORS.border };
  if (passed === 1) return { score: 1, label: t.strWeak, color: COLORS.error };
  if (passed === 2)
    return { score: 2, label: t.strFair, color: COLORS.accentWarm };
  if (passed === 3) return { score: 3, label: t.strGood, color: "#8BC34A" };
  return { score: 4, label: t.strStrong, color: COLORS.accent };
};

// ─── Reusable: Animated Password Field ────────────────────────────────────────
interface SecureFieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  icon: string;
  error?: string;
}

const SecureField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
}: SecureFieldProps) => {
  const [visible, setVisible] = useState(false);
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
  const labelColor = error
    ? COLORS.error
    : focused
      ? COLORS.primary
      : COLORS.textSecondary;

  return (
    <View style={sf.wrap}>
      <Text style={[sf.label, { color: labelColor }]}>{label}</Text>
      <Animated.View
        style={[
          sf.inputWrap,
          { borderColor: error ? COLORS.error : borderColor },
          error && { backgroundColor: COLORS.errorBg },
        ]}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={18}
          color={
            error ? COLORS.error : focused ? COLORS.primary : COLORS.textMuted
          }
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={sf.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? "••••••••"}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={!visible}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setVisible((v) => !v)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={18}
            color={COLORS.textMuted}
          />
        </TouchableOpacity>
      </Animated.View>
      {error ? (
        <View style={sf.errorRow}>
          <Ionicons name="alert-circle" size={13} color={COLORS.error} />
          <Text style={sf.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};
const sf = StyleSheet.create({
  wrap: { marginBottom: 18 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
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
    height: 52,
  },
  input: { flex: 1, fontSize: 15, color: COLORS.text, letterSpacing: 1 },
  errorRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  errorText: {
    fontSize: 11.5,
    color: COLORS.error,
    marginLeft: 4,
    fontWeight: "600",
  },
});

// ─── Reusable Components ──────────────────────────────────────────────────
const StrengthMeter = ({ password, t }: { password: string; t: any }) => {
  const { score, label, color } = getStrength(password, t);
  if (!password) return null;
  return (
    <View style={sm.wrap}>
      <View style={sm.barRow}>
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            style={[
              sm.seg,
              { backgroundColor: step <= score ? color : COLORS.border },
              step < 4 && { marginRight: 5 },
            ]}
          />
        ))}
      </View>
      <View style={sm.labelRow}>
        <Text style={sm.labelLeft}>{t.strLabel}</Text>
        <Text style={[sm.labelRight, { color }]}>{label}</Text>
      </View>
    </View>
  );
};
const sm = StyleSheet.create({
  wrap: { marginBottom: 18 },
  barRow: { flexDirection: "row", marginBottom: 6 },
  seg: { flex: 1, height: 6, borderRadius: 3 },
  labelRow: { flexDirection: "row", justifyContent: "space-between" },
  labelLeft: { fontSize: 11.5, color: COLORS.textMuted },
  labelRight: { fontSize: 11.5, fontWeight: "700" },
});

const RequirementsList = ({ password, t }: { password: string; t: any }) => {
  if (!password) return null;
  return (
    <View style={rl.wrap}>
      {getRequirements(t).map((req) => {
        const met = req.test(password);
        return (
          <View key={req.key} style={rl.row}>
            <View
              style={[
                rl.dot,
                { backgroundColor: met ? COLORS.accent : COLORS.border },
              ]}
            >
              <Ionicons
                name={met ? "checkmark" : "remove"}
                size={10}
                color={COLORS.white}
              />
            </View>
            <Text
              style={[
                rl.text,
                met && { color: COLORS.success, fontWeight: "600" },
              ]}
            >
              {req.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
const rl = StyleSheet.create({
  wrap: {
    marginBottom: 20,
    padding: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    gap: 8,
  },
  row: { flexDirection: "row", alignItems: "center" },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  text: { fontSize: 12.5, color: COLORS.textMuted },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SecurityScreen() {
  const router = useRouter();

  // Translation State
  const [lang, setLang] = useState<"en" | "si" | "ta">("en");
  const t = TRANSLATIONS[lang];

  // State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!currentPassword) e.current = t.errCurReq;
    if (!newPassword) e.new = t.errNewReq;
    else {
      const { score } = getStrength(newPassword, t);
      if (score < 4) e.new = t.errReqFail;
    }
    if (!confirmPassword) e.confirm = t.errConfReq;
    else if (newPassword !== confirmPassword) e.confirm = t.errMatch;
    if (!agree) e.agree = t.errAgree;
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});

    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("No user ID found");

      // ⚠️ UPDATE THIS IP TO YOUR LAPTOP'S WI-FI IP
      const API_URL = "http://172.20.10.6:8080";

      const payload = {
        currentPassword: currentPassword,
        newPassword: newPassword,
      };

      const response = await axios.put(
        `${API_URL}/api/users/${userId}/password`,
        payload,
      );

      if (response.status === 200) {
        Alert.alert(t.successTitle, t.successBody, [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setErrors({ current: t.errWrongCur });
      } else {
        Alert.alert(t.errTitle, t.errBody);
      }
    } finally {
      setLoading(false);
    }
  };

  const allRequirementsMet = getRequirements(t).every((r) =>
    r.test(newPassword),
  );
  const canSubmit =
    currentPassword &&
    allRequirementsMet &&
    confirmPassword === newPassword &&
    agree;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <View style={s.decLg} />
        <View style={s.decSm} />

        <View style={s.topNavRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={s.backBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
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

        <View style={s.headerBody}>
          <View style={s.shieldWrap}>
            <MaterialCommunityIcons
              name="shield-lock"
              size={36}
              color={COLORS.white}
            />
          </View>
          <Text style={s.headerTitle}>{t.headerTitle}</Text>
          <Text style={s.headerSubtitle}>{t.headerSub}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── PASSWORD CARD ───────────────────────────────────────────────── */}
        <View style={[s.card, SHADOWS.md]}>
          <View style={s.cardTitleRow}>
            <View style={s.cardTitlePill} />
            <Text style={s.cardTitle}>{t.cardTitle}</Text>
          </View>

          <SecureField
            label={t.curPass}
            placeholder={t.curPassHint}
            value={currentPassword}
            onChangeText={(v) => {
              setCurrentPassword(v);
              setErrors((e) => ({ ...e, current: "" }));
            }}
            icon="lock-outline"
            error={errors.current}
          />
          <SecureField
            label={t.newPass}
            placeholder={t.newPassHint}
            value={newPassword}
            onChangeText={(v) => {
              setNewPassword(v);
              setErrors((e) => ({ ...e, new: "" }));
            }}
            icon="lock-reset"
            error={errors.new}
          />

          <StrengthMeter password={newPassword} t={t} />
          <RequirementsList password={newPassword} t={t} />

          <SecureField
            label={t.confPass}
            placeholder={t.confPassHint}
            value={confirmPassword}
            onChangeText={(v) => {
              setConfirmPassword(v);
              setErrors((e) => ({ ...e, confirm: "" }));
            }}
            icon="lock-check-outline"
            error={errors.confirm}
          />

          {confirmPassword && newPassword && (
            <View
              style={[
                s.matchRow,
                {
                  backgroundColor:
                    confirmPassword === newPassword
                      ? COLORS.successBg
                      : COLORS.errorBg,
                },
              ]}
            >
              <Ionicons
                name={
                  confirmPassword === newPassword
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={15}
                color={
                  confirmPassword === newPassword
                    ? COLORS.success
                    : COLORS.error
                }
              />
              <Text
                style={[
                  s.matchText,
                  {
                    color:
                      confirmPassword === newPassword
                        ? COLORS.success
                        : COLORS.error,
                  },
                ]}
              >
                {confirmPassword === newPassword ? t.matchYes : t.matchNo}
              </Text>
            </View>
          )}
        </View>

        {/* ── ACKNOWLEDGEMENT CARD ─────────────────────────────────────────── */}
        <View style={[s.card, SHADOWS.sm, { marginTop: 0 }]}>
          <TouchableOpacity
            style={s.agreeRow}
            onPress={() => {
              setAgree((v) => !v);
              setErrors((e) => ({ ...e, agree: "" }));
            }}
            activeOpacity={0.75}
          >
            <View style={[s.toggleBox, agree && s.toggleBoxActive]}>
              {agree && (
                <Ionicons name="checkmark" size={16} color={COLORS.white} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.agreeTitle}>{t.agreeTitle}</Text>
              <Text style={s.agreeSubtitle}>{t.agreeSub}</Text>
            </View>
          </TouchableOpacity>
          {errors.agree ? (
            <View style={s.agreeErrorRow}>
              <Ionicons name="alert-circle" size={13} color={COLORS.error} />
              <Text style={s.agreeErrorText}>{errors.agree}</Text>
            </View>
          ) : null}
        </View>

        {/* ── CTA BUTTON ───────────────────────────────────────────────────── */}
        <View style={s.ctaSection}>
          <TouchableOpacity
            style={[s.saveBtn, (!canSubmit || loading) && s.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!canSubmit || loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={20}
                  color={COLORS.white}
                  style={{ marginRight: 10 }}
                />
                <Text style={s.saveBtnText}>{t.updateBtn}</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginTop: 16 }}
          >
            <Text style={s.cancelText}>{t.cancelBtn}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Screen Styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.surface },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
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
  topNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 18,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
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
  headerBody: { alignItems: "center" },
  shieldWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.72)",
    textAlign: "center",
    lineHeight: 19,
  },
  scrollContent: { paddingTop: 24, paddingBottom: 60 },
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitlePill: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 4,
    gap: 6,
  },
  matchText: { fontSize: 12.5, fontWeight: "600" },
  agreeRow: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  toggleBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  toggleBoxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  agreeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  agreeSubtitle: { fontSize: 12.5, color: COLORS.textMuted, lineHeight: 18 },
  agreeErrorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },
  agreeErrorText: { fontSize: 11.5, color: COLORS.error, fontWeight: "600" },
  ctaSection: { marginHorizontal: 20, alignItems: "center" },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 16,
    width: "100%",
    ...SHADOWS.md,
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  cancelText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
