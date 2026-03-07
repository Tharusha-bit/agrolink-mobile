import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  primary: '#216000',       
  primaryLight: '#2E8B00',
  primaryPale: '#E8F5E1',
  success: '#2E8B57',
  white: '#FFFFFF',
  surface: '#F7F9F4',
  text: '#1A2E0D',
  textMuted: '#9BB08A',
  border: '#DDE8D4',
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
interface LoginInputProps {
  label: string;
  placeholder: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  secureTextEntry?: boolean;
  isPassword?: boolean;
  onTogglePassword?: () => void;
  visible?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: string;
}

const LoginInput = ({ 
  label, 
  placeholder, 
  icon, 
  secureTextEntry, 
  isPassword, 
  onTogglePassword, 
  visible,
  value,
  onChangeText,
  keyboardType = "default"
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
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType as any}
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
  
  // 🔘 VIVA TOOL: Default to Farmer, but allow switching
  const [userRole, setUserRole] = useState<'FARMER' | 'INVESTOR'>('FARMER');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Toast Animation Setup
  const toastAnim = useRef(new Animated.Value(-100)).current; // Starts hidden above the screen

  const showSuccessToast = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 50,
        duration: 400,
        useNativeDriver: true,
      }), // Slide down
      Animated.delay(1200), // Hold for 1.2 seconds
      Animated.timing(toastAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }), // Slide back up
    ]).start(() => {
      callback(); // Navigate after animation completes
    });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    // Simulate API call
    // try {
    //   const response = await axios.post('/api/login', { email, password, userRole });
    //   // handle success
    // } catch (error) {
    //   Alert.alert("Error", "Invalid credentials");
    //   setLoading(false);
    //   return;
    // }

    setTimeout(() => {
      setLoading(false);
      showSuccessToast(() => {
        // ✅ FIXED ROUTING LOGIC
        if (userRole === 'FARMER') {
          // Go to the Farmer's separate world
          router.replace('/farmer/farmerhome'); 
        } else {
          // Go to the Investor's separate world
          router.replace('/investor/home'); 
        }
      });
    }, 1500);
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── CUSTOM TOAST NOTIFICATION ── */}
      <Animated.View
        style={[s.toastContainer, { transform: [{ translateY: toastAnim }] }]}
      >
        <MaterialCommunityIcons
          name="check-circle"
          size={24}
          color={COLORS.white}
        />
        <Text style={s.toastText}>Login Successful</Text>
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
            <Text style={s.cardTitle}>Welcome Back</Text>
            
            {/* 🔘 VIVA TOGGLE: Switch Roles for Demo */}
            <View style={s.roleSwitcher}>
              <TouchableOpacity onPress={() => setUserRole('FARMER')}>
                <Text style={[s.roleText, userRole === 'FARMER' && s.roleActive]}>Farmer</Text>
              </TouchableOpacity>
              <View style={s.roleDivider} />
              <TouchableOpacity onPress={() => setUserRole('INVESTOR')}>
                <Text style={[s.roleText, userRole === 'INVESTOR' && s.roleActive]}>Investor</Text>
              </TouchableOpacity>
            </View>

            <LoginInput 
              label="Email Address" 
              placeholder="sample@email.com" 
              icon="email-outline" 
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <LoginInput 
              label="Password" 
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
                <Text style={s.checkboxText}>Stay logged in</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={s.forgotText}>Forgot Password?</Text>
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
                  <Text style={s.loginBtnText}>Login as {userRole.charAt(0) + userRole.slice(1).toLowerCase()}</Text>
                  <MaterialCommunityIcons name="login" size={20} color={COLORS.white} />
                </>
              )}
            </TouchableOpacity>

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

  /* ✅ TOAST NOTIFICATION STYLES */
  toastContainer: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: COLORS.success,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    zIndex: 100, // Make sure it sits above everything
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  toastText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },

  scrollContent: { flexGrow: 1, paddingBottom: 40 },
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
  logoSection: { alignItems: 'center', marginTop: 10 },
  logoBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 8,
  },
  logo: { width: 60, height: 60 },
  appName: { fontSize: 32, fontWeight: '900', color: COLORS.white, letterSpacing: -0.5 },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500', letterSpacing: 1 },

  /* CARD */
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: -50,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: 15 },

  /* ROLE SWITCHER (NEW) */
  roleSwitcher: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    backgroundColor: COLORS.surface, padding: 8, borderRadius: 20, alignSelf: 'center'
  },
  roleText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600', paddingHorizontal: 10 },
  roleActive: { color: COLORS.primary, fontWeight: '800' },
  roleDivider: { width: 1, height: 12, backgroundColor: COLORS.border },

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

  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkboxText: { fontSize: 13, color: COLORS.text, fontWeight: '500' },
  forgotText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  loginBtn: {
    flexDirection: 'row', backgroundColor: COLORS.primary,
    borderRadius: 16, height: 56,
    justifyContent: 'center', alignItems: 'center',
    gap: 8, elevation: 4,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  loginBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: COLORS.textMuted, fontSize: 14 },
  signupLink: { color: COLORS.primary, fontWeight: "700", fontSize: 14 },
});