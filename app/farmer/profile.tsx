import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { ComponentProps } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// ICON TYPES
// ─────────────────────────────────────────────────────────────────────────────
type MCIcon  = ComponentProps<typeof MaterialCommunityIcons>['name'];
type IonIcon = ComponentProps<typeof Ionicons>['name'];

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  forest:      '#1B5E20',
  deep:        '#2E7D32',
  mid:         '#388E3C',
  leaf:        '#4CAF50',
  accent:      '#66BB6A',
  accentLight: '#A5D6A7',
  pale:        '#E8F5E9',
  paler:       '#F4F8F2',

  white:       '#FFFFFF',
  ink:         '#1C2B1A',
  inkSub:      '#3E5239',
  inkMuted:    '#8EA882',
  border:      '#D8EAD4',
  divider:     '#EBF4E8',

  gold:        '#F59E0B',
  goldLight:   '#FEF3C7',
  red:         '#EF5350',
  redPale:     '#FFEBEE',
  blue:        '#1976D2',
  bluePale:    '#E3F2FD',
};

const SH = {
  xs: Platform.select({ ios: { shadowColor:'#1B5E20', shadowOffset:{width:0,height:2}, shadowOpacity:0.07, shadowRadius:4  }, android:{ elevation:2  } }),
  sm: Platform.select({ ios: { shadowColor:'#1B5E20', shadowOffset:{width:0,height:3}, shadowOpacity:0.09, shadowRadius:7  }, android:{ elevation:3  } }),
  md: Platform.select({ ios: { shadowColor:'#1B5E20', shadowOffset:{width:0,height:5}, shadowOpacity:0.12, shadowRadius:12 }, android:{ elevation:6  } }),
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
interface SettingsGroup {
  title:   string;
  items:   SettingsItem[];
}

interface SettingsItem {
  icon:    MCIcon;
  label:   string;
  route?:  string;
  danger?: boolean;
  badge?:  string;
}

const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    title: 'MY ACCOUNT',
    items: [
      { icon: 'account-edit-outline',  label: 'Edit Personal Details',    route: '/profile/edit'     },
      { icon: 'shield-lock-outline',   label: 'Security & Password',      route: '/profile/security' },
      { icon: 'bell-outline',          label: 'Notification Preferences'                             },
    ],
  },
  {
    title: 'FARM & VERIFICATION',
    items: [
      { icon: 'file-document-outline', label: 'My Documents',             route: '/profile/documents' },
      { icon: 'star-outline',          label: 'Trust Score Details',      route: '/farmer/trust'      },
      { icon: 'bank-outline',          label: 'Payment Account',          route: '/profile/payment'   },
    ],
  },
  {
    title: 'SUPPORT',
    items: [
      { icon: 'help-circle-outline',   label: 'Help & Support'           },
      { icon: 'information-outline',   label: 'About AgroLink'           },
      { icon: 'logout',                label: 'Log Out', danger: true    },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// REPUTATION BADGE  (Gold / Silver / Bronze based on trust score)
// ─────────────────────────────────────────────────────────────────────────────
const TRUST_SCORE = 92;

function getReputation(score: number) {
  if (score >= 85) return { level: 'Gold',   icon: 'shield-check'  as MCIcon, color: T.gold,          bg: T.goldLight };
  if (score >= 65) return { level: 'Silver', icon: 'shield-half-full' as MCIcon, color: '#9E9E9E',    bg: '#F5F5F5'   };
  return               { level: 'Bronze', icon: 'shield-outline'   as MCIcon, color: '#795548',       bg: '#EFEBE9'   };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Settings Row
// ─────────────────────────────────────────────────────────────────────────────
function SettingsRow({
  item, isLast, onPress,
}: { item: SettingsItem; isLast: boolean; onPress: () => void }) {
  const arrowIcon: MCIcon  = 'chevron-right';

  return (
    <>
      <TouchableOpacity style={s.menuItem} onPress={onPress} activeOpacity={0.72}>
        <View style={[s.menuIconBox, item.danger && { backgroundColor: T.redPale }]}>
          <MaterialCommunityIcons
            name={item.icon}
            size={20}
            color={item.danger ? T.red : T.deep}
          />
        </View>
        <Text style={[s.menuLabel, item.danger && { color: T.red }]}>{item.label}</Text>
        {item.badge && (
          <View style={s.menuBadge}><Text style={s.menuBadgeText}>{item.badge}</Text></View>
        )}
        {!item.danger && (
          <MaterialCommunityIcons name={arrowIcon} size={18} color={T.inkMuted} />
        )}
      </TouchableOpacity>
      {!isLast && <View style={s.menuDivider} />}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function FarmerProfileScreen() {
  const router  = useRouter();
  const rep     = getReputation(TRUST_SCORE);

  function handleSettingsPress(item: SettingsItem) {
    if (item.danger) { router.replace('/'); return; }
    if (item.route)  { router.push(item.route as any); }
  }

  const backIcon: IonIcon  = 'arrow-back';
  const dotsIcon: MCIcon   = 'dots-horizontal';
  const checkIcon: MCIcon  = 'check-decagram';
  const leafIcon: MCIcon   = 'leaf';
  const shieldIcon: MCIcon = 'shield-check';

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={T.forest} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <LinearGradient
          colors={[T.forest, T.deep, T.mid]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.hero}
        >
          <View style={s.arc1} />
          <View style={s.arc2} />

          {/* Nav row */}
          <View style={s.topNav}>
            <TouchableOpacity
              onPress={() => router.push('/farmer/farmerhome')}
              style={s.navBtn}
              hitSlop={{ top:10, bottom:10, left:10, right:10 }}
            >
              <Ionicons name={backIcon} size={22} color={T.white} />
            </TouchableOpacity>
            <Text style={s.navTitle}>Farmer Profile</Text>
            <TouchableOpacity style={s.navBtn}>
              <MaterialCommunityIcons name={dotsIcon} size={22} color={T.white} />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={s.avatarRing}>
            <View style={s.avatarInner}>
              <MaterialCommunityIcons name={'account' as MCIcon} size={52} color={T.deep} />
            </View>
            <View style={s.verifyBubble}>
              <MaterialCommunityIcons name={checkIcon} size={16} color={T.white} />
            </View>
          </View>

          {/* Name + role */}
          <Text style={s.heroName}>Suriyakumar</Text>

          <View style={s.rolePill}>
            <MaterialCommunityIcons name={leafIcon} size={11} color={T.accentLight} />
            <Text style={s.roleText}>Verified Farmer</Text>
          </View>

          <Text style={s.heroId}>ID: FM-2025-889  ·  Member since Nov 2024</Text>

          {/* Reputation badge */}
          <View style={[s.repBadge, { backgroundColor: rep.bg }]}>
            <MaterialCommunityIcons name={rep.icon} size={18} color={rep.color} />
            <Text style={[s.repText, { color: rep.color }]}>{rep.level} Farmer</Text>
          </View>
        </LinearGradient>

        {/* ══ TRUST SCORE CARD ════════════════════════════════════════════ */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push('/farmer/trust')}
          style={[s.trustCard, SH.md]}
        >
          {/* Left: shield + label */}
          <View style={s.trustLeft}>
            <View style={[s.trustIconBox, { backgroundColor: T.goldLight }]}>
              <MaterialCommunityIcons name={shieldIcon} size={26} color={T.gold} />
            </View>
            <View style={s.trustTextWrap}>
              <Text style={s.trustTitle}>Trust Score</Text>
              <Text style={s.trustSub}>Tap to view full breakdown</Text>
            </View>
          </View>

          {/* Right: score + bar */}
          <View style={s.trustRight}>
            <Text style={s.trustScore}>{TRUST_SCORE}%</Text>
            <View style={s.trustBarTrack}>
              <View style={[s.trustBarFill, { width: `${TRUST_SCORE}%` }]} />
            </View>
            <Text style={s.trustGrade}>Excellent</Text>
          </View>
        </TouchableOpacity>

        {/* ══ SETTINGS GROUPS ══════════════════════════════════════════════ */}
        {SETTINGS_GROUPS.map((group) => (
          <View key={group.title} style={s.settingsSection}>
            <Text style={s.groupLabel}>{group.title}</Text>
            <View style={[s.menuCard, SH.xs]}>
              {group.items.map((item, i) => (
                <SettingsRow
                  key={item.label}
                  item={item}
                  isLast={i === group.items.length - 1}
                  onPress={() => handleSettingsPress(item)}
                />
              ))}
            </View>
          </View>
        ))}

        {/* App version footer */}
        <Text style={s.version}>AgroLink · v2.1.0</Text>
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: T.paler },
  scroll: { paddingBottom: 32 },

  // ── HERO ──
  hero: {
    paddingTop: 56,
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  arc1: { position:'absolute', width:320, height:320, borderRadius:160, backgroundColor:T.leaf,   opacity:0.10, top:-140, right:-70  },
  arc2: { position:'absolute', width:160, height:160, borderRadius:80,  backgroundColor:T.accent, opacity:0.08, bottom:-40, left:-30 },

  topNav:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'100%', marginBottom:28 },
  navBtn:   { width:40, height:40, borderRadius:12, backgroundColor:'rgba(255,255,255,0.15)', justifyContent:'center', alignItems:'center' },
  navTitle: { fontSize:17, fontWeight:'700', color:T.white, letterSpacing:0.3 },

  avatarRing:   { width:100, height:100, borderRadius:50, borderWidth:3, borderColor:'rgba(255,255,255,0.35)', justifyContent:'center', alignItems:'center', position:'relative', marginBottom:14 },
  avatarInner:  { width:88, height:88, borderRadius:44, backgroundColor:T.white, justifyContent:'center', alignItems:'center' },
  verifyBubble: { position:'absolute', bottom:2, right:2, width:24, height:24, borderRadius:12, backgroundColor:T.accent, justifyContent:'center', alignItems:'center', borderWidth:2, borderColor:T.deep },

  heroName: { fontSize:26, fontWeight:'800', color:T.white, letterSpacing:0.3, marginBottom:6 },
  rolePill: { flexDirection:'row', alignItems:'center', gap:5, backgroundColor:'rgba(255,255,255,0.14)', paddingHorizontal:12, paddingVertical:4, borderRadius:20, marginBottom:5 },
  roleText: { fontSize:12, fontWeight:'700', color:T.accentLight, letterSpacing:0.4 },
  heroId:   { fontSize:11, color:'rgba(255,255,255,0.5)', marginBottom:14 },

  repBadge: { flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:14, paddingVertical:6, borderRadius:20 },
  repText:  { fontSize:13, fontWeight:'800' },

  // ── TRUST CARD ──
  trustCard: {
    flexDirection:'row', alignItems:'center',
    backgroundColor:T.white,
    marginHorizontal:16,
    marginTop:-20,           // overlaps hero bottom edge
    marginBottom:24,
    borderRadius:20,
    padding:16,
    gap:14,
  },
  trustLeft:     { flexDirection:'row', alignItems:'center', gap:12, flex:1 },
  trustIconBox:  { width:50, height:50, borderRadius:14, justifyContent:'center', alignItems:'center' },
  trustTextWrap: { gap:2 },
  trustTitle:    { fontSize:16, fontWeight:'800', color:T.ink },
  trustSub:      { fontSize:11, color:T.inkMuted },
  trustRight:    { alignItems:'flex-end', gap:5, minWidth:70 },
  trustScore:    { fontSize:28, fontWeight:'900', color:T.gold },
  trustBarTrack: { width:70, height:5, backgroundColor:T.border, borderRadius:3, overflow:'hidden' },
  trustBarFill:  { height:'100%', backgroundColor:T.gold, borderRadius:3 },
  trustGrade:    { fontSize:10, fontWeight:'800', color:T.gold, textTransform:'uppercase', letterSpacing:0.6 },

  // ── SETTINGS ──
  settingsSection: { paddingHorizontal:16, marginBottom:20 },
  groupLabel:      { fontSize:11, fontWeight:'800', color:T.inkMuted, letterSpacing:1.4, textTransform:'uppercase', marginBottom:10 },
  menuCard:        { backgroundColor:T.white, borderRadius:20, overflow:'hidden' },
  menuItem:        { flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:15, gap:12 },
  menuIconBox:     { width:42, height:42, borderRadius:12, backgroundColor:T.pale, justifyContent:'center', alignItems:'center' },
  menuLabel:       { flex:1, fontSize:15, fontWeight:'600', color:T.ink },
  menuBadge:       { backgroundColor:T.pale, paddingHorizontal:8, paddingVertical:2, borderRadius:12 },
  menuBadgeText:   { fontSize:11, fontWeight:'700', color:T.deep },
  menuDivider:     { height:1, backgroundColor:T.divider, marginLeft:70 },

  version: { textAlign:'center', fontSize:11, color:T.inkMuted, marginBottom:8 },
});