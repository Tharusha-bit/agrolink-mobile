import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// ✅ Import useProjects and the Project type to ensure data safety
import { type Project, useProjects } from '../../../src/context/ProjectContext';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  primary: '#216000',
  primaryLight: '#2E8B00',
  primaryPale: '#E8F5E1',
  white: '#FFFFFF',
  surface: '#F7F9F4',
  text: '#1A2E0D',
  textMuted: '#8B9E80',
  border: '#DDE8D4',
  accent: '#76C442',
  gold: '#D4A017',
  danger: '#E53935',
};

const SH = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  md: { shadowColor: '#216000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

// 1. Project Overview Card
const ProjectOverviewCard = ({ project }: { project: Project }) => {
  // ✅ Calculate progress safely (Progress field was removed from interface)
  const progress = project.goal > 0 ? project.raised / project.goal : 0;
  const percent = Math.round(progress * 100);
  const isActive = progress < 1;

  return (
    <View style={[s.card, SH.md]}>
      <View style={s.cardHeaderRow}>
        <View style={{ flex: 1 }}>
          <View style={[s.badge, { backgroundColor: isActive ? C.primaryPale : '#FFF3E0' }]}>
            <Text style={[s.badgeText, { color: isActive ? C.primary : C.gold }]}>
              {isActive ? 'ACTIVE CAMPAIGN' : 'FUNDING COMPLETE'}
            </Text>
          </View>
          <Text style={s.projectTitle}>{project.title}</Text>
        </View>
      </View>

      <View style={s.progressSection}>
        <View style={s.progressLabels}>
          <Text style={s.progressLabel}>Funded</Text>
          <Text style={s.progressPercent}>{percent}%</Text>
        </View>
        <View style={s.track}>
          <View style={[s.fill, { width: `${Math.min(percent, 100)}%` }]} />
        </View>
      </View>

      <View style={s.statsRow}>
        <View style={s.statBox}>
          <Text style={s.statLabel}>Total Raised</Text>
          <Text style={s.statValue}>LKR {project.raised.toLocaleString()}</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.statBox}>
          <Text style={s.statLabel}>Target Goal</Text>
          <Text style={s.statValueMuted}>LKR {project.goal.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

// 2. Action Button Grid
const ActionGrid = ({ onUpdate, projectId }: { onUpdate: () => void, projectId: string }) => {
  const router = useRouter();

  const ActionItem = ({ icon, label, onPress, color = C.primary, bg }: any) => (
    <TouchableOpacity style={[s.actionItem, SH.sm]} onPress={onPress} activeOpacity={0.8}>
      <View style={[s.actionIcon, { backgroundColor: bg || color + '15' }]}>
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>
      <Text style={s.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={s.actionGrid}>
      {/* ✅ RESTORED ACTIVE ROUTES */}
      <ActionItem icon="camera-plus" label="Post Update" onPress={onUpdate} color={C.accent} bg="#F1F8E9" />
      <ActionItem icon="chat-processing" label="Chat" onPress={() => router.push('/farmer/project-manage/chat')} color={C.primary} bg="#E8F5E1" />
      <ActionItem icon="chart-box" label="Analytics" onPress={() => router.push('/farmer/project-manage/analytics')} color="#1565C0" bg="#E3F2FD" />
      <ActionItem icon="file-document-edit" label="Edit Info" onPress={() => router.push('/farmer/project-manage/project-edit')} color="#E65100" bg="#FFF3E0" />
    </View>
  );
};

// 3. Investor Row
const InvestorRow = ({ investor }: { investor: any }) => (
  <View style={s.investorRow}>
    <View style={s.invAvatar}>
      <Text style={s.invInitials}>{investor.name?.charAt(0) || 'U'}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={s.invName}>{investor.name}</Text>
      <Text style={s.invDate}>{investor.date}</Text>
    </View>
    <View style={s.invAmountBadge}>
      <Text style={s.invAmount}>+ {investor.amount.toLocaleString()}</Text>
    </View>
  </View>
);

// 4. Timeline Update Item
const TimelineItem = ({ update, isLast }: { update: any, isLast: boolean }) => (
  <View style={s.timelineItem}>
    <View style={s.timelineLeft}>
      <View style={s.timelineDot} />
      {!isLast && <View style={s.timelineLine} />}
    </View>
    <View style={[s.timelineContent, SH.sm]}>
      <View style={s.timelineHeader}>
        <Text style={s.updateTitle}>{update.title}</Text>
        <Text style={s.updateDate}>{update.date}</Text>
      </View>
      <Text style={s.updateDesc}>{update.description}</Text>
    </View>
  </View>
);

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function ManageProjectScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { projects } = useProjects();
  
  const[modalVisible, setModalVisible] = useState(false);
  const [updateTitle, setUpdateTitle] = useState('');
  const[updateDesc, setUpdateDesc] = useState('');

  // Robust Data Fetching (Compare safely)
  const projectData = projects?.find((p) => String(p.id) === String(id));
  const [localUpdates, setLocalUpdates] = useState(projectData?.updates ||[]);

  // Handle Loading State
  if (!projectData) {
    return (
      <View style={s.loadingContainer}>
        <Text style={{ color: C.textMuted }}>Project not found.</Text>
        <TouchableOpacity onPress={() => router.push('/farmer/projects')}>
          <Text style={{ color: C.primary, fontWeight: '700', marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handlePostUpdate = () => {
    if (!updateTitle || !updateDesc) {
      Alert.alert("Missing Info", "Please add a title and description.");
      return;
    }

    // ✅ FIXED: Added required 'id' and mapped to 'imageUrl' to match ProjectContext interface
    const newUpdate = {
      id: Math.random().toString(), 
      date: "Just Now",
      title: updateTitle,
      description: updateDesc,
      imageUrl: "" 
    };

    setLocalUpdates([newUpdate, ...localUpdates]);
    setUpdateTitle('');
    setUpdateDesc('');
    setModalVisible(false);
    Alert.alert("Success", "Update posted to investors!");
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      
      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.push('/farmer/projects')} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={C.white} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Manage Project</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. OVERVIEW */}
        <ProjectOverviewCard project={projectData} />

        {/* 2. ACTIONS */}
        <ActionGrid 
          onUpdate={() => setModalVisible(true)} 
          projectId={String(projectData.id)} 
        />

        {/* 3. INVESTORS */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Investors</Text>
          <View style={s.countBadge}>
            <Text style={s.countText}>{projectData.investors?.length || 0}</Text>
          </View>
        </View>

        {(!projectData.investors || projectData.investors.length === 0) ? (
          <View style={s.emptyState}>
            <MaterialCommunityIcons name="account-group-outline" size={30} color={C.textMuted} />
            <Text style={s.emptyText}>No investors yet. Share your project!</Text>
          </View>
        ) : (
          <View style={s.listContainer}>
            {projectData.investors.map((inv, index) => (
              <InvestorRow key={index} investor={inv} />
            ))}
          </View>
        )}

        {/* 4. UPDATES TIMELINE */}
        <Text style={s.sectionTitle}>Project Updates</Text>
        
        {localUpdates.length === 0 ? (
          <View style={s.emptyState}>
            <MaterialCommunityIcons name="timeline-text-outline" size={30} color={C.textMuted} />
            <Text style={s.emptyText}>No updates posted yet.</Text>
          </View>
        ) : (
          <View style={s.timelineContainer}>
            {localUpdates.map((upd, index) => (
              <TimelineItem key={index} update={upd} isLast={index === localUpdates.length - 1} />
            ))}
          </View>
        )}

      </ScrollView>

      {/* ── UPDATE MODAL ── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Post Project Update</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={C.textMuted} />
              </TouchableOpacity>
            </View>
            
            <Text style={s.inputLabel}>Update Title</Text>
            <TextInput 
              style={s.input} 
              placeholder="e.g. Sowing Completed" 
              placeholderTextColor="#999"
              value={updateTitle}
              onChangeText={setUpdateTitle}
            />
            
            <Text style={s.inputLabel}>Description</Text>
            <TextInput 
              style={[s.input, { height: 100, textAlignVertical: 'top' }]} 
              placeholder="Describe the progress..." 
              placeholderTextColor="#999"
              multiline 
              value={updateDesc}
              onChangeText={setUpdateDesc}
            />
            
            <TouchableOpacity style={s.attachBtn}>
              <Ionicons name="camera-outline" size={20} color={C.primary} />
              <Text style={s.attachText}>Attach Photo Evidence</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={s.postBtn} onPress={handlePostUpdate}>
              <Text style={s.postBtnText}>Post Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.surface },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 120 },

  /* HEADER */
  header: {
    backgroundColor: C.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
  headerTitle: { color: C.white, fontSize: 18, fontWeight: '700' },

  /* OVERVIEW CARD */
  card: {
    backgroundColor: C.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  projectTitle: { fontSize: 20, fontWeight: '800', color: C.text },
  
  progressSection: { marginBottom: 15 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, fontWeight: '600', color: C.textMuted },
  progressPercent: { fontSize: 14, fontWeight: '800', color: C.primary },
  track: { height: 8, backgroundColor: C.border, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: C.accent, borderRadius: 4 },

  statsRow: { flexDirection: 'row', backgroundColor: '#F9F9F9', borderRadius: 12, padding: 12 },
  statBox: { flex: 1 },
  statDivider: { width: 1, backgroundColor: C.border, marginHorizontal: 20 },
  statLabel: { fontSize: 11, color: C.textMuted, textTransform: 'uppercase', marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '800', color: C.primary },
  statValueMuted: { fontSize: 16, fontWeight: '700', color: C.textMuted },

  /* ACTIONS */
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20 },
  actionItem: { width: '48%', backgroundColor: C.white, padding: 15, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  actionIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 13, fontWeight: '700', color: C.text },

  /* SECTIONS */
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: C.text, marginRight: 10, marginLeft: 20 },
  countBadge: { backgroundColor: C.primaryPale, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  countText: { fontSize: 11, fontWeight: '800', color: C.primary },

  /* INVESTORS */
  listContainer: { paddingHorizontal: 20, marginBottom: 20 },
  investorRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, padding: 12, borderRadius: 14, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  invAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primaryPale, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  invInitials: { color: C.primary, fontWeight: '700' },
  invName: { fontSize: 14, fontWeight: '700', color: C.text },
  invDate: { fontSize: 11, color: C.textMuted },
  invAmountBadge: { backgroundColor: '#F0F5ED', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  invAmount: { fontSize: 13, fontWeight: '700', color: C.primary },

  /* TIMELINE */
  timelineContainer: { paddingHorizontal: 20 },
  timelineItem: { flexDirection: 'row', marginBottom: 0 },
  timelineLeft: { alignItems: 'center', marginRight: 15, width: 20 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: C.accent, borderWidth: 2, borderColor: C.white },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#E0E0E0', marginTop: -2, marginBottom: -2 },
  timelineContent: { backgroundColor: C.white, padding: 15, borderRadius: 14, flex: 1, marginBottom: 16 },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  updateTitle: { fontSize: 14, fontWeight: '700', color: C.text },
  updateDate: { fontSize: 11, color: C.textMuted },
  updateDesc: { fontSize: 13, color: '#555', lineHeight: 18 },

  /* EMPTY STATES */
  emptyState: { alignItems: 'center', padding: 20, backgroundColor: '#F0F0F0', marginHorizontal: 20, borderRadius: 12, marginBottom: 20 },
  emptyText: { color: C.textMuted, fontSize: 13, fontStyle: 'italic', marginTop: 10 },

  /* MODAL */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: C.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 450 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: C.text },
  inputLabel: { fontSize: 12, fontWeight: '700', color: C.textMuted, marginBottom: 6, textTransform: 'uppercase' },
  input: { width: '100%', backgroundColor: '#F7F9F4', padding: 14, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: C.border, fontSize: 15 },
  attachBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderWidth: 1, borderColor: C.primary, borderRadius: 14, borderStyle: 'dashed', marginBottom: 20 },
  attachText: { color: C.primary, fontWeight: '600' },
  postBtn: { backgroundColor: C.primary, width: '100%', padding: 16, borderRadius: 16, alignItems: 'center', shadowColor: C.primary, shadowOffset: {width:0, height:4}, shadowOpacity:0.3, shadowRadius:8, elevation:5 },
  postBtnText: { color: C.white, fontWeight: '700', fontSize: 16 },
});