import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { ComponentProps, useEffect, useState } from "react";
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

// ─────────────────────────────────────────────────────────────────────────────
// ✅ CLOUDINARY CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME = "dhnl8fkno";
const CLOUDINARY_UPLOAD_PRESET = "paddy_preset";

// ─────────────────────────────────────────────────────────────────────────────
// ICON TYPES & THEME
// ─────────────────────────────────────────────────────────────────────────────
type MCIcon = ComponentProps<typeof MaterialCommunityIcons>["name"];
type IonIcon = ComponentProps<typeof Ionicons>["name"];

const T = {
  primary: "#216000",
  primaryLight: "#2E8B00",
  primaryPale: "#E8F5E1",
  surface: "#F7F9F4",
  white: "#FFFFFF",
  ink: "#1A2E0D",
  inkMuted: "#9BB08A",
  border: "#DDE8D4",
  accent: "#76C442",
  accentWarm: "#F5A623",
  error: "#D32F2F",
  errorPale: "#FFEBEE",
};

const FONT = { xs: 11, sm: 12, md: 14, lg: 16, xl: 18, xxl: 24 };
const SPACE = { xs: 6, sm: 10, md: 16, lg: 20, xl: 24 };

const TRANSLATIONS = {
  en: {
    headerTitle: "New Farm Project",
    step1: "Basics",
    step2: "Financials",
    step3: "Details",
    basicsTitle: "Project Basics",
    projTitle: "Project Title",
    titleHint: "e.g. Yala Season Paddy",
    cropType: "Crop Type",
    location: "Farm Location",
    locHint: "e.g. Anuradhapura",
    finTitle: "Financial Goals",
    goal: "Funding Goal",
    goalHint: "Total amount you need to raise",
    minInv: "Minimum Investment",
    minInvHint: "Smallest amount contribution",
    duration: "Duration",
    durHint: "Months",
    minRoi: "Min ROI",
    maxRoi: "Max ROI",
    expRev: "Expected Revenue",
    expRevHint: "Estimated total harvest income",
    tip: "Tip: Realistic ROIs of 12–18% are more attractive.",
    detailsTitle: "Details & Media",
    upload: "Tap to upload Cover Photo",
    uploadSub: "JPG or PNG · max 5 MB",
    uploadingImage: "Uploading cover image...",
    uploadFail: "Image upload failed. Please try again.",
    desc: "Project Description",
    descHint: "Describe soil, water, harvest plan...",
    riskLvl: "Calculated Risk Level",
    aiPend: "AI Verification Pending",
    aiDesc: "Our system cross-checks local data to generate a trust score.",
    continue: "Continue",
    submit: "Submit Project",
    submitting: "Creating Project...",
    errMissing: "Missing Information",
    errFail: "Submission Failed",
    errMissingImage: "Please upload a cover photo.",
    successTitle: "🌱 Project Submitted!",
    successBody: "Your project has been submitted for verification.",
    btnDashboard: "Go to Dashboard",
    changeImage: "Change Image",
  },
  si: {
    headerTitle: "නව ගොවිපල ව්‍යාපෘතිය",
    step1: "මූලික",
    step2: "මූල්‍ය",
    step3: "විස්තර",
    basicsTitle: "ව්‍යාපෘතියේ මූලික කරුණු",
    projTitle: "ව්‍යාපෘතියේ නම",
    titleHint: "උදා. යල කන්නයේ වී ගොවිතැන",
    cropType: "බෝග වර්ගය",
    location: "ස්ථානය",
    locHint: "උදා. අනුරාධපුරය",
    finTitle: "මූල්‍ය ඉලක්ක",
    goal: "අරමුදල් ඉලක්කය",
    goalHint: "ඔබට අවශ්‍ය මුළු මුදල",
    minInv: "අවම ආයෝජනය",
    minInvHint: "අවම දායකත්ව මුදල",
    duration: "කාලය",
    durHint: "මාස",
    minRoi: "අවම ප්‍රතිලාභය",
    maxRoi: "උපරිම ප්‍රතිලාභය",
    expRev: "අපේක්ෂිත ආදායම",
    expRevHint: "ඇස්තමේන්තුගත අස්වනු ආදායම",
    tip: "ඉඟිය: 12-18% ක ප්‍රතිලාභ ආයෝජකයින්ව ආකර්ෂණය කරයි.",
    detailsTitle: "විස්තර සහ මාධ්‍ය",
    upload: "ඡායාරූපය උඩුගත කරන්න",
    uploadSub: "JPG හෝ PNG · උපරිම 5 MB",
    uploadingImage: "ඡායාරූපය උඩුගත වෙමින් පවතී...",
    uploadFail: "ඡායාරූපය උඩුගත කිරීම අසාර්ථක විය.",
    desc: "ව්‍යාපෘති විස්තරය",
    descHint: "පස, ජලය ගැන විස්තර කරන්න...",
    riskLvl: "අවදානම් මට්ටම",
    aiPend: "AI තහවුරු කිරීම පවතී",
    aiDesc: "කාලගුණය සහ පස පරිගණක පද්ධතිය මගින් පරීක්ෂා කෙරේ.",
    continue: "ඉදිරියට",
    submit: "ඉදිරිපත් කරන්න",
    submitting: "සාදමින් පවතී...",
    errMissing: "තොරතුරු අඩුයි",
    errFail: "අසාර්ථකයි",
    errMissingImage: "කරුණාකර ඡායාරූපයක් උඩුගත කරන්න.",
    successTitle: "🌱 සාර්ථකයි!",
    successBody: "ව්‍යාපෘතිය අනුමත කිරීම සඳහා යොමු කරන ලදී.",
    btnDashboard: "ප්‍රධාන තිරයට",
    changeImage: "ඡායාරූපය වෙනස් කරන්න",
  },
  ta: {
    headerTitle: "புதிய பண்ணை திட்டம்",
    step1: "அடிப்படைகள்",
    step2: "நிதியியல்",
    step3: "விவரங்கள்",
    basicsTitle: "திட்ட அடிப்படைகள்",
    projTitle: "திட்டத்தின் பெயர்",
    titleHint: "எ.கா. நெல் சாகுபடி",
    cropType: "பயிர் வகை",
    location: "இடம்",
    locHint: "எ.கா. அனுராதபுரம்",
    finTitle: "நிதி இலக்குகள்",
    goal: "நிதி இலக்கு",
    goalHint: "தேவையான மொத்த தொகை",
    minInv: "குறைந்தபட்ச முதலீடு",
    minInvHint: "குறைந்தபட்ச பங்களிப்பு",
    duration: "காலம்",
    durHint: "மாதங்கள்",
    minRoi: "குறைந்த ROI",
    maxRoi: "அதிக ROI",
    expRev: "எதிர்பார்க்கப்படும் வருவாய்",
    expRevHint: "மதிப்பிடப்பட்ட வருமானம்",
    tip: "குறிப்பு: 12-18% ROI முதலீட்டாளர்களை அதிகம் ஈர்க்கும்.",
    detailsTitle: "விவரங்கள் & ஊடகம்",
    upload: "புகைப்படத்தை பதிவேற்றவும்",
    uploadSub: "JPG அல்லது PNG · 5 MB",
    uploadingImage: "படம் பதிவேற்றப்படுகிறது...",
    uploadFail: "படம் பதிவேற்றம் தோல்வியடைந்தது.",
    desc: "திட்ட விளக்கம்",
    descHint: "மண் தரம், நீர் ஆதாரம் பற்றி விவரிக்கவும்...",
    riskLvl: "ஆபத்து நிலை",
    aiPend: "AI சரிபார்ப்பு",
    aiDesc: "வானிலை மற்றும் மண்ணுடன் தரவு சரிபார்க்கப்படும்.",
    continue: "தொடர்க",
    submit: "சமர்ப்பி",
    submitting: "உருவாக்குகிறது...",
    errMissing: "தகவல் இல்லை",
    errFail: "தோல்வி",
    errMissingImage: "புகைப்படத்தை பதிவேற்றவும்.",
    successTitle: "🌱 சமர்ப்பிக்கப்பட்டது!",
    successBody: "உங்கள் திட்டம் சரிபார்ப்புக்கு அனுப்பப்பட்டது.",
    btnDashboard: "முகப்பு திரைக்குச் செல்",
    changeImage: "படத்தை மாற்றவும்",
  },
};

