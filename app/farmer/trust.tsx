import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { ComponentProps, useEffect, useRef } from 'react';
import {
  Animated,
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
  primary:     '#1B5E20',
  deep:        '#2E7D32',
  mid:         '#388E3C',
  leaf:        '#4CAF50',
  accent:      '#66BB6A',
  accentLight: '#A5D6A7',
  pale:        '#E8F5E9',
  paler:       '#F4F8F2',
  surface:     '#F4F8F2',

  white:       '#FFFFFF',
  ink:         '#1C2B1A',
  inkSub:      '#3E5239',
  inkMuted:    '#8EA882',
  border:      '#D8EAD4',
  divider:     '#EBF4E8',

  gold:        '#F59E0B',
  goldPale:    '#FEF3C7',
  amber:       '#FF8F00',
  amberPale:   '#FFF3E0',
  red:         '#C62828',
  redPale:     '#FFEBEE',
  blue:        '#1565C0',
  bluePale:    '#E3F2FD',
};

const FONT  = { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 26, hero: 52 };
const SPACE = { xs: 6, sm: 10, md: 16, lg: 22, xl: 28 };

const SH = {
  sm: Platform.select({
    ios:     { shadowColor: '#1B5E20', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6  },
    android: { elevation: 3 },
  }),
  md: Platform.select({
    ios:     { shadowColor: '#1B5E20', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12 },
    android: { elevation: 6 },
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const SCORE = 4.8;
const SCORE_MAX = 5.0;
const SCORE_PCT = SCORE / SCORE_MAX; // 0.96

interface TrustFactor {
  id:        string;
  icon:      MCIcon;
  label:     string;
  sublabel:  string;
  points:    number;
  earned:    number;  // points actually earned (0 = not done)
  verified:  boolean;
}

const TRUST_FACTORS: TrustFactor[] = [
  { id: 'nic',      icon: 'card-account-details-outline', label: 'NIC Verified',             sublabel: 'National identity confirmed',           points: 20, earned: 20, verified: true  },
  { id: 'land',     icon: 'home-outline',                 label: 'Land Ownership',             sublabel: 'Ownership documents submitted',         points: 30, earned: 30, verified: true  },
  { id: 'harvest',  icon: 'sprout',                       label: 'Successful Harvests',        sublabel: '0 of 3 completed',                     points: 30, earned: 0,  verified: false },
  { id: 'feedback', icon: 'account-star-outline',         label: 'Investor Feedback',          sublabel: 'No investor ratings yet',              points: 15, earned: 0,  verified: false },
  { id: 'updates',  icon: 'camera-outline',               label: 'Regular Crop Updates',       sublabel: 'Post at least 3 project updates',      points: 10, earned: 0,  verified: false },
  { id: 'bank',     icon: 'bank-outline',                 label: 'Bank Account Linked',        sublabel: 'Secure payout account connected',      points: 10, earned: 10, verified: true  },
];

interface TipItem {
  icon:  MCIcon;
  title: string;
  body:  string;
}

const TIPS: TipItem[] = [
  { icon: 'shield-account-outline', title: 'Complete Identity Verification', body: 'Upload your NIC and confirm your address to earn instant trust.' },
  { icon: 'camera-plus-outline',    title: 'Share Regular Crop Updates',     body: 'Post photos and progress notes at least once a week.' },
  { icon: 'handshake-outline',      title: 'Maintain Investor Communication',body: 'Reply to investor messages within 48 hours to build confidence.' },
  { icon: 'check-decagram-outline', title: 'Complete Your Projects',         body: 'Every successfully completed project boosts your score significantly.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SCORE CONFIG
// ─────────────────────────────────────────────────────────────────────────────
interface ScoreConfig {
  label:     string;
  color:     string;
  bg:        string;
  ringColor: string;
  stars:     number;
}

function getScoreConfig(score: number): ScoreConfig {
  if (score >= 4.5) return { label: 'Excellent Reputation', color: T.primary,  bg: T.pale,      ringColor: T.leaf,   stars: 5 };
  if (score >= 3.5) return { label: 'Good Reputation',      color: T.mid,      bg: T.pale,      ringColor: T.accent, stars: 4 };
  if (score >= 2.5) return { label: 'Average Reputation',   color: T.amber,    bg: T.amberPale, ringColor: T.amber,  stars: 3 };
  return               { label: 'Needs Improvement',        color: T.red,      bg: T.redPale,   ringColor: T.red,    stars: 2 };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Animated score ring — drawn with a rotated border trick */
function ScoreRing({ score, config }: { score: number; config: ScoreConfig }) {
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: 1,
      duration: 1200,
      delay: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  const starIcon: IonIcon = 'star';

  return (
    <View style={ring.outer}>
      {/* Decorative outer glow ring */}
      <View style={[ring.glowRing, { borderColor: config.ringColor + '30' }]} />
      <View style={[ring.midRing,  { borderColor: config.ringColor + '60' }]} />

      {/* Main score circle */}
      <View style={[ring.circle, SH.md, { borderColor: config.ringColor }]}>
        {/* Score number */}
        <Text style={[ring.scoreNum, { color: config.color }]}>{score.toFixed(1)}</Text>

        {/* Stars */}
        <View style={ring.starsRow}>
          {Array.from({ length: 5 }, (_, i) => (
            <Ionicons
              key={i}
              name={starIcon}
              size={14}
              color={i < config.stars ? T.gold : T.border}
            />
          ))}
        </View>

        {/* Label */}
        <View style={[ring.labelPill, { backgroundColor: config.bg }]}>
          <Text style={[ring.labelText, { color: config.color }]}>{config.label}</Text>
        </View>
      </View>
    </View>
  );
}

const ring = StyleSheet.create({
  outer:     { alignItems: 'center', justifyContent: 'center', marginBottom: SPACE.lg },
  glowRing:  { position: 'absolute', width: 210, height: 210, borderRadius: 105, borderWidth: 12, borderColor: T.pale },
  midRing:   { position: 'absolute', width: 185, height: 185, borderRadius: 93,  borderWidth: 6,  borderColor: T.accentLight },
  circle:    { width: 160, height: 160, borderRadius: 80, backgroundColor: T.white, justifyContent: 'center', alignItems: 'center', borderWidth: 4, gap: 4 },
  scoreNum:  { fontSize: FONT.hero, fontWeight: '900', lineHeight: FONT.hero + 4 },
  starsRow:  { flexDirection: 'row', gap: 2 },
  labelPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginTop: 4 },
  labelText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6 },
});

/** Single trust factor row */
function FactorRow({ factor }: { factor: TrustFactor }) {
  const bg      = factor.verified ? T.pale      : T.surface;
  const iconBg  = factor.verified ? T.accentLight + '40' : T.border + '50';
  const iconCol = factor.verified ? T.primary    : T.inkMuted;
  const statCol = factor.verified ? T.primary    : T.inkMuted;

  const checkIcon: MCIcon = factor.verified ? 'check-circle' : 'circle-outline';

  return (
    <View style={[fr.row, { backgroundColor: bg }]}>
      {/* Left icon */}
      <View style={[fr.iconWrap, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={factor.icon} size={22} color={iconCol} />
      </View>

      {/* Text */}
      <View style={fr.textWrap}>
        <Text style={fr.label}>{factor.label}</Text>
        <Text style={fr.sub}>{factor.sublabel}</Text>
      </View>

      {/* Right: status + points */}
      <View style={fr.right}>
        <MaterialCommunityIcons name={checkIcon} size={22} color={statCol} />
        <Text style={[fr.pts, { color: statCol }]}>
          {factor.verified ? `+${factor.points}` : `0/${factor.points}`}
        </Text>
      </View>
    </View>
  );
}

const fr = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACE.md, paddingVertical: 14, borderRadius: 16, marginBottom: SPACE.xs, gap: SPACE.sm },
  iconWrap: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  textWrap: { flex: 1 },
  label:    { fontSize: FONT.md, fontWeight: '700', color: T.ink, marginBottom: 2 },
  sub:      { fontSize: FONT.xs, color: T.inkMuted, fontWeight: '500' },
  right:    { alignItems: 'center', gap: 3 },
  pts:      { fontSize: FONT.xs, fontWeight: '800' },
});

/** Improvement tip card */
function TipCard({ tip, index }: { tip: TipItem; index: number }) {
  const colors = [T.pale, T.goldPale, T.bluePale, T.amberPale];
  const icons  = [T.primary, T.amber, T.blue, T.amber];

  return (
    <View style={[tc.card, SH.sm, { backgroundColor: colors[index % colors.length] }]}>
      <View style={[tc.iconWrap, { backgroundColor: icons[index % icons.length] + '20' }]}>
        <MaterialCommunityIcons name={tip.icon} size={24} color={icons[index % icons.length]} />
      </View>
      <View style={tc.text}>
        <Text style={tc.title}>{tip.title}</Text>
        <Text style={tc.body}>{tip.body}</Text>
      </View>
    </View>
  );
}

const tc = StyleSheet.create({
  card:     { flexDirection: 'row', alignItems: 'flex-start', padding: SPACE.md, borderRadius: 18, marginBottom: SPACE.sm, gap: SPACE.sm },
  iconWrap: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  text:     { flex: 1 },
  title:    { fontSize: FONT.md, fontWeight: '800', color: T.ink, marginBottom: 3 },
  body:     { fontSize: FONT.sm, color: T.inkSub, lineHeight: 19 },
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function TrustScoreScreen() {
  const router = useRouter();
  const config = getScoreConfig(SCORE);

  const totalEarned   = TRUST_FACTORS.reduce((s, f) => s + f.earned, 0);
  const totalPossible = TRUST_FACTORS.reduce((s, f) => s + f.points, 0);
  const pctEarned     = Math.round((totalEarned / totalPossible) * 100);

  const backIcon: IonIcon = 'arrow-back';

  return (
    <View style={ms.root}>
      <StatusBar barStyle="light-content" backgroundColor={T.primary} />

      {/* ── HEADER ── */}
      <View style={ms.header}>
        <View style={ms.arc1} />
        <View style={ms.arc2} />

        <View style={ms.topNav}>
          <TouchableOpacity onPress={() => router.back()} style={ms.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name={backIcon} size={22} color={T.white} />
          </TouchableOpacity>
          <View style={ms.headText}>
            <Text style={ms.hTitle}>Farmer Trust Score</Text>
            <Text style={ms.hSub}>Your reputation for investors</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={ms.scroll} showsVerticalScrollIndicator={false}>

        {/* ── SCORE RING ── */}
        <ScoreRing score={SCORE} config={config} />

        {/* ── EXPLANATION ── */}
        <View style={[ms.explainCard, SH.sm]}>
          <MaterialCommunityIcons name={'information-outline' as MCIcon} size={20} color={T.primary} />
          <Text style={ms.explainText}>
            Your Trust Score helps investors decide whether to fund your projects. A higher score means faster funding and larger investments.
          </Text>
        </View>

        {/* ── POINTS SUMMARY ── */}
        <View style={[ms.summaryRow, SH.sm]}>
          <View style={ms.summaryBox}>
            <Text style={ms.sumValue}>{totalEarned}</Text>
            <Text style={ms.sumLabel}>Points Earned</Text>
          </View>
          <View style={ms.sumDivider} />
          <View style={ms.summaryBox}>
            <Text style={ms.sumValue}>{totalPossible}</Text>
            <Text style={ms.sumLabel}>Total Possible</Text>
          </View>
          <View style={ms.sumDivider} />
          <View style={ms.summaryBox}>
            <Text style={[ms.sumValue, { color: config.color }]}>{pctEarned}%</Text>
            <Text style={ms.sumLabel}>Completed</Text>
          </View>
        </View>

        {/* Points progress bar */}
        <View style={ms.progWrap}>
          <View style={ms.progTrack}>
            <View style={[ms.progFill, { width: `${pctEarned}%`, backgroundColor: config.ringColor }]} />
          </View>
          <Text style={ms.progLabel}>{pctEarned}% of trust criteria met</Text>
        </View>

        {/* ── TRUST FACTORS ── */}
        <View style={ms.section}>
          <Text style={ms.sectionTitle}>TRUST SCORE BREAKDOWN</Text>
          <View style={[ms.factorCard, SH.sm]}>
            {TRUST_FACTORS.map((f, i) => (
              <View key={f.id}>
                <FactorRow factor={f} />
                {i < TRUST_FACTORS.length - 1 && <View style={ms.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* ── HOW TO IMPROVE ── */}
        <View style={ms.section}>
          <Text style={ms.sectionTitle}>HOW TO INCREASE YOUR TRUST SCORE</Text>
          {TIPS.map((tip, i) => (
            <TipCard key={tip.title} tip={tip} index={i} />
          ))}
        </View>

        {/* ── FUTURE METRICS PLACEHOLDER ── */}
        <View style={ms.section}>
          <Text style={ms.sectionTitle}>COMING SOON</Text>
          <View style={[ms.futureCard, SH.sm]}>
            {[
              { icon: 'trophy-outline'         as MCIcon, label: 'Successful Projects Score'  },
              { icon: 'account-star-outline'   as MCIcon, label: 'Investor Rating Average'    },
              { icon: 'calendar-check-outline' as MCIcon, label: 'Update Consistency Score'   },
            ].map((item) => (
              <View key={item.label} style={ms.futureRow}>
                <MaterialCommunityIcons name={item.icon} size={20} color={T.inkMuted} />
                <Text style={ms.futureLabel}>{item.label}</Text>
                <View style={ms.comingSoonPill}>
                  <Text style={ms.comingSoonText}>Soon</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN STYLES
// ─────────────────────────────────────────────────────────────────────────────
const ms = StyleSheet.create({
  root:   { flex: 1, backgroundColor: T.surface },
  scroll: { paddingBottom: 120, paddingTop: SPACE.lg, paddingHorizontal: SPACE.md },

  // Header
  header: {
    backgroundColor: T.primary,
    paddingTop: 54,
    paddingBottom: SPACE.xl,
    paddingHorizontal: SPACE.md,
    overflow: 'hidden',
    position: 'relative',
  },
  arc1: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: T.deep,   opacity: 0.4, top: -120, right: -60  },
  arc2: { position: 'absolute', width: 120, height: 120, borderRadius: 60,  backgroundColor: T.accent, opacity: 0.15, bottom: -30, left: 20 },
  topNav:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn:  { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center' },
  headText: { alignItems: 'center' },
  hTitle:   { fontSize: FONT.lg, fontWeight: '800', color: T.white, letterSpacing: 0.2 },
  hSub:     { fontSize: FONT.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

  // Explanation
  explainCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: SPACE.sm,
    backgroundColor: T.white, borderRadius: 18, padding: SPACE.md,
    marginBottom: SPACE.md,
  },
  explainText: { flex: 1, fontSize: FONT.md, color: T.inkSub, lineHeight: 22 },

  // Summary
  summaryRow: {
    flexDirection: 'row', backgroundColor: T.white,
    borderRadius: 18, padding: SPACE.md,
    marginBottom: SPACE.sm,
  },
  summaryBox:  { flex: 1, alignItems: 'center', gap: 4 },
  sumDivider:  { width: 1, backgroundColor: T.divider },
  sumValue:    { fontSize: FONT.xl, fontWeight: '900', color: T.ink },
  sumLabel:    { fontSize: FONT.xs, fontWeight: '700', color: T.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' },

  // Progress
  progWrap:  { marginBottom: SPACE.lg },
  progTrack: { height: 8, backgroundColor: T.divider, borderRadius: 4, overflow: 'hidden', marginBottom: SPACE.xs },
  progFill:  { height: '100%', borderRadius: 4 },
  progLabel: { fontSize: FONT.xs, fontWeight: '700', color: T.inkMuted, textAlign: 'right' },

  // Section
  section:      { marginBottom: SPACE.lg },
  sectionTitle: { fontSize: FONT.xs, fontWeight: '800', color: T.inkMuted, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: SPACE.sm },

  // Factor card wrapper
  factorCard: { backgroundColor: T.white, borderRadius: 20, padding: SPACE.sm, overflow: 'hidden' },
  divider:    { height: 1, backgroundColor: T.divider, marginHorizontal: SPACE.sm },

  // Future card
  futureCard:  { backgroundColor: T.white, borderRadius: 20, padding: SPACE.md, gap: SPACE.sm },
  futureRow:   { flexDirection: 'row', alignItems: 'center', gap: SPACE.sm },
  futureLabel: { flex: 1, fontSize: FONT.md, fontWeight: '600', color: T.inkMuted },
  comingSoonPill: { backgroundColor: T.border, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  comingSoonText: { fontSize: FONT.xs, fontWeight: '700', color: T.inkMuted },
});