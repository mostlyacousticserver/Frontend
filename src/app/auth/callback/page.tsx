import type { Metadata } from "next";
import { Suspense } from "react";
import { GoogleCallback } from "@/components/auth/GoogleCallback";
import { NOINDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Signing in",
  description: "Completing Google sign-in.",
  robots: NOINDEX_ROBOTS,
};

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#111111] px-6">
          <p className="font-sans text-sm text-white/80">Signing you in…</p>
        </main>
      }
    >
      
      <GoogleCallback />
    </Suspense>
  );
}
