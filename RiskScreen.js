import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const RiskScreen = () => {
  const [district, setDistrict] = useState("ANURADHAPURA");
  const [season, setSeason] = useState("Yala");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const checkRisk = async () => {
    setLoading(true);
    setResult(null);

    try {
      // ⚠️ IMPORTANT:
      // If using Android Emulator, use 'http://10.0.2.2:8080'
      // If using Real Device, use your Laptop's IP (e.g., 'http://192.168.1.5:8080')
      const API_URL = "http://172.20.10.6:8080/api/risk/predict";
      // We are using a fake farmerID "1001" for testing
      const response = await axios.get(API_URL, {
        params: {
          farmerId: "1001",
          district: district,
          season: season,
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to Backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 AI Risk Assessment</Text>

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>District:</Text>
        <TextInput
          style={styles.input}
          value={district}
          onChangeText={setDistrict}
        />

        <Text style={styles.label}>Season (Yala/Maha):</Text>
        <TextInput
          style={styles.input}
          value={season}
          onChangeText={setSeason}
        />
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={checkRisk}>
        <Text style={styles.buttonText}>CALCULATE RISK</Text>
      </TouchableOpacity>

      {/* Loading Spinner */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#00C853"
          style={{ marginTop: 20 }}
        />
      )}

      {/* Results Display */}
      {result && (
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                result.baseRiskScore > 50 ? "#FFEBEE" : "#E8F5E9",
            }, // Red if High, Green if Low
          ]}
        >
          <Text style={styles.scoreTitle}>Risk Score</Text>
          <Text
            style={[
              styles.score,
              { color: result.baseRiskScore > 50 ? "#D32F2F" : "#2E7D32" },
            ]}
          >
            {result.baseRiskScore}/100
          </Text>

          <Text style={styles.badge}>{result.riskLabel}</Text>
          <Text style={styles.info}>
            Base risk for {result.district} is usually higher, but Farmer
            Credibility reduced it.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5, color: "#666" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#00C853",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  card: {
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  scoreTitle: { fontSize: 18, color: "#555" },
  score: { fontSize: 48, fontWeight: "bold", marginVertical: 10 },
  badge: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  info: { textAlign: "center", color: "#777", marginTop: 10 },
});

export default RiskScreen;
