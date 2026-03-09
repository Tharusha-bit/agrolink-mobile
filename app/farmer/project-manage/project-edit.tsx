import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { ComponentProps, useState } from 'react';
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
  View,
} from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// ICON TYPES
// ─────────────────────────────────────────────────────────────────────────────
type MCIcon  = ComponentProps<typeof MaterialCommunityIcons>['name'];
type IonIcon = ComponentProps<typeof Ionicons>['name'];

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  primary:     '#216000',
  primaryMid:  '#2E8B00',
  primaryPale: '#E8F5E1',
  accent:      '#76C442',
  surface:     '#F7F9F4',
  white:       '#FFFFFF',
  ink:         '#1A2E0D',
  inkSub:      '#4A6741',
  inkMuted:    '#9BB08A',
  border:      '#DDE8D4',
  divider:     '#EEF5E8',
  amber:       '#F59E0B',
  amberPale:   '#FEF3C7',
  red:         '#C62828',
  redPale:     '#FFEBEE',
};

const SH = {
  sm: Platform.select({
    ios:     { shadowColor: '#1A2E0D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6  },
    android: { elevation: 2 },
  }),
  md: Platform.select({
    ios:     { shadowColor: '#1A2E0D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 12 },
    android: { elevation: 4 },
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// FIELD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface FieldProps {
  label:        string;
  value:        string;
  onChange:     (t: string) => void;
  placeholder?: string;
  multiline?:   boolean;
  icon?:        MCIcon;
  hint?:        string;
  editable?:    boolean;
  maxLength?:   number;
}

function Field({
  label, value, onChange, placeholder, multiline, icon, hint, editable = true, maxLength,
}: FieldProps) {
  return (
    <View style={f.group}>
      <Text style={f.label}>{label}</Text>
      <View style={[f.inputWrap, multiline && f.inputWrapMulti, !editable && f.inputWrapDisabled]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={18}
            color={editable ? C.primary : C.inkMuted}
            style={f.icon}
          />
        )}
        <TextInput
          style={[f.input, multiline && f.inputMulti]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={C.inkMuted}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'auto'}
          editable={editable}
          maxLength={maxLength}
        />
        {maxLength && (
          <Text style={f.counter}>{value.length}/{maxLength}</Text>
        )}
      </View>
      {hint && <Text style={f.hint}>{hint}</Text>}
    </View>
  );
}

const f = StyleSheet.create({
  group:             { marginBottom: 18 },
  label:             { fontSize: 11, fontWeight: '800', color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 7 },
  inputWrap:         { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border, borderRadius: 14, paddingHorizontal: 14, minHeight: 52 },
  inputWrapMulti:    { alignItems: 'flex-start', paddingTop: 13, minHeight: 110 },
  inputWrapDisabled: { backgroundColor: C.surface, borderColor: C.divider },
  icon:              { marginRight: 10 },
  input:             { flex: 1, fontSize: 15, color: C.ink, fontWeight: '600', paddingVertical: 13 },
  inputMulti:        { paddingVertical: 0, minHeight: 80 },
  counter:           { position: 'absolute', bottom: 8, right: 12, fontSize: 10, color: C.inkMuted },
  hint:              { fontSize: 11, color: C.inkMuted, marginTop: 5, marginLeft: 2 },
});

// ─────────────────────────────────────────────────────────────────────────────
// INFO BOX COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function InfoBox({ icon, text, color, bg }: { icon: MCIcon; text: string; color: string; bg: string }) {
  return (
    <View style={[ib.wrap, { backgroundColor: bg }]}>
      <MaterialCommunityIcons name={icon} size={16} color={color} />
      <Text style={[ib.text, { color }]}>{text}</Text>
    </View>
  );
}
const ib = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 14 },
  text: { flex: 1, fontSize: 12, fontWeight: '600', lineHeight: 18 },
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function EditProjectScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [title,    setTitle]    = useState('Yala Season Paddy');
  const [desc,     setDesc]     = useState('Seeking investment for 8 acres of fertile paddy field. Excellent soil quality and reliable water access from the north irrigation canal.');
  const [location, setLocation] = useState('Anuradhapura');
  const [tags,     setTags]     = useState('Paddy, Rice, Organic');
  const [saving,   setSaving]   = useState(false);

  function handleBack() {
    if (id) router.push(`/farmer/project-manage/${id}` as any);
    else     router.back();
  }

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a project title before saving.');
      return;
    }
    if (desc.trim().length < 20) {
      Alert.alert('Description Too Short', 'Please write at least 20 characters in the description.');
      return;
    }

    setSaving(true);
    // Simulate async save (replace with real API call)
    await new Promise<void>(r => setTimeout(r, 600));
    setSaving(false);

    Alert.alert(
      '✅ Project Updated',
      'Your project details have been saved successfully.',
      [{ text: 'Back to Project', onPress: handleBack }]
    );
  }

  const backIcon:  IonIcon = 'arrow-back';
  const editIcon:  MCIcon  = 'pencil-outline';
  const lockIcon:  MCIcon  = 'lock-outline';
  const infoIcon:  MCIcon  = 'information-outline';
  const warnIcon:  MCIcon  = 'alert-circle-outline';
  const saveIcon:  MCIcon  = 'content-save-outline';

  return (
    <View style={ms.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* ── HEADER ── */}
      <View style={ms.header}>
        <View style={ms.arc} />
        <View style={ms.topNav}>
          <TouchableOpacity
            onPress={handleBack}
            style={ms.navBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name={backIcon} size={22} color={C.white} />
          </TouchableOpacity>

          <Text style={ms.hTitle}>Edit Project</Text>

          <TouchableOpacity
            onPress={handleSave}
            style={[ms.saveBtn, saving && ms.saveBtnDisabled]}
            disabled={saving}
          >
            <Text style={ms.saveBtnText}>{saving ? 'Saving…' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={ms.hSub}>Update your project information</Text>
      </View>

      {/* ── FORM ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={ms.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Editable fields card */}
          <Text style={ms.sectionLabel}>EDITABLE FIELDS</Text>
          <View style={[ms.card, SH.md]}>
            <Field
              label="Project Title"
              icon={editIcon}
              value={title}
              onChange={setTitle}
              placeholder="e.g. Yala Season Paddy"
              maxLength={60}
            />
            <Field
              label="Farm Location"
              icon={'map-marker-outline' as MCIcon}
              value={location}
              onChange={setLocation}
              placeholder="e.g. Anuradhapura"
            />
            <Field
              label="Project Tags"
              icon={'tag-multiple-outline' as MCIcon}
              value={tags}
              onChange={setTags}
              placeholder="e.g. Paddy, Rice, Organic"
              hint="Separate tags with commas"
            />
            <Field
              label="Description"
              icon={'text-long' as MCIcon}
              value={desc}
              onChange={setDesc}
              placeholder="Describe your soil quality, water source, and harvest plan…"
              multiline
              maxLength={500}
            />
          </View>

          {/* Locked fields card */}
          <Text style={ms.sectionLabel}>LOCKED FIELDS</Text>
          <View style={[ms.card, SH.sm]}>
            <Field
              label="Funding Goal (LKR)"
              icon={lockIcon}
              value="60,000"
              onChange={() => {}}
              editable={false}
            />
            <Field
              label="Duration (Months)"
              icon={lockIcon}
              value="4 Months"
              onChange={() => {}}
              editable={false}
            />
            <Field
              label="Expected ROI"
              icon={lockIcon}
              value="12 – 15%"
              onChange={() => {}}
              editable={false}
            />

            <InfoBox
              icon={warnIcon}
              text="Funding Goal, Duration, and ROI cannot be changed once your project is active and receiving investments."
              color={C.amber}
              bg={C.amberPale}
            />
          </View>

          {/* Info box */}
          <InfoBox
            icon={infoIcon}
            text="Changes to title, description, and tags are visible to investors immediately after saving."
            color={C.primary}
            bg={C.primaryPale}
          />

          {/* Bottom save button */}
          <TouchableOpacity
            style={[ms.bottomBtn, SH.md, saving && ms.bottomBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name={saveIcon} size={20} color={C.white} />
            <Text style={ms.bottomBtnText}>{saving ? 'Saving Changes…' : 'Save Changes'}</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const ms = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.surface },
  scroll: { padding: 16, paddingBottom: 140 },

  // Header
  header: {
    backgroundColor: C.primary,
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    gap: 8,
    marginBottom: 20,
  },
  arc:    { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: C.primaryMid, opacity: 0.25, top: -90, right: -50 },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.16)', justifyContent: 'center', alignItems: 'center' },
  hTitle: { fontSize: 18, fontWeight: '800', color: C.white, letterSpacing: 0.2 },
  hSub:   { fontSize: 12, color: 'rgba(255,255,255,0.65)' },

  saveBtn:         { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12 },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText:     { fontSize: 14, fontWeight: '800', color: C.white },

  // Section
  sectionLabel: { fontSize: 11, fontWeight: '800', color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 },

  // Card
  card: { backgroundColor: C.white, borderRadius: 20, padding: 18, marginBottom: 20 },

  // Bottom CTA
  bottomBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.primary, borderRadius: 18, height: 56, marginTop: 10 },
  bottomBtnDisabled: { opacity: 0.6 },
  bottomBtnText:     { fontSize: 16, fontWeight: '800', color: C.white, letterSpacing: 0.3 },
});