import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AppAlertItem,
  buildAlertsForSession,
  getReadAlertIds,
  markAlertRead,
  markAllAlertsRead,
} from "../src/lib/alerts";
import {
  NETWORK_ERROR_MESSAGE,
  SESSION_EXPIRED_MESSAGE,
  getSession,
} from "../src/lib/auth";
import {
  fetchFarmerInvestmentRequests,
  fetchInvestmentRequests,
} from "../src/lib/dashboard";
import { useLanguage } from "../src/lib/language";

const COLORS = {
  primary: "#216000",
  primaryPale: "#E8F5E1",
  white: "#FFFFFF",
  surface: "#F7F9F4",
  text: "#1A2E0D",
  textMuted: "#6D8660",
  danger: "#D32F2F",
  warning: "#8A5A00",
};

function formatTimestamp(value: string, locale: string, fallback: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AlertsScreen() {
  const router = useRouter();
  const { locale, t } = useLanguage();
  const [alerts, setAlerts] = useState<AppAlertItem[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const unreadCount = useMemo(
    () => alerts.filter((item) => !readIds.includes(item.id)).length,
    [alerts, readIds],
  );

  const loadAlerts = useCallback(
    async (showLoader = true) => {
      if (showLoader) {
        setLoading(true);
      }

      try {
        setError("");
        const session = await getSession();
        if (!session) {
          router.replace("/login");
          return;
        }

        const requestResponse =
          session.user.role === "farmer"
            ? await fetchFarmerInvestmentRequests(session)
            : await fetchInvestmentRequests(session);

        const nextAlerts = buildAlertsForSession(
          session,
          requestResponse.requests,
          t,
        );
        const nextReadIds = await getReadAlertIds();
        setAlerts(nextAlerts);
        setReadIds(nextReadIds);
      } catch (loadError) {
        if (
          loadError instanceof Error &&
          loadError.message === SESSION_EXPIRED_MESSAGE
        ) {
          router.replace("/login");
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message === NETWORK_ERROR_MESSAGE
              ? NETWORK_ERROR_MESSAGE
              : loadError.message
            : NETWORK_ERROR_MESSAGE,
        );
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [router, t],
  );

  useFocusEffect(
    useCallback(() => {
      loadAlerts();
    }, [loadAlerts]),
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAlerts(false);
    setRefreshing(false);
  }, [loadAlerts]);

  const handleOpenAlert = async (alertId: string) => {
    const nextReadIds = await markAlertRead(alertId);
    setReadIds(nextReadIds);
    router.push("/(tabs)/dashboard");
  };

  const handleMarkAllRead = async () => {
    const nextReadIds = await markAllAlertsRead(alerts.map((item) => item.id));
    setReadIds(nextReadIds);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={22}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>{t("alerts.title")}</Text>
            <Text style={styles.subtitle}>{t("alerts.subtitle")}</Text>
          </View>
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllRead}
            disabled={alerts.length === 0 || unreadCount === 0}
          >
            <Text
              style={[
                styles.markAllText,
                (alerts.length === 0 || unreadCount === 0) &&
                  styles.markAllTextDisabled,
              ]}
            >
              {t("alerts.markAllRead")}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
                progressBackgroundColor={COLORS.white}
              />
            }
          >
            {error ? (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={18}
                  color={COLORS.danger}
                />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => loadAlerts()}>
                  <Text style={styles.retryText}>{t("alerts.retry")}</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {alerts.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <MaterialCommunityIcons
                    name="bell-sleep-outline"
                    size={28}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.emptyTitle}>{t("alerts.emptyTitle")}</Text>
                <Text style={styles.emptyBody}>{t("alerts.emptyMessage")}</Text>
              </View>
            ) : (
              alerts.map((item) => {
                const isRead = readIds.includes(item.id);
                const toneColor =
                  item.tone === "success"
                    ? COLORS.primary
                    : item.tone === "warning"
                      ? COLORS.warning
                      : "#2E6FBB";

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.card, isRead && styles.cardRead]}
                    onPress={() => handleOpenAlert(item.id)}
                    activeOpacity={0.86}
                  >
                    <View
                      style={[
                        styles.cardIconWrap,
                        { backgroundColor: `${toneColor}18` },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={
                          item.tone === "success"
                            ? "check-decagram-outline"
                            : item.tone === "warning"
                              ? "alert-outline"
                              : "bell-outline"
                        }
                        size={22}
                        color={toneColor}
                      />
                    </View>
                    <View style={styles.cardCopy}>
                      <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        {!isRead ? <View style={styles.unreadDot} /> : null}
                      </View>
                      <Text style={styles.cardMessage}>{item.message}</Text>
                      <Text style={styles.cardMeta}>
                        {formatTimestamp(
                          item.createdAt,
                          locale,
                          t("alerts.updatedNow"),
                        )}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingTop: 10,
    paddingBottom: 18,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  markAllButton: {
    paddingTop: 10,
  },
  markAllText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  markAllTextDisabled: {
    color: "#AABAA1",
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingBottom: 32,
    gap: 12,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF2F2",
    borderWidth: 1,
    borderColor: "#F4C7C7",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  errorText: {
    flex: 1,
    color: COLORS.danger,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  retryText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryPale,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
  },
  emptyBody: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
  },
  cardRead: {
    opacity: 0.75,
  },
  cardIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  cardCopy: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.primary,
  },
  cardMessage: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  cardMeta: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "700",
    marginTop: 10,
  },
});
