"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Keeps signed-in users out of the guest-only auth screens (login, signup,
 * verify-otp). Coming back to one of them — usually via the browser back
 * button right after verifying an OTP — sends the user home instead.
 */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;
    router.replace("/");
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || isAuthenticated) {
    return null;
  }

  return children;
}
