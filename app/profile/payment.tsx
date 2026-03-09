import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const C = { primary: '#216000', surface: '#F7F9F4', white: '#FFF', text: '#1A2E0D', textMuted: '#8B9E80', accent: '#76C442' };

export default function PaymentScreen() {
  const router = useRouter();

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><Ionicons name="arrow-back" size={24} color={C.white} /></TouchableOpacity>
        <Text style={s.headerTitle}>Payment Account</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.sectionTitle}>Linked Bank Account</Text>
        
        {/* Bank Card UI */}
        <View style={s.bankCard}>
          <View style={s.bankHeader}>
            <MaterialCommunityIcons name="bank" size={28} color={C.white} />
            <Text style={s.bankName}>Commercial Bank</Text>
          </View>
          <Text style={s.accountNumber}>**** **** **** 4589</Text>
          <View style={s.bankFooter}>
            <View>
              <Text style={s.cardLabel}>Account Holder</Text>
              <Text style={s.cardValue}>W.T.P. Fernando</Text>
            </View>
            <View style={s.verifiedBadge}>
              <MaterialCommunityIcons name="check-decagram" size={14} color={C.primary} />
              <Text style={s.verifiedText}>Verified</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={s.editBtn}>
          <Ionicons name="add-circle-outline" size={20} color={C.primary} />
          <Text style={s.editBtnText}>Link New Bank Account</Text>
        </TouchableOpacity>

        <Text style={[s.sectionTitle, { marginTop: 30 }]}>Recent Transactions</Text>
        <View style={s.historyCard}>
          <View style={s.historyRow}>
            <View style={s.historyIcon}><Ionicons name="arrow-down" size={18} color="#2E7D32" /></View>
            <View style={{ flex: 1 }}>
              <Text style={s.historyTitle}>Payout to Bank</Text>
              <Text style={s.historyDate}>24 Nov 2025</Text>
            </View>
            <Text style={s.historyAmount}>LKR 50,000</Text>
          </View>
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
  sectionTitle: { fontSize: 14, fontWeight: '800', color: C.textMuted, textTransform: 'uppercase', marginBottom: 15, marginLeft: 5, letterSpacing: 0.5 },
  
  bankCard: { backgroundColor: '#1A4410', borderRadius: 20, padding: 25, elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: {width:0, height:5} },
  bankHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 30 },
  bankName: { color: C.white, fontSize: 18, fontWeight: '700', letterSpacing: 1 },
  accountNumber: { color: C.white, fontSize: 24, fontWeight: '800', letterSpacing: 3, marginBottom: 25 },
  bankFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  cardValue: { color: C.white, fontSize: 15, fontWeight: '700', marginTop: 2 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.accent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  verifiedText: { color: C.primary, fontSize: 12, fontWeight: '800' },

  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#E8F5E1', padding: 16, borderRadius: 16, marginTop: 20, borderWidth: 1, borderColor: '#C8E6C9' },
  editBtnText: { color: C.primary, fontWeight: '700', fontSize: 15 },

  historyCard: { backgroundColor: C.white, borderRadius: 20, padding: 20, elevation: 3 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  historyIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  historyTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  historyDate: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  historyAmount: { fontSize: 15, fontWeight: '800', color: '#2E7D32' },
});