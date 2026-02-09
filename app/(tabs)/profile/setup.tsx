import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// ⚠️ CHANGE THIS TO YOUR ACTUAL USER ID (Temporarily hardcoded for testing)
// In the real app, you will pass this ID after login.
const CURRENT_USER_ID = "698845e5ead35b6845913f16"; // <--- Replace with an ID from your MongoDB

export default function ProfileSetupScreen() {
  const router = useRouter();
  
  const [image, setImage] = useState<string | null>(null);
  const [strength, setStrength] = useState(40);
  const [loading, setLoading] = useState(false);

  // --- 1. PICK IMAGE FUNCTION ---
  const pickImage = async () => {
    // Ask for permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // Keep quality low to save DB space
      base64: true, // Crucial: We need the string!
    });

    if (!result.canceled && result.assets[0].base64) {
      setImage(result.assets[0].uri);
      uploadToBackend(result.assets[0].base64);
    }
  };

  // --- 2. UPLOAD TO BACKEND ---
  const uploadToBackend = async (base64Image: string) => {
    setLoading(true);
    try {
      // ⚠️ USE YOUR HOTSPOT IP
      const API_URL = `http://192.168.8.178:8080/api/user/${CURRENT_USER_ID}/upload-image`;

      const response = await axios.post(API_URL, {
        image: `data:image/jpeg;base64,${base64Image}`
      });

      if (response.status === 200) {
        setStrength(response.data.newStrength); // Should update to 50%
        Alert.alert("Success", "Profile picture updated!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Title */}
      <Text style={styles.title}>Profile strength - {strength} %</Text>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${strength}%` }]} />
      </View>

      {/* Profile Image Circle */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderCircle}>
            <Ionicons name="person" size={80} color="#fff" />
          </View>
        )}
      </View>

      {/* Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadText}>Upload</Text>}
      </TouchableOpacity>

      <Text style={styles.warningText}>
        A clear picture will be helpful to maintain the profile strength
      </Text>

      {/* Grid Menu Icons */}
      <View style={styles.gridContainer}>
        {/* Profile */}
        <View style={styles.gridItem}>
          <View style={styles.iconCircle}>
            <Ionicons name="person" size={30} color="#fff" />
          </View>
          <Text style={styles.iconLabel}>Profile</Text>
        </View>

        {/* Security */}
        <View style={styles.gridItem}>
           <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={30} color="#fff" />
          </View>
          <Text style={styles.iconLabel}>Security</Text>
        </View>

        {/* Edit */}
        <View style={styles.gridItem}>
           <View style={[styles.iconCircle, {backgroundColor: '#5CB85C'}]}>
            <Ionicons name="pencil" size={30} color="#fff" />
          </View>
          <Text style={styles.iconLabel}>Edit</Text>
        </View>

        {/* Help */}
        <View style={styles.gridItem}>
           <View style={[styles.iconCircle, {borderWidth: 2, borderColor: '#5CB85C', backgroundColor: 'white'}]}>
            <Ionicons name="help" size={30} color="#5CB85C" />
          </View>
          <Text style={styles.iconLabel}>Help</Text>
        </View>
      </View>

      {/* Footer */}
      <TouchableOpacity onPress={() => router.push('/dashboard/risk')}>
        <Text style={styles.backLink}>Back to Home</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 30, alignItems: 'center', paddingTop: 60 },
  
  title: { fontSize: 20, color: '#4CAF50', fontWeight: 'bold', marginBottom: 20 },
  
  progressBarContainer: {
    width: '100%', height: 25, backgroundColor: '#E0E0E0', borderRadius: 15, overflow: 'hidden', marginBottom: 40
  },
  progressBarFill: { height: '100%', backgroundColor: '#5CB85C' },

  imageContainer: { marginBottom: 20 },
  placeholderCircle: {
    width: 140, height: 140, borderRadius: 70, backgroundColor: '#CCC',
    justifyContent: 'center', alignItems: 'center'
  },
  profileImage: { width: 140, height: 140, borderRadius: 70 },

  uploadButton: {
    backgroundColor: '#000', paddingVertical: 12, paddingHorizontal: 50, borderRadius: 25, marginBottom: 15
  },
  uploadText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  warningText: { color: 'red', textAlign: 'center', fontSize: 12, marginBottom: 40, paddingHorizontal: 20 },

  // Grid Layout
  gridContainer: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '80%', marginBottom: 40
  },
  gridItem: { alignItems: 'center', width: '40%', marginBottom: 20 },
  
  iconCircle: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#4CAF50',
    justifyContent: 'center', alignItems: 'center', marginBottom: 8
  },
  iconLabel: { color: '#000', fontSize: 14 },

  backLink: { color: '#4CAF50', fontWeight: 'bold', fontSize: 16, textDecorationLine: 'underline' }
});