interface FormState {
  title: string;
  crop: string;
  location: string;
  goal: string;
  duration: string;
  roiMin: string;
  roiMax: string;
  minInvest: string;
  expRevenue: string;
  description: string;
  localImageUri: string | null;
}

const EMPTY_FORM: FormState = {
  title: "",
  crop: "Paddy",
  location: "",
  goal: "",
  duration: "",
  roiMin: "",
  roiMax: "",
  minInvest: "",
  expRevenue: "",
  description: "",
  localImageUri: null,
};

function calculateRiskLevel(roiMax: number): "Low" | "Medium" | "High" {
  if (roiMax > 20) return "High";
  if (roiMax >= 15) return "Medium";
  return "Low";
}

function validateForm(
  form: FormState,
  step: number,
  t: any,
): { valid: boolean; message: string } {
  if (step === 1) {
    if (!form.title.trim() || !form.location.trim())
      return { valid: false, message: t.errMissing };
  }
  if (step === 2) {
    const goal = parseFloat(form.goal);
    const duration = parseFloat(form.duration);
    const roiMin = parseFloat(form.roiMin);
    const roiMax = parseFloat(form.roiMax);
    const minInvest = parseFloat(form.minInvest);
    const expRev = parseFloat(form.expRevenue);

    if (!form.goal || isNaN(goal) || goal <= 0)
      return { valid: false, message: t.errMissing };
    if (!form.expRevenue || isNaN(expRev) || expRev <= 0)
      return { valid: false, message: t.errMissing };
    if (!form.minInvest || isNaN(minInvest) || minInvest <= 0)
      return { valid: false, message: t.errMissing };
    if (!form.duration || isNaN(duration) || duration <= 0)
      return { valid: false, message: t.errMissing };
    if (!form.roiMin || isNaN(roiMin) || roiMin <= 0)
      return { valid: false, message: t.errMissing };
    if (!form.roiMax || isNaN(roiMax) || roiMax <= 0)
      return { valid: false, message: t.errMissing };
    if (roiMin >= roiMax) return { valid: false, message: t.errMissing };
  }
  if (step === 3) {
    if (!form.localImageUri)
      return { valid: false, message: t.errMissingImage };
    if (form.description.trim().length < 20)
      return { valid: false, message: t.errMissing }; // ⚠️ Minimum 20 Characters!
  }
  return { valid: true, message: "" };
}

