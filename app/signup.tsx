import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#216000',       // Deep Forest Green
  primaryLight: '#2E8B00',
  primaryPale: '#E8F5E1',
  white: '#FFFFFF',
  surface: '#F7F9F4',
  text: '#1A2E0D',
  textMuted: '#9BB08A',
  border: '#DDE8D4',
};

const SHADOWS = {
  md: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 10 },
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

const SignupInput = ({ label, placeholder, icon, secureTextEntry = false }: SignupInputProps) => (
  <View style={s.inputContainer}>
    <Text style={s.inputLabel}>{label}</Text>
    <View style={s.inputWrapper}>
      <MaterialCommunityIcons name={icon} size={20} color={COLORS.primary} style={s.inputIcon} />
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

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          
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
                  source={require('../src/assets/logo.png')} 
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
              <TouchableOpacity style={[s.toggleBtn, isFarmer && s.toggleBtnActive]} onPress={() => setIsFarmer(true)}>
                <MaterialCommunityIcons name="sprout" size={18} color={isFarmer ? COLORS.white : COLORS.textMuted} />
                <Text style={[s.toggleText, isFarmer && s.toggleTextActive]}>Farmer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[s.toggleBtn, !isFarmer && s.toggleBtnActive]} onPress={() => setIsFarmer(false)}>
                <MaterialCommunityIcons name="briefcase-outline" size={18} color={!isFarmer ? COLORS.white : COLORS.textMuted} />
                <Text style={[s.toggleText, !isFarmer && s.toggleTextActive]}>Investor</Text>
              </TouchableOpacity>
            </View>

            {/* Inputs */}
            <SignupInput label="Username" placeholder="sample@email.com" icon="email-outline" />
            <SignupInput label="Password" placeholder="••••••••" icon="lock-outline" secureTextEntry />
            <SignupInput label="Confirm Password" placeholder="••••••••" icon="lock-check-outline" secureTextEntry />

            {isFarmer ? (
              <>
                <SignupInput label="Farmer ID" placeholder="FM-2024-XXX" icon="identifier" />
                <SignupInput label="NIC Number" placeholder="99xxxxxxxV" icon="card-account-details-outline" />
              </>
            ) : (
              <SignupInput label="NIC Number" placeholder="99xxxxxxxV" icon="card-account-details-outline" />
            )}

            {/* Signup Button */}
            <TouchableOpacity style={s.signupBtn} onPress={() => router.replace('/(tabs)/home')}>
              <Text style={s.signupBtnText}>Sign Up</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.white} />
            </TouchableOpacity>

            <View style={s.footer}>
              <Text style={s.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/login')}>
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
    height: 280, // Made slightly taller to fit the new badge
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    paddingTop: 50,
    position: 'relative',
    overflow: 'hidden',
  },
  decCircle: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: COLORS.primaryLight, top: -100, right: -80, opacity: 0.4,
  },
  backBtn: { position: 'absolute', top: 50, left: 20, padding: 8, zIndex: 10 },
  
  logoSection: { alignItems: 'center', marginTop: 10 },
  
  /*  NEW LOGO BADGE STYLE  */
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40, // Makes it a perfect circle
    backgroundColor: '#ffffff', // White background to blend with the image
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    // Add Shadow to make it pop
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  logo: { 
    width: 55, // Smaller than container so it has "padding"
    height: 55, 
  },

  appName: { fontSize: 30, fontWeight: '900', color: COLORS.white, letterSpacing: -0.5 },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '500', letterSpacing: 1 },

  /* CARD STYLES */
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: -30, // Negative margin to overlap
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: 20 },

  /* TOGGLE */
  toggleContainer: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, padding: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, gap: 6 },
  toggleBtnActive: { backgroundColor: COLORS.primary },
  toggleText: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  toggleTextActive: { color: COLORS.white },

  /* INPUTS */
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: COLORS.text, marginBottom: 6, marginLeft: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, paddingHorizontal: 12, height: 50 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: COLORS.text },

  /* BUTTON */
  signupBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, borderRadius: 16, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 8, elevation: 4 },
  signupBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  /* FOOTER */
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: COLORS.textMuted, fontSize: 14 },
  loginLink: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
});