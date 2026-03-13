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
const ACTIVE_INVESTMENTS = [
  {
    id: '1',
    project: 'Suriyakumar Paddy',
    farmer: 'Suriyakumar',
    status: 'Active',
    investedDate: '20 Nov 2025',
    amount: 20000,
    expectedReturn: 2400,
    roi: '12%',
    duration: '4 Months',
    progress: 0.65,
    icon: 'sprout',
  },
  {
    id: '2',
    project: 'Jaffna Organic Veg',
    farmer: 'Priya Devi',
    status: 'Active',
    investedDate: '10 Jan 2026',
    amount: 15000,
    expectedReturn: 2700,
    roi: '18%',
    duration: '3 Months',
    progress: 0.3,
    icon: 'leaf',
  },
];

const TRANSACTIONS = [
  { id: 't1', type: 'invest', label: 'Invested in Suriyakumar Paddy', date: '20 Nov 2025', amount: -20000, },
  { id: 't2', type: 'invest', label: 'Invested in Jaffna Organic Veg', date: '10 Jan 2026', amount: -15000, },
  { id: 't3', type: 'return', label: 'Return — Kurunegala Spices', date: '02 Feb 2026', amount: 3200, },
  { id: 't4', type: 'deposit', label: 'Wallet Deposit', date: '18 Oct 2025', amount: 50000, },
];

const TOTAL_PORTFOLIO = 2450000;
const TOTAL_PROFIT = 125000;
const PROFIT_PCT = '12%';