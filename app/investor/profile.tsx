import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const C = {
  primary: '#216000',
  primaryDeep: '#1A4D00',
  primaryLight: '#2E8B00',
  primaryPale: '#EAF3E3',
  surface: '#F7F9F4',
  white: '#FFFFFF',
  text: '#1A2E0D',
  textSub: '#4A6741',
  textMuted: '#9BB08A',
  accent: '#76C442',
  gold: '#C9A84C',
  goldLight: '#FFF8E7',
  card: '#FFFFFF',
  border: '#E2EDD9',
  shadow: '#000',
  red: '#E53935',
};

const SHADOW = {
  sm: { elevation: 3, shadowColor: C.shadow, shadowOpacity: 0.07, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  md: { elevation: 7, shadowColor: C.shadow, shadowOpacity: 0.11, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  lg: { elevation: 14, shadowColor: C.shadow, shadowOpacity: 0.16, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
};