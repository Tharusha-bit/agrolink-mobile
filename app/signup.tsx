import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { registerUser } from "../src/lib/auth";
import { useLanguage } from "../src/lib/language";

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

// ─── Input Component ───────────────────────────────────────────────────────────
interface SignupInputProps {
  label: string;
  placeholder: string;
  icon: any;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

interface SelectedUpload {
  name: string;
  uri: string;
}

const SignupInput = ({
  label,
  placeholder,
  icon,
  value,
  onChangeText,
  secureTextEntry = false,
}: SignupInputProps) => (
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
      />
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SignupScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isFarmer, setIsFarmer] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [farmerId, setFarmerId] = useState("");
  const [nic, setNic] = useState("");
  const [gramaSevakaLetter, setGramaSevakaLetter] =
    useState<SelectedUpload | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !nic.trim()
    ) {
      Alert.alert(
        t("signup.missingDetailsTitle"),
        t("signup.missingDetailsMessage"),
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        t("signup.passwordMismatchTitle"),
        t("signup.passwordMismatchMessage"),
      );
      return;
    }

    if (isFarmer && (!farmerId.trim() || !gramaSevakaLetter)) {
      Alert.alert(
        t("signup.verificationRequiredTitle"),
        t("signup.verificationRequiredMessage"),
      );
      return;
    }

    try {
      setSubmitting(true);
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role: isFarmer ? "farmer" : "investor",
        nic: nic.trim(),
        farmerId: isFarmer ? farmerId.trim() : undefined,
      });
      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert(
        t("signup.signupFailed"),
        error instanceof Error
          ? error.message
          : t("signup.unableToCreateAccount"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const pickGramaSevakaLetter = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: ["application/pdf", "image/*"],
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      setGramaSevakaLetter({
        name: asset.name,
        uri: asset.uri,
      });
    } catch {
      Alert.alert(
        t("signup.uploadFailed"),
        t("signup.uploadFailedMessage"),
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
            {/* Decorative Background Circles */}
            <View style={s.decCircle} />

            <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <View style={s.logoSection}>
              {/*  FIX: Logo Badge Container  */}
              <View style={s.logoBadge}>
                <Image
                  source={require("../src/assets/logo.png")}
                  style={s.logo}
                  resizeMode="contain"
                />
              </View>

              <Text style={s.appName}>AgroLink</Text>
              <Text style={s.tagline}>{t("common.tagline")}</Text>
            </View>
          </View>

          {/* ── CARD ── */}
          <View style={[s.card, SHADOWS.md]}>
            <Text style={s.cardTitle}>{t("signup.createAccount")}</Text>

            {/* User Type Toggle */}
            <View style={s.toggleContainer}>
              <TouchableOpacity
                style={[s.toggleBtn, isFarmer && s.toggleBtnActive]}
                onPress={() => setIsFarmer(true)}
              >
                <MaterialCommunityIcons
                  name="sprout"
                  size={18}
                  color={isFarmer ? COLORS.white : COLORS.textMuted}
                />
                <Text style={[s.toggleText, isFarmer && s.toggleTextActive]}>
                  {t("common.farmer")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.toggleBtn, !isFarmer && s.toggleBtnActive]}
                onPress={() => setIsFarmer(false)}
              >
                <MaterialCommunityIcons
                  name="briefcase-outline"
                  size={18}
                  color={!isFarmer ? COLORS.white : COLORS.textMuted}
                />
                <Text style={[s.toggleText, !isFarmer && s.toggleTextActive]}>
                  {t("common.investor")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Inputs */}
            <SignupInput
              label={t("signup.fullName")}
              placeholder={t("signup.fullNamePlaceholder")}
              icon="account-outline"
              value={name}
              onChangeText={setName}
            />
            <SignupInput
              label={t("signup.email")}
              placeholder={t("login.emailPlaceholder")}
              icon="email-outline"
              value={email}
              onChangeText={setEmail}
            />
            <SignupInput
              label={t("signup.password")}
              placeholder="••••••••"
              icon="lock-outline"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <SignupInput
              label={t("signup.confirmPassword")}
              placeholder="••••••••"
              icon="lock-check-outline"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            {isFarmer ? (
              <>
                <SignupInput
                  label={t("signup.farmerId")}
                  placeholder="FM-2024-XXX"
                  icon="identifier"
                  value={farmerId}
                  onChangeText={setFarmerId}
                />
                <SignupInput
                  label={t("signup.nic")}
                  placeholder="99xxxxxxxV"
                  icon="card-account-details-outline"
                  value={nic}
                  onChangeText={setNic}
                />

                <View style={s.uploadSection}>
                  <Text style={s.uploadTitle}>{t("signup.verificationUploads")}</Text>
                  <Text style={s.uploadHint}>
                    {t("signup.uploadHint")}
                  </Text>

                  <TouchableOpacity
                    style={s.uploadCard}
                    onPress={pickGramaSevakaLetter}
                  >
                    <View style={s.uploadIconWrap}>
                      <MaterialCommunityIcons
                        name="file-document-outline"
                        size={22}
                        color={COLORS.primary}
                      />
                    </View>
                    <View style={s.uploadContent}>
                      <Text style={s.uploadLabel}>{t("signup.gramaSevakaLetter")}</Text>
                      <Text style={s.uploadValue}>
                        {gramaSevakaLetter
                          ? gramaSevakaLetter.name
                          : t("signup.uploadPdfOrImage")}
                      </Text>
                    </View>
                    {gramaSevakaLetter ? (
                      <TouchableOpacity
                        style={s.removeUploadBtn}
                        onPress={() => setGramaSevakaLetter(null)}
                      >
                        <MaterialCommunityIcons
                          name="close"
                          size={18}
                          color={COLORS.primary}
                        />
                        <Text style={s.removeUploadText}>{t("signup.remove")}</Text>
                      </TouchableOpacity>
                    ) : (
                      <MaterialCommunityIcons
                        name="upload"
                        size={20}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <SignupInput
                label={t("signup.nic")}
                placeholder="99xxxxxxxV"
                icon="card-account-details-outline"
                value={nic}
                onChangeText={setNic}
              />
            )}

            {/* Signup Button */}
            <TouchableOpacity
              style={s.signupBtn}
              onPress={handleSignup}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={s.signupBtnText}>{t("signup.signUp")}</Text>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={20}
                    color={COLORS.white}
                  />
                </>
              )}
            </TouchableOpacity>

            <View style={s.footer}>
              <Text style={s.footerText}>{t("signup.alreadyHaveAccount")} </Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={s.loginLink}>{t("signup.login")}</Text>
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

  /* HEADER STYLES */
  header: {
    backgroundColor: COLORS.primary,
    height: 280, // Made slightly taller to fit the new badge
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    paddingTop: 50,
    position: "relative",
    overflow: "hidden",
  },
  decCircle: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primaryLight,
    top: -100,
    right: -80,
    opacity: 0.4,
  },
  backBtn: { position: "absolute", top: 50, left: 20, padding: 8, zIndex: 10 },

  logoSection: { alignItems: "center", marginTop: 10 },

  /*  NEW LOGO BADGE STYLE  */
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40, // Makes it a perfect circle
    backgroundColor: "#ffffff", // White background to blend with the image
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    // Add Shadow to make it pop
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  logo: {
    width: 55, // Smaller than container so it has "padding"
    height: 55,
  },

  appName: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
    letterSpacing: 1,
  },

  /* CARD STYLES */
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: -30, // Negative margin to overlap
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 20,
  },

  /* TOGGLE */
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  toggleBtnActive: { backgroundColor: COLORS.primary },
  toggleText: { fontSize: 14, fontWeight: "600", color: COLORS.textMuted },
  toggleTextActive: { color: COLORS.white },

  /* INPUTS */
  inputContainer: { marginBottom: 16 },
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
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: COLORS.text },

  /* UPLOADS */
  uploadSection: {
    backgroundColor: COLORS.primaryPale,
    borderRadius: 18,
    padding: 16,
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  uploadHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 14,
  },
  uploadCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    gap: 12,
  },
  uploadIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryPale,
  },
  uploadContent: {
    flex: 1,
  },
  removeUploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primaryPale,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  removeUploadText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "800",
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  uploadValue: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  /* BUTTON */
  signupBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
    elevation: 4,
  },
  signupBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  /* FOOTER */
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { color: COLORS.textMuted, fontSize: 14 },
  loginLink: { color: COLORS.primary, fontWeight: "700", fontSize: 14 },
});
