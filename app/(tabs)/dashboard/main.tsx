import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import axios from 'axios';

export default function MainDashboard() {
  const router = useRouter();
  
  // ✅ 1. Get Params (Including lastName for future Edit Profile feature)
  const { userId, userImage, lastName } = useLocalSearchParams();

  // ✅ 2. Dynamic Greeting Logic
  const greeting = lastName ? `Hello, ${lastName}` : 'Hello';

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // --- WEATHER & LOCATION STATES ---
  const [city, setCity] = useState("Locating...");
  const [weather, setWeather] = useState({
    temp: "--",
    humidity: "--",
    wind: "--",
    soilTemp: "--"
  });
  const [loadingWeather, setLoadingWeather] = useState(true);

  // --- FETCH LOCATION & WEATHER ON LOAD ---
  useEffect(() => {
    (async () => {
      try {
        // 1. Ask for Location Permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setCity("Location Denied");
          setLoadingWeather(false);
          return;
        }

        // 2. Get GPS Coordinates
        let location = await Location.getCurrentPositionAsync({});
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;

        // 3. Get City Name (Reverse Geocoding)
        let address = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
        if (address.length > 0) {
          setCity(address[0].city || address[0].district || "Unknown Location");
        }

        // 4. Get Weather Data (Using Free Open-Meteo API)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=soil_temperature_0cm&timezone=auto`;
        
        const response = await axios.get(weatherUrl);
        
        setWeather({
          temp: Math.round(response.data.current.temperature_2m).toString(),
          humidity: response.data.current.relative_humidity_2m.toString(),
          wind: Math.round(response.data.current.wind_speed_10m).toString(), // m/s to km/h if needed, keeping default
          soilTemp: Math.round(response.data.hourly.soil_temperature_0cm[0]).toString() // Taking current hour soil temp
        });

      } catch (error) {
        console.error("Weather fetch error:", error);
        setCity("Location Error");
      } finally {
        setLoadingWeather(false);
      }
    })();
  }, []);

  // Mock Data for the Investment Card
  const mockProject = {
    farmerName: "Suriyakumar",
    date: "19th Nov 2025",
    description: "I am a committed farmer seeking investment partners for my fertile paddy field. The land has excellent soil and reliable water, ideal for high-yield rice cultivation.",
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
              {/* ✅ Dynamic Greeting Used Here */}
              <Text style={styles.greetingText}>{greeting}</Text>
              <Text style={styles.dateText}>{dateString}</Text>
            </View>
            
            <TouchableOpacity onPress={() => router.push({ pathname: '/profile/setup' as any, params: { userId } })}>
              {userImage && typeof userImage === 'string' && userImage.length > 10 ? (
                <Image source={{ uri: userImage }} style={styles.profilePic} />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Ionicons name="person" size={24} color="#ccc" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#fff" style={styles.searchIcon} />
            <TextInput style={styles.searchInput} placeholder="Search Here..." placeholderTextColor="#E8F5E9" />
            <Ionicons name="mic-outline" size={20} color="#fff" />
          </View>
        </View>

        {/* --- REAL-TIME WEATHER CARD --- */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={18} color="#1a1a1a" />
              <Text style={styles.locationText}>{city}</Text>
            </View>
            <View style={styles.weatherRow}>
              {/* Change icon based on time or hardcode for now */}
              <Ionicons name={weather.temp > "25" ? "sunny" : "partly-sunny"} size={24} color="#F57F17" />
              <Text style={styles.tempText}>  {loadingWeather ? "--" : `+${weather.temp}`} °C</Text>
            </View>
          </View>

          {loadingWeather ? (
            <ActivityIndicator size="large" color="#4CAF50" style={{ marginVertical: 20 }} />
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Ionicons name="water-outline" size={28} color="#333" />
                <Text style={styles.statLabel}>Humidity</Text>
                <Text style={styles.statValue}>{weather.humidity}%</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="thermometer-outline" size={28} color="#333" />
                <Text style={styles.statLabel}>Soil Temp</Text>
                <Text style={styles.statValue}>{weather.soilTemp} °C</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="leaf-outline" size={28} color="#333" />
                <Text style={styles.statLabel}>Wind</Text>
                <Text style={styles.statValue}>{weather.wind} km/h</Text>
              </View>
            </View>
          )}
          
          <TouchableOpacity>
            <Text style={styles.averageStatsText}>Average statistics</Text>
          </TouchableOpacity>
        </View>

        {/* --- TOP INVESTMENTS SECTION --- */}
        <Text style={styles.sectionTitle}>Top Investments</Text>

        <View style={styles.investmentCard}>
          <Image source={require('../../../assets/logo.png')} style={styles.farmImage} /> 
          
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

          <Text style={styles.descriptionText}>{mockProject.description}</Text>

          <View style={styles.progressContainer}>
            <View style={[styles.progressFill, { width: `${mockProject.fundingProgress}%` }]} />
            <Text style={styles.progressText}>{mockProject.fundingProgress}%</Text>
          </View>

          <TouchableOpacity style={styles.investButton}>
            <Text style={styles.investButtonText}>Invest</Text>
          </TouchableOpacity>
        </View>

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
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard/risk' as any)}>
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
  headerBackground: { backgroundColor: '#4CAF50', width: '100%', paddingTop: 60, paddingBottom: 60, paddingHorizontal: 25, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  greetingText: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  dateText: { fontSize: 14, color: '#E8F5E9', marginTop: 4 },
  profilePic: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#fff' },
  profilePlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 25, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#fff', fontSize: 16 },
  statsCard: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 20, marginTop: -40, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  locationRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  locationText: { marginLeft: 5, fontSize: 16, fontWeight: '600', color: '#1a1a1a', flexShrink: 1 },
  weatherRow: { flexDirection: 'row', alignItems: 'center' },
  tempText: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 15, marginBottom: 15 },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 5, marginBottom: 2 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  averageStatsText: { textAlign: 'center', color: '#4CAF50', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { fontSize: 24, fontWeight: '900', color: '#1a1a1a', alignSelf: 'center', marginTop: 30, marginBottom: 15 },
  investmentCard: { width: '85%', backgroundColor: '#EAEAEA', borderRadius: 20, padding: 15, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  farmImage: { width: '100%', height: 140, borderRadius: 15, backgroundColor: '#ccc', marginBottom: 15 }, 
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
  bottomNavContainer: { position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#4CAF50', width: '85%', height: 60, borderRadius: 30, justifyContent: 'space-around', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
  navItem: { alignItems: 'center', justifyContent: 'center', height: '100%', paddingHorizontal: 15 },
  activeDot: { width: 20, height: 3, backgroundColor: '#fff', borderRadius: 2, marginTop: 4 }
});