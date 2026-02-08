import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // We use icons for a premium look

export default function RegisterUserScreen() {
  const router = useRouter();
  const [isInvestor, setIsInvestor] = useState(false); // Default is Farmer (false)

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Top Decorative Blob */}
        <View style={styles.topShape} />

        <View style={styles.header}>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Agrolink as a {isInvestor ? "Investor" : "Farmer"}</Text>
        </View>

        <View style={styles.card}>
          
          {/* --- ROLE TOGGLE --- */}
          <View style={styles.roleContainer}>
            <Text style={[styles.roleText, !isInvestor && styles.activeRole]}>Farmer</Text>
            <Switch
              value={isInvestor}
              onValueChange={setIsInvestor}
              trackColor={{ false: "#A5D6A7", true: "#81C784" }}
              thumbColor={isInvestor ? "#1B5E20" : "#4CAF50"}
              style={{ marginHorizontal: 10 }}
            />
            <Text style={[styles.roleText, isInvestor && styles.activeRole]}>Investor</Text>
          </View>

          {/* Username */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Email / Username" placeholderTextColor="#aaa" />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#aaa" secureTextEntry />
          </View>

          {/* NIC Number (Only for Farmers) */}
          {!isInvestor && (
            <View style={styles.inputContainer}>
              <Ionicons name="id-card-outline" size={20} color="#666" style={styles.icon} />
              <TextInput style={styles.input} placeholder="NIC Number" placeholderTextColor="#aaa" />
            </View>
          )}

          <TouchableOpacity style={styles.signupButton}>
            <Text style={styles.signupButtonText}>REGISTER</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.linkText}>Login here</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F1F8E9', justifyContent: 'center', alignItems: 'center' },
  topShape: { position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: '#C8E6C9', opacity: 0.5 },
  
  header: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 100, height: 100, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1B5E20' },
  subtitle: { fontSize: 16, color: '#558B2F', marginTop: 5 },

  card: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },

  roleContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 25, backgroundColor: '#F1F8E9', padding: 10, borderRadius: 30 },
  roleText: { fontSize: 16, color: '#888', fontWeight: '600' },
  activeRole: { color: '#2E7D32', fontWeight: 'bold' },

  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 12, marginBottom: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: '#EEE' },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#333' },

  signupButton: { backgroundColor: '#00C853', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowColor: '#00C853', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  signupButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#666' },
  linkText: { color: '#00C853', fontWeight: 'bold' }
});