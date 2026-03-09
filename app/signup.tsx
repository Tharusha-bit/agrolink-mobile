import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as Location from "expo-location";
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
  textSecondary: "#5C7A4A",
  border: "#DDE8D4",
  accent: "#76C442",
  success: "#2E7D32",
  danger: "#D32F2F", // ✅ Added for input errors
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

// ─── Input Component (Now Supports Errors) ──────────────────────────────────────
interface SignupInputProps {
  label: string;
  placeholder: string;
  icon: any;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "phone-pad" | "numeric";
  value: string;
  onChangeText: (text: string) => void;
  errorMsg?: string; // ✅ Added error prop
}

const SignupInput = ({
  label,
  placeholder,
  icon,
  secureTextEntry = false,
  keyboardType = "default",
  value,
  onChangeText,
  errorMsg,
}: SignupInputProps) => (
  <View style={s.inputContainer}>
    <Text style={s.inputLabel}>{label}</Text>
    <View style={[s.inputWrapper, errorMsg ? s.inputErrorBorder : null]}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={errorMsg ? COLORS.danger : COLORS.primary}
        style={s.inputIcon}
      />
      <TextInput
        style={s.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={secureTextEntry ? "none" : "words"}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
    {/* ✅ Inline Error Message */}
    {errorMsg ? <Text style={s.errorText}>{errorMsg}</Text> : null}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SignupScreen() {
  const router = useRouter();

  const [isFarmer, setIsFarmer] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(""); // ✅ Track password mismatch

  const [gramaSevakaLetter, setGramaSevakaLetter] = useState<any>(null);
  const [locationData, setLocationData] = useState<{
    lat: number;
    lng: number;
    city: string;
  } | null>(null);

  // ✅ Toast State
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
      Animated.delay(2500),
      Animated.timing(toastAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  const fetchLocation = async () => {
    setLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showToast("Location permission denied.", "error");
        setLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let city = "Unknown Location";
      if (address.length > 0) {
        city =
          address[0].city ||
          address[0].district ||
          address[0].subregion ||
          "Detected Location";
      }
      setLocationData({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        city: city,
      });
    } catch (error) {
      showToast("Could not fetch GPS. Ensure location is on.", "error");
    } finally {
      setLoadingLocation(false);
    }
  };

  const pickGramaSevakaLetter = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: ["application/pdf", "image/*"],
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setGramaSevakaLetter({
          name: result.assets[0].name,
          uri: result.assets[0].uri,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignup = async () => {
    setPasswordError(""); // Reset inline error

    // Client validation
    if (!firstName || !lastName || !phoneNumber || !nic || !password) {
      showToast("Please fill in all required details.", "error");
      return;
    }

    // ✅ Trigger inline visual error if passwords don't match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // ⚠️ UPDATE THIS IP
      const API_URL = "http://172.20.10.6:8080/api/auth/register";

      const userData = {
        firstName,
        lastName,
        phoneNumber,
        nic,
        password,
        role: isFarmer ? "FARMER" : "INVESTOR",
        latitude: locationData?.lat,
        longitude: locationData?.lng,
        city: locationData?.city,
      };

      const response = await axios.post(API_URL, userData);

      if (response.status === 200) {
        showToast("Account created successfully!", "success", () => {
          router.replace("/login" as any);
        });
      }
    } catch (error: any) {
      // Professional Server Crash Protection
      if (error.response && error.response.status === 400) {
        showToast("This phone number is already registered.", "error");
      } else {
        showToast("Cannot connect to server. Try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── CUSTOM TOAST ── */}
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
              onChangeText={(val) => {
                setPassword(val);
                setPasswordError("");
              }}
            />

            {/* ✅ Confim Password with Error Warning */}
            <SignupInput
              label="Confirm Password"
              placeholder="••••••••"
              icon="lock-check-outline"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(val) => {
                setConfirmPassword(val);
                setPasswordError("");
              }}
              errorMsg={passwordError}
            />

            {isFarmer && (
              <View style={s.uploadSection}>
                <Text style={s.uploadTitle}>Farm & Identity Verification</Text>

                <TouchableOpacity
                  style={[
                    s.uploadCard,
                    locationData && { borderColor: COLORS.primary },
                  ]}
                  onPress={fetchLocation}
                >
                  <View
                    style={[
                      s.uploadIconWrap,
                      locationData && { backgroundColor: COLORS.primaryPale },
                    ]}
                  >
                    {loadingLocation ? (
                      <ActivityIndicator size="small" color={COLORS.primary} />
                    ) : (
                      <MaterialCommunityIcons
                        name={
                          locationData
                            ? "map-marker-check"
                            : "map-marker-radius"
                        }
                        size={22}
                        color={COLORS.primary}
                      />
                    )}
                  </View>
                  <View style={s.uploadContent}>
                    <Text style={s.uploadLabel}>Farm Location</Text>
                    <Text
                      style={[
                        s.uploadValue,
                        locationData && {
                          color: COLORS.primary,
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {locationData
                        ? `${locationData.city} ✓`
                        : "Tap to auto-detect via GPS"}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    s.uploadCard,
                    gramaSevakaLetter && { borderColor: COLORS.accent },
                  ]}
                  onPress={pickGramaSevakaLetter}
                >
                  <View
                    style={[
                      s.uploadIconWrap,
                      gramaSevakaLetter && {
                        backgroundColor: COLORS.primaryPale,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        gramaSevakaLetter ? "check" : "file-document-outline"
                      }
                      size={22}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={s.uploadContent}>
                    <Text style={s.uploadLabel}>Grama Sevaka Letter</Text>
                    <Text
                      style={[
                        s.uploadValue,
                        gramaSevakaLetter && { color: COLORS.primary },
                      ]}
                    >
                      {gramaSevakaLetter
                        ? "Document Selected"
                        : "Upload PDF or image"}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name={
                      gramaSevakaLetter
                        ? "checkbox-marked-circle"
                        : "cloud-upload"
                    }
                    size={20}
                    color={
                      gramaSevakaLetter ? COLORS.primary : COLORS.textMuted
                    }
                  />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={s.signupBtn}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
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
              <TouchableOpacity onPress={() => router.replace("/login" as any)}>
                <Text style={s.loginLink}>Login</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
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
  inputErrorBorder: {
    borderColor: COLORS.danger,
    borderWidth: 1.5,
    backgroundColor: "#FFF0F0",
  }, // ✅ Red border style
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: COLORS.text },
  errorText: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
    marginLeft: 4,
  }, // ✅ Error text style

  uploadSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
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
    paddingVertical: 12,
    marginBottom: 10,
    gap: 12,
  },
  uploadIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },
  uploadContent: { flex: 1 },
  uploadLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  uploadValue: { fontSize: 11, color: COLORS.textMuted },

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