function FormInput({
  label,
  placeholder,
  value,
  onChange,
  keyboardType = "default",
  prefix,
  suffix,
  icon,
  multiline,
  hint,
  editable = true,
}: any) {
  return (
    <View style={fi.group}>
      <Text style={fi.label}>{label}</Text>
      <View
        style={[
          fi.wrap,
          multiline && fi.wrapMulti,
          !editable && fi.wrapDisabled,
        ]}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={editable ? T.primary : T.inkMuted}
            style={fi.icon}
          />
        )}
        {prefix && <Text style={fi.prefix}>{prefix}</Text>}
        <TextInput
          style={[
            fi.input,
            multiline && fi.inputMulti,
            !editable && fi.inputDisabled,
          ]}
          placeholder={placeholder}
          placeholderTextColor={T.inkMuted}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "auto"}
          editable={editable}
        />
        {suffix && <Text style={fi.suffix}>{suffix}</Text>}
      </View>
      {hint && <Text style={fi.hint}>{hint}</Text>}
    </View>
  );
}
const fi = StyleSheet.create({
  group: { marginBottom: SPACE.md },
  label: {
    fontSize: FONT.xs,
    fontWeight: "700",
    color: T.inkMuted,
    marginBottom: SPACE.xs,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.surface,
    borderWidth: 1.5,
    borderColor: T.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  wrapMulti: { height: 110, alignItems: "flex-start", paddingTop: 14 },
  wrapDisabled: { backgroundColor: "#F0F0F0", borderColor: "#E0E0E0" },
  icon: { marginRight: 10 },
  prefix: {
    fontSize: FONT.lg,
    fontWeight: "700",
    color: T.inkMuted,
    marginRight: 8,
  },
  suffix: {
    fontSize: FONT.lg,
    fontWeight: "700",
    color: T.inkMuted,
    marginLeft: 8,
  },
  input: { flex: 1, fontSize: FONT.lg, color: T.ink, fontWeight: "600" },
  inputMulti: { height: "100%" },
  inputDisabled: { color: T.inkMuted },
  hint: { fontSize: FONT.xs, color: T.inkMuted, marginTop: 4, marginLeft: 2 },
});

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <View style={si.row}>
      <View style={[si.lineBg]} />
      <View
        style={[si.lineFg, { width: `${((step - 1) / (total - 1)) * 100}%` }]}
      />
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <View
          key={n}
          style={[si.dot, step >= n && si.dotActive, step > n && si.dotDone]}
        >
          {step > n ? (
            <Ionicons name="checkmark" size={14} color={T.white} />
          ) : (
            <Text style={[si.num, step >= n && si.numActive]}>{n}</Text>
          )}
        </View>
      ))}
    </View>
  );
}
const si = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 40,
    marginTop: -20,
    marginBottom: 24,
    position: "relative",
  },
  lineBg: {
    position: "absolute",
    top: 17,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#E0E0E0",
    zIndex: 0,
  },
  lineFg: {
    position: "absolute",
    top: 17,
    left: 0,
    height: 3,
    backgroundColor: T.accent,
    zIndex: 1,
  },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: T.white,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    elevation: 3,
  },
  dotActive: { borderColor: T.accent },
  dotDone: { backgroundColor: T.accent, borderColor: T.accent },
  num: { fontSize: FONT.sm, fontWeight: "800", color: T.inkMuted },
  numActive: { color: T.accent },
});

