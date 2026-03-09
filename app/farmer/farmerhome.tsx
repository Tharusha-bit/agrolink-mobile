import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { ComponentProps, useRef } from 'react';
import {
  Alert,
  Animated,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// ✅ Connects to your Global Data
import { type Project, useProjects } from '../../src/context/ProjectContext';

// ─────────────────────────────────────────────────────────────────────────────
// ICON TYPE
// ─────────────────────────────────────────────────────────────────────────────
type MCIcon = ComponentProps<typeof MaterialCommunityIcons>['name'];

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS (Green & Gold Theme)
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  primary:     '#1A5200',
  primaryMid:  '#216000',
  primaryLight:'#2E8B00',
  primaryPale: '#E8F5E1',
  surface:     '#F4F7F0',
  white:       '#FFFFFF',
  ink:         '#1A2E0D',
  inkSub:      '#4A6741',
  inkMuted:    '#9BB08A',
  accent:      '#76C442',
  accentWarm:  '#F5A623',
  gold:        '#D4A017',
  goldLight:   '#FFF8E1',
  border:      '#E2EDD9',
  divider:     '#EEF5E8',

  // Alert severities
  safe:        '#2E7D32',
  safePale:    '#E8F5E9',
  medium:      '#FF8F00',
  mediumPale:  '#FFF3E0',
  high:        '#C62828',
  highPale:    '#FFEBEE',
};

const SH = {
  sm: Platform.select({ ios: { shadowColor:'#1A5200', shadowOffset:{width:0,height:2}, shadowOpacity:0.07, shadowRadius:6  }, android:{ elevation:2 } }),
  md: Platform.select({ ios: { shadowColor:'#1A5200', shadowOffset:{width:0,height:4}, shadowOpacity:0.11, shadowRadius:12 }, android:{ elevation:5 } }),
  lg: Platform.select({ ios: { shadowColor:'#000',    shadowOffset:{width:0,height:6}, shadowOpacity:0.18, shadowRadius:16 }, android:{ elevation:10} }),
};

const FONT  = { xs:10, sm:12, md:14, lg:16, xl:18, xxl:22 };
const SPACE = { xs:6, sm:10, md:16, lg:20, xl:24 };

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────────────────────
interface AlertItem {
  id:       number;
  icon:     MCIcon;
  title:    string;
  body:     string;
  severity: 'safe' | 'medium' | 'high';
}

const FARM_ALERTS: AlertItem[] = [
  { id: 1, icon: 'weather-lightning-rainy', title: 'Heavy Rain Expected',        body: 'Anuradhapura · Next 24 h',          severity: 'high'   },
  { id: 2, icon: 'bug-outline',             title: 'Pest Advisory',              body: 'Monitor paddy for leaf blight',      severity: 'medium' },
  { id: 3, icon: 'water-check-outline',     title: 'Irrigation Completed',       body: 'North plot · All systems normal',    severity: 'safe'   },
];

interface QuickAction {
  icon:  MCIcon;
  label: string;
  bg:    string;
  color: string;
  route: string;
}

