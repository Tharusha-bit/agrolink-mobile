import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useProjects } from '../../src/context/ProjectContext';
const C = {
  primary:      '#216000',
  primaryDeep:  '#1A4D00',
  primaryLight: '#2E8B00',
  primaryPale:  '#EAF3E3',
  surface:      '#F7F9F4',
  white:        '#FFFFFF',
  text:         '#1A2E0D',
  textSub:      '#4A6741',
  textMuted:    '#9BB08A',
  accent:       '#76C442',
  gold:         '#C9A84C',
  goldLight:    '#FFF8E7',
  card:         '#FFFFFF',
  border:       '#E2EDD9',
  shadow:       '#000',
};

const SHADOW = {
  sm: { elevation: 3,  shadowColor: C.shadow, shadowOpacity: 0.07, shadowRadius: 6,  shadowOffset: { width: 0, height: 2 } },
  md: { elevation: 7,  shadowColor: C.shadow, shadowOpacity: 0.11, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
};
const FILTERS = ['All', 'Rice', 'Organic', 'Low Risk'];

const RISK_COLORS: Record<string, { bg: string; text: string }> = {
  Low:    { bg: '#E8F5E9', text: '#2E7D32' },
  Medium: { bg: '#FFF8E1', text: '#F57F17' },
  High:   { bg: '#FFEBEE', text: '#C62828' },
};
//MAIN SCREEN
export default function InvestMarketplace() {
  const router = useRouter();
  const { projects } = useProjects();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const aiScore = (id: string) => {
    const scores: Record<string, number> = { '1': 87, '2': 91 };
    return scores[id] ?? 84;
  };

  const filtered = projects.filter((p) => {
    const matchesFilter =
      filter === 'All' ||
      p.tags.includes(filter) ||
      p.riskLevel === filter.replace(' Risk', '') ||
      (filter === 'Low Risk' && p.riskLevel === 'Low');

    const matchesSearch =
      search.trim() === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.farmer.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />