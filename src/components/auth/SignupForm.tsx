"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AuthAPI } from "@/api/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { getSafeNextPath } from "@/lib/auth-redirect";
import { API_BASE_URL } from "@/lib/axios";
import {
  signupSchema,
  type SignupFormValues,
} from "@/lib/validations/auth";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const loginHref =
    nextPath === "/" ? "/login" : `/login?next=${encodeURIComponent(nextPath)}`;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const response = await AuthAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success(response.data.message);
      const params = new URLSearchParams({
        email: response.data.user.email,
        purpose: "signup",
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
        {/* <p className="font-sans text-[11px] font-medium tracking-[0.04em] text-auth-muted">
          Mostly Acoustic
        </p> */}
        <h1
          id="auth-title"
          className="mt-1 font-sans text-[22px] font-bold leading-[1.15] text-[#111111] sm:text-[24px]"
        >
          Create an account
        </h1>
        {/* <p className="mt-1 font-sans text-[12px] leading-4 text-[#6B7280]">
          Sign up to start your guitar journey.
        </p> */}
      </div>

      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <AuthInput
          label="Name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          error={errors.name?.message}
          {...register("name")}
        />

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
          autoComplete="new-password"
          placeholder="Enter your password"
          showForgotLink={false}
          error={errors.password?.message}
          {...register("password")}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-0.5 flex h-9 w-full items-center justify-center rounded-lg bg-brand-orange font-sans text-[13px] font-semibold text-white transition-all duration-200 hover:bg-brand-orange-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:h-10"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
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
          window.location.href = `${API_BASE_URL}/auth/google${qs ? `?${qs}` : ""}`;
        }}
      />

      <p className="mt-4 text-center font-sans text-[12px] text-auth-muted">
        Already Have An Account?{" "}
        <Link
          href={loginHref}
          className="font-medium text-brand-orange transition-colors hover:text-brand-orange-hover"
        >
          Log In
        </Link>
      </p>
    </AuthCard>
  );
}
