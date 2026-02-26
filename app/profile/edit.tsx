import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import CustomInput from '../../src/components/CustomInput';
import { Colors } from '../../src/constants/Colors';

export default function EditProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header with Avatar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        
        <View style={styles.avatarContainer}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />
          <View style={styles.editIcon}>
            <MaterialCommunityIcons name="camera" size={16} color="#fff" />
          </View>
        </View>
        <Text style={styles.idText}>ID: 20321212</Text>
      </View>

      {/* Form Fields (Matching Image 3) */}
      <ScrollView contentContainerStyle={styles.form}>
        <CustomInput label="First Name" value="Tharusha" />
        <CustomInput label="Last Name" value="Nimnath" />
        <CustomInput label="Display Name" value="S.J.J.T.Nimnath" />
        <CustomInput label="Address" value="100/3-C, Jaffna Road" />
        <CustomInput label="NIC Number" value="200526404904" />
        <CustomInput label="Phone Number" value="0701723003" />

        <Button 
          mode="contained" 
          onPress={() => router.back()} 
          style={styles.saveBtn}
        >
          Save Profile
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    backgroundColor: Colors.primary, 
    paddingTop: 50, 
    paddingBottom: 30, 
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: { position: 'absolute', top: 50, left: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  
  avatarContainer: { position: 'relative', marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
  editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#000', padding: 6, borderRadius: 15 },
  idText: { color: '#E8F5E9', fontSize: 14 },

  form: { padding: 25 },
  saveBtn: { backgroundColor: '#000', borderRadius: 30, marginTop: 20, paddingVertical: 6 }
});