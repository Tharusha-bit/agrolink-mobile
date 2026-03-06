import AsyncStorage from "@react-native-async-storage/async-storage";
import { type AuthSession } from "./auth";
import { type FarmerOpportunity } from "./dashboard";

const ALERTS_READ_KEY = "agrolink.alerts.read.ids";

export type AlertTone = "info" | "success" | "warning";

export interface AppAlertItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  tone: AlertTone;
}

type Translate = (
  key: string,
  params?: Record<string, string | number>,
) => string;

function formatCurrency(amount: number) {
  return `LKR ${amount.toLocaleString()}`;
}

export function buildAlertsForSession(
  session: AuthSession,
  requests: FarmerOpportunity[],
  t: Translate,
) {
  const now = new Date().toISOString();
  const alerts: AppAlertItem[] = [
    {
      id: `security-${session.user.role}`,
      title: t("alerts.securityTitle"),
      message: t("alerts.securityMessage"),
      createdAt: now,
      tone: "info",
    },
  ];

  if (session.user.role === "farmer") {
    if (requests.length === 0) {
      alerts.push({
        id: "farmer-first-request",
        title: t("alerts.farmerFirstRequestTitle"),
        message: t("alerts.farmerFirstRequestMessage"),
        createdAt: now,
        tone: "warning",
      });
    } else {
      requests.slice(0, 4).forEach((request) => {
        const funded = request.raisedAmount > 0;
        alerts.push({
          id: `request-${request.id}`,
          title: funded
            ? t("alerts.farmerFundingProgressTitle", { crop: request.crop })
            : t("alerts.farmerRequestLiveTitle", { crop: request.crop }),
          message: funded
            ? t("alerts.farmerFundingProgressMessage", {
                raised: formatCurrency(request.raisedAmount),
                goal: formatCurrency(request.amountNeeded),
              })
            : t("alerts.farmerRequestLiveMessage", { crop: request.crop }),
          createdAt: request.createdAt ?? now,
          tone: funded ? "success" : "info",
        });
      });
    }
  } else if (requests.length === 0) {
    alerts.push({
      id: "investor-quiet-market",
      title: t("alerts.investorQuietTitle"),
      message: t("alerts.investorQuietMessage"),
      createdAt: now,
      tone: "warning",
    });
  } else {
    requests.slice(0, 4).forEach((request) => {
      alerts.push({
        id: `opportunity-${request.id}`,
        title: t("alerts.investorOpportunityTitle", { crop: request.crop }),
        message: t("alerts.investorOpportunityMessage", {
          farmer: request.name,
          goal: formatCurrency(request.amountNeeded),
          location: request.location,
        }),
        createdAt: request.createdAt ?? now,
        tone: request.riskLevel === "High" ? "warning" : "info",
      });
    });
  }

  return alerts.sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export async function getReadAlertIds() {
  const raw = await AsyncStorage.getItem(ALERTS_READ_KEY);
  if (!raw) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as string[];
  }
}

export async function markAlertRead(id: string) {
  const current = await getReadAlertIds();
  if (current.includes(id)) {
    return current;
  }

  const next = [...current, id];
  await AsyncStorage.setItem(ALERTS_READ_KEY, JSON.stringify(next));
  return next;
}

export async function markAllAlertsRead(ids: string[]) {
  const current = await getReadAlertIds();
  const merged = Array.from(new Set([...current, ...ids]));
  await AsyncStorage.setItem(ALERTS_READ_KEY, JSON.stringify(merged));
  return merged;
}

export async function getUnreadAlertCount(alerts: AppAlertItem[]) {
  const readIds = await getReadAlertIds();
  return alerts.filter((item) => !readIds.includes(item.id)).length;
}
