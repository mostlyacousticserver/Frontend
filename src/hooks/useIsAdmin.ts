"use client";

import { useAuth } from "@/contexts/AuthContext";
import { isAdminRole } from "@/lib/roles";

export function useIsAdmin() {
  const { user, isHydrated } = useAuth();
  return {
    isAdmin: isHydrated && isAdminRole(user?.role),
    isHydrated,
  };
}
