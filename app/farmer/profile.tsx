import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useProjects } from '../../src/context/ProjectContext';

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  // Greens
  forest:      '#1B5E20',
  deep:        '#2E7D32',
  mid:         '#388E3C',
  leaf:        '#4CAF50',
  accent:      '#66BB6A',
  accentLight: '#A5D6A7',
  pale:        '#E8F5E9',
  paler:       '#F4F8F2',

  // Neutrals
  white:       '#FFFFFF',
  ink:         '#1C2B1A',
  inkSub:      '#3E5239',
  inkMuted:    '#8EA882',
  border:      '#D8EAD4',
  divider:     '#EBF4E8',

  // Warm accents
  gold:        '#F59E0B',
  goldLight:   '#FEF3C7',
  amber:       '#F5A623',
  red:         '#EF5350',
  blue:        '#1976D2',
  bluePale:    '#E3F2FD',
};

const SH = {
  xs: Platform.select({ ios: { shadowColor:'#1B5E20', shadowOffset:{width:0,height:2}, shadowOpacity:0.07, shadowRadius:4  }, android:{ elevation:2  } }),
  sm: Platform.select({ ios: { shadowColor:'#1B5E20', shadowOffset:{width:0,height:3}, shadowOpacity:0.09, shadowRadius:7  }, android:{ elevation:3  } }),
  md: Platform.select({ ios: { shadowColor:'#1B5E20', shadowOffset:{width:0,height:5}, shadowOpacity:0.12, shadowRadius:12 }, android:{ elevation:6  } }),
  lg: Platform.select({ ios: { shadowColor:'#1B5E20', shadowOffset:{width:0,height:8}, shadowOpacity:0.16, shadowRadius:20 }, android:{ elevation:12 } }),
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLES 
// ─────────────────────────────────────────────────────────────────────────────
const sc = StyleSheet.create({
  root:   { flex: 1, backgroundColor: T.paler },
  scroll: { paddingBottom: 110 }, // FIXED: Added more padding so tabs don't hide the logout button

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    paddingTop: 54,
    paddingBottom: 38,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  arc1: { position:'absolute', width:340, height:340, borderRadius:170, backgroundColor:T.leaf,  opacity:0.10, top:-160, right:-80  },
  arc2: { position:'absolute', width:200, height:200, borderRadius:100, backgroundColor:T.accent,opacity:0.08, bottom:-60, left:-40 },
  arc3: { position:'absolute', width:120, height:120, borderRadius:60,  backgroundColor:T.white, opacity:0.04, top:30,    left:20   },

  topNav:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'100%', marginBottom:28 },
  navBtn:   { width:40, height:40, borderRadius:12, backgroundColor:'rgba(255,255,255,0.15)', justifyContent:'center', alignItems:'center' },
  navTitle: { fontSize:17, fontWeight:'700', color:T.white, letterSpacing:0.3 },

  avatarBlock:  { marginBottom:16 },
  avatarRing:   { width:100, height:100, borderRadius:50, borderWidth:3, borderColor:'rgba(255,255,255,0.35)', justifyContent:'center', alignItems:'center', position:'relative' },
  avatarInner:  { width:88,  height:88,  borderRadius:44, backgroundColor:T.white, justifyContent:'center', alignItems:'center' },
  verifyBubble: { position:'absolute', bottom:2, right:2, width:26, height:26, borderRadius:13, backgroundColor:T.accent, justifyContent:'center', alignItems:'center', borderWidth:2, borderColor:T.deep },

  heroName: { fontSize:26, fontWeight:'800', color:T.white, letterSpacing:0.4, marginBottom:6 },
  rolePill: { flexDirection:'row', alignItems:'center', gap:5, backgroundColor:'rgba(255,255,255,0.15)', paddingHorizontal:12, paddingVertical:4, borderRadius:20, marginBottom:6 },
  roleText: { fontSize:12, fontWeight:'700', color:T.accentLight, letterSpacing:0.5 },
  heroId:   { fontSize:12, color:'rgba(255,255,255,0.55)', marginBottom:20 },

  trustStrip:    { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(0,0,0,0.22)', borderRadius:16, paddingHorizontal:16, paddingVertical:12, gap:12, width:'100%' },
  trustMid:      { flex:1, gap:6 },
  trustLabel:    { fontSize:11, color:'rgba(255,255,255,0.7)', fontWeight:'600', textTransform:'uppercase', letterSpacing:0.8 },
  trustBarTrack: { height:5, backgroundColor:'rgba(255,255,255,0.2)', borderRadius:3 },
  trustBarFill:  { height:'100%', width:'92%', backgroundColor:T.gold, borderRadius:3 },
  trustPct:      { fontSize:22, fontWeight:'900', color:T.gold },

  // ── STATS ──────────────────────────────────────────────────────────────────
  statsGrid:    { flexDirection:'row', gap:12, paddingHorizontal:20, marginTop:-28, marginBottom:20 },
  statCard:     { flex:1, backgroundColor:T.white, borderRadius:18, padding:14, alignItems:'flex-start', gap:8 },
  statIconWrap: { width:38, height:38, borderRadius:11, justifyContent:'center', alignItems:'center' },
  statValue:    { fontSize:22, fontWeight:'900', color:T.ink },
  statLabel:    { fontSize:10, fontWeight:'700', color:T.inkMuted, textTransform:'uppercase', letterSpacing:0.6 },

  // ── CTA ────────────────────────────────────────────────────────────────────
  ctaWrap:   { marginHorizontal:20, marginBottom:28, borderRadius:22, backgroundColor: T.white }, 
  ctaCard:   { flexDirection:'row', alignItems:'center', padding:18, gap:14, borderRadius:22, overflow:'hidden' }, 
  ctaIconBox:{ width:54, height:54, borderRadius:16, backgroundColor:'rgba(255,255,255,0.2)', justifyContent:'center', alignItems:'center' },
  ctaText:   { flex:1 },
  ctaTitle:  { fontSize:16, fontWeight:'800', color:T.white, marginBottom:3 },
  ctaSub:    { fontSize:12, color:'rgba(255,255,255,0.75)' },
  ctaArrow:  { width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,255,255,0.2)', justifyContent:'center', alignItems:'center' },

  // ── SECTION ────────────────────────────────────────────────────────────────
  section:      { paddingHorizontal:20, marginBottom:24 },
  sectionHead:  { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14 },
  sectionTitle: { fontSize:12, fontWeight:'800', color:T.inkMuted, letterSpacing:1.4, textTransform:'uppercase' }, 
  sectionLink:  { fontSize:12, fontWeight:'700', color:T.leaf },

  // ── PROJECT CARD ───────────────────────────────────────────────────────────
  projCard:    { backgroundColor:T.white, borderRadius:20, marginBottom:14, flexDirection:'row', padding:14, gap:14 },
  projImage:   { width:82, height:82, borderRadius:14, backgroundColor:T.divider },
  projBody:    { flex:1, justifyContent:'space-between' },
  projTitleRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', gap:6, marginBottom:4 },
  projTitle:   { flex:1, fontSize:14, fontWeight:'800', color:T.ink },
  statusBadge: { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:8, paddingVertical:3, borderRadius:8 },
  statusDot:   { width:5, height:5, borderRadius:3 },
  statusText:  { fontSize:10, fontWeight:'800' },
  projMeta:    { fontSize:11, color:T.inkMuted, marginBottom:8 },
  barRow:      { flexDirection:'row', alignItems:'center', gap:8, marginBottom:5 },
  barTrack:    { flex:1, height:6, backgroundColor:T.divider, borderRadius:3 },
  barFill:     { height:'100%', borderRadius:3 },
  barPct:      { fontSize:10, fontWeight:'800', color:T.deep, width:28, textAlign:'right' },
  projAmtRow:  { flexDirection:'row', alignItems:'baseline' },
  projRaised:  { fontSize:12, fontWeight:'800', color:T.deep },
  projGoal:    { fontSize:11, color:T.inkMuted },

  // ── MENU ───────────────────────────────────────────────────────────────────
  menuShadowWrap:{ backgroundColor: T.white, borderRadius: 20 },
  menuCard:      { borderRadius:20, overflow:'hidden' },
  menuItem:      { flexDirection:'row', alignItems:'center', paddingHorizontal:18, paddingVertical:15, gap:14 },
  menuIconWrap:  { width:42, height:42, borderRadius:13, backgroundColor:T.pale, justifyContent:'center', alignItems:'center' },
  menuLabel:     { flex:1, fontSize:15, fontWeight:'600', color:T.ink },
  menuDivider:   { height:1, backgroundColor:T.divider, marginLeft:74 },

  // ── EMPTY STATE ────────────────────────────────────────────────────────────
  empty:     { alignItems:'center', paddingVertical:30, gap:10 },
  emptyText: { color:T.inkMuted, fontSize:14, fontWeight:'600' },
});

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

type StatCardProps = {
  icon: IconName;
  iconColor: string;
  iconBg: string;
  value: string | number;
  label: string;
};

interface Project {
  id: string;
  image?: string;
  title?: string;
  progress?: number;
  goal?: number;
  duration?: string;
  raised?: number;
}

type ProjectCardProps = { project: Project };

type MenuItemProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
  danger?: boolean;
};