// ✅ FIXED: Routes point to existing pages
const QUICK_ACTIONS: QuickAction[] = [
  { icon: 'plus-circle-outline', label: 'Add Project',    bg: C.primaryPale, color: C.primary,    route: '/project/create'    },
  { icon: 'folder-multiple',     label: 'My Projects',    bg: '#F3E5F5',     color: '#6A1B9A',    route: '/farmer/projects'   },
  { icon: 'camera-plus-outline', label: 'Post Update',    bg: '#FFF3E0',     color: C.accentWarm, route: 'update'             }, // Placeholder
  { icon: 'chart-line',          label: 'Analytics',      bg: '#E3F2FD',     color: '#1565C0',    route: 'analytics'          }, // Placeholder
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function farmerName(p: Project): string {
  // Handles both old string format and new object format
  if (typeof p.farmer === 'string') return p.farmer;
  return (p.farmer as any)?.name ?? 'Unknown Farmer';
}

function getProgress(p: Project): number {
  return p.goal > 0 ? Math.min(p.raised / p.goal, 1) : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function MetricTile({ icon, value, label, color, bg }: {
  icon: MCIcon; value: string | number; label: string; color: string; bg: string;
}) {
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
  tile:    { flex: 1, alignItems: 'center', gap: 5 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  value:   { fontSize: FONT.xl, fontWeight: '900', color: C.ink },
  label:   { fontSize: FONT.xs, fontWeight: '700', color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 0.6, textAlign: 'center' },
});

function HealthRow({ icon, label, value, color, bg }: {
  icon: MCIcon; label: string; value: string; color: string; bg: string;
}) {
  return (
    <View style={hr.row}>
      <View style={[hr.iconBox, { backgroundColor: bg }]}>
        <MaterialCommunityIcons name={icon} size={15} color={color} />
      </View>
      <Text style={hr.label}>{label}</Text>
      <View style={[hr.pill, { backgroundColor: bg }]}>
        <Text style={[hr.pillText, { color }]}>{value}</Text>
      </View>
    </View>
  );
}
const hr = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', gap: SPACE.sm, paddingVertical: 6 },
  iconBox:  { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  label:    { flex: 1, fontSize: FONT.md, fontWeight: '600', color: C.inkSub },
  pill:     { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  pillText: { fontSize: FONT.sm, fontWeight: '800' },
});

function ActionBtn({ action, onPress }: { action: QuickAction; onPress: () => void }) {
  return (
    <TouchableOpacity style={[ab.btn, SH.sm]} onPress={onPress} activeOpacity={0.8}>
      <View style={[ab.iconWrap, { backgroundColor: action.bg }]}>
        <MaterialCommunityIcons name={action.icon} size={24} color={action.color} />
      </View>
      <Text style={ab.label}>{action.label}</Text>
    </TouchableOpacity>
  );
}
const ab = StyleSheet.create({
  btn:      { flex: 1, backgroundColor: C.white, borderRadius: 18, paddingVertical: 14, alignItems: 'center', gap: 8 },
  iconWrap: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  label:    { fontSize: FONT.sm, fontWeight: '700', color: C.ink, textAlign: 'center' },
});

function ProjectCard({ project, onPress }: { project: Project; onPress: () => void }) {
  const pct           = Math.round(getProgress(project) * 100);
  const investorCount = project.investors?.length ?? 0;
  // Handle different image formats
  const imageUri      = (project as any).imageUrl ?? (project as any).image ?? 'https://via.placeholder.com/150';

  return (
    <TouchableOpacity style={[pc.card, SH.md]} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: imageUri }} style={pc.img} />
      <View style={pc.body}>
        <Text style={pc.title} numberOfLines={1}>{project.title}</Text>

        <View style={pc.barRow}>
          <View style={pc.track}>
            <View style={[pc.fill, { width: `${pct}%` }]} />
          </View>
          <Text style={pc.pct}>{pct}%</Text>
        </View>

        <View style={pc.metaRow}>
          <Text style={pc.raised}>LKR {project.raised.toLocaleString()}</Text>
          <Text style={pc.goal}> / {project.goal.toLocaleString()}</Text>
        </View>

        {investorCount > 0 && (
          <View style={pc.investRow}>
            <MaterialCommunityIcons name={'account-group-outline' as MCIcon} size={12} color={C.inkMuted} />
            <Text style={pc.investText}>{investorCount} investor{investorCount !== 1 ? 's' : ''}</Text>
          </View>
        )}
      </View>
      <MaterialCommunityIcons name={'chevron-right' as MCIcon} size={20} color={C.inkMuted} />
    </TouchableOpacity>
  );
}
const pc = StyleSheet.create({
  card:      { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, marginHorizontal: SPACE.md, marginBottom: SPACE.sm, borderRadius: 20, padding: 12, gap: 12 },
  img:       { width: 76, height: 76, borderRadius: 14, backgroundColor: C.border },
  body:      { flex: 1 },
  title:     { fontSize: FONT.md, fontWeight: '800', color: C.ink, marginBottom: 6 },
  barRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  track:     { flex: 1, height: 6, backgroundColor: C.border, borderRadius: 3, overflow: 'hidden' },
  fill:      { height: '100%', backgroundColor: C.accent, borderRadius: 3 },
  pct:       { fontSize: FONT.xs, fontWeight: '800', color: C.primary, width: 28 },
  metaRow:   { flexDirection: 'row', alignItems: 'baseline' },
  raised:    { fontSize: FONT.sm, fontWeight: '800', color: C.inkSub },
  goal:      { fontSize: FONT.xs, color: C.inkMuted },
  investRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  investText:{ fontSize: FONT.xs, color: C.inkMuted, fontWeight: '600' },
});