function RiskBadge({ level }: any) {
  const config = {
    Low: {
      bg: T.primaryPale,
      color: T.primary,
      icon: "shield-check-outline" as MCIcon,
    },
    Medium: {
      bg: "#FFF8E1",
      color: T.accentWarm,
      icon: "shield-half-full" as MCIcon,
    },
    High: {
      bg: T.errorPale,
      color: T.error,
      icon: "shield-alert-outline" as MCIcon,
    },
  };
  const c = config[level as keyof typeof config];
  return (
    <View style={[rb.wrap, { backgroundColor: c.bg }]}>
      <MaterialCommunityIcons name={c.icon} size={16} color={c.color} />
      <Text style={[rb.text, { color: c.color }]}>{level} Risk</Text>
    </View>
  );
}
const rb = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  text: { fontSize: FONT.sm, fontWeight: "800" },
});

export default function CreateProjectScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [farmerId, setFarmerId] = useState<string | null>(null);

  const [lang, setLang] = useState<"en" | "si" | "ta">("en");
  const t = TRANSLATIONS[lang];

  const previewRoiMax = parseFloat(form.roiMax) || 0;
  const previewRiskLevel = calculateRiskLevel(previewRoiMax);

  useEffect(() => {
    AsyncStorage.getItem("userId").then((id) => {
      if (id) setFarmerId(id);
      else Alert.alert("Error", "You must be logged in to create a project.");
    });
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleBack() {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3);
    else router.back();
  }

  function handleNext() {
    const { valid, message } = validateForm(form, step, t);
    if (!valid) {
      Alert.alert(t.errMissing, message);
      return;
    }
    if (step < 3) setStep((s) => (s + 1) as 2 | 3);
    else handleSubmit();
  }

  // ✅ Image Picker Update to fix warning
  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // ✅ FIXED THE WARNING HERE
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      updateField("localImageUri", result.assets[0].uri);
    }
  };

  const uploadToCloudinary = async (
    localUri: string,
  ): Promise<string | null> => {
    try {
      const fileData = {
        uri: Platform.OS === "ios" ? localUri.replace("file://", "") : localUri,
        type: "image/jpeg",
        name: `paddy_field_${Date.now()}.jpg`,
      };

      const formData = new FormData();
      formData.append("file", fileData as any);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
      const cloudRes = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (cloudRes.data.secure_url) {
        return cloudRes.data.secure_url;
      }
      return null;
    } catch (e) {
      console.error("Cloudinary upload failed", e);
      return null;
    }
  };

  async function handleSubmit() {
    const { valid, message } = validateForm(form, 3, t);
    if (!valid) {
      Alert.alert(t.errMissing, message);
      return;
    }
    if (!farmerId) {
      Alert.alert("Error", "Authentication missing.");
      return;
    }

    setSubmitting(true);
    let cloudinaryUrl = "";

    try {
      if (form.localImageUri) {
        console.log("Starting image upload to Cloudinary...");
        const uploadedUrl = await uploadToCloudinary(form.localImageUri);
        if (uploadedUrl) {
          cloudinaryUrl = uploadedUrl;
          console.log("Uploaded URL:", cloudinaryUrl);
        } else {
          Alert.alert(t.errFail, t.uploadFail);
          setSubmitting(false);
          return;
        }
      }

      const payload = {
        farmerId: farmerId,
        projectTitle: form.title.trim(),
        cropType: form.crop.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        fundingGoal: parseFloat(form.goal),
        minimumInvestment: parseFloat(form.minInvest),
        durationInMonths: parseInt(form.duration, 10),
        expectedRevenue: parseFloat(form.expRevenue),
        minRoi: parseFloat(form.roiMin),
        maxRoi: parseFloat(form.roiMax),
        photos: [cloudinaryUrl],
      };

      // ⚠️ UPDATE THIS IP TO YOUR LAPTOP'S WI-FI IP
      const API_URL = "http://172.20.10.6:8080/api/farmer-project/create";

      const response = await axios.post(API_URL, payload);

      if (response.status === 200) {
        Alert.alert(t.successTitle, t.successBody, [
          {
            text: t.btnDashboard,
            onPress: () => router.replace("/farmer/farmerhome" as any),
          },
        ]);
      }
    } catch (error) {
      console.error("Submission error", error);
      Alert.alert(t.errFail, "Could not connect to the server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={T.primary} />

      <View style={s.header}>
        <View style={s.decLg} />
        <View style={s.decSm} />

        <View style={s.topNavRow}>
          <TouchableOpacity onPress={handleBack} style={s.backBtn}>
            <Ionicons
              name={"arrow-back" as IonIcon}
              size={24}
              color={T.white}
            />
          </TouchableOpacity>

          <View style={s.langGroup}>
            <TouchableOpacity
              onPress={() => setLang("en")}
              style={[s.langBtn, lang === "en" && s.langBtnActive]}
            >
              <Text style={[s.langText, lang === "en" && s.langTextActive]}>
                EN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLang("si")}
              style={[s.langBtn, lang === "si" && s.langBtnActive]}
            >
              <Text style={[s.langText, lang === "si" && s.langTextActive]}>
                සිං
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLang("ta")}
              style={[s.langBtn, lang === "ta" && s.langBtnActive]}
            >
              <Text style={[s.langText, lang === "ta" && s.langTextActive]}>
                தமிழ்
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={s.hTitle}>{t.headerTitle}</Text>
        <Text style={s.hSub}>
          Step {step} of 3 ·{" "}
          {step === 1 ? t.step1 : step === 2 ? t.step2 : t.step3}
        </Text>
      </View>

      <StepIndicator step={step} total={3} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={s.card}>
            {step === 1 && (
              <>
                <Text style={s.cardTitle}>{t.basicsTitle}</Text>
                <FormInput
                  label={t.projTitle}
                  placeholder={t.titleHint}
                  icon={"format-title" as MCIcon}
                  value={form.title}
                  onChange={(v: string) => updateField("title", v)}
                />
                <FormInput
                  label={t.cropType}
                  placeholder="Paddy"
                  icon={"sprout-outline" as MCIcon}
                  value={form.crop}
                  onChange={() => {}}
                  editable={false}
                  hint="Locked to Paddy for pilot phase."
                />
                <FormInput
                  label={t.location}
                  placeholder={t.locHint}
                  icon={"map-marker-outline" as MCIcon}
                  value={form.location}
                  onChange={(v: string) => updateField("location", v)}
                />
              </>
            )}

            {step === 2 && (
              <>
                <Text style={s.cardTitle}>{t.finTitle}</Text>
                <FormInput
                  label={t.goal}
                  placeholder="e.g. 80000"
                  keyboardType="numeric"
                  prefix="LKR"
                  hint={t.goalHint}
                  value={form.goal}
                  onChange={(v: string) => updateField("goal", v)}
                />
                <FormInput
                  label={t.expRev}
                  placeholder="e.g. 150000"
                  keyboardType="numeric"
                  prefix="LKR"
                  hint={t.expRevHint}
                  value={form.expRevenue}
                  onChange={(v: string) => updateField("expRevenue", v)}
                />
                <FormInput
                  label={t.minInv}
                  placeholder="e.g. 5000"
                  keyboardType="numeric"
                  prefix="LKR"
                  hint={t.minInvHint}
                  value={form.minInvest}
                  onChange={(v: string) => updateField("minInvest", v)}
                />
                <FormInput
                  label={t.duration}
                  placeholder="e.g. 6"
                  keyboardType="numeric"
                  suffix={t.durHint}
                  value={form.duration}
                  onChange={(v: string) => updateField("duration", v)}
                />

                <View style={s.roiRow}>
                  <View style={{ flex: 1 }}>
                    <FormInput
                      label={t.minRoi}
                      placeholder="12"
                      keyboardType="numeric"
                      suffix="%"
                      value={form.roiMin}
                      onChange={(v: string) => updateField("roiMin", v)}
                    />
                  </View>
                  <Text style={s.roiSep}>–</Text>
                  <View style={{ flex: 1 }}>
                    <FormInput
                      label={t.maxRoi}
                      placeholder="18"
                      keyboardType="numeric"
                      suffix="%"
                      value={form.roiMax}
                      onChange={(v: string) => updateField("roiMax", v)}
                    />
                  </View>
                </View>
                <View style={s.tipBox}>
                  <MaterialCommunityIcons
                    name={"lightbulb-on" as MCIcon}
                    size={18}
                    color={T.accentWarm}
                  />
                  <Text style={s.tipText}>{t.tip}</Text>
                </View>
              </>
            )}

            {step === 3 && (
              <>
                <Text style={s.cardTitle}>{t.detailsTitle}</Text>

                {form.localImageUri ? (
                  <View style={s.previewContainer}>
                    <Image
                      source={{ uri: form.localImageUri }}
                      style={s.previewImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={s.changeImageBtn}
                      onPress={handleImagePick}
                    >
                      <MaterialCommunityIcons
                        name={"camera-retake" as MCIcon}
                        size={16}
                        color={T.white}
                      />
                      <Text style={s.changeImageText}>{t.changeImage}</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={s.uploadBox}
                    onPress={handleImagePick}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name={"camera-plus" as MCIcon}
                      size={32}
                      color={T.primary}
                    />
                    <Text style={s.uploadText}>{t.upload}</Text>
                    <Text style={s.uploadHint}>{t.uploadSub}</Text>
                  </TouchableOpacity>
                )}

                <FormInput
                  label={t.desc}
                  placeholder={t.descHint}
                  multiline
                  hint="Minimum 20 characters"
                  value={form.description}
                  onChange={(v: string) => updateField("description", v)}
                />
                {previewRoiMax > 0 && (
                  <View style={s.riskPreview}>
                    <Text style={s.riskPreviewLabel}>{t.riskLvl}</Text>
                    <RiskBadge level={previewRiskLevel} t={t} />
                  </View>
                )}
                <View style={s.aiBox}>
                  <View style={s.aiPill}>
                    <MaterialCommunityIcons
                      name={"robot" as MCIcon}
                      size={13}
                      color={T.white}
                    />
                    <Text style={s.aiPillText}>{t.aiPend}</Text>
                  </View>
                  <Text style={s.aiDesc}>{t.aiDesc}</Text>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
              <Text style={s.nextText}>{t.submitting}</Text>
            </>
          ) : (
            <>
              <Text style={s.nextText}>
                {step === 3 ? t.submit : t.continue}
              </Text>
              <MaterialCommunityIcons
                name={"arrow-right" as MCIcon}
                size={20}
                color={T.white}
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.surface },
  scroll: { paddingBottom: 120 },
  header: {
    backgroundColor: T.primary,
    paddingTop: 50,
    paddingBottom: 44,
    paddingHorizontal: SPACE.lg,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    overflow: "hidden",
    alignItems: "center",
    position: "relative",
    marginBottom: 8,
  },
  decLg: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: T.primaryLight,
    top: -80,
    right: -60,
    opacity: 0.4,
  },
  decSm: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: T.accent,
    bottom: -40,
    left: -20,
    opacity: 0.2,
  },
  topNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  langGroup: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 3,
  },
  langBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  langBtnActive: { backgroundColor: T.white },
  langText: { fontSize: 10, fontWeight: "700", color: "rgba(255,255,255,0.7)" },
  langTextActive: { color: T.primary },
  hTitle: {
    fontSize: FONT.xxl,
    fontWeight: "800",
    color: T.white,
    marginTop: 8,
  },
  hSub: {
    fontSize: FONT.md,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  card: {
    backgroundColor: T.white,
    marginHorizontal: SPACE.md,
    borderRadius: 24,
    padding: SPACE.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: FONT.xl,
    fontWeight: "800",
    color: T.ink,
    marginBottom: SPACE.lg,
  },
  roiRow: { flexDirection: "row", gap: SPACE.sm, alignItems: "flex-start" },
  roiSep: {
    fontSize: FONT.xl,
    fontWeight: "800",
    color: T.inkMuted,
    marginTop: 28,
    paddingHorizontal: 4,
  },
  tipBox: {
    flexDirection: "row",
    backgroundColor: "#FFF8E1",
    padding: 12,
    borderRadius: 14,
    gap: 10,
    marginTop: 4,
  },
  tipText: { flex: 1, fontSize: FONT.sm, color: "#8D6E63", lineHeight: 18 },
  uploadBox: {
    height: 120,
    borderWidth: 2,
    borderColor: T.border,
    borderStyle: "dashed",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    marginBottom: SPACE.md,
    gap: 6,
  },
  uploadText: { color: T.primary, fontWeight: "700", fontSize: FONT.md },
  uploadHint: { color: T.inkMuted, fontSize: FONT.xs },
  previewContainer: {
    position: "relative",
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: SPACE.md,
  },
  previewImage: { width: "100%", height: "100%" },
  changeImageBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  changeImageText: { color: T.white, fontSize: 11, fontWeight: "700" },
  riskPreview: { marginBottom: SPACE.md },
  riskPreviewLabel: {
    fontSize: FONT.xs,
    fontWeight: "700",
    color: T.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: SPACE.xs,
  },
  aiBox: {
    backgroundColor: T.primaryPale,
    borderRadius: 16,
    padding: SPACE.md,
    marginTop: 4,
  },
  aiPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.primary,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
    gap: 6,
  },
  aiPillText: { color: T.white, fontSize: FONT.xs, fontWeight: "700" },
  aiDesc: { fontSize: FONT.sm, color: "#4A6B42", lineHeight: 18 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: T.white,
    padding: SPACE.lg,
    paddingBottom: 34,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    elevation: 20,
  },
  nextBtn: {
    flexDirection: "row",
    backgroundColor: T.primary,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: T.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  nextBtnDisabled: { backgroundColor: T.inkMuted },
  nextText: {
    color: T.white,
    fontSize: FONT.lg,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
