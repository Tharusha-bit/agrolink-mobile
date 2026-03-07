import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = { primary: '#216000', surface: '#F7F9F4', white: '#FFF', text: '#1A2E0D' };

export default function TrustScoreScreen() {
  const router = useRouter();

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={s.header}>
        {/* Added a hit-slop/padding to make the back button easier to tap */}
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={s.title}>Trust Score</Text>
        
        {/* Adjusted width to match the padded back button for perfect centering */}
        <View style={{ width: 34 }} /> 
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.scoreCircle}>
          <Text style={s.scoreBig}>4.8</Text>
          <Text style={s.scoreLabel}>Excellent</Text>
        </View>

        <Text style={s.sectionTitle}>How to improve?</Text>
        
        {/* CHECKLIST */}
        <View style={s.card}>
          <View style={s.row}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
            <Text style={s.item}>NIC Verification Complete</Text>
            <Text style={s.points}>+20</Text>
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
            <Text style={s.item}>Land Ownership Proof</Text>
            <Text style={s.points}>+30</Text>
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <Ionicons name="ellipse-outline" size={24} color="#999" />
            <Text style={s.item}>3 Successful Harvests</Text>
            <Text style={s.points}>0/3</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { 
    backgroundColor: COLORS.primary, 
    paddingHorizontal: 20, 
    paddingTop: 60, // Increased slightly to clear modern phone notches
    paddingBottom: 20,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  
  // FIXED: Added paddingBottom: 120 so it doesn't get covered by the bottom Tab Bar!
  content: { alignItems: 'center', padding: 20, paddingBottom: 120 }, 
  
  scoreCircle: { width: 160, height: 160, borderRadius: 80, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 10, marginBottom: 30, borderWidth: 5, borderColor: COLORS.primary },
  scoreBig: { fontSize: 48, fontWeight: '900', color: COLORS.primary },
  scoreLabel: { fontSize: 14, color: '#777', fontWeight: '600' },
  sectionTitle: { alignSelf: 'flex-start', fontSize: 16, fontWeight: '700', marginBottom: 15, color: COLORS.text },
  card: { backgroundColor: '#fff', width: '100%', borderRadius: 16, padding: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  item: { flex: 1, marginLeft: 10, fontSize: 15, fontWeight: '600', color: COLORS.text },
  points: { color: COLORS.primary, fontWeight: '800', fontSize: 15 },
  divider: { height: 1, backgroundColor: '#EEE' }
});