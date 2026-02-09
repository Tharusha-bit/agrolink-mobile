import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function LoginScreen() {
  const router = useRouter();
  
  // ✅ Changed to PhoneNumber
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please enter phone number and password");
      return;
    }

    setLoading(true);

    try {
      // ⚠️ USE YOUR HOTSPOT IP HERE
      const API_URL = 'http://192.168.8.178:8080/api/auth/login';

      const response = await axios.post(API_URL, {
        phoneNumber: phoneNumber, // ✅ Sending Phone
        password: password
      });

      if (response.status === 200) {
        const { role, userId, profileImage } = response.data;
        
        router.replace({
          pathname: '/dashboard/risk',
          params: { userId: userId, userImage: profileImage }
        }); 
      }

    } catch (error: any) {
      if (error.response) {
        Alert.alert("Login Failed", error.response.data || "Invalid credentials");
      } else if (error.request) {
        Alert.alert("Network Error", "Check your IP address.");
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="cover" />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to Agrolink</Text>
        </View>

        <View style={styles.formContainer}>
          
          {/* ✅ Phone Input */}
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="0771234567" 
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
            <TextInput style={styles.input} placeholder="••••••••••" placeholderTextColor="#aaa" secureTextEntry value={password} onChangeText={setPassword}/>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Log In</Text>}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Agrolink? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register-user')}>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
          </View>

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
  logo: { width: 90, height: 90, borderRadius: 45, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
  formContainer: { width: '100%' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 8, marginLeft: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, marginBottom: 20, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: '#EEE' },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  loginButton: { backgroundColor: '#1B5E20', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 40 },
  footerText: { color: '#666', fontSize: 15 },
  linkText: { color: '#1B5E20', fontWeight: 'bold', fontSize: 15 },
  demoButton: { alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#FFF8E1', borderRadius: 20, marginBottom: 20 },
  demoText: { color: '#F57F17', fontSize: 12, fontWeight: 'bold' }
});