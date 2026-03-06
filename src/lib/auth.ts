import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "farmer" | "investor";

export interface AuthSession {
  token: string;
  user: {
    email: string;
    name: string;
    role: UserRole;
  };
}

export interface DemoAccount extends AuthSession {
  password: string;
}

const SESSION_KEY = "agrolink.auth.session";
const API_BASE_URL = "http://localhost:4000/api";
export const SESSION_EXPIRED_MESSAGE = "Session expired. Please sign in again.";
export const NETWORK_ERROR_MESSAGE =
  "You're offline or the server is unreachable. Check your connection and try again.";

export const demoAccounts: DemoAccount[] = [
  {
    token: "demo-farmer-token-1",
    password: "Farmer@123",
    user: {
      email: "farmer@agrolink.demo",
      name: "W.T.P. Fernando",
      role: "farmer",
    },
  },
  {
    token: "demo-farmer-token-2",
    password: "Farmer@123",
    user: {
      email: "suriyakumar@agrolink.demo",
      name: "Suriyakumar",
      role: "farmer",
    },
  },
  {
    token: "demo-farmer-token-3",
    password: "Farmer@123",
    user: {
      email: "priyadevi@agrolink.demo",
      name: "Priya Devi",
      role: "farmer",
    },
  },
  {
    token: "demo-investor-token-1",
    password: "Investor@123",
    user: {
      email: "investor@agrolink.demo",
      name: "Nadeesha Perera",
      role: "investor",
    },
  },
  {
    token: "demo-investor-token-2",
    password: "Investor@123",
    user: {
      email: "hasini@agrolink.demo",
      name: "Hasini Jayasuriya",
      role: "investor",
    },
  },
  {
    token: "demo-investor-token-3",
    password: "Investor@123",
    user: {
      email: "ravindu@agrolink.demo",
      name: "Ravindu Silva",
      role: "investor",
    },
  },
];

export async function saveSession(session: AuthSession) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function isJwtToken(token: string) {
  return typeof token === "string" && token.split(".").length === 3;
}

export async function getSession() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const session = JSON.parse(raw) as AuthSession;
    if (!session?.token || !isJwtToken(session.token)) {
      await AsyncStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    await AsyncStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export function findDemoAccount(
  email: string,
  password: string,
  role: UserRole,
) {
  return demoAccounts.find(
    (account) =>
      account.user.email.toLowerCase() === email.trim().toLowerCase() &&
      account.password === password &&
      account.user.role === role,
  );
}

export async function loginUser(
  email: string,
  password: string,
  role: UserRole,
) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Login failed.");
  }

  const payload = await response.json();
  const session: AuthSession = {
    token: payload.token,
    user: {
      email: payload.user.email,
      name: payload.user.name,
      role: payload.user.role,
    },
  };
  await saveSession(session);
  return { session, source: "api" as const };
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  nic: string;
  farmerId?: string;
}) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Registration failed.");
  }

  const registered = await response.json();
  const session: AuthSession = {
    token: registered.token,
    user: {
      email: registered.user.email,
      name: registered.user.name,
      role: registered.user.role,
    },
  };

  await saveSession(session);
  return session;
}
