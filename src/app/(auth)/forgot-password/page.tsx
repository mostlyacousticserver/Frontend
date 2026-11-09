import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Mostly Acoustic account password.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-0">
      <ForgotPasswordForm />
    </main>
  );
}
