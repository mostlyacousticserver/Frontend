"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { AuthAPI } from "@/api/auth";
import {
  clearSessionCookies,
  getAuthSnapshot,
  getRefreshToken,
  getServerAuthSnapshot,
  persistSession,
  subscribeAuthStore,
} from "@/lib/cookies";
import type { AuthTokensResponse, User } from "@/types/auth";

type AuthContextType = {
  user: User | null;
  token: string;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setSession: (session: AuthTokensResponse) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function subscribeHydration() {
  return () => {};
}

function getHydratedSnapshot() {
  return true;
}

function getServerHydratedSnapshot() {
  return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { token, user } = useSyncExternalStore(
    subscribeAuthStore,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );
  const isHydrated = useSyncExternalStore(
    subscribeHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );

  const setSession = useCallback((session: AuthTokensResponse) => {
    persistSession(session);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();

    try {
      await AuthAPI.logout(refreshToken);
    } catch {
      // Interceptor handles API errors; still clear the local session.
    }

    clearSessionCookies();
    window.location.href = "/login";
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isHydrated,
      setSession,
      logout,
    }),
    [user, token, isHydrated, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
