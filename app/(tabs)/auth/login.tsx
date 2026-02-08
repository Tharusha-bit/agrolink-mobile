import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Switch, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function LoginScreen() {
  const router = useRouter();
  
  // --- STATE VARIABLES ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [stayLogged, setStayLogged] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- LOGIN FUNCTION ---
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    setLoading(true);

    try {
      // ⚠️ USE YOUR HOTSPOT IP HERE
      const API_URL = 'http://172.20.10.6:8080/api/auth/login';

      const response = await axios.post(API_URL, {
        username: username,
        password: password
      });

      // --- SUCCESS ---
      if (response.status === 200) {
        const { role, userId } = response.data;
        
        // You can save these to storage later if needed
        console.log("Logged in as:", role); 

        // Navigate based on Role (For now, both go to Risk Tool)
        if (role === 'FARMER') {
           Alert.alert("Welcome Back!", "Farmer Dashboard loading...");
           router.replace('/dashboard/risk'); 
        } else {
           Alert.alert("Welcome Investor!", "Marketplace loading...");
           // If you have an investor screen, go there. For now:
           router.replace('/dashboard/risk'); 
        }
      }

} catch (error: any) {
      // ✅ 1. Check if it's a specific Backend Error (like 401 or 404)
      if (error.response) {
        console.log("Server responded with:", error.response.status);
        
        // Show the simple alert to the user
        Alert.alert("Login Failed", error.response.data || "Invalid credentials");
      } 
      // ✅ 2. Check if it's a Network Error (Backend down / Wrong IP)
      else if (error.request) {
        Alert.alert("Network Error", "Could not connect to server. Check your IP address.");
      } 
      // ✅ 3. Unknown Error
      else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/logo.png')} 
              style={styles.logo} 
              resizeMode="cover" 
            />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to Agrolink</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          
          <Text style={styles.inputLabel}>Username / Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="farmer@agrolink.lk" 
              placeholderTextColor="#aaa"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="••••••••••" 
              placeholderTextColor="#aaa" 
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Agrolink? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register-user')}>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Supervisor Demo Button */}
          <TouchableOpacity style={styles.demoButton} onPress={() => router.push('/dashboard/risk')}>
            <Text style={styles.demoText}>⚡ Supervisor Demo Access</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#fff', paddingHorizontal: 30, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 },
  },
  logo: { width: 90, height: 90, borderRadius: 45 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
  formContainer: { width: '100%' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 8, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
    borderRadius: 12, marginBottom: 20, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: '#EEE',
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  loginButton: {
    backgroundColor: '#1B5E20', paddingVertical: 16, borderRadius: 12,
    alignItems: 'center', shadowColor: '#1B5E20', shadowOpacity: 0.3,
    shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5, marginBottom: 20
  },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 40 },
  footerText: { color: '#666', fontSize: 15 },
  linkText: { color: '#1B5E20', fontWeight: 'bold', fontSize: 15 },
  demoButton: {
    alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 20,
    backgroundColor: '#FFF8E1', borderRadius: 20, marginBottom: 20
  },
  demoText: { color: '#F57F17', fontSize: 12, fontWeight: 'bold' }
});