"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AuthAPI } from "@/api/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useAuth } from "@/contexts/AuthContext";
import { getPostLoginPath, getSafeNextPath } from "@/lib/auth-redirect";
import { API_BASE_URL } from "@/lib/axios";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth";
import { isAuthTokensResponse } from "@/types/auth";

const GOOGLE_AUTH_ERRORS: Record<string, string> = {
  google_not_configured:
    "Google sign-in is not configured yet. Use email login, or ask your admin to add Google OAuth credentials.",
  google_failed:
    "Google sign-in was cancelled or failed. Please try again, or use email login.",
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const nextPath = getSafeNextPath(searchParams.get("next"));

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;
    const message =
      GOOGLE_AUTH_ERRORS[error] ?? "Sign-in failed. Please try again.";
    toast.error(message);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("error");
    const qs = params.toString();
    router.replace(qs ? `/login?${qs}` : "/login");
  }, [router, searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await AuthAPI.login({
        email: data.email,
        password: data.password,
      });

      if (isAuthTokensResponse(response.data)) {
        setSession(response.data);
        router.replace(
          getPostLoginPath(response.data.user, searchParams.get("next")),
        );
        return;
      }

      toast.success(response.data.message);
      const params = new URLSearchParams({
        email: response.data.user.email,
        purpose: "login",
      });
      if (nextPath !== "/") {
        params.set("next", nextPath);
      }
      router.replace(`/verify-otp?${params.toString()}`);
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
          Welcome Back
        </h1>
      </div>

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

        <PasswordInput
          autoComplete="current-password"
          placeholder="Enter your password"
          forgotHref="/forgot-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-0.5 flex h-9 w-full items-center justify-center rounded-lg bg-brand-orange font-sans text-[13px] font-semibold text-white transition-all duration-200 hover:bg-brand-orange-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:h-10"
        >
          {isSubmitting ? "Signing in…" : "Login with Email"}
        </button>
      </form>

      <div className="my-3 flex items-center gap-2.5">
        <span className="h-px flex-1 bg-[#E9EEF3]" aria-hidden />
        <span className="shrink-0 font-sans text-[10px] font-medium uppercase tracking-[0.08em] text-auth-muted">
          or
        </span>
        <span className="h-px flex-1 bg-[#E9EEF3]" aria-hidden />
      </div>

      <GoogleButton
        onClick={() => {
          const params = new URLSearchParams();
          if (nextPath !== "/") {
            params.set("next", nextPath);
          }
          const qs = params.toString();
          window.location.href = `${API_BASE_URL}/auth/google${
            qs ? `?${qs}` : ""
          }`;
        }}
      />

      <p className="mt-4 text-center font-sans text-[12px] leading-4 text-auth-muted">
        Don&apos;t have an account?{" "}
        <Link
          href={
            nextPath === "/"
              ? "/signup"
              : `/signup?next=${encodeURIComponent(nextPath)}`
          }
          className="font-semibold text-brand-orange transition-colors hover:text-brand-orange-hover"
        >
          Sign Up
        </Link>
      </p>
    </AuthCard>
  );
}
