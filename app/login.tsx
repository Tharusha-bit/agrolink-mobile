import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { demoAccounts, getSession, loginUser, UserRole } from "../src/lib/auth";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const COLORS = {
  primary: "#216000", // Deep Forest Green
  primaryLight: "#2E8B00",
  primaryPale: "#E8F5E1",
  white: "#FFFFFF",
  surface: "#F7F9F4",
  text: "#1A2E0D",
  textMuted: "#9BB08A",
  border: "#DDE8D4",
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

interface LoginInputProps {
  label: string;
  placeholder: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  isPassword?: boolean;
  onTogglePassword?: () => void;
  visible?: boolean;
}

const DEMO_LABELS: Record<UserRole, string> = {
  farmer: "Demo Farmer",
  investor: "Demo Investor",
};

// ─── Reusable Input Component (Local to ensure styling match) ──────────────────
const LoginInput = ({
  label,
  placeholder,
  icon,
  value,
  onChangeText,
  secureTextEntry,
  isPassword,
  onTogglePassword,
  visible,
}: LoginInputProps) => (
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
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
      {/* Password Eye Toggle */}
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

  const [role, setRole] = useState<UserRole>("farmer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const visibleDemoAccounts = demoAccounts.filter(
    (item) => item.user.role === role,
  );

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const session = await getSession();
      if (active && session) {
        router.replace("/(tabs)/dashboard");
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, [router]);

  const applyDemoAccount = (accountEmail: string) => {
    const account = demoAccounts.find((item) => item.user.email === accountEmail);
    if (!account) {
      return;
    }

    setRole(account.user.role);
    setEmail(account.user.email);
    setPassword(account.password);
    setErrorMessage("");
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Enter your email and password to continue.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const result = await loginUser(email, password, role);

      setLoading(false);
      if (!stayLoggedIn) {
        Alert.alert(
          "Signed in",
          `Logged in with ${result.source === "api" ? "backend" : "demo"} account.`,
        );
      }
      router.replace("/(tabs)/dashboard");
    } catch (error) {
      setLoading(false);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in right now.",
      );
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── HEADER ── */}
          <View style={s.header}>
            <View style={s.decCircle} />

            <View style={s.logoSection}>
              {/* Logo Badge (White Circle to fix square image look) */}
              <View style={s.logoBadge}>
                <Image
                  source={require("../src/assets/logo.png")}
                  style={s.logo}
                  resizeMode="contain"
                />
              </View>

              <Text style={s.appName}>AgroLink</Text>
              <Text style={s.tagline}>Future of Agri-Finance</Text>
            </View>
          </View>

          {/* ── LOGIN CARD ── */}
          <View style={[s.card, SHADOWS.md]}>
            <Text style={s.cardTitle}>Welcome Back</Text>
            <Text style={s.cardSub}>Sign in to manage your investments</Text>

            <View style={s.roleToggleContainer}>
              <TouchableOpacity
                style={[
                  s.roleToggleBtn,
                  role === "farmer" && s.roleToggleBtnActive,
                ]}
                onPress={() => setRole("farmer")}
              >
                <MaterialCommunityIcons
                  name="sprout"
                  size={18}
                  color={role === "farmer" ? COLORS.white : COLORS.textMuted}
                />
                <Text
                  style={[
                    s.roleToggleText,
                    role === "farmer" && s.roleToggleTextActive,
                  ]}
                >
                  Farmer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  s.roleToggleBtn,
                  role === "investor" && s.roleToggleBtnActive,
                ]}
                onPress={() => setRole("investor")}
              >
                <MaterialCommunityIcons
                  name="finance"
                  size={18}
                  color={role === "investor" ? COLORS.white : COLORS.textMuted}
                />
                <Text
                  style={[
                    s.roleToggleText,
                    role === "investor" && s.roleToggleTextActive,
                  ]}
                >
                  Investor
                </Text>
              </TouchableOpacity>
            </View>

            <View style={s.demoSection}>
              <Text style={s.demoTitle}>Quick Demo Access</Text>
              <Text style={s.demoSubtitle}>
                {role === "farmer"
                  ? "Three farmer demo accounts"
                  : "Three investor demo accounts"}
              </Text>
              <View style={s.demoList}>
                {visibleDemoAccounts.map((account, index) => (
                  <TouchableOpacity
                    key={account.user.email}
                    style={s.demoCard}
                    onPress={() => applyDemoAccount(account.user.email)}
                  >
                    <Text style={s.demoCardTitle}>
                      {DEMO_LABELS[role]} {index + 1}
                    </Text>
                    <Text style={s.demoCardText}>{account.user.name}</Text>
                    <Text style={s.demoCardText}>{account.user.email}</Text>
                    <Text style={s.demoCardText}>{account.password}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Email Input */}
            <LoginInput
              label="Email Address"
              placeholder="sample@email.com"
              icon="email-outline"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password Input */}
            <LoginInput
              label="Password"
              placeholder="••••••••"
              icon="lock-outline"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              isPassword={true}
              visible={passwordVisible}
              onTogglePassword={() => setPasswordVisible(!passwordVisible)}
            />

            {errorMessage ? (
              <Text style={s.errorText}>{errorMessage}</Text>
            ) : null}

            {/* Checkbox Row */}
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
                <Text style={s.checkboxText}>Stay logged in</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={s.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
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
                  <Text style={s.loginBtnText}>Login</Text>
                  <MaterialCommunityIcons
                    name="login"
                    size={20}
                    color={COLORS.white}
                  />
                </>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View style={s.footer}>
              <Text style={s.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={s.signupLink}>Sign Up</Text>
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

  /* HEADER */
  header: {
    backgroundColor: COLORS.primary,
    height: 300, // Tall header for visual impact
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
  logoSection: { alignItems: "center", marginTop: 10 },

  /* LOGO BADGE */
  logoBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
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

  /* CARD */
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: -50, // Floating effect
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

  roleToggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  roleToggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  roleToggleBtnActive: { backgroundColor: COLORS.primary },
  roleToggleText: { color: COLORS.textMuted, fontSize: 13, fontWeight: "700" },
  roleToggleTextActive: { color: COLORS.white },

  demoSection: {
    backgroundColor: COLORS.primaryPale,
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
  },
  demoTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 10,
  },
  demoSubtitle: { color: COLORS.textMuted, fontSize: 12, marginBottom: 10 },
  demoList: { gap: 10 },
  demoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
  },
  demoCardTitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
  },
  demoCardText: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 16 },

  /* INPUTS */
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
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    fontWeight: "600",
    marginTop: -8,
    marginBottom: 14,
  },

  /* OPTIONS ROW */
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  checkboxText: { fontSize: 13, color: COLORS.text, fontWeight: "500" },
  forgotText: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },

  /* BUTTON */
  loginBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  /* FOOTER */
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: COLORS.textMuted, fontSize: 14 },
  signupLink: { color: COLORS.primary, fontWeight: "700", fontSize: 14 },
});
