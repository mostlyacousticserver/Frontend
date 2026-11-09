import Cookies from "js-cookie";
import type { AuthTokensResponse, User } from "@/types/auth";

export const AUTH_COOKIE_KEYS = {
  token: "token",
  refreshToken: "refreshToken",
  user: "user",
  userRole: "userRole",
} as const;

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7,
  path: "/",
  sameSite: "lax",
};

type AuthSnapshot = {
  token: string;
  user: User | null;
};

const authListeners = new Set<() => void>();

let cachedRaw = { token: "", userRaw: "" };
let cachedSnapshot: AuthSnapshot = { token: "", user: null };
const EMPTY_AUTH_SNAPSHOT: AuthSnapshot = { token: "", user: null };

function notifyAuthStore(): void {
  authListeners.forEach((listener) => listener());
}

export function subscribeAuthStore(listener: () => void): () => void {
  authListeners.add(listener);
  return () => {
    authListeners.delete(listener);
  };
}

export function getAuthSnapshot(): AuthSnapshot {
  const token = Cookies.get(AUTH_COOKIE_KEYS.token) ?? "";
  const userRaw = Cookies.get(AUTH_COOKIE_KEYS.user) ?? "";

  if (cachedRaw.token === token && cachedRaw.userRaw === userRaw) {
    return cachedSnapshot;
  }

  let user: User | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as User;
    } catch {
      user = null;
    }
  }

  cachedRaw = { token, userRaw };
  cachedSnapshot = { token, user };
  return cachedSnapshot;
}

export function getServerAuthSnapshot(): AuthSnapshot {
  return EMPTY_AUTH_SNAPSHOT;
}

export function getAccessToken(): string | undefined {
  return Cookies.get(AUTH_COOKIE_KEYS.token);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(AUTH_COOKIE_KEYS.refreshToken);
}

export function getStoredUser(): User | null {
  return getAuthSnapshot().user;
}

export function persistTokens(accessToken: string, refreshToken: string): void {
  Cookies.set(AUTH_COOKIE_KEYS.token, accessToken, COOKIE_OPTIONS);
  Cookies.set(AUTH_COOKIE_KEYS.refreshToken, refreshToken, COOKIE_OPTIONS);
  notifyAuthStore();
}

export function persistSession(session: AuthTokensResponse): void {
  Cookies.set(AUTH_COOKIE_KEYS.token, session.accessToken, COOKIE_OPTIONS);
  Cookies.set(
    AUTH_COOKIE_KEYS.refreshToken,
    session.refreshToken,
    COOKIE_OPTIONS,
  );
  Cookies.set(AUTH_COOKIE_KEYS.user, JSON.stringify(session.user), COOKIE_OPTIONS);
  Cookies.set(AUTH_COOKIE_KEYS.userRole, session.user.role, COOKIE_OPTIONS);
  notifyAuthStore();
}

export function clearSessionCookies(): void {
  const removeOptions = { path: "/" as const };
  Cookies.remove(AUTH_COOKIE_KEYS.token, removeOptions);
  Cookies.remove(AUTH_COOKIE_KEYS.refreshToken, removeOptions);
  Cookies.remove(AUTH_COOKIE_KEYS.user, removeOptions);
  Cookies.remove(AUTH_COOKIE_KEYS.userRole, removeOptions);
  notifyAuthStore();
}
