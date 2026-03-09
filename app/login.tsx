import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
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
  white: "#FFFFFF",
  surface: "#F7F9F4",
  text: "#1A2E0D",
  textMuted: "#9BB08A",
  border: "#DDE8D4",
  success: "#2E7D32",
  danger: "#D32F2F",
};

const SHADOWS = {
  md: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
    },
    android: { elevation: 6 },
  }),
};

// ─── Translations Dictionary ───────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    welcome: "Welcome Back",
    sub: "Sign in to manage your investments",
    phone: "Phone Number",
    pass: "Password",
    stay: "Stay logged in",
    forgot: "Forgot Password?",
    loginBtn: "Login",
    noAccount: "Don't have an account? ",
    signUp: "Sign Up",
    tagline: "Future of Agri-Finance",
    errEmpty: "Please enter phone number and password",
    errFail: "Invalid credentials",
    success: "Login Successful",
  },
  si: {
    welcome: "ආපසු සාදරයෙන් පිළිගනිමු",
    sub: "ඔබගේ ගිණුමට පුරනය වන්න",
    phone: "දුරකථන අංකය",
    pass: "මුරපදය",
    stay: "පුරනය වී සිටින්න",
    forgot: "මුරපදය අමතකද?",
    loginBtn: "පුරනය වන්න",
    noAccount: "ගිණුමක් නැද්ද? ",
    signUp: "ලියාපදිංචි වන්න",
    tagline: "කෘෂි-මූල්‍යයේ අනාගතය",
    errEmpty: "කරුණාකර අංකය සහ මුරපදය ඇතුළත් කරන්න",
    errFail: "මුරපදය වැරදියි",
    success: "සාර්ථකව පුරනය විය",
  },
  ta: {
    welcome: "மீண்டும் வருக",
    sub: "உள்நுழையவும்",
    phone: "தொலைபேசி எண்",
    pass: "கடவுச்சொல்",
    stay: "உள்நுழைந்திருக்கவும்",
    forgot: "கடவுச்சொல் மறந்துவிட்டதா?",
    loginBtn: "உள்நுழைக",
    noAccount: "கணக்கு இல்லையா? ",
    signUp: "பதிவு செய்க",
    tagline: "விவசாய நிதியின் எதிர்காலம்",
    errEmpty: "எண் மற்றும் கடவுச்சொல்லை உள்ளிடவும்",
    errFail: "தவறான கடவுச்சொல்",
    success: "உள்நுழைவு வெற்றி",
  },
};

