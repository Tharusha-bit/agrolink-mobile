import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  SESSION_EXPIRED_MESSAGE,
  getSession,
  type AuthSession,
  type UserRole,
} from "../../src/lib/auth";
import {
  createInvestmentRequest,
  deleteInvestmentRequest,
  fetchAiAssessment,
  fetchFarmerInvestmentRequests,
  fetchInvestmentRequests,
  fetchRoleNetwork,
  investInRequest,
  type AiAssessment,
  type FarmerOpportunity,
  type InvestorConnection,
} from "../../src/lib/dashboard";
import { useLanguage } from "../../src/lib/language";

const COLORS = {
  primary: "#216000",
  primaryPale: "#E8F5E1",
  white: "#FFFFFF",
  surface: "#F7F9F4",
  text: "#1A2E0D",
  textMuted: "#6D8660",
  border: "#DDE8D4",
  gold: "#F5A623",
  blue: "#3A9BD5",
  danger: "#D32F2F",
  overlay: "rgba(12, 25, 8, 0.45)",
};

const farmerStats = [
  {
    label: "Active Fields",
    value: "08",
    icon: "sprout",
    color: COLORS.primary,
  },
  {
    label: "Pending Funding",
    value: "LKR 120K",
    icon: "cash-clock",
    color: COLORS.gold,
  },
  {
    label: "Investors Visible",
    value: "03",
    icon: "account-group",
    color: COLORS.blue,
  },
];

const investorStats = [
  {
    label: "Live Deals",
    value: "12",
    icon: "briefcase-search",
    color: COLORS.primary,
  },
  {
    label: "Farmers Seeking Capital",
    value: "03",
    icon: "sprout",
    color: COLORS.gold,
  },
  {
    label: "Expected Return",
    value: "18%",
    icon: "trending-up",
    color: COLORS.blue,
  },
];

function formatCurrency(value: number) {
  return `LKR ${value.toLocaleString()}`;
}

