"use client";

import { motion } from "framer-motion";

type AuthCardProps = {
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
};

export function AuthCard({
  children,
  className = "",
  labelledBy = "auth-title",
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`mx-auto w-full max-w-[800px] rounded-xl bg-white px-6 py-6 shadow-[0_12px_36px_rgba(0,0,0,0.28)] sm:max-w-[900px] sm:rounded-2xl sm:px-8 sm:py-7 ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      {children}
    </motion.div>
  );
}
