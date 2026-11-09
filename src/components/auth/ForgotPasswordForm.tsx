"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AuthAPI } from "@/api/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const response = await AuthAPI.forgotPassword({ email: data.email });
      toast.success(response.data.message);
      setSent(true);
    } catch {
      // API error toast handled by axios interceptor
    }
  };

  return (
    <AuthCard>
      <div className="mb-4">
        <h1
          id="auth-title"
          className="mt-1 font-sans text-[22px] font-bold leading-[1.15] text-[#111111] sm:text-[24px]"
        >
          Forgot password
        </h1>
        <p className="mt-1.5 font-sans text-[12px] leading-5 text-[#6B7280] sm:text-[13px]">
          {sent
            ? "If an account exists for that email, we sent a reset link. Check your inbox and spam folder."
            : "Enter your email and we will send you a link to reset your password."}
        </p>
      </div>

      {sent ? (
        <div className="flex flex-col gap-3">
          <p className="rounded-lg bg-[#EFFCF9] px-3 py-2.5 font-sans text-[12px] leading-5 text-[#0DA694] sm:text-[13px]">
            Reset link sent to{" "}
            <span className="font-semibold">{getValues("email")}</span>
          </p>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              setSent(false);
            }}
            className="flex h-9 w-full items-center justify-center rounded-lg border border-[#E5E7EB] bg-white font-sans text-[13px] font-semibold text-[#111111] transition-colors hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-70 sm:h-10"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <AuthInput
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-0.5 flex h-9 w-full items-center justify-center rounded-lg bg-brand-orange font-sans text-[13px] font-semibold text-white transition-all duration-200 hover:bg-brand-orange-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:h-10"
          >
            {isSubmitting ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <p className="mt-4 text-center font-sans text-[12px] leading-4 text-auth-muted">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-orange transition-colors hover:text-brand-orange-hover"
        >
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
