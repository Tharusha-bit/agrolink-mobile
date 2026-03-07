import { Ionicons } from '@expo/vector-icons';
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
// ✅ Correct relative path
import { useProjects } from '../../../src/context/ProjectContext';

const COLORS = { primary: '#216000', surface: '#F7F9F4', white: '#FFF', text: '#1A2E0D', border: '#DDE8D4', accent: '#76C442', textMuted: '#999' };

export default function ManageProjectScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { projects } = useProjects();
  
  const[modalVisible, setModalVisible] = useState(false);
  
  // Form State for Updates
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDesc, setUpdateDesc] = useState('');

  // FIXED 1: Safely compare IDs by converting both to strings to prevent mismatch crashes
  const projectData = projects?.find((p: any) => String(p.id) === String(id)) || projects?.[0];

  // Local state to simulate adding updates immediately
  const [localUpdates, setLocalUpdates] = useState(projectData?.updates ||[]);

  // FIXED 2: Handle edge case where project data might be completely empty/loading
  if (!projectData) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: COLORS.textMuted }}>Loading project...</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, padding: 10 }}>
          <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handlePostUpdate = () => {
    if (!updateTitle || !updateDesc) {
      Alert.alert("Missing Info", "Please add a title and description.");
      return;
    }

    // 1. Create new update object
    const newUpdate = {
      date: "Just Now",
      title: updateTitle,
      description: updateDesc,
      image: ""
    };

    // 2. Add to list (Visual only for demo)
    setLocalUpdates([newUpdate, ...localUpdates]);
    
    // 3. Reset & Close
    setUpdateTitle('');
    setUpdateDesc('');
    setModalVisible(false);
    Alert.alert("Success", "Update posted to investors!");
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Manage Project</Text>
        
        {/* Chat Button */}
        <TouchableOpacity style={s.chatBtn} onPress={() => router.push('/farmer/chat')}>
          <Ionicons name="chatbubbles-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* FIXED 3: Added paddingBottom to clear the floating tab bar */}
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        
        {/* SUMMARY CARD */}
        <View style={s.card}>
          <Text style={s.projectTitle}>{projectData.title}</Text>
          <View style={s.progressRow}>
            <Text style={s.raised}>LKR {projectData?.raised?.toLocaleString() || 0}</Text>
            <Text style={s.goal}> / {projectData?.goal?.toLocaleString() || 0}</Text>
          </View>
          <View style={s.track}>
            <View style={[s.fill, { width: `${(projectData.progress || 0) * 100}%` }]} />
          </View>
          <Text style={s.statusText}>{Math.round((projectData.progress || 0) * 100)}% Funded</Text>
        </View>

        {/* INVESTORS LIST */}
        <Text style={s.sectionTitle}>Investors ({projectData.investors?.length || 0})</Text>
        {projectData.investors?.length === 0 || !projectData.investors ? (
            <Text style={{color:'#999', marginBottom: 20}}>No investors yet.</Text>
        ) : (
            projectData.investors?.map((inv: any, index: number) => (
            <View key={index} style={s.investorRow}>
                <View style={s.invAvatar}><Text style={s.invInitials}>{inv.name[0]}</Text></View>
                <View style={{flex:1}}>
                  <Text style={s.invName}>{inv.name}</Text>
                  <Text style={s.invDate}>{inv.date}</Text>
                </View>
                <Text style={s.invAmount}>+ LKR {inv.amount?.toLocaleString()}</Text>
            </View>
            ))
        )}

        {/* UPDATES TIMELINE */}
        <View style={s.updateHeader}>
          <Text style={s.sectionTitle}>Project Updates</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={s.addUpdateLink}>+ Add Update</Text>
          </TouchableOpacity>
        </View>

        {localUpdates.length === 0 ? (
            <Text style={{color:'#999', fontStyle:'italic'}}>No updates posted yet.</Text>
        ) : (
            localUpdates.map((upd: any, index: number) => (
            <View key={index} style={s.timelineItem}>
                <View style={s.timelineLeft}>
                  <View style={s.timelineDot} />
                  <View style={s.timelineLine} />
                </View>
                <View style={s.timelineContent}>
                  <Text style={s.updateDate}>{upd.date}</Text>
                  <Text style={s.updateTitle}>{upd.title}</Text>
                  <Text style={s.updateDesc}>{upd.description}</Text>
                </View>
            </View>
            ))
        )}

      </ScrollView>

      {/* POST UPDATE MODAL (Popup) */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Post New Update</Text>
            
            <TextInput 
                style={s.input} 
                placeholder="Update Title (e.g. Fertilizing)" 
                placeholderTextColor="#999"
                value={updateTitle}
                onChangeText={setUpdateTitle}
            />
            
            <TextInput 
                style={[s.input, {height: 80, textAlignVertical: 'top'}]} 
                placeholder="Description..." 
                placeholderTextColor="#999"
                multiline 
                value={updateDesc}
                onChangeText={setUpdateDesc}
            />
            
            <TouchableOpacity style={s.uploadBtn}>
              <Ionicons name="camera" size={20} color={COLORS.primary} />
              <Text style={s.uploadText}>Attach Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={s.postBtn} onPress={handlePostUpdate}>
              <Text style={s.postBtnText}>Post Update</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{marginTop:15, padding: 5}}>
              <Text style={{color:'#777', fontWeight: '600'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 20 },
  header: { backgroundColor: COLORS.primary, paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { padding: 5 },
  chatBtn: { padding: 5 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },

  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 25, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  projectTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 10 },
  progressRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  raised: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
  goal: { fontSize: 14, color: '#999' },
  track: { height: 8, backgroundColor: COLORS.border, borderRadius: 4 },
  fill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 4 },
  statusText: { marginTop: 8, fontSize: 12, color: COLORS.accent, fontWeight: '700' },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 15 },
  
  investorRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 10 },
  invAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F5E1', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  invInitials: { color: COLORS.primary, fontWeight: '700' },
  invName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  invDate: { fontSize: 11, color: '#999' },
  invAmount: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  updateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10 },
  addUpdateLink: { color: COLORS.primary, fontWeight: '700', padding: 5 },

  timelineItem: { flexDirection: 'row', marginBottom: 0 },
  timelineLeft: { alignItems: 'center', marginRight: 15, width: 20 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.accent },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#DDD', marginTop: 4 },
  timelineContent: { backgroundColor: '#fff', padding: 15, borderRadius: 12, flex: 1, marginBottom: 15 },
  updateDate: { fontSize: 11, color: '#999', marginBottom: 2 },
  updateTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  updateDesc: { fontSize: 13, color: '#555', marginTop: 4 },

  /* MODAL */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20, color: COLORS.text },
  input: { width: '100%', backgroundColor: '#F7F9F4', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#DDD', color: COLORS.text },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  uploadText: { color: COLORS.primary, fontWeight: '600' },
  postBtn: { backgroundColor: COLORS.primary, width: '100%', padding: 15, borderRadius: 12, alignItems: 'center' },
  postBtnText: { color: '#fff', fontWeight: '700' },
});