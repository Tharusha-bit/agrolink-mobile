import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const C = { primary: '#216000', surface: '#F7F9F4', white: '#FFF', text: '#1A2E0D', textMuted: '#8B9E80', border: '#DDE8D4' };

export default function NotificationsScreen() {
  const router = useRouter();
  
  const [investments, setInvestments] = useState(true);
  const [weather, setWeather] = useState(true);
  const [messages, setMessages] = useState(true);
  const[marketing, setMarketing] = useState(false);

  const ToggleRow = ({ icon, title, desc, value, onValueChange }: any) => (
    <View style={s.row}>
      <View style={s.iconBox}><Ionicons name={icon} size={22} color={C.primary} /></View>
      <View style={s.textWrap}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.desc}>{desc}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: '#ddd', true: C.primary }} thumbColor="#fff" />
    </View>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><Ionicons name="arrow-back" size={24} color={C.white} /></TouchableOpacity>
        <Text style={s.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.sectionTitle}>Alert Settings</Text>
        <View style={s.card}>
          <ToggleRow icon="cash-outline" title="Investment Updates" desc="Alerts when funds are received or withdrawn" value={investments} onValueChange={setInvestments} />
          <View style={s.divider} />
          <ToggleRow icon="partly-sunny-outline" title="AI Weather Alerts" desc="Critical weather warnings for your region" value={weather} onValueChange={setWeather} />
          <View style={s.divider} />
          <ToggleRow icon="chatbubble-ellipses-outline" title="Direct Messages" desc="When investors or admins message you" value={messages} onValueChange={setMessages} />
        </View>

        <Text style={s.sectionTitle}>Other</Text>
        <View style={s.card}>
          <ToggleRow icon="megaphone-outline" title="AgroLink News" desc="Promotions, new features, and tips" value={marketing} onValueChange={setMarketing} />
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
  sectionTitle: { fontSize: 14, fontWeight: '800', color: C.textMuted, textTransform: 'uppercase', marginBottom: 10, marginLeft: 10, letterSpacing: 0.5 },
  card: { backgroundColor: C.white, borderRadius: 20, padding: 15, marginBottom: 25, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#E8F5E1', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textWrap: { flex: 1, paddingRight: 10 },
  title: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 2 },
  desc: { fontSize: 12, color: C.textMuted, lineHeight: 16 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 5 },
});