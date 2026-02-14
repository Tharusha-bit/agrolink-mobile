import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function MainDashboard() {
  const router = useRouter();
  
  // Get the passed parameters from login
  const { userId, userImage, phoneNumber } = useLocalSearchParams();

  // Get current date formatted
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Mock Data for the Investment Card (We will connect this to the database later)
  const mockProject = {
    farmerName: "Suriyakumar",
    date: "19th Nov 2025",
    description: "I am a committed farmer seeking investment partners for my fertile paddy field. The land has excellent soil and reliable water, ideal for high-yield rice cultivation. Invest with us to support sustainable farming and earn regular returns.",
    fundingProgress: 80,
    trustScore: "100%"
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- GREEN CURVED HEADER --- */}
        <View style={styles.headerBackground}>
          <View style={styles.headerTopRow}>
            <View>
              {/* Fallback to 'Farmer' if no name is set yet */}
              <Text style={styles.greetingText}>Hello, Farmer</Text>
              <Text style={styles.dateText}>{dateString}</Text>
            </View>
            
            {/* Profile Picture */}
            <TouchableOpacity onPress={() => router.push({ pathname: '/profile/setup', params: { userId } })}>
              {userImage && typeof userImage === 'string' && userImage.length > 10 ? (
                <Image source={{ uri: userImage }} style={styles.profilePic} />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Ionicons name="person" size={24} color="#ccc" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#fff" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search Here..." 
              placeholderTextColor="#E8F5E9"
            />
            <Ionicons name="mic-outline" size={20} color="#fff" />
          </View>
        </View>

        {/* --- WEATHER & STATS CARD --- */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={18} color="#1a1a1a" />
              <Text style={styles.locationText}>Anuradhapura</Text>
            </View>
            <View style={styles.weatherRow}>
              <Ionicons name="rainy" size={24} color="#1a1a1a" />
              <Text style={styles.tempText}> +17 °C</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="water-outline" size={28} color="#333" />
              <Text style={styles.statLabel}>Humidity</Text>
              <Text style={styles.statValue}>59%</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="thermometer-outline" size={28} color="#333" />
              <Text style={styles.statLabel}>Soil Temp</Text>
              <Text style={styles.statValue}>22 °C</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="leaf-outline" size={28} color="#333" />
              <Text style={styles.statLabel}>Wind</Text>
              <Text style={styles.statValue}>6 m/s</Text>
            </View>
          </View>
          
          <TouchableOpacity>
            <Text style={styles.averageStatsText}>Average statistics</Text>
          </TouchableOpacity>
        </View>

        {/* --- TOP INVESTMENTS SECTION --- */}
        <Text style={styles.sectionTitle}>Top Investments</Text>

        <View style={styles.investmentCard}>
          {/* Farm Image */}
          <Image source={require('../../../assets/logo.png')} style={styles.farmImage} /> 
          
          {/* Farmer Info */}
          <View style={styles.farmerInfoRow}>
            <View style={styles.farmerIdentity}>
              <View style={styles.smallProfilePic}>
                 <Ionicons name="person" size={16} color="#aaa" />
              </View>
              <View>
                <Text style={styles.farmerName}>{mockProject.farmerName}</Text>
                <Text style={styles.memberSince}>Member since {mockProject.date}</Text>
              </View>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustScore}>{mockProject.trustScore}</Text>
              <Ionicons name="battery-full" size={16} color="#4CAF50" />
            </View>
          </View>

          {/* Description */}
          <Text style={styles.descriptionText}>{mockProject.description}</Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressFill, { width: `${mockProject.fundingProgress}%` }]} />
            <Text style={styles.progressText}>{mockProject.fundingProgress}%</Text>
          </View>

          {/* Invest Button */}
          <TouchableOpacity style={styles.investButton}>
            <Text style={styles.investButtonText}>Invest</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer for bottom nav */}
        <View style={{ height: 100 }} /> 
      </ScrollView>

      {/* --- FLOATING BOTTOM NAVIGATION --- */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={28} color="#fff" />
            <View style={styles.activeDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="storefront-outline" size={28} color="#1B5E20" />
          </TouchableOpacity>
          {/* Route to Risk Tool */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/risk')}>
            <Ionicons name="clipboard-outline" size={28} color="#1B5E20" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="information-circle-outline" size={28} color="#1B5E20" />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  
  // Header
  headerBackground: {
    backgroundColor: '#4CAF50', width: '100%', paddingTop: 60, paddingBottom: 60, paddingHorizontal: 25,
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  greetingText: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  dateText: { fontSize: 14, color: '#E8F5E9', marginTop: 4 },
  profilePic: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#fff' },
  profilePlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  
  // Search
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 25, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#fff', fontSize: 16 },

  // Stats Card
  statsCard: {
    width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 20, marginTop: -40, // Negative margin to overlap header
    elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }
  },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { marginLeft: 5, fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  weatherRow: { flexDirection: 'row', alignItems: 'center' },
  tempText: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 15, marginBottom: 15 },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 5, marginBottom: 2 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  averageStatsText: { textAlign: 'center', color: '#4CAF50', fontWeight: 'bold', fontSize: 14 },

  // Section Title
  sectionTitle: { fontSize: 24, fontWeight: '900', color: '#1a1a1a', alignSelf: 'center', marginTop: 30, marginBottom: 15 },

  // Investment Card
  investmentCard: {
    width: '85%', backgroundColor: '#EAEAEA', borderRadius: 20, padding: 15, alignItems: 'center',
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }
  },
  farmImage: { width: '100%', height: 140, borderRadius: 15, backgroundColor: '#ccc', marginBottom: 15 }, // Temporarily using logo.png as placeholder
  farmerInfoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 10 },
  farmerIdentity: { flexDirection: 'row', alignItems: 'center' },
  smallProfilePic: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  farmerName: { fontSize: 14, fontWeight: 'bold', color: '#1a1a1a' },
  memberSince: { fontSize: 10, color: '#666' },
  trustBadge: { flexDirection: 'row', alignItems: 'center' },
  trustScore: { fontSize: 12, fontWeight: 'bold', color: '#4CAF50', marginRight: 5 },
  descriptionText: { fontSize: 12, color: '#444', textAlign: 'center', lineHeight: 18, marginBottom: 15 },
  progressContainer: { width: '80%', height: 15, backgroundColor: '#D0D0D0', borderRadius: 10, overflow: 'hidden', marginBottom: 15, justifyContent: 'center' },
  progressFill: { height: '100%', backgroundColor: '#4CAF50', position: 'absolute', left: 0 },
  progressText: { textAlign: 'center', fontSize: 10, fontWeight: 'bold', color: '#000', zIndex: 1 },
  investButton: { backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 40, borderRadius: 20 },
  investButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  // Bottom Navigation
  bottomNavContainer: { position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#4CAF50', width: '85%', height: 60, borderRadius: 30, justifyContent: 'space-around', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
  navItem: { alignItems: 'center', justifyContent: 'center', height: '100%', paddingHorizontal: 15 },
  activeDot: { width: 20, height: 3, backgroundColor: '#fff', borderRadius: 2, marginTop: 4 }
});