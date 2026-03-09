import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { ComponentProps, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { type NewProjectInput, useProjects } from '../../src/context/ProjectContext';

// ─────────────────────────────────────────────────────────────────────────────
// ICON TYPES
// ─────────────────────────────────────────────────────────────────────────────
type MCIcon  = ComponentProps<typeof MaterialCommunityIcons>['name'];
type IonIcon = ComponentProps<typeof Ionicons>['name'];

// ─────────────────────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  primary:      '#216000',
  primaryLight: '#2E8B00',
  primaryPale:  '#E8F5E1',
  surface:      '#F7F9F4',
  white:        '#FFFFFF',
  ink:          '#1A2E0D',
  inkMuted:     '#9BB08A',
  border:       '#DDE8D4',
  accent:       '#76C442',
  accentWarm:   '#F5A623',
  error:        '#D32F2F',
  errorPale:    '#FFEBEE',
};

const FONT  = { xs: 11, sm: 12, md: 14, lg: 16, xl: 18, xxl: 24 };
const SPACE = { xs: 6, sm: 10, md: 16, lg: 20, xl: 24 };

// ─────────────────────────────────────────────────────────────────────────────
// FORM STATE TYPE
// ─────────────────────────────────────────────────────────────────────────────
interface FormState {
  title:       string;
  crop:        string;
  location:    string;
  goal:        string;   // string in input, parsed to number on submit
  duration:    string;   // months — parsed to number
  roiMin:      string;   // % — parsed to number
  roiMax:      string;   // % — parsed to number
  minInvest:   string;   // LKR — parsed to number
  description: string;
}

const EMPTY_FORM: FormState = {
  title:       '',
  crop:        '',
  location:    '',
  goal:        '',
  duration:    '',
  roiMin:      '',
  roiMax:      '',
  minInvest:   '',
  description: '',
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Map crop keywords → representative Pixabay images. */
const CROP_IMAGES: Record<string, string> = {
  rice:      'https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg',
  paddy:     'https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg',
  tea:       'https://cdn.pixabay.com/photo/2015/09/23/08/17/tea-953159_1280.jpg',
  corn:      'https://cdn.pixabay.com/photo/2018/09/25/20/19/corn-3703062_1280.jpg',
  maize:     'https://cdn.pixabay.com/photo/2018/09/25/20/19/corn-3703062_1280.jpg',
  vegetable: 'https://cdn.pixabay.com/photo/2018/03/11/01/25/vegetable-3215091_1280.jpg',
  veg:       'https://cdn.pixabay.com/photo/2018/03/11/01/25/vegetable-3215091_1280.jpg',
  bean:      'https://cdn.pixabay.com/photo/2018/03/11/01/25/vegetable-3215091_1280.jpg',
  coconut:   'https://cdn.pixabay.com/photo/2017/08/10/02/05/coconut-2616984_1280.jpg',
  default:   'https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg',
};

function selectCropImage(crop: string): string {
  const key = crop.toLowerCase().trim();
  const match = Object.keys(CROP_IMAGES).find((k) => key.includes(k));
  return CROP_IMAGES[match ?? 'default'];
}

function calculateRiskLevel(
  roiMax: number
): 'Low' | 'Medium' | 'High' {
  if (roiMax > 20) return 'High';
  if (roiMax >= 15) return 'Medium';
  return 'Low';
}

interface ValidationResult {
  valid:   boolean;
  message: string;
}

function validateForm(form: FormState, step: number): ValidationResult {
  if (step === 1) {
    if (!form.title.trim())    return { valid: false, message: 'Please enter a project title.' };
    if (!form.crop.trim())     return { valid: false, message: 'Please enter a crop type.' };
    if (!form.location.trim()) return { valid: false, message: 'Please enter a location.' };
  }

  if (step === 2) {
    const goal      = parseFloat(form.goal);
    const duration  = parseFloat(form.duration);
    const roiMin    = parseFloat(form.roiMin);
    const roiMax    = parseFloat(form.roiMax);
    const minInvest = parseFloat(form.minInvest);

    if (!form.goal || isNaN(goal) || goal <= 0)
      return { valid: false, message: 'Funding goal must be greater than 0.' };
    if (!form.duration || isNaN(duration) || duration <= 0)
      return { valid: false, message: 'Duration must be at least 1 month.' };
    if (!form.roiMin || isNaN(roiMin) || roiMin <= 0)
      return { valid: false, message: 'Minimum ROI must be greater than 0.' };
    if (!form.roiMax || isNaN(roiMax) || roiMax <= 0)
      return { valid: false, message: 'Maximum ROI must be greater than 0.' };
    if (roiMin >= roiMax)
      return { valid: false, message: 'Maximum ROI must be greater than minimum ROI.' };
    if (!form.minInvest || isNaN(minInvest) || minInvest <= 0)
      return { valid: false, message: 'Minimum investment must be greater than 0.' };
  }

  if (step === 3) {
    if (form.description.trim().length < 20)
      return { valid: false, message: 'Please write a description of at least 20 characters.' };
  }

  return { valid: true, message: '' };
}

// ─────────────────────────────────────────────────────────────────────────────
// FORM INPUT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface FormInputProps {
  label:         string;
  placeholder:   string;
  value:         string;
  onChange:      (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  prefix?:       string;
  suffix?:       string;
  icon?:         MCIcon;
  multiline?:    boolean;
  hint?:         string;
}

function FormInput({
  label, placeholder, value, onChange,
  keyboardType = 'default', prefix, suffix, icon, multiline, hint,
}: FormInputProps) {
  return (
    <View style={fi.group}>
      <Text style={fi.label}>{label}</Text>
      <View style={[fi.wrap, multiline && fi.wrapMulti]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={T.primary}
            style={fi.icon}
          />
        )}
        {prefix && <Text style={fi.prefix}>{prefix}</Text>}
        <TextInput
          style={[fi.input, multiline && fi.inputMulti]}
          placeholder={placeholder}
          placeholderTextColor={T.inkMuted}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'auto'}
        />
        {suffix && <Text style={fi.suffix}>{suffix}</Text>}
      </View>
      {hint && <Text style={fi.hint}>{hint}</Text>}
    </View>
  );
}

