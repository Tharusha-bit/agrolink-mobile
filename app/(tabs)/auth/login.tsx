import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Switch, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [stayLogged, setStayLogged] = useState(false);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        
        {/* ✅ 1. Green Curved Header Background */}
        <View style={styles.headerBackground}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subText}>Sign in to your account</Text>
          </View>
        </View>

        {/* ✅ 2. Floating Circular Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="cover" 
          />
        </View>

        {/* ✅ 3. The Login Form Card */}
        <View style={styles.formContainer}>
          
          {/* Email Input */}
          <Text style={styles.inputLabel}>Username / Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#1B5E20" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="e.g. farmer@agrolink.lk" 
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#1B5E20" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="••••••••••" 
              placeholderTextColor="#999" 
              secureTextEntry
            />
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.row}>
            <View style={styles.switchRow}>
              <Switch 
                value={stayLogged} 
                onValueChange={setStayLogged} 
                trackColor={{ false: "#E0E0E0", true: "#A5D6A7" }} 
                thumbColor={stayLogged ? "#2E7D32" : "#f4f3f4"} 
              />
              <Text style={styles.switchText}>Remember me</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={() => console.log("Login Pressed")}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register-user')}>
              <Text style={styles.linkText}>Register Now</Text>
            </TouchableOpacity>
          </View>

          {/* ⚠️ SUPERVISOR DEMO BUTTON (Kept Safe Here) */}
          <TouchableOpacity style={styles.demoButton} onPress={() => router.push('/dashboard/risk')}>
            <Text style={styles.demoText}>⚡ Supervisor Demo Access</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#F5F5F5' },
  
  // Header Style
  headerBackground: {
    backgroundColor: '#1B5E20', // Dark Green
    height: 280,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50, // Push text up slightly
  },
  headerContent: { alignItems: 'center' },
  welcomeText: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  subText: { fontSize: 16, color: '#A5D6A7' }, // Light green text

  // Logo Style - Circular & Floating
  logoContainer: {
    alignSelf: 'center',
    marginTop: -60, // Pulls it up into the green header
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 60, // Makes it a perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // Android Shadow
    shadowColor: '#000', // iOS Shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 20,
  },
  logo: {
    width: 110, // Slightly smaller than container to show white border effect
    height: 110,
    borderRadius: 55,
  },

  // Form Container
  formContainer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  
  inputLabel: { fontSize: 14, color: '#333', fontWeight: '600', marginBottom: 8, marginLeft: 5 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    // Soft shadow for inputs
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },

  // Row for Switch/Forgot Pass
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  switchRow: { flexDirection: 'row', alignItems: 'center' },
  switchText: { fontSize: 14, color: '#666', marginLeft: 8 },
  forgotText: { fontSize: 14, color: '#1B5E20', fontWeight: 'bold' },

  // Login Button
  loginButton: {
    backgroundColor: '#00C853', // Bright Green
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#00C853',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },

  // Footer
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  footerText: { color: '#666', fontSize: 15 },
  linkText: { color: '#1B5E20', fontWeight: 'bold', fontSize: 15 },

  // Demo Button (Subtle)
  demoButton: {
    marginTop: 40,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FFEBEE',
    borderRadius: 20,
  },
  demoText: { color: '#C62828', fontSize: 12, fontWeight: 'bold' }
});