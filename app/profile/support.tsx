import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const C = { primary: '#216000', surface: '#F7F9F4', white: '#FFF', text: '#1A2E0D', textMuted: '#8B9E80', border: '#DDE8D4' };

export default function SupportScreen() {
  const router = useRouter();

  const SupportCard = ({ icon, title, sub }: any) => (
    <TouchableOpacity style={s.supportCard} activeOpacity={0.7}>
      <View style={s.iconBox}><Ionicons name={icon} size={24} color={C.primary} /></View>
      <View>
        <Text style={s.cardTitle}>{title}</Text>
        <Text style={s.cardSub}>{sub}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><Ionicons name="arrow-back" size={24} color={C.white} /></TouchableOpacity>
        <Text style={s.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.introText}>How can we help you today?</Text>
        
        <View style={s.grid}>
          <SupportCard icon="chatbubbles-outline" title="Live Chat" sub="Typically replies in 5m" />
          <SupportCard icon="call-outline" title="Call Us" sub="Mon-Fri, 9AM-5PM" />
          <SupportCard icon="mail-outline" title="Email" sub="support@agrolink.lk" />
        </View>

        <Text style={s.sectionTitle}>Frequently Asked Questions</Text>
        <View style={s.faqContainer}>
          {['How is the Trust Score calculated?', 'When do I get my funded money?', 'How does AI risk analysis work?', 'Can I edit an active project?'].map((q, i) => (
            <TouchableOpacity key={i} style={s.faqRow}>
              <Text style={s.faqText}>{q}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={C.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.surface },
  header: { backgroundColor: C.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
  headerTitle: { color: C.white, fontSize: 18, fontWeight: '700' },
  content: { padding: 20 },
  introText: { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 20 },
  
  grid: { gap: 12, marginBottom: 30 },
  supportCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, padding: 15, borderRadius: 16, gap: 15, elevation: 2 },
  iconBox: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#E8F5E1', justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: C.text },
  cardSub: { fontSize: 12, color: C.textMuted, marginTop: 2 },

  sectionTitle: { fontSize: 14, fontWeight: '800', color: C.textMuted, textTransform: 'uppercase', marginBottom: 15, marginLeft: 5 },
  faqContainer: { backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 20, elevation: 2 },
  faqRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  faqText: { fontSize: 14, fontWeight: '600', color: C.text },
});