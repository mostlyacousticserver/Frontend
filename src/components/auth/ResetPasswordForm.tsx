"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AuthAPI } from "@/api/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("This reset link is missing or invalid.");
      return;
    }

    try {
      const response = await AuthAPI.resetPassword({
        token,
        newPassword: data.password,
      });
      toast.success(response.data.message);
      router.replace("/login");
    } catch {
      // API error toast handled by axios interceptor
    }
  };

  if (!token) {
    return (
      <AuthCard>
        <div className="mb-4">
          <h1
            id="auth-title"
            className="mt-1 font-sans text-[22px] font-bold leading-[1.15] text-[#111111] sm:text-[24px]"
          >
            Invalid reset link
          </h1>
          <p className="mt-1.5 font-sans text-[12px] leading-5 text-[#6B7280] sm:text-[13px]">
            This password reset link is missing or incomplete. Request a new
            one from the forgot password page.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="flex h-9 w-full items-center justify-center rounded-lg bg-brand-orange font-sans text-[13px] font-semibold text-white transition-all duration-200 hover:bg-brand-orange-hover sm:h-10"
        >
          Request a new link
        </Link>
        <p className="mt-4 text-center font-sans text-[12px] leading-4 text-auth-muted">
          <Link
            href="/login"
            className="font-semibold text-brand-orange transition-colors hover:text-brand-orange-hover"
          >
            Back to log in
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="mb-4">
        <h1
          id="auth-title"
          className="mt-1 font-sans text-[22px] font-bold leading-[1.15] text-[#111111] sm:text-[24px]"
        >
          Set a new password
        </h1>
        <p className="mt-1.5 font-sans text-[12px] leading-5 text-[#6B7280] sm:text-[13px]">
          Choose a new password for your account. You will need to log in again
          after saving.
        </p>
      </div>

      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          showForgotLink={false}
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          showForgotLink={false}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-0.5 flex h-9 w-full items-center justify-center rounded-lg bg-brand-orange font-sans text-[13px] font-semibold text-white transition-all duration-200 hover:bg-brand-orange-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:h-10"
        >
          {isSubmitting ? "Saving…" : "Reset password"}
        </button>
      </form>

      <p className="mt-4 text-center font-sans text-[12px] leading-4 text-auth-muted">
        <Link
          href="/login"
          className="font-semibold text-brand-orange transition-colors hover:text-brand-orange-hover"
        >
          Back to log in
        </Link>
      </p>
    </AuthCard>
  );
}
