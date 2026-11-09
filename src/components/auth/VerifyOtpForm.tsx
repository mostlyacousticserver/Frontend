"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AuthAPI } from "@/api/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { useAuth } from "@/contexts/AuthContext";
import { getPostLoginPath, getSafeNextPath } from "@/lib/auth-redirect";
import { otpSchema, type OtpFormValues } from "@/lib/validations/auth";
import type { OtpPurpose } from "@/types/auth";

const OTP_PURPOSES: OtpPurpose[] = ["signup", "login", "password_reset"];

function readOtpPurpose(value: string | null): OtpPurpose {
  if (value && OTP_PURPOSES.includes(value as OtpPurpose)) {
    return value as OtpPurpose;
  }
  return "login";
}

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const email = searchParams.get("email")?.trim() ?? "";
  const purpose = readOtpPurpose(searchParams.get("purpose"));
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const [resending, setResending] = useState(false);

  const backHref =
    purpose === "signup"
      ? nextPath === "/"
        ? "/signup"
        : `/signup?next=${encodeURIComponent(nextPath)}`
      : nextPath === "/"
        ? "/login"
        : `/login?next=${encodeURIComponent(nextPath)}`;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (!email) {
      router.replace(purpose === "signup" ? "/signup" : "/login");
    }
  }, [email, purpose, router]);

  if (!email) {
    return null;
  }

  const onSubmit = async (data: OtpFormValues) => {
    try {
      const response = await AuthAPI.verifyOtp({
        email,
        otp: data.otp,
        purpose,
      });
      setSession(response.data);
      router.replace(getPostLoginPath(response.data.user, searchParams.get("next")));
    } catch {
      // API error toast handled by axios interceptor
    }
  };

  const onResend = async () => {
    setResending(true);
    try {
      const response = await AuthAPI.resendOtp({ email, purpose });
      toast.success(response.data.message);
    } catch {
      // interceptor
    } finally {
      setResending(false);
    }
  }; 

  return (
    <AuthCard>
      <div className="mb-4">
        <p className="font-sans text-[11px] font-medium tracking-[0.04em] text-auth-muted">
          Mostly Acoustic
        </p>
        <h1
          id="auth-title"
          className="mt-1 font-sans text-[22px] font-bold leading-[1.15] tracking-tight text-[#111111] sm:text-[24px]"
        >
          Verify your email
        </h1>
        <p className="mt-1 font-sans text-[12px] leading-4 text-[#6B7280]">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-[#111111]">{email}</span>.
        </p>
      </div>

      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <AuthInput
          label="Verification code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          maxLength={6}
          error={errors.otp?.message}
          {...register("otp")}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-0.5 flex h-9 w-full items-center justify-center rounded-lg bg-brand-orange font-sans text-[13px] font-semibold text-white transition-all duration-200 hover:bg-brand-orange-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:h-10"
        >
          {isSubmitting ? "Verifying…" : "Verify and continue"}
        </button>
      </form>

      <p className="mt-4 text-center font-sans text-[12px] leading-4 text-auth-muted">
        Didn&apos;t get a code?{" "}
        <button
          type="button"
          disabled={resending}
          onClick={() => void onResend()}
          className="font-semibold text-brand-orange transition-colors hover:text-brand-orange-hover disabled:opacity-60"
        >
          {resending ? "Sending…" : "Resend OTP"}
        </button>
      </p>

      <p className="mt-2 text-center font-sans text-[12px] leading-4 text-auth-muted">
        Wrong email?{" "}
        <Link
          href={backHref}
          className="font-semibold text-brand-orange transition-colors hover:text-brand-orange-hover"
        >
          {purpose === "signup" ? "Back to sign up" : "Back to login"}
        </Link>
      </p>
    </AuthCard>
  );
}
