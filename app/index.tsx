import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Wait 2.5 seconds, then go to Login
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        {/* MAKE SURE YOUR LOGO IS IN src/assets/logo.png */}
        <Image source={require('../src/assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>AgroLink</Text>
        <Text style={styles.tagline}>Future of Agri-Finance</Text>
      </View>

      {/* Loading Spinner (Green Ring) */}
      <ActivityIndicator size="large" color="#00c853" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 50 },
  logo: { width: 120, height: 120, marginBottom: 10 },
  appName: { fontSize: 32, fontWeight: 'bold', color: 'Colors.primary' }, // Green Title
  tagline: { fontSize: 16, color: '#5d4037', fontWeight: 'bold' }, // Brownish tagline
  loader: { transform: [{ scale: 1.5 }] }, // Make spinner bigger
});