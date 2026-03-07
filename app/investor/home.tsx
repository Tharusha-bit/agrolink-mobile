import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useProjects } from '../../src/context/ProjectContext'; // <--- CONNECTS TO YOUR CREATE PAGE

// ─── Design Tokens (Matches Global Theme) ──────────────────────────────────────
const COLORS = {
  primary: '#216000',       // Deep Forest Green
  primaryLight: '#2E8B00',
  primaryPale: '#E8F5E1',
  accent: '#76C442',
  accentWarm: '#F5A623',
  white: '#FFFFFF',
  surface: '#F7F9F4',
  card: '#FFFFFF',
  text: '#1A2E0D',
  textSecondary: '#5C7A4A',
  textMuted: '#9BB08A',
  border: '#DDE8D4',
  danger: '#E05252',
  info: '#3A9BD5',
};

const SHADOWS = {
  md: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10 },
    android: { elevation: 6 },
  }),
  sm: { elevation: 2 },
};

// ─── Mock KPI Data (Platform Stats) ────────────────────────────────────────────
const KPI_DATA = [
  { label: 'Active Crops', value: '142', icon: 'sprout', color: COLORS.accent },
  { label: 'Investors', value: '3.4k', icon: 'account-group', color: COLORS.primary },
  { label: 'Funded Today', value: '$28k', icon: 'cash-multiple', color: COLORS.accentWarm },
  { label: 'Avg Return', value: '18%', icon: 'chart-line', color: COLORS.info },
];

// ─── Components ────────────────────────────────────────────────────────────────

const StatBadge = ({ icon, label, value, color }: any) => (
  <View style={s.statBadge}>
    <View style={[s.statIconCircle, { backgroundColor: color + '15' }]}>
      <MaterialCommunityIcons name={icon} size={22} color={color} />
    </View>
    <Text style={s.statValue}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>
);

