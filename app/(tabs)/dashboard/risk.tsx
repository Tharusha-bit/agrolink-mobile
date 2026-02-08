import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Switch, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useRouter } from 'expo-router';

// Define what the backend response looks like
interface RiskResult {
  baseRiskScore: number;
  riskLabel: string;
  district: string;
  season: string;
}

export default function RiskDashboard() {
  const router = useRouter();

  // --- STATE VARIABLES ---
  const [district, setDistrict] = useState('ANURADHAPURA');
  const [season, setSeason] = useState('Yala');
  const [isProFarmer, setIsProFarmer] = useState(true); // Toggle for Demo
  
  const [loading, setLoading] = useState(false);
const [result, setResult] = useState<RiskResult | null>(null);

  // --- API FUNCTION ---
  const checkRisk = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // ⚠️ IMPORTANT: Use your HOTSPOT IP here (172.20.10.6)
      // If you are at university on a different Wi-Fi, you must update this IP!
      const API_URL = 'http://192.168.8.178:8080/api/risk/predict';
      
      const farmerIdToUse = isProFarmer ? '1001' : '9999';

      const response = await axios.get(API_URL, {
        params: {
          farmerId: farmerIdToUse, 
          district: district, 
          season: season
        }
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert('Error: Could not connect to Backend. Check IP!');
    } finally {
      setLoading(false);
    }
  };

  // --- HELPER: GET COLORS ---
  const getRiskColor = (score:number) => {
    if (score < 25) return '#2E7D32'; // Green
    if (score < 55) return '#F9A825'; // Yellow/Orange
    return '#C62828'; // Red
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* HEADER WITH LOGOUT */}
      <View style={styles.headerRow}>
        <Image source={require('../../../assets/logo.png')} style={styles.logoSmall} resizeMode="contain" />
        <TouchableOpacity onPress={() => router.replace('/auth/login')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.headerTitle}>Risk Assessment Tool</Text>

      {/* --- FORM CARD --- */}
      <View style={styles.card}>
        
        {/* District Selector */}
        <Text style={styles.label}>Select District:</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={district}
            onValueChange={(itemValue) => setDistrict(itemValue)}>
            <Picker.Item label="Anuradhapura" value="ANURADHAPURA" />
            <Picker.Item label="Ampara" value="AMPARA" />
            <Picker.Item label="Kandy" value="KANDY" />
            <Picker.Item label="Polonnaruwa" value="POLONNARUWA" />
            <Picker.Item label="Kurunegala" value="KURUNEGALA" />
            <Picker.Item label="Hambantota" value="HAMBANTOTA" />
            <Picker.Item label="Monaragala" value="MONARAGALA" />
          </Picker>
        </View>

        {/* Season Selector */}
        <Text style={styles.label}>Select Season:</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={season}
            onValueChange={(itemValue) => setSeason(itemValue)}>
            <Picker.Item label="Yala Season" value="Yala" />
            <Picker.Item label="Maha Season" value="Maha" />
          </Picker>
        </View>

        {/* DEMO MODE TOGGLE */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleText}>Verified Farmer (Demo)</Text>
          <Switch 
            value={isProFarmer}
            onValueChange={setIsProFarmer}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isProFarmer ? "#00C853" : "#f4f3f4"}
          />
        </View>
        <Text style={styles.hint}>
          {isProFarmer ? "Simulating Expert Farmer (Low Risk)" : "Simulating New Farmer (High Risk)"}
        </Text>

        {/* Calculate Button */}
        <TouchableOpacity style={styles.button} onPress={checkRisk}>
          <Text style={styles.buttonText}>CALCULATE RISK</Text>
        </TouchableOpacity>
      </View>

      {/* --- RESULTS SECTION --- */}
      {loading && <ActivityIndicator size="large" color="#00C853" style={{marginTop: 20}} />}

      {result && (
        <View style={[styles.resultCard, { borderColor: getRiskColor(result.baseRiskScore) }]}>
          <Text style={styles.resultTitle}>Risk Assessment</Text>
          
          <Text style={[styles.score, { color: getRiskColor(result.baseRiskScore) }]}>
            {result.baseRiskScore}%
          </Text>
          
          <View style={[styles.badge, { backgroundColor: getRiskColor(result.baseRiskScore) }]}>
            <Text style={styles.badgeText}>{result.riskLabel}</Text>
          </View>

          <Text style={styles.explanation}>
            Based on historical climatic data for {result.district} ({result.season}) 
            {isProFarmer ? " and adjusted for Farmer Credibility." : "."}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f8f9fa', flexGrow: 1, alignItems: 'center' },
  
  headerRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  logoSmall: { width: 40, height: 40 },
  logoutText: { color: '#C62828', fontWeight: 'bold' },

  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1B5E20', marginBottom: 20 },
  
  card: { width: '100%', backgroundColor: 'white', borderRadius: 12, padding: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 10 },
  pickerBox: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fafafa', marginBottom: 10 },
  
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  toggleText: { fontSize: 16, color: '#333' },
  hint: { fontSize: 12, color: '#999', marginBottom: 20, textAlign: 'right' },

  button: { backgroundColor: '#00C853', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  resultCard: { marginTop: 25, width: '100%', backgroundColor: 'white', borderRadius: 12, padding: 25, alignItems: 'center', borderWidth: 2 },
  resultTitle: { fontSize: 18, color: '#555', marginBottom: 10 },
  score: { fontSize: 56, fontWeight: 'bold', marginBottom: 10 },
  badge: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 20, marginBottom: 15 },
  badgeText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  explanation: { textAlign: 'center', color: '#777', fontSize: 14, lineHeight: 20 },
});