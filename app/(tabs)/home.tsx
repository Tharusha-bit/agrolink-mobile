import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { getSession, SESSION_EXPIRED_MESSAGE } from "../../src/lib/auth";
import {
  fetchFarmerInvestmentRequests,
  fetchInvestmentRequests,
  type FarmerOpportunity,
} from "../../src/lib/dashboard";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const COLORS = {
  primary: "#216000", // Deep Forest Green
  primaryLight: "#2E8B00", // Lighter Green for gradients/highlights
  primaryPale: "#E8F5E1", // Very light green for backgrounds
  accent: "#76C442", // Bright Apple Green
  accentWarm: "#F5A623", // Orange/Gold for warnings/highlights
  white: "#FFFFFF",
  surface: "#F7F9F4", // Off-white background
  card: "#FFFFFF",
  text: "#1A2E0D", // Very dark green text
  textSecondary: "#5C7A4A", // Muted green text
  textMuted: "#9BB08A", // Placeholder text
  border: "#DDE8D4",
  danger: "#E05252",
  info: "#3A9BD5",
};

const SHADOWS = {
  sm: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    android: { elevation: 3 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.13,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
    },
    android: { elevation: 14 },
  }),
};

// ─── Data (Moved Outside Component for Performance) ───────────────────────────
const CROP_IMAGES: Record<string, string> = {
  paddy:
    "https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg",
  rice: "https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg",
  vegetables:
    "https://cdn.pixabay.com/photo/2018/03/11/01/25/vegetable-3215091_1280.jpg",
  vegetable:
    "https://cdn.pixabay.com/photo/2018/03/11/01/25/vegetable-3215091_1280.jpg",
  organic:
    "https://cdn.pixabay.com/photo/2018/03/11/01/25/vegetable-3215091_1280.jpg",
  maize:
    "https://cdn.pixabay.com/photo/2017/09/26/13/45/corn-field-2788329_1280.jpg",
  chili:
    "https://cdn.pixabay.com/photo/2018/03/17/15/35/chilli-3233861_1280.jpg",
};

const KPI_DATA = [
  { label: "Active Crops", value: "142", icon: "sprout", color: COLORS.accent },
  {
    label: "Investors",
    value: "3.4k",
    icon: "account-group",
    color: COLORS.primary,
  },
  {
    label: "Funded Today",
    value: "$28k",
    icon: "cash-multiple",
    color: COLORS.accentWarm,
  },
  { label: "Avg Return", value: "18%", icon: "chart-line", color: COLORS.info },
];

// ─── Reusable Components ──────────────────────────────────────────────────────

const StatBadge = ({
  icon,
  iconFamily = "mci",
  label,
  value,
  color = COLORS.primary,
}: any) => {
  const IconComponent =
    iconFamily === "fa5"
      ? FontAwesome5
      : iconFamily === "ion"
        ? Ionicons
        : MaterialCommunityIcons;
  return (
    <View style={badge.wrap}>
      <View style={[badge.iconCircle, { backgroundColor: color + "18" }]}>
        <IconComponent name={icon as any} size={22} color={color} />
      </View>
      <Text style={badge.value}>{value}</Text>
      <Text style={badge.label}>{label}</Text>
    </View>
  );
};

