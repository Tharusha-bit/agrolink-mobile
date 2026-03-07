import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useProjects } from '../../src/context/ProjectContext';

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#216000',
  primaryLight: '#2E8B00',
  primaryPale: '#E8F5E1',
  white: '#FFFFFF',
  surface: '#F7F9F4',
  text: '#1A2E0D',
  textMuted: '#9BB08A',
  border: '#DDE8D4',
  accent: '#76C442',
  accentWarm: '#F5A623',
  danger: '#D32F2F',
};

const SHADOWS = {
  md: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
    android: { elevation: 5 },
  }),
  fab: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 8
  }
};

// ─── Component: Detailed Project Card ──────────────────────────────────────────
const ProjectCard = ({ project }: any) => {
  const router = useRouter(); 
  const percent = Math.round(project.progress * 100);
  const isActive = project.progress > 0;

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      // This correctly routes to your [id].tsx file!
      onPress={() => router.push(`/farmer/project-manage/${project.id}`)}
    >
      <View style={[s.card, SHADOWS.md]}>
        {/* Image & Status Overlay */}
        <View style={s.imageContainer}>
          <Image source={{ uri: project.image }} style={s.cardImage} />
          <View style={s.statusOverlay}>
            <View style={[s.statusBadge, { backgroundColor: isActive ? COLORS.primary : COLORS.accentWarm }]}>
              <Text style={s.statusText}>{isActive ? 'Active Funding' : 'Pending Review'}</Text>
            </View>
          </View>
        </View>

        <View style={s.cardBody}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>{project.title}</Text>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color={COLORS.textMuted} />
          </View>

          <Text style={s.cardLoc}>
            <Ionicons name="location-sharp" size={12} color={COLORS.accent} /> {project.location}
          </Text>

          {/* Financials Grid */}
          <View style={s.statsGrid}>
            <View>
              <Text style={s.statLabel}>Goal</Text>
              <Text style={s.statValue}>LKR {project.goal.toLocaleString()}</Text>
            </View>
            <View style={s.statDivider} />
            <View>
              <Text style={s.statLabel}>Raised</Text>
              <Text style={[s.statValue, { color: COLORS.primary }]}>LKR {project.raised.toLocaleString()}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={s.progressContainer}>
            <View style={s.progressRow}>
              <Text style={s.progressLabel}>Progress</Text>
              <Text style={s.progressPct}>{percent}%</Text>
            </View>
            <View style={s.track}>
              <View style={[s.fill, { width: `${percent}%` }]} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function FarmerProjectsScreen() {
  const router = useRouter();
  const { projects } = useProjects();
  
  const [filter, setFilter] = useState('All'); // 'All', 'Active', 'Pending'
  const [searchQuery, setSearchQuery] = useState(''); // FIXED 1: Added search state

  // Filter Logic: Get only THIS farmer's projects, then apply tabs and search
  const displayedProjects = projects.filter((p: any) => {
    // 1. Must belong to farmer
    const isMyProject = p.farmer.includes("Me") || p.farmer.includes("Suriyakumar");
    if (!isMyProject) return false;

    // 2. Must match search query
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // 3. Must match active tab
    if (filter === 'Active') return p.progress > 0;
    if (filter === 'Pending') return p.progress === 0;
    
    return true; // 'All' tab
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── HEADER ── */}
      <View style={s.header}>
        <View style={s.decCircle} />
        <Text style={s.headerTitle}>My Harvests</Text>
        <Text style={s.headerSub}>Manage your funding campaigns</Text>

        {/* Search Bar */}
        <View style={s.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput 
            placeholder="Search your projects..." 
            placeholderTextColor={COLORS.textMuted} 
            style={s.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery} // FIXED 1: Wired up search input
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        
        {/* ── FILTER TABS ── */}
        <View style={s.filterRow}>
          {['All', 'Active', 'Pending'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[s.filterChip, filter === tab && s.filterChipActive]}
              onPress={() => setFilter(tab)}
            >
              <Text style={[s.filterText, filter === tab && s.filterTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── LIST ── */}
        {displayedProjects.length === 0 ? (
          <View style={s.emptyState}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7486/7486747.png' }} 
              style={s.emptyIcon} 
            />
            <Text style={s.emptyTitle}>No Projects Found</Text>
            <Text style={s.emptySub}>Try adjusting your search or filters.</Text>
          </View>
        ) : (
          displayedProjects.map((p: any) => <ProjectCard key={p.id} project={p} />)
        )}

      </ScrollView>

      {/* ── FLOATING ACTION BUTTON (FAB) ── */}
      <TouchableOpacity 
        style={[s.fab, SHADOWS.fab]} 
        onPress={() => router.push('/project/create')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={32} color={COLORS.white} />
      </TouchableOpacity>

    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { paddingBottom: 120 }, // Increased padding for bottom tabs + fab

  /* HEADER */
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 25,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    position: 'relative', overflow: 'hidden'
  },
  decCircle: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: COLORS.primaryLight, top: -80, right: -50, opacity: 0.3
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.white },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4, marginBottom: 20 },
  
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 12,
    paddingHorizontal: 12, height: 45
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: COLORS.text },

  /* FILTERS */
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, marginBottom: 10, gap: 10 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  filterTextActive: { color: COLORS.white },

  /* CARD */
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20, marginTop: 15,
    borderRadius: 20, overflow: 'hidden'
  },
  imageContainer: { height: 140, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  statusOverlay: { position: 'absolute', top: 12, left: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '700', color: COLORS.white, textTransform: 'uppercase' },

  cardBody: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, flex: 1, marginRight: 10 },
  cardLoc: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },

  statsGrid: { flexDirection: 'row', backgroundColor: '#F9F9F9', borderRadius: 12, padding: 12, marginTop: 15 },
  statDivider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: 20 },
  statLabel: { fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase' },
  statValue: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginTop: 2 },

  progressContainer: { marginTop: 15 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  progressPct: { fontSize: 12, fontWeight: '800', color: COLORS.primary },
  track: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 3 },

  /* EMPTY STATE */
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyIcon: { width: 80, height: 80, opacity: 0.5, marginBottom: 15 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  emptySub: { fontSize: 14, color: COLORS.textMuted, marginTop: 5 },

  /* FAB */
  fab: {
    position: 'absolute', 
    bottom: 95, // FIXED 2: Moved up so it doesn't hide behind the _layout.tsx bottom tab bar
    right: 20,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    zIndex: 100
  }
});