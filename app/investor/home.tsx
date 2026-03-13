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
