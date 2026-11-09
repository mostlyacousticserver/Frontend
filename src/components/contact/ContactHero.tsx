"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { contactHero, contactInfoItems } from "@/data/contact";

const ease = [0.22, 1, 0.36, 1] as const;

const emailItem = contactInfoItems.find((item) => item.id === "email");
const phoneItem = contactInfoItems.find((item) => item.id === "phone");

export function ContactHero() {
  return (
    <header className="relative overflow-x-clip pt-7 sm:pt-9 md:pt-12 lg:pt-14">
      {/* Soft atmosphere — clipped so it never causes horizontal scroll */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-8 h-36 w-36 rounded-full bg-[#11C5BB]/12 blur-3xl sm:-left-20 sm:h-48 sm:w-48 md:h-56 md:w-56"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 top-8 h-32 w-32 rounded-full bg-[#3B82F6]/8 blur-3xl sm:-right-16 sm:top-12 sm:h-44 sm:w-44"
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="relative inline-flex items-center gap-1.5 font-sans text-[11px] font-medium tracking-[0.04em] text-[#6B7280] sm:gap-2 sm:text-[12px]"
      >
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#11C5BB] sm:h-2 sm:w-2"
          aria-hidden
        />
        <span className="leading-none">{contactHero.badge}</span>
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease }}
        className="relative mt-2.5 max-w-[20ch] font-sans text-[24px] font-bold leading-[1.15] tracking-[-0.025em] text-[#111111] sm:mt-3.5 sm:max-w-2xl sm:text-[32px] md:text-[40px] lg:max-w-3xl lg:text-[48px]"
      >
        {contactHero.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease }}
        className="relative mt-2.5 max-w-xl font-sans text-[13px] leading-6 text-[#6B7280] sm:mt-3.5 sm:text-[14px] sm:leading-7 md:max-w-2xl md:text-[15px]"
      >
        {contactHero.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.14, ease }}
        className="relative mt-5 flex flex-col gap-2.5 sm:mt-6 sm:gap-3"
      >
        {/* Primary CTA — full width on mobile */}
        <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="#contact-form"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#11C5BB] px-5 font-sans text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(17,197,187,0.28)] transition-colors hover:bg-[#0fb0a7] sm:h-12 sm:w-auto sm:px-6 sm:text-[14px]"
          >
            Send a Message
            <ArrowRight size={15} className="sm:h-4 sm:w-4" aria-hidden />
          </Link>
        </motion.div>

        {/* Secondary actions — side by side on mobile */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          {emailItem?.href ? (
            <motion.a
              href={emailItem.href}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#E9EEF3] bg-white px-3 font-sans text-[12px] font-semibold text-[#111111] transition-colors hover:border-[#11C5BB]/40 hover:text-[#0DA694] sm:h-11 sm:gap-2 sm:px-4 sm:text-[13px]"
            >
              <Mail size={14} className="shrink-0 sm:h-[15px] sm:w-[15px]" aria-hidden />
              <span className="truncate">Email Us</span>
            </motion.a>
          ) : null}

          {phoneItem?.href ? (
            <motion.a
              href={phoneItem.href}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#E9EEF3] bg-white px-3 font-sans text-[12px] font-semibold text-[#111111] transition-colors hover:border-[#11C5BB]/40 hover:text-[#0DA694] sm:h-11 sm:gap-2 sm:px-4 sm:text-[13px]"
            >
              <Phone size={14} className="shrink-0 sm:h-[15px] sm:w-[15px]" aria-hidden />
              <span className="truncate">Call Us</span>
            </motion.a>
          ) : null}
        </div>
      </motion.div>
    </header>
  );
}
