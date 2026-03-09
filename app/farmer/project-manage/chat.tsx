import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { ComponentProps, useState } from 'react';
import {
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// ICON TYPES
// ─────────────────────────────────────────────────────────────────────────────
type IonIcon = ComponentProps<typeof Ionicons>['name'];
type MCIcon  = ComponentProps<typeof MaterialCommunityIcons>['name'];

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  primary:     '#216000',
  primaryMid:  '#2E8B00',
  primaryPale: '#E8F5E1',
  accent:      '#76C442',
  surface:     '#F7F9F4',
  white:       '#FFFFFF',
  ink:         '#1A2E0D',
  inkSub:      '#4A6741',
  inkMuted:    '#9BB08A',
  border:      '#DDE8D4',
  divider:     '#EEF5E8',
  unread:      '#76C442',
  unreadPale:  '#F0FAE8',
  gold:        '#F59E0B',
};

const SH = {
  sm: Platform.select({
    ios:     { shadowColor: '#1A2E0D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6  },
    android: { elevation: 2 },
  }),
  md: Platform.select({
    ios:     { shadowColor: '#1A2E0D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 10 },
    android: { elevation: 4 },
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface ChatItem {
  id:        string;
  name:      string;
  role:      string;
  message:   string;
  time:      string;
  unread:    boolean;
  unreadCount?: number;
  online?:   boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const CHATS: ChatItem[] = [
  {
    id:          '1',
    name:        'Dr. Perera',
    role:        'Lead Investor',
    message:     'Is the harvest on schedule for this season?',
    time:        '2m ago',
    unread:      true,
    unreadCount: 3,
    online:      true,
  },
  {
    id:          '2',
    name:        'InvestCorp Agent',
    role:        'Institutional Investor',
    message:     'Funds have been transferred to your account.',
    time:        '1h ago',
    unread:      true,
    unreadCount: 1,
    online:      false,
  },
  {
    id:          '3',
    name:        'Saman Kumara',
    role:        'Private Investor',
    message:     'Great progress on the farm update photos!',
    time:        '1d ago',
    unread:      false,
    online:      false,
  },
  {
    id:          '4',
    name:        'Nirosha Fernando',
    role:        'Angel Investor',
    message:     'When is the expected return date?',
    time:        '2d ago',
    unread:      false,
    online:      true,
  },
  {
    id:          '5',
    name:        'Agro Capital Ltd',
    role:        'Fund Manager',
    message:     'We are interested in the next project too.',
    time:        '3d ago',
    unread:      false,
    online:      false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AVATAR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
// Deterministic colour from name initial
const AVATAR_COLORS = ['#2E7D32', '#1565C0', '#6A1B9A', '#BF360C', '#37474F'];
function avatarColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function Avatar({ name, online }: { name: string; online?: boolean }) {
  return (
    <View style={av.wrap}>
      <View style={[av.circle, { backgroundColor: avatarColor(name) + '22' }]}>
        <Text style={[av.initial, { color: avatarColor(name) }]}>
          {name[0].toUpperCase()}
        </Text>
      </View>
      {online && <View style={av.onlineDot} />}
    </View>
  );
}

const av = StyleSheet.create({
  wrap:      { position: 'relative', marginRight: 14 },
  circle:    { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  initial:   { fontSize: 20, fontWeight: '800' },
  onlineDot: { position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: 7, backgroundColor: C.accent, borderWidth: 2, borderColor: C.white },
});

// ─────────────────────────────────────────────────────────────────────────────
// CHAT ROW COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function ChatRow({ item, onPress }: { item: ChatItem; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[cr.card, SH.sm, item.unread && cr.cardUnread]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      <Avatar name={item.name} online={item.online} />

      <View style={cr.content}>
        {/* Name + time */}
        <View style={cr.topRow}>
          <Text style={[cr.name, item.unread && cr.nameUnread]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[cr.time, item.unread && cr.timeUnread]}>{item.time}</Text>
        </View>

        {/* Role tag */}
        <Text style={cr.role}>{item.role}</Text>

        {/* Message preview */}
        <Text
          style={[cr.preview, item.unread && cr.previewUnread]}
          numberOfLines={1}
        >
          {item.message}
        </Text>
      </View>

      {/* Unread badge */}
      {item.unread && item.unreadCount ? (
        <View style={cr.badge}>
          <Text style={cr.badgeText}>{item.unreadCount}</Text>
        </View>
      ) : (
        <MaterialCommunityIcons
          name={'chevron-right' as MCIcon}
          size={18}
          color={C.inkMuted}
        />
      )}
    </TouchableOpacity>
  );
}

const cr = StyleSheet.create({
  card:         { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, padding: 14, borderRadius: 18, marginBottom: 10, borderWidth: 1, borderColor: C.border },
  cardUnread:   { borderColor: C.accent + '60', backgroundColor: C.unreadPale },
  content:      { flex: 1 },
  topRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  name:         { fontSize: 15, fontWeight: '700', color: C.ink, flex: 1, marginRight: 8 },
  nameUnread:   { fontWeight: '800', color: C.primary },
  time:         { fontSize: 11, color: C.inkMuted },
  timeUnread:   { color: C.primary, fontWeight: '700' },
  role:         { fontSize: 11, fontWeight: '600', color: C.accent, marginBottom: 4 },
  preview:      { fontSize: 13, color: C.inkMuted, lineHeight: 18 },
  previewUnread:{ color: C.inkSub, fontWeight: '600' },
  badge:        { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: C.accent, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 },
  badgeText:    { fontSize: 11, fontWeight: '900', color: C.white },
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [query, setQuery] = useState('');

  const filtered = CHATS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.message.toLowerCase().includes(query.toLowerCase())
  );

  const unreadTotal = CHATS.filter((c) => c.unread).length;

  function handleBack() {
    if (id) router.push(`/farmer/project-manage/${id}` as any);
    else     router.back();
  }

  const backIcon:   IonIcon = 'arrow-back';
  const chatIcon:   MCIcon  = 'message-text-outline';
  const searchIcon: IonIcon = 'search';
  const clearIcon:  IonIcon = 'close-circle';

  return (
    <View style={ms.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* ── HEADER ── */}
      <View style={ms.header}>
        <View style={ms.arc} />

        <View style={ms.topNav}>
          <TouchableOpacity
            onPress={handleBack}
            style={ms.navBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name={backIcon} size={22} color={C.white} />
          </TouchableOpacity>

          <View style={ms.headCenter}>
            <Text style={ms.hTitle}>Investor Chat</Text>
            {unreadTotal > 0 && (
              <View style={ms.unreadBubble}>
                <Text style={ms.unreadBubbleText}>{unreadTotal} unread</Text>
              </View>
            )}
          </View>

          <View style={[ms.navBtn, ms.navBtnRight]}>
            <MaterialCommunityIcons name={chatIcon} size={20} color="rgba(255,255,255,0.7)" />
          </View>
        </View>

        {/* Subtitle */}
        <Text style={ms.hSub}>Messages from your project investors</Text>

        {/* Search bar */}
        <View style={ms.searchBox}>
          <Ionicons name={searchIcon} size={18} color={C.inkMuted} />
          <TextInput
            style={ms.searchInput}
            placeholder="Search investors or messages…"
            placeholderTextColor={C.inkMuted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name={clearIcon} size={16} color={C.inkMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── CHAT LIST ── */}
      {filtered.length === 0 ? (
        <View style={ms.empty}>
          <MaterialCommunityIcons name={'message-off-outline' as MCIcon} size={48} color={C.accent} />
          <Text style={ms.emptyTitle}>No conversations found</Text>
          <Text style={ms.emptySub}>Try a different search term.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={ms.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <Text style={ms.listCount}>
              {filtered.length} conversation{filtered.length !== 1 ? 's' : ''}
            </Text>
          }
          renderItem={({ item }) => (
            <ChatRow
              item={item}
              onPress={() => router.push(`/farmer/chat-thread/${item.id}?projectId=${id}` as any)}
            />
          )}
        />
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const ms = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },

  // Header
  header: {
    backgroundColor: C.primary,
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    gap: 10,
  },
  arc: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: C.primaryMid, opacity: 0.25, top: -100, right: -50,
  },

  topNav:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navBtn:       { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.16)', justifyContent: 'center', alignItems: 'center' },
  navBtnRight:  { backgroundColor: 'transparent' },
  headCenter:   { alignItems: 'center', gap: 4 },
  hTitle:       { fontSize: 18, fontWeight: '800', color: C.white, letterSpacing: 0.2 },
  hSub:         { fontSize: 12, color: 'rgba(255,255,255,0.65)' },

  unreadBubble:    { backgroundColor: C.accent, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 20 },
  unreadBubbleText:{ fontSize: 10, fontWeight: '800', color: C.white },

  // Search
  searchBox:   { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 14, paddingHorizontal: 12, height: 46, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: C.ink },

  // List
  list:       { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 140 },
  listCount:  { fontSize: 11, fontWeight: '700', color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },

  // Empty state
  empty:      { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, paddingBottom: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: C.ink },
  emptySub:   { fontSize: 14, color: C.inkMuted },
});