function AlertRow({ alert, isLast }: { alert: AlertItem; isLast: boolean }) {
  const colorMap = {
    safe:   { bg: C.safePale,   color: C.safe   },
    medium: { bg: C.mediumPale, color: C.medium },
    high:   { bg: C.highPale,   color: C.high   },
  };
  const { bg, color } = colorMap[alert.severity];
  const badgeLabel = alert.severity === 'safe' ? 'Safe' : alert.severity === 'medium' ? 'Medium' : 'High';

  return (
    <>
      <View style={al.row}>
        <View style={[al.iconBox, { backgroundColor: bg }]}>
          <MaterialCommunityIcons name={alert.icon} size={20} color={color} />
        </View>
        <View style={al.textWrap}>
          <Text style={al.title}>{alert.title}</Text>
          <Text style={al.body}>{alert.body}</Text>
        </View>
        <View style={[al.badge, { backgroundColor: bg }]}>
          <Text style={[al.badgeText, { color }]}>{badgeLabel}</Text>
        </View>
      </View>
      {!isLast && <View style={al.divider} />}
    </>
  );
}
const al = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: SPACE.sm },
  iconBox:  { width: 44, height: 44, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  textWrap: { flex: 1 },
  title:    { fontSize: FONT.md, fontWeight: '700', color: C.ink },
  body:     { fontSize: FONT.xs, color: C.inkMuted, marginTop: 2 },
  badge:    { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 },
  badgeText:{ fontSize: FONT.xs, fontWeight: '900' },
  divider:  { height: 1, backgroundColor: C.divider },
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function FarmerDashboard() {
  const router      = useRouter();
  const { projects } = useProjects();
  const fabScale    = useRef(new Animated.Value(1)).current;

  // Filter this farmer's projects
  const myProjects = projects.filter((p) => {
    const name = farmerName(p);
    return name.includes('Me') || name.includes('Suriyakumar');
  });

  const totalRaised    = myProjects.reduce((s, p) => s + p.raised, 0);
  const totalInvestors = myProjects.reduce((s, p) => s + (p.investors?.length ?? 0), 0);

  const pressFab = () => {
    Animated.sequence([
      Animated.spring(fabScale, { toValue: 0.88, useNativeDriver: true }),
      Animated.spring(fabScale, { toValue: 1,    useNativeDriver: true }),
    ]).start(() => router.push('/project/create'));
  };

  const handleAction = (route: string) => {
    if (route.startsWith('/')) {
        router.push(route as any);
    } else {
        Alert.alert("Coming Soon", "This feature is not yet implemented.");
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.primaryMid} />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
        <View style={s.header}>
          <View style={s.blob1} />
          <View style={s.blob2} />

          <View style={s.topRow}>
            <View>
              <Text style={s.greeting}>Ayubowan, Suriyakumar 🙏</Text>
              <Text style={s.subLine}>Your farm control center</Text>
            </View>
            <View style={s.headerRight}>
              <View style={s.levelBadge}>
                <MaterialCommunityIcons name={'shield-check' as MCIcon} size={12} color={C.gold} />
                <Text style={s.levelText}>Gold</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/farmer/profile')}>
                <View style={s.avatar}>
                  <MaterialCommunityIcons name={'account' as MCIcon} size={28} color={C.primary} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ══ AI FARM HEALTH ══════════════════════════════════════════════════ */}
        <View style={[s.card, s.healthCard, SH.md]}>
          <View style={s.healthHeader}>
            <View style={s.aiBadge}>
              <MaterialCommunityIcons name={'robot' as MCIcon} size={13} color={C.white} />
              <Text style={s.aiBadgeText}>AI Farm Health</Text>
            </View>
            <Text style={s.healthTime}>Updated just now</Text>
          </View>

          <HealthRow icon={'leaf'}                  label="Crop Health"    value="Good"   color={C.safe}   bg={C.safePale}   />
          <View style={s.healthDivider} />
          <HealthRow icon={'weather-cloudy'}         label="Weather Risk"   value="Medium" color={C.medium} bg={C.mediumPale} />
          <View style={s.healthDivider} />
          <HealthRow icon={'water-outline'}          label="Soil Condition" value="Moist"  color={'#1565C0'} bg={'#E3F2FD'}    />

          <View style={s.recoBox}>
            <MaterialCommunityIcons name={'lightbulb-on-outline' as MCIcon} size={15} color={C.accentWarm} />
            <Text style={s.recoText}>Monitor irrigation tomorrow — rain expected overnight.</Text>
          </View>
        </View>

        {/* ══ FUNDING OVERVIEW ════════════════════════════════════════════════ */}
        <View style={[s.card, SH.sm]}>
          <View style={s.cardHeaderRow}>
            <Text style={s.cardTitle}>Funding Overview</Text>
            <View style={s.trendBadge}>
              <MaterialCommunityIcons name={'trending-up' as MCIcon} size={12} color={C.accent} />
              <Text style={s.trendText}>+12% this week</Text>
            </View>
          </View>

          <View style={s.metricsRow}>
            <MetricTile
              icon={'currency-usd' as MCIcon}
              value={`${(totalRaised / 1000).toFixed(0)}k`}
              label="LKR Raised"
              color={C.primary}
              bg={C.primaryPale}
            />
            <View style={s.metricDivider} />
            <MetricTile
              icon={'folder-multiple-outline' as MCIcon}
              value={myProjects.length}
              label="Projects"
              color={'#1565C0'}
              bg={'#E3F2FD'}
            />
            <View style={s.metricDivider} />
            <MetricTile
              icon={'account-group-outline' as MCIcon}
              value={totalInvestors}
              label="Investors"
              color={C.accentWarm}
              bg={C.goldLight}
            />
          </View>

          <TouchableOpacity style={s.viewAllBtn} onPress={() => router.push('/farmer/projects')}>
            <Text style={s.viewAllText}>View All Projects</Text>
            <MaterialCommunityIcons name={'arrow-right' as MCIcon} size={14} color={C.primary} />
          </TouchableOpacity>
        </View>

        {/* ══ QUICK ACTIONS ═══════════════════════════════════════════════════ */}
        <Text style={s.sectionLabel}>Quick Actions</Text>
        <View style={s.actionsGrid}>
          {QUICK_ACTIONS.map((a) => (
            <ActionBtn key={a.label} action={a} onPress={() => handleAction(a.route)} />
          ))}
        </View>

        {/* ══ ACTIVE PROJECTS ═════════════════════════════════════════════════ */}
        <View style={s.sectionRow}>
          <Text style={s.sectionLabel}>Active Projects</Text>
          <TouchableOpacity onPress={() => router.push('/farmer/projects')}>
            <Text style={s.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {myProjects.length === 0 ? (
          <View style={[s.emptyCard, SH.sm]}>
            <MaterialCommunityIcons name={'tractor' as MCIcon} size={40} color={C.accent} />
            <Text style={s.emptyTitle}>No projects yet</Text>
            <Text style={s.emptySub}>Start your first farm funding project.</Text>
            <TouchableOpacity style={s.emptyBtn} onPress={() => router.push('/project/create')}>
              <Text style={s.emptyBtnText}>Create Project</Text>
            </TouchableOpacity>
          </View>
        ) : (
          myProjects.slice(0, 3).map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onPress={() => router.push(`/farmer/project-manage/${p.id}` as any)}
            />
          ))
        )}

        {/* ══ FARM ALERTS ═════════════════════════════════════════════════════ */}
        <View style={s.sectionRow}>
          <Text style={s.sectionLabel}>Farm Alerts</Text>
          <View style={s.alertCountBadge}>
            <Text style={s.alertCountText}>{FARM_ALERTS.length}</Text>
          </View>
        </View>

        <View style={[s.card, SH.sm]}>
          {FARM_ALERTS.map((a, i) => (
            <AlertRow key={a.id} alert={a} isLast={i === FARM_ALERTS.length - 1} />
          ))}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ══ FAB ════════════════════════════════════════════════════════════ */}
      <Animated.View style={[s.fab, SH.lg, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity onPress={pressFab} style={s.fabInner} activeOpacity={1}>
          <MaterialCommunityIcons name={'plus' as MCIcon} size={30} color={C.white} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.surface },
  scroll: { paddingBottom: 30 },

  // ── HEADER ──
  header: {
    backgroundColor: C.primaryMid,
    paddingTop: 58,
    paddingHorizontal: SPACE.md,
    paddingBottom: SPACE.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    marginBottom: SPACE.md,
  },
  blob1:    { position:'absolute', width:220, height:220, borderRadius:110, backgroundColor:C.primaryLight, top:-70, right:-60, opacity:0.3 },
  blob2:    { position:'absolute', width:100, height:100, borderRadius:50,  backgroundColor:C.accent,       bottom:-20, left:30, opacity:0.1 },
  topRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: FONT.xl, fontWeight: '800', color: C.white, letterSpacing: 0.2 },
  subLine:  { fontSize: FONT.sm, color: 'rgba(255,255,255,0.7)', marginTop: 3 },
  headerRight: { alignItems: 'flex-end', gap: SPACE.xs },
  levelBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.goldLight, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  levelText:   { fontSize: FONT.xs, fontWeight: '800', color: C.gold },
  avatar:      { width: 44, height: 44, borderRadius: 22, backgroundColor: C.white, justifyContent: 'center', alignItems: 'center' },

  // ── SHARED CARD ──
  card: {
    backgroundColor: C.white,
    marginHorizontal: SPACE.md,
    marginBottom: SPACE.md,
    borderRadius: 22,
    padding: SPACE.md,
  },

  // ── AI HEALTH CARD ──
  healthCard:   {},
  healthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACE.sm },
  aiBadge:      { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  aiBadgeText:  { fontSize: FONT.xs, fontWeight: '800', color: C.white, letterSpacing: 0.5 },
  healthTime:   { fontSize: FONT.xs, color: C.inkMuted },
  healthDivider:{ height: 1, backgroundColor: C.divider, marginVertical: 2 },
  recoBox:      { flexDirection: 'row', alignItems: 'flex-start', gap: SPACE.xs, backgroundColor: C.goldLight, borderRadius: 12, padding: SPACE.sm, marginTop: SPACE.sm },
  recoText:     { flex: 1, fontSize: FONT.sm, color: '#7B5B00', lineHeight: 18 },

  // ── FUNDING OVERVIEW ──
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACE.md },
  cardTitle:     { fontSize: FONT.lg, fontWeight: '800', color: C.ink },
  trendBadge:    { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.primaryPale, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 },
  trendText:     { fontSize: FONT.xs, fontWeight: '700', color: C.primary },
  metricsRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACE.xs },
  metricDivider: { width: 1, height: 40, backgroundColor: C.divider },
  viewAllBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: SPACE.md, paddingTop: SPACE.sm, borderTopWidth: 1, borderColor: C.divider },
  viewAllText:   { fontSize: FONT.sm, fontWeight: '700', color: C.primary },

  // ── SECTION LABELS ──
  sectionLabel: { fontSize: FONT.md, fontWeight: '800', color: C.ink, marginLeft: SPACE.md, marginBottom: SPACE.sm },
  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginRight: SPACE.md },
  seeAll:       { fontSize: FONT.sm, fontWeight: '700', color: C.primaryLight },

  alertCountBadge: { marginRight: SPACE.md, backgroundColor: C.highPale, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  alertCountText:  { fontSize: FONT.xs, fontWeight: '900', color: C.high },

  // ── QUICK ACTIONS ──
  actionsGrid: { flexDirection: 'row', marginHorizontal: SPACE.md, gap: SPACE.sm, marginBottom: SPACE.md },

  // ── EMPTY STATE ──
  emptyCard:   { backgroundColor: C.white, marginHorizontal: SPACE.md, marginBottom: SPACE.md, borderRadius: 22, padding: SPACE.xl, alignItems: 'center', gap: SPACE.sm },
  emptyTitle:  { fontSize: FONT.lg, fontWeight: '800', color: C.ink },
  emptySub:    { fontSize: FONT.md, color: C.inkMuted, textAlign: 'center' },
  emptyBtn:    { marginTop: SPACE.sm, backgroundColor: C.primary, paddingHorizontal: SPACE.xl, paddingVertical: 13, borderRadius: 16 },
  emptyBtnText:{ fontSize: FONT.md, fontWeight: '800', color: C.white },

  // ── FAB ──
  fab:     { position:'absolute', bottom:90, right:20, width:60, height:60, borderRadius:30, backgroundColor:C.primaryLight, overflow:'hidden' },
  fabInner:{ flex:1, justifyContent:'center', alignItems:'center' },
});