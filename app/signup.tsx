import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomInput from '../src/components/CustomInput';

export default function SignupScreen() {
  const router = useRouter();
  // State to toggle between Farmer and Investor view
  const [isFarmer, setIsFarmer] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../src/assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.appName}>AgroLink</Text>
          <Text style={styles.tagline}>Future of Agri-Finance</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <CustomInput label="Username" placeholder="| sample@email.com" />
          <CustomInput label="Password" />
          <CustomInput label="Confirm password" />

          {/* Conditional Fields based on User Type */}
          {isFarmer ? (
            <>
              {/* Farmer sees this */}
              <CustomInput label="Farmer number" />
              <CustomInput label="NIC Number" />
            </>
          ) : (
            <>
              {/* Investor just sees NIC (Based on image 4) */}
              <CustomInput label="NIC Number" />
            </>
          )}

          {/* Signup Button */}
          <TouchableOpacity style={styles.signupButton} onPress={() => console.log("Sign up clicked")}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>

          {/* Toggle Link */}
          <TouchableOpacity onPress={() => setIsFarmer(!isFarmer)}>
            <Text style={styles.toggleText}>
              {isFarmer ? "I am a investor" : "I am a farmer"}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 30, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 90, height: 90 },
  appName: { fontSize: 26, fontWeight: 'bold', color: 'Colors.primary' },
  tagline: { fontSize: 13, color: '#5d4037', fontWeight: 'bold' },
  
  form: { width: '100%' },
  
  signupButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  toggleText: { textAlign: 'center', fontSize: 14, fontWeight: '500' },
});