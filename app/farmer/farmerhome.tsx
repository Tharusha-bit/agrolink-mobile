import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { ComponentProps, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type MCIcon = ComponentProps<typeof MaterialCommunityIcons>["name"];

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  primary: "#1A5200",
  primaryMid: "#216000",
  primaryLight: "#2E8B00",
  primaryPale: "#E8F5E1",
  surface: "#F4F7F0",
  white: "#FFFFFF",
  ink: "#1A2E0D",
  inkSub: "#4A6741",
  inkMuted: "#9BB08A",
  accent: "#76C442",
  accentWarm: "#F5A623",
  gold: "#D4A017",
  goldLight: "#FFF8E1",
  border: "#E2EDD9",
  divider: "#EEF5E8",
};

const SH = {
  sm: Platform.select({
    ios: {
      shadowColor: "#1A5200",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 6,
    },
    android: { elevation: 2 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#1A5200",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.11,
      shadowRadius: 12,
    },
    android: { elevation: 5 },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
    },
    android: { elevation: 10 },
  }),
};

const FONT = { xs: 10, sm: 12, md: 14, lg: 16, xl: 18, xxl: 22 };
const SPACE = { xs: 6, sm: 10, md: 16, lg: 20, xl: 24 };

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS DICTIONARY
// ─────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    welcome: "Welcome",
    subLine: "Your farm control center",
    gold: "Gold",
    fundOverview: "Funding Overview",
    liveData: "Live Data",
    lkrRaised: "LKR Raised",
    projects: "Projects",
    investors: "Investors",
    viewAll: "View All Projects",
    quickActions: "Quick Actions",
    addProject: "Add Project",
    myProjects: "My Projects",
    postUpdate: "Post Update",
    analytics: "Analytics",
    activeProjects: "Active Projects",
    seeAll: "See All",
    noActive: "No active projects",
    noActiveSub: "Approved projects will appear here.",
    createProject: "Create Project",
    goal: "Goal",
  },
  si: {
    welcome: "ආයුබෝවන්",
    subLine: "ඔබේ ගොවිපල පාලන මධ්‍යස්ථානය",
    gold: "රන්",
    fundOverview: "අරමුදල් දළ විශ්ලේෂණය",
    liveData: "සජීවී දත්ත",
    lkrRaised: "එකතු කළ මුදල",
    projects: "ව්‍යාපෘති",
    investors: "ආයෝජකයින්",
    viewAll: "සියලුම ව්‍යාපෘති බලන්න",
    quickActions: "ඉක්මන් ක්‍රියා",
    addProject: "ව්‍යාපෘතියක් එක් කරන්න",
    myProjects: "මගේ ව්‍යාපෘති",
    postUpdate: "යාවත්කාලීන කිරීමක්",
    analytics: "විශ්ලේෂණ",
    activeProjects: "සක්‍රීය ව්‍යාපෘති",
    seeAll: "සියල්ල බලන්න",
    noActive: "සක්‍රීය ව්‍යාපෘති නොමැත",
    noActiveSub: "අනුමත කළ ව්‍යාපෘති මෙහි දිස්වනු ඇත.",
    createProject: "ව්‍යාපෘතියක් සාදන්න",
    goal: "ඉලක්කය",
  },
  ta: {
    welcome: "வரவேற்பு",
    subLine: "உங்கள் பண்ணை கட்டுப்பாட்டு மையம்",
    gold: "தங்கம்",
    fundOverview: "நிதி கண்ணோட்டம்",
    liveData: "நேரடி தரவு",
    lkrRaised: "திரட்டப்பட்டது (LKR)",
    projects: "திட்டங்கள்",
    investors: "முதலீட்டாளர்கள்",
    viewAll: "அனைத்து திட்டங்களையும் காண்க",
    quickActions: "விரைவான செயல்கள்",
    addProject: "திட்டத்தை சேர்",
    myProjects: "என் திட்டங்கள்",
    postUpdate: "புதுப்பிப்பை இடுக",
    analytics: "பகுப்பாய்வு",
    activeProjects: "செயலில் உள்ள திட்டங்கள்",
    seeAll: "அனைத்தையும் காண்க",
    noActive: "செயலில் உள்ள திட்டங்கள் இல்லை",
    noActiveSub: "அங்கீகரிக்கப்பட்ட திட்டங்கள் இங்கே தோன்றும்.",
    createProject: "திட்டத்தை உருவாக்கு",
    goal: "இலக்கு",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function MetricTile({ icon, value, label, color, bg }: any) {
  return (
    <View style={mt.tile}>
      <View style={[mt.iconBox, { backgroundColor: bg }]}>
        <MaterialCommunityIcons name={icon} size={18} color={color} />
      </View>
      <Text style={mt.value}>{value}</Text>
      <Text style={mt.label}>{label}</Text>
    </View>
  );
}
const mt = StyleSheet.create({
  tile: { flex: 1, alignItems: "center", gap: 5 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  value: { fontSize: FONT.xl, fontWeight: "900", color: C.ink },
  label: {
    fontSize: FONT.xs,
    fontWeight: "700",
    color: C.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    textAlign: "center",
  },
});

function ActionBtn({ action, onPress }: any) {
  return (
    <TouchableOpacity
      style={[ab.btn, SH.sm]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[ab.iconWrap, { backgroundColor: action.bg }]}>
        <MaterialCommunityIcons
          name={action.icon}
          size={24}
          color={action.color}
        />
      </View>
      <Text style={ab.label}>{action.label}</Text>
    </TouchableOpacity>
  );
}
const ab = StyleSheet.create({
  btn: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: FONT.sm,
    fontWeight: "700",
    color: C.ink,
    textAlign: "center",
  },
});

function ProjectCard({ project, onPress, t }: any) {
  const goal = project.fundingGoal || 1;
  const raised = project.currentFundingAmount || 0;
  const pct = Math.min(Math.round((raised / goal) * 100), 100);
  const title = project.projectTitle || "Farm Project";
  const imageUri =
    project.photos && project.photos.length > 0
      ? project.photos[0]
      : "https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg";

  return (
    <TouchableOpacity
      style={[pc.card, SH.md]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={{ uri: imageUri }} style={pc.img} />
      <View style={pc.body}>
        <Text style={pc.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={pc.barRow}>
          <View style={pc.track}>
            <View style={[pc.fill, { width: `${pct}%` }]} />
          </View>
          <Text style={pc.pct}>{pct}%</Text>
        </View>
        <View style={pc.metaRow}>
          <Text style={pc.raised}>LKR {raised.toLocaleString()}</Text>
          <Text style={pc.goal}>
            {" "}
            / {t.goal}: {goal.toLocaleString()}
          </Text>
        </View>
      </View>
      <MaterialCommunityIcons
        name={"chevron-right" as MCIcon}
        size={20}
        color={C.inkMuted}
      />
    </TouchableOpacity>
  );
}
const pc = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    marginHorizontal: SPACE.md,
    marginBottom: SPACE.sm,
    borderRadius: 20,
    padding: 12,
    gap: 12,
  },
  img: { width: 76, height: 76, borderRadius: 14, backgroundColor: C.border },
  body: { flex: 1 },
  title: {
    fontSize: FONT.md,
    fontWeight: "800",
    color: C.ink,
    marginBottom: 6,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: C.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: C.accent, borderRadius: 3 },
  pct: { fontSize: FONT.xs, fontWeight: "800", color: C.primary, width: 28 },
  metaRow: { flexDirection: "row", alignItems: "baseline" },
  raised: { fontSize: FONT.sm, fontWeight: "800", color: C.inkSub },
  goal: { fontSize: FONT.xs, color: C.inkMuted },
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function FarmerDashboard() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("Farmer");
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({ raised: 0, count: 0, investors: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [lang, setLang] = useState<"en" | "si" | "ta">("en");
  const t = TRANSLATIONS[lang];

  const fabScale = useRef(new Animated.Value(1)).current;

  const getQuickActions = () => [
    {
      icon: "plus-circle-outline" as MCIcon,
      label: t.addProject,
      bg: C.primaryPale,
      color: C.primary,
      route: "/project/create",
    },
    {
      icon: "folder-multiple" as MCIcon,
      label: t.myProjects,
      bg: "#F3E5F5",
      color: "#6A1B9A",
      route: "/farmer/projects",
    },
    {
      icon: "camera-plus-outline" as MCIcon,
      label: t.postUpdate,
      bg: "#FFF3E0",
      color: C.accentWarm,
      route: "update",
    },
    {
      icon: "chart-line" as MCIcon,
      label: t.analytics,
      bg: "#E3F2FD",
      color: "#1565C0",
      route: "analytics",
    },
  ];

  const fetchDashboardData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedName = await AsyncStorage.getItem("firstName");

      if (storedName) setDisplayName(storedName);
      if (!storedUserId) {
        setLoading(false);
        return;
      }

      // ⚠️ UPDATE TO YOUR BACKEND IP
      const API_URL = "http://172.20.10.6:8080";
      const projRes = await axios.get(
        `${API_URL}/api/farmer-project/list/${storedUserId}`,
      );
      const projects = projRes.data || [];
      setDbProjects(projects);

      let totalRaised = 0;
      let uniqueInvestors = new Set();

      for (const proj of projects) {
        totalRaised += proj.currentFundingAmount || 0;
        try {
          const invRes = await axios.get(
            `${API_URL}/api/investments/project/${proj.id}`,
          );
          const investments = invRes.data || [];

          investments.forEach((inv: any) => {
            if (inv.investorId) uniqueInvestors.add(inv.investorId);
          });
        } catch (e: any) {
          // 🚨 ENHANCED ERROR LOGGING - Check your frontend terminal!
          console.error(
            `❌ Backend Error on Investments for Project ${proj.id}:`,
            e.response?.status,
            e.message,
          );
        }
      }

      setStats({
        raised: totalRaised,
        count: projects.length,
        investors: uniqueInvestors.size,
      });
    } catch (error) {
      console.error("Failed to fetch farmer dashboard data", error);
      Alert.alert("Network Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, []);

  const activeProjects = dbProjects.filter(
    (p) =>
      p.status === "FUNDING" ||
      p.status === "IN_PROGRESS" ||
      p.status === "APPROVED",
  );

  const formatRaised = (amount: number) => {
    return amount >= 1000
      ? `${(amount / 1000).toFixed(0)}k`
      : amount.toString();
  };

  const pressFab = () => {
    Animated.sequence([
      Animated.spring(fabScale, { toValue: 0.88, useNativeDriver: true }),
      Animated.spring(fabScale, { toValue: 1, useNativeDriver: true }),
    ]).start(() => router.push("/project/create" as any));
  };

  const handleAction = (route: string) => {
    if (route.startsWith("/")) router.push(route as any);
    else Alert.alert("Coming Soon", "This feature is not yet implemented.");
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.primaryMid} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={C.primary}
            colors={[C.primary]}
          />
        }
      >
        <View style={s.header}>
          <View style={s.blob1} />
          <View style={s.blob2} />

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

          <View style={s.topRow}>
            <View>
              <Text style={s.greeting}>
                {t.welcome}, {displayName} 🙏
              </Text>
              <Text style={s.subLine}>{t.subLine}</Text>
            </View>
            <View style={s.headerRight}>
              <View style={s.levelBadge}>
                <MaterialCommunityIcons
                  name={"shield-check" as MCIcon}
                  size={12}
                  color={C.gold}
                />
                <Text style={s.levelText}>{t.gold}</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/farmer/profile" as any)}
              >
                <View style={s.avatar}>
                  <MaterialCommunityIcons
                    name={"account" as MCIcon}
                    size={28}
                    color={C.primary}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[s.card, SH.sm, { marginTop: -30 }]}>
          <View style={s.cardHeaderRow}>
            <Text style={s.cardTitle}>{t.fundOverview}</Text>
            <View style={s.trendBadge}>
              <MaterialCommunityIcons
                name={"trending-up" as MCIcon}
                size={12}
                color={C.accent}
              />
              <Text style={s.trendText}>{t.liveData}</Text>
            </View>
          </View>

          {loading && !refreshing ? (
            <ActivityIndicator
              size="large"
              color={C.primary}
              style={{ marginVertical: 20 }}
            />
          ) : (
            <View style={s.metricsRow}>
              <MetricTile
                icon={"currency-usd" as MCIcon}
                value={formatRaised(stats.raised)}
                label={t.lkrRaised}
                color={C.primary}
                bg={C.primaryPale}
              />
              <View style={s.metricDivider} />
              <MetricTile
                icon={"folder-multiple-outline" as MCIcon}
                value={stats.count}
                label={t.projects}
                color={"#1565C0"}
                bg={"#E3F2FD"}
              />
              <View style={s.metricDivider} />
              <MetricTile
                icon={"account-group-outline" as MCIcon}
                value={stats.investors}
                label={t.investors}
                color={C.accentWarm}
                bg={C.goldLight}
              />
            </View>
          )}

          <TouchableOpacity
            style={s.viewAllBtn}
            onPress={() => router.push("/farmer/projects" as any)}
          >
            <Text style={s.viewAllText}>{t.viewAll}</Text>
            <MaterialCommunityIcons
              name={"arrow-right" as MCIcon}
              size={14}
              color={C.primary}
            />
          </TouchableOpacity>
        </View>

        <Text style={s.sectionLabel}>{t.quickActions}</Text>
        <View style={s.actionsGrid}>
          {getQuickActions().map((a) => (
            <ActionBtn
              key={a.label}
              action={a}
              onPress={() => handleAction(a.route)}
            />
          ))}
        </View>

        <View style={s.sectionRow}>
          <Text style={s.sectionLabel}>{t.activeProjects}</Text>
          <TouchableOpacity
            onPress={() => router.push("/farmer/projects" as any)}
          >
            <Text style={s.seeAll}>{t.seeAll}</Text>
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator size="small" color={C.primary} />
        ) : activeProjects.length === 0 ? (
          <View style={[s.emptyCard, SH.sm]}>
            <MaterialCommunityIcons
              name={"tractor" as MCIcon}
              size={40}
              color={C.accent}
            />
            <Text style={s.emptyTitle}>{t.noActive}</Text>
            <Text style={s.emptySub}>{t.noActiveSub}</Text>
            <TouchableOpacity
              style={s.emptyBtn}
              onPress={() => router.push("/project/create" as any)}
            >
              <Text style={s.emptyBtnText}>{t.createProject}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          activeProjects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              t={t}
              onPress={() =>
                router.push(`/farmer/project-manage/${p.id}` as any)
              }
            />
          ))
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      <Animated.View
        style={[s.fab, SH.lg, { transform: [{ scale: fabScale }] }]}
      >
        <TouchableOpacity
          onPress={pressFab}
          style={s.fabInner}
          activeOpacity={1}
        >
          <MaterialCommunityIcons
            name={"plus" as MCIcon}
            size={30}
            color={C.white}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  scroll: { paddingBottom: 30 },
  header: {
    backgroundColor: C.primaryMid,
    paddingTop: 40,
    paddingHorizontal: SPACE.md,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    marginBottom: SPACE.md,
  },
  blob1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: C.primaryLight,
    top: -70,
    right: -60,
    opacity: 0.3,
  },
  blob2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.accent,
    bottom: -20,
    left: 30,
    opacity: 0.1,
  },
  langGroup: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 3,
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  langBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  langBtnActive: { backgroundColor: C.white },
  langText: { fontSize: 11, fontWeight: "700", color: "rgba(255,255,255,0.8)" },
  langTextActive: { color: C.primary },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: FONT.xl,
    fontWeight: "800",
    color: C.white,
    letterSpacing: 0.2,
  },
  subLine: { fontSize: FONT.sm, color: "rgba(255,255,255,0.7)", marginTop: 3 },
  headerRight: { alignItems: "flex-end", gap: SPACE.xs },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.goldLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  levelText: { fontSize: FONT.xs, fontWeight: "800", color: C.gold },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.white,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: C.white,
    marginHorizontal: SPACE.md,
    marginBottom: SPACE.md,
    borderRadius: 22,
    padding: SPACE.md,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACE.md,
  },
  cardTitle: { fontSize: FONT.lg, fontWeight: "800", color: C.ink },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.primaryPale,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  trendText: { fontSize: FONT.xs, fontWeight: "700", color: C.primary },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACE.xs,
  },
  metricDivider: { width: 1, height: 40, backgroundColor: C.divider },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: SPACE.md,
    paddingTop: SPACE.sm,
    borderTopWidth: 1,
    borderColor: C.divider,
  },
  viewAllText: { fontSize: FONT.sm, fontWeight: "700", color: C.primary },
  sectionLabel: {
    fontSize: FONT.md,
    fontWeight: "800",
    color: C.ink,
    marginLeft: SPACE.md,
    marginBottom: SPACE.sm,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: SPACE.md,
  },
  seeAll: { fontSize: FONT.sm, fontWeight: "700", color: C.primaryLight },
  actionsGrid: {
    flexDirection: "row",
    marginHorizontal: SPACE.md,
    gap: SPACE.sm,
    marginBottom: SPACE.md,
  },
  emptyCard: {
    backgroundColor: C.white,
    marginHorizontal: SPACE.md,
    marginBottom: SPACE.md,
    borderRadius: 22,
    padding: SPACE.xl,
    alignItems: "center",
    gap: SPACE.sm,
  },
  emptyTitle: { fontSize: FONT.lg, fontWeight: "800", color: C.ink },
  emptySub: { fontSize: FONT.md, color: C.inkMuted, textAlign: "center" },
  emptyBtn: {
    marginTop: SPACE.sm,
    backgroundColor: C.primary,
    paddingHorizontal: SPACE.xl,
    paddingVertical: 13,
    borderRadius: 16,
  },
  emptyBtnText: { fontSize: FONT.md, fontWeight: "800", color: C.white },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.primaryLight,
    overflow: "hidden",
    elevation: 8,
  },
  fabInner: { flex: 1, justifyContent: "center", alignItems: "center" },
});
