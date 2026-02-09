import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function RegisterUserScreen() {
  const router = useRouter();
  
  // --- STATE VARIABLES ---
  const [isInvestor, setIsInvestor] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nic, setNic] = useState('');
  const [loading, setLoading] = useState(false);

  // --- THE REGISTER FUNCTION ---
  const handleRegister = async () => {
    // 1. Basic Validation
    if (!username || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (!isInvestor && !nic) {
      Alert.alert("Error", "Farmers must provide a NIC number");
      return;
    }

    setLoading(true);

    try {
      // ⚠️ USE YOUR HOTSPOT IP HERE
      const API_URL = 'http://192.168.8.178:8080/api/auth/register';

      // 2. Prepare Data for Backend
      const userData = {
        username: username,
        password: password,
        role: isInvestor ? "INVESTOR" : "FARMER",
        nic: isInvestor ? null : nic
      };

      // 3. Send Request
      const response = await axios.post(API_URL, userData);

      // 4. Success!
      if (response.status === 200) {
        const newUserId = response.data.userId; // <--- Capture the ID
        
        Alert.alert("Success", "Account created! Let's set up your profile.", [
          { 
            text: "Continue", 
            // ✅ Navigate to Profile Setup and PASS the ID
            onPress: () => router.push({
              pathname: '/profile/setup',
              params: { userId: newUserId }
            }) 
          }
        ]);
      }

    } catch (error: any) {
      // Handle Errors
      if (error.response) {
        Alert.alert("Registration Failed", error.response.data || "User already exists");
      } else if (error.request) {
        Alert.alert("Network Error", "Could not connect to server. Check your IP address.");
      } else {
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Agrolink today</Text>
        </View>

        {/* Role Selection Toggle */}
        <View style={styles.roleToggleContainer}>
          <TouchableOpacity 
            style={[styles.roleButton, !isInvestor && styles.roleButtonActive]} 
            onPress={() => setIsInvestor(false)}
          >
            <Ionicons name="leaf-outline" size={18} color={!isInvestor ? "#fff" : "#666"} />
            <Text style={[styles.roleText, !isInvestor && styles.roleTextActive]}>Farmer</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.roleButton, isInvestor && styles.roleButtonActive]} 
            onPress={() => setIsInvestor(true)}
          >
            <Ionicons name="briefcase-outline" size={18} color={isInvestor ? "#fff" : "#666"} />
            <Text style={[styles.roleText, isInvestor && styles.roleTextActive]}>Investor</Text>
          </TouchableOpacity>
        </View>

        {/* Form Inputs */}
        <View style={styles.formContainer}>
          
          <Text style={styles.inputLabel}>Username / Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Choose a username" 
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Create password" 
              placeholderTextColor="#aaa" 
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Repeat password" 
              placeholderTextColor="#aaa" 
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Only Show NIC for Farmers */}
          {!isInvestor && (
            <>
              <Text style={styles.inputLabel}>NIC Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="id-card-outline" size={20} color="#666" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="National ID" 
                  placeholderTextColor="#aaa" 
                  value={nic}
                  onChangeText={setNic}
                />
              </View>
            </>
          )}

          {/* Register Button */}
          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister}
            disabled={loading} // Prevent double clicks
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Sign Up as {isInvestor ? "Investor" : "Farmer"}</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.linkText}>Log In</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#fff', paddingHorizontal: 30, paddingTop: 50 },
  header: { alignItems: 'center', marginBottom: 30 },
  logoContainer: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 4 },
    marginBottom: 15,
  },
  logo: { width: 70, height: 70, borderRadius: 35 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666' },
  roleToggleContainer: {
    flexDirection: 'row', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 4, marginBottom: 25,
  },
  roleButton: {
    flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 10, borderRadius: 10,
  },
  roleButtonActive: { backgroundColor: '#1B5E20', shadowColor: '#000', shadowOpacity: 0.1, elevation: 2 },
  roleText: { marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#666' },
  roleTextActive: { color: '#fff' },
  formContainer: { width: '100%' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 8, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F9FAFB', borderRadius: 12, marginBottom: 15,
    paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#EEE',
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#333' },
  registerButton: {
    backgroundColor: '#000', 
    paddingVertical: 16, borderRadius: 12, alignItems: 'center',
    marginTop: 10, elevation: 4,
  },
  registerButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25, marginBottom: 40 },
  footerText: { color: '#666', fontSize: 15 },
  linkText: { color: '#1B5E20', fontWeight: 'bold', fontSize: 15 },
});