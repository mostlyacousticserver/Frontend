"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type AuthOverlayProps = {
  children: React.ReactNode;
};

export function AuthOverlay({ children }: AuthOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/45 px-3 pb-5 pt-[80px] backdrop-blur-[7px] sm:items-center sm:px-4 sm:pb-6 sm:pt-[88px] md:pt-6"
      role="presentation"
      data-scroll-top-offset="52"
    >
      <div className="my-auto w-full max-w-[360px]">{children}</div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5"
      >
        <Link
          href="/"
          aria-label="Close and go back to home"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white shadow-[0_8px_20px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-10 sm:w-10"
        >
          <X size={16} strokeWidth={2.25} aria-hidden />
        </Link>
      </motion.div>
    </div>
  );
}
