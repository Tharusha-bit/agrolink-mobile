import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { ComponentProps } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// ICON TYPES
// ─────────────────────────────────────────────────────────────────────────────
type MCIcon  = ComponentProps<typeof MaterialCommunityIcons>['name'];
type IonIcon = ComponentProps<typeof Ionicons>['name'];

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  primary:     '#216000',
  primaryMid:  '#2E8B00',
  primaryPale: '#E8F5E1',
  accent:      '#76C442',
  accentPale:  '#F0FAE8',
  surface:     '#F7F9F4',
  white:       '#FFFFFF',
  ink:         '#1A2E0D',
  inkSub:      '#4A6741',
  inkMuted:    '#9BB08A',
  border:      '#DDE8D4',
  divider:     '#EEF5E8',
  gold:        '#F59E0B',
  goldPale:    '#FEF3C7',
  blue:        '#1565C0',
  bluePale:    '#E3F2FD',
  red:         '#C62828',
  redPale:     '#FFEBEE',
};

const SH = {
  sm: Platform.select({
    ios:     { shadowColor: '#1A2E0D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6  },
    android: { elevation: 2 },
  }),
  md: Platform.select({
    ios:     { shadowColor: '#1A2E0D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 12 },
    android: { elevation: 4 },
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
interface WeekBar { week: string; value: number }
const FUNDING_WEEKS: WeekBar[] = [
  { week: 'W1', value: 22 },
  { week: 'W2', value: 38 },
  { week: 'W3', value: 31 },
  { week: 'W4', value: 55 },
  { week: 'W5', value: 48 },
  { week: 'W6', value: 72 },  // latest — highlighted
];

interface MetricItem {
  icon:    MCIcon;
  value:   string;
  label:   string;
  sub:     string;
  color:   string;
  bg:      string;
  trend?:  string;
  trendUp?: boolean;
}

const METRICS: MetricItem[] = [
  { icon: 'eye-outline',          value: '1,247', label: 'Project Views',       sub: 'Unique investor visits',     color: C.blue,    bg: C.bluePale,    trend: '+18%',  trendUp: true  },
  { icon: 'heart-outline',        value: '84',    label: 'Project Saves',       sub: 'Saved to watchlists',        color: '#C62828', bg: '#FFEBEE',     trend: '+6%',   trendUp: true  },
  { icon: 'account-star-outline', value: '12',    label: 'Investor Interest',   sub: 'Enquiries this week',        color: C.primary, bg: C.primaryPale, trend: '+3',    trendUp: true  },
  { icon: 'share-variant-outline',value: '29',    label: 'Shares',              sub: 'Shared via social & link',   color: '#6A1B9A', bg: '#F3E5F5',     trend: '+5',    trendUp: true  },
  { icon: 'clock-outline',        value: '3m 12s',label: 'Avg. Time on Page',   sub: 'Time investors spent',       color: C.gold,    bg: C.goldPale,    trend: '+22s',  trendUp: true  },
  { icon: 'cash-multiple',        value: 'LKR 48k',label: 'Total Raised',       sub: 'Out of LKR 60k goal',        color: C.accent,  bg: C.accentPale,  trend: '80%',   trendUp: true  },
];

interface ActivityItem { icon: MCIcon; label: string; time: string; color: string }
const RECENT_ACTIVITY: ActivityItem[] = [
  { icon: 'account-plus-outline', label: 'Dr. Perera invested LKR 10,000',    time: '2h ago',  color: C.primary },
  { icon: 'eye-outline',          label: 'InvestCorp viewed your project',     time: '4h ago',  color: C.blue    },
  { icon: 'heart-outline',        label: 'Nirosha saved your project',         time: '1d ago',  color: C.red     },
  { icon: 'share-variant-outline',label: 'Project shared 3 times today',       time: '1d ago',  color: '#6A1B9A' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Section header */
function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={sh.wrap}>
      <Text style={sh.title}>{title}</Text>
      {sub && <Text style={sh.sub}>{sub}</Text>}
    </View>
  );
}
const sh = StyleSheet.create({
  wrap:  { marginBottom: 12 },
  title: { fontSize: 13, fontWeight: '800', color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 1.3 },
  sub:   { fontSize: 12, color: C.inkMuted, marginTop: 2 },
});

/** Bar chart */
function FundingChart({ data }: { data: WeekBar[] }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <View style={fc.wrap}>
      <View style={fc.chart}>
        {data.map((d, i) => {
          const isLatest = i === data.length - 1;
          const heightPct = (d.value / max) * 100;
          return (
            <View key={d.week} style={fc.col}>
              <View style={fc.barOuter}>
                <View
                  style={[
                    fc.bar,
                    {
                      height: `${heightPct}%`,
                      backgroundColor: isLatest ? C.accent : C.primaryPale,
                      borderColor:     isLatest ? C.primary : C.border,
                    },
                  ]}
                />
              </View>
              {/* Value label on latest bar */}
              {isLatest && (
                <View style={fc.valuePill}>
                  <Text style={fc.valueText}>{d.value}k</Text>
                </View>
              )}
              <Text style={[fc.weekLabel, isLatest && { color: C.primary, fontWeight: '800' }]}>
                {d.week}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Baseline */}
      <View style={fc.baseline} />

      {/* Trend footer */}
      <View style={fc.footer}>
        <MaterialCommunityIcons name={'trending-up' as MCIcon} size={14} color={C.accent} />
        <Text style={fc.footerText}>+15% funding growth vs last week</Text>
      </View>
    </View>
  );
}
const fc = StyleSheet.create({
  wrap:       { gap: 8 },
  chart:      { flexDirection: 'row', alignItems: 'flex-end', height: 130, gap: 6 },
  col:        { flex: 1, alignItems: 'center', gap: 4, height: '100%', position: 'relative' },
  barOuter:   { flex: 1, width: '100%', justifyContent: 'flex-end' },
  bar:        { width: '100%', borderRadius: 7, borderWidth: 1.5, minHeight: 6 },
  valuePill:  { position: 'absolute', top: -22, backgroundColor: C.primary, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 8 },
  valueText:  { fontSize: 9, fontWeight: '900', color: C.white },
  weekLabel:  { fontSize: 10, fontWeight: '600', color: C.inkMuted },
  baseline:   { height: 1.5, backgroundColor: C.border },
  footer:     { flexDirection: 'row', alignItems: 'center', gap: 5, paddingTop: 4 },
  footerText: { fontSize: 12, fontWeight: '700', color: C.accent },
});

/** Metric card (2-column grid) */
function MetricCard({ item }: { item: MetricItem }) {
  return (
    <View style={[mc.card, SH.sm]}>
      <View style={mc.top}>
        <View style={[mc.iconBox, { backgroundColor: item.bg }]}>
          <MaterialCommunityIcons name={item.icon} size={20} color={item.color} />
        </View>
        {item.trend && (
          <View style={[mc.trendPill, { backgroundColor: item.trendUp ? C.accentPale : C.redPale }]}>
            <MaterialCommunityIcons
              name={(item.trendUp ? 'trending-up' : 'trending-down') as MCIcon}
              size={11}
              color={item.trendUp ? C.accent : C.red}
            />
            <Text style={[mc.trendText, { color: item.trendUp ? C.primary : C.red }]}>
              {item.trend}
            </Text>
          </View>
        )}
      </View>
      <Text style={mc.value}>{item.value}</Text>
      <Text style={mc.label}>{item.label}</Text>
      <Text style={mc.sub}>{item.sub}</Text>
    </View>
  );
}
const mc = StyleSheet.create({
  card:      { flex: 1, backgroundColor: C.white, borderRadius: 18, padding: 14, gap: 5 },
  top:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  iconBox:   { width: 38, height: 38, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  trendPill: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 14 },
  trendText: { fontSize: 10, fontWeight: '800' },
  value:     { fontSize: 20, fontWeight: '900', color: C.ink },
  label:     { fontSize: 13, fontWeight: '700', color: C.inkSub },
  sub:       { fontSize: 11, color: C.inkMuted },
});

/** Activity row */
function ActivityRow({ item, last }: { item: ActivityItem; last: boolean }) {
  return (
    <>
      <View style={ar.row}>
        <View style={[ar.iconBox, { backgroundColor: item.color + '18' }]}>
          <MaterialCommunityIcons name={item.icon} size={18} color={item.color} />
        </View>
        <Text style={ar.label}>{item.label}</Text>
        <Text style={ar.time}>{item.time}</Text>
      </View>
      {!last && <View style={ar.div} />}
    </>
  );
}
const ar = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, gap: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  label:   { flex: 1, fontSize: 13, fontWeight: '600', color: C.ink },
  time:    { fontSize: 11, color: C.inkMuted },
  div:     { height: 1, backgroundColor: C.divider },
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function AnalyticsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  function handleBack() {
    if (id) router.push(`/farmer/project-manage/${id}` as any);
    else     router.back();
  }

  const backIcon: IonIcon = 'arrow-back';
  const chartIcon: MCIcon = 'chart-bar';

  return (
    <View style={ms.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* ── HEADER ── */}
      <View style={ms.header}>
        <View style={ms.arc} />
        <View style={ms.topNav}>
          <TouchableOpacity
            onPress={handleBack}
            style={ms.navBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name={backIcon} size={22} color={C.white} />
          </TouchableOpacity>

          <Text style={ms.hTitle}>Project Analytics</Text>

          <View style={[ms.navBtn, { backgroundColor: 'transparent' }]}>
            <MaterialCommunityIcons name={chartIcon} size={20} color="rgba(255,255,255,0.6)" />
          </View>
        </View>
        <Text style={ms.hSub}>Funding performance & engagement overview</Text>
      </View>

      {/* ── SCROLL BODY ── */}
      <ScrollView
        contentContainerStyle={ms.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── FUNDING CHART ── */}
        <SectionHead title="Funding Performance" sub="Weekly investor contributions (LKR thousands)" />
        <View style={[ms.card, SH.md, { marginBottom: 24 }]}>
          <FundingChart data={FUNDING_WEEKS} />
        </View>

        {/* ── METRICS GRID ── */}
        <SectionHead title="Engagement Metrics" sub="How investors are interacting with your project" />
        <View style={ms.metricsGrid}>
          {METRICS.map((m, i) => (
            <React.Fragment key={m.label}>
              <MetricCard item={m} />
              {/* Force 2-column wrap every 2 items */}
              {i % 2 === 1 && i < METRICS.length - 1 && (
                <View style={{ width: '100%', height: 10 }} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* ── RECENT ACTIVITY ── */}
        <View style={{ marginTop: 24 }}>
          <SectionHead title="Recent Activity" sub="Latest investor interactions on your project" />
          <View style={[ms.card, SH.sm]}>
            {RECENT_ACTIVITY.map((a, i) => (
              <ActivityRow key={a.label} item={a} last={i === RECENT_ACTIVITY.length - 1} />
            ))}
          </View>
        </View>

        {/* ── SUMMARY STRIP ── */}
        <View style={[ms.summaryStrip, SH.sm]}>
          <View style={ms.summaryItem}>
            <Text style={ms.summaryVal}>80%</Text>
            <Text style={ms.summaryLabel}>Funded</Text>
          </View>
          <View style={ms.summaryDivider} />
          <View style={ms.summaryItem}>
            <Text style={ms.summaryVal}>6 wks</Text>
            <Text style={ms.summaryLabel}>Active</Text>
          </View>
          <View style={ms.summaryDivider} />
          <View style={ms.summaryItem}>
            <Text style={[ms.summaryVal, { color: C.accent }]}>On Track</Text>
            <Text style={ms.summaryLabel}>Status</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const ms = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.surface },
  scroll: { padding: 16, paddingBottom: 140 },

  // Header
  header: {
    backgroundColor: C.primary,
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    gap: 8,
    marginBottom: 20,
  },
  arc:     { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: C.primaryMid, opacity: 0.25, top: -100, right: -50 },
  topNav:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navBtn:  { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.16)', justifyContent: 'center', alignItems: 'center' },
  hTitle:  { fontSize: 18, fontWeight: '800', color: C.white, letterSpacing: 0.2 },
  hSub:    { fontSize: 12, color: 'rgba(255,255,255,0.65)' },

  // Card
  card: { backgroundColor: C.white, borderRadius: 20, padding: 16 },

  // Metrics 2-col grid
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  // Summary strip
  summaryStrip: {
    flexDirection: 'row',
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
  },
  summaryItem:    { flex: 1, alignItems: 'center', gap: 4 },
  summaryDivider: { width: 1, backgroundColor: C.divider },
  summaryVal:     { fontSize: 18, fontWeight: '900', color: C.ink },
  summaryLabel:   { fontSize: 10, fontWeight: '700', color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 0.6 },
});