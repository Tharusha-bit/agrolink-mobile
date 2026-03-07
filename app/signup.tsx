import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
  primary: "#216000", // Deep Forest Green
  primaryLight: "#2E8B00",
  primaryPale: "#E8F5E1",
  white: "#FFFFFF",
  surface: "#F7F9F4",
  text: "#1A2E0D",
  textMuted: "#9BB08A",
  border: "#DDE8D4",
  accent: "#76C442",
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
}

interface SelectedUpload {
  name: string;
  uri: string;
}

const SignupInput = ({
  label,
  placeholder,
  icon,
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
  const [isFarmer, setIsFarmer] = useState(true);
  const [farmerPhoto, setFarmerPhoto] = useState<SelectedUpload | null>(null);
  const [gramaSevakaLetter, setGramaSevakaLetter] =
    useState<SelectedUpload | null>(null);

  // ─── Logic: Handle Routing based on Role ───
  const handleSignup = () => {
    if (isFarmer) {
      // ✅ Route to the Farmer Folder
      router.replace("/farmer/farmerhome");
    } else {
      // ✅ Route to the Investor/Main Tabs
      router.replace("/investor/home");
    }
  };

  // ─── Logic: Image Picker ───
  const pickFarmerPhoto = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission required", "We need access to your photos.");
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setFarmerPhoto({
          name: asset.fileName || "photo.jpg",
          uri: asset.uri,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ─── Logic: Document Picker ───
  const pickGramaSevakaLetter = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: ["application/pdf", "image/*"],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setGramaSevakaLetter({
          name: asset.name,
          uri: asset.uri,
        });
      }
    } catch (error) {
      console.log(error);
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

          {/* ── CARD ── */}
          <View style={[s.card, SHADOWS.md]}>
            <Text style={s.cardTitle}>Create Account</Text>

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

            {/* Inputs */}
            <SignupInput
              label="Username"
              placeholder="sample@email.com"
              icon="email-outline"
            />
            <SignupInput
              label="Password"
              placeholder="••••••••"
              icon="lock-outline"
              secureTextEntry
            />
            <SignupInput
              label="Confirm Password"
              placeholder="••••••••"
              icon="lock-check-outline"
              secureTextEntry
            />

            {isFarmer ? (
              <>
                <SignupInput
                  label="Farmer ID"
                  placeholder="FM-2024-XXX"
                  icon="identifier"
                />
                <SignupInput
                  label="NIC Number"
                  placeholder="99xxxxxxxV"
                  icon="card-account-details-outline"
                />

                <View style={s.uploadSection}>
                  <Text style={s.uploadTitle}>Verification Uploads</Text>
                  <Text style={s.uploadHint}>
                    Add a farmer photo and the Grama Sevaka letter before
                    creating the account.
                  </Text>

                  {/* Photo Upload Button */}
                  <TouchableOpacity
                    style={[
                      s.uploadCard,
                      farmerPhoto && { borderColor: COLORS.accent },
                    ]}
                    onPress={pickFarmerPhoto}
                  >
                    <View
                      style={[
                        s.uploadIconWrap,
                        farmerPhoto && { backgroundColor: COLORS.primaryPale },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={farmerPhoto ? "check" : "image-outline"}
                        size={22}
                        color={COLORS.primary}
                      />
                    </View>
                    <View style={s.uploadContent}>
                      <Text style={s.uploadLabel}>Farmer Photo</Text>
                      <Text
                        style={[
                          s.uploadValue,
                          farmerPhoto && { color: COLORS.primary },
                        ]}
                      >
                        {farmerPhoto ? "Photo Selected" : "Upload image"}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name={
                        farmerPhoto ? "checkbox-marked-circle" : "cloud-upload"
                      }
                      size={20}
                      color={farmerPhoto ? COLORS.primary : COLORS.textMuted}
                    />
                  </TouchableOpacity>

                  {/* Document Upload Button */}
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
                        name={gramaSevakaLetter ? "check" : "file-document-outline"}
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
              </>
            ) : (
              <SignupInput
                label="NIC Number"
                placeholder="99xxxxxxxV"
                icon="card-account-details-outline"
              />
            )}

            {/* Signup Button (Now Calls Logic) */}
            <TouchableOpacity style={s.signupBtn} onPress={handleSignup}>
              <Text style={s.signupBtnText}>Sign Up</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color={COLORS.white}
              />
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

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.surface },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },

  /* HEADER STYLES */
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

  /* LOGO BADGE STYLE */
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
  logo: {
    width: 55,
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
    marginBottom: 4,
  },
  uploadHint: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
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
  uploadContent: {
    flex: 1,
  },
  uploadLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  uploadValue: {
    fontSize: 11,
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