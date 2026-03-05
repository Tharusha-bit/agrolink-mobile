<<<<<<< Updated upstream
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import CustomInput from '../../src/components/CustomInput';
import { Colors } from '../../src/constants/Colors';

export default function EditProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header with Avatar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        
        <View style={styles.avatarContainer}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />
          <View style={styles.editIcon}>
            <MaterialCommunityIcons name="camera" size={16} color="#fff" />
          </View>
        </View>
        <Text style={styles.idText}>ID: 20321212</Text>
      </View>

      {/* Form Fields (Matching Image 3) */}
      <ScrollView contentContainerStyle={styles.form}>
        <CustomInput label="First Name" value="Tharusha" />
        <CustomInput label="Last Name" value="Nimnath" />
        <CustomInput label="Display Name" value="S.J.J.T.Nimnath" />
        <CustomInput label="Address" value="100/3-C, Jaffna Road" />
        <CustomInput label="NIC Number" value="200526404904" />
        <CustomInput label="Phone Number" value="0701723003" />

        <Button 
          mode="contained" 
          onPress={() => router.back()} 
          style={styles.saveBtn}
        >
          Save Profile
        </Button>
      </ScrollView>
=======
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
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
  primary:       '#216000',
  primaryLight:  '#2E8B00',
  primaryPale:   '#E8F5E1',
  accent:        '#76C442',
  white:         '#FFFFFF',
  surface:       '#F7F9F4',
  card:          '#FFFFFF',
  text:          '#1A2E0D',
  textSecondary: '#5C7A4A',
  textMuted:     '#9BB08A',
  border:        '#DDE8D4',
  error:         '#D32F2F',
  errorBg:       '#FFF0F0',
};

const SHADOWS = {
  sm: Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
    android: { elevation: 3 },
  }),
  md: Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.11, shadowRadius: 14 },
    android: { elevation: 6 },
  }),
};

const SUGGESTED_SKILLS = ['Irrigation', 'Paddy', 'Organic', 'Horticulture', 'Poultry', 'Aquaculture'];

