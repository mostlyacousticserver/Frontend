import type { Metadata } from "next";
import { Suspense } from "react";
import { GuestGuard } from "@/components/auth/GuestGuard";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Mostly Acoustic account and start learning today.",
};

export default function SignupPage() {
  return (
    <main className="min-h-0">
      <GuestGuard>
        <Suspense fallback={null}>
          <SignupForm />
        </Suspense>
      </GuestGuard>
    </main>
  );
}
