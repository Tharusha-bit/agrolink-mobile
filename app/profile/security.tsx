import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Checkbox, Text } from 'react-native-paper';
import CustomInput from '../../src/components/CustomInput'; // Reusing your Green Pills
import { Colors } from '../../src/constants/Colors';

export default function SecurityScreen() {
  const router = useRouter();
  const [agree, setAgree] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Green Header Area */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>Secure your AgroLink account</Text>
      </View>

      {/* White Card for Inputs */}
      <View style={styles.card}>
        <CustomInput label="Current Password" placeholder="********" secureTextEntry />
        <CustomInput label="New Password" placeholder="********" secureTextEntry />
        <CustomInput label="Re-enter Password" placeholder="********" secureTextEntry />

        {/* Checkbox */}
        <View style={styles.checkboxRow}>
          <Checkbox.Android 
            status={agree ? 'checked' : 'unchecked'} 
            onPress={() => setAgree(!agree)} 
            color={Colors.primary} 
          />
          <Text style={styles.checkboxText}>
            I agree to the password changes. Your password will be changed after this attempt.
          </Text>
        </View>

        {/* Save Button */}
        <Button 
          mode="contained" 
          onPress={() => router.back()} 
          style={styles.saveBtn}
          labelStyle={{ fontSize: 16, paddingVertical: 5 }}
        >
          Save Changes
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.primary }, // Green Background like Image 2
  header: { padding: 30, paddingTop: 60 },
  backBtn: { marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#E8F5E9', opacity: 0.8 },
  
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    flex: 1, // Fill remaining space
    elevation: 10
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 20, paddingRight: 20 },
  checkboxText: { fontSize: 12, color: 'gray', marginLeft: 10, lineHeight: 18 },
  saveBtn: { backgroundColor: '#000', borderRadius: 30, marginTop: 10 } // Black Button like Image 2
});