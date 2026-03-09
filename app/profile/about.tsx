import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const C = { primary: '#216000', surface: '#F7F9F4', white: '#FFF', text: '#1A2E0D', textMuted: '#8B9E80' };

export default function AboutScreen() {
  const router = useRouter();

  const LinkRow = ({ title }: { title: string }) => (
    <TouchableOpacity style={s.linkRow}>
      <Text style={s.linkText}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color={C.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><Ionicons name="arrow-back" size={24} color={C.white} /></TouchableOpacity>
        <Text style={s.headerTitle}>About</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <View style={s.logoSection}>
          <View style={s.logoBadge}>
            <Image source={require('../../src/assets/logo.png')} style={s.logo} resizeMode="contain" />
          </View>
          <Text style={s.appName}>AgroLink</Text>
          <Text style={s.version}>Version 1.0.0 (Build 42)</Text>
          <Text style={s.tagline}>Bridging the gap between farmers and investors through transparent AgriTech.</Text>
        </View>

        <View style={s.linksCard}>
          <LinkRow title="Terms of Service" />
          <View style={s.divider} />
          <LinkRow title="Privacy Policy" />
          <View style={s.divider} />
          <LinkRow title="Open Source Licenses" />
        </View>

        <Text style={s.copyright}>© 2026 AgroLink Pvt Ltd. All rights reserved.</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.surface },
  header: { backgroundColor: C.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
  headerTitle: { color: C.white, fontSize: 18, fontWeight: '700' },
  content: { padding: 20, alignItems: 'center' },
  
  logoSection: { alignItems: 'center', marginVertical: 30 },
  logoBadge: { width: 100, height: 100, borderRadius: 50, backgroundColor: C.white, justifyContent: 'center', alignItems: 'center', elevation: 8, marginBottom: 15 },
  logo: { width: 65, height: 65 },
  appName: { fontSize: 28, fontWeight: '900', color: C.text },
  version: { fontSize: 13, color: C.textMuted, marginTop: 4, fontWeight: '600' },
  tagline: { textAlign: 'center', fontSize: 14, color: '#555', marginTop: 15, paddingHorizontal: 20, lineHeight: 22 },

  linksCard: { width: '100%', backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 20, elevation: 2, marginTop: 20 },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 18 },
  linkText: { fontSize: 15, fontWeight: '600', color: C.text },
  divider: { height: 1, backgroundColor: '#F0F0F0' },

  copyright: { marginTop: 40, fontSize: 12, color: C.textMuted, fontWeight: '500' },
});