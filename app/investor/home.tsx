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

// ─── Translations ──────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    morning: "Good morning 🌱",
    afternoon: "Good afternoon ☀️",
    evening: "Good evening 🌙",
    searchBox: "Search crops, farmers...",
    weatherFetching: "Fetching weather...",
    locDenied: "Location Denied",
    locError: "Location Error",
    locating: "Locating...",
    humidity: "Humidity",
    soilTemp: "Soil Temp",
    wind: "Wind",
    kpiCrops: "Active Crops",
    kpiInvestors: "Investors",
    kpiFunded: "Total Funded",
    topInvestments: "Top Investments",
    seeAll: "See all",
    riskLow: "Low Risk",
    riskMed: "Medium Risk",
    riskHigh: "High Risk",
    verified: "Verified",
    prog: "Funding Progress",
    raised: "Raised:",
    goal: "Goal:",
    viewBtn: "View Details",
  },
  si: {
    morning: "සුබ උදෑසනක් 🌱",
    afternoon: "සුබ මධ්‍යහ්නයක් ☀️",
    evening: "සුබ සන්ධ්‍යාවක් 🌙",
    searchBox: "බෝග, ගොවීන් සොයන්න...",
    weatherFetching: "කාලගුණය ලබාගනිමින්...",
    locDenied: "ස්ථානය ප්‍රතික්ෂේප විය",
    locError: "ස්ථාන දෝෂයකි",
    locating: "ස්ථානය සොයමින්...",
    humidity: "ආර්ද්‍රතාවය",
    soilTemp: "පසෙහි උෂ්ණත්වය",
    wind: "සුළඟ",
    kpiCrops: "සක්‍රීය බෝග",
    kpiInvestors: "ආයෝජකයින්",
    kpiFunded: "මුළු අරමුදල්",
    topInvestments: "ඉහළම ආයෝජන",
    seeAll: "සියල්ල බලන්න",
    riskLow: "අඩු අවදානම්",
    riskMed: "මධ්‍යම අවදානම්",
    riskHigh: "අධි අවදානම්",
    verified: "තහවුරු කර ඇත",
    prog: "අරමුදල් ප්‍රගතිය",
    raised: "එකතු කළ:",
    goal: "ඉලක්කය:",
    viewBtn: "විස්තර බලන්න",
  },
  ta: {
    morning: "காலை வணக்கம் 🌱",
    afternoon: "மதிய வணக்கம் ☀️",
    evening: "மாலை வணக்கம் 🌙",
    searchBox: "பயிர்கள், விவசாயிகளைத் தேடுங்கள்...",
    weatherFetching: "வானிலை பெறுகிறது...",
    locDenied: "இடம் மறுக்கப்பட்டது",
    locError: "இடம் பிழை",
    locating: "கண்டுபிடிக்கிறது...",
    humidity: "ஈரப்பதம்",
    soilTemp: "மண் வெப்பம்",
    wind: "காற்று",
    kpiCrops: "செயலில் உள்ள பயிர்கள்",
    kpiInvestors: "முதலீட்டாளர்கள்",
    kpiFunded: "மொத்த நிதி",
    topInvestments: "சிறந்த முதலீடுகள்",
    seeAll: "அனைத்தையும் காண்க",
    riskLow: "குறைந்த ஆபத்து",
    riskMed: "நடுத்தர ஆபத்து",
    riskHigh: "அதிக ஆபத்து",
    verified: "சரிபார்க்கப்பட்டது",
    prog: "நிதி முன்னேற்றம்",
    raised: "திரட்டப்பட்டது:",
    goal: "இலக்கு:",
    viewBtn: "விவரங்களைக் காண்க",
  },
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

