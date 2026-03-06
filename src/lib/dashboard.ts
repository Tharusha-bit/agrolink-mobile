import {
  AuthSession,
  NETWORK_ERROR_MESSAGE,
  clearSession,
  SESSION_EXPIRED_MESSAGE,
} from "./auth";

const API_BASE_URL = "http://localhost:4000/api";

export interface InvestorConnection {
  id: string;
  name: string;
  company: string;
  investedAmount: number;
  preferredReturnRate: string;
  activeProjects: number;
  fitNote: string;
}

export interface FarmerOpportunity {
  id: string;
  farmerUserId?: string;
  name: string;
  crop: string;
  location: string;
  amountNeeded: number;
  raisedAmount: number;
  historicalReturnRate: string;
  riskLevel: "Low" | "Medium" | "High";
  summary: string;
  createdAt?: string;
  investments?: Array<{
    id: string;
    investorUserId: string;
    investorName: string;
    amount: number;
    investedAt: string;
  }>;
}

export interface FarmerInvestmentRequestsResponse {
  role: "farmer";
  requests: FarmerOpportunity[];
}

export interface InvestorInvestmentRequestsResponse {
  role: "investor";
  requests: FarmerOpportunity[];
}

export interface AiAssessment {
  entityId: string;
  headline: string;
  recommendation: string;
  previousRate: string;
  outlook: string;
  confidence: string;
  summary: string;
}

async function authorizedRequest<T>(
  session: AuthSession,
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (!response.ok) {
    if (response.status === 401) {
      await clearSession();
      throw new Error(SESSION_EXPIRED_MESSAGE);
    }

    const body = await response.json().catch(() => null);
    if (
      Array.isArray(body?.validationErrors) &&
      body.validationErrors.length > 0
    ) {
      throw new Error(body.validationErrors[0]);
    }

    throw new Error(body?.message ?? "Request failed.");
  }

  return response.json() as Promise<T>;
}

export async function fetchRoleNetwork(session: AuthSession) {
  if (session.user.role === "farmer") {
    return authorizedRequest<{
      role: "farmer";
      investors: InvestorConnection[];
    }>(session, "/farmer/investors");
  }

  return authorizedRequest<{ role: "investor"; farmers: FarmerOpportunity[] }>(
    session,
    "/investor/farmers",
  );
}

export async function fetchFarmerInvestmentRequests(session: AuthSession) {
  return authorizedRequest<FarmerInvestmentRequestsResponse>(
    session,
    "/farmer/investment-requests",
  );
}

export async function createInvestmentRequest(
  session: AuthSession,
  payload: {
    crop: string;
    location: string;
    amountNeeded: number;
    riskLevel: "Low" | "Medium" | "High";
    summary: string;
    historicalReturnRate?: string;
  },
) {
  return authorizedRequest<FarmerOpportunity>(
    session,
    "/farmer/investment-requests",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteInvestmentRequest(
  session: AuthSession,
  requestId: string,
) {
  return authorizedRequest<{ message: string; request: FarmerOpportunity }>(
    session,
    `/farmer/investment-requests/${requestId}`,
    {
      method: "DELETE",
    },
  );
}

export async function fetchInvestmentRequests(session: AuthSession) {
  return authorizedRequest<InvestorInvestmentRequestsResponse>(
    session,
    "/investor/investment-requests",
  );
}

export async function investInRequest(
  session: AuthSession,
  requestId: string,
  amount = 5000,
) {
  return authorizedRequest<FarmerOpportunity>(
    session,
    `/investor/investment-requests/${requestId}/invest`,
    {
      method: "POST",
      body: JSON.stringify({ amount }),
    },
  );
}

export async function fetchAiAssessment(
  session: AuthSession,
  entityId: string,
) {
  return authorizedRequest<AiAssessment>(session, "/ai/investment-insight", {
    method: "POST",
    body: JSON.stringify({ entityId }),
  });
}
