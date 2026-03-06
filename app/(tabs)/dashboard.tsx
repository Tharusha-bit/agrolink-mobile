import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { getSession, type AuthSession, type UserRole } from '../../src/lib/auth';
import {
  createInvestmentRequest,
  deleteInvestmentRequest,
  fetchAiAssessment,
  fetchFarmerInvestmentRequests,
  fetchInvestmentRequests,
  fetchRoleNetwork,
  investInRequest,
  type AiAssessment,
  type FarmerOpportunity,
  type InvestorConnection,
} from '../../src/lib/dashboard';

const COLORS = {
  primary: '#216000',
  primaryPale: '#E8F5E1',
  white: '#FFFFFF',
  surface: '#F7F9F4',
  text: '#1A2E0D',
  textMuted: '#6D8660',
  border: '#DDE8D4',
  gold: '#F5A623',
  blue: '#3A9BD5',
  danger: '#D32F2F',
  overlay: 'rgba(12, 25, 8, 0.45)',
};

const farmerStats = [
  { label: 'Active Fields', value: '08', icon: 'sprout', color: COLORS.primary },
  { label: 'Pending Funding', value: 'LKR 120K', icon: 'cash-clock', color: COLORS.gold },
  { label: 'Investors Visible', value: '03', icon: 'account-group', color: COLORS.blue },
];

const investorStats = [
  { label: 'Live Deals', value: '12', icon: 'briefcase-search', color: COLORS.primary },
  { label: 'Farmers Seeking Capital', value: '03', icon: 'sprout', color: COLORS.gold },
  { label: 'Expected Return', value: '18%', icon: 'trending-up', color: COLORS.blue },
];

function formatCurrency(value: number) {
  return `LKR ${value.toLocaleString()}`;
}