// ─── Input Component ───────────────────────────────────────────────────────────
const LoginInput = ({
  label,
  placeholder,
  icon,
  secureTextEntry,
  isPassword,
  onTogglePassword,
  visible,
  keyboardType = "default",
  value,
  onChangeText,
}: any) => (
  <View style={s.inputContainer}>
    <Text style={s.inputLabel}>{label}</Text>
    <View style={s.inputWrapper}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={COLORS.primary}
        style={s.inputIcon}
      />
      <TextInput
        style={s.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
      />
      {isPassword && (
        <TouchableOpacity onPress={onTogglePassword}>
          <Ionicons
            name={visible ? "eye-off" : "eye"}
            size={20}
            color={COLORS.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const router = useRouter();

  // Language State
  const [lang, setLang] = useState<"en" | "si" | "ta">("en");
  const t = TRANSLATIONS[lang];

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const toastAnim = useRef(new Animated.Value(-100)).current;
  const [toastConfig, setToastConfig] = useState({
    message: "",
    type: "success",
  });

  const showToast = (
    message: string,
    type: "success" | "error",
    callback?: () => void,
  ) => {
    setToastConfig({ message, type });
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: Platform.OS === "ios" ? 55 : 30,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      showToast(t.errEmpty, "error");
      return;
    }

    setLoading(true);

    try {
      const API_URL = "http://172.20.10.6:8080/api/auth/login";

      const response = await axios.post(API_URL, { phoneNumber, password });

      if (response.status === 200) {
        const userRole = response.data.role;
        const firstName = response.data.firstName;
        const userId = response.data.userId; // ✅ Get ID from database

        // ✅ SAVE TO PHONE MEMORY
        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("firstName", firstName || "Farmer");
        await AsyncStorage.setItem("userRole", userRole);

        showToast(t.success, "success", () => {
          if (userRole === "FARMER") {
            router.replace("/farmer/farmerhome" as any);
          } else {
            router.replace("/investor/home" as any);
          }
        });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        showToast(t.errFail, "error");
      } else if (error.response && error.response.status === 404) {
        showToast(t.noAccount, "error");
      } else {
        showToast("Server connection error.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <Animated.View
        style={[
          s.toastContainer,
          {
            transform: [{ translateY: toastAnim }],
            backgroundColor:
              toastConfig.type === "error" ? COLORS.danger : COLORS.success,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={toastConfig.type === "error" ? "alert-circle" : "check-circle"}
          size={22}
          color={COLORS.white}
        />
        <Text style={s.toastText}>{toastConfig.message}</Text>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.header}>
            <View style={s.decCircle} />

            <View style={s.langSwitcher}>
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

            <View style={s.logoSection}>
              <View style={s.logoBadge}>
                <Image
                  source={require("../src/assets/logo.png")}
                  style={s.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={s.appName}>AgroLink</Text>
              <Text style={s.tagline}>{t.tagline}</Text>
            </View>
          </View>

          <View style={[s.card, SHADOWS.md]}>
            <Text style={s.cardTitle}>{t.welcome}</Text>
            <Text style={s.cardSub}>{t.sub}</Text>

            <LoginInput
              label={t.phone}
              placeholder="077 123 4567"
              icon="phone-outline"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <LoginInput
              label={t.pass}
              placeholder="••••••••"
              icon="lock-outline"
              secureTextEntry={!passwordVisible}
              isPassword={true}
              visible={passwordVisible}
              onTogglePassword={() => setPasswordVisible(!passwordVisible)}
              value={password}
              onChangeText={setPassword}
            />

            <View style={s.optionsRow}>
              <TouchableOpacity
                style={s.checkboxContainer}
                onPress={() => setStayLoggedIn(!stayLoggedIn)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={
                    stayLoggedIn ? "checkbox-marked" : "checkbox-blank-outline"
                  }
                  size={22}
                  color={COLORS.primary}
                />
                <Text style={s.checkboxText}>{t.stay}</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={s.forgotText}>{t.forgot}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={s.loginBtn}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={s.loginBtnText}>{t.loginBtn}</Text>
                  <MaterialCommunityIcons
                    name="login"
                    size={20}
                    color={COLORS.white}
                  />
                </>
              )}
            </TouchableOpacity>

            <View style={s.footer}>
              <Text style={s.footerText}>{t.noAccount}</Text>
              <TouchableOpacity onPress={() => router.push("/signup" as any)}>
                <Text style={s.signupLink}>{t.signUp}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.surface },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },

  toastContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    zIndex: 999,
    elevation: 10,
  },
  toastText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    textAlign: "center",
  },

  header: {
    backgroundColor: COLORS.primary,
    height: 300,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    paddingTop: 60,
    position: "relative",
    overflow: "hidden",
  },
  decCircle: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primaryLight,
    top: -120,
    left: -60,
    opacity: 0.4,
  },

  langSwitcher: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 4,
    zIndex: 10,
  },
  langBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  langBtnActive: { backgroundColor: COLORS.white },
  langText: { fontSize: 12, fontWeight: "700", color: "rgba(255,255,255,0.7)" },
  langTextActive: { color: COLORS.primary },

  logoSection: { alignItems: "center", marginTop: 10 },
  logoBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 8,
  },
  logo: { width: 60, height: 60 },
  appName: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
    letterSpacing: 1,
  },

  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: -50,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 6,
  },
  cardSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: 24,
  },

  inputContainer: { marginBottom: 18 },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: COLORS.text },

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  checkboxText: { fontSize: 13, color: COLORS.text, fontWeight: "500" },
  forgotText: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },

  loginBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: COLORS.textMuted, fontSize: 14 },
  signupLink: { color: COLORS.primary, fontWeight: "700", fontSize: 14 },
});
