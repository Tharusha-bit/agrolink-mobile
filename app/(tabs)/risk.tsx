import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
// ─── Design Tokens ─────────────────────────────────────────────────────────────
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
  textSecondary: "#5C7A4A", // ✅ ADD THIS LINE RIGHT HERE
  textMuted: "#9BB08A",
  border: "#DDE8D4",
  danger: "#E05252",
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

const DISTRICTS = ["Anuradhapura", "Ampara", "Polonnaruwa"];
const SEASONS = ["Maha", "Yala"];

export default function RiskScreen() {
  const [district, setDistrict] = useState("Anuradhapura");
  const [season, setSeason] = useState("Maha");
  const [isVerifiedDemo, setIsVerifiedDemo] = useState(false);

  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState<any>(null);

  const calculateRisk = async () => {
    setLoading(true);
    setRiskData(null);

    try {
      // ⚠️ UPDATE THIS IP TO YOUR LAPTOP IP
      const API_URL = "http://172.20.10.6:8080/api/risk/calculate";

      // If toggle is ON, use the verified user ID (1001). If OFF, use new user (9999).
      const farmerId = isVerifiedDemo ? "1001" : "9999";

      const response = await axios.get(API_URL, {
        params: { district, season, farmerId },
      });

      setRiskData(response.data);
    } catch (error) {
      console.error("Risk Calc Error:", error);
      alert("Failed to calculate risk. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (label: string) => {
    if (label?.includes("Low")) return COLORS.accent;
    if (label?.includes("Medium")) return COLORS.accentWarm;
    return COLORS.danger;
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <View style={s.header}>
          <View style={s.decCircle} />
          <View style={s.headerTextWrap}>
            <MaterialCommunityIcons
              name="shield-search"
              size={36}
              color={COLORS.white}
              style={{ marginBottom: 10 }}
            />
            <Text style={s.headerTitle}>AI Risk Assessor</Text>
            <Text style={s.headerSubtitle}>
              Evaluate climate and credibility risks
            </Text>
          </View>
        </View>

        {/* ── CALCULATOR FORM CARD ── */}
        <View style={[s.card, SHADOWS.md]}>
          <Text style={s.sectionTitle}>Select District</Text>
          <View style={s.chipRow}>
            {DISTRICTS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[s.chip, district === d && s.chipActive]}
                onPress={() => setDistrict(d)}
              >
                <Text style={[s.chipText, district === d && s.chipTextActive]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.sectionTitle}>Select Season</Text>
          <View style={s.chipRow}>
            {SEASONS.map((s_val) => (
              <TouchableOpacity
                key={s_val}
                style={[s.chip, season === s_val && s.chipActive]}
                onPress={() => setSeason(s_val)}
              >
                <Text
                  style={[s.chipText, season === s_val && s.chipTextActive]}
                >
                  {s_val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Supervisor Demo Toggle */}
          <View style={s.demoToggleBox}>
            <View style={{ flex: 1 }}>
              <Text style={s.demoToggleTitle}>Verified Farmer Profile</Text>
              <Text style={s.demoToggleSub}>
                Applies Expert System credibility adjustment
              </Text>
            </View>
            <Switch
              value={isVerifiedDemo}
              onValueChange={setIsVerifiedDemo}
              trackColor={{ false: "#ccc", true: COLORS.primaryLight }}
              thumbColor={"#fff"}
            />
          </View>

          <TouchableOpacity
            style={s.calcBtn}
            onPress={calculateRisk}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="brain"
                  size={20}
                  color={COLORS.white}
                />
                <Text style={s.calcBtnText}>Calculate Risk</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ── RESULTS CARD ── */}
        {riskData && (
          <View
            style={[
              s.resultCard,
              SHADOWS.md,
              { borderColor: getRiskColor(riskData.riskLabel) },
            ]}
          >
            <Text style={s.resultTitle}>Assessment Complete</Text>

            <View style={s.scoreCircleWrap}>
              <View
                style={[
                  s.scoreCircle,
                  { borderColor: getRiskColor(riskData.riskLabel) },
                ]}
              >
                <Text
                  style={[
                    s.scoreText,
                    { color: getRiskColor(riskData.riskLabel) },
                  ]}
                >
                  {riskData.finalRiskScore}%
                </Text>
              </View>
              <View
                style={[
                  s.riskBadge,
                  { backgroundColor: getRiskColor(riskData.riskLabel) },
                ]}
              >
                <Text style={s.riskBadgeText}>{riskData.riskLabel}</Text>
              </View>
            </View>

            <View style={s.breakdownWrap}>
              <View style={s.breakdownRow}>
                <Text style={s.breakdownLabel}>Climate Risk (Base):</Text>
                <Text style={s.breakdownValue}>{riskData.baseRiskScore}%</Text>
              </View>
              <View style={s.breakdownRow}>
                <Text style={s.breakdownLabel}>Credibility Adjustment:</Text>
                <Text style={[s.breakdownValue, { color: COLORS.primary }]}>
                  {riskData.adjustmentApplied ? "Applied ✓" : "None ✗"}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.surface },
  scrollContent: { flexGrow: 1, paddingBottom: 100 }, // Extra padding for bottom nav

  header: {
    backgroundColor: COLORS.primary,
    height: 260,
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
  headerTextWrap: { alignItems: "center", marginTop: 20 },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },

  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: -40,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: COLORS.textMuted },
  chipTextActive: { color: COLORS.white },

  demoToggleBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E6",
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#FDE4A9",
  },
  demoToggleTitle: { fontSize: 14, fontWeight: "800", color: "#D4900A" },
  demoToggleSub: { fontSize: 11, color: "#B57905", marginTop: 2 },

  calcBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  calcBtnText: { color: COLORS.white, fontSize: 16, fontWeight: "800" },

  resultCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 20,
  },

  scoreCircleWrap: {
    alignItems: "center",
    position: "relative",
    marginBottom: 24,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: { fontSize: 32, fontWeight: "900" },
  riskBadge: {
    position: "absolute",
    bottom: -12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  riskBadgeText: { color: COLORS.white, fontWeight: "800", fontSize: 12 },

  breakdownWrap: {
    width: "100%",
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  breakdownLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  breakdownValue: { fontSize: 13, color: COLORS.text, fontWeight: "800" },
});