// ─── Reusable: Animated Form Field ─────────────────────────────────────────────
const ProfileField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = 'default',
  error,
  secureTextEntry = false,
}: any) => {
  const [focused, setFocused] = useState(false);
  // Animation value: 0 = Blur, 1 = Focus
  const anim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  // Interpolate colors based on focus state
  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });
  
  const labelColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.textSecondary, COLORS.primary],
  });

  const iconColor = focused ? COLORS.primary : COLORS.textMuted;

  return (
    <View style={pf.wrap}>
      <Animated.Text style={[pf.label, { color: error ? COLORS.error : labelColor }]}>
        {label}
      </Animated.Text>

      <Animated.View
        style={[
          pf.inputWrap,
          { borderColor: error ? COLORS.error : borderColor },
          error && { backgroundColor: COLORS.errorBg },
        ]}
      >
        <MaterialCommunityIcons 
          name={icon} 
          size={20} 
          color={error ? COLORS.error : iconColor} 
          style={pf.icon} 
        />

        <TextInput
          style={pf.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          keyboardType={keyboardType}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </Animated.View>

      {error ? (
        <View style={pf.errorRow}>
          <Ionicons name="alert-circle" size={14} color={COLORS.error} />
          <Text style={pf.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const pf = StyleSheet.create({
  wrap:      { marginBottom: 18 },
  label:     { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5, borderRadius: 14,
    paddingHorizontal: 14, height: 54,
  },
  icon:      { marginRight: 12 },
  input:     { flex: 1, fontSize: 15, color: COLORS.text, height: '100%' },
  errorRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  errorText: { fontSize: 12, color: COLORS.error, marginLeft: 4, fontWeight: '600' },
});

// ─── Reusable: Section Card ────────────────────────────────────────────────────
const SectionCard = ({ title, subtitle, icon, children }: any) => (
  <View style={[sc.card, SHADOWS.sm]}>
    <View style={sc.header}>
      <View style={sc.iconWrap}>
        <MaterialCommunityIcons name={icon} size={22} color={COLORS.primary} />
      </View>
      <View>
        <Text style={sc.title}>{title}</Text>
        <Text style={sc.subtitle}>{subtitle}</Text>
      </View>
    </View>
    {children}
  </View>
);

const sc = StyleSheet.create({
  card:     { backgroundColor: COLORS.card, marginHorizontal: 20, borderRadius: 24, padding: 20, marginBottom: 20 },
  header:   { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primaryPale, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  title:    { fontSize: 16, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  subtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
});

// ─── Reusable: Skill Chip ──────────────────────────────────────────────────────
const SkillChip = ({ label, onRemove }: any) => (
  <View style={chip.wrap}>
    <MaterialCommunityIcons name="sprout" size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
    <Text style={chip.label}>{label}</Text>
    <TouchableOpacity onPress={onRemove} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ marginLeft: 8 }}>
      <Ionicons name="close-circle" size={18} color={COLORS.primary} />
    </TouchableOpacity>
  </View>
);

const chip = StyleSheet.create({
  wrap:  {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primaryPale,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 30, paddingHorizontal: 14, paddingVertical: 8,
    marginRight: 8, marginBottom: 8,
  },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function EditProfileScreen() {
  const router = useRouter();

  // Form State
  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [displayName, setDisplayName] = useState('');
  const [nic,         setNic]         = useState('');
  const [address,     setAddress]     = useState('');
  const [phone,       setPhone]       = useState('');
  const [skills,      setSkills]      = useState<string[]>([]);
  const [newSkill,    setNewSkill]    = useState('');
  const [loading,     setLoading]     = useState(false);
  const [errors,      setErrors]      = useState<any>({});

  // Validation
  const validate = () => {
    const e: any = {};
    if (!firstName.trim())           e.firstName   = 'First name is required';
    if (!lastName.trim())            e.lastName    = 'Last name is required';
    if (!nic.trim())                 e.nic         = 'NIC number is required';
    if (!address.trim())             e.address     = 'Address is required';
    if (!phone.match(/^[0-9]{10}$/)) e.phone       = 'Enter valid 10-digit number';
    if (!displayName.trim())         e.displayName = 'Display name is required';
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (s?: string) => {
    const skillToAdd = (s || newSkill).trim();
    if (!skillToAdd || skills.includes(skillToAdd)) return;
    setSkills([...skills, skillToAdd]);
    setNewSkill('');
  };

  const removeSkill = (index: number) => setSkills(skills.filter((_, i) => i !== index));

  const suggestions = SUGGESTED_SKILLS.filter((s) => !skills.includes(s));

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Keyboard Avoiding View allows scrolling when keyboard is open */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── HEADER ── */}
          <View style={s.header}>
            <View style={s.decCircleLg} />
            <View style={s.decCircleSm} />

            <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
            </TouchableOpacity>

            <View style={s.avatarSection}>
              <View style={s.avatarRing}>
                <View style={s.avatarCircle}>
                  <MaterialCommunityIcons name="account" size={52} color={COLORS.white} />
                </View>
                <TouchableOpacity style={s.cameraBtn} activeOpacity={0.85}>
                  <Ionicons name="camera" size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              <Text style={s.avatarName}>{displayName || 'Fernando'}</Text>
              <Text style={s.avatarSub}>Tap camera to upload</Text>
            </View>
          </View>

          {/* ── PERSONAL INFO ── */}
          <View style={{ marginTop: 20 }}>
            <SectionCard title="Personal Information" subtitle="Legal details for verification" icon="card-account-details-outline">
              <ProfileField
                label="First Name"
                value={firstName}
                onChangeText={(v: string) => { setFirstName(v); setErrors({ ...errors, firstName: '' }); }}
                placeholder="e.g. Kasun"
                icon="account-outline"
                error={errors.firstName}
              />
              <ProfileField
                label="Last Name"
                value={lastName}
                onChangeText={(v: string) => { setLastName(v); setErrors({ ...errors, lastName: '' }); }}
                placeholder="e.g. Perera"
                icon="account-outline"
                error={errors.lastName}
              />
              <ProfileField
                label="Display Name"
                value={displayName}
                onChangeText={(v: string) => { setDisplayName(v); setErrors({ ...errors, displayName: '' }); }}
                placeholder="How you appear to others"
                icon="badge-account-outline"
                error={errors.displayName}
              />
              <ProfileField
                label="NIC Number"
                value={nic}
                onChangeText={(v: string) => { setNic(v); setErrors({ ...errors, nic: '' }); }}
                placeholder="e.g. 991234567V"
                icon="identifier"
                error={errors.nic}
              />
            </SectionCard>

            {/* ── CONTACT ── */}
            <SectionCard title="Contact Details" subtitle="For investor communications" icon="map-marker-radius-outline">
              <ProfileField
                label="Address"
                value={address}
                onChangeText={(v: string) => { setAddress(v); setErrors({ ...errors, address: '' }); }}
                placeholder="e.g. 12 Kandy Rd, Colombo"
                icon="home-outline"
                error={errors.address}
              />
              <ProfileField
                label="Phone Number"
                value={phone}
                onChangeText={(v: string) => { setPhone(v); setErrors({ ...errors, phone: '' }); }}
                placeholder="07X XXX XXXX"
                icon="phone-outline"
                keyboardType="phone-pad"
                error={errors.phone}
              />
            </SectionCard>

            {/* ── SKILLS ── */}
            <SectionCard title="Skills & Expertise" subtitle="Your farming strengths" icon="leaf">
              <View style={s.skillInputRow}>
                <View style={s.skillInputWrap}>
                  <MaterialCommunityIcons name="sprout-outline" size={18} color={COLORS.textMuted} style={{ marginRight: 8 }} />
                  <TextInput
                    style={s.skillInput}
                    value={newSkill}
                    onChangeText={setNewSkill}
                    placeholder="Add a skill..."
                    placeholderTextColor={COLORS.textMuted}
                    onSubmitEditing={() => addSkill()}
                  />
                </View>
                <TouchableOpacity style={s.addBtn} onPress={() => addSkill()} activeOpacity={0.8}>
                  <Ionicons name="add" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={s.suggestLabel}>Quick Add:</Text>
                  <View style={s.chipsWrap}>
                    {suggestions.slice(0, 4).map((sg) => (
                      <TouchableOpacity key={sg} style={s.suggestChip} onPress={() => addSkill(sg)}>
                        <Ionicons name="add-circle-outline" size={14} color={COLORS.primary} style={{ marginRight: 4 }} />
                        <Text style={s.suggestChipText}>{sg}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Chip List */}
              <View style={s.chipsWrap}>
                {skills.map((sk, i) => (
                  <SkillChip key={i} label={sk} onRemove={() => removeSkill(i)} />
                ))}
              </View>
            </SectionCard>

            {/* ── SAVE BUTTON ── */}
            <View style={s.saveSection}>
              <TouchableOpacity
                style={[s.saveBtn, loading && s.saveBtnLoading]}
                onPress={handleSave}
                disabled={loading}
                activeOpacity={0.9}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <MaterialCommunityIcons name="content-save-check" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
                    <Text style={s.saveBtnText}>Save Profile</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.back()} style={{ padding: 10 }}>
                <Text style={s.discardText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
>>>>>>> Stashed changes
    </View>
  );
}

<<<<<<< Updated upstream
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    backgroundColor: Colors.primary, 
    paddingTop: 50, 
    paddingBottom: 30, 
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: { position: 'absolute', top: 50, left: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  
  avatarContainer: { position: 'relative', marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
  editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#000', padding: 6, borderRadius: 15 },
  idText: { color: '#E8F5E9', fontSize: 14 },

  form: { padding: 25 },
  saveBtn: { backgroundColor: '#000', borderRadius: 30, marginTop: 20, paddingVertical: 6 }
=======
// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.surface },
  scrollContent:{ paddingBottom: 40 },

  /* HEADER */
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.md,
  },
  decCircleLg: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: COLORS.primaryLight, top: -80, right: -60, opacity: 0.4 },
  decCircleSm: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.accent, bottom: -40, left: -20, opacity: 0.2 },
  
  backBtn: {
    position: 'absolute', top: Platform.OS === 'ios' ? 50 : 40, left: 20,
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center', zIndex: 10, ...SHADOWS.sm,
  },

  avatarSection: { alignItems: 'center', marginTop: 10 },
  avatarRing: {
    width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },
  cameraBtn: {
    position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.white,
  },
  avatarName: { fontSize: 22, fontWeight: '800', color: COLORS.white, letterSpacing: -0.5 },
  avatarSub:  { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  /* SKILLS */
  skillInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  skillInputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 14, paddingHorizontal: 14,
    height: 52, marginRight: 10,
  },
  skillInput:    { flex: 1, fontSize: 14, color: COLORS.text },
  addBtn:        { width: 52, height: 52, borderRadius: 14, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', ...SHADOWS.sm },

  suggestLabel:  { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  chipsWrap:     { flexDirection: 'row', flexWrap: 'wrap' },
  suggestChip:   {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 8,
  },
  suggestChipText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },

  /* SAVE */
  saveSection:   { marginHorizontal: 20, marginTop: 10, marginBottom: 20, alignItems: 'center' },
  saveBtn:       {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: 18, paddingVertical: 18, width: '100%',
    ...SHADOWS.md,
  },
  saveBtnLoading:{ opacity: 0.8 },
  saveBtnText:   { color: COLORS.white, fontWeight: '800', fontSize: 16, letterSpacing: 0.5 },
  discardText:   { fontSize: 14, color: COLORS.textMuted, fontWeight: '600', textDecorationLine: 'underline' },
>>>>>>> Stashed changes
});