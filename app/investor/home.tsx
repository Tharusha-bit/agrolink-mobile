import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useProjects } from '../src/context/ProjectContext';
const COLORS = {
  primary: '#216000',       
  primaryLight: '#2E8B00',
  primaryPale: '#E8F5E1',
  accent: '#76C442',
  accentWarm: '#F5A623',
  white: '#FFFFFF',
  surface: '#F7F9F4',
  card: '#FFFFFF',
  text: '#1A2E0D',
  textSecondary: '#5C7A4A',
  textMuted: '#9BB08A',
  border: '#DDE8D4',
  danger: '#E05252',
  info: '#3A9BD5',
};

const SHADOWS = {
  md: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10 },
    android: { elevation: 6 },
  }),
  sm: { elevation: 2 },
};
const KPI_DATA = [
  { label: 'Active Crops', value: '142', icon: 'sprout', color: COLORS.accent },
  { label: 'Investors', value: '3.4k', icon: 'account-group', color: COLORS.primary },
  { label: 'Funded Today', value: '$28k', icon: 'cash-multiple', color: COLORS.accentWarm },
  { label: 'Avg Return', value: '18%', icon: 'chart-line', color: COLORS.info },
];
const StatBadge = ({ icon, label, value, color }: any) => (
 <View style={s.statBadge}>
    <View style={[s.statIconCircle, { backgroundColor: color + '15' }]}>
      <MaterialCommunityIcons name={icon} size={22} color={color} />
    </View>
    <Text style={s.statValue}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>
);
const InvestmentCard = ({ id, title, farmer, since, description, progress, image, tags, riskLevel, goal, raised }: any) => {
  const router = useRouter();
  const progressPct = Math.min(Math.max(progress, 0), 1);
  const riskColor = riskLevel === 'Low' ? COLORS.accent : riskLevel === 'Medium' ? COLORS.accentWarm : COLORS.danger;

  return (
    <TouchableOpacity 
      style={[ic.card, SHADOWS.md]} 
      activeOpacity={0.9}
      onPress={() => router.push(`/investment/${id}`)} 
    >
      {/* Hero Image */}
      <View style={ic.imageWrap}>
        <Image source={{ uri: image }} style={ic.image} />
        <View style={ic.imageFade} />
        
        {/* Risk Chip */}
        <View style={[ic.riskChip, { backgroundColor: riskColor }]}>
          <MaterialCommunityIcons name="shield-check" size={12} color="#fff" style={{ marginRight: 4 }} />
          <Text style={ic.riskText}>{riskLevel} Risk</Text>
        </View>

        {/* Tags */}
        <View style={ic.tagRow}>
          {tags.map((t: string, index: number) => (
            <View key={index} style={ic.tagPill}>
              <Text style={ic.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={ic.body}>
        <View style={ic.farmerRow}>
          <View style={ic.avatarWrap}>
            <MaterialCommunityIcons name="account" size={18} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={ic.title}>{title}</Text>
            <Text style={ic.farmerName}>by {farmer} • {since}</Text>
          </View>
          <View style={ic.verifiedBadge}>
            <MaterialCommunityIcons name="check-decagram" size={14} color={COLORS.primary} />
            <Text style={ic.verifiedText}>Verified</Text>
          </View>
        </View>

        <Text style={ic.description} numberOfLines={2}>{description}</Text>

        {/* Progress Bar */}
        <View style={ic.progressBlock}>
          <View style={ic.progressLabels}>
            <Text style={ic.progressTitle}>Funding Progress</Text>
            <Text style={ic.progressPct}>{Math.round(progressPct * 100)}%</Text>
          </View>
          <View style={ic.track}>
            <View style={[ic.fill, { width: `${progressPct * 100}%` }]} />
          </View>
          <View style={ic.amountRow}>
            <Text style={ic.raised}>Raised: <Text style={ic.raisedBold}>LKR {raised.toLocaleString()}</Text></Text>
            <Text style={ic.target}>Goal: LKR {goal.toLocaleString()}</Text>
          </View>
        </View>
        <View style={ic.investBtn}>
          <Text style={ic.investText}>View Details</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default function HomeScreen() {
  const router = useRouter();
  const { projects } = useProjects(); // <--- This gets the data from Create Page

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* ── HEADER ── */}
        <View style={s.header}>
          {/* Decorative Circles */}
          <View style={s.decCircleLg} />
          <View style={s.decCircleSm} />

          {/* Top Bar */}
          <View style={s.topBar}>
            <View>
              <Text style={s.greeting}>Good morning 🌱</Text>
              <Text style={s.userName}>Fernando</Text>
              <Text style={s.date}>Monday, 24 November 2025</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/profile/investorprofile')} style={s.avatarBtn} activeOpacity={0.85}>
              <View style={s.notifDot} />
              <MaterialCommunityIcons name="account" size={26} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <View style={s.searchBar}>
            <Ionicons name="search-outline" size={20} color={COLORS.textMuted} style={{ marginRight: 8 }} />
            <TextInput placeholder="Search crops, farmers..." placeholderTextColor={COLORS.textMuted} style={s.searchInput} />
            <TouchableOpacity style={s.micBtn}>
              <MaterialCommunityIcons name="microphone-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[s.weatherCard, SHADOWS.md]}>
          <View style={s.weatherTopRow}>
            <View>
              <View style={s.locationRow}>
                <MaterialCommunityIcons name="map-marker" size={18} color={COLORS.primary} />
                <Text style={s.cityText}>Anuradhapura</Text>
              </View>
              <Text style={s.weatherDesc}>Light rain expected</Text>
            </View>
            <View style={s.tempBlock}>
              <MaterialCommunityIcons name="weather-rainy" size={32} color={COLORS.info} />
              <Text style={s.tempText}>17°C</Text>
            </View>
          </View>

          <View style={s.divider} />

          <View style={s.statsRow}>
            <StatBadge icon="water-percent" label="Humidity" value="59%" color={COLORS.info} />
            <View style={s.statDivider} />
            <StatBadge icon="thermometer" label="Soil Temp" value="22°C" color={COLORS.accentWarm} />
            <View style={s.statDivider} />
            <StatBadge icon="weather-windy" label="Wind" value="6 m/s" color={COLORS.accent} />
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.kpiStrip}>
          {KPI_DATA.map((k) => (
            <View key={k.label} style={[s.kpiCard, SHADOWS.sm]}>
              <View style={[s.kpiIcon, { backgroundColor: k.color + '15' }]}>
                <MaterialCommunityIcons name={k.icon as any} size={22} color={k.color} />
              </View>
              <Text style={s.kpiValue}>{k.value}</Text>
              <Text style={s.kpiLabel}>{k.label}</Text>
            </View>
          ))}
        </ScrollView>