const fi = StyleSheet.create({
  group:      { marginBottom: SPACE.md },
  label:      { fontSize: FONT.xs, fontWeight: '700', color: T.inkMuted, marginBottom: SPACE.xs, textTransform: 'uppercase', letterSpacing: 0.6 },
  wrap:       { flexDirection: 'row', alignItems: 'center', backgroundColor: T.surface, borderWidth: 1.5, borderColor: T.border, borderRadius: 14, paddingHorizontal: 14, height: 52 },
  wrapMulti:  { height: 110, alignItems: 'flex-start', paddingTop: 14 },
  icon:       { marginRight: 10 },
  prefix:     { fontSize: FONT.lg, fontWeight: '700', color: T.inkMuted, marginRight: 8 },
  suffix:     { fontSize: FONT.lg, fontWeight: '700', color: T.inkMuted, marginLeft: 8 },
  input:      { flex: 1, fontSize: FONT.lg, color: T.ink, fontWeight: '600' },
  inputMulti: { height: '100%' },
  hint:       { fontSize: FONT.xs, color: T.inkMuted, marginTop: 4, marginLeft: 2 },
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────────────────────────────────────
function StepIndicator({ step, total }: { step: number; total: number }) {
  const checkIcon: IonIcon = 'checkmark';
  return (
    <View style={si.row}>
      <View style={[si.lineBg]} />
      <View style={[si.lineFg, { width: `${((step - 1) / (total - 1)) * 100}%` }]} />
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <View
          key={n}
          style={[si.dot, step >= n && si.dotActive, step > n && si.dotDone]}
        >
          {step > n
            ? <Ionicons name={checkIcon} size={14} color={T.white} />
            : <Text style={[si.num, step >= n && si.numActive]}>{n}</Text>
          }
        </View>
      ))}
    </View>
  );
}

