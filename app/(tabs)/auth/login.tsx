import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [stayLogged, setStayLogged] = useState(false);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
      <View style={styles.container}>
        <View style={styles.topShape} />
        
        <View style={styles.header}>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to continue</Text>
        </View>

        <View style={styles.card}>
          
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Email / Username" placeholderTextColor="#aaa" />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry />
          </View>

          <View style={styles.row}>
            <View style={styles.switchRow}>
              <Switch value={stayLogged} onValueChange={setStayLogged} trackColor={{ false: "#ccc", true: "#81C784" }} thumbColor={stayLogged ? "#2E7D32" : "#f4f3f4"} />
              <Text style={styles.switchText}>Remember me</Text>
            </View>
            <TouchableOpacity><Text style={styles.forgotText}>Forgot Password?</Text></TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={() => console.log("Login Pressed")}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here? </Text>
            {/* ✅ Points to the new Register User file */}
            <TouchableOpacity onPress={() => router.push('/auth/register-user')}>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DEMO BUTTON */}
        <TouchableOpacity style={styles.demoButton} onPress={() => router.push('/dashboard/risk')}>
          <Text style={styles.demoText}>⚡ Supervisor Demo Access</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F8E9', justifyContent: 'center', alignItems: 'center' },
  topShape: { position: 'absolute', top: -80, left: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: '#C8E6C9', opacity: 0.6 },
  
  header: { alignItems: 'center', marginBottom: 25 },
  logo: { width: 100, height: 100, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1B5E20' },
  subtitle: { fontSize: 16, color: '#558B2F' },

  card: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },

  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 12, marginBottom: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: '#EEE' },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#333' },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  switchRow: { flexDirection: 'row', alignItems: 'center' },
  switchText: { fontSize: 13, color: '#666', marginLeft: 5 },
  forgotText: { fontSize: 13, color: '#C62828', fontWeight: '600' },

  loginButton: { backgroundColor: '#1B5E20', paddingVertical: 15, borderRadius: 12, alignItems: 'center', shadowColor: '#1B5E20', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#666' },
  linkText: { color: '#00C853', fontWeight: 'bold' },

  demoButton: { position: 'absolute', bottom: 40, padding: 10, backgroundColor: '#FFEBEE', borderRadius: 20, paddingHorizontal: 20 },
  demoText: { color: '#C62828', fontWeight: 'bold', fontSize: 12 }
});