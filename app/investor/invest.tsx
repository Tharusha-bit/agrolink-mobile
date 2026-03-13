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
      {/*STICKY HEADER*/}
      <View style={s.topBar}>
        <View style={s.topBarInner}>
          <View>
            <Text style={s.topBarBrand}>AgroLink Private Wealth</Text>
            <Text style={s.topBarTitle}>Marketplace</Text>
          </View>
          <View style={s.liveBadge}>
            <View style={s.liveDot} />
            <Text style={s.liveText}>Live</Text>
          </View>
        </View>
        {/* Search */}
        <View style={s.searchBox}>
          <MaterialCommunityIcons name="magnify" size={20} color={C.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search opportunities..."
            placeholderTextColor={C.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color={C.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[s.filterChip, filter === f && s.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[s.filterChipText, filter === f && s.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Results count */}
        <View style={s.resultsRow}>
          <Text style={s.resultsText}>
            <Text style={s.resultsCount}>{filtered.length}</Text> opportunities found
          </Text>
          <TouchableOpacity style={s.sortBtn}>
            <MaterialCommunityIcons name="sort" size={16} color={C.primary} />
            <Text style={s.sortText}>Sort</Text>
          </TouchableOpacity>
        </View>
        {/*PROJECT CARDS*/}
        {filtered.length === 0 ? (
          <View style={s.emptyState}>
            <MaterialCommunityIcons name="magnify-close" size={48} color={C.textMuted} />
            <Text style={s.emptyTitle}>No results found</Text>
            <Text style={s.emptySub}>Try adjusting your search or filters</Text>
          </View>
        ) : (
          filtered.map((project) => {
            const risk = RISK_COLORS[project.riskLevel] || RISK_COLORS.Medium;
            const progress = project.progress ?? 0;

            return (
              <TouchableOpacity
                key={project.id}
                style={[s.card, SHADOW.md]}
                activeOpacity={0.88}
                onPress={() => router.push(`/investment/${project.id}` as any)}
              >
                {/* Image */}
                <View style={s.cardImgWrap}>
                  <Image source={{ uri: project.image }} style={s.cardImg} />
                  <View style={s.cardImgOverlay} />

                  {/* Floating badges */}
                  <View style={s.cardBadges}>
                    <View style={s.roiBadge}>
                      <MaterialCommunityIcons name="trending-up" size={10} color={C.white} />
                      <Text style={s.roiBadgeText}>{project.roi} ROI</Text>
                    </View>
                    <View style={[s.riskBadge, { backgroundColor: risk.bg }]}>
                      <Text style={[s.riskBadgeText, { color: risk.text }]}>{project.riskLevel} Risk</Text>
                    </View>
                  </View>

                  {/* AI Score */}
                  <View style={s.aiScoreWrap}>
                    <MaterialCommunityIcons name="brain" size={11} color={C.gold} />
                    <Text style={s.aiScoreText}>AI {aiScore(project.id)}</Text>
                  </View>
                </View>
                {/* Body */}
                <View style={s.cardBody}>
                  <Text style={s.cardTitle} numberOfLines={1}>{project.title}</Text>

                  <View style={s.cardMetaRow}>
                    <MaterialCommunityIcons name="map-marker-outline" size={12} color={C.textMuted} />
                    <Text style={s.cardMeta}>{project.location}</Text>
                    <View style={s.cardMetaDot} />
                    <MaterialCommunityIcons name="account-outline" size={12} color={C.textMuted} />
                    <Text style={s.cardMeta}>{project.farmer}</Text>
                  </View>

                  {/* Tags */}
                  {project.tags.length > 0 && (
                    <View style={s.tagsRow}>
                      {project.tags.slice(0, 3).map((tag) => (
                        <View key={tag} style={s.tag}>
                          <Text style={s.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Progress bar */}
                  <View style={s.progressRow}>
                    <View style={s.progressTrack}>
                      <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
                    </View>
                    <Text style={s.progressPct}>{Math.round(progress * 100)}%</Text>
                  </View>
                  {/* Footer */}
                  <View style={s.cardFooter}>
                    <View style={s.cardFooterLeft}>
                      <View style={s.footerItem}>
                        <Text style={s.footerLabel}>Target</Text>
                        <Text style={s.footerVal}>LKR {project.goal.toLocaleString()}</Text>
                      </View>
                      <View style={s.footerDivider} />
                      <View style={s.footerItem}>
                        <Text style={s.footerLabel}>Duration</Text>
                        <Text style={s.footerVal}>{project.duration}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={s.viewBtn}
                      onPress={() => router.push(`/investment/${project.id}` as any)}
                    >
                      <Text style={s.viewBtnText}>View</Text>
                      <MaterialCommunityIcons name="chevron-right" size={16} color={C.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

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

      