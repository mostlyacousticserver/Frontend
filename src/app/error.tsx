"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-white px-5 py-24"
    >
      <div className="w-full max-w-lg text-center">
        <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0DA694]">
          Something went wrong
        </p>
        <h1 className="mt-3 font-sans text-[26px] font-bold leading-tight tracking-[-0.02em] text-[#111111] sm:text-[32px]">
          This page failed to load
        </h1>
        <p className="mt-3 font-sans text-[14px] leading-7 text-[#6B7280]">
          The error has been logged. You can retry, or head back to the homepage.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#11C5BB] px-7 font-sans text-[14px] font-semibold text-white transition-colors hover:bg-[#0DA694]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#E9EEF3] px-7 font-sans text-[14px] font-semibold text-[#111111] transition-colors hover:bg-[#F8FAFB]"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
