<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Checkbox, Text } from 'react-native-paper';
import CustomInput from '../../src/components/CustomInput'; // Reusing your Green Pills
import { Colors } from '../../src/constants/Colors';

export default function SecurityScreen() {
  const router = useRouter();
  const [agree, setAgree] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Green Header Area */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>Secure your AgroLink account</Text>
      </View>

      {/* White Card for Inputs */}
      <View style={styles.card}>
        <CustomInput label="Current Password" placeholder="********" secureTextEntry />
        <CustomInput label="New Password" placeholder="********" secureTextEntry />
        <CustomInput label="Re-enter Password" placeholder="********" secureTextEntry />

        {/* Checkbox */}
        <View style={styles.checkboxRow}>
          <Checkbox.Android 
            status={agree ? 'checked' : 'unchecked'} 
            onPress={() => setAgree(!agree)} 
            color={Colors.primary} 
          />
          <Text style={styles.checkboxText}>
            I agree to the password changes. Your password will be changed after this attempt.
          </Text>
        </View>

        {/* Save Button */}
        <Button 
          mode="contained" 
          onPress={() => router.back()} 
          style={styles.saveBtn}
          labelStyle={{ fontSize: 16, paddingVertical: 5 }}
        >
          Save Changes
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.primary }, // Green Background like Image 2
  header: { padding: 30, paddingTop: 60 },
  backBtn: { marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#E8F5E9', opacity: 0.8 },
  
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    flex: 1, // Fill remaining space
    elevation: 10
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 20, paddingRight: 20 },
  checkboxText: { fontSize: 12, color: 'gray', marginLeft: 10, lineHeight: 18 },
  saveBtn: { backgroundColor: '#000', borderRadius: 30, marginTop: 10 } // Black Button like Image 2
=======
=======
>>>>>>> Stashed changes
/**
 * AgroLink — SecurityScreen (Production-Level Redesign)
 *
 * Key improvements over original:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. HEADER        — Premium curved green header matching the full AgroLink
 *                    screen family (HomeScreen / EditProfile / Profile).
 *                    Decorative circles, back pill button, shield icon, and a
 *                    "last changed" metadata line make it feel trustworthy.
 *
 * 2. PASSWORD FIELDS — Each field has an animated focus border + a show/hide
 *                    eye-icon toggle so users can verify what they type —
 *                    essential for password UX.
 *
 * 3. STRENGTH METER — Live segmented bar (5 steps) that evaluates length,
 *                    uppercase, number, and special character presence.
 *                    Colour-coded: red → amber → green, with a text label.
 *
 * 4. REQUIREMENTS CHECKLIST — Four inline requirement rows that tick green
 *                    as the user types, replacing the single blocking Alert.
 *                    Users know exactly what's missing before they submit.
 *
 * 5. INLINE ERRORS  — Per-field error messages with icon, replacing the
 *                    single Alert for validation failures.
 *
 * 6. CHECKBOX       — Replaced Paper Checkbox with a branded custom row using
 *                    a rounded square toggle for better tap ergonomics and
 *                    visual clarity.
 *
 * 7. CTA BUTTON     — Full-width, icon-enhanced, disabled state when
 *                    requirements not met, smooth ActivityIndicator.
 *
 * 8. TOKENS         — Shared COLORS / SHADOWS constants (AgroLink design system).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';

// ─── Design Tokens (AgroLink system) ──────────────────────────────────────────
const COLORS = {
  primary:       '#216000',
  primaryLight:  '#2E8B00',
  primaryPale:   '#E8F5E1',
  accent:        '#76C442',
  accentWarm:    '#F5A623',
  white:         '#FFFFFF',
  surface:       '#F7F9F4',
  card:          '#FFFFFF',
  text:          '#1A2E0D',
  textSecondary: '#5C7A4A',
  textMuted:     '#9BB08A',
  border:        '#DDE8D4',
  error:         '#D32F2F',
  errorBg:       '#FFF0F0',
  success:       '#2E7D32',
  successBg:     '#F1F8E9',
};

const SHADOWS = {
  sm: Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
    android: { elevation: 3 },
  }),
  md: Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.13, shadowRadius: 16 },
    android: { elevation: 8 },
  }),
};

// ─── Password Strength Logic ───────────────────────────────────────────────────
const REQUIREMENTS = [
  { key: 'length',    label: 'At least 8 characters',          test: (p: string) => p.length >= 8 },
  { key: 'upper',     label: 'One uppercase letter (A–Z)',      test: (p: string) => /[A-Z]/.test(p) },
  { key: 'number',    label: 'One number (0–9)',                test: (p: string) => /[0-9]/.test(p) },
  { key: 'special',   label: 'One special character (!@#…)',    test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const getStrength = (password: string) => {
  const passed = REQUIREMENTS.filter((r) => r.test(password)).length;
  if (passed === 0) return { score: 0, label: '',           color: COLORS.border };
  if (passed === 1) return { score: 1, label: 'Weak',       color: COLORS.error };
  if (passed === 2) return { score: 2, label: 'Fair',       color: COLORS.accentWarm };
  if (passed === 3) return { score: 3, label: 'Good',       color: '#8BC34A' };
  return              { score: 4, label: 'Strong',          color: COLORS.accent };
};

// ─── Reusable: Animated Password Field ────────────────────────────────────────
/**
 * Improvement: animated focus border + eye-icon toggle + inline error.
 * Uses the same animation pattern as EditProfileScreen's ProfileField
 * for visual consistency across the app.
 */
