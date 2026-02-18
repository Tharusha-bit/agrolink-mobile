import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import CustomInput from '../src/components/CustomInput';

export default function LoginScreen() {
  const router = useRouter();
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Ensure logo.png exists in src/assets/ */}
        <Image source={require('../src/assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>AgroLink</Text>
        <Text style={styles.tagline}>Future of Agri-Finance</Text>
      </View>

      {/* Login Form */}
      <View style={styles.form}>
        <CustomInput label="Username" placeholder="| sample@email.com" />
        <CustomInput label="Password" placeholder="****************" secureTextEntry />

        <View style={styles.checkboxContainer}>
          <Checkbox.Android 
            status={stayLoggedIn ? 'checked' : 'unchecked'}
            onPress={() => setStayLoggedIn(!stayLoggedIn)}
            color="#000"
          />
          <Text style={styles.checkboxText}>stay logged in ?</Text>
        </View>

        {/* Go to Home Page on Click */}
        <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/home')}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Go to Signup Page on Click */}
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.footerLink}>I don’t have a account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 30, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 100, height: 100 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#4caf50' }, // Green
  tagline: { fontSize: 14, color: '#5d4037', fontWeight: 'bold' },
  form: { width: '100%' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  checkboxText: { fontSize: 14 },
  loginButton: {
    backgroundColor: '#000', 
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footerLink: { textAlign: 'center', marginTop: 10, fontSize: 14 },
});