const SectionHeader = ({ title, actionLabel, onAction }: any) => (
  <View style={sh.row}>
    <View style={sh.titleWrap}>
      <View style={sh.pill} />
      <Text style={sh.title}>{title}</Text>
    </View>
    {actionLabel && (
      <TouchableOpacity onPress={onAction}>
        <Text style={sh.action}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const InvestmentCard = ({
  farmer,
  since,
  description,
  progress,
  image,
  tags,
  riskLevel,
  targetAmount,
  raisedAmount,
  actionLabel,
  onPress,
  compact,
}: any) => {
  const progressPct = Math.min(Math.max(progress, 0), 1);
  const riskColor =
    riskLevel === "Low"
      ? COLORS.accent
      : riskLevel === "Medium"
        ? COLORS.accentWarm
        : COLORS.danger;

  return (
    <View style={[ic.card, SHADOWS.md]}>
      {/* Hero Image */}
      <View style={ic.imageWrap}>
        <Image source={{ uri: image }} style={ic.image} />
        <View style={ic.imageFade} />

        {/* Risk Chip */}
        <View style={[ic.riskChip, { backgroundColor: riskColor }]}>
          <MaterialCommunityIcons
            name="shield-check"
            size={12}
            color="#fff"
            style={{ marginRight: 4 }}
          />
          <Text style={ic.riskText}>{riskLevel} Risk</Text>
        </View>

        {/* Tags */}
        <View style={ic.tagRow}>
          {tags.map((t: string) => (
            <View key={t} style={ic.tagPill}>
              <Text style={ic.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Body */}
      <View style={ic.body}>
        <View style={ic.farmerRow}>
          <View style={ic.avatarWrap}>
            <MaterialCommunityIcons
              name="account"
              size={20}
              color={COLORS.white}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={ic.farmerName}>{farmer}</Text>
            <Text style={ic.memberSince}>Member since {since}</Text>
          </View>
          <View style={ic.verifiedBadge}>
            <MaterialCommunityIcons
              name="check-decagram"
              size={14}
              color={COLORS.primary}
            />
            <Text style={ic.verifiedText}>Verified</Text>
          </View>
        </View>

        <Text style={ic.description} numberOfLines={3}>
          {description}
        </Text>

        {/* Progress Bar */}
        <View style={ic.progressBlock}>
          <View style={ic.progressLabels}>
            <Text style={ic.progressTitle}>Funding Progress</Text>
            <Text style={ic.progressPct}>{Math.round(progressPct * 100)}%</Text>
          </View>
          <View style={ic.track}>
            <View style={[ic.fill, { width: `${progressPct * 100}%` }]} />
          </View>
          <View style={[ic.amountRow, compact && ic.amountRowCompact]}>
            <Text style={ic.raised}>
              Raised:{" "}
              <Text style={ic.raisedBold}>
                ${raisedAmount.toLocaleString()}
              </Text>
            </Text>
            <Text style={ic.target}>
              Goal: ${targetAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Invest Button */}
        <TouchableOpacity
          style={ic.investBtn}
          activeOpacity={0.85}
          onPress={onPress}
        >
          <Text style={ic.investText}>{actionLabel}</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Main Screen Component ────────────────────────────────────────────────────
export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isFocused = useIsFocused();
  const [userName, setUserName] = useState("Fernando");
  const [greeting, setGreeting] = useState("Good morning 🌱");
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    "Search crops, farmers...",
  );
  const [role, setRole] = useState<"farmer" | "investor">("farmer");
  const [requests, setRequests] = useState<FarmerOpportunity[]>([]);
  const [loadError, setLoadError] = useState("");
  const compactLayout = width < 390;

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let active = true;

    const loadSession = async () => {
      setLoadError("");
      const session = await getSession();
      if (!active || !session) {
        router.replace("/login");
        return;
      }

      setUserName(session.user.name);
      setGreeting(
        session.user.role === "farmer"
          ? "Welcome back farmer 🌾"
          : "Investor insights ready 📈",
      );
      setRole(session.user.role);
      setSearchPlaceholder(
        session.user.role === "farmer"
          ? "Search crops, equipment..."
          : "Search farmers, projects...",
      );

      try {
        if (session.user.role === "farmer") {
          const farmerRequests = await fetchFarmerInvestmentRequests(session);
          if (!active) {
            return;
          }
          setRequests(farmerRequests.requests);
        } else {
          const investorRequests = await fetchInvestmentRequests(session);
          if (!active) {
            return;
          }
          setRequests(investorRequests.requests);
        }
        setLoadError("");
      } catch (error) {
        if (!active) {
          return;
        }

        if (
          error instanceof Error &&
          error.message === SESSION_EXPIRED_MESSAGE
        ) {
          Alert.alert("Session expired", SESSION_EXPIRED_MESSAGE, [
            { text: "Sign in", onPress: () => router.replace("/login") },
          ]);
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load request data.",
        );
      }
    };

    loadSession();

    const intervalId = setInterval(() => {
      loadSession();
    }, 5000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [isFocused, router]);

  const handlePrimaryAction = () => {
    router.push("/(tabs)/dashboard");
  };

  const visibleRequests =
    role === "investor" ? requests.slice(0, 3) : requests.slice(0, 2);

  const mapRequestToCard = (request: FarmerOpportunity) => {
    const normalizedCrop = request.crop.toLowerCase();
    const image = CROP_IMAGES[normalizedCrop] || CROP_IMAGES.paddy;
    const targetAmount = request.amountNeeded;
    const raisedAmount = request.raisedAmount;
    const progress = targetAmount > 0 ? raisedAmount / targetAmount : 0;

    return {
      id: request.id,
      farmer: request.name,
      since: request.createdAt
        ? new Date(request.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Recently",
      description: request.summary,
      progress,
      raisedAmount,
      targetAmount,
      riskLevel: request.riskLevel,
      tags: [request.crop, request.location],
      image,
    };
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* HEADER SECTION */}
        <View style={s.header}>
          {/* Decorative Circles */}
          <View style={s.decCircleLg} />
          <View style={s.decCircleSm} />

          <View style={s.topBar}>
            <View>
              <Text style={s.greeting}>{greeting}</Text>
              <Text style={s.userName}>{userName}</Text>
              <Text style={s.date}>Monday, 24 November 2025</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/profile")}
              style={s.avatarBtn}
              activeOpacity={0.85}
            >
              <View style={s.notifDot} />
              <MaterialCommunityIcons
                name="account"
                size={26}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={s.searchBar}>
            <Ionicons
              name="search-outline"
              size={20}
              color={COLORS.textMuted}
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder={searchPlaceholder}
              placeholderTextColor={COLORS.textMuted}
              style={s.searchInput}
            />
            <TouchableOpacity
              style={s.micBtn}
              onPress={() =>
                Alert.alert(
                  "Search hint",
                  role === "farmer"
                    ? "Use the dashboard to manage only your own investment requests."
                    : "Use the dashboard to review and invest in active farmer requests.",
                )
              }
            >
              <MaterialCommunityIcons
                name="microphone-outline"
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={s.roleBanner}>
            <MaterialCommunityIcons
              name={role === "farmer" ? "shield-account" : "view-grid-outline"}
              size={18}
              color={COLORS.primary}
            />
            <Text style={s.roleBannerText}>
              {role === "farmer"
                ? "Private farmer view: only your own requests appear on this home feed."
                : "Investor marketplace: you are seeing active requests from multiple farmers."}
            </Text>
          </View>
        </View>

        {/* WEATHER WIDGET */}
        <View style={[s.weatherCard, SHADOWS.lg]}>
          <View style={s.weatherTopRow}>
            <View>
              <View style={s.locationRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={18}
                  color={COLORS.primary}
                />
                <Text style={s.cityText}>Anuradhapura</Text>
              </View>
              <Text style={s.weatherDesc}>Light rain expected</Text>
            </View>
            <View style={s.tempBlock}>
              <MaterialCommunityIcons
                name="weather-rainy"
                size={32}
                color={COLORS.info}
              />
              <Text style={s.tempText}>17°C</Text>
            </View>
          </View>

          <View style={s.divider} />

          <View style={[s.statsRow, compactLayout && s.statsRowCompact]}>
            <StatBadge
              icon="water-percent"
              label="Humidity"
              value="59%"
              color={COLORS.info}
            />
            {!compactLayout ? <View style={s.statDivider} /> : null}
            <StatBadge
              icon="thermometer"
              label="Soil Temp"
              value="22°C"
              color={COLORS.accentWarm}
              iconFamily="mci"
            />
            {!compactLayout ? <View style={s.statDivider} /> : null}
            <StatBadge
              icon="weather-windy"
              label="Wind"
              value="6 m/s"
              color={COLORS.accent}
            />
          </View>
        </View>

        {/* QUICK STATS STRIP */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.kpiStrip}
        >
          {KPI_DATA.map((k) => (
            <View key={k.label} style={[s.kpiCard, SHADOWS.sm]}>
              <View style={[s.kpiIcon, { backgroundColor: k.color + "15" }]}>
                <MaterialCommunityIcons
                  name={k.icon as any}
                  size={22}
                  color={k.color}
                />
              </View>
              <Text style={s.kpiValue}>{k.value}</Text>
              <Text style={s.kpiLabel}>{k.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* INVESTMENTS LIST */}
        <SectionHeader
          title={
            role === "investor"
              ? "Open Investment Requests"
              : "Your Active Requests"
          }
          actionLabel="See all"
          onAction={() => router.push("/(tabs)/dashboard")}
        />

        {loadError ? (
          <View style={s.errorBanner}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={18}
              color={COLORS.danger}
            />
            <Text style={s.errorBannerText}>{loadError}</Text>
          </View>
        ) : null}

        {!loadError && visibleRequests.length === 0 ? (
          <View style={s.emptyCard}>
            <Text style={s.emptyTitle}>
              {role === "farmer"
                ? "No personal requests yet"
                : "No farmer requests live yet"}
            </Text>
            <Text style={s.emptyText}>
              {role === "farmer"
                ? "Farmers only see their own requests here. Create one from the dashboard."
                : "Investors can review multiple farmer requests here once they are created."}
            </Text>
            <TouchableOpacity
              style={s.emptyButton}
              onPress={handlePrimaryAction}
            >
              <Text style={s.emptyButtonText}>
                {role === "farmer" ? "Open Dashboard" : "View Dashboard"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!loadError &&
          visibleRequests.map((request) => {
            const card = mapRequestToCard(request);
            return (
              <InvestmentCard
                key={card.id}
                {...card}
                compact={compactLayout}
                actionLabel={
                  role === "investor" ? "Invest Now" : "Manage Request"
                }
                onPress={handlePrimaryAction}
              />
            );
          })}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const badge = StyleSheet.create({
  wrap: { alignItems: "center", flex: 1 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  value: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  label: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
});

const sh = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 16,
    marginTop: 8,
  },
  titleWrap: { flexDirection: "row", alignItems: "center" },
  pill: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    marginRight: 10,
  },
  title: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  action: { fontSize: 12, fontWeight: "600", color: COLORS.primary },
});

const ic = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  imageWrap: { height: 160, position: "relative" },
  image: { width: "100%", height: "100%" },
  imageFade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  riskChip: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: { fontSize: 10, fontWeight: "700", color: "#fff" },
  tagRow: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    gap: 6,
  },
  tagPill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  tagText: { fontSize: 10, fontWeight: "600", color: "#fff" },
  body: { padding: 18 },
  farmerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  farmerName: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  memberSince: { fontSize: 10, color: COLORS.textMuted },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryPale,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: "auto",
    gap: 2,
  },
  verifiedText: { fontSize: 10, fontWeight: "600", color: COLORS.primary },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  progressBlock: { marginBottom: 16 },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  progressPct: { fontSize: 12, fontWeight: "800", color: COLORS.primary },
  track: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: COLORS.accent, borderRadius: 3 },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  amountRowCompact: {
    flexDirection: "column",
    gap: 4,
  },
  raised: { fontSize: 10, color: COLORS.textMuted },
  raisedBold: { fontWeight: "700", color: COLORS.primary },
  target: { fontSize: 10, color: COLORS.textMuted },
  investBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  investText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "ios" ? 60 : 48,
    paddingHorizontal: 24,
    paddingBottom: 72,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    position: "relative",
  },
  decCircleLg: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.primaryLight,
    top: -60,
    right: -50,
    opacity: 0.5,
  },
  decCircleSm: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accent,
    bottom: 20,
    left: -30,
    opacity: 0.18,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
  },
  greeting: {
    fontSize: 12,
    color: "#B6D9A0",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.white,
    marginTop: 2,
  },
  date: { fontSize: 11, color: "#A8CFA0", marginTop: 2 },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  notifDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.danger,
    position: "absolute",
    top: 0,
    right: 0,
    borderWidth: 2,
    borderColor: COLORS.primary,
    zIndex: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },
  micBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryPale,
    justifyContent: "center",
    alignItems: "center",
  },
  roleBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 14,
  },
  roleBannerText: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },

  weatherCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 24,
    marginTop: -50,
    borderRadius: 24,
    padding: 20,
  },
  weatherTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  locationRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  cityText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginLeft: 6,
  },
  weatherDesc: { fontSize: 11, color: COLORS.textMuted, marginLeft: 24 },
  tempBlock: { alignItems: "flex-end" },
  tempText: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -1,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: 16 },
  statsRow: { flexDirection: "row", alignItems: "center" },
  statsRowCompact: {
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  statDivider: { width: 1, height: 40, backgroundColor: COLORS.border },

  kpiStrip: {
    paddingLeft: 24,
    paddingRight: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  kpiCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    marginRight: 12,
    alignItems: "center",
    minWidth: 90,
  },
  kpiIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  kpiValue: { fontSize: 15, fontWeight: "800", color: COLORS.text },
  kpiLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 20,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  emptyButton: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyButtonText: { color: COLORS.white, fontWeight: "700", fontSize: 13 },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FDEDEC",
    borderRadius: 18,
    marginHorizontal: 24,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#F6C7C3",
  },
  errorBannerText: {
    flex: 1,
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },
});
