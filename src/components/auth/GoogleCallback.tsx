"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { AuthAPI } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { getPostLoginPath } from "@/lib/auth-redirect";
import { clearSessionCookies, persistTokens } from "@/lib/cookies";

export function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    persistTokens(accessToken, refreshToken);

    AuthAPI.getMe()
      .then((response) => {
        if (cancelled) return;
        setSession({
          accessToken,
          refreshToken,
          user: response.data.user,
        });
        router.replace(
          getPostLoginPath(response.data.user, searchParams.get("next")),
        );
      })
      .catch(() => {
        if (cancelled) return;
        clearSessionCookies();
        router.replace("/login");
      });

    return () => {
      cancelled = true;
    };
  }, [router, searchParams, setSession]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111111] px-6">
      <p className="font-sans text-sm text-white/80">Signing you in…</p>
    </main>
  );
}
