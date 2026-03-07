import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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
// Note: Ensure this path matches your folder structure. 
// If src is at root and app is at root, ../../src is correct.
import { useProjects } from '../../src/context/ProjectContext';

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#216000',
  primaryLight: '#2E8B00',
  primaryPale: '#E8F5E1',
  white: '#FFFFFF',
  surface: '#F7F9F4',
  text: '#1A2E0D',
  textMuted: '#9BB08A',
  border: '#DDE8D4',
  accent: '#76C442',
  accentWarm: '#F5A623',
};

const SHADOWS = {
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
};

// ─── Reusable Input ────────────────────────────────────────────────────────────
const FormInput = ({ label, placeholder, value, onChange, keyboardType = 'default', prefix, suffix, icon, multiline }: any) => (
  <View style={s.inputGroup}>
    <Text style={s.label}>{label}</Text>
    <View style={[s.inputWrap, multiline && { height: 100, alignItems: 'flex-start', paddingTop: 14 }]}>
      {icon && <MaterialCommunityIcons name={icon} size={20} color={COLORS.primary} style={{ marginRight: 10 }} />}
      {prefix && <Text style={s.prefix}>{prefix}</Text>}
      <TextInput
        style={[s.input, multiline && { textAlignVertical: 'top' }]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        multiline={multiline}
      />
      {suffix && <Text style={s.suffix}>{suffix}</Text>}
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function CreateProjectScreen() {
  const router = useRouter();
  const { addProject } = useProjects(); 
  const [step, setStep] = useState(1);
  
  // Form State
  const [form, setForm] = useState({
    title: '',
    crop: '',
    location: '',
    amount: '',
    duration: '',
    roi: '',
    description: '',
  });

  const updateForm = (key: string, value: string) => setForm({ ...form, [key]: value });

  // ─── Logic ───
  const handleNext = () => {
    if (step === 1 && (!form.title || !form.location)) {
      Alert.alert("Missing Info", "Please fill in the project title and location.");
      return;
    }
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const handleSubmit = () => {
    // 1. Smart Image Selection (Simulating AI)
    let selectedImage = 'https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg'; // Default Paddy
    const lowerTitle = (form.title + form.crop).toLowerCase();
    
    if (lowerTitle.includes('tea')) selectedImage = 'https://cdn.pixabay.com/photo/2015/09/23/08/17/tea-953159_1280.jpg';
    if (lowerTitle.includes('veg') || lowerTitle.includes('bean') || lowerTitle.includes('carrot')) selectedImage = 'https://cdn.pixabay.com/photo/2018/03/11/01/25/vegetable-3215091_1280.jpg';
    if (lowerTitle.includes('corn')) selectedImage = 'https://cdn.pixabay.com/photo/2018/09/25/20/19/corn-3703062_1280.jpg';

    // 2. Create the Project Object
    const newProject = {
      id: Math.random().toString(),
      farmer: "Me (Farmer)", 
      since: "Just Now",
      title: form.title || "New Farming Project",
      location: form.location,
      description: form.description || "Seeking investment for agricultural expansion.",
      raised: 0,
      goal: parseFloat(form.amount) || 100000,
      minInvest: "LKR 5,000",
      duration: (form.duration || "6") + " Months",
      roi: (form.roi || "15") + "%",
      riskLevel: "Low" as const, 
      image: selectedImage,
      tags: [form.crop || "Farming", "Organic"],
      progress: 0,
      // ✅ FIXED: Initializing these arrays prevents crashes in Manage Screen
      updates: [],
      investors: [] 
    };

    // 3. Save & Navigate
    addProject(newProject);
    Alert.alert("Success!", "Project submitted for AI Verification.");
    
    // ✅ FIXED: Navigate to FARMER Dashboard, not Investor Dashboard
    router.replace('/farmer/farmerhome');
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── HEADER ── */}
      <View style={s.header}>
        <View style={s.decCircleLg} />
        <View style={s.decCircleSm} />
        
        <TouchableOpacity onPress={handleBack} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <Text style={s.headerTitle}>New Project</Text>
        <Text style={s.headerSub}>Step {step} of 3</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          
          {/* ── PROGRESS BAR ── */}
          <View style={s.progressContainer}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={[s.stepDot, step >= i && s.stepDotActive]}>
                {step > i ? <Ionicons name="checkmark" size={14} color="#fff" /> : <Text style={[s.stepNum, step >= i && { color: '#fff' }]}>{i}</Text>}
              </View>
            ))}
            <View style={[s.progressLine, { width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }]} />
            <View style={s.progressLineBg} />
          </View>

          {/* ── FORM CONTENT ── */}
          <View style={[s.card, SHADOWS.md]}>
            
            {/* STEP 1: BASICS */}
            {step === 1 && (
              <>
                <Text style={s.cardTitle}>Project Basics</Text>
                <FormInput 
                  label="Project Title" 
                  placeholder="e.g. Yala Season Paddy" 
                  icon="format-title"
                  value={form.title} onChange={(t: string) => updateForm('title', t)} 
                />
                <FormInput 
                  label="Crop Type" 
                  placeholder="e.g. Rice, Corn, Tea" 
                  icon="sprout-outline"
                  value={form.crop} onChange={(t: string) => updateForm('crop', t)} 
                />
                <FormInput 
                  label="Location" 
                  placeholder="e.g. Anuradhapura" 
                  icon="map-marker-outline"
                  value={form.location} onChange={(t: string) => updateForm('location', t)} 
                />
              </>
            )}

            {/* STEP 2: FINANCIALS */}
            {step === 2 && (
              <>
                <Text style={s.cardTitle}>Financial Goals</Text>
                <FormInput 
                  label="Funding Goal" 
                  placeholder="0.00" 
                  keyboardType="numeric" 
                  prefix="LKR"
                  value={form.amount} onChange={(t: string) => updateForm('amount', t)} 
                />
                <FormInput 
                  label="Duration" 
                  placeholder="e.g. 6" 
                  keyboardType="numeric"
                  suffix="Months"
                  value={form.duration} onChange={(t: string) => updateForm('duration', t)} 
                />
                <FormInput 
                  label="Expected ROI" 
                  placeholder="e.g. 15" 
                  keyboardType="numeric"
                  suffix="%"
                  value={form.roi} onChange={(t: string) => updateForm('roi', t)} 
                />
                <View style={s.tipBox}>
                  <MaterialCommunityIcons name="lightbulb-on" size={18} color={COLORS.accentWarm} />
                  <Text style={s.tipText}>Tip: Realistic ROIs between 12-18% attract 2x more investors.</Text>
                </View>
              </>
            )}

            {/* STEP 3: DETAILS & VISUALS */}
            {step === 3 && (
              <>
                <Text style={s.cardTitle}>Details & Media</Text>
                
                <TouchableOpacity style={s.uploadBox}>
                  <MaterialCommunityIcons name="camera-plus" size={32} color={COLORS.primary} />
                  <Text style={s.uploadText}>Tap to upload Cover Photo</Text>
                </TouchableOpacity>

                <FormInput 
                  label="Description" 
                  placeholder="Describe soil quality, water source, and harvest plan..." 
                  multiline
                  value={form.description} onChange={(t: string) => updateForm('description', t)} 
                />

                <View style={s.aiPreview}>
                  <View style={s.aiHeader}>
                    <MaterialCommunityIcons name="robot" size={16} color={COLORS.white} />
                    <Text style={s.aiTitle}>AI Risk Check Pending</Text>
                  </View>
                  <Text style={s.aiDesc}>We will analyze local weather patterns automatically upon submission.</Text>
                </View>
              </>
            )}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── FOOTER ── */}
      <View style={s.footer}>
        <TouchableOpacity style={s.nextBtn} onPress={handleNext}>
          <Text style={s.nextText}>{step === 3 ? 'Submit Project' : 'Continue'}</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { paddingBottom: 100 },

  /* HEADER */
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20,
    borderBottomRightRadius: 40, borderBottomLeftRadius: 40,
    overflow: 'hidden', position: 'relative',
    alignItems: 'center', marginBottom: 10
  },
  decCircleLg: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: COLORS.primaryLight, top: -80, right: -60, opacity: 0.4 },
  decCircleSm: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.accent, bottom: -40, left: -20, opacity: 0.2 },
  
  backBtn: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.white, marginTop: 10 },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: 4 },

  /* PROGRESS BAR */
  progressContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 50, marginTop: -25, marginBottom: 20, position: 'relative' },
  progressLineBg: { position: 'absolute', top: 15, left: 0, right: 0, height: 3, backgroundColor: '#E0E0E0', zIndex: 0 },
  progressLine: { position: 'absolute', top: 15, left: 0, height: 3, backgroundColor: COLORS.accent, zIndex: 1 },
  stepDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', zIndex: 2, borderWidth: 2, borderColor: '#E0E0E0', elevation: 3 },
  stepDotActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  stepNum: { fontSize: 12, fontWeight: 'bold', color: COLORS.textMuted },

  /* CARD */
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 24, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3
  },
  cardTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 20 },

  /* INPUTS */
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 14, paddingHorizontal: 14, height: 52
  },
  input: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '600' },
  prefix: { fontSize: 15, fontWeight: '700', color: COLORS.textMuted, marginRight: 8 },
  suffix: { fontSize: 15, fontWeight: '700', color: COLORS.textMuted, marginLeft: 8 },

  /* EXTRAS */
  tipBox: { flexDirection: 'row', backgroundColor: '#FFF8E1', padding: 12, borderRadius: 12, gap: 10, marginTop: 5 },
  tipText: { flex: 1, fontSize: 12, color: '#8D6E63', lineHeight: 18 },

  uploadBox: {
    height: 120, borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed',
    borderRadius: 16, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#FAFAFA', marginBottom: 20
  },
  uploadText: { color: COLORS.textMuted, marginTop: 8, fontWeight: '600', fontSize: 13 },

  aiPreview: { backgroundColor: '#E8F5E1', borderRadius: 16, padding: 16, marginTop: 5 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 8 },
  aiTitle: { color: '#fff', fontSize: 10, fontWeight: '700', marginLeft: 6 },
  aiDesc: { fontSize: 12, color: '#4A6B42', lineHeight: 18 },

  /* FOOTER */
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white, padding: 20, paddingBottom: 30,
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, elevation: 20
  },
  nextBtn: {
    flexDirection: 'row', backgroundColor: COLORS.primary,
    height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', gap: 10,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, elevation: 5
  },
  nextText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }
});