"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Award,
  Download,
  Infinity as InfinityIcon,
  MonitorSmartphone,
  Play,
  ShieldCheck,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { CourseDetail } from "@/data/course";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { isRemoteImage } from "@/lib/image";
import { CourseEnrollCta } from "./CourseEnrollCta";
import { courseFadeUp } from "./motion";

const iconMap: Record<string, LucideIcon> = {
  infinity: InfinityIcon,
  devices: MonitorSmartphone,
  certificate: Award,
  download: Download,
  users: Users,
  shield: ShieldCheck,
};

type CoursePricingCardProps = {
  course: CourseDetail;
  hasAccess?: boolean;
  accessReady?: boolean;
};

export function CoursePricingCard({
  course,
  hasAccess = false,
  accessReady = true,
}: CoursePricingCardProps) {
  const { pricing } = course;
  const { isAdmin } = useIsAdmin();
  const hasDiscount =
    pricing.discountPercent > 0 && pricing.originalPrice > pricing.price;

  return (
    <motion.aside
      {...courseFadeUp}
      className="w-full rounded-[16px] border border-[#E9EEF3] bg-white p-3.5 shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:rounded-[18px] sm:p-4 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:overflow-y-auto lg:overscroll-contain"
    >
      <button
        type="button"
        aria-label={`Play preview for ${course.title}`}
        className="group relative aspect-[16/9] w-full overflow-hidden rounded-[12px] bg-[#F3F4F6] sm:max-h-[160px]"
      >
        <Image
          src={course.previewImage}
          alt={`${course.title} preview`}
          fill
          sizes="(max-width: 1024px) 100vw, 340px"
          quality={65}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized={isRemoteImage(course.previewImage)}
        />
        <div className="absolute inset-0 bg-black/25" />
        <span className="absolute left-1/2 top-1/2 inline-flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white shadow-lg backdrop-blur-md transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
          <Play size={16} fill="currentColor" aria-hidden />
        </span>
      </button>

      <div className="mt-3 sm:mt-3.5">
        <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
          <p className="font-sans text-[24px] font-bold leading-none text-[#111111] sm:text-[26px]">
            {pricing.currency}
            {pricing.price.toLocaleString("en-IN")}
          </p>
          {hasDiscount ? (
            <>
              <p className="font-sans text-[12px] text-[#9CA3AF] line-through sm:text-[13px]">
                {pricing.currency}
                {pricing.originalPrice.toLocaleString("en-IN")}
              </p>
              <span className="rounded-full bg-[#FFF1E8] px-2 py-0.5 font-sans text-[10px] font-semibold text-[#FF6A00] sm:text-[11px]">
                {pricing.discountPercent}% off
              </span>
            </>
          ) : null}
        </div>
        {pricing.offerLabel ? (
          <p className="mt-1.5 font-sans text-[12px] font-medium text-[#0DA694]">
            {pricing.offerLabel}
          </p>
        ) : null}
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:mt-3.5">
        <motion.div whileHover={{ y: -1, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <CourseEnrollCta
            courseId={course.id}
            slug={course.slug}
            hasAccess={hasAccess}
            ready={accessReady}
            comingSoon={Boolean(course.comingSoon)}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#11C5BB] px-5 font-sans text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(17,197,187,0.3)] transition-colors hover:bg-[#0fb0a7] sm:h-10"
          />
        </motion.div>
        {/* {hasAccess || isAdmin ? null : (
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E9EEF3] bg-white font-sans text-[13px] font-semibold text-[#111111] transition-colors hover:border-brand-teal/40 sm:h-10"
          >
            <ShoppingCart size={15} aria-hidden />
            Add to Cart
          </motion.button>
        )} */}
      </div>

      <ul className="mt-3 grid grid-cols-1 gap-2 border-t border-[#E9EEF3] pt-3 sm:mt-3.5 sm:space-y-0 sm:pt-3.5">
        {course.features.map((feature) => {
          const Icon = iconMap[feature.icon] ?? ShieldCheck;
          return (
            <li
              key={feature.label}
              className="flex items-center gap-2.5 font-sans text-[12px] text-[#4B5563] sm:text-[13px]"
            >
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#E6F8F5] text-[#0DA694]">
                <Icon size={13} aria-hidden />
              </span>
              {feature.label}
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-center font-sans text-[11px] leading-4 text-[#9CA3AF]">
        Secure checkout · Cards, PayPal & Net Banking
      </p>
    </motion.aside>
  );
}