function formatDateLabel(date?: string) {
  if (!date) {
    return 'Recently updated';
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return 'Recently updated';
  }

  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function FarmerInvestorCard({
  item,
}: {
  item: InvestorConnection;
}) {
  return (
    <View style={styles.feedCard}>
      <View style={styles.feedCardHeader}>
        <View style={styles.avatarBox}>
          <MaterialCommunityIcons name="account-tie" size={22} color={COLORS.primary} />
        </View>
        <View style={styles.feedCardTitleWrap}>
          <Text style={styles.feedCardTitle}>{item.name}</Text>
          <Text style={styles.feedCardSubtitle}>{item.company}</Text>
        </View>
        <View style={styles.metricPill}>
          <Text style={styles.metricPillText}>{formatCurrency(item.investedAmount)}</Text>
        </View>
      </View>

      <Text style={styles.feedCardBody}>{item.fitNote}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Avg Return</Text>
          <Text style={styles.metaValue}>{item.preferredReturnRate}</Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Projects</Text>
          <Text style={styles.metaValue}>{item.activeProjects}</Text>
        </View>
      </View>

      <View style={styles.statusBadge}>
        <MaterialCommunityIcons name="cash-check" size={16} color={COLORS.primary} />
        <Text style={styles.statusBadgeText}>Investor already connected to your farm</Text>
      </View>
    </View>
  );
}

function InvestorFarmerCard({
  item,
  onAskAi,
  onInvestNow,
  onDeleteRequest,
  showInvestorActions,
  busy,
}: {
  item: FarmerOpportunity;
  onAskAi?: (entityId: string) => void;
  onInvestNow?: (requestId: string) => void;
  onDeleteRequest?: (requestId: string) => void;
  showInvestorActions: boolean;
  busy?: boolean;
}) {
  const progress = Math.round((item.raisedAmount / item.amountNeeded) * 100);
  const riskColor = item.riskLevel === 'Low' ? COLORS.primary : item.riskLevel === 'Medium' ? COLORS.gold : COLORS.danger;

  return (
    <View style={styles.feedCard}>
      <View style={styles.feedCardHeader}>
        <View style={styles.avatarBox}>
          <MaterialCommunityIcons name="sprout" size={22} color={COLORS.primary} />
        </View>
        <View style={styles.feedCardTitleWrap}>
          <Text style={styles.feedCardTitle}>{item.name}</Text>
          <Text style={styles.feedCardSubtitle}>{item.crop} • {item.location}</Text>
          <Text style={styles.feedCardDate}>Updated {formatDateLabel(item.createdAt)}</Text>
        </View>
        <View style={[styles.metricPill, { backgroundColor: `${riskColor}18` }]}>
          <Text style={[styles.metricPillText, { color: riskColor }]}>{item.riskLevel} Risk</Text>
        </View>
      </View>

      <Text style={styles.feedCardBody}>{item.summary}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Raised</Text>
          <Text style={styles.metaValue}>{formatCurrency(item.raisedAmount)}</Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Need</Text>
          <Text style={styles.metaValue}>{formatCurrency(item.amountNeeded)}</Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Past Rate</Text>
          <Text style={styles.metaValue}>{item.historicalReturnRate}</Text>
        </View>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}% funded</Text>
      </View>

      {showInvestorActions ? (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => onAskAi?.(item.id)} disabled={busy}>
            <MaterialCommunityIcons name="robot-outline" size={18} color={COLORS.primary} />
            <Text style={styles.secondaryButtonText}>Ask AI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.aiButton} onPress={() => onInvestNow?.(item.id)} disabled={busy}>
            {busy ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <MaterialCommunityIcons name="cash-plus" size={18} color={COLORS.white} />
                <Text style={styles.aiButtonText}>Invest Now</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <View style={styles.statusBadgeInline}>
            <MaterialCommunityIcons name="clipboard-check-outline" size={16} color={COLORS.primary} />
            <Text style={styles.statusBadgeText}>This is your live investment request</Text>
          </View>
          <TouchableOpacity style={styles.dangerButton} onPress={() => onDeleteRequest?.(item.id)} disabled={busy}>
            {busy ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <MaterialCommunityIcons name="trash-can-outline" size={18} color={COLORS.white} />
                <Text style={styles.dangerButtonText}>Delete</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [role, setRole] = useState<UserRole>('farmer');
  const [name, setName] = useState('AgroLink User');
  const [investors, setInvestors] = useState<InvestorConnection[]>([]);
  const [requests, setRequests] = useState<FarmerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAssessment, setAiAssessment] = useState<AiAssessment | null>(null);
  const [aiVisible, setAiVisible] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [investingRequestId, setInvestingRequestId] = useState('');
  const [deletingRequestId, setDeletingRequestId] = useState('');
  const [requestCrop, setRequestCrop] = useState('');
  const [requestLocation, setRequestLocation] = useState('');
  const [requestAmount, setRequestAmount] = useState('');
  const [requestRisk, setRequestRisk] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [requestSummary, setRequestSummary] = useState('');
  const compactLayout = width < 420;

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const currentSession = await getSession();
        if (!active || !currentSession) {
          setLoading(false);
          return;
        }

        setSession(currentSession);
        setRole(currentSession.user.role);
        setName(currentSession.user.name);

        const network = await fetchRoleNetwork(currentSession);
        if (!active) {
          return;
        }

        if (network.role === 'farmer') {
          setInvestors(network.investors);
          const farmerRequests = await fetchFarmerInvestmentRequests(currentSession);
          if (!active) {
            return;
          }
          setRequests(farmerRequests.requests);
        } else {
          const investorRequests = await fetchInvestmentRequests(currentSession);
          if (!active) {
            return;
          }
          setRequests(investorRequests.requests.length > 0 ? investorRequests.requests : network.farmers);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard data.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const handleAskAi = async (entityId: string) => {
    if (!session || session.user.role !== 'investor') {
      return;
    }

    setAiVisible(true);
    setAiLoading(true);
    setAiAssessment(null);

    try {
      const response = await fetchAiAssessment(session, entityId);
      setAiAssessment(response);
    } catch (aiError) {
      setAiAssessment({
        entityId,
        headline: 'AI insight unavailable',
        recommendation: 'Try again once the backend is reachable.',
        previousRate: 'No historical rate could be loaded.',
        outlook: 'Connection issue prevented a fresh dummy assessment.',
        confidence: 'Low confidence',
        summary: aiError instanceof Error ? aiError.message : 'Unknown AI request error.',
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!session) {
      return;
    }

    if (!requestCrop.trim() || !requestLocation.trim() || !requestAmount.trim() || !requestSummary.trim()) {
      Alert.alert('Missing details', 'Enter crop, location, amount, and summary before submitting the request.');
      return;
    }

    const amountNeeded = Number(requestAmount);
    if (!Number.isFinite(amountNeeded) || amountNeeded < 1000) {
      Alert.alert('Invalid amount', 'Enter an amount of at least LKR 1,000.');
      return;
    }

    try {
      setSubmittingRequest(true);
      const created = await createInvestmentRequest(session, {
        crop: requestCrop.trim(),
        location: requestLocation.trim(),
        amountNeeded,
        riskLevel: requestRisk,
        summary: requestSummary.trim(),
      });

      setRequests((current) => [created, ...current]);
      setRequestCrop('');
      setRequestLocation('');
      setRequestAmount('');
      setRequestSummary('');
      setRequestRisk('Medium');
      Alert.alert('Request submitted', 'Your investment request is now visible to investors.');
    } catch (requestError) {
      Alert.alert(
        'Unable to submit request',
        requestError instanceof Error ? requestError.message : 'Unknown request error.',
      );
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleInvestNow = async (requestId: string) => {
    if (!session || session.user.role !== 'investor') {
      return;
    }

    try {
      setInvestingRequestId(requestId);
      const updated = await investInRequest(session, requestId, 5000);
      setRequests((current) => current.map((request) => (request.id === requestId ? updated : request)));
      Alert.alert('Investment recorded', 'LKR 5,000 has been added to this request.');
    } catch (investmentError) {
      Alert.alert(
        'Investment failed',
        investmentError instanceof Error ? investmentError.message : 'Unknown investment error.',
      );
    } finally {
      setInvestingRequestId('');
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!session || session.user.role !== 'farmer') {
      return;
    }

    Alert.alert(
      'Delete request',
      'This will remove the request from the active database and from the investor feed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingRequestId(requestId);
              await deleteInvestmentRequest(session, requestId);
              setRequests((current) => current.filter((request) => request.id !== requestId));
              Alert.alert('Request deleted', 'The request was removed from your account and the shared database.');
            } catch (deleteError) {
              Alert.alert(
                'Delete failed',
                deleteError instanceof Error ? deleteError.message : 'Unknown delete error.',
              );
            } finally {
              setDeletingRequestId('');
            }
          },
        },
      ],
    );
  };

  const stats =
    role === 'farmer'
      ? [
          farmerStats[0],
          { ...farmerStats[1], value: `LKR ${requests.reduce((sum, item) => sum + item.amountNeeded, 0).toLocaleString()}` },
          { ...farmerStats[2], value: String(investors.length).padStart(2, '0') },
        ]
      : [
          investorStats[0],
          { ...investorStats[1], value: String(requests.length).padStart(2, '0') },
          investorStats[2],
        ];

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>{role === 'farmer' ? 'Farmer Dashboard' : 'Investor Dashboard'}</Text>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>
            {role === 'farmer'
              ? 'See the investors backing your farm and create investment requests that investors can review.'
              : 'See farmer investment requests, use AI before investing, and fund requests directly from this screen.'}
          </Text>
        </View>

        <View style={[styles.grid, compactLayout && styles.gridCompact]}>
          {stats.map((item) => (
            <View key={item.label} style={[styles.card, compactLayout && styles.cardCompact]}>
              <View style={[styles.iconWrap, { backgroundColor: `${item.color}1A` }]}>
                <MaterialCommunityIcons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={styles.cardValue}>{item.value}</Text>
              <Text style={styles.cardLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{role === 'farmer' ? 'Investment Requests' : 'Farmer Opportunity Feed'}</Text>
          <Text style={styles.panelText}>
            {role === 'farmer'
              ? 'Use the existing dashboard to submit requests and track what investors have already funded, while keeping your connected investors visible below.'
              : 'These live requests can be reviewed, checked with AI, and funded directly from the existing dashboard UI.'}
          </Text>
        </View>

        {role === 'farmer' ? (
          <View style={styles.requestComposer}>
            <Text style={styles.requestComposerTitle}>Create Investment Request</Text>
            <Text style={styles.requestComposerSubtitle}>Add a request so investors can review and fund it.</Text>

            <View style={[styles.inputRow, compactLayout && styles.inputRowCompact]}>
              <TextInput
                value={requestCrop}
                onChangeText={setRequestCrop}
                placeholder="Crop"
                placeholderTextColor={COLORS.textMuted}
                style={[styles.input, compactLayout && styles.inputCompact]}
              />
              <TextInput
                value={requestLocation}
                onChangeText={setRequestLocation}
                placeholder="Location"
                placeholderTextColor={COLORS.textMuted}
                style={[styles.input, compactLayout && styles.inputCompact]}
              />
            </View>

            <View style={[styles.inputRow, compactLayout && styles.inputRowCompact]}>
              <TextInput
                value={requestAmount}
                onChangeText={setRequestAmount}
                placeholder="Amount needed"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
                style={[styles.input, compactLayout && styles.inputCompact]}
              />
              <View style={[styles.riskSelector, compactLayout && styles.inputCompact]}>
                {(['Low', 'Medium', 'High'] as const).map((risk) => (
                  <TouchableOpacity
                    key={risk}
                    style={[styles.riskChip, requestRisk === risk && styles.riskChipActive]}
                    onPress={() => setRequestRisk(risk)}
                  >
                    <Text style={[styles.riskChipText, requestRisk === risk && styles.riskChipTextActive]}>{risk}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              value={requestSummary}
              onChangeText={setRequestSummary}
              placeholder="What will this investment be used for?"
              placeholderTextColor={COLORS.textMuted}
              multiline
              style={[styles.input, styles.textArea]}
            />

            <TouchableOpacity style={styles.aiButton} onPress={handleCreateRequest} disabled={submittingRequest}>
              {submittingRequest ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <MaterialCommunityIcons name="plus-circle-outline" size={18} color={COLORS.white} />
                  <Text style={styles.aiButtonText}>Submit Request</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>{role === 'farmer' ? 'Your Live Requests' : 'Requests Open For Investment'}</Text>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading role data...</Text>
          </View>
        ) : null}

        {!loading && error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!loading && !error && role === 'farmer'
          ? requests.map((item) => (
              <InvestorFarmerCard
                key={item.id}
                item={item}
                showInvestorActions={false}
                onDeleteRequest={handleDeleteRequest}
                busy={deletingRequestId === item.id}
              />
            ))
          : null}

        {!loading && !error && role === 'investor'
          ? requests.map((item) => (
              <InvestorFarmerCard
                key={item.id}
                item={item}
                onAskAi={handleAskAi}
                onInvestNow={handleInvestNow}
                showInvestorActions
                busy={investingRequestId === item.id}
              />
            ))
          : null}

        {!loading && !error && requests.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name={role === 'farmer' ? 'clipboard-text-outline' : 'sprout-outline'}
              size={28}
              color={COLORS.primary}
            />
            <Text style={styles.emptyStateTitle}>
              {role === 'farmer' ? 'No requests created yet' : 'No investment requests available'}
            </Text>
            <Text style={styles.emptyStateText}>
              {role === 'farmer'
                ? 'Create your own investment request above. Only your requests appear in this view.'
                : 'Investor accounts can review and invest in all live farmer requests from here.'}
            </Text>
          </View>
        ) : null}

        {role === 'farmer' ? <Text style={styles.sectionTitle}>Investors Backing You</Text> : null}
        {!loading && !error && role === 'farmer'
          ? investors.map((item) => <FarmerInvestorCard key={item.id} item={item} />)
          : null}
      </ScrollView>

      <Modal animationType="fade" transparent visible={aiVisible} onRequestClose={() => setAiVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setAiVisible(false)}>
          <Pressable style={styles.modalCard} onPress={() => undefined}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AI Investment Insight</Text>
              <TouchableOpacity onPress={() => setAiVisible(false)}>
                <MaterialCommunityIcons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {aiLoading ? (
              <View style={styles.modalLoadingWrap}>
                <ActivityIndicator color={COLORS.primary} />
                <Text style={styles.loadingText}>Preparing dummy AI response...</Text>
              </View>
            ) : null}

            {!aiLoading && aiAssessment ? (
              <View>
                <Text style={styles.aiHeadline}>{aiAssessment.headline}</Text>
                <Text style={styles.aiRecommendation}>{aiAssessment.recommendation}</Text>

                <View style={styles.aiInfoBox}>
                  <Text style={styles.aiInfoLabel}>Previous rates</Text>
                  <Text style={styles.aiInfoText}>{aiAssessment.previousRate}</Text>
                </View>

                <View style={styles.aiInfoBox}>
                  <Text style={styles.aiInfoLabel}>Outlook</Text>
                  <Text style={styles.aiInfoText}>{aiAssessment.outlook}</Text>
                </View>

                <View style={styles.aiInfoBox}>
                  <Text style={styles.aiInfoLabel}>Confidence</Text>
                  <Text style={styles.aiInfoText}>{aiAssessment.confidence}</Text>
                </View>

                <Text style={styles.aiSummary}>{aiAssessment.summary}</Text>
              </View>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 20, paddingBottom: 120 },
  hero: { backgroundColor: COLORS.primary, borderRadius: 24, padding: 22, marginBottom: 20 },
  eyebrow: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: '900', marginTop: 8 },
  subtitle: { color: 'rgba(255,255,255,0.82)', fontSize: 13, lineHeight: 20, marginTop: 10 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
  gridCompact: { gap: 10 },
  card: { flex: 1, minWidth: 150, backgroundColor: COLORS.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  cardCompact: { minWidth: '100%' as const },
  iconWrap: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardValue: { fontSize: 18, fontWeight: '900', color: COLORS.text, marginBottom: 4 },
  cardLabel: { fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },
  panel: { backgroundColor: COLORS.primaryPale, borderRadius: 20, padding: 18, marginBottom: 20 },
  panelTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800', marginBottom: 8 },
  panelText: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '900', marginBottom: 14 },
  loadingWrap: { alignItems: 'center', paddingVertical: 30, gap: 10 },
  loadingText: { color: COLORS.textMuted, fontSize: 13, marginTop: 10 },
  errorText: { color: COLORS.danger, fontSize: 13, fontWeight: '700', marginBottom: 16 },
  feedCard: { backgroundColor: COLORS.white, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16 },
  feedCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12, flexWrap: 'wrap' },
  avatarBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: COLORS.primaryPale, alignItems: 'center', justifyContent: 'center' },
  feedCardTitleWrap: { flex: 1, minWidth: 140 },
  feedCardTitle: { color: COLORS.text, fontSize: 16, fontWeight: '900', marginBottom: 2 },
  feedCardSubtitle: { color: COLORS.textMuted, fontSize: 12 },
  feedCardDate: { color: COLORS.textMuted, fontSize: 11, marginTop: 4 },
  metricPill: { backgroundColor: COLORS.primaryPale, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  metricPillText: { color: COLORS.primary, fontSize: 11, fontWeight: '800' },
  feedCardBody: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20, marginBottom: 14 },
  metaRow: { flexDirection: 'row', gap: 10, marginBottom: 14, flexWrap: 'wrap' },
  metaBox: { flex: 1, minWidth: 92, backgroundColor: COLORS.surface, borderRadius: 14, padding: 12 },
  metaLabel: { color: COLORS.textMuted, fontSize: 11, marginBottom: 4 },
  metaValue: { color: COLORS.text, fontSize: 13, fontWeight: '800' },
  progressBlock: { marginBottom: 14 },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: COLORS.border, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 999 },
  progressText: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700' },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  aiButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 14 },
  aiButtonText: { color: COLORS.white, fontSize: 13, fontWeight: '800' },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primaryPale, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16 },
  secondaryButtonText: { color: COLORS.primary, fontSize: 13, fontWeight: '800' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primaryPale, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10 },
  statusBadgeInline: { flex: 1, minWidth: 160, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primaryPale, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10 },
  statusBadgeText: { color: COLORS.primary, fontSize: 12, fontWeight: '700', flexShrink: 1 },
  dangerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.danger, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16 },
  dangerButtonText: { color: COLORS.white, fontSize: 13, fontWeight: '800' },
  requestComposer: { backgroundColor: COLORS.white, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: COLORS.border, marginBottom: 20 },
  requestComposerTitle: { color: COLORS.text, fontSize: 16, fontWeight: '900', marginBottom: 4 },
  requestComposerSubtitle: { color: COLORS.textMuted, fontSize: 12, lineHeight: 18, marginBottom: 14 },
  emptyState: { alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 22, padding: 22, borderWidth: 1, borderColor: COLORS.border, marginBottom: 18 },
  emptyStateTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800', marginTop: 10, marginBottom: 6 },
  emptyStateText: { color: COLORS.textMuted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  inputRowCompact: { flexWrap: 'wrap' },
  input: { flex: 1, minWidth: 120, backgroundColor: COLORS.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  inputCompact: { minWidth: '100%' as const },
  textArea: { minHeight: 98, textAlignVertical: 'top', marginBottom: 12 },
  riskSelector: { flex: 1, minWidth: 120, flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  riskChip: { backgroundColor: COLORS.surface, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border },
  riskChipActive: { backgroundColor: COLORS.primary },
  riskChipText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700' },
  riskChipTextActive: { color: COLORS.white },
  modalBackdrop: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: COLORS.white, borderRadius: 24, padding: 20, maxHeight: '85%' as const },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: '900' },
  modalLoadingWrap: { alignItems: 'center', paddingVertical: 24 },
  aiHeadline: { color: COLORS.text, fontSize: 17, fontWeight: '900', marginBottom: 8 },
  aiRecommendation: { color: COLORS.primary, fontSize: 14, fontWeight: '800', marginBottom: 14 },
  aiInfoBox: { backgroundColor: COLORS.primaryPale, borderRadius: 16, padding: 14, marginBottom: 10 },
  aiInfoLabel: { color: COLORS.text, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 },
  aiInfoText: { color: COLORS.textMuted, fontSize: 13, lineHeight: 19 },
  aiSummary: { color: COLORS.text, fontSize: 13, lineHeight: 20, marginTop: 4 },
});