import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

// ─── Design Tokens ────────────────────────────────────────────────────────────
const COLORS = {
  primary: "#216000",
  primaryLight: "#2E8B00",
  primaryPale: "#E8F5E1",
  accent: "#76C442",
  accentWarm: "#F5A623",
  white: "#FFFFFF",
  surface: "#F7F9F4",
  card: "#FFFFFF",
  text: "#1A2E0D",
  textSecondary: "#5C7A4A",
  textMuted: "#9BB08A",
  border: "#DDE8D4",
  danger: "#E05252",
  info: "#3A9BD5",
  payhere: "#004C99",
  ai: "#8B5CF6",
};

const SHADOWS = {
  md: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    android: { elevation: 8 },
  }),
  sm: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
  }),
};

export default function ProjectDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [farmer, setFarmer] = useState<any>(null);
  const [investorId, setInvestorId] = useState<string | null>(null);
  const [investAmount, setInvestAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // AI Risk States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRiskData, setAiRiskData] = useState<any>(null);

  const API_URL = "http://172.20.10.6:8080";

  const fetchProjectDetails = async () => {
    try {
      const projRes = await axios.get(`${API_URL}/api/farmer-project/${id}`);
      setProject(projRes.data);
      if (projRes.data.farmerId) {
        const userRes = await axios.get(
          `${API_URL}/api/users/${projRes.data.farmerId}`,
        );
        setFarmer(userRes.data);
      }
    } catch (error) {
      console.error("Failed to load project", error);
      Alert.alert("Error", "Could not load project details.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setInvestorId(storedUserId);
      if (id) await fetchProjectDetails();
    };
    loadInitialData();
  }, [id]);

  if (loading || !project) {
    return (
      <View
        style={[s.root, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const goal = project.fundingGoal || 1;
  const raised = project.currentFundingAmount || 0;
  const progressPct = Math.min(Math.max(raised / goal, 0), 1);
  const remaining = goal - raised;
  const minInv = project.minimumInvestment || 10000;
  const avgRoi = ((project.minRoi || 10) + (project.maxRoi || 20)) / 2;

  const numericAmount = parseFloat(investAmount) || 0;
  let expectedReturn =
    numericAmount > 0 ? numericAmount + numericAmount * (avgRoi / 100) : 0;

  // ─── AI Risk Report Function ───
  const handleGenerateAIRisk = async () => {
    setAiLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/ai/risk/${id}`);
      setAiRiskData(res.data);
    } catch (error) {
      console.error("AI Error", error);
      Alert.alert("AI Error", "Could not connect to the AI Hybrid Risk Model.");
    } finally {
      setAiLoading(false);
    }
  };

  const saveInvestmentToDatabase = async () => {
    try {
      await axios.post(`${API_URL}/api/investments/invest`, {
        projectId: project.id,
        investorId: investorId,
        amount: numericAmount,
      });
      await fetchProjectDetails();
      setInvestAmount("");
      Alert.alert("Success! 🎉", "Investment recorded successfully.");
    } catch (error: any) {
      Alert.alert("Notice", error.response?.data || "Database update failed.");
    }
  };

  const handlePayHereInvest = async () => {
    if (numericAmount < minInv)
      return Alert.alert("Error", "Below minimum investment.");
    if (numericAmount > remaining)
      return Alert.alert("Error", "Exceeds remaining goal.");
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      saveInvestmentToDatabase();
    }, 2500);
  };

  const imageUri =
    project.photos?.[0] ||
    "https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg";

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "android" ? 24 : 0}
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ScrollView
        style={s.scrollArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* HERO */}
        <View style={s.heroContainer}>
          <Image source={{ uri: imageUri }} style={s.heroImg} />
          <View style={s.heroOverlay} />
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={s.heroContent}>
            <View style={s.tagWrap}>
              <Text style={s.tagText}>{project.cropType || "Agriculture"}</Text>
            </View>
            <Text style={s.title}>{project.projectTitle}</Text>
          </View>
        </View>

        <View style={s.bodyWrap}>
          {/* FARMER CARD */}
          <View style={[s.farmerCard, SHADOWS.sm]}>
            <View style={s.farmerAvatar}>
              <MaterialCommunityIcons
                name="account-cowboy-hat"
                size={28}
                color={COLORS.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.farmerName}>
                {farmer?.firstName} {farmer?.lastName}
              </Text>
              <Text style={s.farmerSub}>
                {project.location} • Trust Score: {farmer?.profileStrength}%
              </Text>
            </View>
            {farmer?.isVerified && (
              <MaterialCommunityIcons
                name="check-decagram"
                size={24}
                color={COLORS.primary}
              />
            )}
          </View>

          {/* PROGRESS */}
          <View style={s.progressSection}>
            <View style={s.progLabels}>
              <View>
                <Text style={s.progVal}>LKR {raised.toLocaleString()}</Text>
                <Text style={s.progSub}>Raised</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={s.progVal}>LKR {goal.toLocaleString()}</Text>
                <Text style={s.progSub}>Goal</Text>
              </View>
            </View>
            <View style={s.track}>
              <View style={[s.fill, { width: `${progressPct * 100}%` }]} />
            </View>
          </View>

          {/* FINANCIALS */}
          <Text style={s.sectionTitle}>Financial Overview</Text>
          <View style={s.finGrid}>
            <View style={[s.finBox, SHADOWS.sm]}>
              <MaterialCommunityIcons
                name="cash-fast"
                size={20}
                color={COLORS.accentWarm}
              />
              <Text style={s.finLbl}>Min. Investment</Text>
              <Text style={s.finVal}>LKR {(minInv / 1000).toFixed(0)}k</Text>
            </View>
            <View style={[s.finBox, SHADOWS.sm]}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={20}
                color={COLORS.info}
              />
              <Text style={s.finLbl}>Duration</Text>
              <Text style={s.finVal}>{project.durationInMonths} Months</Text>
            </View>
            <View style={[s.finBox, SHADOWS.sm]}>
              <MaterialCommunityIcons
                name="chart-bell-curve-cumulative"
                size={20}
                color={COLORS.primary}
              />
              <Text style={s.finLbl}>Est. ROI</Text>
              <Text style={s.finVal}>
                {project.minRoi}% - {project.maxRoi}%
              </Text>
            </View>
          </View>

          {/* ✅ RE-ADDED: AI RISK ANALYSIS BUTTON AND REPORT */}
          <View style={s.aiSection}>
            <View style={s.aiHeaderRow}>
              <MaterialCommunityIcons
                name="robot-outline"
                size={24}
                color={COLORS.ai}
              />
              <Text style={s.aiTitle}>AI Risk Analysis</Text>
            </View>

            {!aiRiskData ? (
              <TouchableOpacity
                style={s.aiGenBtn}
                onPress={handleGenerateAIRisk}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <ActivityIndicator color={COLORS.ai} size="small" />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="auto-fix"
                      size={18}
                      color={COLORS.ai}
                    />
                    <Text style={s.aiGenBtnText}>Generate AI Risk Report</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <View style={s.aiResultCard}>
                <View style={s.aiScoreRow}>
                  <View
                    style={[
                      s.aiBadge,
                      { backgroundColor: aiRiskData.color + "20" },
                    ]}
                  >
                    <Text style={[s.aiBadgeText, { color: aiRiskData.color }]}>
                      {aiRiskData.riskLevel}
                    </Text>
                  </View>
                  <Text style={s.aiScoreText}>
                    Score:{" "}
                    <Text style={{ color: aiRiskData.color }}>
                      {aiRiskData.riskScore}/100
                    </Text>
                  </Text>
                </View>
                <Text style={s.aiDesc}>{aiRiskData.description}</Text>

                <View style={s.disclaimerBox}>
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={14}
                    color={COLORS.textMuted}
                  />
                  <Text style={s.disclaimerText}>
                    This is an AI-generated prediction based on the hybrid
                    model. It does not guarantee investment results.
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* ABOUT */}
          <Text style={s.sectionTitle}>About the Project</Text>
          <Text style={s.descText}>{project.description}</Text>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[s.footer, SHADOWS.md]}>
        <View style={s.inputRow}>
          <View style={s.inputWrap}>
            <Text style={s.inputPrefix}>LKR</Text>
            <TextInput
              style={s.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={investAmount}
              onChangeText={setInvestAmount}
              returnKeyType="done"
            />
          </View>
          <View style={s.returnWrap}>
            <Text style={s.returnLbl}>Expected Return</Text>
            <Text style={s.returnVal}>
              LKR{" "}
              {expectedReturn.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            s.payBtn,
            (!investAmount || isProcessing) && { opacity: 0.7 },
          ]}
          onPress={handlePayHereInvest}
          disabled={!investAmount || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={20}
                color={COLORS.white}
              />
              <Text style={s.payBtnText}>Proceed to PayHere</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={s.payhereSub}>
          Secure checkout powered by PayHere Sandbox
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.surface },
  scrollArea: { flex: 1 },
  heroContainer: { height: 280, position: "relative" },
  heroImg: { width: "100%", height: "100%" },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroContent: { position: "absolute", bottom: 30, left: 24, right: 24 },
  tagWrap: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: { fontSize: 28, fontWeight: "900", color: COLORS.white },
  bodyWrap: {
    padding: 24,
    marginTop: -20,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  farmerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    gap: 14,
  },
  farmerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primaryPale,
    justifyContent: "center",
    alignItems: "center",
  },
  farmerName: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  farmerSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  progressSection: { marginBottom: 30 },
  progLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progVal: { fontSize: 16, fontWeight: "800", color: COLORS.primary },
  progSub: { fontSize: 11, color: COLORS.textMuted },
  track: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: COLORS.accent, borderRadius: 5 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 14,
  },
  finGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 30,
  },
  finBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    gap: 4,
  },
  finLbl: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    fontWeight: "700",
    textAlign: "center",
  },
  finVal: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },

  // AI Section
  aiSection: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.ai + "30",
  },
  aiHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },
  aiTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  aiGenBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.ai + "15",
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.ai + "40",
  },
  aiGenBtnText: { color: COLORS.ai, fontWeight: "700", fontSize: 14 },
  aiResultCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
  },
  aiScoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  aiBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  aiBadgeText: { fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  aiScoreText: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  aiDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  disclaimerBox: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.03)",
    padding: 10,
    borderRadius: 10,
    alignItems: "flex-start",
    gap: 6,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.textMuted,
    fontStyle: "italic",
    lineHeight: 14,
  },

  descText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  footer: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 110 : 95,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 16,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textMuted,
    marginRight: 8,
  },
  input: { flex: 1, fontSize: 18, fontWeight: "800", color: COLORS.primary },
  returnWrap: { flex: 1, alignItems: "flex-end" },
  returnLbl: { fontSize: 11, color: COLORS.textMuted, fontWeight: "600" },
  returnVal: { fontSize: 18, fontWeight: "800", color: COLORS.accentWarm },
  payBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.payhere,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  payBtnText: { color: COLORS.white, fontSize: 16, fontWeight: "800" },
  payhereSub: {
    textAlign: "center",
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 12,
  },
});