const si = StyleSheet.create({
  row:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 40, marginTop: -20, marginBottom: 24, position: 'relative' },
  lineBg:   { position: 'absolute', top: 17, left: 0, right: 0, height: 3, backgroundColor: '#E0E0E0', zIndex: 0 },
  lineFg:   { position: 'absolute', top: 17, left: 0, height: 3, backgroundColor: T.accent, zIndex: 1 },
  dot:      { width: 36, height: 36, borderRadius: 18, backgroundColor: T.white, justifyContent: 'center', alignItems: 'center', zIndex: 2, borderWidth: 2, borderColor: '#E0E0E0', elevation: 3 },
  dotActive:{ borderColor: T.accent },
  dotDone:  { backgroundColor: T.accent, borderColor: T.accent },
  num:      { fontSize: FONT.sm, fontWeight: '800', color: T.inkMuted },
  numActive:{ color: T.accent },
});

// ─────────────────────────────────────────────────────────────────────────────
// RISK BADGE
// ─────────────────────────────────────────────────────────────────────────────
function RiskBadge({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const config = {
    Low:    { bg: T.primaryPale, color: T.primary,    icon: 'shield-check-outline'  as MCIcon },
    Medium: { bg: '#FFF8E1',     color: T.accentWarm, icon: 'shield-half-full'      as MCIcon },
    High:   { bg: T.errorPale,   color: T.error,      icon: 'shield-alert-outline'  as MCIcon },
  };
  const c = config[level];
  return (
    <View style={[rb.wrap, { backgroundColor: c.bg }]}>
      <MaterialCommunityIcons name={c.icon} size={16} color={c.color} />
      <Text style={[rb.text, { color: c.color }]}>{level} Risk</Text>
    </View>
  );
}

const rb = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  text: { fontSize: FONT.sm, fontWeight: '800' },
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function CreateProjectScreen() {
  const router = useRouter();
  const { addProject } = useProjects();

  const [step,        setStep]        = useState<1 | 2 | 3>(1);
  const [form,        setForm]        = useState<FormState>(EMPTY_FORM);
  const [submitting,  setSubmitting]  = useState(false);

  // Derived preview values for step 3
  const previewRoiMax   = parseFloat(form.roiMax)  || 0;
  const previewRiskLevel = calculateRiskLevel(previewRoiMax);

  function updateField<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Navigation ──────────────────────────────────────────────────────────────
  function handleBack() {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3);
    else router.back();
  }

  function handleNext() {
    const { valid, message } = validateForm(form, step);
    if (!valid) {
      Alert.alert('Missing Information', message);
      return;
    }
    if (step < 3) {
      setStep((s) => (s + 1) as 2 | 3);
    } else {
      handleSubmit();
    }
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    const { valid, message } = validateForm(form, 3);
    if (!valid) {
      Alert.alert('Missing Information', message);
      return;
    }

    setSubmitting(true);

    try {
      const goal      = parseFloat(form.goal);
      const duration  = parseFloat(form.duration);
      const roiMin    = parseFloat(form.roiMin);
      const roiMax    = parseFloat(form.roiMax);
      const minInvest = parseFloat(form.minInvest);
      const riskLevel = calculateRiskLevel(roiMax);
      const imageUrl  = selectCropImage(form.crop);

      const newProject: NewProjectInput = {
        farmer: {
          id:         'farmer-current',
          name:       'Suriyakumar',
          location:   form.location.trim(),
          trustScore: 92,
          since:      new Date().getFullYear().toString(),
        },
        title:       form.title.trim(),
        location:    form.location.trim(),
        description: form.description.trim(),
        tags:        [form.crop.trim(), 'AgroLink'],
        goal,
        minInvest,
        duration,
        roiMin,
        roiMax,
        riskLevel,
        imageUrl,
      };

      // Simulate async verification (replace with real API call)
      await new Promise<void>((resolve) => setTimeout(resolve, 800));

      addProject(newProject);

      Alert.alert(
        '🌱 Project Submitted!',
        'Your project has been submitted for AI verification. You will be notified once approved.',
        [{ text: 'Go to Dashboard', onPress: () => router.replace('/farmer/farmerhome') }]
      );
    } catch (error) {
      Alert.alert('Submission Failed', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={T.primary} />

      {/* ── HEADER ── */}
      <View style={s.header}>
        <View style={s.decLg} />
        <View style={s.decSm} />

        <TouchableOpacity onPress={handleBack} style={s.backBtn}>
          <Ionicons name={'arrow-back' as IonIcon} size={24} color={T.white} />
        </TouchableOpacity>

        <Text style={s.hTitle}>New Farm Project</Text>
        <Text style={s.hSub}>Step {step} of 3 · {step === 1 ? 'Basics' : step === 2 ? 'Financials' : 'Details'}</Text>
      </View>

      {/* ── STEP INDICATOR ── */}
      <StepIndicator step={step} total={3} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={s.card}>

            {/* ── STEP 1: BASICS ── */}
            {step === 1 && (
              <>
                <Text style={s.cardTitle}>Project Basics</Text>
                <FormInput
                  label="Project Title"
                  placeholder="e.g. Yala Season Paddy"
                  icon={'format-title' as MCIcon}
                  value={form.title}
                  onChange={(t) => updateField('title', t)}
                />
                <FormInput
                  label="Crop Type"
                  placeholder="e.g. Rice, Corn, Tea"
                  icon={'sprout-outline' as MCIcon}
                  value={form.crop}
                  onChange={(t) => updateField('crop', t)}
                />
                <FormInput
                  label="Farm Location"
                  placeholder="e.g. Anuradhapura"
                  icon={'map-marker-outline' as MCIcon}
                  value={form.location}
                  onChange={(t) => updateField('location', t)}
                />
              </>
            )}

            {/* ── STEP 2: FINANCIALS ── */}
            {step === 2 && (
              <>
                <Text style={s.cardTitle}>Financial Goals</Text>
                <FormInput
                  label="Funding Goal"
                  placeholder="e.g. 80000"
                  keyboardType="numeric"
                  prefix="LKR"
                  hint="Total amount you need to raise"
                  value={form.goal}
                  onChange={(t) => updateField('goal', t)}
                />
                <FormInput
                  label="Minimum Investment"
                  placeholder="e.g. 5000"
                  keyboardType="numeric"
                  prefix="LKR"
                  hint="Smallest amount an investor can contribute"
                  value={form.minInvest}
                  onChange={(t) => updateField('minInvest', t)}
                />
                <FormInput
                  label="Duration"
                  placeholder="e.g. 6"
                  keyboardType="numeric"
                  suffix="Months"
                  value={form.duration}
                  onChange={(t) => updateField('duration', t)}
                />
                <View style={s.roiRow}>
                  <View style={{ flex: 1 }}>
                    <FormInput
                      label="Min ROI"
                      placeholder="e.g. 12"
                      keyboardType="numeric"
                      suffix="%"
                      value={form.roiMin}
                      onChange={(t) => updateField('roiMin', t)}
                    />
                  </View>
                  <Text style={s.roiSep}>–</Text>
                  <View style={{ flex: 1 }}>
                    <FormInput
                      label="Max ROI"
                      placeholder="e.g. 15"
                      keyboardType="numeric"
                      suffix="%"
                      value={form.roiMax}
                      onChange={(t) => updateField('roiMax', t)}
                    />
                  </View>
                </View>

                <View style={s.tipBox}>
                  <MaterialCommunityIcons name={'lightbulb-on' as MCIcon} size={18} color={T.accentWarm} />
                  <Text style={s.tipText}>
                    Tip: Realistic ROIs of 12–18% attract 2× more investors than higher promises.
                  </Text>
                </View>
              </>
            )}

            {/* ── STEP 3: DETAILS & MEDIA ── */}
            {step === 3 && (
              <>
                <Text style={s.cardTitle}>Details & Media</Text>

                <TouchableOpacity style={s.uploadBox} activeOpacity={0.8}>
                  <MaterialCommunityIcons name={'camera-plus' as MCIcon} size={32} color={T.primary} />
                  <Text style={s.uploadText}>Tap to upload Cover Photo</Text>
                  <Text style={s.uploadHint}>JPG or PNG · max 5 MB</Text>
                </TouchableOpacity>

                <FormInput
                  label="Project Description"
                  placeholder="Describe your soil quality, water source, and harvest plan…"
                  multiline
                  hint="Minimum 20 characters"
                  value={form.description}
                  onChange={(t) => updateField('description', t)}
                />

                {/* Live risk preview */}
                {previewRoiMax > 0 && (
                  <View style={s.riskPreview}>
                    <Text style={s.riskPreviewLabel}>Calculated Risk Level</Text>
                    <RiskBadge level={previewRiskLevel} />
                  </View>
                )}

                {/* AI check notice */}
                <View style={s.aiBox}>
                  <View style={s.aiPill}>
                    <MaterialCommunityIcons name={'robot' as MCIcon} size={13} color={T.white} />
                    <Text style={s.aiPillText}>AI Verification Pending</Text>
                  </View>
                  <Text style={s.aiDesc}>
                    Upon submission, our system will cross-check local weather forecasts,
                    soil data, and your ROI claim to generate a verified trust score.
                  </Text>
                </View>
              </>
            )}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── FOOTER ── */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.nextBtn, submitting && s.nextBtnDisabled]}
          onPress={handleNext}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <>
              <ActivityIndicator color={T.white} size="small" />
              <Text style={s.nextText}>Submitting…</Text>
            </>
          ) : (
            <>
              <Text style={s.nextText}>
                {step === 3 ? 'Submit Project' : 'Continue'}
              </Text>
              <MaterialCommunityIcons name={'arrow-right' as MCIcon} size={20} color={T.white} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: T.surface },
  scroll: { paddingBottom: 120 },

  // Header
  header: {
    backgroundColor: T.primary,
    paddingTop: 60,
    paddingBottom: 44,
    paddingHorizontal: SPACE.lg,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  decLg: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: T.primaryLight, top: -80, right: -60, opacity: 0.4 },
  decSm: { position: 'absolute', width: 120, height: 120, borderRadius: 60,  backgroundColor: T.accent,       bottom: -40, left: -20, opacity: 0.2 },
  backBtn: { position: 'absolute', top: 52, left: SPACE.lg, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  hTitle: { fontSize: FONT.xxl, fontWeight: '800', color: T.white, marginTop: 8 },
  hSub:   { fontSize: FONT.md,  fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginTop: 4 },

  // Card
  card: {
    backgroundColor: T.white,
    marginHorizontal: SPACE.md,
    borderRadius: 24,
    padding: SPACE.xl,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4,
  },
  cardTitle: { fontSize: FONT.xl, fontWeight: '800', color: T.ink, marginBottom: SPACE.lg },

  // ROI row
  roiRow: { flexDirection: 'row', gap: SPACE.sm, alignItems: 'flex-start' },
  roiSep: { fontSize: FONT.xl, fontWeight: '800', color: T.inkMuted, marginTop: 28, paddingHorizontal: 4 },

  // Tip box
  tipBox:  { flexDirection: 'row', backgroundColor: '#FFF8E1', padding: 12, borderRadius: 14, gap: 10, marginTop: 4 },
  tipText: { flex: 1, fontSize: FONT.sm, color: '#8D6E63', lineHeight: 18 },

  // Upload
  uploadBox:  { height: 120, borderWidth: 2, borderColor: T.border, borderStyle: 'dashed', borderRadius: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA', marginBottom: SPACE.md, gap: 6 },
  uploadText: { color: T.primary, fontWeight: '700', fontSize: FONT.md },
  uploadHint: { color: T.inkMuted, fontSize: FONT.xs },

  // Risk preview
  riskPreview:      { marginBottom: SPACE.md },
  riskPreviewLabel: { fontSize: FONT.xs, fontWeight: '700', color: T.inkMuted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: SPACE.xs },

  // AI box
  aiBox:      { backgroundColor: T.primaryPale, borderRadius: 16, padding: SPACE.md, marginTop: 4 },
  aiPill:     { flexDirection: 'row', alignItems: 'center', backgroundColor: T.primary, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 8, gap: 6 },
  aiPillText: { color: T.white, fontSize: FONT.xs, fontWeight: '700' },
  aiDesc:     { fontSize: FONT.sm, color: '#4A6B42', lineHeight: 18 },

  // Footer
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: T.white,
    padding: SPACE.lg,
    paddingBottom: 34,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, elevation: 20,
  },
  nextBtn: {
    flexDirection: 'row', backgroundColor: T.primary,
    height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', gap: 10,
    shadowColor: T.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, elevation: 5,
  },
  nextBtnDisabled: { backgroundColor: T.inkMuted },
  nextText: { color: T.white, fontSize: FONT.lg, fontWeight: '800', letterSpacing: 0.5 },
});