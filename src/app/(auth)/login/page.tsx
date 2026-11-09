import type { Metadata } from "next";
import { Suspense } from "react";
import { GuestGuard } from "@/components/auth/GuestGuard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In",
  description: "Welcome back to Mostly Acoustic. Log in to continue learning.",
};

export default function LoginPage() {
  return (
    <main className="min-h-0">
      <GuestGuard>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </GuestGuard>
    </main>
  );
}
