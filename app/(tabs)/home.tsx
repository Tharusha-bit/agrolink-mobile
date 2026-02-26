import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, ProgressBar, Searchbar, Text } from 'react-native-paper';
import { Colors } from '../../src/constants/Colors';

// Mock Data for Horizontal Scroll
const INVESTMENTS = [
  { id: '1', farmer: 'Suriyakumar', crop: 'Paddy Rice', location: 'Anuradhapura', funding: 0.8, image: 'https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg', risk: 'Low' },
  { id: '2', farmer: 'Nimali', crop: 'Ceylon Tea', location: 'Nuwara Eliya', funding: 0.4, image: 'https://cdn.pixabay.com/photo/2015/09/23/08/17/tea-953159_1280.jpg', risk: 'Med' },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const renderInvestmentCard = ({ item }) => (
    <Card style={styles.investCard}>
      <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.tagRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>{item.crop}</Text></View>
          <View style={[styles.badge, { backgroundColor: '#FFF3E0' }]}><Text style={{...styles.badgeText, color: '#F57C00'}}>Risk: {item.risk}</Text></View>
        </View>
        <Text style={styles.farmerName}>{item.farmer}</Text>
        <Text style={styles.location}><MaterialCommunityIcons name="map-marker" size={14}/> {item.location}</Text>
        
        <Text style={styles.progressLabel}>Funding: {item.funding * 100}%</Text>
        <ProgressBar progress={item.funding} color={Colors.primary} style={styles.progressBar} />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* 1. Modern Green Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Fernando 👋</Text>
          <Text style={styles.date}>Monday, 24 Nov 2025</Text>
        </View>
        <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* 2. Floating Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search crops, farmers..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={{ fontSize: 14 }}
            iconColor={Colors.primary}
          />
        </View>

        {/* 3. Weather Widget (Glassmorphism Style) */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherRow}>
            <View>
              <Text style={styles.weatherCity}><MaterialCommunityIcons name="map-marker" /> Anuradhapura</Text>
              <Text style={styles.temp}>27°C</Text>
              <Text style={styles.weatherDesc}>Light Rain</Text>
            </View>
            <MaterialCommunityIcons name="weather-partly-rainy" size={60} color="#fff" />
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.stat}>💧 59% Hum</Text>
            <Text style={styles.stat}>🌱 22°C Soil</Text>
            <Text style={styles.stat}>💨 6m/s</Text>
          </View>
        </View>

        {/* 4. Top Investments (Horizontal Scroll) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Investments</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={INVESTMENTS}
          renderItem={renderInvestmentCard}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20 }}
        />

        {/* 5. Quick Actions Grid */}
        <Text style={[styles.sectionTitle, { marginLeft: 20, marginTop: 20 }]}>Quick Actions</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.actionBtn}>
             <MaterialCommunityIcons name="robot" size={30} color={Colors.primary} />
             <Text style={styles.actionText}>AI Portfolio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
             <MaterialCommunityIcons name="calculator" size={30} color={Colors.primary} />
             <Text style={styles.actionText}>Calculator</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  date: { color: '#E8F5E9', fontSize: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#fff' },
  
  searchContainer: { paddingHorizontal: 20, marginTop: -25 },
  searchBar: { borderRadius: 15, elevation: 4, backgroundColor: '#fff', height: 50 },

  weatherCard: {
    margin: 20,
    backgroundColor: '#66BB6A', // Lighter Green
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  weatherRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  weatherCity: { color: '#fff', fontSize: 14, opacity: 0.9 },
  temp: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  weatherDesc: { color: '#fff', fontSize: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, backgroundColor: 'rgba(0,0,0,0.1)', padding: 10, borderRadius: 10 },
  stat: { color: '#fff', fontSize: 12, fontWeight: '600' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  seeAll: { color: Colors.primary, fontWeight: '600' },

  investCard: { width: 250, marginRight: 15, borderRadius: 15, overflow: 'hidden', backgroundColor: '#fff' },
  cardImage: { height: 120 },
  cardContent: { padding: 12 },
  tagRow: { flexDirection: 'row', marginBottom: 8 },
  badge: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginRight: 5 },
  badgeText: { fontSize: 10, color: Colors.primary, fontWeight: 'bold' },
  farmerName: { fontSize: 16, fontWeight: 'bold' },
  location: { fontSize: 12, color: 'gray', marginBottom: 8 },
  progressLabel: { fontSize: 10, color: 'gray', marginBottom: 2 },
  progressBar: { height: 6, borderRadius: 3 },

  grid: { flexDirection: 'row', paddingHorizontal: 20, gap: 15, marginTop: 10 },
  actionBtn: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center', elevation: 2 },
  actionText: { marginTop: 5, fontWeight: '600', color: '#333' }
});