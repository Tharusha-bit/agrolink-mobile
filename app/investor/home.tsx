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
  primary: '#216000',       // Deep Forest Green
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
