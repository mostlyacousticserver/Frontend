"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: string;
  error?: string;
  showForgotLink?: boolean;
  forgotHref?: string;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      label = "Password",
      error,
      id,
      className = "",
      showForgotLink = true,
      forgotHref = "#",
      ...props
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const inputId = id ?? props.name ?? "password";

    return (
      <div className="w-full min-w-0">
        <div className="mb-1 flex items-center justify-between gap-2">
          <label
            htmlFor={inputId}
            className="font-sans text-[12px] font-medium text-[#1a1a1a]"
          >
            {label}
          </label>
          {showForgotLink ? (
            <Link
              href={forgotHref}
              className="shrink-0 font-sans text-[11px] font-medium text-brand-orange transition-colors hover:text-brand-orange-hover"
            >
              Forgot?
            </Link>
          ) : null}
        </div>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            className={`h-9 w-full rounded-lg border bg-white py-0 pl-3 pr-10 font-sans text-[13px] text-[#1a1a1a] outline-none transition-all duration-200 placeholder:text-[#b0b0b0] focus:border-auth-focus focus:ring-2 focus:ring-auth-focus/25 sm:h-10 sm:text-[14px] ${
              error ? "border-red-400" : "border-auth-border"
            } ${className}`}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-[#9ca3af] transition-colors hover:text-[#6b7280] sm:w-10"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <EyeOff size={16} strokeWidth={1.75} />
            ) : (
              <Eye size={16} strokeWidth={1.75} />
            )}
          </button>
        </div>
        {error ? (
          <p
            id={`${inputId}-error`}
            className="mt-1 font-sans text-[11px] text-red-500"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
