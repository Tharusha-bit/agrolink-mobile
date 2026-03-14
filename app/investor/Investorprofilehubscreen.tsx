/**
 * AgroLink — InvestorDashboardScreen
 * "Agricultural Wealth Control Centre"
 *
 * Design Direction: Clean, airy, dashboard-first investor screen.
 * Rich AgroLink green (#216000) header with cream-white body, gold micro-accents,
 * floating KPI cards, and a timeline activity feed. Feels like a premium
 * agri-fintech platform — Bloomberg clarity, farm-brand warmth.
 *
 * Architecture:
 *  - Sparkline        — pure-View mini bar charts, no external lib
 *  - KpiCard          — floating metric card with delta pill + sparkline
 *  - ActionCard       — 2×2 grid or scrollable CTA card
 *  - TimelineRow      — vertical-spine activity feed item
 *  - StrengthSegment  — segmented green completion bar with tip chip
 *  - SectionLabel     — uppercase section header with optional action link
 */

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  // Primary AgroLink greens
  forest: "#216000",
  forestMid: "#2A7A00",
  forestLight: "#3A9900",
  forestPale: "#E8F5E1",
  forestGhost: "#F2FAF0",

  // Gold accent (trust, premium)
  gold: "#C9A84C",
  goldPale: "#FDF6E3",

  // Semantic
  gain: "#2E8B57",
  gainBg: "#EAF7F0",
  pending: "#D4900A",
  pendingBg: "#FFF8E6",
  loss: "#C0392B",
  lossBg: "#FDECEB",
  info: "#2471A3",
  infoBg: "#EBF5FB",

  // Neutrals
  white: "#FFFFFF",
  surface: "#F8FBF7",
  cardBg: "#FFFFFF",
  border: "#DCE8D5",
  borderLight: "#EDF5E8",
  text: "#1A2E0D",
  textSub: "#4A6B3A",
  textMuted: "#8FA882",
};

const SH = {
  xs: Platform.select({
    ios: {
      shadowColor: "#216000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
    },
    android: { elevation: 2 },
  }),
  sm: Platform.select({
    ios: {
      shadowColor: "#216000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#216000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.14,
      shadowRadius: 20,
    },
    android: { elevation: 8 },
  }),
};

// ─── Sparkline ─────────────────────────────────────────────────────────────────
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  return (
    <View style={sl.wrap}>
      {data.map((v, i) => (
        <View
          key={i}
          style={[
            sl.bar,
            {
              height: Math.max(3, (v / max) * 28),
              backgroundColor: color,
              opacity:
                i === data.length - 1 ? 1 : 0.3 + (i / data.length) * 0.5,
            },
          ]}
        />
      ))}
    </View>
  );
};
const sl = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "flex-end", gap: 3, height: 32 },
  bar: { width: 5, borderRadius: 3 },
});

// ─── KPI Card ──────────────────────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  delta: string;
  positive: boolean;
  sparkData: number[];
  icon: string;
  iconColor?: string;
}

const KpiCard = ({
  label,
  value,
  unit,
  delta,
  positive,
  sparkData,
  icon,
  iconColor,
}: KpiCardProps) => {
  const dc = positive ? C.gain : C.loss;
  const iconBg = (iconColor ?? C.forest) + "18";

  return (
    <View style={[kpi.card, SH.sm]}>
      {/* Icon + label row */}
      <View style={kpi.topRow}>
        <View style={[kpi.iconBox, { backgroundColor: iconBg }]}>
          <MaterialCommunityIcons
            name={icon as any}
            size={18}
            color={iconColor ?? C.forest}
          />
        </View>
        <Text style={kpi.label}>{label}</Text>
      </View>

      {/* Value */}
      <View style={kpi.valueRow}>
        {unit ? <Text style={kpi.unit}>{unit} </Text> : null}
        <Text style={kpi.value}>{value}</Text>
      </View>

      {/* Footer: delta + sparkline */}
      <View style={kpi.footer}>
        <View style={[kpi.deltaPill, { backgroundColor: dc + "15" }]}>
          <MaterialCommunityIcons
            name={positive ? "trending-up" : "trending-down"}
            size={11}
            color={dc}
          />
          <Text style={[kpi.deltaText, { color: dc }]}>{delta}</Text>
        </View>
        <Sparkline data={sparkData} color={dc} />
      </View>
    </View>
  );
};

