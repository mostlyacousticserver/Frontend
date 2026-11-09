"use client";

import { forwardRef } from "react";

type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  function AuthInput({ label, error, id, className = "", ...props }, ref) {
    const inputId = id ?? props.name;

    return (
      <div className="w-full min-w-0">
        <label
          htmlFor={inputId}
          className="mb-1 block font-sans text-[12px] font-medium text-[#1a1a1a]"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`h-9 w-full rounded-lg border bg-white px-3 font-sans text-[13px] text-[#1a1a1a] outline-none transition-all duration-200 placeholder:text-[#b0b0b0] focus:border-auth-focus focus:ring-2 focus:ring-auth-focus/25 sm:h-10 sm:text-[14px] ${
            error ? "border-red-400" : "border-auth-border"
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
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
