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
          {/* TRANSACTIONS TAB */}
          {activeTab === 'transactions' && (
            <View style={s.tabContent}>
              <View style={[s.transCard, SHADOW.sm]}>
                {TRANSACTIONS.map((tx, i) => {
                  const isPositive = tx.amount > 0;
                  const iconMap: Record<string, string> = {
                    invest: 'arrow-up-circle',
                    return: 'arrow-down-circle',
                    deposit: 'plus-circle',
                  };
                  const colorMap: Record<string, string> = {
                    invest: C.red,
                    return: C.accent,
                    deposit: '#1976D2',
                  };
                  return (
                    <View key={tx.id}>
                      <View style={s.txRow}>
                        <View style={[s.txIconWrap, { backgroundColor: colorMap[tx.type] + '18' }]}>
                          <MaterialCommunityIcons name={iconMap[tx.type] as any} size={20} color={colorMap[tx.type]} />
                        </View>
                        <View style={s.txInfo}>
                          <Text style={s.txLabel}>{tx.label}</Text>
                          <Text style={s.txDate}>{tx.date}</Text>
                        </View>
                        <Text style={[s.txAmount, { color: isPositive ? C.accent : C.red }]}>
                          {isPositive ? '+' : '−'} LKR {Math.abs(tx.amount).toLocaleString()}
                        </Text>
                      </View>
                      {i < TRANSACTIONS.length - 1 && <View style={s.txDivider} />}
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
        {/*ACCOUNT MENU*/}
        <View style={s.menuSection}>
          <Text style={s.menuSectionTitle}>Account</Text>
          <View style={[s.menuCard, SHADOW.sm]}>
            <MenuRow
              icon="account-edit-outline"
              label="Personal Details"
              sub="Name, email, phone"
              onPress={() => router.push('/profile/edit')}
            />
            <View style={s.menuDivider} />
            <MenuRow
              icon="shield-lock-outline"
              label="Security & Password"
              sub="2FA, change password"
              onPress={() => router.push('/investor/security')}
            />
            <View style={s.menuDivider} />
            <MenuRow
              icon="bell-cog-outline"
              label="Notifications"
              sub="Investment alerts, updates"
              onPress={() => router.push('/investor/notifications')}
            />
            <View style={s.menuDivider} />
            <MenuRow
              icon="help-circle-outline"
              label="Help & Support"
              onPress={() => router.push('/(investor)/help-support')}
            />
          </View>
        </View>

        {/*LOGOUT*/}
        <View style={s.menuSection}>
          <View style={[s.menuCard, SHADOW.sm]}>
            <MenuRow
              icon="logout-variant"
              label="Log Out"
              danger
              onPress={handleLogout}
            />
          </View>
        </View>
        {/* Bottom spacer so content clears the fixed nav bar */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/*BOTTOM NAVIGATION BAR*/}
      <View style={s.bottomNavWrapper}>
        <View style={s.bottomNavPill}>
          <TouchableOpacity
            style={s.navBtn}
            onPress={() => router.push('/(investor)/home')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="home" size={24} color="rgba(255,255,255,0.55)" />
          </TouchableOpacity>
          <TouchableOpacity
            style={s.navBtn}
            onPress={() => router.push('/(investor)/profile')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="account" size={24} color="rgba(255,255,255,0.55)" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  // ── FIX: paddingBottom ensures last content isn't hidden under the nav bar
  scroll: { paddingBottom: 20 },

  // Header
  header: {
    backgroundColor: C.primary,
    paddingTop: 56,
    paddingHorizontal: 22,
    paddingBottom: 26,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  blob1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: C.primaryLight, top: -60, right: -50, opacity: 0.3 },
  blob2: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: C.gold, bottom: 10, left: 30, opacity: 0.1 },

  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerBrand: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 3 },
  headerTitle: { color: C.white, fontSize: 24, fontWeight: '900' },
  notifBtn: { position: 'relative', width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  notifDot: { position: 'absolute', top: 9, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: C.gold, borderWidth: 1.5, borderColor: C.primary },

  // Profile row
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  avatarCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.accent, justifyContent: 'center', alignItems: 'center' },
  avatarInitials: { fontSize: 18, fontWeight: '900', color: C.white },
  profileName: { fontSize: 18, fontWeight: '800', color: C.white },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  verifiedText: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
  memberBadge: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.goldLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  memberBadgeText: { fontSize: 11, fontWeight: '800', color: C.gold },

  // Portfolio card
  portfolioCard: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 14,
  },
  portfolioLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2 },
  portfolioValue: { color: C.white, fontSize: 32, fontWeight: '900', marginVertical: 6 },
  portfolioProfit: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  profitBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.accent, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  profitBadgeText: { fontSize: 11, fontWeight: '800', color: C.white },
  profitText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },

  // Mini stats
  miniStatsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 14, justifyContent: 'space-around', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  miniStat: { alignItems: 'center', flex: 1 },
  miniStatVal: { color: C.white, fontSize: 14, fontWeight: '800', marginBottom: 2 },
  miniStatLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  miniStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  // Quick actions
  actionsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginTop: 22, marginBottom: 4 },
  actionBtn: { flex: 1, backgroundColor: C.white, borderRadius: 16, padding: 12, alignItems: 'center', gap: 8 },
  actionIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 11, fontWeight: '700', color: C.text, textAlign: 'center' },

  // Tabs
  tabsWrapper: { paddingHorizontal: 20, marginTop: 20 },
  tabsRow: { flexDirection: 'row', backgroundColor: C.white, borderRadius: 14, padding: 4, marginBottom: 14, ...{ elevation: 2, shadowColor: C.shadow, shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } } },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: C.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: C.textMuted },
  tabTextActive: { color: C.white },
  tabContent: { gap: 0 },

  // Investment cards
  investCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  investCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  investIconWrap: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  investHeaderText: { flex: 1 },
  investTitle: { fontSize: 14, fontWeight: '800', color: C.text },
  investFarmer: { fontSize: 11, color: C.textMuted, marginTop: 1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E8F5E9', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.accent },
  statusText: { fontSize: 11, fontWeight: '700', color: C.primary },

  investProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  investProgressTrack: { flex: 1, height: 6, backgroundColor: C.border, borderRadius: 3, overflow: 'hidden' },
  investProgressFill: { height: '100%', backgroundColor: C.accent, borderRadius: 3 },
  investProgressPct: { fontSize: 11, fontWeight: '800', color: C.primary },

  investDetailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  investDetailItem: { width: '47%', backgroundColor: C.surface, borderRadius: 12, padding: 10 },
  detailLabel: { fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  detailVal: { fontSize: 13, fontWeight: '800', color: C.text },

  investCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: C.border, paddingTop: 12 },
  investDuration: { fontSize: 12, color: C.textMuted },
  viewInvestBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewInvestBtnText: { fontSize: 13, fontWeight: '700', color: C.primary },

  // Transactions
  transCard: { backgroundColor: C.white, borderRadius: 20, overflow: 'hidden' },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  txIconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  txInfo: { flex: 1 },
  txLabel: { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 2 },
  txDate: { fontSize: 11, color: C.textMuted },
  txAmount: { fontSize: 13, fontWeight: '800' },
  txDivider: { height: 1, backgroundColor: C.border, marginHorizontal: 14 },

  // Menu
  menuSection: { paddingHorizontal: 20, marginTop: 22 },
  menuSectionTitle: { fontSize: 12, fontWeight: '700', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  menuCard: { backgroundColor: C.white, borderRadius: 20, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  menuIconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuLabelWrap: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: '700', color: C.text },
  menuSub: { fontSize: 11, color: C.textMuted, marginTop: 1 },
  menuDivider: { height: 1, backgroundColor: C.border, marginLeft: 70 },

  // ── BOTTOM NAV BAR ────────────────────────────────────────────────────────
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomNavPill: {
    flexDirection: 'row',
    backgroundColor: C.primaryDeep,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 32,
    gap: 48,
    elevation: 10,
    shadowColor: C.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  navBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

      
        




      
            

        
