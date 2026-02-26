import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { Colors } from '../../src/constants/Colors';

// Define the type for the props to avoid TypeScript warnings (Optional but good practice)
interface ProfileOptionProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  isDestructive?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();

  // Reusable Option Component
  const ProfileOption = ({ icon, label, onPress, isDestructive = false }: ProfileOptionProps) => (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: isDestructive ? '#FFEBEE' : '#E8F5E9' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={isDestructive ? '#D32F2F' : Colors.primary} />
      </View>
      <Text style={[styles.optionLabel, isDestructive && { color: '#D32F2F' }]}>{label}</Text>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* 1. Profile Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>
      
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
           <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />
           <View style={styles.cameraBtn}>
             <MaterialCommunityIcons name="camera" size={16} color="#fff" />
           </View>
        </View>
        <Text style={styles.name}>W.T.P. Fernando</Text>
        <Text style={styles.role}>Farmer | ID: 20321212</Text>
        
        {/* Profile Strength */}
        <View style={styles.strengthContainer}>
          <Text style={styles.strengthLabel}>Profile Strength: 40%</Text>
          <View style={styles.strengthBarBg}>
            <View style={[styles.strengthBarFill, { width: '40%' }]} />
          </View>
          <Text style={styles.strengthHint}>Complete your profile to increase trust.</Text>
        </View>
      </View>

      {/* 2. Menu Options */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionHeader}>Account Settings</Text>
        
        {/* ✅ FIXED: Linked to 'app/profile/edit.tsx' */}
        <ProfileOption 
          icon="account-edit" 
          label="Edit Personal Details" 
          onPress={() => router.push('/profile/edit')} 
        />
        
        {/* ✅ FIXED: Linked to 'app/profile/security.tsx' */}
        <ProfileOption 
          icon="shield-lock" 
          label="Security & Password" 
          onPress={() => router.push('/profile/security')} 
        />
        
        <ProfileOption icon="bank" label="Payment Methods" onPress={() => console.log('Bank')} />

        <Text style={styles.sectionHeader}>Support</Text>
        <ProfileOption icon="help-circle" label="Help & Support" onPress={() => console.log('Help')} />
        <ProfileOption icon="file-document" label="Terms & Conditions" onPress={() => console.log('Terms')} />

        <Divider style={{ marginVertical: 20 }} />

        {/* ✅ FIXED: Logout goes back to Login Screen */}
        <ProfileOption icon="logout" label="Log Out" onPress={() => router.replace('/')} isDestructive />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: Colors.primary, height: 150, padding: 20, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 30 },
  
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -50,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
  },
  avatarContainer: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#fff' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.primary, padding: 8, borderRadius: 20 },
  
  name: { fontSize: 22, fontWeight: 'bold', marginTop: 10, color: '#333' },
  role: { fontSize: 14, color: 'gray', marginBottom: 15 },

  strengthContainer: { width: '100%', marginTop: 10 },
  strengthLabel: { fontSize: 14, fontWeight: '600', color: Colors.primary, marginBottom: 5 },
  strengthBarBg: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, width: '100%' },
  strengthBarFill: { height: 8, backgroundColor: '#66BB6A', borderRadius: 4 },
  strengthHint: { fontSize: 11, color: '#D32F2F', marginTop: 5, textAlign: 'center' },

  menuContainer: { padding: 20 },
  sectionHeader: { fontSize: 14, fontWeight: 'bold', color: 'gray', marginBottom: 10, marginTop: 10, marginLeft: 10 },
  
  optionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 10, elevation: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  optionLabel: { flex: 1, fontSize: 16, fontWeight: '500', color: '#333' },
});