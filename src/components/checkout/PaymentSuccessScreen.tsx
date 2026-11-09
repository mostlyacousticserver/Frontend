"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Mail, Sparkles } from "lucide-react";

type PaymentSuccessScreenProps = {
  courseTitle: string;
  courseSlug: string;
  orderId: string;
  amount: string;
  currency?: string;
  purchaseDate: string;
  customerName?: string;
  customerEmail?: string;
};

export function PaymentSuccessScreen({
  courseTitle,
  courseSlug,
  orderId,
  amount,
  currency = "₹",
  purchaseDate,
  customerName,
  customerEmail,
}: PaymentSuccessScreenProps) {
  return (
    <section className="relative overflow-x-clip bg-[#F7F8FA] px-4 pb-12 pt-[78px] sm:px-6 sm:pb-16 md:px-8 md:pb-20">
      <div className="pointer-events-none absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#11C5BB]/40 sm:h-2 sm:w-2"
            style={{
              left: `${8 + ((i * 7) % 84)}%`,
              top: `${12 + ((i * 11) % 60)}%`,
            }}
            initial={{ opacity: 0, y: -20, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, 40, 80],
              scale: [0.6, 1, 0.4],
            }}
            transition={{
              duration: 2.4,
              delay: i * 0.12,
              repeat: 1,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-lg rounded-[18px] border border-[#E9EEF3] bg-white p-5 text-center shadow-[0_16px_48px_rgba(15,23,42,0.08)] sm:mt-6 sm:rounded-[24px] sm:p-8 md:mt-8 md:p-10">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5] sm:h-20 sm:w-20"
        >
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.05, 1] }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981] text-white shadow-[0_8px_20px_rgba(16,185,129,0.35)] sm:h-12 sm:w-12"
          >
            <Check
              size={24}
              className="sm:h-7 sm:w-7"
              strokeWidth={3}
              aria-hidden
            />
          </motion.span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-5 font-sans text-[22px] font-bold tracking-[-0.02em] text-[#111111] sm:mt-6 sm:text-[26px] md:text-[30px]"
        >
          Payment successful
        </motion.h1>
        <p className="mt-2 font-sans text-[13px] leading-5 text-[#6B7280] sm:text-[14px] sm:leading-6 md:text-[15px]">
          {customerName ? `Thanks, ${customerName.split(" ")[0]}! ` : ""}
          Lifetime access to{" "}
          <span className="font-semibold text-[#111111]">{courseTitle}</span> is
          now active.
        </p>

        <div className="mt-5 space-y-2.5 rounded-xl bg-[#F8FAFB] p-3.5 text-left sm:mt-7 sm:space-y-3 sm:rounded-2xl sm:p-4 md:p-5">
          <Row label="Order ID" value={orderId} />
          <Row label="Purchase date" value={purchaseDate} />
          <Row label="Course" value={courseTitle} />
          <Row
            label="Amount paid"
            value={`${currency}${Number(amount).toLocaleString("en-IN")}`}
            emphasize
          />
        </div>

        {customerEmail ? (
          <div className="mt-3.5 inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#EFFCF9] px-2.5 py-1.5 font-sans text-[11px] font-medium text-[#0DA694] sm:mt-4 sm:px-3 sm:text-[12px]">
            <Mail
              size={12}
              className="shrink-0 sm:h-[13px] sm:w-[13px]"
              aria-hidden
            />
            <span className="truncate">
              Receipt sent to{" "}
              <span className="font-semibold">{customerEmail}</span>
            </span>
          </div>
        ) : (
          <div className="mt-3.5 inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#EFFCF9] px-2.5 py-1.5 font-sans text-[11px] font-medium text-[#0DA694] sm:mt-4 sm:px-3 sm:text-[12px]">
            <Sparkles
              size={12}
              className="shrink-0 sm:h-[13px] sm:w-[13px]"
              aria-hidden
            />
            <span className="truncate">Lifetime access activated</span>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:gap-3">
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={`/learn/${courseSlug}`}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#11C5BB] font-sans text-[14px] font-semibold text-white shadow-[0_10px_28px_rgba(17,197,187,0.35)] transition-colors hover:bg-[#0fb0a7] sm:h-12 sm:text-[15px]"
            >
              Start Learning
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/learning"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#E5E7EB] bg-white font-sans text-[14px] font-semibold text-[#111111] transition-colors hover:border-[#11C5BB]/40 sm:h-12 sm:text-[15px]"
            >
              Go to My Courses
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 sm:gap-4">
      <span className="shrink-0 font-sans text-[12px] text-[#6B7280] sm:text-[13px]">
        {label}
      </span>
      <span
        className={`min-w-0 break-words text-right font-sans text-[12px] sm:text-[13px] ${
          emphasize
            ? "text-[14px] font-bold text-[#111111] sm:text-[15px]"
            : "font-medium text-[#111111]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