interface SecureFieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  icon: string;
  error?: string;
}

const SecureField = ({ label, value, onChangeText, placeholder, icon, error }: SecureFieldProps) => {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = anim.interpolate({ inputRange: [0, 1], outputRange: [COLORS.border, COLORS.primary] });
  const labelColor  = error ? COLORS.error : focused ? COLORS.primary : COLORS.textSecondary;

  return (
    <View style={sf.wrap}>
      <Text style={[sf.label, { color: labelColor }]}>{label}</Text>
      <Animated.View style={[sf.inputWrap, { borderColor: error ? COLORS.error : borderColor },
        error && { backgroundColor: COLORS.errorBg }]}>
        {/* Leading icon */}
        <MaterialCommunityIcons
          name={icon as any}
          size={18}
          color={error ? COLORS.error : focused ? COLORS.primary : COLORS.textMuted}
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={sf.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? '••••••••'}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={!visible}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {/* Eye toggle */}
        <TouchableOpacity onPress={() => setVisible((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textMuted} />
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
  wrap:      { marginBottom: 18 },
  label:     { fontSize: 12, fontWeight: '700', letterSpacing: 0.4, marginBottom: 6, textTransform: 'uppercase' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5, borderRadius: 14,
    paddingHorizontal: 14, height: 52,
  },
  input:     { flex: 1, fontSize: 15, color: COLORS.text, letterSpacing: 1 },
  errorRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  errorText: { fontSize: 11.5, color: COLORS.error, marginLeft: 4, fontWeight: '600' },
});

// ─── Reusable: Strength Meter ──────────────────────────────────────────────────
/**
 * Improvement: 4-segment bar with live colour feedback.
 * Far more informative than a single blocking Alert about password rules.
 */
const StrengthMeter = ({ password }: { password: string }) => {
  const { score, label, color } = getStrength(password);
  if (!password) return null;

  return (
    <View style={sm.wrap}>
      <View style={sm.barRow}>
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            style={[sm.seg, { backgroundColor: step <= score ? color : COLORS.border }, step < 4 && { marginRight: 5 }]}
          />
        ))}
      </View>
      <View style={sm.labelRow}>
        <Text style={sm.labelLeft}>Password strength</Text>
        <Text style={[sm.labelRight, { color }]}>{label}</Text>
      </View>
    </View>
  );
};

const sm = StyleSheet.create({
  wrap:       { marginBottom: 18 },
  barRow:     { flexDirection: 'row', marginBottom: 6 },
  seg:        { flex: 1, height: 6, borderRadius: 3 },
  labelRow:   { flexDirection: 'row', justifyContent: 'space-between' },
  labelLeft:  { fontSize: 11.5, color: COLORS.textMuted },
  labelRight: { fontSize: 11.5, fontWeight: '700' },
});

// ─── Reusable: Requirements Checklist ─────────────────────────────────────────
/**
 * Improvement: ticking requirements in real-time replaces the blocking
 * Alert. Users know what to fix *as they type*, dramatically reducing
 * submission failures and frustration.
 */