const kpi = StyleSheet.create({
  card: {
    backgroundColor: C.cardBg,
    borderRadius: 22,
    padding: 18,
    width: 168,
    marginRight: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: C.textMuted,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    flex: 1,
  },
  valueRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 12 },
  unit: { fontSize: 13, fontWeight: "700", color: C.textSub },
  value: { fontSize: 28, fontWeight: "900", color: C.text, letterSpacing: -1 },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  deltaPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  deltaText: { fontSize: 11, fontWeight: "800" },
});

// ─── Action Card (2×2 grid item) ───────────────────────────────────────────────
interface ActionCardProps {
  icon: string;
  label: string;
  sublabel: string;
  iconBg: string;
  iconColor: string;
  primary?: boolean;
  onPress: () => void;
}

const ActionCard = ({
  icon,
  label,
  sublabel,
  iconBg,
  iconColor,
  primary = false,
  onPress,
}: ActionCardProps) => (
  <TouchableOpacity
    style={[ac.card, primary && ac.cardPrimary, SH.sm]}
    onPress={onPress}
    activeOpacity={0.78}
  >
    <View
      style={[
        ac.iconWrap,
        { backgroundColor: primary ? "rgba(255,255,255,0.22)" : iconBg },
      ]}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={24}
        color={primary ? C.white : iconColor}
      />
    </View>
    <Text style={[ac.label, primary && ac.labelPrimary]}>{label}</Text>
    <Text
      style={[ac.sublabel, primary && ac.sublabelPrimary]}
      numberOfLines={2}
    >
      {sublabel}
    </Text>
  </TouchableOpacity>
);

const ac = StyleSheet.create({
  card: {
    backgroundColor: C.cardBg,
    borderRadius: 20,
    padding: 18,
    flex: 1,
    minHeight: 130,
  },
  cardPrimary: { backgroundColor: C.forest },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  label: { fontSize: 14, fontWeight: "800", color: C.text, marginBottom: 4 },
  labelPrimary: { color: C.white },
  sublabel: { fontSize: 11.5, color: C.textMuted, lineHeight: 16 },
  sublabelPrimary: { color: "rgba(255,255,255,0.65)" },
});

// ─── Timeline Activity Row ─────────────────────────────────────────────────────
interface TimelineRowProps {
  icon: string;
  dotColor: string;
  title: string;
  subtitle: string;
  time: string;
  amount?: string;
  amountPositive?: boolean;
  isLast?: boolean;
}

const TimelineRow = ({
  icon,
  dotColor,
  title,
  subtitle,
  time,
  amount,
  amountPositive,
  isLast = false,
}: TimelineRowProps) => (
  <View style={tr.wrap}>
    {/* Spine */}
    <View style={tr.spine}>
      <View
        style={[
          tr.dot,
          {
            backgroundColor: dotColor + "18",
            borderWidth: 2,
            borderColor: dotColor,
          },
        ]}
      >
        <MaterialCommunityIcons name={icon as any} size={13} color={dotColor} />
      </View>
      {!isLast && <View style={tr.line} />}
    </View>

    {/* Content */}
    <View style={tr.body}>
      <View style={tr.topRow}>
        <Text style={tr.title} numberOfLines={1}>
          {title}
        </Text>
        {amount && (
          <Text
            style={[tr.amount, { color: amountPositive ? C.gain : C.loss }]}
          >
            {amount}
          </Text>
        )}
      </View>
      <Text style={tr.subtitle}>{subtitle}</Text>
      <Text style={tr.time}>{time}</Text>
    </View>
  </View>
);

const tr = StyleSheet.create({
  wrap: { flexDirection: "row", paddingHorizontal: 20 },
  spine: { width: 32, alignItems: "center", paddingTop: 2 },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: C.borderLight,
    marginTop: 5,
    minHeight: 22,
  },
  body: { flex: 1, paddingLeft: 14, paddingBottom: 20 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  title: {
    fontSize: 13.5,
    fontWeight: "700",
    color: C.text,
    flex: 1,
    marginRight: 8,
  },
  amount: { fontSize: 13, fontWeight: "800" },
  subtitle: { fontSize: 12, color: C.textSub, lineHeight: 17, marginBottom: 3 },
  time: { fontSize: 11, color: C.textMuted, fontWeight: "500" },
});