const InvestmentCard = ({ id, title, farmer, since, description, progress, image, tags, riskLevel, goal, raised }: any) => {
  const router = useRouter();
  const progressPct = Math.min(Math.max(progress, 0), 1);
  const riskColor = riskLevel === 'Low' ? COLORS.accent : riskLevel === 'Medium' ? COLORS.accentWarm : COLORS.danger;

  return (
    <TouchableOpacity 
      style={[ic.card, SHADOWS.md]} 
      activeOpacity={0.9}
      onPress={() => router.push(`/investment/${id}`)} // <--- Links to Detail Page
    >
      {/* Hero Image */}
      <View style={ic.imageWrap}>
        <Image source={{ uri: image }} style={ic.image} />
        <View style={ic.imageFade} />
        
        {/* Risk Chip */}
        <View style={[ic.riskChip, { backgroundColor: riskColor }]}>
          <MaterialCommunityIcons name="shield-check" size={12} color="#fff" style={{ marginRight: 4 }} />
          <Text style={ic.riskText}>{riskLevel} Risk</Text>
        </View>

        {/* Tags */}
        <View style={ic.tagRow}>
          {tags.map((t: string, index: number) => (
            <View key={index} style={ic.tagPill}>
              <Text style={ic.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Body */}
      <View style={ic.body}>
        <View style={ic.farmerRow}>
          <View style={ic.avatarWrap}>
            <MaterialCommunityIcons name="account" size={18} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={ic.title}>{title}</Text>
            <Text style={ic.farmerName}>by {farmer} • {since}</Text>
          </View>
          <View style={ic.verifiedBadge}>
            <MaterialCommunityIcons name="check-decagram" size={14} color={COLORS.primary} />
            <Text style={ic.verifiedText}>Verified</Text>
          </View>
        </View>

        <Text style={ic.description} numberOfLines={2}>{description}</Text>

        {/* Progress Bar */}
        <View style={ic.progressBlock}>
          <View style={ic.progressLabels}>
            <Text style={ic.progressTitle}>Funding Progress</Text>
            <Text style={ic.progressPct}>{Math.round(progressPct * 100)}%</Text>
          </View>
          <View style={ic.track}>
            <View style={[ic.fill, { width: `${progressPct * 100}%` }]} />
          </View>
          <View style={ic.amountRow}>
            <Text style={ic.raised}>Raised: <Text style={ic.raisedBold}>LKR {raised.toLocaleString()}</Text></Text>
            <Text style={ic.target}>Goal: LKR {goal.toLocaleString()}</Text>
          </View>
        </View>

        {/* Invest CTA */}
        <View style={ic.investBtn}>
          <Text style={ic.investText}>View Details</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const { projects } = useProjects(); // <--- This gets the data from Create Page

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* ── HEADER ── */}
        <View style={s.header}>
          {/* Decorative Circles */}
          <View style={s.decCircleLg} />
          <View style={s.decCircleSm} />

          {/* Top Bar */}
          <View style={s.topBar}>
            <View>
              <Text style={s.greeting}>Good morning 🌱</Text>
              <Text style={s.userName}>Fernando</Text>
              <Text style={s.date}>Monday, 24 November 2025</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/investor/Investorprofilehubscreen')} style={s.avatarBtn} activeOpacity={0.85}>
              <View style={s.notifDot} />
              <MaterialCommunityIcons name="account" size={26} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={s.searchBar}>
            <Ionicons name="search-outline" size={20} color={COLORS.textMuted} style={{ marginRight: 8 }} />
            <TextInput placeholder="Search crops, farmers..." placeholderTextColor={COLORS.textMuted} style={s.searchInput} />
            <TouchableOpacity style={s.micBtn}>
              <MaterialCommunityIcons name="microphone-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── WEATHER WIDGET (Floating) ── */}
        <View style={[s.weatherCard, SHADOWS.md]}>
          <View style={s.weatherTopRow}>
            <View>
              <View style={s.locationRow}>
                <MaterialCommunityIcons name="map-marker" size={18} color={COLORS.primary} />
                <Text style={s.cityText}>Anuradhapura</Text>
              </View>
              <Text style={s.weatherDesc}>Light rain expected</Text>
            </View>
            <View style={s.tempBlock}>
              <MaterialCommunityIcons name="weather-rainy" size={32} color={COLORS.info} />
              <Text style={s.tempText}>17°C</Text>
            </View>
          </View>

          <View style={s.divider} />

          <View style={s.statsRow}>
            <StatBadge icon="water-percent" label="Humidity" value="59%" color={COLORS.info} />
            <View style={s.statDivider} />
            <StatBadge icon="thermometer" label="Soil Temp" value="22°C" color={COLORS.accentWarm} />
            <View style={s.statDivider} />
            <StatBadge icon="weather-windy" label="Wind" value="6 m/s" color={COLORS.accent} />
          </View>
        </View>

        {/* ── KPI STRIP ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.kpiStrip}>
          {KPI_DATA.map((k) => (
            <View key={k.label} style={[s.kpiCard, SHADOWS.sm]}>
              <View style={[s.kpiIcon, { backgroundColor: k.color + '15' }]}>
                <MaterialCommunityIcons name={k.icon as any} size={22} color={k.color} />
              </View>
              <Text style={s.kpiValue}>{k.value}</Text>
              <Text style={s.kpiLabel}>{k.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── INVESTMENT LIST ── */}
        <View style={s.sectionHeader}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={s.pill} />
            <Text style={s.sectionTitle}>Top Investments</Text>
          </View>
          <TouchableOpacity>
            <Text style={s.sectionAction}>See all</Text>
          </TouchableOpacity>
        </View>
        
        {/* Dynamic List from Context */}
        {projects.map((inv) => (
          <InvestmentCard key={inv.id} {...inv} />
        ))}

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  
  /* HEADER */
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingHorizontal: 24,
    paddingBottom: 72,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    position: 'relative', overflow: 'hidden'
  },
  decCircleLg: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: COLORS.primaryLight, top: -60, right: -50, opacity: 0.5 },
  decCircleSm: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.accent, bottom: 20, left: -30, opacity: 0.18 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 },
  greeting: { fontSize: 12, color: '#B6D9A0', fontWeight: '600', letterSpacing: 0.5 },
  userName: { fontSize: 26, fontWeight: '900', color: COLORS.white, marginTop: 2 },
  date: { fontSize: 11, color: '#A8CFA0', marginTop: 2 },
  avatarBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.95)', justifyContent: 'center', alignItems: 'center' },
  notifDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.danger, position: 'absolute', top: 0, right: 0, borderWidth: 2, borderColor: COLORS.primary, zIndex: 1 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16, paddingHorizontal: 16, height: 48 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },
  micBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primaryPale, justifyContent: 'center', alignItems: 'center' },

  /* WEATHER CARD */
  weatherCard: { backgroundColor: COLORS.card, marginHorizontal: 24, marginTop: -50, borderRadius: 24, padding: 20 },
  weatherTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  cityText: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginLeft: 6 },
  weatherDesc: { fontSize: 11, color: COLORS.textMuted, marginLeft: 24 },
  tempBlock: { alignItems: 'flex-end' },
  tempText: { fontSize: 28, fontWeight: '900', color: COLORS.text, letterSpacing: -1 },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: 16 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  statDivider: { width: 1, height: 40, backgroundColor: COLORS.border },
  
  /* STAT BADGE */
  statBadge: { alignItems: 'center', width: 70 },
  statIconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  statLabel: { fontSize: 10, color: COLORS.textMuted },

  /* KPI STRIP */
  kpiStrip: { paddingLeft: 24, paddingRight: 12, marginTop: 20, marginBottom: 20 },
  kpiCard: { backgroundColor: COLORS.card, borderRadius: 18, padding: 14, marginRight: 12, alignItems: 'center', minWidth: 90 },
  kpiIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  kpiValue: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  kpiLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },

  /* SECTION HEADER */
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 24, marginBottom: 16, marginTop: 8 },
  pill: { width: 4, height: 18, borderRadius: 2, backgroundColor: COLORS.accent, marginRight: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  sectionAction: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
});

/* INVESTMENT CARD STYLES */
const ic = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: 24, marginHorizontal: 24, marginBottom: 20, overflow: 'hidden' },
  imageWrap: { height: 160, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageFade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  riskChip: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  riskText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  tagRow: { position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', gap: 6 },
  tagPill: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  tagText: { fontSize: 10, fontWeight: '600', color: '#fff' },
  body: { padding: 18 },
  farmerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatarWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  title: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  farmerName: { fontSize: 11, color: COLORS.textMuted },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryPale, borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 'auto', gap: 2 },
  verifiedText: { fontSize: 10, fontWeight: '600', color: COLORS.primary },
  description: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 16, marginTop: 6 },
  progressBlock: { marginBottom: 16 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressTitle: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },
  progressPct: { fontSize: 12, fontWeight: '800', color: COLORS.primary },
  track: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 3 },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  raised: { fontSize: 10, color: COLORS.textMuted },
  raisedBold: { fontWeight: '700', color: COLORS.primary },
  target: { fontSize: 10, color: COLORS.textMuted },
  investBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 12, justifyContent: 'center', alignItems: 'center', gap: 8 },
  investText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});