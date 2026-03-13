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
function MenuRow({ icon, label, sub, onPress, danger = false }: {
  icon: string; label: string; sub?: string; onPress?: () => void; danger?: boolean;
}) {
  return (
    <TouchableOpacity style={s.menuRow} onPress={onPress} activeOpacity={0.75}>
      <View style={[s.menuIconWrap, { backgroundColor: danger ? '#FFEBEE' : C.primaryPale }]}>
        <MaterialCommunityIcons name={icon as any} size={20} color={danger ? C.red : C.primary} />
      </View>
      <View style={s.menuLabelWrap}>
        <Text style={[s.menuLabel, danger && { color: C.red }]}>{label}</Text>
        {sub && <Text style={s.menuSub}>{sub}</Text>}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={C.textMuted} />
    </TouchableOpacity>
  );
}
export default function InvestorProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'investments' | 'transactions'>('investments');

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => router.replace('/login') },
      ]
    );
  };
  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

      </ScrollView>
     </View>
  );
}
{/*HEADER*/}
        <View style={s.header}>
          <View style={s.blob1} />
          <View style={s.blob2} />

          <View style={s.topRow}>
            <View>
              <Text style={s.headerBrand}>AgroLink Private Wealth</Text>
              <Text style={s.headerTitle}>My Portfolio</Text>
            </View>
            <TouchableOpacity style={s.notifBtn} onPress={() => router.push('/investor/notifications')}>
              <MaterialCommunityIcons name="bell-outline" size={22} color={C.white} />
              <View style={s.notifDot} />
            </TouchableOpacity>
          </View>

          {/*AVATAR + NAME*/}
          <View style={s.profileRow}>
            <View style={s.avatarCircle}>
              <Text style={s.avatarInitials}>IV</Text>
            </View>
            <View>
              <Text style={s.profileName}>Investor</Text>
              <View style={s.verifiedRow}>
                <MaterialCommunityIcons name="shield-check" size={13} color={C.accent} />
                <Text style={s.verifiedText}>Verified Investor</Text>
              </View>
            </View>
            <View style={s.memberBadge}>
              <MaterialCommunityIcons name="crown" size={12} color={C.gold} />
              <Text style={s.memberBadgeText}>Gold</Text>
            </View>
          </View>

          {/*PORTFOLIO VALUE*/}
          <View style={s.portfolioCard}>
            <Text style={s.portfolioLabel}>Total Portfolio Value</Text>
            <Text style={s.portfolioValue}>LKR {TOTAL_PORTFOLIO.toLocaleString()}</Text>
            <View style={s.portfolioProfit}>
              <View style={s.profitBadge}>
                <MaterialCommunityIcons name="trending-up" size={12} color={C.white} />
                <Text style={s.profitBadgeText}>+ {PROFIT_PCT}</Text>
              </View>
              <Text style={s.profitText}>+ LKR {TOTAL_PROFIT.toLocaleString()} overall</Text>
            </View>
          </View>

          {/* MINI STATS */}
          <View style={s.miniStatsRow}>
            <View style={s.miniStat}>
              <Text style={s.miniStatVal}>{ACTIVE_INVESTMENTS.length}</Text>
              <Text style={s.miniStatLabel}>Active</Text>
            </View>
            <View style={s.miniStatDivider} />
            <View style={s.miniStat}>
              <Text style={s.miniStatVal}>LKR {(35000).toLocaleString()}</Text>
              <Text style={s.miniStatLabel}>Invested</Text>
            </View>
            <View style={s.miniStatDivider} />
            <View style={s.miniStat}>
              <Text style={s.miniStatVal}>+15%</Text>
              <Text style={s.miniStatLabel}>Avg ROI</Text>
            </View>
          </View>
        </View>
         {/*QUICK ACTIONS*/}
        <View style={s.actionsRow}>
          <TouchableOpacity style={[s.actionBtn, SHADOW.sm]}>
            <View style={[s.actionIcon, { backgroundColor: C.primaryPale }]}>
              <MaterialCommunityIcons name="bank-transfer-in" size={22} color={C.primary} />
            </View>
            <Text style={s.actionLabel}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, SHADOW.sm]}>
            <View style={[s.actionIcon, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="bank-transfer-out" size={22} color="#E65100" />
            </View>
            <Text style={s.actionLabel}>Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, SHADOW.sm]} onPress={() => router.push('/(investor)/invest')}>
            <View style={[s.actionIcon, { backgroundColor: C.goldLight }]}>
              <MaterialCommunityIcons name="chart-areaspline" size={22} color={C.gold} />
            </View>
            <Text style={s.actionLabel}>Markets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, SHADOW.sm]}>
            <View style={[s.actionIcon, { backgroundColor: '#E3F2FD' }]}>
              <MaterialCommunityIcons name="file-chart-outline" size={22} color="#1976D2" />
            </View>
            <Text style={s.actionLabel}>Reports</Text>
          </TouchableOpacity>
        </View>
        {/* ── INVESTMENTS / TRANSACTIONS TABS ── */}
        <View style={s.tabsWrapper}>
          <View style={s.tabsRow}>
            <TouchableOpacity
              style={[s.tab, activeTab === 'investments' && s.tabActive]}
              onPress={() => setActiveTab('investments')}
            >
              <Text style={[s.tabText, activeTab === 'investments' && s.tabTextActive]}>Active Investments</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.tab, activeTab === 'transactions' && s.tabActive]}
              onPress={() => setActiveTab('transactions')}
            >
              <Text style={[s.tabText, activeTab === 'transactions' && s.tabTextActive]}>Transactions</Text>
            </TouchableOpacity>
          </View>
          {/* INVESTMENTS TAB */}
          {activeTab === 'investments' && (
            <View style={s.tabContent}>
              {ACTIVE_INVESTMENTS.map((inv) => (
                <View key={inv.id} style={[s.investCard, SHADOW.md]}>
                  <View style={s.investCardHeader}>
                    <View style={[s.investIconWrap, { backgroundColor: C.primaryPale }]}>
                      <MaterialCommunityIcons name={inv.icon as any} size={22} color={C.primary} />
                    </View>
                    <View style={s.investHeaderText}>
                      <Text style={s.investTitle}>{inv.project}</Text>
                      <Text style={s.investFarmer}>by {inv.farmer}</Text>
                    </View>
                    <View style={s.statusBadge}>
                      <View style={s.statusDot} />
                      <Text style={s.statusText}>{inv.status}</Text>
                    </View>
                  </View>

                  {/* Progress */}
                  <View style={s.investProgressRow}>
                    <View style={s.investProgressTrack}>
                      <View style={[s.investProgressFill, { width: `${inv.progress * 100}%` }]} />
                    </View>
                    <Text style={s.investProgressPct}>{Math.round(inv.progress * 100)}%</Text>
                  </View>

                  <View style={s.investDetailsGrid}>
                    <View style={s.investDetailItem}>
                      <Text style={s.detailLabel}>Invested</Text>
                      <Text style={s.detailVal}>{inv.investedDate}</Text>
                    </View>
                    <View style={s.investDetailItem}>
                      <Text style={s.detailLabel}>Amount</Text>
                      <Text style={s.detailVal}>LKR {inv.amount.toLocaleString()}</Text>
                    </View>
                    <View style={s.investDetailItem}>
                      <Text style={s.detailLabel}>ROI</Text>
                      <Text style={[s.detailVal, { color: C.accent }]}>{inv.roi}</Text>
                    </View>
                    <View style={s.investDetailItem}>
                      <Text style={s.detailLabel}>Expected Return</Text>
                      <Text style={[s.detailVal, { color: C.primary, fontWeight: '900' }]}>
                        + LKR {inv.expectedReturn.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <View style={s.investCardFooter}>
                    <Text style={s.investDuration}>{inv.duration} project</Text>
                    <TouchableOpacity style={s.viewInvestBtn}>
                      <Text style={s.viewInvestBtnText}>View Details</Text>
                      <MaterialCommunityIcons name="arrow-right" size={14} color={C.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
