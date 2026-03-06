import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
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

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const COLORS = {
  primary: "#216000",
  primaryLight: "#2E8B00",
  primaryPale: "#E8F5E1",
  white: "#FFFFFF",
  surface: "#F7F9F4",
  text: "#1A2E0D",
  textSecondary: "#5C7A4A",
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
  secureTextEntry?: boolean;
  keyboardType?: "default" | "phone-pad" | "numeric";
  value: string; // ✅ Added value
  onChangeText: (text: string) => void; // ✅ Added onChangeText
}

const SignupInput = ({
  label,
  placeholder,
  icon,
  secureTextEntry = false,
  keyboardType = "default",
  value,
  onChangeText,
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
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={secureTextEntry ? "none" : "words"}
        value={value} // ✅ Bind state
        onChangeText={onChangeText} // ✅ Bind state
      />
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SignupScreen() {
  const router = useRouter();
  const [isFarmer, setIsFarmer] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ Add state for all inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ REAL API CALL
  const handleSignup = async () => {
    // 1. Basic validation
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !nic ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // ⚠️ UPDATE THIS IP TO YOUR CURRENT LAPTOP IP
      const API_URL = "http://172.20.10.6:8080/api/auth/register";

      const userData = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        nic: nic,
        password: password,
        role: isFarmer ? "FARMER" : "INVESTOR",
      };

      const response = await axios.post(API_URL, userData);

      if (response.status === 200) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "Continue", onPress: () => router.replace("/(tabs)/home") },
        ]);
      }
    } catch (error: any) {
      if (error.response) {
        Alert.alert(
          "Registration Failed",
          error.response.data || "User might already exist.",
        );
      } else {
        Alert.alert(
          "Network Error",
          "Check your IP address and ensure the backend is running.",
        );
      }
    } finally {
      setLoading(false);
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
          <View style={s.header}>
            <View style={s.decCircle} />
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <View style={s.logoSection}>
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

          <View style={[s.card, SHADOWS.md]}>
            <Text style={s.cardTitle}>Create Account</Text>

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
                  Farmer
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
                  Investor
                </Text>
              </TouchableOpacity>
            </View>

            <View style={s.rowInputs}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <SignupInput
                  label="First Name"
                  placeholder="John"
                  icon="account-outline"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={{ flex: 1 }}>
                <SignupInput
                  label="Last Name"
                  placeholder="Doe"
                  icon="account-outline"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <SignupInput
              label="Phone Number"
              placeholder="077 123 4567"
              icon="phone-outline"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <SignupInput
              label="NIC Number"
              placeholder="99xxxxxxxV"
              icon="card-account-details-outline"
              value={nic}
              onChangeText={setNic}
            />
            <SignupInput
              label="Password"
              placeholder="••••••••"
              icon="lock-outline"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <SignupInput
              label="Confirm Password"
              placeholder="••••••••"
              icon="lock-check-outline"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {isFarmer && (
              <View style={s.uploadContainer}>
                <Text style={s.inputLabel}>Grama Niladari Certificate</Text>
                <TouchableOpacity style={s.uploadBox} activeOpacity={0.7}>
                  <MaterialCommunityIcons
                    name="cloud-upload-outline"
                    size={28}
                    color={COLORS.primary}
                  />
                  <Text style={s.uploadTitle}>Tap to upload document</Text>
                  <Text style={s.uploadSubtitle}>
                    JPG, PNG or PDF (Max 5MB)
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ✅ Updated Button to trigger API call */}
            <TouchableOpacity
              style={s.signupBtn}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.signupBtnText}>Sign Up</Text>
              )}
              {!loading && (
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={20}
                  color={COLORS.white}
                />
              )}
            </TouchableOpacity>

            <View style={s.footer}>
              <Text style={s.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={s.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ... styles remain exactly the same
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.surface },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  header: {
    backgroundColor: COLORS.primary,
    height: 280,
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
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  logo: { width: 55, height: 55 },
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
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: -30,
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
  rowInputs: { flexDirection: "row", justifyContent: "space-between" },
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
  uploadContainer: { marginBottom: 20 },
  uploadBox: {
    backgroundColor: COLORS.primaryPale,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    borderStyle: "dashed",
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 8,
  },
  uploadSubtitle: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4 },
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
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { color: COLORS.textMuted, fontSize: 14 },
  loginLink: { color: COLORS.primary, fontWeight: "700", fontSize: 14 },
});
