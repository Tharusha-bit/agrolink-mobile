import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useProjects } from '../../src/context/ProjectContext'; 

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  primary:       '#1A5200',
  primaryMid:    '#216000',
  primaryLight:  '#2E8B00',
  primaryPale:   '#E8F5E1',
  surface:       '#F4F7F0',
  white:         '#FFFFFF',
  text:          '#1A2E0D',
  textSub:       '#4A6741',
  textMuted:     '#9BB08A',
  accent:        '#76C442',
  accentWarm:    '#F5A623',
  accentRed:     '#E53935',
  accentAmber:   '#FF8F00',
  gold:          '#D4A017',
  goldLight:     '#FFF8E1',
  card:          '#FFFFFF',
  border:        '#E2EDD9',
  shadow:        '#000',
};

const SHADOW = {
  sm: { elevation: 2, shadowColor: C.shadow, shadowOpacity: 0.06, shadowRadius: 4,  shadowOffset: { width: 0, height: 2 } },
  md: { elevation: 6, shadowColor: C.shadow, shadowOpacity: 0.10, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  lg: { elevation: 12, shadowColor: C.shadow, shadowOpacity: 0.15, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const RECENT_UPDATES =[
  { id: 1, icon: 'sprout',         color: C.accent,     label: 'Seedlings planted',        sub: 'Paddy field A – 2h ago' },
  { id: 2, icon: 'camera-outline', color: C.accentWarm, label: 'Harvest progress photo',   sub: 'Green Chilli Farm – 5h ago' },
  { id: 3, icon: 'water-pump',     color: '#2196F3',    label: 'Irrigation completed',      sub: 'North plot – Yesterday' },
];

const CHART_WEEKS =['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
const CHART_VALS  =[22, 38, 31, 55, 48, 72]; 

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, bg }: { icon: any; label: string; value: number | string; color: string; bg: string }) {
  return (
    <View style={[s.statCard, SHADOW.sm, { flex: 1 }]}>
      <View style={[s.statIconWrap, { backgroundColor: bg }]}>
        <MaterialCommunityIcons name={icon} size={18} color={color} />
      </View>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

function UpdateRow({ item }: any) {
  return (
    <View style={s.updateRow}>
      <View style={[s.updateIconWrap, { backgroundColor: item.color + '20' }]}>
        <MaterialCommunityIcons name={item.icon} size={20} color={item.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.updateLabel}>{item.label}</Text>
        <Text style={s.updateSub}>{item.sub}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={18} color={C.textMuted} />
    </View>
  );
}

function FundingChart({ weeks, vals }: { weeks: string[]; vals: number[] }) {
  const max = Math.max(...vals);
  return (
    <View style={s.chartInner}>
      {weeks.map((w, i) => (
        <View key={w} style={s.chartCol}>
          <View style={s.barWrap}>
            <View
              style={[
                s.bar,
                {
                  height: `${(vals[i] / max) * 100}%`,
                  backgroundColor: i === vals.length - 1 ? C.accent : C.primaryLight + '60',
                },
              ]}
            />
          </View>
          <Text style={s.chartLabel}>{w}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function FarmerDashboard() {
  const router   = useRouter();
  const { projects } = useProjects();
  const fabScale = useRef(new Animated.Value(1)).current;

  const myProjects  = projects.filter((p: any) => p.farmer.includes('Me') || p.farmer.includes('Suriyakumar'));
  const totalRaised = myProjects.reduce((sum: number, p: any) => sum + p.raised, 0);
  const totalInvestors = myProjects.reduce((sum: number, p: any) => sum + (p.investors?.length || 0), 0);

  const pressFab = () => {
    Animated.sequence([
      Animated.spring(fabScale, { toValue: 0.88, useNativeDriver: true }),
      Animated.spring(fabScale, { toValue: 1,    useNativeDriver: true }),
    ]).start(() => {
      router.push('/project/create') 
    }); 
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.primaryMid} />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* ── HEADER ── */}
        <View style={s.header}>
          <View style={s.blob1} />
          <View style={s.blob2} />

          <View style={s.topRow}>
            <View>
              <Text style={s.greeting}>Ayubowan, Suriyakumar 🙏</Text>
              <Text style={s.dateLine}>Your harvest funding overview</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/farmer/profile')}>
              <View style={s.avatar}>
                <MaterialCommunityIcons name="account" size={28} color={C.primary} />
              </View>
            </TouchableOpacity>
          </View>

          {/* ── TOTAL FUNDS CARD ── */}
          <View style={s.balanceCard}>
            <Text style={s.balanceLabel}>Total Funds Raised</Text>
            <Text style={s.balanceValue}>LKR {totalRaised.toLocaleString()}</Text>
            <View style={s.balanceRow}>
              <View style={s.growBadge}>
                <MaterialCommunityIcons name="trending-up" size={11} color={C.white} />
                <Text style={s.growBadgeText}>+12% this week</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/farmer/projects')}>
                <Text style={[s.balanceSub, { textDecorationLine: 'underline' }]}>
                  Across {myProjects.length} active projects
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── TRUST SCORE CARD ── */}
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/farmer/trust')}>
            <View style={s.trustCard}>
              <View style={s.trustLeft}>
                <View style={s.shieldWrap}>
                  <MaterialCommunityIcons name="shield-check" size={26} color={C.gold} />
                </View>
                <View>
                  <Text style={s.trustBadgeText}>🏅 Gold Farmer</Text>
                  <Text style={s.trustSub}>Verified · 3 yrs on AgroLink</Text>
                </View>
              </View>
              <View style={s.trustRight}>
                <Text style={s.trustScore}>92%</Text>
                <Text style={s.trustScoreLabel}>Trust Score</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── QUICK ACTIONS ── */}
        <View style={s.actionGrid}>
          <TouchableOpacity style={[s.actionBtn, SHADOW.md]} onPress={pressFab}>
            <View style={[s.iconCircle, { backgroundColor: C.primaryPale }]}>
              <MaterialCommunityIcons name="plus-circle-outline" size={26} color={C.primary} />
            </View>
            <Text style={s.actionText}>Add Project</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.actionBtn, SHADOW.md]}>
            <View style={[s.iconCircle, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="camera-plus-outline" size={26} color={C.accentWarm} />
            </View>
            <Text style={s.actionText}>Post Update</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.actionBtn, SHADOW.md]}>
            <View style={[s.iconCircle, { backgroundColor: '#E3F2FD' }]}>
              <MaterialCommunityIcons name="chart-line" size={26} color="#1976D2" />
            </View>
            <Text style={s.actionText}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* ── STATS ROW ── */}
        <View style={s.statsRow}>
          <StatCard icon="folder-multiple-outline" label="Active Projects" value={myProjects.length}    color={C.primary}     bg={C.primaryPale} />
          <StatCard icon="account-group-outline"   label="Total Investors" value={totalInvestors}       color="#1976D2"       bg="#E3F2FD"       />
          <StatCard icon="leaf"                    label="Crop Health"     value="Good"                 color={C.accentWarm}  bg={C.goldLight}   />
        </View>

        {/* ── AI WEATHER RISK ALERT ── */}
        <View style={[s.weatherCard, SHADOW.sm]}>
          <View style={s.weatherLeft}>
            <View style={s.weatherIconWrap}>
              <MaterialCommunityIcons name="weather-lightning-rainy" size={26} color={C.white} />
            </View>
            <View>
              <View style={s.weatherTitleRow}>
                <Text style={s.weatherTitle}>AI Weather Risk Alert</Text>
                <View style={s.riskBadgeHigh}>
                  <Text style={s.riskBadgeText}>HIGH</Text>
                </View>
              </View>
              <Text style={s.weatherSub}>Heavy Rain · Anuradhapura District</Text>
              <Text style={s.weatherDetail}>Next 24 h · Protect crops, check drainage</Text>
            </View>
          </View>
        </View>

        {/* ── FUNDING GROWTH CHART ── */}
        <View style={[s.section, SHADOW.sm]}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Funding Growth</Text>
            <Text style={s.sectionPill}>Last 6 Weeks</Text>
          </View>
          <FundingChart weeks={CHART_WEEKS} vals={CHART_VALS} />
          <Text style={s.chartFooter}>LKR in thousands · Latest week highlighted</Text>
        </View>

        {/* ── MY ACTIVE PROJECTS ── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 12, marginTop: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: C.text }}>My Active Projects</Text>
            <TouchableOpacity onPress={() => router.push('/farmer/projects')}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: C.primaryLight }}>View All</Text>
            </TouchableOpacity>
        </View>

        {myProjects.length === 0 ? (
           <View style={{padding: 20, alignItems: 'center'}}>
             <Text style={{color: C.textMuted}}>No active projects found.</Text>
           </View>
        ) : (
          myProjects.map((p: any) => (
            <TouchableOpacity 
              key={p.id} 
              style={[s.projectCard, SHADOW.md]} 
              activeOpacity={0.85}
              onPress={() => router.push(`/farmer/project-manage/${p.id}`)}
            >
              <Image source={{ uri: p.image }} style={s.cardImg} />
              <View style={s.cardBody}>
                <Text style={s.cardTitle}>{p.title}</Text>
                <View style={s.progressRow}>
                  <View style={s.track}>
                    <View style={[s.fill, { width: `${p.progress * 100}%` }]} />
                  </View>
                  <Text style={s.progressText}>{Math.round(p.progress * 100)}%</Text>
                </View>
                <View style={s.cardMetaRow}>
                  <Text style={s.cardMeta}>LKR {p.raised.toLocaleString()}</Text>
                  <Text style={s.cardMetaGoal}> / {p.goal.toLocaleString()}</Text>
                </View>
              </View>
              <View style={s.cardChevron}>
                <MaterialCommunityIcons name="chevron-right" size={20} color={C.textMuted} />
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* ── RECENT FARM UPDATES ── */}
        <Text style={[s.headTitle, { marginLeft: 20, marginBottom: 12, marginTop: 10 }]}>Recent Farm Updates</Text>
        <View style={[s.section, SHADOW.sm]}>
          {RECENT_UPDATES.map((u, i) => (
            <View key={u.id}>
              <UpdateRow item={u} />
              {i < RECENT_UPDATES.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── FLOATING ACTION BUTTON ── */}
      <Animated.View style={[s.fab, SHADOW.lg, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity onPress={pressFab} style={s.fabInner} activeOpacity={1}>
          <MaterialCommunityIcons name="plus" size={30} color={C.white} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.surface },
  scroll: { paddingBottom: 20 },

  // Header
  header: {
    backgroundColor: C.primaryMid,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  blob1: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: C.primaryLight, top: -70, right: -60, opacity: 0.3 },
  blob2: { position: 'absolute', width: 120, height: 120, borderRadius: 60,  backgroundColor: C.accent,       bottom: -20, left: 30,  opacity: 0.12 },
  topRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 18, fontWeight: '800', color: C.white, letterSpacing: 0.2 },
  dateLine: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  avatar:   { width: 44, height: 44, borderRadius: 22, backgroundColor: C.white, justifyContent: 'center', alignItems: 'center' },

  // Balance card
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    marginBottom: 14,
  },
  balanceLabel: { color: '#C8E6C9', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2 },
  balanceValue: { color: C.white, fontSize: 34, fontWeight: '800', marginVertical: 6 },
  balanceRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  growBadge:    { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.accent, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  growBadgeText: { fontSize: 10, fontWeight: '700', color: C.white },
  balanceSub:   { color: 'rgba(255,255,255,0.75)', fontSize: 11 },

  // Trust Score card
  trustCard: {
    backgroundColor: C.goldLight,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: C.gold + '40',
  },
  trustLeft:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  shieldWrap:     { width: 44, height: 44, borderRadius: 22, backgroundColor: C.gold + '20', justifyContent: 'center', alignItems: 'center' },
  trustBadgeText: { fontWeight: '800', fontSize: 14, color: '#7B5B00' },
  trustSub:       { fontSize: 11, color: '#A07820', marginTop: 1 },
  trustRight:     { alignItems: 'flex-end' },
  trustScore:     { fontSize: 26, fontWeight: '900', color: C.gold },
  trustScoreLabel:{ fontSize: 10, color: '#A07820', textTransform: 'uppercase', letterSpacing: 0.8 },

  // Actions
  actionGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: -20,
    marginBottom: 20,
  },
  actionBtn:  { flex: 1, backgroundColor: C.white, paddingVertical: 14, paddingHorizontal: 8, borderRadius: 18, alignItems: 'center', gap: 8 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  actionText: { fontWeight: '700', fontSize: 12, color: C.text, textAlign: 'center' },

  // Stats
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  statCard:     { backgroundColor: C.white, borderRadius: 16, padding: 14, alignItems: 'flex-start', gap: 6 },
  statIconWrap: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  statValue:    { fontSize: 18, fontWeight: '800', color: C.text },
  statLabel:    { fontSize: 10, color: C.textMuted, fontWeight: '600' },

  // Weather
  weatherCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#B71C1C',
    borderRadius: 18,
    padding: 16,
    overflow: 'hidden',
  },
  weatherLeft:     { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  weatherIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  weatherTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  weatherTitle:    { fontSize: 14, fontWeight: '800', color: '#fff' },
  riskBadgeHigh:   { backgroundColor: '#FF5252', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  riskBadgeText:   { fontSize: 10, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  weatherSub:      { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginBottom: 2 },
  weatherDetail:   { fontSize: 11, color: 'rgba(255,255,255,0.65)' },

  // Funding Chart section
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 18,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle:  { fontSize: 15, fontWeight: '800', color: C.text },
  sectionPill:   { backgroundColor: C.primaryPale, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, fontSize: 11, color: C.primary, fontWeight: '700', overflow: 'hidden' },
  chartInner:    { flexDirection: 'row', alignItems: 'flex-end', height: 90, gap: 6 },
  chartCol:      { flex: 1, alignItems: 'center', gap: 4 },
  barWrap:       { flex: 1, width: '100%', justifyContent: 'flex-end' },
  bar:           { width: '100%', borderRadius: 6, minHeight: 4 },
  chartLabel:    { fontSize: 10, color: C.textMuted, fontWeight: '600' },
  chartFooter:   { fontSize: 10, color: C.textMuted, marginTop: 10, textAlign: 'center' },

  // Project cards
  headTitle: { fontSize: 18, fontWeight: '800', color: C.text },
  projectCard: {
    flexDirection: 'row',
    backgroundColor: C.white,
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 18,
    padding: 12,
    gap: 12,
    alignItems: 'center',
  },
  cardImg:    { width: 72, height: 72, borderRadius: 14, backgroundColor: '#eee' },
  cardBody:   { flex: 1 },
  cardTitle:  { fontWeight: '700', fontSize: 14, color: C.text, marginBottom: 6 },
  progressRow:{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  track:      { flex: 1, height: 6, backgroundColor: C.border, borderRadius: 3 },
  fill:       { height: '100%', backgroundColor: C.accent, borderRadius: 3 },
  progressText:{ fontSize: 10, fontWeight: '800', color: C.primary },
  cardMetaRow:{ flexDirection: 'row', alignItems: 'baseline' },
  cardMeta:   { fontSize: 12, fontWeight: '700', color: C.textSub },
  cardMetaGoal:{ fontSize: 11, color: C.textMuted },
  cardChevron: { paddingLeft: 4 },

  // Recent updates
  updateRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  updateIconWrap:{ width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  updateLabel:   { fontWeight: '700', fontSize: 13, color: C.text },
  updateSub:     { fontSize: 11, color: C.textMuted, marginTop: 1 },
  divider:       { height: 1, backgroundColor: C.border },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 85, 
    right: 24,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: C.primaryLight,
    overflow: 'hidden',
  },
  fabInner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});