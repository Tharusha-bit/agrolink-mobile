/**
 * AgroLink — FarmerProfileScreen (Production-Level Redesign)
 *
 * Modified for farmer pages to be simple, clear, and professional like a fintech app.
 * Key adjustments:
 * - Used consistent design tokens (C for colors, SH for shadows) from the farmer dashboard.
 * - Simplified header with concentric rings for depth, matching fintech aesthetic.
 * - Adjusted stats to farmer-specific KPIs (Active Projects, Total Funding, Rating).
 * - Kept menu options general but with farmer-relevant sublabels where applicable.
 * - Ensured overall layout is clean, with ample white space and subtle shadows.
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Divider, Text } from 'react-native-paper';

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  forest:       '#216000',
  forestMid:    '#2A7A00',
  forestLight:  '#3A9900',
  forestPale:   '#E8F5E1',
  forestGhost:  '#F2FAF0',

  gold:         '#C9A84C',
  goldPale:     '#FDF6E3',

  gain:         '#2E8B57',
  gainBg:       '#EAF7F0',
  pending:      '#D4900A',
  pendingBg:    '#FFF8E6',
  loss:         '#C0392B',
  lossBg:       '#FDECEB',
  info:         '#2471A3',
  infoBg:       '#EBF5FB',

  white:        '#FFFFFF',
  surface:      '#F8FBF7',
  cardBg:       '#FFFFFF',
  border:       '#DCE8D5',
  borderLight:  '#EDF5E8',
  text:         '#1A2E0D',
  textSub:      '#4A6B3A',
  textMuted:    '#8FA882',
};

const SH = {
  xs: Platform.select({
    ios:     { shadowColor: '#216000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
    android: { elevation: 2 },
  }),
  sm: Platform.select({
    ios:     { shadowColor: '#216000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 12 },
    android: { elevation: 4 },
  }),
  md: Platform.select({
    ios:     { shadowColor: '#216000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.14, shadowRadius: 20 },
    android: { elevation: 8 },
  }),
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ProfileOptionProps {
  icon: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  isDestructive?: boolean;
  iconBg?: string;
  iconColor?: string;
  badge?: string;
}

interface StatPillProps {
  icon: string;
  value: string;
  label: string;
  color: string;
}

// ─── Reusable: Stat Pill ───────────────────────────────────────────────────────
const StatPill = ({ icon, value, label, color }: StatPillProps) => (
  <View style={sp.wrap}>
    <View style={[sp.iconCircle, { backgroundColor: color + '15' }]}>
      <MaterialCommunityIcons name={icon as any} size={18} color={color} />
    </View>
    <Text style={sp.value}>{value}</Text>
    <Text style={sp.label}>{label}</Text>
  </View>
);

const sp = StyleSheet.create({
  wrap:       { alignItems: 'center', flex: 1 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  value:      { fontSize: 17, fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  label:      { fontSize: 10.5, color: C.textMuted, marginTop: 1, textAlign: 'center' },
});

// ─── Reusable: Profile Option Row ─────────────────────────────────────────────
const ProfileOption = ({
  icon,
  label,
  sublabel,
  onPress,
  isDestructive = false,
  iconBg,
  iconColor,
  badge,
}: ProfileOptionProps) => {
  const resolvedIconBg    = iconBg    ?? (isDestructive ? C.lossBg  : C.forestPale);
  const resolvedIconColor = iconColor ?? (isDestructive ? C.loss     : C.forest);

  return (
    <TouchableOpacity style={po.row} onPress={onPress} activeOpacity={0.72}>
      <View style={[po.iconBox, { backgroundColor: resolvedIconBg }]}>
        <MaterialCommunityIcons name={icon as any} size={21} color={resolvedIconColor} />
      </View>

      <View style={po.textBlock}>
        <Text style={[po.label, isDestructive && { color: C.loss }]}>{label}</Text>
        {sublabel && <Text style={po.sublabel}>{sublabel}</Text>}
      </View>

      {badge && (
        <View style={po.badge}>
          <Text style={po.badgeText}>{badge}</Text>
        </View>
      )}

      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={isDestructive ? C.loss + '88' : '#C8D9C0'}
      />
    </TouchableOpacity>
  );
};

const po = StyleSheet.create({
  row:       {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.cardBg,
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: 16, marginBottom: 10,
    ...SH.sm,
  },
  iconBox:   { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  textBlock: { flex: 1 },
  label:     { fontSize: 15, fontWeight: '600', color: C.text },
  sublabel:  { fontSize: 11.5, color: C.textMuted, marginTop: 2 },
  badge:     { backgroundColor: C.pending, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  badgeText: { fontSize: 11, fontWeight: '700', color: C.white },
});

// ─── Reusable: Section Header ─────────────────────────────────────────────────
const SectionLabel = ({ title }: { title: string }) => (
  <View style={sl.row}>
    <View style={sl.pill} />
    <Text style={sl.text}>{title}</Text>
  </View>
);

const sl = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  pill: { width: 4, height: 18, borderRadius: 2, backgroundColor: C.gold, marginRight: 10 },
  text: { fontSize: 13, fontWeight: '800', color: C.textSub, letterSpacing: 0.5, textTransform: 'uppercase' },
});

// ─── Profile Strength Segment Bar ─────────────────────────────────────────────
const StrengthBar = ({ percent }: { percent: number }) => {
  const STEPS     = 5;
  const filled    = Math.round((percent / 100) * STEPS);
  const color     = percent < 40 ? C.loss : percent < 70 ? C.pending : C.gain;
  const label     = percent < 40 ? 'Needs work' : percent < 70 ? 'Getting there' : 'Looking great!';

  const TIPS = ['Add a photo', 'Verify NIC', 'Add bank account', 'Add 3+ skills', 'Complete address'];
  const nextTip = TIPS[filled] ?? null;

  return (
    <View style={str.wrap}>
      <View style={str.topRow}>
        <Text style={str.title}>Profile Strength</Text>
        <View style={[str.badge, { backgroundColor: color + '15' }]}>
          <Text style={[str.badgeText, { color }]}>{label} · {percent}%</Text>
        </View>
      </View>

      <View style={str.segRow}>
        {Array.from({ length: STEPS }).map((_, i) => (
          <View
            key={i}
            style={[
              str.seg,
              i < filled ? { backgroundColor: color } : { backgroundColor: C.borderLight },
              i < STEPS - 1 && { marginRight: 5 },
            ]}
          />
        ))}
      </View>

      {nextTip && (
        <View style={str.tipRow}>
          <MaterialCommunityIcons name="lightning-bolt" size={13} color={C.gold} />
          <Text style={str.tipText}>Next: <Text style={{ fontWeight: '700' }}>{nextTip}</Text></Text>
        </View>
      )}
    </View>
  );
};

const str = StyleSheet.create({
  wrap:      { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: C.border },
  topRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title:     { fontSize: 13, fontWeight: '700', color: C.textSub },
  badge:     { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11.5, fontWeight: '700' },
  segRow:    { flexDirection: 'row', marginBottom: 10 },
  seg:       { flex: 1, height: 7, borderRadius: 4 },
  tipRow:    { flexDirection: 'row', alignItems: 'center' },
  tipText:   { fontSize: 12, color: C.textMuted, marginLeft: 4 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function FarmerProfileScreen() {
  const router = useRouter();

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.forest} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        <View style={s.header}>
          {/* Decorative rings */}
          <View style={s.ring1} />
          <View style={s.ring2} />
          <View style={s.ring3} />

          {/* Nav bar */}
          <View style={s.nav}>
            <TouchableOpacity style={s.navBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color={C.forest} />
            </TouchableOpacity>
            <Text style={s.navTitle}>MY PROFILE</Text>
            <TouchableOpacity style={s.navBtn}>
              <Ionicons name="notifications-outline" size={18} color={C.forest} />
              <View style={s.notifDot} />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={s.avatarSection}>
            <View style={s.avatarRing}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                style={s.avatar}
              />
              <TouchableOpacity style={s.cameraBtn} activeOpacity={0.85}>
                <MaterialCommunityIcons name="camera" size={13} color={C.white} />
              </TouchableOpacity>
            </View>

            {/* Name + verified chip */}
            <View style={s.nameRow}>
              <Text style={s.name}>W.T.P. Fernando</Text>
              <View style={s.verifiedChip}>
                <MaterialCommunityIcons name="check-decagram" size={13} color={C.gain} />
                <Text style={s.verifiedText}>Verified</Text>
              </View>
            </View>

            {/* Role + ID */}
            <Text style={s.role}>Farmer · ID: 20321212</Text>
          </View>
        </View>

        {/* ── STATS CARD ───────────────────────────────────────────────────── */}
        <View style={[s.statsCard, SH.md]}>
          <StatPill icon="sprout"        value="3"    label="Active Projects"   color={C.gain} />
          <View style={s.statDivider} />
          <StatPill icon="cash-multiple" value="LKR 1.2M" label="Total Funding" color={C.pending} />
          <View style={s.statDivider} />
          <StatPill icon="star"          value="4.7"  label="Rating"         color={C.gold} />
        </View>

        {/* ── PROFILE STRENGTH ─────────────────────────────────────────────── */}
        <View style={[s.card, SH.sm, { marginTop: 16 }]}>
          <StrengthBar percent={65} />
        </View>

        {/* ── MENU ─────────────────────────────────────────────────────────── */}
        <View style={s.menu}>
          <SectionLabel title="Account Settings" />

          <ProfileOption
            icon="account-edit-outline"
            label="Edit Personal Details"
            sublabel="Name, NIC, address and more"
            iconBg={C.forestPale}
            iconColor={C.forest}
            onPress={() => router.push('/profile/edit')}
          />
          <ProfileOption
            icon="shield-lock-outline"
            label="Security & Password"
            sublabel="2FA, password, login history"
            iconBg={C.infoBg}
            iconColor={C.info}
            onPress={() => router.push('/profile/security')}
          />
          <ProfileOption
            icon="bank-outline"
            label="Payment Methods"
            sublabel="Add or manage bank accounts"
            iconBg={C.pendingBg}
            iconColor={C.pending}
            badge="New"
            onPress={() => console.log('Bank')}
          />

          <SectionLabel title="Support" />

          <ProfileOption
            icon="help-circle-outline"
            label="Help & Support"
            sublabel="FAQs, live chat, report an issue"
            iconBg={C.forestPale}
            iconColor={C.gain}
            onPress={() => console.log('Help')}
          />
          <ProfileOption
            icon="file-document-outline"
            label="Terms & Conditions"
            sublabel="Privacy policy and legal terms"
            iconBg={C.forestPale}
            iconColor={C.textSub}
            onPress={() => console.log('Terms')}
          />

          {/* Danger zone separator */}
          <Divider style={s.divider} />

          <ProfileOption
            icon="logout"
            label="Log Out"
            isDestructive
            onPress={() => router.replace('/')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Screen Styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.surface },

  /* HEADER */
  header: {
    backgroundColor: C.forest,
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingHorizontal: 22,
    paddingBottom: 36,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
  },
  ring1: {
    position: 'absolute', width: 260, height: 260, borderRadius: 130,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    top: -80, right: -80,
  },
  ring2: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
    top: -40, right: -40,
  },
  ring3: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -10, right: 10,
  },

  nav:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, width: '100%' },
  navBtn:    { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.92)', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  notifDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E74C3C', position: 'absolute', top: 6, right: 6, borderWidth: 1.5, borderColor: C.forest },
  navTitle:  { fontSize: 11, fontWeight: '900', color: 'rgba(255,255,255,0.7)', letterSpacing: 2.5, textTransform: 'uppercase' },

  avatarSection: { alignItems: 'center' },
  avatarRing: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.55)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12, position: 'relative',
  },
  avatar:    { width: 88, height: 88, borderRadius: 44 },
  cameraBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: C.forestMid,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: C.white,
  },

  nameRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  name:         { fontSize: 22, fontWeight: '900', color: C.white, letterSpacing: -0.4, marginRight: 8 },
  verifiedChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, gap: 3,
  },
  verifiedText: { fontSize: 11, fontWeight: '700', color: C.white },
  role:         { fontSize: 13, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.2 },

  /* STATS CARD */
  statsCard: {
    backgroundColor: C.cardBg,
    marginHorizontal: 20,
    marginTop: -24,
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDivider: { width: 1, height: 44, backgroundColor: C.border },

  /* GENERIC CARD */
  card: {
    backgroundColor: C.cardBg,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
  },

  /* MENU */
  menu:    { paddingHorizontal: 20, marginTop: 20 },
  divider: { marginVertical: 8, backgroundColor: C.border },
});