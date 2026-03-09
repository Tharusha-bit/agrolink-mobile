import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Added AsyncStorage
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { ComponentProps, useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type MCIcon = ComponentProps<typeof MaterialCommunityIcons>["name"];
type IonIcon = ComponentProps<typeof Ionicons>["name"];

const T = {
  primary: "#216000",
  primaryDark: "#174400",
  primaryMid: "#2E8B00",
  accent: "#76C442",
  accentPale: "#E8F5E1",
  surface: "#F7F9F4",
  white: "#FFFFFF",
  ink: "#1A2E0D",
  inkSub: "#3D5230",
  inkMuted: "#7A9668",
  border: "#D6E8C8",
  divider: "#EDF4E8",
  amber: "#F5A623",
  amberPale: "#FFF3DC",
  blue: "#1976D2",
  bluePale: "#E3F2FD",
  red: "#D32F2F",
};

const FONT = { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 24 };
const SPACE = { xs: 6, sm: 10, md: 16, lg: 22, xl: 28 };
const SH = {
  sm: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 6,
    },
    android: { elevation: 3 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#216000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    android: { elevation: 5 },
  }),
  fab: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.28,
      shadowRadius: 10,
    },
    android: { elevation: 10 },
  }),
};

function SearchBar({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (t: string) => void;
}) {
  return (
    <View style={sb.wrap}>
      <Ionicons name={"search" as IonIcon} size={22} color={T.inkMuted} />
      <TextInput
        style={sb.input}
        placeholder="Search by crop name…"
        placeholderTextColor={T.inkMuted}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Ionicons
            name={"close-circle" as IonIcon}
            size={18}
            color={T.inkMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
const sb = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
    ...SH.sm,
  },
  input: { flex: 1, fontSize: FONT.md, color: T.ink, height: "100%" },
});

function FilterTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (k: string) => void;
}) {
  const TABS = [
    { key: "All", label: "All Projects", icon: "view-grid-outline" },
    { key: "Active", label: "Active Funding", icon: "sprout" },
    { key: "Pending", label: "Pending Approval", icon: "clock-outline" },
  ];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={ft.row}
    >
      {TABS.map((t) => {
        const isOn = active === t.key;
        return (
          <TouchableOpacity
            key={t.key}
            style={[ft.chip, isOn && ft.chipOn]}
            onPress={() => onChange(t.key)}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name={t.icon as MCIcon}
              size={16}
              color={isOn ? T.white : T.inkMuted}
            />
            <Text style={[ft.label, isOn && ft.labelOn]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
const ft = StyleSheet.create({
  row: { paddingHorizontal: SPACE.md, gap: SPACE.sm, paddingVertical: 4 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 24,
    backgroundColor: T.white,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  chipOn: { backgroundColor: T.primary, borderColor: T.primary },
  label: { fontSize: FONT.sm, fontWeight: "700", color: T.inkMuted },
  labelOn: { color: T.white },
});

function ProjectCard({ project }: { project: any }) {
  const router = useRouter();
  const goal = project.fundingGoal || 1;
  const raised = project.currentFundingAmount || 0;
  const progress = raised / goal;
  const pct = Math.min(Math.round(progress * 100), 100);

  const isActive = ["FUNDING", "IN_PROGRESS", "APPROVED"].includes(
    project.status,
  );
  const imageUrl =
    project.photos && project.photos.length > 0
      ? project.photos[0]
      : "https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg";
  const roiLabel = `${project.minRoi || 0}% - ${project.maxRoi || 0}%`;

  const statusColor = isActive ? T.primary : T.amber;
  const statusBg = isActive ? T.accentPale : T.amberPale;
  const statusLabel = isActive ? "Active Funding" : "Pending Approval";
  const statusIcon: MCIcon = isActive
    ? "check-circle-outline"
    : "clock-outline";
  const barColor = pct >= 60 ? T.accent : pct >= 30 ? T.amber : T.red;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => router.push(`/farmer/project-manage/${project.id}` as any)}
      style={[pc.card, SH.md]}
    >
      <View style={pc.imgWrap}>
        <Image source={{ uri: imageUrl }} style={pc.img} resizeMode="cover" />
        <View style={[pc.statusPill, { backgroundColor: statusBg }]}>
          <MaterialCommunityIcons
            name={statusIcon}
            size={13}
            color={statusColor}
          />
          <Text style={[pc.statusText, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <View style={pc.body}>
        <Text style={pc.title}>{project.projectTitle || "Farm Project"}</Text>
        <View style={pc.metaRow}>
          <Ionicons
            name={"location-sharp" as IonIcon}
            size={13}
            color={T.accent}
          />
          <Text style={pc.metaText}>{project.location || "Sri Lanka"}</Text>
        </View>
        <View style={pc.divider} />
        <View style={pc.financialRow}>
          <View style={pc.finBox}>
            <View style={pc.finLabelRow}>
              <MaterialCommunityIcons
                name={"flag-outline" as MCIcon}
                size={13}
                color={T.inkMuted}
              />
              <Text style={pc.finLabel}>Goal</Text>
            </View>
            <Text style={pc.finValue}>LKR {goal.toLocaleString()}</Text>
          </View>
          <View style={pc.finSep} />
          <View style={pc.finBox}>
            <View style={pc.finLabelRow}>
              <MaterialCommunityIcons
                name={"cash" as MCIcon}
                size={13}
                color={T.primary}
              />
              <Text style={pc.finLabel}>Raised</Text>
            </View>
            <Text style={[pc.finValue, { color: T.primary }]}>
              LKR {raised.toLocaleString()}
            </Text>
          </View>
          <View style={pc.finSep} />
          <View style={pc.finBox}>
            <View style={pc.finLabelRow}>
              <MaterialCommunityIcons
                name={"trending-up" as MCIcon}
                size={13}
                color={T.inkMuted}
              />
              <Text style={pc.finLabel}>ROI</Text>
            </View>
            <Text style={[pc.finValue, { color: T.inkSub, fontSize: 13 }]}>
              {roiLabel}
            </Text>
          </View>
        </View>
        <View style={pc.divider} />
        <View style={pc.progSection}>
          <View style={pc.progLabelRow}>
            <View style={pc.progLabelLeft}>
              <MaterialCommunityIcons
                name={"chart-line" as MCIcon}
                size={14}
                color={T.inkMuted}
              />
              <Text style={pc.progLabel}>Funding Progress</Text>
            </View>
            <View style={[pc.pctBadge, { backgroundColor: barColor + "20" }]}>
              <Text style={[pc.pctText, { color: barColor }]}>
                {pct}% Funded
              </Text>
            </View>
          </View>
          <View style={pc.track}>
            <View
              style={[pc.fill, { width: `${pct}%`, backgroundColor: barColor }]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const pc = StyleSheet.create({
  card: {
    backgroundColor: T.white,
    marginHorizontal: SPACE.md,
    marginBottom: SPACE.md,
    borderRadius: 22,
    overflow: "hidden",
  },
  imgWrap: { height: 160, position: "relative" },
  img: { width: "100%", height: "100%" },
  statusPill: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: { fontSize: FONT.xs, fontWeight: "800", letterSpacing: 0.3 },
  body: { padding: SPACE.md },
  title: {
    fontSize: FONT.xl,
    fontWeight: "800",
    color: T.ink,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: SPACE.sm,
    flexWrap: "wrap",
  },
  metaText: { fontSize: FONT.sm, color: T.inkMuted, fontWeight: "600" },
  divider: { height: 1, backgroundColor: T.divider, marginVertical: SPACE.sm },
  financialRow: { flexDirection: "row", alignItems: "stretch" },
  finBox: { flex: 1 },
  finSep: { width: 1, backgroundColor: T.divider, marginHorizontal: SPACE.sm },
  finLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  finLabel: {
    fontSize: FONT.xs,
    fontWeight: "700",
    color: T.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  finValue: { fontSize: FONT.md, fontWeight: "800", color: T.ink },
  progSection: { gap: 8 },
  progLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progLabelLeft: { flexDirection: "row", alignItems: "center", gap: 5 },
  progLabel: { fontSize: FONT.sm, fontWeight: "700", color: T.inkMuted },
  pctBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10 },
  pctText: { fontSize: FONT.sm, fontWeight: "900" },
  track: {
    height: 10,
    backgroundColor: T.divider,
    borderRadius: 5,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 5 },
});

function EmptyState({
  filter,
  onCreatePress,
}: {
  filter: string;
  onCreatePress: () => void;
}) {
  let icon: MCIcon = "tractor";
  let title = "No Farm Projects Yet";
  let sub = "Start your first crop funding campaign.";

  if (filter === "Active") {
    icon = "sprout";
    title = "No Active Projects";
    sub = "Your funding campaigns will appear here.";
  } else if (filter === "Pending") {
    icon = "clock-outline";
    title = "No Pending Projects";
    sub = "Projects awaiting approval will show here.";
  }

  return (
    <View style={es.wrap}>
      <View style={es.iconRing}>
        <MaterialCommunityIcons name={icon} size={46} color={T.accent} />
      </View>
      <Text style={es.title}>{title}</Text>
      <Text style={es.sub}>{sub}</Text>
      <TouchableOpacity
        style={es.btn}
        onPress={onCreatePress}
        activeOpacity={0.85}
      >
        <Ionicons name={"add" as IonIcon} size={20} color={T.white} />
        <Text style={es.btnText}>Create New Project</Text>
      </TouchableOpacity>
    </View>
  );
}
const es = StyleSheet.create({
  wrap: { alignItems: "center", paddingTop: 60, paddingHorizontal: 40 },
  iconRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: T.accentPale,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACE.lg,
  },
  title: {
    fontSize: FONT.xl,
    fontWeight: "800",
    color: T.ink,
    marginBottom: 8,
    textAlign: "center",
  },
  sub: {
    fontSize: FONT.md,
    color: T.inkMuted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACE.xl,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: T.primary,
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 16,
  },
  btnText: { fontSize: FONT.md, fontWeight: "800", color: T.white },
});

export default function FarmerProjectsScreen() {
  const router = useRouter();

  // States
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ✅ 1. Fetch Projects using AsyncStorage
  const fetchProjects = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) return; // Wait until logged in

      // ⚠️ UPDATE THIS IP TO YOUR LAPTOP'S CURRENT WI-FI IP
      const API_URL = "http://172.20.10.6:8080";

      const res = await axios.get(
        `${API_URL}/api/farmer-project/list/${storedUserId}`,
      );
      setDbProjects(res.data || []);
    } catch (error) {
      console.error("Error fetching projects", error);
      Alert.alert("Network Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  }, []);

  const activeCount = dbProjects.filter((p) =>
    ["FUNDING", "IN_PROGRESS", "APPROVED"].includes(p.status),
  ).length;
  const pendingCount = dbProjects.filter(
    (p) => p.status === "PENDING_REVIEW",
  ).length;
  const totalRaised = dbProjects.reduce(
    (s, p) => s + (p.currentFundingAmount || 0),
    0,
  );

  const displayed = dbProjects.filter((p) => {
    const title = p.projectTitle || "";
    const matchSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const isActive = ["FUNDING", "IN_PROGRESS", "APPROVED"].includes(p.status);
    const matchFilter =
      filter === "Active" ? isActive : filter === "Pending" ? !isActive : true;
    return matchSearch && matchFilter;
  });

  return (
    <View style={ms.root}>
      <StatusBar barStyle="light-content" backgroundColor={T.primary} />
      <View style={ms.header}>
        <View style={ms.arc} />
        <Text style={ms.hTitle}>My Farm Projects</Text>
        <Text style={ms.hSub}>Track your crop funding campaigns</Text>

        <View style={ms.summaryRow}>
          <View style={ms.summaryBox}>
            <MaterialCommunityIcons
              name={"sprout" as MCIcon}
              size={18}
              color={T.accent}
            />
            {loading && !refreshing ? (
              <ActivityIndicator size="small" color={T.white} />
            ) : (
              <Text style={ms.sumValue}>{activeCount}</Text>
            )}
            <Text style={ms.sumLabel}>Active</Text>
          </View>
          <View style={ms.sumDivider} />
          <View style={ms.summaryBox}>
            <MaterialCommunityIcons
              name={"currency-usd" as MCIcon}
              size={18}
              color={T.accent}
            />
            {loading && !refreshing ? (
              <ActivityIndicator size="small" color={T.white} />
            ) : (
              <Text style={ms.sumValue}>
                {(totalRaised / 1000).toFixed(0)}k
              </Text>
            )}
            <Text style={ms.sumLabel}>LKR Raised</Text>
          </View>
          <View style={ms.sumDivider} />
          <View style={ms.summaryBox}>
            <MaterialCommunityIcons
              name={"clock-outline" as MCIcon}
              size={18}
              color={T.amber}
            />
            {loading && !refreshing ? (
              <ActivityIndicator size="small" color={T.white} />
            ) : (
              <Text
                style={[ms.sumValue, pendingCount > 0 && { color: T.amber }]}
              >
                {pendingCount}
              </Text>
            )}
            <Text style={ms.sumLabel}>Pending</Text>
          </View>
        </View>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      <ScrollView
        contentContainerStyle={ms.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={T.primary}
            colors={[T.primary]}
          />
        }
      >
        <View style={{ marginTop: SPACE.md, marginBottom: SPACE.sm }}>
          <FilterTabs active={filter} onChange={setFilter} />
        </View>

        {!loading && displayed.length > 0 && (
          <Text style={ms.resultCount}>
            {displayed.length} project{displayed.length !== 1 ? "s" : ""} found
          </Text>
        )}

        {loading && !refreshing ? (
          <ActivityIndicator
            size="large"
            color={T.primary}
            style={{ marginTop: 40 }}
          />
        ) : displayed.length === 0 ? (
          <EmptyState
            filter={filter}
            onCreatePress={() => router.push("/project/create" as any)}
          />
        ) : (
          displayed.map((p) => <ProjectCard key={p.id} project={p} />)
        )}
      </ScrollView>

      {displayed.length > 0 && (
        <TouchableOpacity
          style={[ms.fab, SH.fab]}
          onPress={() => router.push("/project/create" as any)}
          activeOpacity={0.85}
        >
          <Ionicons name={"add" as IonIcon} size={26} color={T.white} />
          <Text style={ms.fabLabel}>New Project</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const ms = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.surface },
  scroll: { paddingBottom: 130 },
  header: {
    backgroundColor: T.primary,
    paddingTop: 58,
    paddingHorizontal: SPACE.md,
    paddingBottom: SPACE.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    gap: SPACE.sm,
  },
  arc: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: T.primaryMid,
    opacity: 0.25,
    top: -120,
    right: -60,
  },
  hTitle: {
    fontSize: FONT.xxl,
    fontWeight: "900",
    color: T.white,
    letterSpacing: 0.2,
  },
  hSub: { fontSize: FONT.md, color: "rgba(255,255,255,0.75)", marginBottom: 4 },
  summaryRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 18,
    paddingVertical: SPACE.sm,
    paddingHorizontal: SPACE.sm,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  summaryBox: { flex: 1, alignItems: "center", gap: 3 },
  sumDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
  sumValue: { fontSize: FONT.xl, fontWeight: "900", color: T.white },
  sumLabel: {
    fontSize: FONT.xs,
    fontWeight: "700",
    color: "rgba(255,255,255,0.65)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  resultCount: {
    fontSize: FONT.sm,
    fontWeight: "700",
    color: T.inkMuted,
    paddingHorizontal: SPACE.md,
    marginBottom: 4,
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: SPACE.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: T.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 32,
    zIndex: 100,
  },
  fabLabel: { fontSize: FONT.md, fontWeight: "800", color: T.white },
});