function StatCard({ icon, iconColor, iconBg, value, label }: StatCardProps) {
  return (
    <View style={[sc.statCard, SH.sm]}>
      <View style={[sc.statIconWrap, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={sc.statValue}>{value}</Text>
      <Text style={sc.statLabel}>{label}</Text>
    </View>
  );
}

function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter(); // FIXED: Added router for navigation
  const progress    = project?.progress || 0;
  const pct         = Math.round(progress * 100);
  const isCompleted = progress >= 1;
  const isActive    = progress > 0 && !isCompleted;

  const statusColor = isCompleted ? T.blue     : isActive ? T.leaf  : T.amber;
  const statusBg    = isCompleted ? T.bluePale : isActive ? T.pale  : T.goldLight;
  const statusLabel = isCompleted ? 'Completed': isActive ? 'Active': 'Pending';

  return (
    // FIXED 1: Wrapped in TouchableOpacity to make projects clickable
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={() => router.push(`/farmer/project-manage/${project.id}`)}
    >
      <View style={[sc.projCard, SH.md]}>
        <Image source={{ uri: project?.image }} style={sc.projImage} />
        <View style={sc.projBody}>
          <View style={sc.projTitleRow}>
            <Text style={sc.projTitle} numberOfLines={1}>{project?.title || 'Untitled'}</Text>
            <View style={[sc.statusBadge, { backgroundColor: statusBg }]}>
              <View style={[sc.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[sc.statusText, { color: statusColor }]}>{statusLabel}</Text>
            </View>
          </View>

          <Text style={sc.projMeta}>Goal: LKR {(project?.goal || 0).toLocaleString()} · {project?.duration || ''}</Text>

          <View style={sc.barRow}>
            <View style={sc.barTrack}>
              <View style={[sc.barFill, { width: `${pct}%`, backgroundColor: isCompleted ? T.blue : T.leaf }]} />
            </View>
            <Text style={sc.barPct}>{pct}%</Text>
          </View>

          <View style={sc.projAmtRow}>
            <Text style={sc.projRaised}>LKR {(project?.raised || 0).toLocaleString()}</Text>
            <Text style={sc.projGoal}> / {(project?.goal || 0).toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MenuItem({ icon, label, onPress, danger = false }: MenuItemProps) {
  return (
    <TouchableOpacity style={sc.menuItem} onPress={onPress} activeOpacity={0.75}>
      <View style={[sc.menuIconWrap, danger && { backgroundColor: '#FFEBEE' }]}>
        <MaterialCommunityIcons name={icon} size={21} color={danger ? T.red : T.deep} />
      </View>
      <Text style={[sc.menuLabel, danger && { color: T.red }]}>{label}</Text>
      {!danger && <MaterialCommunityIcons name="chevron-right" size={20} color={T.inkMuted} />}
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function FarmerProfileScreen() {
  const router = useRouter();
  const { projects =[] } = useProjects() || {}; 
  
  const myProjects = (projects ||[]).filter(
    (p: any) => p?.farmer?.includes('Me') || p?.farmer?.includes('Suriyakumar')
  );

  return (
    <View style={sc.root}>
      <StatusBar barStyle="light-content" backgroundColor={T.forest} />

      <ScrollView contentContainerStyle={sc.scroll} showsVerticalScrollIndicator={false}>

        {/* ══ HERO HEADER ═════════════════════════════════════════════════════ */}
        <LinearGradient
          colors={[T.forest, T.deep, T.mid]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={sc.hero}
        >
          <View style={sc.arc1} />
          <View style={sc.arc2} />
          <View style={sc.arc3} />

          {/* Top nav */}
          <View style={sc.topNav}>
            {/* Tweaked slightly to use push for cleaner tab handling */}
            <TouchableOpacity onPress={() => router.push('/farmer/farmerhome')} style={sc.navBtn}>
              <Ionicons name="arrow-back" size={22} color={T.white} />
            </TouchableOpacity>
            <Text style={sc.navTitle}>Farmer Profile</Text>
            <TouchableOpacity style={sc.navBtn}>
              <MaterialCommunityIcons name="dots-horizontal" size={22} color={T.white} />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={sc.avatarBlock}>
            <View style={sc.avatarRing}>
              <View style={sc.avatarInner}>
                <MaterialCommunityIcons name="account" size={52} color={T.deep} />
              </View>
              <View style={sc.verifyBubble}>
                <MaterialCommunityIcons name="check-decagram" size={18} color={T.white} />
              </View>
            </View>
          </View>

          <Text style={sc.heroName}>Suriyakumar</Text>
          <View style={sc.rolePill}>
            <MaterialCommunityIcons name="leaf" size={12} color={T.accentLight} />
            <Text style={sc.roleText}>Verified Farmer</Text>
          </View>
          <Text style={sc.heroId}>ID: FM-2025-889</Text>

          {/* Trust score strip - FIXED 3: Linked to Trust.tsx */}
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/farmer/trust')} style={{ width: '100%' }}>
            <View style={sc.trustStrip}>
              <MaterialCommunityIcons name="shield-check" size={20} color={T.gold} />
              <View style={sc.trustMid}>
                <Text style={sc.trustLabel}>Trust Score</Text>
                <View style={sc.trustBarTrack}>
                  <View style={sc.trustBarFill} />
                </View>
              </View>
              <Text style={sc.trustPct}>92%</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        {/* ══ STAT WIDGETS ════════════════════════════════════════════════════ */}
        <View style={sc.statsGrid}>
          <StatCard icon="folder-multiple"  iconColor={T.deep} iconBg={T.pale}      value={myProjects.length} label="Projects"   />
          <StatCard icon="currency-usd"     iconColor={T.leaf} iconBg="#E8F5E9"     value="480k"              label="LKR Raised" />
          <StatCard icon="account-group"    iconColor={T.blue} iconBg={T.bluePale}  value="34"                label="Investors"  />
        </View>

        {/* ══ LAUNCH CTA ══════════════════════════════════════════════════════ */}
        <TouchableOpacity onPress={() => router.push('/project/create')} activeOpacity={0.88} style={[sc.ctaWrap, SH.md]}>
          <LinearGradient
            colors={[T.leaf, T.deep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={sc.ctaCard}
          >
            <View style={sc.ctaIconBox}>
              <MaterialCommunityIcons name="sprout" size={28} color={T.white} />
            </View>
            <View style={sc.ctaText}>
              <Text style={sc.ctaTitle}>Launch New Farm Project</Text>
              <Text style={sc.ctaSub}>Get crowd-funded for your next harvest</Text>
            </View>
            <View style={sc.ctaArrow}>
              <Ionicons name="arrow-forward" size={20} color={T.white} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ══ MY PROJECTS ═════════════════════════════════════════════════════ */}
        <View style={sc.section}>
          <View style={sc.sectionHead}>
            <Text style={sc.sectionTitle}>MY PROJECTS</Text>
            {/* FIXED 2: Wired up the "See All" button */}
            <TouchableOpacity onPress={() => router.push('/farmer/projects')}>
              <Text style={sc.sectionLink}>See All</Text>
            </TouchableOpacity>
          </View>

          {myProjects.length === 0 ? (
            <View style={sc.empty}>
              <MaterialCommunityIcons name="tractor" size={40} color={T.accentLight} />
              <Text style={sc.emptyText}>No projects yet. Start your first!</Text>
            </View>
          ) : (
            myProjects.map((p: any) => <ProjectCard key={p.id} project={p} />)
          )}
        </View>

        {/* ══ ACCOUNT SETTINGS ════════════════════════════════════════════════ */}
        <View style={sc.section}>
          <Text style={[sc.sectionTitle, { marginBottom: 14 }]}>ACCOUNT SETTINGS</Text>
          <View style={[sc.menuShadowWrap, SH.xs]}>
            <View style={sc.menuCard}>
              <MenuItem icon="account-edit-outline"  label="Edit Personal Details"        onPress={() => router.push('/profile/edit')}     />
              <View style={sc.menuDivider} />
              <MenuItem icon="shield-lock-outline"   label="Security & Password"          onPress={() => router.push('/profile/security')} />
              <View style={sc.menuDivider} />
              <MenuItem icon="bell-outline"          label="Notification Preferences"     onPress={() => {}}                              />
              <View style={sc.menuDivider} />
              <MenuItem icon="help-circle-outline"   label="Help & Support"               onPress={() => {}}                              />
              <View style={sc.menuDivider} />
              <MenuItem icon="logout"                label="Log Out"                      danger onPress={() => router.replace('/')}      />
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}