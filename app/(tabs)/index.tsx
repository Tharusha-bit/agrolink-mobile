import React, { useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth/login');
    }, 2500); // 2.5 seconds feels snappier
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>AgroLink</Text>
        <Text style={styles.tagline}>Future of Agri-Finance</Text>
        <ActivityIndicator size="large" color="#00C853" style={styles.spinner} />
      </View>
      
      <Text style={styles.footer}>© 2026 Agrolink Inc.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center' },
  logo: { width: 180, height: 180, marginBottom: 10 },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#1B5E20' },
  tagline: { fontSize: 16, color: '#558B2F', marginBottom: 40, letterSpacing: 1 },
  spinner: { transform: [{ scale: 1.2 }] },
  footer: { position: 'absolute', bottom: 30, color: '#aaa', fontSize: 12 }
});