const InvestmentCard = ({ project, t }: any) => {
  const router = useRouter();

  const goal = project.fundingGoal || 1;
  const raised = project.currentFundingAmount || 0;
  const progressPct = Math.min(Math.max(raised / goal, 0), 1);

  let riskLevel = t.riskMed;
  let riskColor = COLORS.accentWarm;
  if (project.profileStrength >= 70) {
    riskLevel = t.riskLow;
    riskColor = COLORS.accent;
  } else if (project.profileStrength < 40) {
    riskLevel = t.riskHigh;
    riskColor = COLORS.danger;
  }

  const displayFarmer = project.farmerName || "Farmer";
  const imageUri =
    project.photos && project.photos.length > 0
      ? project.photos[0]
      : "https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg";
  const displayTitle = project.projectTitle || "Farm Investment";

  return (
    <TouchableOpacity
      style={[ic.card, SHADOWS.md]}
      activeOpacity={0.9}
      onPress={() =>
        router.push(`/investor/project-details/${project.id}` as any)
      }
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
          <Text style={ic.riskText}>{riskLevel}</Text>
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
            <Text style={ic.farmerName}>by {displayFarmer}</Text>
          </View>
          {project.isVerified && (
            <View style={ic.verifiedBadge}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={14}
                color={COLORS.primary}
              />
              <Text style={ic.verifiedText}>{t.verified}</Text>
            </View>
          )}
        </View>

        <Text style={ic.description} numberOfLines={2}>
          {project.description || "Farm project seeking funding."}
        </Text>

        <View style={ic.progressBlock}>
          <View style={ic.progressLabels}>
            <Text style={ic.progressTitle}>{t.prog}</Text>
            <Text style={ic.progressPct}>{Math.round(progressPct * 100)}%</Text>
          </View>
          <View style={ic.track}>
            <View style={[ic.fill, { width: `${progressPct * 100}%` }]} />
          </View>
          <View style={ic.amountRow}>
            <Text style={ic.raised}>
              {t.raised}{" "}
              <Text style={ic.raisedBold}>LKR {raised.toLocaleString()}</Text>
            </Text>
            <Text style={ic.target}>
              {t.goal} LKR {goal.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={ic.investBtn}>
          <Text style={ic.investText}>{t.viewBtn}</Text>
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

  const [lang, setLang] = useState<"en" | "si" | "ta">("en");
  const t = TRANSLATIONS[lang];

  const [displayName, setDisplayName] = useState("Investor");
  const [greetingText, setGreetingText] = useState(t.morning);
  const [dateString, setDateString] = useState("");

  // Real-time Data States
  const [totalInvestors, setTotalInvestors] = useState(0);
  const [totalFunded, setTotalFunded] = useState(0);
  const [topProjects, setTopProjects] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Weather States
  const [city, setCity] = useState(t.locating);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weather, setWeather] = useState({
    temp: "--",
    humidity: "--",
    wind: "--",
    soilTemp: "--",
    description: t.weatherFetching,
    icon: "weather-cloudy",
  });

  // ⚠️ Ensure this matches your backend IP address
  const API_URL = "http://172.20.10.6:8080";

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `LKR ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `LKR ${(val / 1000).toFixed(1)}k`;
    return `LKR ${val}`;
  };

  useFocusEffect(
    useCallback(() => {
      const loadDashboard = async () => {
        setLoadingData(true);

        const storedName = await AsyncStorage.getItem("firstName");
        if (storedName) setDisplayName(storedName);

        const today = new Date();
        const currentHour = today.getHours();
        if (currentHour < 12) setGreetingText(t.morning);
        else if (currentHour < 18) setGreetingText(t.afternoon);
        else setGreetingText(t.evening);

        setDateString(
          today.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        );

        try {
          const projRes = await axios.get(`${API_URL}/api/farmer-project/all`);
          let allProjects = projRes.data || [];

          let activeProjects = allProjects.filter(
            (p: any) => p.status === "FUNDING" || p.status === "APPROVED",
          );

          let uniqueInvestors = new Set();
          let moneySum = 0;

          const enrichedProjects = await Promise.all(
            activeProjects.map(async (proj: any) => {
              moneySum += proj.currentFundingAmount || 0;

              try {
                const invRes = await axios.get(
                  `${API_URL}/api/investments/project/${proj.id}`,
                );
                const invs = invRes.data || [];
                invs.forEach((inv: any) => {
                  if (inv.investorId) uniqueInvestors.add(inv.investorId);
                });
              } catch (e) {}

              let profileStrength = 0;
              let farmerName = "Farmer";
              let isVerified = false;
              try {
                if (proj.farmerId) {
                  const userRes = await axios.get(
                    `${API_URL}/api/users/${proj.farmerId}`,
                  );
                  profileStrength = userRes.data.profileStrength || 0;
                  isVerified = userRes.data.isVerified === true;
                  farmerName =
                    `${userRes.data.firstName || ""} ${userRes.data.lastName || ""}`.trim();
                }
              } catch (e) {}

              return { ...proj, farmerName, profileStrength, isVerified };
            }),
          );

          setTotalInvestors(uniqueInvestors.size);
          setTotalFunded(moneySum);

          enrichedProjects.sort((a, b) => {
            if (b.currentFundingAmount !== a.currentFundingAmount) {
              return (
                (b.currentFundingAmount || 0) - (a.currentFundingAmount || 0)
              );
            }
            return (b.profileStrength || 0) - (a.profileStrength || 0);
          });

          setTopProjects(enrichedProjects.slice(0, 3));
        } catch (error) {
          console.error("Failed to load real-time data", error);
        } finally {
          setLoadingData(false);
        }
      };

      loadDashboard();
    }, [lang]),
  );

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setCity(t.locDenied);
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

        let wDesc = "Clear skies";
        let wIcon = current.is_day ? "weather-sunny" : "weather-night";
        if (wCode >= 1 && wCode <= 3) {
          wDesc = "Partly cloudy";
          wIcon = "weather-partly-cloudy";
        }
        if (wCode >= 51 && wCode <= 67) {
          wDesc = "Rain expected";
          wIcon = "weather-rainy";
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
        setCity(t.locError);
        setWeather((prev) => ({ ...prev, description: "Failed to load" }));
      } finally {
        setLoadingWeather(false);
      }
    })();
  }, []);

  const KPI_DATA = [
    { label: t.kpiCrops, value: "1", icon: "sprout", color: COLORS.accent },
    {
      label: t.kpiInvestors,
      value: loadingData ? "-" : totalInvestors.toString(),
      icon: "account-group",
      color: COLORS.primary,
    },
    {
      label: t.kpiFunded,
      value: loadingData ? "-" : formatCurrency(totalFunded),
      icon: "cash-multiple",
      color: COLORS.accentWarm,
    },
  ];

  const displayProjects =
    topProjects && topProjects.length > 0 ? topProjects : FALLBACK_INVESTMENTS;

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
              placeholder={t.searchBox}
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
              label={t.humidity}
              value={loadingWeather ? "--" : `${weather.humidity}%`}
              color={COLORS.info}
            />
            <View style={s.statDivider} />
            <StatBadge
              icon="thermometer"
              label={t.soilTemp}
              value={loadingWeather ? "--" : `${weather.soilTemp}°C`}
              color={COLORS.accentWarm}
              iconFamily="mci"
            />
            <View style={s.statDivider} />
            <StatBadge
              icon="weather-windy"
              label={t.wind}
              value={loadingWeather ? "--" : `${weather.wind} m/s`}
              color={COLORS.accent}
            />
          </View>
        </View>

        {/* 📊 DYNAMIC KPI STRIP */}
        <View style={s.kpiStrip}>
          {KPI_DATA.map((k) => (
            <View key={k.label} style={[s.kpiCard, SHADOWS.sm]}>
              <View style={[s.kpiIcon, { backgroundColor: k.color + "15" }]}>
                <MaterialCommunityIcons
                  name={k.icon as any}
                  size={22}
                  color={k.color}
                />
              </View>
              <Text style={s.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
                {k.value}
              </Text>
              <Text style={s.kpiLabel} numberOfLines={1} adjustsFontSizeToFit>
                {k.label}
              </Text>
            </View>
          ))}
        </View>

        <SectionHeader
          title={t.topInvestments}
          actionLabel={t.seeAll}
          onAction={() => {}}
        />

        {loadingData ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginVertical: 30 }}
          />
        ) : (
          displayProjects.map((proj: any) => (
            <InvestmentCard key={proj.id} project={proj} t={t} />
          ))
        )}
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

  langGroup: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 3,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  langBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  langBtnActive: { backgroundColor: COLORS.white },
  langText: { fontSize: 11, fontWeight: "700", color: "rgba(255,255,255,0.8)" },
  langTextActive: { color: COLORS.primary },

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
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  kpiIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },
  kpiLabel: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: "center",
  },
});
