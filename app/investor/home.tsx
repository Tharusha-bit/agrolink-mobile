import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useProjects } from "../../src/context/ProjectContext";

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

// ─── Static Fallback Data ───────────────────────────────────────────────────
const FALLBACK_INVESTMENTS = [
  {
    id: "1",
    title: "Fertile Paddy Field Expansion",
    farmer: "Suriyakumar",
    since: "19 Nov 2025",
    description:
      "Committed farmer seeking investment partners for 8 acres of fertile paddy field. Excellent soil quality and reliable water access.",
    progress: 0.8,
    raised: 48000,
    goal: 60000,
    riskLevel: "Low",
    tags: ["Paddy", "Rice"],
    image:
      "https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg",
  },
  {
    id: "2",
    title: "Organic Vegetable Export",
    farmer: "Priya Devi",
    since: "2 Jan 2026",
    description:
      "Organic vegetable farm in Jaffna district seeking working capital. Specialises in export-grade green beans and okra.",
    progress: 0.47,
    raised: 14100,
    goal: 30000,
    riskLevel: "Medium",
    tags: ["Organic", "Veg"],
    image:
      "https://cdn.pixabay.com/photo/2018/03/11/01/25/vegetable-3215091_1280.jpg",
  },
];

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
  id,
  title,
  farmer,
  since = "Recently",
  description,
  progress = 0,
  image,
  tags = [],
  riskLevel = "Medium",
  targetAmount,
  raisedAmount,
  goal,
  raised,
}: any) => {
  const router = useRouter();

  const actualGoal = goal || targetAmount || 1;
  const actualRaised = raised || raisedAmount || 0;
  const actualProgress = progress > 0 ? progress : actualRaised / actualGoal;
  const progressPct = Math.min(Math.max(actualProgress, 0), 1);
  const riskColor =
    riskLevel === "Low"
      ? COLORS.accent
      : riskLevel === "Medium"
        ? COLORS.accentWarm
        : COLORS.danger;

  const displayFarmer =
    typeof farmer === "object" && farmer !== null ? farmer.name : farmer;
  const imageUri = image?.uri || image || "https://via.placeholder.com/150";
  const displayTitle = title || "Farm Investment";

  return (
    <TouchableOpacity
      style={[ic.card, SHADOWS.md]}
      activeOpacity={0.9}
      onPress={() => router.push(`/investor/project-details/${id}` as any)}
    >
      <View style={ic.imageWrap}>
        <Image source={{ uri: imageUri }} style={ic.image} />
        <View style={ic.imageFade} />

        <View style={[ic.riskChip, { backgroundColor: riskColor }]}>
          <MaterialCommunityIcons
            name="shield-check"
            size={12}
            color="#fff"
            style={{ marginRight: 4 }}
          />
          <Text style={ic.riskText}>{riskLevel} Risk</Text>
        </View>

        <View style={ic.tagRow}>
          {tags.slice(0, 3).map((t: string, index: number) => (
            <View key={index} style={ic.tagPill}>
              <Text style={ic.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={ic.body}>
        <View style={ic.farmerRow}>
          <View style={ic.avatarWrap}>
            <MaterialCommunityIcons
              name="account"
              size={18}
              color={COLORS.white}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={ic.title} numberOfLines={1}>
              {displayTitle}
            </Text>
            <Text style={ic.farmerName}>
              by {displayFarmer} • {since}
            </Text>
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

        <Text style={ic.description} numberOfLines={2}>
          {description}
        </Text>

        <View style={ic.progressBlock}>
          <View style={ic.progressLabels}>
            <Text style={ic.progressTitle}>Funding Progress</Text>
            <Text style={ic.progressPct}>{Math.round(progressPct * 100)}%</Text>
          </View>
          <View style={ic.track}>
            <View style={[ic.fill, { width: `${progressPct * 100}%` }]} />
          </View>
          <View style={ic.amountRow}>
            <Text style={ic.raised}>
              Raised:{" "}
              <Text style={ic.raisedBold}>
                LKR {actualRaised.toLocaleString()}
              </Text>
            </Text>
            <Text style={ic.target}>
              Goal: LKR {actualGoal.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={ic.investBtn}>
          <Text style={ic.investText}>View Details</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen Component ────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const { projects } = useProjects();

  // ✅ Dynamic user details & real-time greeting
  const [displayName, setDisplayName] = useState("Investor");
  const [greetingText, setGreetingText] = useState("Good morning 🌱");
  const [dateString, setDateString] = useState("");

  const displayProjects =
    projects && projects.length > 0 ? projects : FALLBACK_INVESTMENTS;

  // Weather States
  const [city, setCity] = useState("Locating...");
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weather, setWeather] = useState({
    temp: "--",
    humidity: "--",
    wind: "--",
    soilTemp: "--",
    description: "Fetching weather...",
    icon: "weather-cloudy",
  });

  // ✅ Trigger dynamic updates on mount and every time the screen focuses
  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        const storedName = await AsyncStorage.getItem("firstName");
        if (storedName) {
          setDisplayName(storedName);
        }

        const today = new Date();
        const currentHour = today.getHours();

        if (currentHour < 12) setGreetingText("Good morning 🌱");
        else if (currentHour < 18) setGreetingText("Good afternoon ☀️");
        else setGreetingText("Good evening 🌙");

        setDateString(
          today.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        );
      };

      loadUserData();
    }, []),
  );

  // Weather API Call
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setCity("Location Denied");
          setWeather((prev) => ({ ...prev, description: "Permission denied" }));
          setLoadingWeather(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;

        let address = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lon,
        });
        if (address.length > 0) {
          setCity(
            address[0].city ||
              address[0].district ||
              address[0].subregion ||
              "Unknown Location",
          );
        }

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day&hourly=soil_temperature_0cm&timezone=auto`;

        const response = await axios.get(weatherUrl);
        const current = response.data.current;
        const wCode = current.weather_code;
        const isDay = current.is_day;

        let wDesc = "Clear skies";
        let wIcon = isDay ? "weather-sunny" : "weather-night";

        if (wCode >= 1 && wCode <= 3) {
          wDesc = "Partly cloudy";
          wIcon = "weather-partly-cloudy";
        }
        if (wCode >= 45 && wCode <= 48) {
          wDesc = "Foggy conditions";
          wIcon = "weather-fog";
        }
        if (wCode >= 51 && wCode <= 67) {
          wDesc = "Rain expected";
          wIcon = "weather-rainy";
        }
        if (wCode >= 71 && wCode <= 77) {
          wDesc = "Snow expected";
          wIcon = "weather-snowy";
        }
        if (wCode >= 95) {
          wDesc = "Thunderstorms";
          wIcon = "weather-lightning";
        }

        setWeather({
          temp: Math.round(current.temperature_2m).toString(),
          humidity: current.relative_humidity_2m.toString(),
          wind: Math.round(current.wind_speed_10m).toString(),
          soilTemp: Math.round(
            response.data.hourly.soil_temperature_0cm[0],
          ).toString(),
          description: wDesc,
          icon: wIcon,
        });
      } catch (error) {
        console.error("Weather error:", error);
        setCity("Location Error");
        setWeather((prev) => ({ ...prev, description: "Failed to load" }));
      } finally {
        setLoadingWeather(false);
      }
    })();
  }, []);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={s.header}>
          <View style={s.decCircleLg} />
          <View style={s.decCircleSm} />

          <View style={s.topBar}>
            <View>
              <Text style={s.greeting}>{greetingText}</Text>
              <Text style={s.userName}>{displayName}</Text>
              <Text style={s.date}>{dateString}</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push("/investor/Investorprofilehubscreen" as any)
              }
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

          <View style={s.searchBar}>
            <Ionicons
              name="search-outline"
              size={20}
              color={COLORS.textMuted}
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Search crops, farmers..."
              placeholderTextColor={COLORS.textMuted}
              style={s.searchInput}
            />
            <TouchableOpacity style={s.micBtn}>
              <MaterialCommunityIcons
                name="microphone-outline"
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ DYNAMIC WEATHER WIDGET */}
        <View style={[s.weatherCard, SHADOWS.lg]}>
          <View style={s.weatherTopRow}>
            <View>
              <View style={s.locationRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={18}
                  color={COLORS.primary}
                />
                <Text style={s.cityText}>{city}</Text>
              </View>
              <Text style={s.weatherDesc}>{weather.description}</Text>
            </View>
            <View style={s.tempBlock}>
              {loadingWeather ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.info}
                  style={{ marginTop: 10 }}
                />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name={weather.icon as any}
                    size={32}
                    color={COLORS.info}
                  />
                  <Text style={s.tempText}>{weather.temp}°C</Text>
                </>
              )}
            </View>
          </View>

          <View style={s.divider} />

          <View style={s.statsRow}>
            <StatBadge
              icon="water-percent"
              label="Humidity"
              value={loadingWeather ? "--" : `${weather.humidity}%`}
              color={COLORS.info}
            />
            <View style={s.statDivider} />
            <StatBadge
              icon="thermometer"
              label="Soil Temp"
              value={loadingWeather ? "--" : `${weather.soilTemp}°C`}
              color={COLORS.accentWarm}
              iconFamily="mci"
            />
            <View style={s.statDivider} />
            <StatBadge
              icon="weather-windy"
              label="Wind"
              value={loadingWeather ? "--" : `${weather.wind} m/s`}
              color={COLORS.accent}
            />
          </View>
        </View>

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

        <SectionHeader
          title="Top Investments"
          actionLabel="See all"
          onAction={() => {}}
        />

        {displayProjects.map((inv: any) => (
          <InvestmentCard key={inv.id} {...inv} />
        ))}
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
    overflow: "hidden",
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
  farmerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  title: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  farmerName: { fontSize: 11, color: COLORS.textMuted },
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
    marginTop: 6,
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
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
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
});