const RequirementsList = ({ password }: { password: string }) => {
  if (!password) return null;
  return (
    <View style={rl.wrap}>
      {REQUIREMENTS.map((req) => {
        const met = req.test(password);
        return (
          <View key={req.key} style={rl.row}>
            <View style={[rl.dot, { backgroundColor: met ? COLORS.accent : COLORS.border }]}>
              <Ionicons name={met ? 'checkmark' : 'remove'} size={10} color={COLORS.white} />
            </View>
            <Text style={[rl.text, met && { color: COLORS.success, fontWeight: '600' }]}>{req.label}</Text>
          </View>
        );
      })}
    </View>
  );
};

const rl = StyleSheet.create({
  wrap: { marginBottom: 20, padding: 14, backgroundColor: COLORS.surface, borderRadius: 14, gap: 8 },
  row:  { flexDirection: 'row', alignItems: 'center' },
  dot:  { width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  text: { fontSize: 12.5, color: COLORS.textMuted },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SecurityScreen() {
  const router = useRouter();

  // ── State ──
  const [currentPassword,  setCurrentPassword]  = useState('');
  const [newPassword,      setNewPassword]      = useState('');
  const [confirmPassword,  setConfirmPassword]  = useState('');
  const [agree,            setAgree]            = useState(false);
  const [loading,          setLoading]          = useState(false);
  const [errors,           setErrors]           = useState<Record<string, string>>({});

  // ── Validation — per-field ─────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!currentPassword)            e.current = 'Current password is required';
    if (!newPassword)                e.new     = 'New password is required';
    else {
      const { score } = getStrength(newPassword);
      if (score < 3)                 e.new     = 'Password does not meet all requirements';
    }
    if (!confirmPassword)            e.confirm = 'Please confirm your new password';
    else if (newPassword !== confirmPassword) e.confirm = 'Passwords do not match';
    if (!agree)                      e.agree   = 'You must acknowledge this change before continuing';
    return e;
  };

  // ── Save handler ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert('Password Updated ✓', 'Your new password is active. Please use it next time you log in.');
      router.back();
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Disable CTA until basic shape of form is correct
  const allRequirementsMet = REQUIREMENTS.every((r) => r.test(newPassword));
  const canSubmit = currentPassword && allRequirementsMet && confirmPassword === newPassword && agree;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      {/*
        Improvement: matches the premium curved header used across all
        AgroLink screens. Shield icon + "last changed" metadata line
        reinforce that this is a high-trust, security-critical flow.
      */}
      <View style={s.header}>
        <View style={s.decLg} />
        <View style={s.decSm} />

        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Icon + title */}
        <View style={s.headerBody}>
          <View style={s.shieldWrap}>
            <MaterialCommunityIcons name="shield-lock" size={36} color={COLORS.white} />
          </View>
          <Text style={s.headerTitle}>Security Settings</Text>
          <Text style={s.headerSubtitle}>Change your password to keep your account safe</Text>
          <View style={s.lastChangedBadge}>
            <MaterialCommunityIcons name="clock-outline" size={12} color="rgba(255,255,255,0.7)" />
            <Text style={s.lastChangedText}>Last changed: 30 days ago</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── PASSWORD CARD ───────────────────────────────────────────────── */}
        <View style={[s.card, SHADOWS.md]}>
          {/* Card title row */}
          <View style={s.cardTitleRow}>
            <View style={s.cardTitlePill} />
            <Text style={s.cardTitle}>Update Credentials</Text>
          </View>

          {/* Current password */}
          <SecureField
            label="Current Password"
            value={currentPassword}
            onChangeText={(v) => { setCurrentPassword(v); setErrors((e) => ({ ...e, current: '' })); }}
            icon="lock-outline"
            error={errors.current}
          />

          {/* New password */}
          <SecureField
            label="New Password"
            value={newPassword}
            onChangeText={(v) => { setNewPassword(v); setErrors((e) => ({ ...e, new: '' })); }}
            icon="lock-reset"
            error={errors.new}
          />

          {/* Live strength meter — only appears once user starts typing */}
          <StrengthMeter password={newPassword} />

          {/* Live requirements list */}
          <RequirementsList password={newPassword} />

          {/* Confirm */}
          <SecureField
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); setErrors((e) => ({ ...e, confirm: '' })); }}
            icon="lock-check-outline"
            error={errors.confirm}
          />

          {/* Match indicator */}
          {confirmPassword && newPassword && (
            <View style={[s.matchRow, { backgroundColor: confirmPassword === newPassword ? COLORS.successBg : COLORS.errorBg }]}>
              <Ionicons
                name={confirmPassword === newPassword ? 'checkmark-circle' : 'close-circle'}
                size={15}
                color={confirmPassword === newPassword ? COLORS.success : COLORS.error}
              />
              <Text style={[s.matchText, { color: confirmPassword === newPassword ? COLORS.success : COLORS.error }]}>
                {confirmPassword === newPassword ? 'Passwords match' : 'Passwords do not match'}
              </Text>
            </View>
          )}
        </View>

        {/* ── ACKNOWLEDGEMENT CARD ─────────────────────────────────────────── */}
        {/*
          Improvement: the checkbox becomes a full branded acknowledgement
          card with a rounded-square toggle — far easier to tap and visually
          clearer than a bare Paper checkbox inline with wrapped text.
        */}
        <View style={[s.card, SHADOWS.sm, { marginTop: 0 }]}>
          <TouchableOpacity
            style={s.agreeRow}
            onPress={() => { setAgree((v) => !v); setErrors((e) => ({ ...e, agree: '' })); }}
            activeOpacity={0.75}
          >
            {/* Custom toggle */}
            <View style={[s.toggleBox, agree && s.toggleBoxActive]}>
              {agree && <Ionicons name="checkmark" size={16} color={COLORS.white} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.agreeTitle}>I understand</Text>
              <Text style={s.agreeSubtitle}>
                My current password will no longer work after this change. I will need to use the new password to log in.
              </Text>
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
        {/*
          Improvement: disabled state is tied to real-time validation so
          users get feedback immediately, not after tapping.
        */}
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
                <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={s.saveBtnText}>Update Password</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={s.cancelText}>Cancel & Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Screen Styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.surface },

  /* HEADER */
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    position: 'relative',
  },
  decLg: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: COLORS.primaryLight, top: -60, right: -50, opacity: 0.5,
  },
  decSm: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: COLORS.accent, bottom: -20, left: -30, opacity: 0.18,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 18,
    ...SHADOWS.sm,
  },
  headerBody:   { alignItems: 'center' },
  shieldWrap:   {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)',
  },
  headerTitle:   { fontSize: 22, fontWeight: '900', color: COLORS.white, letterSpacing: -0.4, marginBottom: 6 },
  headerSubtitle:{ fontSize: 13, color: 'rgba(255,255,255,0.72)', textAlign: 'center', lineHeight: 19 },
  lastChangedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginTop: 12,
  },
  lastChangedText: { fontSize: 11.5, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },

  /* SCROLL + CARDS */
  scrollContent: { paddingTop: 24, paddingBottom: 60 },
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  cardTitlePill:{ width: 4, height: 20, borderRadius: 2, backgroundColor: COLORS.accent, marginRight: 10 },
  cardTitle:    { fontSize: 15, fontWeight: '800', color: COLORS.text, letterSpacing: -0.2 },

  /* MATCH INDICATOR */
  matchRow:  { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, marginBottom: 4, gap: 6 },
  matchText: { fontSize: 12.5, fontWeight: '600' },

  /* ACKNOWLEDGEMENT */
  agreeRow:       { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  toggleBox:      {
    width: 26, height: 26, borderRadius: 8,
    borderWidth: 2, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 2,
  },
  toggleBoxActive:{ backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  agreeTitle:     { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  agreeSubtitle:  { fontSize: 12.5, color: COLORS.textMuted, lineHeight: 18 },
  agreeErrorRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 5 },
  agreeErrorText: { fontSize: 11.5, color: COLORS.error, fontWeight: '600' },

  /* CTA */
  ctaSection:     { marginHorizontal: 20, alignItems: 'center' },
  saveBtn:        {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: 18,
    paddingVertical: 16, width: '100%',
    ...SHADOWS.md,
  },
  saveBtnDisabled:{ opacity: 0.45 },
  saveBtnText:    { color: COLORS.white, fontWeight: '800', fontSize: 16, letterSpacing: 0.3 },
  cancelText:     { fontSize: 13, color: COLORS.textMuted, fontWeight: '600', textDecorationLine: 'underline' },
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
});