function formatDateLabel(date: string | undefined, locale: string, fallback: string) {
  if (!date) {
    return fallback;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function FarmerInvestorCard({
  item,
  avgReturnLabel,
  projectsLabel,
  connectedLabel,
}: {
  item: InvestorConnection;
  avgReturnLabel: string;
  projectsLabel: string;
  connectedLabel: string;
}) {
  return (
    <View style={styles.feedCard}>
      <View style={styles.feedCardHeader}>
        <View style={styles.avatarBox}>
          <MaterialCommunityIcons
            name="account-tie"
            size={22}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.feedCardTitleWrap}>
          <Text style={styles.feedCardTitle}>{item.name}</Text>
          <Text style={styles.feedCardSubtitle}>{item.company}</Text>
        </View>
        <View style={styles.metricPill}>
          <Text style={styles.metricPillText}>
            {formatCurrency(item.investedAmount)}
          </Text>
        </View>
      </View>

      <Text style={styles.feedCardBody}>{item.fitNote}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>{avgReturnLabel}</Text>
          <Text style={styles.metaValue}>{item.preferredReturnRate}</Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>{projectsLabel}</Text>
          <Text style={styles.metaValue}>{item.activeProjects}</Text>
        </View>
      </View>

      <View style={styles.statusBadge}>
        <MaterialCommunityIcons
          name="cash-check"
          size={16}
          color={COLORS.primary}
        />
        <Text style={styles.statusBadgeText}>{connectedLabel}</Text>
      </View>
    </View>
  );
}

function InvestorFarmerCard({
  item,
  onAskAi,
  onInvestNow,
  onDeleteRequest,
  showInvestorActions,
  busy,
  locale,
  updatedLabel,
  recentlyUpdatedLabel,
  raisedLabel,
  needLabel,
  pastRateLabel,
  askAiLabel,
  investNowLabel,
  deleteLabel,
  liveRequestLabel,
  riskLabels,
  fundedLabel,
}: {
  item: FarmerOpportunity;
  onAskAi?: (entityId: string) => void;
  onInvestNow?: (requestId: string) => void;
  onDeleteRequest?: (requestId: string) => void;
  showInvestorActions: boolean;
  busy?: boolean;
  locale: string;
  updatedLabel: string;
  recentlyUpdatedLabel: string;
  raisedLabel: string;
  needLabel: string;
  pastRateLabel: string;
  askAiLabel: string;
  investNowLabel: string;
  deleteLabel: string;
  liveRequestLabel: string;
  riskLabels: Record<"Low" | "Medium" | "High", string>;
  fundedLabel: string;
}) {
  const progress = Math.round((item.raisedAmount / item.amountNeeded) * 100);
  const riskColor =
    item.riskLevel === "Low"
      ? COLORS.primary
      : item.riskLevel === "Medium"
        ? COLORS.gold
        : COLORS.danger;

  return (
    <View style={styles.feedCard}>
      <View style={styles.feedCardHeader}>
        <View style={styles.avatarBox}>
          <MaterialCommunityIcons
            name="sprout"
            size={22}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.feedCardTitleWrap}>
          <Text style={styles.feedCardTitle}>{item.name}</Text>
          <Text style={styles.feedCardSubtitle}>
            {item.crop} • {item.location}
          </Text>
          <Text style={styles.feedCardDate}>
            {updatedLabel} {formatDateLabel(item.createdAt, locale, recentlyUpdatedLabel)}
          </Text>
        </View>
        <View
          style={[styles.metricPill, { backgroundColor: `${riskColor}18` }]}
        >
          <Text style={[styles.metricPillText, { color: riskColor }]}>
            {riskLabels[item.riskLevel]}
          </Text>
        </View>
      </View>

      <Text style={styles.feedCardBody}>{item.summary}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>{raisedLabel}</Text>
          <Text style={styles.metaValue}>
            {formatCurrency(item.raisedAmount)}
          </Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>{needLabel}</Text>
          <Text style={styles.metaValue}>
            {formatCurrency(item.amountNeeded)}
          </Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>{pastRateLabel}</Text>
          <Text style={styles.metaValue}>{item.historicalReturnRate}</Text>
        </View>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{fundedLabel.replace("{progress}", String(progress))}</Text>
      </View>

      {showInvestorActions ? (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onAskAi?.(item.id)}
            disabled={busy}
          >
            <MaterialCommunityIcons
              name="robot-outline"
              size={18}
              color={COLORS.primary}
            />
            <Text style={styles.secondaryButtonText}>{askAiLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => onInvestNow?.(item.id)}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="cash-plus"
                  size={18}
                  color={COLORS.white}
                />
                <Text style={styles.aiButtonText}>{investNowLabel}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <View style={styles.statusBadgeInline}>
            <MaterialCommunityIcons
              name="clipboard-check-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.statusBadgeText}>{liveRequestLabel}</Text>
          </View>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={() => onDeleteRequest?.(item.id)}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={18}
                  color={COLORS.white}
                />
                <Text style={styles.dangerButtonText}>{deleteLabel}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isFocused = useIsFocused();
  const { locale, t } = useLanguage();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [role, setRole] = useState<UserRole>("farmer");
  const [name, setName] = useState("AgroLink User");
  const [investors, setInvestors] = useState<InvestorConnection[]>([]);
  const [requests, setRequests] = useState<FarmerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAssessment, setAiAssessment] = useState<AiAssessment | null>(null);
  const [aiVisible, setAiVisible] = useState(false);
  const [requestSuccessVisible, setRequestSuccessVisible] = useState(false);
  const [investModalVisible, setInvestModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [investAmount, setInvestAmount] = useState("5000");
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [investingRequestId, setInvestingRequestId] = useState("");
  const [deletingRequestId, setDeletingRequestId] = useState("");
  const [requestCrop, setRequestCrop] = useState("");
  const [requestLocation, setRequestLocation] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [requestRisk, setRequestRisk] = useState<"Low" | "Medium" | "High">(
    "Medium",
  );
  const [requestSummary, setRequestSummary] = useState("");
  const compactLayout = width < 420;

  const applySessionExpiry = () => {
    setError(SESSION_EXPIRED_MESSAGE);
    Alert.alert(t("dashboard.sessionExpired"), SESSION_EXPIRED_MESSAGE, [
      { text: t("dashboard.signIn"), onPress: () => router.replace("/login") },
    ]);
  };

  const loadDashboardData = async (currentSession: AuthSession) => {
    const network = await fetchRoleNetwork(currentSession);

    if (network.role === "farmer") {
      setInvestors(network.investors);
      const farmerRequests =
        await fetchFarmerInvestmentRequests(currentSession);
      setRequests(farmerRequests.requests);
      return;
    }

    setInvestors([]);
    const investorRequests = await fetchInvestmentRequests(currentSession);
    setRequests(
      investorRequests.requests.length > 0
        ? investorRequests.requests
        : network.farmers,
    );
  };

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const currentSession = await getSession();
        if (!active || !currentSession) {
          router.replace("/login");
          setLoading(false);
          return;
        }

        setSession(currentSession);
        setRole(currentSession.user.role);
        setName(currentSession.user.name);

        await loadDashboardData(currentSession);
      } catch (loadError) {
        if (active) {
          if (
            loadError instanceof Error &&
            loadError.message === SESSION_EXPIRED_MESSAGE
          ) {
            applySessionExpiry();
            return;
          }

          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load dashboard data.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    const intervalId = setInterval(async () => {
      try {
        const currentSession = await getSession();
        if (!active || !currentSession) {
          return;
        }

        setSession(currentSession);
        setRole(currentSession.user.role);
        setName(currentSession.user.name);
        await loadDashboardData(currentSession);
      } catch (refreshError) {
        if (
          active &&
          refreshError instanceof Error &&
          refreshError.message === SESSION_EXPIRED_MESSAGE
        ) {
          applySessionExpiry();
        }
      }
    }, 5000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [isFocused, router]);

  const handleAskAi = async (entityId: string) => {
    if (!session || session.user.role !== "investor") {
      router.replace("/login");
      return;
    }

    setAiVisible(true);
    setAiLoading(true);
    setAiAssessment(null);

    try {
      const response = await fetchAiAssessment(session, entityId);
      setAiAssessment(response);
    } catch (aiError) {
      if (
        aiError instanceof Error &&
        aiError.message === SESSION_EXPIRED_MESSAGE
      ) {
        applySessionExpiry();
        setAiVisible(false);
        return;
      }

      setAiAssessment({
        entityId,
        headline: t("dashboard.aiUnavailable"),
        recommendation: t("dashboard.aiTryAgain"),
        previousRate: t("dashboard.aiNoHistoricalRate"),
        outlook: t("dashboard.aiConnectionIssue"),
        confidence: t("common.low"),
        summary:
          aiError instanceof Error
            ? aiError.message
            : t("dashboard.aiUnknownError"),
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!session) {
      router.replace("/login");
      return;
    }

    const crop = requestCrop.trim();
    const location = requestLocation.trim();
    const summary = requestSummary.trim();
    const normalizedAmount = requestAmount.replace(/,/g, "").trim();

    if (!crop || !location || !normalizedAmount || !summary) {
      Alert.alert(
        t("dashboard.missingDetails"),
        t("dashboard.missingDetailsMessage"),
      );
      return;
    }

    if (crop.length < 2) {
      Alert.alert(t("dashboard.invalidCrop"), t("dashboard.invalidCropMessage"));
      return;
    }

    if (location.length < 2) {
      Alert.alert(t("dashboard.invalidLocation"), t("dashboard.invalidLocationMessage"));
      return;
    }

    if (summary.length < 10) {
      Alert.alert(t("dashboard.invalidSummary"), t("dashboard.invalidSummaryMessage"));
      return;
    }

    const amountNeeded = Number(normalizedAmount);
    if (!Number.isFinite(amountNeeded) || amountNeeded < 1000) {
      Alert.alert(t("dashboard.invalidAmount"), t("dashboard.invalidAmountMessage"));
      return;
    }

    if (amountNeeded > 10000000) {
      Alert.alert(t("dashboard.invalidAmount"), t("dashboard.invalidRequestAmountMax"));
      return;
    }

    try {
      setSubmittingRequest(true);
      setError("");
      await createInvestmentRequest(session, {
        crop,
        location,
        amountNeeded,
        riskLevel: requestRisk,
        summary,
      });

      await loadDashboardData(session);
      setRequestCrop("");
      setRequestLocation("");
      setRequestAmount("");
      setRequestSummary("");
      setRequestRisk("Medium");
      setRequestSuccessVisible(true);
    } catch (requestError) {
      if (
        requestError instanceof Error &&
        requestError.message === SESSION_EXPIRED_MESSAGE
      ) {
        applySessionExpiry();
        return;
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : t("dashboard.unableToSubmitRequest"),
      );

      Alert.alert(
        t("dashboard.unableToSubmitRequest"),
        requestError instanceof Error
          ? requestError.message
          : t("dashboard.unknownRequestError"),
      );
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleInvestNow = (requestId: string) => {
    setSelectedRequestId(requestId);
    setInvestAmount("5000");
    setInvestModalVisible(true);
  };

  const handleConfirmInvestment = async () => {
    if (!session || session.user.role !== "investor") {
      router.replace("/login");
      return;
    }

    const normalizedAmount = investAmount.replace(/,/g, "").trim();
    const amount = Number(normalizedAmount);

    if (!selectedRequestId) {
      setInvestModalVisible(false);
      return;
    }

    if (!Number.isFinite(amount) || amount < 1000) {
      Alert.alert(t("dashboard.invalidAmount"), t("dashboard.invalidAmountMessage"));
      return;
    }

    if (amount > 1000000) {
      Alert.alert(t("dashboard.invalidAmount"), t("dashboard.invalidInvestmentAmountMax"));
      return;
    }

    try {
      setInvestingRequestId(selectedRequestId);
      setError("");
      await investInRequest(session, selectedRequestId, amount);
      await loadDashboardData(session);
      setInvestModalVisible(false);
      setSelectedRequestId("");
      setInvestAmount("5000");
      Alert.alert(
        t("dashboard.investmentRecorded"),
        t("dashboard.investmentRecordedMessage", {
          amount: amount.toLocaleString(),
        }),
      );
    } catch (investmentError) {
      if (
        investmentError instanceof Error &&
        investmentError.message === SESSION_EXPIRED_MESSAGE
      ) {
        applySessionExpiry();
        return;
      }

      setError(
        investmentError instanceof Error
          ? investmentError.message
          : t("dashboard.investmentFailed"),
      );

      Alert.alert(
        t("dashboard.investmentFailed"),
        investmentError instanceof Error
          ? investmentError.message
          : t("dashboard.unknownInvestmentError"),
      );
    } finally {
      setInvestingRequestId("");
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!session || session.user.role !== "farmer") {
      router.replace("/login");
      return;
    }

    Alert.alert(
      t("dashboard.deleteRequest"),
      t("dashboard.deleteRequestMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("dashboard.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingRequestId(requestId);
              setError("");
              await deleteInvestmentRequest(session, requestId);
              await loadDashboardData(session);
              Alert.alert(
                t("dashboard.requestDeleted"),
                t("dashboard.requestDeletedMessage"),
              );
            } catch (deleteError) {
              if (
                deleteError instanceof Error &&
                deleteError.message === SESSION_EXPIRED_MESSAGE
              ) {
                applySessionExpiry();
                return;
              }

              setError(
                deleteError instanceof Error
                  ? deleteError.message
                  : t("dashboard.deleteFailed"),
              );

              Alert.alert(
                t("dashboard.deleteFailed"),
                deleteError instanceof Error
                  ? deleteError.message
                  : t("dashboard.unknownDeleteError"),
              );
            } finally {
              setDeletingRequestId("");
            }
          },
        },
      ],
    );
  };

  const stats =
    role === "farmer"
      ? [
          farmerStats[0],
          {
            ...farmerStats[1],
            value: `LKR ${requests.reduce((sum, item) => sum + item.amountNeeded, 0).toLocaleString()}`,
          },
          {
            ...farmerStats[2],
            value: String(investors.length).padStart(2, "0"),
          },
        ]
      : [
          investorStats[0],
          {
            ...investorStats[1],
            value: String(requests.length).padStart(2, "0"),
          },
          investorStats[2],
        ];

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            {role === "farmer"
              ? t("dashboard.farmerDashboard")
              : t("dashboard.investorDashboard")}
          </Text>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>
            {role === "farmer"
              ? t("dashboard.farmerSubtitle")
              : t("dashboard.investorSubtitle")}
          </Text>
        </View>

        <View style={styles.roleBanner}>
          <MaterialCommunityIcons
            name={role === "farmer" ? "shield-account" : "view-grid-outline"}
            size={18}
            color={COLORS.primary}
          />
          <Text style={styles.roleBannerText}>
            {role === "farmer"
              ? t("dashboard.roleBannerFarmer")
              : t("dashboard.roleBannerInvestor")}
          </Text>
        </View>

        {!loading && error ? (
          <View style={styles.errorBanner}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={18}
              color={COLORS.danger}
            />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        ) : null}

        <View style={[styles.grid, compactLayout && styles.gridCompact]}>
          {stats.map((item) => (
            <View
              key={item.label}
              style={[styles.card, compactLayout && styles.cardCompact]}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: `${item.color}1A` },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={22}
                  color={item.color}
                />
              </View>
              <Text style={styles.cardValue}>{item.value}</Text>
              <Text style={styles.cardLabel}>
                {item.label === "Active Fields"
                  ? t("dashboard.activeFields")
                  : item.label === "Pending Funding"
                    ? t("dashboard.pendingFunding")
                    : item.label === "Investors Visible"
                      ? t("dashboard.investorsVisible")
                      : item.label === "Live Deals"
                        ? t("dashboard.liveDeals")
                        : item.label === "Farmers Seeking Capital"
                          ? t("dashboard.farmersSeekingCapital")
                          : t("dashboard.expectedReturn")}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>
            {role === "farmer"
              ? t("dashboard.investmentRequests")
              : t("dashboard.farmerOpportunityFeed")}
          </Text>
          <Text style={styles.panelText}>
            {role === "farmer"
              ? t("dashboard.farmerPanelText")
              : t("dashboard.investorPanelText")}
          </Text>
        </View>

        {role === "farmer" ? (
          <View style={styles.requestComposer}>
            <Text style={styles.requestComposerTitle}>
              {t("dashboard.createInvestmentRequest")}
            </Text>
            <Text style={styles.requestComposerSubtitle}>
              {t("dashboard.createInvestmentRequestSubtitle")}
            </Text>

            <View
              style={[styles.inputRow, compactLayout && styles.inputRowCompact]}
            >
              <TextInput
                value={requestCrop}
                onChangeText={setRequestCrop}
                placeholder={t("dashboard.crop")}
                placeholderTextColor={COLORS.textMuted}
                style={[styles.input, compactLayout && styles.inputCompact]}
              />
              <TextInput
                value={requestLocation}
                onChangeText={setRequestLocation}
                placeholder={t("dashboard.location")}
                placeholderTextColor={COLORS.textMuted}
                style={[styles.input, compactLayout && styles.inputCompact]}
              />
            </View>

            <View
              style={[styles.inputRow, compactLayout && styles.inputRowCompact]}
            >
              <TextInput
                value={requestAmount}
                onChangeText={setRequestAmount}
                placeholder={t("dashboard.amountNeeded")}
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
                style={[styles.input, compactLayout && styles.inputCompact]}
              />
              <View
                style={[
                  styles.riskSelector,
                  compactLayout && styles.inputCompact,
                ]}
              >
                {(["Low", "Medium", "High"] as const).map((risk) => (
                  <TouchableOpacity
                    key={risk}
                    style={[
                      styles.riskChip,
                      requestRisk === risk && styles.riskChipActive,
                    ]}
                    onPress={() => setRequestRisk(risk)}
                  >
                    <Text
                      style={[
                        styles.riskChipText,
                        requestRisk === risk && styles.riskChipTextActive,
                      ]}
                    >
                      {risk === "Low"
                        ? t("common.low")
                        : risk === "Medium"
                          ? t("common.medium")
                          : t("common.high")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              value={requestSummary}
              onChangeText={setRequestSummary}
              placeholder={t("dashboard.requestSummaryPlaceholder")}
              placeholderTextColor={COLORS.textMuted}
              multiline
              style={[styles.input, styles.textArea]}
            />

            <TouchableOpacity
              style={styles.aiButton}
              onPress={handleCreateRequest}
              disabled={submittingRequest}
            >
              {submittingRequest ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    size={18}
                    color={COLORS.white}
                  />
                  <Text style={styles.aiButtonText}>{t("dashboard.submitRequest")}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>
          {role === "farmer"
            ? t("dashboard.yourLiveRequests")
            : t("dashboard.requestsOpenForInvestment")}
        </Text>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.loadingText}>{t("dashboard.loadingRoleData")}</Text>
          </View>
        ) : null}

        {!loading && error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {!loading && !error && role === "farmer"
          ? requests.map((item) => (
              <InvestorFarmerCard
                key={item.id}
                item={item}
                locale={locale}
                updatedLabel={t("common.updated")}
                recentlyUpdatedLabel={t("common.recentlyUpdated")}
                raisedLabel={t("dashboard.raised")}
                needLabel={t("dashboard.need")}
                pastRateLabel={t("dashboard.pastRate")}
                askAiLabel={t("dashboard.askAi")}
                investNowLabel={t("dashboard.investNow")}
                deleteLabel={t("dashboard.delete")}
                liveRequestLabel={t("dashboard.yourLiveInvestmentRequest")}
                riskLabels={{
                  Low: t("common.low"),
                  Medium: t("common.medium"),
                  High: t("common.high"),
                }}
                fundedLabel={t("dashboard.funded", { progress: "{progress}" })}
                showInvestorActions={false}
                onDeleteRequest={handleDeleteRequest}
                busy={deletingRequestId === item.id}
              />
            ))
          : null}

        {!loading && !error && role === "investor"
          ? requests.map((item) => (
              <InvestorFarmerCard
                key={item.id}
                item={item}
                locale={locale}
                updatedLabel={t("common.updated")}
                recentlyUpdatedLabel={t("common.recentlyUpdated")}
                raisedLabel={t("dashboard.raised")}
                needLabel={t("dashboard.need")}
                pastRateLabel={t("dashboard.pastRate")}
                askAiLabel={t("dashboard.askAi")}
                investNowLabel={t("dashboard.investNow")}
                deleteLabel={t("dashboard.delete")}
                liveRequestLabel={t("dashboard.yourLiveInvestmentRequest")}
                riskLabels={{
                  Low: t("common.low"),
                  Medium: t("common.medium"),
                  High: t("common.high"),
                }}
                fundedLabel={t("dashboard.funded", { progress: "{progress}" })}
                onAskAi={handleAskAi}
                onInvestNow={handleInvestNow}
                showInvestorActions
                busy={investingRequestId === item.id}
              />
            ))
          : null}

        {!loading && !error && requests.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name={
                role === "farmer" ? "clipboard-text-outline" : "sprout-outline"
              }
              size={28}
              color={COLORS.primary}
            />
            <Text style={styles.emptyStateTitle}>
              {role === "farmer"
                ? t("dashboard.noRequestsCreated")
                : t("dashboard.noInvestmentRequestsAvailable")}
            </Text>
            <Text style={styles.emptyStateText}>
              {role === "farmer"
                ? t("dashboard.noRequestsCreatedText")
                : t("dashboard.noInvestmentRequestsAvailableText")}
            </Text>
          </View>
        ) : null}

        {role === "farmer" ? (
          <Text style={styles.sectionTitle}>{t("dashboard.investorsBackingYou")}</Text>
        ) : null}
        {!loading && !error && role === "farmer"
          ? investors.map((item) => (
              <FarmerInvestorCard
                key={item.id}
                item={item}
                avgReturnLabel={t("dashboard.avgReturn")}
                projectsLabel={t("dashboard.projects")}
                connectedLabel={t("dashboard.investorConnected")}
              />
            ))
          : null}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={aiVisible}
        onRequestClose={() => setAiVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setAiVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => undefined}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("dashboard.aiInsight")}</Text>
              <TouchableOpacity onPress={() => setAiVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            </View>

            {aiLoading ? (
              <View style={styles.modalLoadingWrap}>
                <ActivityIndicator color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  {t("dashboard.preparingAi")}
                </Text>
              </View>
            ) : null}

            {!aiLoading && aiAssessment ? (
              <View>
                <Text style={styles.aiHeadline}>{aiAssessment.headline}</Text>
                <Text style={styles.aiRecommendation}>
                  {aiAssessment.recommendation}
                </Text>

                <View style={styles.aiInfoBox}>
                  <Text style={styles.aiInfoLabel}>{t("dashboard.previousRates")}</Text>
                  <Text style={styles.aiInfoText}>
                    {aiAssessment.previousRate}
                  </Text>
                </View>

                <View style={styles.aiInfoBox}>
                  <Text style={styles.aiInfoLabel}>{t("dashboard.outlook")}</Text>
                  <Text style={styles.aiInfoText}>{aiAssessment.outlook}</Text>
                </View>

                <View style={styles.aiInfoBox}>
                  <Text style={styles.aiInfoLabel}>{t("dashboard.confidence")}</Text>
                  <Text style={styles.aiInfoText}>
                    {aiAssessment.confidence}
                  </Text>
                </View>

                <Text style={styles.aiSummary}>{aiAssessment.summary}</Text>
              </View>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={requestSuccessVisible}
        onRequestClose={() => setRequestSuccessVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setRequestSuccessVisible(false)}
        >
          <Pressable style={styles.successModalCard} onPress={() => undefined}>
            <View style={styles.successIconWrap}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={34}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.successModalTitle}>{t("dashboard.requestSent")}</Text>
            <Text style={styles.successModalText}>
              {t("dashboard.requestSentMessage")}
            </Text>
            <TouchableOpacity
              style={styles.successModalButton}
              onPress={() => setRequestSuccessVisible(false)}
            >
              <Text style={styles.successModalButtonText}>{t("common.ok")}</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={investModalVisible}
        onRequestClose={() => setInvestModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setInvestModalVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => undefined}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("dashboard.chooseInvestmentAmount")}</Text>
              <TouchableOpacity onPress={() => setInvestModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.investModalText}>
              {t("dashboard.chooseInvestmentAmountText")}
            </Text>

            <TextInput
              value={investAmount}
              onChangeText={setInvestAmount}
              placeholder={t("dashboard.amountInLkr")}
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              style={styles.input}
            />

            <View style={styles.investModalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setInvestModalVisible(false)}
              >
                <Text style={styles.secondaryButtonText}>{t("common.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.aiButton}
                onPress={handleConfirmInvestment}
                disabled={investingRequestId === selectedRequestId}
              >
                {investingRequestId === selectedRequestId ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.aiButtonText}>{t("dashboard.confirmInvestment")}</Text>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 20, paddingBottom: 120 },
  hero: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
  },
  eyebrow: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: { color: COLORS.white, fontSize: 28, fontWeight: "900", marginTop: 8 },
  subtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  grid: { flexDirection: "row", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  gridCompact: { gap: 10 },
  card: {
    flex: 1,
    minWidth: 150,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardCompact: { minWidth: "100%" as const },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 4,
  },
  cardLabel: { fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },
  panel: {
    backgroundColor: COLORS.primaryPale,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  panelTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  panelText: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20 },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },
  loadingWrap: { alignItems: "center", paddingVertical: 30, gap: 10 },
  loadingText: { color: COLORS.textMuted, fontSize: 13, marginTop: 10 },
  roleBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.primaryPale,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  roleBannerText: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FDEDEC",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#F6C7C3",
    marginBottom: 16,
  },
  errorBannerText: {
    flex: 1,
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },
  feedCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  feedCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
    flexWrap: "wrap",
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primaryPale,
    alignItems: "center",
    justifyContent: "center",
  },
  feedCardTitleWrap: { flex: 1, minWidth: 140 },
  feedCardTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 2,
  },
  feedCardSubtitle: { color: COLORS.textMuted, fontSize: 12 },
  feedCardDate: { color: COLORS.textMuted, fontSize: 11, marginTop: 4 },
  metricPill: {
    backgroundColor: COLORS.primaryPale,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metricPillText: { color: COLORS.primary, fontSize: 11, fontWeight: "800" },
  feedCardBody: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  metaBox: {
    flex: 1,
    minWidth: 92,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
  },
  metaLabel: { color: COLORS.textMuted, fontSize: 11, marginBottom: 4 },
  metaValue: { color: COLORS.text, fontSize: 13, fontWeight: "800" },
  progressBlock: { marginBottom: 14 },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.border,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
  progressText: { color: COLORS.textMuted, fontSize: 11, fontWeight: "700" },
  actionRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  aiButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 14,
  },
  aiButtonText: { color: COLORS.white, fontSize: 13, fontWeight: "800" },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primaryPale,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primaryPale,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statusBadgeInline: {
    flex: 1,
    minWidth: 160,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primaryPale,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statusBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
    flexShrink: 1,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.danger,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dangerButtonText: { color: COLORS.white, fontSize: 13, fontWeight: "800" },
  requestComposer: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  requestComposerTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },
  requestComposerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 18,
  },
  emptyStateTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 6,
  },
  emptyStateText: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  inputRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  inputRowCompact: { flexWrap: "wrap" },
  input: {
    flex: 1,
    minWidth: 120,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputCompact: { minWidth: "100%" as const },
  textArea: { minHeight: 98, textAlignVertical: "top", marginBottom: 12 },
  riskSelector: {
    flex: 1,
    minWidth: 120,
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  riskChip: {
    backgroundColor: COLORS.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  riskChipActive: { backgroundColor: COLORS.primary },
  riskChipText: { color: COLORS.textMuted, fontSize: 12, fontWeight: "700" },
  riskChipTextActive: { color: COLORS.white },
  modalBackdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    maxHeight: "85%" as const,
  },
  successModalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  successIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryPale,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successModalTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10,
    textAlign: "center",
  },
  successModalText: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  successModalButton: {
    minWidth: 140,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  successModalButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
  },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: "900" },
  modalLoadingWrap: { alignItems: "center", paddingVertical: 24 },
  investModalText: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  investModalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  aiHeadline: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 8,
  },
  aiRecommendation: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 14,
  },
  aiInfoBox: {
    backgroundColor: COLORS.primaryPale,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  aiInfoLabel: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  aiInfoText: { color: COLORS.textMuted, fontSize: 13, lineHeight: 19 },
  aiSummary: { color: COLORS.text, fontSize: 13, lineHeight: 20, marginTop: 4 },
});