// ─── Section Label ─────────────────────────────────────────────────────────────
const SectionLabel = ({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) => (
  <View style={lbl.row}>
    <View style={lbl.leftGroup}>
      <View style={lbl.pill} />
      <Text style={lbl.title}>{title}</Text>
    </View>
    {action && (
      <TouchableOpacity onPress={onAction}>
        <Text style={lbl.action}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const lbl = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 14,
  },
  leftGroup: { flexDirection: "row", alignItems: "center" },
  pill: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: C.gold,
    marginRight: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: "900",
    color: C.textSub,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  action: { fontSize: 12, fontWeight: "700", color: C.forest },
});

// ─── Strength Bar ──────────────────────────────────────────────────────────────
const StrengthBar = ({ percent }: { percent: number }) => {
  const STEPS = 5;
  const filled = Math.round((percent / 100) * STEPS);
  const color = percent < 40 ? C.loss : percent < 70 ? C.pending : C.gain;
  const label =
    percent < 40
      ? "Needs work"
      : percent < 70
        ? "Getting there"
        : "Looking great!";
  const TIPS = [
    "Upload photo",
    "Verify NIC",
    "Link bank",
    "Add skills",
    "Full address",
  ];
  const nextTip = TIPS[filled] ?? null;

  return (
    <View style={str.wrap}>
      <View style={str.topRow}>
        <Text style={str.title}>Profile Strength</Text>
        <View style={[str.badge, { backgroundColor: color + "18" }]}>
          <Text style={[str.badgeText, { color }]}>
            {label} · {percent}%
          </Text>
        </View>
      </View>
      {/* Segmented steps */}
      <View style={str.segRow}>
        {Array.from({ length: STEPS }).map((_, i) => (
          <View
            key={i}
            style={[
              str.seg,
              i < filled
                ? { backgroundColor: C.forest }
                : { backgroundColor: C.borderLight },
              i < STEPS - 1 && { marginRight: 5 },
            ]}
          />
        ))}
      </View>
      {nextTip && (
        <View style={str.tipChip}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={12}
            color={C.gold}
          />
          <Text style={str.tipText}>
            Next step:{" "}
            <Text style={{ fontWeight: "700", color: C.forest }}>
              {nextTip}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
};

const str = StyleSheet.create({
  wrap: {},
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 13, fontWeight: "700", color: C.textSub },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11.5, fontWeight: "700" },
  segRow: { flexDirection: "row", marginBottom: 10 },
  seg: { flex: 1, height: 7, borderRadius: 3 },
  tipChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.forestGhost,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: C.border,
  },
  tipText: { fontSize: 12, color: C.textMuted },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const KPI_DATA: KpiCardProps[] = [
  {
    label: "Portfolio",
    value: "2.4M",
    unit: "LKR",
    delta: "+8.2%",
    positive: true,
    sparkData: [55, 60, 58, 70, 68, 80, 95],
    icon: "cash-multiple",
    iconColor: C.forest,
  },
  {
    label: "Avg Return",
    value: "18.4",
    unit: "%",
    delta: "+2.1%",
    positive: true,
    sparkData: [38, 44, 42, 52, 56, 62, 68],
    icon: "trending-up",
    iconColor: C.gain,
  },
  {
    label: "Investments",
    value: "6",
    unit: "",
    delta: "-1",
    positive: false,
    sparkData: [8, 7, 9, 8, 7, 7, 6],
    icon: "sprout",
    iconColor: C.pending,
  },
  {
    label: "Trust Score",
    value: "4.8",
    unit: "★",
    delta: "+0.2",
    positive: true,
    sparkData: [4.2, 4.3, 4.5, 4.5, 4.6, 4.7, 4.8],
    icon: "shield-star",
    iconColor: C.gold,
  },
];

const ACTIVITIES: TimelineRowProps[] = [
  {
    icon: "cash-plus",
    dotColor: C.gain,
    title: "Return Credited",
    subtitle: "Suriyakumar Paddy Farm — Season 2",
    time: "2 hrs ago",
    amount: "+LKR 14,000",
    amountPositive: true,
  },
  {
    icon: "sprout",
    dotColor: C.pending,
    title: "New Opportunity",
    subtitle: "Priya Devi Organic Vegetables, Jaffna",
    time: "Yesterday",
    amount: "LKR 30,000",
    amountPositive: false,
  },
  {
    icon: "alert-outline",
    dotColor: C.pending,
    title: "Weather Alert",
    subtitle: "Monsoon risk flagged for North Province",
    time: "2 days ago",
  },
  {
    icon: "shield-check",
    dotColor: C.info,
    title: "Identity Verified",
    subtitle: "NIC confirmed by AgroLink trust system",
    time: "3 days ago",
  },
  {
    icon: "bank-transfer-out",
    dotColor: C.loss,
    title: "Withdrawal Processing",
    subtitle: "LKR 50,000 to Commercial Bank — pending",
    time: "4 days ago",
    amount: "-LKR 50,000",
    amountPositive: false,
  },
];

export default function InvestorDashboardScreen() {
  const router = useRouter();

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.forest} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        {/*
          Curved AgroLink-green header.
          - Decorative concentric rings (top-right) replace heavy gradient libraries
          - Portfolio value displayed prominently inside the header — the most
            important number for an investor, visible before any scrolling
          - Avatar left, identity + portfolio right for a premium dashboard layout
        */}
        <View style={s.header}>
          {/* Decorative rings — pure View, no SVG */}
          <View style={s.ring1} />
          <View style={s.ring2} />
          <View style={s.ring3} />

          {/* Nav bar */}
          <View style={s.nav}>
            <TouchableOpacity
              style={s.navBtn}
              onPress={() => router.replace("/investor/home")}
            >
              <Ionicons name="arrow-back" size={18} color={C.forest} />
            </TouchableOpacity>
            <Text style={s.navTitle}>INVESTOR HUB</Text>
            <TouchableOpacity style={s.navBtn}>
              <Ionicons
                name="notifications-outline"
                size={18}
                color={C.forest}
              />
              <View style={s.notifDot} />
            </TouchableOpacity>
          </View>

          {/* Identity + portfolio value */}
          <View style={s.identityRow}>
            {/* Avatar */}
            <TouchableOpacity
              style={s.avatarWrap}
              activeOpacity={0.85}
              onPress={() => router.push("/investor/profile")}
            >
              <View style={s.avatarRing}>
                <View style={s.avatarCircle}>
                  <MaterialCommunityIcons
                    name="account"
                    size={42}
                    color={C.forest}
                  />
                </View>
              </View>
              {/* Verified badge */}
              <View style={s.verifiedBadge}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={16}
                  color={C.gold}
                />
              </View>
              {/* Camera dot */}
              <TouchableOpacity style={s.camDot}>
                <Ionicons name="camera" size={10} color={C.white} />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Name + portfolio block */}
            <View style={s.identityBlock}>
              <Text style={s.greeting}>Good morning 🌱</Text>
              <Text style={s.investorName}>W.T.P. Fernando</Text>
              <View style={s.rolePill}>
                <MaterialCommunityIcons
                  name="trending-up"
                  size={11}
                  color={C.gold}
                  style={{ marginRight: 4 }}
                />
                <Text style={s.roleText}>Senior Investor · ID 20321212</Text>
              </View>

              {/* Portfolio value hero */}
              <View style={s.portfolioHero}>
                <Text style={s.portfolioLabel}>Total Portfolio</Text>
                <Text style={s.portfolioValue}>LKR 2,400,000</Text>
                <View style={s.portfolioDelta}>
                  <MaterialCommunityIcons
                    name="trending-up"
                    size={12}
                    color={C.gain}
                  />
                  <Text style={s.portfolioDeltaText}>+8.2% this month</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── KPI CARDS ────────────────────────────────────────────────────── */}
        <View style={{ marginTop: 4 }}>
          <SectionLabel
            title="Portfolio Overview"
            action="Full report"
            onAction={() => {}}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.kpiStrip}
          >
            {KPI_DATA.map((k) => (
              <KpiCard key={k.label} {...k} />
            ))}
          </ScrollView>
        </View>

        {/* ── ACTION GRID ──────────────────────────────────────────────────── */}
        <SectionLabel title="Quick Actions" />
        <View style={s.actionGrid}>
          {/* Row 1 */}
          <View style={s.actionRow}>
            <ActionCard
              icon="seed-plus"
              label="Invest"
              sublabel="Browse new crop opportunities"
              iconBg={C.forestPale}
              iconColor={C.forest}
              primary
              onPress={() => router.push("/(tabs)/invest" as any)}
            />
            <View style={s.actionGap} />
            <ActionCard
              icon="chart-box-outline"
              label="Analyse"
              sublabel="Portfolio performance insights"
              iconBg={C.forestPale}
              iconColor={C.forest}
              onPress={() => {}}
            />
          </View>
          {/* Row 2 */}
          <View style={[s.actionRow, { marginTop: 12 }]}>
            <ActionCard
              icon="bank-transfer-out"
              label="Withdraw"
              sublabel="Transfer funds to your bank"
              iconBg={"#FFF8E6"}
              iconColor={C.pending}
              onPress={() => {}}
            />
            <View style={s.actionGap} />
            <ActionCard
              icon="file-chart-outline"
              label="Reports"
              sublabel="Statements & tax documents"
              iconBg={C.infoBg}
              iconColor={C.info}
              onPress={() => {}}
            />
          </View>
        </View>

        {/* ── ACTIVITY FEED ─────────────────────────────────────────────────── */}
        <SectionLabel
          title="Recent Activity"
          action="See all"
          onAction={() => {}}
        />
        <View style={[s.feedCard, SH.sm]}>
          {ACTIVITIES.map((item, idx) => (
            <TimelineRow
              key={idx}
              {...item}
              isLast={idx === ACTIVITIES.length - 1}
            />
          ))}
        </View>

        {/* ── PROFILE STRENGTH ─────────────────────────────────────────────── */}
        <SectionLabel
          title="Profile Strength"
          action="Improve"
          onAction={() => router.push("/profile/edit" as any)}
        />
        <View style={[s.strengthCard, SH.xs]}>
          <StrengthBar percent={40} />
        </View>

        {/* ── FOOTER ACTIONS ───────────────────────────────────────────────── */}
        <View style={s.footerRow}>
          <TouchableOpacity
            style={s.footerBtn}
            onPress={() => router.push("/profile/edit" as any)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={17}
              color={C.forest}
              style={{ marginRight: 7 }}
            />
            <Text style={s.footerBtnText}>Edit Profile</Text>
          </TouchableOpacity>
          <View style={s.footerGap} />
          <TouchableOpacity
            style={s.footerBtn}
            onPress={() => router.push("/profile/security")}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="shield-lock-outline"
              size={17}
              color={C.forest}
              style={{ marginRight: 7 }}
            />
            <Text style={s.footerBtnText}>Security</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },

  /* HEADER */
  header: {
    backgroundColor: C.forest,
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingHorizontal: 22,
    paddingBottom: 36,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
    position: "relative",
  },
  /* Decorative concentric rings (top-right) */
  ring1: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    top: -80,
    right: -80,
  },
  ring2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    top: -40,
    right: -40,
  },
  ring3: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -10,
    right: 10,
  },

  /* Nav */
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E74C3C",
    position: "absolute",
    top: 6,
    right: 6,
    borderWidth: 1.5,
    borderColor: C.forest,
  },
  navTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },

  /* Identity */
  identityRow: { flexDirection: "row", alignItems: "flex-start", gap: 16 },
  avatarWrap: { position: "relative", width: 78, height: 78, marginTop: 4 },
  avatarRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: C.forest,
    borderRadius: 12,
    padding: 2,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
  camDot: {
    position: "absolute",
    bottom: -2,
    left: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.forestMid,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: C.forest,
  },

  identityBlock: { flex: 1 },
  greeting: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
    marginBottom: 2,
  },
  investorName: {
    fontSize: 22,
    fontWeight: "900",
    color: C.white,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(201,168,76,0.2)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.35)",
    marginBottom: 14,
  },
  roleText: {
    fontSize: 10.5,
    color: C.gold,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  portfolioHero: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  portfolioLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  portfolioValue: {
    fontSize: 20,
    fontWeight: "900",
    color: C.white,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  portfolioDelta: { flexDirection: "row", alignItems: "center", gap: 4 },
  portfolioDeltaText: { fontSize: 11.5, fontWeight: "700", color: C.gain },

  /* KPI */
  kpiStrip: {
    paddingLeft: 20,
    paddingRight: 8,
    paddingBottom: 2,
    marginBottom: 24,
  },

  /* ACTION GRID */
  actionGrid: { marginHorizontal: 20, marginBottom: 24 },
  actionRow: { flexDirection: "row" },
  actionGap: { width: 12 },

  /* FEED */
  feedCard: {
    backgroundColor: C.cardBg,
    marginHorizontal: 20,
    borderRadius: 22,
    paddingTop: 20,
    paddingBottom: 4,
    marginBottom: 24,
  },

  /* STRENGTH */
  strengthCard: {
    backgroundColor: C.cardBg,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  /* FOOTER */
  footerRow: { flexDirection: "row", marginHorizontal: 20, marginBottom: 10 },
  footerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.cardBg,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    ...SH.xs,
  },
  footerGap: { width: 12 },
  footerBtnText: { fontSize: 13.5, fontWeight: "700", color: C.forest },
});
