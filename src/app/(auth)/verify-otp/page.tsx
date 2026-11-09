import type { Metadata } from "next";
import { Suspense } from "react";
import { GuestGuard } from "@/components/auth/GuestGuard";
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Enter the verification code sent to your email to finish signing in.",
};

export default function VerifyOtpPage() {
  return (
    <main className="min-h-0">
      <GuestGuard>
        <Suspense fallback={null}>
          <VerifyOtpForm />
        </Suspense>
      </GuestGuard>
    </main>
  );
}
